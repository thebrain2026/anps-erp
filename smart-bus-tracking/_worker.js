const SCHOOL_ID = "anps";

const emptyState = {
  school_id: SCHOOL_ID,
  students: [],
  vehicles: [],
  pickup_points: [],
  stoppages: [],
};

let memoryState = structuredClone(emptyState);

function json(data, init = {}) {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "access-control-allow-origin": "*",
      "access-control-allow-methods": "GET,POST,OPTIONS",
      "access-control-allow-headers": "content-type,authorization",
      ...(init.headers || {}),
    },
  });
}

function normalize(value = "") {
  return String(value || "").toLowerCase().replace(/[^a-z0-9]/g, "");
}

function stableId(prefix, value = "") {
  return `${prefix}-${normalize(value) || "unknown"}`;
}

function tokenFor(env) {
  return String(env.SMART_BUS_ERP_TOKEN || "");
}

function officePinFor(env) {
  return String(env.SMART_BUS_OFFICE_PIN || "");
}

function defaultDriverPinFor(env) {
  return String(env.SMART_BUS_DRIVER_PIN || "2244");
}

function studentLinkSecret(env) {
  return String(env.SMART_BUS_STUDENT_LINK_SECRET || env.SMART_BUS_ERP_TOKEN || "");
}

function base64Url(bytes) {
  let binary = "";
  new Uint8Array(bytes).forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

async function signStudentParams(params, env) {
  const data = new TextEncoder().encode([...params.entries()]
    .filter(([key]) => key !== "sig")
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join("&"));
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(studentLinkSecret(env)),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  return base64Url(await crypto.subtle.sign("HMAC", key, data));
}

async function verifyStudentLink(url, env) {
  const params = url.searchParams;
  const admissionNo = params.get("admission_no") || "";
  const expiresAt = Number(params.get("exp") || 0);
  const suppliedSig = params.get("sig") || "";
  if (!studentLinkSecret(env)) {
    return { ok: false, error: "Student bus link security secret is not configured." };
  }
  if (!admissionNo || !expiresAt || !suppliedSig) {
    return { ok: false, error: "Signed student bus link is required." };
  }
  if (Date.now() / 1000 > expiresAt) {
    return { ok: false, error: "Student bus link expired. Please reopen Bus Location from the mobile app." };
  }
  const expectedSig = await signStudentParams(params, env);
  if (expectedSig !== suppliedSig) {
    return { ok: false, error: "Invalid student bus link." };
  }
  return { ok: true, admissionNo };
}

async function verifySignedOfficeLink(url, env) {
  const params = url.searchParams;
  const expiresAt = Number(params.get("exp") || 0);
  const suppliedSig = params.get("sig") || "";
  const source = params.get("source") || "";
  if (source !== "erp-office" || !expiresAt || !suppliedSig) {
    return { ok: false, status: 401, error: "Unauthorized Smart Bus office request." };
  }
  const token = tokenFor(env);
  if (!token) {
    return { ok: false, status: 503, error: "Smart Bus office API token is not configured." };
  }
  if (Date.now() / 1000 > expiresAt) {
    return { ok: false, status: 403, error: "Smart Bus office link expired. Reopen the dashboard from ERP." };
  }
  const expectedSig = await signOfficeParams(params, env);
  if (expectedSig !== suppliedSig) {
    return { ok: false, status: 403, error: "Invalid Smart Bus office link." };
  }
  return { ok: true };
}

async function verifySignedDriverLink(url, env) {
  const params = url.searchParams;
  const expiresAt = Number(params.get("exp") || 0);
  const suppliedSig = params.get("sig") || "";
  const source = params.get("source") || "";
  const vehicleId = params.get("vehicle_id") || "";
  const token = tokenFor(env);
  if (source !== "erp-driver" || !vehicleId || !expiresAt || !suppliedSig) {
    return { ok: false, status: 401, error: "Signed Driver GPS link is required. Open Driver GPS from ERP Smart Bus Tracking." };
  }
  if (!token) {
    return { ok: false, status: 503, error: "Smart Bus driver link token is not configured." };
  }
  if (Date.now() / 1000 > expiresAt) {
    return { ok: false, status: 403, error: "Driver GPS link expired. Reopen Driver GPS from ERP." };
  }
  const expectedSig = await signDriverParams(params, env);
  if (expectedSig !== suppliedSig) {
    return { ok: false, status: 403, error: "Invalid Driver GPS link." };
  }
  return { ok: true, vehicleId };
}

async function signOfficeParams(params, env) {
  const data = new TextEncoder().encode([...params.entries()]
    .filter(([key]) => key !== "sig")
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join("&"));
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(tokenFor(env)),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  return base64Url(await crypto.subtle.sign("HMAC", key, data));
}

async function signDriverParams(params, env) {
  const data = new TextEncoder().encode([...params.entries()]
    .filter(([key]) => key !== "sig")
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join("&"));
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(tokenFor(env)),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  return base64Url(await crypto.subtle.sign("HMAC", key, data));
}

async function signDriverSession(expiresAt, env) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(tokenFor(env)),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const data = new TextEncoder().encode(`driver-session:${expiresAt}`);
  return base64Url(await crypto.subtle.sign("HMAC", key, data));
}

