const DRIVER_API = "";
const DRIVER_SCHOOL_ID = "anps";
const DRIVER_SEND_INTERVAL_MS = 5000;

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
    `<option value="${escapeDriverHtml(vehicle.vehicle_id)}">${escapeDriverHtml(vehicle.vehicle_name)} · ${escapeDriverHtml(vehicle.route_name || "No route")}</option>`
  )).join("");
  updateSelectedDriverReadout();
}

function updateSelectedDriverReadout() {
  const vehicle = selectedDriverVehicle();
  driverElement("gpsBus").textContent = vehicle ? vehicle.vehicle_name : "-";
}

async function loadDriverVehicles() {
  const response = await fetch(`${DRIVER_API}/api/office/summary?school_id=${encodeURIComponent(DRIVER_SCHOOL_ID)}`);
  const data = await response.json();
  if (!response.ok || !data.ok) throw new Error(data.error || "Unable to load vehicles");
  driverVehicles = (data.vehicles || []).filter((vehicle) => vehicle.route_id && vehicle.driver_id);
  if (!driverVehicles.length) throw new Error("No assigned bus, route and driver found");
  renderDriverSelection();
  setDriverMessage("Select the bus, enter the trip token, then start tracking.");
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
  const token = driverElement("driverToken").value.trim();
  if (!token) throw new Error("Driver GPS token is required");
  driverSending = true;
  try {
    const response = await fetch(`${DRIVER_API}/api/driver/location`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
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

function startDriverTrip() {
  if (driverWatchId != null) return;
  if (!window.isSecureContext) {
    setDriverMessage("GPS requires HTTPS. Localhost is allowed for testing.", true);
    return;
  }
  if (!navigator.geolocation) {
    setDriverMessage("This phone does not support GPS tracking.", true);
    return;
  }
  if (!driverElement("driverToken").value.trim()) {
    setDriverMessage("Enter the Driver GPS token first.", true);
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
  driverElement("driverToken").disabled = true;
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
  driverElement("driverToken").disabled = false;
}

function escapeDriverHtml(value) {
  return String(value || "").replace(/[&<>'"]/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;",
  })[character]);
}

driverElement("driverVehicle").addEventListener("change", updateSelectedDriverReadout);
driverElement("startTripBtn").addEventListener("click", startDriverTrip);
driverElement("stopTripBtn").addEventListener("click", stopDriverTrip);
window.addEventListener("pagehide", () => {
  if (driverWatchId != null) navigator.geolocation.clearWatch(driverWatchId);
});
loadDriverVehicles().catch((error) => setDriverMessage(error.message, true));
