const API = "";
const SCHOOL_ID = "anps";
const OFFICE_CACHE_KEY = "anpsSmartBusOfficeSummary";
const busSvg = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 84 150'%3E%3Cdefs%3E%3ClinearGradient id='roof' x1='0' x2='1' y1='0' y2='1'%3E%3Cstop offset='0' stop-color='%23ffe58a'/%3E%3Cstop offset='.55' stop-color='%23f6c23e'/%3E%3Cstop offset='1' stop-color='%23cc8b0b'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect x='15' y='8' width='54' height='132' rx='14' fill='url(%23roof)' stroke='%231f2937' stroke-width='3.5'/%3E%3Cpath d='M23 23h38v25H23zM22 101h40v22H22z' fill='%239ad7ef' stroke='%231f2937' stroke-width='2.5'/%3E%3Cpath d='M21 55h42M21 70h42M21 85h42' stroke='%23b67808' stroke-width='4'/%3E%3Crect x='10' y='38' width='7' height='24' rx='3' fill='%231f2937'/%3E%3Crect x='67' y='38' width='7' height='24' rx='3' fill='%231f2937'/%3E%3Crect x='10' y='91' width='7' height='24' rx='3' fill='%231f2937'/%3E%3Crect x='67' y='91' width='7' height='24' rx='3' fill='%231f2937'/%3E%3C/svg%3E";

const $ = (id) => document.getElementById(id);
let selectedVehicle = "";
let lastSummary = { vehicles: [], pickup_points: [], stoppages: [] };

function ago(iso) {
  if (!iso) return "-";
  const seconds = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 1000));
  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.round(seconds / 60)}m ago`;
  return `${Math.round(seconds / 3600)}h ago`;
}

function statusClass(status, updatedAt) {
  const clean = String(status || "running").toLowerCase();
  if (clean === "no-gps") return "no-gps";
  if (!updatedAt || Date.now() - new Date(updatedAt).getTime() > 120000) return "offline";
  return clean;
}

async function apiGet(path, headers = {}) {
  const res = await fetch(`${API}${path}`, { headers });
  const data = await res.json();
  if (!data.ok) throw new Error(data.error || "API error");
  return data;
}

async function apiPost(path) {
  const res = await fetch(`${API}${path}`, { method: "POST" });
  const data = await res.json();
  if (!data.ok) throw new Error(data.error || "API error");
  return data;
}

function officeLoginUrl() {
  return `./office-login.html?next=${encodeURIComponent(`${window.location.pathname}${window.location.search}`)}`;
}

function mapSrc(vehicle) {
  if (vehicle?.lat == null || vehicle?.lng == null) return "";
  const lat = vehicle.lat;
  const lng = vehicle.lng;
  return `https://maps.google.com/maps?q=${lat},${lng}&z=16&output=embed`;
}

function setMap(vehicle) {
  const frame = $("googleMap");
  const marker = $("busMarker");
  if (!frame || !vehicle || vehicle.lat == null || vehicle.lng == null) {
    if (frame) frame.removeAttribute("src");
    if (marker) marker.innerHTML = "";
    return;
  }
  const src = mapSrc(vehicle);
  if (frame.src !== src) frame.src = src;
  if (marker) {
    marker.innerHTML = `<img src="${busSvg}" alt="${vehicle.vehicle_name}"><b>${vehicle.vehicle_name.replace("ANPS ", "")}</b>`;
    marker.style.transform = `translate(-50%,-50%) rotate(${(vehicle.heading || 0) - 90}deg)`;
  }
}

function hasGps(vehicle) {
  return Number.isFinite(Number(vehicle?.lat)) && Number.isFinite(Number(vehicle?.lng));
}

function projectPoint(lat, lng, zoom) {
  const scale = 256 * (2 ** zoom);
  const sinLat = Math.sin((Number(lat) * Math.PI) / 180);
  return {
    x: ((Number(lng) + 180) / 360) * scale,
    y: (0.5 - Math.log((1 + sinLat) / (1 - sinLat)) / (4 * Math.PI)) * scale,
  };
}

function chooseMapZoom(vehicles, width, height) {
  if (vehicles.length <= 1) return 15;
  for (let zoom = 16; zoom >= 9; zoom -= 1) {
    const points = vehicles.map((vehicle) => projectPoint(vehicle.lat, vehicle.lng, zoom));
    const xs = points.map((point) => point.x);
    const ys = points.map((point) => point.y);
    if ((Math.max(...xs) - Math.min(...xs)) < width * 0.72 && (Math.max(...ys) - Math.min(...ys)) < height * 0.72) {
      return zoom;
    }
  }
  return 9;
}