async function driverPinFor(env) {
  if (env.SMART_BUS_KV) {
    const saved = await env.SMART_BUS_KV.get("driver-pin");
    if (saved) return saved;
  }
  return defaultDriverPinFor(env);
}

async function verifyDriverSession(url, env) {
  const token = tokenFor(env);
  const session = url.searchParams.get("driver_session") || "";
  const [expiresAtRaw, suppliedSig] = session.split(".");
  const expiresAt = Number(expiresAtRaw || 0);
  if (!token) {
    return { ok: false, status: 503, error: "Smart Bus driver token is not configured." };
  }
  if (!expiresAt || !suppliedSig) {
    return { ok: false, status: 401, error: "Driver code required." };
  }
  if (Date.now() / 1000 > expiresAt) {
    return { ok: false, status: 403, error: "Driver code login expired. Login again." };
  }
  const expectedSig = await signDriverSession(expiresAt, env);
  if (expectedSig !== suppliedSig) {
    return { ok: false, status: 403, error: "Invalid driver login session." };
  }
  return { ok: true };
}

async function verifyDriverAccess(url, env) {
  if (url.searchParams.get("source") === "erp-driver" || url.searchParams.get("sig")) {
    return verifySignedDriverLink(url, env);
  }
  return verifyDriverSession(url, env);
}

async function signedDriverUrlForVehicle(vehicle, request, env) {
  const url = new URL(request.url);
  const issuedAt = Math.floor(Date.now() / 1000);
  const params = new URLSearchParams({
    school_id: SCHOOL_ID,
    source: "erp-driver",
    vehicle_id: String(vehicle.vehicle_id || "").trim(),
    vehicle: String(vehicle.vehicle_name || "").trim(),
    vehicle_no: String(vehicle.vehicle_no || "").trim(),
    iat: String(issuedAt),
    exp: String(issuedAt + (12 * 60 * 60)),
  });
  params.set("sig", await signDriverParams(params, env));
  return `${url.origin}/driver-gps?${params.toString()}`;
}

async function signOfficeSession(expiresAt, env) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(tokenFor(env)),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const data = new TextEncoder().encode(`office-session:${expiresAt}`);
  return base64Url(await crypto.subtle.sign("HMAC", key, data));
}

function readCookie(request, name) {
  const cookieHeader = request.headers.get("cookie") || "";
  const found = cookieHeader.split(";").map((part) => part.trim()).find((part) => part.startsWith(`${name}=`));
  return found ? decodeURIComponent(found.slice(name.length + 1)) : "";
}

