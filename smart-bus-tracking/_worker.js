const SCHOOL_ID = "anps";

const demoState = {
  students: [
    {
      school_id: SCHOOL_ID,
      admission_no: "ANPS-ADM/26-27/274",
      student_name: "Sk Zahid Afroj",
      class: "Class VII Amber",
      route: "Route D",
      pickup_point: "City Centre",
      vehicle: "ANPS Bus 21",
      vehicle_no: "WB-00-ANPS-21",
      driver: "Bimal Das",
      driver_mobile: "",
    },
  ],
  vehicles: [
    {
      vehicle_id: "bus-21",
      vehicle_name: "ANPS Bus 21",
      vehicle_no: "WB-00-ANPS-21",
      route_name: "Route D",
      driver_name: "Bimal Das",
      mobile: "",
      lat: 22.7241,
      lng: 88.4867,
      heading: 38,
      speed_kmph: 22,
      status: "running",
      estimated_arrival_min: 12,
      location_updated_at: new Date().toISOString(),
    },
  ],
};

let memoryState = structuredClone(demoState);

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
  const vehicleName = student?.vehicle || student?.vehicle_name || "ANPS Bus 21";
  const found = (state.vehicles || []).find((vehicle) =>
    normalize(vehicle.vehicle_name) === normalize(vehicleName)
    || normalize(vehicle.vehicle_no) === normalize(student?.vehicle_no)
  );
  return found || {
    ...demoState.vehicles[0],
    vehicle_name: vehicleName,
    vehicle_no: student?.vehicle_no || "",
    route_name: student?.route || "-",
    driver_name: student?.driver || "-",
    mobile: student?.driver_mobile || "",
    location_updated_at: new Date().toISOString(),
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
  ) || state.students?.[0] || demoState.students[0];
  const vehicle = vehicleForStudent(state, student);
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
      ...vehicle,
      route_name: student.route || vehicle.route_name || "",
      pickup_name: student.pickup_point || student.pickupPoint || "-",
      estimated_arrival_text: `${vehicle.estimated_arrival_min || 12} min`,
    },
  });
}

async function handleOfficeSummary(env) {
  const state = await readState(env);
  return json({
    ok: true,
    school_id: state.school_id || SCHOOL_ID,
    vehicles: state.vehicles || demoState.vehicles,
    pickup_points: state.pickup_points || [],
    stoppages: state.stoppages || [],
  });
}

function verifyOfficeRequest(request, env) {
  const token = tokenFor(env);
  if (!token) {
    return { ok: false, status: 503, error: "Smart Bus office API token is not configured." };
  }
  if ((request.headers.get("authorization") || "") !== `Bearer ${token}`) {
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
  const vehiclesByName = new Map();
  students.forEach((student, index) => {
    const vehicleName = student.vehicle || student.vehicle_name || `ANPS Bus ${index + 1}`;
    if (!vehiclesByName.has(normalize(vehicleName))) {
      vehiclesByName.set(normalize(vehicleName), {
        vehicle_id: `vehicle-${vehiclesByName.size + 1}`,
        vehicle_name: vehicleName,
        vehicle_no: student.vehicle_no || "",
        route_name: student.route || "",
        driver_name: student.driver || "",
        mobile: student.driver_mobile || "",
        lat: 22.7241 + vehiclesByName.size * 0.003,
        lng: 88.4867 + vehiclesByName.size * 0.003,
        heading: 30,
        speed_kmph: 18,
        status: "running",
        estimated_arrival_min: 12,
        location_updated_at: new Date().toISOString(),
      });
    }
  });
  const state = {
    school_id: payload.school_id || SCHOOL_ID,
    students,
    vehicles: vehiclesByName.size ? [...vehiclesByName.values()] : demoState.vehicles,
    pickup_points: [],
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
    if (url.pathname === "/api/office/summary") {
      const officeAuth = verifyOfficeRequest(request, env);
      if (!officeAuth.ok) return json({ ok: false, error: officeAuth.error }, { status: officeAuth.status });
      return handleOfficeSummary(env);
    }
    if (url.pathname === "/api/erp/sync-master-data" && request.method === "POST") return handleSyncMasterData(request, env);
    if (url.pathname === "/api/office/demo-tick" && request.method === "POST") {
      const officeAuth = verifyOfficeRequest(request, env);
      if (!officeAuth.ok) return json({ ok: false, error: officeAuth.error }, { status: officeAuth.status });
      const state = await readState(env);
      state.vehicles = (state.vehicles || demoState.vehicles).map((vehicle, index) => ({
        ...vehicle,
        lat: Number(vehicle.lat || 22.7241) + 0.001 + index * 0.0002,
        lng: Number(vehicle.lng || 88.4867) + 0.001 + index * 0.0002,
        location_updated_at: new Date().toISOString(),
      }));
      await writeState(env, state);
      return json({ ok: true });
    }
    return env.ASSETS.fetch(request);
  },
};
