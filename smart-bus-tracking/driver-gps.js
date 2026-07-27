const DRIVER_API = "";
const DRIVER_API_BASE = window.location.protocol === "file:"
  ? "https://anpsbus.thebrainerp.com"
  : window.location.origin;
const DRIVER_SCHOOL_ID = "anps";
const DRIVER_SEND_INTERVAL_MS = 3000;
const DRIVER_LINK_QUERY = window.location.search || "";
const DRIVER_SESSION_KEY = "anpsSmartBusDriverSession";

const driverElement = (id) => document.getElementById(id);
let driverVehicles = [];
let driverWatchId = null;
let driverLastPosition = null;
let driverLastSentAt = 0;
let driverSending = false;
let driverTripActive = false;
let driverWakeLock = null;
let driverAutoLoadTimer = null;
let driverRoutesLoading = false;
let driverWatchMode = "high";

const highAccuracyOptions = {
  enableHighAccuracy: true,
  maximumAge: 10000,
  timeout: 30000,
};

const fallbackAccuracyOptions = {
  enableHighAccuracy: false,
  maximumAge: 30000,
  timeout: 45000,
};

function setDriverMessage(message, isError = false) {
  const element = driverElement("driverMessage");
  element.textContent = message;
  element.classList.toggle("driver-error", isError);
}

function setGpsConnectionStatus(status, label) {
  const element = driverElement("gpsConnection");
  if (!element) return;
  element.className = `gps-connection is-${status}`;
  const text = element.querySelector("strong");
  if (text) text.textContent = label;
}

function driverApiUrl(path) {
  return `${DRIVER_API || DRIVER_API_BASE}${path}`;
}

async function readDriverJson(response) {
  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch {
    const status = response.status ? ` (${response.status})` : "";
    throw new Error(`Server JSON দেয়নি${status}. App reload kore abar try korun.`);
  }
}

function selectedDriverVehicle() {
  return driverVehicles.find((vehicle) => vehicle.vehicle_id === driverElement("driverVehicle").value);
}

function renderDriverSelection() {
  const select = driverElement("driverVehicle");
  select.innerHTML = driverVehicles.map((vehicle) => (
    `<option value="${escapeDriverHtml(vehicle.vehicle_id)}">Route: ${escapeDriverHtml(vehicle.route_name || "No route assigned")} | Bus: ${escapeDriverHtml(vehicle.vehicle_name)}${vehicle.driver_name ? ` | Driver: ${escapeDriverHtml(vehicle.driver_name)}` : ""}</option>`
  )).join("");
  updateSelectedDriverReadout();
}

function updateSelectedDriverReadout() {
  const vehicle = selectedDriverVehicle();
  driverElement("gpsBus").textContent = vehicle ? vehicle.vehicle_name : "-";
  const preview = driverElement("driverRoutePreview");
  if (!preview) return;
  preview.innerHTML = vehicle
    ? `<strong>${escapeDriverHtml(vehicle.route_name || "No route assigned")}</strong><span>${escapeDriverHtml(vehicle.vehicle_name)}${vehicle.driver_name ? ` · ${escapeDriverHtml(vehicle.driver_name)}` : ""}</span>`
    : "Route will show after loading.";
}

function driverSession() {
  return sessionStorage.getItem(DRIVER_SESSION_KEY) || "";
}

async function ensureDriverSession() {
  if (DRIVER_LINK_QUERY.includes("sig=")) return "";
  const existing = driverSession();
  if (existing) return existing;
  const pin = driverElement("driverPin").value.trim();
  if (!pin) throw new Error("Driver code দিন, তারপর Load Bus Routes চাপুন.");
  const response = await fetch(driverApiUrl("/api/driver/login"), {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({pin}),
    cache: "no-store",
  });
  const data = await readDriverJson(response);
  if (!response.ok || !data.ok || !data.driver_session) throw new Error(data.error || "Driver code login failed.");
  sessionStorage.setItem(DRIVER_SESSION_KEY, data.driver_session);
  return data.driver_session;
}