async function verifyOfficeSession(request, env) {
  const token = tokenFor(env);
  if (!token) {
    return { ok: false, status: 503, error: "Smart Bus office API token is not configured." };
  }
  const cookie = readCookie(request, "anps_bus_office");
  const [expiresAtRaw, suppliedSig] = cookie.split(".");
  const expiresAt = Number(expiresAtRaw || 0);
  if (!expiresAt || !suppliedSig) {
    return { ok: false, status: 401, error: "Office login required." };
  }
  if (Date.now() / 1000 > expiresAt) {
    return { ok: false, status: 403, error: "Office login expired. Please login again." };
  }
  const expectedSig = await signOfficeSession(expiresAt, env);
  if (expectedSig !== suppliedSig) {
    return { ok: false, status: 403, error: "Invalid office login session." };
  }
  return { ok: true };
}

function loginRateKey(request) {
  const ip = request.headers.get("cf-connecting-ip") || "unknown";
  return `office-login-attempt:${ip}`;
}

function driverLoginRateKey(request) {
  const ip = request.headers.get("cf-connecting-ip") || "unknown";
  return `driver-login-attempt:${ip}`;
}

async function readLoginAttempts(request, env, key = loginRateKey(request)) {
  if (!env.SMART_BUS_KV) return { blocked: true, count: 0 };
  const raw = await env.SMART_BUS_KV.get(key);
  if (!raw) return { blocked: false, count: 0 };
  try {
    const data = JSON.parse(raw);
    if (Date.now() > Number(data.reset_at || 0)) return { blocked: false, count: 0 };
    return { blocked: Number(data.count || 0) >= 5, count: Number(data.count || 0), reset_at: data.reset_at };
  } catch {
    return { blocked: false, count: 0 };
  }
}

async function recordFailedLogin(request, env, key = loginRateKey(request)) {
  if (!env.SMART_BUS_KV) return;
  const attempts = await readLoginAttempts(request, env, key);
  const next = {
    count: Number(attempts.count || 0) + 1,
    reset_at: attempts.reset_at || Date.now() + (15 * 60 * 1000),
  };
  await env.SMART_BUS_KV.put(key, JSON.stringify(next), { expirationTtl: 15 * 60 });
}

async function clearFailedLogin(request, env, key = loginRateKey(request)) {
  if (env.SMART_BUS_KV) await env.SMART_BUS_KV.delete(key);
}

async function handleOfficeLogin(request, env) {
  if (!tokenFor(env) || !officePinFor(env)) {
    return json({ ok: false, error: "Office login password is not configured." }, { status: 503 });
  }
  const attempts = await readLoginAttempts(request, env);
  if (attempts.blocked) {
    return json({ ok: false, error: "Too many wrong attempts. Please try again after 15 minutes." }, { status: 429 });
  }
  const payload = await request.json().catch(() => ({}));
  const suppliedPin = String(payload.pin || "").trim();
  if (!suppliedPin || suppliedPin !== officePinFor(env)) {
    await recordFailedLogin(request, env);
    return json({ ok: false, error: "Wrong office password." }, { status: 401 });
  }
  await clearFailedLogin(request, env);
  const expiresAt = Math.floor(Date.now() / 1000) + (2 * 60 * 60);
  const sig = await signOfficeSession(expiresAt, env);
  return json({ ok: true, expires_at: expiresAt }, {
    headers: {
      "set-cookie": `anps_bus_office=${expiresAt}.${sig}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=7200`,
    },
  });
}

