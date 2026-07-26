const DRIVER_API = "";
const DRIVER_SCHOOL_ID = "anps";
const DRIVER_SEND_INTERVAL_MS = 5000;
const DRIVER_LINK_QUERY = window.location.search || "";
const DRIVER_SESSION_KEY = "anpsSmartBusDriverSession";

const driverElement = (id) => document.getElementById(id);
let driverVehicles = [];
let driverWatchId = null;
let driverLastPosition = null;
let driverLastSentAt = 0;
let driverSending = false;

function setDriverMessage(message, isError = false) {
  const element = driverElement("driverMessage");
  element.textContent = message;
  element.classList.toggle("driver-error", isError);
}

function selectedDriverVehicle() {
  return driverVehicles.find((vehicle) => vehicle.vehicle_id === driverElement("driverVehicle").value);
}

function renderDriverSelection() {
  const select = driverElement("driverVehicle");
  select.innerHTML = driverVehicles.map((vehicle) => (
    `<option value="${escapeDriverHtml(vehicle.vehicle_id)}">${escapeDriverHtml(vehicle.route_name || "No route")} · ${escapeDriverHtml(vehicle.vehicle_name)}${vehicle.driver_name ? ` · ${escapeDriverHtml(vehicle.driver_name)}` : ""}</option>`
  )).join("");
  updateSelectedDriverReadout();
}

function updateSelectedDriverReadout() {
  const vehicle = selectedDriverVehicle();
  driverElement("gpsBus").textContent = vehicle ? vehicle.vehicle_name : "-";
}

function driverSession() {
  return sessionStorage.getItem(DRIVER_SESSION_KEY) || "";
}

async function ensureDriverSession() {
  if (DRIVER_LINK_QUERY.includes("sig=")) return "";
  const existing = driverSession();
  if (existing) return existing;
  const pin = driverElement("driverPin").value.trim();
  if (!pin) throw new Error("Driver PIN দিন, তারপর Login & Load Routes চাপুন.");
  const response = await fetch(`${DRIVER_API}/api/driver/login`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({pin}),
  });
  const data = await response.json();
  if (!response.ok || !data.ok || !data.driver_session) throw new Error(data.error || "Driver login failed.");
  sessionStorage.setItem(DRIVER_SESSION_KEY, data.driver_session);
  return data.driver_session;
}

async function driverQuery() {
  if (DRIVER_LINK_QUERY.includes("sig=")) return DRIVER_LINK_QUERY;
  const session = await ensureDriverSession();
  return `?driver_session=${encodeURIComponent(session)}`;
}