async function driverQuery() {
  if (DRIVER_LINK_QUERY.includes("sig=")) return DRIVER_LINK_QUERY;
  const session = await ensureDriverSession();
  return `?driver_session=${encodeURIComponent(session)}`;
}

async function loadDriverVehicles() {
  if (driverRoutesLoading) return;
  const loadButton = driverElement("loadDriverVehiclesBtn");
  driverRoutesLoading = true;
  if (loadButton) {
    loadButton.disabled = true;
    loadButton.textContent = "Loading Routes...";
  }
  driverElement("startTripBtn").disabled = true;
  try {
    const query = await driverQuery();
    const separator = query.includes("?") ? "&" : "?";
    const response = await fetch(driverApiUrl(`/api/driver/vehicles${query}${separator}school_id=${encodeURIComponent(DRIVER_SCHOOL_ID)}`), { cache: "no-store" });
    const data = await readDriverJson(response);
    if (!response.ok || !data.ok) {
      if (response.status === 401 || response.status === 403) sessionStorage.removeItem(DRIVER_SESSION_KEY);
      throw new Error(data.error || "Unable to load vehicles");
    }
    driverVehicles = (data.vehicles || [])
      .filter((vehicle) => vehicle.vehicle_id && vehicle.vehicle_name)
      .map((vehicle) => ({
        ...vehicle,
        route_id: vehicle.route_id || `route-${String(vehicle.route_name || vehicle.vehicle_name).toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
        driver_id: vehicle.driver_id || `driver-${String(vehicle.mobile || vehicle.driver_name || vehicle.vehicle_name).toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
      }));
    if (!driverVehicles.length) throw new Error("No assigned bus, route and driver found. Sync route, vehicle and driver from ERP first.");
    renderDriverSelection();
    driverElement("startTripBtn").disabled = false;
    setDriverMessage("Route loaded. GPS check হচ্ছে...");
    primeDriverGps();
  } finally {
    driverRoutesLoading = false;
    if (loadButton) {
      loadButton.disabled = false;
      loadButton.textContent = "Load Bus Routes";
    }
  }
}

function driverPayload(position, status = "running") {
  const vehicle = selectedDriverVehicle();
  if (!vehicle) throw new Error("Select an assigned bus");
  const speedKmph = position.coords.speed == null ? 0 : Math.max(0, position.coords.speed * 3.6);
  return {
    school_id: DRIVER_SCHOOL_ID,
    vehicle_id: vehicle.vehicle_id,
    route_id: vehicle.route_id,
    driver_id: vehicle.driver_id,
    trip_type: driverElement("driverTripType").value,
    lat: position.coords.latitude,
    lng: position.coords.longitude,
    speed_kmph: Number(speedKmph.toFixed(1)),
    heading: position.coords.heading == null ? 0 : position.coords.heading,
    accuracy_m: Number(position.coords.accuracy || 0),
    status,
    estimated_arrival_min: Number(vehicle.estimated_arrival_min || 0),
  };
}

function driverBasePayload(status = "running") {
  const vehicle = selectedDriverVehicle();
  if (!vehicle) throw new Error("Select an assigned bus");
  return {
    school_id: DRIVER_SCHOOL_ID,
    vehicle_id: vehicle.vehicle_id,
    route_id: vehicle.route_id,
    driver_id: vehicle.driver_id,
    trip_type: driverElement("driverTripType").value,
    status,
    estimated_arrival_min: Number(vehicle.estimated_arrival_min || 0),
  };
}

async function sendDriverPosition(position, status = "running", force = false) {
  const now = Date.now();
  if (!force && (driverSending || now - driverLastSentAt < DRIVER_SEND_INTERVAL_MS)) return;
  driverSending = true;
  try {
    const query = await driverQuery();
    const separator = query.includes("?") ? "&" : "?";
    const response = await fetch(driverApiUrl(`/api/driver/location${query}${separator}school_id=${encodeURIComponent(DRIVER_SCHOOL_ID)}`), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(driverPayload(position, status)),
      cache: "no-store",
    });
    const data = await readDriverJson(response);
    if (!response.ok || !data.ok) throw new Error(data.error || "Location update failed");
    if (data.accepted === false) {
      setDriverMessage(data.error || "GPS accuracy low. Open sky-te phone rakhun.", true);
      return;
    }
    driverLastSentAt = Date.now();
    driverElement("gpsSent").textContent = "Just now";
    setDriverMessage(status === "offline" ? "Trip stopped. GPS sharing is off." : "Live location sent successfully.");
  } finally {
    driverSending = false;
  }
}