function setMultiBusMap(vehicles, selected) {
  const map = $("googleMap");
  if (!map) return;
  const gpsVehicles = vehicles.filter(hasGps);
  if (!gpsVehicles.length) {
    map.innerHTML = `<div class="map-empty"><strong>No live GPS yet</strong><span>Driver mobile theke GPS start korle 11 ta bus marker ei map-e ek sathe dekha jabe.</span></div>`;
    return;
  }
  const width = Math.max(map.clientWidth || 900, 320);
  const height = Math.max(map.clientHeight || 540, 320);
  const selectedGps = selected && hasGps(selected) ? selected : gpsVehicles[0];
  const zoom = chooseMapZoom(gpsVehicles, width, height);
  const center = projectPoint(selectedGps.lat, selectedGps.lng, zoom);
  const topLeft = { x: center.x - width / 2, y: center.y - height / 2 };
  const markers = gpsVehicles.map((vehicle) => {
    const point = projectPoint(vehicle.lat, vehicle.lng, zoom);
    const isActive = vehicle.vehicle_id === selected?.vehicle_id;
    return `<button class="map-bus-marker ${isActive ? "active" : ""}" data-vehicle="${vehicle.vehicle_id}" style="left:${Math.round(point.x - topLeft.x)}px;top:${Math.round(point.y - topLeft.y)}px" title="${vehicle.vehicle_name}">
      <img src="${busSvg}" alt="">
      <span>${vehicle.vehicle_name}</span>
    </button>`;
  }).join("");
  map.innerHTML = `<div class="map-grid-bg"></div>${markers}<div class="map-attribution">Private live view | ${gpsVehicles.length} live bus${gpsVehicles.length === 1 ? "" : "es"}</div>`;
  map.querySelectorAll("[data-vehicle]").forEach((marker) => {
    marker.onclick = () => {
      selectedVehicle = marker.dataset.vehicle;
      renderOffice("map");
    };
  });
}

function renderOffice(kind = "map") {
  const vehicles = lastSummary.vehicles || [];
  if (!vehicles.length) {
    selectedVehicle = "";
    if ($("activeCount")) $("activeCount").textContent = "0";
    if ($("avgSpeed")) $("avgSpeed").textContent = "0 km/h";
    if ($("selectedBus")) $("selectedBus").textContent = "No real bus data";
    if ($("lastSeen")) $("lastSeen").textContent = "-";
    if ($("vehicleList")) $("vehicleList").innerHTML = `<div class="empty">No real bus data synced yet.</div>`;
    if ($("details")) $("details").innerHTML = `<div class="empty">Sync bus master data from ERP and start driver GPS to show live vehicles here.</div>`;
    if (kind === "map") setMultiBusMap([], null);
    else setMap(null);
    if (kind === "stoppage") renderStoppageTable();
    else renderEmptyTable(kind);
    return;
  }
  if (!selectedVehicle && vehicles[0]) selectedVehicle = vehicles[0].vehicle_id;
  const selected = vehicles.find((v) => v.vehicle_id === selectedVehicle) || vehicles[0];
  const active = vehicles.filter((v) => !["offline", "no-gps"].includes(statusClass(v.status, v.location_updated_at)));
  if ($("activeCount")) $("activeCount").textContent = active.length;
  if ($("avgSpeed")) $("avgSpeed").textContent = `${Math.round(active.reduce((n, v) => n + Number(v.speed_kmph || 0), 0) / (active.length || 1))} km/h`;
  if ($("selectedBus")) $("selectedBus").textContent = selected?.vehicle_name || "-";
  if ($("lastSeen")) $("lastSeen").textContent = ago(selected?.location_updated_at);
  if ($("vehicleList")) {
    $("vehicleList").innerHTML = `
      <div class="vehicle-list-head"><span>Vehicles</span><strong>${vehicles.length}</strong></div>
      ${vehicles.map((v) => {
        const status = statusClass(v.status, v.location_updated_at);
        return `<button class="item ${v.vehicle_id === selectedVehicle ? "active" : ""}" data-vehicle="${v.vehicle_id}">
          <span class="item-title"><strong>${v.vehicle_name}</strong><em class="status ${status}">${status}</em></span>
          <small>${v.route_name || "-"}</small>
          <small>${v.driver_name || "-"}${v.vehicle_no ? ` | ${v.vehicle_no}` : ""}</small>
        </button>`;
      }).join("")}`;
    document.querySelectorAll("[data-vehicle]").forEach((btn) => {
      btn.onclick = () => {
        selectedVehicle = btn.dataset.vehicle;
        renderOffice(kind);
      };
    });
  }
  if ($("details") && selected) {
    $("details").innerHTML = [
      ["Vehicle", `${selected.vehicle_name} (${selected.vehicle_no})`],
      ["Route", selected.route_name || "-"],
      ["Driver", `${selected.driver_name || "-"} ${selected.mobile ? `(${selected.mobile})` : ""}`],
      ["Trip Type", selected.trip_type || "-"],
      ["Speed", `${selected.speed_kmph || 0} km/h`],
      ["Status", selected.status || "-"],
      ["ETA", `${selected.estimated_arrival_min || 0} min`],
      ["Last Update", ago(selected.location_updated_at)],
    ].map(([a, b]) => `<article><span>${a}</span><strong>${b}</strong></article>`).join("");
  }
  if (kind === "map") setMultiBusMap(vehicles, selected);
  else setMap(selected);
  if (kind === "route") renderRouteTable(vehicles);
  if (kind === "driver") renderDriverTable(vehicles);
  if (kind === "stoppage") renderStoppageTable();
  if (kind === "map") renderBusTable(vehicles);
}

