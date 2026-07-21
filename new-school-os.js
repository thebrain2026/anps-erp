const students = [];

const attendance = [];

const tasks = [];

const learning = [];

const modules = [];

const dues = [];

const notices = [];
const teacherNoticeRequests = [];
const teacherLeaves = [];
const teacherAdvisories = [];
const homework = [];
const homeworkDoubts = [];
const admissionEnquiries = [];
const complaintRecords = [];

const staffMembers = [];
const schools = [{
  id: "anps",
  school_id: "anps",
  name: "Alfred Nobel Public School",
  status: "Active",
  plan: "Single School"
}];
const departments = [];
const roles = [];
const designations = [];
const userAccessAccounts = [];
const studentUserAccounts = [];
const mobileAppActivity = [];
const upiPaymentRequests = [];
const mobileAppSettings = {
  duePopupEnabled: true,
  dueLockEnabled: true,
  dueLockDays: 75,
  busLocationEnabled: true
};
const rolePermissions = {};
const rolePermissionAudit = {};
const staffAttendanceRecords = [];
const classTimetableEntries = [];
const syllabusEntries = [];
const marksheetEntries = [];
const externalExamFees = [];
const holidayReports = [];
const transportRoutes = [];
const transportVehicles = [];
const transportVehicleAssignments = [];
const transportRoutePickupPoints = [];
const staffBiometricDevice = {
  device: "",
  model: "",
  note: "",
  source: "CSV Import"
};

const financeSessions = {
  "2025-26": {
    feesCollected: "Rs. 0",
    collectionPercent: 0,
    followUps: 0,
    highPriority: 0,
    paid: 0,
    promise: 0,
    overdue: 0,
    summary: "No finance data entered for this session yet.",
    feeMaster: [],
    feeGroups: [],
    dues: []
  },
  "2026-27": {
    feesCollected: "Rs. 0",
    collectionPercent: 0,
    followUps: 0,
    highPriority: 0,
    paid: 0,
    promise: 0,
    overdue: 0,
    summary: "No finance data entered for this session yet.",
    feeMaster: [],
    feeGroups: [],
    dues
  }
};

let activeSession = "2026-27";
let activeSchoolId = "anps";
let activeSchoolName = "Alfred Nobel Public School";
let activeFeeStudentAdmissionNo = "";
let activeLedgerAdmissionNo = "";
let activeFeeReturnView = "finance";
let feeBookReturnStudentAdmissionNo = "";
let activeDailyCollectionDate = "";
const viewHistoryStack = [];
const collectedPayments = {};
const deletedPaymentReceipts = {};
const selectedHistoryPayments = new Set();
const openFeeBookDropdowns = new Set();
let receiptSerial = 1;
let currentAdmissionPhoto = "";
let currentStaffPhoto = "";
const STORAGE_KEY = "newSchoolOsState";
const SECURITY_BACKUP_KEY = "newSchoolOsSecurityBackups";
const PRODUCTION_CLEAN_KEY = "newSchoolOsProductionCleanVersion";
const PRODUCTION_CLEAN_VERSION = "2026-06-18-v2";
const BACKEND_TOKEN_KEY = "school_api_token";
const BACKEND_USER_KEY = "school_api_user";
const BACKEND_LOGGED_OUT_KEY = "school_api_logged_out";
const BACKEND_PENDING_STATE_KEY = "school_api_pending_state";
const IS_PRODUCTION_RENDER = location.hostname.endsWith("onrender.com");
const BACKEND_API_BASE = (
  document.querySelector('meta[name="school-api-base"]')?.content ||
  (!IS_PRODUCTION_RENDER ? localStorage.getItem("school_api_base") : "") ||
  (!IS_PRODUCTION_RENDER ? window.SCHOOL_API_BASE : "") ||
  ""
).replace(/\/$/, "");
if (IS_PRODUCTION_RENDER && localStorage.getItem("school_api_base")) {
  localStorage.removeItem("school_api_base");
}
let backendSaveTimer = null;
let backendSaveInFlight = false;
let backendQueuedSnapshot = null;
let backendQueuedRollbackRawState = "";
let backendAutoSyncTimer = null;
let backendReconnectTimer = null;
let backendSyncReady = false;
let backendHydrating = false;
let backendLastUpdatedAt = "";
let backendLastLocalSaveAt = 0;
let backendNetworkFailCount = 0;
let backendLastHealthOkAt = 0;
const BACKEND_SAVE_DEBOUNCE_MS = 250;
const BACKEND_AUTO_SYNC_INTERVAL_MS = 8000;
const BACKEND_LOCAL_SAVE_GUARD_MS = 5000;
const BACKEND_OFFLINE_FAIL_THRESHOLD = 5;
const BACKEND_HEALTH_GRACE_MS = 60000;
const BACKEND_FETCH_TIMEOUT_MS = 25000;
const MONTHLY_FINE_PAID_SMALL_DUE_LIMIT = 500;
const ACADEMIC_MONTHS = ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar"];
const DEFAULT_ADMISSION_CLASSES = ["Nursery", "Class I", "Class II", "Class III", "Class IV", "Class V", "Class VI", "Class VII", "Class VIII", "Class IX", "Class X", "Class XI", "Class XII"];
const DEFAULT_ADMISSION_SECTIONS = ["Amber", "Ruby", "A", "B", "C", "IGCSE", "IB", "Science", "Commerce"];
const DEFAULT_SUBJECTS = ["Mathematics", "Science", "English", "Bengali", "Hindi", "History", "Geography", "Computer", "Physical Education"];
const DEFAULT_STAFF_DESIGNATIONS = ["Principal", "Counsellor", "Academic Coordinator", "Account", "Assistant Account", "Receptionist", "Admin Coordinator", "Teacher"];
const DEFAULT_STUDENT_TYPES = ["New Student", "Promoted Student"];
const PROTECTED_ROLE_NAMES = ["Master Admin", "Administrator", "Admin"];
const TRANSPORT_SCHOOL_MAP_QUERY = "Alfred Nobel Public School, Bhatar, Purba Bardhaman, West Bengal";
const DEFAULT_TUITION_FINE_SETUP = {
  dailyRate: 5,
  nextMonth: 75,
  secondMonth: 100,
  laterMonth: 150
};
const DEFAULT_TRANSPORT_FINE_SETUP = {
  sameMonth: 110,
  nextMonth: 150,
  secondMonth: 180,
  laterMonth: 200
};
const DEFAULT_TRANSPORT_VILLAGES = [
  "Andrapur",
  "Choto Belun",
  "Kurmun",
  "Bhagabanpur",
  "Boro Jougram",
  "Chhatni",
  "Dhamachia",
  "Erachya",
  "Haladharpur",
  "Hargram",
  "Kalui (Special)",
  "Kastha Kurumba",
  "Malamba",
  "Muraripur",
  "Nabagram",
  "Nargohalia",
  "Nasigram",
  "Palsona",
  "Radhanagar",
  "Rajgachi",
  "Sijna",
  "Sorshe Danga",
  "Tubgram",
  "Banui",
  "Barapalasan",
  "Hossainpur",
  "Khajurdihi",
  "Panbarya",
  "Ramchandrapur",
  "Ujna",
  "Barabelun",
  "Barkona",
  "Jagatpur",
  "Kherur",
  "Mandalgram",
  "Nabagram, Mandalgram",
  "Nityanandapur (Bh)",
  "Parui",
  "Singhapara",
  "Susunia",
  "Tullya",
  "Ataspur",
  "Balgana Chatti",
  "Bhatar",
  "Indrapur",
  "Kadra",
  "Kusumgram",
  "Mulgram",
  "Samanti",
  "Balisha",
  "Bhanderdihi",
  "Bandul",
  "Dirghanagar",
  "Raigram",
  "Khondekardanga",
  "Kulut",
  "Purunia",
  "Bntika",
  "Ghoradanga",
  "Norsona",
  "Amarun",
  "Mamudpur",
  "Basantapur",
  "Kalpukur",
  "Sargachee",
  "Sihigram",
  "Bhumshore",
  "Shonpur",
  "Pure",
  "Bijoypur",
  "Ramnagar",
  "Shikartor",
  "Mirjapur",
  "Bamuniya",
  "Mirgahar",
  "Nityanandapur",
  "Kaigram",
  "Maldanga",
  "Monteswar",
  "Malamba AC",
  "Goyeshpur",
  "Bhojpur",
  "Balsidanga",
  "Bamunia Mondalgram",
  "Budhpur",
  "Maynampur",
  "Arachia",
  "Kulnagar",
  "Swetpur",
  "Neragohalia",
  "Tara Susuna"
];
const transportVillages = [...DEFAULT_TRANSPORT_VILLAGES];
const transportVillageDistances = {
  "Choto Belun": "2.1"
};
const transportVillageFees = {};
const transportFeeMatched = {};
const tuitionFineSetup = {...DEFAULT_TUITION_FINE_SETUP};
const transportFineSetup = {...DEFAULT_TRANSPORT_FINE_SETUP};
const customAdmissionClasses = [];
const customAdmissionSections = [];
const customSubjects = [];
const classSubjectAssignments = {};

const titleMap = {
  dashboard: "Dashboard",
  dashboardFeesCollection: "Dashboard Fees Collection",
  admissionEnquiry: "Admission Enquiry",
  complaintRegister: "Complaint Register",
  complaintsDesk: "Complaint Book",
  students: "Student Details",
  studentAdmission: "Student Admission",
  disableStudent: "Disable Student",
  bulkDeleteStudent: "Bulk Delete",
  finance: "Collect Fees",
  feeBook: "Fee Book",
  bankBook: "Bank Book",
  bankReconciliation: "Bank Reconciliation",
  dueFeesSearch: "Search Due Fees",
  upiPaymentVerification: "UPI Verification",
  feeMaster: "Fee Master",
  feeGroup: "Fee Group",
  addClassSection: "Add Class/Section",
  tuitionFineSetup: "Tuition Fine Setup",
  feeReminder: "Fee Reminder",
  staffDetails: "Staff Details",
  staffAttendance: "Staff Attendance",
  applyLeave: "Apply Leave",
  leaveType: "Leave Type",
  approveLeave: "Approval Leave Request",
  teachersRating: "Teachers Rating",
  teacherAdvisory: "Teacher Advisory",
  department: "HR Setup",
  designation: "Designation",
  disabledStaff: "Disabled Staff",
  noticeBoard: "Notice Board",
  teacherNoticeRequests: "Teacher Notice Requests",
  sendSms: "WhatsApp Message",
  addHomework: "Add Homework",
  teacherHomework: "Teachers Homework",
  homeworkDoubts: "Homework Doubts",
  dailyAssignment: "Daily Assignment",
  reportStudentInformation: "Student Information Report",
  dailyCollectionReport: "Daily Collection Report",
  entireSchoolFeesReport: "Entire School Fees",
  classTimetable: "Class Timetable",
  teacherTimetable: "Teachers Time Table",
  classTeacherAssignment: "Class Teacher Assignment",
  syllabus: "Syllabus",
  marksheet: "Marksheet",
  externalExamFees: "External Exam Fees",
  academicProfile: "Academic Profile",
  teacherComplaint: "Teacher Complaint",
  holidayReport: "Holiday Report",
  annualCalendar: "Annual Calendar",
  learning: "Learning",
  studentIdCard: "Student ID Card",
  teacherIdCard: "Teachers ID Card",
  masterAdmin: "Master Admin",
  schoolManagement: "School Management",
  userAccessSettings: "User Access & Permissions",
  studentUserLogin: "Student User Login",
  mobileAppActivity: "Mobile App Activity",
  securityMaintenance: "Security Maintenance",
  securityDuplicateReceipts: "Duplicate Receipts",
  securityAlertSolver: "Alert Solver",
  securityRoleHealth: "Role & Permission Health",
  transportFeesMaster: "Transport Fees Master",
  transportFineSetup: "Transport Fine Setup",
  transportPickupPoint: "Pickup Point",
  transportRoute: "Route",
  transportVehicle: "Vehicle",
  transportAssignVehicle: "Assign Vehicle",
  transportRoutePickupPoint: "Route Pickup Point",
  studentTransportFees: "Student Transport Fees",
  nonTransportStudents: "Non Transport Students",
  smartBusTracking: "Smart Bus Tracking"
};

const ACCESS_PERMISSION_MODULES = Object.keys(titleMap);

const ACCESS_ACTIONS = ["view", "add", "edit", "delete", "print"];
const ACCESS_PERMISSION_GROUPS = [
  {name: "Dashboard", modules: ["dashboard", "dashboardFeesCollection"]},
  {name: "Front Office", modules: ["admissionEnquiry", "complaintRegister", "complaintsDesk"]},
  {name: "Student Information", modules: ["students", "studentAdmission", "disableStudent", "bulkDeleteStudent"]},
  {name: "Fees Collection", modules: ["finance", "feeBook", "bankBook", "bankReconciliation", "dueFeesSearch", "upiPaymentVerification", "feeMaster", "feeGroup", "addClassSection", "tuitionFineSetup", "feeReminder"]},
  {name: "Human Resources", modules: ["staffDetails", "staffAttendance", "applyLeave", "leaveType", "approveLeave", "teachersRating", "teacherAdvisory", "department", "designation", "disabledStaff"]},
  {name: "Communication", modules: ["noticeBoard", "teacherNoticeRequests", "sendSms"]},
  {name: "Homework", modules: ["addHomework", "teacherHomework", "homeworkDoubts", "dailyAssignment"]},
  {name: "Reports", modules: ["reportStudentInformation", "dailyCollectionReport", "entireSchoolFeesReport"]},
  {name: "Academic", modules: ["classTimetable", "teacherTimetable", "classTeacherAssignment", "syllabus", "marksheet", "externalExamFees", "academicProfile", "teacherComplaint", "holidayReport", "annualCalendar"]},
  {name: "Certificate", modules: ["studentIdCard", "teacherIdCard"]},
  {name: "Settings", modules: ["masterAdmin", "schoolManagement", "userAccessSettings", "studentUserLogin", "mobileAppActivity"]},
  {name: "Security", modules: ["securityMaintenance", "securityDuplicateReceipts", "securityAlertSolver", "securityRoleHealth"]},
  {name: "Transport", modules: ["transportFeesMaster", "transportFineSetup", "transportPickupPoint", "transportRoute", "transportVehicle", "transportAssignVehicle", "transportRoutePickupPoint", "studentTransportFees", "nonTransportStudents", "smartBusTracking"]}
];

const pageTitle = document.getElementById("pageTitle");
const navButtons = [...document.querySelectorAll("[data-view]")];
const views = [...document.querySelectorAll(".view")];
const toast = document.getElementById("toast");
const admissionModal = document.getElementById("admissionModal");
const admissionForm = document.getElementById("admissionForm");
const admissionError = document.getElementById("admissionError");
const disableReasonModal = document.getElementById("disableReasonModal");
const disableReasonForm = document.getElementById("disableReasonForm");
const receiptPreviewModal = document.getElementById("receiptPreviewModal");
const receiptPreviewBody = document.getElementById("receiptPreviewBody");
const combinedCollectionModal = document.getElementById("combinedCollectionModal");
const combinedCollectionForm = document.getElementById("combinedCollectionForm");
const complaintReviewModal = document.getElementById("complaintReviewModal");
const complaintReviewBody = document.getElementById("complaintReviewBody");
const complaintReviewReason = document.getElementById("complaintReviewReason");
const complaintReviewSolution = document.getElementById("complaintReviewSolution");
const sessionSelect = document.getElementById("sessionSelect");
const newSessionInput = document.getElementById("newSessionInput");
const feeMasterForm = document.getElementById("feeMasterForm");
const feeGroupForm = document.getElementById("feeGroupForm");
const classSetupForm = document.getElementById("classSetupForm");
const sectionSetupForm = document.getElementById("sectionSetupForm");
const subjectSetupForm = document.getElementById("subjectSetupForm");
const classTeacherAssignmentForm = document.getElementById("classTeacherAssignmentForm");
const subjectAssignForm = document.getElementById("subjectAssignForm");
const admissionEnquiryForm = document.getElementById("admissionEnquiryForm");
const complaintRegisterForm = document.getElementById("complaintRegisterForm");
const teacherComplaintForm = document.getElementById("teacherComplaintForm");
const noticeForm = document.getElementById("noticeForm");
const homeworkEntryForm = document.getElementById("homeworkEntryForm");
const staffDetailsForm = document.getElementById("staffDetailsForm");
const departmentForm = document.getElementById("departmentForm");
const roleForm = document.getElementById("roleForm");
const designationForm = document.getElementById("designationForm");
const masterAdminForm = document.getElementById("masterAdminForm");
const schoolManagementForm = document.getElementById("schoolManagementForm");
const userAccessForm = document.getElementById("userAccessForm");
const studentUserAccessForm = document.getElementById("studentUserAccessForm");
const accessPermissionForm = document.getElementById("accessPermissionForm");
const importStudentsExcel = document.getElementById("importStudentsExcel");
const staffAttendanceImport = document.getElementById("staffAttendanceImport");
const classTimetableForm = document.getElementById("classTimetableForm");
const syllabusForm = document.getElementById("syllabusForm");
const holidayReportForm = document.getElementById("holidayReportForm");
const feeBookStudentSelect = document.getElementById("feeBookStudentSelect");
const transportVillageForm = document.getElementById("transportVillageForm");
const transportRouteForm = document.getElementById("transportRouteForm");
const transportVehicleForm = document.getElementById("transportVehicleForm");
const transportAssignVehicleForm = document.getElementById("transportAssignVehicleForm");
const transportRoutePickupForm = document.getElementById("transportRoutePickupForm");
let activeFilter = "All";
let editingAdmissionNo = "";
let editingAdmissionEnquiryIndex = -1;
let editingComplaintIndex = -1;
let activeComplaintReviewIndex = -1;
let editingFeeMasterIndex = -1;
let editingFeeGroupIndex = -1;
let editingClassSetupIndex = -1;
let editingSectionSetupIndex = -1;
let editingSubjectSetupIndex = -1;
let editingDepartmentIndex = -1;
let editingRoleIndex = -1;
let editingDesignationIndex = -1;
let editingUserAccessIndex = -1;
let editingStudentUserIndex = -1;
let editingTransportRouteIndex = -1;
let editingTransportVehicleIndex = -1;
let editingTransportAssignmentIndex = -1;
let editingTransportPickupIndex = -1;
let classSectionMasterInitialized = false;
let activeTimetableDay = "Monday";
let timetableBuilderRows = [];
let timetableIntervalMap = {};
let editingSyllabusIndex = -1;
let editingExternalExamFeeId = "";
let editingHolidayIndex = -1;
let editingSchoolIndex = -1;

function isMobileOnlyTimetableEntry(entry = {}) {
  const source = String(entry.source || entry.createdFrom || entry.origin || "").trim().toLowerCase();
  const id = String(entry.id || entry.entryId || "").trim().toLowerCase();
  return source.includes("teacher app") || source.includes("mobile") || id.startsWith("tt-teacher");
}

function normalizeMainErpTimetableEntry(entry = {}) {
  if (isMobileOnlyTimetableEntry(entry)) return entry;
  if (String(entry.source || "").trim()) return entry;
  return {...entry, source: "Main ERP"};
}

function getPersistableTimetableEntries() {
  return classTimetableEntries
    .filter(entry => !isMobileOnlyTimetableEntry(entry))
    .map(normalizeMainErpTimetableEntry);
}

function getAppStateSnapshot() {
  return {
    students,
    financeSessions,
    activeSession,
    collectedPayments,
    deletedPaymentReceipts,
    receiptSerial,
    notices,
    teacherNoticeRequests,
    teacherLeaves,
    teacherAdvisories,
    homework,
    homeworkDoubts,
    admissionEnquiries,
    complaintRecords,
    staffMembers,
    schools,
    school_id: activeSchoolId,
    schoolId: activeSchoolId,
    schoolName: activeSchoolName,
    departments,
    roles,
    designations,
    userAccessAccounts,
    studentUserAccounts,
    mobileAppActivity,
    upiPaymentRequests,
    mobileAppSettings,
    rolePermissions,
    rolePermissionAudit,
    staffAttendanceRecords,
    classTimetableEntries: getPersistableTimetableEntries(),
    syllabusEntries,
    marksheetEntries,
    externalExamFees,
    holidayReports,
    staffBiometricDevice,
    customAdmissionClasses,
    customAdmissionSections,
    customSubjects,
    classSubjectAssignments,
    classSectionMasterInitialized,
    tuitionFineSetup,
    transportVillageDistances,
    transportVillageFees,
    transportFineSetup,
    transportRoutes,
    transportVehicles,
    transportVehicleAssignments,
    transportRoutePickupPoints,
    transportVillages,
    customTransportVillages: transportVillages.filter(village => !DEFAULT_TRANSPORT_VILLAGES.includes(village))
  };
}

function backendApiUrl(path) {
  return `${BACKEND_API_BASE}${path}`;
}

function backendHeaders(extra = {}) {
  const token = localStorage.getItem(BACKEND_TOKEN_KEY) || "";
  return token ? {...extra, Authorization: `Bearer ${token}`} : extra;
}

async function backendFetch(path, options = {}, timeoutMs = BACKEND_FETCH_TIMEOUT_MS) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(backendApiUrl(path), {...options, signal: controller.signal});
  } finally {
    clearTimeout(timeoutId);
  }
}

function parseBackendRawJson(value) {
  if (!value) return {};
  if (typeof value === "object") return value;
  try {
    const parsed = JSON.parse(String(value));
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch (error) {
    return {};
  }
}

function mapBackendStaffRow(row = {}) {
  const raw = parseBackendRawJson(row.raw_json);
  const staffId = raw.staffId || row.staff_id || row.staffId || "";
  const phone = raw.phone || raw.mobile || row.mobile || "";
  return {
    ...raw,
    staffId,
    name: raw.name || row.name || "",
    role: raw.role || row.role || "",
    designation: raw.designation || row.designation || "",
    department: raw.department || row.department || "",
    teachingSubject: raw.teachingSubject || row.teaching_subject || row.subject || "",
    assignedClass: raw.assignedClass || row.assigned_class || "",
    phone,
    mobile: raw.mobile || phone,
    email: raw.email || row.email || "",
    address: raw.address || row.address || "",
    emergencyPhone: raw.emergencyPhone || row.emergency_phone || "",
    status: raw.status || row.status || "Active"
  };
}

async function hydrateStaffFromBackendModule({persist = false} = {}) {
  if (staffMembers.length || !localStorage.getItem(BACKEND_TOKEN_KEY)) return false;
  try {
    const response = await backendFetch(`/api/module/staff?limit=500&v=${Date.now()}`, {
      cache: "no-store",
      headers: backendHeaders()
    });
    if (!response.ok) return false;
    const payload = await response.json();
    const rows = payload?.rows || payload?.items || payload?.staff || [];
    const mappedStaff = rows
      .map(mapBackendStaffRow)
      .filter(staff => String(staff.staffId || staff.name || "").trim());
    if (!mappedStaff.length) return false;
    staffMembers.splice(0, staffMembers.length, ...mappedStaff);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(getAppStateSnapshot()));
    if (persist) queueBackendSave(getAppStateSnapshot());
    return true;
  } catch (error) {
    console.warn("Could not restore staff details from backend staff table.", error);
    return false;
  }
}

function mergePrimitiveList(remoteList = [], localList = []) {
  const merged = [];
  [...remoteList, ...localList].forEach(item => {
    const value = String(item || "").trim();
    if (value && !merged.some(existing => existing.toLowerCase() === value.toLowerCase())) merged.push(item);
  });
  return merged;
}

function mergeObjectListByKey(remoteList = [], localList = [], keyFields = []) {
  const merged = [];
  const indexByKey = new Map();
  const getKey = item => {
    if (!item || typeof item !== "object") return "";
    for (const field of keyFields) {
      const value = String(item[field] || "").trim();
      if (value) return `${field}:${value.toLowerCase()}`;
    }
    return JSON.stringify(item);
  };
  [...remoteList, ...localList].forEach(item => {
    if (!item || typeof item !== "object") return;
    const key = getKey(item);
    if (!indexByKey.has(key)) {
      indexByKey.set(key, merged.length);
      merged.push(item);
      return;
    }
    merged[indexByKey.get(key)] = {...merged[indexByKey.get(key)], ...item};
  });
  return merged;
}

function getRecordUpdatedTime(item = {}) {
  const raw = item.updatedAt || item.modifiedAt || item.savedAt || item.createdAt || "";
  if (typeof raw === "number") return raw;
  const parsed = Date.parse(raw);
  return Number.isFinite(parsed) ? parsed : 0;
}

function mergeStudentServicesForLegacyConflict(primary = {}, secondary = {}) {
  const services = new Set([
    ...(Array.isArray(primary.otherServices) ? primary.otherServices : []),
    ...(Array.isArray(secondary.otherServices) ? secondary.otherServices : [])
  ]);
  const hasTransport = Boolean(primary.transportRequired || secondary.transportRequired || services.has("Transport"));
  const hasSpecial = services.has("Special/Custom");
  if (hasSpecial) services.delete("Transport");
  else if (hasTransport) services.add("Transport");
  return [...services];
}

function mergeStudentRecord(existing = {}, incoming = {}) {
  const existingTime = getRecordUpdatedTime(existing);
  const incomingTime = getRecordUpdatedTime(incoming);
  if (existingTime || incomingTime) {
    const newer = incomingTime >= existingTime ? incoming : existing;
    const older = newer === incoming ? existing : incoming;
    return {...older, ...newer};
  }
  const merged = {...existing, ...incoming};
  merged.otherServices = mergeStudentServicesForLegacyConflict(existing, incoming);
  merged.transportRequired = merged.otherServices.includes("Transport") && !merged.otherServices.includes("Special/Custom");
  if (!Number(merged.transportFee || 0)) {
    merged.transportFee = Number(incoming.transportFee || existing.transportFee || 0);
  }
  return merged;
}

function mergeStudentList(remoteList = [], localList = []) {
  const merged = [];
  const indexByKey = new Map();
  const getKey = student => normalizeAdmissionNo(student?.admissionNo || "") || String(student?.name || "").trim().toLowerCase();
  [...(Array.isArray(remoteList) ? remoteList : []), ...(Array.isArray(localList) ? localList : [])].forEach(student => {
    if (!student || typeof student !== "object") return;
    const key = getKey(student);
    if (!key) return;
    if (!indexByKey.has(key)) {
      indexByKey.set(key, merged.length);
      merged.push(student);
      return;
    }
    const index = indexByKey.get(key);
    merged[index] = mergeStudentRecord(merged[index], student);
  });
  return merged;
}

function createPaymentId() {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  return `pay-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function getPaymentAllocationSignature(payment = {}) {
  const allocations = (payment.allocations || []).map(allocation => ({
    head: String(allocation.head || "").trim(),
    month: String(allocation.month || "").trim(),
    amount: Number(allocation.amount || 0),
    date: String(allocation.date || "").trim(),
    paymentType: String(allocation.paymentType || "").trim()
  }));
  return JSON.stringify({
    date: String(payment.date || "").trim(),
    amount: Number(payment.amount || 0),
    bankAmount: Number(payment.bankAmount || 0),
    cashAmount: Number(payment.cashAmount || 0),
    discountAmount: Number(payment.discountAmount || 0),
    allocations
  });
}

function getPaymentMergeKey(payment = {}) {
  const id = String(payment.id || "").trim();
  if (id) return `id:${id}`;
  const receipt = String(payment.receipt || "").trim().toLowerCase();
  if (receipt) return `receipt:${receipt}:${getPaymentAllocationSignature(payment).toLowerCase()}`;
  return [
    payment.date || "",
    payment.head || "",
    payment.month || "",
    payment.amount || "",
    payment.bankAmount || "",
    payment.cashAmount || ""
  ].join("|").toLowerCase();
}

function mergePaymentList(remotePayments = [], localPayments = []) {
  const merged = [];
  const indexByKey = new Map();
  [...(Array.isArray(remotePayments) ? remotePayments : []), ...(Array.isArray(localPayments) ? localPayments : [])].forEach(payment => {
    if (!payment || typeof payment !== "object") return;
    const key = getPaymentMergeKey(payment);
    if (!indexByKey.has(key)) {
      indexByKey.set(key, merged.length);
      merged.push(payment);
      return;
    }
    merged[indexByKey.get(key)] = {...merged[indexByKey.get(key)], ...payment};
  });
  return merged;
}

function getDeletedPaymentReceiptMap(...maps) {
  const merged = {};
  maps.forEach(map => {
    if (!map || typeof map !== "object") return;
    Object.entries(map).forEach(([session, sessionRows]) => {
      if (!sessionRows || typeof sessionRows !== "object") return;
      if (!merged[session]) merged[session] = {};
      Object.entries(sessionRows).forEach(([admissionNo, receipts]) => {
        if (!receipts || typeof receipts !== "object") return;
        const normalizedAdmissionNo = normalizeAdmissionNo(admissionNo) || String(admissionNo || "").trim();
        if (!normalizedAdmissionNo) return;
        if (!merged[session][normalizedAdmissionNo]) merged[session][normalizedAdmissionNo] = {};
        Object.entries(receipts).forEach(([receipt, deletedAt]) => {
          const normalizedReceipt = String(receipt || "").trim().toLowerCase();
          if (!normalizedReceipt) return;
          merged[session][normalizedAdmissionNo][normalizedReceipt] = deletedAt || new Date().toISOString();
        });
      });
    });
  });
  return merged;
}

function isPaymentReceiptDeleted(deletedMap = {}, session = activeSession, admissionNo = "", receiptNo = "") {
  const normalizedAdmissionNo = normalizeAdmissionNo(admissionNo) || String(admissionNo || "").trim();
  const normalizedReceipt = String(receiptNo || "").trim().toLowerCase();
  return Boolean(normalizedReceipt && deletedMap?.[session]?.[normalizedAdmissionNo]?.[normalizedReceipt]);
}

function markPaymentReceiptDeleted(admissionNo, receiptNo, session = activeSession) {
  const normalizedAdmissionNo = normalizeAdmissionNo(admissionNo) || String(admissionNo || "").trim();
  const normalizedReceipt = String(receiptNo || "").trim().toLowerCase();
  if (!session || !normalizedAdmissionNo || !normalizedReceipt) return;
  if (!deletedPaymentReceipts[session]) deletedPaymentReceipts[session] = {};
  if (!deletedPaymentReceipts[session][normalizedAdmissionNo]) deletedPaymentReceipts[session][normalizedAdmissionNo] = {};
  deletedPaymentReceipts[session][normalizedAdmissionNo][normalizedReceipt] = new Date().toISOString();
}

function getNextAvailableReceiptForMerge(session = activeSession, usedReceipts = new Set(), nextSerialRef = {value: 1}) {
  const receiptYear = String(session || new Date().getFullYear()).split("-")[0] || String(new Date().getFullYear());
  let candidate = "";
  do {
    candidate = `ANPS/${receiptYear}-${String(nextSerialRef.value).padStart(3, "0")}`;
    nextSerialRef.value += 1;
  } while (usedReceipts.has(candidate));
  usedReceipts.add(candidate);
  return candidate;
}

function mergeCollectedPayments(remoteCollected = {}, localCollected = {}, deletedMap = {}) {
  const merged = {};
  const sessions = new Set([...Object.keys(remoteCollected || {}), ...Object.keys(localCollected || {})]);
  sessions.forEach(session => {
    const remoteSession = remoteCollected?.[session] || {};
    const localSession = localCollected?.[session] || {};
    const receiptOwners = new Map();
    const usedReceipts = new Set();
    const receiptYear = String(session || "").split("-")[0];
    const nextSerialRef = {value: 1};
    const addReceiptOwner = (receipt = "", admissionNo = "") => {
      const cleanReceipt = String(receipt || "").trim();
      if (!cleanReceipt) return;
      const owner = normalizeAdmissionNo(admissionNo);
      usedReceipts.add(cleanReceipt);
      nextSerialRef.value = Math.max(nextSerialRef.value, getReceiptSerial(cleanReceipt, receiptYear) + 1);
      if (!receiptOwners.has(cleanReceipt)) receiptOwners.set(cleanReceipt, new Set());
      receiptOwners.get(cleanReceipt).add(owner);
    };
    Object.entries(remoteSession).forEach(([admissionNo, payments]) => {
      (payments || []).forEach(payment => addReceiptOwner(payment.receipt, admissionNo));
    });
    const prepareLocalPayments = (admissionNo = "", payments = []) => {
      const owner = normalizeAdmissionNo(admissionNo);
      return (payments || []).map(payment => {
        const receipt = String(payment?.receipt || "").trim();
        const owners = receiptOwners.get(receipt);
        const belongsToOtherAdmission = owners && [...owners].some(existingOwner => existingOwner !== owner);
        if (receipt && belongsToOtherAdmission) {
          const nextReceipt = getNextAvailableReceiptForMerge(session, usedReceipts, nextSerialRef);
          addReceiptOwner(nextReceipt, admissionNo);
          return {...payment, receipt: nextReceipt};
        }
        addReceiptOwner(receipt, admissionNo);
        return payment;
      });
    };
    const admissionNos = new Set([...Object.keys(remoteSession || {}), ...Object.keys(localSession || {})]);
    merged[session] = {};
    admissionNos.forEach(admissionNo => {
      const liveRemotePayments = (remoteSession[admissionNo] || []).filter(payment => !isPaymentReceiptDeleted(deletedMap, session, admissionNo, payment?.receipt));
      const liveLocalPayments = (localSession[admissionNo] || []).filter(payment => !isPaymentReceiptDeleted(deletedMap, session, admissionNo, payment?.receipt));
      merged[session][admissionNo] = mergePaymentList(liveRemotePayments, prepareLocalPayments(admissionNo, liveLocalPayments));
    });
  });
  return merged;
}

function mergeFinanceSessions(remoteSessions = {}, localSessions = {}) {
  const merged = {};
  const sessions = new Set([...Object.keys(remoteSessions || {}), ...Object.keys(localSessions || {})]);
  const getFeeMasterUpdatedAt = item => {
    const time = Date.parse(item?.updatedAt || item?.createdAt || "");
    return Number.isFinite(time) ? time : 0;
  };
  const getFeeMasterKey = item => {
    if (!item || typeof item !== "object") return "";
    const className = String(item.className || "").trim().toLowerCase();
    const studentType = String(item.studentType || "New Student").trim().toLowerCase();
    if (className) return `${className}|${studentType}`;
    const id = String(item.id || "").trim();
    return id ? `id:${id.toLowerCase()}` : "";
  };
  const mergeFeeMasterList = (remoteList = [], localList = []) => {
    const rows = [];
    const indexByKey = new Map();
    [...remoteList, ...localList].forEach(item => {
      if (!item || typeof item !== "object") return;
      const key = getFeeMasterKey(item) || JSON.stringify(item);
      if (!indexByKey.has(key)) {
        indexByKey.set(key, rows.length);
        rows.push(item);
        return;
      }
      const existingIndex = indexByKey.get(key);
      const existing = rows[existingIndex];
      rows[existingIndex] = getFeeMasterUpdatedAt(item) >= getFeeMasterUpdatedAt(existing)
        ? {...existing, ...item}
        : {...item, ...existing};
    });
    return rows;
  };
  sessions.forEach(sessionName => {
    const remoteSession = remoteSessions?.[sessionName] || {};
    const localSession = localSessions?.[sessionName] || {};
    merged[sessionName] = {
      ...remoteSession,
      ...localSession,
      feeMaster: mergeFeeMasterList(remoteSession.feeMaster || [], localSession.feeMaster || []),
      feeGroups: mergeObjectListByKey(remoteSession.feeGroups || [], localSession.feeGroups || [], ["id", "groupName"]),
      dues: mergeObjectListByKey(remoteSession.dues || [], localSession.dues || [], ["id", "admissionNo", "feeHead"])
    };
  });
  return merged;
}

function mergeTransportVillageFees(remoteFees = {}, localFees = {}) {
  const merged = {};
  const villages = new Set([...Object.keys(remoteFees || {}), ...Object.keys(localFees || {})]);
  const feeTypes = ["newStudentFee", "promotedStudentFee", "specialStudentFee"];
  villages.forEach(village => {
    const remoteRow = remoteFees[village] || {};
    const localRow = localFees[village] || {};
    const row = {...remoteRow, ...localRow};
    feeTypes.forEach(type => {
      const localValue = Number(localRow[type] || 0);
      const remoteValue = Number(remoteRow[type] || 0);
      if (!localValue && remoteValue) row[type] = remoteValue;
    });
    merged[village] = row;
  });
  return merged;
}

function mergeClassSubjectAssignments(remoteAssignments = {}, localAssignments = {}) {
  const merged = {};
  const classes = new Set([...Object.keys(remoteAssignments || {}), ...Object.keys(localAssignments || {})]);
  classes.forEach(className => {
    const subjects = [
      ...(Array.isArray(remoteAssignments?.[className]) ? remoteAssignments[className] : []),
      ...(Array.isArray(localAssignments?.[className]) ? localAssignments[className] : [])
    ].map(subject => String(subject || "").trim()).filter(Boolean);
    if (subjects.length) merged[className] = [...new Set(subjects)];
  });
  return merged;
}

function mergeStateSnapshots(remoteState = {}, localState = {}) {
  const merged = {...remoteState, ...localState};
  const primitiveKeys = [
    "customAdmissionClasses",
    "customAdmissionSections",
    "customSubjects",
    "transportVillages",
    "customTransportVillages"
  ];
  primitiveKeys.forEach(key => {
    merged[key] = mergePrimitiveList(remoteState[key] || [], localState[key] || []);
  });
  const objectRules = {
    disabledStudents: ["admissionNo", "name"],
    staffMembers: ["staffId", "email", "phone", "name"],
    departments: ["name"],
    roles: ["name"],
    designations: ["name"],
    userAccessAccounts: ["loginId", "id", "username"],
    studentUserAccounts: ["loginId", "admissionNo"],
    mobileAppActivity: ["loginId", "admissionNo"],
    admissionEnquiries: ["id", "mobile", "studentName"],
    complaintRecords: ["id", "complaintNo", "subject"],
    staffAttendanceRecords: ["id", "staffId", "date"],
    syllabusEntries: ["id"],
    marksheetEntries: ["id", "studentAdmissionNo", "exam", "subject"],
    externalExamFees: ["id", "admissionNo", "examName", "subject"],
    holidayReports: ["id", "date", "holidayName"],
    transportRoutes: ["routeName"],
    transportVehicles: ["id", "vehicleNo"],
    transportVehicleAssignments: ["routeName", "vehicleNo", "shift"],
    transportRoutePickupPoints: ["routeName", "villageName", "shift"],
    notices: ["id", "title"],
    teacherNoticeRequests: ["id", "title", "teacherId"],
    teacherLeaves: ["id", "teacherId", "from", "to", "type"],
    teacherAdvisories: ["id", "teacherId", "subject"],
    homeworkDoubts: ["id", "homeworkId", "studentAdmissionNo"]
  };
  merged.students = mergeStudentList(remoteState.students || [], localState.students || []);
  Object.entries(objectRules).forEach(([key, fields]) => {
    merged[key] = mergeObjectListByKey(remoteState[key] || [], localState[key] || [], fields);
  });
  merged.transportVillageDistances = {...(remoteState.transportVillageDistances || {}), ...(localState.transportVillageDistances || {})};
  merged.transportVillageFees = mergeTransportVillageFees(remoteState.transportVillageFees || {}, localState.transportVillageFees || {});
  merged.rolePermissions = {...(remoteState.rolePermissions || {}), ...(localState.rolePermissions || {})};
  merged.rolePermissionAudit = {...(remoteState.rolePermissionAudit || {}), ...(localState.rolePermissionAudit || {})};
  merged.classSubjectAssignments = mergeClassSubjectAssignments(remoteState.classSubjectAssignments || {}, localState.classSubjectAssignments || {});
  merged.classTimetableEntries = Array.isArray(remoteState.classTimetableEntries)
    ? remoteState.classTimetableEntries
    : [];
  merged.deletedPaymentReceipts = getDeletedPaymentReceiptMap(remoteState.deletedPaymentReceipts, localState.deletedPaymentReceipts);
  merged.collectedPayments = mergeCollectedPayments(remoteState.collectedPayments || {}, localState.collectedPayments || {}, merged.deletedPaymentReceipts);
  merged.financeSessions = mergeFinanceSessions(remoteState.financeSessions || {}, localState.financeSessions || {});
  return merged;
}

function mergeSetupSafeState(backendState = {}, localSnapshot = {}) {
  return {
    ...backendState,
    customAdmissionClasses: mergePrimitiveList(backendState.customAdmissionClasses || [], localSnapshot.customAdmissionClasses || []),
    customAdmissionSections: mergePrimitiveList(backendState.customAdmissionSections || [], localSnapshot.customAdmissionSections || []),
    customSubjects: mergePrimitiveList(backendState.customSubjects || [], localSnapshot.customSubjects || []),
    classSectionMasterInitialized: backendState.classSectionMasterInitialized === true || localSnapshot.classSectionMasterInitialized === true,
    classSubjectAssignments: mergeClassSubjectAssignments(backendState.classSubjectAssignments || {}, localSnapshot.classSubjectAssignments || {}),
    transportVillages: mergePrimitiveList(backendState.transportVillages || [], localSnapshot.transportVillages || []),
    customTransportVillages: mergePrimitiveList(backendState.customTransportVillages || [], localSnapshot.customTransportVillages || []),
    transportVillageDistances: {...(backendState.transportVillageDistances || {}), ...(localSnapshot.transportVillageDistances || {})},
    transportVillageFees: mergeTransportVillageFees(backendState.transportVillageFees || {}, localSnapshot.transportVillageFees || {}),
    transportFineSetup: {...(backendState.transportFineSetup || {}), ...(localSnapshot.transportFineSetup || {})},
    transportRoutes: mergeObjectListByKey(backendState.transportRoutes || [], localSnapshot.transportRoutes || [], ["routeName"]),
    transportVehicles: mergeObjectListByKey(backendState.transportVehicles || [], localSnapshot.transportVehicles || [], ["id", "vehicleNo"]),
    transportVehicleAssignments: mergeObjectListByKey(backendState.transportVehicleAssignments || [], localSnapshot.transportVehicleAssignments || [], ["routeName", "vehicleNo", "shift"]),
    transportRoutePickupPoints: mergeObjectListByKey(backendState.transportRoutePickupPoints || [], localSnapshot.transportRoutePickupPoints || [], ["routeName", "villageName", "shift"]),
    financeSessions: mergeFinanceSessions(backendState.financeSessions || {}, localSnapshot.financeSessions || {})
  };
}

function hasSetupSafeMergeChanges(mergedState = {}, backendState = {}) {
  return [
    "customAdmissionClasses",
    "customAdmissionSections",
    "customSubjects",
    "classSectionMasterInitialized",
    "classSubjectAssignments",
    "transportVillages",
    "customTransportVillages",
    "transportVillageDistances",
    "transportVillageFees",
    "transportFineSetup",
    "transportRoutes",
    "transportVehicles",
    "transportVehicleAssignments",
    "transportRoutePickupPoints",
    "financeSessions"
  ].some(key => JSON.stringify(mergedState[key] || null) !== JSON.stringify(backendState[key] || null));
}

function canApplyBackendSaveResult() {
  return !backendQueuedSnapshot && !backendSaveTimer;
}

async function putBackendState(snapshot, allowMergeRetry = true) {
  const response = await backendFetch("/api/state", {
    method: "PUT",
    headers: backendHeaders({"Content-Type": "application/json"}),
    body: JSON.stringify({state: snapshot, base_updated_at: backendLastUpdatedAt || ""})
  });
  if (response.status === 409 && allowMergeRetry) {
    const conflict = await response.json().catch(() => ({}));
    const mergedState = mergeStateSnapshots(conflict?.state || {}, snapshot);
    backendLastUpdatedAt = conflict?.updated_at || backendLastUpdatedAt;
    if (canApplyBackendSaveResult()) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(mergedState));
      applySavedState(mergedState);
    }
    const retryResponse = await backendFetch("/api/state", {
      method: "PUT",
      headers: backendHeaders({"Content-Type": "application/json"}),
      body: JSON.stringify({state: mergedState, base_updated_at: backendLastUpdatedAt || ""})
    });
    if (!retryResponse.ok) throw new Error(`Backend merge save failed ${retryResponse.status}`);
    const retryResult = await retryResponse.json().catch(() => ({}));
    if (retryResult?.state && typeof retryResult.state === "object" && canApplyBackendSaveResult()) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(retryResult.state));
      applySavedState(retryResult.state);
    }
    return retryResult;
  }
  if (!response.ok) throw new Error(`Backend save failed ${response.status}`);
  const result = await response.json().catch(() => ({}));
  if (result?.state && typeof result.state === "object" && canApplyBackendSaveResult()) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(result.state));
    applySavedState(result.state);
  }
  return result;
}

function storePendingBackendSnapshot(snapshot = getAppStateSnapshot()) {
  try {
    localStorage.setItem(BACKEND_PENDING_STATE_KEY, JSON.stringify(snapshot));
  } catch (error) {
    console.warn("Could not keep pending backend snapshot.", error);
  }
}

async function flushPendingBackendSnapshot() {
  const rawPending = localStorage.getItem(BACKEND_PENDING_STATE_KEY);
  if (!rawPending) return false;
  let pendingSnapshot = null;
  try {
    pendingSnapshot = JSON.parse(rawPending);
  } catch (error) {
    console.warn("Invalid pending backend snapshot removed.", error);
    localStorage.removeItem(BACKEND_PENDING_STATE_KEY);
    return false;
  }
  if (!pendingSnapshot || typeof pendingSnapshot !== "object") {
    localStorage.removeItem(BACKEND_PENDING_STATE_KEY);
    return false;
  }
  const result = await putBackendState(pendingSnapshot);
  backendLastUpdatedAt = result?.updated_at || backendLastUpdatedAt;
  localStorage.removeItem(BACKEND_PENDING_STATE_KEY);
  return true;
}

async function ensureBackendToken() {
  if (localStorage.getItem(BACKEND_TOKEN_KEY)) {
    try {
      const response = await backendFetch(`/api/session?v=${Date.now()}`, {
        cache: "no-store",
        headers: backendHeaders()
      });
      if (response.ok) {
        const payload = await response.json().catch(() => ({}));
        if (payload?.user) localStorage.setItem(BACKEND_USER_KEY, JSON.stringify(payload.user));
        return true;
      }
      if (response.status === 401) {
        localStorage.removeItem(BACKEND_TOKEN_KEY);
        localStorage.removeItem(BACKEND_USER_KEY);
        showLoginOverlay();
        return false;
      }
    } catch (error) {
      return Boolean(getLoggedInBackendUser());
    }
  }
  if (localStorage.getItem(BACKEND_LOGGED_OUT_KEY) === "1") return false;
  return false;
}

function canSaveOnlineNow() {
  return navigator.onLine
    && (backendSyncReady || Date.now() - backendLastHealthOkAt < BACKEND_HEALTH_GRACE_MS)
    && backendNetworkFailCount < BACKEND_OFFLINE_FAIL_THRESHOLD
    && Boolean(localStorage.getItem(BACKEND_TOKEN_KEY))
    && Boolean(getLoggedInBackendUser());
}

function showNoInternetSaveWarning() {
  markBackendConnectionIssue();
  showToast("No internet/server connection. Entry not saved. Please reconnect and save again.", "error", 6000);
}

function restoreStateFromRaw(rawState = "") {
  try {
    if (rawState) {
      localStorage.setItem(STORAGE_KEY, rawState);
      applySavedState(JSON.parse(rawState));
    }
    refreshAllAfterSecurityClean();
  } catch (error) {
    console.warn("Could not restore previous saved data.", error);
  }
}

function blockOfflineWriteAction(event) {
  const form = event.target.closest?.("form");
  if (form?.id === "loginOverlayForm") return;
  if (canSaveOnlineNow()) return;
  event.preventDefault();
  event.stopImmediatePropagation();
  showNoInternetSaveWarning();
}

function queueBackendSave(snapshot = getAppStateSnapshot(), rollbackRawState = "") {
  if (backendHydrating) return false;
  if (!canSaveOnlineNow()) {
    showNoInternetSaveWarning();
    if (rollbackRawState) restoreStateFromRaw(rollbackRawState);
    return false;
  }
  backendLastLocalSaveAt = Date.now();
  backendQueuedSnapshot = snapshot;
  backendQueuedRollbackRawState = rollbackRawState || backendQueuedRollbackRawState || "";
  storePendingBackendSnapshot(snapshot);
  setTopbarSaveStatus("saving");
  clearTimeout(backendSaveTimer);
  backendSaveTimer = setTimeout(processBackendSaveQueue, BACKEND_SAVE_DEBOUNCE_MS);
  return true;
}

async function processBackendSaveQueue() {
  backendSaveTimer = null;
  if (backendSaveInFlight || backendHydrating) return;
  if (!backendQueuedSnapshot) return;
  if (!canSaveOnlineNow()) {
    const rollbackRawState = backendQueuedRollbackRawState;
    backendQueuedSnapshot = null;
    backendQueuedRollbackRawState = "";
    localStorage.removeItem(BACKEND_PENDING_STATE_KEY);
    showNoInternetSaveWarning();
    if (rollbackRawState) restoreStateFromRaw(rollbackRawState);
    setTopbarSaveStatus("saved");
    return;
  }
  const snapshot = backendQueuedSnapshot;
  const rollbackRawState = backendQueuedRollbackRawState;
  backendQueuedSnapshot = null;
  backendQueuedRollbackRawState = "";
  backendSaveInFlight = true;
  try {
    setTopbarSaveStatus("saving");
    const hasToken = await ensureBackendToken();
    if (!hasToken) {
      showNoInternetSaveWarning();
      if (!backendQueuedSnapshot && rollbackRawState) restoreStateFromRaw(rollbackRawState);
      return;
    }
    const result = await putBackendState(snapshot);
    markBackendOnline();
    if (result?.updated_at) backendLastUpdatedAt = result.updated_at;
    backendLastLocalSaveAt = Date.now();
    if (!backendQueuedSnapshot) localStorage.removeItem(BACKEND_PENDING_STATE_KEY);
  } catch (error) {
    markBackendConnectionIssue();
    if (!backendQueuedSnapshot) {
      backendQueuedSnapshot = snapshot;
      backendQueuedRollbackRawState = rollbackRawState;
      storePendingBackendSnapshot(snapshot);
    }
    scheduleBackendReconnect();
    showToast("Saved locally. Server sync will retry automatically.", "warning", 6000);
    console.warn(
      backendQueuedSnapshot
        ? "Backend save failed; latest queued change will retry."
        : "Backend save failed; local change rolled back.",
      error
    );
  } finally {
    backendSaveInFlight = false;
    if (backendQueuedSnapshot) {
      storePendingBackendSnapshot(backendQueuedSnapshot);
      clearTimeout(backendSaveTimer);
      backendSaveTimer = setTimeout(processBackendSaveQueue, BACKEND_SAVE_DEBOUNCE_MS);
    } else {
      setTopbarSaveStatus("saved");
    }
  }
}

function saveAppState() {
  try {
    if (!canSaveOnlineNow()) {
      showNoInternetSaveWarning();
      restoreStateFromRaw(localStorage.getItem(STORAGE_KEY) || "");
      return false;
    }
    setTopbarSaveStatus("saving");
    normalizeStudentUserLoginIds();
    normalizeStudentContactFields();
    pruneExpiredHomeworkAttachments();
    const snapshot = getAppStateSnapshot();
    const rollbackRawState = localStorage.getItem(STORAGE_KEY) || "";
    localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
    setTopbarSaveStatus("saved");
    updateTopbarSystemStatus();
    return queueBackendSave(snapshot, rollbackRawState);
  } catch (error) {
    console.warn("Could not save school data.", error);
    return false;
  }
}

function applySavedState(saved = {}) {
  try {
    if (Array.isArray(saved.students)) {
      students.splice(0, students.length, ...saved.students);
    }
    if (saved.financeSessions && typeof saved.financeSessions === "object") {
      Object.keys(financeSessions).forEach(session => delete financeSessions[session]);
      Object.assign(financeSessions, saved.financeSessions);
    }
    if (saved.collectedPayments && typeof saved.collectedPayments === "object") {
      Object.keys(collectedPayments).forEach(session => delete collectedPayments[session]);
      Object.assign(collectedPayments, saved.collectedPayments);
    }
    if (saved.deletedPaymentReceipts && typeof saved.deletedPaymentReceipts === "object") {
      Object.keys(deletedPaymentReceipts).forEach(session => delete deletedPaymentReceipts[session]);
      Object.assign(deletedPaymentReceipts, getDeletedPaymentReceiptMap(saved.deletedPaymentReceipts));
    }
    if (Number(saved.receiptSerial) > 0) {
      receiptSerial = Number(saved.receiptSerial);
    }
    if (Array.isArray(saved.notices)) {
      notices.splice(0, notices.length, ...saved.notices);
    }
    if (Array.isArray(saved.teacherNoticeRequests)) {
      teacherNoticeRequests.splice(0, teacherNoticeRequests.length, ...saved.teacherNoticeRequests);
    }
    if (Array.isArray(saved.teacherLeaves)) {
      teacherLeaves.splice(0, teacherLeaves.length, ...saved.teacherLeaves);
    }
    if (Array.isArray(saved.teacherAdvisories)) {
      teacherAdvisories.splice(0, teacherAdvisories.length, ...saved.teacherAdvisories);
    }
    if (Array.isArray(saved.homework)) {
      homework.splice(0, homework.length, ...saved.homework);
      pruneExpiredHomeworkAttachments();
    }
    if (Array.isArray(saved.homeworkDoubts)) {
      homeworkDoubts.splice(0, homeworkDoubts.length, ...saved.homeworkDoubts);
    }
    if (Array.isArray(saved.admissionEnquiries)) {
      admissionEnquiries.splice(0, admissionEnquiries.length, ...saved.admissionEnquiries);
    }
    if (Array.isArray(saved.complaintRecords)) {
      complaintRecords.splice(0, complaintRecords.length, ...saved.complaintRecords);
    }
    if (Array.isArray(saved.staffMembers)) {
      staffMembers.splice(0, staffMembers.length, ...saved.staffMembers);
    }
    if (Array.isArray(saved.schools)) {
      schools.splice(0, schools.length, ...saved.schools);
    }
    ensureDefaultSchool();
    activeSchoolId = normalizeSchoolId(saved.school_id || saved.schoolId || getLoggedInBackendUser()?.school_id || activeSchoolId || "anps");
    activeSchoolName = saved.schoolName || getSchoolById(activeSchoolId)?.name || activeSchoolName;
    if (Array.isArray(saved.departments)) {
      departments.splice(0, departments.length, ...saved.departments);
    }
    if (Array.isArray(saved.roles)) {
      roles.splice(0, roles.length, ...saved.roles);
    }
    if (Array.isArray(saved.designations)) {
      designations.splice(0, designations.length, ...saved.designations);
    }
    if (Array.isArray(saved.userAccessAccounts)) {
      userAccessAccounts.splice(0, userAccessAccounts.length, ...saved.userAccessAccounts);
    }
    if (Array.isArray(saved.studentUserAccounts)) {
      studentUserAccounts.splice(0, studentUserAccounts.length, ...saved.studentUserAccounts);
    }
    if (Array.isArray(saved.mobileAppActivity)) {
      mobileAppActivity.splice(0, mobileAppActivity.length, ...saved.mobileAppActivity);
    }
    if (Array.isArray(saved.upiPaymentRequests)) {
      upiPaymentRequests.splice(0, upiPaymentRequests.length, ...saved.upiPaymentRequests);
    }
    if (saved.mobileAppSettings && typeof saved.mobileAppSettings === "object") {
      mobileAppSettings.duePopupEnabled = saved.mobileAppSettings.duePopupEnabled !== false;
      mobileAppSettings.dueLockEnabled = saved.mobileAppSettings.dueLockEnabled !== false;
      mobileAppSettings.dueLockDays = Math.max(1, Number(saved.mobileAppSettings.dueLockDays || 75));
      mobileAppSettings.busLocationEnabled = saved.mobileAppSettings.busLocationEnabled !== false;
    }
    if (saved.rolePermissions && typeof saved.rolePermissions === "object") {
      Object.keys(rolePermissions).forEach(role => delete rolePermissions[role]);
      Object.assign(rolePermissions, saved.rolePermissions);
    }
    if (saved.rolePermissionAudit && typeof saved.rolePermissionAudit === "object") {
      Object.keys(rolePermissionAudit).forEach(role => delete rolePermissionAudit[role]);
      Object.assign(rolePermissionAudit, saved.rolePermissionAudit);
    }
    DEFAULT_STAFF_DESIGNATIONS.forEach(name => {
      if (!designations.some(item => String(item.name || "").toLowerCase() === name.toLowerCase())) {
        designations.push({name, department: "", level: ""});
      }
    });
    if (!departments.length) {
      const staffDepartments = [...new Set(staffMembers.map(staff => String(staff.department || "").trim()).filter(Boolean))];
      departments.push(...staffDepartments.map(name => ({name, code: "", head: ""})));
    }
    if (!roles.length) {
      const staffRoles = [...new Set(staffMembers.map(staff => String(staff.role || "").trim()).filter(Boolean))];
      roles.push(...staffRoles.map(name => ({name, type: "", description: ""})));
    }
    ensureProtectedRoles();
    if (!designations.length) {
      const staffDesignations = [...new Set(staffMembers.map(staff => String(staff.designation || "").trim()).filter(Boolean))];
      designations.push(...staffDesignations.map(name => ({name, department: "", level: ""})));
    }
    designations.sort((a, b) => String(a.name || "").localeCompare(String(b.name || "")));
    if (Array.isArray(saved.staffAttendanceRecords)) {
      staffAttendanceRecords.splice(0, staffAttendanceRecords.length, ...saved.staffAttendanceRecords);
    }
    if (Array.isArray(saved.classTimetableEntries)) {
      classTimetableEntries.splice(
        0,
        classTimetableEntries.length,
        ...saved.classTimetableEntries
          .filter(entry => !isMobileOnlyTimetableEntry(entry))
          .map(normalizeMainErpTimetableEntry)
      );
    }
    if (Array.isArray(saved.syllabusEntries)) {
      syllabusEntries.splice(0, syllabusEntries.length, ...saved.syllabusEntries);
    }
    if (Array.isArray(saved.marksheetEntries)) {
      marksheetEntries.splice(0, marksheetEntries.length, ...saved.marksheetEntries);
    } else if (Array.isArray(saved.resultEntries)) {
      marksheetEntries.splice(0, marksheetEntries.length, ...saved.resultEntries.map(item => ({
        ...item,
        studentAdmissionNo: item.studentAdmissionNo || item.studentId || "",
        status: item.status || "Published"
      })));
    }
    if (Array.isArray(saved.externalExamFees)) {
      externalExamFees.splice(0, externalExamFees.length, ...saved.externalExamFees);
    }
    if (Array.isArray(saved.holidayReports)) {
      holidayReports.splice(0, holidayReports.length, ...saved.holidayReports);
    }
    if (Array.isArray(saved.transportRoutes)) {
      transportRoutes.splice(0, transportRoutes.length, ...saved.transportRoutes);
    }
    if (Array.isArray(saved.transportVehicles)) {
      transportVehicles.splice(0, transportVehicles.length, ...saved.transportVehicles);
    }
    if (Array.isArray(saved.transportVehicleAssignments)) {
      transportVehicleAssignments.splice(0, transportVehicleAssignments.length, ...saved.transportVehicleAssignments);
    }
    if (Array.isArray(saved.transportRoutePickupPoints)) {
      transportRoutePickupPoints.splice(0, transportRoutePickupPoints.length, ...saved.transportRoutePickupPoints);
    }
    if (saved.staffBiometricDevice && typeof saved.staffBiometricDevice === "object") {
      Object.assign(staffBiometricDevice, saved.staffBiometricDevice);
    }
    classSectionMasterInitialized = saved.classSectionMasterInitialized === true;
    if (Array.isArray(saved.customAdmissionClasses)) {
      customAdmissionClasses.splice(0, customAdmissionClasses.length, ...saved.customAdmissionClasses.filter(Boolean));
    }
    if (Array.isArray(saved.customAdmissionSections)) {
      customAdmissionSections.splice(0, customAdmissionSections.length, ...saved.customAdmissionSections.filter(Boolean));
    }
    if (Array.isArray(saved.customSubjects)) {
      customSubjects.splice(0, customSubjects.length, ...saved.customSubjects.filter(Boolean));
    }
    if (saved.classSubjectAssignments && typeof saved.classSubjectAssignments === "object") {
      Object.keys(classSubjectAssignments).forEach(className => delete classSubjectAssignments[className]);
      Object.entries(saved.classSubjectAssignments).forEach(([className, subjects]) => {
        if (Array.isArray(subjects)) {
          classSubjectAssignments[className] = [...new Set(subjects.filter(Boolean))];
        }
      });
    }
    if (!classSectionMasterInitialized) {
      customAdmissionClasses.splice(0, customAdmissionClasses.length, ...[...new Set([...DEFAULT_ADMISSION_CLASSES, ...customAdmissionClasses])]);
      customAdmissionSections.splice(0, customAdmissionSections.length, ...[...new Set([...DEFAULT_ADMISSION_SECTIONS, ...customAdmissionSections])]);
      customSubjects.splice(0, customSubjects.length, ...[...new Set([...DEFAULT_SUBJECTS, ...customSubjects])]);
      classSectionMasterInitialized = true;
    }
    if (saved.tuitionFineSetup && typeof saved.tuitionFineSetup === "object") {
      Object.assign(tuitionFineSetup, DEFAULT_TUITION_FINE_SETUP, saved.tuitionFineSetup);
    }
    if (saved.activeSession && financeSessions[saved.activeSession]) {
      activeSession = saved.activeSession;
    }
    if (saved.transportVillageDistances && typeof saved.transportVillageDistances === "object") {
      Object.assign(transportVillageDistances, saved.transportVillageDistances);
    }
    if (saved.transportVillageFees && typeof saved.transportVillageFees === "object") {
      Object.assign(transportVillageFees, saved.transportVillageFees);
    }
    if (saved.transportFineSetup && typeof saved.transportFineSetup === "object") {
      Object.assign(transportFineSetup, DEFAULT_TRANSPORT_FINE_SETUP, saved.transportFineSetup);
    }
    if (Array.isArray(saved.transportVillages)) {
      transportVillages.splice(0, transportVillages.length, ...saved.transportVillages.filter(Boolean));
    }
    if (Array.isArray(saved.customTransportVillages)) {
      saved.customTransportVillages.forEach(village => {
        if (village && !findTransportVillageByName(village)) transportVillages.push(village);
      });
    }
    const fixedTransportVillageNames = applyTransportVillageNameFixes();
    dedupeTransportVillages();
    if (fixedTransportVillageNames) {
      setTimeout(() => saveAppState(), 0);
    }
  } catch (error) {
    console.warn("Could not load saved school data.", error);
  }
}

function loadAppState() {
  try {
    const savedState = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    if (savedState && typeof savedState === "object") {
      savedState.classTimetableEntries = [];
    }
    applySavedState(savedState);
  } catch (error) {
    console.warn("Could not load saved school data.", error);
  }
}

function resetFinanceSessionsForProduction() {
  Object.keys(financeSessions).forEach(session => delete financeSessions[session]);
  Object.assign(financeSessions, {
    "2025-26": {
      feesCollected: "Rs. 0",
      collectionPercent: 0,
      followUps: 0,
      highPriority: 0,
      paid: 0,
      promise: 0,
      overdue: 0,
      summary: "No finance data entered for this session yet.",
      feeMaster: [],
      feeGroups: [],
      dues: []
    },
    "2026-27": {
      feesCollected: "Rs. 0",
      collectionPercent: 0,
      followUps: 0,
      highPriority: 0,
      paid: 0,
      promise: 0,
      overdue: 0,
      summary: "No finance data entered for this session yet.",
      feeMaster: [],
      feeGroups: [],
      dues: []
    }
  });
}

function applyProductionCleanSeedOnce() {
  if (localStorage.getItem(PRODUCTION_CLEAN_KEY) === PRODUCTION_CLEAN_VERSION) return;
  const villageNames = [...new Set([
    ...DEFAULT_TRANSPORT_VILLAGES,
    ...transportVillages
  ].map(village => String(village || "").trim()).filter(Boolean))];
  students.splice(0, students.length);
  attendance.splice(0, attendance.length);
  tasks.splice(0, tasks.length);
  modules.splice(0, modules.length);
  dues.splice(0, dues.length);
  notices.splice(0, notices.length);
  teacherNoticeRequests.splice(0, teacherNoticeRequests.length);
  teacherLeaves.splice(0, teacherLeaves.length);
  teacherAdvisories.splice(0, teacherAdvisories.length);
  homework.splice(0, homework.length);
  homeworkDoubts.splice(0, homeworkDoubts.length);
  admissionEnquiries.splice(0, admissionEnquiries.length);
  complaintRecords.splice(0, complaintRecords.length);
  mobileAppActivity.splice(0, mobileAppActivity.length);
  staffMembers.splice(0, staffMembers.length);
  departments.splice(0, departments.length);
  roles.splice(0, roles.length);
  designations.splice(0, designations.length);
  userAccessAccounts.splice(0, userAccessAccounts.length);
  studentUserAccounts.splice(0, studentUserAccounts.length);
  staffAttendanceRecords.splice(0, staffAttendanceRecords.length);
  classTimetableEntries.splice(0, classTimetableEntries.length);
  syllabusEntries.splice(0, syllabusEntries.length);
  marksheetEntries.splice(0, marksheetEntries.length);
  externalExamFees.splice(0, externalExamFees.length);
  holidayReports.splice(0, holidayReports.length);
  transportRoutes.splice(0, transportRoutes.length);
  transportVehicles.splice(0, transportVehicles.length);
  transportVehicleAssignments.splice(0, transportVehicleAssignments.length);
  transportRoutePickupPoints.splice(0, transportRoutePickupPoints.length);
  selectedHistoryPayments.clear();
  Object.keys(collectedPayments).forEach(session => delete collectedPayments[session]);
  Object.keys(rolePermissions).forEach(role => delete rolePermissions[role]);
  Object.keys(rolePermissionAudit).forEach(role => delete rolePermissionAudit[role]);
  Object.keys(classSubjectAssignments).forEach(className => delete classSubjectAssignments[className]);
  Object.keys(transportVillageDistances).forEach(village => delete transportVillageDistances[village]);
  Object.keys(transportVillageFees).forEach(village => delete transportVillageFees[village]);
  resetFinanceSessionsForProduction();
  activeSession = "2026-27";
  activeFilter = "All";
  activeFeeStudentAdmissionNo = "";
  activeLedgerAdmissionNo = "";
  activeFeeReturnView = "finance";
  receiptSerial = 1;
  currentAdmissionPhoto = "";
  currentStaffPhoto = "";
  staffBiometricDevice.device = "";
  staffBiometricDevice.model = "";
  staffBiometricDevice.note = "";
  staffBiometricDevice.source = "CSV Import";
  customAdmissionClasses.splice(0, customAdmissionClasses.length, ...DEFAULT_ADMISSION_CLASSES);
  customAdmissionSections.splice(0, customAdmissionSections.length, ...DEFAULT_ADMISSION_SECTIONS);
  customSubjects.splice(0, customSubjects.length, ...DEFAULT_SUBJECTS);
  classSectionMasterInitialized = true;
  Object.assign(tuitionFineSetup, DEFAULT_TUITION_FINE_SETUP);
  Object.assign(transportFineSetup, DEFAULT_TRANSPORT_FINE_SETUP);
  transportVillages.splice(0, transportVillages.length, ...villageNames);
  dedupeTransportVillages();
  localStorage.removeItem(SECURITY_BACKUP_KEY);
  DEFAULT_STAFF_DESIGNATIONS.forEach(name => {
    if (!designations.some(item => String(item.name || "").toLowerCase() === name.toLowerCase())) {
      designations.push({name, department: "", level: ""});
    }
  });
  ensureProtectedRoles();
  designations.sort((a, b) => String(a.name || "").localeCompare(String(b.name || "")));
  localStorage.setItem(PRODUCTION_CLEAN_KEY, PRODUCTION_CLEAN_VERSION);
  saveAppState();
}

function getNextReceiptNo() {
  const receiptYear = String(activeSession || new Date().getFullYear()).split("-")[0] || String(new Date().getFullYear());
  const highestUsedSerial = getHighestReceiptSerialForActiveSession(receiptYear);
  if (highestUsedSerial >= receiptSerial) receiptSerial = highestUsedSerial + 1;
  return `ANPS/${receiptYear}-${String(receiptSerial).padStart(3, "0")}`;
}

function setNextReceiptNo() {
  const receiptInput = document.querySelector("#feeForm [name='receiptNo']");
  if (receiptInput) receiptInput.value = getNextReceiptNo();
}

function getReceiptSerial(receiptNo = "", receiptYear = String(activeSession || "").split("-")[0]) {
  const match = String(receiptNo || "").trim().match(/^ANPS\/(\d{4})-(\d+)$/i);
  if (!match || (receiptYear && match[1] !== String(receiptYear))) return 0;
  return Number(match[2] || 0);
}

function getHighestReceiptSerialForActiveSession(receiptYear = String(activeSession || "").split("-")[0]) {
  const sessionPayments = collectedPayments[activeSession] || {};
  return Object.values(sessionPayments).reduce((max, payments) => {
    return Math.max(max, ...(payments || []).map(payment => getReceiptSerial(payment.receipt, receiptYear)));
  }, 0);
}

function isReceiptNoUsed(receiptNo = "", ignoredPaymentId = "") {
  const cleanReceipt = String(receiptNo || "").trim();
  if (!cleanReceipt) return false;
  const sessionPayments = collectedPayments[activeSession] || {};
  return Object.values(sessionPayments).some(payments => (payments || []).some(payment =>
    String(payment.receipt || "").trim() === cleanReceipt &&
    (!ignoredPaymentId || String(payment.id || "") !== String(ignoredPaymentId))
  ));
}

function getReceiptAdmissions(receiptNo = "", ignoredPaymentId = "") {
  const cleanReceipt = String(receiptNo || "").trim();
  const sessionPayments = collectedPayments[activeSession] || {};
  const admissions = new Set();
  Object.entries(sessionPayments).forEach(([admissionNo, payments]) => {
    (payments || []).forEach(payment => {
      if (String(payment.receipt || "").trim() !== cleanReceipt) return;
      if (ignoredPaymentId && String(payment.id || "") === String(ignoredPaymentId)) return;
      admissions.add(normalizeAdmissionNo(admissionNo));
    });
  });
  return admissions;
}

function receiptNoBelongsToAnotherAdmission(receiptNo = "", admissionNo = "", ignoredPaymentId = "") {
  const normalizedAdmissionNo = normalizeAdmissionNo(admissionNo);
  return [...getReceiptAdmissions(receiptNo, ignoredPaymentId)].some(owner => owner !== normalizedAdmissionNo);
}

function getSafeReceiptNoForPayment(admissionNo = "", requestedReceiptNo = "", ignoredPaymentId = "") {
  const receiptYear = String(activeSession || new Date().getFullYear()).split("-")[0] || String(new Date().getFullYear());
  let candidate = String(requestedReceiptNo || "").trim() || getNextReceiptNo();
  let changed = false;
  if (receiptNoBelongsToAnotherAdmission(candidate, admissionNo, ignoredPaymentId) || (!requestedReceiptNo && isReceiptNoUsed(candidate, ignoredPaymentId))) {
    let nextSerial = Math.max(receiptSerial, getHighestReceiptSerialForActiveSession(receiptYear) + 1);
    do {
      candidate = `ANPS/${receiptYear}-${String(nextSerial).padStart(3, "0")}`;
      nextSerial += 1;
    } while (isReceiptNoUsed(candidate, ignoredPaymentId));
    changed = true;
  }
  const usedSerial = getReceiptSerial(candidate, receiptYear);
  if (usedSerial >= receiptSerial) receiptSerial = usedSerial + 1;
  return {receiptNo: candidate, changed};
}

function showToast(message, tone = "default", duration = 2400) {
  toast.textContent = message;
  toast.classList.toggle("error", tone === "error");
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => {
    toast.classList.remove("show");
    toast.classList.remove("error");
  }, duration);
}

function ensureLoginOverlay() {
  let overlay = document.getElementById("loginOverlay");
  if (overlay) return overlay;
  overlay = document.createElement("div");
  overlay.id = "loginOverlay";
  overlay.className = "login-overlay hidden";
  overlay.innerHTML = `
    <form id="loginOverlayForm" class="login-panel">
      <div class="login-brand">
        <img src="./assets/anps-logo.png" alt="Alfred Nobel Public School" />
        <span>Alfred Nobel Public School</span>
      </div>
      <h2>ERP Login</h2>
      <label>
        <span>Login ID</span>
        <input name="username" type="text" autocomplete="username" required />
      </label>
      <label>
        <span>Password</span>
        <span class="login-password-wrap">
          <input name="password" type="password" autocomplete="current-password" required />
          <button class="login-password-toggle" type="button" aria-label="Show password" title="Show password">👁</button>
        </span>
      </label>
      <p id="loginOverlayError" class="login-error"></p>
      <button class="login-forgot-link" type="button">Forgot password?</button>
      <button type="submit">Login</button>
    </form>
  `;
  document.body.appendChild(overlay);
  const passwordInput = overlay.querySelector("input[name='password']");
  const passwordToggle = overlay.querySelector(".login-password-toggle");
  passwordToggle?.addEventListener("click", () => {
    if (!passwordInput) return;
    const showPassword = passwordInput.type === "password";
    passwordInput.type = showPassword ? "text" : "password";
    passwordToggle.textContent = showPassword ? "✕" : "👁";
    passwordToggle.setAttribute("aria-label", showPassword ? "Hide password" : "Show password");
    passwordToggle.title = showPassword ? "Hide password" : "Show password";
    passwordInput.focus();
  });
  overlay.querySelector(".login-forgot-link")?.addEventListener("click", () => {
    const error = overlay.querySelector("#loginOverlayError");
    if (error) {
      error.textContent = "Please contact the Master Admin or Office Admin to reset your password.";
    }
    showToast("Forgot password: please contact the Master Admin or Office Admin.");
  });
  overlay.querySelector("form").addEventListener("submit", async event => {
    event.preventDefault();
    const form = event.currentTarget;
    const error = overlay.querySelector("#loginOverlayError");
    error.textContent = "";
    const username = String(form.elements.username.value || "").trim();
    const password = String(form.elements.password.value || "");
    try {
      const response = await backendFetch("/api/login", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({username, password})
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || !result?.token) {
        error.textContent = "Invalid login ID or password.";
        return;
      }
      localStorage.setItem(BACKEND_TOKEN_KEY, result.token);
      localStorage.removeItem(BACKEND_LOGGED_OUT_KEY);
      if (result.user) localStorage.setItem(BACKEND_USER_KEY, JSON.stringify(result.user));
      syncActiveSchoolFromUser(result.user);
      overlay.classList.add("hidden");
      backendSyncReady = true;
      updateTopbarSystemStatus();
      await initializeBackendSync();
      showToast("Login successful.");
    } catch (err) {
      error.textContent = "Login failed. Please try again.";
    }
  });
  return overlay;
}

function showLoginOverlay() {
  const overlay = ensureLoginOverlay();
  overlay.classList.remove("hidden");
  setTimeout(() => overlay.querySelector("input[name='username']")?.focus(), 50);
}

function getLoggedInBackendUser() {
  try {
    return JSON.parse(localStorage.getItem(BACKEND_USER_KEY) || "null") || null;
  } catch {
    return null;
  }
}

function getSchoolById(schoolId = activeSchoolId) {
  const cleanId = normalizeSchoolId(schoolId);
  return schools.find(school => normalizeSchoolId(school.school_id || school.id) === cleanId) || schools[0] || null;
}

function syncActiveSchoolFromUser(user = getLoggedInBackendUser()) {
  const schoolId = normalizeSchoolId(user?.school_id || user?.schoolId || activeSchoolId || "anps");
  const school = getSchoolById(schoolId);
  activeSchoolId = schoolId;
  activeSchoolName = user?.school_name || user?.schoolName || school?.name || activeSchoolName || "Alfred Nobel Public School";
}

function getCurrentTopbarRole() {
  const user = getLoggedInBackendUser();
  return user?.role_name || user?.role || "Not Logged In";
}

function getCurrentCollectorRoleName() {
  return getCurrentTopbarRole() || "Admin";
}

function isProtectedRoleName(roleName = "") {
  const cleanRole = String(roleName || "").trim().toLowerCase();
  return PROTECTED_ROLE_NAMES.some(name => name.toLowerCase() === cleanRole);
}

function isCurrentRoleAdmin() {
  return isProtectedRoleName(getCurrentTopbarRole()) || /admin|administrator|principal/i.test(getCurrentTopbarRole());
}

function canCurrentRoleAccessView(viewName = "") {
  if (!viewName || viewName === "dashboard" || isCurrentRoleAdmin()) return true;
  const permissions = normalizeRolePermission(getCurrentTopbarRole());
  return permissions?.[viewName]?.view !== false;
}

function canCurrentRoleAccessModule(moduleId = "", action = "view") {
  if (!moduleId || isCurrentRoleAdmin()) return true;
  const permissions = normalizeRolePermission(getCurrentTopbarRole());
  return permissions?.[moduleId]?.[action] === true;
}

function updateRoleBasedNavigation() {
  navButtons.forEach(button => {
    const viewName = button.dataset.view;
    const isAllowed = canCurrentRoleAccessView(viewName);
    button.hidden = !isAllowed;
    button.disabled = !isAllowed;
  });
  document.querySelectorAll(".nav-group").forEach(group => {
    const childButtons = [...group.querySelectorAll("[data-view]")];
    const hasVisibleChild = childButtons.some(button => !button.hidden && !button.disabled);
    const toggle = group.querySelector(".nav-group-title");
    group.hidden = !hasVisibleChild;
    if (!hasVisibleChild) {
      group.classList.remove("open");
      toggle?.setAttribute("aria-expanded", "false");
    }
  });
}

function setTopbarSaveStatus(status = "saved") {
  const button = document.getElementById("topbarSaveStatus");
  if (!button) return;
  const isSaving = status === "saving";
  button.textContent = isSaving ? "Saving..." : "Saved";
  button.classList.toggle("saving", isSaving);
}

function setTopbarNetworkStatus(status = navigator.onLine ? "checking" : "offline") {
  const node = document.getElementById("topbarNetworkStatus");
  if (!node) return;
  const label = node.querySelector("strong");
  const visibleStatus = navigator.onLine && status !== "offline" ? "online" : "offline";
  node.classList.toggle("online", visibleStatus === "online");
  node.classList.toggle("offline", visibleStatus === "offline");
  node.classList.toggle("checking", false);
  if (label) label.textContent = visibleStatus === "online" ? "Online" : "Offline";
  node.title = visibleStatus === "online"
    ? "Software is online and connected to server."
    : "Software is offline or server connection is unavailable.";
}

function markBackendOnline() {
  backendNetworkFailCount = 0;
  backendLastHealthOkAt = Date.now();
  clearTimeout(backendReconnectTimer);
  backendReconnectTimer = null;
  setTopbarNetworkStatus("online");
}

function markBackendConnectionIssue() {
  backendNetworkFailCount += 1;
  const hasRecentBackendHealth = Date.now() - backendLastHealthOkAt < BACKEND_HEALTH_GRACE_MS;
  if (!navigator.onLine || (backendNetworkFailCount >= BACKEND_OFFLINE_FAIL_THRESHOLD && !hasRecentBackendHealth)) {
    setTopbarNetworkStatus("offline");
  } else {
    setTopbarNetworkStatus("checking");
  }
}

function scheduleBackendReconnect() {
  if (backendReconnectTimer || !localStorage.getItem(BACKEND_TOKEN_KEY)) return;
  backendReconnectTimer = setTimeout(() => {
    backendReconnectTimer = null;
    initializeBackendSync();
  }, 3000);
}

function updateTopbarSystemStatus() {
  const role = document.getElementById("topbarCurrentRole");
  const alerts = document.getElementById("topbarAlerts");
  syncActiveSchoolFromUser();
  if (role) {
    role.textContent = getCurrentTopbarRole();
    role.title = `${activeSchoolName} (${activeSchoolId})`;
  }
  updateRoleBasedNavigation();
  if (alerts) {
    const report = typeof getSystemHealthReport === "function" ? getSystemHealthReport() : {issues: []};
    const issues = report.issues || [];
    alerts.textContent = `Alerts: ${issues.length}`;
    alerts.classList.toggle("has-alerts", issues.length > 0);
    alerts.title = issues.length ? issues.map(issue => `${issue.type}: ${issue.title}`).join("\n") : "No current system health alert.";
  }
}

function renderDashboardOnly() {
  renderBars();
  renderDailyCashTrendChart();
  renderTasks();
  renderModules();
  renderSessions();
  renderFinanceSession(false);
  updateTopbarSystemStatus();
}

function renderActiveView(viewName = document.querySelector(".view.active")?.id || "dashboard") {
  if (viewName === "dashboard") {
    renderDashboardOnly();
    return;
  }
  if (viewName === "students") renderStudents();
  if (viewName === "studentAdmission") {
    renderAdmissionVillageTownOptions();
    renderAdmissionSectionOptions();
    renderFeeMasterClassOptions();
  }
  if (viewName === "finance") {
    renderFinanceSession(true);
    renderStudentFeeCounter();
    renderFeeBookStudentOptions();
    renderFeeBook(activeLedgerAdmissionNo || activeFeeStudentAdmissionNo);
  }
  if (viewName === "feeBook") {
    renderFeeBookStudentOptions();
    renderFeeBook();
  }
  if (viewName === "bankBook") renderBankBook();
  if (viewName === "bankReconciliation") renderBankReconciliation([]);
  if (viewName === "dueFeesSearch") renderDueFeesSearch();
  if (viewName === "upiPaymentVerification") renderUpiPaymentVerification();
  if (viewName === "feeMaster") renderFeeMaster();
  if (viewName === "feeGroup") renderFeeGroups();
  if (viewName === "feeReminder") renderStudentDueAccessSettings();
  if (viewName === "addClassSection") renderClassSectionSetup();
  if (viewName === "tuitionFineSetup") renderTuitionFineSetup();
  if (viewName === "transportPickupPoint") renderTransportVillages();
  if (viewName === "transportRoute") renderTransportRoutes();
  if (viewName === "transportVehicle") renderTransportVehicles();
  if (viewName === "transportAssignVehicle") renderTransportVehicleAssignments();
  if (viewName === "transportRoutePickupPoint") renderTransportRoutePickupPoints();
  if (viewName === "transportFineSetup") renderTransportFineSetup();
  if (viewName === "studentTransportFees") renderStudentTransportFees();
  if (viewName === "nonTransportStudents") renderNonTransportStudents();
  if (viewName === "smartBusTracking") renderSmartBusTracking();
  if (viewName === "staffDetails") renderStaffDetails();
  if (viewName === "department") renderHrSetup();
  if (viewName === "staffAttendance") renderStaffAttendance();
  if (viewName === "approveLeave") renderLeaveApprovalRequests();
  if (viewName === "teacherAdvisory") renderTeacherAdvisory();
  if (viewName === "disableStudent") renderDisabledStudents();
  if (viewName === "noticeBoard") renderNoticeBoard();
  if (viewName === "teacherNoticeRequests") renderTeacherNoticeRequests();
  if (viewName === "addHomework" || viewName === "teacherHomework" || viewName === "dailyAssignment" || viewName === "homeworkDoubts") renderHomeworkModule();
  if (viewName === "complaintsDesk") renderComplaintsDesk();
  if (viewName === "admissionEnquiry") renderAdmissionEnquiryModule();
  if (viewName === "classTimetable") renderClassTimetable();
  if (viewName === "teacherTimetable") renderTeacherTimetable();
  if (viewName === "classTeacherAssignment") renderClassTeacherAssignment();
  if (viewName === "syllabus") renderSyllabusModule();
  if (viewName === "marksheet") renderMarksheetModule();
  if (viewName === "externalExamFees") renderExternalExamFees();
  if (viewName === "academicProfile") renderAcademicProfileModule();
  if (viewName === "holidayReport") renderHolidayReport();
  if (viewName === "annualCalendar") renderAnnualCalendar();
  if (viewName === "studentIdCard") renderStudentIdCardModule();
  if (viewName === "teacherIdCard") renderTeacherIdCardModule();
  if (viewName === "userAccessSettings") renderUserAccessSettings();
  if (viewName === "studentUserLogin") renderStudentUserLogin();
  if (viewName === "mobileAppActivity") renderMobileAppActivity();
  if (viewName === "securityMaintenance") renderSecurityMaintenance();
  if (viewName === "securityDuplicateReceipts") renderDuplicateReceiptUtility();
  if (viewName === "securityAlertSolver") renderAlertSolverPage();
  if (viewName === "securityRoleHealth") renderRolePermissionHealth();
  if (viewName === "masterAdmin") renderMasterAdminSettings();
  if (viewName === "schoolManagement") renderSchoolManagement();
  if (viewName === "reportStudentInformation") {
    renderClassSectionReport();
    renderStudentGenderRatioReport();
    renderStudentTeacherRatioReport();
  }
}

function setView(viewName, options = {}) {
  if (!canCurrentRoleAccessView(viewName)) {
    showToast(`${getCurrentTopbarRole()} role does not have access to ${titleMap[viewName] || viewName}.`);
    return;
  }
  const currentView = document.querySelector(".view.active")?.id || "";
  if (!options.skipHistory && currentView && currentView !== viewName) {
    viewHistoryStack.push(currentView);
    if (viewHistoryStack.length > 25) viewHistoryStack.shift();
  }
  views.forEach(view => view.classList.toggle("active", view.id === viewName));
  navButtons.forEach(button => button.classList.toggle("active", button.dataset.view === viewName));
  pageTitle.textContent = titleMap[viewName] || "Dashboard";
  renderActiveView(viewName);
  if (viewName === "admissionEnquiry") {
    renderAdmissionEnquiryModule();
  }
  if (viewName === "complaintRegister") {
    if (complaintRegisterForm && !complaintRegisterForm.elements.date.value) complaintRegisterForm.elements.date.value = toDateInputValue(new Date());
  }
  if (viewName === "complaintsDesk") {
    renderComplaintsDesk();
  }
  if (viewName === "dailyCollectionReport") {
    renderDailyCollectionReport();
  }
  if (viewName === "entireSchoolFeesReport") {
    const yearlyPanel = document.getElementById("entireSchoolYearlyFeesPanel");
    if (yearlyPanel && !yearlyPanel.hidden) renderEntireSchoolYearlyFeesReport();
    else renderEntireSchoolFeesReport();
  }
  if (viewName === "classTimetable") {
    setClassTimetableBuilderVisible(false);
  }
  if (viewName === "teacherTimetable") {
    renderTeacherTimetable();
  }
  if (viewName === "classTeacherAssignment") {
    renderClassTeacherAssignment();
  }
  if (viewName === "syllabus") {
    renderSyllabusModule();
  }
  if (viewName === "teacherComplaint") {
    if (teacherComplaintForm && !teacherComplaintForm.elements.date.value) {
      teacherComplaintForm.elements.date.value = toDateInputValue(new Date());
      const activeStaff = getActiveTeacherStaff();
      if (activeStaff?.name) teacherComplaintForm.elements.personName.value = activeStaff.name;
    }
  }
  if (viewName === "holidayReport") {
    renderHolidayReport();
  }
  if (viewName === "annualCalendar") {
    renderAnnualCalendar();
  }
  if (viewName === "studentIdCard") {
    renderStudentIdCardModule();
  }
  if (viewName === "teacherIdCard") {
    renderTeacherIdCardModule();
  }
  if (viewName === "masterAdmin") {
    renderMasterAdminSettings();
  }
  if (viewName === "schoolManagement") {
    renderSchoolManagement();
  }
  if (viewName === "userAccessSettings") {
    renderUserAccessSettings();
  }
  if (viewName === "studentUserLogin") {
    renderStudentUserLogin();
  }
  if (viewName === "securityMaintenance") {
    renderSecurityMaintenance();
  }
  if (viewName === "securityDuplicateReceipts") {
    renderDuplicateReceiptUtility();
  }
  if (viewName === "securityAlertSolver") {
    renderAlertSolverPage();
  }
  if (viewName === "securityRoleHealth") {
    renderRolePermissionHealth();
  }
  if (viewName === "studentTransportFees") {
    renderStudentTransportFees();
  }
  if (viewName === "nonTransportStudents") {
    renderNonTransportStudents();
  }
  if (viewName === "smartBusTracking") {
    renderSmartBusTracking();
  }
  document.body.classList.remove("nav-open");
}

function openPreviousViewFromHistory() {
  while (viewHistoryStack.length) {
    const previousView = viewHistoryStack.pop();
    if (previousView && previousView !== "feeBook" && canCurrentRoleAccessView(previousView)) {
      setView(previousView, {skipHistory: true});
      showToast(`${titleMap[previousView] || "Previous page"} opened.`);
      return true;
    }
  }
  if (canCurrentRoleAccessView("dashboard")) {
    setView("dashboard", {skipHistory: true});
    showToast("Dashboard opened.");
    return true;
  }
  return false;
}

function openFeeBookReturnPage() {
  if (feeBookReturnStudentAdmissionNo && canCurrentRoleAccessView("students")) {
    setView("students", {skipHistory: true});
    showToast("Student Details opened.");
    return true;
  }
  return openPreviousViewFromHistory();
}

function setClassTimetableBuilderVisible(isVisible) {
  const panel = document.getElementById("classTimetableBuilderPanel");
  const overview = document.getElementById("classTimetableOverviewPanel");
  if (panel) panel.hidden = !isVisible;
  if (overview) overview.hidden = isVisible;
  if (isVisible) {
    renderClassTimetableOptions();
    loadTimetableBuilderForSelection();
  }
}

function getSourceView(element) {
  const view = element && element.closest(".view");
  return view ? view.id : "finance";
}

function getAdmissionNoSessionCode() {
  const session = String(activeSession || "2026-27").trim();
  const match = session.match(/^20(\d{2})-(\d{2})$/);
  return match ? `${match[1]}-${match[2]}` : session;
}

function getAdmissionNoPrefix() {
  return `ANPS-ADM/${getAdmissionNoSessionCode()}/`;
}

function getAdmissionNoPrefixFromFullNo(fullNo = "") {
  const clean = String(fullNo || "").trim().replace(/\s*\/\s*/g, "/");
  const match = clean.match(/^(ANPS-ADM\/[^/]+\/)/i);
  return match ? match[1].toUpperCase() : "";
}

function getAdmissionSerialInput() {
  return admissionForm?.elements?.admissionSerial || document.getElementById("admissionNoSerial");
}

function getAdmissionSerialFromFullNo(fullNo = "") {
  const clean = String(fullNo || "").trim().replace(/\s*\/\s*/g, "/");
  const prefix = getAdmissionNoPrefixFromFullNo(clean) || getAdmissionNoPrefix();
  if (!clean) return "";
  if (clean.startsWith(prefix)) return clean.slice(prefix.length);
  return (clean.split("/").pop() || clean).trim();
}

function setAdmissionNumberInputs(fullNo = "") {
  const prefix = getAdmissionNoPrefixFromFullNo(fullNo) || getAdmissionNoPrefix();
  const prefixNode = document.getElementById("admissionNoPrefix");
  const previewNode = document.getElementById("admissionNoFullPreview");
  const serialInput = getAdmissionSerialInput();
  if (prefixNode) prefixNode.textContent = prefix;
  if (serialInput) serialInput.value = getAdmissionSerialFromFullNo(fullNo);
  if (admissionForm?.elements?.admissionNo) {
    const serial = serialInput ? String(serialInput.value || "").trim() : "";
    admissionForm.elements.admissionNo.value = serial ? `${prefix}${serial}` : "";
    if (previewNode) previewNode.textContent = admissionForm.elements.admissionNo.value || prefix;
  }
}

function getAdmissionNumberFromForm() {
  const serialInput = getAdmissionSerialInput();
  const serial = String(serialInput?.value || "").trim();
  const prefix = document.getElementById("admissionNoPrefix")?.textContent || getAdmissionNoPrefix();
  const admissionNo = serial ? `${prefix}${serial}` : "";
  if (admissionForm?.elements?.admissionNo) admissionForm.elements.admissionNo.value = admissionNo;
  const previewNode = document.getElementById("admissionNoFullPreview");
  if (previewNode) previewNode.textContent = admissionNo || prefix;
  return admissionNo;
}

function syncLocalGuardianFromParent(source = "") {
  const sourceInputs = [...admissionForm.querySelectorAll("[name='localGuardianSame']")];
  sourceInputs.forEach(input => {
    input.checked = input.value === source && input.checked;
  });
  const selected = sourceInputs.find(input => input.checked)?.value || "";
  updateLocalGuardianNameLabel(selected);
  if (selected === "Father") {
    admissionForm.elements.guardianName.value = admissionForm.elements.fatherName.value || "";
    admissionForm.elements.mobile.value = admissionForm.elements.fatherMobile.value || "";
    admissionForm.elements.email.value = admissionForm.elements.fatherEmail.value || "";
  }
  if (selected === "Mother") {
    admissionForm.elements.guardianName.value = admissionForm.elements.motherName.value || "";
    admissionForm.elements.mobile.value = admissionForm.elements.motherMobile.value || "";
    admissionForm.elements.email.value = admissionForm.elements.motherEmail.value || "";
  }
}

function updateLocalGuardianNameLabel(source = "") {
  const label = document.getElementById("localGuardianNameLabel");
  if (!label) return;
  label.textContent = source === "Father" ? "Father Name" : source === "Mother" ? "Mother Name" : "Guardian Name";
}

function openAdmissionForm() {
  editingAdmissionNo = "";
  admissionForm.reset();
  updateLocalGuardianNameLabel("");
  setAdmissionNumberInputs();
  setAdmissionFeeFieldsLocked(false);
  renderAdmissionClassOptions();
  renderAdmissionSectionOptions();
  renderAdmissionStudentTypeOptions();
  renderAdmissionVillageTownOptions();
  currentAdmissionPhoto = "";
  renderAdmissionPhotoPreview();
  setAdmissionMonthGroups();
  admissionError.textContent = "";
  getAdmissionSerialInput()?.classList.remove("field-error");
  admissionModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  setTimeout(() => admissionForm.elements.studentName.focus(), 0);
}

function renderAdmissionPhotoPreview() {
  const preview = document.getElementById("studentPhotoPreview");
  if (!preview) return;
  if (currentAdmissionPhoto) {
    preview.innerHTML = `<img src="${currentAdmissionPhoto}" alt="Student photo preview" />`;
    preview.classList.add("has-photo");
  } else {
    preview.textContent = "Photo";
    preview.classList.remove("has-photo");
  }
}

function renderStaffPhotoPreview() {
  const preview = document.getElementById("staffPhotoPreview");
  if (!preview) return;
  if (currentStaffPhoto) {
    preview.innerHTML = `<img src="${currentStaffPhoto}" alt="Staff photo preview" />`;
    preview.classList.add("has-photo");
  } else {
    preview.textContent = "Photo";
    preview.classList.remove("has-photo");
  }
}

function focusAdmissionTransportSection() {
  const section = admissionForm.querySelector(".other-fees-fieldset");
  const transportInput = admissionForm.elements.transportFee;
  if (!section) return;
  section.classList.add("transport-section-focus");
  setTimeout(() => {
    section.scrollIntoView({behavior: "smooth", block: "center"});
    transportInput?.focus({preventScroll: true});
  }, 80);
  setTimeout(() => section.classList.remove("transport-section-focus"), 1800);
}

function openStudentEditForm(admissionNo, focusSection = "") {
  const student = findStudentByAdmissionNo(admissionNo);
  if (!student) return;
  editingAdmissionNo = student.admissionNo || "";
  admissionError.textContent = "";
  getAdmissionSerialInput()?.classList.remove("field-error");
  setAdmissionNumberInputs(student.admissionNo || "");
  admissionForm.elements.studentName.value = student.name || "";
  admissionForm.elements.dob.value = formatDateDDMMYYYY(student.dob || "");
  setSelectValue(admissionForm.elements.gender, student.gender || "");
  renderAdmissionClassOptions();
  renderAdmissionSectionOptions();
  renderAdmissionStudentTypeOptions(student.studentType || "New Student");
  renderAdmissionVillageTownOptions(student.villageTown || "");
  const {klass, section} = splitStudentClassSection(student.klass || "");
  setSelectValue(admissionForm.elements.klass, klass || "");
  setSelectValue(admissionForm.elements.section, section || "");
  setSelectValue(admissionForm.elements.studentType, student.studentType || "New Student");
  setSelectValue(admissionForm.elements.bloodGroup, student.bloodGroup || "");
  setSelectValue(admissionForm.elements.nationality, student.nationality || "Indian");
  setSelectValue(admissionForm.elements.religion, student.religion || "");
  setSelectValue(admissionForm.elements.motherTongue, student.motherTongue || "");
  setSelectValue(admissionForm.elements.villageTown, student.villageTown || "");
  admissionForm.elements.fatherName.value = student.fatherName || "";
  admissionForm.elements.fatherQualification.value = student.fatherQualification || "";
  setSelectValue(admissionForm.elements.fatherWorkType, student.fatherWorkType || "");
  admissionForm.elements.fatherAnnualIncome.value = student.fatherAnnualIncome || "";
  admissionForm.elements.fatherMobile.value = student.fatherMobile || "";
  admissionForm.elements.fatherEmail.value = student.fatherEmail || "";
  admissionForm.elements.motherName.value = student.motherName || "";
  admissionForm.elements.motherOccupation.value = student.motherOccupation || "";
  admissionForm.elements.motherQualification.value = student.motherQualification || "";
  setSelectValue(admissionForm.elements.motherWorkType, student.motherWorkType || "");
  admissionForm.elements.motherAnnualIncome.value = student.motherAnnualIncome || "";
  admissionForm.elements.motherMobile.value = student.motherMobile || "";
  admissionForm.elements.motherEmail.value = student.motherEmail || "";
  admissionForm.elements.guardianName.value = student.guardian || "";
  admissionForm.elements.mobile.value = student.mobile || "";
  admissionForm.elements.email.value = student.email || "";
  const localGuardianSource = student.guardian && student.guardian === student.fatherName
    ? "Father"
    : student.guardian && student.guardian === student.motherName
      ? "Mother"
      : "";
  updateLocalGuardianNameLabel(localGuardianSource);
  admissionForm.elements.route.value = student.route || "Self";
  admissionForm.elements.transportRequired.checked = studentTakesTransport(student);
  admissionForm.elements.fee.value = student.fee || "Due";
  admissionForm.elements.address.value = student.address || "";
  admissionForm.elements.medicalConditions.value = student.medicalConditions || "";
  admissionForm.elements.allergies.value = student.allergies || "";
  admissionForm.elements.regularMedicine.value = student.regularMedicine || "";
  admissionForm.elements.emergencyContactNumber.value = student.emergencyContactNumber || "";
  admissionForm.elements.admissionFee.value = student.admissionFee || "";
  admissionForm.elements.annualFee.value = student.annualFee || "";
  admissionForm.elements.formFee.value = student.formFee || "";
  admissionForm.elements.tuitionFee.value = student.tuitionFee || "";
  setAdmissionFeeFieldsLocked(!!getFeeMasterForClass(klass, student.studentType || "New Student"));
  admissionForm.elements.specialTransportFee.value = student.specialTransportFee || "";
  admissionForm.elements.transportFee.value = student.transportFee || "";
  admissionForm.elements.dayBoardingFee.value = student.dayBoardingFee || "";
  admissionForm.elements.dayBoardingTransportFee.value = student.dayBoardingTransportFee || "";
  admissionForm.elements.roboticsFee.value = student.roboticsFee || "";
  admissionForm.elements.othersFee.value = student.othersFee || "";
  setCheckedValues("otherServices", student.otherServices || []);
  admissionForm.elements.transportRequired.checked = studentTakesTransport(student);
  syncTransportServiceCheckbox(admissionForm.elements.transportRequired.checked);
  syncExclusiveTransportServices((student.otherServices || []).includes("Special/Custom") ? "Special/Custom" : "Transport");
  updateAdmissionTransportFee();
  currentAdmissionPhoto = student.photo || "";
  renderAdmissionPhotoPreview();
  setAdmissionMonthGroups(student);
  admissionModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  if (focusSection === "transport") focusAdmissionTransportSection();
  else setTimeout(() => admissionForm.elements.studentName.focus(), 0);
}

function closeAdmissionForm() {
  editingAdmissionNo = "";
  admissionModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
}

function normalizeAdmissionNo(value) {
  const clean = String(value || "").trim().replace(/\s*\/\s*/g, "/").replace(/\s+/g, "");
  const match = clean.match(/^(anps-adm\/[^/]+\/)(.+)$/i);
  if (match) {
    const serial = match[2].trim();
    const canonicalSerial = /^\d+$/.test(serial) ? String(Number(serial)) : serial.toLowerCase();
    return `${match[1].toLowerCase()}${canonicalSerial}`;
  }
  return clean.toLowerCase();
}

function findStudentByAdmissionNo(admissionNo) {
  const normalizedAdmissionNo = normalizeAdmissionNo(admissionNo);
  return students.find(student => normalizeAdmissionNo(student.admissionNo) === normalizedAdmissionNo);
}

function isStudentDisabled(student) {
  return Boolean(student && student.disabled);
}

function getActiveStudents() {
  return students.filter(student => !isStudentDisabled(student));
}

function findActiveStudentByAdmissionNo(admissionNo) {
  const student = findStudentByAdmissionNo(admissionNo);
  return isStudentDisabled(student) ? null : student;
}

function findActiveStudentByAdmissionOrName(value) {
  const clean = String(value || "").trim();
  if (!clean) return null;
  const cleanLower = clean.toLowerCase();
  const compact = normalizeDueSearchText(clean);
  return findActiveStudentByAdmissionNo(clean)
    || getActiveStudents().find(student => getAdmissionSearchTokens(student.admissionNo || "").some(token => token === cleanLower || (compact && (token === compact || token.endsWith(compact)))))
    || getActiveStudents().find(student => String(student.name || "").trim().toLowerCase() === cleanLower)
    || null;
}

function getAdmissionNoSerialPart(value = "") {
  const normalized = normalizeAdmissionNo(value);
  const parts = normalized.split("/");
  const serial = parts[parts.length - 1] || normalized;
  return /^\d+$/.test(serial) ? String(Number(serial)) : "";
}

function arePaymentAdmissionKeysRelated(first = "", second = "") {
  const normalizedFirst = normalizeAdmissionNo(first);
  const normalizedSecond = normalizeAdmissionNo(second);
  if (!normalizedFirst || !normalizedSecond) return false;
  if (normalizedFirst === normalizedSecond) return true;
  const firstSerial = getAdmissionNoSerialPart(first);
  const secondSerial = getAdmissionNoSerialPart(second);
  if (!firstSerial || firstSerial !== secondSerial) return false;
  return normalizedFirst === firstSerial || normalizedSecond === secondSerial;
}

function renderStudentDueAccessSettings() {
  const form = document.getElementById("studentDueAccessForm");
  const preview = document.getElementById("studentDueAccessPreview");
  const title = document.getElementById("dueLockTitle");
  if (!form) return;
  form.elements.duePopupEnabled.checked = mobileAppSettings.duePopupEnabled !== false;
  form.elements.dueLockEnabled.checked = mobileAppSettings.dueLockEnabled !== false;
  const lockDays = Math.max(1, Number(mobileAppSettings.dueLockDays || 75));
  form.elements.dueLockDays.value = lockDays;
  if (title) title.textContent = `${lockDays}-Day App Lock`;
  if (preview) {
    const popupText = mobileAppSettings.duePopupEnabled !== false ? "ON" : "OFF";
    const lockText = mobileAppSettings.dueLockEnabled !== false ? `${lockDays} days` : "OFF";
    preview.innerHTML = `
      <strong>Current:</strong>
      <span>Popup ${popupText}</span>
      <span>App lock ${lockText}</span>
      <small>The student app unlocks automatically after the payment is cleared and the app is synced or reopened.</small>
    `;
  }
}

function renderStudentAppGlobalControls() {
  const form = document.getElementById("studentAppGlobalForm");
  const summary = document.getElementById("studentAppGlobalSummary");
  if (!form) return;
  const enabled = mobileAppSettings.busLocationEnabled !== false;
  form.elements.busLocationEnabled.checked = enabled;
  if (summary) {
    summary.textContent = enabled ? "Bus Location ON" : "Bus Location OFF";
    summary.classList.toggle("stable", enabled);
    summary.classList.toggle("danger", !enabled);
  }
}

function syncDueLockTitleFromInput() {
  const input = document.querySelector("#studentDueAccessForm [name='dueLockDays']");
  const title = document.getElementById("dueLockTitle");
  if (!input || !title) return;
  const days = Math.max(1, Number(input.value || mobileAppSettings.dueLockDays || 75));
  title.textContent = `${days}-Day App Lock`;
}

function setSelectValue(select, value) {
  const cleanValue = String(value || "").trim();
  if (!cleanValue) {
    select.value = "";
    return;
  }
  if (![...select.options].some(option => option.value === cleanValue || option.textContent === cleanValue)) {
    select.add(new Option(cleanValue, cleanValue));
  }
  select.value = cleanValue;
}

function getAdmissionClassOptions() {
  return customAdmissionClasses.length ? customAdmissionClasses : DEFAULT_ADMISSION_CLASSES;
}

function renderAdmissionClassOptions(selectedValue = admissionForm.elements.klass?.value || "") {
  const classes = getAdmissionClassOptions();
  admissionForm.elements.klass.innerHTML = `<option value="">Select</option>${classes.map(className => `<option>${escapeHtml(className)}</option>`).join("")}`;
  if (selectedValue) setSelectValue(admissionForm.elements.klass, selectedValue);
}

function getAdmissionSectionOptions() {
  return customAdmissionSections.length ? customAdmissionSections : DEFAULT_ADMISSION_SECTIONS;
}

function getSubjectOptions() {
  return customSubjects.length ? customSubjects : DEFAULT_SUBJECTS;
}

function getAssignedSubjectsForClass(className = "") {
  const assigned = classSubjectAssignments[String(className || "").trim()];
  return Array.isArray(assigned) ? assigned.filter(Boolean) : [];
}

function getTimetableSubjectsForClass(className = "") {
  const assigned = getAssignedSubjectsForClass(className);
  return assigned.length ? assigned : getSubjectOptions();
}

function renderSubjectAssignmentSetup(selectedValue = document.getElementById("subjectAssignClass")?.value || "") {
  const classSelect = document.getElementById("subjectAssignClass");
  const subjectList = document.getElementById("subjectAssignList");
  const rows = document.getElementById("subjectAssignRows");
  const summary = document.getElementById("subjectAssignSummary");
  const classes = getAdmissionClassOptions();
  const subjects = getSubjectOptions();
  if (classSelect) {
    const selected = selectedValue && classes.includes(selectedValue) ? selectedValue : (classes[0] || "");
    classSelect.innerHTML = `<option value="">Select class</option>${classes.map(className => `<option value="${escapeHtml(className)}">${escapeHtml(className)}</option>`).join("")}`;
    if (selected) classSelect.value = selected;
  }
  const activeClass = classSelect?.value || "";
  const assigned = new Set(getAssignedSubjectsForClass(activeClass));
  if (subjectList) {
    subjectList.innerHTML = subjects.length ? subjects.map((subject, index) => {
      const id = `subjectAssign-${index}-${subject.replace(/[^a-z0-9]+/gi, "-")}`;
      return `
        <label class="subject-assign-choice" for="${escapeHtml(id)}">
          <input id="${escapeHtml(id)}" type="checkbox" name="subjects" value="${escapeHtml(subject)}" ${assigned.has(subject) ? "checked" : ""} />
          <span>${escapeHtml(subject)}</span>
        </label>
      `;
    }).join("") : `<small>No subjects added yet.</small>`;
  }
  const assignedEntries = classes
    .map(className => ({className, subjects: getAssignedSubjectsForClass(className)}))
    .filter(entry => entry.subjects.length);
  if (rows) {
    rows.innerHTML = assignedEntries.map(entry => `
      <tr>
        <td><strong>${escapeHtml(entry.className)}</strong></td>
        <td><div class="subject-chip-list">${entry.subjects.map(subject => `<span>${escapeHtml(subject)}</span>`).join("")}</div></td>
        <td>${entry.subjects.length}</td>
        <td>
          <button class="icon-action edit" type="button" data-edit-subject-assign="${escapeHtml(entry.className)}" title="Edit assignment" aria-label="Edit ${escapeHtml(entry.className)} subject assignment">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20h4.7L19.3 9.4a2.1 2.1 0 0 0 0-3L17.6 4.7a2.1 2.1 0 0 0-3 0L4 15.3V20Zm3.8-2H6v-1.8l8.5-8.5 1.8 1.8L7.8 18Zm7.9-11.5.4-.4 1.8 1.8-.4.4-1.8-1.8Z"/></svg>
          </button>
        </td>
      </tr>
    `).join("") || `<tr><td colspan="4">No class subject assignment yet.</td></tr>`;
  }
  if (summary) summary.textContent = `${assignedEntries.length} class assigned`;
}

function renderAdmissionSectionOptions(selectedValue = admissionForm.elements.section?.value || "") {
  const sections = getAdmissionSectionOptions();
  admissionForm.elements.section.innerHTML = `<option value="">Select</option>${sections.map(section => `<option>${escapeHtml(section)}</option>`).join("")}`;
  if (selectedValue) setSelectValue(admissionForm.elements.section, selectedValue);
}

function renderFeeMasterClassOptions(selectedValue = feeMasterForm.elements.className?.value || "") {
  const classes = getAdmissionClassOptions();
  feeMasterForm.elements.className.innerHTML = `<option value="">Select class</option>${classes.map(className => `<option>${escapeHtml(className)}</option>`).join("")}`;
  if (selectedValue) setSelectValue(feeMasterForm.elements.className, selectedValue);
}

function renderClassSectionSetup() {
  const classRows = document.getElementById("classSetupRows");
  const sectionRows = document.getElementById("sectionSetupRows");
  const subjectRows = document.getElementById("subjectSetupRows");
  const classSummary = document.getElementById("classSetupSummary");
  const sectionSummary = document.getElementById("sectionSetupSummary");
  const subjectSummary = document.getElementById("subjectSetupSummary");
  if (classRows) {
    classRows.innerHTML = customAdmissionClasses.map((className, index) => `
      <tr>
        <td><strong>${escapeHtml(className)}</strong></td>
        <td>
          <button class="icon-action edit" type="button" data-edit-class-setup="${index}" title="Edit class" aria-label="Edit ${escapeHtml(className)}">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20h4.7L19.3 9.4a2.1 2.1 0 0 0 0-3L17.6 4.7a2.1 2.1 0 0 0-3 0L4 15.3V20Zm3.8-2H6v-1.8l8.5-8.5 1.8 1.8L7.8 18Zm7.9-11.5.4-.4 1.8 1.8-.4.4-1.8-1.8Z"/></svg>
          </button>
          <button class="icon-action delete" type="button" data-delete-class-setup="${index}" title="Delete class" aria-label="Delete ${escapeHtml(className)}">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 21c-.6 0-1.1-.2-1.5-.6S5 19.5 5 19V8H4V6h5V4h6v2h5v2h-1v11c0 .6-.2 1.1-.6 1.5s-.9.6-1.5.6H7ZM17 8H7v11h10V8Zm-8 9h2v-7H9v7Zm4 0h2v-7h-2v7Z"/></svg>
          </button>
        </td>
      </tr>
    `).join("") || `<tr><td colspan="2">No custom classes added yet.</td></tr>`;
  }
  if (sectionRows) {
    sectionRows.innerHTML = customAdmissionSections.map((sectionName, index) => `
      <tr>
        <td><strong>${escapeHtml(sectionName)}</strong></td>
        <td>
          <button class="icon-action edit" type="button" data-edit-section-setup="${index}" title="Edit section" aria-label="Edit ${escapeHtml(sectionName)}">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20h4.7L19.3 9.4a2.1 2.1 0 0 0 0-3L17.6 4.7a2.1 2.1 0 0 0-3 0L4 15.3V20Zm3.8-2H6v-1.8l8.5-8.5 1.8 1.8L7.8 18Zm7.9-11.5.4-.4 1.8 1.8-.4.4-1.8-1.8Z"/></svg>
          </button>
          <button class="icon-action delete" type="button" data-delete-section-setup="${index}" title="Delete section" aria-label="Delete ${escapeHtml(sectionName)}">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 21c-.6 0-1.1-.2-1.5-.6S5 19.5 5 19V8H4V6h5V4h6v2h5v2h-1v11c0 .6-.2 1.1-.6 1.5s-.9.6-1.5.6H7ZM17 8H7v11h10V8Zm-8 9h2v-7H9v7Zm4 0h2v-7h-2v7Z"/></svg>
          </button>
        </td>
      </tr>
    `).join("") || `<tr><td colspan="2">No custom sections added yet.</td></tr>`;
  }
  if (subjectRows) {
    subjectRows.innerHTML = customSubjects.map((subjectName, index) => `
      <tr>
        <td><strong>${escapeHtml(subjectName)}</strong></td>
        <td>
          <button class="icon-action edit" type="button" data-edit-subject-setup="${index}" title="Edit subject" aria-label="Edit ${escapeHtml(subjectName)}">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20h4.7L19.3 9.4a2.1 2.1 0 0 0 0-3L17.6 4.7a2.1 2.1 0 0 0-3 0L4 15.3V20Zm3.8-2H6v-1.8l8.5-8.5 1.8 1.8L7.8 18Zm7.9-11.5.4-.4 1.8 1.8-.4.4-1.8-1.8Z"/></svg>
          </button>
          <button class="icon-action delete" type="button" data-delete-subject-setup="${index}" title="Delete subject" aria-label="Delete ${escapeHtml(subjectName)}">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 21c-.6 0-1.1-.2-1.5-.6S5 19.5 5 19V8H4V6h5V4h6v2h5v2h-1v11c0 .6-.2 1.1-.6 1.5s-.9.6-1.5.6H7ZM17 8H7v11h10V8Zm-8 9h2v-7H9v7Zm4 0h2v-7h-2v7Z"/></svg>
          </button>
        </td>
      </tr>
    `).join("") || `<tr><td colspan="2">No subjects added yet.</td></tr>`;
  }
  if (classSummary) classSummary.textContent = `${customAdmissionClasses.length} custom classes`;
  if (sectionSummary) sectionSummary.textContent = `${customAdmissionSections.length} custom sections`;
  if (subjectSummary) subjectSummary.textContent = `${customSubjects.length} subjects`;
  renderSubjectAssignmentSetup();
}

function updateClassReferences(oldClassName, newClassName) {
  if (!oldClassName || oldClassName === newClassName) return;
  if (classSubjectAssignments[oldClassName]) {
    classSubjectAssignments[newClassName] = classSubjectAssignments[oldClassName];
    delete classSubjectAssignments[oldClassName];
  }
  (ensureActiveFinanceSessionData().feeMaster || []).forEach(item => {
    if (item.className === oldClassName) item.className = newClassName;
  });
  students.forEach(student => {
    const {klass, section} = splitStudentClassSection(student.klass || "");
    if (klass === oldClassName) student.klass = `${newClassName} ${section}`.trim();
  });
  classTimetableEntries.forEach(entry => {
    const {klass, section} = splitStudentClassSection(entry.classSection || "");
    if (entry.className === oldClassName || klass === oldClassName) {
      entry.className = newClassName;
      entry.classSection = `${newClassName} ${entry.sectionName || section}`.trim();
    }
  });
}

function updateSectionReferences(oldSectionName, newSectionName) {
  if (!oldSectionName || oldSectionName === newSectionName) return;
  students.forEach(student => {
    const {klass, section} = splitStudentClassSection(student.klass || "");
    if (section === oldSectionName) student.klass = `${klass} ${newSectionName}`.trim();
  });
  classTimetableEntries.forEach(entry => {
    const {klass, section} = splitStudentClassSection(entry.classSection || "");
    if (entry.sectionName === oldSectionName || section === oldSectionName) {
      entry.sectionName = newSectionName;
      entry.classSection = `${entry.className || klass} ${newSectionName}`.trim();
    }
  });
}

function resetClassSetupEditing() {
  editingClassSetupIndex = -1;
  classSetupForm.querySelector("button[type='submit']").textContent = "Add Class";
}

function resetSectionSetupEditing() {
  editingSectionSetupIndex = -1;
  sectionSetupForm.querySelector("button[type='submit']").textContent = "Add Section";
}

function updateSubjectReferences(oldSubjectName, newSubjectName) {
  if (!oldSubjectName || oldSubjectName === newSubjectName) return;
  Object.keys(classSubjectAssignments).forEach(className => {
    classSubjectAssignments[className] = classSubjectAssignments[className].map(subject => subject === oldSubjectName ? newSubjectName : subject);
  });
  classTimetableEntries.forEach(entry => {
    if (entry.subject === oldSubjectName) entry.subject = newSubjectName;
  });
}

function resetSubjectSetupEditing() {
  editingSubjectSetupIndex = -1;
  subjectSetupForm.querySelector("button[type='submit']").textContent = "Add Subject";
}

function setClassSectionSetupPanel(panelId) {
  ["classSetupPanel", "sectionSetupPanel", "subjectSetupPanel", "subjectAssignPanel"].forEach(id => {
    const panel = document.getElementById(id);
    if (panel) panel.hidden = id !== panelId;
  });
}

function getAdmissionStudentTypeOptions() {
  const sessionTypes = [...new Set((getActiveFinanceSessionData().feeMaster || [])
    .map(item => item.studentType)
    .filter(Boolean))];
  const feeMasterTypes = [...feeMasterForm.elements.studentType.options]
    .map(option => option.value || option.textContent)
    .filter(Boolean);
  return [...new Set([...DEFAULT_STUDENT_TYPES, ...feeMasterTypes, ...sessionTypes])];
}

function renderAdmissionStudentTypeOptions(selectedValue = admissionForm.elements.studentType?.value || "New Student") {
  const types = [...new Set([...getAdmissionStudentTypeOptions(), selectedValue].filter(Boolean))];
  admissionForm.elements.studentType.innerHTML = types.map(type => `<option>${escapeHtml(type)}</option>`).join("");
  setSelectValue(admissionForm.elements.studentType, selectedValue || "New Student");
}

function renderAdmissionVillageTownOptions(selectedValue = admissionForm.elements.villageTown?.value || "") {
  const select = admissionForm.elements.villageTown;
  if (!select) return;
  dedupeTransportVillages();
  select.innerHTML = `<option value="">Select village/town</option>${transportVillages.map(village => `<option>${escapeHtml(village)}</option>`).join("")}`;
  if (selectedValue) setSelectValue(select, selectedValue);
}

function getCanonicalClassName(classToken = "") {
  const clean = String(classToken || "").trim().replace(/\s+/g, " ");
  if (!clean) return "";
  const classOptions = getAdmissionClassOptions();
  const exact = classOptions.find(className => className.toLowerCase() === clean.toLowerCase());
  if (exact) return exact;
  const token = clean.replace(/^class\s+/i, "").trim().toUpperCase();
  const romanToClass = {
    I: "Class I",
    II: "Class II",
    III: "Class III",
    IV: "Class IV",
    V: "Class V",
    VI: "Class VI",
    VII: "Class VII",
    VIII: "Class VIII",
    IX: "Class IX",
    X: "Class X",
    XI: "Class XI",
    XII: "Class XII"
  };
  const numberToRoman = {
    1: "I",
    2: "II",
    3: "III",
    4: "IV",
    5: "V",
    6: "VI",
    7: "VII",
    8: "VIII",
    9: "IX",
    10: "X",
    11: "XI",
    12: "XII"
  };
  const roman = romanToClass[token] ? token : numberToRoman[token];
  const canonical = romanToClass[roman];
  if (!canonical) return clean;
  return classOptions.find(className => className.toLowerCase() === canonical.toLowerCase()) || canonical;
}

function cleanSectionName(section = "") {
  return String(section || "")
    .replace(/^[\s(/-]+/, "")
    .replace(/[)\s]+$/, "")
    .trim();
}

function splitStudentClassSection(klassText = "") {
  const text = String(klassText || "").trim().replace(/\s+/g, " ");
  if (!text) return {klass: "", section: ""};
  const classOptions = getAdmissionClassOptions().slice().sort((a, b) => b.length - a.length);
  const matchedClass = classOptions.find(className => {
    const lowerText = text.toLowerCase();
    const lowerClass = className.toLowerCase();
    return lowerText === lowerClass
      || lowerText.startsWith(`${lowerClass} `)
      || lowerText.startsWith(`${lowerClass}(`);
  });
  if (matchedClass) {
    return {klass: matchedClass, section: cleanSectionName(text.slice(matchedClass.length))};
  }
  const legacyMatch = text.match(/^(?:class\s+)?([ivx]+|\d{1,2})(?:\s*\(?\s*([^)]+?)\s*\)?)?$/i);
  if (legacyMatch) {
    return {
      klass: getCanonicalClassName(legacyMatch[1]),
      section: cleanSectionName(legacyMatch[2] || "")
    };
  }
  const [klass, ...sectionParts] = text.split(" ");
  return {klass: getCanonicalClassName(klass) || klass || "", section: cleanSectionName(sectionParts.join(" "))};
}

function getFeeMasterForClass(className = "", studentType = admissionForm.elements.studentType?.value || "New Student") {
  const cleanClass = String(className || "").trim();
  if (!cleanClass) return null;
  const cleanType = String(studentType || "New Student").trim();
  const matches = (getActiveFinanceSessionData().feeMaster || []).filter(item => item.className === cleanClass);
  return matches.find(item => item.studentType === cleanType)
    || matches.find(item => item.studentType === "New Student")
    || matches[0]
    || null;
}

function setAdmissionFeeFieldsLocked(isLocked) {
  ["admissionFee", "annualFee", "formFee", "tuitionFee"].forEach(name => {
    const field = admissionForm.elements[name];
    if (!field) return;
    field.readOnly = isLocked;
    field.classList.toggle("locked-fee-field", isLocked);
    field.title = isLocked ? "Loaded from Fee Master" : "";
  });
}

function syncAdmissionTiffinFeeFromMaster() {
  const tiffinService = admissionForm.querySelector("[name='otherServices'][value='Tiffin']");
  if (!tiffinService?.checked) {
    admissionForm.elements.othersFee.value = "";
    return;
  }
  const feeSetup = getFeeMasterForClass(admissionForm.elements.klass.value, admissionForm.elements.studentType?.value || "New Student");
  if (feeSetup?.tiffinLunchOtherServiceFee) {
    admissionForm.elements.othersFee.value = feeSetup.tiffinLunchOtherServiceFee;
  }
}

function syncAdmissionDayBoardingFeeFromMaster() {
  const dayBoardingService = admissionForm.querySelector("[name='otherServices'][value='Day Boarding']");
  if (!dayBoardingService?.checked) {
    admissionForm.elements.dayBoardingFee.value = "";
    admissionForm.elements.dayBoardingTransportFee.value = "";
    return;
  }
  const feeSetup = getFeeMasterForClass(admissionForm.elements.klass.value, admissionForm.elements.studentType?.value || "New Student");
  if (feeSetup?.dayBoardingFee) {
    admissionForm.elements.dayBoardingFee.value = feeSetup.dayBoardingFee;
  }
}

function syncAdmissionRoboticsFeeFromMaster() {
  const roboticsService = admissionForm.querySelector("[name='otherServices'][value='Robotics']");
  if (!roboticsService?.checked) {
    admissionForm.elements.roboticsFee.value = "";
    return;
  }
  const feeSetup = getFeeMasterForClass(admissionForm.elements.klass.value, admissionForm.elements.studentType?.value || "New Student");
  if (feeSetup?.aiRoboticsFee) {
    admissionForm.elements.roboticsFee.value = feeSetup.aiRoboticsFee;
  }
}

function applyFeeMasterToAdmissionForm(className = admissionForm.elements.klass.value, studentType = admissionForm.elements.studentType?.value || "New Student") {
  const feeSetup = getFeeMasterForClass(className, studentType);
  if (!feeSetup) {
    setAdmissionFeeFieldsLocked(false);
    return false;
  }
  const otherFeeValues = {
    transportFee: admissionForm.elements.transportFee.value,
    dayBoardingFee: admissionForm.elements.dayBoardingFee.value,
    dayBoardingTransportFee: admissionForm.elements.dayBoardingTransportFee.value,
    roboticsFee: admissionForm.elements.roboticsFee.value,
    othersFee: admissionForm.elements.othersFee.value
  };
  admissionForm.elements.admissionFee.value = feeSetup.admissionFee || "";
  admissionForm.elements.annualFee.value = feeSetup.annualFee || "";
  admissionForm.elements.formFee.value = feeSetup.formFee || "";
  admissionForm.elements.tuitionFee.value = feeSetup.monthlyTuitionFee || "";
  admissionForm.elements.dayBoardingFee.value = admissionForm.querySelector("[name='otherServices'][value='Day Boarding']")?.checked
    ? feeSetup.dayBoardingFee || otherFeeValues.dayBoardingFee
    : "";
  admissionForm.elements.roboticsFee.value = admissionForm.querySelector("[name='otherServices'][value='Robotics']")?.checked
    ? feeSetup.aiRoboticsFee || otherFeeValues.roboticsFee
    : "";
  admissionForm.elements.othersFee.value = admissionForm.querySelector("[name='otherServices'][value='Tiffin']")?.checked
    ? feeSetup.tiffinLunchOtherServiceFee || otherFeeValues.othersFee
    : otherFeeValues.othersFee;
  Object.entries(otherFeeValues).forEach(([name, value]) => {
    if (["dayBoardingFee", "roboticsFee", "othersFee"].includes(name)) return;
    admissionForm.elements[name].value = value;
  });
  setAdmissionFeeFieldsLocked(true);
  return true;
}

function syncTransportServiceCheckbox(isChecked) {
  const transportService = admissionForm.querySelector("[name='otherServices'][value='Transport']");
  const specialService = admissionForm.querySelector("[name='otherServices'][value='Special/Custom']");
  if (specialService?.checked && !isChecked) return;
  if (transportService) transportService.checked = isChecked;
}

function syncExclusiveTransportServices(changedValue = "") {
  const transportService = admissionForm.querySelector("[name='otherServices'][value='Transport']");
  const specialService = admissionForm.querySelector("[name='otherServices'][value='Special/Custom']");
  if (!transportService || !specialService) return;
  if (changedValue === "Transport" && transportService.checked) {
    specialService.checked = false;
  }
  if (changedValue === "Special/Custom" && specialService.checked) {
    transportService.checked = false;
  }
  if (specialService.checked) {
    admissionForm.elements.transportRequired.checked = false;
  } else {
    admissionForm.elements.transportRequired.checked = transportService.checked;
  }
}

function getTransportFeeType(studentType = "") {
  return String(studentType || "").toLowerCase().includes("promoted") ? "promotedStudentFee" : "newStudentFee";
}

function getTransportFeeForVillage(village = "", studentType = "") {
  const fees = transportVillageFees[village] || {};
  return Number(fees[getTransportFeeType(studentType)] || 0);
}

function updateAdmissionTransportFee() {
  const transportChecked = admissionForm.elements.transportRequired.checked
    || Boolean(admissionForm.querySelector("[name='otherServices'][value='Transport']")?.checked)
    || Boolean(admissionForm.querySelector("[name='otherServices'][value='Special/Custom']")?.checked);
  if (!transportChecked) {
    admissionForm.elements.transportFee.value = "";
    return;
  }
  const specialChecked = Boolean(admissionForm.querySelector("[name='otherServices'][value='Special/Custom']")?.checked);
  const specialFee = Number(admissionForm.elements.specialTransportFee?.value || 0);
  if (specialChecked && specialFee > 0) {
    admissionForm.elements.transportFee.value = specialFee;
    return;
  }
  if (specialChecked) {
    const villageSpecialFee = Number((transportVillageFees[admissionForm.elements.villageTown?.value || ""] || {}).specialStudentFee || 0);
    admissionForm.elements.transportFee.value = villageSpecialFee || "";
    return;
  }
  const fee = getTransportFeeForVillage(admissionForm.elements.villageTown?.value || "", admissionForm.elements.studentType?.value || "");
  admissionForm.elements.transportFee.value = fee || "";
}

function badgeClass(value) {
  if (value === "Present" || value === "Paid") return "green";
  if (value === "Late" || value === "Due") return "amber";
  if (value === "Absent") return "red";
  return "blue";
}

function getStudentGuardianName(student = {}) {
  return student.guardian || student.fatherName || student.motherName || "";
}

function getStudentContactMobile(student = {}) {
  return student.mobile || student.fatherMobile || student.motherMobile || "";
}

function getAdmissionSearchTokens(admissionNo = "") {
  const raw = String(admissionNo || "").trim().toLowerCase();
  const normalized = normalizeAdmissionNo(admissionNo);
  const parts = raw.split("/");
  const serial = parts[parts.length - 1] || "";
  const numericSerial = serial.replace(/\D/g, "");
  const tokens = [raw, normalized, serial.toLowerCase(), numericSerial];
  if (numericSerial) {
    const plain = String(Number(numericSerial));
    tokens.push(plain, plain.padStart(2, "0"), plain.padStart(3, "0"), plain.padStart(4, "0"));
  }
  return [...new Set(tokens.filter(Boolean))];
}

function studentMatchesStudentDetailsSearch(student = {}, query = "") {
  const cleanQuery = String(query || "").trim().toLowerCase();
  if (!cleanQuery) return true;
  const admissionTokens = getAdmissionSearchTokens(student.admissionNo || "");
  if (admissionTokens.some(token => token.includes(cleanQuery))) return true;
  return Object.entries(student)
    .filter(([key]) => key !== "admissionNo")
    .map(([, value]) => String(value || "").toLowerCase())
    .join(" ")
    .includes(cleanQuery);
}

function normalizeStudentContactFields() {
  students.forEach(student => {
    if (!student.guardian) student.guardian = getStudentGuardianName(student);
    if (!student.mobile) student.mobile = getStudentContactMobile(student);
  });
}

function renderStudents() {
  const query = document.getElementById("globalSearch").value.trim().toLowerCase();
  renderStudentClassFilter();
  const selectedClass = String(document.getElementById("studentClassFilter")?.value || "").trim();
  const filtered = getActiveStudents().filter(student => {
    const matchesSearch = studentMatchesStudentDetailsSearch(student, query);
    const {klass} = splitStudentClassSection(student.klass || "");
    const matchesClass = !selectedClass || klass === selectedClass;
    return matchesSearch && matchesClass;
  });

  document.getElementById("studentTable").innerHTML = filtered.map(student => `
    ${(() => {
      const classInfo = splitStudentClassSection(student.klass || "");
      const admissionAttr = escapeHtml(student.admissionNo || "");
      const isReturnStudent = normalizeAdmissionNo(student.admissionNo) === normalizeAdmissionNo(feeBookReturnStudentAdmissionNo);
      return `
    <tr class="${isReturnStudent ? "student-return-highlight" : ""}" data-student-row-admission="${admissionAttr}">
      <td>${escapeHtml(student.admissionNo || "-")}</td>
      <td><button class="student-name-link" type="button" data-open-fee-book="${admissionAttr}"><strong>${escapeHtml(student.name || "-")}</strong></button></td>
      <td>${escapeHtml(classInfo.klass || "-")}</td>
      <td>${escapeHtml(classInfo.section || "-")}</td>
      <td>${escapeHtml(getStudentGuardianName(student) || "-")}</td>
      <td>${escapeHtml(getStudentContactMobile(student) || "-")}</td>
      <td>
        <div class="row-actions">
          <button class="icon-action edit" type="button" data-edit-student="${admissionAttr}" title="Edit student" aria-label="Edit ${escapeHtml(student.name || "student")}">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20h4.7L19.3 9.4a2.1 2.1 0 0 0 0-3L17.6 4.7a2.1 2.1 0 0 0-3 0L4 15.3V20Zm3.8-2H6v-1.8l8.5-8.5 1.8 1.8L7.8 18Zm7.9-11.5.4-.4 1.8 1.8-.4.4-1.8-1.8Z"/></svg>
          </button>
          <button class="icon-action fees" type="button" data-open-fee-book="${admissionAttr}" title="Open fee book" aria-label="Open fee book for ${escapeHtml(student.name || "student")}">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6.5C4 5.1 5.1 4 6.5 4h11C18.9 4 20 5.1 20 6.5v11c0 1.4-1.1 2.5-2.5 2.5h-11C5.1 20 4 18.9 4 17.5v-11ZM6.5 6a.5.5 0 0 0-.5.5V8h12V6.5a.5.5 0 0 0-.5-.5h-11ZM6 10v7.5c0 .3.2.5.5.5h11c.3 0 .5-.2.5-.5V10H6Zm6.8 6.7h-1.6v-1.1c-1-.2-1.8-.8-2.2-1.6l1.5-.8c.3.5.8.8 1.6.8.7 0 1-.2 1-.6s-.4-.5-1.4-.8c-1.4-.4-2.4-.9-2.4-2.2 0-1.1.8-1.9 1.9-2.1V7.3h1.6v1c.8.2 1.5.7 1.9 1.5l-1.4.8c-.3-.5-.7-.7-1.2-.7-.6 0-.9.2-.9.5 0 .4.4.5 1.4.8 1.4.4 2.4.9 2.4 2.2 0 1.2-.8 2-2.2 2.2v1.1Z"/></svg>
          </button>
          <button class="icon-action disable" type="button" data-disable-student="${admissionAttr}" title="Disable student" aria-label="Disable ${escapeHtml(student.name || "student")}">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm0 2c1.9 0 3.6.7 4.9 1.8L5.8 16.9A8 8 0 0 1 12 4Zm0 16c-1.9 0-3.6-.7-4.9-1.8L18.2 7.1A8 8 0 0 1 12 20Z"/></svg>
          </button>
          <button class="icon-action delete" type="button" data-delete-student="${admissionAttr}" title="Delete student" aria-label="Delete ${escapeHtml(student.name || "student")}">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 21c-.6 0-1.1-.2-1.5-.6S5 19.5 5 19V8H4V6h5V4h6v2h5v2h-1v11c0 .6-.2 1.1-.6 1.5s-.9.6-1.5.6H7ZM17 8H7v11h10V8Zm-8 9h2v-7H9v7Zm4 0h2v-7h-2v7Z"/></svg>
          </button>
        </div>
      </td>
    </tr>
      `;
    })()}
  `).join("") || `<tr><td colspan="7">No matching students found.</td></tr>`;

  document.getElementById("studentCount").textContent = getActiveStudents().length.toLocaleString("en-IN");
  renderClassSectionReport();
  renderStudentGenderRatioReport();
  renderStudentTeacherRatioReport();
  renderTransportRoutePickupPoints();
  focusReturnedStudentRow();
}

function focusReturnedStudentRow() {
  if (!feeBookReturnStudentAdmissionNo) return;
  if (!document.getElementById("students")?.classList.contains("active")) return;
  const row = [...document.querySelectorAll("[data-student-row-admission]")].find(item =>
    normalizeAdmissionNo(item.dataset.studentRowAdmission) === normalizeAdmissionNo(feeBookReturnStudentAdmissionNo)
  );
  if (!row) return;
  setTimeout(() => {
    row.scrollIntoView({block: "center", behavior: "smooth"});
    row.classList.add("student-return-highlight-pulse");
    setTimeout(() => row.classList.remove("student-return-highlight-pulse"), 1600);
  }, 80);
}

function renderStudentClassFilter() {
  const select = document.getElementById("studentClassFilter");
  if (!select) return;
  const current = select.value;
  const classes = [...new Set([
    ...getAdmissionClassOptions(),
    ...getActiveStudents().map(student => splitStudentClassSection(student.klass || "").klass).filter(Boolean)
  ])].sort((a, b) => a.localeCompare(b, undefined, {numeric: true}));
  select.innerHTML = `<option value="">All Classes</option>${classes.map(className => `<option value="${escapeHtml(className)}">${escapeHtml(className)}</option>`).join("")}`;
  if (current && classes.includes(current)) select.value = current;
}

function getClassSectionGroups() {
  const groups = new Map();
  getActiveStudents().forEach(student => {
    const klass = String(student.klass || "Unassigned").trim() || "Unassigned";
    if (!groups.has(klass)) groups.set(klass, []);
    groups.get(klass).push(student);
  });
  return [...groups.entries()]
    .map(([klass, groupStudents]) => ({klass, students: groupStudents.sort((a, b) => String(a.name || "").localeCompare(String(b.name || "")))}))
    .sort((a, b) => a.klass.localeCompare(b.klass, undefined, {numeric: true}));
}

function renderClassSectionReport() {
  const rows = document.getElementById("classSectionReportRows");
  if (!rows) return;
  const groups = getClassSectionGroups();
  const total = groups.reduce((sum, group) => sum + group.students.length, 0);
  const totalChip = document.getElementById("classSectionReportTotal");
  if (totalChip) totalChip.textContent = `Total Students: ${total}`;
  rows.innerHTML = groups.map((group, index) => `
    <tr>
      <td>${index + 1}</td>
      <td><strong>${escapeHtml(group.klass)}</strong></td>
      <td>${group.students.length}</td>
      <td>
        <button class="icon-action fees" type="button" data-view-class-section="${encodeURIComponent(group.klass)}" title="View student details" aria-label="View ${escapeHtml(group.klass)} student details">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5c5 0 8.7 4.1 10 7-1.3 2.9-5 7-10 7s-8.7-4.1-10-7c1.3-2.9 5-7 10-7Zm0 2C8.5 7 5.7 9.5 4.3 12c1.4 2.5 4.2 5 7.7 5s6.3-2.5 7.7-5C18.3 9.5 15.5 7 12 7Zm0 2.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5Z"/></svg>
        </button>
      </td>
    </tr>
  `).join("") || `<tr><td colspan="4">No class and section report available yet.</td></tr>`;
}

function getGenderCount(groupStudents, genderName) {
  return groupStudents.filter(student => String(student.gender || "").trim().toLowerCase() === genderName).length;
}

function formatGenderRatio(boys, girls) {
  const total = boys + girls;
  if (!total) return "0 : 0";
  const boyPercent = ((boys / total) * 100).toFixed(1);
  const girlPercent = ((girls / total) * 100).toFixed(1);
  return `${boys} : ${girls} (${boyPercent}% boys, ${girlPercent}% girls)`;
}

function renderStudentGenderRatioReport() {
  const rows = document.getElementById("studentGenderRatioRows");
  if (!rows) return;
  const groups = getClassSectionGroups();
  rows.innerHTML = groups.map(group => {
    const boys = getGenderCount(group.students, "male");
    const girls = getGenderCount(group.students, "female");
    const total = group.students.length;
    return `
      <tr>
        <td><strong>${escapeHtml(group.klass)}</strong></td>
        <td>${boys}</td>
        <td>${girls}</td>
        <td>${total}</td>
        <td><span class="gender-ratio-chip">${escapeHtml(formatGenderRatio(boys, girls))}</span></td>
      </tr>
    `;
  }).join("") || `<tr><td colspan="5">No gender ratio report available yet.</td></tr>`;
}

function getAssignedTeacherCountForClass(classSection) {
  const assignments = window.classTeacherAssignments;
  if (!Array.isArray(assignments)) return 0;
  return assignments.filter(item => String(item.classSection || item.klass || "").trim() === classSection).length;
}

function formatStudentTeacherRatio(studentsCount, teachersCount) {
  if (!teachersCount) return `${studentsCount} : 0`;
  const perTeacher = (studentsCount / teachersCount).toFixed(1);
  return `${studentsCount} : ${teachersCount} (${perTeacher} students per teacher)`;
}

function renderStudentTeacherRatioReport() {
  const rows = document.getElementById("studentTeacherRatioRows");
  if (!rows) return;
  const groups = getClassSectionGroups();
  rows.innerHTML = groups.map(group => {
    const studentsCount = group.students.length;
    const teachersCount = getAssignedTeacherCountForClass(group.klass);
    return `
      <tr>
        <td><strong>${escapeHtml(group.klass)}</strong></td>
        <td>${studentsCount}</td>
        <td>${teachersCount}</td>
        <td><span class="teacher-ratio-chip">${escapeHtml(formatStudentTeacherRatio(studentsCount, teachersCount))}</span></td>
      </tr>
    `;
  }).join("") || `<tr><td colspan="4">No student teacher ratio report available yet.</td></tr>`;
}

function getDailyCollectionReportRows() {
  const sessionPayments = collectedPayments[activeSession] || {};
  const dailyMap = new Map();
  Object.entries(sessionPayments).forEach(([admissionNo, payments]) => {
    const student = findStudentByAdmissionNo(admissionNo);
    (payments || []).forEach(payment => {
      const dateLabel = formatDateDDMMYYYY(payment.date);
      if (!dailyMap.has(dateLabel)) {
        dailyMap.set(dateLabel, {
          date: dateLabel,
          receipts: new Set(),
          students: new Set(),
          roles: new Set(),
          details: [],
          bank: 0,
          cash: 0,
          fine: 0,
          discount: 0,
          total: 0
        });
      }
      const row = dailyMap.get(dateLabel);
      const allocations = Array.isArray(payment.allocations) ? payment.allocations : [];
      const grossTotal = allocations.length
        ? allocations.reduce((sum, allocation) => sum + Number(allocation.amount || 0), 0)
        : Number(payment.amount || 0);
      const fine = allocations
        .filter(allocation => ["Tuition Late Fine", "Transport Late Fine"].includes(allocation.head))
        .reduce((sum, allocation) => sum + Number(allocation.amount || 0), 0);
      const discount = Number(payment.discountAmount || 0);
      const total = Math.max(grossTotal - discount, 0);
      const split = getPaymentSplitForAmount(payment, total);
      row.receipts.add(payment.receipt || "-");
      row.students.add(student?.name || admissionNo || "-");
      row.roles.add(payment.by || payment.entryRole || payment.role || "-");
      row.details.push({
        admissionNo,
        studentName: student?.name || "-",
        receipt: payment.receipt || "-",
        role: payment.by || payment.entryRole || payment.role || "-",
        bank: split.bank,
        cash: split.cash,
        fine,
        discount,
        total,
        remarks: payment.remarks || "-"
      });
      row.bank += split.bank;
      row.cash += split.cash;
      row.fine += fine;
      row.discount += discount;
      row.total += total;
    });
  });
  return [...dailyMap.values()].sort((a, b) => parseDateDDMMYYYY(b.date) - parseDateDDMMYYYY(a.date));
}

function getBankBookRows() {
  const sessionPayments = collectedPayments[activeSession] || {};
  const rows = [];
  Object.entries(sessionPayments).forEach(([admissionNo, payments]) => {
    const student = findStudentByAdmissionNo(admissionNo);
    (payments || []).forEach(payment => {
      const total = Number(payment.amount || 0);
      const split = getPaymentSplitForAmount(payment, total);
      const bankAmount = Number(payment.bankAmount || split.bank || 0);
      if (bankAmount <= 0) return;
      const allocations = Array.isArray(payment.allocations) ? payment.allocations : [];
      const feeHeads = [...new Set(allocations.map(item => item.head).filter(Boolean))];
      const feeMonths = [...new Set(allocations.map(item => item.month).filter(Boolean))];
      rows.push({
        date: formatDateDDMMYYYY(payment.date),
        receipt: payment.receipt || "-",
        studentName: student?.name || payment.studentName || "-",
        admissionNo,
        className: student ? [student.className || student.class || student.klass, student.section].filter(Boolean).join(" ") || "-" : "-",
        feeHead: feeHeads.join(", ") || payment.feeHead || "-",
        feeMonth: feeMonths.join(", ") || payment.feeMonth || "-",
        bankAmount,
        cashAmount: Number(payment.cashAmount || split.cash || 0),
        total: total || bankAmount + Number(payment.cashAmount || split.cash || 0),
        remarks: payment.remarks || "-",
        role: payment.by || payment.entryRole || payment.role || "-"
      });
    });
  });
  return rows.sort((a, b) => {
    const dateDiff = parseDateDDMMYYYY(b.date) - parseDateDDMMYYYY(a.date);
    if (dateDiff) return dateDiff;
    return String(b.receipt || "").localeCompare(String(a.receipt || ""), undefined, {numeric: true});
  });
}

function populateBankBookFeeHeadFilter(rows = getBankBookRows()) {
  const select = document.getElementById("bankBookFeeHeadFilter");
  if (!select) return;
  const current = select.value;
  const heads = [...new Set(rows.flatMap(row => String(row.feeHead || "").split(",").map(item => item.trim()).filter(Boolean)).filter(head => head !== "-"))]
    .sort((a, b) => a.localeCompare(b, undefined, {numeric: true}));
  select.innerHTML = `<option value="">All Fee Heads</option>${heads.map(head => `<option value="${escapeHtml(head)}">${escapeHtml(head)}</option>`).join("")}`;
  if (heads.includes(current)) select.value = current;
}

function renderBankBook() {
  const summary = document.getElementById("bankBookSummary");
  const body = document.getElementById("bankBookRows");
  if (!summary || !body) return;
  const allRows = getBankBookRows();
  populateBankBookFeeHeadFilter(allRows);
  const selectedDate = document.getElementById("bankBookDateFilter")?.value || "";
  const selectedDateLabel = selectedDate ? formatDateDDMMYYYY(selectedDate) : "";
  const selectedHead = String(document.getElementById("bankBookFeeHeadFilter")?.value || "").trim();
  const search = String(document.getElementById("bankBookSearchInput")?.value || "").trim().toLowerCase();
  const rows = allRows.filter(row => {
    const matchesDate = !selectedDateLabel || row.date === selectedDateLabel;
    const matchesHead = !selectedHead || String(row.feeHead || "").split(",").map(item => item.trim()).includes(selectedHead);
    const haystack = [row.receipt, row.studentName, row.admissionNo, row.className, row.feeHead, row.feeMonth, row.remarks, row.role].join(" ").toLowerCase();
    return matchesDate && matchesHead && (!search || haystack.includes(search));
  });
  const totals = rows.reduce((sum, row) => {
    sum.bank += Number(row.bankAmount || 0);
    sum.cash += Number(row.cashAmount || 0);
    sum.total += Number(row.total || 0);
    sum.receipts += 1;
    sum.students.add(row.admissionNo);
    return sum;
  }, {bank: 0, cash: 0, total: 0, receipts: 0, students: new Set()});
  summary.innerHTML = `
    <article><span>Bank Receipts</span><strong>${totals.receipts}</strong></article>
    <article><span>Students</span><strong>${totals.students.size}</strong></article>
    <article><span>Bank Amount</span><strong>${formatRs(totals.bank)}</strong></article>
    <article><span>Total Paid</span><strong>${formatRs(totals.total)}</strong></article>
  `;
  body.innerHTML = rows.map(row => `
    <tr>
      <td>${escapeHtml(row.date || "-")}</td>
      <td><strong>${escapeHtml(row.receipt || "-")}</strong></td>
      <td>${escapeHtml(row.studentName || "-")}</td>
      <td>${escapeHtml(row.admissionNo || "-")}</td>
      <td>${escapeHtml(row.className || "-")}</td>
      <td>${escapeHtml(row.feeHead || "-")}</td>
      <td>${escapeHtml(row.feeMonth || "-")}</td>
      <td><strong>${formatRs(row.bankAmount || 0)}</strong></td>
      <td>${formatRs(row.total || 0)}</td>
      <td>${escapeHtml(row.remarks || "-")}</td>
      <td>${escapeHtml(row.role || "-")}</td>
    </tr>
  `).join("") || `<tr><td colspan="11">No bank payment found for the selected filter.</td></tr>`;
}

function parseBankCsv(text = "") {
  const rows = [];
  let field = "";
  let row = [];
  let quoted = false;
  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i];
    const next = text[i + 1];
    if (ch === '"' && quoted && next === '"') {
      field += '"';
      i += 1;
    } else if (ch === '"') {
      quoted = !quoted;
    } else if (ch === "," && !quoted) {
      row.push(field);
      field = "";
    } else if ((ch === "\n" || ch === "\r") && !quoted) {
      if (ch === "\r" && next === "\n") i += 1;
      row.push(field);
      if (row.some(cell => String(cell || "").trim())) rows.push(row);
      row = [];
      field = "";
    } else {
      field += ch;
    }
  }
  row.push(field);
  if (row.some(cell => String(cell || "").trim())) rows.push(row);
  return rows;
}

function normalizeBankHeader(value = "") {
  return String(value || "").toLowerCase().replace(/[^a-z0-9]+/g, "");
}

function getBankCsvValue(row, headers, aliases = []) {
  const headerIndex = headers.findIndex(header => aliases.some(alias => header.includes(alias)));
  return headerIndex >= 0 ? row[headerIndex] : "";
}

function parseBankAmount(value = "") {
  const clean = String(value || "").replace(/[₹,\s]/g, "").replace(/[^\d.-]/g, "");
  return Number(clean || 0);
}

function normalizeBankDate(value = "") {
  const raw = String(value || "").trim();
  if (!raw) return "";
  const ddmmyyyy = raw.match(/^(\d{1,2})[\/\-.](\d{1,2})[\/\-.](\d{2,4})/);
  if (ddmmyyyy) {
    const [, dd, mm, yy] = ddmmyyyy;
    const yyyy = yy.length === 2 ? `20${yy}` : yy;
    return `${dd.padStart(2, "0")}-${mm.padStart(2, "0")}-${yyyy}`;
  }
  const yyyymmdd = raw.match(/^(\d{4})[\/\-.](\d{1,2})[\/\-.](\d{1,2})/);
  if (yyyymmdd) {
    const [, yyyy, mm, dd] = yyyymmdd;
    return `${dd.padStart(2, "0")}-${mm.padStart(2, "0")}-${yyyy}`;
  }
  const parsed = new Date(raw);
  return Number.isNaN(parsed.getTime()) ? raw : formatDateDDMMYYYY(parsed);
}

function normalizeReference(value = "") {
  return String(value || "").toLowerCase().replace(/[^a-z0-9]/g, "");
}

function buildBankStatementRows(csvText = "") {
  const parsed = parseBankCsv(csvText);
  if (parsed.length < 2) return [];
  const headers = parsed[0].map(normalizeBankHeader);
  return parsed.slice(1).map((row, index) => {
    const date = normalizeBankDate(getBankCsvValue(row, headers, ["valuedate", "transactiondate", "trandate", "date", "posteddate"]));
    const remarks = getBankCsvValue(row, headers, ["transactionremarks", "remarks", "narration", "description", "particulars", "refno", "referenceno"]);
    const deposit = parseBankAmount(getBankCsvValue(row, headers, ["depositcr", "deposit", "credit", "cramount", "amountcr"]));
    const withdrawal = parseBankAmount(getBankCsvValue(row, headers, ["withdrawaldr", "withdrawal", "debit", "dramount"]));
    const fallbackAmount = parseBankAmount(getBankCsvValue(row, headers, ["amount"]));
    const amount = deposit || (fallbackAmount > 0 && !withdrawal ? fallbackAmount : 0);
    return {
      id: `bank-${index}`,
      date,
      amount,
      remarks: remarks || row.join(" "),
      raw: row
    };
  }).filter(row => Number(row.amount || 0) > 0);
}

function findBankBookMatch(bankRow, erpRows, usedReceipts) {
  const sameDateAmount = erpRows.filter(row => !usedReceipts.has(row.receipt) && row.date === bankRow.date && Number(row.bankAmount || 0) === Number(bankRow.amount || 0));
  if (sameDateAmount.length === 1) return {row: sameDateAmount[0], status: "Matched", note: "Exact date and amount match"};
  const bankRef = normalizeReference(bankRow.remarks);
  const referenceMatch = sameDateAmount.find(row => {
    const erpRef = normalizeReference([row.receipt, row.studentName, row.admissionNo, row.remarks].join(" "));
    return erpRef && bankRef && (bankRef.includes(erpRef) || erpRef.includes(bankRef) || normalizeReference(row.admissionNo).slice(-3) && bankRef.includes(normalizeReference(row.admissionNo).slice(-3)));
  });
  if (referenceMatch) return {row: referenceMatch, status: "Matched", note: "Date, amount, and reference match"};
  if (sameDateAmount.length > 1) return {row: sameDateAmount[0], status: "Review", note: `${sameDateAmount.length} ERP entries have the same date and amount`};
  const amountOnly = erpRows.filter(row => !usedReceipts.has(row.receipt) && Number(row.bankAmount || 0) === Number(bankRow.amount || 0));
  if (amountOnly.length === 1) return {row: amountOnly[0], status: "Review", note: "Amount matches, date is different"};
  if (amountOnly.length > 1) return {row: amountOnly[0], status: "Review", note: `${amountOnly.length} ERP entries have this amount`};
  return {row: null, status: "Unmatched", note: "No ERP Bank Book entry found"};
}

function renderBankReconciliation(bankRows = []) {
  const summary = document.getElementById("bankReconSummary");
  const body = document.getElementById("bankReconRows");
  if (!summary || !body) return;
  const erpRows = getBankBookRows();
  const usedReceipts = new Set();
  const results = bankRows.map(bankRow => {
    const match = findBankBookMatch(bankRow, erpRows, usedReceipts);
    if (match.row && match.status === "Matched") usedReceipts.add(match.row.receipt);
    return {bankRow, ...match};
  });
  const totals = results.reduce((sum, item) => {
    sum.bank += Number(item.bankRow.amount || 0);
    if (item.status === "Matched") {
      sum.matched += 1;
      sum.matchedAmount += Number(item.bankRow.amount || 0);
    } else if (item.status === "Review") {
      sum.review += 1;
    } else {
      sum.unmatched += 1;
    }
    return sum;
  }, {bank: 0, matchedAmount: 0, matched: 0, review: 0, unmatched: 0});
  summary.innerHTML = `
    <article><span>CSV Credits</span><strong>${results.length}</strong></article>
    <article><span>Matched</span><strong>${totals.matched}</strong></article>
    <article><span>Need Review</span><strong>${totals.review}</strong></article>
    <article><span>Unmatched</span><strong>${totals.unmatched}</strong></article>
    <article><span>CSV Total</span><strong>${formatRs(totals.bank)}</strong></article>
    <article><span>Matched Amount</span><strong>${formatRs(totals.matchedAmount)}</strong></article>
  `;
  body.innerHTML = results.map(item => {
    const row = item.row || {};
    return `
      <tr class="bank-recon-${String(item.status || "").toLowerCase()}">
        <td><span class="bank-recon-status">${escapeHtml(item.status)}</span></td>
        <td>${escapeHtml(item.bankRow.date || "-")}</td>
        <td><strong>${formatRs(item.bankRow.amount || 0)}</strong></td>
        <td>${escapeHtml(item.bankRow.remarks || "-")}</td>
        <td>${escapeHtml(row.receipt || "-")}</td>
        <td>${escapeHtml(row.studentName || "-")}</td>
        <td>${escapeHtml(row.admissionNo || "-")}</td>
        <td>${escapeHtml(row.date || "-")}</td>
        <td>${row.bankAmount ? formatRs(row.bankAmount) : "-"}</td>
        <td>${escapeHtml(item.note || "-")}</td>
      </tr>
    `;
  }).join("") || `<tr><td colspan="10">No credit rows found in the uploaded CSV.</td></tr>`;
}

function shortCollectionDateLabel(value = "") {
  const date = parseDateDDMMYYYY(value);
  if (Number.isNaN(date.getTime())) return String(value || "-").slice(0, 5);
  return `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function renderDailyCashTrendChart() {
  const chart = document.getElementById("dailyCashTrendChart");
  const total = document.getElementById("dailyCashTrendTotal");
  const note = document.getElementById("dailyCashTrendNote");
  if (!chart || !total || !note) return;
  const today = parseDateDDMMYYYY(new Date());
  const rows = getDailyCollectionReportRows()
    .filter(row => Number(row.cash || 0) > 0 || Number(row.total || 0) > 0)
    .filter(row => {
      const date = parseDateDDMMYYYY(row.date);
      return !Number.isNaN(date.getTime())
        && date.getMonth() === today.getMonth()
        && date.getFullYear() === today.getFullYear();
    })
    .reverse();
  if (!rows.length) {
    chart.innerHTML = `<div class="empty-chart">No daily collection found yet.</div>`;
    total.textContent = "Rs. 0";
    note.textContent = "This month's collections will appear here after fee entry.";
    return;
  }
  const maxTotal = Math.max(...rows.map(row => Number(row.total || 0)), 1);
  const cashTotal = rows.reduce((sum, row) => sum + Number(row.cash || 0), 0);
  const bankTotal = rows.reduce((sum, row) => sum + Number(row.bank || 0), 0);
  const grandTotal = rows.reduce((sum, row) => sum + Number(row.total || 0), 0);
  total.textContent = formatRs(grandTotal);
  note.textContent = `This month | ${rows.length} collection day(s) | Cash ${formatRs(cashTotal)} | Bank ${formatRs(bankTotal)}`;
  chart.innerHTML = `
    <div class="daily-cash-bars" role="img" aria-label="Daily collection bar graph">
      ${rows.map((row, index) => {
        const cash = Number(row.cash || 0);
        const bank = Number(row.bank || 0);
        const dayTotal = Number(row.total || 0);
        const height = Math.max(10, Math.round((dayTotal / maxTotal) * 100));
        return `
        <div class="daily-cash-bar ${index === rows.length - 1 ? "is-latest" : ""}" title="${escapeHtml(row.date)} | Total ${escapeHtml(formatRs(dayTotal))} | Cash ${escapeHtml(formatRs(cash))} | Bank ${escapeHtml(formatRs(bank))}">
          <strong>${escapeHtml(formatRs(dayTotal).replace("Rs. ", ""))}</strong>
          <span style="height:${height}%"></span>
          <small>${escapeHtml(shortCollectionDateLabel(row.date))}</small>
        </div>
      `;
      }).join("")}
    </div>
  `;
}

function renderDailyCollectionReport() {
  const summary = document.getElementById("dailyCollectionSummary");
  const rows = document.getElementById("dailyCollectionReportRows");
  if (!summary || !rows) return;
  const dateFilter = document.getElementById("dailyCollectionDateFilter");
  const selectedDateLabel = dateFilter?.value ? normalizeCollectionHistoryDateValue(dateFilter.value) : "";
  const allRows = getDailyCollectionReportRows();
  const reportRows = selectedDateLabel ? allRows.filter(row => row.date === selectedDateLabel) : allRows;
  const totals = reportRows.reduce((sum, row) => {
    sum.bank += row.bank;
    sum.cash += row.cash;
    sum.fine += row.fine;
    sum.discount += row.discount || 0;
    sum.total += row.total;
    sum.receipts += row.receipts.size;
    return sum;
  }, {bank: 0, cash: 0, fine: 0, discount: 0, total: 0, receipts: 0});
  summary.innerHTML = `
    <article><span>${selectedDateLabel ? "Selected Date" : "Total Days"}</span><strong>${selectedDateLabel ? escapeHtml(selectedDateLabel) : reportRows.length}</strong></article>
    <article><span>Total Collection</span><strong>${formatRs(totals.total)}</strong></article>
    <article><span>Bank</span><strong>${formatRs(totals.bank)}</strong></article>
    <article><span>Cash</span><strong>${formatRs(totals.cash)}</strong></article>
    <article><span>Fine</span><strong>${formatRs(totals.fine)}</strong></article>
    <article><span>Discount</span><strong>${formatRs(totals.discount)}</strong></article>
    <article><span>Receipts</span><strong>${totals.receipts}</strong></article>
  `;
  rows.innerHTML = reportRows.map(row => {
    const isOpen = activeDailyCollectionDate === row.date;
    return `
      <tr class="${isOpen ? "daily-collection-open-row" : ""}">
        <td><button class="daily-collection-date-action" type="button" data-open-daily-collection="${encodeURIComponent(row.date)}" aria-expanded="${isOpen ? "true" : "false"}">${escapeHtml(row.date)}</button></td>
        <td>${row.receipts.size}</td>
        <td>${row.students.size}</td>
        <td>${escapeHtml([...row.roles].filter(Boolean).join(", ") || "-")}</td>
        <td>${formatRs(row.bank)}</td>
        <td>${formatRs(row.cash)}</td>
        <td>${formatRs(row.fine)}</td>
        <td>${formatRs(row.discount || 0)}</td>
        <td><strong>${formatRs(row.total)}</strong></td>
      </tr>
      ${isOpen ? renderDailyCollectionDropdown(row) : ""}
    `;
  }).join("") || `<tr><td colspan="9">${selectedDateLabel ? "No collection found for selected date." : "No daily collection found yet."}</td></tr>`;
}

function renderDailyCollectionDropdown(reportRow = {}) {
  const details = [...(reportRow.details || [])].sort((a, b) => {
    return String(a.studentName || "").localeCompare(String(b.studentName || ""), undefined, {numeric: true});
  });
  const remarks = [...new Set(details.map(item => String(item.remarks || "").trim()).filter(item => item && item !== "-"))];
  return `
    <tr class="daily-collection-dropdown-row">
      <td colspan="9">
        <div class="daily-collection-detail-card">
          <div class="daily-collection-detail-head">
            <div>
              <strong>${escapeHtml(reportRow.date || "-")}</strong>
              <span>${details.length} student payment row(s), ${reportRow.receipts?.size || 0} receipt(s)</span>
            </div>
            <em>${escapeHtml(formatRs(reportRow.total || 0))}</em>
          </div>
          <div class="daily-collection-detail-summary">
            <article><span>Bank</span><strong>${formatRs(reportRow.bank)}</strong></article>
            <article><span>Cash</span><strong>${formatRs(reportRow.cash)}</strong></article>
            <article><span>Fine</span><strong>${formatRs(reportRow.fine)}</strong></article>
            <article><span>Discount</span><strong>${formatRs(reportRow.discount || 0)}</strong></article>
            <article><span>Total</span><strong>${formatRs(reportRow.total)}</strong></article>
          </div>
          <div class="table-wrap daily-collection-detail-table">
            <table>
              <thead>
                <tr><th>Student</th><th>Admission No.</th><th>Receipt</th><th>Bank</th><th>Cash</th><th>Discount</th><th>Total</th><th>Remarks</th><th>Entry Role</th></tr>
              </thead>
              <tbody>
                ${details.map(item => `
                  <tr>
                    <td><strong>${escapeHtml(item.studentName || "-")}</strong></td>
                    <td>${escapeHtml(item.admissionNo || "-")}</td>
                    <td>${escapeHtml(item.receipt || "-")}</td>
                    <td>${formatRs(item.bank || 0)}</td>
                    <td>${formatRs(item.cash || 0)}</td>
                    <td>${formatRs(item.discount || 0)}</td>
                    <td><strong>${formatRs(item.total || 0)}</strong></td>
                    <td>${escapeHtml(item.remarks || "-")}</td>
                    <td>${escapeHtml(item.role || "-")}</td>
                  </tr>
                `).join("") || `<tr><td colspan="9">No student payments found for this date.</td></tr>`}
              </tbody>
            </table>
          </div>
          <div class="daily-collection-detail-remarks">
            <span>Remarks</span>
            <p>${remarks.length ? escapeHtml(remarks.join(" | ")) : "No remarks saved for this date."}</p>
          </div>
        </div>
      </td>
    </tr>
  `;
}

function toggleDailyCollectionDetails(dateLabel = "") {
  const reportRow = getDailyCollectionReportRows().find(row => row.date === dateLabel);
  if (!reportRow) {
    showToast("No collection details found for this date.");
    return;
  }
  activeDailyCollectionDate = activeDailyCollectionDate === dateLabel ? "" : dateLabel;
  renderDailyCollectionReport();
}

function getMonthReceivedTotal(month) {
  const sessionPayments = collectedPayments[activeSession] || {};
  return Object.values(sessionPayments).reduce((total, payments) => {
    return total + (payments || []).reduce((paymentTotal, payment) => {
      const allocations = Array.isArray(payment.allocations) ? payment.allocations : [];
      const amount = allocations
        .filter(allocation => allocation.month === month && !["Tuition Late Fine", "Transport Late Fine"].includes(allocation.head))
        .reduce((sum, allocation) => sum + Number(allocation.amount || 0), 0);
      return paymentTotal + amount;
    }, 0);
  }, 0);
}

function getMonthFineReceivedTotal(month) {
  const sessionPayments = collectedPayments[activeSession] || {};
  return Object.values(sessionPayments).reduce((total, payments) => {
    return total + (payments || []).reduce((paymentTotal, payment) => {
      const allocations = Array.isArray(payment.allocations) ? payment.allocations : [];
      return paymentTotal + allocations
        .filter(allocation => allocation.month === month && ["Tuition Late Fine", "Transport Late Fine"].includes(allocation.head))
        .reduce((sum, allocation) => sum + Number(allocation.amount || 0), 0);
    }, 0);
  }, 0);
}

function getEntireSchoolFeesRows() {
  const activeStudents = getActiveStudents();
  return ACADEMIC_MONTHS.map(month => {
    const row = {
      month,
      totalStudents: activeStudents.length,
      tuitionStudents: 0,
      tuition: 0,
      transportStudents: 0,
      transport: 0,
      dayBoardingStudents: 0,
      dayBoarding: 0,
      tiffinStudents: 0,
      tiffin: 0,
      otherIncomeStudents: 0,
      otherIncome: 0,
      otherExpenses: 0
    };
    activeStudents.forEach(student => {
      if (getSelectedMonths(student, "feeMonths").includes(month) && Number(student.tuitionFee || 0) > 0) {
        row.tuitionStudents += 1;
        row.tuition += Number(student.tuitionFee || 0);
      }
      if (getSelectedMonths(student, "transportMonths").includes(month) && Number(student.transportFee || 0) > 0) {
        row.transportStudents += 1;
        row.transport += Number(student.transportFee || 0);
      }
      if (getSelectedMonths(student, "dayBoardingMonths").includes(month)) {
        const dayBoardingAmount = Number(student.dayBoardingFee || 0) + Number(student.dayBoardingTransportFee || 0);
        if (dayBoardingAmount > 0) {
          row.dayBoardingStudents += 1;
          row.dayBoarding += dayBoardingAmount;
        }
      }
      if (getSelectedMonths(student, "othersMonths").includes(month) && Number(student.othersFee || 0) > 0) {
        row.tiffinStudents += 1;
        row.tiffin += Number(student.othersFee || 0);
      }
      if (getSelectedMonths(student, "roboticsMonths").includes(month) && Number(student.roboticsFee || 0) > 0) {
        row.otherIncomeStudents += 1;
        row.otherIncome += Number(student.roboticsFee || 0);
      }
    });
    row.totalExpected = row.tuition + row.transport + row.dayBoarding + row.tiffin + row.otherIncome - row.otherExpenses;
    row.fineReceived = getMonthFineReceivedTotal(month);
    row.received = getMonthReceivedTotal(month);
    row.balance = Math.max(row.totalExpected - row.received, 0);
    return row;
  });
}

function renderEntireSchoolFeesReport() {
  const summary = document.getElementById("entireSchoolFeesSummary");
  const rows = document.getElementById("entireSchoolFeesRows");
  if (!summary || !rows) return;
  const selectedMonth = document.getElementById("entireSchoolFeesMonthFilter")?.value || "";
  const reportRows = getEntireSchoolFeesRows().filter(row => !selectedMonth || row.month === selectedMonth);
  const totals = reportRows.reduce((sum, row) => {
    sum.expected += row.totalExpected;
    sum.received += row.received;
    sum.balance += row.balance;
    sum.tuition += row.tuition;
    sum.transport += row.transport;
    sum.dayBoarding += row.dayBoarding;
    sum.tiffin += row.tiffin;
    sum.otherIncome += row.otherIncome;
    sum.otherExpenses += row.otherExpenses;
    sum.fineReceived += row.fineReceived;
    return sum;
  }, {expected: 0, received: 0, balance: 0, tuition: 0, transport: 0, dayBoarding: 0, tiffin: 0, otherIncome: 0, otherExpenses: 0, fineReceived: 0});
  summary.innerHTML = `
    <article><span>Total Students</span><strong>${getActiveStudents().length}</strong></article>
    <article><span>${selectedMonth || "Selected"} Tuition</span><strong>${formatRs(totals.tuition)}</strong></article>
    <article><span>${selectedMonth || "Selected"} Transport</span><strong>${formatRs(totals.transport)}</strong></article>
    <article><span>${selectedMonth || "Selected"} Day Boarding</span><strong>${formatRs(totals.dayBoarding)}</strong></article>
    <article><span>${selectedMonth || "Selected"} Robotics</span><strong>${formatRs(totals.otherIncome)}</strong></article>
    <article><span>${selectedMonth || "Selected"} Tiffin</span><strong>${formatRs(totals.tiffin)}</strong></article>
    <article><span>Total Expected</span><strong>${formatRs(totals.expected)}</strong></article>
    <article><span>Total Received</span><strong>${formatRs(totals.received)}</strong></article>
    <article><span>Total Balance</span><strong>${formatRs(totals.balance)}</strong></article>
    <article><span>Fine Received</span><strong>${formatRs(totals.fineReceived)}</strong></article>
  `;
  rows.innerHTML = reportRows.map(row => `
    <tr>
      <td><strong>${row.month}</strong></td>
      <td>${row.totalStudents}</td>
      <td><span>${row.tuitionStudents} students</span><strong>${formatRs(row.tuition)}</strong></td>
      <td><span>${row.transportStudents} students</span><strong>${formatRs(row.transport)}</strong></td>
      <td><span>${row.dayBoardingStudents} students</span><strong>${formatRs(row.dayBoarding)}</strong></td>
      <td><span>${row.otherIncomeStudents} students</span><strong>${formatRs(row.otherIncome)}</strong></td>
      <td><span>${row.tiffinStudents} students</span><strong>${formatRs(row.tiffin)}</strong></td>
      <td>${formatRs(row.otherExpenses)}</td>
      <td><strong>${formatRs(row.totalExpected)}</strong></td>
      <td><strong>${formatRs(row.received)}</strong></td>
      <td><strong>${formatRs(row.balance)}</strong></td>
      <td><strong>${formatRs(row.fineReceived)}</strong></td>
    </tr>
  `).join("") || `<tr><td colspan="12">No school fees report available yet.</td></tr>`;
}

function getYearlyFeeReceivedTotals() {
  const heads = {"Admission Fee": 0, "Annual Fee": 0, "Form Fee": 0};
  const sessionPayments = collectedPayments[activeSession] || {};
  Object.values(sessionPayments).forEach(payments => {
    (payments || []).forEach(payment => {
      (payment.allocations || []).forEach(allocation => {
        if (Object.prototype.hasOwnProperty.call(heads, allocation.head)) {
          heads[allocation.head] += Number(allocation.amount || 0);
        }
      });
    });
  });
  return heads;
}

function getTotalFineReceived() {
  return ACADEMIC_MONTHS.reduce((sum, month) => sum + getMonthFineReceivedTotal(month), 0);
}

function getEntireSchoolYearlyFeesRows() {
  const activeStudents = getActiveStudents();
  const received = getYearlyFeeReceivedTotals();
  return [
    {head: "Admission Fee", key: "admissionFee"},
    {head: "Annual Fee", key: "annualFee"},
    {head: "Form Fee", key: "formFee"}
  ].map(item => {
    const studentsWithFee = activeStudents.filter(student => Number(student[item.key] || 0) > 0);
    const expected = studentsWithFee.reduce((sum, student) => sum + Number(student[item.key] || 0), 0);
    const paid = Number(received[item.head] || 0);
    return {
      head: item.head,
      students: studentsWithFee.length,
      expected,
      received: paid,
      balance: Math.max(expected - paid, 0)
    };
  });
}

function renderEntireSchoolYearlyFeesReport() {
  const summary = document.getElementById("entireSchoolYearlyFeesSummary");
  const rows = document.getElementById("entireSchoolYearlyFeesRows");
  if (!summary || !rows) return;
  const reportRows = getEntireSchoolYearlyFeesRows();
  const totals = reportRows.reduce((sum, row) => {
    sum.expected += row.expected;
    sum.received += row.received;
    sum.balance += row.balance;
    return sum;
  }, {expected: 0, received: 0, balance: 0});
  summary.innerHTML = `
    <article><span>Total Students</span><strong>${getActiveStudents().length}</strong></article>
    <article><span>Yearly Expected</span><strong>${formatRs(totals.expected)}</strong></article>
    <article><span>Yearly Received</span><strong>${formatRs(totals.received)}</strong></article>
    <article><span>Yearly Balance</span><strong>${formatRs(totals.balance)}</strong></article>
    <article><span>Fine Received</span><strong>${formatRs(getTotalFineReceived())}</strong></article>
  `;
  rows.innerHTML = reportRows.map(row => `
    <tr>
      <td><strong>${row.head}</strong></td>
      <td>${row.students}</td>
      <td><strong>${formatRs(row.expected)}</strong></td>
      <td><strong>${formatRs(row.received)}</strong></td>
      <td><strong>${formatRs(row.balance)}</strong></td>
    </tr>
  `).join("") || `<tr><td colspan="5">No yearly fee report available yet.</td></tr>`;
}

function setEntireSchoolFeesPanel(panelName) {
  const monthlyPanel = document.getElementById("entireSchoolMonthlyFeesPanel");
  const yearlyPanel = document.getElementById("entireSchoolYearlyFeesPanel");
  const monthlyButton = document.getElementById("showEntireSchoolMonthlyFeesBtn");
  const yearlyButton = document.getElementById("showEntireSchoolYearlyFeesBtn");
  const showYearly = panelName === "yearly";
  if (monthlyPanel) monthlyPanel.hidden = showYearly;
  if (yearlyPanel) yearlyPanel.hidden = !showYearly;
  monthlyButton?.classList.toggle("active", !showYearly);
  yearlyButton?.classList.toggle("active", showYearly);
  if (showYearly) renderEntireSchoolYearlyFeesReport();
  else renderEntireSchoolFeesReport();
}

function getKnownClassSections() {
  const classes = new Set();
  getActiveStudents().forEach(student => {
    const klass = String(student.klass || "").trim();
    if (klass) classes.add(klass);
  });
  classTimetableEntries.forEach(entry => {
    const klass = String(entry.classSection || "").trim();
    if (klass) classes.add(klass);
  });
  return [...classes].sort((a, b) => a.localeCompare(b, undefined, {numeric: true}));
}

function getTimetableDuration(startTime = "", endTime = "") {
  if (!startTime || !endTime) return "";
  const [startHour, startMinute] = startTime.split(":").map(Number);
  const [endHour, endMinute] = endTime.split(":").map(Number);
  const minutes = (endHour * 60 + endMinute) - (startHour * 60 + startMinute);
  return minutes > 0 ? `${minutes} min` : "";
}

function getTimetableTeacherOptions() {
  return staffMembers
    .filter(staff => staff.status !== "Disabled")
    .map(staff => staff.staffId ? `${staff.name || ""} (${staff.staffId})` : staff.name || "")
    .filter(Boolean);
}

function getTimeAfterMinutes(timeValue = "", minutesToAdd = 0) {
  if (!timeValue) return "";
  const [hour, minute] = timeValue.split(":").map(Number);
  if (!Number.isFinite(hour) || !Number.isFinite(minute)) return "";
  const total = (hour * 60) + minute + Number(minutesToAdd || 0);
  const nextHour = Math.floor(total / 60) % 24;
  const nextMinute = total % 60;
  return `${String(nextHour).padStart(2, "0")}:${String(nextMinute).padStart(2, "0")}`;
}

function normalizeText(value = "") {
  return String(value || "").trim();
}

function createTimetableBuilderRow() {
  return {id: `tt-row-${Date.now()}-${Math.random().toString(16).slice(2)}`, subject: "", teacher: "", startTime: "", endTime: "", room: ""};
}

function getParallelLanguageGroup(row = {}) {
  const subject = normalizeText(row.subject || row.entryType || "").toLowerCase();
  const isLanguage = subject.includes("language") || subject.includes("laguage");
  const isHindiOrBengali = subject.includes("hindi") || subject.includes("bengali");
  if (!isLanguage || !isHindiOrBengali) return "";
  if (/\b2\s*nd\b/.test(subject) || subject.includes("second")) return "second-language";
  if (/\b3\s*rd\b/.test(subject) || subject.includes("third")) return "third-language";
  return "";
}

function getTimetableLogicalPeriods(rows = []) {
  let period = 0;
  let previousGroup = "";
  return rows.map(row => {
    const group = getParallelLanguageGroup(row);
    if (group && group === previousGroup) {
      return period || 1;
    }
    period += 1;
    previousGroup = group;
    return period;
  });
}

function getMaxTimetableLogicalPeriod(rows = []) {
  const periods = getTimetableLogicalPeriods(rows);
  return periods.reduce((max, period) => Math.max(max, Number(period || 0)), 0);
}

function refreshSavedTimetableLogicalPeriods() {
  const groups = new Map();
  classTimetableEntries.forEach((entry, index) => {
    const key = `${entry.classSection || ""}__${entry.day || ""}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push({entry, index});
  });
  groups.forEach(items => {
    items.sort((a, b) => Number(a.entry.period || 0) - Number(b.entry.period || 0) || a.index - b.index);
    const periods = getTimetableLogicalPeriods(items.map(item => item.entry));
    items.forEach((item, index) => {
      item.entry.period = periods[index];
    });
  });
}

function getTimetableSelectOptions(options, selectedValue = "", placeholder = "Select") {
  return `<option value="">${placeholder}</option>${options.map(option => `<option value="${escapeHtml(option)}" ${option === selectedValue ? "selected" : ""}>${escapeHtml(option)}</option>`).join("")}`;
}

function syncTimetableBuilderRowsFromDom() {
  const rowEls = document.querySelectorAll(".timetable-builder-row");
  if (!rowEls.length) return;
  timetableBuilderRows = [...rowEls].map(row => ({
    id: row.dataset.rowId || `tt-row-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    subject: row.querySelector("[name='rowSubject']")?.value || "",
    teacher: row.querySelector("[name='rowTeacher']")?.value || "",
    startTime: row.querySelector("[name='rowStartTime']")?.value || "",
    endTime: row.querySelector("[name='rowEndTime']")?.value || "",
    room: row.querySelector("[name='rowRoom']")?.value || ""
  }));
}

function renderTimetableBuilderRows() {
  const container = document.getElementById("classTimetableBuilderRows");
  if (!container) return;
  if (!timetableBuilderRows.length) timetableBuilderRows = [createTimetableBuilderRow()];
  const className = classTimetableForm?.elements.className?.value || "";
  const subjects = getTimetableSubjectsForClass(className);
  const teachers = getTimetableTeacherOptions();
  container.innerHTML = timetableBuilderRows.map((row, index) => `
    <div class="timetable-builder-row" data-row-id="${escapeHtml(row.id)}">
      <select name="rowSubject">${getTimetableSelectOptions(subjects, row.subject, "Select subject")}</select>
      <select name="rowTeacher">${getTimetableSelectOptions(teachers, row.teacher, "Select teacher")}</select>
      <input name="rowStartTime" type="time" value="${escapeHtml(row.startTime)}" />
      <input name="rowEndTime" type="time" value="${escapeHtml(row.endTime)}" />
      <input name="rowRoom" value="${escapeHtml(row.room)}" placeholder="Room" />
      <button class="icon-action delete" type="button" data-delete-timetable-row="${escapeHtml(row.id)}" ${timetableBuilderRows.length === 1 ? "disabled" : ""} title="Delete row" aria-label="Delete row ${index + 1}">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 21c-.6 0-1.1-.2-1.5-.6S5 19.5 5 19V8H4V6h5V4h6v2h5v2h-1v11c0 .6-.2 1.1-.6 1.5s-.9.6-1.5.6H7ZM17 8H7v11h10V8Zm-8 9h2v-7H9v7Zm4 0h2v-7h-2v7Z"/></svg>
      </button>
    </div>
  `).join("");
  renderTimetableIntervalOptions();
}

function renderTimetableBuilderSavedEntries() {
  const container = document.getElementById("classTimetableBuilderSavedRows");
  const summary = document.getElementById("classTimetableBuilderSavedSummary");
  const dayFilter = document.getElementById("classTimetableSavedDayFilter");
  if (!container) return;
  if (dayFilter && !dayFilter.value) dayFilter.value = activeTimetableDay || "Monday";
  const className = String(classTimetableForm?.elements.className?.value || "").trim();
  const sectionName = String(classTimetableForm?.elements.sectionName?.value || "").trim();
  if (!className || !sectionName) {
    container.innerHTML = `<div class="timetable-empty-card">Select class and section to view saved timetable entries.</div>`;
    if (summary) summary.textContent = "Select class and section to view saved periods.";
    return;
  }
  const classSection = `${className} ${sectionName}`.trim();
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const dayOrder = new Map(days.map((day, index) => [day, index]));
  const selectedDay = dayFilter?.value || activeTimetableDay || "Monday";
  const entries = classTimetableEntries
    .filter(entry => entry.classSection === classSection)
    .filter(entry => entry.day === selectedDay)
    .sort((a, b) => (dayOrder.get(a.day) ?? 99) - (dayOrder.get(b.day) ?? 99) || Number(a.period || 0) - Number(b.period || 0));
  if (summary) summary.textContent = `${entries.length} saved periods for ${classSection} on ${selectedDay}`;
  container.innerHTML = entries.length ? `
    <div class="timetable-builder-saved-row header">
      <span>Day</span><span>Period</span><span>Subject</span><span>Teacher</span><span>Time</span><span>Action</span>
    </div>
    ${entries.map(entry => `
      <div class="timetable-builder-saved-row">
        <span>${escapeHtml(entry.day || "-")}</span>
        <span>${escapeHtml(entry.period || "-")}</span>
        <span>${escapeHtml(entry.subject || entry.entryType || "-")}</span>
        <span>${escapeHtml(entry.teacher || "-")}</span>
        <span>${escapeHtml(entry.startTime || "-")} - ${escapeHtml(entry.endTime || "-")}</span>
        <span class="inline-actions">
          <button class="icon-action edit" type="button" data-edit-timetable-day="${escapeHtml(entry.day || "Monday")}" title="Edit ${escapeHtml(entry.day || "day")}" aria-label="Edit ${escapeHtml(entry.day || "day")} timetable">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20h4.7L19.3 9.4a2.1 2.1 0 0 0 0-3L17.6 4.7a2.1 2.1 0 0 0-3 0L4 15.3V20Zm3.8-2H6v-1.8l8.5-8.5 1.8 1.8L7.8 18Zm7.9-11.5.4-.4 1.8 1.8-.4.4-1.8-1.8Z"/></svg>
          </button>
          <button class="icon-action delete" type="button" data-delete-timetable="${escapeHtml(entry.id)}" title="Delete period" aria-label="Delete period">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 21c-.6 0-1.1-.2-1.5-.6S5 19.5 5 19V8H4V6h5V4h6v2h5v2h-1v11c0 .6-.2 1.1-.6 1.5s-.9.6-1.5.6H7ZM17 8H7v11h10V8Zm-8 9h2v-7H9v7Zm4 0h2v-7h-2v7Z"/></svg>
          </button>
        </span>
      </div>
    `).join("")}
  ` : `<div class="timetable-empty-card">No saved timetable found for ${escapeHtml(classSection)} on ${escapeHtml(selectedDay)}.</div>`;
}

function renderTimetableIntervalOptions() {
  const select = document.getElementById("intervalAfterPeriod");
  const list = document.getElementById("timetableIntervalList");
  if (!select) return;
  const selected = select.value;
  const maxPeriod = getMaxTimetableLogicalPeriod(timetableBuilderRows);
  select.innerHTML = `<option value="">No interval</option>${Array.from({length: maxPeriod}, (_, index) => `<option value="${index + 1}">After Period ${index + 1}</option>`).join("")}`;
  if (selected && [...select.options].some(option => option.value === selected)) {
    select.value = selected;
  }
  Object.keys(timetableIntervalMap).forEach(period => {
    if (Number(period) > maxPeriod) delete timetableIntervalMap[period];
  });
  if (list) {
    const entries = Object.entries(timetableIntervalMap)
      .sort((a, b) => Number(a[0]) - Number(b[0]));
    list.innerHTML = entries.length
      ? entries.map(([period, minutes]) => `
        <span>
          After Period ${period}: ${minutes} min
          <button type="button" data-delete-timetable-interval="${period}" title="Delete interval" aria-label="Delete interval after period ${period}">×</button>
        </span>
      `).join("")
      : "No interval applied.";
  }
}

function setTimetableIntervalStatus(message = "", tone = "ok") {
  const list = document.getElementById("timetableIntervalList");
  if (!list || !message) return;
  list.insertAdjacentHTML("beforeend", `<strong class="timetable-interval-status ${tone === "error" ? "error" : "ok"}">${escapeHtml(message)}</strong>`);
}

function applySelectedTimetableInterval() {
  const period = Number(classTimetableForm.elements.intervalAfterPeriod?.value || 0);
  const minutes = Number(classTimetableForm.elements.periodInterval?.value || 0);
  if (!period || minutes <= 0) {
    showToast("Interval period and time required.");
    renderTimetableIntervalOptions();
    setTimetableIntervalStatus("Interval period and time required.", "error");
    return;
  }
  timetableIntervalMap[period] = minutes;
  if (applyTimetableQuickParameters({forceOverwrite: true})) {
    const result = applyTimetableTimingToAllBlankEntries({overwriteSavedTimes: true, silent: true});
    const message = `Applied to all classes: ${result.savedUpdated} saved period(s) updated.`;
    setTimetableIntervalStatus(message);
    showToast(message);
  }
}

function applyTimetableQuickParameters(options = {}) {
  syncTimetableBuilderRowsFromDom();
  const startTime = classTimetableForm.elements.periodStartTime?.value || "";
  const duration = Number(classTimetableForm.elements.periodDuration?.value || 0);
  const room = classTimetableForm.elements.quickRoom?.value || "";
  const fillMode = classTimetableForm.elements.timeFillMode?.value || "blank";
  const fillBlankOnly = !options.forceOverwrite && fillMode !== "overwrite";
  if (!startTime || duration <= 0) {
    showToast("Period start time and duration required.");
    renderTimetableIntervalOptions();
    return false;
  }
  const logicalPeriods = getTimetableLogicalPeriods(timetableBuilderRows);
  const timingMap = getTimetableQuickTimingMap(Math.max(...logicalPeriods, 0));
  timetableBuilderRows = timetableBuilderRows.map((row, index) => {
    const logicalPeriod = logicalPeriods[index] || index + 1;
    const timing = timingMap?.get(logicalPeriod);
    if (!timing) return row;
    if (fillBlankOnly && row.startTime && row.endTime) {
      return {...row, room: row.room || room};
    }
    return {...row, startTime: timing.startTime, endTime: timing.endTime, room: room || row.room};
  });
  renderTimetableBuilderRows();
  return true;
}

function getTimetableQuickTimingMap(maxPeriod = 0) {
  const startTime = classTimetableForm.elements.periodStartTime?.value || "";
  const duration = Number(classTimetableForm.elements.periodDuration?.value || 0);
  if (!startTime || duration <= 0 || maxPeriod <= 0) return null;
  const timingMap = new Map();
  let cursor = startTime;
  for (let period = 1; period <= maxPeriod; period += 1) {
    const endTime = getTimeAfterMinutes(cursor, duration);
    timingMap.set(period, {startTime: cursor, endTime});
    cursor = getTimeAfterMinutes(endTime, Number(timetableIntervalMap[period] || 0));
  }
  return timingMap;
}

function applyTimetableTimingToAllBlankEntries(options = {}) {
  syncTimetableBuilderRowsFromDom();
  const overwriteSavedTimes = Boolean(options.overwriteSavedTimes);
  const room = classTimetableForm.elements.quickRoom?.value || "";
  refreshSavedTimetableLogicalPeriods();
  const maxSavedPeriod = classTimetableEntries.reduce((max, entry) => Math.max(max, Number(entry.period || 0)), 0);
  const builderLogicalPeriods = getTimetableLogicalPeriods(timetableBuilderRows);
  const maxBuilderPeriod = builderLogicalPeriods.reduce((max, period) => Math.max(max, Number(period || 0)), 0);
  const maxPeriod = Math.max(maxSavedPeriod, maxBuilderPeriod);
  const timingMap = getTimetableQuickTimingMap(maxPeriod);
  if (!timingMap) {
    showToast("Period start time and duration required.");
    renderTimetableIntervalOptions();
    setTimetableIntervalStatus("Period start time and duration required.", "error");
    return {savedUpdated: 0, builderUpdated: 0};
  }
  let builderUpdated = 0;
  timetableBuilderRows = timetableBuilderRows.map((row, index) => {
    const timing = timingMap.get(builderLogicalPeriods[index] || index + 1);
    if (!timing) return row;
    if (row.startTime && row.endTime) return {...row, room: row.room || room};
    builderUpdated += 1;
    return {...row, startTime: row.startTime || timing.startTime, endTime: row.endTime || timing.endTime, room: row.room || room};
  });
  let savedUpdated = 0;
  classTimetableEntries.forEach(entry => {
    if (!overwriteSavedTimes && entry.startTime && entry.endTime) return;
    const timing = timingMap.get(Number(entry.period || 0));
    if (!timing) return;
    entry.startTime = overwriteSavedTimes ? timing.startTime : entry.startTime || timing.startTime;
    entry.endTime = overwriteSavedTimes ? timing.endTime : entry.endTime || timing.endTime;
    entry.duration = getTimetableDuration(entry.startTime, entry.endTime);
    if (!entry.room && room) entry.room = room;
    savedUpdated += 1;
  });
  renderTimetableBuilderRows();
  renderTimetableBuilderSavedEntries();
  if (savedUpdated) {
    saveAppState();
    renderClassTimetable();
    renderTeacherTimetable();
  }
  if (!options.silent) {
    showToast(`Timing applied to ${savedUpdated} saved ${overwriteSavedTimes ? "period" : "blank period"}(s)${builderUpdated ? ` and ${builderUpdated} open row(s)` : ""}.`);
  }
  return {savedUpdated, builderUpdated};
}

function loadTimetableBuilderForSelection(options = {}) {
  const shouldLoadExisting = Boolean(options.loadExisting);
  const className = String(classTimetableForm.elements.className?.value || "").trim();
  const sectionName = String(classTimetableForm.elements.sectionName?.value || "").trim();
  const day = String(classTimetableForm.elements.day?.value || activeTimetableDay || "Monday");
  if (!className || !sectionName || !day) {
    timetableBuilderRows = [createTimetableBuilderRow()];
    timetableIntervalMap = {};
    renderTimetableBuilderRows();
    renderTimetableBuilderSavedEntries();
    return;
  }
  if (!shouldLoadExisting) {
    timetableBuilderRows = [createTimetableBuilderRow()];
    timetableIntervalMap = {};
    renderTimetableBuilderRows();
    renderTimetableBuilderSavedEntries();
    return;
  }
  const classSection = `${className} ${sectionName}`.trim();
  const existingEntries = classTimetableEntries
    .filter(entry => entry.classSection === classSection && entry.day === day)
    .sort((a, b) => Number(a.period || 0) - Number(b.period || 0));
  if (!existingEntries.length) {
    timetableBuilderRows = [createTimetableBuilderRow()];
    timetableIntervalMap = {};
    renderTimetableBuilderRows();
    renderTimetableBuilderSavedEntries();
    return;
  }
  timetableBuilderRows = existingEntries.map(entry => ({
    id: `tt-row-${entry.id || Date.now()}-${Math.random().toString(16).slice(2)}`,
    subject: entry.subject || "",
    teacher: entry.teacher || "",
    startTime: entry.startTime || "",
    endTime: entry.endTime || "",
    room: entry.room || ""
  }));
  timetableIntervalMap = {};
  renderTimetableBuilderRows();
  renderTimetableBuilderSavedEntries();
}

function renderClassTimetableOptions() {
  const classSelect = classTimetableForm?.elements.className;
  const sectionSelect = classTimetableForm?.elements.sectionName;
  const subjectOptions = document.getElementById("classTimetableSubjectOptions");
  const teacherOptions = document.getElementById("classTimetableTeacherOptions");
  const classFilter = document.getElementById("classTimetableClassFilter");
  const sectionFilter = document.getElementById("classTimetableSectionFilter");
  if (classSelect) {
    const selected = classSelect.value;
    const classNames = getAdmissionClassOptions();
    classSelect.innerHTML = `<option value="">Select class</option>${classNames.map(className => `<option value="${escapeHtml(className)}">${escapeHtml(className)}</option>`).join("")}`;
    if (selected && classNames.includes(selected)) classSelect.value = selected;
  }
  if (sectionSelect) {
    const selected = sectionSelect.value;
    const sections = getAdmissionSectionOptions();
    sectionSelect.innerHTML = `<option value="">Select section</option>${sections.map(section => `<option value="${escapeHtml(section)}">${escapeHtml(section)}</option>`).join("")}`;
    if (selected && sections.includes(selected)) sectionSelect.value = selected;
  }
  if (subjectOptions) {
    const className = classSelect?.value || "";
    subjectOptions.innerHTML = getTimetableSubjectsForClass(className).map(subject => `<option value="${escapeHtml(subject)}"></option>`).join("");
  }
  if (teacherOptions) {
    teacherOptions.innerHTML = getTimetableTeacherOptions()
      .map(teacher => `<option value="${escapeHtml(teacher)}"></option>`)
      .join("");
  }
  renderTeacherTimetableOptions();
  if (classFilter) {
    const selected = classFilter.value;
    const classNames = getAdmissionClassOptions();
    classFilter.innerHTML = `<option value="">All Classes</option>${classNames.map(className => `<option value="${escapeHtml(className)}">${escapeHtml(className)}</option>`).join("")}`;
    if (selected && classNames.includes(selected)) classFilter.value = selected;
  }
  if (sectionFilter) {
    const selected = sectionFilter.value;
    const sections = getAdmissionSectionOptions();
    sectionFilter.innerHTML = `<option value="">All Sections</option>${sections.map(section => `<option value="${escapeHtml(section)}">${escapeHtml(section)}</option>`).join("")}`;
    if (selected && sections.includes(selected)) sectionFilter.value = selected;
  }
  renderTimetableBuilderRows();
  renderTimetableBuilderSavedEntries();
}

function renderClassTimetable() {
  const board = document.getElementById("classTimetableRows");
  if (!board) return;
  renderClassTimetableOptions();
  const classFilter = document.getElementById("classTimetableClassFilter")?.value || "";
  const sectionFilter = document.getElementById("classTimetableSectionFilter")?.value || "";
  const visibleEntries = classTimetableEntries
    .filter(entry => !classFilter || entry.className === classFilter || String(entry.classSection || "").startsWith(classFilter))
    .filter(entry => !sectionFilter || entry.sectionName === sectionFilter || (!entry.sectionName && String(entry.classSection || "").startsWith(classFilter || "")))
    .sort((a, b) => a.classSection.localeCompare(b.classSection, undefined, {numeric: true})
      || ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].indexOf(a.day) - ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].indexOf(b.day)
      || Number(a.period || 0) - Number(b.period || 0));
  const classCount = new Set(classTimetableEntries.map(entry => entry.classSection).filter(Boolean)).size;
  const subjectCount = new Set(classTimetableEntries.filter(entry => entry.entryType === "Class").map(entry => entry.subject).filter(Boolean)).size;
  const teacherCount = new Set(classTimetableEntries.map(entry => entry.teacher).filter(Boolean)).size;
  const breakCount = classTimetableEntries.filter(entry => entry.entryType !== "Class").length;
  const summary = document.getElementById("classTimetableSummary");
  if (summary) summary.textContent = `${classTimetableEntries.length} timetable entries`;
  const classCountEl = document.getElementById("timetableClassCount");
  const subjectCountEl = document.getElementById("timetableSubjectCount");
  const teacherCountEl = document.getElementById("timetableTeacherCount");
  const breakCountEl = document.getElementById("timetableBreakCount");
  if (classCountEl) classCountEl.textContent = classCount;
  if (subjectCountEl) subjectCountEl.textContent = subjectCount;
  if (teacherCountEl) teacherCountEl.textContent = teacherCount;
  if (breakCountEl) breakCountEl.textContent = breakCount;
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  board.innerHTML = days.map(day => {
    const dayEntries = visibleEntries.filter(entry => entry.day === day);
    return `
      <section class="timetable-day-column">
        <h3>${day}</h3>
        <div class="timetable-day-cards">
          ${dayEntries.length ? dayEntries.map(entry => `
            <article class="timetable-period-card">
              <div class="timetable-card-line subject">Subject: ${escapeHtml(entry.entryType === "Class" ? entry.subject || "Subject" : entry.entryType)}</div>
              <div class="timetable-card-line time">${escapeHtml(entry.startTime || "-")} - ${escapeHtml(entry.endTime || "-")}</div>
              <div class="timetable-card-line teacher">${escapeHtml(entry.teacher || "-")}</div>
              <div class="timetable-card-line room">Room No.: ${escapeHtml(entry.room || "-")}</div>
              <button class="icon-action delete timetable-card-delete" type="button" data-delete-timetable="${escapeHtml(entry.id)}" title="Delete period" aria-label="Delete period">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 21c-.6 0-1.1-.2-1.5-.6S5 19.5 5 19V8H4V6h5V4h6v2h5v2h-1v11c0 .6-.2 1.1-.6 1.5s-.9.6-1.5.6H7ZM17 8H7v11h10V8Zm-8 9h2v-7H9v7Zm4 0h2v-7h-2v7Z"/></svg>
              </button>
            </article>
          `).join("") : `<article class="timetable-empty-card">Not Scheduled</article>`}
        </div>
      </section>
    `;
  }).join("");
}

function renderTeacherTimetableOptions() {
  const select = document.getElementById("teacherTimetableSelect");
  if (!select) return "";
  const previous = select.value;
  const teachers = [...new Set([
    ...getTimetableTeacherOptions(),
    ...classTimetableEntries.map(entry => entry.teacher).filter(Boolean)
  ])].sort((a, b) => a.localeCompare(b));
  select.innerHTML = `<option value="">Select teacher</option>${teachers.map(teacher => `<option value="${escapeHtml(teacher)}">${escapeHtml(teacher)}</option>`).join("")}`;
  if (previous && teachers.includes(previous)) select.value = previous;
  return select.value;
}

function renderTeacherTimetable() {
  const board = document.getElementById("teacherTimetableRows");
  if (!board) return;
  const selectedTeacher = renderTeacherTimetableOptions();
  const entries = classTimetableEntries
    .filter(entry => !selectedTeacher || entry.teacher === selectedTeacher)
    .sort((a, b) => ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].indexOf(a.day) - ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].indexOf(b.day)
      || String(a.startTime || "").localeCompare(String(b.startTime || ""))
      || String(a.classSection || "").localeCompare(String(b.classSection || ""), undefined, {numeric: true}));
  const subjectCount = new Set(entries.map(entry => entry.subject).filter(Boolean)).size;
  const dayCount = new Set(entries.map(entry => entry.day).filter(Boolean)).size;
  const classCountEl = document.getElementById("teacherTimetableClassCount");
  const subjectCountEl = document.getElementById("teacherTimetableSubjectCount");
  const dayCountEl = document.getElementById("teacherTimetableDayCount");
  if (classCountEl) classCountEl.textContent = entries.length;
  if (subjectCountEl) subjectCountEl.textContent = subjectCount;
  if (dayCountEl) dayCountEl.textContent = dayCount;
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  board.innerHTML = selectedTeacher ? days.map(day => {
    const dayEntries = entries.filter(entry => entry.day === day);
    return `
      <section class="timetable-day-column">
        <h3>${day}</h3>
        <div class="timetable-day-cards">
          ${dayEntries.length ? dayEntries.map(entry => `
            <article class="timetable-period-card teacher-period-card">
              <div class="timetable-card-line subject">${escapeHtml(entry.subject || "Subject")}</div>
              <div class="timetable-card-line time">${escapeHtml(entry.startTime || "-")} - ${escapeHtml(entry.endTime || "-")}</div>
              <div class="timetable-card-line teacher">${escapeHtml(entry.classSection || "-")}</div>
              <div class="timetable-card-line room">Room No.: ${escapeHtml(entry.room || "-")}</div>
            </article>
          `).join("") : `<article class="timetable-empty-card">Not Scheduled</article>`}
        </div>
      </section>
    `;
  }).join("") : `<article class="timetable-empty-card teacher-timetable-empty">Select a teacher to view timetable.</article>`;
}

function getClassTeacherStaffOptions() {
  const activeStaff = staffMembers.filter(staff => String(staff.status || "Active") !== "Disabled");
  const teachers = activeStaff.filter(staff =>
    /teacher|teaching/i.test(`${staff.role || ""} ${staff.designation || ""} ${staff.department || ""} ${staff.teachingSubject || ""}`)
  );
  return teachers.length ? teachers : activeStaff;
}

function getClassTeacherAssignmentRows() {
  return staffMembers
    .filter(staff => String(staff.status || "Active") !== "Disabled" && String(staff.assignedClass || "").trim())
    .sort((a, b) => String(a.assignedClass || "").localeCompare(String(b.assignedClass || ""), undefined, {numeric: true}));
}

function getClassTeacherSection(staff = {}) {
  if (staff.assignedSection) return staff.assignedSection;
  return splitStudentClassSection(staff.assignedClass || "").section || "";
}

function getClassTeacherClass(staff = {}) {
  if (staff.assignedClassName) return staff.assignedClassName;
  return splitStudentClassSection(staff.assignedClass || "").klass || staff.assignedClass || "";
}

function renderClassTeacherAssignment() {
  const form = classTeacherAssignmentForm;
  const rows = document.getElementById("classTeacherAssignmentRows");
  const count = document.getElementById("classTeacherAssignmentCount");
  const classSelect = form?.elements.className;
  const sectionSelect = form?.elements.sectionName;
  const teacherSelect = form?.elements.staffId;
  const classes = [...new Set([
    ...getAdmissionClassOptions(),
    ...getActiveStudents().map(student => splitStudentClassSection(student.klass || "").klass).filter(Boolean)
  ])].sort((a, b) => a.localeCompare(b, undefined, {numeric: true}));
  const sections = [...new Set([
    ...getAdmissionSectionOptions(),
    ...getActiveStudents().map(student => splitStudentClassSection(student.klass || "").section).filter(Boolean)
  ])].sort((a, b) => a.localeCompare(b, undefined, {numeric: true}));
  const currentClass = classSelect?.value || "";
  const currentSection = sectionSelect?.value || "";
  const currentTeacher = teacherSelect?.value || "";
  if (classSelect) {
    classSelect.innerHTML = `<option value="">Select Class</option>` + classes
      .map(className => `<option value="${escapeHtml(className)}">${escapeHtml(className)}</option>`)
      .join("");
    if (currentClass) setSelectValue(classSelect, currentClass);
  }
  if (sectionSelect) {
    sectionSelect.innerHTML = `<option value="">All / No Section</option>` + sections
      .map(section => `<option value="${escapeHtml(section)}">${escapeHtml(section)}</option>`)
      .join("");
    if (currentSection) setSelectValue(sectionSelect, currentSection);
  }
  if (teacherSelect) {
    const teachers = getClassTeacherStaffOptions();
    teacherSelect.innerHTML = `<option value="">Select Teacher</option>` + teachers
      .map(staff => `<option value="${escapeHtml(staff.staffId)}">${escapeHtml(staff.name || staff.staffId)}${staff.designation ? ` - ${escapeHtml(staff.designation)}` : ""}</option>`)
      .join("");
    if (currentTeacher) setSelectValue(teacherSelect, currentTeacher);
  }
  const assignments = getClassTeacherAssignmentRows();
  if (count) count.textContent = `${assignments.length} assigned`;
  if (!rows) return;
  rows.innerHTML = assignments.map(staff => {
    const className = getClassTeacherClass(staff);
    const sectionName = getClassTeacherSection(staff);
    return `
      <tr>
        <td><span class="class-teacher-chip">${escapeHtml(className || "-")}</span></td>
        <td><span class="class-teacher-chip section">${escapeHtml(sectionName || "All")}</span></td>
        <td><strong>${escapeHtml(staff.name || "-")}</strong><br><small>${escapeHtml(staff.staffId || "-")} | ${escapeHtml(staff.designation || staff.role || "-")}</small></td>
        <td>${escapeHtml(staff.teachingSubject || "-")}</td>
        <td>${escapeHtml(staff.phone || "-")}</td>
        <td>
          <div class="row-actions">
            <button class="icon-action edit" type="button" data-edit-class-teacher="${escapeHtml(staff.staffId)}" title="Edit class teacher" aria-label="Edit class teacher ${escapeHtml(staff.name || staff.staffId)}">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20h4.7L19.3 9.4a2.1 2.1 0 0 0 0-3L17.6 4.7a2.1 2.1 0 0 0-3 0L4 15.3V20Zm3.8-2H6v-1.8l8.5-8.5 1.8 1.8L7.8 18Zm7.9-11.5.4-.4 1.8 1.8-.4.4-1.8-1.8Z"/></svg>
            </button>
            <button class="icon-action delete" type="button" data-delete-class-teacher="${escapeHtml(staff.staffId)}" title="Remove class teacher" aria-label="Remove class teacher ${escapeHtml(staff.name || staff.staffId)}">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 21c-.6 0-1.1-.2-1.5-.6S5 19.5 5 19V8H4V6h5V4h6v2h5v2h-1v11c0 .6-.2 1.1-.6 1.5s-.9.6-1.5.6H7ZM17 8H7v11h10V8Zm-8 9h2v-7H9v7Zm4 0h2v-7h-2v7Z"/></svg>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join("") || `<tr><td colspan="6">No class teacher assigned yet.</td></tr>`;
}

function setStudentReportPanel(activePanelId) {
  const classPanel = document.getElementById("classSectionReportPanel");
  const genderPanel = document.getElementById("studentGenderRatioReportPanel");
  const teacherPanel = document.getElementById("studentTeacherRatioReportPanel");
  if (classPanel) classPanel.hidden = activePanelId !== "classSectionReportPanel";
  if (genderPanel) genderPanel.hidden = activePanelId !== "studentGenderRatioReportPanel";
  if (teacherPanel) teacherPanel.hidden = activePanelId !== "studentTeacherRatioReportPanel";
  [
    ["classSectionReportBtn", "classSectionReportPanel"],
    ["studentGenderRatioReportBtn", "studentGenderRatioReportPanel"],
    ["studentTeacherRatioReportBtn", "studentTeacherRatioReportPanel"]
  ].forEach(([buttonId, panelId]) => {
    const button = document.getElementById(buttonId);
    if (!button) return;
    button.classList.toggle("active", activePanelId === panelId);
  });
}

function openClassSectionReportDetails(classSection) {
  const group = getClassSectionGroups().find(item => item.klass === classSection);
  if (!group) {
    showToast("Class report not found.");
    return;
  }
  receiptPreviewBody.innerHTML = `
    <article class="class-section-detail-card">
      <header class="receipt-preview-hero">
        <div>
          <span>Student Information</span>
          <h2>${escapeHtml(group.klass)}</h2>
          <p>Total Students: ${group.students.length}</p>
        </div>
      </header>
      <div class="table-wrap class-section-detail-table">
        <table>
          <thead><tr><th>SL</th><th>Student Name</th><th>Admission No.</th><th>Guardian</th><th>Phone</th><th>Father</th><th>Mother</th><th>Village/Town</th></tr></thead>
          <tbody>
            ${group.students.map((student, index) => `
              <tr>
                <td>${index + 1}</td>
                <td><strong>${escapeHtml(student.name || "-")}</strong></td>
                <td>${escapeHtml(student.admissionNo || "-")}</td>
                <td>${escapeHtml(student.guardian || "-")}</td>
                <td>${escapeHtml(student.mobile || student.fatherMobile || student.motherMobile || "-")}</td>
                <td>${escapeHtml(student.fatherName || "-")}</td>
                <td>${escapeHtml(student.motherName || "-")}</td>
                <td>${escapeHtml(student.villageTown || "-")}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    </article>
  `;
  receiptPreviewModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
}

const STUDENT_EXPORT_COLUMNS = [
  ["admissionNo", "Admission No"],
  ["name", "Student Name"],
  ["klass", "Class"],
  ["studentType", "Student Type"],
  ["dob", "Date of Birth"],
  ["gender", "Gender"],
  ["bloodGroup", "Blood Group"],
  ["nationality", "Nationality"],
  ["religion", "Religion"],
  ["motherTongue", "Mother Tongue"],
  ["villageTown", "Village/Town"],
  ["guardian", "Guardian Name"],
  ["mobile", "Mobile"],
  ["email", "Email"],
  ["fatherName", "Father Name"],
  ["fatherMobile", "Father Mobile"],
  ["motherName", "Mother Name"],
  ["motherMobile", "Mother Mobile"],
  ["address", "Address"],
  ["fee", "Fee Status"],
  ["route", "Route"],
  ["tuitionFee", "Tuition Fee"],
  ["transportFee", "Transport Fee"],
  ["dayBoardingFee", "Day Boarding Fee"],
  ["othersFee", "Tiffin Fee"],
  ["roboticsFee", "Robotics Fee"]
];

function toCsvCell(value) {
  const text = Array.isArray(value) ? value.join("; ") : String(value ?? "");
  return `"${text.replace(/"/g, '""')}"`;
}

function parseCsvRows(text) {
  const rows = [];
  let row = [];
  let cell = "";
  let inQuotes = false;
  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const next = text[index + 1];
    if (char === '"' && inQuotes && next === '"') {
      cell += '"';
      index += 1;
    } else if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      row.push(cell);
      cell = "";
    } else if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && next === "\n") index += 1;
      row.push(cell);
      if (row.some(item => item.trim())) rows.push(row);
      row = [];
      cell = "";
    } else {
      cell += char;
    }
  }
  row.push(cell);
  if (row.some(item => item.trim())) rows.push(row);
  return rows;
}

function exportStudentsExcel() {
  const activeStudents = getActiveStudents();
  const header = STUDENT_EXPORT_COLUMNS.map(([, label]) => toCsvCell(label)).join(",");
  const body = activeStudents.map(student => STUDENT_EXPORT_COLUMNS
    .map(([key]) => toCsvCell(student[key]))
    .join(","));
  const csv = [header, ...body].join("\n");
  const blob = new Blob([`\uFEFF${csv}`], {type: "text/csv;charset=utf-8"});
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `student-details-${formatDateDDMMYYYY(new Date()).replaceAll("-", "")}.csv`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(link.href);
  showToast(`${activeStudents.length} student details exported.`);
}

function importStudentsExcelFile(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    const rows = parseCsvRows(String(reader.result || ""));
    if (rows.length < 2) {
      showToast("No student rows found in import file.");
      return;
    }
    const header = rows[0].map(item => item.trim().toLowerCase());
    const headerMap = new Map(STUDENT_EXPORT_COLUMNS.map(([key, label]) => [label.toLowerCase(), key]));
    let added = 0;
    let updated = 0;
    rows.slice(1).forEach(row => {
      const imported = {};
      header.forEach((label, index) => {
        const key = headerMap.get(label);
        if (key) imported[key] = String(row[index] || "").trim();
      });
      if (!imported.admissionNo || !imported.name) return;
      ["tuitionFee", "transportFee", "dayBoardingFee", "othersFee", "roboticsFee"].forEach(key => {
        if (imported[key] !== undefined) imported[key] = Number(imported[key] || 0);
      });
      imported.status = imported.status || "Present";
      imported.fee = imported.fee || "Due";
      imported.route = imported.route || "Self";
      imported.studentType = imported.studentType || "New Student";
      const existingIndex = students.findIndex(student => normalizeAdmissionNo(student.admissionNo) === normalizeAdmissionNo(imported.admissionNo));
      if (existingIndex >= 0) {
        students[existingIndex] = {...students[existingIndex], ...imported};
        updated += 1;
      } else {
        students.unshift(imported);
        added += 1;
      }
    });
    saveAppState();
    renderStudents();
    renderDisabledStudents();
    renderFeeBookStudentOptions();
    renderDueFeesSearch();
    renderStudentFeeCounter();
    renderStudentTransportFees();
    renderNonTransportStudents();
    renderTransportRoutePickupPoints();
    showToast(`Import complete: ${added} added, ${updated} updated.`);
  };
  reader.readAsText(file);
}

function normalizeStaffAttendanceHeader(header = "") {
  return String(header || "").trim().toLowerCase().replace(/[\s_-]+/g, "");
}

function importStaffAttendanceFile(file) {
  if (!file) return;
  saveStaffBiometricDevice();
  const reader = new FileReader();
  reader.onload = () => {
    const rows = parseCsvRows(String(reader.result || ""));
    if (rows.length < 2) {
      showToast("No biometric attendance rows found.");
      return;
    }
    const headers = rows[0].map(normalizeStaffAttendanceHeader);
    const getCell = (row, names) => {
      const index = headers.findIndex(header => names.includes(header));
      return index >= 0 ? String(row[index] || "").trim() : "";
    };
    let imported = 0;
    rows.slice(1).forEach(row => {
      const staffId = getCell(row, ["staffid", "employeeid", "empid", "userid", "id"]);
      const staffName = getCell(row, ["staffname", "employeename", "name"]);
      const staff = getStaffByIdOrName(staffId, staffName);
      const record = {
        date: formatDateDDMMYYYY(getCell(row, ["date", "attendancedate"]) || document.getElementById("staffAttendanceDate")?.value || formatDateDDMMYYYY(new Date())),
        staffId: staffId || staff?.staffId || "",
        staffName: staffName || staff?.name || "",
        department: staff?.department || getCell(row, ["department", "dept"]),
        designation: staff?.designation || getCell(row, ["designation", "post"]),
        inTime: getCell(row, ["intime", "checkin", "in", "firstpunch"]),
        outTime: getCell(row, ["outtime", "checkout", "out", "lastpunch"]),
        deviceId: getCell(row, ["deviceid", "device", "machineid"]) || staffBiometricDevice.device || "",
        status: getCell(row, ["status", "attendancestatus"])
      };
      if (!record.staffId && !record.staffName) return;
      const existingIndex = staffAttendanceRecords.findIndex(item =>
        item.date === record.date
        && String(item.staffId || "").toLowerCase() === String(record.staffId || "").toLowerCase()
      );
      if (existingIndex >= 0) staffAttendanceRecords[existingIndex] = {...staffAttendanceRecords[existingIndex], ...record};
      else staffAttendanceRecords.unshift(record);
      imported += 1;
    });
    saveAppState();
    renderStaffAttendance();
    showToast(`${imported} biometric attendance rows imported.`);
  };
  reader.readAsText(file);
}

function renderDisabledStudents() {
  const rows = document.getElementById("disabledStudentRows");
  if (!rows) return;
  const disabledStudents = students.filter(isStudentDisabled);
  rows.innerHTML = disabledStudents.map(student => `
    <tr>
      <td><input type="checkbox" disabled checked aria-label="${student.name || "Student"} disabled" /></td>
      <td><strong>${student.name || "-"}</strong></td>
      <td>${student.klass || "-"}</td>
      <td>${student.admissionNo || "-"}</td>
      <td>${student.disabledReason || "-"}</td>
      <td><span class="badge red">Disabled</span></td>
      <td>${student.disabledAt ? formatDateDDMMYYYY(student.disabledAt) : "-"}</td>
      <td><button class="mini enable-student-action" type="button" data-enable-student="${student.admissionNo || ""}">Enable</button></td>
    </tr>
  `).join("") || `<tr><td colspan="8">No disabled students yet.</td></tr>`;
}

function openDisableReasonModal(admissionNo) {
  const student = findStudentByAdmissionNo(admissionNo);
  if (!student) {
    showToast("Student not found.");
    return false;
  }
  disableReasonForm.elements.admissionNo.value = student.admissionNo || "";
  disableReasonForm.elements.reason.value = student.disabledReason || "";
  document.getElementById("disableReasonTitle").textContent = `Disable ${student.name || "Student"}`;
  document.getElementById("disableReasonStudent").textContent = `${student.admissionNo || "-"} | ${student.klass || "-"} | This student will move to Disable Student page.`;
  disableReasonModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  setTimeout(() => disableReasonForm.elements.reason.focus(), 0);
  return true;
}

function closeDisableReasonModal() {
  disableReasonForm.reset();
  disableReasonModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
}

function disableStudentByAdmissionNo(admissionNo, reason) {
  const student = findStudentByAdmissionNo(admissionNo);
  if (!student) {
    showToast("Student not found.");
    return false;
  }
  const cleanReason = String(reason || "").trim();
  if (!cleanReason) {
    showToast("Disable reason is required.");
    return false;
  }
  student.disabled = true;
  student.disabledAt = new Date().toISOString();
  student.disabledReason = cleanReason;
  if (normalizeAdmissionNo(activeLedgerAdmissionNo) === normalizeAdmissionNo(admissionNo)) activeLedgerAdmissionNo = "";
  if (normalizeAdmissionNo(activeFeeStudentAdmissionNo) === normalizeAdmissionNo(admissionNo)) activeFeeStudentAdmissionNo = "";
  saveAppState();
  renderStudents();
  renderDisabledStudents();
  renderFeeBookStudentOptions();
  renderDueFeesSearch();
  renderStudentFeeCounter();
  renderStudentTransportFees();
  renderNonTransportStudents();
  renderTransportRoutePickupPoints();
  renderFinanceSession(false);
  renderDashboardOnly();
  renderFeeBook();
  setView("disableStudent");
  showToast(`${student.name} disabled.`);
  return true;
}

function renderBars() {
  document.getElementById("attendanceBars").innerHTML = attendance.map(([label, value]) => `
    <div class="bar">
      <i style="height:${value * 1.8}px"></i>
      <span>${label}</span>
    </div>
  `).join("") || `<div class="empty-chart">No attendance data entered yet.</div>`;
}

function renderTasks() {
  document.getElementById("taskList").innerHTML = tasks.map(([area, message, owner, priority], index) => `
    <article>
      <b>${index + 1}</b>
      <div>
        <strong>${area}</strong>
        <p>${message}</p>
        <small>${owner}</small>
      </div>
      <em>${priority}</em>
    </article>
  `).join("") || `<article><b>0</b><div><strong>No priority actions</strong><p>New tasks will appear after entry.</p><small>Ready</small></div><em>Empty</em></article>`;
}

function moduleActivityTime(value = "") {
  if (!value) return 0;
  const clean = String(value || "").trim();
  if (!clean) return 0;
  const normalized = normalizeCollectionHistoryDateValue(clean);
  const match = normalized.match(/^(\d{2})-(\d{2})-(\d{2}|\d{4})$/);
  if (match) {
    const year = match[3].length === 2 ? Number(`20${match[3]}`) : Number(match[3]);
    const date = new Date(year, Number(match[2]) - 1, Number(match[1]));
    return Number.isNaN(date.getTime()) ? 0 : date.getTime();
  }
  const date = new Date(clean);
  return Number.isNaN(date.getTime()) ? 0 : date.getTime();
}

function collectModuleActivities() {
  const activities = [];
  getDailyCollectionReportRows().slice(0, 4).forEach(row => {
    activities.push({
      title: "Fee collection posted",
      detail: `${row.date} | ${formatRs(row.total)} | ${row.receipts.size} receipt(s)`,
      badge: "Finance",
      tone: "stable",
      time: moduleActivityTime(row.date)
    });
  });
  notices.slice(0, 4).forEach(item => activities.push({
    title: "Notice published",
    detail: `${getNoticeDateLabel(item)} | ${item.title || "School notice"}`,
    badge: "Notice",
    tone: "live",
    time: moduleActivityTime(item.noticeDate || item.publishDate || item.date || item.createdAt)
  }));
  homework.slice(0, 4).forEach(item => activities.push({
    title: "Homework assigned",
    detail: `${item.className || "Class"} | ${item.subject || "Subject"} | Due ${item.due || "-"}`,
    badge: "Homework",
    tone: "watch",
    time: moduleActivityTime(item.createdAt || item.date || item.due)
  }));
  complaintRecords.slice(0, 4).forEach(item => activities.push({
    title: "Complaint updated",
    detail: `${item.studentName || item.name || item.source || "Complaint"} | ${item.status || item.reviewStatus || "Review"}`,
    badge: "Complaint",
    tone: "pending",
    time: moduleActivityTime(item.createdAt || item.date || item.updatedAt)
  }));
  teacherLeaves.slice(0, 4).forEach(item => activities.push({
    title: "Leave request received",
    detail: `${item.teacherName || item.staffName || "Staff"} | ${item.from || "-"} to ${item.to || "-"}`,
    badge: "Leave",
    tone: "watch",
    time: moduleActivityTime(item.createdAt || item.from || item.date)
  }));
  students.slice(0, 4).forEach(item => activities.push({
    title: "Student record saved",
    detail: `${item.name || "Student"} | ${item.className || item.class || "-"} | ${item.admissionNo || "-"}`,
    badge: "Student",
    tone: "live",
    time: moduleActivityTime(item.updatedAt || item.createdAt || item.admissionDate || item.date)
  }));
  return activities
    .sort((a, b) => (b.time || 0) - (a.time || 0))
    .slice(0, 10);
}

function renderModules() {
  const activities = collectModuleActivities();
  document.getElementById("moduleStatus").innerHTML = activities.map(item => `
    <article>
      <div>
        <strong>${escapeHtml(item.title)}</strong>
        <small>${escapeHtml(item.detail)}</small>
      </div>
      <span class="status-pill ${item.tone}">${escapeHtml(item.badge)}</span>
    </article>
  `).join("") || `<article><div><strong>No module activity</strong><small>Operational records will appear after entry.</small></div><span class="status-pill stable">Empty</span></article>`;
}

function resetAdmissionEnquiryEditing() {
  editingAdmissionEnquiryIndex = -1;
  if (admissionEnquiryForm) {
    admissionEnquiryForm.reset();
    admissionEnquiryForm.elements.date.value = toDateInputValue(new Date());
  }
  const button = admissionEnquiryForm?.querySelector("button[type='submit']");
  if (button) button.textContent = "Save Enquiry";
}

function renderAdmissionEnquiryOptions() {
  if (!admissionEnquiryForm) return;
  const select = admissionEnquiryForm.elements.className;
  const current = select.value;
  select.innerHTML = `<option value="">Select Class</option>` + getAdmissionClassOptions()
    .map(className => `<option value="${escapeHtml(className)}">${escapeHtml(className)}</option>`)
    .join("");
  if (current) setSelectValue(select, current);
  if (!admissionEnquiryForm.elements.date.value) admissionEnquiryForm.elements.date.value = toDateInputValue(new Date());
}

function renderAdmissionEnquiryModule() {
  renderAdmissionEnquiryOptions();
  const rows = document.getElementById("admissionEnquiryRows");
  const summary = document.getElementById("admissionEnquirySummary");
  if (summary) summary.textContent = `${admissionEnquiries.length} enquiries saved.`;
  if (!rows) return;
  rows.innerHTML = admissionEnquiries.map((item, index) => `
    <tr>
      <td>${formatDateDDMMYYYY(item.date)}</td>
      <td><strong>${escapeHtml(item.studentName || "-")}</strong><br><small>${escapeHtml(item.villageTown || "")}</small></td>
      <td>${escapeHtml(item.guardianName || "-")}</td>
      <td>${escapeHtml(item.mobile || "-")}</td>
      <td>${escapeHtml(item.className || "-")}</td>
      <td><span class="badge ${item.status === "Admitted" ? "green" : item.status === "Closed" ? "red" : "amber"}">${escapeHtml(item.status || "New")}</span></td>
      <td>
        <button class="icon-action edit" type="button" data-edit-enquiry="${index}" title="Edit enquiry" aria-label="Edit enquiry">✎</button>
        <button class="icon-action delete" type="button" data-delete-enquiry="${index}" title="Delete enquiry" aria-label="Delete enquiry">×</button>
      </td>
    </tr>
  `).join("") || `<tr><td colspan="7">No admission enquiry saved yet.</td></tr>`;
}

function resetComplaintEditing() {
  editingComplaintIndex = -1;
  if (complaintRegisterForm) {
    complaintRegisterForm.reset();
    complaintRegisterForm.elements.date.value = toDateInputValue(new Date());
  }
  const button = complaintRegisterForm?.querySelector("button[type='submit']");
  if (button) button.textContent = "Save Complaint";
}

function getComplaintForType(item = {}) {
  return item.forType || (item.studentId || item.studentName ? "Student" : item.teacherId ? "Teacher" : "General");
}

function getComplaintPersonName(item = {}) {
  return item.personName || item.studentName || item.teacherName || "-";
}

function getComplaintCategory(item = {}) {
  return item.category || item.type || "-";
}

function getComplaintDetails(item = {}) {
  return item.details || item.note || "-";
}

function getComplaintSource(item = {}) {
  if (item.source === "student") return "Student App";
  if (item.source === "teacher") return "Teacher App";
  return item.source || "Front Office";
}

function getComplaintStatusClass(status = "", priority = "") {
  const clean = String(status || "Open").trim().toLowerCase();
  if (clean === "review" || clean === "accepted") return "review";
  if (clean === "cancelled" || clean === "rejected") return "cancelled";
  if (clean === "in progress") return "progress";
  if (clean === "resolved" || clean === "closed") return "done";
  if (priority === "Urgent") return "cancelled";
  return "open";
}

function getComplaintShortText(details = "") {
  const text = String(details || "-").trim();
  return text.length > 82 ? `${text.slice(0, 82)}...` : text;
}

function ensureComplaintRecordId(item = {}) {
  if (!item.id) item.id = item.complaintNo || `complaint-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  return item.id;
}

function getComplaintSatisfactionLabel(item = {}) {
  if (item.satisfactionStatus === "Satisfied" || item.guardianSatisfied) return "Guardian Satisfied";
  if (item.satisfactionStatus === "Waiting") return "Waiting Satisfaction";
  if (item.satisfactionStatus === "Auto Closed") return "Auto Closed";
  return "";
}

function autoCloseExpiredComplaintSatisfaction() {
  const now = Date.now();
  let changed = false;
  complaintRecords.forEach(item => {
    if (item.satisfactionStatus !== "Waiting" || !item.satisfactionRequestedAt) return;
    const requestedAt = Date.parse(item.satisfactionRequestedAt);
    if (!Number.isFinite(requestedAt)) return;
    const autoCloseDays = Number(item.satisfactionAutoCloseDays || 15) || 15;
    if (now - requestedAt < autoCloseDays * 24 * 60 * 60 * 1000) return;
    item.status = "Closed";
    item.reviewStatus = "Closed";
    item.satisfactionStatus = "Auto Closed";
    item.autoClosedAt = new Date().toISOString();
    changed = true;
  });
  return changed;
}

function renderComplaintsDesk() {
  const autoClosed = autoCloseExpiredComplaintSatisfaction();
  const typeFilter = document.getElementById("complaintTypeFilter")?.value || "All";
  const statusFilter = document.getElementById("complaintStatusFilter")?.value || "All";
  const rows = document.getElementById("complaintsDeskRows");
  const summary = document.getElementById("complaintsDeskSummary");
  const filtered = complaintRecords.filter(item =>
    (typeFilter === "All" || getComplaintForType(item) === typeFilter) &&
    (statusFilter === "All" || item.status === statusFilter)
  );
  if (summary) summary.textContent = `${filtered.length} of ${complaintRecords.length} complaints showing.`;
  if (autoClosed) saveAppState();
  if (!rows) return;
  rows.innerHTML = filtered.map((item) => {
    const index = complaintRecords.indexOf(item);
    const forType = getComplaintForType(item);
    const personName = getComplaintPersonName(item);
    const category = getComplaintCategory(item);
    const details = getComplaintDetails(item);
    const source = getComplaintSource(item);
    const status = item.status || "Open";
    const satisfactionLabel = getComplaintSatisfactionLabel(item);
    return `
      <tr>
        <td>${formatDateDDMMYYYY(item.date)}</td>
        <td><span class="badge ${forType === "Teacher" ? "amber" : forType === "Student" ? "green" : "blue"}">${escapeHtml(forType)}</span></td>
        <td><strong>${escapeHtml(personName)}</strong><br><small>${escapeHtml(item.mobile || item.classSection || item.className || "")}</small></td>
        <td>
          <button class="complaint-preview-box" type="button" data-review-complaint="${index}">
            <strong>${escapeHtml(category)}</strong>
            <span>${escapeHtml(getComplaintShortText(details))}</span>
          </button>
        </td>
        <td>
          <span class="complaint-status-pill ${getComplaintStatusClass(status, item.priority)}">${escapeHtml(status)}</span>
          ${satisfactionLabel ? `<br><small>${escapeHtml(satisfactionLabel)}</small>` : ""}
        </td>
        <td>${escapeHtml(source)}</td>
        <td>
          <button class="icon-action edit" type="button" data-edit-complaint="${index}" title="Edit complaint" aria-label="Edit complaint">✎</button>
          <button class="icon-action delete" type="button" data-delete-complaint="${index}" title="Delete complaint" aria-label="Delete complaint">×</button>
        </td>
      </tr>
    `;
  }).join("") || `<tr><td colspan="7">No complaint found.</td></tr>`;
}

function closeComplaintReviewModal() {
  activeComplaintReviewIndex = -1;
  complaintReviewModal?.setAttribute("aria-hidden", "true");
  if (complaintReviewReason) complaintReviewReason.value = "";
  if (complaintReviewSolution) complaintReviewSolution.value = "";
  document.body.classList.remove("modal-open");
}

function openComplaintReviewModal(index) {
  const item = complaintRecords[index];
  if (!item || !complaintReviewModal || !complaintReviewBody) return;
  activeComplaintReviewIndex = index;
  ensureComplaintRecordId(item);
  if (complaintReviewReason) complaintReviewReason.value = item.cancelReason || "";
  if (complaintReviewSolution) complaintReviewSolution.value = item.solutionNote || item.solution || "";
  const status = item.status || "Open";
  const satisfactionLabel = getComplaintSatisfactionLabel(item) || "Not requested";
  complaintReviewBody.innerHTML = `
    <div class="complaint-review-card">
      <span>Name</span>
      <strong>${escapeHtml(getComplaintPersonName(item))}</strong>
    </div>
    <div class="complaint-review-card">
      <span>Status</span>
      <strong><span class="complaint-status-pill ${getComplaintStatusClass(status, item.priority)}">${escapeHtml(status)}</span></strong>
    </div>
    <div class="complaint-review-card">
      <span>For</span>
      <strong>${escapeHtml(getComplaintForType(item))}</strong>
    </div>
    <div class="complaint-review-card">
      <span>Class / Mobile</span>
      <strong>${escapeHtml(item.classSection || item.className || item.mobile || "-")}</strong>
    </div>
    <div class="complaint-review-card">
      <span>Category</span>
      <strong>${escapeHtml(getComplaintCategory(item))}</strong>
    </div>
    <div class="complaint-review-card">
      <span>Source</span>
      <strong>${escapeHtml(getComplaintSource(item))}</strong>
    </div>
    <div class="complaint-review-card">
      <span>Guardian Satisfaction</span>
      <strong>${escapeHtml(satisfactionLabel)}</strong>
    </div>
    <div class="complaint-review-card full">
      <span>Complaint Details</span>
      <p>${escapeHtml(getComplaintDetails(item))}</p>
    </div>
    ${item.cancelReason ? `<div class="complaint-review-card full"><span>Cancel Reason</span><p>${escapeHtml(item.cancelReason)}</p></div>` : ""}
    ${item.solutionNote || item.solution ? `<div class="complaint-review-card full"><span>Solution</span><p>${escapeHtml(item.solutionNote || item.solution)}</p></div>` : ""}
  `;
  complaintReviewModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
}

function acceptComplaintReview() {
  const item = complaintRecords[activeComplaintReviewIndex];
  if (!item) return;
  item.status = "Review";
  item.reviewStatus = "Review";
  item.cancelReason = "";
  item.reviewedAt = new Date().toISOString();
  item.reviewedBy = getCurrentTopbarRole();
  saveAppState();
  renderComplaintsDesk();
  closeComplaintReviewModal();
  showToast("Complaint marked for review.");
}

function solveComplaintReviewWithNote() {
  const item = complaintRecords[activeComplaintReviewIndex];
  if (!item) return;
  const solution = String(complaintReviewSolution?.value || "").trim();
  if (!solution) {
    showToast("Solution / closing note likhun.");
    complaintReviewSolution?.focus();
    return;
  }
  item.status = "Closed";
  item.reviewStatus = "Closed";
  item.solutionNote = solution;
  item.cancelReason = "";
  item.reviewedAt = new Date().toISOString();
  item.reviewedBy = getCurrentTopbarRole();
  saveAppState();
  renderComplaintsDesk();
  closeComplaintReviewModal();
  showToast("Complaint solved and closed.");
}

function askComplaintSatisfactionReview() {
  const item = complaintRecords[activeComplaintReviewIndex];
  if (!item) return;
  const solution = String(complaintReviewSolution?.value || "").trim();
  if (!solution && !(item.solutionNote || item.solution)) {
    showToast("Guardian satisfaction ask korar age solution note likhun.");
    complaintReviewSolution?.focus();
    return;
  }
  ensureComplaintRecordId(item);
  item.status = "Resolved";
  item.reviewStatus = "Resolved";
  item.solutionNote = solution || item.solutionNote || item.solution || "";
  item.cancelReason = "";
  item.satisfactionStatus = "Waiting";
  item.guardianSatisfied = false;
  item.satisfactionRequestedAt = new Date().toISOString();
  item.satisfactionAutoCloseDays = 15;
  item.reviewedAt = new Date().toISOString();
  item.reviewedBy = getCurrentTopbarRole();
  saveAppState();
  renderComplaintsDesk();
  closeComplaintReviewModal();
  showToast("Satisfaction request sent to student app.");
}

function cancelComplaintReviewWithReason() {
  const item = complaintRecords[activeComplaintReviewIndex];
  if (!item) return;
  const reason = String(complaintReviewReason?.value || "").trim();
  if (!reason) {
    showToast("Cancel reason likhun.");
    complaintReviewReason?.focus();
    return;
  }
  item.status = "Cancelled";
  item.reviewStatus = "Cancelled";
  item.cancelReason = reason;
  item.reviewedAt = new Date().toISOString();
  item.reviewedBy = getCurrentTopbarRole();
  saveAppState();
  renderComplaintsDesk();
  closeComplaintReviewModal();
  showToast("Complaint cancelled with reason.");
}

function getActiveStaffAccount() {
  return userAccessAccounts.find(account => account.status === "Active" && account.staffId)
    || userAccessAccounts.find(account => account.status === "Active")
    || null;
}

function getActiveTeacherStaff() {
  const account = getActiveStaffAccount();
  if (!account) return null;
  return getStaffByStaffId(account.staffId) || null;
}

function isActiveTeacherRole() {
  const account = getActiveStaffAccount();
  const staff = getActiveTeacherStaff();
  return /teacher/i.test(`${account?.role || ""} ${staff?.role || ""} ${staff?.designation || ""}`);
}

function getActiveTeacherSubjects() {
  const staff = getActiveTeacherStaff();
  if (!staff || !isActiveTeacherRole()) return [];
  return String(staff.teachingSubject || "")
    .split(/[,/|]+/)
    .map(subject => subject.trim())
    .filter(Boolean);
}

function getSyllabusSubjectOptions(className = "") {
  const teacherSubjects = getActiveTeacherSubjects();
  const classSubjects = getTimetableSubjectsForClass(className);
  if (!teacherSubjects.length) return classSubjects;
  const allowed = teacherSubjects.filter(subject => classSubjects.some(item => item.toLowerCase() === subject.toLowerCase()));
  return allowed.length ? allowed : teacherSubjects;
}

function resetSyllabusEditing() {
  editingSyllabusIndex = -1;
  if (syllabusForm) syllabusForm.reset();
  const button = document.getElementById("saveSyllabusBtn");
  if (button) button.textContent = "Save Syllabus";
}

function renderSyllabusOptions() {
  if (!syllabusForm) return;
  const classSelect = syllabusForm.elements.className;
  const sectionSelect = syllabusForm.elements.sectionName;
  const subjectSelect = syllabusForm.elements.subject;
  const classValue = classSelect.value;
  const sectionValue = sectionSelect.value;
  const subjectValue = subjectSelect.value;
  const classes = getAdmissionClassOptions();
  const sections = getAdmissionSectionOptions();
  classSelect.innerHTML = `<option value="">Select Class</option>${classes.map(className => `<option value="${escapeHtml(className)}">${escapeHtml(className)}</option>`).join("")}`;
  sectionSelect.innerHTML = `<option value="">Select Section</option>${sections.map(section => `<option value="${escapeHtml(section)}">${escapeHtml(section)}</option>`).join("")}`;
  if (classValue) setSelectValue(classSelect, classValue);
  if (sectionValue) setSelectValue(sectionSelect, sectionValue);
  const subjects = getSyllabusSubjectOptions(classSelect.value);
  subjectSelect.innerHTML = `<option value="">Select Subject</option>${subjects.map(subject => `<option value="${escapeHtml(subject)}">${escapeHtml(subject)}</option>`).join("")}`;
  if (subjectValue) setSelectValue(subjectSelect, subjectValue);
  const note = document.getElementById("syllabusAccessNote");
  if (note) {
    const staff = getActiveTeacherStaff();
    const teacherSubjects = getActiveTeacherSubjects();
    note.textContent = teacherSubjects.length
      ? `${staff?.name || "Teacher"} can add syllabus for: ${teacherSubjects.join(", ")}.`
      : "Admin/Principal can add syllabus for all classes and subjects.";
  }
}

function canEditSyllabusEntry(entry) {
  const teacherSubjects = getActiveTeacherSubjects();
  if (!teacherSubjects.length) return true;
  const activeStaff = getActiveTeacherStaff();
  return String(entry.teacherId || "") === String(activeStaff?.staffId || "")
    || teacherSubjects.some(subject => subject.toLowerCase() === String(entry.subject || "").toLowerCase());
}

function renderSyllabusModule() {
  renderSyllabusOptions();
  const rows = document.getElementById("syllabusRows");
  const summary = document.getElementById("syllabusSummary");
  if (summary) summary.textContent = `${syllabusEntries.length} syllabus entries saved. Published entries will be visible in student app.`;
  if (!rows) return;
  rows.innerHTML = syllabusEntries.map((entry, index) => {
    const editable = canEditSyllabusEntry(entry);
    return `
      <tr>
        <td>${escapeHtml(entry.className || "-")}</td>
        <td>${escapeHtml(entry.sectionName || "-")}</td>
        <td><strong>${escapeHtml(entry.subject || "-")}</strong></td>
        <td>${escapeHtml(entry.term || "-")}</td>
        <td>${escapeHtml(entry.topic || "-")}<br><small>${escapeHtml(entry.details || "")}</small></td>
        <td>${escapeHtml(entry.teacherName || "-")}</td>
        <td><span class="badge ${entry.status === "Published" ? "green" : "amber"}">${escapeHtml(entry.status || "Draft")}</span></td>
        <td>
          <button class="icon-action edit" type="button" data-edit-syllabus="${index}" ${editable ? "" : "disabled"} title="Edit syllabus" aria-label="Edit syllabus">✎</button>
          <button class="icon-action delete" type="button" data-delete-syllabus="${index}" ${editable ? "" : "disabled"} title="Delete syllabus" aria-label="Delete syllabus">×</button>
        </td>
      </tr>
    `;
  }).join("") || `<tr><td colspan="8">No syllabus saved yet.</td></tr>`;
}

function getMarksheetStatusTone(status = "") {
  const clean = String(status || "").toLowerCase();
  if (clean === "published") return "stable";
  if (clean === "checked") return "watch";
  return "pending";
}

function getMarksheetGrade(marks = 0, maxMarks = 100, fallback = "") {
  if (fallback) return fallback;
  const max = Number(maxMarks) || 100;
  const percent = max ? (Number(marks) || 0) / max * 100 : 0;
  if (percent >= 90) return "A+";
  if (percent >= 80) return "A";
  if (percent >= 70) return "B+";
  if (percent >= 60) return "B";
  if (percent >= 50) return "C";
  return "D";
}

function getMarksheetStudentOptions(className = "", sectionName = "") {
  return getActiveStudents()
    .filter(student => !className || String(student.className || student.class || "") === className)
    .filter(student => !sectionName || String(student.section || "") === sectionName)
    .sort((a, b) => String(a.name || "").localeCompare(String(b.name || ""), undefined, {numeric: true}));
}

function renderMarksheetOptions({ preserveSubject = true, preserveStudent = true } = {}) {
  const form = document.getElementById("marksheetEntryForm");
  if (!form) return;
  const classSelect = document.getElementById("marksheetClassSelect");
  const sectionSelect = document.getElementById("marksheetSectionSelect");
  const subjectSelect = document.getElementById("marksheetSubjectSelect");
  const studentSelect = document.getElementById("marksheetStudentSelect");
  const selectedClass = classSelect?.value || "";
  const selectedSection = sectionSelect?.value || "";
  const selectedSubject = preserveSubject ? subjectSelect?.value || "" : "";
  const selectedStudent = preserveStudent ? studentSelect?.value || "" : "";
  if (classSelect) {
    classSelect.innerHTML = `<option value="">Select Class</option>${getAdmissionClassOptions().map(className => `<option value="${escapeHtml(className)}">${escapeHtml(className)}</option>`).join("")}`;
    if (selectedClass) setSelectValue(classSelect, selectedClass);
  }
  if (sectionSelect) {
    sectionSelect.innerHTML = `<option value="">All Section</option>${getAdmissionSectionOptions().map(section => `<option value="${escapeHtml(section)}">${escapeHtml(section)}</option>`).join("")}`;
    if (selectedSection) setSelectValue(sectionSelect, selectedSection);
  }
  const subjects = getTimetableSubjectsForClass(classSelect?.value || "");
  if (subjectSelect) {
    subjectSelect.innerHTML = `<option value="">Select Subject</option>${subjects.map(subject => `<option value="${escapeHtml(subject)}">${escapeHtml(subject)}</option>`).join("")}`;
    if (selectedSubject) setSelectValue(subjectSelect, selectedSubject);
  }
  const studentsForClass = getMarksheetStudentOptions(classSelect?.value || "", sectionSelect?.value || "");
  if (studentSelect) {
    studentSelect.innerHTML = `<option value="">Select Student</option>${studentsForClass.map(student => `<option value="${escapeHtml(student.admissionNo || "")}">${escapeHtml(student.admissionNo || "-")} - ${escapeHtml(student.name || "-")}</option>`).join("")}`;
    if (selectedStudent) setSelectValue(studentSelect, selectedStudent);
  }
}

function renderMarksheetModule() {
  renderMarksheetOptions();
  const rows = document.getElementById("marksheetRows");
  const summary = document.getElementById("marksheetSummary");
  const preview = document.getElementById("marksheetPreviewBox");
  const statusFilter = String(document.getElementById("marksheetStatusFilter")?.value || "");
  const search = String(document.getElementById("marksheetSearch")?.value || "").trim().toLowerCase();
  const reviewCount = marksheetEntries.filter(item => String(item.status || "Review") !== "Published").length;
  const publishedCount = marksheetEntries.filter(item => String(item.status || "") === "Published").length;
  if (summary) summary.textContent = `${reviewCount} review | ${publishedCount} published`;
  if (preview) {
    const latest = marksheetEntries[0];
    preview.innerHTML = latest ? `
      <strong>${escapeHtml(latest.studentName || "-")} | ${escapeHtml(latest.exam || "-")}</strong>
      <span>${escapeHtml(latest.subject || "-")} - ${escapeHtml(latest.marks || 0)}/${escapeHtml(latest.maxMarks || 100)}</span>
      <p>Status: ${escapeHtml(latest.status || "Review")}. Published results will be visible in the student app.</p>
    ` : "Saved marks will remain under review first. Published marks will be visible in the student app.";
  }
  if (!rows) return;
  const filtered = marksheetEntries.filter(item => {
    const status = String(item.status || "Review");
    if (statusFilter && status !== statusFilter) return false;
    if (!search) return true;
    return [item.studentName, item.studentAdmissionNo, item.exam, item.subject, item.className, item.teacherName]
      .some(value => String(value || "").toLowerCase().includes(search));
  });
  rows.innerHTML = filtered.map((entry, index) => {
    const originalIndex = marksheetEntries.indexOf(entry);
    const status = entry.status || "Review";
    const marks = Number(entry.marks || entry.total || 0);
    const maxMarks = Number(entry.maxMarks || entry.maxTotal || 100);
    const grade = getMarksheetGrade(marks, maxMarks, entry.grade || "");
    return `
      <tr>
        <td><strong>${escapeHtml(entry.studentName || "-")}</strong><br><small>${escapeHtml(entry.studentAdmissionNo || entry.studentId || "-")}</small></td>
        <td>${escapeHtml([entry.className, entry.sectionName].filter(Boolean).join(" ") || "-")}</td>
        <td>${escapeHtml(entry.exam || "-")}</td>
        <td>${escapeHtml(entry.subject || "-")}</td>
        <td><strong>${escapeHtml(marks)}/${escapeHtml(maxMarks)}</strong><br><small>Grade: ${escapeHtml(grade)}</small></td>
        <td>${escapeHtml(entry.teacherName || entry.source || "Main ERP")}</td>
        <td><span class="status-pill ${getMarksheetStatusTone(status)}">${escapeHtml(status)}</span></td>
        <td class="inline-actions">
          ${status !== "Published" ? `<button class="icon-action edit" type="button" data-check-marksheet="${originalIndex}" title="Mark checked" aria-label="Mark checked">✓</button>
          <button class="primary-action mini" type="button" data-publish-marksheet="${originalIndex}">Publish</button>` : `<span class="status-pill stable">Visible</span>`}
          <button class="icon-action delete" type="button" data-delete-marksheet="${originalIndex}" title="Delete marks" aria-label="Delete marks">×</button>
        </td>
      </tr>
    `;
  }).join("") || `<tr><td colspan="8">No marks entry found.</td></tr>`;
}

function getExternalExamStudentClass(student = {}) {
  return String(student.className || student.klass || student.class || "").trim();
}

function getExternalExamStatusTone(status = "") {
  const normalized = String(status || "").toLowerCase();
  if (normalized === "paid") return "stable";
  if (normalized === "due") return "urgent";
  return "pending";
}

function formatExternalExamAmount(amount = 0) {
  return `Rs. ${Number(amount || 0).toLocaleString("en-IN")}`;
}

function renderExternalExamOptions({ preserveStudent = true } = {}) {
  const classSelect = document.getElementById("externalExamClassSelect");
  const studentSelect = document.getElementById("externalExamStudentSelect");
  const selectedClass = classSelect?.value || "";
  const selectedStudent = preserveStudent ? studentSelect?.value || "" : "";
  const classes = getAdmissionClassOptions();
  if (classSelect) {
    classSelect.innerHTML = `<option value="">All Classes</option>${classes.map(className => `<option value="${escapeHtml(className)}">${escapeHtml(className)}</option>`).join("")}`;
    if (selectedClass) setSelectValue(classSelect, selectedClass);
  }
  const className = classSelect?.value || "";
  const studentRows = getActiveStudents().filter(student => {
    if (!className) return true;
    return getExternalExamStudentClass(student) === className;
  });
  if (studentSelect) {
    studentSelect.innerHTML = `<option value="">Select Student</option>${studentRows.map(student => `<option value="${escapeHtml(student.admissionNo || "")}">${escapeHtml(student.admissionNo || "-")} - ${escapeHtml(student.name || "-")}</option>`).join("")}`;
    if (selectedStudent) setSelectValue(studentSelect, selectedStudent);
  }
}

function resetExternalExamFeeForm() {
  editingExternalExamFeeId = "";
  const form = document.getElementById("externalExamFeeForm");
  if (form) {
    form.reset();
    if (form.elements.paymentDate) form.elements.paymentDate.value = toDateInputValue(new Date());
  }
  const button = document.getElementById("saveExternalExamFeeButton");
  if (button) button.textContent = "Save External Exam Fee";
  renderExternalExamOptions({ preserveStudent: false });
}

function renderExternalExamFees() {
  renderExternalExamOptions();
  const rows = document.getElementById("externalExamFeeRows");
  const summary = document.getElementById("externalExamFeesSummary");
  const examFilter = document.getElementById("externalExamFilter");
  const statusFilter = String(document.getElementById("externalExamStatusFilter")?.value || "");
  const search = String(document.getElementById("externalExamSearch")?.value || "").trim().toLowerCase();
  const selectedExam = String(examFilter?.value || "");
  const examNames = [...new Set(externalExamFees.map(item => String(item.examName || "").trim()).filter(Boolean))].sort((a, b) => a.localeCompare(b));
  if (examFilter) {
    examFilter.innerHTML = `<option value="">All Exams</option>${examNames.map(name => `<option value="${escapeHtml(name)}">${escapeHtml(name)}</option>`).join("")}`;
    if (selectedExam) setSelectValue(examFilter, selectedExam);
  }
  const filtered = externalExamFees.filter(item => {
    if (selectedExam && item.examName !== selectedExam) return false;
    if (statusFilter && item.status !== statusFilter) return false;
    if (!search) return true;
    return [item.examName, item.subject, item.studentName, item.admissionNo, item.className, item.referenceNo]
      .some(value => String(value || "").toLowerCase().includes(search));
  });
  const paidTotal = filtered.filter(item => item.status === "Paid").reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const dueCount = filtered.filter(item => item.status === "Due").length;
  if (summary) summary.textContent = `${filtered.length} entries | ${formatExternalExamAmount(paidTotal)} collected | ${dueCount} due`;
  if (!rows) return;
  rows.innerHTML = filtered.map(item => {
    const originalIndex = externalExamFees.indexOf(item);
    const classText = [item.className, item.sectionName].filter(Boolean).join(" ") || "-";
    return `
      <tr>
        <td><strong>${escapeHtml(item.examName || "-")}</strong><br><small>External exam</small></td>
        <td>${escapeHtml(item.subject || "-")}</td>
        <td><strong>${escapeHtml(item.studentName || "-")}</strong><br><small>${escapeHtml(item.admissionNo || "-")}</small></td>
        <td>${escapeHtml(classText)}</td>
        <td><strong>${escapeHtml(formatExternalExamAmount(item.amount))}</strong></td>
        <td><span class="status-pill ${getExternalExamStatusTone(item.status)}">${escapeHtml(item.status || "Paid")}</span></td>
        <td>${escapeHtml(item.mode || "-")}</td>
        <td>${escapeHtml(item.paymentDate ? formatDateDDMMYYYY(item.paymentDate) : "-")}</td>
        <td>${escapeHtml(item.referenceNo || "-")}</td>
        <td class="inline-actions">
          <button class="icon-action edit" type="button" data-edit-external-exam-fee="${originalIndex}" title="Edit external exam fee" aria-label="Edit external exam fee">✎</button>
          <button class="icon-action delete" type="button" data-delete-external-exam-fee="${originalIndex}" title="Delete external exam fee" aria-label="Delete external exam fee">×</button>
        </td>
      </tr>
    `;
  }).join("") || `<tr><td colspan="10">No external exam fee entry found.</td></tr>`;
}

function saveExternalExamFee(form) {
  const data = new FormData(form);
  const admissionNo = String(data.get("admissionNo") || "").trim();
  const student = getActiveStudents().find(item => normalizeAdmissionNo(item.admissionNo || "") === normalizeAdmissionNo(admissionNo)) || {};
  const existingIndex = externalExamFees.findIndex(item => item.id === editingExternalExamFeeId);
  const entry = {
    id: editingExternalExamFeeId || `EXT-EXAM-${Date.now()}`,
    examName: String(data.get("examName") || "").trim(),
    subject: String(data.get("subject") || "").trim(),
    admissionNo,
    studentName: student.name || "",
    className: String(data.get("className") || getExternalExamStudentClass(student)).trim(),
    sectionName: String(student.section || student.sectionName || "").trim(),
    amount: Number(data.get("amount") || 0),
    paymentDate: String(data.get("paymentDate") || toDateInputValue(new Date())).trim(),
    mode: String(data.get("mode") || "Cash").trim(),
    status: String(data.get("status") || "Paid").trim(),
    referenceNo: String(data.get("referenceNo") || "").trim(),
    remarks: String(data.get("remarks") || "").trim(),
    source: "Main ERP",
    updatedAt: new Date().toISOString(),
    updatedBy: getCurrentTopbarRole()
  };
  if (!entry.examName || !entry.subject || !entry.admissionNo) {
    showToast("Exam name, subject and student are required.", "error");
    return;
  }
  if (existingIndex >= 0) {
    externalExamFees.splice(existingIndex, 1, {...externalExamFees[existingIndex], ...entry});
  } else {
    externalExamFees.unshift(entry);
  }
  saveAppState();
  resetExternalExamFeeForm();
  renderExternalExamFees();
  showToast("External exam fee saved separately.");
}

function saveMarksheetEntry(form) {
  const data = new FormData(form);
  const admissionNo = String(data.get("studentAdmissionNo") || "").trim();
  const student = getActiveStudents().find(item => normalizeAdmissionNo(item.admissionNo || "") === normalizeAdmissionNo(admissionNo)) || {};
  const marks = Number(data.get("marks") || 0);
  const maxMarks = Number(data.get("maxMarks") || 100);
  const entry = {
    id: `MARK-${Date.now()}`,
    studentAdmissionNo: admissionNo,
    studentId: admissionNo,
    studentName: student.name || "",
    className: String(data.get("className") || student.className || "").trim(),
    sectionName: String(data.get("sectionName") || student.section || "").trim(),
    exam: String(data.get("exam") || "").trim(),
    subject: String(data.get("subject") || "").trim(),
    marks,
    maxMarks,
    total: marks,
    maxTotal: maxMarks,
    percentage: maxMarks ? `${((marks / maxMarks) * 100).toFixed(1)}%` : "0.0%",
    grade: getMarksheetGrade(marks, maxMarks, String(data.get("grade") || "").trim()),
    note: String(data.get("note") || "").trim(),
    teacherName: getCurrentTopbarRole(),
    source: "Main ERP",
    status: "Review",
    createdAt: new Date().toISOString()
  };
  if (!entry.studentAdmissionNo || !entry.exam || !entry.className || !entry.subject) {
    showToast("Student, exam, class and subject required.");
    return;
  }
  marksheetEntries.unshift(entry);
  saveAppState();
  form.reset();
  if (form.elements.maxMarks) form.elements.maxMarks.value = "100";
  renderMarksheetModule();
  showToast("Marks saved for review.");
}

function getAcademicProfilePayments(student = {}) {
  const admissionNo = normalizeAdmissionNo(student.admissionNo || "");
  const sessionPayments = collectedPayments[activeSession] || {};
  return Object.entries(sessionPayments).flatMap(([paymentAdmissionNo, payments]) =>
    normalizeAdmissionNo(paymentAdmissionNo) === admissionNo ? (payments || []) : []
  );
}

function getAcademicProfileFineTotal(payments = []) {
  return payments.reduce((total, payment) => {
    const allocationFine = (payment.allocations || []).reduce((sum, allocation) => {
      const head = String(allocation.head || "").toLowerCase();
      return sum + (head.includes("fine") ? Number(allocation.amount || 0) : 0);
    }, 0);
    return total + Number(payment.fineAmount || 0) + allocationFine;
  }, 0);
}

function getAcademicProfileAttendance(student = {}) {
  const admissionNo = normalizeAdmissionNo(student.admissionNo || "");
  const rows = attendance.filter(item => {
    if (Array.isArray(item)) return false;
    return normalizeAdmissionNo(item.admissionNo || item.studentId || "") === admissionNo;
  });
  if (!rows.length) return {label: "Not entered", percent: 0, detail: "No student attendance data entered yet."};
  const present = rows.filter(item => /present|late/i.test(String(item.status || ""))).length;
  const percent = rows.length ? Math.round((present / rows.length) * 100) : 0;
  return {label: `${percent}%`, percent, detail: `${present}/${rows.length} attendance records present/late.`};
}

function getAcademicProfileResults(student = {}) {
  const admissionNo = normalizeAdmissionNo(student.admissionNo || "");
  return marksheetEntries
    .filter(entry => normalizeAdmissionNo(entry.studentAdmissionNo || entry.studentId || "") === admissionNo)
    .sort((a, b) => Date.parse(b.publishedAt || b.createdAt || 0) - Date.parse(a.publishedAt || a.createdAt || 0));
}

function isComplaintForStudent(item = {}, student = {}) {
  const admissionNo = normalizeAdmissionNo(student.admissionNo || "");
  const studentName = String(student.name || "").trim().toLowerCase();
  return Boolean(
    (admissionNo && normalizeAdmissionNo(item.studentId || item.studentAdmissionNo || item.admissionNo || "") === admissionNo) ||
    (studentName && String(getComplaintPersonName(item) || "").trim().toLowerCase() === studentName) ||
    (studentName && String(item.studentName || "").trim().toLowerCase() === studentName)
  );
}

function getAcademicProfileComplaints(student = {}, sourceType = "") {
  return complaintRecords
    .filter(item => isComplaintForStudent(item, student))
    .filter(item => {
      const source = getComplaintSource(item).toLowerCase();
      if (sourceType === "teacher") return source.includes("teacher");
      if (sourceType === "student") return source.includes("student");
      return true;
    })
    .sort((a, b) => parseDateDDMMYYYY(b.date || new Date()) - parseDateDDMMYYYY(a.date || new Date()));
}

function getAcademicProfilePaymentHabit(payments = []) {
  if (!payments.length) return {label: "No payment record", tone: "pending", detail: "No fees payment received yet."};
  const totalPaid = payments.reduce((sum, payment) => sum + Number(payment.amount || 0), 0);
  const fineTotal = getAcademicProfileFineTotal(payments);
  if (fineTotal > 0) return {label: "Late/Fine found", tone: "due", detail: `${payments.length} receipts | Paid ${formatRs(totalPaid)} | Fine ${formatRs(fineTotal)}`};
  return {label: "Timely / No fine", tone: "stable", detail: `${payments.length} receipts | Paid ${formatRs(totalPaid)} | No fine recorded`};
}

function renderAcademicProfileModule() {
  const select = document.getElementById("academicProfileStudentSelect");
  const searchInput = document.getElementById("academicProfileSearch");
  const host = document.getElementById("academicProfileHost");
  if (!select || !host) return;
  const search = String(searchInput?.value || "").trim().toLowerCase();
  const previous = select.value;
  const filteredStudents = getActiveStudents()
    .filter(student => {
      if (!search) return true;
      return [student.admissionNo, student.name, student.villageTown, student.className, student.section]
        .some(value => String(value || "").toLowerCase().includes(search));
    })
    .sort((a, b) => String(a.name || "").localeCompare(String(b.name || ""), undefined, {numeric: true}));
  select.innerHTML = `<option value="">Select Student</option>${filteredStudents.map(student =>
    `<option value="${escapeHtml(student.admissionNo || "")}">${escapeHtml(student.admissionNo || "-")} - ${escapeHtml(student.name || "-")}</option>`
  ).join("")}`;
  const selectedAdmission = filteredStudents.some(student => student.admissionNo === previous)
    ? previous
    : (search && filteredStudents[0]?.admissionNo ? filteredStudents[0].admissionNo : previous);
  if (selectedAdmission) select.value = selectedAdmission;
  const student = getActiveStudents().find(item => normalizeAdmissionNo(item.admissionNo || "") === normalizeAdmissionNo(select.value || ""));
  if (!student) {
    host.innerHTML = `<div class="panel"><div class="empty-chart">${search ? "No student found for this search." : "Search or select a student to open academic profile."}</div></div>`;
    return;
  }
  const payments = getAcademicProfilePayments(student);
  const paymentHabit = getAcademicProfilePaymentHabit(payments);
  const attendanceSummary = getAcademicProfileAttendance(student);
  const results = getAcademicProfileResults(student);
  const teacherComplaints = getAcademicProfileComplaints(student, "teacher");
  const studentComplaints = getAcademicProfileComplaints(student, "student");
  const initialsText = String(student.name || "ST").split(/\s+/).map(part => part[0]).join("").slice(0, 2).toUpperCase() || "ST";
  const photo = student.photo ? `<img src="${student.photo}" alt="${escapeHtml(student.name || "Student")} photo" />` : initialsText;
  const latestPublished = results.find(item => item.status === "Published");
  host.innerHTML = `
    <div class="panel student-report-panel">
      <div class="academic-profile-card">
        <div class="academic-profile-photo">${photo}</div>
        <div>
          <p class="eyebrow">Student snapshot</p>
          <h2>${escapeHtml(student.name || "-")}</h2>
          <p>${escapeHtml(student.admissionNo || "-")} | ${escapeHtml([student.className || student.class, student.section].filter(Boolean).join(" ") || "-")}</p>
          <p>Village: <strong>${escapeHtml(student.villageTown || "-")}</strong></p>
        </div>
      </div>
      <div class="module-status">
        <article><strong>${escapeHtml(attendanceSummary.label)}</strong><small>Attendance</small></article>
        <article><strong>${escapeHtml(latestPublished ? `${latestPublished.exam} ${latestPublished.grade || ""}` : "Not Published")}</strong><small>Latest Result</small></article>
        <article><strong>${payments.length}</strong><small>Fee Receipts</small></article>
        <article><strong>${teacherComplaints.length + studentComplaints.length}</strong><small>Complaints</small></article>
      </div>
    </div>
    <div class="academic-profile-grid">
      <div class="panel">
        <div class="panel-head"><div><p class="eyebrow">Result</p><h2>Marksheet</h2></div></div>
        <div class="task-list">
          ${results.slice(0, 6).map(result => `<article><b>${escapeHtml(result.grade || "-")}</b><div><strong>${escapeHtml(result.exam || "-")} | ${escapeHtml(result.subject || "-")}</strong><p>${escapeHtml(result.marks ?? result.total ?? 0)}/${escapeHtml(result.maxMarks ?? result.maxTotal ?? 100)} | ${escapeHtml(result.percentage || "")}</p><small>${escapeHtml(result.status || "Review")}</small></div><em>${escapeHtml(result.status === "Published" ? "Visible" : "Review")}</em></article>`).join("") || `<article><b>0</b><div><strong>No result entered</strong><p>Published marksheets will appear here.</p></div><em>Empty</em></article>`}
        </div>
      </div>
      <div class="panel">
        <div class="panel-head"><div><p class="eyebrow">Fees</p><h2>Payment Habit</h2></div><span class="status-pill ${paymentHabit.tone}">${escapeHtml(paymentHabit.label)}</span></div>
        <div class="receipt">${escapeHtml(paymentHabit.detail)}</div>
        <div class="task-list">
          ${payments.slice(0, 5).map(payment => `<article><b>₹</b><div><strong>${escapeHtml(payment.receipt || "-")}</strong><p>${escapeHtml(payment.date || "-")} | ${formatRs(payment.amount || 0)}</p><small>${escapeHtml(payment.paymentType || payment.mode || "")}</small></div><em>Paid</em></article>`).join("") || `<article><b>₹</b><div><strong>No payment</strong><p>No receipt found in this session.</p></div><em>Empty</em></article>`}
        </div>
      </div>
      <div class="panel">
        <div class="panel-head"><div><p class="eyebrow">Teacher Complaint</p><h2>Teacher Observations</h2></div></div>
        <div class="task-list">
          ${teacherComplaints.slice(0, 5).map(item => `<article><b>!</b><div><strong>${escapeHtml(getComplaintCategory(item))}</strong><p>${escapeHtml(getComplaintDetails(item))}</p><small>${escapeHtml(item.date || "-")} | ${escapeHtml(item.status || "Open")}</small></div><em>${escapeHtml(item.priority || "Normal")}</em></article>`).join("") || `<article><b>✓</b><div><strong>No teacher complaint</strong><p>No teacher complaint found for this student.</p></div><em>Clear</em></article>`}
        </div>
      </div>
      <div class="panel">
        <div class="panel-head"><div><p class="eyebrow">Student Complaint</p><h2>Student / Guardian Concerns</h2></div></div>
        <div class="task-list">
          ${studentComplaints.slice(0, 5).map(item => `<article><b>?</b><div><strong>${escapeHtml(getComplaintCategory(item))}</strong><p>${escapeHtml(getComplaintDetails(item))}</p><small>${escapeHtml(item.date || "-")} | ${escapeHtml(item.status || "Open")}</small></div><em>${escapeHtml(getComplaintSatisfactionLabel(item) || item.priority || "Normal")}</em></article>`).join("") || `<article><b>✓</b><div><strong>No student complaint</strong><p>No student app complaint found.</p></div><em>Clear</em></article>`}
        </div>
      </div>
    </div>
  `;
}

function toDateInputValue(value = new Date()) {
  const date = parseDateDDMMYYYY(value);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getHolidayDate(holiday) {
  return parseDateDDMMYYYY(holiday?.date || new Date());
}

function sortHolidayReports() {
  holidayReports.sort((a, b) => getHolidayDate(a) - getHolidayDate(b));
}

function resetHolidayEditing() {
  editingHolidayIndex = -1;
  if (holidayReportForm) holidayReportForm.reset();
  const button = document.getElementById("saveHolidayReportBtn");
  if (button) button.textContent = "Save Holiday";
}

function renderHolidayReport() {
  sortHolidayReports();
  const rows = document.getElementById("holidayReportRows");
  const summary = document.getElementById("holidayReportSummary");
  if (summary) summary.textContent = `${holidayReports.length} holidays added.`;
  if (!rows) return;
  rows.innerHTML = holidayReports.map((holiday, index) => `
    <tr>
      <td><strong>${formatDateDDMMYYYY(holiday.date)}</strong></td>
      <td>${escapeHtml(holiday.name || "-")}</td>
      <td><span class="badge amber">${escapeHtml(holiday.type || "Holiday")}</span></td>
      <td>${escapeHtml(holiday.details || "-")}</td>
      <td>
        <button class="icon-action" type="button" data-edit-holiday="${index}" title="Edit holiday" aria-label="Edit holiday">✎</button>
        <button class="icon-action danger" type="button" data-delete-holiday="${index}" title="Delete holiday" aria-label="Delete holiday">×</button>
      </td>
    </tr>
  `).join("") || `<tr><td colspan="5">No holiday added yet.</td></tr>`;
}

function renderAnnualCalendarOptions() {
  const select = document.getElementById("annualCalendarMonth");
  if (!select) return "";
  const current = select.value;
  select.innerHTML = ACADEMIC_MONTHS.map(month => `<option value="${month}">${month} ${getAcademicMonthDate(month, 1).getFullYear()}</option>`).join("");
  const activeMonth = ACADEMIC_MONTHS[getAcademicMonthIndexForDate(new Date())] || ACADEMIC_MONTHS[0];
  select.value = current || activeMonth;
  return select.value;
}

function getHolidaysForMonth(month) {
  const monthStart = getAcademicMonthDate(month, 1);
  return holidayReports.filter(holiday => {
    const date = getHolidayDate(holiday);
    return date.getFullYear() === monthStart.getFullYear() && date.getMonth() === monthStart.getMonth();
  });
}

function getNextHolidayLabel() {
  const today = parseDateDDMMYYYY(new Date());
  const next = [...holidayReports].sort((a, b) => getHolidayDate(a) - getHolidayDate(b))
    .find(holiday => getHolidayDate(holiday) >= today);
  return next ? `${formatDateDDMMYYYY(next.date)} ${next.name || ""}`.trim() : "-";
}

function renderAnnualCalendar() {
  sortHolidayReports();
  const month = renderAnnualCalendarOptions();
  const grid = document.getElementById("annualCalendarGrid");
  if (!grid || !month) return;
  const monthStart = getAcademicMonthDate(month, 1);
  const year = monthStart.getFullYear();
  const monthIndex = monthStart.getMonth();
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const firstDay = monthStart.getDay();
  const monthHolidays = getHolidaysForMonth(month);
  const holidayByDay = new Map(monthHolidays.map(holiday => [getHolidayDate(holiday).getDate(), holiday]));
  document.getElementById("calendarHolidayCount").textContent = String(holidayReports.length);
  document.getElementById("calendarMonthHolidayCount").textContent = String(monthHolidays.length);
  document.getElementById("calendarNextHoliday").textContent = getNextHolidayLabel();
  const blanks = Array.from({length: firstDay}, () => `<div class="calendar-day blank"></div>`);
  const days = Array.from({length: daysInMonth}, (_, offset) => {
    const day = offset + 1;
    const holiday = holidayByDay.get(day);
    const date = new Date(year, monthIndex, day);
    const isSunday = date.getDay() === 0;
    return `
      <div class="calendar-day ${holiday ? "holiday" : ""} ${isSunday ? "sunday" : ""}">
        <strong>${day}</strong>
        <span>${["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][date.getDay()]}</span>
        ${holiday ? `<em>${escapeHtml(holiday.name || "Holiday")}</em><small>${escapeHtml(holiday.type || "Holiday")}</small>` : ""}
      </div>
    `;
  });
  grid.innerHTML = `
    <div class="calendar-week-head">Sun</div>
    <div class="calendar-week-head">Mon</div>
    <div class="calendar-week-head">Tue</div>
    <div class="calendar-week-head">Wed</div>
    <div class="calendar-week-head">Thu</div>
    <div class="calendar-week-head">Fri</div>
    <div class="calendar-week-head">Sat</div>
    ${blanks.join("")}${days.join("")}
  `;
}

function renderDues() {
  const table = document.getElementById("dueTable");
  if (!table) return;
  const followUps = getDashboardDueFollowUps();
  table.innerHTML = followUps.map(item => `
    <tr>
      <td>
        <button class="student-name-link" type="button" data-open-fee-book="${escapeHtml(item.admissionNo)}">
          <strong>${escapeHtml(item.studentName)}</strong>
        </button>
        <small>${escapeHtml(item.admissionNo)}${item.mobile ? ` | ${escapeHtml(item.mobile)}` : ""}</small>
      </td>
      <td>${escapeHtml(item.className)}</td>
      <td><strong>${formatRs(item.totalDue)}</strong><small>${escapeHtml(item.summary)}</small></td>
      <td><span class="badge ${item.priorityClass}">${escapeHtml(item.status)}</span></td>
    </tr>
  `).join("") || `<tr><td colspan="4">No active due or late-payment follow-up found.</td></tr>`;
}

function getRunningAcademicMonth() {
  return ACADEMIC_MONTHS[getAcademicMonthIndexForDate(new Date())] || ACADEMIC_MONTHS[0];
}

function getDashboardRunningMonthDueSummary(month = getRunningAcademicMonth()) {
  const dueStudents = new Map();
  getActiveStudents().forEach(student => {
    const admissionKey = normalizeAdmissionNo(student.admissionNo || "");
    const key = admissionKey || `name:${String(student.name || "").trim().toLowerCase()}` || `student-${dueStudents.size}`;
    if (dueStudents.has(key)) return;
    let studentDue = 0;
    getLedgerRows(student).forEach(row => {
      const item = getSearchDueMonthItem(student, row, month);
      if (!item) return;
      studentDue += Number(item.total || 0);
    });
    if (studentDue > 0) {
      dueStudents.set(key, studentDue);
    }
  });
  const totalDue = [...dueStudents.values()].reduce((sum, amount) => sum + Number(amount || 0), 0);
  return {month, studentCount: dueStudents.size, totalDue};
}

function renderDashboardDueStudents() {
  const monthEl = document.getElementById("dashboardDueStudentsMonth");
  const countEl = document.getElementById("dashboardDueStudentsCount");
  const amountEl = document.getElementById("dashboardDueStudentsAmount");
  if (!monthEl || !countEl || !amountEl) return;
  const summary = getDashboardRunningMonthDueSummary();
  const monthDate = getAcademicMonthDate(summary.month, 1);
  monthEl.textContent = `${summary.month} ${monthDate.getFullYear()} due summary`;
  countEl.textContent = summary.studentCount.toLocaleString("en-IN");
  amountEl.textContent = `Due amount ${formatRs(summary.totalDue)}`;
}

function getLateFinePaymentProfile(student = {}) {
  const payments = getSessionPayments(student.admissionNo);
  const monthProfile = ACADEMIC_MONTHS.reduce((profile, month) => {
    profile[month] = {lateFine: 0, onTimePaid: false, latestLateDate: null};
    return profile;
  }, {});
  payments.forEach(payment => {
    const paymentDate = parseDateDDMMYYYY(payment.date || new Date());
    (payment.allocations || []).forEach(allocation => {
      const head = String(allocation.head || "");
      const amount = Number(allocation.amount || 0);
      const month = String(allocation.month || "");
      if (!ACADEMIC_MONTHS.includes(month) || amount <= 0) return;
      const appliedDate = parseDateDDMMYYYY(allocation.date || payment.date || new Date());
      if (["Tuition Late Fine", "Transport Late Fine"].includes(head)) {
        if (appliedDate.getDate() <= 15 && paymentDate.getDate() <= 15) return;
        monthProfile[month].lateFine += amount;
        if (!monthProfile[month].latestLateDate || appliedDate > monthProfile[month].latestLateDate) {
          monthProfile[month].latestLateDate = appliedDate;
        }
      }
      if (["Tuition Fee", "Transport Fees"].includes(head) && appliedDate.getDate() <= 15 && paymentDate.getDate() <= 15) {
        monthProfile[month].onTimePaid = true;
      }
    });
  });
  const today = parseDateDDMMYYYY(new Date());
  let consecutiveLate = 0;
  let maxConsecutiveLate = 0;
  let recoveryStreak = 0;
  let isLatePayer = false;
  const lateMonths = [];
  let latestDate = null;
  ACADEMIC_MONTHS.forEach(month => {
    if (getAcademicMonthDate(month, 1) > today) return;
    const profile = monthProfile[month];
    if (profile.lateFine > 0) {
      consecutiveLate += 1;
      maxConsecutiveLate = Math.max(maxConsecutiveLate, consecutiveLate);
      recoveryStreak = 0;
      lateMonths.push(month);
      if (profile.latestLateDate && (!latestDate || profile.latestLateDate > latestDate)) latestDate = profile.latestLateDate;
      if (consecutiveLate >= 3) isLatePayer = true;
      return;
    }
    if (profile.onTimePaid) {
      consecutiveLate = 0;
      if (isLatePayer) {
        recoveryStreak += 1;
        if (recoveryStreak >= 2) isLatePayer = false;
      }
      return;
    }
    consecutiveLate = 0;
    if (isLatePayer) recoveryStreak = 0;
  });
  const totalFinePaid = Object.values(monthProfile).reduce((sum, profile) => sum + Number(profile.lateFine || 0), 0);
  return {
    count: lateMonths.length,
    isLatePayer,
    maxConsecutiveLate,
    recoveryStreak,
    totalFinePaid,
    latestDate,
    lateMonths
  };
}

function getDashboardDueFollowUps() {
  return getActiveStudents().map(student => {
    const lateProfile = getLateFinePaymentProfile(student);
    const dueRows = getLedgerRows(student).map(row => {
      if (Array.isArray(row.months) && row.months.length) {
        const details = getSearchDueMonthDetails(student, row).filter(item => {
          if (!item?.month) return true;
          return getAcademicMonthDate(item.month, 16) <= new Date() || Number(item.fine || 0) > 0;
        });
        const due = details.reduce((sum, item) => sum + Number(item.total || 0), 0);
        const fine = details.reduce((sum, item) => sum + Number(item.fine || 0), 0);
        const months = details.map(item => item.month);
        return due > 0 ? {...row, due, fine, period: formatMonthPeriod(months), details} : null;
      }
      return Number(row.due || 0) > 0 ? row : null;
    }).filter(Boolean);
    const totalDue = dueRows.reduce((sum, row) => sum + Number(row.due || 0), 0);
    if (totalDue <= 0 && !lateProfile.isLatePayer) return null;
    const fineDue = dueRows.reduce((sum, row) => sum + Number(row.fine || 0), 0);
    const heads = dueRows.map(row => row.name).filter(Boolean);
    const periods = dueRows.flatMap(row => row.details?.map(item => item.month) || [row.period]).filter(Boolean);
    const status = fineDue > 0 ? "High Priority" : totalDue >= 5000 ? "Call Today" : lateProfile.isLatePayer ? "Late Payer" : "Pending";
    const summary = totalDue > 0
      ? `${[...new Set(heads)].slice(0, 2).join(", ")}${heads.length > 2 ? " +" : ""}${periods.length ? ` | ${[...new Set(periods)].slice(0, 3).join(", ")}` : ""}${lateProfile.isLatePayer ? ` | 3-month late pattern` : ""}`
      : `3 consecutive late-fine months${lateProfile.latestDate ? ` | Last ${formatDateDDMMYYYY(lateProfile.latestDate)}` : ""}`;
    return {
      admissionNo: student.admissionNo || "",
      studentName: student.name || "Student",
      className: student.klass || student.className || student.class || "-",
      mobile: student.mobile || student.fatherMobile || student.motherMobile || "",
      totalDue,
      fineDue,
      lateFineCount: lateProfile.count,
      lateFinePaid: lateProfile.totalFinePaid,
      status,
      priorityClass: status === "High Priority" ? "red" : status === "Call Today" || status === "Late Payer" ? "amber" : "blue",
      summary
    };
  }).filter(Boolean)
    .sort((a, b) => b.fineDue - a.fineDue || b.totalDue - a.totalDue || b.lateFineCount - a.lateFineCount || b.lateFinePaid - a.lateFinePaid)
    .slice(0, 8);
}

function getSelectedNoticeOptions(select) {
  return [...(select?.selectedOptions || [])]
    .map(option => String(option.value || option.textContent || "").trim())
    .filter(Boolean);
}

function getNoticeTargetLabel(notice = {}) {
  const classes = Array.isArray(notice.classes) ? notice.classes.filter(Boolean) : [];
  const sections = Array.isArray(notice.sections) ? notice.sections.filter(Boolean) : [];
  if (classes.length && sections.length) return `${classes.join(", ")} | ${sections.join(", ")}`;
  if (classes.length) return classes.join(", ");
  if (sections.length) return `Sections: ${sections.join(", ")}`;
  return notice.noticeClass || "All Classes";
}

function getNoticeSenderDefaults() {
  const user = getLoggedInBackendUser();
  const userName = String(user?.name || user?.fullName || user?.username || "").trim();
  const userRole = String(user?.designation || user?.role || "").trim();
  const staff = staffMembers.find(member => {
    const memberName = String(member.name || "").trim().toLowerCase();
    const staffId = String(member.staffId || member.id || "").trim().toLowerCase();
    return (userName && memberName === userName.toLowerCase())
      || (user?.staffId && staffId === String(user.staffId).trim().toLowerCase());
  });
  return {
    name: staff?.name || userName || "Admin",
    designation: staff?.designation || userRole || "Admin"
  };
}

function fillNoticeSenderDefaults(force = false) {
  if (!noticeForm) return;
  const defaults = getNoticeSenderDefaults();
  const senderName = noticeForm.elements.senderName;
  const senderDesignation = noticeForm.elements.senderDesignation;
  if (senderName && (force || !senderName.value)) senderName.value = defaults.name;
  if (senderDesignation && (force || !senderDesignation.value)) senderDesignation.value = defaults.designation;
}

function getNoticeDateLabel(notice = {}) {
  return notice.noticeDate || notice.date || notice.publishDate || formatDateDDMMYYYY(new Date());
}

async function sendNoticePushNotification(notice = {}) {
  try {
    const response = await backendFetch("/api/notifications/notice", {
      method: "POST",
      headers: backendHeaders({"Content-Type": "application/json"}),
      body: JSON.stringify({notice})
    });
    const result = await response.json().catch(() => ({}));
    if (!result.configured) {
      console.info("Notice push saved, but Firebase Cloud Messaging is not configured yet.");
      showToast("Notice saved. Firebase Cloud Messaging is not configured yet.");
      return;
    }
    if (result.ok) {
      const targetCount = Number(result.targetDeviceCount || 0);
      const sentCount = Number(result.sent || 0);
      if (!targetCount) {
        showToast("Notice saved. No registered mobile device found for this audience.");
      } else {
        showToast(`Notice notification sent to ${sentCount}/${targetCount} device(s).`);
      }
    } else {
      showToast(result.error || "Notice saved, but push notification failed.");
    }
  } catch (error) {
    console.warn("Notice push notification failed.", error);
    showToast("Notice saved, but push notification could not be sent.");
  }
}

async function sendHomeworkPushNotification(homeworkEntry = {}) {
  try {
    const response = await backendFetch("/api/notifications/homework", {
      method: "POST",
      headers: backendHeaders({"Content-Type": "application/json"}),
      body: JSON.stringify({homework: homeworkEntry})
    });
    const result = await response.json().catch(() => ({}));
    if (!result.configured) {
      console.info("Homework push saved, but Firebase Cloud Messaging is not configured yet.");
      return;
    }
    if (result.ok) {
      showToast(`Homework notification sent to ${result.sent || 0} device(s).`);
    }
  } catch (error) {
    console.warn("Homework push notification failed.", error);
  }
}

async function sendTeacherAdvisoryPushNotification(advisory = {}) {
  try {
    const response = await backendFetch("/api/notifications/teacher-advisory", {
      method: "POST",
      headers: backendHeaders({"Content-Type": "application/json"}),
      body: JSON.stringify({advisory})
    });
    const result = await response.json().catch(() => ({}));
    if (!result.configured) {
      showToast("Advisory saved. Firebase Cloud Messaging is not configured yet.");
      return;
    }
    if (result.ok) {
      const targetCount = Number(result.targetDeviceCount || 0);
      const sentCount = Number(result.sent || 0);
      showToast(targetCount ? `Teacher advisory notification sent to ${sentCount}/${targetCount} device(s).` : "Advisory saved. No registered teacher device found.");
    } else {
      showToast(result.error || "Advisory saved, but push notification failed.");
    }
  } catch (error) {
    console.warn("Teacher advisory push notification failed.", error);
    showToast("Advisory saved, but push notification could not be sent.");
  }
}

function renderNoticeAudienceOptions() {
  const classSelect = document.getElementById("noticeClassSelect");
  const sectionSelect = document.getElementById("noticeSectionSelect");
  if (classSelect) {
    const selected = new Set(getSelectedNoticeOptions(classSelect));
    classSelect.innerHTML = getAdmissionClassOptions()
      .map(className => `<option value="${escapeHtml(className)}" ${selected.has(className) ? "selected" : ""}>${escapeHtml(className)}</option>`)
      .join("");
  }
  if (sectionSelect) {
    const selected = new Set(getSelectedNoticeOptions(sectionSelect));
    sectionSelect.innerHTML = getAdmissionSectionOptions()
      .map(sectionName => `<option value="${escapeHtml(sectionName)}" ${selected.has(sectionName) ? "selected" : ""}>${escapeHtml(sectionName)}</option>`)
      .join("");
  }
  updateNoticeAudienceFields();
}

function updateNoticeAudienceFields() {
  const audience = String(document.getElementById("noticeAudienceSelect")?.value || "");
  const classField = document.getElementById("noticeClassField");
  const sectionField = document.getElementById("noticeSectionField");
  const classSelect = document.getElementById("noticeClassSelect");
  const sectionSelect = document.getElementById("noticeSectionSelect");
  const needsClass = audience === "Selected Class" || audience === "Selected Class & Section";
  const needsSection = audience === "Selected Class & Section";
  if (classField) classField.hidden = !needsClass;
  if (sectionField) sectionField.hidden = !needsSection;
  if (classSelect) classSelect.required = needsClass;
  if (sectionSelect) sectionSelect.required = needsSection;
  if (!needsClass && classSelect) [...classSelect.options].forEach(option => option.selected = false);
  if (!needsSection && sectionSelect) [...sectionSelect.options].forEach(option => option.selected = false);
}

function renderNoticeBoard() {
  const rows = document.getElementById("noticeRows");
  const preview = document.getElementById("noticeAppPreview");
  if (!rows) return;
  renderNoticeAudienceOptions();
  fillNoticeSenderDefaults();
  rows.innerHTML = notices.map(notice => `
    <tr>
      <td>
        <small>Notice Date: ${escapeHtml(getNoticeDateLabel(notice))}</small><br>
        <strong>Subject: ${escapeHtml(notice.title)}</strong><br>
        <small>${escapeHtml(notice.message)}</small><br>
        <small>From: ${escapeHtml(notice.senderName || "Admin")}${notice.senderDesignation ? `, ${escapeHtml(notice.senderDesignation)}` : ""}</small>
      </td>
      <td>${escapeHtml(notice.audience)}</td>
      <td>${escapeHtml(getNoticeTargetLabel(notice))}</td>
      <td>${escapeHtml(notice.publishDate || "-")}</td>
      <td><span class="badge ${notice.priority === "Urgent" ? "red" : notice.priority === "Important" ? "amber" : "blue"}">${escapeHtml(notice.priority)}</span></td>
      <td><span class="status-pill stable">Published</span></td>
    </tr>
  `).join("") || `<tr><td colspan="6">No notices entered yet.</td></tr>`;
  if (preview) {
    const latest = notices[0];
    preview.innerHTML = latest ? `
      <span>Notice Date: ${escapeHtml(getNoticeDateLabel(latest))}</span>
      <strong>Subject: ${escapeHtml(latest.title)}</strong>
      <p>${escapeHtml(latest.message)}</p>
      <small>From: ${escapeHtml(latest.senderName || "Admin")}${latest.senderDesignation ? `, ${escapeHtml(latest.senderDesignation)}` : ""}</small>
      <small>Publish Date: ${escapeHtml(latest.publishDate || "-")} | ${escapeHtml(latest.delivery)}</small>
    ` : `
      <strong>No notice published yet.</strong>
      <p>Published notices will be available for student IDs and teacher accounts when the mobile app is connected.</p>
    `;
  }
}

function getTeacherNoticeStatusTone(status = "") {
  const clean = String(status || "").toLowerCase();
  if (clean === "approved" || clean === "published") return "stable";
  if (clean === "rejected" || clean === "cancelled") return "due";
  return "pending";
}

function renderTeacherNoticeRequests() {
  const rows = document.getElementById("teacherNoticeRequestRows");
  const count = document.getElementById("teacherNoticeRequestCount");
  if (!rows) return;
  const pending = teacherNoticeRequests.filter(item => !["Approved", "Rejected"].includes(item.status));
  if (count) count.textContent = `${pending.length} pending`;
  rows.innerHTML = teacherNoticeRequests.map(item => `
    <article class="teacher-notice-request-card">
      <div>
        <span class="teacher-notice-meta">${escapeHtml(item.teacherName || "Teacher")} | ${escapeHtml(item.className || "-")} | ${escapeHtml(item.createdDate || item.date || "-")}</span>
        <h3>${escapeHtml(item.title || "-")}</h3>
        <p>${escapeHtml(item.message || "-")}</p>
        <small>Priority: ${escapeHtml(item.priority || "Normal")}</small>
      </div>
      <div class="teacher-notice-actions">
        <span class="status-pill ${getTeacherNoticeStatusTone(item.status || "Pending")}">${escapeHtml(item.status || "Pending")}</span>
        ${item.status === "Approved" ? `<small>Published: ${escapeHtml(item.publishedNoticeId || "-")}</small>` : ""}
        ${item.status === "Rejected" ? `<small>Reason: ${escapeHtml(item.rejectReason || "-")}</small>` : ""}
        ${!["Approved", "Rejected"].includes(item.status) ? `
          <button class="primary-action mini" type="button" data-approve-teacher-notice="${escapeHtml(item.id)}">Approve</button>
          <button class="ghost-action mini" type="button" data-reject-teacher-notice="${escapeHtml(item.id)}">Reject</button>
        ` : ""}
      </div>
    </article>
  `).join("") || `<article class="teacher-notice-empty">No teacher notice request yet.</article>`;
}

function approveTeacherNoticeRequest(requestId) {
  const request = teacherNoticeRequests.find(item => item.id === requestId);
  if (!request) return;
  const noticeId = `NOTICE-${Date.now()}`;
  notices.unshift({
    id: noticeId,
    title: request.title || "Class Notice",
    audience: "Selected Class",
    audienceType: "Selected Class",
    noticeClass: request.className || "",
    classes: request.className ? [request.className] : [],
    sections: [],
    publishDate: formatDateDDMMYYYY(new Date()),
    message: request.message || "",
    priority: request.priority || "Normal",
    delivery: "Notice Board + Mobile App",
    status: "Published",
    source: "Teacher App",
    teacherId: request.teacherId || "",
    teacherName: request.teacherName || "",
    createdAt: new Date().toISOString()
  });
  request.status = "Approved";
  request.approvedAt = new Date().toISOString();
  request.publishedNoticeId = noticeId;
  saveAppState();
  sendNoticePushNotification(notices[0]);
  renderTeacherNoticeRequests();
  renderNoticeBoard();
  showToast("Teacher notice approved and published.");
}

function rejectTeacherNoticeRequest(requestId) {
  const request = teacherNoticeRequests.find(item => item.id === requestId);
  if (!request) return;
  const reason = prompt("Enter rejection reason", request.rejectReason || "");
  if (reason === null) return;
  request.status = "Rejected";
  request.rejectReason = String(reason || "").trim() || "Rejected by ERP";
  request.rejectedAt = new Date().toISOString();
  saveAppState();
  renderTeacherNoticeRequests();
  showToast("Teacher notice request rejected.");
}

function teacherAdvisoryStatusTone(status = "") {
  const clean = String(status || "").trim().toLowerCase();
  if (clean === "closed" || clean === "resolved") return "stable";
  if (clean === "explained" || clean === "replied") return "pending";
  if (clean === "urgent") return "due";
  return "live";
}

function teacherAdvisoryTeacherOptions() {
  const activeStaff = staffMembers.filter(staff => !["disabled", "inactive"].includes(String(staff.status || "").trim().toLowerCase()));
  const teachers = activeStaff.filter(staff => {
    const text = `${staff.role || ""} ${staff.designation || ""} ${staff.department || ""}`.toLowerCase();
    return text.includes("teacher") || staff.teachingSubject || staff.assignedClass;
  });
  const list = teachers.length ? teachers : activeStaff;
  return `<option value="">Select teacher</option>${list.map(staff => {
    const value = staff.staffId || staff.loginId || staff.email || staff.name || "";
    const label = `${staff.name || value}${staff.staffId ? ` (${staff.staffId})` : ""}${staff.designation ? ` - ${staff.designation}` : ""}`;
    return `<option value="${escapeHtml(value)}">${escapeHtml(label)}</option>`;
  }).join("")}`;
}

function getTeacherAdvisoryStaff(staffId = "") {
  const clean = String(staffId || "").trim().toLowerCase();
  return staffMembers.find(staff =>
    String(staff.staffId || "").trim().toLowerCase() === clean
    || String(staff.loginId || "").trim().toLowerCase() === clean
    || String(staff.email || "").trim().toLowerCase() === clean
    || String(staff.name || "").trim().toLowerCase() === clean
  ) || {};
}

function renderTeacherAdvisory() {
  const teacherSelect = document.getElementById("teacherAdvisoryTeacher");
  const rows = document.getElementById("teacherAdvisoryRows");
  const count = document.getElementById("teacherAdvisoryCount");
  if (teacherSelect) {
    const selected = teacherSelect.value;
    teacherSelect.innerHTML = teacherAdvisoryTeacherOptions();
    if (selected) teacherSelect.value = selected;
  }
  const open = teacherAdvisories.filter(item => !["Closed", "Resolved"].includes(item.status || ""));
  if (count) count.textContent = `${open.length} open`;
  if (!rows) return;
  rows.innerHTML = teacherAdvisories.map(item => {
    const status = item.status || "Sent";
    const explanation = String(item.explanation || "").trim();
    return `
      <article class="teacher-advisory-card">
        <div>
          <span class="teacher-notice-meta">${escapeHtml(item.teacherName || "Teacher")} | ${escapeHtml(item.category || "Advisory")} | ${escapeHtml(item.date || "-")}</span>
          <h3>${escapeHtml(item.subject || "-")}</h3>
          <p>${escapeHtml(item.message || "-")}</p>
          ${explanation ? `<div class="teacher-advisory-explanation"><strong>Teacher Explanation</strong><p>${escapeHtml(explanation)}</p><small>${escapeHtml(item.explainedAt || "")}</small></div>` : `<small>Teacher explanation pending.</small>`}
        </div>
        <div class="teacher-notice-actions">
          <span class="status-pill ${teacherAdvisoryStatusTone(status)}">${escapeHtml(status)}</span>
          <small>Priority: ${escapeHtml(item.priority || "Normal")}</small>
          ${status !== "Closed" ? `<button class="ghost-action mini" type="button" data-close-teacher-advisory="${escapeHtml(item.id)}">Close</button>` : ""}
        </div>
      </article>
    `;
  }).join("") || `<article class="teacher-notice-empty">No teacher advisory yet.</article>`;
}

function renderHomeworkSubjectOptions({ preserveSubject = true } = {}) {
  const classSelect = document.getElementById("homeworkClassSelect");
  const subjectSelect = document.getElementById("homeworkSubjectSelect");
  if (!classSelect || !subjectSelect) return;
  const selectedClass = classSelect.value;
  const selectedSubject = preserveSubject ? subjectSelect.value : "";
  const classOptions = getAdmissionClassOptions();
  classSelect.innerHTML = `<option value="">Select Class</option>${classOptions.map(className =>
    `<option value="${escapeHtml(className)}">${escapeHtml(className)}</option>`
  ).join("")}`;
  if (selectedClass) setSelectValue(classSelect, selectedClass);
  const subjects = getTimetableSubjectsForClass(classSelect.value);
  subjectSelect.innerHTML = `<option value="">Select Subject</option>${subjects.map(subject =>
    `<option value="${escapeHtml(subject)}">${escapeHtml(subject)}</option>`
  ).join("")}`;
  if (selectedSubject) setSelectValue(subjectSelect, selectedSubject);
}

const HOMEWORK_ATTACHMENT_MAX_BYTES = 10 * 1024 * 1024;
const HOMEWORK_ATTACHMENT_EXTENSIONS = [".pdf", ".doc", ".docx"];
const HOMEWORK_ATTACHMENT_VALID_DAYS = 30;

function getHomeworkAttachmentExpiry(baseDate = new Date()) {
  const date = baseDate instanceof Date ? new Date(baseDate) : new Date(baseDate);
  if (Number.isNaN(date.getTime())) date.setTime(Date.now());
  date.setDate(date.getDate() + HOMEWORK_ATTACHMENT_VALID_DAYS);
  return date.toISOString();
}

function isHomeworkAttachmentExpired(attachment = {}) {
  if (!attachment?.expiresAt) return false;
  const expiry = Date.parse(attachment.expiresAt);
  return Number.isFinite(expiry) && expiry <= Date.now();
}

function pruneExpiredHomeworkAttachments() {
  let changed = false;
  homework.forEach(item => {
    if (!item?.attachment?.url) return;
    if (!item.attachment.createdAt) {
      item.attachment.createdAt = item.createdAt || new Date().toISOString();
      changed = true;
    }
    if (!item.attachment.expiresAt) {
      item.attachment.expiresAt = getHomeworkAttachmentExpiry(item.attachment.createdAt);
      changed = true;
    }
    if (isHomeworkAttachmentExpired(item.attachment)) {
      delete item.attachment;
      changed = true;
    }
  });
  return changed;
}

function getHomeworkAttachmentLink(attachment = {}) {
  if (!attachment || !attachment.url || isHomeworkAttachmentExpired(attachment)) return "-";
  const label = attachment.name || "Open Attachment";
  return `<a class="homework-attachment-link" href="${escapeHtml(attachment.url)}" target="_blank" rel="noopener" download="${escapeHtml(label)}">${escapeHtml(label)}</a>`;
}

function getLeaveAttachmentLink(attachment = {}) {
  if (!attachment || !attachment.url) return "-";
  const label = attachment.name || "Open Attachment";
  return `<a class="homework-attachment-link" href="${escapeHtml(attachment.url)}" target="_blank" rel="noopener" download="${escapeHtml(label)}">${escapeHtml(label)}</a>`;
}

function isTeacherHomeworkEntry(item = {}) {
  const source = String(item.source || item.createdFrom || item.origin || "").toLowerCase();
  return source.includes("teacher") || Boolean(item.teacherId || item.teacherName || item.teacher);
}

function getHomeworkTeacherName(item = {}) {
  return item.teacherName || item.teacher || item.staffName || item.createdBy || "Teacher App";
}

function getTeacherHomeworkDate(item = {}) {
  return item.due || item.dueDate || item.date || item.createdDate || "";
}

function setTeacherHomeworkFilterOptions(select, values = [], placeholder = "All") {
  if (!select) return;
  const current = select.value;
  const uniqueValues = [...new Set(values.map(value => String(value || "").trim()).filter(Boolean))]
    .sort((a, b) => a.localeCompare(b, undefined, {numeric: true, sensitivity: "base"}));
  select.innerHTML = `<option value="">${escapeHtml(placeholder)}</option>${uniqueValues
    .map(value => `<option value="${escapeHtml(value)}">${escapeHtml(value)}</option>`)
    .join("")}`;
  if (uniqueValues.includes(current)) select.value = current;
}

function setHomeworkDoubtFilterOptions(select, values = [], placeholder = "All") {
  if (!select) return;
  const current = select.value;
  const uniqueValues = [...new Set(values.map(value => String(value || "").trim()).filter(Boolean))]
    .sort((a, b) => a.localeCompare(b, undefined, {numeric: true, sensitivity: "base"}));
  select.innerHTML = `<option value="">${escapeHtml(placeholder)}</option>${uniqueValues
    .map(value => `<option value="${escapeHtml(value)}">${escapeHtml(value)}</option>`)
    .join("")}`;
  if (uniqueValues.includes(current)) select.value = current;
}

function renderHomeworkDoubts() {
  const classFilter = document.getElementById("homeworkDoubtClassFilter");
  const sectionFilter = document.getElementById("homeworkDoubtSectionFilter");
  const statusFilter = document.getElementById("homeworkDoubtStatusFilter");
  const count = document.getElementById("homeworkDoubtCount");
  const rows = document.getElementById("homeworkDoubtRows");
  if (!rows) return;
  setHomeworkDoubtFilterOptions(classFilter, homeworkDoubts.map(item => item.className), "Select Class");
  const selectedClass = String(classFilter?.value || "").trim();
  const classDoubts = homeworkDoubts.filter(item => !selectedClass || String(item.className || "").trim() === selectedClass);
  setHomeworkDoubtFilterOptions(sectionFilter, classDoubts.map(item => item.section), "All Sections");
  const selectedSection = String(sectionFilter?.value || "").trim();
  const selectedStatus = String(statusFilter?.value || "").trim();
  const filtered = homeworkDoubts.filter(item => {
    const classOk = selectedClass && String(item.className || "").trim() === selectedClass;
    const sectionOk = !selectedSection || String(item.section || "").trim() === selectedSection;
    const statusOk = !selectedStatus || String(item.status || "Open").trim() === selectedStatus;
    return classOk && sectionOk && statusOk;
  });
  if (count) {
    count.textContent = selectedClass ? `${filtered.length} Chats` : `${homeworkDoubts.length} Total`;
  }
  if (!selectedClass) {
    rows.innerHTML = `<article class="teacher-notice-empty">Select a class to view homework chats.</article>`;
    return;
  }
  rows.innerHTML = filtered.map(item => {
    const replies = Array.isArray(item.replies) ? item.replies : [];
    return `
      <article class="homework-doubt-card">
        <div class="homework-doubt-head">
          <div>
            <span class="teacher-notice-meta">${escapeHtml(item.className || "-")} ${item.section ? `| ${escapeHtml(item.section)}` : ""} | ${escapeHtml(item.subject || "Homework")}</span>
            <h3>${escapeHtml(item.studentName || "Student")} <small>Admission No: ${escapeHtml(item.studentAdmissionNo || "-")}</small></h3>
            <p>${escapeHtml(item.message || "-")}</p>
          </div>
          <span class="status-pill ${String(item.status || "Open") === "Replied" ? "stable" : "live"}">${escapeHtml(item.status || "Open")}</span>
        </div>
        <div class="homework-doubt-meta">
          <span>Teacher: ${escapeHtml(item.teacherName || "-")}</span>
          <span>Due: ${escapeHtml(item.homeworkDue || "-")}</span>
          <span>Sent: ${escapeHtml(item.createdAt || "-")}</span>
        </div>
        ${replies.length ? `<div class="homework-doubt-replies">${replies.map(reply => `
          <div class="homework-doubt-reply">
            <strong>${escapeHtml(reply.teacherName || item.teacherName || "Teacher")}</strong>
            <p>${escapeHtml(reply.message || "")}</p>
            <small>${escapeHtml(reply.createdAt || "")}</small>
          </div>
        `).join("")}</div>` : `<small>No teacher reply yet.</small>`}
      </article>
    `;
  }).join("") || `<article class="teacher-notice-empty">No homework chat found for this filter.</article>`;
}

function readHomeworkAttachment(file) {
  return new Promise((resolve, reject) => {
    if (!file) {
      resolve(null);
      return;
    }
    const lowerName = String(file.name || "").toLowerCase();
    const allowed = HOMEWORK_ATTACHMENT_EXTENSIONS.some(ext => lowerName.endsWith(ext));
    if (!allowed) {
      reject(new Error("Only PDF, DOC or DOCX attachment allowed."));
      return;
    }
    if (file.size > HOMEWORK_ATTACHMENT_MAX_BYTES) {
      reject(new Error("Attachment 10 MB er moddhe rakhun."));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => resolve({
      name: file.name,
      type: file.type || "application/octet-stream",
      size: file.size,
      url: String(reader.result || ""),
      createdAt: new Date().toISOString(),
      expiresAt: getHomeworkAttachmentExpiry(new Date()),
      source: "inline-data"
    });
    reader.onerror = () => reject(new Error("The attachment could not be read."));
    reader.readAsDataURL(file);
  });
}

function renderHomeworkModule() {
  renderHomeworkSubjectOptions();
  pruneExpiredHomeworkAttachments();
  const rows = document.getElementById("homeworkRows");
  const teacherRows = document.getElementById("teacherHomeworkRows");
  const teacherCount = document.getElementById("teacherHomeworkCount");
  const teacherFilter = document.getElementById("teacherHomeworkTeacherFilter");
  const classFilter = document.getElementById("teacherHomeworkClassFilter");
  const dateFilter = document.getElementById("teacherHomeworkDateFilter");
  const preview = document.getElementById("homeworkPreviewBox");
  if (preview) {
    const latest = homework[0];
    preview.innerHTML = latest ? `
      <strong>${escapeHtml(latest.className || "-")} | ${escapeHtml(latest.subject || "-")}</strong>
      <span>Due: ${escapeHtml(latest.due || "-")}</span>
      <p>${escapeHtml(latest.text || "-")}</p>
      <div>${getHomeworkAttachmentLink(latest.attachment)}</div>
    ` : "After selecting a class and subject, the homework will appear class-wise in the student app.";
  }
  const teacherHomework = homework
    .map((item, index) => ({item, index}))
    .filter(({item}) => isTeacherHomeworkEntry(item));
  setTeacherHomeworkFilterOptions(teacherFilter, teacherHomework.map(({item}) => getHomeworkTeacherName(item)), "All Teachers");
  setTeacherHomeworkFilterOptions(classFilter, teacherHomework.map(({item}) => item.className || item.class), "All Classes");
  const selectedTeacher = String(teacherFilter?.value || "").trim();
  const selectedClass = String(classFilter?.value || "").trim();
  const selectedDate = String(dateFilter?.value || "").trim();
  const filteredTeacherHomework = teacherHomework.filter(({item}) => {
    const teacherName = String(getHomeworkTeacherName(item)).trim();
    const className = String(item.className || item.class || "").trim();
    const homeworkDate = String(getTeacherHomeworkDate(item)).trim();
    return (!selectedTeacher || teacherName === selectedTeacher)
      && (!selectedClass || className === selectedClass)
      && (!selectedDate || homeworkDate === selectedDate);
  });
  if (teacherCount) {
    teacherCount.textContent = selectedTeacher || selectedClass || selectedDate
      ? `${filteredTeacherHomework.length} of ${teacherHomework.length} Submitted`
      : `${teacherHomework.length} Submitted`;
  }
  if (teacherRows) {
    teacherRows.innerHTML = filteredTeacherHomework.map(({item}) => `
      <tr>
        <td><strong>${escapeHtml(getHomeworkTeacherName(item))}</strong><br><small>${escapeHtml(item.teacherId || item.staffId || item.source || "Teacher App")}</small></td>
        <td><strong>${escapeHtml(item.className || item.class || "-")}</strong></td>
        <td>${escapeHtml(item.subject || "-")}</td>
        <td><div class="teacher-homework-text">${escapeHtml(item.text || item.homework || "-")}</div></td>
        <td>${escapeHtml(getTeacherHomeworkDate(item) || "-")}</td>
        <td>${getHomeworkAttachmentLink(item.attachment)}</td>
        <td><span class="status-pill stable">${escapeHtml(item.status || "Published")}</span></td>
      </tr>
    `).join("") || `<tr><td colspan="7">No teacher homework found for the selected filter.</td></tr>`;
  }
  renderHomeworkDoubts();
  if (!rows) return;
  rows.innerHTML = homework.map((item, index) => `
    <tr>
      <td><strong>${escapeHtml(item.className || "-")}</strong></td>
      <td>${escapeHtml(item.subject || "-")}</td>
      <td>${escapeHtml(item.text || "-")}</td>
      <td>${escapeHtml(item.due || "-")}</td>
      <td>${getHomeworkAttachmentLink(item.attachment)}</td>
      <td><span class="status-pill stable">${escapeHtml(item.status || "Published")}</span></td>
      <td><button class="icon-action delete" type="button" data-delete-homework="${index}" title="Delete homework" aria-label="Delete homework">×</button></td>
    </tr>
  `).join("") || `<tr><td colspan="7">No assignments entered yet.</td></tr>`;
}

async function publishHomeworkEntry(form) {
  const data = new FormData(form);
  let attachment = null;
  try {
    attachment = await readHomeworkAttachment(form.elements.attachment?.files?.[0]);
  } catch (error) {
    showToast(error.message || "Attachment save kora gelo na.");
    return;
  }
  const entry = {
    id: `HW-${Date.now()}`,
    className: String(data.get("className") || "").trim(),
    subject: String(data.get("subject") || "").trim(),
    text: String(data.get("text") || "").trim(),
    due: String(data.get("due") || "").trim(),
    attachment,
    date: toDateInputValue(new Date()),
    status: "Published",
    source: "Main ERP",
    createdAt: new Date().toISOString()
  };
  if (!entry.className || !entry.subject || !entry.text || !entry.due) {
    showToast("Class, subject, homework and due date required.");
    return;
  }
  homework.unshift(entry);
  saveAppState();
  sendHomeworkPushNotification(entry);
  form.reset();
  if (form.elements.due) form.elements.due.value = toDateInputValue(new Date());
  renderHomeworkModule();
  showToast("Homework published to student app.");
}

function renderStaffDetailsFormOptions() {
  if (!staffDetailsForm) return;
  const staffRoleSelect = staffDetailsForm.elements.role;
  const staffDepartmentSelect = staffDetailsForm.elements.department;
  const staffDesignationSelect = staffDetailsForm.elements.designation;
  const staffSubjectSelect = staffDetailsForm.elements.teachingSubject;
  const roleOptions = [...new Set([
    ...PROTECTED_ROLE_NAMES,
    ...roles.map(role => role.name),
    ...staffMembers.map(staff => staff.role),
    ...userAccessAccounts.map(account => account.role)
  ].map(value => String(value || "").trim()).filter(Boolean))].sort((a, b) => a.localeCompare(b));
  const departmentOptions = [...new Set([
    ...departments.map(department => department.name),
    ...staffMembers.map(staff => staff.department)
  ].map(value => String(value || "").trim()).filter(Boolean))].sort((a, b) => a.localeCompare(b));
  const designationOptions = [...new Set([
    ...DEFAULT_STAFF_DESIGNATIONS,
    ...designations.map(designation => designation.name),
    ...staffMembers.map(staff => staff.designation)
  ].map(value => String(value || "").trim()).filter(Boolean))].sort((a, b) => a.localeCompare(b));
  const subjectOptions = [...new Set([
    ...getSubjectOptions(),
    ...staffMembers.flatMap(staff => String(staff.teachingSubject || "").split(","))
  ].map(value => String(value || "").trim()).filter(Boolean))].sort((a, b) => a.localeCompare(b));
  if (staffRoleSelect) {
    const currentValue = staffRoleSelect.value;
    staffRoleSelect.innerHTML = `<option value="">Select Role</option>` + roleOptions
      .map(role => `<option value="${escapeHtml(role)}">${escapeHtml(role)}</option>`)
      .join("");
    if (currentValue) setSelectValue(staffRoleSelect, currentValue);
  }
  if (staffDepartmentSelect) {
    const currentValue = staffDepartmentSelect.value;
    staffDepartmentSelect.innerHTML = `<option value="">Select Department</option>` + departmentOptions
      .map(department => `<option value="${escapeHtml(department)}">${escapeHtml(department)}</option>`)
      .join("");
    if (currentValue) setSelectValue(staffDepartmentSelect, currentValue);
  }
  if (staffDesignationSelect) {
    const currentValue = staffDesignationSelect.value;
    staffDesignationSelect.innerHTML = `<option value="">Select Designation</option>` + designationOptions
      .map(designation => `<option value="${escapeHtml(designation)}">${escapeHtml(designation)}</option>`)
      .join("");
    if (currentValue) setSelectValue(staffDesignationSelect, currentValue);
  }
  if (staffSubjectSelect) {
    const currentValue = staffSubjectSelect.value;
    staffSubjectSelect.innerHTML = `<option value="">Select Subject</option>` + subjectOptions
      .map(subject => `<option value="${escapeHtml(subject)}">${escapeHtml(subject)}</option>`)
      .join("");
    if (currentValue) setSelectValue(staffSubjectSelect, currentValue);
  }
}

function renderStaffDetails() {
  const rows = document.getElementById("staffDetailsRows");
  const summary = document.getElementById("staffSummary");
  renderStaffDetailsFormOptions();
  if (!rows) return;
  rows.innerHTML = staffMembers.map(staff => `
    <tr>
      <td><strong>${escapeHtml(staff.staffId || "-")}</strong></td>
      <td>
        <div class="staff-table-profile">
          <span class="staff-table-photo">${staff.photo ? `<img src="${staff.photo}" alt="${escapeHtml(staff.name || "Staff")} photo" />` : escapeHtml((staff.name || "ST").split(/\s+/).map(part => part[0]).join("").slice(0, 2).toUpperCase() || "ST")}</span>
          <span><strong>${escapeHtml(staff.name || "-")}</strong><br><small>${escapeHtml(staff.address || "-")}</small></span>
        </div>
      </td>
      <td>${escapeHtml(staff.role || "-")}</td>
      <td>${escapeHtml(staff.designation || "-")}${isTeacherDesignation(staff.designation) && staff.teachingSubject ? `<br><small>Subject: ${escapeHtml(staff.teachingSubject)}</small>` : ""}${staff.assignedClass ? `<br><small>Class Teacher: ${escapeHtml(staff.assignedClass)}</small>` : ""}</td>
      <td>${escapeHtml(staff.department || "-")}</td>
      <td>${escapeHtml(staff.phone || "-")}<br><small>Password: phone</small></td>
      <td>${escapeHtml(staff.email || "-")}<br><small>Mobile app login ID</small></td>
      <td>${escapeHtml(staff.emergencyPhone || "-")}</td>
      <td><span class="badge ${staff.status === "Disabled" ? "red" : "green"}">${staff.status === "Disabled" ? "Disabled" : "Active"}</span></td>
      <td>
        <div class="row-actions">
          <button class="icon-action edit" type="button" data-edit-staff="${escapeHtml(staff.staffId)}" title="Edit staff" aria-label="Edit ${escapeHtml(staff.name)}">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20h4.7L19.3 9.4a2.1 2.1 0 0 0 0-3L17.6 4.7a2.1 2.1 0 0 0-3 0L4 15.3V20Zm3.8-2H6v-1.8l8.5-8.5 1.8 1.8L7.8 18Zm7.9-11.5.4-.4 1.8 1.8-.4.4-1.8-1.8Z"/></svg>
          </button>
          <button class="icon-action fees" type="button" data-disable-staff="${escapeHtml(staff.staffId)}" title="Disable staff" aria-label="Disable ${escapeHtml(staff.name)}">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm0 2c1.9 0 3.7.8 4.9 2L6 16.9A8 8 0 0 1 12 4Zm0 16c-1.9 0-3.7-.8-4.9-2L18 7.1A8 8 0 0 1 12 20Z"/></svg>
          </button>
          <button class="icon-action delete" type="button" data-delete-staff="${escapeHtml(staff.staffId)}" title="Delete staff" aria-label="Delete ${escapeHtml(staff.name)}">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 21c-.6 0-1.1-.2-1.5-.6S5 19.5 5 19V8H4V6h5V4h6v2h5v2h-1v11c0 .6-.2 1.1-.6 1.5s-.9.6-1.5.6H7ZM17 8H7v11h10V8Zm-8 9h2v-7H9v7Zm4 0h2v-7h-2v7Z"/></svg>
          </button>
        </div>
      </td>
    </tr>
  `).join("") || `<tr><td colspan="10">No staff details entered yet.</td></tr>`;
  if (summary) summary.textContent = `${staffMembers.length} staff saved`;
}

function renderHrSetup() {
  const departmentRows = document.getElementById("departmentRows");
  const departmentSummary = document.getElementById("departmentSummary");
  const roleRows = document.getElementById("roleRows");
  const roleSummary = document.getElementById("roleSummary");
  const designationRows = document.getElementById("designationRows");
  const designationSummary = document.getElementById("designationSummary");
  const designationDepartmentSelect = designationForm ? designationForm.elements.department : null;

  renderStaffDetailsFormOptions();
  if (designationDepartmentSelect) {
    const currentValue = designationDepartmentSelect.value;
    designationDepartmentSelect.innerHTML = `<option value="">Select Department</option>` + departments
      .map(department => `<option value="${escapeHtml(department.name)}">${escapeHtml(department.name)}</option>`)
      .join("");
    if (currentValue && [...designationDepartmentSelect.options].some(option => option.value === currentValue)) {
      designationDepartmentSelect.value = currentValue;
    }
  }
  renderStaffTeachingSubjectField();
  if (departmentRows) {
    departmentRows.innerHTML = departments.map((department, index) => {
      const staffCount = staffMembers.filter(staff => (staff.department || "").toLowerCase() === department.name.toLowerCase()).length;
      return `
        <tr>
          <td><strong>${escapeHtml(department.name)}</strong></td>
          <td><span class="status-pill stable">${staffCount}</span></td>
          <td>
            <button class="icon-action edit" type="button" data-edit-department="${index}" title="Edit department" aria-label="Edit department">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20h4.7L19.3 9.4a2.1 2.1 0 0 0 0-3L17.6 4.7a2.1 2.1 0 0 0-3 0L4 15.3V20Zm3.8-2H6v-1.8l8.5-8.5 1.8 1.8L7.8 18Zm7.9-11.5.4-.4 1.8 1.8-.4.4-1.8-1.8Z"/></svg>
            </button>
            <button class="icon-action delete" type="button" data-delete-department="${index}" title="Delete department" aria-label="Delete department">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 21c-.6 0-1.1-.2-1.5-.6S5 19.5 5 19V8H4V6h5V4h6v2h5v2h-1v11c0 .6-.2 1.1-.6 1.5s-.9.6-1.5.6H7ZM17 8H7v11h10V8Zm-8 9h2v-7H9v7Zm4 0h2v-7h-2v7Z"/></svg>
            </button>
          </td>
        </tr>
      `;
    }).join("") || `<tr><td colspan="3">No departments entered yet.</td></tr>`;
  }
  if (departmentSummary) departmentSummary.textContent = `${departments.length} departments saved`;
  if (roleRows) {
    roleRows.innerHTML = roles.map((role, index) => {
      const staffCount = staffMembers.filter(staff => (staff.role || "").toLowerCase() === role.name.toLowerCase()).length;
      const protectedRole = isProtectedRoleName(role.name);
      return `
        <tr>
          <td><strong>${escapeHtml(role.name)}</strong>${protectedRole ? `<small class="system-lock-note">Protected</small>` : ""}</td>
          <td>${escapeHtml(role.description || "-")}</td>
          <td><span class="status-pill stable">${staffCount}</span></td>
          <td>
            <button class="icon-action edit" type="button" data-edit-role="${index}" ${protectedRole ? "disabled" : ""} title="${protectedRole ? "Protected role cannot be edited" : "Edit role"}" aria-label="Edit role">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20h4.7L19.3 9.4a2.1 2.1 0 0 0 0-3L17.6 4.7a2.1 2.1 0 0 0-3 0L4 15.3V20Zm3.8-2H6v-1.8l8.5-8.5 1.8 1.8L7.8 18Zm7.9-11.5.4-.4 1.8 1.8-.4.4-1.8-1.8Z"/></svg>
            </button>
            <button class="icon-action delete" type="button" data-delete-role="${index}" ${protectedRole ? "disabled" : ""} title="${protectedRole ? "Protected role cannot be deleted" : "Delete role"}" aria-label="Delete role">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 21c-.6 0-1.1-.2-1.5-.6S5 19.5 5 19V8H4V6h5V4h6v2h5v2h-1v11c0 .6-.2 1.1-.6 1.5s-.9.6-1.5.6H7ZM17 8H7v11h10V8Zm-8 9h2v-7H9v7Zm4 0h2v-7h-2v7Z"/></svg>
            </button>
          </td>
        </tr>
      `;
    }).join("") || `<tr><td colspan="4">No roles entered yet.</td></tr>`;
  }
  if (roleSummary) roleSummary.textContent = `${roles.length} roles saved`;
  if (designationRows) {
    designationRows.innerHTML = designations.map((designation, index) => {
      const staffCount = staffMembers.filter(staff => (staff.designation || "").toLowerCase() === designation.name.toLowerCase()).length;
      return `
        <tr>
          <td><strong>${escapeHtml(designation.name)}</strong></td>
          <td>${escapeHtml(designation.department || "-")}</td>
          <td>${escapeHtml(designation.level || "-")}</td>
          <td><span class="status-pill stable">${staffCount}</span></td>
          <td>
            <button class="icon-action edit" type="button" data-edit-designation="${index}" title="Edit designation" aria-label="Edit designation">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20h4.7L19.3 9.4a2.1 2.1 0 0 0 0-3L17.6 4.7a2.1 2.1 0 0 0-3 0L4 15.3V20Zm3.8-2H6v-1.8l8.5-8.5 1.8 1.8L7.8 18Zm7.9-11.5.4-.4 1.8 1.8-.4.4-1.8-1.8Z"/></svg>
            </button>
            <button class="icon-action delete" type="button" data-delete-designation="${index}" title="Delete designation" aria-label="Delete designation">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 21c-.6 0-1.1-.2-1.5-.6S5 19.5 5 19V8H4V6h5V4h6v2h5v2h-1v11c0 .6-.2 1.1-.6 1.5s-.9.6-1.5.6H7ZM17 8H7v11h10V8Zm-8 9h2v-7H9v7Zm4 0h2v-7h-2v7Z"/></svg>
            </button>
          </td>
        </tr>
      `;
    }).join("") || `<tr><td colspan="5">No designations entered yet.</td></tr>`;
  }
  if (designationSummary) designationSummary.textContent = `${designations.length} designations saved`;
}

function getDefaultRolePermission(roleName = "") {
  const isAdmin = isProtectedRoleName(roleName) || /admin|administrator|principal/i.test(roleName);
  return ACCESS_PERMISSION_MODULES.reduce((permissions, moduleId) => {
    permissions[moduleId] = ACCESS_ACTIONS.reduce((actions, action) => {
      actions[action] = isAdmin || action === "view";
      return actions;
    }, {});
    return permissions;
  }, {});
}

function ensureProtectedRoles() {
  PROTECTED_ROLE_NAMES.forEach(name => {
    if (!roles.some(role => String(role.name || "").trim().toLowerCase() === name.toLowerCase())) {
      roles.push({name, type: "System", description: "Protected full access role"});
    }
    rolePermissions[name] = getDefaultRolePermission(name);
  });
}

function normalizeRolePermission(roleName = "") {
  const cleanRole = String(roleName || "").trim();
  if (!cleanRole) return {};
  if (isProtectedRoleName(cleanRole)) {
    rolePermissions[cleanRole] = getDefaultRolePermission(cleanRole);
    return rolePermissions[cleanRole];
  }
  if (!rolePermissions[cleanRole]) rolePermissions[cleanRole] = getDefaultRolePermission(cleanRole);
  ACCESS_PERMISSION_MODULES.forEach(moduleId => {
    if (!rolePermissions[cleanRole][moduleId]) rolePermissions[cleanRole][moduleId] = {};
    ACCESS_ACTIONS.forEach(action => {
      rolePermissions[cleanRole][moduleId][action] = Boolean(rolePermissions[cleanRole][moduleId][action]);
    });
  });
  return rolePermissions[cleanRole];
}

function renderAccessRoleOptions() {
  const userRoleSelect = document.getElementById("accessUserRoleSelect");
  const permissionRoleSelect = document.getElementById("accessPermissionRole");
  [userRoleSelect, permissionRoleSelect].forEach(select => {
    if (!select) return;
    const currentValue = select.value;
    select.innerHTML = `<option value="">Select Role</option>` + roles
      .map(role => `<option value="${escapeHtml(role.name)}">${escapeHtml(role.name)}</option>`)
      .join("");
    if (currentValue && [...select.options].some(option => option.value === currentValue)) select.value = currentValue;
  });
}

function renderAccessStaffOptions() {
  const select = document.getElementById("accessStaffSelect");
  if (!select) return;
  const currentValue = select.value;
  select.innerHTML = `<option value="">Select Staff</option>` + staffMembers
    .map(staff => `<option value="${escapeHtml(staff.staffId)}">${escapeHtml(staff.staffId)} - ${escapeHtml(staff.name)}</option>`)
    .join("");
  if (currentValue && [...select.options].some(option => option.value === currentValue)) select.value = currentValue;
}

function getStaffByStaffId(staffId = "") {
  const cleanId = String(staffId || "").trim().toLowerCase();
  return staffMembers.find(staff => String(staff.staffId || "").trim().toLowerCase() === cleanId) || null;
}

function renderPermissionRows(roleName = "") {
  const tbody = document.getElementById("accessPermissionRows");
  const allTick = document.getElementById("accessPermissionAllTick");
  const saveButton = document.querySelector("#accessPermissionForm button[type='submit']");
  if (!tbody) return;
  const cleanRole = String(roleName || "").trim();
  if (!cleanRole) {
    tbody.innerHTML = `<tr><td colspan="6">Select a role to set permissions.</td></tr>`;
    if (allTick) {
      allTick.checked = false;
      allTick.disabled = true;
    }
    if (saveButton) saveButton.disabled = false;
    return;
  }
  const protectedRole = isProtectedRoleName(cleanRole);
  const permissions = normalizeRolePermission(cleanRole);
  const renderedModules = new Set();
  const renderModuleRow = (moduleId, groupName = "") => {
    renderedModules.add(moduleId);
    const modulePermissions = permissions[moduleId] || {};
    return `
        <tr>
          <td><strong>${escapeHtml(titleMap[moduleId] || moduleId)}</strong></td>
          ${ACCESS_ACTIONS.map(action => `
            <td>
              <label class="permission-check" title="${action} ${titleMap[moduleId] || moduleId}">
                <input type="checkbox" name="${moduleId}.${action}" data-permission-module="${escapeHtml(moduleId)}" data-permission-action="${escapeHtml(action)}" data-permission-group="${escapeHtml(groupName)}" ${modulePermissions[action] ? "checked" : ""} ${protectedRole ? "disabled" : ""} />
              </label>
            </td>
          `).join("")}
        </tr>
      `;
  };
  tbody.innerHTML = ACCESS_PERMISSION_GROUPS.map(group => {
    const groupModules = group.modules.filter(moduleId => ACCESS_PERMISSION_MODULES.includes(moduleId));
    const rows = groupModules.map(moduleId => renderModuleRow(moduleId, group.name)).join("");
    if (!rows) return "";
    return `
      <tr class="permission-group-row">
        <td>${escapeHtml(group.name)}</td>
        <td colspan="5">
          <label class="permission-group-toggle">All Tick
            <input type="checkbox" data-permission-group-toggle="${escapeHtml(group.name)}" ${protectedRole ? "disabled" : ""} />
          </label>
        </td>
      </tr>
      ${rows}
    `;
  }).join("") + ACCESS_PERMISSION_MODULES
    .filter(moduleId => !renderedModules.has(moduleId))
    .map(moduleId => renderModuleRow(moduleId, "Other"))
    .join("");
  if (allTick) {
    allTick.disabled = protectedRole;
    updateAccessPermissionAllTickState();
  }
  if (saveButton) saveButton.disabled = protectedRole;
}

function updateAccessPermissionAllTickState() {
  const allTick = document.getElementById("accessPermissionAllTick");
  if (!allTick) return;
  const permissionInputs = [...document.querySelectorAll("#accessPermissionRows input[data-permission-module]")]
    .filter(input => !input.disabled);
  const checkedCount = permissionInputs.filter(input => input.checked).length;
  allTick.checked = permissionInputs.length > 0 && checkedCount === permissionInputs.length;
  allTick.indeterminate = checkedCount > 0 && checkedCount < permissionInputs.length;
  updateAccessPermissionGroupTickStates();
}

function updateAccessPermissionGroupTickStates() {
  const permissionInputs = [...document.querySelectorAll("#accessPermissionRows input[data-permission-module]")]
    .filter(input => !input.disabled);
  document.querySelectorAll("#accessPermissionRows input[data-permission-group-toggle]").forEach(toggle => {
    const groupName = toggle.dataset.permissionGroupToggle || "";
    const groupInputs = permissionInputs.filter(input => input.dataset.permissionGroup === groupName);
    const checkedCount = groupInputs.filter(input => input.checked).length;
    toggle.checked = groupInputs.length > 0 && checkedCount === groupInputs.length;
    toggle.indeterminate = checkedCount > 0 && checkedCount < groupInputs.length;
  });
}

function persistRolePermissionLocally() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(getAppStateSnapshot()));
  } catch (error) {
    console.warn("Could not persist permission draft locally.", error);
  }
}

function syncPermissionInputsToRole(roleName = document.getElementById("accessPermissionRole")?.value || "") {
  const cleanRole = String(roleName || "").trim();
  if (!cleanRole || isProtectedRoleName(cleanRole)) return;
  const permissions = normalizeRolePermission(cleanRole);
  document.querySelectorAll("#accessPermissionRows input[data-permission-module]").forEach(input => {
    const moduleId = input.dataset.permissionModule;
    const action = input.dataset.permissionAction;
    if (!moduleId || !action) return;
    if (!permissions[moduleId]) permissions[moduleId] = {};
    permissions[moduleId][action] = Boolean(input.checked);
  });
  rolePermissions[cleanRole] = permissions;
  persistRolePermissionLocally();
}

function renderUserAccessRows() {
  const rows = document.getElementById("userAccessRows");
  const summary = document.getElementById("userAccessSummary");
  if (!rows) return;
  rows.innerHTML = userAccessAccounts.map((account, index) => {
    const protectedAccount = isProtectedRoleName(account.role);
    return `
    <tr>
      <td><strong>${escapeHtml(account.staffName || "-")}</strong><small>${escapeHtml(account.staffId || "")}</small></td>
      <td>${escapeHtml(account.role || "-")}${protectedAccount ? `<small class="system-lock-note">Protected</small>` : ""}</td>
      <td>${escapeHtml(account.schoolName || getSchoolById(account.school_id || account.schoolId)?.name || "Alfred Nobel Public School")}<small>${escapeHtml(account.school_id || account.schoolId || "anps")}</small></td>
      <td>${escapeHtml(account.loginId || "-")}</td>
      <td>${escapeHtml(account.password || "-")}</td>
      <td><span class="status-pill ${account.status === "Active" ? "stable" : "pending"}">${escapeHtml(account.status || "Active")}</span></td>
      <td>
        <div class="row-actions">
          <button class="icon-action edit" type="button" data-edit-user-access="${index}" title="Edit user login" aria-label="Edit user login">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20h4.7L19.3 9.4a2.1 2.1 0 0 0 0-3L17.6 4.7a2.1 2.1 0 0 0-3 0L4 15.3V20Zm3.8-2H6v-1.8l8.5-8.5 1.8 1.8L7.8 18Zm7.9-11.5.4-.4 1.8 1.8-.4.4-1.8-1.8Z"/></svg>
          </button>
          <button class="icon-action" type="button" data-toggle-user-access="${index}" ${protectedAccount ? "disabled" : ""} title="${protectedAccount ? "Protected login cannot be disabled" : account.status === "Active" ? "Disable user" : "Enable user"}" aria-label="${account.status === "Active" ? "Disable" : "Enable"} user">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 22a10 10 0 1 1 0-20 10 10 0 0 1 0 20Zm0-2a8 8 0 0 0 6.3-12.9L7.1 18.3A8 8 0 0 0 12 20Zm-6.3-3.1L16.9 5.7A8 8 0 0 0 5.7 16.9Z"/></svg>
          </button>
          <button class="icon-action delete" type="button" data-delete-user-access="${index}" ${protectedAccount ? "disabled" : ""} title="${protectedAccount ? "Protected login cannot be deleted" : "Delete user login"}" aria-label="Delete user login">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 21c-.6 0-1.1-.2-1.5-.6S5 19.5 5 19V8H4V6h5V4h6v2h5v2h-1v11c0 .6-.2 1.1-.6 1.5s-.9.6-1.5.6H7ZM17 8H7v11h10V8Zm-8 9h2v-7H9v7Zm4 0h2v-7h-2v7Z"/></svg>
          </button>
        </div>
      </td>
    </tr>
  `;
  }).join("") || `<tr><td colspan="7">No user login saved yet.</td></tr>`;
  if (summary) summary.textContent = `${userAccessAccounts.length} users saved`;
}

function renderStudentUserOptions() {
  const select = document.getElementById("studentUserSelect");
  if (!select) return;
  const currentValue = select.value;
  select.innerHTML = `<option value="">Select Student</option>` + getActiveStudents()
    .map(student => `<option value="${escapeHtml(student.admissionNo)}">${escapeHtml(student.name)}</option>`)
    .join("");
  if (currentValue && [...select.options].some(option => option.value === currentValue)) select.value = currentValue;
}

function getStudentUserPermissionValues(account = {}) {
  return Array.isArray(account.appPermissions) && account.appPermissions.length
    ? account.appPermissions
    : ["Notices", "Class Timetable", "Fees", "Attendance", "Homework"];
}

function getStudentLoginIdFromAdmissionNo(admissionNo = "") {
  const clean = String(admissionNo || "").trim();
  if (!clean) return "";
  const parts = clean.split(/[^A-Za-z0-9]+/).filter(Boolean);
  const lastPart = parts.length ? parts[parts.length - 1] : clean;
  const trailingNumber = String(lastPart).match(/\d+$/)?.[0] || lastPart;
  return `anps${trailingNumber}`;
}

function getStudentPortalPassword(student = {}) {
  return String(
    student.mobile
    || student.fatherMobile
    || student.motherMobile
    || student.guardianMobile
    || student.phone
    || ""
  ).trim();
}

function buildStudentUserAccount(student = {}, existing = {}) {
  return {
    admissionNo: student.admissionNo || existing.admissionNo || "",
    studentName: student.name || existing.studentName || "",
    klass: student.klass || existing.klass || "",
    loginId: getStudentLoginIdFromAdmissionNo(student.admissionNo || existing.admissionNo),
    password: existing.password || getStudentPortalPassword(student),
    status: existing.status || "Active",
    appPermissions: getStudentUserPermissionValues(existing)
  };
}

function autoFillStudentUserAccounts() {
  const activeStudents = getActiveStudents();
  let created = 0;
  let updated = 0;
  let skipped = 0;
  activeStudents.forEach(student => {
    const loginId = getStudentLoginIdFromAdmissionNo(student.admissionNo);
    const password = getStudentPortalPassword(student);
    const existingIndex = studentUserAccounts.findIndex(account =>
      normalizeAdmissionNo(account.admissionNo) === normalizeAdmissionNo(student.admissionNo)
      || String(account.loginId || "").toLowerCase() === loginId.toLowerCase()
    );
    if (existingIndex < 0 && !password) {
      skipped += 1;
      return;
    }
    if (existingIndex >= 0) {
      const existing = studentUserAccounts[existingIndex];
      studentUserAccounts[existingIndex] = buildStudentUserAccount(student, existing);
      updated += 1;
      return;
    }
    studentUserAccounts.unshift(buildStudentUserAccount(student));
    created += 1;
  });
  normalizeStudentUserLoginIds();
  saveAppState();
  renderStudentUserLogin();
  showToast(`Student users ready: ${created} new, ${updated} updated${skipped ? `, ${skipped} skipped - mobile missing` : ""}.`);
}

function normalizeStudentUserLoginIds() {
  let changed = false;
  studentUserAccounts.forEach(account => {
    const loginId = getStudentLoginIdFromAdmissionNo(account.admissionNo);
    if (loginId && account.loginId !== loginId) {
      account.loginId = loginId;
      changed = true;
    }
  });
  return changed;
}

function renderStudentUserFilterOptions() {
  const select = document.getElementById("studentUserClassFilter");
  if (!select) return;
  const currentValue = select.value;
  const classes = [...new Set(studentUserAccounts.map(account => {
    const student = findStudentByAdmissionNo(account.admissionNo) || {};
    return splitStudentClassSection(account.klass || student.klass || "").klass;
  }).filter(Boolean))].sort((a, b) => a.localeCompare(b, undefined, {numeric: true}));
  select.innerHTML = `<option value="">All Classes</option>${classes.map(klass => `<option value="${escapeHtml(klass)}">${escapeHtml(klass)}</option>`).join("")}`;
  if (currentValue && classes.includes(currentValue)) select.value = currentValue;
}

function renderStudentUserRows() {
  const rows = document.getElementById("studentUserRows");
  const summary = document.getElementById("studentUserSummary");
  if (!rows) return;
  normalizeStudentUserLoginIds();
  renderStudentUserFilterOptions();
  const selectedClass = document.getElementById("studentUserClassFilter")?.value || "";
  const search = String(document.getElementById("studentUserSearch")?.value || "").trim().toLowerCase();
  const filteredAccounts = studentUserAccounts
    .map((account, index) => ({account, index}))
    .filter(({account}) => {
      const student = findStudentByAdmissionNo(account.admissionNo) || {};
      const classInfo = splitStudentClassSection(account.klass || student.klass || "");
      const loginId = getStudentLoginIdFromAdmissionNo(account.admissionNo);
      const matchesClass = !selectedClass || classInfo.klass === selectedClass;
      const haystack = [
        account.studentName,
        student.name,
        account.admissionNo,
        loginId,
        account.password,
        account.klass,
        student.klass
      ].join(" ").toLowerCase();
      return matchesClass && (!search || haystack.includes(search));
    });
  rows.innerHTML = filteredAccounts.map(({account, index}) => {
    const student = findStudentByAdmissionNo(account.admissionNo) || {};
    const loginId = getStudentLoginIdFromAdmissionNo(account.admissionNo);
    const permissions = getStudentUserPermissionValues(account);
    return `
      <tr>
        <td><strong>${escapeHtml(account.studentName || student.name || "-")}</strong></td>
        <td>${escapeHtml(account.admissionNo || "-")}</td>
        <td>${escapeHtml(account.klass || student.klass || "-")}</td>
        <td>${escapeHtml(loginId || account.loginId || "-")}</td>
        <td>${escapeHtml(account.password || "-")}</td>
        <td>${permissions.map(item => `<span class="fee-chip">${escapeHtml(item)}</span>`).join("") || "-"}</td>
        <td><span class="status-pill ${account.status === "Active" ? "stable" : "pending"}">${escapeHtml(account.status || "Active")}</span></td>
        <td>
          <div class="row-actions">
            <button class="icon-action edit" type="button" data-edit-student-user="${index}" title="Edit student user" aria-label="Edit student user">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20h4.7L19.3 9.4a2.1 2.1 0 0 0 0-3L17.6 4.7a2.1 2.1 0 0 0-3 0L4 15.3V20Zm3.8-2H6v-1.8l8.5-8.5 1.8 1.8L7.8 18Zm7.9-11.5.4-.4 1.8 1.8-.4.4-1.8-1.8Z"/></svg>
            </button>
            <button class="icon-action" type="button" data-toggle-student-user="${index}" title="${account.status === "Active" ? "Disable" : "Enable"} student user" aria-label="${account.status === "Active" ? "Disable" : "Enable"} student user">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 22a10 10 0 1 1 0-20 10 10 0 0 1 0 20Zm0-2a8 8 0 0 0 6.3-12.9L7.1 18.3A8 8 0 0 0 12 20Zm-6.3-3.1L16.9 5.7A8 8 0 0 0 5.7 16.9Z"/></svg>
            </button>
            <button class="icon-action delete" type="button" data-delete-student-user="${index}" title="Delete student user" aria-label="Delete student user">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 21c-.6 0-1.1-.2-1.5-.6S5 19.5 5 19V8H4V6h5V4h6v2h5v2h-1v11c0 .6-.2 1.1-.6 1.5s-.9.6-1.5.6H7ZM17 8H7v11h10V8Zm-8 9h2v-7H9v7Zm4 0h2v-7h-2v7Z"/></svg>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join("") || `<tr><td colspan="8">No student user saved yet.</td></tr>`;
  if (summary) summary.textContent = `${filteredAccounts.length} of ${studentUserAccounts.length} student users`;
}

function formatDateTimeLabel(value) {
  const date = value ? new Date(value) : null;
  if (!date || Number.isNaN(date.getTime())) return "-";
  return `${formatDateDDMMYYYY(date)} ${date.toLocaleTimeString("en-IN", {hour: "2-digit", minute: "2-digit"})}`;
}

function formatUsageDuration(totalSeconds = 0) {
  const seconds = Math.max(0, Math.round(Number(totalSeconds) || 0));
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (hours) return `${hours}h ${minutes}m`;
  if (minutes) return `${minutes}m`;
  return `${seconds}s`;
}

function getMobileActivityStatus(activity = {}) {
  if (activity.status === "Active") {
    const lastSeen = Date.parse(activity.lastSeenAt || activity.lastOpenedAt || "");
    if (Number.isFinite(lastSeen) && Date.now() - lastSeen <= 5 * 60 * 1000) return "Active";
    return "Idle";
  }
  return activity.status || "Closed";
}

function renderMobileActivityClassFilter() {
  const select = document.getElementById("mobileActivityClassFilter");
  if (!select) return;
  const currentValue = select.value;
  const classes = [...new Set(mobileAppActivity.map(activity => {
    const student = findStudentByAdmissionNo(activity.admissionNo) || {};
    return splitStudentClassSection(activity.klass || activity.className || student.klass || "").klass;
  }).filter(Boolean))].sort((a, b) => a.localeCompare(b, undefined, {numeric: true}));
  select.innerHTML = `<option value="">All Classes</option>${classes.map(klass => `<option value="${escapeHtml(klass)}">${escapeHtml(klass)}</option>`).join("")}`;
  if (currentValue && classes.includes(currentValue)) select.value = currentValue;
}

function renderMobileAppActivity() {
  const rows = document.getElementById("mobileActivityRows");
  const summary = document.getElementById("mobileActivitySummary");
  if (!rows) return;
  renderMobileActivityClassFilter();
  const selectedClass = document.getElementById("mobileActivityClassFilter")?.value || "";
  const selectedStatus = document.getElementById("mobileActivityStatusFilter")?.value || "";
  const search = String(document.getElementById("mobileActivitySearch")?.value || "").trim().toLowerCase();
  const filtered = mobileAppActivity
    .map(activity => {
      const student = findStudentByAdmissionNo(activity.admissionNo) || {};
      const classInfo = splitStudentClassSection(activity.klass || activity.className || student.klass || "");
      return {activity, student, classInfo, status: getMobileActivityStatus(activity)};
    })
    .filter(({activity, student, classInfo, status}) => {
      const statusGroup = status === "Active" ? "Active" : "Closed";
      const haystack = [
        activity.studentName,
        student.name,
        activity.admissionNo,
        activity.loginId,
        activity.klass,
        student.klass
      ].join(" ").toLowerCase();
      return (!selectedClass || classInfo.klass === selectedClass)
        && (!selectedStatus || statusGroup === selectedStatus)
        && (!search || haystack.includes(search));
    })
    .sort((a, b) => Date.parse(b.activity.lastSeenAt || b.activity.lastOpenedAt || "") - Date.parse(a.activity.lastSeenAt || a.activity.lastOpenedAt || ""));
  rows.innerHTML = filtered.map(({activity, student, status}) => {
    const statusClass = status === "Active" ? "stable" : status === "Idle" ? "watch" : "pending";
    return `
      <tr>
        <td><strong>${escapeHtml(activity.studentName || student.name || "-")}</strong></td>
        <td>${escapeHtml(activity.admissionNo || "-")}</td>
        <td>${escapeHtml(activity.klass || activity.className || student.klass || "-")}</td>
        <td>${escapeHtml(activity.loginId || "-")}</td>
        <td>${formatDateTimeLabel(activity.lastOpenedAt)}</td>
        <td>${formatDateTimeLabel(activity.lastSeenAt)}</td>
        <td>${formatUsageDuration(activity.totalSeconds)}</td>
        <td><span class="status-pill ${statusClass}">${escapeHtml(status)}</span></td>
      </tr>
    `;
  }).join("") || `<tr><td colspan="8">No mobile app activity yet.</td></tr>`;
  const activeCount = mobileAppActivity.filter(activity => getMobileActivityStatus(activity) === "Active").length;
  if (summary) summary.textContent = `${activeCount} active | ${mobileAppActivity.length} total`;
}

function renderUserAccessSettings() {
  renderSchoolSelectOptions(document.getElementById("accessUserSchoolSelect"));
  renderAccessRoleOptions();
  renderAccessStaffOptions();
  const selectedRole = document.getElementById("accessPermissionRole")?.value || roles[0]?.name || "";
  const permissionRole = document.getElementById("accessPermissionRole");
  if (permissionRole && !permissionRole.value && selectedRole) permissionRole.value = selectedRole;
  renderPermissionRows(document.getElementById("accessPermissionRole")?.value || "");
  renderUserAccessRows();
  renderStudentAppGlobalControls();
}

function getMasterAdminAccount() {
  return userAccessAccounts.find(account => isProtectedRoleName(account.role) && String(account.role || "").trim().toLowerCase() === "master admin")
    || userAccessAccounts.find(account => isProtectedRoleName(account.role));
}

function renderMasterAdminSettings() {
  ensureProtectedRoles();
  const account = getMasterAdminAccount();
  if (masterAdminForm) {
    masterAdminForm.elements.loginId.value = account?.loginId || "masteradmin";
    masterAdminForm.elements.password.value = account?.password || "";
  }
  const status = document.getElementById("masterAdminStatus");
  if (status) {
    status.innerHTML = account
      ? `<strong>Master Admin ready.</strong><br>Login ID: ${escapeHtml(account.loginId || "-")} | Status: Active | Full access locked.`
      : `<strong>Master Admin not saved yet.</strong><br>Set a login ID and password, then save.`;
  }
}

function normalizeSchoolId(value = "") {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "anps";
}

function ensureDefaultSchool() {
  if (!schools.some(school => normalizeSchoolId(school.school_id || school.id) === "anps")) {
    schools.unshift({
      id: "anps",
      school_id: "anps",
      name: "Alfred Nobel Public School",
      status: "Active",
      plan: "Single School"
    });
  }
}

function renderSchoolSelectOptions(select, selectedId = "anps") {
  if (!select) return;
  ensureDefaultSchool();
  const selected = normalizeSchoolId(selectedId || activeSchoolId || "anps");
  select.innerHTML = schools
    .filter(school => String(school.status || "Active") !== "Disabled")
    .map(school => {
      const schoolId = normalizeSchoolId(school.school_id || school.id);
      return `<option value="${escapeHtml(schoolId)}">${escapeHtml(school.name || schoolId)}</option>`;
    })
    .join("");
  setSelectValue(select, selected);
}

async function loadSchoolsFromBackend() {
  try {
    const response = await backendFetch(`/api/schools?v=${Date.now()}`, {headers: backendHeaders(), cache: "no-store"});
    const result = await response.json().catch(() => ({}));
    if (response.ok && Array.isArray(result.schools)) {
      schools.splice(0, schools.length, ...result.schools.map(school => ({
        id: normalizeSchoolId(school.school_id || school.id),
        school_id: normalizeSchoolId(school.school_id || school.id),
        name: school.name || school.schoolName || "School",
        status: school.status || "Active",
        plan: school.plan || "School Tenant",
        created_at: school.created_at || school.createdAt || ""
      })));
      ensureDefaultSchool();
      renderSchoolManagement(false);
      renderSchoolSelectOptions(document.getElementById("accessUserSchoolSelect"));
    }
  } catch (error) {
    console.warn("Could not load school registry.", error);
  }
}

function renderSchoolManagement(shouldRefreshBackend = true) {
  ensureDefaultSchool();
  const rows = document.getElementById("schoolManagementRows");
  const summary = document.getElementById("schoolManagementSummary");
  if (summary) {
    const activeCount = schools.filter(school => String(school.status || "Active") === "Active").length;
    summary.textContent = `${activeCount} active | ${schools.length} schools`;
  }
  if (rows) {
    rows.innerHTML = schools.map((school, index) => `
      <tr>
        <td><strong>${escapeHtml(school.school_id || school.id || "-")}</strong></td>
        <td>${escapeHtml(school.name || "-")}</td>
        <td>${escapeHtml(school.plan || "School Tenant")}</td>
        <td><span class="status-pill ${String(school.status || "Active") === "Active" ? "stable" : "pending"}">${escapeHtml(school.status || "Active")}</span></td>
        <td><button class="mini" type="button" data-edit-school="${index}">Edit</button></td>
      </tr>
    `).join("") || `<tr><td colspan="5">No schools saved yet.</td></tr>`;
  }
  if (shouldRefreshBackend && backendSyncReady) loadSchoolsFromBackend();
}

async function saveSchoolManagementForm(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const data = new FormData(form);
  const schoolId = normalizeSchoolId(data.get("schoolId"));
  const school = {
    id: schoolId,
    school_id: schoolId,
    schoolId,
    name: String(data.get("schoolName") || "").trim(),
    plan: String(data.get("plan") || "School Tenant"),
    status: String(data.get("status") || "Active"),
    createdAt: new Date().toISOString()
  };
  if (!school.name) {
    showToast("School name required.");
    return;
  }
  const existingIndex = schools.findIndex(item => normalizeSchoolId(item.school_id || item.id) === schoolId);
  if (existingIndex >= 0) schools[existingIndex] = {...schools[existingIndex], ...school};
  else schools.unshift(school);
  editingSchoolIndex = -1;
  form.reset();
  form.querySelector("button[type='submit']").textContent = "Save School";
  renderSchoolManagement(false);
  renderSchoolSelectOptions(document.getElementById("accessUserSchoolSelect"));
  saveAppState();
  try {
    const response = await backendFetch("/api/schools", {
      method: "POST",
      headers: backendHeaders({"Content-Type": "application/json"}),
      body: JSON.stringify(school)
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok || !result.ok) throw new Error(result.error || "School save failed");
    if (Array.isArray(result.schools)) {
      schools.splice(0, schools.length, ...result.schools.map(item => ({
        id: normalizeSchoolId(item.school_id || item.id),
        school_id: normalizeSchoolId(item.school_id || item.id),
        name: item.name || "School",
        plan: item.plan || "School Tenant",
        status: item.status || "Active",
        created_at: item.created_at || ""
      })));
    }
    renderSchoolManagement(false);
    renderSchoolSelectOptions(document.getElementById("accessUserSchoolSelect"));
    document.getElementById("schoolManagementOutput").innerHTML = `<strong>${escapeHtml(school.name)} saved.</strong><br>School ID: ${escapeHtml(school.school_id)} | Status: ${escapeHtml(school.status)}`;
    showToast(`${school.name} school saved.`);
  } catch (error) {
    document.getElementById("schoolManagementOutput").innerHTML = `<strong>Saved locally.</strong><br>Backend school registry sync pending.`;
    console.warn("School backend save failed.", error);
  }
}

function renderStudentUserLogin() {
  renderStudentUserOptions();
  renderStudentUserRows();
}

function resetUserAccessForm() {
  editingUserAccessIndex = -1;
  if (userAccessForm) {
    userAccessForm.reset();
    renderSchoolSelectOptions(userAccessForm.elements.schoolId, activeSchoolId || "anps");
    userAccessForm.querySelector("button[type='submit']").textContent = "Save User Login";
  }
}

function resetStudentUserForm() {
  editingStudentUserIndex = -1;
  if (studentUserAccessForm) {
    studentUserAccessForm.reset();
    studentUserAccessForm.querySelectorAll("[name='appPermissions']").forEach(input => {
      input.checked = true;
    });
    studentUserAccessForm.querySelector("button[type='submit']").textContent = "Save Student User";
  }
}

function setHrSetupPanel(panelId) {
  ["departmentSetupPanel", "roleSetupPanel", "designationSetupPanel"].forEach(id => {
    const panel = document.getElementById(id);
    if (panel) panel.hidden = id !== panelId;
  });
}

function getStaffByIdOrName(staffId = "", staffName = "") {
  const cleanId = String(staffId || "").trim().toLowerCase();
  const cleanName = String(staffName || "").trim().toLowerCase();
  return staffMembers.find(staff => String(staff.staffId || "").trim().toLowerCase() === cleanId)
    || staffMembers.find(staff => String(staff.name || "").trim().toLowerCase() === cleanName)
    || null;
}

function getStaffAttendanceStatus(record) {
  if (record.status) return record.status;
  if (!record.inTime) return "Absent";
  const [hour = 0, minute = 0] = String(record.inTime).split(":").map(Number);
  return hour > 10 || (hour === 10 && minute > 15) ? "Late" : "Present";
}

function renderStaffAttendance() {
  const rows = document.getElementById("staffAttendanceRows");
  if (!rows) return;
  const selectedDate = document.getElementById("staffAttendanceDate")?.value || "";
  const visibleRecords = selectedDate
    ? staffAttendanceRecords.filter(record => record.date === selectedDate)
    : staffAttendanceRecords;
  const present = visibleRecords.filter(record => getStaffAttendanceStatus(record) === "Present").length;
  const late = visibleRecords.filter(record => getStaffAttendanceStatus(record) === "Late").length;
  const absent = visibleRecords.filter(record => getStaffAttendanceStatus(record) === "Absent").length;
  const presentCount = document.getElementById("staffPresentCount");
  const lateCount = document.getElementById("staffLateCount");
  const absentCount = document.getElementById("staffAbsentCount");
  const totalCount = document.getElementById("staffAttendanceCount");
  if (presentCount) presentCount.textContent = present;
  if (lateCount) lateCount.textContent = late;
  if (absentCount) absentCount.textContent = absent;
  if (totalCount) totalCount.textContent = visibleRecords.length;
  rows.innerHTML = visibleRecords.map(record => {
    const staff = getStaffByIdOrName(record.staffId, record.staffName);
    const status = getStaffAttendanceStatus(record);
    return `
      <tr>
        <td>${escapeHtml(record.date || "-")}</td>
        <td>${escapeHtml(record.staffId || staff?.staffId || "-")}</td>
        <td><strong>${escapeHtml(record.staffName || staff?.name || "-")}</strong></td>
        <td>${escapeHtml(record.department || staff?.department || "-")}</td>
        <td>${escapeHtml(record.designation || staff?.designation || "-")}</td>
        <td>${escapeHtml(record.inTime || "-")}</td>
        <td>${escapeHtml(record.outTime || "-")}</td>
        <td>${escapeHtml(record.deviceId || "-")}</td>
        <td><span class="badge ${status === "Absent" ? "red" : status === "Late" ? "amber" : "green"}">${escapeHtml(status)}</span></td>
      </tr>
    `;
  }).join("") || `<tr><td colspan="9">No biometric staff attendance imported yet.</td></tr>`;
}

function renderLeaveApprovalRequests() {
  const rows = document.getElementById("leaveApprovalRows");
  if (!rows) return;
  if (!teacherLeaves.length) {
    rows.innerHTML = `<tr><td colspan="7">No leave requests entered yet.</td></tr>`;
    return;
  }
  rows.innerHTML = teacherLeaves.map((leave, index) => {
    const staff = getStaffByIdOrName(leave.teacherId || leave.staffId, leave.teacherName || leave.staffName);
    const status = String(leave.status || "Pending");
    const badgeClass = status === "Approved" ? "green" : status === "Rejected" ? "red" : "amber";
    const staffName = leave.teacherName || leave.staffName || staff?.name || leave.teacherId || "Teacher";
    const staffMeta = [leave.teacherId || leave.staffId || staff?.staffId, staff?.designation || staff?.role].filter(Boolean).join(" | ");
    const disabled = status !== "Pending" ? "disabled" : "";
    const reviewNote = leave.rejectionReason ? `<br><small>Reject reason: ${escapeHtml(leave.rejectionReason)}</small>` : "";
    const leaveKey = escapeHtml(leave.id || "");
    return `
      <tr data-leave-row="${index}">
        <td><strong>${escapeHtml(staffName)}</strong><br><small>${escapeHtml(staffMeta || "Teacher App")}</small></td>
        <td>${escapeHtml(leave.type || "Leave")}</td>
        <td>${escapeHtml(leave.from || "-")} to ${escapeHtml(leave.to || "-")}</td>
        <td>${escapeHtml(leave.reason || "-")}</td>
        <td>${getLeaveAttachmentLink(leave.attachment)}</td>
        <td><span class="badge ${badgeClass}">${escapeHtml(status)}</span>${reviewNote}</td>
        <td class="table-actions">
          <button class="ghost-action mini" type="button" data-approve-leave="${leaveKey}" data-leave-index="${index}" ${disabled}>Approve</button>
          <button class="ghost-action mini" type="button" data-reject-leave="${leaveKey}" data-leave-index="${index}" ${disabled}>Reject</button>
          ${status === "Pending" ? `<input class="mini-input leave-reject-note" type="text" placeholder="Reject reason" />` : ""}
        </td>
      </tr>
    `;
  }).join("");
}

function renderStaffBiometricDevice() {
  const device = document.getElementById("staffAttendanceDevice");
  const model = document.getElementById("staffAttendanceDeviceModel");
  const note = document.getElementById("staffAttendanceDeviceNote");
  const source = document.getElementById("staffAttendanceSource");
  if (device) device.value = staffBiometricDevice.device || "";
  if (model) model.value = staffBiometricDevice.model || "";
  if (note) note.value = staffBiometricDevice.note || "";
  if (source) source.value = staffBiometricDevice.source || "CSV Import";
}

function saveStaffBiometricDevice() {
  staffBiometricDevice.device = document.getElementById("staffAttendanceDevice")?.value || "";
  staffBiometricDevice.model = document.getElementById("staffAttendanceDeviceModel")?.value || "";
  staffBiometricDevice.note = document.getElementById("staffAttendanceDeviceNote")?.value || "";
  staffBiometricDevice.source = document.getElementById("staffAttendanceSource")?.value || "CSV Import";
  saveAppState();
}

function getNextStaffId() {
  const maxSerial = staffMembers.reduce((max, staff) => {
    const match = String(staff.staffId || "").match(/(\d+)$/);
    return match ? Math.max(max, Number(match[1])) : max;
  }, 0);
  return `ANPS-STF-${String(maxSerial + 1).padStart(3, "0")}`;
}

function setNextStaffId() {
  if (!staffDetailsForm) return;
  staffDetailsForm.elements.staffId.value = getNextStaffId();
  staffDetailsForm.querySelector("button[type='submit']").textContent = "Add Staff";
}

function isTeacherDesignation(value = "") {
  return String(value || "").trim().toLowerCase() === "teacher";
}

function renderStaffTeachingSubjectField() {
  const field = document.getElementById("staffTeachingSubjectField");
  const subjectSelect = staffDetailsForm?.elements.teachingSubject;
  if (subjectSelect) {
    const currentValue = subjectSelect.value;
    subjectSelect.innerHTML = `<option value="">Select Subject</option>` + getSubjectOptions()
      .map(subject => `<option value="${escapeHtml(subject)}">${escapeHtml(subject)}</option>`)
      .join("");
    if (currentValue) setSelectValue(subjectSelect, currentValue);
  }
  if (!field || !staffDetailsForm) return;
  const isTeacher = isTeacherDesignation(staffDetailsForm.elements.designation?.value || "");
  field.hidden = !isTeacher;
  if (!isTeacher) staffDetailsForm.elements.teachingSubject.value = "";
}

function getSessionYears() {
  const [start, end] = String(activeSession || "").split("-");
  const startYear = Number(start) || new Date().getFullYear();
  const endYear = end && end.length === 2 ? Number(`${String(startYear).slice(0, 2)}${end}`) : startYear + 1;
  return {startYear, endYear};
}

function getAcademicMonthDate(month, day) {
  const {startYear, endYear} = getSessionYears();
  const index = ACADEMIC_MONTHS.indexOf(month);
  const year = index >= 0 && index <= 8 ? startYear : endYear;
  const calendarMonth = {
    Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8,
    Oct: 9, Nov: 10, Dec: 11, Jan: 0, Feb: 1, Mar: 2
  }[month];
  return new Date(year, calendarMonth, day);
}

function getFineDays(fromDate, toDate) {
  if (toDate < fromDate) return 0;
  const dayMs = 24 * 60 * 60 * 1000;
  const start = new Date(fromDate.getFullYear(), fromDate.getMonth(), fromDate.getDate());
  const end = new Date(toDate.getFullYear(), toDate.getMonth(), toDate.getDate());
  return Math.floor((end - start) / dayMs) + 1;
}

function getAcademicMonthIndexForDate(dateValue = new Date()) {
  const date = parseDateDDMMYYYY(dateValue);
  const {startYear} = getSessionYears();
  return ((date.getFullYear() - startYear) * 12) + (date.getMonth() - 3);
}

function calculateTuitionFineForMonth(month, paymentDateValue = new Date()) {
  const dueMonthIndex = ACADEMIC_MONTHS.indexOf(month);
  if (dueMonthIndex < 0) return 0;
  const paymentDate = parseDateDDMMYYYY(paymentDateValue);
  const monthStart = getAcademicMonthDate(month, 1);
  const noFineTill = getAcademicMonthDate(month, 15);
  const fineStart = getAcademicMonthDate(month, 16);
  const monthEnd = new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 0);
  if (paymentDate <= noFineTill) return 0;
  const dueMonthFineEnd = paymentDate <= monthEnd ? paymentDate : monthEnd;
  const dueMonthFine = getFineDays(fineStart, dueMonthFineEnd) * Number(tuitionFineSetup.dailyRate || 0);
  if (paymentDate <= monthEnd) return dueMonthFine;
  const monthGap = getAcademicMonthIndexForDate(paymentDate) - dueMonthIndex;
  if (monthGap <= 0) return dueMonthFine;
  let fine = dueMonthFine + Number(tuitionFineSetup.nextMonth || 0);
  if (monthGap >= 2) fine += Number(tuitionFineSetup.secondMonth || 0);
  if (monthGap >= 3) fine += (monthGap - 2) * Number(tuitionFineSetup.laterMonth || 0);
  return fine;
}

function calculateTransportFineForMonth(month, paymentDateValue = new Date()) {
  const dueMonthIndex = ACADEMIC_MONTHS.indexOf(month);
  if (dueMonthIndex < 0) return 0;
  const paymentDate = parseDateDDMMYYYY(paymentDateValue);
  const noFineTill = getAcademicMonthDate(month, 15);
  const monthEnd = new Date(getAcademicMonthDate(month, 1).getFullYear(), getAcademicMonthDate(month, 1).getMonth() + 1, 0);
  if (paymentDate <= noFineTill) return 0;
  let fine = Number(transportFineSetup.sameMonth || 0);
  if (paymentDate <= monthEnd) return fine;
  const monthGap = getAcademicMonthIndexForDate(paymentDate) - dueMonthIndex;
  if (monthGap >= 1) fine += Number(transportFineSetup.nextMonth || 0);
  if (monthGap >= 2) fine += Number(transportFineSetup.secondMonth || 0);
  if (monthGap >= 3) fine += (monthGap - 2) * Number(transportFineSetup.laterMonth || 0);
  return fine;
}

function getLateFineHeadForFee(feeHead = "") {
  if (feeHead === "Transport Fees") return "Transport Late Fine";
  return "Tuition Late Fine";
}

function normalizePaymentFeeHead(head = "") {
  const clean = String(head || "").trim().replace(/\s+/g, " ");
  const normalized = clean.toLowerCase();
  if (["tuition fee", "tuition fees"].includes(normalized)) return "Tuition Fee";
  if (["transport fee", "transport fees"].includes(normalized)) return "Transport Fees";
  if (["tuition late fine", "tuition fine", "late fine tuition"].includes(normalized)) return "Tuition Late Fine";
  if (["transport late fine", "transport fine", "late fine transport"].includes(normalized)) return "Transport Late Fine";
  return clean;
}

function normalizePaymentMonth(month = "") {
  const clean = String(month || "").trim();
  if (!clean) return "";
  if (ACADEMIC_MONTHS.includes(clean)) return clean;
  const normalized = clean.toLowerCase().slice(0, 3);
  return ACADEMIC_MONTHS.find(item => item.toLowerCase() === normalized) || "";
}

function allocationMatchesHead(allocation = {}, feeHead = "") {
  const normalizedHead = normalizePaymentFeeHead(allocation.head);
  return getFeeHeadMatchingHeads(feeHead).map(normalizePaymentFeeHead).includes(normalizedHead);
}

function allocationMatchesMonth(allocation = {}, month = "") {
  return normalizePaymentMonth(allocation.month) === normalizePaymentMonth(month);
}

function getFeeHeadMatchingHeads(feeHead = "") {
  if (feeHead === "Tuition Fee") return ["Tuition Fee", "Tuition Late Fine"];
  if (feeHead === "Transport Fees") return ["Transport Fees", "Transport Late Fine"];
  return [feeHead];
}

function getTuitionSearchDueRow(student) {
  const monthlyFee = Number(student.tuitionFee || 0);
  if (!monthlyFee) return null;
  const today = new Date();
  const row = {name: "Tuition Fee", monthlyAmount: monthlyFee, months: getSelectedMonths(student, "feeMonths")};
  const dueMonths = getSelectedMonths(student, "feeMonths").filter(month => getAcademicMonthDate(month, 1) <= today);
  if (!dueMonths.length) return null;
  const monthDetails = dueMonths.map(month => {
    const fine = calculateTuitionFineForMonth(month, new Date());
    const paid = getTuitionMonthPaidInfo(student, row, month);
    const tuitionDue = Math.max(monthlyFee - paid.tuition, 0);
    const fineDue = shouldWaiveRepeatFineAfterFinePaid({...paid, monthlyAmount: monthlyFee}, "tuition", monthlyFee, student.admissionNo, month)
      ? 0
      : Math.max(fine - paid.fine, 0);
    return {month, tuition: tuitionDue, fine: fineDue, total: tuitionDue + fineDue};
  }).filter(item => item.total > 0);
  const due = monthDetails.reduce((sum, item) => sum + item.tuition, 0);
  const fineDue = monthDetails.reduce((sum, item) => sum + item.fine, 0);
  if (!monthDetails.length) return null;
  const dueMonthNames = monthDetails.map(item => item.month);
  return {
    name: "Tuition Fee",
    period: fineDue > 0 ? `${formatMonthPeriod(dueMonthNames)} + Fine ${formatRs(fineDue)}` : formatMonthPeriod(dueMonthNames),
    due: due + fineDue,
    fine: fineDue,
    details: monthDetails
  };
}

function renderPeriodCell(row, student = {}) {
  if (!row.details || !row.details.length) {
    return `<span class="fee-period">${row.period}</span>`;
  }
  return `
    <details class="period-details">
      <summary><span class="fee-period">${row.period}</span></summary>
      <div class="period-breakdown">
        <div class="period-breakdown-head"><span>Month</span><span>Amount</span><span>Fine</span><span>Total</span><span></span></div>
        ${row.details.map(item => {
          const amount = item.amount ?? item.tuition ?? 0;
          const fine = item.fine || 0;
          const total = item.total ?? (amount + fine);
          return `
          <div class="period-breakdown-row">
            <span>${item.month}</span>
            <span>${formatRs(amount)}</span>
            <span>${formatRs(fine)}</span>
            <span>${formatRs(total)}</span>
            <button class="month-collect-action" type="button" data-student-fees="${student.admissionNo || ""}" data-due-amount="${total}" data-fee-head="${row.name}" data-fine-amount="${fine}" data-fee-month="${item.month}" title="Collect ${item.month}" aria-label="Collect ${item.month} ${row.name} for ${student.name || "student"}">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6.5C4 5.1 5.1 4 6.5 4h11C18.9 4 20 5.1 20 6.5v11c0 1.4-1.1 2.5-2.5 2.5h-11C5.1 20 4 18.9 4 17.5v-11ZM6.5 6a.5.5 0 0 0-.5.5V8h12V6.5a.5.5 0 0 0-.5-.5h-11ZM6 10v7.5c0 .3.2.5.5.5h11c.3 0 .5-.2.5-.5V10H6Zm6.8 6.7h-1.6v-1.1c-1-.2-1.8-.8-2.2-1.6l1.5-.8c.3.5.8.8 1.6.8.7 0 1-.2 1-.6s-.4-.5-1.4-.8c-1.4-.4-2.4-.9-2.4-2.2 0-1.1.8-1.9 1.9-2.1V7.3h1.6v1c.8.2 1.5.7 1.9 1.5l-1.4.8c-.3-.5-.7-.7-1.2-.7-.6 0-.9.2-.9.5 0 .4.4.5 1.4.8 1.4.4 2.4.9 2.4 2.2 0 1.2-.8 2-2.2 2.2v1.1Z"/></svg>
              <span>Pay</span>
            </button>
          </div>
        `;
        }).join("")}
      </div>
    </details>
  `;
}

function getDueFeesSelectedMonth() {
  return document.getElementById("dueFeesMonthFilter")?.value || "";
}

function normalizeDueSearchText(value = "") {
  return String(value || "").toLowerCase().replace(/[^a-z0-9]/g, "");
}

function dueFeesStudentMatchesSearch(student, query = "") {
  const rawQuery = String(query || "").trim().toLowerCase();
  const compactQuery = normalizeDueSearchText(rawQuery);
  if (!rawQuery && !compactQuery) return true;
  const admissionNo = String(student.admissionNo || "");
  const compactAdmission = normalizeDueSearchText(admissionNo);
  const nameParts = String(student.name || "").toLowerCase().split(/\s+/).filter(Boolean);
  const fields = [
    student.admissionNo,
    student.name,
    nameParts[nameParts.length - 1] || "",
    student.villageTown,
    student.guardian,
    student.fatherName,
    student.motherName,
    student.mobile,
    student.fatherMobile,
    student.motherMobile
  ];
  const rawMatch = fields.some(field => String(field || "").toLowerCase().includes(rawQuery));
  const compactMatch = fields.some(field => normalizeDueSearchText(field).includes(compactQuery));
  const admissionLastMatch = compactQuery && compactAdmission.endsWith(compactQuery);
  return rawMatch || compactMatch || admissionLastMatch;
}

function getSearchDueMonthDetails(student, row, selectedMonth = "") {
  const monthCutoff = selectedMonth ? ACADEMIC_MONTHS.indexOf(selectedMonth) : -1;
  const today = new Date();
  const paidMonths = getPaidLedgerMonths(student, row);
  return (row.months || [])
    .filter(month => {
      const monthIndex = ACADEMIC_MONTHS.indexOf(month);
      if (selectedMonth) return monthIndex >= 0 && monthIndex <= monthCutoff;
      return getAcademicMonthDate(month, 1) <= today;
    })
    .map(month => {
      if (row.name === "Tuition Fee") {
        const paid = getTuitionMonthPaidInfo(student, row, month);
        const amount = Math.max(Number(row.monthlyAmount || 0) - paid.tuition, 0);
        const fineDue = getTuitionMonthFineDue(student, row, month);
        return {month, amount, fine: fineDue, total: amount + fineDue};
      }
      if (row.name === "Transport Fees") {
        const paid = getTransportMonthPaidInfo(student, row, month);
        const amount = Math.max(Number(row.monthlyAmount || 0) - Number(paid.transport || 0), 0);
        const fineDue = getTransportMonthFineDue(student, row, month);
        return {month, amount, fine: fineDue, total: amount + fineDue};
      }
      return paidMonths.has(month) ? null : {month, amount: Number(row.monthlyAmount || 0), fine: 0, total: Number(row.monthlyAmount || 0)};
    })
    .filter(item => item && item.total > 0);
}

function getSearchDueMonthItem(student, row, month) {
  if (!Array.isArray(row.months) || !row.months.includes(month)) return null;
  if (getAcademicMonthDate(month, 1) > new Date()) return null;
  const paidMonths = getPaidLedgerMonths(student, row);
  if (row.name === "Tuition Fee") {
    const paid = getTuitionMonthPaidInfo(student, row, month);
    const amount = Math.max(Number(row.monthlyAmount || 0) - paid.tuition, 0);
    const fineDue = getTuitionMonthFineDue(student, row, month);
    return amount + fineDue > 0 ? {month, amount, fine: fineDue, total: amount + fineDue} : null;
  }
  if (row.name === "Transport Fees") {
    const paid = getTransportMonthPaidInfo(student, row, month);
    const amount = Math.max(Number(row.monthlyAmount || 0) - Number(paid.transport || 0), 0);
    const fineDue = getTransportMonthFineDue(student, row, month);
    return amount + fineDue > 0 ? {month, amount, fine: fineDue, total: amount + fineDue} : null;
  }
  if (paidMonths.has(month)) return null;
  const amount = Number(row.monthlyAmount || 0);
  return amount > 0 ? {month, amount, fine: 0, total: amount} : null;
}

function getDueFeesStudentClassSections() {
  const classes = new Set(getAdmissionClassOptions());
  const sections = new Set(getAdmissionSectionOptions());
  const sectionsByClass = new Map();
  getActiveStudents().forEach(student => {
    const {klass, section} = splitStudentClassSection(student.klass || "");
    if (klass) classes.add(klass);
    if (section) sections.add(section);
    if (klass) {
      if (!sectionsByClass.has(klass)) sectionsByClass.set(klass, new Set());
      if (section) sectionsByClass.get(klass).add(section);
    }
  });
  return {
    classes: [...classes].filter(Boolean).sort((a, b) => a.localeCompare(b, undefined, {numeric: true})),
    sections: [...sections].filter(Boolean).sort((a, b) => a.localeCompare(b, undefined, {numeric: true})),
    sectionsByClass
  };
}

function renderDueFeesFilterOptions() {
  const classSelect = document.getElementById("dueFeesClassFilter");
  const sectionSelect = document.getElementById("dueFeesSectionFilter");
  if (!classSelect && !sectionSelect) return {selectedClass: "", selectedSection: "", selectedStatus: ""};
  const currentClass = String(classSelect?.value || "").trim();
  const currentSection = String(sectionSelect?.value || "").trim();
  const {classes, sections, sectionsByClass} = getDueFeesStudentClassSections();
  const selectedClass = classes.includes(currentClass) ? currentClass : "";
  const visibleSections = selectedClass
    ? [...(sectionsByClass.get(selectedClass) || new Set())].sort((a, b) => a.localeCompare(b, undefined, {numeric: true}))
    : sections;
  const selectedSection = visibleSections.includes(currentSection) ? currentSection : "";
  if (classSelect) {
    classSelect.innerHTML = `<option value="">All Classes</option>${classes.map(className => `<option value="${escapeHtml(className)}">${escapeHtml(className)}</option>`).join("")}`;
    classSelect.value = selectedClass;
  }
  if (sectionSelect) {
    sectionSelect.innerHTML = `<option value="">All Sections</option>${visibleSections.map(section => `<option value="${escapeHtml(section)}">${escapeHtml(section)}</option>`).join("")}`;
    sectionSelect.value = selectedSection;
  }
  return {
    selectedClass,
    selectedSection,
    selectedStatus: String(document.getElementById("dueFeesStatusFilter")?.value || "").trim()
  };
}

function getDueFeesSearchRows(selectedMonth = "") {
  const query = document.getElementById("dueFeesStudentSearch")?.value || "";
  const selectedClass = String(document.getElementById("dueFeesClassFilter")?.value || "").trim();
  const selectedSection = String(document.getElementById("dueFeesSectionFilter")?.value || "").trim();
  const selectedStatus = String(document.getElementById("dueFeesStatusFilter")?.value || "").trim();
  return getActiveStudents().filter(student => {
    const {klass, section} = splitStudentClassSection(student.klass || "");
    if (selectedClass && klass !== selectedClass) return false;
    if (selectedSection && section !== selectedSection) return false;
    return dueFeesStudentMatchesSearch(student, query);
  }).flatMap(student => {
    if (selectedMonth) {
      return getLedgerRows(student)
        .filter(row => row.due > 0)
        .map(row => {
          if (!Array.isArray(row.months) || !row.months.length) return {student, row};
          const details = getSearchDueMonthDetails(student, row, selectedMonth);
          const due = details.reduce((sum, item) => sum + item.total, 0);
          const fine = details.reduce((sum, item) => sum + item.fine, 0);
          const periodMonths = details.map(item => item.month);
          return details.length ? {student, row: {...row, period: formatMonthPeriod(periodMonths), due, fine, details}} : null;
        })
        .filter(item => {
          if (!item || !selectedStatus) return true;
          return selectedStatus === "fine" ? Number(item.row.fine || 0) > 0 : Number(item.row.fine || 0) <= 0;
        })
        .filter(Boolean);
    }
    return getLedgerRows(student)
      .filter(row => row.due > 0)
      .filter(row => {
        if (!selectedStatus) return true;
        return selectedStatus === "fine" ? Number(row.fine || 0) > 0 : Number(row.fine || 0) <= 0;
      })
      .map(row => ({student, row}));
  });
}

function renderDueFeesMonthOptions() {
  const select = document.getElementById("dueFeesMonthFilter");
  if (!select) return "";
  const previousMonth = select.value;
  const dueMonths = new Set();
  getActiveStudents().forEach(student => {
    getLedgerRows(student).forEach(row => {
      if (!Array.isArray(row.months) || !row.months.length || row.due <= 0) return;
      ACADEMIC_MONTHS.forEach(month => {
        if (getSearchDueMonthItem(student, row, month)) dueMonths.add(month);
      });
    });
  });
  const availableMonths = ACADEMIC_MONTHS.filter(month => dueMonths.has(month));
  select.innerHTML = `<option value="">All Months</option>${availableMonths.map(month => `<option>${month}</option>`).join("")}`;
  select.value = availableMonths.includes(previousMonth) ? previousMonth : "";
  return select.value;
}

function renderDueFeesSearch() {
  renderDueFeesFilterOptions();
  const selectedMonth = renderDueFeesMonthOptions();
  const rows = getDueFeesSearchRows(selectedMonth);
  const dueStudentCount = new Set(rows.map(({student}) => student.admissionNo || student.name || "")).size;
  const countChip = document.getElementById("dueFeesStudentCount");
  if (countChip) {
    countChip.textContent = `Due Students: ${dueStudentCount}`;
  }
  const dueStudentGroups = new Map();
  document.getElementById("dueFeesSearchRows").innerHTML = rows.map(({student, row}) => {
    const studentKey = student.admissionNo || student.name || "";
    const isNewStudentGroup = !dueStudentGroups.has(studentKey);
    if (isNewStudentGroup) dueStudentGroups.set(studentKey, dueStudentGroups.size);
    const tone = dueStudentGroups.get(studentKey) % 4;
    const separatorClass = isNewStudentGroup && dueStudentGroups.get(studentKey) > 0 ? " due-student-separator" : "";
    const actionMonth = Array.isArray(row.details) && row.details.length
      ? (selectedMonth && row.details.some(item => item.month === selectedMonth) ? selectedMonth : row.details[0].month)
      : "";
    const openStudentKey = escapeHtml(student.admissionNo || student.name || "");
    return `
    <tr class="due-student-row due-student-tone-${tone}${separatorClass}">
      <td>${isNewStudentGroup ? `<button class="student-name-link" type="button" data-open-student-details="${openStudentKey}"><strong>${student.admissionNo || "-"}</strong></button>` : `<span class="repeat-student-cell">same student</span>`}</td>
      <td>${isNewStudentGroup ? `<button class="student-name-link" type="button" data-open-fee-book="${openStudentKey}"><strong>${student.name || "-"}</strong></button>` : `<span class="repeat-student-cell">-</span>`}</td>
      <td><strong>${row.name}</strong></td>
      <td>${renderPeriodCell(row, student)}</td>
      <td>${formatRs(row.due)}</td>
      <td><span class="badge amber">Due</span></td>
      <td>
        <button class="icon-action fees" type="button" data-student-fees="${student.admissionNo || ""}" data-due-amount="${row.due}" data-fee-head="${row.name}" data-fine-amount="${row.fine || 0}" ${actionMonth ? `data-fee-month="${actionMonth}"` : ""} title="Collect ${row.name}" aria-label="Collect ${row.name} for ${student.name}">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6.5C4 5.1 5.1 4 6.5 4h11C18.9 4 20 5.1 20 6.5v11c0 1.4-1.1 2.5-2.5 2.5h-11C5.1 20 4 18.9 4 17.5v-11ZM6.5 6a.5.5 0 0 0-.5.5V8h12V6.5a.5.5 0 0 0-.5-.5h-11ZM6 10v7.5c0 .3.2.5.5.5h11c.3 0 .5-.2.5-.5V10H6Zm6.8 6.7h-1.6v-1.1c-1-.2-1.8-.8-2.2-1.6l1.5-.8c.3.5.8.8 1.6.8.7 0 1-.2 1-.6s-.4-.5-1.4-.8c-1.4-.4-2.4-.9-2.4-2.2 0-1.1.8-1.9 1.9-2.1V7.3h1.6v1c.8.2 1.5.7 1.9 1.5l-1.4.8c-.3-.5-.7-.7-1.2-.7-.6 0-.9.2-.9.5 0 .4.4.5 1.4.8 1.4.4 2.4.9 2.4 2.2 0 1.2-.8 2-2.2 2.2v1.1Z"/></svg>
        </button>
      </td>
    </tr>
  `;
  }).join("") || `<tr><td colspan="7">No due fees found. Paid fee heads will not show here.</td></tr>`;
}

function renderSessions() {
  sessionSelect.innerHTML = Object.keys(financeSessions).map(session => `<option value="${session}">${session}</option>`).join("");
  sessionSelect.value = activeSession;
}

function renderFinanceSession(includeTables = true) {
  const session = ensureActiveFinanceSessionData();
  const dashboardMonthly = getDashboardMonthlyFeeCollectionSummary();
  const dashboardFollowUps = getDashboardDueFollowUps();
  const dashboardHighPriority = dashboardFollowUps.filter(item => item.status === "High Priority").length;
  const feesKpiCard = document.querySelector(".kpi-card.fees-kpi");
  if (feesKpiCard) feesKpiCard.hidden = !canCurrentRoleAccessModule("dashboardFeesCollection");
  document.getElementById("academicYearText").textContent = `Academic year ${activeSession}`;
  document.getElementById("sessionSummaryText").textContent = session.summary;
  document.getElementById("kpiFeesCollected").textContent = formatRs(dashboardMonthly.collected);
  document.getElementById("kpiFeesNote").textContent = `${dashboardMonthly.percent}% monthly fees collected, yearly fees excluded`;
  const monthlyBreakdown = document.getElementById("kpiFeesMonthlyBreakdown");
  if (monthlyBreakdown) {
    monthlyBreakdown.innerHTML = dashboardMonthly.monthlyBreakdown.map(item => `
      <div class="monthly-fee-pill">
        <span>${item.month}</span>
        <strong>${Number(item.amount || 0).toLocaleString("en-IN")}</strong>
      </div>
    `).join("");
  }
  const followUpsKpi = document.getElementById("kpiFollowUps");
  const followUpsNote = document.getElementById("kpiFollowUpsNote");
  if (followUpsKpi) followUpsKpi.textContent = String(dashboardFollowUps.length).padStart(2, "0");
  if (followUpsNote) followUpsNote.textContent = `${dashboardHighPriority} high priority`;
  document.getElementById("studentCount").textContent = getActiveStudents().length.toLocaleString("en-IN");
  renderDues();
  renderDashboardDueStudents();
  if (!includeTables) return;
  resetFeeMasterEditing();
  resetFeeGroupEditing();
  renderFeeMaster();
  renderFeeGroups();
  renderDueFeesSearch();
}

function isDashboardMonthlyFeeHead(head = "") {
  const clean = String(head || "").trim();
  const normalized = clean.toLowerCase();
  const yearlyHeads = ["admission fee", "annual fee", "form fee"];
  if (!clean || yearlyHeads.includes(normalized)) return false;
  if (["Tuition Late Fine", "Transport Late Fine"].includes(clean)) return false;
  return true;
}

function getDashboardPaymentMonth(payment = {}, allocation = {}) {
  const allocationMonth = String(allocation.month || "").trim();
  if (ACADEMIC_MONTHS.includes(allocationMonth)) return allocationMonth;
  const dateValue = allocation.date || payment.date;
  if (!dateValue) return "";
  const date = parseDateDDMMYYYY(dateValue);
  const month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][date.getMonth()];
  return ACADEMIC_MONTHS.includes(month) ? month : "";
}

function getDashboardMonthlyFeeCollectionSummary() {
  const activeStudents = getActiveStudents();
  const expected = activeStudents.reduce((sum, student) => {
    return sum + getStudentFeeItems(student)
      .filter(item => Array.isArray(item.months) && item.months.length && isDashboardMonthlyFeeHead(item.name))
      .reduce((itemSum, item) => itemSum + Number(item.total || 0), 0);
  }, 0);
  const sessionPayments = collectedPayments[activeSession] || {};
  const monthlyTotals = ACADEMIC_MONTHS.reduce((totals, month) => {
    totals[month] = 0;
    return totals;
  }, {});
  const collected = Object.values(sessionPayments).reduce((sum, payments) => {
    return sum + (payments || []).reduce((paymentSum, payment) => {
      return paymentSum + (payment.allocations || []).reduce((allocationSum, allocation) => {
        if (!isDashboardMonthlyFeeHead(allocation.head)) return allocationSum;
        const amount = Number(allocation.amount || 0);
        const dashboardMonth = getDashboardPaymentMonth(payment, allocation);
        if (dashboardMonth && Object.prototype.hasOwnProperty.call(monthlyTotals, dashboardMonth)) {
          monthlyTotals[dashboardMonth] += amount;
        }
        return allocationSum + amount;
      }, 0);
    }, 0);
  }, 0);
  return {
    expected,
    collected,
    percent: expected > 0 ? Math.min(100, Math.round((collected / expected) * 100)) : 0,
    monthlyBreakdown: ACADEMIC_MONTHS.map(month => ({
      month,
      amount: monthlyTotals[month] || 0
    }))
  };
}

function formatRs(amount) {
  return `Rs. ${Number(amount || 0).toLocaleString("en-IN")}`;
}

function formatDateDDMMYYYY(value = new Date()) {
  if (!value) return "";
  if (typeof value === "string") {
    const normalized = normalizeCollectionHistoryDateValue(value);
    if (/^\d{2}-\d{2}-\d{4}$/.test(normalized)) return normalized;
    if (/^\d{2}-\d{2}-\d{2}$/.test(normalized)) {
      const [day, month, year] = normalized.split("-");
      return `${day}-${month}-20${year}`;
    }
  }
  if (typeof value === "string" && /^\d{2}-\d{2}-\d{2}$/.test(value.trim())) {
    const [day, month, year] = value.trim().split("-");
    return `${day}-${month}-20${year}`;
  }
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return String(value || "");
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = String(date.getFullYear());
  return `${day}-${month}-${year}`;
}

function parseDateDDMMYYYY(value = new Date()) {
  if (value instanceof Date) return new Date(value.getFullYear(), value.getMonth(), value.getDate());
  const clean = normalizeCollectionHistoryDateValue(value);
  const match = clean.match(/^(\d{2})-(\d{2})-(\d{2}|\d{4})$/);
  if (match) {
    const year = match[3].length === 2 ? Number(`20${match[3]}`) : Number(match[3]);
    const date = new Date(year, Number(match[2]) - 1, Number(match[1]));
    return Number.isNaN(date.getTime()) ? new Date() : date;
  }
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? new Date() : new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function toDateInputValue(value = new Date()) {
  const date = parseDateDDMMYYYY(value);
  const year = String(date.getFullYear());
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function dateInputValueToDisplay(value = "") {
  const clean = String(value || "").trim();
  const match = clean.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return formatDateDDMMYYYY(new Date());
  return `${match[3]}-${match[2]}-${match[1]}`;
}

let activeCalendarTextInput = null;

function ensureDatePickerPopover() {
  let popover = document.getElementById("datePickerPopover");
  if (popover) return popover;
  popover = document.createElement("div");
  popover.id = "datePickerPopover";
  popover.className = "date-picker-popover";
  popover.hidden = true;
  popover.innerHTML = `
    <strong>Select payment date</strong>
    <input type="date" data-date-picker-input />
    <div class="date-picker-actions">
      <button class="ghost" type="button" data-date-picker-today>Today</button>
      <button class="primary" type="button" data-date-picker-apply>Apply</button>
    </div>
  `;
  document.body.appendChild(popover);
  return popover;
}

function applyDatePickerValue() {
  const popover = ensureDatePickerPopover();
  const pickerInput = popover.querySelector("[data-date-picker-input]");
  if (!activeCalendarTextInput || !pickerInput?.value) return;
  activeCalendarTextInput.value = dateInputValueToDisplay(pickerInput.value);
  activeCalendarTextInput.dispatchEvent(new Event("change", {bubbles: true}));
  closeDatePickerPopover();
}

function closeDatePickerPopover() {
  const popover = document.getElementById("datePickerPopover");
  if (popover) popover.hidden = true;
  activeCalendarTextInput = null;
}

function openDatePickerPopover(textInput, anchor) {
  if (!textInput || !anchor) return;
  activeCalendarTextInput = textInput;
  const popover = ensureDatePickerPopover();
  const pickerInput = popover.querySelector("[data-date-picker-input]");
  pickerInput.value = toDateInputValue(textInput.value || new Date());
  popover.hidden = false;
  const rect = anchor.getBoundingClientRect();
  const width = Math.min(260, window.innerWidth - 32);
  const left = Math.max(16, Math.min(rect.right - width, window.innerWidth - width - 16));
  const top = Math.min(rect.bottom + 8, window.innerHeight - 170);
  popover.style.left = `${left}px`;
  popover.style.top = `${Math.max(16, top)}px`;
  pickerInput.focus();
  if (typeof pickerInput.showPicker === "function") {
    try {
      pickerInput.showPicker();
    } catch (error) {
      // Some browsers only allow showPicker from direct user activation.
    }
  }
}

function parseOptionalDateDDMMYYYY(value) {
  const clean = normalizeCollectionHistoryDateValue(value);
  if (!clean) return null;
  if (!/^(\d{2})-(\d{2})-(\d{2}|\d{4})$/.test(clean)) return null;
  return parseDateDDMMYYYY(clean);
}

function getCollectionHistoryDefaultDateParts() {
  const today = new Date();
  const sessionYear = Number(String(activeSession || "").split("-")[0]) || today.getFullYear();
  return {
    month: String(today.getMonth() + 1).padStart(2, "0"),
    year: String(sessionYear)
  };
}

function normalizeCollectionHistoryDateValue(value) {
  const clean = String(value || "").trim().replace(/[/.]/g, "-");
  if (!clean) return "";
  const {month, year} = getCollectionHistoryDefaultDateParts();
  if (/^\d{1,2}$/.test(clean)) {
    return `${String(Number(clean)).padStart(2, "0")}-${month}-${year}`;
  }
  const dayMonth = clean.match(/^(\d{1,2})-(\d{1,2})$/);
  if (dayMonth) {
    return `${String(Number(dayMonth[1])).padStart(2, "0")}-${String(Number(dayMonth[2])).padStart(2, "0")}-${year}`;
  }
  const full = clean.match(/^(\d{1,2})-(\d{1,2})-(\d{2}|\d{4})$/);
  if (full) {
    const inputYear = full[3].length === 2 ? `20${full[3]}` : full[3];
    return `${String(Number(full[1])).padStart(2, "0")}-${String(Number(full[2])).padStart(2, "0")}-${inputYear}`;
  }
  return clean;
}

function normalizeCollectionHistoryDateInput(input) {
  if (!input || !String(input.value || "").trim()) return;
  input.value = normalizeCollectionHistoryDateValue(input.value);
}

function getCollectionHistoryDateRange() {
  const fromInput = document.getElementById("collectionHistoryFromDate");
  const toInput = document.getElementById("collectionHistoryToDate");
  const from = parseOptionalDateDDMMYYYY(fromInput?.value || "");
  const to = parseOptionalDateDDMMYYYY(toInput?.value || "");
  if (from && to && from > to) return {from: to, to: from};
  return {from, to};
}

function getCollectionHistoryCollectedByFilter() {
  return String(document.getElementById("collectionHistoryCollectedBy")?.value || "").trim().toLowerCase();
}

function getCollectionHistoryAdmissionFilter() {
  return String(document.getElementById("collectionHistoryAdmissionNo")?.value || "").trim().toLowerCase();
}

function getCollectionHistoryReceiptFilter() {
  return String(document.getElementById("collectionHistoryReceiptNo")?.value || "").trim().toLowerCase();
}

function renderCollectionHistoryCollectedByOptions(payments = []) {
  const select = document.getElementById("collectionHistoryCollectedBy");
  if (!select) return;
  const selected = select.value;
  const collectors = [...new Set(payments.map(payment => String(payment.by || "").trim()).filter(Boolean))]
    .sort((a, b) => a.localeCompare(b));
  select.innerHTML = `<option value="">All</option>${collectors.map(name => `<option value="${escapeHtml(name)}">${escapeHtml(name)}</option>`).join("")}`;
  select.value = collectors.includes(selected) ? selected : "";
}

function filterPaymentsByDateRange(payments) {
  const {from, to} = getCollectionHistoryDateRange();
  const collectedBy = getCollectionHistoryCollectedByFilter();
  const admissionFilter = getCollectionHistoryAdmissionFilter();
  const receiptFilter = getCollectionHistoryReceiptFilter();
  return payments.filter(payment => {
    const date = parseOptionalDateDDMMYYYY(payment.date) || parseDateDDMMYYYY(payment.date);
    if (from && date < from) return false;
    if (to && date > to) return false;
    if (collectedBy && String(payment.by || "").trim().toLowerCase() !== collectedBy) return false;
    if (admissionFilter && !String(payment.admissionNo || "").toLowerCase().includes(admissionFilter)) return false;
    if (receiptFilter && !String(payment.receipt || "").toLowerCase().includes(receiptFilter)) return false;
    return true;
  });
}

function getPaymentSelectionKey(payment) {
  return `${payment.admissionNo || ""}|${payment.receipt || ""}`;
}

function updatePaymentQuickTotal() {
  const checkedRows = [...document.querySelectorAll("[data-payment-total-select]:checked")];
  const visibleRows = [...document.querySelectorAll("[data-payment-total-select]")];
  const rows = checkedRows.length ? checkedRows : visibleRows;
  const totals = rows.reduce((sum, input) => {
    sum.bank += Number(input.dataset.bank || 0);
    sum.cash += Number(input.dataset.cash || 0);
    sum.fine += Number(input.dataset.fine || 0);
    sum.total += Number(input.dataset.total || 0);
    return sum;
  }, {bank: 0, cash: 0, fine: 0, total: 0});
  const count = document.getElementById("quickSelectedCount");
  const bank = document.getElementById("quickBankTotal");
  const cash = document.getElementById("quickCashTotal");
  const fine = document.getElementById("quickFineTotal");
  const total = document.getElementById("quickGrandTotal");
  if (count) count.textContent = rows.length;
  if (bank) bank.textContent = formatRs(totals.bank);
  if (cash) cash.textContent = formatRs(totals.cash);
  if (fine) fine.textContent = formatRs(totals.fine);
  if (total) total.textContent = formatRs(totals.total);
}

function clearPaymentQuickTotal() {
  selectedHistoryPayments.clear();
  document.querySelectorAll("[data-payment-total-select]").forEach(input => {
    input.checked = false;
    input.closest("tr")?.classList.remove("selected-payment-row");
  });
  updatePaymentQuickTotal();
}

let collectionHistoryFilterTimer = null;

function scheduleCollectionHistoryFilterRender(showMessage = false) {
  clearTimeout(collectionHistoryFilterTimer);
  collectionHistoryFilterTimer = setTimeout(() => {
    selectedHistoryPayments.clear();
    renderFeeBook(activeLedgerAdmissionNo || activeFeeStudentAdmissionNo);
    if (showMessage) showToast("Collection history date range applied.");
  }, 180);
}

function getClassFeeBase(klass) {
  if (/XI|XII/.test(klass)) return 42000;
  if (/VIII|IX|X/.test(klass)) return 36000;
  if (/V|VI|VII/.test(klass)) return 30000;
  return 24000;
}

function getCheckedMonths(name) {
  return [...admissionForm.querySelectorAll(`[name='${name}']:checked`)].map(input => input.value);
}

function getCheckedValues(name) {
  return [...admissionForm.querySelectorAll(`[name='${name}']:checked`)].map(input => input.value);
}

function setCheckedValues(name, values = []) {
  const selectedValues = Array.isArray(values) ? values : [];
  admissionForm.querySelectorAll(`[name='${name}']`).forEach(input => {
    input.checked = selectedValues.includes(input.value);
  });
}

function getSelectedMonths(student, key) {
  return student[key] && student[key].length ? student[key] : ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar"];
}

function formatMonthPeriod(months) {
  if (!months || months.length === 0) return "-";
  if (months.length === 1) return `${months[0]} (1 month)`;
  return `${months[0]}-${months[months.length - 1]} (${months.length} months)`;
}

function updateMonthSummary(name) {
  const months = getCheckedMonths(name);
  const summary = document.querySelector(`[data-month-summary='${name}']`);
  if (!summary) return;
  if (months.length === 12) summary.textContent = "12 months selected";
  else if (months.length === 0) summary.textContent = "Select months";
  else summary.textContent = `${months.length} months: ${months[0]}-${months[months.length - 1]}`;
}

function setCheckedMonths(name, months) {
  const selectedMonths = months && months.length ? months : ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar"];
  admissionForm.querySelectorAll(`[name='${name}']`).forEach(input => {
    input.checked = selectedMonths.includes(input.value);
  });
  updateMonthSummary(name);
}

function setAdmissionMonthGroups(student = {}) {
  setCheckedMonths("feeMonths", student.feeMonths);
  setCheckedMonths("transportMonths", student.transportMonths);
  setCheckedMonths("dayBoardingMonths", student.dayBoardingMonths);
  setCheckedMonths("roboticsMonths", student.roboticsMonths);
  setCheckedMonths("othersMonths", student.othersMonths);
}

function getSessionPayments(admissionNo) {
  if (!collectedPayments[activeSession]) collectedPayments[activeSession] = {};
  const sessionPayments = collectedPayments[activeSession];
  const requestedKey = String(admissionNo || "").trim();
  const normalizedKey = normalizeAdmissionNo(requestedKey);
  const serialKey = getAdmissionNoSerialPart(requestedKey);
  const canonicalKey = [requestedKey, normalizedKey, serialKey]
    .filter(Boolean)
    .find(key => Array.isArray(sessionPayments[key]))
    || Object.keys(sessionPayments).find(key => normalizeAdmissionNo(key) === normalizedKey)
    || requestedKey;
  if (!sessionPayments[canonicalKey]) sessionPayments[canonicalKey] = [];
  [requestedKey, normalizedKey, serialKey].filter(Boolean).forEach(key => {
    if (key === canonicalKey || !Array.isArray(sessionPayments[key]) || !arePaymentAdmissionKeysRelated(key, canonicalKey)) return;
    sessionPayments[canonicalKey] = mergePaymentList(sessionPayments[canonicalKey], sessionPayments[key]);
    delete sessionPayments[key];
  });
  return sessionPayments[canonicalKey];
}

function getPaymentAllocationTotals(admissionNo) {
  return getSessionPayments(admissionNo).reduce((totals, payment) => {
    payment.allocations.forEach(allocation => {
      const head = normalizePaymentFeeHead(allocation.head);
      totals[head] = (totals[head] || 0) + allocation.amount;
    });
    return totals;
  }, {});
}

function getTuitionMonthPayments(admissionNo) {
  return getSessionPayments(admissionNo).reduce((months, payment) => {
    payment.allocations.forEach(allocation => {
      const month = normalizePaymentMonth(allocation.month);
      if (!month) return;
      const head = normalizePaymentFeeHead(allocation.head);
      if (!months[month]) months[month] = {tuition: 0, fine: 0};
      if (head === "Tuition Fee") months[month].tuition += allocation.amount;
      if (head === "Tuition Late Fine") months[month].fine += allocation.amount;
    });
    return months;
  }, {});
}

function getMonthlyFeePaidAmount(student, row, month) {
  if (!student || !row || !month || !Array.isArray(row.months)) return 0;
  const monthlyAmount = Number(row.monthlyAmount || 0);
  const payments = getSessionPayments(student.admissionNo);
  const exactMonthAmounts = row.months.reduce((totals, itemMonth) => {
    totals[itemMonth] = payments.reduce((sum, payment) => {
      return sum + (payment.allocations || [])
        .filter(allocation => allocationMatchesHead(allocation, row.name) && allocationMatchesMonth(allocation, itemMonth) && !/fine/i.test(normalizePaymentFeeHead(allocation.head)))
        .reduce((allocationSum, allocation) => allocationSum + Number(allocation.amount || 0), 0);
    }, 0);
    return totals;
  }, {});
  const exact = Number(exactMonthAmounts[month] || 0);
  if (!monthlyAmount || exact >= monthlyAmount) return exact;
  const chunks = [];
  payments.slice().reverse().forEach(payment => {
    (payment.allocations || [])
      .filter(allocation => allocationMatchesHead(allocation, row.name) && !normalizePaymentMonth(allocation.month) && !/fine/i.test(normalizePaymentFeeHead(allocation.head)))
      .forEach(allocation => chunks.push(Number(allocation.amount || 0)));
  });
  for (const itemMonth of row.months) {
    let needed = Math.max(monthlyAmount - Number(exactMonthAmounts[itemMonth] || 0), 0);
    let applied = 0;
    while (needed > 0 && chunks.length) {
      const used = Math.min(needed, chunks[0]);
      if (itemMonth === month) applied += used;
      chunks[0] -= used;
      needed -= used;
      if (chunks[0] <= 0) chunks.shift();
    }
    if (itemMonth === month) return exact + applied;
  }
  return exact;
}

function getTuitionMonthPaidInfo(student, row, month) {
  const paid = getTuitionMonthPayments(student.admissionNo)[month] || {tuition: 0, fine: 0};
  const monthlyAmount = Number(row?.monthlyAmount || student.tuitionFee || 0);
  const tuition = Math.max(Number(paid.tuition || 0), getMonthlyFeePaidAmount(student, row, month));
  return {
    ...paid,
    tuition,
    monthlyAmount,
    isSettled: monthlyAmount > 0 && tuition >= monthlyAmount
  };
}

function hasAnyFinePaidForMonth(admissionNo = "", month = "") {
  if (!admissionNo || !month) return false;
  return getSessionPayments(admissionNo).some(payment => (payment.allocations || []).some(allocation => (
    allocationMatchesMonth(allocation, month) &&
    /fine/i.test(String(allocation.head || "")) &&
    Number(allocation.amount || 0) > 0
  )));
}

function shouldWaiveRepeatFineAfterFinePaid(paid = {}, paidKey = "", monthlyAmount = 0, admissionNo = "", month = "") {
  const feePaid = Number(paid[paidKey] || 0);
  const finePaid = Number(paid.fine || 0);
  const dueBalance = Math.max(Number(monthlyAmount || 0) - feePaid, 0);
  return (finePaid > 0 || hasAnyFinePaidForMonth(admissionNo, month)) && dueBalance > 0 && dueBalance <= MONTHLY_FINE_PAID_SMALL_DUE_LIMIT;
}

function getTransportMonthPayments(admissionNo) {
  return getSessionPayments(admissionNo).reduce((months, payment) => {
    payment.allocations.forEach(allocation => {
      const month = normalizePaymentMonth(allocation.month);
      if (!month) return;
      const head = normalizePaymentFeeHead(allocation.head);
      if (!months[month]) months[month] = {transport: 0, fine: 0};
      if (head === "Transport Fees") months[month].transport += allocation.amount;
      if (head === "Transport Late Fine") months[month].fine += allocation.amount;
    });
    return months;
  }, {});
}

function getTransportMonthPaidInfo(student, row, month) {
  const paid = getTransportMonthPayments(student.admissionNo)[month] || {transport: 0, fine: 0};
  const monthlyAmount = Number(row?.monthlyAmount || student.transportFee || 0);
  const transport = Math.max(Number(paid.transport || 0), getMonthlyFeePaidAmount(student, row, month));
  return {
    ...paid,
    transport,
    monthlyAmount,
    isSettled: monthlyAmount > 0 && transport >= monthlyAmount
  };
}

function getTuitionMonthFineDue(student, row, month, paymentDate = new Date()) {
  const paid = getTuitionMonthPaidInfo(student, row, month);
  if (paid.isSettled) return 0;
  if (shouldWaiveRepeatFineAfterFinePaid(paid, "tuition", paid.monthlyAmount, student.admissionNo, month)) return 0;
  return Math.max(calculateTuitionFineForMonth(month, paymentDate) - Number(paid.fine || 0), 0);
}

function getTuitionMonthCollectFineDue(student, row, month, paymentDate = new Date()) {
  const paid = getTuitionMonthPaidInfo(student, row, month);
  if (paid.isSettled) return 0;
  if (shouldWaiveRepeatFineAfterFinePaid(paid, "tuition", paid.monthlyAmount, student.admissionNo, month)) return 0;
  return Math.max(calculateTuitionFineForMonth(month, paymentDate) - Number(paid.fine || 0), 0);
}

function getTransportMonthFineDue(student, row, month, paymentDate = new Date()) {
  const paid = getTransportMonthPaidInfo(student, row, month);
  if (paid.isSettled) return 0;
  if (shouldWaiveRepeatFineAfterFinePaid(paid, "transport", paid.monthlyAmount, student.admissionNo, month)) return 0;
  return Math.max(calculateTransportFineForMonth(month, paymentDate) - Number(paid.fine || 0), 0);
}

function getTransportMonthCollectFineDue(student, row, month, paymentDate = new Date()) {
  const paid = getTransportMonthPaidInfo(student, row, month);
  if (paid.isSettled) return 0;
  if (shouldWaiveRepeatFineAfterFinePaid(paid, "transport", paid.monthlyAmount, student.admissionNo, month)) return 0;
  return Math.max(calculateTransportFineForMonth(month, paymentDate) - Number(paid.fine || 0), 0);
}

function getStudentFeeItems(student) {
  if (!student) return [];
  const paymentTotals = getPaymentAllocationTotals(student.admissionNo);
  const feeMonths = getSelectedMonths(student, "feeMonths");
  const transportMonths = getSelectedMonths(student, "transportMonths");
  const dayBoardingMonths = getSelectedMonths(student, "dayBoardingMonths");
  const roboticsMonths = getSelectedMonths(student, "roboticsMonths");
  const othersMonths = getSelectedMonths(student, "othersMonths");
  const tuition = Number(student.tuitionFee || 0) * feeMonths.length;
  const transport = Number(student.transportFee || 0) * transportMonths.length;
  const dayBoardingMonthly = Number(student.dayBoardingFee || 0) + Number(student.dayBoardingTransportFee || 0);
  const dayBoarding = dayBoardingMonthly ? dayBoardingMonthly * dayBoardingMonths.length : 0;
  const robotics = Number(student.roboticsFee || 0) * roboticsMonths.length;
  const others = Number(student.othersFee || 0) * othersMonths.length;
  const admission = Number(student.admissionFee || 0);
  const annual = Number(student.annualFee || 0);
  const form = Number(student.formFee || 0);
  return [
    {name: "Admission Fee", period: "One time", total: admission, paid: 0},
    {name: "Annual Fee", period: "Yearly", total: annual, paid: 0},
    {name: "Form Fee", period: "One time", total: form, paid: 0},
    {name: "Tuition Fee", period: formatMonthPeriod(feeMonths), months: feeMonths, monthlyAmount: Number(student.tuitionFee || 0), total: tuition, paid: 0},
    {name: "Transport Fees", period: formatMonthPeriod(transportMonths), months: transportMonths, monthlyAmount: Number(student.transportFee || 0), total: transport, paid: 0},
    {name: "Day Boarding Fees", period: formatMonthPeriod(dayBoardingMonths), months: dayBoardingMonths, monthlyAmount: dayBoardingMonthly, total: dayBoarding, paid: 0},
    {name: "Robotics Fees", period: formatMonthPeriod(roboticsMonths), months: roboticsMonths, monthlyAmount: Number(student.roboticsFee || 0), total: robotics, paid: 0},
    {name: "Tiffin Fees", period: formatMonthPeriod(othersMonths), months: othersMonths, monthlyAmount: Number(student.othersFee || 0), total: others, paid: 0}
  ].filter(item => item.total > 0).map(item => {
    const paid = Math.min(item.total, item.paid + (paymentTotals[item.name] || 0));
    return {...item, paid, due: Math.max(item.total - paid, 0)};
  });
}

function renderStudentFeeCounter(admissionNo = activeFeeStudentAdmissionNo, requestedAmount = null, requestedHead = "", requestedFine = 0, requestedMonth = "") {
  const activeStudents = getActiveStudents();
  const student = findActiveStudentByAdmissionNo(admissionNo) || activeStudents[0];
  if (!student) {
    activeFeeStudentAdmissionNo = "";
    document.getElementById("feeStudentAdmission").textContent = "-";
    document.getElementById("feeStudentName").textContent = "-";
    document.getElementById("feeStudentClass").textContent = "-";
    document.getElementById("feeStudentGuardian").textContent = "-";
    document.getElementById("studentFeeBreakdown").innerHTML = `<tr><td colspan="6">No student selected. Add a student admission first.</td></tr>`;
    document.querySelector("#feeForm [name='receiptNo']").value = "";
    document.querySelector("#feeForm [name='id']").value = "";
    document.querySelector("#feeForm [name='studentName']").value = "";
    document.querySelector("#feeForm [name='feeAmountDisplay']").value = "";
    document.querySelector("#feeForm [name='amount']").value = "";
    document.querySelector("#feeForm [name='bankAmount']").value = "";
    document.querySelector("#feeForm [name='cashAmount']").value = "";
    document.querySelector("#feeForm [name='fineAmount']").value = "";
    document.getElementById("feeForm").dataset.feeHead = "";
    document.getElementById("feeForm").dataset.fineAmount = 0;
    document.getElementById("feeForm").dataset.feeMonth = "";
    document.getElementById("receiptBox").textContent = "Select a student or enter an admission number.";
    document.getElementById("ledgerPaymentRows").innerHTML = `<tr><td colspan="13">No payment history yet.</td></tr>`;
    return;
  }
  resetPaymentEditMode();
  activeFeeStudentAdmissionNo = student.admissionNo;
  const feeItems = getStudentFeeItems(student);
  const totalDue = feeItems.reduce((sum, item) => sum + item.due, 0);
  const amountToCollect = requestedAmount === null || requestedAmount === undefined || requestedAmount === ""
    ? totalDue
    : Number(requestedAmount || 0);
  document.getElementById("feeStudentAdmission").textContent = student.admissionNo || "-";
  document.getElementById("feeStudentName").textContent = student.name || "-";
  document.getElementById("feeStudentClass").textContent = student.klass || "-";
  document.getElementById("feeStudentGuardian").textContent = student.guardian || "-";
  document.getElementById("studentFeeBreakdown").innerHTML = feeItems.map(item => `
    <tr>
      <td><strong>${item.name}</strong></td>
      <td><span class="fee-period">${item.period}</span></td>
      <td>${formatRs(item.total)}</td>
      <td>${formatRs(item.paid)}</td>
      <td>${formatRs(item.due)}</td>
      <td><span class="badge ${item.due > 0 ? "amber" : "green"}">${item.due > 0 ? "Due" : "Paid"}</span></td>
    </tr>
  `).join("") || `<tr><td colspan="6">No fee setup found for this student.</td></tr>`;
  document.querySelector("#feeForm [name='id']").value = student.admissionNo || "";
  document.querySelector("#feeForm [name='studentName']").value = student.name || "";
  document.querySelector("#feeForm [name='feeAmountDisplay']").value = amountToCollect;
  document.querySelector("#feeForm [name='amount']").value = amountToCollect;
  document.querySelector("#feeForm [name='bankAmount']").value = "";
  document.querySelector("#feeForm [name='cashAmount']").value = "";
  document.querySelector("#feeForm [name='fineAmount']").value = Number(requestedFine || 0) || "";
  setNextReceiptNo();
  if (!document.querySelector("#feeForm [name='date']").value) {
    document.querySelector("#feeForm [name='date']").value = formatDateDDMMYYYY(new Date());
  }
  document.getElementById("feeForm").dataset.feeHead = requestedHead || "";
  document.getElementById("feeForm").dataset.fineAmount = Number(requestedFine || 0);
  document.getElementById("feeForm").dataset.feeMonth = requestedMonth || "";
  updateFeeFineAmountFromPaymentDate();
  const dueLabel = requestedMonth ? `${requestedMonth} ${requestedHead}` : requestedHead;
  const dueText = dueLabel ? `${dueLabel} due ${formatRs(amountToCollect)}.` : `Total due ${formatRs(totalDue)}.`;
  document.getElementById("receiptBox").innerHTML = `<strong>${student.name}</strong><br>${student.admissionNo} | ${student.klass}<br><small>${dueText} Select payment mode and generate receipt.</small>`;
}

function getFilteredUpiPaymentRequests() {
  const statusFilter = String(document.getElementById("upiPaymentStatusFilter")?.value || "").trim();
  const admissionFilter = normalizeAdmissionNo(document.getElementById("upiPaymentAdmissionFilter")?.value || "");
  return upiPaymentRequests
    .filter(request => !statusFilter || String(request.status || "Pending") === statusFilter)
    .filter(request => !admissionFilter || normalizeAdmissionNo(request.admissionNo || "").includes(admissionFilter))
    .sort((a, b) => Date.parse(b.createdAt || b.date || 0) - Date.parse(a.createdAt || a.date || 0));
}

function renderUpiPaymentVerification() {
  const rows = document.getElementById("upiPaymentRows");
  if (!rows) return;
  const filtered = getFilteredUpiPaymentRequests();
  const pendingCount = upiPaymentRequests.filter(request => String(request.status || "Pending") === "Pending").length;
  const summary = document.getElementById("upiPaymentSummary");
  if (summary) {
    summary.textContent = `${pendingCount} pending`;
    summary.className = `status-pill ${pendingCount ? "pending" : "stable"}`;
  }
  rows.innerHTML = filtered.map(request => {
    const status = request.status || "Pending";
    const screenshot = request.screenshot?.url
      ? `<a class="ghost-action" href="${escapeHtml(request.screenshot.url)}" target="_blank" rel="noopener">View</a>`
      : "-";
    const canAct = status === "Pending";
    return `
      <tr>
        <td>${escapeHtml(formatDateDDMMYYYY(request.date || request.createdAt || new Date()))}</td>
        <td><strong>${escapeHtml(request.studentName || "-")}</strong><br><small>${escapeHtml(request.className || "")}</small></td>
        <td>${escapeHtml(request.admissionNo || "-")}</td>
        <td><strong>${formatRs(request.amount)}</strong></td>
        <td>${escapeHtml(request.utr || "-")}</td>
        <td><span class="status-pill ${status === "Approved" ? "stable" : status === "Rejected" ? "danger" : "pending"}">${escapeHtml(status)}</span></td>
        <td>${screenshot}</td>
        <td class="inline-actions">
          ${canAct ? `<button class="icon-action edit" type="button" data-approve-upi-payment="${escapeHtml(request.id)}" title="Approve UPI payment">✓</button>
          <button class="icon-action delete" type="button" data-reject-upi-payment="${escapeHtml(request.id)}" title="Reject UPI payment">×</button>` : escapeHtml(request.receiptNo || request.rejectReason || "-")}
        </td>
      </tr>
    `;
  }).join("") || `<tr><td colspan="8">No UPI payment request found.</td></tr>`;
}

function approveUpiPaymentRequest(requestId = "") {
  const request = upiPaymentRequests.find(item => String(item.id || "") === String(requestId || ""));
  if (!request) {
    showToast("UPI request not found.");
    return;
  }
  if (request.status !== "Pending") {
    showToast("This UPI request is already processed.");
    return;
  }
  const student = findActiveStudentByAdmissionNo(request.admissionNo);
  if (!student) {
    showToast("Student not found or disabled.");
    return;
  }
  const receiptNo = getSafeReceiptNoForPayment(student.admissionNo, getNextReceiptNo()).receiptNo;
  const amount = Number(request.amount || 0);
  const payment = collectStudentPayment(student, amount, request.date || new Date(), "Bank", "", 0, "", receiptNo, {
    bankAmount: amount,
    cashAmount: 0,
    remarks: `Student app UPI verification | UTR: ${request.utr || "-"}`
  });
  if (!payment) {
    showToast("UPI payment could not be approved.");
    return;
  }
  request.status = "Approved";
  request.receiptNo = payment.receipt;
  request.approvedAt = new Date().toISOString();
  request.approvedBy = getCurrentCollectorRoleName();
  setNextReceiptNo();
  saveAppState();
  renderUpiPaymentVerification();
  renderStudentFeeCounter(student.admissionNo);
  renderFeeBook(student.admissionNo);
  renderFinanceSession();
  showToast(`UPI payment approved. Receipt ${payment.receipt} created.`);
}

function rejectUpiPaymentRequest(requestId = "") {
  const request = upiPaymentRequests.find(item => String(item.id || "") === String(requestId || ""));
  if (!request) {
    showToast("UPI request not found.");
    return;
  }
  const reason = prompt("Enter rejection reason", request.rejectReason || "Payment not matched");
  if (reason === null) return;
  request.status = "Rejected";
  request.rejectReason = String(reason || "").trim() || "Payment not matched";
  request.rejectedAt = new Date().toISOString();
  request.rejectedBy = getCurrentCollectorRoleName();
  saveAppState();
  renderUpiPaymentVerification();
  showToast("UPI payment request rejected.");
}

function updateFeeFineAmountFromPaymentDate() {
  const feeForm = document.getElementById("feeForm");
  const feeHead = feeForm.dataset.feeHead || "";
  const feeMonth = feeForm.dataset.feeMonth || "";
  if (!["Tuition Fee", "Transport Fees"].includes(feeHead) || !feeMonth) {
    feeForm.elements.fineAmount.value = 0;
    feeForm.dataset.fineAmount = 0;
    return;
  }
  const student = findActiveStudentByAdmissionNo(feeForm.elements.id.value);
  if (!student) return;
  const paymentDate = parseDateDDMMYYYY(feeForm.elements.date.value || new Date());
  const row = getLedgerRows(student).find(item => item.name === feeHead);
  const paid = feeHead === "Transport Fees"
    ? getTransportMonthPaidInfo(student, row, feeMonth)
    : getTuitionMonthPaidInfo(student, row, feeMonth);
  const feePaid = feeHead === "Transport Fees" ? Number(paid.transport || 0) : Number(paid.tuition || 0);
  const feeDue = Math.max(Number(row?.monthlyAmount || 0) - feePaid, 0);
  const fineDue = feeHead === "Transport Fees"
    ? getTransportMonthCollectFineDue(student, row, feeMonth, paymentDate)
    : getTuitionMonthCollectFineDue(student, row, feeMonth, paymentDate);
  const totalDue = feeDue + fineDue;
  feeForm.elements.fineAmount.value = fineDue;
  feeForm.dataset.fineAmount = fineDue;
  feeForm.elements.feeAmountDisplay.value = totalDue;
  feeForm.elements.amount.value = totalDue;
}

function getLedgerRows(student) {
  return getStudentFeeItems(student).map(item => ({...item, discount: 0}));
}

function getPaymentsByReceipt(admissionNo, receiptNo) {
  return getSessionPayments(admissionNo).filter(payment => String(payment.receipt || "") === String(receiptNo || ""));
}

function mergePaymentsForReceipt(admissionNo, receiptNo) {
  const payments = getPaymentsByReceipt(admissionNo, receiptNo);
  if (!payments.length) return null;
  if (payments.length === 1) return payments[0];
  const allocations = payments.flatMap(payment => payment.allocations || []);
  const bankAmount = payments.reduce((sum, payment) => sum + Number(payment.bankAmount || 0), 0);
  const cashAmount = payments.reduce((sum, payment) => sum + Number(payment.cashAmount || 0), 0);
  const discountAmount = payments.reduce((sum, payment) => sum + Number(payment.discountAmount || 0), 0);
  const amount = payments.reduce((sum, payment) => sum + Number(payment.amount || 0), 0) || (bankAmount + cashAmount);
  const remarks = [...new Set(payments.map(payment => String(payment.remarks || "").trim()).filter(Boolean))].join(" | ");
  const collectors = [...new Set(payments.map(payment => String(payment.by || "").trim()).filter(Boolean))].join(", ");
  return {
    ...payments[0],
    amount,
    bankAmount,
    cashAmount,
    discountAmount,
    mode: bankAmount > 0 && cashAmount > 0 ? "Bank + Cash" : bankAmount > 0 ? "Bank" : "Cash",
    by: collectors || payments[0].by,
    remarks,
    allocations
  };
}

function getPaymentPrimaryDate(payment = {}) {
  return (payment.allocations || []).map(allocation => allocation.date).find(Boolean) || payment.date;
}

function buildLedgerPaymentRow(student, payment) {
  const allocations = payment.allocations || [];
  const feeHeads = [...new Set(allocations
    .filter(allocation => !["Tuition Late Fine", "Transport Late Fine"].includes(allocation.head))
    .map(allocation => allocation.head)
    .filter(Boolean))];
  const fine = allocations
    .filter(allocation => ["Tuition Late Fine", "Transport Late Fine"].includes(allocation.head))
    .reduce((sum, allocation) => sum + Number(allocation.amount || 0), 0);
  const total = allocations.reduce((sum, allocation) => sum + Number(allocation.amount || 0), 0);
  const savedBank = Number(payment.bankAmount || 0);
  const savedCash = Number(payment.cashAmount || 0);
  const discount = Number(payment.discountAmount || 0);
  const split = savedBank || savedCash ? {bank: savedBank, cash: savedCash} : getPaymentSplitForAmount(payment, total);
  return {
    date: getPaymentPrimaryDate(payment),
    receipt: payment.receipt,
    admissionNo: student.admissionNo || "",
    head: feeHeads.length ? feeHeads.join(", ") : "Tuition Fee",
    amount: total,
    bank: split.bank,
    cash: split.cash,
    fine,
    discount,
    remarks: payment.remarks || "",
    by: payment.by
  };
}

function getLedgerPayments(student) {
  if (!student) return [];
  const groupedPayments = [...getSessionPayments(student.admissionNo).reduce((groups, payment) => {
    const receipt = payment.receipt || "";
    if (!groups.has(receipt)) groups.set(receipt, payment);
    else {
      const existing = groups.get(receipt);
      groups.set(receipt, {
        ...existing,
        amount: Number(existing.amount || 0) + Number(payment.amount || 0),
        bankAmount: Number(existing.bankAmount || 0) + Number(payment.bankAmount || 0),
        cashAmount: Number(existing.cashAmount || 0) + Number(payment.cashAmount || 0),
        discountAmount: Number(existing.discountAmount || 0) + Number(payment.discountAmount || 0),
        remarks: [...new Set([existing.remarks, payment.remarks].map(item => String(item || "").trim()).filter(Boolean))].join(" | "),
        allocations: [...(existing.allocations || []), ...(payment.allocations || [])]
      });
    }
    return groups;
  }, new Map()).values()];
  return groupedPayments.map(payment => buildLedgerPaymentRow(student, payment)).sort((a, b) => {
    const dateA = parseDateDDMMYYYY(a.date).getTime();
    const dateB = parseDateDDMMYYYY(b.date).getTime();
    if (dateA !== dateB) return dateB - dateA;
    return String(b.receipt || "").localeCompare(String(a.receipt || ""), undefined, {numeric: true});
  });
}

function getAllLedgerPayments() {
  return students.flatMap(student => getLedgerPayments(student)).sort((a, b) => {
    const dateA = parseDateDDMMYYYY(a.date).getTime();
    const dateB = parseDateDDMMYYYY(b.date).getTime();
    if (dateA !== dateB) return dateB - dateA;
    return String(b.receipt || "").localeCompare(String(a.receipt || ""), undefined, {numeric: true});
  });
}

function findPaymentIndexByReceipt(admissionNo, receiptNo) {
  return getSessionPayments(admissionNo).findIndex(payment => payment.receipt === receiptNo);
}

function getPaymentEditContext(payment) {
  const mainAllocation = (payment.allocations || []).find(allocation => !["Tuition Late Fine", "Transport Late Fine"].includes(allocation.head)) || {};
  const fineAmount = (payment.allocations || [])
    .filter(allocation => ["Tuition Late Fine", "Transport Late Fine"].includes(allocation.head))
    .reduce((sum, allocation) => sum + Number(allocation.amount || 0), 0);
  return {
    feeHead: mainAllocation.head || "",
    feeMonth: mainAllocation.month || "",
    fineAmount
  };
}

function openPaymentEdit(admissionNo, receiptNo) {
  const student = findActiveStudentByAdmissionNo(admissionNo);
  const payment = mergePaymentsForReceipt(admissionNo, receiptNo);
  if (!student || !payment) {
    showToast("Payment record not found.");
    return;
  }
  openCombinedCollectionEditPopup(student, payment);
}

function resetPaymentEditMode() {
  const feeForm = document.getElementById("feeForm");
  delete feeForm.dataset.editPaymentReceipt;
  delete feeForm.dataset.editPaymentId;
  feeForm.querySelector("button[type='submit']").textContent = "Generate Receipt";
}

function resetFeeDateToToday() {
  const feeForm = document.getElementById("feeForm");
  feeForm.elements.date.value = formatDateDDMMYYYY(new Date());
  updateFeeFineAmountFromPaymentDate();
}

function deletePaymentByReceipt(admissionNo, receiptNo, paymentId = "") {
  const payments = getSessionPayments(admissionNo);
  const before = payments.length;
  const targetReceipt = String(receiptNo || "");
  const targetPaymentId = String(paymentId || "");
  for (let index = payments.length - 1; index >= 0; index -= 1) {
    const payment = payments[index] || {};
    if (targetPaymentId && String(payment.id || "") === targetPaymentId) {
      payments.splice(index, 1);
      continue;
    }
    if (!targetPaymentId && String(payment.receipt || "") === targetReceipt) payments.splice(index, 1);
  }
  return payments.length !== before;
}

function deletePaymentReceiptEverywhere(admissionNo, receiptNo, paymentId = "") {
  const targetReceipt = String(receiptNo || "").trim();
  const targetPaymentId = String(paymentId || "").trim();
  if (!targetReceipt && !targetPaymentId) return false;
  let removed = deletePaymentByReceipt(admissionNo, targetReceipt, targetPaymentId);
  Object.entries(collectedPayments || {}).forEach(([session, sessionRows]) => {
    if (!sessionRows || typeof sessionRows !== "object") return;
    Object.entries(sessionRows).forEach(([candidateAdmissionNo, payments]) => {
      if (!Array.isArray(payments)) return;
      const before = payments.length;
      for (let index = payments.length - 1; index >= 0; index -= 1) {
        const payment = payments[index] || {};
        const samePayment = targetPaymentId && String(payment.id || "").trim() === targetPaymentId;
        const sameReceipt = !targetPaymentId && String(payment.receipt || "").trim() === targetReceipt;
        if (samePayment || sameReceipt) payments.splice(index, 1);
      }
      if (payments.length !== before) {
        removed = true;
        if (targetReceipt) markPaymentReceiptDeleted(candidateAdmissionNo, targetReceipt, session);
      }
    });
  });
  if (targetReceipt) markPaymentReceiptDeleted(admissionNo, targetReceipt);
  return removed;
}

async function flushPaymentDeleteSave() {
  if (!backendQueuedSnapshot) return;
  clearTimeout(backendSaveTimer);
  backendSaveTimer = null;
  await processBackendSaveQueue();
}

function getPaymentSplitForAmount(payment, amount) {
  const paidAmount = Number(amount || 0);
  const totalAmount = Number(payment.amount || 0);
  const savedBank = Number(payment.bankAmount || 0);
  const savedCash = Number(payment.cashAmount || 0);
  if (paidAmount <= 0) return {bank: 0, cash: 0};
  if (savedBank > 0 || savedCash > 0) {
    const ratio = totalAmount > 0 ? paidAmount / totalAmount : 1;
    const bank = Math.min(paidAmount, Math.round(savedBank * ratio));
    return {bank, cash: Math.max(paidAmount - bank, 0)};
  }
  const mode = String(payment.mode || "").toLowerCase();
  if (mode.includes("cash")) return {bank: 0, cash: paidAmount};
  return {bank: paidAmount, cash: 0};
}

function renderPaymentSplitDetails(payment) {
  const bank = Number(payment.bank || 0);
  const cash = Number(payment.cash || 0);
  return `
    <details class="payment-split-details">
      <summary>${formatRs(payment.amount)}</summary>
      <div class="payment-split-panel">
        <div><span>Bank</span><strong>${formatRs(bank)}</strong></div>
        <div><span>Cash</span><strong>${formatRs(cash)}</strong></div>
      </div>
    </details>
  `;
}

function getLedgerPaymentDetails(student, row) {
  if (!student || !row) return [];
  const matchingHeads = getFeeHeadMatchingHeads(row.name);
  return getSessionPayments(student.admissionNo).map(payment => {
    const matchingAllocations = payment.allocations
      .filter(allocation => matchingHeads.includes(allocation.head));
    const amount = matchingAllocations
      .reduce((sum, allocation) => sum + allocation.amount, 0);
    const fineHead = getLateFineHeadForFee(row.name);
    const fine = ["Tuition Fee", "Transport Fees"].includes(row.name) ? payment.allocations
      .filter(allocation => allocation.head === fineHead)
      .reduce((sum, allocation) => sum + allocation.amount, 0) : 0;
    return amount > 0 ? {
      id: payment.id || "",
      date: matchingAllocations.map(allocation => allocation.date).find(Boolean) || payment.date,
      receipt: payment.receipt,
      amount,
      fine,
      ...getPaymentSplitForAmount(payment, amount)
    } : null;
  }).filter(Boolean);
}

function getLedgerMonthPaymentSplit(student, row, month) {
  if (!student || !row || !month) return {amount: 0, bank: 0, cash: 0};
  const matchingHeads = getFeeHeadMatchingHeads(row.name);
  const payments = getSessionPayments(student.admissionNo);
  const exact = payments.reduce((total, payment) => {
    const amount = payment.allocations
      .filter(allocation => matchingHeads.includes(allocation.head) && allocation.month === month)
      .reduce((sum, allocation) => sum + allocation.amount, 0);
    if (amount <= 0) return total;
    const split = getPaymentSplitForAmount(payment, amount);
    total.amount += amount;
    total.bank += split.bank;
    total.cash += split.cash;
    return total;
  }, {amount: 0, bank: 0, cash: 0});
  if (!Array.isArray(row.months) || !row.months.includes(month) || !row.monthlyAmount) return exact;
  const monthlyAmount = Number(row.monthlyAmount || 0);
  if (exact.amount >= monthlyAmount) return exact;
  const exactMonthAmounts = row.months.reduce((totals, itemMonth) => {
    totals[itemMonth] = payments.reduce((sum, payment) => {
      return sum + payment.allocations
        .filter(allocation => allocation.head === row.name && allocation.month === itemMonth)
        .reduce((allocationSum, allocation) => allocationSum + allocation.amount, 0);
    }, 0);
    return totals;
  }, {});
  const exactPaidMonths = new Set();
  row.months.forEach(itemMonth => {
    if ((exactMonthAmounts[itemMonth] || 0) >= monthlyAmount) exactPaidMonths.add(itemMonth);
  });
  const chunks = [];
  payments.slice().reverse().forEach(payment => {
    payment.allocations
      .filter(allocation => allocation.head === row.name && !allocation.month)
      .forEach(allocation => {
        const split = getPaymentSplitForAmount(payment, allocation.amount);
        chunks.push({amount: Number(allocation.amount || 0), bank: split.bank, cash: split.cash});
      });
  });
  const target = {...exact};
  for (const itemMonth of row.months) {
    if (exactPaidMonths.has(itemMonth)) continue;
    let needed = Math.max(monthlyAmount - Number(exactMonthAmounts[itemMonth] || 0), 0);
    while (needed > 0 && chunks.length) {
      const chunk = chunks[0];
      const used = Math.min(needed, chunk.amount);
      const ratio = chunk.amount > 0 ? used / chunk.amount : 0;
      const bank = Math.min(used, Math.round(chunk.bank * ratio));
      const cash = Math.max(used - bank, 0);
      if (itemMonth === month) {
        target.amount += used;
        target.bank += bank;
        target.cash += cash;
      }
      chunk.amount -= used;
      chunk.bank = Math.max(chunk.bank - bank, 0);
      chunk.cash = Math.max(chunk.cash - cash, 0);
      needed -= used;
      if (chunk.amount <= 0) chunks.shift();
    }
    if (itemMonth === month) return target.amount >= monthlyAmount ? target : {amount: 0, bank: 0, cash: 0};
  }
  return target;
}

function getLedgerMonthFineAmount(student, row, month) {
  if (!student || !row || !month) return 0;
  if (row.name === "Tuition Fee") return getTuitionMonthFineDue(student, row, month);
  if (row.name === "Transport Fees") return getTransportMonthFineDue(student, row, month);
  return 0;
}

function getLedgerMonthDisplayFineAmount(student, row, month) {
  if (!student || !row || !month) return 0;
  if (row.name === "Tuition Fee") {
    const paid = getTuitionMonthPaidInfo(student, row, month);
    return paid.isSettled ? Number(paid.fine || 0) : getLedgerMonthFineAmount(student, row, month);
  }
  if (row.name === "Transport Fees") {
    const paid = getTransportMonthPaidInfo(student, row, month);
    return paid.isSettled ? Number(paid.fine || 0) : getLedgerMonthFineAmount(student, row, month);
  }
  return 0;
}

function getLedgerRowFineAmount(student, row) {
  if (!student || !row || !["Tuition Fee", "Transport Fees"].includes(row.name) || !Array.isArray(row.months)) return 0;
  return row.months.reduce((sum, month) => sum + getLedgerMonthFineAmount(student, row, month), 0);
}

function getPaidLedgerMonths(student, row) {
  if (!student || !row || !Array.isArray(row.months) || !row.months.length || !row.monthlyAmount) return new Set();
  const paidMonths = new Set();
  const paymentInfo = getSessionPayments(student.admissionNo).reduce((info, payment) => {
    payment.allocations.forEach(allocation => {
      if (!allocationMatchesHead(allocation, row.name) || /fine/i.test(normalizePaymentFeeHead(allocation.head))) return;
      const month = normalizePaymentMonth(allocation.month);
      if (month) {
        info.exactMonthTotals[month] = (info.exactMonthTotals[month] || 0) + allocation.amount;
      } else {
        info.unassignedPaid += allocation.amount;
      }
    });
    return info;
  }, {exactMonthTotals: {}, unassignedPaid: 0});
  row.months.forEach(month => {
    if ((paymentInfo.exactMonthTotals[month] || 0) >= Number(row.monthlyAmount || 0)) paidMonths.add(month);
  });
  let unassignedMonthCount = Math.floor(Number(paymentInfo.unassignedPaid || 0) / Number(row.monthlyAmount || 1));
  row.months.forEach(month => {
    if (unassignedMonthCount <= 0 || paidMonths.has(month)) return;
    paidMonths.add(month);
    unassignedMonthCount -= 1;
  });
  return paidMonths;
}

function getLedgerMonthPaidAmount(student, row, month) {
  if (!student || !row || !month) return 0;
  const directPaid = getSessionPayments(student.admissionNo).reduce((sum, payment) => {
    return sum + (payment.allocations || [])
      .filter(allocation => allocationMatchesHead(allocation, row.name) && allocationMatchesMonth(allocation, month) && !/fine/i.test(normalizePaymentFeeHead(allocation.head)))
      .reduce((allocationSum, allocation) => allocationSum + Number(allocation.amount || 0), 0);
  }, 0);
  return directPaid;
}

function isLedgerMonthPartiallyPaid(student, row, month) {
  if (!student || !row || !month || !row.monthlyAmount) return false;
  const paid = getLedgerMonthPaidAmount(student, row, month);
  return paid > 0 && paid < Number(row.monthlyAmount || 0);
}

function getLedgerMonthFeePaidAmount(student, row, month) {
  if (!student || !row || !month) return 0;
  if (row.name === "Tuition Fee") {
    return Number(getTuitionMonthPaidInfo(student, row, month).tuition || 0);
  }
  if (row.name === "Transport Fees") {
    return Number(getTransportMonthPaidInfo(student, row, month).transport || 0);
  }
  return getLedgerMonthPaymentSplit(student, row, month).amount || getLedgerMonthPaidAmount(student, row, month);
}

function renderLedgerMonthAmountCell(monthAmount, paidAmount) {
  const total = Number(monthAmount || 0);
  const paid = Math.min(Number(paidAmount || 0), total);
  const due = Math.max(total - paid, 0);
  return due > 0 ? formatRs(due) : formatRs(total);
}

function renderLedgerMonthPartialCell(monthAmount, paidAmount) {
  const total = Number(monthAmount || 0);
  const paid = Math.min(Number(paidAmount || 0), total);
  if (paid <= 0) return "-";
  if (paid >= total && total > 0) return `<span class="paid-chip">${formatRs(paid)}</span>`;
  return `<strong>${formatRs(paid)}</strong>`;
}

function getFeeBookDropdownKey(student = {}, row = {}, type = "period") {
  return [
    type,
    normalizeAdmissionNo(student.admissionNo || activeLedgerAdmissionNo || ""),
    String(row.name || "").trim()
  ].join("__");
}

function renderLedgerPeriodCell(student, row) {
  const payments = getLedgerPaymentDetails(student, row);
  const months = Array.isArray(row.months) ? row.months : [];
  if (!months.length && !payments.length) return `<span class="fee-period">${row.period}</span>`;
  const dropdownKey = getFeeBookDropdownKey(student, row, "period");
  return `
    <details class="period-details ledger-payment-details" data-fee-book-dropdown="${escapeHtml(dropdownKey)}" ${openFeeBookDropdowns.has(dropdownKey) ? "open" : ""}>
      <summary><span class="fee-period">${row.period}</span></summary>
      <div class="period-breakdown ledger-payment-breakdown">
        ${months.length ? `
          <div class="period-breakdown-head period-month-row"><span>Month</span><span>Amount</span><span>Partial Payment</span><span>Fine</span><span>Total</span><span></span></div>
          ${months.map(month => {
            const monthAmount = Number(row.monthlyAmount || 0);
            const paidAmount = getLedgerMonthFeePaidAmount(student, row, month);
            const dueAmount = Math.max(monthAmount - Math.min(paidAmount, monthAmount), 0);
            const isPaid = monthAmount > 0 && dueAmount <= 0;
            const isPartial = paidAmount > 0 && dueAmount > 0;
            const monthFine = getLedgerMonthDisplayFineAmount(student, row, month);
            const collectTotal = isPaid ? monthAmount + monthFine : dueAmount + monthFine;
            return `
            <div class="period-breakdown-row period-month-row ${isPaid ? "paid-month" : isPartial ? "partial-month" : ""}">
              <span>${month}${isPaid ? " Paid" : isPartial ? " Part Paid" : ""}</span>
              <span>${renderLedgerMonthAmountCell(monthAmount, paidAmount)}</span>
              <span>${renderLedgerMonthPartialCell(monthAmount, paidAmount)}</span>
              <span>${formatRs(monthFine)}</span>
              <span>${formatRs(collectTotal)}</span>
              <span class="month-row-actions">
                <button class="month-collect-action" type="button" data-student-fees="${student.admissionNo || ""}" data-due-amount="${collectTotal}" data-fee-head="${row.name}" data-fine-amount="${monthFine}" data-fee-month="${month}" ${isPaid ? "disabled" : ""} title="${isPaid ? `${month} paid` : `Collect ${month}`}" aria-label="${isPaid ? `${month} paid` : `Collect ${month} ${row.name} for ${student.name || "student"}`}">
                  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6.5C4 5.1 5.1 4 6.5 4h11C18.9 4 20 5.1 20 6.5v11c0 1.4-1.1 2.5-2.5 2.5h-11C5.1 20 4 18.9 4 17.5v-11ZM6.5 6a.5.5 0 0 0-.5.5V8h12V6.5a.5.5 0 0 0-.5-.5h-11ZM6 10v7.5c0 .3.2.5.5.5h11c.3 0 .5-.2.5-.5V10H6Zm6.8 6.7h-1.6v-1.1c-1-.2-1.8-.8-2.2-1.6l1.5-.8c.3.5.8.8 1.6.8.7 0 1-.2 1-.6s-.4-.5-1.4-.8c-1.4-.4-2.4-.9-2.4-2.2 0-1.1.8-1.9 1.9-2.1V7.3h1.6v1c.8.2 1.5.7 1.9 1.5l-1.4.8c-.3-.5-.7-.7-1.2-.7-.6 0-.9.2-.9.5 0 .4.4.5 1.4.8 1.4.4 2.4.9 2.4 2.2 0 1.2-.8 2-2.2 2.2v1.1Z"/></svg>
                  <span>${isPaid ? "Paid" : "Pay"}</span>
                </button>
              </span>
            </div>
          `;
          }).join("")}
        ` : ""}
        ${payments.length ? `
          <div class="ledger-payment-title">
            <span>Payment Details</span>
            <span class="ledger-payment-tools">
              <button class="payment-receipt-action" type="button" data-preview-selected-payments="${student.admissionNo || ""}" data-fee-head="${row.name}" title="Preview selected payments" aria-label="Preview selected payment details">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 2h9l5 5v15H6a2 2 0 0 1-2-2V4c0-1.1.9-2 2-2Zm8 2H6v16h12V8h-4V4Zm-5 8h6v2H9v-2Zm0 4h6v2H9v-2Zm0-8h3v2H9V8Z"/></svg>
              </button>
              <button class="print-period-payments" type="button" data-print-ledger-payments="${student.admissionNo || ""}" data-fee-head="${row.name}" title="Print payment details" aria-label="Print payment details">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 8V4h10v4h-2V6H9v2H7Zm-1 12v-4H4c-.6 0-1-.2-1.4-.6S2 14.6 2 14v-4c0-.6.2-1 .6-1.4S3.4 8 4 8h16c.6 0 1 .2 1.4.6s.6.8.6 1.4v4c0 .6-.2 1-.6 1.4s-.8.6-1.4.6h-2v4H6Zm2-2h8v-5H8v5Zm-4-4h2v-3h12v3h2v-4H4v4Zm14-1.5c.3 0 .5-.1.7-.3s.3-.4.3-.7-.1-.5-.3-.7-.4-.3-.7-.3-.5.1-.7.3-.3.4-.3.7.1.5.3.7.4.3.7.3Z"/></svg>
              </button>
            </span>
          </div>
          <div class="period-breakdown-head ledger-payment-row"><span></span><span>Date</span><span>Receipt No.</span><span>Paid</span><span></span></div>
          ${payments.map(payment => `
            <div class="period-breakdown-row ledger-payment-row">
              <span><input class="ledger-payment-select" type="checkbox" data-select-payment="${student.admissionNo || ""}" data-fee-head="${row.name}" value="${payment.receipt}" /></span>
              <span>${formatDateDDMMYYYY(payment.date)}</span>
              <span>${payment.receipt}</span>
              <span>${renderPaymentSplitDetails(payment)}</span>
              <span class="month-row-actions">
                <button class="payment-receipt-action" type="button" data-preview-payment-receipt="${student.admissionNo || ""}" data-fee-head="${row.name}" data-receipt-no="${payment.receipt}" title="Receipt preview" aria-label="Preview receipt ${payment.receipt} for ${student.name || "student"}">
                  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 2h9l5 5v15H6a2 2 0 0 1-2-2V4c0-1.1.9-2 2-2Zm8 2H6v16h12V8h-4V4Zm-5 8h6v2H9v-2Zm0 4h6v2H9v-2Zm0-8h3v2H9V8Z"/></svg>
                </button>
                <button class="payment-edit-action" type="button" data-edit-payment="${student.admissionNo || ""}" data-payment-receipt="${payment.receipt}" title="Edit payment" aria-label="Edit receipt ${payment.receipt} for ${student.name || "student"}">
                  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20h4.7L19.3 9.4a2.1 2.1 0 0 0 0-3L17.6 4.7a2.1 2.1 0 0 0-3 0L4 15.3V20Zm3.8-2H6v-1.8l8.5-8.5 1.8 1.8L7.8 18Zm7.9-11.5.4-.4 1.8 1.8-.4.4-1.8-1.8Z"/></svg>
                </button>
                <button class="payment-delete-action" type="button" data-delete-payment="${student.admissionNo || ""}" data-payment-receipt="${payment.receipt}" data-payment-id="${payment.id || ""}" title="Delete payment" aria-label="Delete receipt ${payment.receipt} for ${student.name || "student"}">
                  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 21c-.6 0-1.1-.2-1.5-.6S5 19.5 5 19V8H4V6h5V4h6v2h5v2h-1v11c0 .6-.2 1.1-.6 1.5s-.9.6-1.5.6H7ZM17 8H7v11h10V8Zm-8 9h2v-7H9v7Zm4 0h2v-7h-2v7Z"/></svg>
                </button>
              </span>
            </div>
          `).join("")}
        ` : ""}
      </div>
    </details>
  `;
}

function getMonthReceiptInfo(student, row, month) {
  const matchingHeads = getFeeHeadMatchingHeads(row.name);
  const payments = getSessionPayments(student.admissionNo)
    .filter(payment => (payment.allocations || []).some(allocation => matchingHeads.includes(allocation.head) && allocation.month === month));
  const latest = payments[0] || {};
  return {
    receipt: latest.receipt || "Preview",
    date: latest.date || formatDateDDMMYYYY(new Date())
  };
}

function openMonthReceiptPreview(admissionNo, feeHead, month) {
  const student = findActiveStudentByAdmissionNo(admissionNo) || findStudentByAdmissionNo(admissionNo);
  if (!student || !month) {
    showToast("Receipt preview data not found.");
    return;
  }
  const row = getLedgerRows(student).find(item => item.name === feeHead);
  if (!row) {
    showToast("Fee row not found for receipt preview.");
    return;
  }
  const monthPayment = getLedgerMonthPaymentSplit(student, row, month);
  const monthFine = getLedgerMonthFineAmount(student, row, month);
  const amount = Number(row.monthlyAmount || 0);
  const total = monthPayment.amount > 0 ? monthPayment.amount : amount + monthFine;
  const bank = monthPayment.bank || 0;
  const cash = monthPayment.cash || 0;
  const receiptInfo = getMonthReceiptInfo(student, row, month);
  receiptPreviewBody.innerHTML = `
    <article class="receipt-preview-card">
      <div class="receipt-preview-banner">
        <div>
          <p>Alfred Nobel Public School</p>
          <h3>Fee Receipt</h3>
          <p>${escapeHtml(feeHead)} | ${escapeHtml(month)} | Session ${escapeHtml(activeSession)}</p>
        </div>
        <div class="receipt-preview-stamp">${escapeHtml(receiptInfo.receipt)}</div>
      </div>
      <div class="receipt-preview-grid">
        <div><span>Admission No.</span><strong>${escapeHtml(student.admissionNo || "-")}</strong></div>
        <div><span>Student Name</span><strong>${escapeHtml(student.name || "-")}</strong></div>
        <div><span>Class</span><strong>${escapeHtml(student.klass || "-")}</strong></div>
        <div><span>Date</span><strong>${formatDateDDMMYYYY(receiptInfo.date)}</strong></div>
        <div><span>Fee Amount</span><strong>${formatRs(amount)}</strong></div>
        <div><span>Fine</span><strong>${formatRs(monthFine)}</strong></div>
        <div><span>Bank Payment</span><strong>${formatRs(bank)}</strong></div>
        <div><span>Cash Payment</span><strong>${formatRs(cash)}</strong></div>
      </div>
      <div class="receipt-preview-total">
        <span>Total Amount</span>
        <strong>${formatRs(total)}</strong>
      </div>
    </article>
  `;
  receiptPreviewModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
}

function openPaymentReceiptPreview(admissionNo, feeHead, receiptNo) {
  const student = findActiveStudentByAdmissionNo(admissionNo) || findStudentByAdmissionNo(admissionNo);
  const payment = getSessionPayments(admissionNo).find(item => item.receipt === receiptNo);
  if (!student || !payment) {
    showToast("Receipt preview data not found.");
    return;
  }
  const matchingHeads = getFeeHeadMatchingHeads(feeHead);
  const allocations = (payment.allocations || []).filter(allocation => matchingHeads.includes(allocation.head));
  const amount = allocations.reduce((sum, allocation) => sum + Number(allocation.amount || 0), 0);
  const fineHead = getLateFineHeadForFee(feeHead);
  const fine = ["Tuition Fee", "Transport Fees"].includes(feeHead) ? allocations
    .filter(allocation => allocation.head === fineHead)
    .reduce((sum, allocation) => sum + Number(allocation.amount || 0), 0) : 0;
  const split = getPaymentSplitForAmount(payment, amount);
  const months = [...new Set(allocations.map(allocation => allocation.month).filter(Boolean))];
  receiptPreviewBody.innerHTML = `
    <article class="receipt-preview-card">
      <div class="receipt-preview-banner">
        <div>
          <p>Alfred Nobel Public School</p>
          <h3>Fee Receipt</h3>
          <p>${escapeHtml(feeHead || "Payment")} ${months.length ? `| ${escapeHtml(months.join(", "))}` : ""} | Session ${escapeHtml(activeSession)}</p>
        </div>
        <div class="receipt-preview-stamp">${escapeHtml(payment.receipt || "Preview")}</div>
      </div>
      <div class="receipt-preview-grid">
        <div><span>Admission No.</span><strong>${escapeHtml(student.admissionNo || "-")}</strong></div>
        <div><span>Student Name</span><strong>${escapeHtml(student.name || "-")}</strong></div>
        <div><span>Class</span><strong>${escapeHtml(student.klass || "-")}</strong></div>
        <div><span>Date</span><strong>${formatDateDDMMYYYY(payment.date)}</strong></div>
        <div><span>Fee Amount</span><strong>${formatRs(Math.max(amount - fine, 0))}</strong></div>
        <div><span>Fine</span><strong>${formatRs(fine)}</strong></div>
        <div><span>Bank Payment</span><strong>${formatRs(split.bank)}</strong></div>
        <div><span>Cash Payment</span><strong>${formatRs(split.cash)}</strong></div>
      </div>
      <div class="receipt-preview-total">
        <span>Total Amount</span>
        <strong>${formatRs(amount)}</strong>
      </div>
    </article>
  `;
  receiptPreviewModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
}

function openSelectedPaymentPreview(admissionNo, feeHead) {
  const student = findActiveStudentByAdmissionNo(admissionNo) || findStudentByAdmissionNo(admissionNo);
  const selectedReceipts = [...document.querySelectorAll("input[data-select-payment]:checked")]
    .filter(input => input.dataset.selectPayment === admissionNo && input.dataset.feeHead === feeHead)
    .map(input => input.value);
  if (!student || !selectedReceipts.length) {
    showToast("Select at least one payment row.");
    return;
  }
  const matchingHeads = getFeeHeadMatchingHeads(feeHead);
  const rows = getSessionPayments(student.admissionNo)
    .filter(payment => selectedReceipts.includes(payment.receipt))
    .map(payment => {
      const allocations = (payment.allocations || []).filter(allocation => matchingHeads.includes(allocation.head));
      const amount = allocations.reduce((sum, allocation) => sum + Number(allocation.amount || 0), 0);
      if (amount <= 0) return null;
      const fineHead = getLateFineHeadForFee(feeHead);
      const fine = allocations
        .filter(allocation => allocation.head === fineHead)
        .reduce((sum, allocation) => sum + Number(allocation.amount || 0), 0);
      const split = getPaymentSplitForAmount(payment, amount);
      return {date: payment.date, receipt: payment.receipt, bank: split.bank, cash: split.cash, fine, total: amount};
    })
    .filter(Boolean);
  const totals = rows.reduce((sum, row) => {
    sum.bank += row.bank;
    sum.cash += row.cash;
    sum.fine += row.fine;
    sum.total += row.total;
    return sum;
  }, {bank: 0, cash: 0, fine: 0, total: 0});
  document.getElementById("receiptPreviewTitle").textContent = "Selected Payment Preview";
  receiptPreviewBody.innerHTML = `
    <article class="receipt-preview-card yearly-payment-preview month-wise-review-card">
      <div class="receipt-preview-banner">
        <div>
          <p>Alfred Nobel Public School</p>
          <h3>Selected Payment Details</h3>
          <p>${escapeHtml(feeHead)} | Session ${escapeHtml(activeSession)}</p>
        </div>
        <div class="receipt-preview-stamp">${escapeHtml(student.admissionNo || "-")}</div>
      </div>
      <div class="yearly-preview-meta">
        <div><span>Student Name</span><strong>${escapeHtml(student.name || "-")}</strong></div>
        <div><span>Class</span><strong>${escapeHtml(student.klass || "-")}</strong></div>
        <div><span>Selected Total</span><strong>${formatRs(totals.total)}</strong></div>
      </div>
      <div class="yearly-preview-table-wrap">
        <table class="yearly-preview-table">
          <thead><tr><th>Date</th><th>Receipt No.</th><th>Bank</th><th>Cash</th><th>Fine</th><th>Total</th></tr></thead>
          <tbody>${rows.map(row => `
            <tr><td>${formatDateDDMMYYYY(row.date)}</td><td>${escapeHtml(row.receipt || "-")}</td><td>${formatRs(row.bank)}</td><td>${formatRs(row.cash)}</td><td>${formatRs(row.fine)}</td><td>${formatRs(row.total)}</td></tr>
          `).join("")}</tbody>
          <tfoot><tr><td colspan="2">Total</td><td>${formatRs(totals.bank)}</td><td>${formatRs(totals.cash)}</td><td>${formatRs(totals.fine)}</td><td>${formatRs(totals.total)}</td></tr></tfoot>
        </table>
      </div>
    </article>
  `;
  receiptPreviewModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  document.querySelectorAll("input[data-select-payment]:checked").forEach(input => {
    input.checked = false;
  });
}

function closeReceiptPreview() {
  receiptPreviewModal.setAttribute("aria-hidden", "true");
  document.getElementById("receiptPreviewTitle").textContent = "Receipt Preview";
  const printButton = document.getElementById("printReceiptPreview");
  if (printButton) printButton.hidden = true;
  document.body.classList.remove("modal-open");
}

function openReceiptPreviewWithPrint(title, html) {
  document.getElementById("receiptPreviewTitle").textContent = title;
  receiptPreviewBody.innerHTML = html;
  const printButton = document.getElementById("printReceiptPreview");
  if (printButton) printButton.hidden = false;
  receiptPreviewModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
}

function openCombinedReceiptPreview(student, payment, selectedItems = []) {
  if (!student || !payment) return;
  const fineTotal = selectedItems.reduce((sum, item) => sum + Number(item.fine || 0), 0);
  const feeTotal = selectedItems.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const selectedTotal = selectedItems.reduce((sum, item) => sum + Number(item.total || 0), 0);
  const discount = Number(payment.discountAmount || 0);
  const paidNow = Number(payment.bankAmount || 0) + Number(payment.cashAmount || 0);
  const totalPayable = Math.max(selectedTotal - discount, 0);
  const dueBalance = Math.max(totalPayable - paidNow, 0);
  const rows = selectedItems.map(item => `
    <tr>
      <td>${escapeHtml(item.head || "-")}</td>
      <td>${escapeHtml(item.month || "-")}</td>
      <td>${formatRs(item.amount || 0)}</td>
      <td>${formatRs(item.fine || 0)}</td>
      <td>${formatRs(item.total || 0)}</td>
    </tr>
  `).join("");
  openReceiptPreviewWithPrint("Combined Receipt Preview", `
    <article class="receipt-preview-card yearly-payment-preview combined-receipt-preview-card">
      <div class="receipt-preview-banner">
        <div>
          <p>Alfred Nobel Public School</p>
          <h3>Combined Fee Receipt</h3>
          <p>Session ${escapeHtml(activeSession)} | ${escapeHtml(payment.date || "")}</p>
        </div>
        <div class="receipt-preview-stamp">${escapeHtml(payment.receipt || "Preview")}</div>
      </div>
      <div class="yearly-preview-meta">
        <div><span>Admission No.</span><strong>${escapeHtml(student.admissionNo || "-")}</strong></div>
        <div><span>Student</span><strong>${escapeHtml(student.name || "-")}</strong></div>
        <div><span>Class</span><strong>${escapeHtml(student.klass || "-")}</strong></div>
      </div>
      <div class="yearly-preview-table-wrap">
        <table class="yearly-preview-table">
          <thead><tr><th>Fee Head</th><th>Month</th><th>Amount</th><th>Fine</th><th>Total</th></tr></thead>
          <tbody>${rows || `<tr><td colspan="5">No fee details found.</td></tr>`}</tbody>
          <tfoot><tr><td colspan="2">Total</td><td>${formatRs(feeTotal)}</td><td>${formatRs(fineTotal)}</td><td>${formatRs(selectedTotal)}</td></tr></tfoot>
        </table>
      </div>
      <div class="receipt-preview-grid">
        <div><span>Total Fees</span><strong>${formatRs(selectedTotal)}</strong></div>
        <div><span>Total Payable</span><strong>${formatRs(totalPayable)}</strong></div>
        <div><span>Bank Payment</span><strong>${formatRs(payment.bankAmount)}</strong></div>
        <div><span>Cash Payment</span><strong>${formatRs(payment.cashAmount)}</strong></div>
        <div><span>Discount</span><strong>${formatRs(discount)}</strong></div>
        <div><span>Collected By</span><strong>${escapeHtml(payment.by || "-")}</strong></div>
      </div>
      <div class="receipt-preview-total combined-receipt-total-row">
        <div>
          <span>Paid Now</span>
          <strong>${formatRs(paidNow)}</strong>
        </div>
        <div class="${dueBalance > 0 ? "receipt-due-balance" : "receipt-clear-balance"}">
          <span>Due Balance</span>
          <strong>${formatRs(dueBalance)}</strong>
        </div>
      </div>
    </article>
  `);
}

function openSavedReceiptPreview(admissionNo, receiptNo) {
  const student = findActiveStudentByAdmissionNo(admissionNo) || findStudentByAdmissionNo(admissionNo);
  const payment = mergePaymentsForReceipt(admissionNo, receiptNo);
  if (!student || !payment) {
    showToast("Receipt preview data not found.");
    return;
  }
  const items = (payment.allocations || []).reduce((rows, allocation) => {
    const fineHead = ["Tuition Late Fine", "Transport Late Fine"].includes(allocation.head);
    if (fineHead) {
      const target = rows.find(row => row.month === allocation.month) || rows[rows.length - 1];
      if (target) target.fine += Number(allocation.amount || 0);
      else rows.push({head: allocation.head, month: allocation.month || "-", amount: 0, fine: Number(allocation.amount || 0), total: Number(allocation.amount || 0)});
    } else {
      rows.push({head: allocation.head || "-", month: allocation.month || "-", amount: Number(allocation.amount || 0), fine: 0, total: Number(allocation.amount || 0)});
    }
    return rows;
  }, []);
  items.forEach(item => {
    item.total = Number(item.amount || 0) + Number(item.fine || 0);
  });
  openCombinedReceiptPreview(student, payment, items);
}

function openAdmissionFormPreview(admissionNo) {
  const student = findActiveStudentByAdmissionNo(admissionNo) || findStudentByAdmissionNo(admissionNo);
  if (!student) {
    showToast("Admission preview data not found.");
    return;
  }
  const feeMonths = Array.isArray(student.feeMonths) ? student.feeMonths.join(", ") : "-";
  const services = Array.isArray(student.otherServices) && student.otherServices.length ? student.otherServices.join(", ") : "-";
  const detailRows = [
    ["Admission No.", student.admissionNo],
    ["Student Name", student.name],
    ["Student Type", student.studentType],
    ["Class", student.klass],
    ["Date of Birth", student.dob],
    ["Gender", student.gender],
    ["Blood Group", student.bloodGroup],
    ["Nationality", student.nationality],
    ["Religion", student.religion],
    ["Mother Tongue", student.motherTongue],
    ["Village/Town", student.villageTown]
  ];
  const parentRows = [
    ["Father's Name", student.fatherName],
    ["Father's Mobile", student.fatherMobile],
    ["Father's Occupation", student.fatherOccupation],
    ["Father's Qualification", student.fatherQualification],
    ["Father Works At", student.fatherWorkType],
    ["Father Annual Income", student.fatherAnnualIncome ? formatRs(student.fatherAnnualIncome) : "-"],
    ["Father Email", student.fatherEmail],
    ["Mother's Name", student.motherName],
    ["Mother's Mobile", student.motherMobile],
    ["Mother's Occupation", student.motherOccupation],
    ["Mother's Qualification", student.motherQualification],
    ["Mother Works At", student.motherWorkType],
    ["Mother Annual Income", student.motherAnnualIncome ? formatRs(student.motherAnnualIncome) : "-"]
  ];
  const contactRows = [
    ["Local Guardian", student.guardian],
    ["Guardian Mobile", student.mobile],
    ["Email", student.email],
    ["Address", student.address],
    ["Route", student.route],
    ["Transport Required", student.transportRequired ? "Yes" : "No"]
  ];
  const medicalRows = [
    ["Medical Conditions", student.medicalConditions],
    ["Allergies", student.allergies],
    ["Regular Medicine", student.regularMedicine],
    ["Emergency Contact", student.emergencyContactNumber]
  ];
  const feeRows = [
    ["Admission Fee", formatRs(student.admissionFee || 0)],
    ["Annual Fee", formatRs(student.annualFee || 0)],
    ["Form Fee", formatRs(student.formFee || 0)],
    ["Tuition Fee", formatRs(student.tuitionFee || 0)],
    ["Tuition Months", feeMonths],
    ["Transport Fee", formatRs(student.transportFee || 0)],
    ["Special Transport Fee", formatRs(student.specialTransportFee || 0)],
    ["Applicable Services", services],
    ["Day Boarding Fee", formatRs(student.dayBoardingFee || 0)],
    ["Tiffin Fee", formatRs(student.othersFee || 0)],
    ["Robotics Fee", formatRs(student.roboticsFee || 0)]
  ];
  const renderRows = rows => rows.map(([label, value]) => `
    <tr><th>${escapeHtml(label)}</th><td>${escapeHtml(value || "-")}</td></tr>
  `).join("");
  openReceiptPreviewWithPrint("Admission Form Preview", `
    <article class="receipt-preview-card admission-form-preview-card">
      <div class="receipt-preview-banner">
        <div>
          <p>Alfred Nobel Public School</p>
          <h3>Admission Form Preview</h3>
          <p>${escapeHtml(student.name || "Student")} | ${escapeHtml(student.klass || "-")}</p>
        </div>
        <div class="receipt-preview-stamp">${escapeHtml(student.admissionNo || "-")}</div>
      </div>
      <div class="admission-preview-profile">
        <div class="admission-preview-photo">${student.photo ? `<img src="${student.photo}" alt="${escapeHtml(student.name || "Student")} photo" />` : escapeHtml(String(student.name || "ST").split(" ").map(part => part[0]).join("").slice(0, 2).toUpperCase())}</div>
        <div>
          <h3>${escapeHtml(student.name || "-")}</h3>
          <p>${escapeHtml(student.admissionNo || "-")} | ${escapeHtml(student.klass || "-")} | ${escapeHtml(student.studentType || "-")}</p>
        </div>
      </div>
      <div class="admission-preview-grid">
        <section><h4>Student Details</h4><table>${renderRows(detailRows)}</table></section>
        <section><h4>Parents/Guardian Information</h4><table>${renderRows(parentRows)}</table></section>
        <section><h4>Local Guardian & Contact</h4><table>${renderRows(contactRows)}</table></section>
        <section><h4>Medical Information</h4><table>${renderRows(medicalRows)}</table></section>
      </div>
      <div class="admission-preview-fees">
        <h4>Fee Details</h4>
        <table>${renderRows(feeRows)}</table>
      </div>
    </article>
  `);
}

function getLedgerMonthlyPaymentReport(student, row) {
  const matchingHeads = getFeeHeadMatchingHeads(row.name);
  const months = Array.isArray(row.months) ? row.months : [];
  const reports = months.reduce((items, month) => {
    items[month] = {month, bank: 0, cash: 0, fine: 0, total: 0, receipts: new Set(), dates: new Set()};
    return items;
  }, {});
  getSessionPayments(student.admissionNo).forEach(payment => {
    (payment.allocations || []).forEach(allocation => {
      if (!matchingHeads.includes(allocation.head)) return;
      const month = allocation.month || "General";
      const amount = Number(allocation.amount || 0);
      if (!reports[month]) reports[month] = {month, bank: 0, cash: 0, fine: 0, total: 0, receipts: new Set(), dates: new Set()};
      const split = getPaymentSplitForAmount(payment, amount);
      reports[month].bank += split.bank;
      reports[month].cash += split.cash;
      reports[month].total += amount;
      if (["Tuition Late Fine", "Transport Late Fine"].includes(allocation.head)) reports[month].fine += amount;
      if (payment.receipt) reports[month].receipts.add(payment.receipt);
      if (payment.date) reports[month].dates.add(formatDateDDMMYYYY(payment.date));
    });
  });
  const orderedMonths = [
    ...months,
    ...Object.keys(reports).filter(month => !months.includes(month)).sort((a, b) => a.localeCompare(b))
  ];
  return orderedMonths.map(month => ({
    ...reports[month],
    receipts: [...reports[month].receipts],
    dates: [...reports[month].dates]
  }));
}

function printLedgerPaymentPreviewContent() {
  const preview = receiptPreviewBody.querySelector(".yearly-payment-preview, .receipt-preview-card");
  if (!preview) {
    showToast("Payment preview not found.");
    return;
  }
  const printWindow = window.open("", "_blank", "width=760,height=820");
  if (!printWindow) {
    showToast("Popup blocked. Allow popup to print.");
    return;
  }
  printWindow.document.write(`
    <html>
      <head>
        <title>Payment Details Preview</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 24px; color: #172033; }
          .preview-print-action { display: none; }
          .receipt-preview-card { border: 1px solid #cfe0ea; border-radius: 10px; overflow: hidden; }
          .receipt-preview-banner { display: grid; grid-template-columns: 1fr auto; gap: 14px; padding: 18px; background: #123456; color: #fff; }
          .receipt-preview-banner h3 { margin: 2px 0 4px; font-size: 22px; }
          .receipt-preview-banner p { margin: 0; font-size: 13px; }
          .receipt-preview-stamp { align-self: center; padding: 8px 12px; border: 1px solid #fff; border-radius: 999px; font-weight: 700; }
          .yearly-preview-meta { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; padding: 14px; background: #f8fbfd; }
          .yearly-preview-meta div { border: 1px solid #dce8ef; border-radius: 8px; padding: 10px; }
          span { color: #687386; font-size: 11px; font-weight: 700; text-transform: uppercase; display: block; }
          strong { display: block; margin-top: 3px; }
          table { width: calc(100% - 28px); margin: 14px; border-collapse: collapse; }
          th, td { border: 1px solid #d8dde8; padding: 10px; text-align: left; font-size: 13px; }
          th { background: #eef2f7; }
          tfoot td { background: #fff8e8; font-weight: 700; }
        </style>
      </head>
      <body>${preview.outerHTML}<script>window.print();</script></body>
    </html>
  `);
  printWindow.document.close();
}

function printLedgerPaymentDetails(admissionNo, feeHead) {
  const student = findStudentByAdmissionNo(admissionNo);
  if (!student) return;
  const row = getLedgerRows(student).find(item => item.name === feeHead);
  if (!row) return;
  const reports = getLedgerMonthlyPaymentReport(student, row);
  const totals = reports.reduce((sum, report) => {
    sum.bank += report.bank;
    sum.cash += report.cash;
    sum.fine += report.fine;
    sum.total += report.total;
    return sum;
  }, {bank: 0, cash: 0, fine: 0, total: 0});
  const rowsHtml = reports.map(report => `
    <tr>
      <td>${escapeHtml(report.month)}</td>
      <td>${report.dates.length ? escapeHtml(report.dates.join(", ")) : "-"}</td>
      <td>${report.receipts.length ? escapeHtml(report.receipts.join(", ")) : "-"}</td>
      <td>${formatRs(report.bank)}</td>
      <td>${formatRs(report.cash)}</td>
      <td>${formatRs(report.fine)}</td>
      <td>${formatRs(report.total)}</td>
    </tr>
  `).join("") || `<tr><td colspan="7">No payment found.</td></tr>`;
  document.getElementById("receiptPreviewTitle").textContent = "Payment Details Preview";
  receiptPreviewBody.innerHTML = `
    <article class="receipt-preview-card yearly-payment-preview month-wise-review-card">
      <div class="receipt-preview-banner">
        <div>
          <p>Alfred Nobel Public School</p>
          <h3>Yearly Payment Details</h3>
          <p>${escapeHtml(feeHead)} | Session ${escapeHtml(activeSession)}</p>
        </div>
        <div class="receipt-preview-stamp">${escapeHtml(student.admissionNo || "-")}</div>
      </div>
      <div class="yearly-preview-meta">
        <div><span>Student Name</span><strong>${escapeHtml(student.name || "-")}</strong></div>
        <div><span>Class</span><strong>${escapeHtml(student.klass || "-")}</strong></div>
        <div><span>Fee Head</span><strong>${escapeHtml(feeHead || "-")}</strong></div>
      </div>
      <div class="yearly-preview-table-wrap">
        <table class="yearly-preview-table">
          <thead><tr><th>Month</th><th>Date</th><th>Receipt No.</th><th>Bank</th><th>Cash</th><th>Fine</th><th>Total</th></tr></thead>
          <tbody>${rowsHtml}</tbody>
          <tfoot><tr><td colspan="3">Total</td><td>${formatRs(totals.bank)}</td><td>${formatRs(totals.cash)}</td><td>${formatRs(totals.fine)}</td><td>${formatRs(totals.total)}</td></tr></tfoot>
        </table>
      </div>
      <div class="preview-print-bar">
        <button class="primary preview-print-action" type="button" data-print-ledger-preview>Print Yearly Statement</button>
      </div>
    </article>
  `;
  receiptPreviewModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
}

function getMonthlyReportHeadAmount(student, month, headName) {
  const row = getLedgerRows(student).find(item => item.name === headName);
  if (!row || !Array.isArray(row.months) || !row.months.includes(month)) return 0;
  return Number(row.monthlyAmount || 0);
}

function getMonthlyReportPaymentTotal(student, month) {
  return getSessionPayments(student.admissionNo).reduce((sum, payment) => {
    return sum + (payment.allocations || [])
      .filter(allocation => allocation.month === month)
      .reduce((monthSum, allocation) => monthSum + Number(allocation.amount || 0), 0);
  }, 0);
}

function getMonthlyReportHeadPaid(student, month, headName) {
  const matchingHeads = getFeeHeadMatchingHeads(headName);
  return getSessionPayments(student.admissionNo).reduce((sum, payment) => {
    return sum + (payment.allocations || [])
      .filter(allocation => allocation.month === month && matchingHeads.includes(allocation.head))
      .reduce((monthSum, allocation) => monthSum + Number(allocation.amount || 0), 0);
  }, 0);
}

function getMonthlyReportHeadPaymentInfo(student, month, headName) {
  const matchingHeads = getFeeHeadMatchingHeads(headName);
  const receipts = new Set();
  const dates = new Set();
  let bank = 0;
  let cash = 0;
  getSessionPayments(student.admissionNo).forEach(payment => {
    const allocations = (payment.allocations || []).filter(allocation => allocation.month === month && matchingHeads.includes(allocation.head));
    if (!allocations.length) return;
    if (payment.receipt) receipts.add(payment.receipt);
    if (payment.date) dates.add(formatDateDDMMYYYY(payment.date));
    allocations.forEach(allocation => {
      const split = getPaymentSplitForAmount(payment, Number(allocation.amount || 0));
      bank += split.bank;
      cash += split.cash;
    });
  });
  return {
    dates: [...dates].join(", ") || "-",
    receipts: [...receipts].join(", ") || "-",
    bank,
    cash
  };
}

function getStudentReportMonths(student) {
  const months = new Set();
  getLedgerRows(student).forEach(row => {
    if (!Array.isArray(row.months)) return;
    row.months.forEach(month => months.add(month));
  });
  getSessionPayments(student.admissionNo).forEach(payment => {
    (payment.allocations || []).forEach(allocation => {
      if (allocation.month) months.add(allocation.month);
    });
  });
  const ordered = ACADEMIC_MONTHS.filter(month => months.has(month));
  return ordered.length ? ordered : ACADEMIC_MONTHS;
}

function openFeeBookMonthlyReport(admissionNo = activeLedgerAdmissionNo || feeBookStudentSelect.value, selectedMonth = "") {
  const student = findActiveStudentByAdmissionOrName(admissionNo);
  if (!student) {
    showToast("Select a student first.");
    return;
  }
  const reportMonths = getStudentReportMonths(student);
  const month = reportMonths.includes(selectedMonth) ? selectedMonth : reportMonths[0];
  const tuitionRow = getLedgerRows(student).find(item => item.name === "Tuition Fee");
  const transportRow = getLedgerRows(student).find(item => item.name === "Transport Fees");
  const rows = [
    {head: "Tuition Fee", amount: getMonthlyReportHeadAmount(student, month, "Tuition Fee"), fine: tuitionRow ? getLedgerMonthDisplayFineAmount(student, tuitionRow, month) : 0},
    {head: "Transport Fees", amount: getMonthlyReportHeadAmount(student, month, "Transport Fees"), fine: transportRow ? getLedgerMonthDisplayFineAmount(student, transportRow, month) : 0},
    {head: "Day Boarding Fees", amount: getMonthlyReportHeadAmount(student, month, "Day Boarding Fees"), fine: 0},
    {head: "Tiffin Fees", amount: getMonthlyReportHeadAmount(student, month, "Tiffin Fees"), fine: 0},
    {head: "Robotics Fees", amount: getMonthlyReportHeadAmount(student, month, "Robotics Fees"), fine: 0}
  ].map(row => {
    const paid = getMonthlyReportHeadPaid(student, month, row.head);
    const paymentInfo = getMonthlyReportHeadPaymentInfo(student, month, row.head);
    const total = row.amount + row.fine;
    return {...row, ...paymentInfo, total, paid, balance: Math.max(total - paid, 0)};
  }).filter(row => row.total > 0 || row.paid > 0);
  const totals = rows.reduce((sum, row) => {
    sum.amount += row.amount;
    sum.bank += row.bank;
    sum.cash += row.cash;
    sum.fine += row.fine;
    sum.paid += row.paid;
    sum.total += row.total;
    sum.balance += row.balance;
    return sum;
  }, {amount: 0, bank: 0, cash: 0, fine: 0, paid: 0, total: 0, balance: 0});
  const rowsHtml = rows.map(row => `
    <tr class="${row.balance > 0 ? row.paid > 0 ? "partial-month" : "due-month" : "paid-month"}">
      <td>${escapeHtml(row.dates)}</td>
      <td>${escapeHtml(row.receipts)}</td>
      <td>${escapeHtml(row.head)}</td>
      <td>${formatRs(row.cash)}</td>
      <td>${formatRs(row.bank)}</td>
      <td>${formatRs(row.fine)}</td>
      <td>${formatRs(row.total)}</td>
      <td>${formatRs(row.paid)}</td>
      <td>${formatRs(row.balance)}</td>
    </tr>
  `).join("") || `<tr><td colspan="9">No monthly fee report found for ${escapeHtml(month)}.</td></tr>`;
  document.getElementById("receiptPreviewTitle").textContent = "Monthly Report";
  receiptPreviewBody.innerHTML = `
    <article class="fee-book-monthly-report">
      <div class="monthly-report-hero">
        <div>
          <p>FEE BOOK</p>
          <h3>Monthly Fee Report</h3>
          <small>${escapeHtml(student.name || "-")} | ${escapeHtml(student.admissionNo || "-")} | ${escapeHtml(student.klass || "-")}</small>
        </div>
        <label class="monthly-report-month">Month
          <select data-fee-book-monthly-report-select data-admission-no="${escapeHtml(student.admissionNo || "")}">
            ${reportMonths.map(item => `<option value="${item}" ${item === month ? "selected" : ""}>${item}</option>`).join("")}
          </select>
        </label>
      </div>
      <table class="monthly-report-table">
        <thead><tr><th>Date</th><th>Receipt No.</th><th>Fee Head</th><th>Cash</th><th>Bank</th><th>Fine</th><th>Total</th><th>Paid</th><th>Balance</th></tr></thead>
        <tbody>${rowsHtml}</tbody>
      </table>
      <div class="monthly-report-summary">
        <div><span>Total Fees</span><strong>${formatRs(totals.amount)}</strong></div>
        <div><span>Paid Fees</span><strong>${formatRs(totals.paid)}</strong></div>
        <div><span>Fine</span><strong>${formatRs(totals.fine)}</strong></div>
        <div><span>Balance</span><strong>${formatRs(totals.balance)}</strong></div>
      </div>
    </article>
  `;
  receiptPreviewModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
}

function escapeHtml(value = "") {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  }[char]));
}

function normalizeVillageName(value = "") {
  return String(value).trim().replace(/\s+/g, " ").toLowerCase();
}

const TRANSPORT_VILLAGE_NAME_FIXES = new Map([
  ["bara balun", "Barabalun"],
  ["bara-balun", "Barabalun"],
  ["bara_balun", "Barabalun"],
  ["barabalun", "Barabalun"],
  ["samamnti", "Samanti"],
  ["samamanti", "Samanti"],
  ["sammanti", "Samanti"],
  ["samanti", "Samanti"]
]);

function canonicalTransportVillageName(value = "") {
  const clean = String(value || "").trim().replace(/\s+/g, " ");
  if (!clean) return "";
  const key = normalizeVillageName(clean);
  return TRANSPORT_VILLAGE_NAME_FIXES.get(key) || TRANSPORT_VILLAGE_NAME_FIXES.get(key.replace(/[-_]+/g, " ")) || clean;
}

function findTransportVillageByName(name, exceptName = "") {
  const target = normalizeVillageName(name);
  const except = normalizeVillageName(exceptName);
  return transportVillages.find(village => normalizeVillageName(village) === target && normalizeVillageName(village) !== except);
}

function renameTransportVillageReferences(oldName = "", newName = "") {
  const cleanOld = normalizeVillageName(oldName);
  const cleanNewName = canonicalTransportVillageName(newName);
  if (!cleanOld || !cleanNewName) return false;
  const cleanNew = normalizeVillageName(cleanNewName);
  let changed = false;
  transportVillages.forEach((village, index) => {
    if (normalizeVillageName(village) === cleanOld && village !== cleanNewName) {
      transportVillages[index] = cleanNewName;
      changed = true;
    }
  });
  Object.keys(transportVillageDistances).forEach(village => {
    if (normalizeVillageName(village) === cleanOld && village !== cleanNewName) {
      if (!transportVillageDistances[cleanNewName]) transportVillageDistances[cleanNewName] = transportVillageDistances[village];
      delete transportVillageDistances[village];
      changed = true;
    }
  });
  Object.keys(transportVillageFees).forEach(village => {
    if (normalizeVillageName(village) === cleanOld && village !== cleanNewName) {
      transportVillageFees[cleanNewName] = {...(transportVillageFees[cleanNewName] || {}), ...(transportVillageFees[village] || {})};
      delete transportVillageFees[village];
      changed = true;
    }
  });
  transportRoutePickupPoints.forEach(point => {
    if (normalizeVillageName(point.villageName || "") === cleanOld && point.villageName !== cleanNewName) {
      point.villageName = cleanNewName;
      changed = true;
    }
  });
  students.forEach(student => {
    if (normalizeVillageName(student.villageTown || "") === cleanOld && student.villageTown !== cleanNewName) {
      student.villageTown = cleanNewName;
      changed = true;
    }
  });
  admissionEnquiries.forEach(enquiry => {
    if (normalizeVillageName(enquiry.villageTown || "") === cleanOld && enquiry.villageTown !== cleanNewName) {
      enquiry.villageTown = cleanNewName;
      changed = true;
    }
  });
  return changed;
}

function applyTransportVillageNameFixes() {
  let changed = false;
  const names = new Set([
    ...transportVillages,
    ...Object.keys(transportVillageDistances),
    ...Object.keys(transportVillageFees),
    ...transportRoutePickupPoints.map(point => point.villageName),
    ...students.map(student => student.villageTown),
    ...admissionEnquiries.map(enquiry => enquiry.villageTown)
  ].map(name => String(name || "").trim()).filter(Boolean));
  names.forEach(name => {
    const canonical = canonicalTransportVillageName(name);
    if (canonical && (canonical !== name || normalizeVillageName(canonical) !== normalizeVillageName(name))) {
      changed = renameTransportVillageReferences(name, canonical) || changed;
    }
  });
  if (changed) dedupeTransportVillages();
  return changed;
}

function dedupeTransportVillages() {
  const seen = new Set();
  for (let index = transportVillages.length - 1; index >= 0; index -= 1) {
    transportVillages[index] = canonicalTransportVillageName(transportVillages[index]);
    const key = normalizeVillageName(transportVillages[index]);
    if (!key || seen.has(key)) {
      transportVillages.splice(index, 1);
    } else {
      seen.add(key);
    }
  }
}

function getTransportMapUrl(village) {
  const destination = `${village}, Purba Bardhaman, West Bengal`;
  return `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(TRANSPORT_SCHOOL_MAP_QUERY)}&destination=${encodeURIComponent(destination)}&travelmode=driving`;
}

function renderTransportVillages() {
  const rows = document.getElementById("transportVillageRows");
  const count = document.getElementById("transportVillageCount");
  if (!rows) return;
  dedupeTransportVillages();
  const searchTerm = normalizeVillageName(document.getElementById("transportVillageSearch")?.value || "");
  const sortedVillages = transportVillages.slice().sort((first, second) => first.localeCompare(second, "en", {sensitivity: "base"}));
  const visibleVillages = searchTerm
    ? sortedVillages.filter(village => normalizeVillageName(village).includes(searchTerm))
    : sortedVillages;
  rows.innerHTML = visibleVillages.map(village => {
    const distance = transportVillageDistances[village] || "";
    const fees = transportVillageFees[village] || {};
    return `
      <tr>
        <td>
          <input class="transport-village-name-input" data-village-name="${escapeHtml(village)}" value="${escapeHtml(village)}" aria-label="Edit village name" />
        </td>
        <td>
          <label class="transport-distance-field">
            <input data-village-distance="${escapeHtml(village)}" type="number" min="0" step="0.1" value="${escapeHtml(distance)}" placeholder="KM" />
            <span>km</span>
          </label>
        </td>
        <td><label class="transport-fee-field"><input data-village-fee="${escapeHtml(village)}" data-fee-type="newStudentFee" type="number" min="0" value="${escapeHtml(fees.newStudentFee || "")}" placeholder="0" /></label></td>
        <td><label class="transport-fee-field"><input data-village-fee="${escapeHtml(village)}" data-fee-type="promotedStudentFee" type="number" min="0" value="${escapeHtml(fees.promotedStudentFee || "")}" placeholder="0" /></label></td>
        <td><label class="transport-fee-field"><input data-village-fee="${escapeHtml(village)}" data-fee-type="specialStudentFee" type="number" min="0" value="${escapeHtml(fees.specialStudentFee || "")}" placeholder="0" /></label></td>
        <td><a class="mini map-link" href="${getTransportMapUrl(village)}" target="_blank" rel="noopener">Map</a></td>
        <td>
          <button class="icon-action delete" data-delete-village="${escapeHtml(village)}" type="button" title="Delete village" aria-label="Delete ${escapeHtml(village)}">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 21c-.6 0-1.1-.2-1.5-.6S5 19.5 5 19V8H4V6h5V4h6v2h5v2h-1v11c0 .6-.2 1.1-.6 1.5s-.9.6-1.5.6H7ZM17 8H7v11h10V8Zm-8 9h2v-7H9v7Zm4 0h2v-7h-2v7Z"/></svg>
          </button>
        </td>
      </tr>
    `;
  }).join("") || `<tr><td colspan="7">No village matched your search.</td></tr>`;
  if (count) count.textContent = searchTerm
    ? `${visibleVillages.length} of ${transportVillages.length} villages`
    : `${transportVillages.length} villages`;
  renderRoutePickupOptions();
}

function renderTransportVehicles() {
  const rows = document.getElementById("transportVehicleRows");
  if (!rows) return;
  rows.innerHTML = transportVehicles.map((vehicle, index) => `
    <tr>
      <td><strong>${escapeHtml(vehicle.vehicleNo || "-")}</strong></td>
      <td>${escapeHtml(vehicle.vehicleName || "-")}</td>
      <td>${escapeHtml(vehicle.driverName || "-")}</td>
      <td>${escapeHtml(vehicle.driverMobile || "-")}</td>
      <td><span class="status-pill stable">${escapeHtml(vehicle.status || "Active")}</span></td>
      <td class="inline-actions">
        <button class="icon-action edit" type="button" data-edit-transport-vehicle="${index}" title="Edit vehicle" aria-label="Edit ${escapeHtml(vehicle.vehicleNo || "vehicle")}">✎</button>
        <button class="icon-action delete" type="button" data-delete-transport-vehicle="${index}" title="Delete vehicle" aria-label="Delete ${escapeHtml(vehicle.vehicleNo || "vehicle")}">×</button>
      </td>
    </tr>
  `).join("") || `<tr><td colspan="6">No vehicles entered yet.</td></tr>`;
  renderTransportAssignmentOptions();
}

function renderTransportRoutes() {
  const rows = document.getElementById("transportRouteRows");
  if (!rows) return;
  rows.innerHTML = transportRoutes.map((route, index) => `
    <tr>
      <td><strong>${escapeHtml(route.routeName || "-")}</strong></td>
      <td>${escapeHtml(route.routeNote || "-")}</td>
      <td><span class="status-pill stable">${escapeHtml(route.status || "Active")}</span></td>
      <td class="inline-actions">
        <button class="icon-action edit" type="button" data-edit-transport-route="${index}" title="Edit route" aria-label="Edit ${escapeHtml(route.routeName || "route")}">✎</button>
        <button class="icon-action delete" type="button" data-delete-transport-route="${index}" title="Delete route" aria-label="Delete ${escapeHtml(route.routeName || "route")}">×</button>
      </td>
    </tr>
  `).join("") || `<tr><td colspan="4">No routes entered yet.</td></tr>`;
  renderTransportAssignmentOptions();
  renderRoutePickupOptions();
}

function getTransportVehicleByNo(vehicleNo = "") {
  const clean = String(vehicleNo || "").trim().toUpperCase();
  return transportVehicles.find(vehicle => String(vehicle.vehicleNo || "").trim().toUpperCase() === clean) || null;
}

function renderTransportAssignmentOptions() {
  const routeSelect = document.getElementById("transportAssignRouteSelect");
  const vehicleSelect = document.getElementById("transportAssignVehicleSelect");
  if (routeSelect) {
    const selected = routeSelect.value;
    routeSelect.innerHTML = `<option value="">Select route</option>${transportRoutes.map(route => `<option value="${escapeHtml(route.routeName || "")}">${escapeHtml(route.routeName || "")}</option>`).join("")}`;
    routeSelect.value = transportRoutes.some(route => route.routeName === selected) ? selected : "";
  }
  if (vehicleSelect) {
    const selected = vehicleSelect.value;
    vehicleSelect.innerHTML = `<option value="">Select vehicle</option>${transportVehicles.map(vehicle => {
      const label = `${vehicle.vehicleName || "Vehicle"} (${vehicle.vehicleNo || "-"})`;
      return `<option value="${escapeHtml(vehicle.vehicleNo || "")}">${escapeHtml(label)}</option>`;
    }).join("")}`;
    vehicleSelect.value = transportVehicles.some(vehicle => vehicle.vehicleNo === selected) ? selected : "";
  }
}

function getTransportAssignment(routeName = "", shift = "") {
  const cleanRoute = String(routeName || "").trim().toLowerCase();
  const cleanShift = String(shift || "").trim().toLowerCase();
  return transportVehicleAssignments.find(item =>
    String(item.routeName || "").trim().toLowerCase() === cleanRoute &&
    String(item.shift || "").trim().toLowerCase() === cleanShift
  ) || null;
}

function renderTransportVehicleAssignments() {
  renderTransportAssignmentOptions();
  const rows = document.getElementById("transportAssignVehicleRows");
  if (!rows) return;
  rows.innerHTML = transportVehicleAssignments.map((assignment, index) => {
    const vehicle = getTransportVehicleByNo(assignment.vehicleNo) || {};
    return `
      <tr>
        <td><strong>${escapeHtml(assignment.routeName || "-")}</strong></td>
        <td>${escapeHtml(vehicle.vehicleName || assignment.vehicleName || "-")}</td>
        <td>${escapeHtml(assignment.vehicleNo || "-")}</td>
        <td>${escapeHtml(vehicle.driverName || assignment.driverName || "-")}</td>
        <td>${escapeHtml(vehicle.driverMobile || assignment.driverMobile || "-")}</td>
        <td>${escapeHtml(assignment.shift || "-")}</td>
        <td><span class="status-pill stable">${escapeHtml(assignment.status || "Active")}</span></td>
        <td class="inline-actions">
          <button class="icon-action edit" type="button" data-edit-transport-assignment="${index}" title="Edit assignment" aria-label="Edit assignment">✎</button>
          <button class="icon-action delete" type="button" data-delete-transport-assignment="${index}" title="Delete assignment" aria-label="Delete assignment">×</button>
        </td>
      </tr>
    `;
  }).join("") || `<tr><td colspan="8">No vehicle assignments entered yet.</td></tr>`;
  renderRoutePickupOptions();
}

function getRoutePickupVillages() {
  return [...new Set(getActiveStudents()
    .map(student => canonicalTransportVillageName(student.villageTown))
    .filter(Boolean))]
    .sort((a, b) => a.localeCompare(b, "en", {sensitivity: "base"}));
}

function hasRoutePickupStudentVillage(villageName = "") {
  const cleanVillage = normalizeVillageName(villageName);
  return Boolean(cleanVillage && getRoutePickupVillages().some(village => normalizeVillageName(village) === cleanVillage));
}

function renderRoutePickupOptions() {
  const routeSelect = document.getElementById("routePickupRouteSelect");
  const villageSelect = document.getElementById("routePickupVillageSelect");
  if (routeSelect) {
    const selected = routeSelect.value;
    routeSelect.innerHTML = `<option value="">Select route</option>${transportRoutes.map(route => `<option value="${escapeHtml(route.routeName || "")}">${escapeHtml(route.routeName || "")}</option>`).join("")}`;
    routeSelect.value = transportRoutes.some(route => route.routeName === selected) ? selected : "";
  }
  if (villageSelect) {
    const selected = villageSelect.value;
    const villages = getRoutePickupVillages();
    villageSelect.innerHTML = `<option value="">Select village</option>${villages.map(village => `<option value="${escapeHtml(village)}">${escapeHtml(village)}</option>`).join("")}`;
    villageSelect.value = villages.includes(selected) ? selected : "";
  }
}

function getRoutePickupPointForVillage(villageName = "") {
  const cleanVillage = normalizeVillageName(villageName);
  const matches = transportRoutePickupPoints.filter(point =>
    normalizeVillageName(point.villageName || "") === cleanVillage
  );
  return matches.find(point => point.cleared || !String(point.routeName || "").trim()) || matches[0] || null;
}

function sortTransportRoutePickupPoints() {
  transportRoutePickupPoints.sort((a, b) =>
    String(a.routeName || "").localeCompare(String(b.routeName || ""), undefined, {numeric: true}) ||
    Number(a.sequence || 999) - Number(b.sequence || 999) ||
    String(a.villageName || "").localeCompare(String(b.villageName || ""), undefined, {numeric: true}) ||
    String(a.shift || "").localeCompare(String(b.shift || ""), undefined, {numeric: true})
  );
}

function removeRoutePickupVillageMapping(villageName = "") {
  const cleanVillage = normalizeVillageName(villageName);
  for (let i = transportRoutePickupPoints.length - 1; i >= 0; i -= 1) {
    if (normalizeVillageName(transportRoutePickupPoints[i].villageName || "") === cleanVillage) {
      transportRoutePickupPoints.splice(i, 1);
    }
  }
}

function clearRoutePickupVillageMapping(villageName = "") {
  const cleanVillageName = String(villageName || "").trim();
  if (!cleanVillageName) return;
  removeRoutePickupVillageMapping(cleanVillageName);
  transportRoutePickupPoints.push({
    routeName: "",
    villageName: cleanVillageName,
    shift: "Morning Pickup",
    time: "",
    sequence: "",
    cleared: true
  });
  sortTransportRoutePickupPoints();
}

function upsertRoutePickupVillageMapping(villageName = "", patch = {}) {
  const cleanVillageName = String(villageName || "").trim();
  if (!cleanVillageName) return false;
  if (Object.prototype.hasOwnProperty.call(patch, "routeName") && !String(patch.routeName || "").trim()) {
    clearRoutePickupVillageMapping(cleanVillageName);
    return true;
  }
  const matching = transportRoutePickupPoints
    .map((point, index) => ({point, index}))
    .filter(item => normalizeVillageName(item.point.villageName || "") === normalizeVillageName(cleanVillageName));
  const first = matching[0]?.point || {};
  const routeName = Object.prototype.hasOwnProperty.call(patch, "routeName")
    ? String(patch.routeName || "").trim()
    : String(first.routeName || "").trim();
  if (!routeName) return false;
  const shift = Object.prototype.hasOwnProperty.call(patch, "shift")
    ? String(patch.shift || "").trim()
    : String(first.shift || "Morning Pickup").trim();
  const time = Object.prototype.hasOwnProperty.call(patch, "time")
    ? String(patch.time || "").trim()
    : String(first.time || "").trim();
  const sequence = Object.prototype.hasOwnProperty.call(patch, "sequence")
    ? String(patch.sequence || "").trim()
    : String(first.sequence || "").trim();
  if (matching.length) {
    matching.forEach(({point}, index) => {
      point.routeName = routeName;
      point.villageName = cleanVillageName;
      delete point.cleared;
      if (index === 0) {
        point.shift = shift || "Morning Pickup";
        point.time = time;
        point.sequence = sequence;
      }
    });
  } else {
    transportRoutePickupPoints.push({
      routeName,
      villageName: cleanVillageName,
      shift: shift || "Morning Pickup",
      time,
      sequence,
      cleared: false
    });
  }
  const seen = new Set();
  for (let i = transportRoutePickupPoints.length - 1; i >= 0; i -= 1) {
    const point = transportRoutePickupPoints[i];
    const key = [
      normalizeVillageName(point.villageName || ""),
      String(point.routeName || "").trim().toLowerCase(),
      String(point.shift || "").trim().toLowerCase()
    ].join("|");
    if (seen.has(key)) {
      transportRoutePickupPoints.splice(i, 1);
    } else {
      seen.add(key);
    }
  }
  sortTransportRoutePickupPoints();
  return true;
}

function studentTakesTransport(student = {}) {
  const services = Array.isArray(student.otherServices) ? student.otherServices : [];
  return Boolean(
    student.transportRequired ||
    services.includes("Transport") ||
    services.includes("Special/Custom") ||
    Number(student.transportFee || 0) > 0
  );
}

function getTransportStudentsByVillage(villageName = "") {
  const clean = normalizeVillageName(villageName);
  return getActiveStudents()
    .filter(student => studentTakesTransport(student))
    .filter(student => normalizeVillageName(student.villageTown || "") === clean)
    .sort((a, b) => String(a.name || "").localeCompare(String(b.name || "")));
}

function getTransportRouteStudentSummary() {
  const summary = new Map();
  transportRoutePickupPoints.forEach(point => {
    if (!hasRoutePickupStudentVillage(point.villageName)) return;
    const routeName = String(point.routeName || "").trim();
    if (!routeName) return;
    if (!summary.has(routeName)) {
      summary.set(routeName, {
        routeName,
        pickupPoints: new Set(),
        trips: new Set(),
        students: new Map()
      });
    }
    const entry = summary.get(routeName);
    if (point.villageName) entry.pickupPoints.add(point.villageName);
    if (point.shift) entry.trips.add(point.shift);
    getTransportStudentsByVillage(point.villageName).forEach(student => {
      const key = student.admissionNo || student.name || `${point.villageName}-${entry.students.size}`;
      if (!entry.students.has(key)) {
        entry.students.set(key, {
          admissionNo: student.admissionNo || "-",
          name: student.name || "-",
          className: student.className || student.class || "-",
          section: student.section || "-",
          villageName: point.villageName || student.villageTown || "-"
        });
      }
    });
  });
  return [...summary.values()].sort((a, b) =>
    String(a.routeName || "").localeCompare(String(b.routeName || ""), undefined, {numeric: true})
  );
}

function renderTransportRouteStudentCounts() {
  const select = document.getElementById("routePickupCountRoute");
  const summaryBox = document.getElementById("routePickupCountSummary");
  if (!select || !summaryBox) return;
  const selected = select.value;
  const summary = getTransportRouteStudentSummary();
  select.innerHTML = `<option value="">All routes</option>${summary.map(item =>
    `<option value="${escapeHtml(item.routeName)}">${escapeHtml(item.routeName)}</option>`
  ).join("")}`;
  select.value = summary.some(item => item.routeName === selected) ? selected : "";
  const filtered = select.value ? summary.filter(item => item.routeName === select.value) : summary;
  const totalStudents = filtered.reduce((total, item) => total + item.students.size, 0);
  summaryBox.innerHTML = filtered.length ? `
    <div class="transport-route-count-total">
      <strong>${totalStudents}</strong>
      <span>${select.value ? "students in selected route" : "students in all mapped routes"}</span>
    </div>
    <table>
      <thead><tr><th>Route</th><th>Pickup</th><th>Trip</th><th>Student</th><th>Details</th></tr></thead>
      <tbody>
        ${filtered.map(item => `
          <tr>
            <td>${escapeHtml(item.routeName)}</td>
            <td>${item.pickupPoints.size}</td>
            <td>${item.trips.size}</td>
            <td><strong>${item.students.size}</strong></td>
            <td><button class="mini route-student-view-btn" type="button" data-view-route-students="${escapeHtml(item.routeName)}">View</button></td>
          </tr>
        `).join("")}
      </tbody>
    </table>
  ` : `<span>No route mapped yet.</span>`;
}

function showTransportRouteStudentDetails(routeName = "") {
  const panel = document.getElementById("routePickupStudentDetails");
  if (!panel) return;
  const route = getTransportRouteStudentSummary().find(item =>
    String(item.routeName || "").trim().toLowerCase() === String(routeName || "").trim().toLowerCase()
  );
  if (!route) {
    panel.hidden = true;
    panel.innerHTML = "";
    return;
  }
  const students = [...route.students.values()].sort((a, b) =>
    String(a.name || "").localeCompare(String(b.name || ""), undefined, {numeric: true})
  );
  panel.hidden = false;
  panel.innerHTML = `
    <div class="transport-route-student-head">
      <div>
        <strong>${escapeHtml(route.routeName)}</strong>
        <span>${students.length} students</span>
      </div>
      <button type="button" class="mini" data-close-route-students>Close</button>
    </div>
    <table>
      <thead><tr><th>Admission No.</th><th>Student Name</th><th>Class</th><th>Village / Pickup</th></tr></thead>
      <tbody>
        ${students.map(student => `
          <tr>
            <td>${escapeHtml(student.admissionNo)}</td>
            <td>${escapeHtml(student.name)}</td>
            <td>${escapeHtml([student.className, student.section].filter(Boolean).join(" ") || "-")}</td>
            <td>${escapeHtml(student.villageName)}</td>
          </tr>
        `).join("") || `<tr><td colspan="4">No students found in this route.</td></tr>`}
      </tbody>
    </table>
  `;
}

function getRoutePickupVehicleLabel(point = {}) {
  const assignment = getTransportAssignment(point.routeName, point.shift) || {};
  const vehicle = getTransportVehicleByNo(assignment.vehicleNo) || {};
  if (!assignment.vehicleNo) return "No vehicle assigned";
  return vehicle.vehicleName || assignment.vehicleName || assignment.vehicleNo || "Vehicle";
}

function renderRoutePickupStudentReport() {
  const filter = document.getElementById("routePickupStudentRouteFilter");
  const summaryBox = document.getElementById("routePickupStudentReportSummary");
  const rows = document.getElementById("routePickupStudentReportRows");
  if (!filter || !summaryBox || !rows) return;
  const selected = filter.value;
  const routeNames = [...new Set(transportRoutePickupPoints
    .filter(point => hasRoutePickupStudentVillage(point.villageName))
    .map(point => String(point.routeName || "").trim())
    .filter(Boolean))]
    .sort((a, b) => a.localeCompare(b, undefined, {numeric: true}));
  filter.innerHTML = `<option value="">All routes</option>${routeNames.map(routeName =>
    `<option value="${escapeHtml(routeName)}">${escapeHtml(routeName)}</option>`
  ).join("")}`;
  filter.value = routeNames.includes(selected) ? selected : "";

  const mappedPoints = transportRoutePickupPoints
    .filter(point => hasRoutePickupStudentVillage(point.villageName))
    .filter(point => String(point.routeName || "").trim())
    .filter(point => !filter.value || String(point.routeName || "").trim() === filter.value)
    .sort((a, b) =>
      String(a.routeName || "").localeCompare(String(b.routeName || ""), undefined, {numeric: true}) ||
      Number(a.sequence || 999) - Number(b.sequence || 999) ||
      String(a.villageName || "").localeCompare(String(b.villageName || ""), undefined, {numeric: true})
    );
  const pickupCount = new Set(mappedPoints.map(point => normalizeVillageName(point.villageName || "")).filter(Boolean)).size;
  const routeCount = new Set(mappedPoints.map(point => String(point.routeName || "").trim()).filter(Boolean)).size;
  const studentKeys = new Set();
  const reportRows = mappedPoints.map((point, index) => {
    const studentsForVillage = getTransportStudentsByVillage(point.villageName);
    const vehicleName = getRoutePickupVehicleLabel(point);
    const students = studentsForVillage.map(student => {
      const key = normalizeAdmissionNo(student.admissionNo || student.name || "");
      if (key) studentKeys.add(key);
      return {
        admissionNo: student.admissionNo || "-",
        studentName: student.name || "-",
        classLabel: [student.className || student.class || "", student.section || ""].filter(Boolean).join(" ") || "-",
        shift: point.shift || "-"
      };
    });
    return {
      key: `route-pickup-student-detail-${index}`,
      routeName: point.routeName || "-",
      vehicleName,
      villageName: point.villageName || "-",
      shift: point.shift || "-",
      students
    };
  });

  summaryBox.innerHTML = mappedPoints.length ? `
    <div><strong>${routeCount}</strong><span>Routes</span></div>
    <div><strong>${pickupCount}</strong><span>Pickup Points</span></div>
    <div><strong>${studentKeys.size}</strong><span>Transport Students</span></div>
  ` : `<span>No route mapped yet.</span>`;

  rows.innerHTML = reportRows.map(item => {
    const studentRows = item.students.map(student => `
      <tr>
        <td>${escapeHtml(student.admissionNo)}</td>
        <td>${escapeHtml(student.studentName)}</td>
        <td>${escapeHtml(student.classLabel)}</td>
        <td>${escapeHtml(student.shift)}</td>
      </tr>
    `).join("") || `<tr><td colspan="4">No transport student in this village.</td></tr>`;
    return `
    <tr class="route-pickup-report-row">
      <td><strong>${escapeHtml(item.routeName)}</strong></td>
      <td>${escapeHtml(item.vehicleName)}</td>
      <td>
        <button class="route-pickup-village-toggle" type="button" data-route-pickup-village-details="${escapeHtml(item.key)}">
          ${escapeHtml(item.villageName)}
          <span>▾</span>
        </button>
      </td>
      <td><strong>${item.students.length}</strong></td>
      <td>${escapeHtml(item.shift)}</td>
    </tr>
    <tr class="route-pickup-student-dropdown" id="${escapeHtml(item.key)}" hidden>
      <td colspan="5">
        <div class="route-pickup-student-list">
          <table>
            <thead><tr><th>Admission No.</th><th>Student Name</th><th>Class</th><th>Trip</th></tr></thead>
            <tbody>${studentRows}</tbody>
          </table>
        </div>
      </td>
    </tr>
  `;
  }).join("") || `<tr><td colspan="5">No student pickup point found.</td></tr>`;
}

function renderTransportRoutePickupPoints() {
  renderRoutePickupOptions();
  const rows = document.getElementById("transportRoutePickupRows");
  if (!rows) {
    renderTransportRouteStudentCounts();
    renderRoutePickupStudentReport();
    return;
  }
  const villages = getRoutePickupVillages();
  const routeOptions = transportRoutes.map(route =>
    `<option value="${escapeHtml(route.routeName || "")}">${escapeHtml(route.routeName || "")}</option>`
  ).join("");
  const tripOptions = ["Morning Pickup", "Second Shift Drop - 11:45", "Day Shift Drop"];
  const html = villages.map((villageName, index) => {
    const point = getRoutePickupPointForVillage(villageName) || {};
    const assignment = getTransportAssignment(point.routeName, point.shift) || {};
    const vehicle = getTransportVehicleByNo(assignment.vehicleNo) || {};
    const vehicleLabel = assignment.vehicleNo
      ? `${vehicle.vehicleName || assignment.vehicleName || "Vehicle"} (${assignment.vehicleNo})`
      : "No vehicle assigned";
    const studentsForVillage = getTransportStudentsByVillage(point.villageName || villageName);
    const studentPreview = studentsForVillage.slice(0, 3).map(student =>
      `${escapeHtml(student.admissionNo || "-")} · ${escapeHtml(student.name || "-")}`
    ).join("<br>");
    const remainingCount = studentsForVillage.length > 3 ? `<span class="route-pickup-more">+${studentsForVillage.length - 3} more</span>` : "";
    return `
      <tr class="${point.routeName ? "route-pickup-mapped" : "route-pickup-unmapped"}">
        <td><strong>${escapeHtml(villageName || "-")}</strong></td>
        <td>
          <select class="route-pickup-inline-select" data-route-pickup-route="${escapeHtml(villageName)}">
            <option value="">Select route</option>
            ${routeOptions}
          </select>
        </td>
        <td>
          ${studentsForVillage.length ? `<strong>${studentsForVillage.length}</strong><br>${studentPreview}${remainingCount}` : "<span class=\"repeat-student-cell\">No transport student in this village</span>"}
        </td>
        <td>${escapeHtml(point.routeName ? vehicleLabel : "-")}</td>
        <td>
          <select class="route-pickup-inline-select small" data-route-pickup-shift="${escapeHtml(villageName)}">
            ${tripOptions.map(trip => `<option value="${trip}"${(point.shift || "Morning Pickup") === trip ? " selected" : ""}>${trip}</option>`).join("")}
          </select>
        </td>
        <td><input class="route-pickup-inline-input" data-route-pickup-time="${escapeHtml(villageName)}" value="${escapeHtml(point.time || "")}" placeholder="08:00 AM"></td>
        <td><input class="route-pickup-inline-input tiny" data-route-pickup-sequence="${escapeHtml(villageName)}" type="number" min="1" value="${escapeHtml(point.sequence || "")}" placeholder="${index + 1}"></td>
        <td class="inline-actions">
          <button class="icon-action edit" type="button" data-save-transport-pickup="${escapeHtml(villageName)}" title="Save pickup point" aria-label="Save pickup point">✓</button>
          <button class="icon-action delete" type="button" data-delete-transport-pickup-village="${escapeHtml(villageName)}" title="Clear pickup route" aria-label="Clear pickup route">×</button>
        </td>
      </tr>
    `;
  }).join("");
  rows.innerHTML = html || `<tr><td colspan="8">No admitted student village found yet.</td></tr>`;
  rows.querySelectorAll("[data-route-pickup-route]").forEach(select => {
    const point = getRoutePickupPointForVillage(select.dataset.routePickupRoute || "");
    select.value = point?.routeName || "";
  });
  renderTransportRouteStudentCounts();
  renderRoutePickupStudentReport();
}

function getStudentTransportFeeType(student = {}) {
  const services = Array.isArray(student.otherServices) ? student.otherServices : [];
  return services.includes("Special/Custom") ? "Special/Custom" : "Transport";
}

function getStudentTransportVehicleName(student = {}) {
  const cleanVillage = normalizeVillageName(student.villageTown || "");
  if (!cleanVillage) return "-";
  const pickupPoint = transportRoutePickupPoints.find(point => normalizeVillageName(point.villageName || "") === cleanVillage);
  if (!pickupPoint) return "Not assigned";
  const assignment = getTransportAssignment(pickupPoint.routeName, pickupPoint.shift);
  if (!assignment?.vehicleNo) return "Not assigned";
  const vehicle = getTransportVehicleByNo(assignment.vehicleNo) || {};
  return vehicle.vehicleName || assignment.vehicleName || "Vehicle";
}

function getTransportFeeMatchKey(student = {}) {
  return normalizeAdmissionNo(student.admissionNo || student.name || "");
}

function renderStudentTransportFees() {
  const rows = document.getElementById("studentTransportFeeRows");
  if (!rows) return;
  renderStudentTransportClassFilter();
  const selectedClass = String(document.getElementById("studentTransportClassFilter")?.value || "").trim();
  const transportStudents = getActiveStudents()
    .filter(student => studentTakesTransport(student))
    .filter(student => {
      const {klass} = splitStudentClassSection(student.klass || "");
      return !selectedClass || klass === selectedClass;
    })
    .sort((a, b) =>
      String(a.klass || "").localeCompare(String(b.klass || ""), undefined, {numeric: true}) ||
      String(a.villageTown || "").localeCompare(String(b.villageTown || ""), undefined, {numeric: true}) ||
      String(a.name || "").localeCompare(String(b.name || ""), undefined, {numeric: true})
    );
  rows.innerHTML = transportStudents.map(student => {
    const classInfo = splitStudentClassSection(student.klass || "");
    const months = getSelectedMonths(student, "transportMonths");
    const fee = Number(student.transportFee || 0);
    const matchKey = getTransportFeeMatchKey(student);
    const isMatched = Boolean(transportFeeMatched[matchKey]);
    return `
      <tr class="${isMatched ? "transport-fee-matched-row" : ""}">
        <td>
          <label class="transport-match-check" title="${isMatched ? "Matched" : "Mark as matched"}">
            <input data-transport-fee-match type="checkbox" value="${escapeHtml(matchKey)}" ${isMatched ? "checked" : ""} />
            <span>${isMatched ? "Done" : "Pending"}</span>
          </label>
        </td>
        <td><strong>${escapeHtml(student.admissionNo || "-")}</strong></td>
        <td><button class="student-name-link" type="button" data-open-fee-book="${escapeHtml(student.admissionNo || "")}"><strong>${escapeHtml(student.name || "-")}</strong></button></td>
        <td>${escapeHtml(classInfo.klass || "-")}</td>
        <td>${escapeHtml(classInfo.section || "-")}</td>
        <td>${escapeHtml(student.villageTown || "-")}</td>
        <td>${escapeHtml(getStudentTransportVehicleName(student))}</td>
        <td>${escapeHtml(getStudentTransportFeeType(student))}</td>
        <td><strong>${formatRs(fee)}</strong></td>
        <td>${escapeHtml(formatMonthPeriod(months))}</td>
        <td><span class="status-pill ${fee > 0 ? "stable" : "pending"}">${fee > 0 ? "Active" : "Fee Missing"}</span></td>
        <td>
          <button class="icon-action edit" type="button" data-edit-student-transport="${escapeHtml(student.admissionNo || "")}" title="Edit transport details" aria-label="Edit transport details for ${escapeHtml(student.name || "student")}">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20h4.7L19.3 9.4a2.1 2.1 0 0 0 0-3L17.6 4.7a2.1 2.1 0 0 0-3 0L4 15.3V20Zm3.8-2H6v-1.8l8.5-8.5 1.8 1.8L7.8 18Zm7.9-11.5.4-.4 1.8 1.8-.4.4-1.8-1.8Z"/></svg>
          </button>
        </td>
      </tr>
    `;
  }).join("") || `<tr><td colspan="12">No student transport fees assigned yet.</td></tr>`;
  const summary = document.getElementById("studentTransportFeeSummary");
  if (summary) {
    const monthlyTotal = transportStudents.reduce((sum, student) => sum + Number(student.transportFee || 0), 0);
    const matchedTotal = transportStudents.filter(student => transportFeeMatched[getTransportFeeMatchKey(student)]).length;
    summary.textContent = `Transport students: ${transportStudents.length} | Matched: ${matchedTotal} | Pending: ${Math.max(transportStudents.length - matchedTotal, 0)} | Monthly transport fee: ${formatRs(monthlyTotal)}`;
  }
}

function renderStudentTransportClassFilter() {
  const select = document.getElementById("studentTransportClassFilter");
  if (!select) return;
  const selected = select.value;
  const classes = [...new Set(getActiveStudents()
    .filter(student => studentTakesTransport(student))
    .map(student => splitStudentClassSection(student.klass || "").klass)
    .filter(Boolean))]
    .sort((a, b) => a.localeCompare(b, undefined, {numeric: true}));
  select.innerHTML = `<option value="">All Classes</option>${classes.map(klass => `<option value="${escapeHtml(klass)}">${escapeHtml(klass)}</option>`).join("")}`;
  select.value = classes.includes(selected) ? selected : "";
}

function renderNonTransportStudents() {
  const rows = document.getElementById("nonTransportStudentRows");
  if (!rows) return;
  const nonTransportStudents = getActiveStudents()
    .filter(student => !studentTakesTransport(student))
    .sort((a, b) =>
      String(a.klass || "").localeCompare(String(b.klass || ""), undefined, {numeric: true}) ||
      String(a.name || "").localeCompare(String(b.name || ""), undefined, {numeric: true})
    );
  rows.innerHTML = nonTransportStudents.map(student => {
    const classInfo = splitStudentClassSection(student.klass || "");
    return `
      <tr>
        <td><strong>${escapeHtml(student.admissionNo || "-")}</strong></td>
        <td>${escapeHtml(student.name || "-")}</td>
        <td>${escapeHtml(classInfo.klass || "-")}</td>
        <td>${escapeHtml(classInfo.section || "-")}</td>
        <td>${escapeHtml(student.villageTown || "-")}</td>
        <td>${escapeHtml(getStudentGuardianName(student) || "-")}</td>
        <td>${escapeHtml(getStudentContactMobile(student) || "-")}</td>
        <td>
          <button class="icon-action edit" type="button" data-edit-student-transport="${escapeHtml(student.admissionNo || "")}" title="Edit transport details" aria-label="Edit transport details for ${escapeHtml(student.name || "student")}">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20h4.7L19.3 9.4a2.1 2.1 0 0 0 0-3L17.6 4.7a2.1 2.1 0 0 0-3 0L4 15.3V20Zm3.8-2H6v-1.8l8.5-8.5 1.8 1.8L7.8 18Zm7.9-11.5.4-.4 1.8 1.8-.4.4-1.8-1.8Z"/></svg>
          </button>
        </td>
      </tr>
    `;
  }).join("") || `<tr><td colspan="8">No non-transport students found.</td></tr>`;
  const summary = document.getElementById("nonTransportStudentSummary");
  if (summary) summary.textContent = `Non transport students: ${nonTransportStudents.length}`;
}

function getSmartBusSyncPreviewRows() {
  return getActiveStudents()
    .filter(student => studentTakesTransport(student))
    .map(student => {
      const villageName = student.villageTown || "";
      const pickupPoint = getRoutePickupPointForVillage(villageName) || {};
      const assignment = getTransportAssignment(pickupPoint.routeName, pickupPoint.shift) || {};
      const vehicle = getTransportVehicleByNo(assignment.vehicleNo) || {};
      return {
        admissionNo: student.admissionNo || "",
        studentName: student.name || "",
        routeName: pickupPoint.routeName || assignment.routeName || "",
        pickupPoint: pickupPoint.villageName || villageName || "",
        vehicleName: vehicle.vehicleName || assignment.vehicleName || "",
        driverName: vehicle.driverName || assignment.driverName || "",
        trip: pickupPoint.shift || assignment.shift || ""
      };
    })
    .sort((a, b) =>
      String(a.routeName || "").localeCompare(String(b.routeName || ""), undefined, {numeric: true}) ||
      String(a.pickupPoint || "").localeCompare(String(b.pickupPoint || ""), undefined, {numeric: true}) ||
      String(a.studentName || "").localeCompare(String(b.studentName || ""), undefined, {numeric: true})
    );
}

async function loadSmartBusConfig() {
  const response = await backendFetch(`/api/smart-bus/config?v=${Date.now()}`, {
    headers: backendHeaders(),
    cache: "no-store"
  });
  if (!response.ok) throw new Error(`Smart Bus config failed ${response.status}`);
  return response.json();
}

async function renderSmartBusTracking() {
  const rows = document.getElementById("smartBusSyncRows");
  if (!rows) return;
  const previewRows = getSmartBusSyncPreviewRows();
  const routeCount = new Set(previewRows.map(row => row.routeName).filter(Boolean)).size;
  const vehicleCount = new Set(previewRows.map(row => row.vehicleName).filter(Boolean)).size;
  document.getElementById("smartBusSyncStudents").textContent = String(previewRows.length);
  document.getElementById("smartBusSyncRoutes").textContent = String(routeCount);
  document.getElementById("smartBusSyncVehicles").textContent = String(vehicleCount);
  rows.innerHTML = previewRows.map(row => `
    <tr>
      <td><strong>${escapeHtml(row.admissionNo || "-")}</strong></td>
      <td>${escapeHtml(row.studentName || "-")}</td>
      <td>${escapeHtml(row.routeName || "Not mapped")}</td>
      <td>${escapeHtml(row.pickupPoint || "-")}</td>
      <td>${escapeHtml(row.vehicleName || "Not assigned")}</td>
      <td>${escapeHtml(row.driverName || "-")}</td>
      <td>${escapeHtml(row.trip || "-")}</td>
    </tr>
  `).join("") || `<tr><td colspan="7">No transport student ready for sync.</td></tr>`;

  const statusBox = document.getElementById("smartBusSyncStatus");
  const statusPill = document.getElementById("smartBusConfigStatus");
  const dashboardLink = document.getElementById("smartBusDashboardLink");
  if (statusBox) statusBox.textContent = "Checking Smart Bus Tracking connection...";
  try {
    const config = await loadSmartBusConfig();
    if (dashboardLink && config.dashboardUrl) dashboardLink.href = config.dashboardUrl;
    if (statusPill) {
      statusPill.textContent = config.configured ? "Configured" : "Setup Needed";
      statusPill.className = config.configured ? "ready" : "setup";
    }
    if (statusBox) {
      statusBox.textContent = config.configured
        ? `Smart Bus Tracking ready. Dashboard: ${config.dashboardUrl || "-"}`
        : "Smart Bus Tracking env setup needed on ERP: SMART_BUS_TRACKING_BASE_URL, SMART_BUS_TRACKING_DASHBOARD_URL, SMART_BUS_ERP_TOKEN.";
    }
  } catch (error) {
    if (statusPill) {
      statusPill.textContent = "Unavailable";
      statusPill.className = "danger";
    }
    if (statusBox) statusBox.textContent = error.message || "Smart Bus Tracking config check failed.";
  }
}

async function syncSmartBusMasterData() {
  const button = document.getElementById("smartBusSyncButton");
  const statusBox = document.getElementById("smartBusSyncStatus");
  const originalText = button?.textContent || "Sync Bus Master Data";
  if (button) {
    button.disabled = true;
    button.textContent = "Syncing...";
  }
  if (statusBox) statusBox.textContent = "Sending master data to Smart Bus Tracking service...";
  try {
    const response = await backendFetch("/api/smart-bus/sync-master-data", {
      method: "POST",
      headers: backendHeaders({"Content-Type": "application/json"}),
      body: JSON.stringify({})
    }, 30000);
    const result = await response.json().catch(() => ({}));
    if (!response.ok || result.ok === false) throw new Error(result.error || `Smart Bus sync failed ${response.status}`);
    if (statusBox) statusBox.textContent = `${result.message || "ERP master data synced"} (${result.synced ?? result.payloadCount ?? 0} students).`;
    showToast(`Smart Bus synced: ${result.synced ?? result.payloadCount ?? 0} students`);
  } catch (error) {
    if (statusBox) statusBox.textContent = error.message || "Smart Bus sync failed.";
    showToast(error.message || "Smart Bus sync failed.");
  } finally {
    if (button) {
      button.disabled = false;
      button.textContent = originalText;
    }
  }
}

function renderTuitionFineSetup() {
  const form = document.getElementById("tuitionFineForm");
  if (!form) return;
  form.elements.dailyRate.value = Number(tuitionFineSetup.dailyRate || 0);
  form.elements.nextMonth.value = Number(tuitionFineSetup.nextMonth || 0);
  form.elements.secondMonth.value = Number(tuitionFineSetup.secondMonth || 0);
  form.elements.laterMonth.value = Number(tuitionFineSetup.laterMonth || 0);
  const example = document.getElementById("tuitionFineExample");
  if (!example) return;
  const daily = Number(tuitionFineSetup.dailyRate || 0);
  const next = Number(tuitionFineSetup.nextMonth || 0);
  const second = Number(tuitionFineSetup.secondMonth || 0);
  const later = Number(tuitionFineSetup.laterMonth || 0);
  const sameMonth = 15 * daily;
  example.innerHTML = `
    <strong>Example: April Tuition Fee</strong>
    <div><span>Apr 1 - Apr 15</span><b>${formatRs(0)}</b></div>
    <div><span>Apr 16 - Apr 30</span><b>${formatRs(sameMonth)}</b></div>
    <div><span>May 1</span><b>${formatRs(sameMonth + next)}</b></div>
    <div><span>Jun 1</span><b>${formatRs(sameMonth + next + second)}</b></div>
    <div><span>Jul 1 onward</span><b>${formatRs(sameMonth + next + second + later)}</b></div>
  `;
}

function renderTransportFineSetup() {
  const form = document.getElementById("transportFineForm");
  if (!form) return;
  form.elements.sameMonth.value = Number(transportFineSetup.sameMonth || 0);
  form.elements.nextMonth.value = Number(transportFineSetup.nextMonth || 0);
  form.elements.secondMonth.value = Number(transportFineSetup.secondMonth || 0);
  form.elements.laterMonth.value = Number(transportFineSetup.laterMonth || 0);
  const example = document.getElementById("transportFineExample");
  if (!example) return;
  const same = Number(transportFineSetup.sameMonth || 0);
  const next = Number(transportFineSetup.nextMonth || 0);
  const second = Number(transportFineSetup.secondMonth || 0);
  const later = Number(transportFineSetup.laterMonth || 0);
  example.innerHTML = `
    <strong>Example: April Transport Fee</strong>
    <div><span>Apr 1 - Apr 15</span><b>${formatRs(0)}</b></div>
    <div><span>Apr 16 - Apr 30</span><b>${formatRs(same)}</b></div>
    <div><span>May 1</span><b>${formatRs(same + next)}</b></div>
    <div><span>Jun 1</span><b>${formatRs(same + next + second)}</b></div>
    <div><span>Jul 1 onward</span><b>${formatRs(same + next + second + later)}</b></div>
  `;
}

function printYearlyFeeStatement(admissionNo = activeLedgerAdmissionNo || activeFeeStudentAdmissionNo) {
  const student = findActiveStudentByAdmissionNo(admissionNo) || getActiveStudents()[0];
  if (!student) {
    showToast("No student selected for yearly statement.");
    return;
  }
  const rows = getLedgerRows(student);
  const payments = getLedgerPayments(student);
  const total = rows.reduce((sum, row) => sum + row.total, 0);
  const paid = rows.reduce((sum, row) => sum + row.paid, 0);
  const discount = rows.reduce((sum, row) => sum + row.discount, 0);
  const due = rows.reduce((sum, row) => sum + row.due, 0);
  const feeRowsHtml = rows.map(row => `
    <tr>
      <td>${escapeHtml(row.name)}</td>
      <td>${escapeHtml(row.period)}</td>
      <td>${formatRs(row.total)}</td>
      <td>${formatRs(row.paid)}</td>
      <td>${formatRs(getLedgerRowFineAmount(student, row))}</td>
      <td>${formatRs(row.discount)}</td>
      <td>${formatRs(row.due)}</td>
      <td>${row.due > 0 ? "Due" : "Paid"}</td>
    </tr>
  `).join("") || `<tr><td colspan="8">No fee setup found.</td></tr>`;
  const monthRowsHtml = rows.filter(row => Array.isArray(row.months) && row.months.length).flatMap(row => {
    const paidMonths = getPaidLedgerMonths(student, row);
    return row.months.map(month => `
      <tr>
        <td>${escapeHtml(row.name)}</td>
        <td>${escapeHtml(month)}</td>
        <td>${formatRs(row.monthlyAmount || 0)}</td>
        <td>${paidMonths.has(month) ? "Paid" : "Due"}</td>
      </tr>
    `);
  }).join("") || `<tr><td colspan="4">No monthly fee rows found.</td></tr>`;
  const paymentRowsHtml = payments.map(payment => `
    <tr>
      <td>${formatDateDDMMYYYY(payment.date)}</td>
      <td>${escapeHtml(payment.receipt)}</td>
      <td>${escapeHtml(payment.head)}</td>
      <td>${formatRs(payment.bank)}</td>
      <td>${formatRs(payment.cash)}</td>
      <td>${formatRs(payment.fine)}</td>
      <td>${formatRs(Number(payment.bank || 0) + Number(payment.cash || 0))}</td>
      <td>${escapeHtml(payment.by)}</td>
    </tr>
  `).join("") || `<tr><td colspan="8">No payment history yet.</td></tr>`;
  openReceiptPreviewWithPrint("Full Year Fee Statement Preview", `
    <article class="receipt-preview-card yearly-payment-preview yearly-fee-statement-preview">
      <div class="receipt-preview-banner">
        <div>
          <p>Alfred Nobel Public School</p>
          <h3>Full Year Fee Statement</h3>
          <p>Session ${escapeHtml(activeSession)} | ${escapeHtml(student.name || "-")}</p>
        </div>
        <div class="receipt-preview-stamp">${escapeHtml(student.admissionNo || "-")}</div>
      </div>
      <div class="yearly-preview-meta">
        <div><span>Student</span><strong>${escapeHtml(student.name || "-")}</strong></div>
        <div><span>Class</span><strong>${escapeHtml(student.klass || "-")}</strong></div>
        <div><span>Guardian</span><strong>${escapeHtml(student.guardian || "-")}</strong></div>
      </div>
      <div class="yearly-preview-meta">
        <div><span>Total Fee</span><strong>${formatRs(total)}</strong></div>
        <div><span>Paid</span><strong>${formatRs(paid)}</strong></div>
        <div><span>Discount</span><strong>${formatRs(discount)}</strong></div>
        <div><span>Due</span><strong>${formatRs(due)}</strong></div>
      </div>
      <h3 class="statement-section-title">Fee Head Statement</h3>
      <table>
        <thead><tr><th>Fee Head</th><th>Period</th><th>Total</th><th>Paid</th><th>Fine</th><th>Discount</th><th>Due</th><th>Status</th></tr></thead>
        <tbody>${feeRowsHtml}</tbody>
      </table>
      <h3 class="statement-section-title">Month-wise Statement</h3>
      <table>
        <thead><tr><th>Fee Head</th><th>Month</th><th>Amount</th><th>Status</th></tr></thead>
        <tbody>${monthRowsHtml}</tbody>
      </table>
      <h3 class="statement-section-title">Payment History</h3>
      <table>
        <thead><tr><th>Date</th><th>Receipt No.</th><th>Fee Head</th><th>Bank Payment</th><th>Cash Payment</th><th>Fine</th><th>Total Amount</th><th>Collected By</th></tr></thead>
        <tbody>${paymentRowsHtml}</tbody>
      </table>
    </article>
  `);
  showToast("Full year fee statement preview opened.");
}

function renderLedgerDateCell(student, row) {
  const payments = getLedgerPaymentDetails(student, row);
  if (!payments.length) return "-";
  if (row && row.name === "Tuition Fee") return `<span class="fee-date">${formatDateDDMMYYYY(payments[0].date)}</span>`;
  if (payments.length === 1) return `<span class="fee-date">${formatDateDDMMYYYY(payments[0].date)}</span>`;
  const dropdownKey = getFeeBookDropdownKey(student, row, "date");
  return `
    <details class="date-details" data-fee-book-dropdown="${escapeHtml(dropdownKey)}" ${openFeeBookDropdowns.has(dropdownKey) ? "open" : ""}>
      <summary><span class="fee-date">${formatDateDDMMYYYY(payments[0].date)}</span></summary>
      <div class="date-breakdown">
        ${payments.map(payment => `
          <div><span>${formatDateDDMMYYYY(payment.date)}</span><small>${payment.receipt}</small></div>
        `).join("")}
      </div>
    </details>
  `;
}

function collectStudentPayment(student, amount, date, mode, preferredHead = "", fineAmount = 0, preferredMonth = "", receiptNo = "", paymentBreakdown = {}) {
  const totalAmount = Number(amount || 0);
  const discountAmount = Number(paymentBreakdown.discountAmount || 0);
  const fine = Math.min(Number(fineAmount || 0), totalAmount);
  let remainingAmount = Math.max(totalAmount - fine, 0);
  if (!student || totalAmount <= 0) return null;
  const allocations = [];
  const feeItems = getStudentFeeItems(student);
  const preferredRow = feeItems.find(row => row.name === preferredHead && row.due > 0);
  if (preferredRow) {
    const collected = Math.min(preferredRow.due, remainingAmount);
    allocations.push({head: preferredRow.name, amount: collected, month: preferredMonth || undefined});
    remainingAmount -= collected;
  }
  feeItems.forEach(row => {
    if (remainingAmount <= 0 || row.due <= 0) return;
    if (preferredRow && row.name === preferredRow.name) return;
    const collected = Math.min(row.due, remainingAmount);
    allocations.push({head: row.name, amount: collected});
    remainingAmount -= collected;
  });
  if (remainingAmount > 0) allocations.push({head: "Advance Payment", amount: remainingAmount});
  if (fine > 0) allocations.push({head: getLateFineHeadForFee(preferredHead), amount: fine, month: preferredMonth || undefined});
  const payment = {
    id: paymentBreakdown.paymentId || createPaymentId(),
    date: formatDateDDMMYYYY(date || new Date()),
    receipt: receiptNo || getNextReceiptNo(),
    mode,
    by: getCurrentCollectorRoleName(),
    amount: totalAmount,
    discountAmount,
    remarks: String(paymentBreakdown.remarks || "").trim(),
    bankAmount: Number(paymentBreakdown.bankAmount || 0),
    cashAmount: Number(paymentBreakdown.cashAmount || 0),
    allocations
  };
  getSessionPayments(student.admissionNo).unshift(payment);
  return payment;
}

function collectCombinedStudentPayment(student, items, date, receiptNo = "", paymentBreakdown = {}) {
  const selectedItems = (items || []).filter(item => item && Number(item.total || 0) > 0);
  const grossAmount = selectedItems.reduce((sum, item) => sum + Number(item.total || 0), 0);
  const discountAmount = Math.min(Number(paymentBreakdown.discountAmount || 0), grossAmount);
  const payableAmount = Math.max(grossAmount - discountAmount, 0);
  const bankAmount = Number(paymentBreakdown.bankAmount || 0);
  const cashAmount = Number(paymentBreakdown.cashAmount || 0);
  const totalAmount = bankAmount + cashAmount;
  if (!student || grossAmount <= 0 || !selectedItems.length || totalAmount + discountAmount <= 0) return null;
  const allocations = [];
  let remainingAmount = Math.min(totalAmount + discountAmount, grossAmount);
  selectedItems.forEach(item => {
    if (remainingAmount <= 0) return;
    const amount = Number(item.amount || 0);
    const fine = Number(item.fine || 0);
    const allocationDate = formatDateDDMMYYYY(item.date || date || new Date());
    const paymentType = item.paymentType || undefined;
    const finePaid = Math.min(fine, remainingAmount);
    if (finePaid > 0) {
      allocations.push({head: getLateFineHeadForFee(item.head), amount: finePaid, month: item.month || undefined, date: allocationDate, paymentType});
      remainingAmount -= finePaid;
    }
    const feePaid = Math.min(amount, remainingAmount);
    if (feePaid > 0) {
      allocations.push({head: item.head, amount: feePaid, month: item.month || undefined, date: allocationDate, paymentType});
      remainingAmount -= feePaid;
    }
  });
  if (!allocations.length) return null;
  const payment = {
    id: paymentBreakdown.paymentId || createPaymentId(),
    date: formatDateDDMMYYYY(date || new Date()),
    receipt: receiptNo || getNextReceiptNo(),
    mode: bankAmount > 0 && cashAmount > 0 ? "Bank + Cash" : bankAmount > 0 ? "Bank" : "Cash",
    by: getCurrentCollectorRoleName(),
    amount: totalAmount,
    discountAmount,
    remarks: String(paymentBreakdown.remarks || "").trim(),
    bankAmount,
    cashAmount,
    allocations
  };
  getSessionPayments(student.admissionNo).unshift(payment);
  return payment;
}

function renderFeeBook(admissionNo = activeLedgerAdmissionNo) {
  const activeStudents = getActiveStudents();
  const requestedAdmissionNo = String(admissionNo || "").trim();
  const student = requestedAdmissionNo ? findActiveStudentByAdmissionOrName(requestedAdmissionNo) : activeStudents[0];
  const feeBookBackButton = document.getElementById("feeBookBackToStudent");
  feeBookBackButton?.classList.toggle("hidden", !feeBookReturnStudentAdmissionNo);
  if (!student) {
    activeLedgerAdmissionNo = "";
    feeBookStudentSelect.value = "";
    document.getElementById("ledgerAdmission").textContent = "-";
    document.getElementById("ledgerName").textContent = "-";
    document.getElementById("ledgerClass").textContent = "-";
    document.getElementById("ledgerMobile").textContent = "-";
    document.getElementById("ledgerGuardian").textContent = "-";
    document.getElementById("ledgerGuardianMobile").textContent = "-";
    document.getElementById("ledgerPhoto").textContent = "ST";
    document.getElementById("ledgerTotal").textContent = formatRs(0);
    document.getElementById("ledgerPaid").textContent = formatRs(0);
    document.getElementById("ledgerDiscount").textContent = formatRs(0);
    document.getElementById("ledgerDue").textContent = formatRs(0);
    document.getElementById("ledgerFeeRows").innerHTML = `<tr><td colspan="10">No student selected. Add a student admission first.</td></tr>`;
    document.getElementById("ledgerPaymentRows").innerHTML = `<tr><td colspan="13">No payment history yet.</td></tr>`;
    return;
  }
  activeLedgerAdmissionNo = student.admissionNo;
  feeBookStudentSelect.value = student.admissionNo;
  const rows = getLedgerRows(student);
  const total = rows.reduce((sum, row) => sum + row.total, 0);
  const paid = rows.reduce((sum, row) => sum + row.paid, 0);
  const discount = rows.reduce((sum, row) => sum + row.discount, 0);
  const due = rows.reduce((sum, row) => sum + row.due, 0);
  document.getElementById("ledgerAdmission").textContent = student.admissionNo || "-";
  document.getElementById("ledgerName").textContent = student.name || "-";
  document.getElementById("ledgerClass").textContent = student.klass || "-";
  document.getElementById("ledgerMobile").textContent = student.mobile || "-";
  document.getElementById("ledgerGuardian").textContent = student.guardian || "-";
  document.getElementById("ledgerGuardianMobile").textContent = student.mobile || "-";
  const ledgerPhoto = document.getElementById("ledgerPhoto");
  if (student.photo) {
    ledgerPhoto.innerHTML = `<img src="${student.photo}" alt="${student.name || "Student"} photo" />`;
  } else {
    ledgerPhoto.textContent = String(student.name || "ST").split(" ").map(part => part[0]).join("").slice(0, 2).toUpperCase();
  }
  document.getElementById("ledgerTotal").textContent = formatRs(total);
  document.getElementById("ledgerPaid").textContent = formatRs(paid);
  document.getElementById("ledgerDiscount").textContent = formatRs(discount);
  document.getElementById("ledgerDue").textContent = formatRs(due);
  document.getElementById("ledgerFeeRows").innerHTML = rows.map(row => `
    <tr>
      <td><strong>${row.name}</strong></td>
      <td>${renderLedgerPeriodCell(student, row)}</td>
      <td>${renderLedgerDateCell(student, row)}</td>
      <td>${formatRs(row.total)}</td>
      <td>${formatRs(row.paid)}</td>
      <td>${formatRs(getLedgerRowFineAmount(student, row))}</td>
      <td>${formatRs(row.discount)}</td>
      <td>${formatRs(row.due)}</td>
      <td><span class="badge ${row.due > 0 ? "amber" : "green"}">${row.due > 0 ? "Due" : "Paid"}</span></td>
      <td>
        <button class="icon-action fees" type="button" data-student-fees="${student.admissionNo || ""}" data-due-amount="${row.due}" data-fee-head="${row.name}" title="Collect ${row.name}" aria-label="Collect ${row.name} for ${student.name}">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6.5C4 5.1 5.1 4 6.5 4h11C18.9 4 20 5.1 20 6.5v11c0 1.4-1.1 2.5-2.5 2.5h-11C5.1 20 4 18.9 4 17.5v-11ZM6.5 6a.5.5 0 0 0-.5.5V8h12V6.5a.5.5 0 0 0-.5-.5h-11ZM6 10v7.5c0 .3.2.5.5.5h11c.3 0 .5-.2.5-.5V10H6Zm6.8 6.7h-1.6v-1.1c-1-.2-1.8-.8-2.2-1.6l1.5-.8c.3.5.8.8 1.6.8.7 0 1-.2 1-.6s-.4-.5-1.4-.8c-1.4-.4-2.4-.9-2.4-2.2 0-1.1.8-1.9 1.9-2.1V7.3h1.6v1c.8.2 1.5.7 1.9 1.5l-1.4.8c-.3-.5-.7-.7-1.2-.7-.6 0-.9.2-.9.5 0 .4.4.5 1.4.8 1.4.4 2.4.9 2.4 2.2 0 1.2-.8 2-2.2 2.2v1.1Z"/></svg>
        </button>
      </td>
    </tr>
  `).join("") || `<tr><td colspan="10">No ledger data found.</td></tr>`;
  const allLedgerPayments = getAllLedgerPayments();
  renderCollectionHistoryCollectedByOptions(allLedgerPayments);
  const ledgerPayments = filterPaymentsByDateRange(allLedgerPayments);
  const hasHistoryFilter = Boolean(
    document.getElementById("collectionHistoryFromDate")?.value ||
    document.getElementById("collectionHistoryToDate")?.value ||
    document.getElementById("collectionHistoryCollectedBy")?.value ||
    document.getElementById("collectionHistoryAdmissionNo")?.value ||
    document.getElementById("collectionHistoryReceiptNo")?.value
  );
  document.getElementById("ledgerPaymentRows").innerHTML = ledgerPayments.map(payment => {
    const paymentAdmissionNo = payment.admissionNo || student.admissionNo || "";
    const paymentStudent = findStudentByAdmissionNo(paymentAdmissionNo) || student || {};
    const totalAmount = Number(payment.bank || 0) + Number(payment.cash || 0);
    const selectionKey = getPaymentSelectionKey(payment);
    const isSelected = selectedHistoryPayments.has(selectionKey);
    return `
    <tr class="${isSelected ? "selected-payment-row" : ""}">
      <td>${formatDateDDMMYYYY(payment.date)}</td>
      <td>${payment.receipt}</td>
      <td><strong>${escapeHtml(paymentStudent.name || "-")}</strong></td>
      <td>${escapeHtml(paymentAdmissionNo || "-")}</td>
      <td>${payment.head}</td>
      <td>${formatRs(payment.bank)}</td>
      <td>${formatRs(payment.cash)}</td>
      <td>${formatRs(payment.fine)}</td>
      <td>${formatRs(payment.discount || 0)}</td>
      <td>
        <label class="payment-total-selector" title="Click to add/remove from quick total">
          <input data-payment-total-select type="checkbox" value="${escapeHtml(selectionKey)}" data-bank="${Number(payment.bank || 0)}" data-cash="${Number(payment.cash || 0)}" data-fine="${Number(payment.fine || 0)}" data-total="${totalAmount}" ${isSelected ? "checked" : ""} />
          <span>${formatRs(totalAmount)}</span>
        </label>
      </td>
      <td>${escapeHtml(payment.remarks || "-")}</td>
      <td>${payment.by}</td>
      <td>
        <div class="row-actions">
          <button class="icon-action" type="button" data-preview-saved-receipt="${paymentAdmissionNo}" data-payment-receipt="${payment.receipt}" title="Receipt preview" aria-label="Preview receipt ${payment.receipt}">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 2h9l5 5v15H6a2 2 0 0 1-2-2V4c0-1.1.9-2 2-2Zm8 2H6v16h12V8h-4V4Zm-5 8h6v2H9v-2Zm0 4h6v2H9v-2Zm0-8h3v2H9V8Z"/></svg>
          </button>
          <button class="icon-action edit" type="button" data-edit-payment="${paymentAdmissionNo}" data-payment-receipt="${payment.receipt}" title="Edit payment" aria-label="Edit receipt ${payment.receipt}">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20h4.7L19.3 9.4a2.1 2.1 0 0 0 0-3L17.6 4.7a2.1 2.1 0 0 0-3 0L4 15.3V20Zm3.8-2H6v-1.8l8.5-8.5 1.8 1.8L7.8 18Zm7.9-11.5.4-.4 1.8 1.8-.4.4-1.8-1.8Z"/></svg>
          </button>
          <button class="icon-action delete" type="button" data-delete-payment="${paymentAdmissionNo}" data-payment-receipt="${payment.receipt}" title="Delete payment" aria-label="Delete receipt ${payment.receipt}">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 21c-.6 0-1.1-.2-1.5-.6S5 19.5 5 19V8H4V6h5V4h6v2h5v2h-1v11c0 .6-.2 1.1-.6 1.5s-.9.6-1.5.6H7ZM17 8H7v11h10V8Zm-8 9h2v-7H9v7Zm4 0h2v-7h-2v7Z"/></svg>
          </button>
        </div>
      </td>
    </tr>
  `;
  }).join("") || `<tr><td colspan="13">${hasHistoryFilter ? "No payment history found in selected filter." : "No payment history yet."}</td></tr>`;
  updatePaymentQuickTotal();
}

function getCombinedCollectionItems(student, month, paymentDate = new Date(), includePriorMonthlyDue = false) {
  if (!student || !month) return [];
  const selectedMonthIndex = ACADEMIC_MONTHS.indexOf(month);
  return getLedgerRows(student)
    .filter(row => Array.isArray(row.months) && row.months.includes(month))
    .flatMap(row => {
      const collectMonths = ["Tuition Fee", "Transport Fees"].includes(row.name) && includePriorMonthlyDue && selectedMonthIndex >= 0
        ? row.months.filter(rowMonth => {
          const rowMonthIndex = ACADEMIC_MONTHS.indexOf(rowMonth);
          return rowMonthIndex >= 0 && rowMonthIndex <= selectedMonthIndex;
        })
        : [month];
      if (row.name === "Tuition Fee") {
        return collectMonths.map(collectMonth => {
          const paid = getTuitionMonthPaidInfo(student, row, collectMonth);
          const amount = Math.max(Number(row.monthlyAmount || 0) - Number(paid.tuition || 0), 0);
          const fine = getTuitionMonthCollectFineDue(student, row, collectMonth, parseDateDDMMYYYY(paymentDate));
          return amount + fine > 0
            ? {head: row.name, month: collectMonth, amount, fine, total: amount + fine, partial: Number(paid.tuition || 0) > 0 && amount > 0}
            : null;
        });
      }
      if (row.name === "Transport Fees") {
        return collectMonths.map(collectMonth => {
          const paid = getTransportMonthPaidInfo(student, row, collectMonth);
          const amount = Math.max(Number(row.monthlyAmount || 0) - Number(paid.transport || 0), 0);
          const fine = getTransportMonthCollectFineDue(student, row, collectMonth, parseDateDDMMYYYY(paymentDate));
          return amount + fine > 0
            ? {head: row.name, month: collectMonth, amount, fine, total: amount + fine, partial: Number(paid.transport || 0) > 0 && amount > 0}
            : null;
        });
      }
      const paidMonths = getPaidLedgerMonths(student, row);
      if (paidMonths.has(month)) return null;
      const amount = Number(row.monthlyAmount || 0);
      return amount > 0 ? {head: row.name, month, amount, fine: 0, total: amount, partial: isLedgerMonthPartiallyPaid(student, row, month)} : null;
    })
    .filter(item => item && item.total > 0);
}

function updateCombinedCollectionTotals() {
  const selectedRows = [...combinedCollectionForm.querySelectorAll("[data-combined-fee]:checked")];
  const totals = selectedRows.reduce((sum, input) => {
    sum.amount += Number(input.dataset.amount || 0);
    sum.fine += Number(input.dataset.fine || 0);
    sum.total += Number(input.dataset.total || 0);
    return sum;
  }, {amount: 0, fine: 0, total: 0});
  const discount = Math.min(Number(combinedCollectionForm.elements.discountAmount?.value || 0), totals.total);
  const payable = Math.max(totals.total - discount, 0);
  document.getElementById("combinedFeeSubtotal").textContent = formatRs(totals.amount);
  document.getElementById("combinedFineTotal").textContent = formatRs(totals.fine);
  document.getElementById("combinedDiscountTotal").textContent = formatRs(discount);
  document.getElementById("combinedGrandTotal").textContent = formatRs(payable);
  const paidNow = Number(combinedCollectionForm.elements.bankAmount.value || 0) + Number(combinedCollectionForm.elements.cashAmount.value || 0);
  document.getElementById("combinedPaidNow").textContent = formatRs(paidNow);
  document.getElementById("combinedBalance").textContent = formatRs(Math.max(payable - paidNow, 0));
}

function renderCombinedCollectionItems() {
  const admissionNo = combinedCollectionForm.elements.admissionNo.value;
  const month = combinedCollectionForm.elements.month.value;
  const student = findActiveStudentByAdmissionOrName(admissionNo);
  const date = combinedCollectionForm.elements.date.value || new Date();
  const includePriorTuitionDue = combinedCollectionForm.dataset.includePriorTuitionDue === "1";
  const items = getCombinedCollectionItems(student, month, date, includePriorTuitionDue);
  document.getElementById("combinedFeeItems").innerHTML = items.map((item, index) => `
    <div class="combined-fee-row ${item.partial ? "partial-fee-row" : ""}">
      <label>
        <input data-combined-fee type="checkbox" value="${index}" data-head="${escapeHtml(item.head)}" data-month="${escapeHtml(item.month)}" data-amount="${item.amount}" data-fine="${item.fine}" data-total="${item.total}" checked />
        <span>${escapeHtml(item.head)}${item.month ? ` (${escapeHtml(item.month)})` : ""}</span>
      </label>
      <span>${formatRs(item.amount)}</span>
      <span data-combined-fine-display>${formatRs(item.fine)}</span>
      <strong data-combined-total-display>${formatRs(item.total)}</strong>
    </div>
  `).join("") || `<div class="combined-fee-row"><span>No monthly dues found for ${escapeHtml(month)}.</span><span>-</span><span>-</span><strong>Rs. 0</strong></div>`;
  updateCombinedCollectionTotals();
}

function renderCombinedCollectionEditItems(payment) {
  const itemsByKey = {};
  (payment.allocations || []).forEach(allocation => {
    const month = allocation.month || "";
    if (allocation.head === "Tuition Late Fine") {
      const tuitionKey = `Tuition Fee__${month}`;
      if (!itemsByKey[tuitionKey]) itemsByKey[tuitionKey] = {head: "Tuition Fee", month, amount: 0, fine: 0, total: 0};
      itemsByKey[tuitionKey].fine += Number(allocation.amount || 0);
      itemsByKey[tuitionKey].total += Number(allocation.amount || 0);
      itemsByKey[tuitionKey].date = allocation.date || itemsByKey[tuitionKey].date || "";
      itemsByKey[tuitionKey].paymentType = allocation.paymentType || itemsByKey[tuitionKey].paymentType || "";
      return;
    }
    if (allocation.head === "Transport Late Fine") {
      const transportKey = `Transport Fees__${month}`;
      if (!itemsByKey[transportKey]) itemsByKey[transportKey] = {head: "Transport Fees", month, amount: 0, fine: 0, total: 0};
      itemsByKey[transportKey].fine += Number(allocation.amount || 0);
      itemsByKey[transportKey].total += Number(allocation.amount || 0);
      itemsByKey[transportKey].date = allocation.date || itemsByKey[transportKey].date || "";
      itemsByKey[transportKey].paymentType = allocation.paymentType || itemsByKey[transportKey].paymentType || "";
      return;
    }
    const key = `${allocation.head}__${month}`;
    if (!itemsByKey[key]) itemsByKey[key] = {head: allocation.head, month, amount: 0, fine: 0, total: 0};
    itemsByKey[key].amount += Number(allocation.amount || 0);
    itemsByKey[key].total += Number(allocation.amount || 0);
    itemsByKey[key].date = allocation.date || itemsByKey[key].date || "";
    itemsByKey[key].paymentType = allocation.paymentType || itemsByKey[key].paymentType || "";
  });
  const items = Object.values(itemsByKey).filter(item => item.total > 0);
  document.getElementById("combinedFeeItems").innerHTML = items.map((item, index) => `
    <div class="combined-fee-row partial-fee-row">
      <label>
        <input data-combined-fee type="checkbox" value="${index}" data-head="${escapeHtml(item.head)}" data-month="${escapeHtml(item.month)}" data-amount="${item.amount}" data-fine="${item.fine}" data-total="${item.total}" checked />
        <span>${escapeHtml(item.head)}${item.month ? ` (${escapeHtml(item.month)})` : ""}</span>
      </label>
      <span>${formatRs(item.amount)}</span>
      <span data-combined-fine-display>${formatRs(item.fine)}</span>
      <strong data-combined-total-display>${formatRs(item.total)}</strong>
    </div>
  `).join("") || `<div class="combined-fee-row"><span>No payment rows found.</span><span>-</span><span>-</span><strong>Rs. 0</strong></div>`;
  updateCombinedCollectionTotals();
}

function renderSingleCollectionItem(item) {
  document.getElementById("combinedFeeItems").innerHTML = `
    <div class="combined-fee-row">
      <label>
        <input data-combined-fee type="checkbox" value="0" data-head="${escapeHtml(item.head)}" data-month="" data-amount="${item.amount}" data-fine="${item.fine || 0}" data-total="${item.total}" checked />
        <span>${escapeHtml(item.head)}</span>
      </label>
      <span>${formatRs(item.amount)}</span>
      <span data-combined-fine-display>${formatRs(item.fine || 0)}</span>
      <strong data-combined-total-display>${formatRs(item.total)}</strong>
    </div>
  `;
  updateCombinedCollectionTotals();
}

function openCombinedCollectionPopup(admissionNo, month, options = {}) {
  const student = findActiveStudentByAdmissionOrName(admissionNo);
  if (!student || !month) {
    showToast("Monthly collection data not found.");
    return;
  }
  combinedCollectionForm.reset();
  delete combinedCollectionForm.dataset.editPaymentReceipt;
  delete combinedCollectionForm.dataset.singleCollection;
  combinedCollectionForm.dataset.includePriorTuitionDue = options.includePriorTuitionDue ? "1" : "";
  combinedCollectionForm.querySelector("button[type='submit']").textContent = "Save Combined Receipt";
  combinedCollectionForm.elements.admissionNo.value = student.admissionNo || "";
  combinedCollectionForm.elements.month.value = month;
  combinedCollectionForm.elements.date.value = formatDateDDMMYYYY(new Date());
  combinedCollectionForm.elements.receiptNo.value = getNextReceiptNo();
  document.getElementById("combinedAdmissionNo").textContent = student.admissionNo || "-";
  document.getElementById("combinedStudentName").textContent = student.name || "-";
  document.getElementById("combinedStudentClass").textContent = student.klass || "-";
  document.getElementById("combinedFeeMonth").textContent = month;
  document.getElementById("combinedCollectionSubtitle").textContent = options.includePriorTuitionDue
    ? `${student.name || "Student"} | Monthly dues up to ${month}`
    : `${student.name || "Student"} | ${month} monthly fees`;
  renderCombinedCollectionItems();
  combinedCollectionModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
}

function openSingleCollectionPopup(admissionNo, feeHead, amount = 0, fine = 0) {
  const student = findActiveStudentByAdmissionOrName(admissionNo);
  const total = Number(amount || 0);
  const fineAmount = Number(fine || 0);
  if (!student || !feeHead || total + fineAmount <= 0) {
    showToast("Payment data not found.");
    return;
  }
  combinedCollectionForm.reset();
  delete combinedCollectionForm.dataset.editPaymentReceipt;
  delete combinedCollectionForm.dataset.includePriorTuitionDue;
  combinedCollectionForm.dataset.singleCollection = "1";
  combinedCollectionForm.querySelector("button[type='submit']").textContent = "Save Receipt";
  combinedCollectionForm.elements.admissionNo.value = student.admissionNo || "";
  combinedCollectionForm.elements.month.value = "";
  combinedCollectionForm.elements.date.value = formatDateDDMMYYYY(new Date());
  combinedCollectionForm.elements.receiptNo.value = getNextReceiptNo();
  document.getElementById("combinedAdmissionNo").textContent = student.admissionNo || "-";
  document.getElementById("combinedStudentName").textContent = student.name || "-";
  document.getElementById("combinedStudentClass").textContent = student.klass || "-";
  document.getElementById("combinedFeeMonth").textContent = "One Time";
  document.getElementById("combinedCollectionSubtitle").textContent = `${student.name || "Student"} | ${feeHead}`;
  renderSingleCollectionItem({head: feeHead, amount: total, fine: fineAmount, total: total + fineAmount});
  combinedCollectionModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
}

function openCombinedCollectionEditPopup(student, payment) {
  const month = (payment.allocations || []).map(allocation => allocation.month).find(Boolean) || "";
  combinedCollectionForm.reset();
  combinedCollectionForm.dataset.editPaymentReceipt = payment.receipt || "";
  combinedCollectionForm.dataset.editPaymentId = payment.id || "";
  delete combinedCollectionForm.dataset.singleCollection;
  delete combinedCollectionForm.dataset.includePriorTuitionDue;
  combinedCollectionForm.querySelector("button[type='submit']").textContent = "Update Combined Receipt";
  combinedCollectionForm.elements.admissionNo.value = student.admissionNo || "";
  combinedCollectionForm.elements.month.value = month;
  combinedCollectionForm.elements.date.value = formatDateDDMMYYYY(payment.date);
  combinedCollectionForm.elements.receiptNo.value = payment.receipt || "";
  combinedCollectionForm.elements.bankAmount.value = Number(payment.bankAmount || 0) || "";
  combinedCollectionForm.elements.cashAmount.value = Number(payment.cashAmount || 0) || "";
  combinedCollectionForm.elements.discountAmount.value = Number(payment.discountAmount || 0) || "";
  combinedCollectionForm.elements.remarks.value = payment.remarks || "";
  document.getElementById("combinedAdmissionNo").textContent = student.admissionNo || "-";
  document.getElementById("combinedStudentName").textContent = student.name || "-";
  document.getElementById("combinedStudentClass").textContent = student.klass || "-";
  document.getElementById("combinedFeeMonth").textContent = month || "-";
  document.getElementById("combinedCollectionSubtitle").textContent = `Editing receipt ${payment.receipt || ""}`;
  renderCombinedCollectionEditItems(payment);
  combinedCollectionModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
}

function closeCombinedCollectionPopup() {
  combinedCollectionModal.setAttribute("aria-hidden", "true");
  closeDatePickerPopover();
  delete combinedCollectionForm.dataset.editPaymentReceipt;
  delete combinedCollectionForm.dataset.editPaymentId;
  delete combinedCollectionForm.dataset.includePriorTuitionDue;
  delete combinedCollectionForm.dataset.singleCollection;
  combinedCollectionForm.querySelector("button[type='submit']").textContent = "Save Combined Receipt";
  document.body.classList.remove("modal-open");
}

function renderFeeBookStudentOptions() {
  const activeStudents = getActiveStudents();
  feeBookStudentSelect.innerHTML = activeStudents.length ? activeStudents.map(student => `
    <option value="${student.admissionNo}">${student.admissionNo} - ${student.name}</option>
  `).join("") : `<option value="">No students entered</option>`;
}

function isBuiltInClassFeeGroup(groupName = "") {
  const clean = String(groupName || "").trim().toLowerCase();
  return [
    "admission fee",
    "annual fee",
    "form fee",
    "tuition fee",
    "monthly tuition fee",
    "day boarding fee",
    "day boarding fees",
    "tiffin/lunch/other service fees",
    "robotics fee"
  ].includes(clean);
}

function getDynamicFeeGroups() {
  const session = ensureActiveFinanceSessionData();
  const seen = new Set();
  return (session.feeGroups || []).filter(group => {
    const name = String(group.groupName || "").trim();
    const key = name.toLowerCase();
    if (!name || seen.has(key) || isBuiltInClassFeeGroup(name)) return false;
    seen.add(key);
    return true;
  });
}

function renderFeeMasterDynamicFields(values = {}) {
  const container = document.getElementById("feeMasterDynamicFields");
  if (!container) return;
  const groups = getDynamicFeeGroups();
  container.innerHTML = groups.map(group => {
    const name = group.groupName;
    return `
      <label>${escapeHtml(name)}
        <input data-fee-master-group="${escapeHtml(name)}" type="number" min="0" value="${escapeHtml(values[name] || "")}" placeholder="0" />
      </label>
    `;
  }).join("") || `<small>Add Fee Group to create more class fee fields.</small>`;
}

function getFeeMasterCustomFees() {
  return [...feeMasterForm.querySelectorAll("[data-fee-master-group]")].reduce((fees, input) => {
    const name = input.dataset.feeMasterGroup;
    const amount = Number(input.value || 0);
    if (name && amount > 0) fees[name] = amount;
    return fees;
  }, {});
}

function renderFeeMasterCustomFees(item = {}) {
  const entries = Object.entries(item.customFees || {}).filter(([, amount]) => Number(amount) > 0);
  return entries.length ? entries.map(([name, amount]) => `<span class="fee-chip">${escapeHtml(name)}: ${formatRs(amount)}</span>`).join("") : "-";
}

function renderFeeMaster() {
  const session = ensureActiveFinanceSessionData();
  const showFeeGroupColumn = getDynamicFeeGroups().length > 0;
  renderAdmissionClassOptions();
  renderFeeMasterClassOptions();
  renderAdmissionStudentTypeOptions();
  renderFeeMasterDynamicFields();
  document.getElementById("feeMasterHeaderRow").innerHTML = `
    <th>Class</th>
    <th>Student Type</th>
    <th>Admission Fee</th>
    <th>Annual Fee</th>
    <th>Form Fee</th>
    <th>Monthly Tuition Fee</th>
    <th>Day Boarding</th>
    <th>Tiffin/Lunch/Other</th>
    <th>Robotics</th>
    ${showFeeGroupColumn ? "<th>Fee Groups</th>" : ""}
    <th>Total</th>
    <th>Action</th>
  `;
  document.getElementById("feeMasterTable").innerHTML = session.feeMaster.map((item, index) => `
    <tr>
      <td>${item.className}</td>
      <td>${item.studentType}</td>
      <td>${formatRs(item.admissionFee)}</td>
      <td>${formatRs(item.annualFee)}</td>
      <td>${formatRs(item.formFee)}</td>
      <td>${formatRs(item.monthlyTuitionFee)}</td>
      <td>${formatRs(item.dayBoardingFee)}</td>
      <td>${formatRs(item.tiffinLunchOtherServiceFee)}</td>
      <td>${formatRs(item.aiRoboticsFee)}</td>
      ${showFeeGroupColumn ? `<td>${renderFeeMasterCustomFees(item)}</td>` : ""}
      <td><strong>${formatRs(getClassFeeTotal(item))}</strong></td>
      <td>
        <div class="row-actions">
          <button class="icon-action edit" type="button" data-edit-fee-master="${index}" title="Edit fee" aria-label="Edit ${item.className} ${item.studentType}">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20h4.7L19.3 9.4a2.1 2.1 0 0 0 0-3L17.6 4.7a2.1 2.1 0 0 0-3 0L4 15.3V20Zm3.8-2H6v-1.8l8.5-8.5 1.8 1.8L7.8 18Zm7.9-11.5.4-.4 1.8 1.8-.4.4-1.8-1.8Z"/></svg>
          </button>
          <button class="icon-action delete" type="button" data-delete-fee-master="${index}" title="Delete fee" aria-label="Delete ${item.className} ${item.studentType}">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 21c-.6 0-1.1-.2-1.5-.6S5 19.5 5 19V8H4V6h5V4h6v2h5v2h-1v11c0 .6-.2 1.1-.6 1.5s-.9.6-1.5.6H7ZM17 8H7v11h10V8Zm-8 9h2v-7H9v7Zm4 0h2v-7h-2v7Z"/></svg>
          </button>
        </div>
      </td>
    </tr>
  `).join("") || `<tr><td colspan="${showFeeGroupColumn ? 12 : 11}">No class fee structure saved yet.</td></tr>`;
  document.getElementById("feeMasterSummary").textContent = session.feeMaster.length
    ? `${session.feeMaster.length} class fee structures saved in session ${activeSession}.`
    : "No class fee structure saved yet.";
}

function getClassFeeTotal(item) {
  return Number(item.admissionFee || 0)
    + Number(item.annualFee || 0)
    + Number(item.formFee || 0)
    + Number(item.monthlyTuitionFee || 0)
    + Number(item.dayBoardingFee || 0)
    + Number(item.tiffinLunchOtherServiceFee || 0)
    + Number(item.aiRoboticsFee || 0)
    + Object.values(item.customFees || {}).reduce((sum, amount) => sum + Number(amount || 0), 0);
}

function resetFeeMasterEditing() {
  editingFeeMasterIndex = -1;
  feeMasterForm.querySelector("button[type='submit']").textContent = "Save Fee Structure";
}

function resetFeeGroupEditing() {
  editingFeeGroupIndex = -1;
  feeGroupForm.querySelector("button[type='submit']").textContent = "Add Fee Group";
}

function renderFeeGroups() {
  const session = ensureActiveFinanceSessionData();
  document.getElementById("feeGroupCards").innerHTML = session.feeGroups.map((group, index) => `
    <article>
      <span>${group.category}</span>
      <strong>${group.groupName}</strong>
      <small>${group.description}</small>
      <div class="fee-card-actions">
        <button class="mini" type="button" data-edit-fee-group="${index}" title="Edit fee group">Edit</button>
        <button class="mini danger-mini" type="button" data-delete-fee-group="${index}" title="Delete fee group">Delete</button>
      </div>
    </article>
  `).join("") || `<article><span>Empty</span><strong>No fee groups</strong><small>Add Admission Fee, Annual Fee, Tuition Fee and other groups for this session.</small></article>`;
  document.getElementById("feeGroupSummary").textContent = `${session.feeGroups.length} fee groups in session ${activeSession}.`;
}

function renderLearning() {
  document.getElementById("learningCards").innerHTML = learning.map(([title, text, meta]) => `
    <article>
      <span>${meta}</span>
      <strong>${title}</strong>
      <small>${text}</small>
      <button class="mini" type="button" data-module="${title}">Open</button>
    </article>
  `).join("");
}

function renderStudentIdCardOptions() {
  const select = document.getElementById("idCardStudentSelect");
  if (!select) return "";
  const currentValue = select.value;
  const activeStudents = getActiveStudents();
  select.innerHTML = `<option value="">Select Student</option>` + activeStudents
    .map(student => `<option value="${escapeHtml(student.admissionNo)}">${escapeHtml(student.name || student.admissionNo)}</option>`)
    .join("");
  if (currentValue && [...select.options].some(option => option.value === currentValue)) select.value = currentValue;
  else if (!select.value && activeStudents[0]) select.value = activeStudents[0].admissionNo;
  return select.value;
}

function getStudentIdCardSettings() {
  const width = Number(document.getElementById("studentIdCardWidthMm")?.value || 86);
  const height = Number(document.getElementById("studentIdCardHeightMm")?.value || 54);
  return {
    contactType: document.getElementById("studentIdContactType")?.value || "guardian",
    width: Math.min(Math.max(width || 86, 50), 140),
    height: Math.min(Math.max(height || 54, 35), 100)
  };
}

function getStudentIdCardContact(student, type = "guardian") {
  if (type === "father") {
    return {
      label: "Father",
      name: student.fatherName || student.guardian || "-",
      mobile: student.fatherMobile || student.mobile || "-"
    };
  }
  if (type === "mother") {
    return {
      label: "Mother",
      name: student.motherName || student.guardian || "-",
      mobile: student.motherMobile || student.mobile || "-"
    };
  }
  return {
    label: "Guardian",
    name: student.guardian || student.fatherName || student.motherName || "-",
    mobile: student.mobile || student.fatherMobile || student.motherMobile || "-"
  };
}

function getStudentIdCardMarkup(student) {
  if (!student) {
    return `<div class="student-id-card-empty">Select a student to preview ID card.</div>`;
  }
  const settings = getStudentIdCardSettings();
  const contact = getStudentIdCardContact(student, settings.contactType);
  const initials = String(student.name || "ST").split(/\s+/).map(part => part[0]).join("").slice(0, 2).toUpperCase() || "ST";
  const photo = student.photo
    ? `<img src="${student.photo}" alt="${escapeHtml(student.name || "Student")} photo" />`
    : `<span>${escapeHtml(initials)}</span>`;
  return `
    <article class="student-id-card" style="--student-card-width-mm:${settings.width}mm;--student-card-height-mm:${settings.height}mm;--student-card-ratio:${settings.width} / ${settings.height};">
      <div class="id-card-top">
        <img src="./assets/anps-logo.png" alt="ANPS logo" />
        <div>
          <strong>ALFRED NOBEL PUBLIC SCHOOL</strong>
          <small>Student Identity Card</small>
        </div>
      </div>
      <div class="id-card-body">
        <div class="id-card-photo">${photo}</div>
        <div class="id-card-info">
          <h3>${escapeHtml(student.name || "-")}</h3>
          <p><span>Admission No.</span><strong>${escapeHtml(student.admissionNo || "-")}</strong></p>
          <p><span>Class</span><strong>${escapeHtml([student.klass, student.section].filter(Boolean).join(" - ") || "-")}</strong></p>
          <p><span>${escapeHtml(contact.label)}</span><strong>${escapeHtml(contact.name)}</strong></p>
          <p><span>Mobile</span><strong>${escapeHtml(contact.mobile)}</strong></p>
          <p><span>Blood Group</span><strong>${escapeHtml(student.bloodGroup || "-")}</strong></p>
        </div>
        <div class="id-card-code" aria-label="Student barcode area">
          <div class="id-card-barcode" aria-hidden="true"></div>
          <span>Scan ID</span>
          <strong>${escapeHtml(student.admissionNo || "-")}</strong>
        </div>
      </div>
      <div class="id-card-address">
        <span>Address</span>
        <strong>${escapeHtml(student.address || student.villageTown || "-")}</strong>
      </div>
      <div class="id-card-footer">
        <span>Session ${escapeHtml(activeSession || "")}</span>
        <strong>Principal / Authorised Sign</strong>
      </div>
    </article>
  `;
}

function renderStudentIdCardModule() {
  const admissionNo = renderStudentIdCardOptions();
  const preview = document.getElementById("studentIdCardPreview");
  if (!preview) return;
  const selectedAdmissionNo = document.getElementById("idCardStudentSelect")?.value || admissionNo;
  preview.innerHTML = getStudentIdCardMarkup(findActiveStudentByAdmissionNo(selectedAdmissionNo));
}

function printStudentIdCard() {
  const student = findActiveStudentByAdmissionNo(document.getElementById("idCardStudentSelect")?.value || "");
  if (!student) {
    showToast("Select a student first.");
    return;
  }
  const settings = getStudentIdCardSettings();
  const printWindow = window.open("", "_blank", "width=760,height=520");
  if (!printWindow) {
    showToast("Popup blocked. Allow popup to print ID card.");
    return;
  }
  printWindow.document.write(`
    <html>
      <head>
        <title>${escapeHtml(student.name || "Student")} ID Card</title>
        <style>
          body { margin: 0; padding: 24px; font-family: Arial, sans-serif; background: #eef5fb; }
          .student-id-card { position: relative; display: flex; flex-direction: column; width: ${settings.width}mm; height: ${settings.height}mm; aspect-ratio: ${settings.width} / ${settings.height}; margin: auto; border-radius: 16px; overflow: hidden; background: #fff; color: #10233f; border: 1px solid #c7d7eb; box-shadow: 0 18px 36px rgba(20, 45, 78, .22); }
          .student-id-card::before { content: ""; position: absolute; inset: 0; z-index: 0; pointer-events: none; background: url("./assets/anps-logo.png") center 58% / 42% auto no-repeat; opacity: .075; }
          .student-id-card > * { position: relative; z-index: 1; }
          .id-card-top { display: flex; gap: 10px; align-items: center; flex: 0 0 auto; padding: 10px 12px; background: linear-gradient(135deg, #0f766e, #1d4ed8); color: #fff; }
          .id-card-top img { width: 46px; height: 46px; object-fit: contain; background: #fff; border-radius: 10px; padding: 4px; }
          .id-card-top strong { display: block; font-size: 15px; line-height: 1.15; }
          .id-card-top small { display: block; font-weight: 700; }
          .id-card-body { display: grid; grid-template-columns: 116px 1fr 86px; gap: 14px; flex: 1 1 auto; min-height: 0; padding: 12px 14px 8px; }
          .id-card-photo { width: 116px; height: 136px; display: grid; place-items: center; border-radius: 11px; overflow: hidden; background: #eaf3ff; color: #1d4ed8; font-size: 28px; font-weight: 900; }
          .id-card-photo img { width: 100%; height: 100%; object-fit: cover; }
          .id-card-info { overflow: hidden; }
          .id-card-info h3 { margin: 0 0 7px; font-size: 17px; }
          .id-card-info p { margin: 3px 0; display: grid; gap: 1px; }
          .id-card-info span, .id-card-address span { color: #5b6b82; font-size: 10px; text-transform: uppercase; font-weight: 900; }
          .id-card-info strong, .id-card-address strong { font-size: 12px; overflow-wrap: anywhere; }
          .id-card-code { display: grid; align-content: center; justify-items: center; gap: 7px; padding: 8px 6px; border: 1px dashed #9bb6d3; border-radius: 12px; background: #f6f8fb; text-align: center; }
          .id-card-barcode { width: 62px; height: 62px; border: 4px solid #10233f; border-radius: 9px; background: linear-gradient(90deg, #10233f 0 5px, transparent 5px 9px, #10233f 9px 13px, transparent 13px 18px, #10233f 18px 22px, transparent 22px 30px, #10233f 30px 35px, transparent 35px 40px, #10233f 40px 44px, transparent 44px 50px, #10233f 50px 55px, transparent 55px), linear-gradient(#fff, #fff); box-shadow: inset 0 0 0 5px #fff; }
          .id-card-code span { color: #5b6b82; font-size: 9px; font-weight: 900; text-transform: uppercase; }
          .id-card-code strong { color: #10233f; font-size: 10px; line-height: 1.15; overflow-wrap: anywhere; }
          .id-card-address { flex: 0 0 auto; margin: 0 12px 6px; padding: 6px 8px; border-radius: 12px; background: #f6f8fb; }
          .id-card-footer { display: flex; justify-content: space-between; gap: 12px; flex: 0 0 auto; padding: 7px 12px; background: #fff7db; font-size: 11px; font-weight: 900; }
          @page { size: ${settings.width}mm ${settings.height}mm; margin: 4mm; }
          @media print { body { background: #fff; padding: 0; } .student-id-card { box-shadow: none; width: ${settings.width}mm; height: ${settings.height}mm; } }
        </style>
      </head>
      <body>${getStudentIdCardMarkup(student)}<script>window.print();</script></body>
    </html>
  `);
  printWindow.document.close();
}

function getTeacherIdCardOptions() {
  const teachers = staffMembers.filter(staff => String(staff.status || "Active") !== "Disabled"
    && /teacher/i.test(`${staff.designation || ""} ${staff.role || ""}`));
  return teachers.length ? teachers : staffMembers.filter(staff => String(staff.status || "Active") !== "Disabled");
}

function renderTeacherIdCardOptions() {
  const select = document.getElementById("teacherIdCardSelect");
  if (!select) return "";
  const currentValue = select.value;
  const teachers = getTeacherIdCardOptions();
  select.innerHTML = `<option value="">Select Teacher</option>` + teachers
    .map(staff => `<option value="${escapeHtml(staff.staffId)}">${escapeHtml(staff.name || staff.staffId)}</option>`)
    .join("");
  if (currentValue && [...select.options].some(option => option.value === currentValue)) select.value = currentValue;
  else if (!select.value && teachers[0]) select.value = teachers[0].staffId;
  return select.value;
}

function getStaffByStaffIdForCard(staffId = "") {
  const clean = String(staffId || "").trim().toLowerCase();
  return staffMembers.find(staff => String(staff.staffId || "").trim().toLowerCase() === clean) || null;
}

function getTeacherIdCardMarkup(staff) {
  if (!staff) {
    return `<div class="student-id-card-empty">Select a teacher to preview ID card.</div>`;
  }
  const initials = String(staff.name || "TC").split(/\s+/).map(part => part[0]).join("").slice(0, 2).toUpperCase() || "TC";
  const photo = staff.photo
    ? `<img src="${staff.photo}" alt="${escapeHtml(staff.name || "Teacher")} photo" />`
    : `<span>${escapeHtml(initials)}</span>`;
  return `
    <article class="student-id-card teacher-id-card">
      <div class="id-card-top teacher-id-card-top">
        <img src="./assets/anps-logo.png" alt="ANPS logo" />
        <div>
          <strong>ALFRED NOBEL PUBLIC SCHOOL</strong>
          <small>Teacher Identity Card</small>
        </div>
      </div>
      <div class="id-card-body">
        <div class="id-card-photo">${photo}</div>
        <div class="id-card-info">
          <h3>${escapeHtml(staff.name || "-")}</h3>
          <p><span>Staff ID</span><strong>${escapeHtml(staff.staffId || "-")}</strong></p>
          <p><span>Designation</span><strong>${escapeHtml(staff.designation || "-")}</strong></p>
          <p><span>Department</span><strong>${escapeHtml(staff.department || "-")}</strong></p>
          <p><span>Phone</span><strong>${escapeHtml(staff.phone || "-")}</strong></p>
          <p><span>Email</span><strong>${escapeHtml(staff.email || "-")}</strong></p>
        </div>
        <div class="id-card-code" aria-label="Teacher barcode area">
          <div class="id-card-barcode" aria-hidden="true"></div>
          <div>
            <span>Scan ID</span>
            <strong>${escapeHtml(staff.staffId || "-")}</strong>
          </div>
        </div>
      </div>
      <div class="id-card-address">
        <span>Address</span>
        <strong>${escapeHtml(staff.address || "-")}</strong>
      </div>
      <div class="id-card-footer">
        <span>Session ${escapeHtml(activeSession || "")}</span>
        <strong>Principal / Authorised Sign</strong>
      </div>
    </article>
  `;
}

function renderTeacherIdCardModule() {
  const staffId = renderTeacherIdCardOptions();
  const preview = document.getElementById("teacherIdCardPreview");
  if (!preview) return;
  const selectedStaffId = document.getElementById("teacherIdCardSelect")?.value || staffId;
  preview.innerHTML = getTeacherIdCardMarkup(getStaffByStaffIdForCard(selectedStaffId));
}

function printTeacherIdCard() {
  const staff = getStaffByStaffIdForCard(document.getElementById("teacherIdCardSelect")?.value || "");
  if (!staff) {
    showToast("Select a teacher first.");
    return;
  }
  const printWindow = window.open("", "_blank", "width=520,height=720");
  if (!printWindow) {
    showToast("Popup blocked. Allow popup to print ID card.");
    return;
  }
  printWindow.document.write(`
    <html>
      <head>
        <title>${escapeHtml(staff.name || "Teacher")} ID Card</title>
        <style>
          body { margin: 0; padding: 24px; font-family: Arial, sans-serif; background: #eef5fb; }
          .student-id-card { position: relative; display: flex; flex-direction: column; width: 390px; aspect-ratio: 56 / 88; margin: auto; border-radius: 16px; overflow: hidden; background: #fff; color: #10233f; border: 1px solid #c7d7eb; box-shadow: 0 18px 36px rgba(20, 45, 78, .22); }
          .student-id-card::before { content: ""; position: absolute; inset: 0; z-index: 0; pointer-events: none; background: url("./assets/anps-logo.png") center 58% / 46% auto no-repeat; opacity: .075; }
          .student-id-card > * { position: relative; z-index: 1; }
          .id-card-top { display: flex; gap: 10px; align-items: center; flex: 0 0 auto; padding: 12px; background: linear-gradient(135deg, #7c3aed, #0f766e); color: #fff; }
          .id-card-top img { width: 46px; height: 46px; object-fit: contain; background: #fff; border-radius: 10px; padding: 4px; }
          .id-card-top strong { display: block; font-size: 15px; line-height: 1.15; }
          .id-card-top small { display: block; font-weight: 700; }
          .id-card-body { display: grid; grid-template-columns: 104px 1fr; gap: 10px; flex: 1 1 auto; min-height: 0; padding: 12px 12px 8px; }
          .id-card-photo { width: 104px; height: 124px; display: grid; place-items: center; border-radius: 12px; overflow: hidden; background: #f2edff; color: #6d28d9; font-size: 28px; font-weight: 900; }
          .id-card-photo img { width: 100%; height: 100%; object-fit: cover; }
          .id-card-info { overflow: hidden; }
          .id-card-info h3 { margin: 0 0 7px; font-size: 17px; }
          .id-card-info p { margin: 4px 0; display: grid; gap: 1px; }
          .id-card-info span, .id-card-address span { color: #5b6b82; font-size: 10px; text-transform: uppercase; font-weight: 900; }
          .id-card-info strong, .id-card-address strong { font-size: 12px; overflow-wrap: anywhere; }
          .id-card-code { display: grid; grid-column: 1 / -1; grid-template-columns: auto 1fr; justify-items: start; align-items: center; gap: 8px; min-height: 72px; padding: 8px 6px; border: 1px dashed #9bb6d3; border-radius: 12px; background: #f6f8fb; text-align: left; }
          .id-card-barcode { width: 70px; height: 42px; border: 3px solid #10233f; border-radius: 9px; background: linear-gradient(90deg, #10233f 0 5px, transparent 5px 9px, #10233f 9px 13px, transparent 13px 18px, #10233f 18px 22px, transparent 22px 30px, #10233f 30px 35px, transparent 35px 40px, #10233f 40px 44px, transparent 44px 50px, #10233f 50px 55px, transparent 55px), linear-gradient(#fff, #fff); box-shadow: inset 0 0 0 4px #fff; }
          .id-card-code span { display: block; color: #5b6b82; font-size: 9px; font-weight: 900; text-transform: uppercase; }
          .id-card-code strong { color: #10233f; font-size: 10px; line-height: 1.15; overflow-wrap: anywhere; }
          .id-card-address { flex: 0 0 auto; margin: 0 12px 8px; padding: 8px; border-radius: 12px; background: #f6f8fb; }
          .id-card-footer { display: flex; justify-content: space-between; gap: 12px; flex: 0 0 auto; padding: 9px 12px; background: #f2edff; font-size: 11px; font-weight: 900; }
          @page { size: 56mm 88mm; margin: 4mm; }
          @media print { body { background: #fff; padding: 0; } .student-id-card { box-shadow: none; width: 56mm; height: 88mm; } }
        </style>
      </head>
      <body>${getTeacherIdCardMarkup(staff)}<script>window.print();</script></body>
    </html>
  `);
  printWindow.document.close();
}

function getSecurityStateObject() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
}

function getSecurityBackups() {
  try {
    return JSON.parse(localStorage.getItem(SECURITY_BACKUP_KEY) || "[]");
  } catch {
    return [];
  }
}

function setSecurityBackups(backups) {
  localStorage.setItem(SECURITY_BACKUP_KEY, JSON.stringify(backups.slice(0, 10)));
}

function getSecurityRecordCounts() {
  const sessionPayments = collectedPayments[activeSession] || {};
  const paymentCount = Object.values(sessionPayments).reduce((sum, payments) => sum + (Array.isArray(payments) ? payments.length : 0), 0);
  const session = getActiveFinanceSessionData();
  return {
    students: students.length,
    activeStudents: getActiveStudents().length,
    staff: staffMembers.length,
    payments: paymentCount,
    notices: notices.length,
    feeMaster: (session.feeMaster || []).length,
    feeGroups: (session.feeGroups || []).length,
    timetable: classTimetableEntries.length,
    transportVillages: transportVillages.length,
    transportRoutes: transportRoutes.length,
    transportVehicles: transportVehicles.length,
    transportAssignments: transportVehicleAssignments.length,
    routePickupPoints: transportRoutePickupPoints.length,
    users: userAccessAccounts.length + studentUserAccounts.length
  };
}

function getSecuritySnapshot() {
  saveAppState();
  const stateText = localStorage.getItem(STORAGE_KEY) || "{}";
  const backups = getSecurityBackups();
  const counts = getSecurityRecordCounts();
  const totalRecords = Object.values(counts).reduce((sum, value) => sum + Number(value || 0), 0);
  const lastBackup = backups[0]?.createdAt || "";
  const dbSizeKb = Math.max(1, Math.ceil(new Blob([stateText]).size / 1024));
  return {
    counts,
    totalRecords,
    dbSizeKb,
    backupCount: backups.length,
    backupDate: lastBackup ? formatDateDDMMYYYY(lastBackup) : "No backup",
    version: "ANPS-ERP Local v1.0",
    runMode: "Local Browser",
    logicStatus: getSystemHealthReport().issues.length ? "Review Needed" : "Healthy"
  };
}

function getSessionAliases(session = activeSession) {
  const cleanSession = String(session || "").trim();
  if (!cleanSession) return [];
  const aliases = new Set([cleanSession]);
  const [startYear, endYear] = cleanSession.split("-");
  if (startYear && endYear) {
    if (startYear.length === 2) aliases.add(`20${startYear}-${endYear}`);
    if (startYear.length === 4 && endYear.length === 2) {
      aliases.add(`${startYear.slice(-2)}-${endYear}`);
      aliases.add(`${startYear}-${startYear.slice(0, 2)}${endYear}`);
    }
    if (startYear.length === 2 && endYear.length === 2) aliases.add(`20${startYear}-20${endYear}`);
    if (startYear.length === 4 && endYear.length === 4) aliases.add(`${startYear}-${endYear.slice(-2)}`);
  }
  return [...aliases];
}

function hasFinanceSetupRecords(session = {}) {
  return Boolean(
    (session.feeMaster || []).length ||
    (session.feeGroups || []).length
  );
}

function createBlankFinanceSession(summary = "No finance data entered for this session yet.") {
  return {
    feesCollected: "Rs. 0",
    collectionPercent: 0,
    followUps: 0,
    highPriority: 0,
    paid: 0,
    promise: 0,
    overdue: 0,
    summary,
    feeMaster: [],
    feeGroups: [],
    dues: []
  };
}

function cloneFinanceSessionData(session = {}) {
  return {
    ...createBlankFinanceSession(session.summary || "Fee setup copied for the active session."),
    ...session,
    feeMaster: JSON.parse(JSON.stringify(session.feeMaster || [])),
    feeGroups: JSON.parse(JSON.stringify(session.feeGroups || [])),
    dues: JSON.parse(JSON.stringify(session.dues || []))
  };
}

function getActiveFinanceSessionData() {
  const aliases = getSessionAliases(activeSession);
  const populatedSession = aliases
    .map(session => financeSessions[session])
    .find(session => session && hasFinanceSetupRecords(session));
  return populatedSession || financeSessions[activeSession] || {};
}

function ensureActiveFinanceSessionData() {
  if (!financeSessions[activeSession]) {
    financeSessions[activeSession] = createBlankFinanceSession();
  }
  if (hasFinanceSetupRecords(financeSessions[activeSession])) return financeSessions[activeSession];
  const aliasWithData = getSessionAliases(activeSession)
    .filter(session => session !== activeSession)
    .find(session => financeSessions[session] && hasFinanceSetupRecords(financeSessions[session]));
  if (aliasWithData) {
    const aliasData = cloneFinanceSessionData(financeSessions[aliasWithData]);
    financeSessions[activeSession] = {
      ...financeSessions[activeSession],
      summary: financeSessions[activeSession].summary || aliasData.summary,
      feeMaster: aliasData.feeMaster,
      feeGroups: aliasData.feeGroups
    };
    saveAppState();
  }
  return financeSessions[activeSession];
}

function getBestAvailableFinanceSessionData() {
  const activeData = getActiveFinanceSessionData();
  if (hasFinanceSetupRecords(activeData)) {
    return activeData;
  }
  return Object.values(financeSessions).find(session => session && hasFinanceSetupRecords(session)) || activeData;
}

function hasStaffSetupData() {
  return Boolean(
    staffMembers.length ||
    userAccessAccounts.some(account =>
      String(account.status || "Active") === "Active" &&
      String(account.role || "").trim().toLowerCase() !== "master admin"
    )
  );
}

function hasFeeMasterSetupData() {
  const session = getBestAvailableFinanceSessionData();
  return Boolean((session.feeMaster || []).length || (session.feeGroups || []).length);
}

function getSecurityReadinessIssues() {
  const issues = [];
  if (!students.length) issues.push("No student records found.");
  if (!hasStaffSetupData()) issues.push("No staff records found.");
  if (!hasFeeMasterSetupData()) issues.push("No fee master structure found for active session.");
  if (!roles.length) issues.push("No user roles found.");
  if (!navigator.onLine) issues.push("Browser is currently offline.");
  return issues;
}

function addHealthIssue(list, type, title, details, severity = "warning") {
  list.push({type, title, details, severity});
}

function getDuplicateValues(items, getValue) {
  const seen = new Map();
  items.forEach(item => {
    const value = String(getValue(item) || "").trim().toLowerCase();
    if (!value) return;
    seen.set(value, (seen.get(value) || 0) + 1);
  });
  return [...seen.entries()].filter(([, count]) => count > 1).map(([value, count]) => ({value, count}));
}

function getPaymentHealthRecords() {
  const sessionPayments = collectedPayments[activeSession] || {};
  return Object.entries(sessionPayments).flatMap(([admissionNo, payments]) =>
    (Array.isArray(payments) ? payments : []).map(payment => ({admissionNo, payment}))
  );
}

function getSystemHealthReport() {
  const issues = [];
  const setupIssues = getSecurityReadinessIssues();
  setupIssues.forEach(issue => addHealthIssue(issues, "Setup Pending", issue, "Core setup is not complete yet.", "info"));

  getDuplicateValues(students, student => student.admissionNo).forEach(item => {
    addHealthIssue(issues, "Duplicate Check", "Duplicate admission number", `${item.value} appears ${item.count} times.`, "danger");
  });
  getDuplicateValues(transportVehicles, vehicle => vehicle.vehicleNo).forEach(item => {
    addHealthIssue(issues, "Duplicate Check", "Duplicate vehicle number", `${item.value} appears ${item.count} times.`, "warning");
  });
  getDuplicateValues(transportRoutes, route => route.routeName).forEach(item => {
    addHealthIssue(issues, "Duplicate Check", "Duplicate route name", `${item.value} appears ${item.count} times.`, "warning");
  });
  getDuplicateValues(staffMembers, staff => staff.staffId).forEach(item => {
    addHealthIssue(issues, "Duplicate Check", "Duplicate staff ID", `${item.value} appears ${item.count} times.`, "warning");
  });

  const receiptOwners = new Map();
  getPaymentHealthRecords().forEach(({admissionNo, payment}) => {
    const receipt = String(payment.receipt || "").trim();
    if (!receipt) {
      addHealthIssue(issues, "Payment Integrity", "Payment without receipt number", `${admissionNo || "Unknown student"} has a payment with no receipt no.`, "danger");
      return;
    }
    if (!receiptOwners.has(receipt)) receiptOwners.set(receipt, new Set());
    receiptOwners.get(receipt).add(admissionNo);
    const allocationsTotal = (payment.allocations || []).reduce((sum, allocation) => sum + Number(allocation.amount || 0), 0);
    const paidSplit = Number(payment.bankAmount || 0) + Number(payment.cashAmount || 0);
    const savedAmount = Number(payment.amount || 0);
    const discountAmount = Number(payment.discountAmount || 0);
    const coveredAmount = savedAmount + discountAmount;
    if (Math.abs(savedAmount - paidSplit) > 1) {
      addHealthIssue(issues, "Payment Integrity", "Bank/Cash total mismatch", `${receipt}: amount ${formatRs(savedAmount)} but bank+cash ${formatRs(paidSplit)}.`, "danger");
    }
    if (allocationsTotal && Math.abs(coveredAmount - allocationsTotal) > 1) {
      addHealthIssue(issues, "Payment Integrity", "Receipt allocation mismatch", `${receipt}: paid ${formatRs(savedAmount)} + discount ${formatRs(discountAmount)} but fee allocations ${formatRs(allocationsTotal)}.`, "warning");
    }
  });
  receiptOwners.forEach((owners, receipt) => {
    if (owners.size > 1) {
      addHealthIssue(issues, "Duplicate Check", "Receipt number used for multiple students", `${receipt} is linked with ${owners.size} admission numbers.`, "danger");
    }
  });

  getActiveStudents().forEach(student => {
    const services = Array.isArray(student.otherServices) ? student.otherServices : [];
    if (services.includes("Transport") && services.includes("Special/Custom")) {
      addHealthIssue(issues, "Fee Logic", "Transport and Special/Custom both selected", `${student.admissionNo || "-"} ${student.name || ""}`, "danger");
    }
    if (studentTakesTransport(student)) {
      if (!student.villageTown) {
        addHealthIssue(issues, "Transport Logic", "Transport student without village/town", `${student.admissionNo || "-"} ${student.name || ""}`, "danger");
      }
      if (Number(student.transportFee || 0) <= 0) {
        addHealthIssue(issues, "Transport Logic", "Transport student without transport fee", `${student.admissionNo || "-"} ${student.name || ""}`, "warning");
      }
      const cleanVillage = normalizeVillageName(student.villageTown || "");
      const pickup = transportRoutePickupPoints.find(point =>
        normalizeVillageName(point.villageName || "") === cleanVillage &&
        String(point.routeName || "").trim()
      );
      if (!pickup) {
        addHealthIssue(issues, "Transport Logic", "Transport student village not mapped to route", `${student.admissionNo || "-"} ${student.name || ""} | ${student.villageTown || "-"}`, "warning");
      } else if (!getTransportAssignment(pickup.routeName, pickup.shift)?.vehicleNo) {
        addHealthIssue(issues, "Transport Logic", "Route pickup has no assigned vehicle", `${pickup.routeName || "-"} | ${pickup.villageName || "-"} | ${pickup.shift || "-"}`, "warning");
      }
    }
  });

  transportRoutePickupPoints.forEach(point => {
    if (point.cleared || (!String(point.routeName || "").trim() && String(point.villageName || "").trim())) return;
    if (!point.routeName || !point.villageName || !point.shift) {
      addHealthIssue(issues, "Transport Logic", "Incomplete route pickup mapping", `${point.routeName || "-"} | ${point.villageName || "-"} | ${point.shift || "-"}`, "warning");
    }
  });

  const backups = getSecurityBackups();
  if (!backups.length) {
    addHealthIssue(issues, "Backup", "No backup found", "Create a backup after setup or before major changes.", "warning");
  } else {
    const lastBackupTime = new Date(backups[0].createdAt).getTime();
    if (Number.isFinite(lastBackupTime)) {
      const days = Math.floor((Date.now() - lastBackupTime) / 86400000);
      if (days >= 7) addHealthIssue(issues, "Backup", "Backup is older than 7 days", `Last backup was ${days} day(s) ago.`, "warning");
    }
  }

  const danger = issues.filter(issue => issue.severity === "danger").length;
  const warning = issues.filter(issue => issue.severity === "warning").length;
  const info = issues.filter(issue => issue.severity === "info").length;
  const score = Math.max(0, 100 - danger * 18 - warning * 8 - info * 4);
  return {issues, score, danger, warning, info};
}

function getSecuritySafetySignal(report = getSystemHealthReport()) {
  if (report.danger > 0) return {tone: "red", label: "Red Alert", detail: `${report.danger} critical issue(s)`};
  if (report.warning > 0 || report.info > 0) return {tone: "yellow", label: "Yellow Review", detail: `${report.warning + report.info} item(s) need review`};
  return {tone: "blue", label: "Light Blue Safe", detail: "No active health issue"};
}

function getSecurityBackendStatusLabel() {
  const hasRecentBackendHealth = Date.now() - backendLastHealthOkAt < BACKEND_HEALTH_GRACE_MS;
  if (navigator.onLine && (backendSyncReady || hasRecentBackendHealth)) return "Online";
  if (navigator.onLine) return "Checking";
  return "Offline";
}

function getSecurityLastSaveLabel() {
  if (!backendLastLocalSaveAt) return "No save yet";
  return new Date(backendLastLocalSaveAt).toLocaleString("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true
  });
}

function renderSecurityMaintenance(message = "") {
  const cards = document.getElementById("securityStatusCards");
  const runMode = document.getElementById("securityRunMode");
  if (!cards) return;
  const snapshot = getSecuritySnapshot();
  const report = getSystemHealthReport();
  const safety = getSecuritySafetySignal(report);
  if (runMode) runMode.textContent = `Run Mode: ${snapshot.runMode}`;
  cards.innerHTML = [
    {label: "System Safety Light", value: safety.label, detail: safety.detail, className: `safety-light-card safety-${safety.tone}`},
    {label: "Backend", value: getSecurityBackendStatusLabel()},
    {label: "Last Save", value: getSecurityLastSaveLabel()},
    {label: "Alerts", value: report.issues.length},
    {label: "Logic Check", value: snapshot.logicStatus},
    {label: "Database", value: `${snapshot.dbSizeKb} KB`},
    {label: "Total Records", value: snapshot.totalRecords},
    {label: "Backup", value: `${snapshot.backupCount} saved`},
    {label: "Version", value: snapshot.version},
    {label: "Backup Date", value: snapshot.backupDate},
    {label: "Active Sign-ins", value: `${userAccessAccounts.filter(item => item.status === "Active").length + studentUserAccounts.filter(item => item.status === "Active").length}`},
    {label: "Refresh Rate", value: "Manual / On demand"}
  ].map(card => `
    <article class="${escapeHtml(card.className || "")}">
      <span>${escapeHtml(card.label)}</span>
      <strong>${escapeHtml(String(card.value))}</strong>
      ${card.detail ? `<small>${escapeHtml(card.detail)}</small>` : ""}
    </article>
  `).join("");
  if (message) {
    const output = document.getElementById("securityOutput");
    if (output) output.innerHTML = message;
  }
}

async function createSecurityBackup() {
  const saved = saveAppState();
  const state = getSecurityStateObject();
  const backup = {
    id: `BACKUP-${Date.now()}`,
    createdAt: new Date().toISOString(),
    activeSession,
    records: getSecurityRecordCounts(),
    state
  };
  const backups = [backup, ...getSecurityBackups()];
  setSecurityBackups(backups);
  renderSecurityMaintenance(`<strong>Browser backup created.</strong><br>${formatDateDDMMYYYY(backup.createdAt)} | Records: ${Object.values(backup.records).reduce((sum, value) => sum + Number(value || 0), 0)}<br>Creating Render disk backup...`);
  showToast("Security backup created.");
  if (!saved) return;
  try {
    await new Promise(resolve => setTimeout(resolve, BACKEND_SAVE_DEBOUNCE_MS + 250));
    if (backendSaveTimer) await processBackendSaveQueue();
    while (backendSaveInFlight) await new Promise(resolve => setTimeout(resolve, 150));
    const hasToken = await ensureBackendToken();
    if (!hasToken) throw new Error("Backend session is not ready.");
    const response = await backendFetch("/api/backup", {
      method: "POST",
      headers: backendHeaders()
    }, 20000);
    const payload = await response.json().catch(() => ({}));
    if (!response.ok || payload?.ok === false) throw new Error(payload?.error || `Backup failed ${response.status}`);
    renderSecurityMaintenance(`
      <strong>Backup created.</strong><br>
      Browser backup: ${escapeHtml(formatDateDDMMYYYY(backup.createdAt))}<br>
      Render disk backup: ${escapeHtml(payload.file || "Created")}<br>
      Backup ID: ${escapeHtml(String(payload.backup_id || "-"))}
    `);
    showToast("Render backup created.");
  } catch (error) {
    renderSecurityMaintenance(`
      <strong>Browser backup created, but Render backup failed.</strong><br>
      ${escapeHtml(error?.message || "Please check backend connection and try again.")}
    `);
    showToast("Render backup failed.", "error");
  }
}

function exportSecurityJson() {
  saveAppState();
  const payload = {
    exportedAt: new Date().toISOString(),
    version: "ANPS-ERP Local v1.0",
    state: getSecurityStateObject()
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], {type: "application/json"});
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `anps-backup-${new Date().toISOString().slice(0, 10)}.json`;
  link.click();
  URL.revokeObjectURL(link.href);
  renderSecurityMaintenance("<strong>Export ready.</strong><br>JSON backup file downloaded.");
}

function showSecurityServerJson() {
  saveAppState();
  const textArea = document.getElementById("securityJsonOutput");
  if (textArea) textArea.value = JSON.stringify(getSecurityStateObject(), null, 2);
  renderSecurityMaintenance("<strong>Server JSON loaded.</strong><br>Current local database snapshot is visible.");
}

function restoreSecurityDataFromFile(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const parsed = JSON.parse(String(reader.result || "{}"));
      const state = parsed.state && typeof parsed.state === "object" ? parsed.state : parsed;
      if (!state || typeof state !== "object") throw new Error("Invalid JSON");
      if (!confirm("Restore this JSON data? Current local data will be replaced.")) return;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      renderSecurityMaintenance("<strong>Restore complete.</strong><br>Reloading app now.");
      setTimeout(() => window.location.reload(), 500);
    } catch {
      showToast("Invalid restore JSON file.");
    }
  };
  reader.readAsText(file);
}

function runSecurityMaintenance() {
  saveAppState();
  const issues = getSecurityReadinessIssues();
  const message = issues.length
    ? `<strong>Maintenance complete with ${issues.length} note(s).</strong><ul>${issues.map(issue => `<li>${escapeHtml(issue)}</li>`).join("")}</ul>`
    : "<strong>Maintenance complete.</strong><br>No major local logic issue found.";
  renderSecurityMaintenance(message);
  showToast("Maintenance completed.");
}

function showSecurityBackups() {
  const backups = getSecurityBackups();
  renderSecurityMaintenance(backups.length ? `
    <strong>Saved backups</strong>
    <ul>${backups.map(backup => `<li>${escapeHtml(formatDateDDMMYYYY(backup.createdAt))} | ${escapeHtml(backup.activeSession || "-")} | ${Object.values(backup.records || {}).reduce((sum, value) => sum + Number(value || 0), 0)} records</li>`).join("")}</ul>
  ` : "<strong>No backups saved yet.</strong>");
}

function exportSecuritySavedBackups() {
  const backups = getSecurityBackups();
  if (!backups.length) {
    renderSecurityMaintenance("<strong>No saved backups found.</strong><br>Create a backup first, then export.");
    showToast("No saved backups found.");
    return;
  }
  const payload = {
    exportedAt: new Date().toISOString(),
    version: "ANPS-ERP Saved Browser Backups v1.0",
    source: "Security Maintenance",
    backups
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], {type: "application/json"});
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `anps-security-browser-backups-${new Date().toISOString().slice(0, 10)}.json`;
  link.click();
  URL.revokeObjectURL(link.href);
  renderSecurityMaintenance(`<strong>Saved backups exported.</strong><br>${backups.length} backup file downloaded.`);
  showToast("Saved backups exported.");
}

function findFeeMasterInSecurityBackups() {
  const backups = getSecurityBackups();
  const activeAliases = getSessionAliases(activeSession);
  for (const backup of backups) {
    const sessions = backup?.state?.financeSessions || {};
    for (const sessionName of activeAliases) {
      const feeMaster = sessions[sessionName]?.feeMaster;
      if (Array.isArray(feeMaster) && feeMaster.length) {
        return {backup, sessionName, feeMaster};
      }
    }
    for (const [sessionName, sessionData] of Object.entries(sessions)) {
      const feeMaster = sessionData?.feeMaster;
      if (Array.isArray(feeMaster) && feeMaster.length) {
        return {backup, sessionName, feeMaster};
      }
    }
  }
  return null;
}

function restoreFeeMasterOnlyFromSecurityBackup() {
  const match = findFeeMasterInSecurityBackups();
  if (!match) {
    renderSecurityMaintenance("<strong>No Fee Master found in saved browser backups.</strong><br>Export/save a backup that contains Fee Master data first.");
    showToast("No Fee Master backup found.");
    return;
  }
  const currentSession = ensureActiveFinanceSessionData();
  const existingCount = (currentSession.feeMaster || []).length;
  const backupDate = formatDateDDMMYYYY(match.backup?.createdAt || new Date().toISOString());
  const message = existingCount
    ? `Replace ${existingCount} current Fee Master row(s) in ${activeSession} with ${match.feeMaster.length} row(s) from backup ${backupDate}? Only Fee Master will change.`
    : `Restore ${match.feeMaster.length} Fee Master row(s) into ${activeSession} from backup ${backupDate}? Only Fee Master will change.`;
  if (!confirm(message)) return;

  currentSession.feeMaster = JSON.parse(JSON.stringify(match.feeMaster));
  currentSession.summary = currentSession.summary || `Fee Master restored from backup ${backupDate}.`;
  if (!saveAppState()) return;
  renderFeeMaster();
  renderFinanceSession();
  renderSecurityStatusCards();
  renderSecurityMaintenance(`
    <strong>Fee Master restored safely.</strong><br>
    ${match.feeMaster.length} row(s) copied from backup session ${escapeHtml(match.sessionName)} to active session ${escapeHtml(activeSession)}.
    <br>Student, payment, staff and transport data were not changed.
  `);
  showToast("Fee Master restored from backup.");
}

function showSecurityAudit() {
  const counts = getSecurityRecordCounts();
  renderSecurityMaintenance(`
    <strong>Data Audit</strong>
    <ul>${Object.entries(counts).map(([key, value]) => `<li>${escapeHtml(key)}: ${value}</li>`).join("")}</ul>
  `);
}

function showSecuritySystemHealth() {
  const report = getSystemHealthReport();
  const grouped = report.issues.reduce((groups, issue) => {
    if (!groups[issue.type]) groups[issue.type] = [];
    groups[issue.type].push(issue);
    return groups;
  }, {});
  const status = report.danger ? "Critical Review" : report.warning ? "Review Needed" : report.info ? "Setup Pending" : "Healthy";
  renderSecurityMaintenance(`
    <div class="system-health-summary">
      <article><span>Health Score</span><strong>${report.score}%</strong></article>
      <article><span>Status</span><strong>${escapeHtml(status)}</strong></article>
      <article><span>Critical</span><strong>${report.danger}</strong></article>
      <article><span>Warning</span><strong>${report.warning}</strong></article>
    </div>
    ${report.issues.length ? Object.entries(grouped).map(([type, items]) => `
      <div class="system-health-group">
        <strong>${escapeHtml(type)}</strong>
        <ul>
          ${items.map(issue => `<li class="${escapeHtml(issue.severity)}"><b>${escapeHtml(issue.title)}</b><span>${escapeHtml(issue.details || "")}</span></li>`).join("")}
        </ul>
      </div>
    `).join("") : "<strong>System Health: Healthy</strong><br>No setup, duplicate, transport, payment or backup issue found."}
  `);
}

function getAlertSolverRules() {
  return [
    {
      id: "duplicate-receipt",
      title: "Duplicate Receipt Number",
      severity: "Critical",
      module: "Security / Collect Fees",
      pages: ["Security > Duplicate Receipts", "Collect Fees > Payment History"],
      patterns: ["receipt number used for multiple students", "linked with", "duplicate receipt", "same receipt"],
      reason: "Same receipt number multiple admission numbers-e use hoyeche.",
      steps: [
        "Open Security > Duplicate Receipts.",
        "Review the receipt group.",
        "Click Fix This or Fix All Duplicates.",
        "Then refresh Security Maintenance > System Health and check whether the alert is reduced."
      ]
    },
    {
      id: "allocation-mismatch",
      title: "Receipt Allocation Mismatch",
      severity: "Review",
      module: "Collect Fees",
      pages: ["Collect Fees > Payment History"],
      patterns: ["receipt allocation mismatch", "fee allocations"],
      reason: "Payment amount, discount, fine and fee allocation totals do not match in one row.",
      steps: [
        "Open Collect Fees > Payment History.",
        "Enter the receipt number in Receipt No search.",
        "Use the edit icon to check payment details.",
        "If a discount exists, check whether Paid plus Discount matches the allocation.",
        "If the entry is incorrect, edit or delete it and save the correct payment."
      ]
    },
    {
      id: "bank-cash-mismatch",
      title: "Bank/Cash Total Mismatch",
      severity: "Critical",
      module: "Collect Fees",
      pages: ["Collect Fees > Payment History"],
      patterns: ["bank/cash total mismatch", "bank+cash"],
      reason: "Saved amount-er sathe bank payment + cash payment total milche na.",
      steps: [
        "Search the receipt number on Collect Fees > Payment History.",
        "Use the edit icon to check bank and cash amounts.",
        "Update Bank plus Cash so it matches the Total Amount."
      ]
    },
    {
      id: "missing-receipt",
      title: "Payment Without Receipt Number",
      severity: "Critical",
      module: "Collect Fees",
      pages: ["Collect Fees > Payment History"],
      patterns: ["payment without receipt", "no receipt no"],
      reason: "Payment save hoyeche kintu receipt number blank.",
      steps: [
        "Open Collect Fees > Payment History.",
        "Find the problem payment row.",
        "Edit the row, enter a unique receipt number and save."
      ]
    },
    {
      id: "no-backup",
      title: "Backup Required",
      severity: "Warning",
      module: "Security",
      pages: ["Security > Security Maintenance"],
      patterns: ["no backup found", "backup is older"],
      reason: "No recent backup is available, or the backup is outdated.",
      steps: [
        "Open Security > Security Maintenance.",
        "Click Create Backup.",
        "Check whether the Backup Date card has updated."
      ]
    },
    {
      id: "transport-mapping",
      title: "Transport Route / Vehicle Mapping Issue",
      severity: "Review",
      module: "Transport",
      pages: ["Transport > Route Pickup Point", "Transport > Assign Vehicle", "Transport > Student Transport Fees"],
      patterns: ["transport student village not mapped", "route pickup has no assigned vehicle", "transport student without village", "transport student without transport fee"],
      reason: "A transport student is missing village, route, vehicle assignment or fee setup.",
      steps: [
        "Check whether the village exists in Transport > Pickup Point.",
        "Map the village to route and shift in Transport > Route Pickup Point.",
        "Assign the vehicle by route and shift in Transport > Assign Vehicle.",
        "Verify fee and status on the Student Transport Fees page."
      ]
    },
    {
      id: "duplicate-master",
      title: "Duplicate Master Data",
      severity: "Review",
      module: "Student / Transport / HR",
      pages: ["Student Details", "Transport", "Human Resources"],
      patterns: ["duplicate admission number", "duplicate vehicle number", "duplicate route name", "duplicate staff id"],
      reason: "Same master data ekadhik bar save hoyeche.",
      steps: [
        "Check which duplicate is mentioned in the alert text.",
        "Open the related page.",
        "Edit or delete duplicate rows and keep one correct record."
      ]
    },
    {
      id: "offline-save",
      title: "Internet / Server Connection Problem",
      severity: "Critical",
      module: "Backend / Save",
      pages: ["Topbar Online Status", "Security > Security Maintenance"],
      patterns: ["no internet", "server connection", "entry not saved", "offline", "backend save failed"],
      reason: "Entries will not save if the internet or server connection is unstable.",
      steps: [
        "Check whether Online is visible in the top bar.",
        "If Offline or Checking appears, refresh the page and log in again.",
        "Confirm Online status before saving an entry.",
        "If the problem continues, check whether the Render service is running."
      ]
    }
  ];
}

function analyzeAlertText(text = "") {
  const clean = String(text || "").trim();
  const lower = clean.toLowerCase();
  if (!clean) return [];
  const rules = getAlertSolverRules();
  return rules.filter(rule => rule.patterns.some(pattern => lower.includes(pattern)));
}

function renderAlertSolverMatches(matches = [], rawText = "") {
  const output = document.getElementById("alertSolverOutput");
  if (!output) return;
  if (!String(rawText || "").trim()) {
    output.innerHTML = "Paste an alert and click Analyze Alert.";
    return;
  }
  if (!matches.length) {
    output.innerHTML = `
      <article class="alert-solver-card solver-warning">
        <span>Unknown Alert</span>
        <strong>No exact rule match was found.</strong>
        <p>Check the alert group in Security Maintenance > System Health, then open the related page. Send the alert text to Codex if a new rule is needed.</p>
      </article>
    `;
    return;
  }
  output.innerHTML = matches.map(match => `
    <article class="alert-solver-card solver-${match.severity.toLowerCase() === "critical" ? "danger" : "warning"}">
      <span>${escapeHtml(match.severity)} | ${escapeHtml(match.module)}</span>
      <strong>${escapeHtml(match.title)}</strong>
      <p>${escapeHtml(match.reason)}</p>
      <div><b>Related Page:</b> ${match.pages.map(page => `<code>${escapeHtml(page)}</code>`).join(" ")}</div>
      <ol>${match.steps.map(step => `<li>${escapeHtml(step)}</li>`).join("")}</ol>
    </article>
  `).join("");
}

function renderAlertSolverPage() {
  const input = document.getElementById("alertSolverInput");
  const output = document.getElementById("alertSolverOutput");
  if (!input || !output) return;
  if (!output.dataset.ready) {
    output.dataset.ready = "1";
    renderAlertSolverMatches([], "");
  }
}

function analyzeAlertSolverInput() {
  const input = document.getElementById("alertSolverInput");
  const text = input?.value || "";
  renderAlertSolverMatches(analyzeAlertText(text), text);
}

function loadCurrentAlertsIntoSolver() {
  const input = document.getElementById("alertSolverInput");
  if (!input) return;
  const report = getSystemHealthReport();
  input.value = report.issues.map(issue => `${issue.type}: ${issue.title}\n${issue.details || ""}`).join("\n\n");
  analyzeAlertSolverInput();
}

function getRolePermissionCounts(roleName = "") {
  const permissions = normalizeRolePermission(roleName);
  let viewOn = 0;
  let totalOn = 0;
  let total = 0;
  ACCESS_PERMISSION_MODULES.forEach(moduleId => {
    ACCESS_ACTIONS.forEach(action => {
      total += 1;
      if (permissions?.[moduleId]?.[action]) {
        totalOn += 1;
        if (action === "view") viewOn += 1;
      }
    });
  });
  return {viewOn, totalOn, total};
}

function getRoleAuditLabel(roleName = "") {
  const audit = rolePermissionAudit[roleName] || {};
  if (!audit.updatedAt) return "-";
  const date = new Date(audit.updatedAt);
  const dateLabel = Number.isNaN(date.getTime()) ? String(audit.updatedAt || "-") : date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
  return `${dateLabel}${audit.updatedBy ? ` by ${audit.updatedBy}` : ""}`;
}

function getRoleHealthRows() {
  const roleNames = new Set();
  roles.forEach(role => {
    const name = String(role.name || "").trim();
    if (name) roleNames.add(name);
  });
  Object.keys(rolePermissions).forEach(name => {
    if (String(name || "").trim()) roleNames.add(name);
  });
  userAccessAccounts.forEach(account => {
    const roleName = String(account.role || "").trim();
    if (roleName) roleNames.add(roleName);
  });
  PROTECTED_ROLE_NAMES.forEach(name => roleNames.add(name));
  return [...roleNames].sort((a, b) => a.localeCompare(b)).map(roleName => {
    const counts = getRolePermissionCounts(roleName);
    const users = userAccessAccounts.filter(account => String(account.role || "").trim().toLowerCase() === roleName.toLowerCase());
    const activeUsers = users.filter(account => String(account.status || "Active") === "Active").length;
    const roleExists = roles.some(role => String(role.name || "").trim().toLowerCase() === roleName.toLowerCase());
    const protectedRole = isProtectedRoleName(roleName);
    const issues = [];
    if (!roleExists && !protectedRole) issues.push("Role setup missing");
    if (!protectedRole && counts.viewOn === 0) issues.push("No view access");
    if (!protectedRole && counts.totalOn === counts.total) issues.push("Full access");
    if (protectedRole && counts.totalOn < counts.total) issues.push("Protected role changed");
    const status = protectedRole ? "Locked" : issues.some(issue => /missing|No view|Protected/i.test(issue)) ? "Critical" : issues.length ? "Review" : "OK";
    return {roleName, counts, users, activeUsers, roleExists, protectedRole, issues, status};
  });
}

function getRoleHealthIssues(rows = getRoleHealthRows()) {
  const issues = [];
  if (!roles.length) issues.push({severity: "Warning", title: "No roles saved", detail: "Add roles in HR Setup > Role Setup."});
  if (!userAccessAccounts.length) issues.push({severity: "Info", title: "No user login saved", detail: "Create staff logins in Settings > User Access & Permissions."});
  rows.forEach(row => {
    if (!row.roleExists && !row.protectedRole) {
      issues.push({severity: "Critical", title: `${row.roleName} role setup missing`, detail: "The role exists in User Access, but it is missing from the HR Setup role list."});
    }
    if (!row.protectedRole && row.counts.viewOn === 0) {
      issues.push({severity: "Critical", title: `${row.roleName} has no view permission`, detail: "Ei role login korle sidebar almost blank hote pare."});
    }
    if (!row.protectedRole && row.counts.totalOn === row.counts.total) {
      issues.push({severity: "Warning", title: `${row.roleName} has full access`, detail: "Check whether full access is required for non-admin roles."});
    }
    if (row.protectedRole && row.counts.totalOn < row.counts.total) {
      issues.push({severity: "Critical", title: `${row.roleName} protected permission changed`, detail: "Protected role full access locked thaka uchit."});
    }
  });
  userAccessAccounts.forEach(account => {
    const name = account.staffName || account.loginId || "User";
    if (!String(account.role || "").trim()) issues.push({severity: "Critical", title: `${name} has no role`, detail: "Select a role in the user access login."});
    if (!String(account.loginId || "").trim()) issues.push({severity: "Critical", title: `${name} login ID missing`, detail: "Login ID chara user login korte parbe na."});
    if (!String(account.password || "").trim()) issues.push({severity: "Warning", title: `${name} password missing`, detail: "A blank password may cause login issues."});
  });
  return issues;
}

function renderRolePermissionHealth() {
  const summary = document.getElementById("roleHealthSummary");
  const rowsBody = document.getElementById("roleHealthRows");
  const issueBox = document.getElementById("roleHealthIssues");
  if (!summary || !rowsBody || !issueBox) return;
  const rows = getRoleHealthRows();
  const issues = getRoleHealthIssues(rows);
  const criticalCount = issues.filter(issue => issue.severity === "Critical").length;
  const warningCount = issues.filter(issue => issue.severity === "Warning").length;
  const activeUserCount = userAccessAccounts.filter(account => String(account.status || "Active") === "Active").length;
  summary.innerHTML = `
    <article><span>Total Roles</span><strong>${rows.length}</strong><small>Role setup + permission roles</small></article>
    <article><span>Active Users</span><strong>${activeUserCount}</strong><small>Login enabled users</small></article>
    <article><span>Critical</span><strong>${criticalCount}</strong><small>Immediate check</small></article>
    <article><span>Warnings</span><strong>${warningCount}</strong><small>Review needed</small></article>
  `;
  rowsBody.innerHTML = rows.map(row => {
    const statusClass = row.status === "OK" || row.status === "Locked" ? "stable" : row.status === "Review" ? "watch" : "pending";
    return `
      <tr>
        <td><strong>${escapeHtml(row.roleName)}</strong>${row.protectedRole ? `<small class="system-lock-note">Protected</small>` : ""}</td>
        <td>${row.activeUsers}/${row.users.length}</td>
        <td>${row.counts.viewOn}/${ACCESS_PERMISSION_MODULES.length}</td>
        <td>${row.counts.totalOn}/${row.counts.total}</td>
        <td>${escapeHtml(getRoleAuditLabel(row.roleName))}</td>
        <td><span class="status-pill ${statusClass}">${escapeHtml(row.status)}</span>${row.issues.length ? `<small>${row.issues.map(escapeHtml).join(", ")}</small>` : ""}</td>
      </tr>
    `;
  }).join("") || `<tr><td colspan="6">No role found.</td></tr>`;
  if (!issues.length) {
    issueBox.innerHTML = `<strong>Role health OK.</strong><br>No role/permission issue found.`;
    return;
  }
  issueBox.innerHTML = issues.map(issue => `
    <article class="role-health-issue role-health-${issue.severity.toLowerCase()}">
      <span>${escapeHtml(issue.severity)}</span>
      <strong>${escapeHtml(issue.title)}</strong>
      <p>${escapeHtml(issue.detail)}</p>
    </article>
  `).join("");
}

function getDuplicateReceiptGroups() {
  const sessionPayments = collectedPayments[activeSession] || {};
  const groups = new Map();
  Object.entries(sessionPayments).forEach(([admissionNo, payments]) => {
    (payments || []).forEach((payment, index) => {
      const receipt = String(payment.receipt || "").trim();
      if (!receipt) return;
      if (!groups.has(receipt)) groups.set(receipt, []);
      groups.get(receipt).push({admissionNo, payment, index});
    });
  });
  return [...groups.entries()]
    .map(([receipt, rows]) => {
      const admissionSet = new Set(rows.map(row => normalizeAdmissionNo(row.admissionNo)));
      return {receipt, rows, admissionCount: admissionSet.size};
    })
    .filter(group => group.admissionCount > 1)
    .sort((a, b) => String(a.receipt || "").localeCompare(String(b.receipt || ""), undefined, {numeric: true}));
}

function getDuplicateReceiptUsedSet() {
  const usedReceipts = new Set();
  const sessionPayments = collectedPayments[activeSession] || {};
  Object.values(sessionPayments).forEach(payments => {
    (payments || []).forEach(payment => {
      if (payment.receipt) usedReceipts.add(String(payment.receipt).trim());
    });
  });
  return usedReceipts;
}

function renderDuplicateReceiptUtility(message = "") {
  const rowsBody = document.getElementById("duplicateReceiptRows");
  const summary = document.getElementById("duplicateReceiptSummary");
  if (!rowsBody || !summary) return;
  const groups = getDuplicateReceiptGroups();
  const duplicateRows = groups.reduce((sum, group) => sum + Math.max(group.rows.length - 1, 0), 0);
  summary.innerHTML = `
    <article><span>Duplicate Receipts</span><strong>${groups.length}</strong></article>
    <article><span>Rows to Fix</span><strong>${duplicateRows}</strong></article>
    <article><span>Session</span><strong>${escapeHtml(activeSession)}</strong></article>
    ${message ? `<article class="wide"><span>Status</span><strong>${message}</strong></article>` : ""}
  `;
  rowsBody.innerHTML = groups.map(group => {
    const admissions = [...new Set(group.rows.map(row => row.admissionNo || "-"))];
    const names = [...new Set(group.rows.map(row => findStudentByAdmissionNo(row.admissionNo)?.name || "-"))];
    return `
      <tr>
        <td><strong>${escapeHtml(group.receipt)}</strong></td>
        <td>${admissions.map(item => `<span class="duplicate-chip">${escapeHtml(item)}</span>`).join("")}</td>
        <td>${escapeHtml(names.join(", "))}</td>
        <td>${group.rows.length}</td>
        <td><button class="ghost-action" type="button" data-fix-duplicate-receipt="${escapeHtml(group.receipt)}">Fix This</button></td>
      </tr>
    `;
  }).join("") || `<tr><td colspan="5">No duplicate receipt found. Accounts receipt numbers are clean.</td></tr>`;
}

function fixDuplicateReceiptGroups(targetReceipt = "") {
  const groups = getDuplicateReceiptGroups().filter(group => !targetReceipt || group.receipt === targetReceipt);
  if (!groups.length) {
    renderDuplicateReceiptUtility("No duplicate receipt found.");
    showToast("No duplicate receipt found.");
    return 0;
  }
  const usedReceipts = getDuplicateReceiptUsedSet();
  const receiptYear = String(activeSession || new Date().getFullYear()).split("-")[0] || String(new Date().getFullYear());
  const nextSerialRef = {value: Math.max(receiptSerial, getHighestReceiptSerialForActiveSession(receiptYear) + 1)};
  let changed = 0;
  groups.forEach(group => {
    const rows = group.rows.slice();
    rows.slice(1).forEach(row => {
      const nextReceipt = getNextAvailableReceiptForMerge(activeSession, usedReceipts, nextSerialRef);
      row.payment.receipt = nextReceipt;
      changed += 1;
    });
  });
  if (changed > 0) {
    receiptSerial = Math.max(receiptSerial, nextSerialRef.value);
    saveAppState();
    renderDuplicateReceiptUtility(`${changed} receipt row fixed.`);
    renderFeeBook(activeLedgerAdmissionNo || activeFeeStudentAdmissionNo);
    renderFinanceSession();
    updateTopbarStatus();
    showToast(`${changed} duplicate receipt row fixed.`);
  }
  return changed;
}

function showSecurityReadiness() {
  const issues = getSecurityReadinessIssues();
  renderSecurityMaintenance(issues.length ? `
    <strong>Readiness Check: Review Needed</strong>
    <ul>${issues.map(issue => `<li>${escapeHtml(issue)}</li>`).join("")}</ul>
  ` : "<strong>Readiness Check: Ready</strong><br>Students, staff, roles and core finance setup are available.");
}

function showSecurityBackupReminder() {
  const backups = getSecurityBackups();
  if (!backups.length) {
    renderSecurityMaintenance("<strong>Backup Reminder</strong><br>No backup found. Please create a backup after setup or before any major data change.");
    return;
  }
  const lastBackup = backups[0];
  const lastBackupTime = new Date(lastBackup.createdAt).getTime();
  const days = Number.isFinite(lastBackupTime) ? Math.floor((Date.now() - lastBackupTime) / 86400000) : 999;
  const message = days >= 7
    ? `Last backup is ${days} day(s) old. Please create a fresh backup.`
    : `Last backup is ${days} day(s) old. Backup status is okay.`;
  renderSecurityMaintenance(`<strong>Backup Reminder</strong><br>${escapeHtml(message)}<br>Last backup: ${escapeHtml(formatDateDDMMYYYY(lastBackup.createdAt))}`);
}

function refreshAllAfterSecurityClean() {
  try {
    if (!document.querySelector(".view.active")) {
      views.forEach(view => view.classList.toggle("active", view.id === "dashboard"));
      navButtons.forEach(button => button.classList.toggle("active", button.dataset.view === "dashboard"));
      pageTitle.textContent = titleMap.dashboard || "Dashboard";
    }
    setNextReceiptNo();
    renderDashboardOnly();
    renderActiveView();
    renderStaffTeachingSubjectField();
    renderStaffBiometricDevice();
    setNextStaffId();
    renderStaffPhotoPreview();
  } catch (error) {
    console.warn("ERP refresh recovered after sync.", error);
    views.forEach(view => view.classList.toggle("active", view.id === "dashboard"));
    navButtons.forEach(button => button.classList.toggle("active", button.dataset.view === "dashboard"));
    pageTitle.textContent = titleMap.dashboard || "Dashboard";
    renderDashboardOnly();
  }
}

function isBackendAutoSyncPaused() {
  if (backendHydrating || document.hidden) return true;
  if (document.body.classList.contains("modal-open")) return true;
  if (backendSaveTimer) return true;
  if (backendSaveInFlight) return true;
  if (backendQueuedSnapshot) return true;
  if (localStorage.getItem(BACKEND_PENDING_STATE_KEY)) return true;
  if (Date.now() - backendLastLocalSaveAt < BACKEND_LOCAL_SAVE_GUARD_MS) return true;
  if (document.activeElement && document.activeElement.closest?.("#feeMasterForm")) return true;
  return false;
}

async function pullBackendStateIfChanged(showMessage = false) {
  if (!backendSyncReady || isBackendAutoSyncPaused()) return;
  try {
    setTopbarNetworkStatus(navigator.onLine ? "checking" : "offline");
    const hasToken = await ensureBackendToken();
    if (!hasToken) return;
    const healthResponse = await backendFetch(`/api/health?v=${Date.now()}`, {cache: "no-store"});
    if (!healthResponse.ok) throw new Error(`Backend health failed ${healthResponse.status}`);
    markBackendOnline();
    backendSyncReady = true;
    const health = await healthResponse.json();
    const serverUpdatedAt = health?.updated_at || "";
    if (serverUpdatedAt && backendLastUpdatedAt && serverUpdatedAt === backendLastUpdatedAt) return;
    const stateResponse = await backendFetch(`/api/state?v=${Date.now()}`, {
      cache: "no-store",
      headers: backendHeaders()
    });
    if (!stateResponse.ok) return;
    const payload = await stateResponse.json();
    const backendState = payload?.state || {};
    if (!backendState || !Object.keys(backendState).length) return;
    const localSnapshot = getAppStateSnapshot();
    const mergedState = mergeSetupSafeState(backendState, localSnapshot);
    const shouldResaveSetup = hasSetupSafeMergeChanges(mergedState, backendState);
    backendHydrating = true;
    backendLastUpdatedAt = payload?.updated_at || serverUpdatedAt || backendLastUpdatedAt;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mergedState));
    applySavedState(mergedState);
    const restoredStaff = await hydrateStaffFromBackendModule();
    refreshAllAfterSecurityClean();
    backendHydrating = false;
    if (restoredStaff || shouldResaveSetup) queueBackendSave(getAppStateSnapshot());
    if (showMessage) showToast("Latest database data synced.");
  } catch (error) {
    markBackendConnectionIssue();
    scheduleBackendReconnect();
    console.warn("Backend auto-sync skipped.", error);
  } finally {
    backendHydrating = false;
  }
}

function startBackendAutoSync() {
  clearInterval(backendAutoSyncTimer);
  backendAutoSyncTimer = setInterval(() => pullBackendStateIfChanged(false), BACKEND_AUTO_SYNC_INTERVAL_MS);
}

async function initializeBackendSync() {
  try {
    setTopbarNetworkStatus(navigator.onLine ? "checking" : "offline");
    const healthResponse = await backendFetch("/api/health", {cache: "no-store"});
    if (!healthResponse.ok) throw new Error(`Backend health failed ${healthResponse.status}`);
    markBackendOnline();
    backendSyncReady = true;
    const hasToken = await ensureBackendToken();
    if (!hasToken) return;
    const flushedPending = await flushPendingBackendSnapshot();
    const stateResponse = await backendFetch(`/api/state?v=${Date.now()}`, {
      cache: "no-store",
      headers: backendHeaders()
    });
    if (!stateResponse.ok) return;
    const payload = await stateResponse.json();
    const backendState = payload?.state || {};
    backendLastUpdatedAt = payload?.updated_at || "";
    if (!flushedPending && backendState && Object.keys(backendState).length) {
      const localSnapshot = getAppStateSnapshot();
      const mergedState = mergeSetupSafeState(backendState, localSnapshot);
      const shouldResaveSetup = hasSetupSafeMergeChanges(mergedState, backendState);
      backendHydrating = true;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(mergedState));
      applySavedState(mergedState);
      const restoredStaff = await hydrateStaffFromBackendModule();
      refreshAllAfterSecurityClean();
      backendHydrating = false;
      if (restoredStaff || shouldResaveSetup) queueBackendSave(getAppStateSnapshot());
      showToast("Backend database connected.");
    } else if (!backendState || !Object.keys(backendState).length) {
      queueBackendSave(getAppStateSnapshot());
    }
    startBackendAutoSync();
  } catch (error) {
    markBackendConnectionIssue();
    backendSyncReady = false;
    scheduleBackendReconnect();
  } finally {
    backendHydrating = false;
  }
}

function clearSecurityTestDemoData() {
  if (!confirm("Clear all test/demo data now? Pickup Point village names will stay. This cannot be undone unless you restore a backup.")) return;
  localStorage.removeItem(PRODUCTION_CLEAN_KEY);
  applyProductionCleanSeedOnce();
  refreshAllAfterSecurityClean();
  showSecuritySystemHealth();
  showToast("Test/demo data cleared.");
}

function printSecurityFullReport() {
  const snapshot = getSecuritySnapshot();
  const report = getSystemHealthReport();
  const counts = getSecurityRecordCounts();
  const grouped = report.issues.reduce((groups, issue) => {
    if (!groups[issue.type]) groups[issue.type] = [];
    groups[issue.type].push(issue);
    return groups;
  }, {});
  const printWindow = window.open("", "_blank", "width=980,height=720");
  if (!printWindow) {
    renderSecurityMaintenance("<strong>Full Report blocked.</strong><br>Please allow popups to print the security report.");
    return;
  }
  printWindow.document.write(`
    <html>
      <head>
        <title>ANPS Security Full Report</title>
        <style>
          body { font-family: Arial, sans-serif; color: #172033; padding: 24px; }
          h1 { margin: 0 0 6px; color: #0f3b67; }
          .muted { color: #64748b; font-weight: 700; }
          .grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin: 18px 0; }
          .card { border: 1px solid #d8e5f4; border-radius: 10px; padding: 12px; background: #f8fbff; }
          .card span { display: block; color: #64748b; font-size: 11px; font-weight: 800; text-transform: uppercase; }
          .card strong { display: block; margin-top: 4px; font-size: 18px; color: #12345d; }
          table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 12px; }
          th, td { border: 1px solid #d8e5f4; padding: 7px; text-align: left; }
          th { background: #eef6ff; }
          .issue { margin: 10px 0; padding: 10px; border-left: 4px solid #94a3b8; background: #f8fafc; }
          .danger { border-left-color: #dc2626; background: #fff1f2; }
          .warning { border-left-color: #d97706; background: #fffbeb; }
          .info { border-left-color: #2563eb; background: #eff6ff; }
          @media print { button { display: none; } body { padding: 12px; } }
        </style>
      </head>
      <body>
        <h1>Alfred Nobel Public School ERP</h1>
        <div class="muted">Security Full Report | ${escapeHtml(formatDateDDMMYYYY(new Date()))} | ${escapeHtml(activeSession)}</div>
        <div class="grid">
          <div class="card"><span>Health Score</span><strong>${report.score}%</strong></div>
          <div class="card"><span>Logic Status</span><strong>${escapeHtml(snapshot.logicStatus)}</strong></div>
          <div class="card"><span>Total Records</span><strong>${snapshot.totalRecords}</strong></div>
          <div class="card"><span>Backup</span><strong>${snapshot.backupCount}</strong></div>
        </div>
        <h2>Data Audit</h2>
        <table>
          <thead><tr><th>Record</th><th>Count</th></tr></thead>
          <tbody>${Object.entries(counts).map(([key, value]) => `<tr><td>${escapeHtml(key)}</td><td>${value}</td></tr>`).join("")}</tbody>
        </table>
        <h2>System Health Issues</h2>
        ${report.issues.length ? Object.entries(grouped).map(([type, items]) => `
          <h3>${escapeHtml(type)}</h3>
          ${items.map(issue => `<div class="issue ${escapeHtml(issue.severity)}"><strong>${escapeHtml(issue.title)}</strong><br><span>${escapeHtml(issue.details || "")}</span></div>`).join("")}
        `).join("") : "<p>No setup, duplicate, transport, payment or backup issue found.</p>"}
        <button onclick="window.print()">Print Report</button>
      </body>
    </html>
  `);
  printWindow.document.close();
  renderSecurityMaintenance("<strong>Full Report ready.</strong><br>Security full report opened in print preview window.");
}

function showSecurityActiveSessions() {
  const activeStaff = userAccessAccounts.filter(account => account.status === "Active");
  const activeStudents = studentUserAccounts.filter(account => account.status === "Active");
  renderSecurityMaintenance(`
    <strong>Active Sign-ins</strong>
    <p>Staff users: ${activeStaff.length} | Student users: ${activeStudents.length}</p>
    <ul>${[...activeStaff.map(account => account.loginId), ...activeStudents.map(account => account.loginId)].slice(0, 12).map(login => `<li>${escapeHtml(login)}</li>`).join("") || "<li>No active users saved.</li>"}</ul>
  `);
}

function showSecurityPerformance() {
  const started = performance.now();
  const stateText = localStorage.getItem(STORAGE_KEY) || "{}";
  JSON.parse(stateText);
  const elapsed = Math.max(.1, performance.now() - started).toFixed(2);
  renderSecurityMaintenance(`<strong>Performance Doctor</strong><br>Local database parse time: ${elapsed} ms<br>Database size: ${Math.ceil(new Blob([stateText]).size / 1024)} KB`);
}

function showSecurityRefreshRate() {
  renderSecurityMaintenance(`<strong>Refresh Rate</strong><br>Dashboard refresh is manual/on demand. Last checked: ${formatDateDDMMYYYY(new Date())}`);
}

navButtons.forEach(button => {
  button.addEventListener("click", () => {
    setView(button.dataset.view);
    if (button.dataset.securityAction === "health") showSecuritySystemHealth();
  });
});

document.querySelector(".brand")?.addEventListener("click", event => {
  event.preventDefault();
  closeOtherNavGroups("");
  setView("dashboard");
  window.location.hash = "dashboard";
});

document.getElementById("smartBusSyncButton")?.addEventListener("click", syncSmartBusMasterData);

const navGroups = [
  ["frontOfficeNavGroup", "frontOfficeToggle"],
  ["studentNavGroup", "studentToggle"],
  ["feesNavGroup", "feesToggle"],
  ["hrNavGroup", "hrToggle"],
  ["communicationNavGroup", "communicationToggle"],
  ["homeworkNavGroup", "homeworkToggle"],
  ["reportsNavGroup", "reportsToggle"],
  ["academicNavGroup", "academicToggle"],
  ["certificateNavGroup", "certificateToggle"],
  ["settingsNavGroup", "settingsToggle"],
  ["securityNavGroup", "securityToggle"],
  ["transportNavGroup", "transportToggle"]
];

function setNavGroupOpen(groupId, toggleId, isOpen) {
  document.getElementById(groupId).classList.toggle("open", isOpen);
  document.getElementById(toggleId).setAttribute("aria-expanded", String(isOpen));
}

function closeOtherNavGroups(activeGroupId) {
  navGroups.forEach(([groupId, toggleId]) => {
    if (groupId !== activeGroupId) setNavGroupOpen(groupId, toggleId, false);
  });
}

navGroups.forEach(([groupId, toggleId]) => {
  document.getElementById(toggleId).addEventListener("click", () => {
    const group = document.getElementById(groupId);
    const shouldOpen = !group.classList.contains("open");
    closeOtherNavGroups(groupId);
    setNavGroupOpen(groupId, toggleId, shouldOpen);
  });
});

const feeBookView = document.getElementById("feeBook");
let feeBookSwipeStart = null;
let feeBookWheelSwipeAt = 0;

function isFeeBookActive() {
  return feeBookView?.classList.contains("active");
}

function getTouchCenter(touches) {
  const touchList = [...touches];
  if (!touchList.length) return null;
  const total = touchList.reduce((sum, touch) => ({
    x: sum.x + touch.clientX,
    y: sum.y + touch.clientY
  }), {x: 0, y: 0});
  return {x: total.x / touchList.length, y: total.y / touchList.length};
}

feeBookView?.addEventListener("touchstart", event => {
  if (!isFeeBookActive() || event.touches.length < 2) {
    feeBookSwipeStart = null;
    return;
  }
  const center = getTouchCenter(event.touches);
  feeBookSwipeStart = center ? {...center, time: Date.now()} : null;
}, {passive: true});

feeBookView?.addEventListener("touchend", event => {
  if (!isFeeBookActive() || !feeBookSwipeStart) return;
  const center = getTouchCenter(event.changedTouches);
  if (!center) return;
  const dx = center.x - feeBookSwipeStart.x;
  const dy = center.y - feeBookSwipeStart.y;
  const elapsed = Date.now() - feeBookSwipeStart.time;
  feeBookSwipeStart = null;
  if (dx > 80 && Math.abs(dy) < 90 && elapsed < 1200) {
    openFeeBookReturnPage();
  }
}, {passive: true});

feeBookView?.addEventListener("wheel", event => {
  if (!isFeeBookActive()) return;
  const now = Date.now();
  const isRightSwipe = event.deltaX < -70 && Math.abs(event.deltaX) > Math.abs(event.deltaY) * 1.4;
  if (isRightSwipe && now - feeBookWheelSwipeAt > 900) {
    feeBookWheelSwipeAt = now;
    event.preventDefault();
    openFeeBookReturnPage();
  }
}, {passive: false});

document.querySelectorAll("[data-view-jump]").forEach(button => {
  button.addEventListener("click", () => {
    if (button.dataset.viewJump === "finance") activeFeeReturnView = getSourceView(button);
    setView(button.dataset.viewJump);
  });
});

document.getElementById("menuButton").addEventListener("click", () => {
  document.body.classList.toggle("nav-open");
});

document.getElementById("globalSearch").addEventListener("input", () => {
  renderStudents();
  if (!document.getElementById("students").classList.contains("active")) setView("students");
});

document.getElementById("studentClassFilter")?.addEventListener("change", renderStudents);
document.getElementById("studentTransportClassFilter")?.addEventListener("change", renderStudentTransportFees);
document.getElementById("studentTransportFeeRows")?.addEventListener("change", event => {
  const input = event.target.closest("[data-transport-fee-match]");
  if (!input) return;
  if (input.checked) transportFeeMatched[input.value] = true;
  else delete transportFeeMatched[input.value];
  renderStudentTransportFees();
});

document.getElementById("transportPickupPoint").addEventListener("input", event => {
  const distanceInput = event.target.closest("[data-village-distance]");
  if (distanceInput) {
    const village = distanceInput.dataset.villageDistance;
    const value = String(distanceInput.value || "").trim();
    if (value) {
      transportVillageDistances[village] = value;
    } else {
      delete transportVillageDistances[village];
    }
    return;
  }
  const feeInput = event.target.closest("[data-village-fee]");
  if (!feeInput) return;
  const village = feeInput.dataset.villageFee;
  const feeType = feeInput.dataset.feeType;
  if (!transportVillageFees[village]) transportVillageFees[village] = {};
  transportVillageFees[village][feeType] = Number(feeInput.value || 0);
  updateAdmissionTransportFee();
});

document.getElementById("transportPickupPoint").addEventListener("change", event => {
  const distanceInput = event.target.closest("[data-village-distance]");
  if (distanceInput) {
    const village = distanceInput.dataset.villageDistance;
    const value = String(distanceInput.value || "").trim();
    if (value) transportVillageDistances[village] = value;
    else delete transportVillageDistances[village];
    if (!saveAppState()) {
      renderTransportVillages();
      showToast("Pickup point fees were not saved. Please check the internet or server connection.", "error", 6000);
      return;
    }
    return;
  }
  const feeInput = event.target.closest("[data-village-fee]");
  if (feeInput) {
    const village = feeInput.dataset.villageFee;
    const feeType = feeInput.dataset.feeType;
    if (!transportVillageFees[village]) transportVillageFees[village] = {};
    transportVillageFees[village][feeType] = Number(feeInput.value || 0);
    if (!saveAppState()) {
      renderTransportVillages();
      showToast("Pickup point fees were not saved. Please check the internet or server connection.", "error", 6000);
      return;
    }
    updateAdmissionTransportFee();
    return;
  }
  const input = event.target.closest("[data-village-name]");
  if (!input) return;
  const oldName = input.dataset.villageName;
  const newName = canonicalTransportVillageName(input.value || "");
  if (!newName) {
    input.value = oldName;
    return;
  }
  if (findTransportVillageByName(newName, oldName)) {
    input.value = oldName;
    showToast(`${newName} already exists.`);
    return;
  }
  renameTransportVillageReferences(oldName, newName);
  dedupeTransportVillages();
  if (!saveAppState()) {
    renderTransportVillages();
    showToast("Pickup point update was not saved. Please check the internet or server connection.", "error", 6000);
    return;
  }
  renderTransportVillages();
  renderAdmissionVillageTownOptions(admissionForm.elements.villageTown?.value || "");
  showToast(`${oldName} updated.`);
});

document.getElementById("transportPickupPoint").addEventListener("keydown", event => {
  const input = event.target.closest("[data-village-name]");
  if (input && event.key === "Enter") {
    event.preventDefault();
    input.blur();
  }
});

document.getElementById("transportPickupPoint").addEventListener("click", event => {
  const button = event.target.closest("[data-delete-village]");
  if (!button) return;
  const village = button.dataset.deleteVillage;
  if (!confirm(`Delete ${village}?`)) return;
  const index = transportVillages.indexOf(village);
  if (index >= 0) transportVillages.splice(index, 1);
  delete transportVillageDistances[village];
  delete transportVillageFees[village];
  if (!saveAppState()) {
    renderTransportVillages();
    showToast("Pickup point deletion was not saved. Please check the internet or server connection.", "error", 6000);
    return;
  }
  renderTransportVillages();
  renderAdmissionVillageTownOptions(admissionForm.elements.villageTown?.value || "");
  updateAdmissionTransportFee();
  showToast(`${village} deleted.`);
});

document.getElementById("transportRouteRows")?.addEventListener("click", event => {
  const editButton = event.target.closest("[data-edit-transport-route]");
  const deleteButton = event.target.closest("[data-delete-transport-route]");
  if (editButton) {
    const index = Number(editButton.dataset.editTransportRoute);
    const route = transportRoutes[index];
    if (!route || !transportRouteForm) return;
    editingTransportRouteIndex = index;
    transportRouteForm.elements.routeName.value = route.routeName || "";
    transportRouteForm.elements.routeNote.value = route.routeNote || "";
    transportRouteForm.querySelector("button[type='submit']").textContent = "Update Route";
    transportRouteForm.scrollIntoView({behavior: "smooth", block: "center"});
    return;
  }
  if (deleteButton) {
    const index = Number(deleteButton.dataset.deleteTransportRoute);
    const route = transportRoutes[index];
    if (!route) return;
    if (!confirm(`Delete route ${route.routeName || ""}? Related assignment and pickup mappings will also be removed.`)) return;
    const routeName = String(route.routeName || "").trim().toLowerCase();
    transportRoutes.splice(index, 1);
    for (let i = transportVehicleAssignments.length - 1; i >= 0; i -= 1) {
      if (String(transportVehicleAssignments[i].routeName || "").trim().toLowerCase() === routeName) {
        transportVehicleAssignments.splice(i, 1);
      }
    }
    for (let i = transportRoutePickupPoints.length - 1; i >= 0; i -= 1) {
      if (String(transportRoutePickupPoints[i].routeName || "").trim().toLowerCase() === routeName) {
        transportRoutePickupPoints.splice(i, 1);
      }
    }
    editingTransportRouteIndex = -1;
    if (transportRouteForm) {
      transportRouteForm.reset();
      transportRouteForm.querySelector("button[type='submit']").textContent = "Add Route";
    }
    saveAppState();
    renderTransportRoutes();
    renderTransportVehicleAssignments();
    renderTransportRoutePickupPoints();
    showToast("Route deleted.");
  }
});

document.getElementById("transportVehicleRows")?.addEventListener("click", event => {
  const editButton = event.target.closest("[data-edit-transport-vehicle]");
  const deleteButton = event.target.closest("[data-delete-transport-vehicle]");
  if (editButton) {
    const index = Number(editButton.dataset.editTransportVehicle);
    const vehicle = transportVehicles[index];
    if (!vehicle || !transportVehicleForm) return;
    editingTransportVehicleIndex = index;
    transportVehicleForm.elements.vehicleNo.value = vehicle.vehicleNo || "";
    transportVehicleForm.elements.vehicleName.value = vehicle.vehicleName || "";
    transportVehicleForm.elements.driverName.value = vehicle.driverName || "";
    transportVehicleForm.elements.driverMobile.value = vehicle.driverMobile || "";
    transportVehicleForm.querySelector("button[type='submit']").textContent = "Update Vehicle";
    transportVehicleForm.scrollIntoView({behavior: "smooth", block: "center"});
    return;
  }
  if (deleteButton) {
    const index = Number(deleteButton.dataset.deleteTransportVehicle);
    const vehicle = transportVehicles[index];
    if (!vehicle) return;
    if (!confirm(`Delete vehicle ${vehicle.vehicleNo || ""}? Related vehicle assignments will also be removed.`)) return;
    const vehicleNo = String(vehicle.vehicleNo || "").trim().toUpperCase();
    transportVehicles.splice(index, 1);
    for (let i = transportVehicleAssignments.length - 1; i >= 0; i -= 1) {
      if (String(transportVehicleAssignments[i].vehicleNo || "").trim().toUpperCase() === vehicleNo) {
        transportVehicleAssignments.splice(i, 1);
      }
    }
    editingTransportVehicleIndex = -1;
    if (transportVehicleForm) {
      transportVehicleForm.reset();
      transportVehicleForm.querySelector("button[type='submit']").textContent = "Add Vehicle";
    }
    saveAppState();
    renderTransportVehicles();
    renderTransportVehicleAssignments();
    renderTransportRoutePickupPoints();
    showToast("Vehicle deleted.");
  }
});

document.getElementById("transportAssignVehicleRows")?.addEventListener("click", event => {
  const editButton = event.target.closest("[data-edit-transport-assignment]");
  const deleteButton = event.target.closest("[data-delete-transport-assignment]");
  if (editButton) {
    const index = Number(editButton.dataset.editTransportAssignment);
    const assignment = transportVehicleAssignments[index];
    if (!assignment || !transportAssignVehicleForm) return;
    editingTransportAssignmentIndex = index;
    renderTransportAssignmentOptions();
    transportAssignVehicleForm.elements.routeName.value = assignment.routeName || "";
    transportAssignVehicleForm.elements.vehicleNo.value = assignment.vehicleNo || "";
    transportAssignVehicleForm.elements.shift.value = assignment.shift || "";
    transportAssignVehicleForm.querySelector("button[type='submit']").textContent = "Update Assignment";
    transportAssignVehicleForm.scrollIntoView({behavior: "smooth", block: "center"});
    return;
  }
  if (deleteButton) {
    const index = Number(deleteButton.dataset.deleteTransportAssignment);
    const assignment = transportVehicleAssignments[index];
    if (!assignment) return;
    if (!confirm(`Delete assignment for ${assignment.routeName || ""} / ${assignment.shift || ""}?`)) return;
    transportVehicleAssignments.splice(index, 1);
    editingTransportAssignmentIndex = -1;
    if (transportAssignVehicleForm) {
      transportAssignVehicleForm.reset();
      transportAssignVehicleForm.querySelector("button[type='submit']").textContent = "Assign Vehicle";
    }
    saveAppState();
    renderTransportVehicleAssignments();
    renderTransportRoutePickupPoints();
    showToast("Vehicle assignment deleted.");
  }
});

document.getElementById("transportRoutePickupRows")?.addEventListener("click", event => {
  const saveButton = event.target.closest("[data-save-transport-pickup]");
  const deleteVillageButton = event.target.closest("[data-delete-transport-pickup-village]");
  if (saveButton) {
    const villageName = saveButton.dataset.saveTransportPickup || "";
    const row = saveButton.closest("tr");
    const routeName = row?.querySelector("[data-route-pickup-route]")?.value || "";
    const shift = row?.querySelector("[data-route-pickup-shift]")?.value || "Morning Pickup";
    const time = row?.querySelector("[data-route-pickup-time]")?.value || "";
    const sequence = row?.querySelector("[data-route-pickup-sequence]")?.value || "";
    if (!routeName) {
      showToast("Select route first.");
      return;
    }
    upsertRoutePickupVillageMapping(villageName, {routeName, shift, time, sequence});
    saveAppState();
    renderTransportRoutePickupPoints();
    showToast(`${villageName} pickup route saved.`);
    return;
  }
  if (deleteVillageButton) {
    const villageName = deleteVillageButton.dataset.deleteTransportPickupVillage || "";
    if (!villageName) return;
    if (!confirm(`Clear route mapping for ${villageName}?`)) return;
    clearRoutePickupVillageMapping(villageName);
    editingTransportPickupIndex = -1;
    saveAppState();
    renderTransportRoutePickupPoints();
    showToast(`${villageName} route cleared.`);
  }
});

document.getElementById("transportRoutePickupRows")?.addEventListener("change", event => {
  const routeSelect = event.target.closest("[data-route-pickup-route]");
  const shiftSelect = event.target.closest("[data-route-pickup-shift]");
  const input = routeSelect || shiftSelect;
  if (!input) return;
  const villageName = input.dataset.routePickupRoute || input.dataset.routePickupShift || "";
  const row = input.closest("tr");
  const routeName = row?.querySelector("[data-route-pickup-route]")?.value || "";
  const shift = row?.querySelector("[data-route-pickup-shift]")?.value || "Morning Pickup";
  const time = row?.querySelector("[data-route-pickup-time]")?.value || "";
  const sequence = row?.querySelector("[data-route-pickup-sequence]")?.value || "";
  if (!upsertRoutePickupVillageMapping(villageName, {routeName, shift, time, sequence})) return;
  saveAppState();
  renderTransportRoutePickupPoints();
  showToast(routeName ? `${villageName} route mapped.` : `${villageName} route cleared.`);
});

document.getElementById("transportRoutePickupRows")?.addEventListener("focusout", event => {
  const timeInput = event.target.closest("[data-route-pickup-time]");
  const sequenceInput = event.target.closest("[data-route-pickup-sequence]");
  const input = timeInput || sequenceInput;
  if (!input) return;
  const villageName = input.dataset.routePickupTime || input.dataset.routePickupSequence || "";
  const row = input.closest("tr");
  const routeName = row?.querySelector("[data-route-pickup-route]")?.value || "";
  if (!routeName) return;
  const shift = row?.querySelector("[data-route-pickup-shift]")?.value || "Morning Pickup";
  const time = row?.querySelector("[data-route-pickup-time]")?.value || "";
  const sequence = row?.querySelector("[data-route-pickup-sequence]")?.value || "";
  if (!upsertRoutePickupVillageMapping(villageName, {routeName, shift, time, sequence})) return;
  saveAppState();
  renderTransportRoutePickupPoints();
});

document.getElementById("routePickupCountRoute")?.addEventListener("change", renderTransportRouteStudentCounts);

document.querySelectorAll("[data-route-pickup-tab]").forEach(button => {
  button.addEventListener("click", () => {
    const tab = button.dataset.routePickupTab || "map";
    document.querySelectorAll("[data-route-pickup-tab]").forEach(item => {
      item.classList.toggle("active", item === button);
    });
    const mapPanel = document.getElementById("routePickupMapPanel");
    const studentPanel = document.getElementById("routePickupStudentPanel");
    if (mapPanel) {
      mapPanel.hidden = tab !== "map";
      mapPanel.classList.toggle("active", tab === "map");
    }
    if (studentPanel) {
      studentPanel.hidden = tab !== "students";
      studentPanel.classList.toggle("active", tab === "students");
    }
    if (tab === "students") renderRoutePickupStudentReport();
  });
});

document.getElementById("routePickupStudentRouteFilter")?.addEventListener("change", renderRoutePickupStudentReport);

document.getElementById("routePickupStudentReportRows")?.addEventListener("click", event => {
  const button = event.target.closest("[data-route-pickup-village-details]");
  if (!button) return;
  const detailRow = document.getElementById(button.dataset.routePickupVillageDetails || "");
  if (!detailRow) return;
  const willOpen = detailRow.hidden;
  detailRow.hidden = !willOpen;
  button.classList.toggle("open", willOpen);
});

document.getElementById("routePickupCountSummary")?.addEventListener("click", event => {
  const button = event.target.closest("[data-view-route-students]");
  if (!button) return;
  showTransportRouteStudentDetails(button.dataset.viewRouteStudents || "");
});

document.getElementById("routePickupStudentDetails")?.addEventListener("click", event => {
  if (!event.target.closest("[data-close-route-students]")) return;
  const panel = document.getElementById("routePickupStudentDetails");
  if (panel) {
    panel.hidden = true;
    panel.innerHTML = "";
  }
});

sessionSelect.addEventListener("change", () => {
  activeSession = sessionSelect.value;
  saveAppState();
  setNextReceiptNo();
  renderFinanceSession();
  renderFeeBook();
  showToast(`Session ${activeSession} loaded.`);
});

document.getElementById("addSession").addEventListener("click", () => {
  const cleanName = newSessionInput.value.trim();
  if (!cleanName) return;
  if (financeSessions[cleanName]) {
    activeSession = cleanName;
    saveAppState();
    setNextReceiptNo();
    renderSessions();
    renderFinanceSession();
    newSessionInput.value = "";
    showToast(`Session ${cleanName} already exists.`);
    return;
  }
  financeSessions[cleanName] = {
    feesCollected: "Rs. 0",
    collectionPercent: 0,
    followUps: 0,
    highPriority: 0,
    paid: 0,
    promise: 0,
    overdue: 0,
    summary: "New session. Finance data starts fresh.",
    feeMaster: [],
    feeGroups: [],
    dues: []
  };
  activeSession = cleanName;
  saveAppState();
  setNextReceiptNo();
  renderSessions();
  renderFinanceSession();
  newSessionInput.value = "";
  showToast(`New session ${cleanName} added.`);
});

newSessionInput.addEventListener("keydown", event => {
  if (event.key === "Enter") document.getElementById("addSession").click();
});

feeMasterForm.addEventListener("submit", event => {
  event.preventDefault();
  const session = ensureActiveFinanceSessionData();
  if (!Array.isArray(session.feeMaster)) session.feeMaster = [];
  const data = new FormData(feeMasterForm);
  const className = String(data.get("className") || "").trim();
  if (!className) {
    showToast("Please select a class before saving Fee Master.", "error");
    return;
  }
  const now = new Date().toISOString();
  const studentType = String(data.get("studentType") || "New Student").trim() || "New Student";
  const existingIndex = session.feeMaster.findIndex(item =>
    String(item.className || "").trim().toLowerCase() === className.toLowerCase() &&
    String(item.studentType || "New Student").trim().toLowerCase() === studentType.toLowerCase()
  );
  const sourceFeeRow = editingFeeMasterIndex >= 0
    ? session.feeMaster[editingFeeMasterIndex]
    : existingIndex >= 0
      ? session.feeMaster[existingIndex]
      : null;
  const feeData = {
    id: sourceFeeRow?.id
      ? sourceFeeRow.id
      : `fee-master-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    createdAt: sourceFeeRow?.createdAt || now,
    updatedAt: now,
    className,
    studentType,
    admissionFee: Number(data.get("admissionFee") || 0),
    annualFee: Number(data.get("annualFee") || 0),
    formFee: Number(data.get("formFee") || 0),
    monthlyTuitionFee: Number(data.get("monthlyTuitionFee") || 0),
    dayBoardingFee: Number(data.get("dayBoardingFee") || 0),
    tiffinLunchOtherServiceFee: Number(data.get("tiffinLunchOtherServiceFee") || 0),
    aiRoboticsFee: Number(data.get("aiRoboticsFee") || 0),
    customFees: getFeeMasterCustomFees()
  };
  if (editingFeeMasterIndex >= 0) {
    session.feeMaster[editingFeeMasterIndex] = feeData;
  } else {
    if (existingIndex >= 0) session.feeMaster[existingIndex] = {...session.feeMaster[existingIndex], ...feeData};
    else session.feeMaster.push(feeData);
  }
  if (!saveAppState()) return;
  renderFeeMaster();
  if (admissionForm.elements.klass.value === feeData.className) applyFeeMasterToAdmissionForm(feeData.className);
  feeMasterForm.reset();
  const actionText = editingFeeMasterIndex >= 0 ? "updated" : "added";
  resetFeeMasterEditing();
  showToast(`Fee structure ${actionText} in ${activeSession}.`);
});

feeBookStudentSelect.addEventListener("change", () => {
  renderFeeBook(feeBookStudentSelect.value);
});

document.getElementById("ledgerFeeRows")?.addEventListener("toggle", event => {
  const dropdown = event.target;
  if (!(dropdown instanceof HTMLDetailsElement) || !dropdown.dataset.feeBookDropdown) return;
  if (dropdown.open) openFeeBookDropdowns.add(dropdown.dataset.feeBookDropdown);
  else openFeeBookDropdowns.delete(dropdown.dataset.feeBookDropdown);
}, true);

document.getElementById("dueFeesMonthFilter").addEventListener("change", renderDueFeesSearch);
document.getElementById("dueFeesClassFilter")?.addEventListener("change", renderDueFeesSearch);
document.getElementById("dueFeesSectionFilter")?.addEventListener("change", renderDueFeesSearch);
document.getElementById("dueFeesStatusFilter")?.addEventListener("change", renderDueFeesSearch);
document.getElementById("dueFeesStudentSearch")?.addEventListener("input", renderDueFeesSearch);

admissionForm.elements.klass.addEventListener("change", event => {
  if (applyFeeMasterToAdmissionForm(event.target.value)) {
    showToast(`${event.target.value} fees loaded from Fee Master.`);
  }
  updateAdmissionTransportFee();
});

admissionForm.elements.studentType.addEventListener("change", event => {
  if (applyFeeMasterToAdmissionForm(admissionForm.elements.klass.value, event.target.value)) {
    showToast(`${event.target.value} fees loaded from Fee Master.`);
  }
  updateAdmissionTransportFee();
});

getAdmissionSerialInput()?.addEventListener("input", getAdmissionNumberFromForm);
admissionForm.querySelectorAll("[name='localGuardianSame']").forEach(input => {
  input.addEventListener("change", event => syncLocalGuardianFromParent(event.target.checked ? event.target.value : ""));
});
["fatherName", "fatherMobile", "fatherEmail"].forEach(name => {
  admissionForm.elements[name]?.addEventListener("input", () => {
    if (admissionForm.querySelector("[name='localGuardianSame'][value='Father']")?.checked) syncLocalGuardianFromParent("Father");
  });
});
["motherName", "motherMobile", "motherEmail"].forEach(name => {
  admissionForm.elements[name]?.addEventListener("input", () => {
    if (admissionForm.querySelector("[name='localGuardianSame'][value='Mother']")?.checked) syncLocalGuardianFromParent("Mother");
  });
});
admissionForm.elements.villageTown.addEventListener("change", updateAdmissionTransportFee);
admissionForm.elements.specialTransportFee.addEventListener("input", updateAdmissionTransportFee);

admissionForm.elements.transportRequired.addEventListener("change", event => {
  syncTransportServiceCheckbox(event.target.checked);
  syncExclusiveTransportServices("Transport");
  updateAdmissionTransportFee();
});

admissionForm.querySelectorAll("[name='otherServices']").forEach(input => {
  input.addEventListener("change", event => {
    if (event.target.value === "Transport") {
      syncExclusiveTransportServices("Transport");
      updateAdmissionTransportFee();
    }
    if (event.target.value === "Special/Custom") {
      syncExclusiveTransportServices("Special/Custom");
      updateAdmissionTransportFee();
    }
    if (event.target.value === "Day Boarding") {
      syncAdmissionDayBoardingFeeFromMaster();
    }
    if (event.target.value === "Tiffin") {
      syncAdmissionTiffinFeeFromMaster();
    }
    if (event.target.value === "Robotics") {
      syncAdmissionRoboticsFeeFromMaster();
    }
  });
});

admissionForm.addEventListener("reset", () => {
  setTimeout(() => {
    setAdmissionFeeFieldsLocked(false);
    renderAdmissionClassOptions();
    renderAdmissionStudentTypeOptions();
    renderAdmissionVillageTownOptions();
    syncExclusiveTransportServices("");
    updateAdmissionTransportFee();
  }, 0);
});

feeGroupForm.addEventListener("submit", event => {
  event.preventDefault();
  const session = ensureActiveFinanceSessionData();
  const data = new FormData(feeGroupForm);
  const feeGroup = {
    groupName: String(data.get("groupName") || "").trim(),
    category: String(data.get("category") || "One Time"),
    description: String(data.get("description") || "").trim()
  };
  if (editingFeeGroupIndex >= 0) {
    session.feeGroups[editingFeeGroupIndex] = feeGroup;
  } else {
    session.feeGroups.push(feeGroup);
  }
  if (!saveAppState()) return;
  const actionText = editingFeeGroupIndex >= 0 ? "updated" : "added";
  renderFeeGroups();
  renderFeeMasterDynamicFields();
  renderFeeMaster();
  feeGroupForm.reset();
  resetFeeGroupEditing();
  showToast(`Fee group ${actionText} in ${activeSession}.`);
});

classSetupForm.addEventListener("submit", event => {
  event.preventDefault();
  const className = String(new FormData(classSetupForm).get("className") || "").trim();
  if (!className) return;
  const exists = customAdmissionClasses.some((item, index) => index !== editingClassSetupIndex && item.toLowerCase() === className.toLowerCase());
  if (exists) {
    showToast(`${className} class already exists.`);
    return;
  }
  const oldClassName = editingClassSetupIndex >= 0 ? customAdmissionClasses[editingClassSetupIndex] : "";
  if (editingClassSetupIndex >= 0) {
    updateClassReferences(oldClassName, className);
    customAdmissionClasses[editingClassSetupIndex] = className;
  } else {
    customAdmissionClasses.push(className);
  }
  customAdmissionClasses.sort((a, b) => a.localeCompare(b, undefined, {numeric: true}));
  if (!saveAppState()) return;
  renderClassSectionSetup();
  renderAdmissionClassOptions();
  renderFeeMasterClassOptions();
  renderClassTimetableOptions();
  renderHomeworkModule();
  classSetupForm.reset();
  resetClassSetupEditing();
  renderStudents();
  renderFeeMaster();
  renderClassTimetable();
  showToast(`${className} class ${oldClassName ? "updated" : "added"}.`);
});

sectionSetupForm.addEventListener("submit", event => {
  event.preventDefault();
  const sectionName = String(new FormData(sectionSetupForm).get("sectionName") || "").trim();
  if (!sectionName) return;
  const exists = customAdmissionSections.some((item, index) => index !== editingSectionSetupIndex && item.toLowerCase() === sectionName.toLowerCase());
  if (exists) {
    showToast(`${sectionName} section already exists.`);
    return;
  }
  const oldSectionName = editingSectionSetupIndex >= 0 ? customAdmissionSections[editingSectionSetupIndex] : "";
  if (editingSectionSetupIndex >= 0) {
    updateSectionReferences(oldSectionName, sectionName);
    customAdmissionSections[editingSectionSetupIndex] = sectionName;
  } else {
    customAdmissionSections.push(sectionName);
  }
  customAdmissionSections.sort((a, b) => a.localeCompare(b, undefined, {numeric: true}));
  if (!saveAppState()) return;
  renderClassSectionSetup();
  renderAdmissionSectionOptions();
  sectionSetupForm.reset();
  resetSectionSetupEditing();
  renderStudents();
  renderClassTimetable();
  showToast(`${sectionName} section ${oldSectionName ? "updated" : "added"}.`);
});

subjectSetupForm.addEventListener("submit", event => {
  event.preventDefault();
  const subjectName = String(new FormData(subjectSetupForm).get("subjectName") || "").trim();
  if (!subjectName) return;
  const exists = customSubjects.some((item, index) => index !== editingSubjectSetupIndex && item.toLowerCase() === subjectName.toLowerCase());
  if (exists) {
    showToast(`${subjectName} subject already exists.`);
    return;
  }
  const oldSubjectName = editingSubjectSetupIndex >= 0 ? customSubjects[editingSubjectSetupIndex] : "";
  if (editingSubjectSetupIndex >= 0) {
    updateSubjectReferences(oldSubjectName, subjectName);
    customSubjects[editingSubjectSetupIndex] = subjectName;
  } else {
    customSubjects.push(subjectName);
  }
  customSubjects.sort((a, b) => a.localeCompare(b, undefined, {numeric: true}));
  if (!saveAppState()) return;
  renderClassSectionSetup();
  renderClassTimetableOptions();
  renderHomeworkModule();
  subjectSetupForm.reset();
  resetSubjectSetupEditing();
  renderClassTimetable();
  showToast(`${subjectName} subject ${oldSubjectName ? "updated" : "added"}.`);
});

subjectAssignForm.addEventListener("submit", event => {
  event.preventDefault();
  const data = new FormData(subjectAssignForm);
  const className = String(data.get("className") || "").trim();
  if (!className) {
    showToast("Select class first.");
    return;
  }
  classSubjectAssignments[className] = [...new Set(data.getAll("subjects").map(subject => String(subject || "").trim()).filter(Boolean))];
  if (!saveAppState()) return;
  renderSubjectAssignmentSetup(className);
  renderClassTimetableOptions();
  renderHomeworkModule();
  showToast(`${className} subject assignment saved.`);
});

admissionEnquiryForm?.addEventListener("submit", event => {
  event.preventDefault();
  const data = new FormData(admissionEnquiryForm);
  const enquiry = {
    date: formatDateDDMMYYYY(data.get("date") || new Date()),
    studentName: String(data.get("studentName") || "").trim(),
    guardianName: String(data.get("guardianName") || "").trim(),
    mobile: String(data.get("mobile") || "").trim(),
    className: String(data.get("className") || "").trim(),
    villageTown: canonicalTransportVillageName(data.get("villageTown") || ""),
    source: String(data.get("source") || "Walk-in").trim(),
    status: String(data.get("status") || "New").trim(),
    remarks: String(data.get("remarks") || "").trim()
  };
  if (!enquiry.studentName || !enquiry.guardianName || !enquiry.mobile || !enquiry.className) {
    showToast("Student, guardian, mobile and class required.");
    return;
  }
  if (editingAdmissionEnquiryIndex >= 0) admissionEnquiries.splice(editingAdmissionEnquiryIndex, 1, enquiry);
  else admissionEnquiries.unshift(enquiry);
  resetAdmissionEnquiryEditing();
  saveAppState();
  renderAdmissionEnquiryModule();
  showToast("Admission enquiry saved.");
});

complaintRegisterForm?.addEventListener("submit", event => {
  event.preventDefault();
  const data = new FormData(complaintRegisterForm);
  const previousComplaint = editingComplaintIndex >= 0 ? complaintRecords[editingComplaintIndex] || {} : {};
  const complaint = {
    ...previousComplaint,
    id: previousComplaint.id || `complaint-${Date.now()}`,
    date: formatDateDDMMYYYY(data.get("date") || new Date()),
    forType: String(data.get("forType") || "Student").trim(),
    personName: String(data.get("personName") || "").trim(),
    mobile: String(data.get("mobile") || "").trim(),
    category: String(data.get("category") || "Other").trim(),
    priority: String(data.get("priority") || "Normal").trim(),
    status: String(data.get("status") || "Open").trim(),
    receivedBy: String(data.get("receivedBy") || "").trim(),
    details: String(data.get("details") || "").trim(),
    source: "Front Office"
  };
  if (!complaint.personName || !complaint.details) {
    showToast("Name and complaint details required.");
    return;
  }
  if (editingComplaintIndex >= 0) complaintRecords.splice(editingComplaintIndex, 1, complaint);
  else complaintRecords.unshift(complaint);
  resetComplaintEditing();
  saveAppState();
  renderComplaintsDesk();
  showToast("Complaint registered.");
});

teacherComplaintForm?.addEventListener("submit", event => {
  event.preventDefault();
  const data = new FormData(teacherComplaintForm);
  const activeStaff = getActiveTeacherStaff();
  const complaint = {
    id: `complaint-${Date.now()}`,
    date: formatDateDDMMYYYY(data.get("date") || new Date()),
    forType: String(data.get("forType") || "Student").trim(),
    personName: String(data.get("personName") || activeStaff?.name || "").trim(),
    mobile: "",
    classSection: String(data.get("classSection") || "").trim(),
    category: String(data.get("category") || "Academic").trim(),
    priority: String(data.get("priority") || "Normal").trim(),
    status: "Open",
    receivedBy: activeStaff?.name || "Teacher",
    details: String(data.get("details") || "").trim(),
    source: "Teacher"
  };
  if (!complaint.personName || !complaint.details) {
    showToast("Teacher name and complaint details required.");
    return;
  }
  complaintRecords.unshift(complaint);
  teacherComplaintForm.reset();
  teacherComplaintForm.elements.date.value = toDateInputValue(new Date());
  if (activeStaff?.name) teacherComplaintForm.elements.personName.value = activeStaff.name;
  saveAppState();
  renderComplaintsDesk();
  showToast("Teacher complaint sent to complaint desk.");
});

syllabusForm?.addEventListener("submit", event => {
  event.preventDefault();
  const data = new FormData(syllabusForm);
  const activeStaff = getActiveTeacherStaff();
  const teacherSubjects = getActiveTeacherSubjects();
  const subject = String(data.get("subject") || "").trim();
  if (teacherSubjects.length && !teacherSubjects.some(item => item.toLowerCase() === subject.toLowerCase())) {
    showToast("This teacher can add syllabus only for own subject.");
    return;
  }
  const entry = {
    className: String(data.get("className") || "").trim(),
    sectionName: String(data.get("sectionName") || "").trim(),
    subject,
    term: String(data.get("term") || "").trim(),
    topic: String(data.get("topic") || "").trim(),
    details: String(data.get("details") || "").trim(),
    status: String(data.get("status") || "Published").trim(),
    teacherId: activeStaff?.staffId || "",
    teacherName: activeStaff?.name || getActiveStaffAccount()?.staffName || "Admin",
    updatedAt: formatDateDDMMYYYY(new Date())
  };
  if (!entry.className || !entry.sectionName || !entry.subject || !entry.term || !entry.topic || !entry.details) {
    showToast("Fill all syllabus fields.");
    return;
  }
  if (editingSyllabusIndex >= 0) {
    if (!canEditSyllabusEntry(syllabusEntries[editingSyllabusIndex])) {
      showToast("You cannot edit this syllabus.");
      return;
    }
    syllabusEntries.splice(editingSyllabusIndex, 1, entry);
  } else {
    syllabusEntries.unshift(entry);
  }
  resetSyllabusEditing();
  saveAppState();
  renderSyllabusModule();
  showToast("Syllabus saved.");
});

syllabusForm?.elements.className?.addEventListener("change", renderSyllabusOptions);

document.getElementById("syllabusRows")?.addEventListener("click", event => {
  const editButton = event.target.closest("[data-edit-syllabus]");
  const deleteButton = event.target.closest("[data-delete-syllabus]");
  if (editButton) {
    const index = Number(editButton.dataset.editSyllabus);
    const entry = syllabusEntries[index];
    if (!entry || !syllabusForm || !canEditSyllabusEntry(entry)) return;
    editingSyllabusIndex = index;
    setSelectValue(syllabusForm.elements.className, entry.className || "");
    renderSyllabusOptions();
    setSelectValue(syllabusForm.elements.sectionName, entry.sectionName || "");
    setSelectValue(syllabusForm.elements.subject, entry.subject || "");
    syllabusForm.elements.term.value = entry.term || "";
    syllabusForm.elements.topic.value = entry.topic || "";
    syllabusForm.elements.details.value = entry.details || "";
    syllabusForm.elements.status.value = entry.status || "Published";
    document.getElementById("saveSyllabusBtn").textContent = "Update Syllabus";
    showToast("Syllabus ready to edit.");
  }
  if (deleteButton) {
    const index = Number(deleteButton.dataset.deleteSyllabus);
    const entry = syllabusEntries[index];
    if (!entry || !canEditSyllabusEntry(entry)) return;
    if (confirm(`Delete syllabus ${entry.subject} - ${entry.topic}?`)) {
      syllabusEntries.splice(index, 1);
      resetSyllabusEditing();
      saveAppState();
      renderSyllabusModule();
      showToast("Syllabus deleted.");
    }
  }
});

holidayReportForm?.addEventListener("submit", event => {
  event.preventDefault();
  const data = new FormData(holidayReportForm);
  const holiday = {
    date: formatDateDDMMYYYY(data.get("date") || new Date()),
    name: String(data.get("name") || "").trim(),
    type: String(data.get("type") || "Holiday").trim(),
    details: String(data.get("details") || "").trim()
  };
  if (!holiday.name) {
    showToast("Holiday name required.");
    return;
  }
  if (editingHolidayIndex >= 0) {
    holidayReports.splice(editingHolidayIndex, 1, holiday);
  } else {
    holidayReports.push(holiday);
  }
  resetHolidayEditing();
  saveAppState();
  renderHolidayReport();
  renderAnnualCalendar();
  showToast("Holiday saved.");
});

document.getElementById("annualCalendarMonth")?.addEventListener("change", renderAnnualCalendar);

document.getElementById("admissionEnquiryRows")?.addEventListener("click", event => {
  const editButton = event.target.closest("[data-edit-enquiry]");
  const deleteButton = event.target.closest("[data-delete-enquiry]");
  if (editButton) {
    const index = Number(editButton.dataset.editEnquiry);
    const item = admissionEnquiries[index];
    if (!item || !admissionEnquiryForm) return;
    editingAdmissionEnquiryIndex = index;
    admissionEnquiryForm.elements.date.value = toDateInputValue(item.date);
    admissionEnquiryForm.elements.studentName.value = item.studentName || "";
    admissionEnquiryForm.elements.guardianName.value = item.guardianName || "";
    admissionEnquiryForm.elements.mobile.value = item.mobile || "";
    renderAdmissionEnquiryOptions();
    setSelectValue(admissionEnquiryForm.elements.className, item.className || "");
    admissionEnquiryForm.elements.villageTown.value = item.villageTown || "";
    admissionEnquiryForm.elements.source.value = item.source || "Walk-in";
    admissionEnquiryForm.elements.status.value = item.status || "New";
    admissionEnquiryForm.elements.remarks.value = item.remarks || "";
    admissionEnquiryForm.querySelector("button[type='submit']").textContent = "Update Enquiry";
    showToast("Enquiry ready to edit.");
  }
  if (deleteButton) {
    const index = Number(deleteButton.dataset.deleteEnquiry);
    if (admissionEnquiries[index] && confirm(`Delete enquiry for ${admissionEnquiries[index].studentName}?`)) {
      admissionEnquiries.splice(index, 1);
      resetAdmissionEnquiryEditing();
      saveAppState();
      renderAdmissionEnquiryModule();
      showToast("Enquiry deleted.");
    }
  }
});

document.getElementById("complaintsDeskRows")?.addEventListener("click", event => {
  const reviewButton = event.target.closest("[data-review-complaint]");
  const editButton = event.target.closest("[data-edit-complaint]");
  const deleteButton = event.target.closest("[data-delete-complaint]");
  if (reviewButton) {
    openComplaintReviewModal(Number(reviewButton.dataset.reviewComplaint));
    return;
  }
  if (editButton) {
    const index = Number(editButton.dataset.editComplaint);
    const item = complaintRecords[index];
    if (!item || !complaintRegisterForm) return;
    editingComplaintIndex = index;
    setView("complaintRegister");
    complaintRegisterForm.elements.date.value = toDateInputValue(item.date);
    complaintRegisterForm.elements.forType.value = getComplaintForType(item);
    complaintRegisterForm.elements.personName.value = getComplaintPersonName(item);
    complaintRegisterForm.elements.mobile.value = item.mobile || "";
    complaintRegisterForm.elements.category.value = getComplaintCategory(item) || "Other";
    complaintRegisterForm.elements.priority.value = item.priority || "Normal";
    complaintRegisterForm.elements.status.value = item.status || "Open";
    complaintRegisterForm.elements.receivedBy.value = item.receivedBy || "";
    complaintRegisterForm.elements.details.value = getComplaintDetails(item);
    complaintRegisterForm.querySelector("button[type='submit']").textContent = "Update Complaint";
    showToast("Complaint ready to edit.");
  }
  if (deleteButton) {
    const index = Number(deleteButton.dataset.deleteComplaint);
    if (complaintRecords[index] && confirm(`Delete complaint for ${complaintRecords[index].personName}?`)) {
      complaintRecords.splice(index, 1);
      resetComplaintEditing();
      saveAppState();
      renderComplaintsDesk();
      showToast("Complaint deleted.");
    }
  }
});

document.getElementById("complaintTypeFilter")?.addEventListener("change", renderComplaintsDesk);
document.getElementById("complaintStatusFilter")?.addEventListener("change", renderComplaintsDesk);

document.getElementById("holidayReportRows")?.addEventListener("click", event => {
  const editButton = event.target.closest("[data-edit-holiday]");
  const deleteButton = event.target.closest("[data-delete-holiday]");
  if (editButton) {
    const index = Number(editButton.dataset.editHoliday);
    const holiday = holidayReports[index];
    if (!holiday || !holidayReportForm) return;
    editingHolidayIndex = index;
    holidayReportForm.elements.date.value = toDateInputValue(holiday.date);
    holidayReportForm.elements.name.value = holiday.name || "";
    holidayReportForm.elements.type.value = holiday.type || "Holiday";
    holidayReportForm.elements.details.value = holiday.details || "";
    document.getElementById("saveHolidayReportBtn").textContent = "Update Holiday";
    showToast("Holiday ready to edit.");
  }
  if (deleteButton) {
    const index = Number(deleteButton.dataset.deleteHoliday);
    if (!holidayReports[index]) return;
    holidayReports.splice(index, 1);
    resetHolidayEditing();
    saveAppState();
    renderHolidayReport();
    renderAnnualCalendar();
    showToast("Holiday deleted.");
  }
});

document.getElementById("showClassSetupBtn").addEventListener("click", () => setClassSectionSetupPanel("classSetupPanel"));
document.getElementById("showSectionSetupBtn").addEventListener("click", () => setClassSectionSetupPanel("sectionSetupPanel"));
document.getElementById("showSubjectSetupBtn").addEventListener("click", () => setClassSectionSetupPanel("subjectSetupPanel"));
document.getElementById("showSubjectAssignBtn").addEventListener("click", () => {
  setClassSectionSetupPanel("subjectAssignPanel");
  renderSubjectAssignmentSetup();
});
document.getElementById("subjectAssignClass").addEventListener("change", event => renderSubjectAssignmentSetup(event.target.value));

document.getElementById("accessStaffSelect")?.addEventListener("change", event => {
  const staff = getStaffByStaffId(event.target.value);
  if (!staff || !userAccessForm) return;
  setSelectValue(userAccessForm.elements.role, staff.role || "");
  userAccessForm.elements.loginId.value = staff.email || staff.phone || staff.staffId || "";
  userAccessForm.elements.password.value = staff.phone || "";
});

document.getElementById("studentUserSelect")?.addEventListener("change", event => {
  const student = findStudentByAdmissionNo(event.target.value);
  if (!student || !studentUserAccessForm) return;
  studentUserAccessForm.elements.admissionNoDisplay.value = student.admissionNo || "";
  studentUserAccessForm.elements.loginId.value = getStudentLoginIdFromAdmissionNo(student.admissionNo);
  studentUserAccessForm.elements.password.value = getStudentPortalPassword(student);
});

document.getElementById("autoFillStudentUsers")?.addEventListener("click", () => {
  autoFillStudentUserAccounts();
});

document.getElementById("studentUserClassFilter")?.addEventListener("change", renderStudentUserRows);
document.getElementById("studentUserSearch")?.addEventListener("input", renderStudentUserRows);
document.getElementById("mobileActivityClassFilter")?.addEventListener("change", renderMobileAppActivity);
document.getElementById("mobileActivityStatusFilter")?.addEventListener("change", renderMobileAppActivity);
document.getElementById("mobileActivitySearch")?.addEventListener("input", renderMobileAppActivity);

document.getElementById("idCardStudentSelect")?.addEventListener("change", renderStudentIdCardModule);
document.getElementById("studentIdContactType")?.addEventListener("change", renderStudentIdCardModule);
document.getElementById("studentIdCardWidthMm")?.addEventListener("input", renderStudentIdCardModule);
document.getElementById("studentIdCardHeightMm")?.addEventListener("input", renderStudentIdCardModule);
document.getElementById("generateStudentIdCard")?.addEventListener("click", renderStudentIdCardModule);
document.getElementById("printStudentIdCard")?.addEventListener("click", printStudentIdCard);
document.getElementById("teacherIdCardSelect")?.addEventListener("change", renderTeacherIdCardModule);
document.getElementById("generateTeacherIdCard")?.addEventListener("click", renderTeacherIdCardModule);
document.getElementById("printTeacherIdCard")?.addEventListener("click", printTeacherIdCard);
document.getElementById("noticeAudienceSelect")?.addEventListener("change", updateNoticeAudienceFields);
document.getElementById("securityBackupBtn")?.addEventListener("click", createSecurityBackup);
document.getElementById("securityExportBtn")?.addEventListener("click", exportSecurityJson);
document.getElementById("securityServerJsonBtn")?.addEventListener("click", showSecurityServerJson);
document.getElementById("securityRestoreBtn")?.addEventListener("click", () => document.getElementById("securityRestoreFile")?.click());
document.getElementById("securityRestoreFile")?.addEventListener("change", event => {
  restoreSecurityDataFromFile(event.target.files && event.target.files[0]);
  event.target.value = "";
});
document.getElementById("securityMaintenanceBtn")?.addEventListener("click", runSecurityMaintenance);
document.getElementById("securityShowBackupsBtn")?.addEventListener("click", showSecurityBackups);
document.getElementById("securityExportSavedBackupsBtn")?.addEventListener("click", exportSecuritySavedBackups);
document.getElementById("securityRestoreFeeMasterBtn")?.addEventListener("click", restoreFeeMasterOnlyFromSecurityBackup);
document.getElementById("securityAuditBtn")?.addEventListener("click", showSecurityAudit);
document.getElementById("securityHealthBtn")?.addEventListener("click", showSecuritySystemHealth);
document.getElementById("securityReadinessBtn")?.addEventListener("click", showSecurityReadiness);
document.getElementById("securityBackupReminderBtn")?.addEventListener("click", showSecurityBackupReminder);
document.getElementById("securityFullReportBtn")?.addEventListener("click", printSecurityFullReport);
document.getElementById("securityActiveSessionsBtn")?.addEventListener("click", showSecurityActiveSessions);
document.getElementById("securityPerformanceBtn")?.addEventListener("click", showSecurityPerformance);
document.getElementById("securityRefreshBtn")?.addEventListener("click", showSecurityRefreshRate);
document.getElementById("securityCleanDemoBtn")?.addEventListener("click", clearSecurityTestDemoData);
document.getElementById("securityReloadBtn")?.addEventListener("click", () => window.location.reload());
document.getElementById("analyzeAlertSolverBtn")?.addEventListener("click", analyzeAlertSolverInput);
document.getElementById("loadCurrentAlertsBtn")?.addEventListener("click", loadCurrentAlertsIntoSolver);
document.getElementById("clearAlertSolverBtn")?.addEventListener("click", () => {
  const input = document.getElementById("alertSolverInput");
  if (input) input.value = "";
  renderAlertSolverMatches([], "");
});
document.getElementById("refreshRoleHealthBtn")?.addEventListener("click", renderRolePermissionHealth);
document.getElementById("refreshDuplicateReceiptsBtn")?.addEventListener("click", () => renderDuplicateReceiptUtility("Refreshed."));
document.getElementById("fixAllDuplicateReceiptsBtn")?.addEventListener("click", () => {
  const groups = getDuplicateReceiptGroups();
  if (!groups.length) {
    renderDuplicateReceiptUtility("No duplicate receipt found.");
    showToast("No duplicate receipt found.");
    return;
  }
  if (!confirm(`Fix ${groups.length} duplicate receipt group(s)? First row will stay, duplicate rows will get new receipt numbers.`)) return;
  fixDuplicateReceiptGroups();
});
document.getElementById("duplicateReceiptRows")?.addEventListener("click", event => {
  const button = event.target.closest("[data-fix-duplicate-receipt]");
  if (!button) return;
  const receipt = button.dataset.fixDuplicateReceipt || "";
  if (!confirm(`Fix duplicate receipt ${receipt}? First row will stay, duplicate rows will get new receipt numbers.`)) return;
  fixDuplicateReceiptGroups(receipt);
});

document.getElementById("accessPermissionRole")?.addEventListener("change", event => {
  renderPermissionRows(event.target.value);
});

document.getElementById("accessPermissionAllTick")?.addEventListener("change", event => {
  if (event.target.id !== "accessPermissionAllTick") return;
  event.stopPropagation();
  document.querySelectorAll("#accessPermissionRows input[data-permission-module]:not(:disabled)").forEach(input => {
    input.checked = event.target.checked;
  });
  event.target.indeterminate = false;
  syncPermissionInputsToRole();
  updateAccessPermissionAllTickState();
});

document.getElementById("accessPermissionRows")?.addEventListener("change", event => {
  if (!event.target.matches("input[type='checkbox']")) return;
  event.stopPropagation();
  const groupToggle = event.target.closest("[data-permission-group-toggle]");
  if (groupToggle) {
    const groupName = groupToggle.dataset.permissionGroupToggle || "";
    document.querySelectorAll("#accessPermissionRows input[data-permission-module]:not(:disabled)").forEach(input => {
      if (input.dataset.permissionGroup === groupName) input.checked = groupToggle.checked;
    });
    groupToggle.indeterminate = false;
  }
  syncPermissionInputsToRole();
  updateAccessPermissionAllTickState();
});

noticeForm.addEventListener("submit", event => {
  event.preventDefault();
  const data = new FormData(noticeForm);
  const audience = String(data.get("audience") || "All Students");
  const classes = getSelectedNoticeOptions(document.getElementById("noticeClassSelect"));
  const sections = getSelectedNoticeOptions(document.getElementById("noticeSectionSelect"));
  if ((audience === "Selected Class" || audience === "Selected Class & Section") && !classes.length) {
    showToast("Select at least one class for this notice.");
    return;
  }
  if (audience === "Selected Class & Section" && !sections.length) {
    showToast("Select at least one section for this notice.");
    return;
  }
  const noticeEntry = {
    id: `NOTICE-${Date.now()}`,
    title: String(data.get("title") || "").trim(),
    audience,
    audienceType: audience,
    noticeClass: classes.join(", "),
    classes,
    sections,
    noticeDate: String(data.get("noticeDate") || "").trim() || formatDateDDMMYYYY(new Date()),
    publishDate: String(data.get("publishDate") || "").trim() || formatDateDDMMYYYY(new Date()),
    message: String(data.get("message") || "").trim(),
    senderName: String(data.get("senderName") || "").trim() || getNoticeSenderDefaults().name,
    senderDesignation: String(data.get("senderDesignation") || "").trim() || getNoticeSenderDefaults().designation,
    priority: String(data.get("priority") || "Normal"),
    delivery: String(data.get("delivery") || "Notice Board"),
    status: "Published",
    createdAt: new Date().toISOString()
  };
  notices.unshift(noticeEntry);
  saveAppState();
  sendNoticePushNotification(noticeEntry);
  renderNoticeBoard();
  noticeForm.reset();
  noticeForm.elements.noticeDate.value = formatDateDDMMYYYY(new Date());
  noticeForm.elements.publishDate.value = formatDateDDMMYYYY(new Date());
  fillNoticeSenderDefaults(true);
  updateNoticeAudienceFields();
  showToast("Notice published for selected audience.");
});

document.getElementById("teacherNoticeRequestRows")?.addEventListener("click", event => {
  const approveButton = event.target.closest("[data-approve-teacher-notice]");
  if (approveButton) {
    approveTeacherNoticeRequest(approveButton.dataset.approveTeacherNotice);
    return;
  }
  const rejectButton = event.target.closest("[data-reject-teacher-notice]");
  if (rejectButton) {
    rejectTeacherNoticeRequest(rejectButton.dataset.rejectTeacherNotice);
  }
});

document.getElementById("teacherAdvisoryForm")?.addEventListener("submit", event => {
  event.preventDefault();
  const teacherId = String(document.getElementById("teacherAdvisoryTeacher")?.value || "").trim();
  const staff = getTeacherAdvisoryStaff(teacherId);
  if (!teacherId || !staff.name) {
    showToast("Select a teacher first.");
    return;
  }
  const advisory = {
    id: `TADV-${Date.now()}`,
    teacherId: staff.staffId || teacherId,
    teacherLoginId: staff.loginId || staff.email || "",
    teacherName: staff.name || teacherId,
    teacherDesignation: staff.designation || staff.role || "",
    category: document.getElementById("teacherAdvisoryCategory")?.value || "General Advisory",
    priority: document.getElementById("teacherAdvisoryPriority")?.value || "Normal",
    subject: String(document.getElementById("teacherAdvisorySubject")?.value || "").trim(),
    message: String(document.getElementById("teacherAdvisoryMessage")?.value || "").trim(),
    status: "Sent",
    date: formatDateDDMMYYYY(new Date()),
    sentBy: getCurrentTopbarRole(),
    createdAt: new Date().toISOString()
  };
  if (!advisory.subject || !advisory.message) {
    showToast("Subject and message are required.");
    return;
  }
  teacherAdvisories.unshift(advisory);
  saveAppState();
  renderTeacherAdvisory();
  event.target.reset();
  sendTeacherAdvisoryPushNotification(advisory);
});

document.getElementById("teacherAdvisoryRows")?.addEventListener("click", event => {
  const closeButton = event.target.closest("[data-close-teacher-advisory]");
  if (!closeButton) return;
  const item = teacherAdvisories.find(advisory => String(advisory.id || "") === closeButton.dataset.closeTeacherAdvisory);
  if (!item) return;
  item.status = "Closed";
  item.closedAt = new Date().toISOString();
  item.closedBy = getCurrentTopbarRole();
  saveAppState();
  renderTeacherAdvisory();
  showToast("Teacher advisory closed.");
});

classTeacherAssignmentForm?.addEventListener("submit", event => {
  event.preventDefault();
  const className = String(classTeacherAssignmentForm.elements.className.value || "").trim();
  const sectionName = String(classTeacherAssignmentForm.elements.sectionName.value || "").trim();
  const staffId = String(classTeacherAssignmentForm.elements.staffId.value || "").trim();
  const teacher = staffMembers.find(staff => staff.staffId === staffId);
  if (!className || !staffId || !teacher) {
    showToast("Class and teacher required.");
    return;
  }
  const classSection = [className, sectionName].filter(Boolean).join(" ");
  staffMembers.forEach(staff => {
    if (staff.staffId !== staffId && String(staff.assignedClass || "").trim().toLowerCase() === classSection.toLowerCase()) {
      staff.assignedClass = "";
      staff.assignedClassName = "";
      staff.assignedSection = "";
    }
  });
  teacher.assignedClass = classSection;
  teacher.assignedClassName = className;
  teacher.assignedSection = sectionName;
  if (!saveAppState()) return;
  renderClassTeacherAssignment();
  renderStaffDetails();
  renderTeacherTimetable();
  showToast(`${teacher.name || teacher.staffId} assigned as class teacher for ${classSection}.`);
});

document.getElementById("classTeacherAssignmentRows")?.addEventListener("click", event => {
  const editButton = event.target.closest("[data-edit-class-teacher]");
  const deleteButton = event.target.closest("[data-delete-class-teacher]");
  if (editButton) {
    const staff = staffMembers.find(item => item.staffId === editButton.dataset.editClassTeacher);
    if (!staff || !classTeacherAssignmentForm) return;
    renderClassTeacherAssignment();
    setSelectValue(classTeacherAssignmentForm.elements.className, getClassTeacherClass(staff));
    setSelectValue(classTeacherAssignmentForm.elements.sectionName, getClassTeacherSection(staff));
    setSelectValue(classTeacherAssignmentForm.elements.staffId, staff.staffId || "");
    classTeacherAssignmentForm.scrollIntoView({behavior: "smooth", block: "center"});
    showToast(`${staff.name || staff.staffId} assignment loaded for edit.`);
    return;
  }
  if (deleteButton) {
    const staff = staffMembers.find(item => item.staffId === deleteButton.dataset.deleteClassTeacher);
    if (!staff) return;
    const oldClass = staff.assignedClass || "";
    staff.assignedClass = "";
    staff.assignedClassName = "";
    staff.assignedSection = "";
    if (!saveAppState()) return;
    renderClassTeacherAssignment();
    renderStaffDetails();
    showToast(`${staff.name || staff.staffId} removed from ${oldClass || "class teacher"} assignment.`);
  }
});

staffDetailsForm.addEventListener("submit", event => {
  event.preventDefault();
  const data = new FormData(staffDetailsForm);
  const staff = {
    staffId: String(data.get("staffId") || "").trim(),
    name: String(data.get("name") || "").trim(),
    role: String(data.get("role") || "").trim(),
    designation: String(data.get("designation") || "").trim(),
    teachingSubject: isTeacherDesignation(data.get("designation")) ? String(data.get("teachingSubject") || "").trim() : "",
    department: String(data.get("department") || "").trim(),
    phone: String(data.get("phone") || "").trim(),
    emergencyPhone: String(data.get("emergencyPhone") || "").trim(),
    email: String(data.get("email") || "").trim(),
    address: String(data.get("address") || "").trim(),
    photo: currentStaffPhoto
  };
  if (!staff.staffId || !staff.name || !staff.email || !staff.phone) {
    showToast("Staff ID, name, email and phone required.");
    return;
  }
  const existingIndex = staffMembers.findIndex(item => item.staffId.toLowerCase() === staff.staffId.toLowerCase());
  const existingStaff = existingIndex >= 0 ? staffMembers[existingIndex] : {};
  staff.status = existingStaff.status || "Active";
  staff.assignedClass = existingStaff.assignedClass || "";
  staff.assignedClassName = existingStaff.assignedClassName || "";
  staff.assignedSection = existingStaff.assignedSection || "";
  if (existingIndex >= 0) staffMembers[existingIndex] = staff;
  else staffMembers.unshift(staff);
  saveAppState();
  renderStaffDetails();
  renderHrSetup();
  renderTeacherIdCardModule();
  renderUserAccessSettings();
  staffDetailsForm.reset();
  renderStaffTeachingSubjectField();
  currentStaffPhoto = "";
  renderStaffPhotoPreview();
  setNextStaffId();
  showToast(`${staff.name} staff details ${existingIndex >= 0 ? "updated" : "saved"}.`);
});

if (departmentForm) {
  departmentForm.addEventListener("submit", event => {
    event.preventDefault();
    const data = new FormData(departmentForm);
    const department = {
      name: String(data.get("name") || "").trim()
    };
    if (!department.name) {
      showToast("Department name required.");
      return;
    }
    if (departments.some((item, index) => index !== editingDepartmentIndex && item.name.toLowerCase() === department.name.toLowerCase())) {
      showToast(`${department.name} department already added.`);
      return;
    }
    const oldName = editingDepartmentIndex >= 0 ? departments[editingDepartmentIndex].name : "";
    if (editingDepartmentIndex >= 0) {
      departments[editingDepartmentIndex] = department;
      staffMembers.forEach(staff => {
        if (staff.department === oldName) staff.department = department.name;
      });
      designations.forEach(designation => {
        if (designation.department === oldName) designation.department = department.name;
      });
    } else {
      departments.push(department);
    }
    departments.sort((a, b) => a.name.localeCompare(b.name));
    saveAppState();
    renderHrSetup();
    departmentForm.reset();
    editingDepartmentIndex = -1;
    departmentForm.querySelector("button[type='submit']").textContent = "Add Department";
    showToast(`${department.name} department ${oldName ? "updated" : "saved"}.`);
  });
}

if (roleForm) {
  roleForm.addEventListener("submit", event => {
    event.preventDefault();
    const data = new FormData(roleForm);
    const role = {
      name: String(data.get("name") || "").trim(),
      description: String(data.get("description") || "").trim()
    };
    if (!role.name) {
      showToast("Role name required.");
      return;
    }
    const oldName = editingRoleIndex >= 0 ? roles[editingRoleIndex].name : "";
    if (isProtectedRoleName(role.name) || isProtectedRoleName(oldName)) {
      showToast("Master Admin/Admin role is protected and cannot be edited here.");
      return;
    }
    if (roles.some((item, index) => index !== editingRoleIndex && item.name.toLowerCase() === role.name.toLowerCase())) {
      showToast(`${role.name} role already added.`);
      return;
    }
    if (editingRoleIndex >= 0) {
      roles[editingRoleIndex] = role;
      staffMembers.forEach(staff => {
        if (staff.role === oldName) staff.role = role.name;
      });
      userAccessAccounts.forEach(account => {
        if (account.role === oldName) account.role = role.name;
      });
      if (oldName && oldName !== role.name && rolePermissions[oldName]) {
        rolePermissions[role.name] = rolePermissions[oldName];
        delete rolePermissions[oldName];
      }
      if (oldName && oldName !== role.name && rolePermissionAudit[oldName]) {
        rolePermissionAudit[role.name] = rolePermissionAudit[oldName];
        delete rolePermissionAudit[oldName];
      }
    } else {
      roles.push(role);
    }
    normalizeRolePermission(role.name);
    roles.sort((a, b) => a.name.localeCompare(b.name));
    saveAppState();
    renderHrSetup();
    renderUserAccessSettings();
    roleForm.reset();
    editingRoleIndex = -1;
    roleForm.querySelector("button[type='submit']").textContent = "Add Role";
    showToast(`${role.name} role ${oldName ? "updated" : "saved"}.`);
  });
}

if (designationForm) {
  designationForm.addEventListener("submit", event => {
    event.preventDefault();
    const data = new FormData(designationForm);
    const designation = {
      name: String(data.get("name") || "").trim(),
      department: String(data.get("department") || "").trim(),
      level: String(data.get("level") || "").trim()
    };
    if (!designation.name) {
      showToast("Designation name required.");
      return;
    }
    if (designations.some((item, index) => index !== editingDesignationIndex && item.name.toLowerCase() === designation.name.toLowerCase())) {
      showToast(`${designation.name} designation already added.`);
      return;
    }
    const oldName = editingDesignationIndex >= 0 ? designations[editingDesignationIndex].name : "";
    if (editingDesignationIndex >= 0) {
      designations[editingDesignationIndex] = designation;
      staffMembers.forEach(staff => {
        if (staff.designation === oldName) staff.designation = designation.name;
      });
    } else {
      designations.push(designation);
    }
    designations.sort((a, b) => a.name.localeCompare(b.name));
    saveAppState();
    renderStaffDetails();
    renderHrSetup();
    renderTeacherIdCardModule();
    designationForm.reset();
    editingDesignationIndex = -1;
    designationForm.querySelector("button[type='submit']").textContent = "Add Designation";
    showToast(`${designation.name} designation ${oldName ? "updated" : "saved"}.`);
  });
}

document.getElementById("showDepartmentSetupBtn")?.addEventListener("click", () => setHrSetupPanel("departmentSetupPanel"));
document.getElementById("showRoleSetupBtn")?.addEventListener("click", () => setHrSetupPanel("roleSetupPanel"));
document.getElementById("showDesignationSetupBtn")?.addEventListener("click", () => setHrSetupPanel("designationSetupPanel"));

document.getElementById("transportVillageSearch")?.addEventListener("input", renderTransportVillages);

if (transportVillageForm) {
  transportVillageForm.addEventListener("submit", event => {
    event.preventDefault();
    const data = new FormData(transportVillageForm);
    const villageName = canonicalTransportVillageName(data.get("villageName") || "");
    const distanceKm = String(data.get("distanceKm") || "").trim();
    const newStudentFee = Number(data.get("newStudentFee") || 0);
    const promotedStudentFee = Number(data.get("promotedStudentFee") || 0);
    const specialStudentFee = Number(data.get("specialStudentFee") || 0);
    if (!villageName) return;
    if (findTransportVillageByName(villageName)) {
      showToast(`${villageName} already exists.`);
      return;
    }
    transportVillages.push(villageName);
    if (distanceKm) transportVillageDistances[villageName] = distanceKm;
    transportVillageFees[villageName] = {newStudentFee, promotedStudentFee, specialStudentFee};
    if (!saveAppState()) {
      renderTransportVillages();
      showToast("Pickup point was not saved. Please check the internet or server connection.", "error", 6000);
      return;
    }
    renderTransportVillages();
    renderAdmissionVillageTownOptions(admissionForm.elements.villageTown?.value || "");
    transportVillageForm.reset();
    showToast(`${villageName} added in Pickup Point.`);
  });
}

if (transportVehicleForm) {
  transportVehicleForm.addEventListener("submit", event => {
    event.preventDefault();
    const data = new FormData(transportVehicleForm);
    const vehicleNo = String(data.get("vehicleNo") || "").trim().toUpperCase();
    const vehicleName = String(data.get("vehicleName") || "").trim();
    const driverName = String(data.get("driverName") || "").trim();
    const driverMobile = String(data.get("driverMobile") || "").trim();
    if (!vehicleNo) {
      showToast("Vehicle number required.");
      return;
    }
    const duplicateVehicle = transportVehicles.some((vehicle, index) =>
      index !== editingTransportVehicleIndex &&
      String(vehicle.vehicleNo || "").toUpperCase() === vehicleNo
    );
    if (duplicateVehicle) {
      showToast(`${vehicleNo} already added.`);
      return;
    }
    const wasEditingVehicle = editingTransportVehicleIndex >= 0;
    const previousVehicleNo = wasEditingVehicle
      ? String(transportVehicles[editingTransportVehicleIndex]?.vehicleNo || "").toUpperCase()
      : "";
    const previousVehicle = wasEditingVehicle ? transportVehicles[editingTransportVehicleIndex] || {} : {};
    const vehicleEntry = {
      id: previousVehicle.id || `veh-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      vehicleNo,
      vehicleName,
      driverName,
      driverMobile,
      status: "Active",
      updatedAt: new Date().toISOString()
    };
    if (wasEditingVehicle) {
      transportVehicles[editingTransportVehicleIndex] = vehicleEntry;
      transportVehicleAssignments.forEach(assignment => {
        if (String(assignment.vehicleNo || "").toUpperCase() === previousVehicleNo) {
          assignment.vehicleNo = vehicleNo;
          assignment.vehicleName = vehicleName;
          assignment.driverName = driverName;
          assignment.driverMobile = driverMobile;
        }
      });
    } else {
      transportVehicles.push(vehicleEntry);
    }
    transportVehicles.sort((a, b) => String(a.vehicleNo || "").localeCompare(String(b.vehicleNo || ""), undefined, {numeric: true}));
    if (!saveAppState()) {
      renderTransportVehicles();
      renderTransportVehicleAssignments();
      renderTransportRoutePickupPoints();
      return;
    }
    editingTransportVehicleIndex = -1;
    renderTransportVehicles();
    renderTransportVehicleAssignments();
    renderTransportRoutePickupPoints();
    transportVehicleForm.reset();
    transportVehicleForm.querySelector("button[type='submit']").textContent = "Add Vehicle";
    showToast(`${vehicleNo} vehicle saved.`);
  });
}

if (transportRouteForm) {
  transportRouteForm.addEventListener("submit", event => {
    event.preventDefault();
    const data = new FormData(transportRouteForm);
    const routeName = String(data.get("routeName") || "").trim();
    const routeNote = String(data.get("routeNote") || "").trim();
    if (!routeName) {
      showToast("Route name required.");
      return;
    }
    const duplicateRoute = transportRoutes.some((route, index) =>
      index !== editingTransportRouteIndex &&
      String(route.routeName || "").trim().toLowerCase() === routeName.toLowerCase()
    );
    if (duplicateRoute) {
      showToast(`${routeName} already added.`);
      return;
    }
    const previousRouteName = editingTransportRouteIndex >= 0
      ? String(transportRoutes[editingTransportRouteIndex]?.routeName || "").trim()
      : "";
    const routeEntry = {routeName, routeNote, status: "Active"};
    if (editingTransportRouteIndex >= 0) {
      transportRoutes[editingTransportRouteIndex] = routeEntry;
      transportVehicleAssignments.forEach(assignment => {
        if (String(assignment.routeName || "").trim().toLowerCase() === previousRouteName.toLowerCase()) {
          assignment.routeName = routeName;
        }
      });
      transportRoutePickupPoints.forEach(point => {
        if (String(point.routeName || "").trim().toLowerCase() === previousRouteName.toLowerCase()) {
          point.routeName = routeName;
        }
      });
      editingTransportRouteIndex = -1;
    } else {
      transportRoutes.push(routeEntry);
    }
    transportRoutes.sort((a, b) => String(a.routeName || "").localeCompare(String(b.routeName || ""), undefined, {numeric: true}));
    if (!saveAppState()) {
      renderTransportRoutes();
      renderTransportVehicleAssignments();
      renderTransportRoutePickupPoints();
      showToast("Route was not saved. Please check the internet or server connection.", "error", 6000);
      return;
    }
    renderTransportRoutes();
    renderTransportVehicleAssignments();
    renderTransportRoutePickupPoints();
    transportRouteForm.reset();
    transportRouteForm.querySelector("button[type='submit']").textContent = "Add Route";
    showToast(`${routeName} route saved.`);
  });
}

if (transportAssignVehicleForm) {
  transportAssignVehicleForm.addEventListener("submit", event => {
    event.preventDefault();
    const data = new FormData(transportAssignVehicleForm);
    const routeName = String(data.get("routeName") || "").trim();
    const vehicleNo = String(data.get("vehicleNo") || "").trim().toUpperCase();
    const shift = String(data.get("shift") || "").trim();
    const vehicle = getTransportVehicleByNo(vehicleNo);
    if (!routeName || !vehicleNo || !vehicle || !shift) {
      showToast("Select route, vehicle and trip.");
      return;
    }
    const assignment = {
      routeName,
      vehicleNo,
      vehicleName: vehicle.vehicleName || "",
      driverName: vehicle.driverName || "",
      driverMobile: vehicle.driverMobile || "",
      shift,
      status: "Active"
    };
    const existingIndex = transportVehicleAssignments.findIndex((item, index) =>
      index !== editingTransportAssignmentIndex &&
      String(item.routeName || "").toLowerCase() === routeName.toLowerCase() &&
      String(item.shift || "").toLowerCase() === shift.toLowerCase()
    );
    if (existingIndex >= 0) {
      showToast(`${routeName} already has vehicle for ${shift}.`);
      return;
    }
    if (editingTransportAssignmentIndex >= 0) {
      transportVehicleAssignments[editingTransportAssignmentIndex] = assignment;
      editingTransportAssignmentIndex = -1;
    } else {
      transportVehicleAssignments.push(assignment);
    }
    transportVehicleAssignments.sort((a, b) =>
      String(a.routeName || "").localeCompare(String(b.routeName || ""), undefined, {numeric: true}) ||
      String(a.shift || "").localeCompare(String(b.shift || ""), undefined, {numeric: true})
    );
    if (!saveAppState()) {
      renderTransportVehicleAssignments();
      renderTransportRoutePickupPoints();
      showToast("Vehicle assignment was not saved. Please check the internet or server connection.", "error", 6000);
      return;
    }
    renderTransportVehicleAssignments();
    renderTransportRoutePickupPoints();
    transportAssignVehicleForm.reset();
    transportAssignVehicleForm.querySelector("button[type='submit']").textContent = "Assign Vehicle";
    showToast(`${vehicle.vehicleName || vehicle.vehicleNo} assignment saved.`);
  });
}

if (transportRoutePickupForm) {
  transportRoutePickupForm.addEventListener("submit", event => {
    event.preventDefault();
    const data = new FormData(transportRoutePickupForm);
    const routeName = String(data.get("routeName") || "").trim();
    const villageName = canonicalTransportVillageName(data.get("villageName") || "");
    const shift = String(data.get("shift") || "").trim();
    const time = String(data.get("time") || "").trim();
    const sequence = String(data.get("sequence") || "").trim();
    if (!routeName || !villageName || !shift) {
      showToast("Select route, village and trip.");
      return;
    }
    const point = {routeName, villageName, shift, time, sequence};
    const existingIndex = transportRoutePickupPoints.findIndex((item, index) =>
      index !== editingTransportPickupIndex &&
      String(item.routeName || "").trim().toLowerCase() === routeName.toLowerCase() &&
      normalizeVillageName(item.villageName) === normalizeVillageName(villageName) &&
      String(item.shift || "").trim().toLowerCase() === shift.toLowerCase()
    );
    if (existingIndex >= 0) {
      showToast(`${villageName} already mapped for ${routeName} / ${shift}.`);
      return;
    }
    if (editingTransportPickupIndex >= 0) {
      transportRoutePickupPoints[editingTransportPickupIndex] = point;
      editingTransportPickupIndex = -1;
    } else {
      transportRoutePickupPoints.push(point);
    }
    transportRoutePickupPoints.sort((a, b) =>
      String(a.routeName || "").localeCompare(String(b.routeName || ""), undefined, {numeric: true}) ||
      Number(a.sequence || 999) - Number(b.sequence || 999) ||
      String(a.villageName || "").localeCompare(String(b.villageName || ""), undefined, {numeric: true})
    );
    if (!saveAppState()) {
      renderTransportRoutePickupPoints();
      showToast("Pickup mapping was not saved. Please check the internet or server connection.", "error", 6000);
      return;
    }
    renderTransportRoutePickupPoints();
    transportRoutePickupForm.reset();
    transportRoutePickupForm.querySelector("button[type='submit']").textContent = "Map Pickup Point";
    showToast(`${villageName} pickup mapping saved.`);
  });
}

const addStudentButton = document.getElementById("addStudent");
if (addStudentButton) {
  addStudentButton.addEventListener("click", () => {
    openAdmissionForm();
  });
}

document.getElementById("exportStudentsExcel").addEventListener("click", exportStudentsExcel);

document.getElementById("importStudentsExcelBtn").addEventListener("click", () => {
  importStudentsExcel.click();
});

if (userAccessForm) {
  userAccessForm.addEventListener("submit", event => {
    event.preventDefault();
    const data = new FormData(userAccessForm);
    const staffId = String(data.get("staffId") || "").trim();
    const staff = getStaffByStaffId(staffId);
    const schoolId = normalizeSchoolId(data.get("schoolId") || activeSchoolId || "anps");
    const school = getSchoolById(schoolId);
    const account = {
      staffId,
      staffName: staff ? staff.name : "",
      role: String(data.get("role") || "").trim(),
      school_id: schoolId,
      schoolId,
      schoolName: school?.name || "Alfred Nobel Public School",
      loginId: String(data.get("loginId") || "").trim(),
      password: String(data.get("password") || "").trim(),
      status: String(data.get("status") || "Active").trim() || "Active"
    };
    if (!account.role || !account.loginId || !account.password) {
      showToast("Role, Login ID and Password required.");
      return;
    }
    if (isProtectedRoleName(account.role)) {
      account.status = "Active";
    }
    if (userAccessAccounts.some((item, index) => index !== editingUserAccessIndex && item.loginId.toLowerCase() === account.loginId.toLowerCase())) {
      showToast(`${account.loginId} Login ID already exists.`);
      return;
    }
    if (editingUserAccessIndex >= 0) userAccessAccounts[editingUserAccessIndex] = account;
    else userAccessAccounts.unshift(account);
    normalizeRolePermission(account.role);
    saveAppState();
    renderUserAccessSettings();
    resetUserAccessForm();
    showToast(`${account.loginId} user login saved.`);
  });
}

if (masterAdminForm) {
  masterAdminForm.addEventListener("submit", event => {
    event.preventDefault();
    ensureProtectedRoles();
    const data = new FormData(masterAdminForm);
    const loginId = String(data.get("loginId") || "").trim();
    const password = String(data.get("password") || "").trim();
    if (!loginId || !password) {
      showToast("Master Admin Login ID and Password required.");
      return;
    }
    const existingIndex = userAccessAccounts.findIndex(account => String(account.role || "").trim().toLowerCase() === "master admin");
    const account = {
      staffId: "",
      staffName: "Master Admin",
      role: "Master Admin",
      school_id: "anps",
      schoolId: "anps",
      schoolName: "Alfred Nobel Public School",
      loginId,
      password,
      status: "Active"
    };
    const duplicateLogin = userAccessAccounts.some((item, index) => index !== existingIndex && String(item.loginId || "").trim().toLowerCase() === loginId.toLowerCase());
    if (duplicateLogin) {
      showToast(`${loginId} Login ID already exists.`);
      return;
    }
    if (existingIndex >= 0) userAccessAccounts[existingIndex] = account;
    else userAccessAccounts.unshift(account);
    rolePermissions["Master Admin"] = getDefaultRolePermission("Master Admin");
    saveAppState();
    renderMasterAdminSettings();
    renderUserAccessSettings();
    showToast("Master Admin login saved.");
  });
}

if (schoolManagementForm) {
  schoolManagementForm.addEventListener("submit", saveSchoolManagementForm);
}

document.getElementById("refreshSchoolsBtn")?.addEventListener("click", () => {
  loadSchoolsFromBackend();
  showToast("School list refresh requested.");
});

document.getElementById("schoolManagementRows")?.addEventListener("click", event => {
  const editButton = event.target.closest("[data-edit-school]");
  if (!editButton || !schoolManagementForm) return;
  const index = Number(editButton.dataset.editSchool);
  const school = schools[index];
  if (!school) return;
  editingSchoolIndex = index;
  schoolManagementForm.elements.schoolId.value = school.school_id || school.id || "";
  schoolManagementForm.elements.schoolName.value = school.name || "";
  setSelectValue(schoolManagementForm.elements.plan, school.plan || "School Tenant");
  setSelectValue(schoolManagementForm.elements.status, school.status || "Active");
  schoolManagementForm.querySelector("button[type='submit']").textContent = "Update School";
  showToast(`${school.name || school.school_id} loaded for edit.`);
});

if (studentUserAccessForm) {
  studentUserAccessForm.addEventListener("submit", event => {
    event.preventDefault();
    const data = new FormData(studentUserAccessForm);
    const admissionNo = String(data.get("admissionNo") || "").trim();
    const student = findStudentByAdmissionNo(admissionNo);
    const account = {
      admissionNo,
      studentName: student ? student.name : "",
      klass: student ? student.klass : "",
      loginId: getStudentLoginIdFromAdmissionNo(admissionNo),
      password: String(data.get("password") || "").trim(),
      status: String(data.get("status") || "Active").trim() || "Active",
      appPermissions: data.getAll("appPermissions").map(item => String(item || "").trim()).filter(Boolean)
    };
    if (!account.admissionNo || !account.loginId || !account.password) {
      showToast("Student, Login ID and Password required.");
      return;
    }
    if (studentUserAccounts.some((item, index) => index !== editingStudentUserIndex && item.loginId.toLowerCase() === account.loginId.toLowerCase())) {
      showToast(`${account.loginId} student Login ID already exists.`);
      return;
    }
    if (editingStudentUserIndex >= 0) studentUserAccounts[editingStudentUserIndex] = account;
    else studentUserAccounts.unshift(account);
    saveAppState();
    renderStudentUserLogin();
    resetStudentUserForm();
    showToast(`${account.studentName || account.loginId} student user saved.`);
  });
}

if (accessPermissionForm) {
  accessPermissionForm.addEventListener("submit", event => {
    event.preventDefault();
    const roleName = String(document.getElementById("accessPermissionRole")?.value || "").trim();
    if (!roleName) {
      showToast("Select role first.");
      return;
    }
    if (isProtectedRoleName(roleName)) {
      rolePermissions[roleName] = getDefaultRolePermission(roleName);
      rolePermissionAudit[roleName] = {
        updatedAt: new Date().toISOString(),
        updatedBy: getCurrentTopbarRole(),
        locked: true
      };
      saveAppState();
      renderPermissionRows(roleName);
      showToast("Master Admin/Admin permissions are locked with full access.");
      return;
    }
    const permissions = {};
    ACCESS_PERMISSION_MODULES.forEach(moduleId => {
      permissions[moduleId] = {};
      ACCESS_ACTIONS.forEach(action => {
        permissions[moduleId][action] = Boolean(accessPermissionForm.querySelector(`[name="${moduleId}.${action}"]`)?.checked);
      });
    });
    rolePermissions[roleName] = permissions;
    rolePermissionAudit[roleName] = {
      updatedAt: new Date().toISOString(),
      updatedBy: getCurrentTopbarRole(),
      locked: false
    };
    saveAppState();
    renderPermissionRows(roleName);
    showToast(`${roleName} permissions saved.`);
  });
}

importStudentsExcel.addEventListener("change", event => {
  importStudentsExcelFile(event.target.files && event.target.files[0]);
  importStudentsExcel.value = "";
});

document.getElementById("applyCollectionHistoryDateRange")?.addEventListener("click", () => {
  normalizeCollectionHistoryDateInput(document.getElementById("collectionHistoryFromDate"));
  normalizeCollectionHistoryDateInput(document.getElementById("collectionHistoryToDate"));
  scheduleCollectionHistoryFilterRender(true);
});

document.getElementById("clearCollectionHistoryDateRange")?.addEventListener("click", () => {
  clearTimeout(collectionHistoryFilterTimer);
  const fromInput = document.getElementById("collectionHistoryFromDate");
  const toInput = document.getElementById("collectionHistoryToDate");
  const collectedByInput = document.getElementById("collectionHistoryCollectedBy");
  const admissionInput = document.getElementById("collectionHistoryAdmissionNo");
  const receiptInput = document.getElementById("collectionHistoryReceiptNo");
  if (fromInput) fromInput.value = "";
  if (toInput) toInput.value = "";
  if (collectedByInput) collectedByInput.value = "";
  if (admissionInput) admissionInput.value = "";
  if (receiptInput) receiptInput.value = "";
  selectedHistoryPayments.clear();
  renderFeeBook(activeLedgerAdmissionNo || activeFeeStudentAdmissionNo);
  showToast("Collection history filter cleared.");
});

document.getElementById("clearPaymentQuickTotal")?.addEventListener("click", clearPaymentQuickTotal);

document.getElementById("ledgerPaymentRows")?.addEventListener("change", event => {
  const input = event.target.closest("[data-payment-total-select]");
  if (!input) return;
  if (input.checked) selectedHistoryPayments.add(input.value);
  else selectedHistoryPayments.delete(input.value);
  input.closest("tr")?.classList.toggle("selected-payment-row", input.checked);
  updatePaymentQuickTotal();
});

["collectionHistoryFromDate", "collectionHistoryToDate"].forEach(id => {
  const input = document.getElementById(id);
  input?.addEventListener("input", event => {
    const value = String(event.target.value || "").trim();
    if (!value || /^\d{1,2}$/.test(value) || value.length >= 10) scheduleCollectionHistoryFilterRender(false);
  });
  input?.addEventListener("change", event => {
    normalizeCollectionHistoryDateInput(event.target);
    scheduleCollectionHistoryFilterRender(false);
  });
  input?.addEventListener("keydown", event => {
    if (event.key !== "Enter") return;
    event.preventDefault();
    normalizeCollectionHistoryDateInput(event.target);
    scheduleCollectionHistoryFilterRender(true);
  });
});

document.getElementById("collectionHistoryCollectedBy")?.addEventListener("change", () => {
  scheduleCollectionHistoryFilterRender(false);
});

document.getElementById("collectionHistoryAdmissionNo")?.addEventListener("input", () => {
  scheduleCollectionHistoryFilterRender(false);
});

document.getElementById("collectionHistoryReceiptNo")?.addEventListener("input", () => {
  scheduleCollectionHistoryFilterRender(false);
});

document.getElementById("upiPaymentStatusFilter")?.addEventListener("change", renderUpiPaymentVerification);
document.getElementById("upiPaymentAdmissionFilter")?.addEventListener("input", renderUpiPaymentVerification);
document.getElementById("upiPaymentRows")?.addEventListener("click", event => {
  const approve = event.target.closest("[data-approve-upi-payment]");
  const reject = event.target.closest("[data-reject-upi-payment]");
  if (approve) approveUpiPaymentRequest(approve.dataset.approveUpiPayment);
  if (reject) rejectUpiPaymentRequest(reject.dataset.rejectUpiPayment);
});

document.getElementById("bankBookDateFilter")?.addEventListener("change", renderBankBook);
document.getElementById("bankBookFeeHeadFilter")?.addEventListener("change", renderBankBook);
document.getElementById("bankBookSearchInput")?.addEventListener("input", renderBankBook);
document.getElementById("bankBookClearFilters")?.addEventListener("click", () => {
  const date = document.getElementById("bankBookDateFilter");
  const feeHead = document.getElementById("bankBookFeeHeadFilter");
  const search = document.getElementById("bankBookSearchInput");
  if (date) date.value = "";
  if (feeHead) feeHead.value = "";
  if (search) search.value = "";
  renderBankBook();
});

document.getElementById("bankReconRunBtn")?.addEventListener("click", () => {
  const input = document.getElementById("bankReconCsvInput");
  const file = input?.files?.[0];
  if (!file) {
    showToast("Please upload a bank CSV statement first.");
    return;
  }
  const reader = new FileReader();
  reader.onload = () => {
    renderBankReconciliation(buildBankStatementRows(String(reader.result || "")));
    showToast("Bank statement matched with Bank Book.");
  };
  reader.readAsText(file);
});

document.getElementById("bankReconClearBtn")?.addEventListener("click", () => {
  const input = document.getElementById("bankReconCsvInput");
  if (input) input.value = "";
  renderBankReconciliation([]);
});

document.getElementById("importStaffAttendanceBtn").addEventListener("click", () => {
  staffAttendanceImport.click();
});

document.getElementById("importStaffAttendanceToolBtn").addEventListener("click", () => {
  staffAttendanceImport.click();
});

staffAttendanceImport.addEventListener("change", event => {
  importStaffAttendanceFile(event.target.files && event.target.files[0]);
  staffAttendanceImport.value = "";
});

document.getElementById("staffAttendanceDate").addEventListener("input", renderStaffAttendance);

document.getElementById("leaveApprovalRows")?.addEventListener("click", event => {
  const approveButton = event.target.closest("[data-approve-leave]");
  const rejectButton = event.target.closest("[data-reject-leave]");
  const leaveId = approveButton?.dataset.approveLeave || rejectButton?.dataset.rejectLeave || "";
  const leaveIndex = Number(approveButton?.dataset.leaveIndex || rejectButton?.dataset.leaveIndex || -1);
  if (!leaveId && leaveIndex < 0) return;
  const leave = teacherLeaves.find(item => String(item.id || "") === leaveId) || teacherLeaves[leaveIndex];
  if (!leave) {
    showToast("Leave request not found.");
    return;
  }
  if (rejectButton) {
    const row = rejectButton.closest("[data-leave-row]");
    const reason = row?.querySelector(".leave-reject-note")?.value || "";
    if (!reason || !reason.trim()) {
      showToast("Reject reason is required.");
      return;
    }
    leave.rejectionReason = reason.trim();
  } else {
    leave.rejectionReason = "";
  }
  leave.status = approveButton ? "Approved" : "Rejected";
  leave.reviewedAt = new Date().toISOString();
  leave.reviewedBy = getCurrentTopbarRole();
  saveAppState();
  renderLeaveApprovalRequests();
  showToast(`Leave request ${leave.status.toLowerCase()}.`);
});

document.getElementById("approveAllPendingLeaves")?.addEventListener("click", () => {
  const pending = teacherLeaves.filter(item => String(item.status || "Pending") === "Pending");
  if (!pending.length) {
    showToast("No pending leave request found.");
    return;
  }
  pending.forEach(leave => {
    leave.status = "Approved";
    leave.reviewedAt = new Date().toISOString();
    leave.reviewedBy = getCurrentTopbarRole();
  });
  saveAppState();
  renderLeaveApprovalRequests();
  showToast(`${pending.length} leave request approved.`);
});

["staffAttendanceDevice", "staffAttendanceDeviceModel", "staffAttendanceDeviceNote", "staffAttendanceSource"].forEach(id => {
  document.getElementById(id).addEventListener("input", saveStaffBiometricDevice);
});

document.getElementById("staffBiometricSyncBtn").addEventListener("click", () => {
  saveStaffBiometricDevice();
  showToast("Biometric API connection provision ready. Data will sync after connecting the device software or API.");
});

document.getElementById("classSectionReportBtn").addEventListener("click", () => {
  renderClassSectionReport();
  setStudentReportPanel("classSectionReportPanel");
  showToast("Class & section report ready.");
});

document.getElementById("studentGenderRatioReportBtn").addEventListener("click", () => {
  renderStudentGenderRatioReport();
  setStudentReportPanel("studentGenderRatioReportPanel");
  showToast("Student gender ratio report ready.");
});

document.getElementById("studentTeacherRatioReportBtn").addEventListener("click", () => {
  renderStudentTeacherRatioReport();
  setStudentReportPanel("studentTeacherRatioReportPanel");
  showToast("Student teacher ratio report ready.");
});

document.getElementById("entireSchoolFeesMonthFilter")?.addEventListener("change", renderEntireSchoolFeesReport);
document.getElementById("showEntireSchoolMonthlyFeesBtn")?.addEventListener("click", () => setEntireSchoolFeesPanel("monthly"));
document.getElementById("showEntireSchoolYearlyFeesBtn")?.addEventListener("click", () => setEntireSchoolFeesPanel("yearly"));
document.getElementById("dailyCollectionDateFilter")?.addEventListener("change", event => {
  normalizeCollectionHistoryDateInput(event.target);
  activeDailyCollectionDate = "";
  renderDailyCollectionReport();
});
document.getElementById("dailyCollectionDateFilter")?.addEventListener("keydown", event => {
  if (event.key !== "Enter") return;
  event.preventDefault();
  normalizeCollectionHistoryDateInput(event.target);
  activeDailyCollectionDate = "";
  renderDailyCollectionReport();
});
document.getElementById("dailyCollectionClearDate")?.addEventListener("click", () => {
  const input = document.getElementById("dailyCollectionDateFilter");
  if (input) input.value = "";
  activeDailyCollectionDate = "";
  renderDailyCollectionReport();
});

classTimetableForm.addEventListener("submit", event => {
  event.preventDefault();
  syncTimetableBuilderRowsFromDom();
  const className = String(classTimetableForm.elements.className?.value || "").trim();
  const sectionName = String(classTimetableForm.elements.sectionName?.value || "").trim();
  const day = String(classTimetableForm.elements.day?.value || activeTimetableDay || "Monday");
  const validRows = timetableBuilderRows.filter(row => row.subject || row.teacher || row.startTime || row.endTime || row.room);
  if (!className || !sectionName || !day) {
    showToast("Class, section and day required.");
    return;
  }
  if (!validRows.length || validRows.some(row => !row.subject)) {
    showToast("Subject required in every filled row.");
    return;
  }
  if (validRows.some(row => (row.startTime && !row.endTime) || (!row.startTime && row.endTime))) {
    showToast("If timing is entered, both time from and time to are required.");
    return;
  }
  const classSection = `${className} ${sectionName}`.trim();
  for (let index = classTimetableEntries.length - 1; index >= 0; index -= 1) {
    if (classTimetableEntries[index].classSection === classSection && classTimetableEntries[index].day === day) {
      classTimetableEntries.splice(index, 1);
    }
  }
  const logicalPeriods = getTimetableLogicalPeriods(validRows);
  const entries = validRows.map((row, index) => ({
    id: `tt-${Date.now()}-${index}-${Math.random().toString(16).slice(2)}`,
    className,
    sectionName,
    classSection,
    day,
    period: logicalPeriods[index] || index + 1,
    entryType: "Class",
    subject: row.subject,
    teacher: row.teacher,
    startTime: row.startTime,
    endTime: row.endTime,
    duration: getTimetableDuration(row.startTime, row.endTime),
    room: row.room,
    source: "Main ERP",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    note: ""
  }));
  classTimetableEntries.unshift(...entries);
  const saved = saveAppState();
  renderClassTimetable();
  renderClassTimetableOptions();
  if (!saved) {
    renderTimetableBuilderRows();
    renderTimetableBuilderSavedEntries();
    renderTeacherTimetable();
    return;
  }
  timetableBuilderRows = [createTimetableBuilderRow()];
  timetableIntervalMap = {};
  renderTimetableBuilderRows();
  renderTimetableBuilderSavedEntries();
  renderTeacherTimetable();
  showToast(`${classSection} ${day} timetable saved.`);
});

classTimetableForm.elements.className.addEventListener("change", () => {
  syncTimetableBuilderRowsFromDom();
  renderClassTimetableOptions();
  loadTimetableBuilderForSelection();
});
classTimetableForm.elements.sectionName.addEventListener("change", loadTimetableBuilderForSelection);
document.getElementById("openClassTimetableBuilder").addEventListener("click", () => setClassTimetableBuilderVisible(true));
document.getElementById("closeClassTimetableBuilder").addEventListener("click", () => setClassTimetableBuilderVisible(false));
document.getElementById("addTimetableRow").addEventListener("click", () => {
  syncTimetableBuilderRowsFromDom();
  timetableBuilderRows.push(createTimetableBuilderRow());
  renderTimetableBuilderRows();
});
document.getElementById("applyTimetableQuick").addEventListener("click", applyTimetableQuickParameters);
document.getElementById("applyTimetableAllClasses")?.addEventListener("click", applyTimetableTimingToAllBlankEntries);
document.getElementById("applyTimetableInterval").addEventListener("click", applySelectedTimetableInterval);
document.getElementById("timetableIntervalList").addEventListener("click", event => {
  const deleteButton = event.target.closest("[data-delete-timetable-interval]");
  if (!deleteButton) return;
  const period = deleteButton.dataset.deleteTimetableInterval;
  delete timetableIntervalMap[period];
  const startTime = classTimetableForm.elements.periodStartTime?.value || "";
  const duration = Number(classTimetableForm.elements.periodDuration?.value || 0);
  if (startTime && duration > 0) {
    applyTimetableQuickParameters({forceOverwrite: true});
    applyTimetableTimingToAllBlankEntries({overwriteSavedTimes: true, silent: true});
  } else {
    renderTimetableIntervalOptions();
  }
  showToast(`Interval after Period ${period} deleted.`);
});
document.getElementById("classTimetableDayTabs").addEventListener("click", event => {
  const button = event.target.closest("[data-timetable-day]");
  if (!button) return;
  activeTimetableDay = button.dataset.timetableDay || "Monday";
  classTimetableForm.elements.day.value = activeTimetableDay;
  const savedDayFilter = document.getElementById("classTimetableSavedDayFilter");
  if (savedDayFilter) savedDayFilter.value = activeTimetableDay;
  document.querySelectorAll("[data-timetable-day]").forEach(dayButton => {
    dayButton.classList.toggle("active", dayButton === button);
  });
  loadTimetableBuilderForSelection();
});
document.getElementById("classTimetableSavedDayFilter")?.addEventListener("change", event => {
  activeTimetableDay = event.target.value || activeTimetableDay || "Monday";
  classTimetableForm.elements.day.value = activeTimetableDay;
  document.querySelectorAll("[data-timetable-day]").forEach(dayButton => {
    dayButton.classList.toggle("active", dayButton.dataset.timetableDay === activeTimetableDay);
  });
  renderTimetableBuilderSavedEntries();
});
document.getElementById("classTimetableBuilderRows").addEventListener("click", event => {
  const deleteButton = event.target.closest("[data-delete-timetable-row]");
  if (!deleteButton) return;
  syncTimetableBuilderRowsFromDom();
  timetableBuilderRows = timetableBuilderRows.filter(row => row.id !== deleteButton.dataset.deleteTimetableRow);
  if (!timetableBuilderRows.length) timetableBuilderRows = [createTimetableBuilderRow()];
  renderTimetableBuilderRows();
});
document.getElementById("classTimetableBuilderSavedRows")?.addEventListener("click", event => {
  const editButton = event.target.closest("[data-edit-timetable-day]");
  if (!editButton) return;
  activeTimetableDay = editButton.dataset.editTimetableDay || "Monday";
  classTimetableForm.elements.day.value = activeTimetableDay;
  document.querySelectorAll("[data-timetable-day]").forEach(dayButton => {
    dayButton.classList.toggle("active", dayButton.dataset.timetableDay === activeTimetableDay);
  });
  loadTimetableBuilderForSelection({loadExisting: true});
  document.getElementById("classTimetableBuilderRows")?.scrollIntoView({behavior: "smooth", block: "center"});
  showToast(`${activeTimetableDay} timetable loaded for edit.`);
});
document.getElementById("classTimetableClassFilter").addEventListener("change", renderClassTimetable);
document.getElementById("classTimetableSectionFilter").addEventListener("change", renderClassTimetable);
document.getElementById("searchClassTimetable").addEventListener("click", renderClassTimetable);
document.getElementById("teacherTimetableSelect")?.addEventListener("change", renderTeacherTimetable);

document.getElementById("openAdmissionFromPage").addEventListener("click", () => {
  openAdmissionForm();
});

admissionForm.addEventListener("submit", event => {
  event.preventDefault();
  const admissionNo = getAdmissionNumberFromForm();
  const data = new FormData(admissionForm);
  const studentName = String(data.get("studentName") || "").trim();
  const klass = String(data.get("klass") || "").trim();
  const section = String(data.get("section") || "").trim();
  const studentType = String(data.get("studentType") || "New Student").trim();
  const fee = String(data.get("fee") || "Due");
  const route = String(data.get("route") || "Self");
  const duplicate = students.find(student => normalizeAdmissionNo(student.admissionNo) === normalizeAdmissionNo(admissionNo) && normalizeAdmissionNo(student.admissionNo) !== normalizeAdmissionNo(editingAdmissionNo));

  admissionError.textContent = "";
  getAdmissionSerialInput()?.classList.remove("field-error");

  if (duplicate) {
    admissionError.textContent = `Admission No. ${admissionNo} already exists for ${duplicate.name}. Same admission number cannot be used again.`;
    getAdmissionSerialInput()?.classList.add("field-error");
    getAdmissionSerialInput()?.focus();
    getAdmissionSerialInput()?.select();
    showToast("Duplicate admission number blocked.");
    return;
  }

  let selectedOtherServices = getCheckedValues("otherServices");
  if (selectedOtherServices.includes("Special/Custom")) {
    selectedOtherServices = selectedOtherServices.filter(service => service !== "Transport");
  }
  const fatherName = String(data.get("fatherName") || "").trim();
  const fatherMobile = String(data.get("fatherMobile") || "").trim();
  const motherName = String(data.get("motherName") || "").trim();
  const motherMobile = String(data.get("motherMobile") || "").trim();
  const guardianName = String(data.get("guardianName") || "").trim() || fatherName || motherName;
  const guardianMobile = String(data.get("mobile") || "").trim() || fatherMobile || motherMobile;
  const studentData = {
    name: studentName,
    klass: `${klass} ${section}`.trim(),
    status: "Present",
    fee,
    route,
    admissionNo,
    studentType,
    guardian: guardianName,
    mobile: guardianMobile,
    transportRequired: selectedOtherServices.includes("Transport") && !selectedOtherServices.includes("Special/Custom"),
    dob: formatDateDDMMYYYY(String(data.get("dob") || "").trim()),
    gender: String(data.get("gender") || "").trim(),
    bloodGroup: String(data.get("bloodGroup") || "").trim(),
    nationality: String(data.get("nationality") || "").trim(),
    religion: String(data.get("religion") || "").trim(),
    motherTongue: String(data.get("motherTongue") || "").trim(),
    villageTown: canonicalTransportVillageName(data.get("villageTown") || ""),
    fatherName,
    fatherOccupation: "",
    fatherQualification: String(data.get("fatherQualification") || "").trim(),
    fatherWorkType: String(data.get("fatherWorkType") || "").trim(),
    fatherAnnualIncome: Number(data.get("fatherAnnualIncome") || 0),
    fatherMobile,
    fatherEmail: String(data.get("fatherEmail") || "").trim(),
    motherName,
    motherOccupation: String(data.get("motherOccupation") || "").trim(),
    motherQualification: String(data.get("motherQualification") || "").trim(),
    motherWorkType: String(data.get("motherWorkType") || "").trim(),
    motherAnnualIncome: Number(data.get("motherAnnualIncome") || 0),
    motherMobile,
    motherEmail: String(data.get("motherEmail") || "").trim(),
    email: String(data.get("email") || "").trim(),
    address: String(data.get("address") || "").trim(),
    medicalConditions: String(data.get("medicalConditions") || "").trim(),
    allergies: String(data.get("allergies") || "").trim(),
    regularMedicine: String(data.get("regularMedicine") || "").trim(),
    emergencyContactNumber: String(data.get("emergencyContactNumber") || "").trim(),
    admissionFee: Number(data.get("admissionFee") || 0),
    annualFee: Number(data.get("annualFee") || 0),
    formFee: Number(data.get("formFee") || 0),
    tuitionFee: Number(data.get("tuitionFee") || 0),
    feeMonths: getCheckedMonths("feeMonths"),
    transportFee: Number(data.get("transportFee") || 0),
    specialTransportFee: Number(data.get("specialTransportFee") || 0),
    otherServices: selectedOtherServices,
    transportMonths: getCheckedMonths("transportMonths"),
    dayBoardingFee: selectedOtherServices.includes("Day Boarding") ? Number(data.get("dayBoardingFee") || 0) : 0,
    dayBoardingTransportFee: selectedOtherServices.includes("Day Boarding") ? Number(data.get("dayBoardingTransportFee") || 0) : 0,
    dayBoardingMonths: getCheckedMonths("dayBoardingMonths"),
    roboticsFee: selectedOtherServices.includes("Robotics") ? Number(data.get("roboticsFee") || 0) : 0,
    roboticsMonths: getCheckedMonths("roboticsMonths"),
    othersFee: selectedOtherServices.includes("Tiffin") ? Number(data.get("othersFee") || 0) : 0,
    othersMonths: getCheckedMonths("othersMonths"),
    photo: currentAdmissionPhoto,
    updatedAt: new Date().toISOString()
  };

  const editIndex = students.findIndex(student => normalizeAdmissionNo(student.admissionNo) === normalizeAdmissionNo(editingAdmissionNo));
  if (editIndex >= 0) students[editIndex] = {...students[editIndex], ...studentData};
  else students.unshift(studentData);

  saveAppState();
  renderStudents();
  renderDisabledStudents();
  renderFeeBookStudentOptions();
  renderDueFeesSearch();
  renderFinanceSession();
  renderStudentUserLogin();
  renderStudentIdCardModule();
  renderStudentTransportFees();
  renderNonTransportStudents();
  renderTransportRoutePickupPoints();
  renderFeeBook(admissionNo);
  closeAdmissionForm();
  admissionForm.reset();
  setView("students");
  showToast(`${studentName} ${editIndex >= 0 ? "updated" : "admission saved"}.`);
});

getAdmissionSerialInput()?.addEventListener("input", () => {
  admissionError.textContent = "";
  getAdmissionSerialInput()?.classList.remove("field-error");
  getAdmissionNumberFromForm();
});

["feeMonths", "transportMonths", "dayBoardingMonths", "roboticsMonths", "othersMonths"].forEach(name => {
  admissionForm.querySelectorAll(`[name='${name}']`).forEach(input => {
    input.addEventListener("change", () => updateMonthSummary(name));
  });
});

admissionForm.elements.studentPhoto.addEventListener("change", event => {
  const file = event.target.files && event.target.files[0];
  if (!file) {
    currentAdmissionPhoto = "";
    renderAdmissionPhotoPreview();
    return;
  }
  const reader = new FileReader();
  reader.addEventListener("load", () => {
    currentAdmissionPhoto = String(reader.result || "");
    renderAdmissionPhotoPreview();
  });
  reader.readAsDataURL(file);
});

staffDetailsForm.elements.designation.addEventListener("change", renderStaffTeachingSubjectField);

staffDetailsForm.elements.staffPhoto.addEventListener("change", event => {
  const file = event.target.files && event.target.files[0];
  if (!file) {
    currentStaffPhoto = "";
    renderStaffPhotoPreview();
    return;
  }
  const reader = new FileReader();
  reader.addEventListener("load", () => {
    currentStaffPhoto = String(reader.result || "");
    renderStaffPhotoPreview();
  });
  reader.readAsDataURL(file);
});

document.getElementById("closeAdmission").addEventListener("click", closeAdmissionForm);

admissionModal.addEventListener("click", event => {
  if (event.target === admissionModal) closeAdmissionForm();
});

document.getElementById("closeDisableReason").addEventListener("click", closeDisableReasonModal);
document.getElementById("cancelDisableReason").addEventListener("click", closeDisableReasonModal);
document.getElementById("closeReceiptPreview").addEventListener("click", closeReceiptPreview);
document.getElementById("printReceiptPreview")?.addEventListener("click", printLedgerPaymentPreviewContent);
document.getElementById("closeCombinedCollection").addEventListener("click", closeCombinedCollectionPopup);
document.getElementById("cancelCombinedCollection").addEventListener("click", closeCombinedCollectionPopup);
document.getElementById("closeComplaintReview")?.addEventListener("click", closeComplaintReviewModal);
document.getElementById("acceptComplaintReviewAction")?.addEventListener("click", acceptComplaintReview);
document.getElementById("cancelComplaintReviewAction")?.addEventListener("click", cancelComplaintReviewWithReason);
document.getElementById("solveComplaintReviewAction")?.addEventListener("click", solveComplaintReviewWithNote);
document.getElementById("askComplaintSatisfactionAction")?.addEventListener("click", askComplaintSatisfactionReview);

disableReasonModal.addEventListener("click", event => {
  if (event.target === disableReasonModal) closeDisableReasonModal();
});

receiptPreviewModal.addEventListener("click", event => {
  if (event.target === receiptPreviewModal) closeReceiptPreview();
});

combinedCollectionModal.addEventListener("click", event => {
  if (event.target === combinedCollectionModal) closeCombinedCollectionPopup();
});

complaintReviewModal?.addEventListener("click", event => {
  if (event.target === complaintReviewModal) closeComplaintReviewModal();
});

document.addEventListener("click", event => {
  const dateButton = event.target.closest("[data-open-combined-date-picker]");
  if (dateButton) {
    const shell = dateButton.closest(".calendar-input-shell");
    openDatePickerPopover(shell?.querySelector("input[name='date']"), dateButton);
    return;
  }
  const todayButton = event.target.closest("[data-date-picker-today]");
  if (todayButton) {
    const popover = ensureDatePickerPopover();
    const pickerInput = popover.querySelector("[data-date-picker-input]");
    pickerInput.value = toDateInputValue(new Date());
    applyDatePickerValue();
    return;
  }
  const applyButton = event.target.closest("[data-date-picker-apply]");
  if (applyButton) {
    applyDatePickerValue();
    return;
  }
  const popover = document.getElementById("datePickerPopover");
  if (popover && !popover.hidden && !event.target.closest("#datePickerPopover")) {
    closeDatePickerPopover();
  }
});

disableReasonForm.addEventListener("submit", event => {
  event.preventDefault();
  const admissionNo = disableReasonForm.elements.admissionNo.value;
  const reason = disableReasonForm.elements.reason.value;
  if (disableStudentByAdmissionNo(admissionNo, reason)) {
    closeDisableReasonModal();
  }
});

document.addEventListener("keydown", event => {
  if (event.key === "Escape" && admissionModal.getAttribute("aria-hidden") === "false") closeAdmissionForm();
  if (event.key === "Escape" && disableReasonModal.getAttribute("aria-hidden") === "false") closeDisableReasonModal();
  if (event.key === "Escape" && receiptPreviewModal.getAttribute("aria-hidden") === "false") closeReceiptPreview();
  if (event.key === "Escape" && combinedCollectionModal.getAttribute("aria-hidden") === "false") closeCombinedCollectionPopup();
  if (event.key === "Escape" && complaintReviewModal?.getAttribute("aria-hidden") === "false") closeComplaintReviewModal();
  if (event.key === "Escape") closeDatePickerPopover();
});

combinedCollectionForm.addEventListener("change", event => {
  if (event.target.matches("[data-combined-fee]")) updateCombinedCollectionTotals();
  if (event.target.name === "date") event.target.value = formatDateDDMMYYYY(event.target.value || new Date());
  if (
    event.target.name === "date"
    && !combinedCollectionForm.dataset.editPaymentReceipt
    && combinedCollectionForm.dataset.singleCollection !== "1"
  ) {
    renderCombinedCollectionItems();
  }
});

document.addEventListener("change", event => {
  if (event.target.matches("[data-date-picker-input]")) applyDatePickerValue();
});

combinedCollectionForm.addEventListener("input", event => {
  if (["bankAmount", "cashAmount", "discountAmount"].includes(event.target.name)) updateCombinedCollectionTotals();
});

receiptPreviewBody.addEventListener("change", event => {
  const monthlyReportSelect = event.target.closest("[data-fee-book-monthly-report-select]");
  if (!monthlyReportSelect) return;
  openFeeBookMonthlyReport(monthlyReportSelect.dataset.admissionNo, monthlyReportSelect.value);
});

combinedCollectionForm.addEventListener("submit", event => {
  event.preventDefault();
  const form = event.currentTarget;
  const student = findActiveStudentByAdmissionOrName(form.elements.admissionNo.value);
  const selected = [...form.querySelectorAll("[data-combined-fee]:checked")].map(input => {
    const appliedDate = formatDateDDMMYYYY(form.elements.date.value || new Date());
    return {
      head: input.dataset.head,
      month: input.dataset.month,
      amount: Number(input.dataset.amount || 0),
      fine: Number(input.dataset.fine || 0),
      total: Number(input.dataset.total || 0),
      date: appliedDate
    };
  });
  const total = selected.reduce((sum, item) => sum + item.total, 0);
  let bankAmount = Number(form.elements.bankAmount.value || 0);
  let cashAmount = Number(form.elements.cashAmount.value || 0);
  const discountAmount = Math.min(Number(form.elements.discountAmount?.value || 0), total);
  const payableAmount = Math.max(total - discountAmount, 0);
  if (!student || !selected.length || total <= 0) {
    showToast("Select at least one fee.");
    return;
  }
  if (bankAmount + cashAmount + discountAmount <= 0) {
    showToast("Enter bank, cash or discount amount.");
    return;
  }
  if (bankAmount + cashAmount > payableAmount) {
    showToast(`Payment cannot be more than ${formatRs(payableAmount)} after discount.`);
    return;
  }
  const editingReceipt = form.dataset.editPaymentReceipt || "";
  const editingPaymentId = form.dataset.editPaymentId || "";
  const safeReceipt = getSafeReceiptNoForPayment(student.admissionNo, form.elements.receiptNo.value, editingPaymentId);
  const receiptNo = safeReceipt.receiptNo;
  if (safeReceipt.changed) {
    form.elements.receiptNo.value = receiptNo;
    showToast(`Receipt no. changed to ${receiptNo} to avoid duplicate.`);
  }
  if (editingReceipt) deletePaymentByReceipt(student.admissionNo, editingReceipt, editingPaymentId);
  const payment = collectCombinedStudentPayment(student, selected, form.elements.date.value, receiptNo, {
    bankAmount,
    cashAmount,
    discountAmount,
    remarks: form.elements.remarks?.value || "",
    paymentId: editingPaymentId || undefined
  });
  if (!payment) {
    showToast("Combined payment could not be saved.");
    return;
  }
  setNextReceiptNo();
  saveAppState();
  renderFeeBook(student.admissionNo);
  renderStudentFeeCounter(student.admissionNo);
  renderDueFeesSearch();
  renderFinanceSession();
  closeCombinedCollectionPopup();
  openCombinedReceiptPreview(student, payment, selected);
  showToast(`Combined receipt ${payment.receipt} ${editingReceipt ? "updated" : "saved"}.`);
});

document.getElementById("feeForm").addEventListener("submit", event => {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  const id = data.get("id");
  const student = findActiveStudentByAdmissionNo(id);
  if (!student) {
    showToast("Student not found or disabled.");
    return;
  }
  const date = formatDateDDMMYYYY(data.get("date") || new Date());
  const bankAmount = Number(data.get("bankAmount") || 0);
  const cashAmount = Number(data.get("cashAmount") || 0);
  const rawAmount = bankAmount + cashAmount;
  const mode = bankAmount > 0 && cashAmount > 0 ? "Bank + Cash" : bankAmount > 0 ? "Bank" : "Cash";
  const feeHead = event.currentTarget.dataset.feeHead || "";
  const fineAmount = ["Tuition Fee", "Transport Fees"].includes(feeHead) ? Number(data.get("fineAmount") || event.currentTarget.dataset.fineAmount || 0) : 0;
  const feeMonth = event.currentTarget.dataset.feeMonth || "";
  const editingReceipt = event.currentTarget.dataset.editPaymentReceipt || "";
  const editingPaymentId = event.currentTarget.dataset.editPaymentId || "";
  const safeReceipt = getSafeReceiptNoForPayment(student.admissionNo, data.get("receiptNo"), editingPaymentId);
  const receiptNo = safeReceipt.receiptNo;
  event.currentTarget.elements.amount.value = rawAmount;
  if (rawAmount <= 0) {
    showToast("Enter bank or cash payment amount.");
    return;
  }
  if (editingReceipt) deletePaymentByReceipt(student.admissionNo, editingReceipt, editingPaymentId);
  const payment = collectStudentPayment(student, rawAmount, date, mode, feeHead, fineAmount, feeMonth, receiptNo, {bankAmount, cashAmount, paymentId: editingPaymentId || undefined});
  if (!payment) {
    showToast("Payment could not be saved.");
    return;
  }
  renderStudentFeeCounter(student.admissionNo);
  renderFeeBook(student.admissionNo);
  renderDueFeesSearch();
  renderFinanceSession();
  setNextReceiptNo();
  saveAppState();
  resetPaymentEditMode();
  resetFeeDateToToday();
  document.getElementById("receiptBox").innerHTML = `<strong>Receipt ${payment.receipt}</strong><br>${student.name} (${id}) paid ${formatRs(payment.amount)} by ${mode}.<br><small>Bank: ${formatRs(payment.bankAmount)} | Cash: ${formatRs(payment.cashAmount)} | Fine: ${formatRs(fineAmount)} | Date: ${formatDateDDMMYYYY(payment.date)}</small>`;
  const returnView = activeFeeReturnView || "finance";
  if (returnView !== "finance") setView(returnView);
  showToast(returnView === "feeBook" ? "Payment saved. Fee Book opened." : returnView === "dueFeesSearch" ? "Payment saved. Search Due Fees opened." : "Payment saved in Fee Book.");
});

document.querySelector("#feeForm [name='id']").addEventListener("change", event => {
  const student = findActiveStudentByAdmissionNo(event.target.value);
  if (!student) {
    showToast("Student admission number not found or disabled.");
    return;
  }
  renderStudentFeeCounter(student.admissionNo);
});

document.querySelector("#feeForm [name='date']").addEventListener("input", updateFeeFineAmountFromPaymentDate);
document.querySelector("#feeForm [name='date']").addEventListener("change", updateFeeFineAmountFromPaymentDate);
document.querySelector("#feeForm [name='date']").value = formatDateDDMMYYYY(new Date());
noticeForm.elements.noticeDate.value = formatDateDDMMYYYY(new Date());
noticeForm.elements.publishDate.value = formatDateDDMMYYYY(new Date());
fillNoticeSenderDefaults(true);

document.getElementById("quickAction").addEventListener("click", () => {
  openAdmissionForm();
});

document.getElementById("topbarSaveStatus")?.addEventListener("click", () => {
  saveAppState();
  showToast("Current data saved.");
});

document.getElementById("topbarAlerts")?.addEventListener("click", () => {
  setView("securityMaintenance");
  showSecuritySystemHealth();
});

document.getElementById("topbarLogout")?.addEventListener("click", () => {
  const roleName = getCurrentTopbarRole();
  saveAppState();
  backendFetch("/api/logout", {
    method: "POST",
    headers: backendHeaders({"Content-Type": "application/json"}),
    body: JSON.stringify({logout: true})
  }).catch(() => {});
  localStorage.removeItem(BACKEND_TOKEN_KEY);
  localStorage.removeItem(BACKEND_USER_KEY);
  localStorage.setItem(BACKEND_LOGGED_OUT_KEY, "1");
  backendSyncReady = false;
  updateTopbarSystemStatus();
  showLoginOverlay();
  showToast(`${roleName} logged out.`);
});

document.getElementById("sendFeeReminder").addEventListener("click", () => {
  showToast("Fee reminder campaign queued.");
});

document.getElementById("studentDueAccessForm")?.addEventListener("submit", event => {
  event.preventDefault();
  const form = event.currentTarget;
  mobileAppSettings.duePopupEnabled = Boolean(form.elements.duePopupEnabled.checked);
  mobileAppSettings.dueLockEnabled = Boolean(form.elements.dueLockEnabled.checked);
  mobileAppSettings.dueLockDays = Math.max(1, Number(form.elements.dueLockDays.value || 75));
  saveAppState();
  renderStudentDueAccessSettings();
  showToast("Student app due popup control saved.");
});

document.getElementById("studentAppGlobalForm")?.addEventListener("submit", event => {
  event.preventDefault();
  const form = event.currentTarget;
  mobileAppSettings.busLocationEnabled = Boolean(form.elements.busLocationEnabled.checked);
  saveAppState();
  renderStudentAppGlobalControls();
  showToast(mobileAppSettings.busLocationEnabled !== false ? "Bus Location enabled for student app." : "Bus Location disabled for student app.");
});

document.querySelector("#studentDueAccessForm [name='dueLockDays']")?.addEventListener("input", syncDueLockTitleFromInput);

document.getElementById("disableSelectedStudent").addEventListener("click", () => {
  showToast("Selected student disable request prepared.");
});

document.getElementById("bulkDeletePreview").addEventListener("click", () => {
  showToast("Bulk delete preview generated.");
});

document.getElementById("sendSmsButton").addEventListener("click", async () => {
  const statusBox = document.getElementById("whatsappStatusBox");
  const payload = {
    to: document.getElementById("whatsappRecipient")?.value || "",
    template: document.getElementById("whatsappTemplateName")?.value || "",
    language: document.getElementById("whatsappLanguageCode")?.value || "en_US",
    variables: document.getElementById("whatsappTemplateVariables")?.value || ""
  };
  if (!payload.to || !payload.template) {
    showToast("Guardian mobile and template name required.");
    return;
  }
  try {
    if (statusBox) statusBox.textContent = "Sending WhatsApp message...";
    const response = await backendFetch("/api/whatsapp/send", {
      method: "POST",
      headers: backendHeaders({"Content-Type": "application/json"}),
      body: JSON.stringify(payload)
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok || !result.ok) {
      const message = result.error || "WhatsApp message failed.";
      if (statusBox) statusBox.textContent = message;
      showToast("WhatsApp message failed.");
      return;
    }
    const messageId = result.result?.messages?.[0]?.id || "sent";
    if (statusBox) statusBox.textContent = `WhatsApp sent successfully. Message ID: ${messageId}`;
    showToast("WhatsApp message sent.");
  } catch (error) {
    if (statusBox) statusBox.textContent = "WhatsApp send failed. Please check backend connection.";
    showToast("WhatsApp send failed.");
  }
});

homeworkEntryForm?.addEventListener("submit", async event => {
  event.preventDefault();
  await publishHomeworkEntry(event.currentTarget);
});

document.getElementById("homeworkClassSelect")?.addEventListener("change", () => {
  renderHomeworkSubjectOptions({ preserveSubject: false });
});

["teacherHomeworkTeacherFilter", "teacherHomeworkClassFilter", "teacherHomeworkDateFilter"].forEach(id => {
  document.getElementById(id)?.addEventListener("change", renderHomeworkModule);
});

["homeworkDoubtClassFilter", "homeworkDoubtSectionFilter", "homeworkDoubtStatusFilter"].forEach(id => {
  document.getElementById(id)?.addEventListener("change", renderHomeworkModule);
});

document.getElementById("teacherHomeworkClearFilters")?.addEventListener("click", () => {
  ["teacherHomeworkTeacherFilter", "teacherHomeworkClassFilter", "teacherHomeworkDateFilter"].forEach(id => {
    const input = document.getElementById(id);
    if (input) input.value = "";
  });
  renderHomeworkModule();
});

document.getElementById("homeworkDoubtClearFilters")?.addEventListener("click", () => {
  ["homeworkDoubtClassFilter", "homeworkDoubtSectionFilter", "homeworkDoubtStatusFilter"].forEach(id => {
    const input = document.getElementById(id);
    if (input) input.value = "";
  });
  renderHomeworkModule();
});

document.getElementById("homeworkRows")?.addEventListener("click", event => {
  const button = event.target.closest("[data-delete-homework]");
  if (!button) return;
  const index = Number(button.dataset.deleteHomework);
  const item = homework[index];
  if (!item) return;
  if (!confirm(`Delete homework ${item.className || ""} - ${item.subject || ""}?`)) return;
  homework.splice(index, 1);
  saveAppState();
  renderHomeworkModule();
  showToast("Homework deleted.");
});

document.getElementById("marksheetEntryForm")?.addEventListener("submit", event => {
  event.preventDefault();
  saveMarksheetEntry(event.currentTarget);
});

document.getElementById("marksheetClassSelect")?.addEventListener("change", () => {
  renderMarksheetOptions({ preserveSubject: false, preserveStudent: false });
});

document.getElementById("marksheetSectionSelect")?.addEventListener("change", () => {
  renderMarksheetOptions({ preserveSubject: true, preserveStudent: false });
});

document.getElementById("marksheetStatusFilter")?.addEventListener("change", renderMarksheetModule);
document.getElementById("marksheetSearch")?.addEventListener("input", renderMarksheetModule);
document.getElementById("academicProfileSearch")?.addEventListener("input", renderAcademicProfileModule);
document.getElementById("academicProfileStudentSelect")?.addEventListener("change", renderAcademicProfileModule);

document.getElementById("externalExamFeeForm")?.addEventListener("submit", event => {
  event.preventDefault();
  saveExternalExamFee(event.currentTarget);
});

document.getElementById("externalExamClassSelect")?.addEventListener("change", () => {
  renderExternalExamOptions({ preserveStudent: false });
});

document.getElementById("resetExternalExamFeeForm")?.addEventListener("click", resetExternalExamFeeForm);
document.getElementById("externalExamSearch")?.addEventListener("input", renderExternalExamFees);
document.getElementById("externalExamFilter")?.addEventListener("change", renderExternalExamFees);
document.getElementById("externalExamStatusFilter")?.addEventListener("change", renderExternalExamFees);

document.getElementById("externalExamFeeRows")?.addEventListener("click", event => {
  const editButton = event.target.closest("[data-edit-external-exam-fee]");
  const deleteButton = event.target.closest("[data-delete-external-exam-fee]");
  if (editButton) {
    const entry = externalExamFees[Number(editButton.dataset.editExternalExamFee)];
    const form = document.getElementById("externalExamFeeForm");
    if (!entry || !form) return;
    editingExternalExamFeeId = entry.id || "";
    form.elements.examName.value = entry.examName || "";
    form.elements.subject.value = entry.subject || "";
    form.elements.className.value = entry.className || "";
    renderExternalExamOptions({ preserveStudent: false });
    form.elements.admissionNo.value = entry.admissionNo || "";
    form.elements.amount.value = Number(entry.amount || 0);
    form.elements.paymentDate.value = entry.paymentDate || "";
    form.elements.mode.value = entry.mode || "Cash";
    form.elements.status.value = entry.status || "Paid";
    form.elements.referenceNo.value = entry.referenceNo || "";
    form.elements.remarks.value = entry.remarks || "";
    const button = document.getElementById("saveExternalExamFeeButton");
    if (button) button.textContent = "Update External Exam Fee";
    form.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  if (deleteButton) {
    const index = Number(deleteButton.dataset.deleteExternalExamFee);
    const entry = externalExamFees[index];
    if (!entry) return;
    if (!confirm(`Delete external exam fee for ${entry.studentName || entry.admissionNo || "student"}?`)) return;
    externalExamFees.splice(index, 1);
    saveAppState();
    renderExternalExamFees();
    showToast("External exam fee deleted.");
  }
});

document.getElementById("marksheetRows")?.addEventListener("click", event => {
  const checkButton = event.target.closest("[data-check-marksheet]");
  const publishButton = event.target.closest("[data-publish-marksheet]");
  const deleteButton = event.target.closest("[data-delete-marksheet]");
  if (checkButton) {
    const entry = marksheetEntries[Number(checkButton.dataset.checkMarksheet)];
    if (!entry) return;
    entry.status = "Checked";
    entry.checkedAt = new Date().toISOString();
    entry.checkedBy = getCurrentTopbarRole();
    saveAppState();
    renderMarksheetModule();
    showToast("Marks checked.");
  }
  if (publishButton) {
    const entry = marksheetEntries[Number(publishButton.dataset.publishMarksheet)];
    if (!entry) return;
    entry.status = "Published";
    entry.publishedAt = new Date().toISOString();
    entry.publishedBy = getCurrentTopbarRole();
    saveAppState();
    renderMarksheetModule();
    showToast("Result published to student app.");
  }
  if (deleteButton) {
    const index = Number(deleteButton.dataset.deleteMarksheet);
    const entry = marksheetEntries[index];
    if (!entry) return;
    if (!confirm(`Delete marks for ${entry.studentName || entry.studentAdmissionNo || "student"}?`)) return;
    marksheetEntries.splice(index, 1);
    saveAppState();
    renderMarksheetModule();
    showToast("Marks entry deleted.");
  }
});

if (homeworkEntryForm?.elements.due) {
  homeworkEntryForm.elements.due.value = toDateInputValue(new Date());
}

document.getElementById("printLedger").addEventListener("click", () => {
  printYearlyFeeStatement();
});

document.getElementById("feeBookMonthlyReportBtn").addEventListener("click", () => {
  openFeeBookMonthlyReport(activeLedgerAdmissionNo || feeBookStudentSelect.value);
});

document.getElementById("feeBookBackToStudent")?.addEventListener("click", () => {
  openFeeBookReturnPage();
});

document.getElementById("tuitionFineForm").addEventListener("submit", event => {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  tuitionFineSetup.dailyRate = Number(data.get("dailyRate") || 0);
  tuitionFineSetup.nextMonth = Number(data.get("nextMonth") || 0);
  tuitionFineSetup.secondMonth = Number(data.get("secondMonth") || 0);
  tuitionFineSetup.laterMonth = Number(data.get("laterMonth") || 0);
  saveAppState();
  renderTuitionFineSetup();
  renderDueFeesSearch();
  renderFeeBook(activeLedgerAdmissionNo);
  showToast("Tuition fine setup saved.");
});

document.getElementById("transportFineForm").addEventListener("submit", event => {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  transportFineSetup.sameMonth = Number(data.get("sameMonth") || 0);
  transportFineSetup.nextMonth = Number(data.get("nextMonth") || 0);
  transportFineSetup.secondMonth = Number(data.get("secondMonth") || 0);
  transportFineSetup.laterMonth = Number(data.get("laterMonth") || 0);
  transportFineSetup.updatedAt = new Date().toISOString();
  if (!saveAppState()) {
    renderTransportFineSetup();
    showToast("Transport fine setup was not saved. Please check the internet or server connection.", "error", 6000);
    return;
  }
  renderTransportFineSetup();
  renderDueFeesSearch();
  renderFeeBook(activeLedgerAdmissionNo);
  showToast("Transport fine setup saved.");
});

document.getElementById("studentTable").addEventListener("click", event => {
  const disableButton = event.target.closest("[data-disable-student]");
  if (!disableButton) return;
  event.preventDefault();
  event.stopPropagation();
  openDisableReasonModal(disableButton.dataset.disableStudent);
});

document.body.addEventListener("click", event => {
  const activeTableDropdown = event.target.closest("#ledgerFeeRows .period-details, #ledgerFeeRows .date-details, #dueFeesSearchRows .period-details");
  const activePaymentSplit = event.target.closest("#ledgerFeeRows .payment-split-details");
  document.querySelectorAll("#ledgerFeeRows .payment-split-details[open]").forEach(dropdown => {
    if (dropdown !== activePaymentSplit) dropdown.open = false;
  });
  if (!activeTableDropdown) {
    openFeeBookDropdowns.clear();
    document.querySelectorAll("#ledgerFeeRows .period-details[open], #ledgerFeeRows .date-details[open], #dueFeesSearchRows .period-details[open]").forEach(dropdown => {
      dropdown.querySelectorAll(".payment-split-details[open]").forEach(childDropdown => {
        childDropdown.open = false;
      });
      dropdown.open = false;
    });
  } else {
    document.querySelectorAll("#dueFeesSearchRows .period-details[open]").forEach(dropdown => {
      if (dropdown !== activeTableDropdown) dropdown.open = false;
    });
  }
  const profile = event.target.closest("[data-profile]");
  const editStudent = event.target.closest("[data-edit-student]");
  const editStudentTransport = event.target.closest("[data-edit-student-transport]");
  const admissionPreview = event.target.closest("[data-open-admission-preview]");
  const studentFees = event.target.closest("[data-student-fees]");
  const paymentReceiptPreview = event.target.closest("[data-preview-payment-receipt]");
  const savedReceiptPreview = event.target.closest("[data-preview-saved-receipt]");
  const selectedPaymentPreview = event.target.closest("[data-preview-selected-payments]");
  const dailyCollectionDate = event.target.closest("[data-open-daily-collection]");
  const classSectionDetail = event.target.closest("[data-view-class-section]");
  const openStudentDetails = event.target.closest("[data-open-student-details]");
  const openFeeBook = event.target.closest("[data-open-fee-book]");
  const disableStudent = event.target.closest("[data-disable-student]");
  const enableStudent = event.target.closest("[data-enable-student]");
  const deleteStudent = event.target.closest("[data-delete-student]");
  const editFeeMaster = event.target.closest("[data-edit-fee-master]");
  const deleteFeeMaster = event.target.closest("[data-delete-fee-master]");
  const editFeeGroup = event.target.closest("[data-edit-fee-group]");
  const deleteFeeGroup = event.target.closest("[data-delete-fee-group]");
  const editStaff = event.target.closest("[data-edit-staff]");
  const disableStaff = event.target.closest("[data-disable-staff]");
  const deleteStaff = event.target.closest("[data-delete-staff]");
  const editDepartment = event.target.closest("[data-edit-department]");
  const editRole = event.target.closest("[data-edit-role]");
  const editDesignation = event.target.closest("[data-edit-designation]");
  const deleteDepartment = event.target.closest("[data-delete-department]");
  const deleteRole = event.target.closest("[data-delete-role]");
  const deleteDesignation = event.target.closest("[data-delete-designation]");
  const editUserAccess = event.target.closest("[data-edit-user-access]");
  const toggleUserAccess = event.target.closest("[data-toggle-user-access]");
  const deleteUserAccess = event.target.closest("[data-delete-user-access]");
  const editStudentUser = event.target.closest("[data-edit-student-user]");
  const toggleStudentUser = event.target.closest("[data-toggle-student-user]");
  const deleteStudentUser = event.target.closest("[data-delete-student-user]");
  const deleteTimetable = event.target.closest("[data-delete-timetable]");
  const editClassSetup = event.target.closest("[data-edit-class-setup]");
  const editSectionSetup = event.target.closest("[data-edit-section-setup]");
  const editSubjectSetup = event.target.closest("[data-edit-subject-setup]");
  const editSubjectAssign = event.target.closest("[data-edit-subject-assign]");
  const deleteClassSetup = event.target.closest("[data-delete-class-setup]");
  const deleteSectionSetup = event.target.closest("[data-delete-section-setup]");
  const deleteSubjectSetup = event.target.closest("[data-delete-subject-setup]");
  const editPayment = event.target.closest("[data-edit-payment]");
  const deletePayment = event.target.closest("[data-delete-payment]");
  const printLedgerPayments = event.target.closest("[data-print-ledger-payments]");
  const printLedgerPreview = event.target.closest("[data-print-ledger-preview]");
  const module = event.target.closest("[data-module]");
  if (profile) showToast(`${profile.dataset.profile} profile opened.`);
  if (printLedgerPreview) {
    printLedgerPaymentPreviewContent();
    return;
  }
  if (printLedgerPayments) {
    printLedgerPaymentDetails(printLedgerPayments.dataset.printLedgerPayments, printLedgerPayments.dataset.feeHead || "");
    return;
  }
  if (classSectionDetail) {
    openClassSectionReportDetails(decodeURIComponent(classSectionDetail.dataset.viewClassSection || ""));
    return;
  }
  if (admissionPreview) {
    openAdmissionFormPreview(admissionPreview.dataset.openAdmissionPreview);
    return;
  }
  if (editStudentTransport) {
    openStudentEditForm(editStudentTransport.dataset.editStudentTransport, "transport");
    return;
  }
  if (editStudent) openStudentEditForm(editStudent.dataset.editStudent);
  if (editStaff) {
    const staff = staffMembers.find(item => item.staffId === editStaff.dataset.editStaff);
    if (staff) {
      staffDetailsForm.elements.staffId.value = staff.staffId || "";
      staffDetailsForm.elements.name.value = staff.name || "";
      setSelectValue(staffDetailsForm.elements.role, staff.role || "");
      setSelectValue(staffDetailsForm.elements.designation, staff.designation || "");
      renderStaffTeachingSubjectField();
      staffDetailsForm.elements.teachingSubject.value = staff.teachingSubject || "";
      setSelectValue(staffDetailsForm.elements.department, staff.department || "");
      staffDetailsForm.elements.phone.value = staff.phone || "";
      staffDetailsForm.elements.emergencyPhone.value = staff.emergencyPhone || "";
      staffDetailsForm.elements.email.value = staff.email || "";
      staffDetailsForm.elements.address.value = staff.address || "";
      currentStaffPhoto = staff.photo || "";
      renderStaffPhotoPreview();
      staffDetailsForm.querySelector("button[type='submit']").textContent = "Update Staff";
      setView("staffDetails");
      showToast(`${staff.name} loaded for edit.`);
    }
  }
  if (disableStaff) {
    const staff = staffMembers.find(item => item.staffId === disableStaff.dataset.disableStaff);
    if (staff) {
      staff.status = staff.status === "Disabled" ? "Active" : "Disabled";
      saveAppState();
      renderStaffDetails();
      renderHrSetup();
      renderTeacherIdCardModule();
      renderUserAccessSettings();
      showToast(`${staff.name} ${staff.status === "Disabled" ? "disabled" : "enabled"}.`);
    }
  }
  if (deleteStaff) {
    const index = staffMembers.findIndex(item => item.staffId === deleteStaff.dataset.deleteStaff);
    if (index >= 0 && confirm(`Delete staff ${staffMembers[index].name}?`)) {
      const [removed] = staffMembers.splice(index, 1);
      userAccessAccounts.forEach(account => {
        if (account.staffId === removed.staffId) {
          account.staffId = "";
          account.staffName = removed.name;
        }
      });
      saveAppState();
      renderStaffDetails();
      renderHrSetup();
      renderUserAccessSettings();
      setNextStaffId();
      showToast(`${removed.name} deleted.`);
    }
  }
  if (editDepartment) {
    const index = Number(editDepartment.dataset.editDepartment);
    const department = departments[index];
    if (department) {
      editingDepartmentIndex = index;
      departmentForm.elements.name.value = department.name || "";
      departmentForm.querySelector("button[type='submit']").textContent = "Update Department";
      setHrSetupPanel("departmentSetupPanel");
      setView("department");
      showToast(`${department.name} ready to edit.`);
    }
  }
  if (editRole) {
    const index = Number(editRole.dataset.editRole);
    const role = roles[index];
    if (role) {
      if (isProtectedRoleName(role.name)) {
        showToast("Master Admin/Admin role is protected and cannot be edited.");
        return;
      }
      editingRoleIndex = index;
      roleForm.elements.name.value = role.name || "";
      roleForm.elements.description.value = role.description || "";
      roleForm.querySelector("button[type='submit']").textContent = "Update Role";
      setHrSetupPanel("roleSetupPanel");
      setView("department");
      showToast(`${role.name} ready to edit.`);
    }
  }
  if (editDesignation) {
    const index = Number(editDesignation.dataset.editDesignation);
    const designation = designations[index];
    if (designation) {
      editingDesignationIndex = index;
      designationForm.elements.name.value = designation.name || "";
      setSelectValue(designationForm.elements.department, designation.department || "");
      designationForm.elements.level.value = designation.level || "";
      designationForm.querySelector("button[type='submit']").textContent = "Update Designation";
      setHrSetupPanel("designationSetupPanel");
      setView("department");
      showToast(`${designation.name} ready to edit.`);
    }
  }
  if (deleteDepartment) {
    const index = Number(deleteDepartment.dataset.deleteDepartment);
    const department = departments[index];
    if (department && confirm(`Delete department ${department.name}?`)) {
      departments.splice(index, 1);
      saveAppState();
      renderHrSetup();
      showToast(`${department.name} department deleted.`);
    }
  }
  if (deleteRole) {
    const index = Number(deleteRole.dataset.deleteRole);
    const role = roles[index];
    if (role && isProtectedRoleName(role.name)) {
      showToast("Master Admin/Admin role cannot be deleted.");
      return;
    }
    if (role && confirm(`Delete role ${role.name}?`)) {
      roles.splice(index, 1);
      delete rolePermissions[role.name];
      delete rolePermissionAudit[role.name];
      userAccessAccounts.forEach(account => {
        if (account.role === role.name) account.role = "";
      });
      saveAppState();
      renderHrSetup();
      renderUserAccessSettings();
      showToast(`${role.name} role deleted.`);
    }
  }
  if (editUserAccess) {
    const index = Number(editUserAccess.dataset.editUserAccess);
    const account = userAccessAccounts[index];
    if (account && userAccessForm) {
      editingUserAccessIndex = index;
      setSelectValue(userAccessForm.elements.staffId, account.staffId || "");
      setSelectValue(userAccessForm.elements.role, account.role || "");
      setSelectValue(userAccessForm.elements.schoolId, account.school_id || account.schoolId || "anps");
      userAccessForm.elements.loginId.value = account.loginId || "";
      userAccessForm.elements.password.value = account.password || "";
      setSelectValue(userAccessForm.elements.status, account.status || "Active");
      userAccessForm.querySelector("button[type='submit']").textContent = "Update User Login";
      setView("userAccessSettings");
      setSelectValue(userAccessForm.elements.schoolId, account.school_id || account.schoolId || "anps");
      showToast(`${account.loginId} ready to edit.`);
    }
  }
  if (toggleUserAccess) {
    const index = Number(toggleUserAccess.dataset.toggleUserAccess);
    const account = userAccessAccounts[index];
    if (account) {
      if (isProtectedRoleName(account.role)) {
        showToast("Master Admin/Admin login cannot be disabled.");
        return;
      }
      account.status = account.status === "Active" ? "Disabled" : "Active";
      saveAppState();
      renderUserAccessSettings();
      showToast(`${account.loginId} ${account.status === "Active" ? "enabled" : "disabled"}.`);
    }
  }
  if (deleteUserAccess) {
    const index = Number(deleteUserAccess.dataset.deleteUserAccess);
    const account = userAccessAccounts[index];
    if (account && isProtectedRoleName(account.role)) {
      showToast("Master Admin/Admin login cannot be deleted.");
      return;
    }
    if (account && confirm(`Delete login ${account.loginId}?`)) {
      userAccessAccounts.splice(index, 1);
      saveAppState();
      renderUserAccessSettings();
      resetUserAccessForm();
      showToast(`${account.loginId} user login deleted.`);
    }
  }
  if (editStudentUser) {
    const index = Number(editStudentUser.dataset.editStudentUser);
    const account = studentUserAccounts[index];
    if (account && studentUserAccessForm) {
      editingStudentUserIndex = index;
      setSelectValue(studentUserAccessForm.elements.admissionNo, account.admissionNo || "");
      studentUserAccessForm.elements.admissionNoDisplay.value = account.admissionNo || "";
      studentUserAccessForm.elements.loginId.value = getStudentLoginIdFromAdmissionNo(account.admissionNo);
      studentUserAccessForm.elements.password.value = account.password || "";
      setSelectValue(studentUserAccessForm.elements.status, account.status || "Active");
      const permissions = getStudentUserPermissionValues(account);
      studentUserAccessForm.querySelectorAll("[name='appPermissions']").forEach(input => {
        input.checked = permissions.includes(input.value);
      });
      studentUserAccessForm.querySelector("button[type='submit']").textContent = "Update Student User";
      setView("studentUserLogin");
      showToast(`${account.studentName || account.loginId} ready to edit.`);
    }
  }
  if (toggleStudentUser) {
    const index = Number(toggleStudentUser.dataset.toggleStudentUser);
    const account = studentUserAccounts[index];
    if (account) {
      account.status = account.status === "Active" ? "Disabled" : "Active";
      saveAppState();
      renderStudentUserLogin();
      showToast(`${account.studentName || account.loginId} ${account.status === "Active" ? "enabled" : "disabled"}.`);
    }
  }
  if (deleteStudentUser) {
    const index = Number(deleteStudentUser.dataset.deleteStudentUser);
    const account = studentUserAccounts[index];
    if (account && confirm(`Delete student login ${account.loginId}?`)) {
      studentUserAccounts.splice(index, 1);
      saveAppState();
      renderStudentUserLogin();
      resetStudentUserForm();
      showToast(`${account.loginId} student user deleted.`);
    }
  }
  if (deleteDesignation) {
    const index = Number(deleteDesignation.dataset.deleteDesignation);
    const designation = designations[index];
    if (designation && confirm(`Delete designation ${designation.name}?`)) {
      designations.splice(index, 1);
      saveAppState();
      renderHrSetup();
      showToast(`${designation.name} designation deleted.`);
    }
  }
  if (deleteTimetable) {
    const index = classTimetableEntries.findIndex(entry => entry.id === deleteTimetable.dataset.deleteTimetable);
    if (index >= 0 && confirm("Delete this timetable entry?")) {
      classTimetableEntries.splice(index, 1);
      const saved = saveAppState();
      renderClassTimetable();
      renderTimetableBuilderSavedEntries();
      renderTeacherTimetable();
      if (saved) showToast("Timetable entry deleted.");
    }
  }
  if (editClassSetup) {
    const index = Number(editClassSetup.dataset.editClassSetup);
    const className = customAdmissionClasses[index];
    if (className) {
      editingClassSetupIndex = index;
      classSetupForm.elements.className.value = className;
      classSetupForm.querySelector("button[type='submit']").textContent = "Update Class";
      setView("addClassSection");
      showToast(`${className} ready to edit.`);
    }
  }
  if (editSectionSetup) {
    const index = Number(editSectionSetup.dataset.editSectionSetup);
    const sectionName = customAdmissionSections[index];
    if (sectionName) {
      editingSectionSetupIndex = index;
      sectionSetupForm.elements.sectionName.value = sectionName;
      sectionSetupForm.querySelector("button[type='submit']").textContent = "Update Section";
      setView("addClassSection");
      showToast(`${sectionName} ready to edit.`);
    }
  }
  if (editSubjectSetup) {
    const index = Number(editSubjectSetup.dataset.editSubjectSetup);
    const subjectName = customSubjects[index];
    if (subjectName) {
      editingSubjectSetupIndex = index;
      subjectSetupForm.elements.subjectName.value = subjectName;
      subjectSetupForm.querySelector("button[type='submit']").textContent = "Update Subject";
      setClassSectionSetupPanel("subjectSetupPanel");
      setView("addClassSection");
      showToast(`${subjectName} ready to edit.`);
    }
  }
  if (editSubjectAssign) {
    const className = editSubjectAssign.dataset.editSubjectAssign;
    if (className) {
      setClassSectionSetupPanel("subjectAssignPanel");
      setView("addClassSection");
      renderSubjectAssignmentSetup(className);
      showToast(`${className} subject assignment ready to edit.`);
    }
  }
  if (deleteClassSetup) {
    const index = Number(deleteClassSetup.dataset.deleteClassSetup);
    const className = customAdmissionClasses[index];
    if (className && confirm(`Delete class ${className}?`)) {
      customAdmissionClasses.splice(index, 1);
      delete classSubjectAssignments[className];
      saveAppState();
      renderClassSectionSetup();
      renderAdmissionClassOptions();
      renderFeeMasterClassOptions();
      renderClassTimetableOptions();
      resetClassSetupEditing();
      renderClassTimetable();
      showToast(`${className} class deleted.`);
    }
  }
  if (deleteSectionSetup) {
    const index = Number(deleteSectionSetup.dataset.deleteSectionSetup);
    const sectionName = customAdmissionSections[index];
    if (sectionName && confirm(`Delete section ${sectionName}?`)) {
      customAdmissionSections.splice(index, 1);
      saveAppState();
      renderClassSectionSetup();
      renderAdmissionSectionOptions();
      resetSectionSetupEditing();
      showToast(`${sectionName} section deleted.`);
    }
  }
  if (deleteSubjectSetup) {
    const index = Number(deleteSubjectSetup.dataset.deleteSubjectSetup);
    const subjectName = customSubjects[index];
    if (subjectName && confirm(`Delete subject ${subjectName}?`)) {
      customSubjects.splice(index, 1);
      Object.keys(classSubjectAssignments).forEach(className => {
        classSubjectAssignments[className] = classSubjectAssignments[className].filter(subject => subject !== subjectName);
        if (!classSubjectAssignments[className].length) delete classSubjectAssignments[className];
      });
      saveAppState();
      renderClassSectionSetup();
      renderClassTimetableOptions();
      resetSubjectSetupEditing();
      showToast(`${subjectName} subject deleted.`);
    }
  }
  if (openStudentDetails) {
    const admissionNo = openStudentDetails.dataset.openStudentDetails;
    const student = findActiveStudentByAdmissionOrName(admissionNo);
    if (!student) {
      showToast("Student is disabled or not found.");
      return;
    }
    feeBookReturnStudentAdmissionNo = student.admissionNo || "";
    setView("students");
    renderStudents();
    focusReturnedStudentRow();
    showToast(`${student.name || admissionNo} opened in Student Details.`);
  }
  if (openFeeBook) {
    const admissionNo = openFeeBook.dataset.openFeeBook;
    const student = findActiveStudentByAdmissionOrName(admissionNo);
    if (!student) {
      showToast("Student is disabled or not found.");
      return;
    }
    const sourceView = document.querySelector(".view.active")?.id || "";
    feeBookReturnStudentAdmissionNo = sourceView === "students" ? student.admissionNo || "" : "";
    activeLedgerAdmissionNo = student.admissionNo || "";
    renderFeeBook(student.admissionNo);
    setView("feeBook");
    showToast(`${student ? student.name : admissionNo} fee book opened.`);
  }
  if (studentFees) {
    const admissionNo = studentFees.dataset.studentFees;
    const dueAmount = studentFees.dataset.dueAmount;
    const feeHead = studentFees.dataset.feeHead || "";
    const fineAmount = studentFees.dataset.fineAmount || 0;
    const feeMonth = studentFees.dataset.feeMonth || "";
    const student = findActiveStudentByAdmissionOrName(admissionNo);
    if (!student) {
      showToast("Student is disabled or not found.");
      return;
    }
    const sourceView = getSourceView(studentFees);
    if ((sourceView === "feeBook" || sourceView === "dueFeesSearch") && feeMonth) {
      openCombinedCollectionPopup(admissionNo, feeMonth, {
        includePriorTuitionDue: sourceView === "dueFeesSearch" && ["Tuition Fee", "Transport Fees"].includes(feeHead)
      });
      return;
    }
    if (feeHead && !feeMonth) {
      openSingleCollectionPopup(admissionNo, feeHead, dueAmount, fineAmount);
      return;
    }
    activeFeeReturnView = sourceView;
    renderStudentFeeCounter(admissionNo, dueAmount, feeHead, fineAmount, feeMonth);
    activeLedgerAdmissionNo = admissionNo;
    renderFeeBook(admissionNo);
    setView("finance");
    showToast(feeHead ? `${feeHead} due loaded for ${student ? student.name : admissionNo}.` : `${student ? student.name : admissionNo} fee counter opened.`);
  }
  if (paymentReceiptPreview) {
    openPaymentReceiptPreview(
      paymentReceiptPreview.dataset.previewPaymentReceipt,
      paymentReceiptPreview.dataset.feeHead || "",
      paymentReceiptPreview.dataset.receiptNo || ""
    );
  }
  if (savedReceiptPreview) {
    openSavedReceiptPreview(
      savedReceiptPreview.dataset.previewSavedReceipt,
      savedReceiptPreview.dataset.paymentReceipt || ""
    );
  }
  if (selectedPaymentPreview) {
    openSelectedPaymentPreview(
      selectedPaymentPreview.dataset.previewSelectedPayments,
      selectedPaymentPreview.dataset.feeHead || ""
    );
  }
  if (dailyCollectionDate) {
    toggleDailyCollectionDetails(decodeURIComponent(dailyCollectionDate.dataset.openDailyCollection || ""));
  }
  if (disableStudent) {
    openDisableReasonModal(disableStudent.dataset.disableStudent);
  }
  if (enableStudent) {
    const admissionNo = enableStudent.dataset.enableStudent;
    const student = findStudentByAdmissionNo(admissionNo);
    if (student && confirm(`Enable ${student.name}? This student will return to Student Details and fees lists.`)) {
      student.disabled = false;
      delete student.disabledAt;
      delete student.disabledReason;
      saveAppState();
      renderStudents();
      renderDisabledStudents();
      renderFeeBookStudentOptions();
      renderDueFeesSearch();
      renderStudentFeeCounter(student.admissionNo);
      renderStudentTransportFees();
      renderNonTransportStudents();
      renderTransportRoutePickupPoints();
      renderFinanceSession(false);
      renderDashboardOnly();
      renderFeeBook(student.admissionNo);
      setView("students");
      showToast(`${student.name} enabled.`);
    }
  }
  if (deleteStudent) {
    const admissionNo = deleteStudent.dataset.deleteStudent;
    const student = findStudentByAdmissionNo(admissionNo);
    if (student && confirm(`Delete ${student.name}?`)) {
      const index = students.findIndex(item => normalizeAdmissionNo(item.admissionNo) === normalizeAdmissionNo(admissionNo));
      if (index >= 0) students.splice(index, 1);
      studentUserAccounts.forEach(account => {
        if (normalizeAdmissionNo(account.admissionNo) === normalizeAdmissionNo(admissionNo)) {
          account.status = "Disabled";
          account.studentName = student.name || account.studentName;
        }
      });
      saveAppState();
  renderStudents();
  renderDisabledStudents();
  renderFeeBookStudentOptions();
  renderDueFeesSearch();
  renderStudentUserLogin();
  renderMobileAppActivity();
  renderStudentIdCardModule();
      renderStudentTransportFees();
      renderNonTransportStudents();
      renderTransportRoutePickupPoints();
      renderFeeBook();
      showToast(`${student.name} deleted.`);
    }
  }
  if (editFeeMaster) {
    const index = Number(editFeeMaster.dataset.editFeeMaster);
    const session = ensureActiveFinanceSessionData();
    const item = session.feeMaster[index];
    if (item) {
      editingFeeMasterIndex = index;
      feeMasterForm.elements.className.value = item.className;
      feeMasterForm.elements.studentType.value = item.studentType;
      feeMasterForm.elements.admissionFee.value = item.admissionFee;
      feeMasterForm.elements.annualFee.value = item.annualFee;
      feeMasterForm.elements.formFee.value = item.formFee;
      feeMasterForm.elements.monthlyTuitionFee.value = item.monthlyTuitionFee;
      feeMasterForm.elements.dayBoardingFee.value = item.dayBoardingFee || "";
      feeMasterForm.elements.tiffinLunchOtherServiceFee.value = item.tiffinLunchOtherServiceFee || "";
      feeMasterForm.elements.aiRoboticsFee.value = item.aiRoboticsFee || "";
      renderFeeMasterDynamicFields(item.customFees || {});
      feeMasterForm.querySelector("button[type='submit']").textContent = "Update Fee Structure";
      setView("feeMaster");
      showToast(`${item.className} ${item.studentType} ready to edit.`);
    }
  }
  if (deleteFeeMaster) {
    const index = Number(deleteFeeMaster.dataset.deleteFeeMaster);
    const session = ensureActiveFinanceSessionData();
    const item = session.feeMaster[index];
    if (item && confirm(`Delete ${item.className} ${item.studentType}?`)) {
      session.feeMaster.splice(index, 1);
      resetFeeMasterEditing();
      feeMasterForm.reset();
      renderFeeMaster();
      saveAppState();
      showToast(`${item.className} ${item.studentType} deleted.`);
    }
  }
  if (editFeeGroup) {
    const index = Number(editFeeGroup.dataset.editFeeGroup);
    const session = ensureActiveFinanceSessionData();
    const item = session.feeGroups[index];
    if (item) {
      editingFeeGroupIndex = index;
      feeGroupForm.elements.groupName.value = item.groupName;
      feeGroupForm.elements.category.value = item.category;
      feeGroupForm.elements.description.value = item.description;
      feeGroupForm.querySelector("button[type='submit']").textContent = "Update Fee Group";
      showToast(`${item.groupName} ready to edit.`);
    }
  }
  if (deleteFeeGroup) {
    const index = Number(deleteFeeGroup.dataset.deleteFeeGroup);
    const session = ensureActiveFinanceSessionData();
    const item = session.feeGroups[index];
    if (item && confirm(`Delete ${item.groupName}?`)) {
      session.feeGroups.splice(index, 1);
      resetFeeGroupEditing();
      feeGroupForm.reset();
      renderFeeGroups();
      renderFeeMasterDynamicFields();
      renderFeeMaster();
      saveAppState();
      showToast(`${item.groupName} deleted.`);
    }
  }
  if (editPayment) {
    openPaymentEdit(editPayment.dataset.editPayment, editPayment.dataset.paymentReceipt);
  }
  if (deletePayment) {
    const admissionNo = deletePayment.dataset.deletePayment;
    const receiptNo = deletePayment.dataset.paymentReceipt;
    if (receiptNo && confirm(`Delete receipt ${receiptNo}?`)) {
      const removed = deletePaymentReceiptEverywhere(admissionNo, receiptNo, deletePayment.dataset.paymentId || "");
      if (removed || receiptNo) {
        renderStudentFeeCounter(admissionNo);
        renderFeeBook(admissionNo);
        renderDueFeesSearch();
        renderFinanceSession();
        if (saveAppState()) {
          flushPaymentDeleteSave()
            .then(() => showToast(`Receipt ${receiptNo} deleted and synced.`))
            .catch(error => {
              console.warn("Payment delete sync failed.", error);
              showToast(`Receipt ${receiptNo} deleted locally. Server sync will retry automatically.`, "warning", 6000);
            });
        }
      }
    }
  }
  if (module) showToast(`${module.dataset.module} module opened.`);
});

loadAppState();
applyProductionCleanSeedOnce();
setNextReceiptNo();
renderDashboardOnly();
if (complaintRegisterForm) complaintRegisterForm.elements.date.value = toDateInputValue(new Date());
if (teacherComplaintForm) teacherComplaintForm.elements.date.value = toDateInputValue(new Date());
renderStaffTeachingSubjectField();
renderStaffBiometricDevice();
setNextStaffId();
renderStaffPhotoPreview();
renderAdmissionVillageTownOptions();
renderAdmissionSectionOptions();
renderFeeMasterClassOptions();
setTopbarNetworkStatus();
document.addEventListener("submit", blockOfflineWriteAction, true);
if (localStorage.getItem(BACKEND_TOKEN_KEY)) {
  initializeBackendSync();
} else {
  showLoginOverlay();
}
document.addEventListener("visibilitychange", () => {
  if (!document.hidden) pullBackendStateIfChanged(true);
});
window.addEventListener("focus", () => pullBackendStateIfChanged(true));
window.addEventListener("online", () => {
  setTopbarNetworkStatus("checking");
  initializeBackendSync();
});
window.addEventListener("offline", () => setTopbarNetworkStatus("offline"));
if (localStorage.getItem(BACKEND_LOGGED_OUT_KEY) === "1") showLoginOverlay();