async function sendDriverTripStatus(status = "running") {
  const vehicle = selectedDriverVehicle();
  if (!vehicle) throw new Error("Select an assigned bus");
  const query = await driverQuery();
  const separator = query.includes("?") ? "&" : "?";
  const response = await fetch(driverApiUrl(`/api/driver/trip-status${query}${separator}school_id=${encodeURIComponent(DRIVER_SCHOOL_ID)}`), {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
      school_id: DRIVER_SCHOOL_ID,
      vehicle_id: vehicle.vehicle_id,
      route_id: vehicle.route_id,
      driver_id: vehicle.driver_id,
      trip_type: driverElement("driverTripType").value,
      status,
      estimated_arrival_min: Number(vehicle.estimated_arrival_min || 0),
    }),
    cache: "no-store",
  });
  const data = await readDriverJson(response);
  if (!response.ok || !data.ok) throw new Error(data.error || "Trip status update failed");
  driverLastSentAt = Date.now();
  driverElement("gpsSent").textContent = "Just now";
}

function hasNativeBackgroundGps() {
  try {
    return !!window.AnpsDriverNative?.hasNativeBackgroundGps?.();
  } catch {
    return false;
  }
}

async function startNativeBackgroundGps() {
  if (!hasNativeBackgroundGps()) return false;
  const query = await driverQuery();
  const separator = query.includes("?") ? "&" : "?";
  const endpoint = driverApiUrl(`/api/driver/location${query}${separator}school_id=${encodeURIComponent(DRIVER_SCHOOL_ID)}`);
  window.AnpsDriverNative.startTracking(endpoint, JSON.stringify(driverBasePayload("running")));
  return true;
}

function stopNativeBackgroundGps() {
  try {
    window.AnpsDriverNative?.stopTracking?.();
  } catch {}
}

function showDriverPosition(position) {
  driverLastPosition = position;
  const speedKmph = position.coords.speed == null ? 0 : Math.max(0, position.coords.speed * 3.6);
  driverElement("gpsStatus").textContent = "Tracking";
  setGpsConnectionStatus("connected", "GPS connected");
  driverElement("gpsLat").textContent = position.coords.latitude.toFixed(6);
  driverElement("gpsLng").textContent = position.coords.longitude.toFixed(6);
  driverElement("gpsSpeed").textContent = `${speedKmph.toFixed(1)} km/h`;
  driverElement("gpsAccuracy").textContent = `${Math.round(position.coords.accuracy)} m`;
  sendDriverPosition(position).catch((error) => setDriverMessage(error.message, true));
}

function handleDriverGpsError(error) {
  const messages = {
    1: "Location permission blocked. Phone settings theke Location allow korun.",
    2: "GPS position unavailable. Location mode High accuracy korun, ba open sky-te phone rakhun.",
    3: "GPS first fix time নিচ্ছে. আরেকবার চেষ্টা করছি...",
  };
  if (driverTripActive && driverWatchMode === "high" && (error.code === 2 || error.code === 3)) {
    restartDriverWatchWithFallback();
    return;
  }
  setDriverMessage(messages[error.code] || error.message || "GPS error", true);
  driverElement("gpsStatus").textContent = "GPS error";
  setGpsConnectionStatus("error", "GPS not connected");
}

function restartDriverWatchWithFallback() {
  if (driverWatchId != null) navigator.geolocation.clearWatch(driverWatchId);
  driverWatchId = null;
  driverWatchMode = "fallback";
  driverElement("gpsStatus").textContent = "Connecting GPS";
  setGpsConnectionStatus("connecting", "GPS retrying...");
  setDriverMessage("GPS signal time নিচ্ছে. Network location দিয়ে connect করার চেষ্টা হচ্ছে.");
  driverWatchId = navigator.geolocation.watchPosition(showDriverPosition, handleDriverGpsError, fallbackAccuracyOptions);
}