async function handleDriverLogin(request, env) {
  if (!tokenFor(env)) {
    return json({ ok: false, error: "Smart Bus driver token is not configured." }, { status: 503 });
  }
  const rateKey = driverLoginRateKey(request);
  const attempts = await readLoginAttempts(request, env, rateKey);
  if (attempts.blocked) {
    return json({ ok: false, error: "Too many wrong code attempts. Please try again after 15 minutes." }, { status: 429 });
  }
  const payload = await request.json().catch(() => ({}));
  const suppliedPin = String(payload.pin || "").trim();
  if (!suppliedPin || suppliedPin !== await driverPinFor(env)) {
    await recordFailedLogin(request, env, rateKey);
    return json({ ok: false, error: "Wrong driver code." }, { status: 401 });
  }
  await clearFailedLogin(request, env, rateKey);
  const expiresAt = Math.floor(Date.now() / 1000) + (12 * 60 * 60);
  const sig = await signDriverSession(expiresAt, env);
  return json({ ok: true, driver_session: `${expiresAt}.${sig}`, expires_at: expiresAt });
}

async function handleDriverSettings(request, env) {
  if (request.method === "GET") {
    return json({ ok: true, driver_code: await driverPinFor(env) });
  }
  if (!env.SMART_BUS_KV) {
    return json({ ok: false, error: "Smart Bus KV is required to change driver code." }, { status: 503 });
  }
  const payload = await request.json().catch(() => ({}));
  const nextPin = String(payload.driver_code || payload.pin || "").trim();
  if (!/^[A-Za-z0-9@#._-]{4,20}$/.test(nextPin)) {
    return json({ ok: false, error: "Driver code must be 4-20 letters, numbers or @ # . _ -" }, { status: 400 });
  }
  await env.SMART_BUS_KV.put("driver-pin", nextPin);
  return json({ ok: true, driver_code: nextPin, updated_at: new Date().toISOString() });
}

async function readState(env) {
  if (env.SMART_BUS_KV) {
    const raw = await env.SMART_BUS_KV.get("master-data");
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch (error) {
        console.warn("Invalid Smart Bus KV state", error);
      }
    }
  }
  return memoryState;
}

async function writeState(env, state) {
  memoryState = state;
  if (env.SMART_BUS_KV) {
    await env.SMART_BUS_KV.put("master-data", JSON.stringify(state));
  }
}

function vehicleForStudent(state, student) {
  const vehicleName = student?.vehicle || student?.vehicle_name || "";
  const found = (state.vehicles || []).find((vehicle) =>
    normalize(vehicle.vehicle_name) === normalize(vehicleName)
    || normalize(vehicle.vehicle_no) === normalize(student?.vehicle_no)
  );
  return found || {
    vehicle_id: "",
    vehicle_name: vehicleName || "Not assigned",
    vehicle_no: student?.vehicle_no || "",
    route_name: student?.route || "",
    driver_name: student?.driver || "",
    mobile: student?.driver_mobile || "",
    lat: null,
    lng: null,
    heading: 0,
    speed_kmph: 0,
    status: "not-assigned",
    estimated_arrival_min: 0,
    location_updated_at: "",
  };
}

async function handleStudentLocation(request, env) {
  const url = new URL(request.url);
  const verified = await verifyStudentLink(url, env);
  if (!verified.ok) return json(verified, { status: 403 });
  const admissionNo = verified.admissionNo;
  const state = await readState(env);
  const student = (state.students || []).find((item) =>
    normalize(item.admission_no || item.admissionNo) === normalize(admissionNo)
  );
  if (!student) {
    return json({
      ok: false,
      error: "No synced bus assignment found for this student. Please sync Smart Bus master data from ERP.",
    }, { status: 404 });
  }
  const vehicle = vehicleForStudent(state, student);
  const { speed_kmph, ...studentSafeVehicle } = vehicle;
  return json({
    ok: true,
    school_id: student.school_id || SCHOOL_ID,
    student: {
      admission_no: student.admission_no || admissionNo,
      student_name: student.student_name || student.name || "",
      class: student.class || student.className || "",
      route: student.route || vehicle.route_name || "",
      pickup_point: student.pickup_point || student.pickupPoint || "",
    },
    student_bus: {
      ...studentSafeVehicle,
      route_name: student.route || vehicle.route_name || "",
      pickup_name: student.pickup_point || student.pickupPoint || "-",
      estimated_arrival_text: vehicle.estimated_arrival_min ? `${vehicle.estimated_arrival_min} min` : "-",
    },
  });
}

