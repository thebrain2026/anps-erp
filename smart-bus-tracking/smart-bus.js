const API = "";
const SCHOOL_ID = "anps";
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
  if (!updatedAt || Date.now() - new Date(updatedAt).getTime() > 120000) return "offline";
  return String(status || "running").toLowerCase();
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

function mapSrc(vehicle) {
  const lat = vehicle?.lat || 22.7241;
  const lng = vehicle?.lng || 88.4867;
  return `https://maps.google.com/maps?q=${lat},${lng}&z=16&output=embed`;
}

function setMap(vehicle) {
  const frame = $("googleMap");
  if (!frame || !vehicle) return;
  const src = mapSrc(vehicle);
  if (frame.src !== src) frame.src = src;
  const marker = $("busMarker");
  if (marker) {
    marker.innerHTML = `<img src="${busSvg}" alt="${vehicle.vehicle_name}"><b>${vehicle.vehicle_name.replace("ANPS ", "")}</b>`;
    marker.style.transform = `translate(-50%,-50%) rotate(${(vehicle.heading || 0) - 90}deg)`;
  }
}

function renderOffice(kind = "map") {
  const vehicles = lastSummary.vehicles || [];
  if (!selectedVehicle && vehicles[0]) selectedVehicle = vehicles[0].vehicle_id;
  const selected = vehicles.find((v) => v.vehicle_id === selectedVehicle) || vehicles[0];
  const active = vehicles.filter((v) => statusClass(v.status, v.location_updated_at) !== "offline");
  if ($("activeCount")) $("activeCount").textContent = active.length;
  if ($("avgSpeed")) $("avgSpeed").textContent = `${Math.round(active.reduce((n, v) => n + Number(v.speed_kmph || 0), 0) / (active.length || 1))} km/h`;
  if ($("selectedBus")) $("selectedBus").textContent = selected?.vehicle_name || "-";
  if ($("lastSeen")) $("lastSeen").textContent = ago(selected?.location_updated_at);
  if ($("vehicleList")) {
    $("vehicleList").innerHTML = vehicles.map((v) => `<button class="item ${v.vehicle_id === selectedVehicle ? "active" : ""}" data-vehicle="${v.vehicle_id}"><strong>${v.vehicle_name}</strong><small>${v.route_name || "-"} | ${v.driver_name || "-"}</small></button>`).join("");
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
  setMap(selected);
  if (kind === "route") renderRouteTable(vehicles);
  if (kind === "driver") renderDriverTable(vehicles);
  if (kind === "stoppage") renderStoppageTable();
  if (kind === "map") renderBusTable(vehicles);
}

function renderBusTable(vehicles) {
  if (!$("dataTable")) return;
  $("dataTable").innerHTML = vehicles.map((v) => `<tr><td>${v.vehicle_name}</td><td>${v.route_name || "-"}</td><td>${v.speed_kmph || 0} km/h</td><td>${v.lat ? `${Number(v.lat).toFixed(5)}, ${Number(v.lng).toFixed(5)}` : "-"}</td><td>${ago(v.location_updated_at)}</td><td><span class="status ${statusClass(v.status, v.location_updated_at)}">${statusClass(v.status, v.location_updated_at)}</span></td></tr>`).join("");
}

function renderRouteTable(vehicles) {
  $("dataTable").innerHTML = vehicles.map((v) => `<tr><td>${v.route_name || "-"}</td><td>${v.vehicle_name}</td><td>${v.trip_type || "-"}</td><td>${v.estimated_arrival_min || 0} min</td><td><span class="status ${statusClass(v.status, v.location_updated_at)}">${v.status || "running"}</span></td></tr>`).join("");
}

function renderDriverTable(vehicles) {
  $("dataTable").innerHTML = vehicles.map((v) => `<tr><td>${v.driver_name || "-"}</td><td>${v.mobile || "-"}</td><td>${v.vehicle_name}</td><td>${v.vehicle_no}</td><td>${ago(v.location_updated_at)}</td><td><span class="status ${statusClass(v.status, v.location_updated_at)}">${statusClass(v.status, v.location_updated_at)}</span></td></tr>`).join("");
}

function renderStoppageTable() {
  const rows = lastSummary.stoppages || [];
  $("dataTable").innerHTML = rows.length ? rows.map((s) => `<tr><td>${s.vehicle_id}</td><td>${s.route_id}</td><td>${s.stop_name}</td><td>${Math.round((s.duration_seconds || 0) / 60)} min</td><td>${s.started_at}</td><td>${s.ended_at || "Standing"}</td></tr>`).join("") : `<tr><td colspan="6">No stoppage alert now</td></tr>`;
}

async function loadOffice(kind = "map") {
  const params = new URLSearchParams(window.location.search);
  params.set("school_id", params.get("school_id") || SCHOOL_ID);
  lastSummary = await apiGet(`/api/office/summary?${params.toString()}`);
  renderOffice(kind);
}

function bootOffice(kind) {
  preserveOfficeLinks();
  loadOffice(kind).catch((err) => {
    if ($("details")) $("details").innerHTML = `<div class="empty">${err.message}. Open this dashboard from the secured ERP Smart Bus Tracking page after sync.</div>`;
  });
  const refresh = $("refreshBtn");
  if (refresh) refresh.onclick = () => loadOffice(kind);
  const demo = $("demoBtn");
  if (demo) demo.onclick = async () => {
    await apiPost("/api/office/demo-tick");
    await loadOffice(kind);
  };
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
  if (frame) frame.src = mapSrc(bus);
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