function renderBusTable(vehicles) {
  if (!$("dataTable")) return;
  if (!vehicles.length) return renderEmptyTable("map");
  $("dataTable").innerHTML = vehicles.map((v) => `<tr><td>${v.vehicle_name}</td><td>${v.route_name || "-"}</td><td>${v.speed_kmph || 0} km/h</td><td>${v.lat ? `${Number(v.lat).toFixed(5)}, ${Number(v.lng).toFixed(5)}` : "-"}</td><td>${ago(v.location_updated_at)}</td><td><span class="status ${statusClass(v.status, v.location_updated_at)}">${statusClass(v.status, v.location_updated_at)}</span></td></tr>`).join("");
}

function renderRouteTable(vehicles) {
  if (!vehicles.length) return renderEmptyTable("route");
  $("dataTable").innerHTML = vehicles.map((v) => `<tr><td>${v.route_name || "-"}</td><td>${v.vehicle_name}</td><td>${v.trip_type || "-"}</td><td>${v.estimated_arrival_min || 0} min</td><td><span class="status ${statusClass(v.status, v.location_updated_at)}">${v.status || "running"}</span></td></tr>`).join("");
}

function renderDriverTable(vehicles) {
  if (!vehicles.length) return renderEmptyTable("driver");
  $("dataTable").innerHTML = vehicles.map((v) => `<tr><td>${v.driver_name || "-"}</td><td>${v.mobile || "-"}</td><td>${v.vehicle_name}</td><td>${v.vehicle_no}</td><td>${ago(v.location_updated_at)}</td><td><span class="status ${statusClass(v.status, v.location_updated_at)}">${statusClass(v.status, v.location_updated_at)}</span></td></tr>`).join("");
}

function renderStoppageTable() {
  const rows = lastSummary.stoppages || [];
  $("dataTable").innerHTML = rows.length ? rows.map((s) => `<tr><td>${s.vehicle_id}</td><td>${s.route_id}</td><td>${s.stop_name}</td><td>${Math.round((s.duration_seconds || 0) / 60)} min</td><td>${s.started_at}</td><td>${s.ended_at || "Standing"}</td></tr>`).join("") : `<tr><td colspan="6">No stoppage alert now</td></tr>`;
}

function renderEmptyTable(kind) {
  if (!$("dataTable")) return;
  const spans = { map: 6, route: 5, driver: 6, stoppage: 6 };
  $("dataTable").innerHTML = `<tr><td colspan="${spans[kind] || 6}">No real bus data synced yet.</td></tr>`;
}

async function loadOffice(kind = "map") {
  const params = new URLSearchParams(window.location.search);
  params.set("school_id", params.get("school_id") || SCHOOL_ID);
  lastSummary = await apiGet(`/api/office/summary?${params.toString()}`);
  localStorage.setItem(OFFICE_CACHE_KEY, JSON.stringify({
    saved_at: new Date().toISOString(),
    summary: lastSummary,
  }));
  renderOffice(kind);
}