async function handleOfficeSummary(env) {
  const state = await readState(env);
  return json({
    ok: true,
    school_id: state.school_id || SCHOOL_ID,
    vehicles: state.vehicles || [],
    pickup_points: state.pickup_points || [],
    stoppages: state.stoppages || [],
  });
}

async function handleDriverVehicles(env, vehicleId = "") {
  const state = await readState(env);
  const vehicles = vehicleId
    ? (state.vehicles || []).filter((vehicle) => String(vehicle.vehicle_id || "") === String(vehicleId || ""))
    : (state.vehicles || []);
  return json({
    ok: true,
    school_id: state.school_id || SCHOOL_ID,
    vehicles: vehicles.map((vehicle) => ({
      vehicle_id: vehicle.vehicle_id || "",
      vehicle_name: vehicle.vehicle_name || "",
      vehicle_no: vehicle.vehicle_no || "",
      route_id: vehicle.route_id || "",
      route_name: vehicle.route_name || "",
      trip_type: vehicle.trip_type || "",
      driver_id: vehicle.driver_id || "",
      driver_name: vehicle.driver_name || "",
      mobile: vehicle.mobile || "",
      estimated_arrival_min: Number(vehicle.estimated_arrival_min || 0),
    })),
  });
}

async function handleOfficeDriverLink(request, env) {
  const state = await readState(env);
  const url = new URL(request.url);
  const vehicleId = String(url.searchParams.get("vehicle_id") || "").trim();
  const vehicle = (state.vehicles || []).find((item) => String(item.vehicle_id || "") === vehicleId);
  if (!vehicle) {
    return json({ ok: false, error: "Vehicle not found. Sync bus master data first." }, { status: 404 });
  }
  return json({
    ok: true,
    vehicle_id: vehicle.vehicle_id,
    vehicle_name: vehicle.vehicle_name || "",
    url: await signedDriverUrlForVehicle(vehicle, request, env),
    expires_in_seconds: 12 * 60 * 60,
  });
}

async function handleDriverLocation(request, env) {
  const url = new URL(request.url);
  const auth = await verifyDriverAccess(url, env);
  if (!auth.ok) return json({ ok: false, error: auth.error }, { status: auth.status });
  const payload = await request.json().catch(() => ({}));
  const vehicleId = String(payload.vehicle_id || "").trim();
  if (auth.vehicleId && vehicleId !== auth.vehicleId) {
    return json({ ok: false, error: "Driver GPS link does not match selected vehicle." }, { status: 403 });
  }
  const lat = Number(payload.lat);
  const lng = Number(payload.lng);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return json({ ok: false, error: "Valid GPS latitude and longitude are required." }, { status: 400 });
  }
  const state = await readState(env);
  const vehicle = (state.vehicles || []).find((item) => String(item.vehicle_id || "") === vehicleId);
  if (!vehicle) {
    return json({ ok: false, error: "Vehicle not found. Sync bus master data from ERP again." }, { status: 404 });
  }
  Object.assign(vehicle, {
    route_id: String(payload.route_id || vehicle.route_id || "").trim(),
    driver_id: String(payload.driver_id || vehicle.driver_id || "").trim(),
    trip_type: String(payload.trip_type || vehicle.trip_type || "").trim(),
    lat,
    lng,
    heading: Number(payload.heading || 0),
    speed_kmph: Number(payload.speed_kmph || 0),
    status: String(payload.status || "running"),
    estimated_arrival_min: Number(payload.estimated_arrival_min || vehicle.estimated_arrival_min || 0),
    location_updated_at: new Date().toISOString(),
  });
  state.updated_at = new Date().toISOString();
  await writeState(env, state);
  return json({ ok: true, vehicle_id: vehicle.vehicle_id, updated_at: vehicle.location_updated_at });
}