async function loadDriverVehicles() {
  const query = await driverQuery();
  const separator = query.includes("?") ? "&" : "?";
  const response = await fetch(`${DRIVER_API}/api/driver/vehicles${query}${separator}school_id=${encodeURIComponent(DRIVER_SCHOOL_ID)}`);
  const data = await response.json();
  if (!response.ok || !data.ok) throw new Error(data.error || "Unable to load vehicles");
  driverVehicles = (data.vehicles || [])
    .filter((vehicle) => vehicle.vehicle_id && vehicle.vehicle_name)
    .map((vehicle) => ({
      ...vehicle,
      route_id: vehicle.route_id || `route-${String(vehicle.route_name || vehicle.vehicle_name).toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
      driver_id: vehicle.driver_id || `driver-${String(vehicle.mobile || vehicle.driver_name || vehicle.vehicle_name).toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
    }));
  if (!driverVehicles.length) throw new Error("No assigned bus, route and driver found. Sync route, vehicle and driver from ERP first.");
  renderDriverSelection();
  setDriverMessage("Route/bus select করুন, তারপর Start Trip চাপুন.");
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
    const response = await fetch(`${DRIVER_API}/api/driver/location${query}${separator}school_id=${encodeURIComponent(DRIVER_SCHOOL_ID)}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(driverPayload(position, status)),
    });
    const data = await response.json();
    if (!response.ok || !data.ok) throw new Error(data.error || "Location update failed");
    driverLastSentAt = Date.now();
    driverElement("gpsSent").textContent = "Just now";
    setDriverMessage(status === "offline" ? "Trip stopped. GPS sharing is off." : "Live location sent successfully.");
  } finally {
    driverSending = false;
  }
}

function showDriverPosition(position) {
  driverLastPosition = position;
  const speedKmph = position.coords.speed == null ? 0 : Math.max(0, position.coords.speed * 3.6);
  driverElement("gpsStatus").textContent = "Tracking";
  driverElement("gpsLat").textContent = position.coords.latitude.toFixed(6);
  driverElement("gpsLng").textContent = position.coords.longitude.toFixed(6);
  driverElement("gpsSpeed").textContent = `${speedKmph.toFixed(1)} km/h`;
  driverElement("gpsAccuracy").textContent = `${Math.round(position.coords.accuracy)} m`;
  sendDriverPosition(position).catch((error) => setDriverMessage(error.message, true));
}

function handleDriverGpsError(error) {
  const messages = {
    1: "Location permission was denied.",
    2: "GPS position is unavailable.",
    3: "GPS request timed out.",
  };
  setDriverMessage(messages[error.code] || error.message || "GPS error", true);
  driverElement("gpsStatus").textContent = "GPS error";
}

async function startDriverTrip() {
  if (driverWatchId != null) return;
  if (!window.isSecureContext) {
    setDriverMessage("GPS requires HTTPS. Localhost is allowed for testing.", true);
    return;
  }
  if (!navigator.geolocation) {
    setDriverMessage("This phone does not support GPS tracking.", true);
    return;
  }
  if (!driverVehicles.length) {
    try {
      await loadDriverVehicles();
    } catch (error) {
      setDriverMessage(error.message, true);
      return;
    }
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
  driverElement("gpsStatus").textContent = "Waiting for GPS";
  setDriverMessage("Allow location permission to start the trip.");
  driverWatchId = navigator.geolocation.watchPosition(showDriverPosition, handleDriverGpsError, {
    enableHighAccuracy: true,
    maximumAge: 3000,
    timeout: 15000,
  });
}

async function stopDriverTrip() {
  if (driverWatchId != null) navigator.geolocation.clearWatch(driverWatchId);
  driverWatchId = null;
  if (driverLastPosition) {
    try {
      await sendDriverPosition(driverLastPosition, "offline", true);
    } catch (error) {
      setDriverMessage(`GPS stopped, but final update failed: ${error.message}`, true);
    }
  } else {
    setDriverMessage("Trip stopped before a GPS position was received.");
  }
  driverElement("gpsStatus").textContent = "Stopped";
  driverElement("startTripBtn").disabled = false;
  driverElement("stopTripBtn").disabled = true;
  driverElement("driverVehicle").disabled = false;
  driverElement("driverTripType").disabled = false;
  driverElement("driverPin").disabled = false;
}

function escapeDriverHtml(value) {
  return String(value || "").replace(/[&<>'"]/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;",
  })[character]);
}

driverElement("driverVehicle").addEventListener("change", updateSelectedDriverReadout);
driverElement("loadDriverVehiclesBtn").addEventListener("click", () => loadDriverVehicles().catch((error) => setDriverMessage(error.message, true)));
driverElement("startTripBtn").addEventListener("click", () => startDriverTrip().catch((error) => setDriverMessage(error.message, true)));
driverElement("stopTripBtn").addEventListener("click", stopDriverTrip);
window.addEventListener("pagehide", () => {
  if (driverWatchId != null) navigator.geolocation.clearWatch(driverWatchId);
});
if (DRIVER_LINK_QUERY.includes("sig=") || driverSession()) {
  loadDriverVehicles().catch((error) => setDriverMessage(error.message, true));
}