function showOfficeError(error, kind = "map") {
  const message = error?.message || "Smart Bus data refresh failed.";
  const cached = JSON.parse(localStorage.getItem(OFFICE_CACHE_KEY) || "null");
  if (cached?.summary?.vehicles?.length) {
    lastSummary = cached.summary;
    renderOffice(kind);
    if ($("details")) {
      $("details").insertAdjacentHTML("afterbegin", `<div class="empty cache-note">${message}. Showing last loaded vehicle cards from this browser.</div>`);
    }
    if ($("selectedBus")) $("selectedBus").textContent = "Cached vehicle data";
    if ($("lastSeen")) $("lastSeen").textContent = cached.saved_at ? ago(cached.saved_at) : "-";
    return;
  }
  if ($("details")) {
    const needsLogin = /Unauthorized|login required|expired/i.test(message);
    $("details").innerHTML = `<div class="empty">${message}. ${needsLogin ? `<a class="ghost login-link" href="${officeLoginUrl()}">Office Login</a>` : "Reopen this dashboard from ERP if the secured link has expired."}</div>`;
  }
  if ($("selectedBus")) $("selectedBus").textContent = "Refresh failed";
  if ($("lastSeen")) $("lastSeen").textContent = "-";
}

function bootOffice(kind) {
  preserveOfficeLinks();
  loadOffice(kind).catch((error) => showOfficeError(error, kind));
  const refresh = $("refreshBtn");
  if (refresh) {
    refresh.onclick = async () => {
      const originalText = refresh.textContent;
      refresh.disabled = true;
      refresh.textContent = "Refreshing...";
      try {
        await loadOffice(kind);
      } catch (error) {
        showOfficeError(error, kind);
      } finally {
        refresh.disabled = false;
        refresh.textContent = originalText;
      }
    };
  }
  const demo = $("demoBtn");
  if (demo) demo.remove();
  setInterval(() => loadOffice(kind).catch(() => {}), 10000);
}

function preserveOfficeLinks() {
  const query = window.location.search;
  if (!query) return;
  document.querySelectorAll('a[href^="./office-"]').forEach((link) => {
    const url = new URL(link.getAttribute("href"), window.location.href);
    if (!url.search) url.search = query;
    link.href = url.pathname.split("/").pop() + url.search;
  });
}

async function loadStudent() {
  const admission = ($("admissionNo")?.value || "ANPS001").trim();
  const signedParams = new URLSearchParams(window.location.search);
  signedParams.set("school_id", signedParams.get("school_id") || SCHOOL_ID);
  signedParams.set("admission_no", admission);
  const data = await apiGet(`/api/student/bus-location?${signedParams.toString()}`);
  const bus = data.student_bus;
  const frame = $("studentMap");
  const src = mapSrc(bus);
  if (frame) {
    if (src) frame.src = src;
    else frame.removeAttribute("src");
  }
  $("studentBus").innerHTML = `
    <div class="student-card">
      <div class="student-row"><span>Status</span><strong class="status ${statusClass(bus.status, bus.location_updated_at)}">${bus.status || "running"}</strong></div>
      <div class="student-row"><span>Bus</span><strong>${bus.vehicle_name}</strong></div>
      <div class="student-row"><span>Route</span><strong>${bus.route_name}</strong></div>
      <div class="student-row"><span>Pickup</span><strong>${bus.pickup_name}</strong></div>
      <div class="student-row"><span>ETA</span><strong>${bus.estimated_arrival_text}</strong></div>
      <div class="student-row"><span>Last Update</span><strong>${ago(bus.location_updated_at)}</strong></div>
    </div>`;
}

function bootStudent() {
  const params = new URLSearchParams(window.location.search);
  if (params.get("admission_no") && $("admissionNo")) $("admissionNo").value = params.get("admission_no");
  $("loadStudentBtn").onclick = () => loadStudent().catch((err) => $("studentBus").innerHTML = `<div class="empty">${err.message}</div>`);
  loadStudent().catch((err) => {
    if ($("studentBus")) {
      $("studentBus").innerHTML = `<div class="empty">${err.message || "Open Bus Location from the ANPS mobile app."}</div>`;
    }
  });
  setInterval(() => loadStudent().catch(() => {}), 15000);
}

function bootOfficeLogin() {
  const form = $("officeLoginForm");
  const pin = $("officePin");
  const status = $("officeLoginStatus");
  const params = new URLSearchParams(window.location.search);
  const next = params.get("next") || "./office-live-map.html";
  if (!form || !pin) return;
  form.onsubmit = async (event) => {
    event.preventDefault();
    if (status) status.textContent = "Checking PIN...";
    try {
      const res = await fetch("/api/office/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin: pin.value.trim() }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data.ok === false) throw new Error(data.error || "Office login failed.");
      if (status) status.textContent = "Login successful. Opening dashboard...";
      window.location.href = next;
    } catch (error) {
      if (status) status.textContent = error.message || "Office login failed.";
    }
  };
}