function verifyOfficeRequest(request, env) {
  const url = new URL(request.url);
  const token = tokenFor(env);
  if (!token) {
    return { ok: false, status: 503, error: "Smart Bus office API token is not configured." };
  }
  if ((request.headers.get("authorization") || "") !== `Bearer ${token}`) {
    if (request.method === "GET") return null;
    return { ok: false, status: 401, error: "Unauthorized Smart Bus office request." };
  }
  return { ok: true };
}

async function handleSyncMasterData(request, env) {
  const auth = request.headers.get("authorization") || "";
  const expected = `Bearer ${tokenFor(env)}`;
  if (!tokenFor(env)) {
    return json({ ok: false, error: "Smart Bus ERP token is not configured." }, { status: 503 });
  }
  if (auth !== expected) {
    return json({ ok: false, error: "Unauthorized Smart Bus ERP sync token." }, { status: 401 });
  }
  const payload = await request.json().catch(() => ({}));
  const students = Array.isArray(payload.students) ? payload.students : [];
  const incomingVehicles = Array.isArray(payload.vehicles) ? payload.vehicles : [];
  const vehiclesByName = new Map();

  function putVehicle(vehicle) {
    if (!vehicle || typeof vehicle !== "object") return;
    const vehicleName = String(vehicle.vehicle_name || vehicle.vehicleName || vehicle.vehicle || "").trim();
    const vehicleNo = String(vehicle.vehicle_no || vehicle.vehicleNo || "").trim();
    const key = normalize(vehicleNo || vehicleName);
    if (!key || vehiclesByName.has(key)) return;
    vehiclesByName.set(key, {
      vehicle_id: String(vehicle.vehicle_id || vehicle.id || vehicleNo || vehicleName).trim(),
      vehicle_name: vehicleName || vehicleNo,
      vehicle_no: vehicleNo,
      route_id: String(vehicle.route_id || vehicle.routeId || stableId("route", vehicle.route_name || vehicle.routeName || "")).trim(),
      route_name: String(vehicle.route_name || vehicle.routeName || "").trim(),
      trip_type: String(vehicle.trip_type || vehicle.tripType || vehicle.trip || "").trim(),
      driver_id: String(vehicle.driver_id || vehicle.driverId || stableId("driver", vehicle.mobile || vehicle.driver_mobile || vehicle.driverMobile || vehicle.driver_name || vehicle.driverName || vehicle.driver || vehicleName || vehicleNo)).trim(),
      driver_name: String(vehicle.driver_name || vehicle.driverName || vehicle.driver || "").trim(),
      mobile: String(vehicle.mobile || vehicle.driver_mobile || vehicle.driverMobile || "").trim(),
      lat: vehicle.lat ?? null,
      lng: vehicle.lng ?? null,
      heading: Number(vehicle.heading || 0),
      speed_kmph: Number(vehicle.speed_kmph || vehicle.speedKmph || 0),
      status: String(vehicle.status || "no-gps"),
      estimated_arrival_min: Number(vehicle.estimated_arrival_min || vehicle.estimatedArrivalMin || 0),
      location_updated_at: String(vehicle.location_updated_at || vehicle.locationUpdatedAt || ""),
    });
  }

  incomingVehicles.forEach(putVehicle);

  students.forEach((student) => {
    const vehicleName = String(student.vehicle || student.vehicle_name || "").trim();
    const vehicleNo = String(student.vehicle_no || student.vehicleNo || "").trim();
    if (!vehicleName && !vehicleNo) return;
    const key = normalize(vehicleNo || vehicleName);
    if (!vehiclesByName.has(key)) {
      vehiclesByName.set(key, {
        vehicle_id: `vehicle-${vehiclesByName.size + 1}`,
        vehicle_name: vehicleName,
        vehicle_no: vehicleNo,
        route_id: stableId("route", student.route || vehicleName || vehicleNo),
        route_name: student.route || "",
        trip_type: student.trip || "",
        driver_id: stableId("driver", student.driver_mobile || student.driver || vehicleName || vehicleNo),
        driver_name: student.driver || "",
        mobile: student.driver_mobile || "",
        lat: null,
        lng: null,
        heading: 0,
        speed_kmph: 0,
        status: "no-gps",
        estimated_arrival_min: 0,
        location_updated_at: "",
      });
    }
  });
  const state = {
    school_id: payload.school_id || SCHOOL_ID,
    students,
    vehicles: vehiclesByName.size ? [...vehiclesByName.values()] : [],
    routes: Array.isArray(payload.routes) ? payload.routes : [],
    pickup_points: Array.isArray(payload.pickup_points) ? payload.pickup_points : [],
    stoppages: [],
    updated_at: new Date().toISOString(),
  };
  await writeState(env, state);
  return json({ ok: true, synced_students: students.length, vehicles: state.vehicles.length, updated_at: state.updated_at });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (request.method === "OPTIONS") return json({ ok: true });
    if (url.pathname === "/api/student/bus-location") return handleStudentLocation(request, env);
    if (url.pathname === "/api/office/login" && request.method === "POST") return handleOfficeLogin(request, env);
    if (url.pathname === "/api/driver/login" && request.method === "POST") return handleDriverLogin(request, env);
    if (url.pathname === "/api/office/session") {
      const session = await verifyOfficeSession(request, env);
      return json({ ok: session.ok, error: session.ok ? "" : session.error }, { status: session.ok ? 200 : session.status });
    }
    if (url.pathname === "/api/office/driver-settings") {
      let officeAuth = verifyOfficeRequest(request, env);
      if (officeAuth === null) officeAuth = await verifyOfficeSession(request, env);
      if (!officeAuth.ok) return json({ ok: false, error: officeAuth.error }, { status: officeAuth.status });
      return handleDriverSettings(request, env);
    }
    if (url.pathname === "/api/office/summary") {
      let officeAuth = verifyOfficeRequest(request, env);
      if (officeAuth === null) {
        const hasSignedLink = url.searchParams.get("source") === "erp-office" && url.searchParams.get("sig");
        officeAuth = hasSignedLink ? await verifySignedOfficeLink(url, env) : await verifyOfficeSession(request, env);
      }
      if (!officeAuth.ok) return json({ ok: false, error: officeAuth.error }, { status: officeAuth.status });
      return handleOfficeSummary(env);
    }
    if (url.pathname === "/api/office/driver-link" && request.method === "GET") {
      let officeAuth = verifyOfficeRequest(request, env);
      if (officeAuth === null) {
        const hasSignedLink = url.searchParams.get("source") === "erp-office" && url.searchParams.get("sig");
        officeAuth = hasSignedLink ? await verifySignedOfficeLink(url, env) : await verifyOfficeSession(request, env);
      }
      if (!officeAuth.ok) return json({ ok: false, error: officeAuth.error }, { status: officeAuth.status });
      return handleOfficeDriverLink(request, env);
    }
    if (url.pathname === "/api/driver/vehicles" && request.method === "GET") {
      const auth = await verifyDriverAccess(url, env);
      if (!auth.ok) return json({ ok: false, error: auth.error }, { status: auth.status });
      return handleDriverVehicles(env, auth.vehicleId);
    }
    if (url.pathname === "/api/driver/location" && request.method === "POST") return handleDriverLocation(request, env);
    if (url.pathname === "/api/erp/sync-master-data" && request.method === "POST") return handleSyncMasterData(request, env);
    if (url.pathname === "/api/office/demo-tick" && request.method === "POST") {
      return json({ ok: false, error: "Demo movement is disabled. Real driver GPS data is required." }, { status: 400 });
    }
    return env.ASSETS.fetch(request);
  },
};
