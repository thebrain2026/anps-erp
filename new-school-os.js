const students = [];

const attendance = [];

const tasks = [];

const learning = [];

const modules = [];

const dues = [];

const notices = [];
const admissionEnquiries = [];
const complaintRecords = [];

const staffMembers = [];
const departments = [];
const roles = [];
const designations = [];
const userAccessAccounts = [];
const studentUserAccounts = [];
const rolePermissions = {};
const staffAttendanceRecords = [];
const classTimetableEntries = [];
const syllabusEntries = [];
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
let activeFeeStudentAdmissionNo = "";
let activeLedgerAdmissionNo = "";
let activeFeeReturnView = "finance";
const collectedPayments = {};
const selectedHistoryPayments = new Set();
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
const BACKEND_API_BASE = (
  document.querySelector('meta[name="school-api-base"]')?.content ||
  localStorage.getItem("school_api_base") ||
  window.SCHOOL_API_BASE ||
  ""
).replace(/\/$/, "");
let backendSaveTimer = null;
let backendAutoSyncTimer = null;
let backendSyncReady = false;
let backendHydrating = false;
let backendLastUpdatedAt = "";
let backendLastLocalSaveAt = 0;
const BACKEND_AUTO_SYNC_INTERVAL_MS = 12000;
const ACADEMIC_MONTHS = ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar"];
const DEFAULT_ADMISSION_CLASSES = ["Nursery", "Class I", "Class II", "Class III", "Class IV", "Class V", "Class VI", "Class VII", "Class VIII", "Class IX", "Class X", "Class XI", "Class XII"];
const DEFAULT_ADMISSION_SECTIONS = ["Amber", "Ruby", "A", "B", "C", "IGCSE", "IB", "Science", "Commerce"];
const DEFAULT_SUBJECTS = ["Mathematics", "Science", "English", "Bengali", "Hindi", "History", "Geography", "Computer", "Physical Education"];
const DEFAULT_STAFF_DESIGNATIONS = ["Principal", "Counsellor", "Academic Coordinator", "Account", "Assistant Account", "Receptionist", "Admin Coordinator", "Teacher"];
const DEFAULT_STUDENT_TYPES = ["New Student", "Promoted Student"];
const TRANSPORT_SCHOOL_MAP_QUERY = "Alfred Nobel Public School, Bhatar, Purba Bardhaman, West Bengal";
const DEFAULT_TUITION_FINE_SETUP = {
  dailyRate: 5,
  nextMonth: 75,
  secondMonth: 100,
  laterMonth: 150
};
const DEFAULT_TRANSPORT_FINE_SETUP = {
  sameMonth: 120,
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
const tuitionFineSetup = {...DEFAULT_TUITION_FINE_SETUP};
const transportFineSetup = {...DEFAULT_TRANSPORT_FINE_SETUP};
const customAdmissionClasses = [];
const customAdmissionSections = [];
const customSubjects = [];
const classSubjectAssignments = {};

const titleMap = {
  dashboard: "Dashboard",
  admissionEnquiry: "Admission Enquiry",
  complaintRegister: "Complaint Register",
  complaintsDesk: "Complaint Book",
  students: "Student Details",
  studentAdmission: "Student Admission",
  disableStudent: "Disable Student",
  bulkDeleteStudent: "Bulk Delete",
  finance: "Collect Fees",
  feeBook: "Fee Book",
  dueFeesSearch: "Search Due Fees",
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
  department: "HR Setup",
  designation: "Designation",
  disabledStaff: "Disabled Staff",
  noticeBoard: "Notice Board",
  sendSms: "WhatsApp Message",
  addHomework: "Add Homework",
  dailyAssignment: "Daily Assignment",
  reportStudentInformation: "Student Information Report",
  dailyCollectionReport: "Daily Collection Report",
  entireSchoolFeesReport: "Entire School Fees",
  classTimetable: "Class Timetable",
  teacherTimetable: "Teachers Time Table",
  syllabus: "Syllabus",
  teacherComplaint: "Teacher Complaint",
  holidayReport: "Holiday Report",
  annualCalendar: "Annual Calendar",
  learning: "Learning",
  studentIdCard: "Student ID Card",
  teacherIdCard: "Teachers ID Card",
  userAccessSettings: "User Access & Permissions",
  studentUserLogin: "Student User Login",
  securityMaintenance: "Security Maintenance",
  transportFeesMaster: "Transport Fees Master",
  transportFineSetup: "Transport Fine Setup",
  transportPickupPoint: "Pickup Point",
  transportRoute: "Route",
  transportVehicle: "Vehicle",
  transportAssignVehicle: "Assign Vehicle",
  transportRoutePickupPoint: "Route Pickup Point",
  studentTransportFees: "Student Transport Fees"
};

const ACCESS_PERMISSION_MODULES = Object.keys(titleMap);

const ACCESS_ACTIONS = ["view", "add", "edit", "delete", "print"];

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
const sessionSelect = document.getElementById("sessionSelect");
const newSessionInput = document.getElementById("newSessionInput");
const feeMasterForm = document.getElementById("feeMasterForm");
const feeGroupForm = document.getElementById("feeGroupForm");
const classSetupForm = document.getElementById("classSetupForm");
const sectionSetupForm = document.getElementById("sectionSetupForm");
const subjectSetupForm = document.getElementById("subjectSetupForm");
const subjectAssignForm = document.getElementById("subjectAssignForm");
const admissionEnquiryForm = document.getElementById("admissionEnquiryForm");
const complaintRegisterForm = document.getElementById("complaintRegisterForm");
const teacherComplaintForm = document.getElementById("teacherComplaintForm");
const noticeForm = document.getElementById("noticeForm");
const staffDetailsForm = document.getElementById("staffDetailsForm");
const departmentForm = document.getElementById("departmentForm");
const roleForm = document.getElementById("roleForm");
const designationForm = document.getElementById("designationForm");
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
let editingHolidayIndex = -1;

function getAppStateSnapshot() {
  return {
    students,
    financeSessions,
    activeSession,
    collectedPayments,
    receiptSerial,
    notices,
    admissionEnquiries,
    complaintRecords,
    staffMembers,
    departments,
    roles,
    designations,
    userAccessAccounts,
    studentUserAccounts,
    rolePermissions,
    staffAttendanceRecords,
    classTimetableEntries,
    syllabusEntries,
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

function storePendingBackendSnapshot(snapshot = getAppStateSnapshot()) {
  try {
    localStorage.setItem(BACKEND_PENDING_STATE_KEY, JSON.stringify({
      savedAt: new Date().toISOString(),
      state: snapshot
    }));
  } catch (error) {
    console.warn("Could not store pending backend snapshot.", error);
  }
}

async function flushPendingBackendSnapshot() {
  const raw = localStorage.getItem(BACKEND_PENDING_STATE_KEY);
  if (!raw) return false;
  try {
    const pending = JSON.parse(raw);
    const snapshot = pending?.state;
    if (!snapshot || typeof snapshot !== "object") {
      localStorage.removeItem(BACKEND_PENDING_STATE_KEY);
      return false;
    }
    const hasToken = await ensureBackendToken();
    if (!hasToken) return false;
    setTopbarSaveStatus("saving");
    const response = await fetch(backendApiUrl("/api/state"), {
      method: "PUT",
      headers: backendHeaders({"Content-Type": "application/json"}),
      body: JSON.stringify({state: snapshot})
    });
    if (!response.ok) throw new Error(`Pending backend save failed ${response.status}`);
    const result = await response.json().catch(() => ({}));
    if (result?.updated_at) backendLastUpdatedAt = result.updated_at;
    backendLastLocalSaveAt = Date.now();
    localStorage.removeItem(BACKEND_PENDING_STATE_KEY);
    setTopbarSaveStatus("saved");
    setTopbarNetworkStatus("online");
    return true;
  } catch (error) {
    setTopbarNetworkStatus("offline");
    console.warn("Pending backend save still waiting.", error);
    return false;
  }
}

async function ensureBackendToken() {
  if (localStorage.getItem(BACKEND_TOKEN_KEY) && getLoggedInBackendUser()) {
    try {
      const response = await fetch(backendApiUrl(`/api/session?v=${Date.now()}`), {
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
      return true;
    }
  }
  if (localStorage.getItem(BACKEND_TOKEN_KEY) && !getLoggedInBackendUser()) {
    localStorage.removeItem(BACKEND_TOKEN_KEY);
  }
  if (localStorage.getItem(BACKEND_LOGGED_OUT_KEY) === "1") return false;
  return false;
}

function queueBackendSave(snapshot = getAppStateSnapshot()) {
  if (backendHydrating) return;
  if (!backendSyncReady) {
    storePendingBackendSnapshot(snapshot);
    setTopbarNetworkStatus("offline");
    return;
  }
  clearTimeout(backendSaveTimer);
  backendSaveTimer = setTimeout(async () => {
    try {
      setTopbarSaveStatus("saving");
      const hasToken = await ensureBackendToken();
      if (!hasToken) {
        storePendingBackendSnapshot(snapshot);
        setTopbarSaveStatus("saved");
        return;
      }
      const response = await fetch(backendApiUrl("/api/state"), {
        method: "PUT",
        headers: backendHeaders({"Content-Type": "application/json"}),
        body: JSON.stringify({state: snapshot})
      });
      if (!response.ok) throw new Error(`Backend save failed ${response.status}`);
      const result = await response.json().catch(() => ({}));
      if (result?.updated_at) backendLastUpdatedAt = result.updated_at;
      backendLastLocalSaveAt = Date.now();
      localStorage.removeItem(BACKEND_PENDING_STATE_KEY);
      setTopbarSaveStatus("saved");
    } catch (error) {
      storePendingBackendSnapshot(snapshot);
      setTopbarNetworkStatus("offline");
      console.warn("Backend sync pending.", error);
      setTopbarSaveStatus("saved");
    }
  }, 700);
}

function saveAppState() {
  try {
    setTopbarSaveStatus("saving");
    normalizeStudentUserLoginIds();
    const snapshot = getAppStateSnapshot();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
    setTopbarSaveStatus("saved");
    updateTopbarSystemStatus();
    queueBackendSave(snapshot);
  } catch (error) {
    console.warn("Could not save school data.", error);
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
      Object.assign(collectedPayments, saved.collectedPayments);
    }
    if (Number(saved.receiptSerial) > 0) {
      receiptSerial = Number(saved.receiptSerial);
    }
    if (Array.isArray(saved.notices)) {
      notices.splice(0, notices.length, ...saved.notices);
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
    if (saved.rolePermissions && typeof saved.rolePermissions === "object") {
      Object.keys(rolePermissions).forEach(role => delete rolePermissions[role]);
      Object.assign(rolePermissions, saved.rolePermissions);
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
    if (!designations.length) {
      const staffDesignations = [...new Set(staffMembers.map(staff => String(staff.designation || "").trim()).filter(Boolean))];
      designations.push(...staffDesignations.map(name => ({name, department: "", level: ""})));
    }
    designations.sort((a, b) => String(a.name || "").localeCompare(String(b.name || "")));
    if (Array.isArray(saved.staffAttendanceRecords)) {
      staffAttendanceRecords.splice(0, staffAttendanceRecords.length, ...saved.staffAttendanceRecords);
    }
    if (Array.isArray(saved.classTimetableEntries)) {
      classTimetableEntries.splice(0, classTimetableEntries.length, ...saved.classTimetableEntries);
    }
    if (Array.isArray(saved.syllabusEntries)) {
      syllabusEntries.splice(0, syllabusEntries.length, ...saved.syllabusEntries);
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
    dedupeTransportVillages();
  } catch (error) {
    console.warn("Could not load saved school data.", error);
  }
}

function loadAppState() {
  try {
    applySavedState(JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}"));
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
  admissionEnquiries.splice(0, admissionEnquiries.length);
  complaintRecords.splice(0, complaintRecords.length);
  staffMembers.splice(0, staffMembers.length);
  departments.splice(0, departments.length);
  roles.splice(0, roles.length);
  designations.splice(0, designations.length);
  userAccessAccounts.splice(0, userAccessAccounts.length);
  studentUserAccounts.splice(0, studentUserAccounts.length);
  staffAttendanceRecords.splice(0, staffAttendanceRecords.length);
  classTimetableEntries.splice(0, classTimetableEntries.length);
  syllabusEntries.splice(0, syllabusEntries.length);
  holidayReports.splice(0, holidayReports.length);
  transportRoutes.splice(0, transportRoutes.length);
  transportVehicles.splice(0, transportVehicles.length);
  transportVehicleAssignments.splice(0, transportVehicleAssignments.length);
  transportRoutePickupPoints.splice(0, transportRoutePickupPoints.length);
  selectedHistoryPayments.clear();
  Object.keys(collectedPayments).forEach(session => delete collectedPayments[session]);
  Object.keys(rolePermissions).forEach(role => delete rolePermissions[role]);
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
  designations.sort((a, b) => String(a.name || "").localeCompare(String(b.name || "")));
  localStorage.setItem(PRODUCTION_CLEAN_KEY, PRODUCTION_CLEAN_VERSION);
  saveAppState();
}

function getNextReceiptNo() {
  const receiptYear = String(activeSession || new Date().getFullYear()).split("-")[0] || String(new Date().getFullYear());
  return `ANPS/${receiptYear}-${String(receiptSerial).padStart(3, "0")}`;
}

function setNextReceiptNo() {
  const receiptInput = document.querySelector("#feeForm [name='receiptNo']");
  if (receiptInput) receiptInput.value = getNextReceiptNo();
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 2400);
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
        <input name="password" type="password" autocomplete="current-password" required />
      </label>
      <p id="loginOverlayError" class="login-error"></p>
      <button type="submit">Login</button>
    </form>
  `;
  document.body.appendChild(overlay);
  overlay.querySelector("form").addEventListener("submit", async event => {
    event.preventDefault();
    const form = event.currentTarget;
    const error = overlay.querySelector("#loginOverlayError");
    error.textContent = "";
    const username = String(form.elements.username.value || "").trim();
    const password = String(form.elements.password.value || "");
    try {
      const response = await fetch(backendApiUrl("/api/login"), {
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

function getCurrentTopbarRole() {
  const user = getLoggedInBackendUser();
  return user?.role_name || user?.role || "Not Logged In";
}

function getCurrentCollectorRoleName() {
  return getCurrentTopbarRole() || "Admin";
}

function isCurrentRoleAdmin() {
  return /admin|administrator|principal/i.test(getCurrentTopbarRole());
}

function canCurrentRoleAccessView(viewName = "") {
  if (!viewName || viewName === "dashboard" || isCurrentRoleAdmin()) return true;
  const permissions = normalizeRolePermission(getCurrentTopbarRole());
  return permissions?.[viewName]?.view !== false;
}

function updateRoleBasedNavigation() {
  navButtons.forEach(button => {
    const viewName = button.dataset.view;
    const isAllowed = canCurrentRoleAccessView(viewName);
    button.hidden = !isAllowed;
    button.disabled = !isAllowed;
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
  node.classList.toggle("online", status === "online");
  node.classList.toggle("offline", status === "offline");
  node.classList.toggle("checking", status === "checking");
  if (label) label.textContent = status === "online" ? "Online" : status === "checking" ? "Checking" : "Offline";
  node.title = status === "online"
    ? "Software is online and connected to server."
    : status === "checking"
      ? "Checking server connection..."
      : "Software is offline or server connection is unavailable.";
}

function updateTopbarSystemStatus() {
  const role = document.getElementById("topbarCurrentRole");
  const alerts = document.getElementById("topbarAlerts");
  if (role) role.textContent = getCurrentTopbarRole();
  updateRoleBasedNavigation();
  if (alerts) {
    const report = typeof getSystemHealthReport === "function" ? getSystemHealthReport() : {issues: []};
    const issues = report.issues || [];
    alerts.textContent = `Alerts: ${issues.length}`;
    alerts.classList.toggle("has-alerts", issues.length > 0);
    alerts.title = issues.length ? issues.map(issue => `${issue.type}: ${issue.title}`).join("\n") : "No current system health alert.";
  }
}

function setView(viewName) {
  if (!canCurrentRoleAccessView(viewName)) {
    showToast(`${getCurrentTopbarRole()} role does not have access to ${titleMap[viewName] || viewName}.`);
    return;
  }
  views.forEach(view => view.classList.toggle("active", view.id === viewName));
  navButtons.forEach(button => button.classList.toggle("active", button.dataset.view === viewName));
  pageTitle.textContent = titleMap[viewName] || "Dashboard";
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
  if (viewName === "userAccessSettings") {
    renderUserAccessSettings();
  }
  if (viewName === "studentUserLogin") {
    renderStudentUserLogin();
  }
  if (viewName === "securityMaintenance") {
    renderSecurityMaintenance();
  }
  if (viewName === "studentTransportFees") {
    renderStudentTransportFees();
  }
  document.body.classList.remove("nav-open");
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

function openAdmissionForm() {
  editingAdmissionNo = "";
  admissionForm.reset();
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

function openStudentEditForm(admissionNo) {
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
  admissionForm.elements.route.value = student.route || "Self";
  admissionForm.elements.transportRequired.checked = Boolean(student.transportRequired);
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
  admissionForm.elements.transportRequired.checked = Boolean(student.transportRequired || (student.otherServices || []).includes("Transport"));
  syncTransportServiceCheckbox(admissionForm.elements.transportRequired.checked);
  syncExclusiveTransportServices((student.otherServices || []).includes("Special/Custom") ? "Special/Custom" : "Transport");
  updateAdmissionTransportFee();
  currentAdmissionPhoto = student.photo || "";
  renderAdmissionPhotoPreview();
  setAdmissionMonthGroups(student);
  admissionModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  setTimeout(() => admissionForm.elements.studentName.focus(), 0);
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
  return findActiveStudentByAdmissionNo(clean) || getActiveStudents().find(student => String(student.name || "").trim() === clean) || null;
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
  (financeSessions[activeSession]?.feeMaster || []).forEach(item => {
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
  const sessionTypes = [...new Set((financeSessions[activeSession]?.feeMaster || [])
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

function splitStudentClassSection(klassText = "") {
  const text = String(klassText || "").trim();
  const classOptions = getAdmissionClassOptions().slice().sort((a, b) => b.length - a.length);
  const matchedClass = classOptions.find(className => text === className || text.startsWith(`${className} `));
  if (matchedClass) {
    return {klass: matchedClass, section: text.slice(matchedClass.length).trim()};
  }
  const [klass, ...sectionParts] = text.split(" ");
  return {klass: klass || "", section: sectionParts.join(" ") || ""};
}

function getFeeMasterForClass(className = "", studentType = admissionForm.elements.studentType?.value || "New Student") {
  const cleanClass = String(className || "").trim();
  if (!cleanClass) return null;
  const cleanType = String(studentType || "New Student").trim();
  const matches = (financeSessions[activeSession]?.feeMaster || []).filter(item => item.className === cleanClass);
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

function renderStudents() {
  const query = document.getElementById("globalSearch").value.trim().toLowerCase();
  renderStudentClassFilter();
  const selectedClass = String(document.getElementById("studentClassFilter")?.value || "").trim();
  const filtered = getActiveStudents().filter(student => {
    const matchesSearch = Object.values(student).join(" ").toLowerCase().includes(query);
    const {klass} = splitStudentClassSection(student.klass || "");
    const matchesClass = !selectedClass || klass === selectedClass;
    return matchesSearch && matchesClass;
  });

  document.getElementById("studentTable").innerHTML = filtered.map(student => `
    ${(() => {
      const classInfo = splitStudentClassSection(student.klass || "");
      const admissionAttr = escapeHtml(student.admissionNo || "");
      return `
    <tr>
      <td>${escapeHtml(student.admissionNo || "-")}</td>
      <td><button class="student-name-link" type="button" data-open-admission-preview="${admissionAttr}"><strong>${escapeHtml(student.name || "-")}</strong></button></td>
      <td>${escapeHtml(classInfo.klass || "-")}</td>
      <td>${escapeHtml(classInfo.section || "-")}</td>
      <td>${escapeHtml(student.guardian || "-")}</td>
      <td>${escapeHtml(student.mobile || "-")}</td>
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
          bank: 0,
          cash: 0,
          fine: 0,
          total: 0
        });
      }
      const row = dailyMap.get(dateLabel);
      const allocations = Array.isArray(payment.allocations) ? payment.allocations : [];
      const total = allocations.length
        ? allocations.reduce((sum, allocation) => sum + Number(allocation.amount || 0), 0)
        : Number(payment.amount || 0);
      const split = getPaymentSplitForAmount(payment, total);
      const fine = allocations
        .filter(allocation => ["Tuition Late Fine", "Transport Late Fine"].includes(allocation.head))
        .reduce((sum, allocation) => sum + Number(allocation.amount || 0), 0);
      row.receipts.add(payment.receipt || "-");
      row.students.add(student?.name || admissionNo || "-");
      row.bank += split.bank;
      row.cash += split.cash;
      row.fine += fine;
      row.total += total;
    });
  });
  return [...dailyMap.values()].sort((a, b) => parseDateDDMMYYYY(b.date) - parseDateDDMMYYYY(a.date));
}

function renderDailyCollectionReport() {
  const summary = document.getElementById("dailyCollectionSummary");
  const rows = document.getElementById("dailyCollectionReportRows");
  if (!summary || !rows) return;
  const reportRows = getDailyCollectionReportRows();
  const totals = reportRows.reduce((sum, row) => {
    sum.bank += row.bank;
    sum.cash += row.cash;
    sum.fine += row.fine;
    sum.total += row.total;
    sum.receipts += row.receipts.size;
    return sum;
  }, {bank: 0, cash: 0, fine: 0, total: 0, receipts: 0});
  summary.innerHTML = `
    <article><span>Total Days</span><strong>${reportRows.length}</strong></article>
    <article><span>Total Collection</span><strong>${formatRs(totals.total)}</strong></article>
    <article><span>Bank</span><strong>${formatRs(totals.bank)}</strong></article>
    <article><span>Cash</span><strong>${formatRs(totals.cash)}</strong></article>
    <article><span>Fine</span><strong>${formatRs(totals.fine)}</strong></article>
    <article><span>Receipts</span><strong>${totals.receipts}</strong></article>
  `;
  rows.innerHTML = reportRows.map(row => `
    <tr>
      <td><strong>${escapeHtml(row.date)}</strong></td>
      <td>${row.receipts.size}</td>
      <td>${row.students.size}</td>
      <td>${formatRs(row.bank)}</td>
      <td>${formatRs(row.cash)}</td>
      <td>${formatRs(row.fine)}</td>
      <td><strong>${formatRs(row.total)}</strong></td>
    </tr>
  `).join("") || `<tr><td colspan="7">No daily collection found yet.</td></tr>`;
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

function createTimetableBuilderRow() {
  return {id: `tt-row-${Date.now()}-${Math.random().toString(16).slice(2)}`, subject: "", teacher: "", startTime: "", endTime: "", room: ""};
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
      <input name="rowStartTime" type="time" value="${escapeHtml(row.startTime)}" required />
      <input name="rowEndTime" type="time" value="${escapeHtml(row.endTime)}" required />
      <input name="rowRoom" value="${escapeHtml(row.room)}" placeholder="Room" />
      <button class="icon-action delete" type="button" data-delete-timetable-row="${escapeHtml(row.id)}" ${timetableBuilderRows.length === 1 ? "disabled" : ""} title="Delete row" aria-label="Delete row ${index + 1}">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 21c-.6 0-1.1-.2-1.5-.6S5 19.5 5 19V8H4V6h5V4h6v2h5v2h-1v11c0 .6-.2 1.1-.6 1.5s-.9.6-1.5.6H7ZM17 8H7v11h10V8Zm-8 9h2v-7H9v7Zm4 0h2v-7h-2v7Z"/></svg>
      </button>
    </div>
  `).join("");
  renderTimetableIntervalOptions();
}

function renderTimetableIntervalOptions() {
  const select = document.getElementById("intervalAfterPeriod");
  const list = document.getElementById("timetableIntervalList");
  if (!select) return;
  const selected = select.value;
  select.innerHTML = `<option value="">No interval</option>${timetableBuilderRows.map((row, index) => `<option value="${index + 1}">After Period ${index + 1}</option>`).join("")}`;
  if (selected && [...select.options].some(option => option.value === selected)) {
    select.value = selected;
  }
  Object.keys(timetableIntervalMap).forEach(period => {
    if (Number(period) > timetableBuilderRows.length) delete timetableIntervalMap[period];
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

function applySelectedTimetableInterval() {
  const period = Number(classTimetableForm.elements.intervalAfterPeriod?.value || 0);
  const minutes = Number(classTimetableForm.elements.periodInterval?.value || 0);
  if (!period || minutes <= 0) {
    showToast("Interval period and time required.");
    return;
  }
  timetableIntervalMap[period] = minutes;
  if (applyTimetableQuickParameters()) {
    showToast(`After Period ${period}, ${minutes} minute interval applied.`);
  }
}

function applyTimetableQuickParameters() {
  syncTimetableBuilderRowsFromDom();
  const startTime = classTimetableForm.elements.periodStartTime?.value || "";
  const duration = Number(classTimetableForm.elements.periodDuration?.value || 0);
  const room = classTimetableForm.elements.quickRoom?.value || "";
  if (!startTime || duration <= 0) {
    showToast("Period start time and duration required.");
    renderTimetableIntervalOptions();
    return false;
  }
  let cursor = startTime;
  timetableBuilderRows = timetableBuilderRows.map((row, index) => {
    const endTime = getTimeAfterMinutes(cursor, duration);
    const updated = {...row, startTime: cursor, endTime, room: room || row.room};
    cursor = getTimeAfterMinutes(endTime, Number(timetableIntervalMap[index + 1] || 0));
    return updated;
  });
  renderTimetableBuilderRows();
  return true;
}

function loadTimetableBuilderForSelection() {
  const className = String(classTimetableForm.elements.className?.value || "").trim();
  const sectionName = String(classTimetableForm.elements.sectionName?.value || "").trim();
  const day = String(classTimetableForm.elements.day?.value || activeTimetableDay || "Monday");
  if (!className || !sectionName || !day) {
    renderTimetableBuilderRows();
    return;
  }
  const classSection = `${className} ${sectionName}`.trim();
  const existingEntries = classTimetableEntries
    .filter(entry => entry.classSection === classSection && entry.day === day)
    .sort((a, b) => Number(a.period || 0) - Number(b.period || 0));
  if (!existingEntries.length) {
    renderTimetableBuilderRows();
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
}

function renderClassTimetable() {
  const board = document.getElementById("classTimetableRows");
  if (!board) return;
  renderClassTimetableOptions();
  const classFilter = document.getElementById("classTimetableClassFilter")?.value || "";
  const sectionFilter = document.getElementById("classTimetableSectionFilter")?.value || "";
  const visibleEntries = classTimetableEntries
    .filter(entry => !classFilter || entry.className === classFilter)
    .filter(entry => !sectionFilter || entry.sectionName === sectionFilter)
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
  renderTransportRoutePickupPoints();
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

function renderModules() {
  document.getElementById("moduleStatus").innerHTML = modules.map(([name, detail, status]) => `
    <article>
      <div>
        <strong>${name}</strong>
        <small>${detail}</small>
      </div>
      <span class="status-pill ${status.toLowerCase()}">${status}</span>
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

function renderComplaintsDesk() {
  const typeFilter = document.getElementById("complaintTypeFilter")?.value || "All";
  const statusFilter = document.getElementById("complaintStatusFilter")?.value || "All";
  const rows = document.getElementById("complaintsDeskRows");
  const summary = document.getElementById("complaintsDeskSummary");
  const filtered = complaintRecords.filter(item =>
    (typeFilter === "All" || item.forType === typeFilter) &&
    (statusFilter === "All" || item.status === statusFilter)
  );
  if (summary) summary.textContent = `${filtered.length} of ${complaintRecords.length} complaints showing.`;
  if (!rows) return;
  rows.innerHTML = filtered.map((item) => {
    const index = complaintRecords.indexOf(item);
    return `
      <tr>
        <td>${formatDateDDMMYYYY(item.date)}</td>
        <td><span class="badge ${item.forType === "Teacher" ? "amber" : item.forType === "Student" ? "green" : "blue"}">${escapeHtml(item.forType || "-")}</span></td>
        <td><strong>${escapeHtml(item.personName || "-")}</strong><br><small>${escapeHtml(item.mobile || item.classSection || "")}</small></td>
        <td>${escapeHtml(item.category || "-")}</td>
        <td>${escapeHtml(item.priority || "Normal")}</td>
        <td>${escapeHtml(item.details || "-")}</td>
        <td><span class="badge ${item.status === "Resolved" || item.status === "Closed" ? "green" : item.priority === "Urgent" ? "red" : "amber"}">${escapeHtml(item.status || "Open")}</span></td>
        <td>${escapeHtml(item.source || "Front Office")}</td>
        <td>
          <button class="icon-action edit" type="button" data-edit-complaint="${index}" title="Edit complaint" aria-label="Edit complaint">✎</button>
          <button class="icon-action delete" type="button" data-delete-complaint="${index}" title="Delete complaint" aria-label="Delete complaint">×</button>
        </td>
      </tr>
    `;
  }).join("") || `<tr><td colspan="9">No complaint found.</td></tr>`;
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
  const session = financeSessions[activeSession];
  document.getElementById("dueTable").innerHTML = session.dues.map(([name, klass, due, status]) => `
    <tr>
      <td><strong>${name}</strong></td>
      <td>${klass}</td>
      <td>${due}</td>
      <td><span class="badge ${["Overdue"].includes(status) ? "red" : status === "Closed" ? "green" : "amber"}">${status}</span></td>
    </tr>
  `).join("") || `<tr><td colspan="4">No dues recorded for this session.</td></tr>`;
}

function renderNoticeBoard() {
  const rows = document.getElementById("noticeRows");
  const preview = document.getElementById("noticeAppPreview");
  if (!rows) return;
  rows.innerHTML = notices.map(notice => `
    <tr>
      <td><strong>${escapeHtml(notice.title)}</strong><br><small>${escapeHtml(notice.message)}</small></td>
      <td>${escapeHtml(notice.audience)}</td>
      <td>${escapeHtml(notice.noticeClass || "All Classes")}</td>
      <td>${escapeHtml(notice.publishDate)}</td>
      <td><span class="badge ${notice.priority === "Urgent" ? "red" : notice.priority === "Important" ? "amber" : "blue"}">${escapeHtml(notice.priority)}</span></td>
      <td><span class="status-pill stable">Published</span></td>
    </tr>
  `).join("") || `<tr><td colspan="6">No notices entered yet.</td></tr>`;
  if (preview) {
    const latest = notices[0];
    preview.innerHTML = latest ? `
      <span>${escapeHtml(latest.audience)}${latest.noticeClass ? ` | ${escapeHtml(latest.noticeClass)}` : ""}</span>
      <strong>${escapeHtml(latest.title)}</strong>
      <p>${escapeHtml(latest.message)}</p>
      <small>${escapeHtml(latest.publishDate)} | ${escapeHtml(latest.delivery)}</small>
    ` : `
      <strong>No notice published yet.</strong>
      <p>Published notices will be available for student IDs and teacher accounts when the mobile app is connected.</p>
    `;
  }
}

function renderStaffDetails() {
  const rows = document.getElementById("staffDetailsRows");
  const summary = document.getElementById("staffSummary");
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
      <td>${escapeHtml(staff.designation || "-")}${isTeacherDesignation(staff.designation) && staff.teachingSubject ? `<br><small>Subject: ${escapeHtml(staff.teachingSubject)}</small>` : ""}</td>
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
  const staffRoleSelect = staffDetailsForm ? staffDetailsForm.elements.role : null;
  const staffDepartmentSelect = staffDetailsForm ? staffDetailsForm.elements.department : null;
  const staffDesignationSelect = staffDetailsForm ? staffDetailsForm.elements.designation : null;
  const designationDepartmentSelect = designationForm ? designationForm.elements.department : null;

  if (staffRoleSelect) {
    const currentValue = staffRoleSelect.value;
    staffRoleSelect.innerHTML = `<option value="">Select Role</option>` + roles
      .map(role => `<option value="${escapeHtml(role.name)}">${escapeHtml(role.name)}</option>`)
      .join("");
    if (currentValue && [...staffRoleSelect.options].some(option => option.value === currentValue)) {
      staffRoleSelect.value = currentValue;
    }
  }
  if (staffDepartmentSelect) {
    const currentValue = staffDepartmentSelect.value;
    staffDepartmentSelect.innerHTML = `<option value="">Select Department</option>` + departments
      .map(department => `<option value="${escapeHtml(department.name)}">${escapeHtml(department.name)}</option>`)
      .join("");
    if (currentValue && [...staffDepartmentSelect.options].some(option => option.value === currentValue)) {
      staffDepartmentSelect.value = currentValue;
    }
  }
  if (designationDepartmentSelect) {
    const currentValue = designationDepartmentSelect.value;
    designationDepartmentSelect.innerHTML = `<option value="">Select Department</option>` + departments
      .map(department => `<option value="${escapeHtml(department.name)}">${escapeHtml(department.name)}</option>`)
      .join("");
    if (currentValue && [...designationDepartmentSelect.options].some(option => option.value === currentValue)) {
      designationDepartmentSelect.value = currentValue;
    }
  }
  if (staffDesignationSelect) {
    const currentValue = staffDesignationSelect.value;
    staffDesignationSelect.innerHTML = `<option value="">Select Designation</option>` + designations
      .map(designation => `<option value="${escapeHtml(designation.name)}">${escapeHtml(designation.name)}</option>`)
      .join("");
    if (currentValue && [...staffDesignationSelect.options].some(option => option.value === currentValue)) {
      staffDesignationSelect.value = currentValue;
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
      return `
        <tr>
          <td><strong>${escapeHtml(role.name)}</strong></td>
          <td>${escapeHtml(role.description || "-")}</td>
          <td><span class="status-pill stable">${staffCount}</span></td>
          <td>
            <button class="icon-action edit" type="button" data-edit-role="${index}" title="Edit role" aria-label="Edit role">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20h4.7L19.3 9.4a2.1 2.1 0 0 0 0-3L17.6 4.7a2.1 2.1 0 0 0-3 0L4 15.3V20Zm3.8-2H6v-1.8l8.5-8.5 1.8 1.8L7.8 18Zm7.9-11.5.4-.4 1.8 1.8-.4.4-1.8-1.8Z"/></svg>
            </button>
            <button class="icon-action delete" type="button" data-delete-role="${index}" title="Delete role" aria-label="Delete role">
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
  const isAdmin = /admin|administrator|principal/i.test(roleName);
  return ACCESS_PERMISSION_MODULES.reduce((permissions, moduleId) => {
    permissions[moduleId] = ACCESS_ACTIONS.reduce((actions, action) => {
      actions[action] = isAdmin || action === "view";
      return actions;
    }, {});
    return permissions;
  }, {});
}

function normalizeRolePermission(roleName = "") {
  const cleanRole = String(roleName || "").trim();
  if (!cleanRole) return {};
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
  if (!tbody) return;
  const cleanRole = String(roleName || "").trim();
  if (!cleanRole) {
    tbody.innerHTML = `<tr><td colspan="6">Select a role to set permissions.</td></tr>`;
    if (allTick) {
      allTick.checked = false;
      allTick.disabled = true;
    }
    return;
  }
  const permissions = normalizeRolePermission(cleanRole);
  tbody.innerHTML = ACCESS_PERMISSION_MODULES.map(moduleId => {
    const modulePermissions = permissions[moduleId] || {};
    return `
      <tr>
        <td><strong>${escapeHtml(titleMap[moduleId] || moduleId)}</strong></td>
        ${ACCESS_ACTIONS.map(action => `
          <td>
            <label class="permission-check" title="${action} ${titleMap[moduleId] || moduleId}">
              <input type="checkbox" name="${moduleId}.${action}" ${modulePermissions[action] ? "checked" : ""} />
            </label>
          </td>
        `).join("")}
      </tr>
    `;
  }).join("");
  if (allTick) {
    const permissionInputs = [...tbody.querySelectorAll("input[type='checkbox']")];
    allTick.disabled = false;
    allTick.checked = permissionInputs.length > 0 && permissionInputs.every(input => input.checked);
  }
}

function renderUserAccessRows() {
  const rows = document.getElementById("userAccessRows");
  const summary = document.getElementById("userAccessSummary");
  if (!rows) return;
  rows.innerHTML = userAccessAccounts.map((account, index) => `
    <tr>
      <td><strong>${escapeHtml(account.staffName || "-")}</strong><small>${escapeHtml(account.staffId || "")}</small></td>
      <td>${escapeHtml(account.role || "-")}</td>
      <td>${escapeHtml(account.loginId || "-")}</td>
      <td>${escapeHtml(account.password || "-")}</td>
      <td><span class="status-pill ${account.status === "Active" ? "stable" : "pending"}">${escapeHtml(account.status || "Active")}</span></td>
      <td>
        <div class="row-actions">
          <button class="icon-action edit" type="button" data-edit-user-access="${index}" title="Edit user login" aria-label="Edit user login">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20h4.7L19.3 9.4a2.1 2.1 0 0 0 0-3L17.6 4.7a2.1 2.1 0 0 0-3 0L4 15.3V20Zm3.8-2H6v-1.8l8.5-8.5 1.8 1.8L7.8 18Zm7.9-11.5.4-.4 1.8 1.8-.4.4-1.8-1.8Z"/></svg>
          </button>
          <button class="icon-action" type="button" data-toggle-user-access="${index}" title="${account.status === "Active" ? "Disable" : "Enable"} user" aria-label="${account.status === "Active" ? "Disable" : "Enable"} user">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 22a10 10 0 1 1 0-20 10 10 0 0 1 0 20Zm0-2a8 8 0 0 0 6.3-12.9L7.1 18.3A8 8 0 0 0 12 20Zm-6.3-3.1L16.9 5.7A8 8 0 0 0 5.7 16.9Z"/></svg>
          </button>
          <button class="icon-action delete" type="button" data-delete-user-access="${index}" title="Delete user login" aria-label="Delete user login">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 21c-.6 0-1.1-.2-1.5-.6S5 19.5 5 19V8H4V6h5V4h6v2h5v2h-1v11c0 .6-.2 1.1-.6 1.5s-.9.6-1.5.6H7ZM17 8H7v11h10V8Zm-8 9h2v-7H9v7Zm4 0h2v-7h-2v7Z"/></svg>
          </button>
        </div>
      </td>
    </tr>
  `).join("") || `<tr><td colspan="6">No user login saved yet.</td></tr>`;
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
  return `ANPS-${trailingNumber}`;
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

function renderStudentUserRows() {
  const rows = document.getElementById("studentUserRows");
  const summary = document.getElementById("studentUserSummary");
  if (!rows) return;
  normalizeStudentUserLoginIds();
  rows.innerHTML = studentUserAccounts.map((account, index) => {
    const student = findStudentByAdmissionNo(account.admissionNo) || {};
    const loginId = getStudentLoginIdFromAdmissionNo(account.admissionNo);
    const permissions = getStudentUserPermissionValues(account);
    return `
      <tr>
        <td><strong>${escapeHtml(account.studentName || student.name || "-")}</strong><small>${escapeHtml(account.admissionNo || "")}</small></td>
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
  }).join("") || `<tr><td colspan="7">No student user saved yet.</td></tr>`;
  if (summary) summary.textContent = `${studentUserAccounts.length} student users saved`;
}

function renderUserAccessSettings() {
  renderAccessRoleOptions();
  renderAccessStaffOptions();
  const selectedRole = document.getElementById("accessPermissionRole")?.value || roles[0]?.name || "";
  const permissionRole = document.getElementById("accessPermissionRole");
  if (permissionRole && !permissionRole.value && selectedRole) permissionRole.value = selectedRole;
  renderPermissionRows(document.getElementById("accessPermissionRole")?.value || "");
  renderUserAccessRows();
}

function renderStudentUserLogin() {
  renderStudentUserOptions();
  renderStudentUserRows();
}

function resetUserAccessForm() {
  editingUserAccessIndex = -1;
  if (userAccessForm) {
    userAccessForm.reset();
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
  const subjectOptions = document.getElementById("staffSubjectOptions");
  if (subjectOptions) {
    subjectOptions.innerHTML = getSubjectOptions().map(subject => `<option value="${escapeHtml(subject)}"></option>`).join("");
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

function getFeeHeadMatchingHeads(feeHead = "") {
  if (feeHead === "Tuition Fee") return ["Tuition Fee", "Tuition Late Fine"];
  if (feeHead === "Transport Fees") return ["Transport Fees", "Transport Late Fine"];
  return [feeHead];
}

function getTuitionSearchDueRow(student) {
  const monthlyFee = Number(student.tuitionFee || 0);
  if (!monthlyFee) return null;
  const today = new Date();
  const monthPayments = getTuitionMonthPayments(student.admissionNo);
  const dueMonths = getSelectedMonths(student, "feeMonths").filter(month => getAcademicMonthDate(month, 1) <= today);
  if (!dueMonths.length) return null;
  const monthDetails = dueMonths.map(month => {
    const fine = calculateTuitionFineForMonth(month, new Date());
    const paid = monthPayments[month] || {tuition: 0, fine: 0};
    const tuitionDue = Math.max(monthlyFee - paid.tuition, 0);
    const fineDue = Math.max(fine - paid.fine, 0);
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
  const tuitionPayments = row.name === "Tuition Fee" ? getTuitionMonthPayments(student.admissionNo) : {};
  return (row.months || [])
    .filter(month => {
      const monthIndex = ACADEMIC_MONTHS.indexOf(month);
      if (selectedMonth) return monthIndex >= 0 && monthIndex <= monthCutoff;
      return getAcademicMonthDate(month, 1) <= today;
    })
    .map(month => {
      if (row.name === "Tuition Fee") {
        const paid = tuitionPayments[month] || {tuition: 0, fine: 0};
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
    const tuitionPayments = getTuitionMonthPayments(student.admissionNo);
    const paid = tuitionPayments[month] || {tuition: 0, fine: 0};
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

function getDueFeesSearchRows(selectedMonth = "") {
  const query = document.getElementById("dueFeesStudentSearch")?.value || "";
  return getActiveStudents().filter(student => dueFeesStudentMatchesSearch(student, query)).flatMap(student => {
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
        .filter(Boolean);
    }
    return getLedgerRows(student)
      .filter(row => row.due > 0)
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
  const selectedMonth = renderDueFeesMonthOptions();
  const rows = getDueFeesSearchRows(selectedMonth);
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
      <td>${isNewStudentGroup ? `<button class="student-name-link" type="button" data-open-fee-book="${openStudentKey}"><strong>${student.admissionNo || "-"}</strong></button>` : `<span class="repeat-student-cell">same student</span>`}</td>
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

function renderFinanceSession() {
  const session = financeSessions[activeSession];
  const dashboardMonthly = getDashboardMonthlyFeeCollectionSummary();
  document.getElementById("academicYearText").textContent = `Academic year ${activeSession}`;
  document.getElementById("sessionSummaryText").textContent = session.summary;
  document.getElementById("kpiFeesCollected").textContent = formatRs(dashboardMonthly.collected);
  document.getElementById("kpiFeesNote").textContent = `${dashboardMonthly.percent}% monthly fees collected, Annual Fee excluded`;
  document.getElementById("kpiFollowUps").textContent = String(session.followUps).padStart(2, "0");
  document.getElementById("kpiFollowUpsNote").textContent = `${session.highPriority} high priority`;
  resetFeeMasterEditing();
  resetFeeGroupEditing();
  renderFeeMaster();
  renderFeeGroups();
  renderDues();
  renderDueFeesSearch();
}

function isDashboardMonthlyFeeHead(head = "") {
  const clean = String(head || "").trim();
  if (!clean || clean === "Annual Fee") return false;
  if (["Tuition Late Fine", "Transport Late Fine"].includes(clean)) return false;
  return true;
}

function getDashboardMonthlyFeeCollectionSummary() {
  const activeStudents = getActiveStudents();
  const expected = activeStudents.reduce((sum, student) => {
    return sum + getStudentFeeItems(student)
      .filter(item => Array.isArray(item.months) && item.months.length && isDashboardMonthlyFeeHead(item.name))
      .reduce((itemSum, item) => itemSum + Number(item.total || 0), 0);
  }, 0);
  const collected = activeStudents.reduce((sum, student) => {
    return sum + getSessionPayments(student.admissionNo).reduce((paymentSum, payment) => {
      return paymentSum + (payment.allocations || []).reduce((allocationSum, allocation) => {
        if (!allocation.month || !isDashboardMonthlyFeeHead(allocation.head)) return allocationSum;
        return allocationSum + Number(allocation.amount || 0);
      }, 0);
    }, 0);
  }, 0);
  return {
    expected,
    collected,
    percent: expected > 0 ? Math.min(100, Math.round((collected / expected) * 100)) : 0
  };
}

function formatRs(amount) {
  return `Rs. ${Number(amount || 0).toLocaleString("en-IN")}`;
}

function formatDateDDMMYYYY(value = new Date()) {
  if (!value) return "";
  if (typeof value === "string" && /^\d{2}-\d{2}-\d{4}$/.test(value.trim())) return value.trim();
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
  const clean = String(value || "").trim();
  const match = clean.match(/^(\d{2})-(\d{2})-(\d{2}|\d{4})$/);
  if (match) {
    const year = match[3].length === 2 ? Number(`20${match[3]}`) : Number(match[3]);
    const date = new Date(year, Number(match[2]) - 1, Number(match[1]));
    return Number.isNaN(date.getTime()) ? new Date() : date;
  }
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? new Date() : new Date(date.getFullYear(), date.getMonth(), date.getDate());
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
  return payments.filter(payment => {
    const date = parseOptionalDateDDMMYYYY(payment.date) || parseDateDDMMYYYY(payment.date);
    if (from && date < from) return false;
    if (to && date > to) return false;
    if (collectedBy && String(payment.by || "").trim().toLowerCase() !== collectedBy) return false;
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
  if (!collectedPayments[activeSession][admissionNo]) collectedPayments[activeSession][admissionNo] = [];
  return collectedPayments[activeSession][admissionNo];
}

function getPaymentAllocationTotals(admissionNo) {
  return getSessionPayments(admissionNo).reduce((totals, payment) => {
    payment.allocations.forEach(allocation => {
      totals[allocation.head] = (totals[allocation.head] || 0) + allocation.amount;
    });
    return totals;
  }, {});
}

function getTuitionMonthPayments(admissionNo) {
  return getSessionPayments(admissionNo).reduce((months, payment) => {
    payment.allocations.forEach(allocation => {
      if (!allocation.month) return;
      if (!months[allocation.month]) months[allocation.month] = {tuition: 0, fine: 0};
      if (allocation.head === "Tuition Fee") months[allocation.month].tuition += allocation.amount;
      if (allocation.head === "Tuition Late Fine") months[allocation.month].fine += allocation.amount;
    });
    return months;
  }, {});
}

function getTuitionMonthPaidInfo(student, row, month) {
  const paid = getTuitionMonthPayments(student.admissionNo)[month] || {tuition: 0, fine: 0};
  const monthlyAmount = Number(row?.monthlyAmount || student.tuitionFee || 0);
  return {
    ...paid,
    monthlyAmount,
    isSettled: monthlyAmount > 0 && Number(paid.tuition || 0) >= monthlyAmount
  };
}

function getTransportMonthPayments(admissionNo) {
  return getSessionPayments(admissionNo).reduce((months, payment) => {
    payment.allocations.forEach(allocation => {
      if (!allocation.month) return;
      if (!months[allocation.month]) months[allocation.month] = {transport: 0, fine: 0};
      if (allocation.head === "Transport Fees") months[allocation.month].transport += allocation.amount;
      if (allocation.head === "Transport Late Fine") months[allocation.month].fine += allocation.amount;
    });
    return months;
  }, {});
}

function getTransportMonthPaidInfo(student, row, month) {
  const paid = getTransportMonthPayments(student.admissionNo)[month] || {transport: 0, fine: 0};
  const monthlyAmount = Number(row?.monthlyAmount || student.transportFee || 0);
  return {
    ...paid,
    monthlyAmount,
    isSettled: monthlyAmount > 0 && Number(paid.transport || 0) >= monthlyAmount
  };
}

function getTuitionMonthFineDue(student, row, month, paymentDate = new Date()) {
  const paid = getTuitionMonthPaidInfo(student, row, month);
  if (paid.isSettled) return 0;
  return Math.max(calculateTuitionFineForMonth(month, paymentDate) - Number(paid.fine || 0), 0);
}

function getTuitionMonthCollectFineDue(student, row, month, paymentDate = new Date()) {
  const paid = getTuitionMonthPaidInfo(student, row, month);
  return Math.max(calculateTuitionFineForMonth(month, paymentDate) - Number(paid.fine || 0), 0);
}

function getTransportMonthFineDue(student, row, month, paymentDate = new Date()) {
  const paid = getTransportMonthPaidInfo(student, row, month);
  if (paid.isSettled) return 0;
  return Math.max(calculateTransportFineForMonth(month, paymentDate) - Number(paid.fine || 0), 0);
}

function getTransportMonthCollectFineDue(student, row, month, paymentDate = new Date()) {
  const paid = getTransportMonthPaidInfo(student, row, month);
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
    document.getElementById("ledgerPaymentRows").innerHTML = `<tr><td colspan="11">No payment history yet.</td></tr>`;
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
  const split = savedBank || savedCash ? {bank: savedBank, cash: savedCash} : getPaymentSplitForAmount(payment, total);
  return {
    date: payment.date,
    receipt: payment.receipt,
    admissionNo: student.admissionNo || "",
    head: feeHeads.length ? feeHeads.join(", ") : "Tuition Fee",
    amount: total,
    bank: split.bank,
    cash: split.cash,
    fine,
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
  return getActiveStudents().flatMap(student => getLedgerPayments(student)).sort((a, b) => {
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
  feeForm.querySelector("button[type='submit']").textContent = "Generate Receipt";
}

function resetFeeDateToToday() {
  const feeForm = document.getElementById("feeForm");
  feeForm.elements.date.value = formatDateDDMMYYYY(new Date());
  updateFeeFineAmountFromPaymentDate();
}

function deletePaymentByReceipt(admissionNo, receiptNo) {
  const payments = getSessionPayments(admissionNo);
  const before = payments.length;
  for (let index = payments.length - 1; index >= 0; index -= 1) {
    if (payments[index].receipt === receiptNo) payments.splice(index, 1);
  }
  return payments.length !== before;
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
    const amount = payment.allocations
      .filter(allocation => matchingHeads.includes(allocation.head))
      .reduce((sum, allocation) => sum + allocation.amount, 0);
    const fineHead = getLateFineHeadForFee(row.name);
    const fine = ["Tuition Fee", "Transport Fees"].includes(row.name) ? payment.allocations
      .filter(allocation => allocation.head === fineHead)
      .reduce((sum, allocation) => sum + allocation.amount, 0) : 0;
    return amount > 0 ? {
      date: payment.date,
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
      if (allocation.head !== row.name) return;
      if (allocation.month) {
        info.exactMonthTotals[allocation.month] = (info.exactMonthTotals[allocation.month] || 0) + allocation.amount;
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
      .filter(allocation => allocation.head === row.name && allocation.month === month)
      .reduce((allocationSum, allocation) => allocationSum + Number(allocation.amount || 0), 0);
  }, 0);
  return directPaid;
}

function isLedgerMonthPartiallyPaid(student, row, month) {
  if (!student || !row || !month || !row.monthlyAmount) return false;
  const paid = getLedgerMonthPaidAmount(student, row, month);
  return paid > 0 && paid < Number(row.monthlyAmount || 0);
}

function renderLedgerPeriodCell(student, row) {
  const payments = getLedgerPaymentDetails(student, row);
  const months = Array.isArray(row.months) ? row.months : [];
  const paidMonths = getPaidLedgerMonths(student, row);
  if (!months.length && !payments.length) return `<span class="fee-period">${row.period}</span>`;
  return `
    <details class="period-details ledger-payment-details">
      <summary><span class="fee-period">${row.period}</span></summary>
      <div class="period-breakdown ledger-payment-breakdown">
        ${months.length ? `
          <div class="period-breakdown-head period-month-row"><span>Month</span><span>Amount</span><span>Fine</span><span>Total</span><span></span></div>
          ${months.map(month => {
            const isPaid = paidMonths.has(month);
            const isPartial = !isPaid && isLedgerMonthPartiallyPaid(student, row, month);
            const monthFine = getLedgerMonthDisplayFineAmount(student, row, month);
            const monthAmount = Number(row.monthlyAmount || 0);
            return `
            <div class="period-breakdown-row period-month-row ${isPaid ? "paid-month" : isPartial ? "partial-month" : ""}">
              <span>${month}${isPaid ? " Paid" : isPartial ? " Part Paid" : ""}</span>
              <span>${formatRs(row.monthlyAmount || 0)}</span>
              <span>${formatRs(monthFine)}</span>
              <span>${formatRs(monthAmount + monthFine)}</span>
              <span class="month-row-actions">
                <button class="month-collect-action" type="button" data-student-fees="${student.admissionNo || ""}" data-due-amount="${monthAmount + monthFine}" data-fee-head="${row.name}" data-fine-amount="${monthFine}" data-fee-month="${month}" ${isPaid ? "disabled" : ""} title="${isPaid ? `${month} paid` : `Collect ${month}`}" aria-label="${isPaid ? `${month} paid` : `Collect ${month} ${row.name} for ${student.name || "student"}`}">
                  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6.5C4 5.1 5.1 4 6.5 4h11C18.9 4 20 5.1 20 6.5v11c0 1.4-1.1 2.5-2.5 2.5h-11C5.1 20 4 18.9 4 17.5v-11ZM6.5 6a.5.5 0 0 0-.5.5V8h12V6.5a.5.5 0 0 0-.5-.5h-11ZM6 10v7.5c0 .3.2.5.5.5h11c.3 0 .5-.2.5-.5V10H6Zm6.8 6.7h-1.6v-1.1c-1-.2-1.8-.8-2.2-1.6l1.5-.8c.3.5.8.8 1.6.8.7 0 1-.2 1-.6s-.4-.5-1.4-.8c-1.4-.4-2.4-.9-2.4-2.2 0-1.1.8-1.9 1.9-2.1V7.3h1.6v1c.8.2 1.5.7 1.9 1.5l-1.4.8c-.3-.5-.7-.7-1.2-.7-.6 0-.9.2-.9.5 0 .4.4.5 1.4.8 1.4.4 2.4.9 2.4 2.2 0 1.2-.8 2-2.2 2.2v1.1Z"/></svg>
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

function findTransportVillageByName(name, exceptName = "") {
  const target = normalizeVillageName(name);
  const except = normalizeVillageName(exceptName);
  return transportVillages.find(village => normalizeVillageName(village) === target && normalizeVillageName(village) !== except);
}

function dedupeTransportVillages() {
  const seen = new Set();
  for (let index = transportVillages.length - 1; index >= 0; index -= 1) {
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
  return [...new Set([
    ...transportVillages,
    ...getActiveStudents().map(student => student.villageTown)
  ].map(village => String(village || "").trim()).filter(Boolean))]
    .sort((a, b) => a.localeCompare(b, "en", {sensitivity: "base"}));
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

function studentTakesTransport(student = {}) {
  const services = Array.isArray(student.otherServices) ? student.otherServices : [];
  return Boolean(
    student.transportRequired ||
    services.includes("Transport") ||
    services.includes("Special/Custom")
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

function renderTransportRoutePickupPoints() {
  renderRoutePickupOptions();
  const rows = document.getElementById("transportRoutePickupRows");
  if (!rows) {
    renderTransportRouteStudentCounts();
    return;
  }
  const html = transportRoutePickupPoints.flatMap((point, index) => {
    const assignment = getTransportAssignment(point.routeName, point.shift) || {};
    const vehicle = getTransportVehicleByNo(assignment.vehicleNo) || {};
    const vehicleLabel = assignment.vehicleNo
      ? `${vehicle.vehicleName || assignment.vehicleName || "Vehicle"} (${assignment.vehicleNo})`
      : "No vehicle assigned";
    const studentsForVillage = getTransportStudentsByVillage(point.villageName);
    const studentRows = studentsForVillage.length ? studentsForVillage : [null];
    return studentRows.map(student => `
      <tr>
        <td><strong>${escapeHtml(point.routeName || "-")}</strong></td>
        <td>${escapeHtml(point.villageName || "-")}</td>
        <td>${student ? escapeHtml(student.admissionNo || "-") : "-"}</td>
        <td>${student ? escapeHtml(student.name || "-") : "<span class=\"repeat-student-cell\">No transport student in this village</span>"}</td>
        <td>${escapeHtml(vehicleLabel)}</td>
        <td>${escapeHtml(point.shift || "-")}</td>
        <td>${escapeHtml(point.time || "-")}</td>
        <td>${escapeHtml(point.sequence || "-")}</td>
        <td class="inline-actions">
          <button class="icon-action edit" type="button" data-edit-transport-pickup="${index}" title="Edit pickup point" aria-label="Edit pickup point">✎</button>
          <button class="icon-action delete" type="button" data-delete-transport-pickup="${index}" title="Delete pickup point" aria-label="Delete pickup point">×</button>
        </td>
      </tr>
    `);
  }).join("");
  rows.innerHTML = html || `<tr><td colspan="9">No route pickup points mapped yet.</td></tr>`;
  renderTransportRouteStudentCounts();
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

function renderStudentTransportFees() {
  const rows = document.getElementById("studentTransportFeeRows");
  if (!rows) return;
  const transportStudents = getActiveStudents()
    .filter(student => studentTakesTransport(student))
    .sort((a, b) =>
      String(a.villageTown || "").localeCompare(String(b.villageTown || ""), undefined, {numeric: true}) ||
      String(a.name || "").localeCompare(String(b.name || ""), undefined, {numeric: true})
    );
  rows.innerHTML = transportStudents.map(student => {
    const months = getSelectedMonths(student, "transportMonths");
    const fee = Number(student.transportFee || 0);
    return `
      <tr>
        <td><strong>${escapeHtml(student.admissionNo || "-")}</strong></td>
        <td>${escapeHtml(student.name || "-")}</td>
        <td>${escapeHtml(student.villageTown || "-")}</td>
        <td>${escapeHtml(getStudentTransportVehicleName(student))}</td>
        <td>${escapeHtml(getStudentTransportFeeType(student))}</td>
        <td><strong>${formatRs(fee)}</strong></td>
        <td>${escapeHtml(formatMonthPeriod(months))}</td>
        <td><span class="status-pill ${fee > 0 ? "stable" : "pending"}">${fee > 0 ? "Active" : "Fee Missing"}</span></td>
      </tr>
    `;
  }).join("") || `<tr><td colspan="7">No student transport fees assigned yet.</td></tr>`;
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
  return `
    <details class="date-details">
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
    date: formatDateDDMMYYYY(date || new Date()),
    receipt: receiptNo || getNextReceiptNo(),
    mode,
    by: getCurrentCollectorRoleName(),
    amount: totalAmount,
    discountAmount,
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
    const finePaid = Math.min(fine, remainingAmount);
    if (finePaid > 0) {
      allocations.push({head: getLateFineHeadForFee(item.head), amount: finePaid, month: item.month || undefined});
      remainingAmount -= finePaid;
    }
    const feePaid = Math.min(amount, remainingAmount);
    if (feePaid > 0) {
      allocations.push({head: item.head, amount: feePaid, month: item.month || undefined});
      remainingAmount -= feePaid;
    }
  });
  if (!allocations.length) return null;
  const payment = {
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
    document.getElementById("ledgerPaymentRows").innerHTML = `<tr><td colspan="11">No payment history yet.</td></tr>`;
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
    document.getElementById("collectionHistoryCollectedBy")?.value
  );
  document.getElementById("ledgerPaymentRows").innerHTML = ledgerPayments.map(payment => {
    const paymentAdmissionNo = payment.admissionNo || student.admissionNo || "";
    const totalAmount = Number(payment.bank || 0) + Number(payment.cash || 0);
    const selectionKey = getPaymentSelectionKey(payment);
    const isSelected = selectedHistoryPayments.has(selectionKey);
    return `
    <tr class="${isSelected ? "selected-payment-row" : ""}">
      <td>${formatDateDDMMYYYY(payment.date)}</td>
      <td>${payment.receipt}</td>
      <td>${escapeHtml(paymentAdmissionNo || "-")}</td>
      <td>${payment.head}</td>
      <td>${formatRs(payment.bank)}</td>
      <td>${formatRs(payment.cash)}</td>
      <td>${formatRs(payment.fine)}</td>
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
  }).join("") || `<tr><td colspan="11">${hasHistoryFilter ? "No payment history found in selected filter." : "No payment history yet."}</td></tr>`;
  updatePaymentQuickTotal();
}

function getCombinedCollectionItems(student, month, paymentDate = new Date()) {
  if (!student || !month) return [];
  return getLedgerRows(student)
    .filter(row => Array.isArray(row.months) && row.months.includes(month))
    .map(row => {
      if (row.name === "Tuition Fee") {
        const paid = getTuitionMonthPaidInfo(student, row, month);
        const amount = Math.max(Number(row.monthlyAmount || 0) - Number(paid.tuition || 0), 0);
        const fine = getTuitionMonthCollectFineDue(student, row, month, parseDateDDMMYYYY(paymentDate));
        return {head: row.name, month, amount, fine, total: amount + fine, partial: Number(paid.tuition || 0) > 0 && amount > 0};
      }
      if (row.name === "Transport Fees") {
        const paid = getTransportMonthPaidInfo(student, row, month);
        const amount = Math.max(Number(row.monthlyAmount || 0) - Number(paid.transport || 0), 0);
        const fine = getTransportMonthCollectFineDue(student, row, month, parseDateDDMMYYYY(paymentDate));
        return amount + fine > 0 ? {head: row.name, month, amount, fine, total: amount + fine, partial: Number(paid.transport || 0) > 0 && amount > 0} : null;
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
  const student = findActiveStudentByAdmissionNo(admissionNo);
  const date = combinedCollectionForm.elements.date.value || new Date();
  const items = getCombinedCollectionItems(student, month, date);
  document.getElementById("combinedFeeItems").innerHTML = items.map((item, index) => `
    <div class="combined-fee-row ${item.partial ? "partial-fee-row" : ""}">
      <label>
        <input data-combined-fee type="checkbox" value="${index}" data-head="${escapeHtml(item.head)}" data-month="${escapeHtml(item.month)}" data-amount="${item.amount}" data-fine="${item.fine}" data-total="${item.total}" checked />
        <span>${escapeHtml(item.head)}</span>
      </label>
      <span>${formatRs(item.amount)}</span>
      <span>${formatRs(item.fine)}</span>
      <strong>${formatRs(item.total)}</strong>
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
      return;
    }
    if (allocation.head === "Transport Late Fine") {
      const transportKey = `Transport Fees__${month}`;
      if (!itemsByKey[transportKey]) itemsByKey[transportKey] = {head: "Transport Fees", month, amount: 0, fine: 0, total: 0};
      itemsByKey[transportKey].fine += Number(allocation.amount || 0);
      itemsByKey[transportKey].total += Number(allocation.amount || 0);
      return;
    }
    const key = `${allocation.head}__${month}`;
    if (!itemsByKey[key]) itemsByKey[key] = {head: allocation.head, month, amount: 0, fine: 0, total: 0};
    itemsByKey[key].amount += Number(allocation.amount || 0);
    itemsByKey[key].total += Number(allocation.amount || 0);
  });
  const items = Object.values(itemsByKey).filter(item => item.total > 0);
  document.getElementById("combinedFeeItems").innerHTML = items.map((item, index) => `
    <div class="combined-fee-row partial-fee-row">
      <label>
        <input data-combined-fee type="checkbox" value="${index}" data-head="${escapeHtml(item.head)}" data-month="${escapeHtml(item.month)}" data-amount="${item.amount}" data-fine="${item.fine}" data-total="${item.total}" checked />
        <span>${escapeHtml(item.head)}</span>
      </label>
      <span>${formatRs(item.amount)}</span>
      <span>${formatRs(item.fine)}</span>
      <strong>${formatRs(item.total)}</strong>
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
      <span>${formatRs(item.fine || 0)}</span>
      <strong>${formatRs(item.total)}</strong>
    </div>
  `;
  updateCombinedCollectionTotals();
}

function openCombinedCollectionPopup(admissionNo, month) {
  const student = findActiveStudentByAdmissionNo(admissionNo);
  if (!student || !month) {
    showToast("Monthly collection data not found.");
    return;
  }
  combinedCollectionForm.reset();
  delete combinedCollectionForm.dataset.editPaymentReceipt;
  combinedCollectionForm.querySelector("button[type='submit']").textContent = "Save Combined Receipt";
  combinedCollectionForm.elements.admissionNo.value = student.admissionNo || "";
  combinedCollectionForm.elements.month.value = month;
  combinedCollectionForm.elements.date.value = formatDateDDMMYYYY(new Date());
  combinedCollectionForm.elements.receiptNo.value = getNextReceiptNo();
  document.getElementById("combinedAdmissionNo").textContent = student.admissionNo || "-";
  document.getElementById("combinedStudentName").textContent = student.name || "-";
  document.getElementById("combinedStudentClass").textContent = student.klass || "-";
  document.getElementById("combinedFeeMonth").textContent = month;
  document.getElementById("combinedCollectionSubtitle").textContent = `${student.name || "Student"} | ${month} monthly fees`;
  renderCombinedCollectionItems();
  combinedCollectionModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
}

function openSingleCollectionPopup(admissionNo, feeHead, amount = 0, fine = 0) {
  const student = findActiveStudentByAdmissionNo(admissionNo);
  const total = Number(amount || 0);
  const fineAmount = Number(fine || 0);
  if (!student || !feeHead || total + fineAmount <= 0) {
    showToast("Payment data not found.");
    return;
  }
  combinedCollectionForm.reset();
  delete combinedCollectionForm.dataset.editPaymentReceipt;
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
  delete combinedCollectionForm.dataset.editPaymentReceipt;
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
  const session = financeSessions[activeSession];
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
  const session = financeSessions[activeSession];
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
  const session = financeSessions[activeSession];
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
  const session = financeSessions[activeSession] || {};
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

function getSecurityReadinessIssues() {
  const issues = [];
  if (!students.length) issues.push("No student records found.");
  if (!staffMembers.length) issues.push("No staff records found.");
  if (!(financeSessions[activeSession]?.feeMaster || []).length) issues.push("No fee master structure found for active session.");
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
    if (Math.abs(savedAmount - paidSplit) > 1) {
      addHealthIssue(issues, "Payment Integrity", "Bank/Cash total mismatch", `${receipt}: amount ${formatRs(savedAmount)} but bank+cash ${formatRs(paidSplit)}.`, "danger");
    }
    if (allocationsTotal && Math.abs(savedAmount - allocationsTotal) > 1) {
      addHealthIssue(issues, "Payment Integrity", "Receipt allocation mismatch", `${receipt}: amount ${formatRs(savedAmount)} but fee allocations ${formatRs(allocationsTotal)}.`, "warning");
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
      const pickup = transportRoutePickupPoints.find(point => normalizeVillageName(point.villageName || "") === cleanVillage);
      if (!pickup) {
        addHealthIssue(issues, "Transport Logic", "Transport student village not mapped to route", `${student.admissionNo || "-"} ${student.name || ""} | ${student.villageTown || "-"}`, "warning");
      } else if (!getTransportAssignment(pickup.routeName, pickup.shift)?.vehicleNo) {
        addHealthIssue(issues, "Transport Logic", "Route pickup has no assigned vehicle", `${pickup.routeName || "-"} | ${pickup.villageName || "-"} | ${pickup.shift || "-"}`, "warning");
      }
    }
  });

  transportRoutePickupPoints.forEach(point => {
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

function renderSecurityMaintenance(message = "") {
  const cards = document.getElementById("securityStatusCards");
  const runMode = document.getElementById("securityRunMode");
  if (!cards) return;
  const snapshot = getSecuritySnapshot();
  if (runMode) runMode.textContent = `Run Mode: ${snapshot.runMode}`;
  cards.innerHTML = [
    ["Logic Check", snapshot.logicStatus],
    ["Database", `${snapshot.dbSizeKb} KB`],
    ["Total Records", snapshot.totalRecords],
    ["Backup", `${snapshot.backupCount} saved`],
    ["Version", snapshot.version],
    ["Backup Date", snapshot.backupDate],
    ["Active Sign-ins", `${userAccessAccounts.filter(item => item.status === "Active").length + studentUserAccounts.filter(item => item.status === "Active").length}`],
    ["Refresh Rate", "Manual / On demand"]
  ].map(([label, value]) => `
    <article>
      <span>${escapeHtml(label)}</span>
      <strong>${escapeHtml(String(value))}</strong>
    </article>
  `).join("");
  if (message) {
    const output = document.getElementById("securityOutput");
    if (output) output.innerHTML = message;
  }
}

function createSecurityBackup() {
  saveAppState();
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
  renderSecurityMaintenance(`<strong>Backup created.</strong><br>${formatDateDDMMYYYY(backup.createdAt)} | Records: ${Object.values(backup.records).reduce((sum, value) => sum + Number(value || 0), 0)}`);
  showToast("Security backup created.");
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
  setNextReceiptNo();
  renderBars();
  renderTasks();
  renderModules();
  renderSessions();
  renderFinanceSession();
  renderDues();
  renderDueFeesSearch();
  renderAdmissionEnquiryModule();
  renderComplaintsDesk();
  renderNoticeBoard();
  renderStaffDetails();
  renderHrSetup();
  renderTeacherIdCardModule();
  renderUserAccessSettings();
  renderStudentUserLogin();
  renderSecurityMaintenance();
  updateTopbarSystemStatus();
  renderStaffTeachingSubjectField();
  renderStaffBiometricDevice();
  renderStaffAttendance();
  setNextStaffId();
  renderStaffPhotoPreview();
  renderLearning();
  renderTransportVillages();
  renderTransportRoutes();
  renderTransportVehicles();
  renderTransportVehicleAssignments();
  renderTransportRoutePickupPoints();
  renderStudentTransportFees();
  renderTuitionFineSetup();
  renderTransportFineSetup();
  renderAdmissionVillageTownOptions();
  renderAdmissionSectionOptions();
  renderFeeMasterClassOptions();
  renderClassSectionSetup();
  renderStudents();
  renderClassTimetable();
  renderSyllabusModule();
  renderHolidayReport();
  renderAnnualCalendar();
  renderStudentIdCardModule();
  renderDisabledStudents();
  renderFeeBookStudentOptions();
  renderStudentFeeCounter();
  renderFeeBook();
}

function isBackendAutoSyncPaused() {
  if (backendHydrating || document.hidden) return true;
  if (document.body.classList.contains("modal-open")) return true;
  if (Date.now() - backendLastLocalSaveAt < 3000) return true;
  return false;
}

async function pullBackendStateIfChanged(showMessage = false) {
  if (!backendSyncReady || isBackendAutoSyncPaused()) return;
  try {
    setTopbarNetworkStatus(navigator.onLine ? "checking" : "offline");
    const hasToken = await ensureBackendToken();
    if (!hasToken) return;
    const healthResponse = await fetch(backendApiUrl(`/api/health?v=${Date.now()}`), {cache: "no-store"});
    if (!healthResponse.ok) return;
    setTopbarNetworkStatus("online");
    const health = await healthResponse.json();
    const serverUpdatedAt = health?.updated_at || "";
    if (serverUpdatedAt && backendLastUpdatedAt && serverUpdatedAt === backendLastUpdatedAt) return;
    const stateResponse = await fetch(backendApiUrl(`/api/state?v=${Date.now()}`), {
      cache: "no-store",
      headers: backendHeaders()
    });
    if (!stateResponse.ok) return;
    const payload = await stateResponse.json();
    const backendState = payload?.state || {};
    if (!backendState || !Object.keys(backendState).length) return;
    backendHydrating = true;
    backendLastUpdatedAt = payload?.updated_at || serverUpdatedAt || backendLastUpdatedAt;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(backendState));
    applySavedState(backendState);
    refreshAllAfterSecurityClean();
    if (showMessage) showToast("Latest database data synced.");
  } catch (error) {
    setTopbarNetworkStatus("offline");
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
    const healthResponse = await fetch(backendApiUrl("/api/health"), {cache: "no-store"});
    if (!healthResponse.ok) return;
    setTopbarNetworkStatus("online");
    const hasToken = await ensureBackendToken();
    if (!hasToken) return;
    const flushedPending = await flushPendingBackendSnapshot();
    const stateResponse = await fetch(backendApiUrl(`/api/state?v=${Date.now()}`), {
      cache: "no-store",
      headers: backendHeaders()
    });
    if (!stateResponse.ok) return;
    const payload = await stateResponse.json();
    const backendState = payload?.state || {};
    backendLastUpdatedAt = payload?.updated_at || "";
    backendSyncReady = true;
    if (!flushedPending && backendState && Object.keys(backendState).length) {
      backendHydrating = true;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(backendState));
      applySavedState(backendState);
      refreshAllAfterSecurityClean();
      backendHydrating = false;
      showToast("Backend database connected.");
    } else if (!backendState || !Object.keys(backendState).length) {
      queueBackendSave(getAppStateSnapshot());
    }
    startBackendAutoSync();
  } catch (error) {
    setTopbarNetworkStatus("offline");
    backendSyncReady = false;
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
    saveAppState();
    return;
  }
  const feeInput = event.target.closest("[data-village-fee]");
  if (!feeInput) return;
  const village = feeInput.dataset.villageFee;
  const feeType = feeInput.dataset.feeType;
  if (!transportVillageFees[village]) transportVillageFees[village] = {};
  transportVillageFees[village][feeType] = Number(feeInput.value || 0);
  saveAppState();
  updateAdmissionTransportFee();
});

document.getElementById("transportPickupPoint").addEventListener("change", event => {
  const input = event.target.closest("[data-village-name]");
  if (!input) return;
  const oldName = input.dataset.villageName;
  const newName = String(input.value || "").trim();
  if (!newName) {
    input.value = oldName;
    return;
  }
  if (findTransportVillageByName(newName, oldName)) {
    input.value = oldName;
    showToast(`${newName} already exists.`);
    return;
  }
  const index = transportVillages.indexOf(oldName);
  if (index >= 0) transportVillages[index] = newName;
  if (transportVillageDistances[oldName]) {
    transportVillageDistances[newName] = transportVillageDistances[oldName];
    delete transportVillageDistances[oldName];
  }
  if (transportVillageFees[oldName]) {
    transportVillageFees[newName] = transportVillageFees[oldName];
    delete transportVillageFees[oldName];
  }
  saveAppState();
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
  saveAppState();
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
  const editButton = event.target.closest("[data-edit-transport-pickup]");
  const deleteButton = event.target.closest("[data-delete-transport-pickup]");
  if (editButton) {
    const index = Number(editButton.dataset.editTransportPickup);
    const point = transportRoutePickupPoints[index];
    if (!point || !transportRoutePickupForm) return;
    editingTransportPickupIndex = index;
    renderRoutePickupOptions();
    transportRoutePickupForm.elements.routeName.value = point.routeName || "";
    transportRoutePickupForm.elements.villageName.value = point.villageName || "";
    transportRoutePickupForm.elements.shift.value = point.shift || "";
    transportRoutePickupForm.elements.time.value = point.time || "";
    transportRoutePickupForm.elements.sequence.value = point.sequence || "";
    transportRoutePickupForm.querySelector("button[type='submit']").textContent = "Update Pickup Point";
    transportRoutePickupForm.scrollIntoView({behavior: "smooth", block: "center"});
    return;
  }
  if (deleteButton) {
    const index = Number(deleteButton.dataset.deleteTransportPickup);
    const point = transportRoutePickupPoints[index];
    if (!point) return;
    if (!confirm(`Delete pickup mapping for ${point.villageName || ""}?`)) return;
    transportRoutePickupPoints.splice(index, 1);
    editingTransportPickupIndex = -1;
    if (transportRoutePickupForm) {
      transportRoutePickupForm.reset();
      transportRoutePickupForm.querySelector("button[type='submit']").textContent = "Map Pickup Point";
    }
    saveAppState();
    renderTransportRoutePickupPoints();
    showToast("Pickup mapping deleted.");
  }
});

document.getElementById("routePickupCountRoute")?.addEventListener("change", renderTransportRouteStudentCounts);

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
  const data = new FormData(feeMasterForm);
  const feeData = {
    className: String(data.get("className") || "").trim(),
    studentType: String(data.get("studentType") || "New Student"),
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
    financeSessions[activeSession].feeMaster[editingFeeMasterIndex] = feeData;
  } else {
    financeSessions[activeSession].feeMaster.push(feeData);
  }
  renderFeeMaster();
  if (admissionForm.elements.klass.value === feeData.className) applyFeeMasterToAdmissionForm(feeData.className);
  saveAppState();
  feeMasterForm.reset();
  const actionText = editingFeeMasterIndex >= 0 ? "updated" : "added";
  resetFeeMasterEditing();
  showToast(`Fee structure ${actionText} in ${activeSession}.`);
});

feeBookStudentSelect.addEventListener("change", () => {
  renderFeeBook(feeBookStudentSelect.value);
});

document.getElementById("dueFeesMonthFilter").addEventListener("change", renderDueFeesSearch);
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
  const data = new FormData(feeGroupForm);
  const feeGroup = {
    groupName: String(data.get("groupName") || "").trim(),
    category: String(data.get("category") || "One Time"),
    description: String(data.get("description") || "").trim()
  };
  if (editingFeeGroupIndex >= 0) {
    financeSessions[activeSession].feeGroups[editingFeeGroupIndex] = feeGroup;
  } else {
    financeSessions[activeSession].feeGroups.push(feeGroup);
  }
  const actionText = editingFeeGroupIndex >= 0 ? "updated" : "added";
  renderFeeGroups();
  renderFeeMasterDynamicFields();
  renderFeeMaster();
  saveAppState();
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
  saveAppState();
  renderClassSectionSetup();
  renderAdmissionClassOptions();
  renderFeeMasterClassOptions();
  renderClassTimetableOptions();
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
  saveAppState();
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
  saveAppState();
  renderClassSectionSetup();
  renderClassTimetableOptions();
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
  saveAppState();
  renderSubjectAssignmentSetup(className);
  renderClassTimetableOptions();
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
    villageTown: String(data.get("villageTown") || "").trim(),
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
  const complaint = {
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
  const editButton = event.target.closest("[data-edit-complaint]");
  const deleteButton = event.target.closest("[data-delete-complaint]");
  if (editButton) {
    const index = Number(editButton.dataset.editComplaint);
    const item = complaintRecords[index];
    if (!item || !complaintRegisterForm) return;
    editingComplaintIndex = index;
    setView("complaintRegister");
    complaintRegisterForm.elements.date.value = toDateInputValue(item.date);
    complaintRegisterForm.elements.forType.value = item.forType || "Student";
    complaintRegisterForm.elements.personName.value = item.personName || "";
    complaintRegisterForm.elements.mobile.value = item.mobile || "";
    complaintRegisterForm.elements.category.value = item.category || "Other";
    complaintRegisterForm.elements.priority.value = item.priority || "Normal";
    complaintRegisterForm.elements.status.value = item.status || "Open";
    complaintRegisterForm.elements.receivedBy.value = item.receivedBy || "";
    complaintRegisterForm.elements.details.value = item.details || "";
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
  studentUserAccessForm.elements.password.value = student.mobile || student.fatherMobile || student.motherMobile || "";
});

document.getElementById("idCardStudentSelect")?.addEventListener("change", renderStudentIdCardModule);
document.getElementById("studentIdContactType")?.addEventListener("change", renderStudentIdCardModule);
document.getElementById("studentIdCardWidthMm")?.addEventListener("input", renderStudentIdCardModule);
document.getElementById("studentIdCardHeightMm")?.addEventListener("input", renderStudentIdCardModule);
document.getElementById("generateStudentIdCard")?.addEventListener("click", renderStudentIdCardModule);
document.getElementById("printStudentIdCard")?.addEventListener("click", printStudentIdCard);
document.getElementById("teacherIdCardSelect")?.addEventListener("change", renderTeacherIdCardModule);
document.getElementById("generateTeacherIdCard")?.addEventListener("click", renderTeacherIdCardModule);
document.getElementById("printTeacherIdCard")?.addEventListener("click", printTeacherIdCard);
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

document.getElementById("accessPermissionRole")?.addEventListener("change", event => {
  renderPermissionRows(event.target.value);
});

document.getElementById("accessPermissionAllTick")?.addEventListener("change", event => {
  document.querySelectorAll("#accessPermissionRows input[type='checkbox']").forEach(input => {
    input.checked = event.target.checked;
  });
});

document.getElementById("accessPermissionRows")?.addEventListener("change", event => {
  if (!event.target.matches("input[type='checkbox']")) return;
  const allTick = document.getElementById("accessPermissionAllTick");
  const permissionInputs = [...document.querySelectorAll("#accessPermissionRows input[type='checkbox']")];
  if (allTick) allTick.checked = permissionInputs.length > 0 && permissionInputs.every(input => input.checked);
});

noticeForm.addEventListener("submit", event => {
  event.preventDefault();
  const data = new FormData(noticeForm);
  notices.unshift({
    id: `NOTICE-${Date.now()}`,
    title: String(data.get("title") || "").trim(),
    audience: String(data.get("audience") || "All Students"),
    noticeClass: String(data.get("noticeClass") || "").trim(),
    publishDate: String(data.get("publishDate") || "").trim() || formatDateDDMMYYYY(new Date()),
    message: String(data.get("message") || "").trim(),
    priority: String(data.get("priority") || "Normal"),
    delivery: String(data.get("delivery") || "Notice Board"),
    status: "Published",
    createdAt: new Date().toISOString()
  });
  saveAppState();
  renderNoticeBoard();
  noticeForm.reset();
  noticeForm.elements.publishDate.value = formatDateDDMMYYYY(new Date());
  showToast("Notice published for selected audience.");
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
  staff.status = existingIndex >= 0 ? staffMembers[existingIndex].status || "Active" : "Active";
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
    if (roles.some((item, index) => index !== editingRoleIndex && item.name.toLowerCase() === role.name.toLowerCase())) {
      showToast(`${role.name} role already added.`);
      return;
    }
    const oldName = editingRoleIndex >= 0 ? roles[editingRoleIndex].name : "";
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
    const villageName = String(data.get("villageName") || "").trim();
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
    saveAppState();
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
    const previousVehicleNo = editingTransportVehicleIndex >= 0
      ? String(transportVehicles[editingTransportVehicleIndex]?.vehicleNo || "").toUpperCase()
      : "";
    const vehicleEntry = {vehicleNo, vehicleName, driverName, driverMobile, status: "Active"};
    if (editingTransportVehicleIndex >= 0) {
      transportVehicles[editingTransportVehicleIndex] = vehicleEntry;
      transportVehicleAssignments.forEach(assignment => {
        if (String(assignment.vehicleNo || "").toUpperCase() === previousVehicleNo) {
          assignment.vehicleNo = vehicleNo;
          assignment.vehicleName = vehicleName;
          assignment.driverName = driverName;
          assignment.driverMobile = driverMobile;
        }
      });
      editingTransportVehicleIndex = -1;
    } else {
      transportVehicles.push(vehicleEntry);
    }
    transportVehicles.sort((a, b) => String(a.vehicleNo || "").localeCompare(String(b.vehicleNo || ""), undefined, {numeric: true}));
    saveAppState();
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
    saveAppState();
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
    saveAppState();
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
    const villageName = String(data.get("villageName") || "").trim();
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
    saveAppState();
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
    const account = {
      staffId,
      staffName: staff ? staff.name : "",
      role: String(data.get("role") || "").trim(),
      loginId: String(data.get("loginId") || "").trim(),
      password: String(data.get("password") || "").trim(),
      status: String(data.get("status") || "Active").trim() || "Active"
    };
    if (!account.role || !account.loginId || !account.password) {
      showToast("Role, Login ID and Password required.");
      return;
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
    const permissions = {};
    ACCESS_PERMISSION_MODULES.forEach(moduleId => {
      permissions[moduleId] = {};
      ACCESS_ACTIONS.forEach(action => {
        permissions[moduleId][action] = Boolean(accessPermissionForm.querySelector(`[name="${moduleId}.${action}"]`)?.checked);
      });
    });
    rolePermissions[roleName] = permissions;
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
  if (fromInput) fromInput.value = "";
  if (toInput) toInput.value = "";
  if (collectedByInput) collectedByInput.value = "";
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

["staffAttendanceDevice", "staffAttendanceDeviceModel", "staffAttendanceDeviceNote", "staffAttendanceSource"].forEach(id => {
  document.getElementById(id).addEventListener("input", saveStaffBiometricDevice);
});

document.getElementById("staffBiometricSyncBtn").addEventListener("click", () => {
  saveStaffBiometricDevice();
  showToast("Biometric API connection provision ready. Device software/API connect korlei data sync hobe.");
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
  if (!validRows.length || validRows.some(row => !row.subject || !row.startTime || !row.endTime)) {
    showToast("Subject, time from and time to required in every filled row.");
    return;
  }
  const classSection = `${className} ${sectionName}`.trim();
  for (let index = classTimetableEntries.length - 1; index >= 0; index -= 1) {
    if (classTimetableEntries[index].classSection === classSection && classTimetableEntries[index].day === day) {
      classTimetableEntries.splice(index, 1);
    }
  }
  const entries = validRows.map((row, index) => ({
    id: `tt-${Date.now()}-${index}-${Math.random().toString(16).slice(2)}`,
    className,
    sectionName,
    classSection,
    day,
    period: index + 1,
    entryType: "Class",
    subject: row.subject,
    teacher: row.teacher,
    startTime: row.startTime,
    endTime: row.endTime,
    duration: getTimetableDuration(row.startTime, row.endTime),
    room: row.room,
    note: ""
  }));
  classTimetableEntries.unshift(...entries);
  saveAppState();
  renderClassTimetable();
  renderClassTimetableOptions();
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
document.getElementById("applyTimetableInterval").addEventListener("click", applySelectedTimetableInterval);
document.getElementById("timetableIntervalList").addEventListener("click", event => {
  const deleteButton = event.target.closest("[data-delete-timetable-interval]");
  if (!deleteButton) return;
  const period = deleteButton.dataset.deleteTimetableInterval;
  delete timetableIntervalMap[period];
  const startTime = classTimetableForm.elements.periodStartTime?.value || "";
  const duration = Number(classTimetableForm.elements.periodDuration?.value || 0);
  if (startTime && duration > 0) {
    applyTimetableQuickParameters();
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
  document.querySelectorAll("[data-timetable-day]").forEach(dayButton => {
    dayButton.classList.toggle("active", dayButton === button);
  });
  loadTimetableBuilderForSelection();
});
document.getElementById("classTimetableBuilderRows").addEventListener("click", event => {
  const deleteButton = event.target.closest("[data-delete-timetable-row]");
  if (!deleteButton) return;
  syncTimetableBuilderRowsFromDom();
  timetableBuilderRows = timetableBuilderRows.filter(row => row.id !== deleteButton.dataset.deleteTimetableRow);
  if (!timetableBuilderRows.length) timetableBuilderRows = [createTimetableBuilderRow()];
  renderTimetableBuilderRows();
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
  const studentData = {
    name: studentName,
    klass: `${klass} ${section}`.trim(),
    status: "Present",
    fee,
    route,
    admissionNo,
    studentType,
    guardian: String(data.get("guardianName") || "").trim(),
    mobile: String(data.get("mobile") || "").trim(),
    transportRequired: selectedOtherServices.includes("Transport") && !selectedOtherServices.includes("Special/Custom"),
    dob: formatDateDDMMYYYY(String(data.get("dob") || "").trim()),
    gender: String(data.get("gender") || "").trim(),
    bloodGroup: String(data.get("bloodGroup") || "").trim(),
    nationality: String(data.get("nationality") || "").trim(),
    religion: String(data.get("religion") || "").trim(),
    motherTongue: String(data.get("motherTongue") || "").trim(),
    villageTown: String(data.get("villageTown") || "").trim(),
    fatherName: String(data.get("fatherName") || "").trim(),
    fatherOccupation: "",
    fatherQualification: String(data.get("fatherQualification") || "").trim(),
    fatherWorkType: String(data.get("fatherWorkType") || "").trim(),
    fatherAnnualIncome: Number(data.get("fatherAnnualIncome") || 0),
    fatherMobile: String(data.get("fatherMobile") || "").trim(),
    fatherEmail: String(data.get("fatherEmail") || "").trim(),
    motherName: String(data.get("motherName") || "").trim(),
    motherOccupation: String(data.get("motherOccupation") || "").trim(),
    motherQualification: String(data.get("motherQualification") || "").trim(),
    motherWorkType: String(data.get("motherWorkType") || "").trim(),
    motherAnnualIncome: Number(data.get("motherAnnualIncome") || 0),
    motherMobile: String(data.get("motherMobile") || "").trim(),
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
    photo: currentAdmissionPhoto
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

disableReasonModal.addEventListener("click", event => {
  if (event.target === disableReasonModal) closeDisableReasonModal();
});

receiptPreviewModal.addEventListener("click", event => {
  if (event.target === receiptPreviewModal) closeReceiptPreview();
});

combinedCollectionModal.addEventListener("click", event => {
  if (event.target === combinedCollectionModal) closeCombinedCollectionPopup();
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
});

combinedCollectionForm.addEventListener("change", event => {
  if (event.target.matches("[data-combined-fee]")) updateCombinedCollectionTotals();
  if (event.target.name === "date" && !combinedCollectionForm.dataset.editPaymentReceipt) renderCombinedCollectionItems();
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
  const student = findActiveStudentByAdmissionNo(form.elements.admissionNo.value);
  const selected = [...form.querySelectorAll("[data-combined-fee]:checked")].map(input => ({
    head: input.dataset.head,
    month: input.dataset.month,
    amount: Number(input.dataset.amount || 0),
    fine: Number(input.dataset.fine || 0),
    total: Number(input.dataset.total || 0)
  }));
  const total = selected.reduce((sum, item) => sum + item.total, 0);
  const bankAmount = Number(form.elements.bankAmount.value || 0);
  const cashAmount = Number(form.elements.cashAmount.value || 0);
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
  const receiptNo = String(form.elements.receiptNo.value || "").trim() || getNextReceiptNo();
  const editingReceipt = form.dataset.editPaymentReceipt || "";
  if (editingReceipt) deletePaymentByReceipt(student.admissionNo, editingReceipt);
  const payment = collectCombinedStudentPayment(student, selected, form.elements.date.value, receiptNo, {
    bankAmount,
    cashAmount,
    discountAmount,
    remarks: form.elements.remarks?.value || ""
  });
  if (!payment) {
    showToast("Combined payment could not be saved.");
    return;
  }
  if (!editingReceipt) receiptSerial += 1;
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
  const receiptNo = String(data.get("receiptNo") || "").trim() || getNextReceiptNo();
  const feeHead = event.currentTarget.dataset.feeHead || "";
  const fineAmount = ["Tuition Fee", "Transport Fees"].includes(feeHead) ? Number(data.get("fineAmount") || event.currentTarget.dataset.fineAmount || 0) : 0;
  const feeMonth = event.currentTarget.dataset.feeMonth || "";
  const editingReceipt = event.currentTarget.dataset.editPaymentReceipt || "";
  event.currentTarget.elements.amount.value = rawAmount;
  if (rawAmount <= 0) {
    showToast("Enter bank or cash payment amount.");
    return;
  }
  if (editingReceipt) deletePaymentByReceipt(student.admissionNo, editingReceipt);
  const payment = collectStudentPayment(student, rawAmount, date, mode, feeHead, fineAmount, feeMonth, receiptNo, {bankAmount, cashAmount});
  if (!payment) {
    showToast("Payment could not be saved.");
    return;
  }
  renderStudentFeeCounter(student.admissionNo);
  renderFeeBook(student.admissionNo);
  renderDueFeesSearch();
  renderFinanceSession();
  if (!editingReceipt) receiptSerial += 1;
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
noticeForm.elements.publishDate.value = formatDateDDMMYYYY(new Date());

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
  fetch(backendApiUrl("/api/logout"), {
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
    const response = await fetch(backendApiUrl("/api/whatsapp/send"), {
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

document.getElementById("saveHomeworkButton").addEventListener("click", () => {
  showToast("Homework saved as draft.");
});

document.getElementById("printLedger").addEventListener("click", () => {
  printYearlyFeeStatement();
});

document.getElementById("feeBookMonthlyReportBtn").addEventListener("click", () => {
  openFeeBookMonthlyReport(activeLedgerAdmissionNo || feeBookStudentSelect.value);
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
  saveAppState();
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
  document.querySelectorAll("#ledgerFeeRows .period-details[open], #ledgerFeeRows .date-details[open], #dueFeesSearchRows .period-details[open]").forEach(dropdown => {
    if (dropdown !== activeTableDropdown) {
      dropdown.querySelectorAll(".payment-split-details[open]").forEach(childDropdown => {
        childDropdown.open = false;
      });
      dropdown.open = false;
    }
  });
  const profile = event.target.closest("[data-profile]");
  const editStudent = event.target.closest("[data-edit-student]");
  const admissionPreview = event.target.closest("[data-open-admission-preview]");
  const studentFees = event.target.closest("[data-student-fees]");
  const paymentReceiptPreview = event.target.closest("[data-preview-payment-receipt]");
  const savedReceiptPreview = event.target.closest("[data-preview-saved-receipt]");
  const selectedPaymentPreview = event.target.closest("[data-preview-selected-payments]");
  const classSectionDetail = event.target.closest("[data-view-class-section]");
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
    if (role && confirm(`Delete role ${role.name}?`)) {
      roles.splice(index, 1);
      delete rolePermissions[role.name];
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
      userAccessForm.elements.loginId.value = account.loginId || "";
      userAccessForm.elements.password.value = account.password || "";
      setSelectValue(userAccessForm.elements.status, account.status || "Active");
      userAccessForm.querySelector("button[type='submit']").textContent = "Update User Login";
      setView("userAccessSettings");
      showToast(`${account.loginId} ready to edit.`);
    }
  }
  if (toggleUserAccess) {
    const index = Number(toggleUserAccess.dataset.toggleUserAccess);
    const account = userAccessAccounts[index];
    if (account) {
      account.status = account.status === "Active" ? "Disabled" : "Active";
      saveAppState();
      renderUserAccessSettings();
      showToast(`${account.loginId} ${account.status === "Active" ? "enabled" : "disabled"}.`);
    }
  }
  if (deleteUserAccess) {
    const index = Number(deleteUserAccess.dataset.deleteUserAccess);
    const account = userAccessAccounts[index];
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
      saveAppState();
      renderClassTimetable();
      renderTeacherTimetable();
      showToast("Timetable entry deleted.");
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
  if (openFeeBook) {
    const admissionNo = openFeeBook.dataset.openFeeBook;
    const student = findActiveStudentByAdmissionOrName(admissionNo);
    if (!student) {
      showToast("Student is disabled or not found.");
      return;
    }
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
    const student = findActiveStudentByAdmissionNo(admissionNo);
    if (!student) {
      showToast("Student is disabled or not found.");
      return;
    }
    const sourceView = getSourceView(studentFees);
    if ((sourceView === "feeBook" || sourceView === "dueFeesSearch") && feeMonth) {
      openCombinedCollectionPopup(admissionNo, feeMonth);
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
      renderTransportRoutePickupPoints();
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
      renderStudentIdCardModule();
      renderStudentTransportFees();
      renderTransportRoutePickupPoints();
      renderFeeBook();
      showToast(`${student.name} deleted.`);
    }
  }
  if (editFeeMaster) {
    const index = Number(editFeeMaster.dataset.editFeeMaster);
    const item = financeSessions[activeSession].feeMaster[index];
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
    const item = financeSessions[activeSession].feeMaster[index];
    if (item && confirm(`Delete ${item.className} ${item.studentType}?`)) {
      financeSessions[activeSession].feeMaster.splice(index, 1);
      resetFeeMasterEditing();
      feeMasterForm.reset();
      renderFeeMaster();
      saveAppState();
      showToast(`${item.className} ${item.studentType} deleted.`);
    }
  }
  if (editFeeGroup) {
    const index = Number(editFeeGroup.dataset.editFeeGroup);
    const item = financeSessions[activeSession].feeGroups[index];
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
    const item = financeSessions[activeSession].feeGroups[index];
    if (item && confirm(`Delete ${item.groupName}?`)) {
      financeSessions[activeSession].feeGroups.splice(index, 1);
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
      if (deletePaymentByReceipt(admissionNo, receiptNo)) {
        saveAppState();
        renderStudentFeeCounter(admissionNo);
        renderFeeBook(admissionNo);
        renderDueFeesSearch();
        renderFinanceSession();
        showToast(`Receipt ${receiptNo} deleted.`);
      }
    }
  }
  if (module) showToast(`${module.dataset.module} module opened.`);
});

loadAppState();
applyProductionCleanSeedOnce();
setNextReceiptNo();
renderBars();
renderTasks();
renderModules();
renderSessions();
renderFinanceSession();
renderDues();
renderDueFeesSearch();
renderAdmissionEnquiryModule();
renderComplaintsDesk();
if (complaintRegisterForm) complaintRegisterForm.elements.date.value = toDateInputValue(new Date());
if (teacherComplaintForm) teacherComplaintForm.elements.date.value = toDateInputValue(new Date());
renderNoticeBoard();
renderStaffDetails();
renderHrSetup();
renderTeacherIdCardModule();
renderUserAccessSettings();
renderStudentUserLogin();
renderSecurityMaintenance();
updateTopbarSystemStatus();
renderStaffTeachingSubjectField();
renderStaffBiometricDevice();
renderStaffAttendance();
setNextStaffId();
renderStaffPhotoPreview();
renderLearning();
renderTransportVillages();
renderTransportRoutes();
renderTransportVehicles();
renderTransportVehicleAssignments();
renderTransportRoutePickupPoints();
renderStudentTransportFees();
renderTuitionFineSetup();
renderTransportFineSetup();
renderAdmissionVillageTownOptions();
renderAdmissionSectionOptions();
renderFeeMasterClassOptions();
renderClassSectionSetup();
renderStudents();
renderClassTimetable();
renderSyllabusModule();
renderHolidayReport();
renderAnnualCalendar();
renderStudentIdCardModule();
renderDisabledStudents();
renderFeeBookStudentOptions();
renderStudentFeeCounter();
renderFeeBook();
setTopbarNetworkStatus();
if (localStorage.getItem(BACKEND_TOKEN_KEY) && getLoggedInBackendUser()) {
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