async function requestDriverWakeLock() {
  if (!("wakeLock" in navigator) || document.visibilityState !== "visible") return;
  try {
    driverWakeLock = await navigator.wakeLock.request("screen");
    driverWakeLock.addEventListener("release", () => {
      driverWakeLock = null;
    });
  } catch {
    driverWakeLock = null;
  }
}

async function releaseDriverWakeLock() {
  if (!driverWakeLock) return;
  try {
    await driverWakeLock.release();
  } catch {
    driverWakeLock = null;
  }
}

async function startDriverWatch() {
  if (driverWatchId != null) return;
  if (!window.isSecureContext) {
    setDriverMessage("GPS requires HTTPS. Localhost is allowed for testing.", true);
    return false;
  }
  if (!navigator.geolocation) {
    setDriverMessage("This phone does not support GPS tracking.", true);
    return false;
  }
  driverElement("gpsStatus").textContent = "Waiting for GPS";
  setGpsConnectionStatus("connecting", "Connecting GPS...");
  setDriverMessage("Location permission allow korun. GPS fix pete 10-30 sec lagte pare.");
  driverWatchMode = "high";
  driverWatchId = navigator.geolocation.watchPosition(showDriverPosition, handleDriverGpsError, highAccuracyOptions);
  await requestDriverWakeLock();
  return true;
}

async function startDriverTrip() {
  if (driverTripActive && driverWatchId != null) return;
  if (!driverVehicles.length) {
    try {
      await loadDriverVehicles();
    } catch (error) {
      setDriverMessage(error.message, true);
      return;
    }
  }
  if (!driverVehicles.length) {
    setDriverMessage("Route load হয়নি. Driver code দিয়ে আগে route load করুন.", true);
    return;
  }
  if (!selectedDriverVehicle()) {
    setDriverMessage("Select an assigned bus first.", true);
    return;
  }
  driverElement("startTripBtn").disabled = true;
  driverElement("stopTripBtn").disabled = false;
  driverElement("driverVehicle").disabled = true;
  driverElement("driverTripType").disabled = true;
  driverElement("driverPin").disabled = true;
  driverTripActive = true;
  try {
    await sendDriverTripStatus("running");
    const nativeStarted = await startNativeBackgroundGps();
    setDriverMessage(nativeStarted ? "Trip started. Background GPS service চালু আছে." : "Trip started. GPS connect হচ্ছে...");
  } catch (error) {
    driverTripActive = false;
    driverElement("startTripBtn").disabled = false;
    driverElement("stopTripBtn").disabled = true;
    driverElement("driverVehicle").disabled = false;
    driverElement("driverTripType").disabled = false;
    driverElement("driverPin").disabled = false;
    setDriverMessage(error.message, true);
    return;
  }
  const started = await startDriverWatch();
  if (!started) {
    driverTripActive = false;
    driverElement("startTripBtn").disabled = false;
    driverElement("stopTripBtn").disabled = true;
    driverElement("driverVehicle").disabled = false;
    driverElement("driverTripType").disabled = false;
    driverElement("driverPin").disabled = false;
  }
}

async function stopDriverTrip() {
  stopNativeBackgroundGps();
  if (driverWatchId != null) navigator.geolocation.clearWatch(driverWatchId);
  driverWatchId = null;
  driverWatchMode = "high";
  driverTripActive = false;
  await releaseDriverWakeLock();
  if (driverLastPosition) {
    try {
      await sendDriverPosition(driverLastPosition, "offline", true);
    } catch (error) {
      setDriverMessage(`GPS stopped, but final update failed: ${error.message}`, true);
    }
  } else {
    try {
      await sendDriverTripStatus("offline");
      setDriverMessage("Trip stopped before a GPS position was received.");
    } catch (error) {
      setDriverMessage(`Trip stopped, but final update failed: ${error.message}`, true);
    }
  }
  driverElement("gpsStatus").textContent = "Stopped";
  setGpsConnectionStatus("waiting", "GPS stopped");
  driverElement("startTripBtn").disabled = false;
  driverElement("stopTripBtn").disabled = true;
  driverElement("driverVehicle").disabled = false;
  driverElement("driverTripType").disabled = false;
  driverElement("driverPin").disabled = false;
}

