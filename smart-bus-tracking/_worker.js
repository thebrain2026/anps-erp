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

function tokenFor(env) {
  return String(env.SMART_BUS_ERP_TOKEN || "");
}

function officePinFor(env) {
  return String(env.SMART_BUS_OFFICE_PIN || "");
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

async function readLoginAttempts(request, env) {
  if (!env.SMART_BUS_KV) return { blocked: true, count: 0 };
  const raw = await env.SMART_BUS_KV.get(loginRateKey(request));
  if (!raw) return { blocked: false, count: 0 };
  try {
    const data = JSON.parse(raw);
    if (Date.now() > Number(data.reset_at || 0)) return { blocked: false, count: 0 };
    return { blocked: Number(data.count || 0) >= 5, count: Number(data.count || 0), reset_at: data.reset_at };
  } catch {
    return { blocked: false, count: 0 };
  }
}

async function recordFailedLogin(request, env) {
  if (!env.SMART_BUS_KV) return;
  const attempts = await readLoginAttempts(request, env);
  const next = {
    count: Number(attempts.count || 0) + 1,
    reset_at: attempts.reset_at || Date.now() + (15 * 60 * 1000),
  };
  await env.SMART_BUS_KV.put(loginRateKey(request), JSON.stringify(next), { expirationTtl: 15 * 60 });
}

async function clearFailedLogin(request, env) {
  if (env.SMART_BUS_KV) await env.SMART_BUS_KV.delete(loginRateKey(request));
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
      route_name: String(vehicle.route_name || vehicle.routeName || "").trim(),
      trip_type: String(vehicle.trip_type || vehicle.tripType || vehicle.trip || "").trim(),
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
        route_name: student.route || "",
        trip_type: student.trip || "",
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
    if (url.pathname === "/api/office/session") {
      const session = await verifyOfficeSession(request, env);
      return json({ ok: session.ok, error: session.ok ? "" : session.error }, { status: session.ok ? 200 : session.status });
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
    if (url.pathname === "/api/erp/sync-master-data" && request.method === "POST") return handleSyncMasterData(request, env);
    if (url.pathname === "/api/office/demo-tick" && request.method === "POST") {
      return json({ ok: false, error: "Demo movement is disabled. Real driver GPS data is required." }, { status: 400 });
    }
    return env.ASSETS.fetch(request);
  },
};