function primeDriverGps() {
  if (!window.isSecureContext || !navigator.geolocation || driverWatchId != null) return;
  setGpsConnectionStatus("connecting", "Checking GPS...");
  navigator.geolocation.getCurrentPosition((position) => {
    driverLastPosition = position;
    const speedKmph = position.coords.speed == null ? 0 : Math.max(0, position.coords.speed * 3.6);
    driverElement("gpsStatus").textContent = "GPS ready";
    setGpsConnectionStatus("connected", "GPS connected");
    driverElement("gpsLat").textContent = position.coords.latitude.toFixed(6);
    driverElement("gpsLng").textContent = position.coords.longitude.toFixed(6);
    driverElement("gpsSpeed").textContent = `${speedKmph.toFixed(1)} km/h`;
    driverElement("gpsAccuracy").textContent = `${Math.round(position.coords.accuracy)} m`;
    setDriverMessage("GPS ready. Route select kore Start Trip চাপুন.");
  }, () => {
    navigator.geolocation.getCurrentPosition((position) => {
      driverLastPosition = position;
      const speedKmph = position.coords.speed == null ? 0 : Math.max(0, position.coords.speed * 3.6);
      driverElement("gpsStatus").textContent = "GPS ready";
      setGpsConnectionStatus("connected", "GPS connected");
      driverElement("gpsLat").textContent = position.coords.latitude.toFixed(6);
      driverElement("gpsLng").textContent = position.coords.longitude.toFixed(6);
      driverElement("gpsSpeed").textContent = `${speedKmph.toFixed(1)} km/h`;
      driverElement("gpsAccuracy").textContent = `${Math.round(position.coords.accuracy)} m`;
      setDriverMessage("GPS connected. Accuracy improve hote pare, Start Trip চাপুন.");
    }, handleDriverGpsError, fallbackAccuracyOptions);
  }, highAccuracyOptions);
}

function escapeDriverHtml(value) {
  return String(value || "").replace(/[&<>'"]/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;",
  })[character]);
}

driverElement("driverVehicle").addEventListener("change", updateSelectedDriverReadout);
driverElement("driverPin").addEventListener("input", () => {
  sessionStorage.removeItem(DRIVER_SESSION_KEY);
  driverVehicles = [];
  driverElement("startTripBtn").disabled = true;
  window.clearTimeout(driverAutoLoadTimer);
  const value = driverElement("driverPin").value.trim();
  if (value.length >= 4) {
    driverAutoLoadTimer = window.setTimeout(() => {
      loadDriverVehicles().catch((error) => setDriverMessage(error.message, true));
    }, 350);
  }
});
driverElement("driverPin").addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    loadDriverVehicles().catch((error) => setDriverMessage(error.message, true));
  }
});
driverElement("loadDriverVehiclesBtn").addEventListener("click", () => loadDriverVehicles().catch((error) => setDriverMessage(error.message, true)));
driverElement("startTripBtn").addEventListener("click", () => startDriverTrip().catch((error) => setDriverMessage(error.message, true)));
driverElement("stopTripBtn").addEventListener("click", stopDriverTrip);
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible" && driverTripActive) {
    requestDriverWakeLock();
    if (driverWatchId == null) startDriverWatch().catch((error) => setDriverMessage(error.message, true));
    if (driverLastPosition) sendDriverPosition(driverLastPosition, "running", true).catch((error) => setDriverMessage(error.message, true));
  }
});
window.addEventListener("focus", () => {
  if (driverTripActive && driverWatchId == null) {
    startDriverWatch().catch((error) => setDriverMessage(error.message, true));
  }
});
if (DRIVER_LINK_QUERY.includes("sig=") || driverSession()) {
  loadDriverVehicles().catch((error) => setDriverMessage(error.message, true));
}
