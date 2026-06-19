#!/usr/bin/env python3
import json
import hmac
import os
import secrets
import sqlite3
from datetime import datetime
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import parse_qs, urlparse


ROOT = Path(__file__).resolve().parent
DATA_DIR = Path(os.environ.get("ANPS_ERP_DATA_DIR", ROOT / "anps-erp-data")).resolve()
DATA_DIR.mkdir(parents=True, exist_ok=True)
DB_PATH = Path(os.environ.get("ANPS_ERP_DB", DATA_DIR / "anps_erp.db")).resolve()
BACKUP_DIR = Path(os.environ.get("ANPS_ERP_BACKUP_DIR", DATA_DIR / "backups")).resolve()
BACKUP_DIR.mkdir(parents=True, exist_ok=True)
UPLOAD_DIR = Path(os.environ.get("ANPS_ERP_UPLOAD_DIR", DATA_DIR / "uploads")).resolve()
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
HOST = os.environ.get("ANPS_ERP_HOST", "127.0.0.1")
PORT = int(os.environ.get("ANPS_ERP_PORT") or os.environ.get("PORT") or "4174")
API_TOKEN = os.environ.get("ANPS_ERP_API_TOKEN", "").strip()
ALLOWED_ORIGINS = [
    origin.strip().rstrip("/")
    for origin in os.environ.get("ANPS_ERP_ALLOWED_ORIGINS", "*").split(",")
    if origin.strip()
]
STATE_KEY = "anps_erp_state_v1"
MAX_BODY = 20 * 1024 * 1024
DB_SCHEMA_VERSION = 2
SENSITIVE_STATIC_SUFFIXES = {
    ".db",
    ".db-shm",
    ".db-wal",
    ".sqlite",
    ".sqlite3",
    ".py",
}
SENSITIVE_STATIC_NAMES = {
    "anps-online-export-2026-06-09.json",
    "school_erp.db",
    "school_erp.db-shm",
    "school_erp.db-wal",
    "anps_erp.db",
    "anps_erp.db-shm",
    "anps_erp.db-wal",
    "backend.py",
    "render.yaml",
    "Procfile",
    "requirements.txt",
    "cleanup-test-admissions.html",
    "import-students.html",
}
ALLOWED_STATIC_FILES = {
    "/anps-erp.html",
    "/new-school-os.js",
    "/new-school-os.css",
    "/assets/anps-logo.png",
    "/favicon.ico",
}
LEGACY_STATIC_PREFIXES = (
    "/anps-school-erp-v2-clean/",
    "/old-erp-archive/",
    "/fleet-erp-clean/",
    "/android-school-app/",
    "/android-layerx-mobile-app/",
)


def load_api_token():
    token = API_TOKEN
    if token:
        return token
    token_file = DATA_DIR / ".api_token"
    if token_file.exists():
        return token_file.read_text().strip()
    token = secrets.token_urlsafe(32)
    token_file.write_text(token)
    try:
        token_file.chmod(0o600)
    except OSError:
        pass
    return token


SERVER_TOKEN = load_api_token()
SESSION_TOKENS = {}


def create_session_token(user):
    token = secrets.token_urlsafe(32)
    SESSION_TOKENS[token] = {
        "user": dict(user or {}),
        "created_at": datetime.utcnow().isoformat(timespec="seconds") + "Z",
    }
    return token


def get_session_user(token):
    if token in SESSION_TOKENS:
        return SESSION_TOKENS[token].get("user") or {}
    if token and hmac.compare_digest(token, SERVER_TOKEN):
        return {"username": "system", "full_name": "System", "role_name": "Administrator"}
    return None


def remove_session_token(token):
    if token in SESSION_TOKENS:
        del SESSION_TOKENS[token]


def connect():
    conn = sqlite3.connect(DB_PATH, timeout=20)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode = WAL")
    conn.execute("PRAGMA busy_timeout = 5000")
    conn.execute("PRAGMA foreign_keys = ON")
    return conn


def init_db():
    with connect() as conn:
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS app_state (
                key TEXT PRIMARY KEY,
                value TEXT NOT NULL,
                updated_at TEXT DEFAULT CURRENT_TIMESTAMP
            )
            """
        )
        conn.executescript(
            """
            CREATE TABLE IF NOT EXISTS students (
                admission_no TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                class_name TEXT,
                section TEXT,
                roll_no TEXT,
                father_name TEXT,
                dob TEXT,
                gender TEXT,
                category TEXT,
                mobile TEXT,
                shift TEXT,
                city TEXT,
                session TEXT,
                status TEXT,
                raw_json TEXT NOT NULL,
                updated_at TEXT DEFAULT CURRENT_TIMESTAMP
            );
            CREATE INDEX IF NOT EXISTS idx_students_class_section
                ON students (class_name, section);
            CREATE INDEX IF NOT EXISTS idx_students_name
                ON students (name);

            CREATE TABLE IF NOT EXISTS admission_forms (
                admission_no TEXT PRIMARY KEY,
                form_no TEXT,
                student_name TEXT,
                class_name TEXT,
                section TEXT,
                session TEXT,
                stage TEXT,
                disabled INTEGER DEFAULT 0,
                total_fee INTEGER DEFAULT 0,
                raw_json TEXT NOT NULL,
                updated_at TEXT DEFAULT CURRENT_TIMESTAMP
            );
            CREATE INDEX IF NOT EXISTS idx_admission_session
                ON admission_forms (session, class_name, section);

            CREATE TABLE IF NOT EXISTS fee_receipts (
                receipt_no TEXT PRIMARY KEY,
                admission_no TEXT,
                student_name TEXT,
                class_name TEXT,
                section TEXT,
                fee_head TEXT,
                fee_month TEXT,
                payment_date TEXT,
                entry_date TEXT,
                cash_amount INTEGER DEFAULT 0,
                bank_amount INTEGER DEFAULT 0,
                discount INTEGER DEFAULT 0,
                fine INTEGER DEFAULT 0,
                net_paid INTEGER DEFAULT 0,
                status TEXT,
                raw_json TEXT NOT NULL,
                updated_at TEXT DEFAULT CURRENT_TIMESTAMP
            );
            CREATE INDEX IF NOT EXISTS idx_fee_receipts_student
                ON fee_receipts (admission_no, fee_head, fee_month);
            CREATE INDEX IF NOT EXISTS idx_fee_receipts_date
                ON fee_receipts (payment_date, entry_date);

            CREATE TABLE IF NOT EXISTS classes (
                name TEXT PRIMARY KEY,
                status TEXT,
                raw_json TEXT NOT NULL,
                updated_at TEXT DEFAULT CURRENT_TIMESTAMP
            );
            CREATE TABLE IF NOT EXISTS sections (
                class_name TEXT NOT NULL,
                name TEXT NOT NULL,
                status TEXT,
                raw_json TEXT NOT NULL,
                updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (class_name, name)
            );
            CREATE TABLE IF NOT EXISTS sessions (
                name TEXT PRIMARY KEY,
                status TEXT,
                raw_json TEXT NOT NULL,
                updated_at TEXT DEFAULT CURRENT_TIMESTAMP
            );
            CREATE TABLE IF NOT EXISTS state_backups (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                reason TEXT,
                value TEXT NOT NULL,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS guardians (
                admission_no TEXT PRIMARY KEY,
                father_name TEXT,
                father_mobile TEXT,
                mother_name TEXT,
                mother_mobile TEXT,
                local_guardian_name TEXT,
                local_guardian_mobile TEXT,
                emergency_mobile TEXT,
                raw_json TEXT NOT NULL,
                updated_at TEXT DEFAULT CURRENT_TIMESTAMP
            );
            CREATE INDEX IF NOT EXISTS idx_guardians_mobile
                ON guardians (father_mobile, mother_mobile, local_guardian_mobile);

            CREATE TABLE IF NOT EXISTS staff_members (
                staff_id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                mobile TEXT,
                email TEXT,
                role_name TEXT,
                designation TEXT,
                department TEXT,
                subject TEXT,
                status TEXT,
                raw_json TEXT NOT NULL,
                updated_at TEXT DEFAULT CURRENT_TIMESTAMP
            );
            CREATE INDEX IF NOT EXISTS idx_staff_designation
                ON staff_members (designation, department, status);

            CREATE TABLE IF NOT EXISTS fee_master (
                id TEXT PRIMARY KEY,
                session TEXT,
                class_name TEXT,
                student_type TEXT,
                admission_fee INTEGER DEFAULT 0,
                annual_fee INTEGER DEFAULT 0,
                form_fee INTEGER DEFAULT 0,
                tuition_fee INTEGER DEFAULT 0,
                transport_fee INTEGER DEFAULT 0,
                day_boarding_fee INTEGER DEFAULT 0,
                tiffin_fee INTEGER DEFAULT 0,
                robotics_fee INTEGER DEFAULT 0,
                raw_json TEXT NOT NULL,
                updated_at TEXT DEFAULT CURRENT_TIMESTAMP
            );
            CREATE INDEX IF NOT EXISTS idx_fee_master_class_type
                ON fee_master (session, class_name, student_type);

            CREATE TABLE IF NOT EXISTS fee_groups (
                id TEXT PRIMARY KEY,
                session TEXT,
                group_name TEXT,
                category TEXT,
                description TEXT,
                raw_json TEXT NOT NULL,
                updated_at TEXT DEFAULT CURRENT_TIMESTAMP
            );
            CREATE INDEX IF NOT EXISTS idx_fee_groups_session
                ON fee_groups (session, category);

            CREATE TABLE IF NOT EXISTS fee_payment_allocations (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                receipt_no TEXT NOT NULL,
                admission_no TEXT,
                fee_head TEXT,
                fee_month TEXT,
                amount INTEGER DEFAULT 0,
                is_fine INTEGER DEFAULT 0,
                raw_json TEXT NOT NULL,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP
            );
            CREATE INDEX IF NOT EXISTS idx_fee_allocations_receipt
                ON fee_payment_allocations (receipt_no);
            CREATE INDEX IF NOT EXISTS idx_fee_allocations_student_month
                ON fee_payment_allocations (admission_no, fee_head, fee_month);

            CREATE TABLE IF NOT EXISTS transport_villages (
                village_name TEXT PRIMARY KEY,
                distance_km TEXT,
                new_student_fee INTEGER DEFAULT 0,
                promoted_student_fee INTEGER DEFAULT 0,
                special_student_fee INTEGER DEFAULT 0,
                raw_json TEXT NOT NULL,
                updated_at TEXT DEFAULT CURRENT_TIMESTAMP
            );
            CREATE INDEX IF NOT EXISTS idx_transport_villages_name
                ON transport_villages (village_name);

            CREATE TABLE IF NOT EXISTS transport_routes (
                route_name TEXT PRIMARY KEY,
                description TEXT,
                raw_json TEXT NOT NULL,
                updated_at TEXT DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS transport_vehicles (
                vehicle_no TEXT PRIMARY KEY,
                vehicle_name TEXT,
                driver_name TEXT,
                driver_mobile TEXT,
                raw_json TEXT NOT NULL,
                updated_at TEXT DEFAULT CURRENT_TIMESTAMP
            );
            CREATE INDEX IF NOT EXISTS idx_transport_vehicle_name
                ON transport_vehicles (vehicle_name);

            CREATE TABLE IF NOT EXISTS transport_vehicle_assignments (
                id TEXT PRIMARY KEY,
                route_name TEXT,
                vehicle_no TEXT,
                vehicle_name TEXT,
                trip_shift TEXT,
                driver_name TEXT,
                raw_json TEXT NOT NULL,
                updated_at TEXT DEFAULT CURRENT_TIMESTAMP
            );
            CREATE INDEX IF NOT EXISTS idx_transport_assignments_route_shift
                ON transport_vehicle_assignments (route_name, trip_shift);

            CREATE TABLE IF NOT EXISTS transport_route_pickup_points (
                id TEXT PRIMARY KEY,
                route_name TEXT,
                village_name TEXT,
                trip_shift TEXT,
                pickup_time TEXT,
                sequence_no INTEGER DEFAULT 0,
                raw_json TEXT NOT NULL,
                updated_at TEXT DEFAULT CURRENT_TIMESTAMP
            );
            CREATE INDEX IF NOT EXISTS idx_transport_pickups_route
                ON transport_route_pickup_points (route_name, village_name);

            CREATE TABLE IF NOT EXISTS user_accounts (
                login_id TEXT PRIMARY KEY,
                full_name TEXT,
                role_name TEXT,
                account_type TEXT,
                linked_id TEXT,
                status TEXT,
                raw_json TEXT NOT NULL,
                updated_at TEXT DEFAULT CURRENT_TIMESTAMP
            );
            CREATE INDEX IF NOT EXISTS idx_user_accounts_role
                ON user_accounts (role_name, account_type, status);

            CREATE TABLE IF NOT EXISTS role_permissions (
                role_name TEXT PRIMARY KEY,
                permissions TEXT NOT NULL,
                raw_json TEXT NOT NULL,
                updated_at TEXT DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS notices (
                id TEXT PRIMARY KEY,
                title TEXT,
                audience TEXT,
                notice_date TEXT,
                status TEXT,
                raw_json TEXT NOT NULL,
                updated_at TEXT DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS complaints (
                id TEXT PRIMARY KEY,
                complaint_date TEXT,
                for_type TEXT,
                person_name TEXT,
                category TEXT,
                priority TEXT,
                status TEXT,
                source TEXT,
                raw_json TEXT NOT NULL,
                updated_at TEXT DEFAULT CURRENT_TIMESTAMP
            );
            CREATE INDEX IF NOT EXISTS idx_complaints_status
                ON complaints (status, for_type, priority);

            CREATE TABLE IF NOT EXISTS timetable_entries (
                id TEXT PRIMARY KEY,
                class_name TEXT,
                section TEXT,
                day_name TEXT,
                subject TEXT,
                teacher_name TEXT,
                time_from TEXT,
                time_to TEXT,
                room_no TEXT,
                raw_json TEXT NOT NULL,
                updated_at TEXT DEFAULT CURRENT_TIMESTAMP
            );
            CREATE INDEX IF NOT EXISTS idx_timetable_class_day
                ON timetable_entries (class_name, section, day_name);
            CREATE INDEX IF NOT EXISTS idx_timetable_teacher
                ON timetable_entries (teacher_name, day_name);

            CREATE TABLE IF NOT EXISTS syllabus_entries (
                id TEXT PRIMARY KEY,
                class_name TEXT,
                section TEXT,
                subject TEXT,
                teacher_name TEXT,
                topic TEXT,
                status TEXT,
                raw_json TEXT NOT NULL,
                updated_at TEXT DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS holiday_reports (
                id TEXT PRIMARY KEY,
                holiday_date TEXT,
                name TEXT,
                type TEXT,
                details TEXT,
                raw_json TEXT NOT NULL,
                updated_at TEXT DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS audit_events (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                actor TEXT,
                action TEXT,
                entity_type TEXT,
                entity_id TEXT,
                details TEXT,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS schema_meta (
                key TEXT PRIMARY KEY,
                value TEXT NOT NULL,
                updated_at TEXT DEFAULT CURRENT_TIMESTAMP
            );
            """
        )
        conn.execute(
            """
            INSERT INTO schema_meta (key, value, updated_at)
            VALUES ('schema_version', ?, CURRENT_TIMESTAMP)
            ON CONFLICT(key) DO UPDATE SET
                value = excluded.value,
                updated_at = CURRENT_TIMESTAMP
            """,
            (str(DB_SCHEMA_VERSION),),
        )
        state = read_state()
        if state:
            sync_state_tables(conn, state)


def money(value):
    return int("".join(ch for ch in str(value or "") if ch.isdigit()) or "0")


def full_name(form):
    return " ".join(
        str(form.get(k) or "").strip()
        for k in ("firstName", "middleName", "lastName")
        if str(form.get(k) or "").strip()
    )


def upsert_json_row(conn, table, key_columns, data, values):
    columns = list(values)
    placeholders = ", ".join("?" for _ in columns)
    updates = ", ".join(
        f"{col}=excluded.{col}" for col in columns if col not in key_columns
    )
    sql = f"""
        INSERT INTO {table} ({", ".join(columns)})
        VALUES ({placeholders})
        ON CONFLICT({", ".join(key_columns)}) DO UPDATE SET
            {updates},
            updated_at=CURRENT_TIMESTAMP
    """
    conn.execute(sql, [values[col] for col in columns])


def sync_state_tables(conn, state):
    for table in (
        "students",
        "guardians",
        "admission_forms",
        "fee_receipts",
        "fee_payment_allocations",
        "classes",
        "sections",
        "sessions",
        "staff_members",
        "fee_master",
        "fee_groups",
        "transport_villages",
        "transport_routes",
        "transport_vehicles",
        "transport_vehicle_assignments",
        "transport_route_pickup_points",
        "user_accounts",
        "role_permissions",
        "notices",
        "complaints",
        "timetable_entries",
        "syllabus_entries",
        "holiday_reports",
    ):
        conn.execute(f"DELETE FROM {table}")

    for student in state.get("students", []) or []:
        admission_no = student.get("id") or student.get("admissionNo")
        name = student.get("name") or "Student"
        if not admission_no:
            continue
        class_name = student.get("klass") or student.get("class") or student.get("className") or ""
        guardian_mobile = (
            student.get("guardianMobile")
            or student.get("fatherMobile")
            or student.get("motherMobile")
            or student.get("mobile")
            or ""
        )
        upsert_json_row(
            conn,
            "students",
            ["admission_no"],
            student,
            {
                "admission_no": str(admission_no),
                "name": str(name),
                "class_name": class_name,
                "section": student.get("section") or "",
                "roll_no": str(student.get("rollNo") or ""),
                "father_name": student.get("fatherName") or student.get("guardian") or "",
                "dob": student.get("dob") or "",
                "gender": student.get("gender") or "",
                "category": student.get("category") or "",
                "mobile": str(guardian_mobile),
                "shift": student.get("shift") or "",
                "city": student.get("city") or student.get("villageTown") or "",
                "session": student.get("session") or state.get("selectedSession") or state.get("settings", {}).get("academicYear") or "",
                "status": student.get("status") or ("Disabled" if student.get("disabled") else "Active"),
                "raw_json": json.dumps(student, ensure_ascii=False),
            },
        )
        upsert_json_row(
            conn,
            "guardians",
            ["admission_no"],
            student,
            {
                "admission_no": str(admission_no),
                "father_name": student.get("fatherName") or student.get("guardian") or "",
                "father_mobile": str(student.get("fatherMobile") or ""),
                "mother_name": student.get("motherName") or "",
                "mother_mobile": str(student.get("motherMobile") or ""),
                "local_guardian_name": student.get("localGuardianName") or student.get("guardian") or "",
                "local_guardian_mobile": str(student.get("guardianMobile") or ""),
                "emergency_mobile": str(student.get("emergencyContact") or student.get("emergencyMobile") or ""),
                "raw_json": json.dumps(student, ensure_ascii=False),
            },
        )

    for form in state.get("admissionForms", []) or []:
        admission_no = form.get("admissionNumber")
        if not admission_no:
            continue
        upsert_json_row(
            conn,
            "admission_forms",
            ["admission_no"],
            form,
            {
                "admission_no": str(admission_no),
                "form_no": form.get("formNumber") or "",
                "student_name": full_name(form) or "Admission Student",
                "class_name": form.get("classOfAdmission") or "",
                "section": form.get("section") or "",
                "session": form.get("session") or state.get("selectedSession") or "",
                "stage": form.get("stage") or "",
                "disabled": 1 if form.get("disabled") else 0,
                "total_fee": money(form.get("feeTotal")),
                "raw_json": json.dumps(form, ensure_ascii=False),
            },
        )

    for receipt in state.get("fees", []) or []:
        receipt_no = receipt.get("receipt")
        if not receipt_no:
            continue
        cash = money(receipt.get("cashAmount"))
        bank = money(receipt.get("upiAmount"))
        net = money(receipt.get("amount")) or cash + bank
        upsert_json_row(
            conn,
            "fee_receipts",
            ["receipt_no"],
            receipt,
            {
                "receipt_no": str(receipt_no),
                "admission_no": receipt.get("admissionNo") or "",
                "student_name": receipt.get("student") or "",
                "class_name": receipt.get("klass") or "",
                "section": receipt.get("section") or "",
                "fee_head": receipt.get("term") or "",
                "fee_month": receipt.get("month") or "",
                "payment_date": receipt.get("paymentDate") or receipt.get("date") or "",
                "entry_date": receipt.get("entryDate") or "",
                "cash_amount": cash,
                "bank_amount": bank,
                "discount": money(receipt.get("discount")),
                "fine": money(receipt.get("fine")),
                "net_paid": net,
                "status": receipt.get("status") or "",
                "raw_json": json.dumps(receipt, ensure_ascii=False),
            },
        )

    selected_session = state.get("activeSession") or state.get("selectedSession") or state.get("settings", {}).get("academicYear") or "2026-27"
    collected = state.get("collectedPayments", {}) or {}
    if isinstance(collected, dict):
        for session, student_payments in collected.items():
            if not isinstance(student_payments, dict):
                continue
            for admission_no, payments in student_payments.items():
                student = next(
                    (
                        item
                        for item in state.get("students", []) or []
                        if str(item.get("admissionNo") or item.get("id") or "") == str(admission_no)
                    ),
                    {},
                )
                for payment in payments or []:
                    receipt_no = payment.get("receipt")
                    if not receipt_no:
                        continue
                    allocations = payment.get("allocations") or []
                    fine_total = sum(
                        money(item.get("amount"))
                        for item in allocations
                        if "fine" in str(item.get("head") or "").lower()
                    )
                    net_paid = money(payment.get("amount")) or money(payment.get("bankAmount")) + money(payment.get("cashAmount"))
                    fee_heads = ", ".join(
                        sorted({str(item.get("head") or "") for item in allocations if str(item.get("head") or "").strip()})
                    )
                    fee_months = ", ".join(
                        sorted({str(item.get("month") or "") for item in allocations if str(item.get("month") or "").strip()})
                    )
                    upsert_json_row(
                        conn,
                        "fee_receipts",
                        ["receipt_no"],
                        payment,
                        {
                            "receipt_no": str(receipt_no),
                            "admission_no": str(admission_no),
                            "student_name": student.get("name") or "",
                            "class_name": student.get("klass") or student.get("class") or "",
                            "section": student.get("section") or "",
                            "fee_head": fee_heads,
                            "fee_month": fee_months,
                            "payment_date": payment.get("date") or "",
                            "entry_date": payment.get("date") or "",
                            "cash_amount": money(payment.get("cashAmount")),
                            "bank_amount": money(payment.get("bankAmount")),
                            "discount": money(payment.get("discountAmount")),
                            "fine": fine_total,
                            "net_paid": net_paid,
                            "status": "Paid",
                            "raw_json": json.dumps({**payment, "session": session}, ensure_ascii=False),
                        },
                    )
                    for allocation in allocations:
                        head = str(allocation.get("head") or "")
                        conn.execute(
                            """
                            INSERT INTO fee_payment_allocations
                                (receipt_no, admission_no, fee_head, fee_month, amount, is_fine, raw_json)
                            VALUES (?, ?, ?, ?, ?, ?, ?)
                            """,
                            (
                                str(receipt_no),
                                str(admission_no),
                                head,
                                allocation.get("month") or "",
                                money(allocation.get("amount")),
                                1 if "fine" in head.lower() else 0,
                                json.dumps({**allocation, "session": session}, ensure_ascii=False),
                            ),
                        )

    finance_sessions = state.get("financeSessions", {}) or {}
    if isinstance(finance_sessions, dict):
        for session, session_data in finance_sessions.items():
            if not isinstance(session_data, dict):
                continue
            for index, item in enumerate(session_data.get("feeMaster", []) or []):
                row_id = f"{session}:{item.get('className') or item.get('class') or index}:{item.get('studentType') or ''}"
                upsert_json_row(
                    conn,
                    "fee_master",
                    ["id"],
                    item,
                    {
                        "id": row_id,
                        "session": session,
                        "class_name": item.get("className") or item.get("class") or "",
                        "student_type": item.get("studentType") or "",
                        "admission_fee": money(item.get("admissionFee")),
                        "annual_fee": money(item.get("annualFee")),
                        "form_fee": money(item.get("formFee")),
                        "tuition_fee": money(item.get("tuitionFee") or item.get("monthlyTuitionFee")),
                        "transport_fee": money(item.get("transportFee")),
                        "day_boarding_fee": money(item.get("dayBoardingFee")),
                        "tiffin_fee": money(item.get("tiffinFee") or item.get("tiffinLunchOtherFee")),
                        "robotics_fee": money(item.get("roboticsFee")),
                        "raw_json": json.dumps(item, ensure_ascii=False),
                    },
                )
            for index, item in enumerate(session_data.get("feeGroups", []) or []):
                row_id = f"{session}:{item.get('groupName') or index}"
                upsert_json_row(
                    conn,
                    "fee_groups",
                    ["id"],
                    item,
                    {
                        "id": row_id,
                        "session": session,
                        "group_name": item.get("groupName") or "",
                        "category": item.get("category") or "",
                        "description": item.get("description") or "",
                        "raw_json": json.dumps(item, ensure_ascii=False),
                    },
                )

    for item in state.get("classes", []) or []:
        name = item.get("name")
        if name:
            upsert_json_row(
                conn,
                "classes",
                ["name"],
                item,
                {"name": name, "status": item.get("status") or "Active", "raw_json": json.dumps(item, ensure_ascii=False)},
            )

    for class_name in state.get("customAdmissionClasses", []) or []:
        if class_name:
            upsert_json_row(
                conn,
                "classes",
                ["name"],
                {"name": class_name, "status": "Active"},
                {"name": str(class_name), "status": "Active", "raw_json": json.dumps({"name": class_name}, ensure_ascii=False)},
            )

    for section_name in state.get("customAdmissionSections", []) or []:
        if section_name:
            upsert_json_row(
                conn,
                "sections",
                ["class_name", "name"],
                {"class_name": "", "name": section_name, "status": "Active"},
                {"class_name": "", "name": str(section_name), "status": "Active", "raw_json": json.dumps({"name": section_name}, ensure_ascii=False)},
            )

    for item in state.get("sections", []) or []:
        klass = item.get("klass") or item.get("class") or ""
        name = item.get("name") or ""
        if klass and name:
            upsert_json_row(
                conn,
                "sections",
                ["class_name", "name"],
                item,
                {"class_name": klass, "name": name, "status": item.get("status") or "Active", "raw_json": json.dumps(item, ensure_ascii=False)},
            )

    for item in state.get("sessions", []) or []:
        name = item.get("name")
        if name:
            upsert_json_row(
                conn,
                "sessions",
                ["name"],
                item,
                {"name": name, "status": item.get("status") or "Active", "raw_json": json.dumps(item, ensure_ascii=False)},
            )

    if selected_session:
        upsert_json_row(
            conn,
            "sessions",
            ["name"],
            {"name": selected_session, "status": "Active"},
            {"name": str(selected_session), "status": "Active", "raw_json": json.dumps({"name": selected_session}, ensure_ascii=False)},
        )

    for item in state.get("staffMembers", []) or state.get("staff", []) or []:
        staff_id = item.get("staffId") or item.get("id") or item.get("staff_id")
        name = item.get("name") or item.get("staffName") or ""
        if not staff_id and name:
            staff_id = f"STAFF-{abs(hash(name)) % 100000}"
        if not staff_id:
            continue
        upsert_json_row(
            conn,
            "staff_members",
            ["staff_id"],
            item,
            {
                "staff_id": str(staff_id),
                "name": str(name or staff_id),
                "mobile": str(item.get("mobile") or item.get("phone") or ""),
                "email": item.get("email") or "",
                "role_name": item.get("role") or item.get("roleName") or "",
                "designation": item.get("designation") or "",
                "department": item.get("department") or "",
                "subject": item.get("teachingSubject") or item.get("subject") or "",
                "status": item.get("status") or ("Disabled" if item.get("disabled") else "Active"),
                "raw_json": json.dumps(item, ensure_ascii=False),
            },
        )

    village_distances = state.get("transportVillageDistances", {}) or {}
    village_fees = state.get("transportVillageFees", {}) or {}
    for village_name in state.get("transportVillages", []) or []:
        fees = village_fees.get(village_name, {}) if isinstance(village_fees, dict) else {}
        row = {"villageName": village_name, **(fees if isinstance(fees, dict) else {})}
        upsert_json_row(
            conn,
            "transport_villages",
            ["village_name"],
            row,
            {
                "village_name": str(village_name),
                "distance_km": str(village_distances.get(village_name) or "") if isinstance(village_distances, dict) else "",
                "new_student_fee": money(fees.get("newStudentFee") or fees.get("new_student_fee")),
                "promoted_student_fee": money(fees.get("promotedStudentFee") or fees.get("promoted_student_fee")),
                "special_student_fee": money(fees.get("specialStudentFee") or fees.get("special_student_fee")),
                "raw_json": json.dumps(row, ensure_ascii=False),
            },
        )

    for index, item in enumerate(state.get("transportRoutes", []) or []):
        route_name = item.get("routeName") or item.get("name") or ""
        if not route_name:
            continue
        upsert_json_row(
            conn,
            "transport_routes",
            ["route_name"],
            item,
            {
                "route_name": str(route_name),
                "description": item.get("description") or item.get("remarks") or "",
                "raw_json": json.dumps(item, ensure_ascii=False),
            },
        )

    for item in state.get("transportVehicles", []) or []:
        vehicle_no = item.get("vehicleNo") or item.get("vehicleNumber") or item.get("number")
        if not vehicle_no:
            continue
        upsert_json_row(
            conn,
            "transport_vehicles",
            ["vehicle_no"],
            item,
            {
                "vehicle_no": str(vehicle_no),
                "vehicle_name": item.get("vehicleName") or item.get("name") or "",
                "driver_name": item.get("driverName") or "",
                "driver_mobile": str(item.get("driverMobile") or item.get("driverNumber") or ""),
                "raw_json": json.dumps(item, ensure_ascii=False),
            },
        )

    for index, item in enumerate(state.get("transportVehicleAssignments", []) or []):
        row_id = str(item.get("id") or f"{item.get('routeName') or ''}:{item.get('vehicleNo') or ''}:{item.get('shift') or item.get('tripShift') or index}")
        upsert_json_row(
            conn,
            "transport_vehicle_assignments",
            ["id"],
            item,
            {
                "id": row_id,
                "route_name": item.get("routeName") or "",
                "vehicle_no": item.get("vehicleNo") or "",
                "vehicle_name": item.get("vehicleName") or "",
                "trip_shift": item.get("shift") or item.get("tripShift") or "",
                "driver_name": item.get("driverName") or "",
                "raw_json": json.dumps(item, ensure_ascii=False),
            },
        )

    for index, item in enumerate(state.get("transportRoutePickupPoints", []) or []):
        row_id = str(item.get("id") or f"{item.get('routeName') or ''}:{item.get('villageName') or ''}:{item.get('shift') or item.get('tripShift') or ''}:{index}")
        upsert_json_row(
            conn,
            "transport_route_pickup_points",
            ["id"],
            item,
            {
                "id": row_id,
                "route_name": item.get("routeName") or "",
                "village_name": item.get("villageName") or item.get("pickupPoint") or "",
                "trip_shift": item.get("shift") or item.get("tripShift") or "",
                "pickup_time": item.get("pickupTime") or item.get("time") or "",
                "sequence_no": money(item.get("sequence") or item.get("sequenceNo")),
                "raw_json": json.dumps(item, ensure_ascii=False),
            },
        )

    for item in state.get("userAccessAccounts", []) or state.get("authUsers", []) or []:
        login_id = item.get("loginId") or item.get("id") or item.get("username")
        if not login_id:
            continue
        upsert_json_row(
            conn,
            "user_accounts",
            ["login_id"],
            item,
            {
                "login_id": str(login_id),
                "full_name": item.get("name") or item.get("fullName") or "",
                "role_name": item.get("role") or item.get("roleName") or "",
                "account_type": "staff",
                "linked_id": item.get("staffId") or "",
                "status": item.get("status") or "Active",
                "raw_json": json.dumps(item, ensure_ascii=False),
            },
        )

    for item in state.get("studentUserAccounts", []) or []:
        login_id = item.get("loginId") or item.get("id")
        if not login_id:
            continue
        upsert_json_row(
            conn,
            "user_accounts",
            ["login_id"],
            item,
            {
                "login_id": str(login_id),
                "full_name": item.get("studentName") or item.get("name") or "",
                "role_name": "Student",
                "account_type": "student",
                "linked_id": item.get("admissionNo") or "",
                "status": item.get("status") or "Active",
                "raw_json": json.dumps(item, ensure_ascii=False),
            },
        )

    permissions = state.get("rolePermissions", {}) or {}
    if isinstance(permissions, dict):
        for role_name, role_permission in permissions.items():
            upsert_json_row(
                conn,
                "role_permissions",
                ["role_name"],
                {"role": role_name, "permissions": role_permission},
                {
                    "role_name": str(role_name),
                    "permissions": json.dumps(role_permission, ensure_ascii=False),
                    "raw_json": json.dumps({"role": role_name, "permissions": role_permission}, ensure_ascii=False),
                },
            )

    for index, item in enumerate(state.get("notices", []) or []):
        row_id = str(item.get("id") or item.get("noticeId") or f"notice-{index}")
        upsert_json_row(
            conn,
            "notices",
            ["id"],
            item,
            {
                "id": row_id,
                "title": item.get("title") or "",
                "audience": item.get("audience") or "",
                "notice_date": item.get("date") or "",
                "status": item.get("status") or "",
                "raw_json": json.dumps(item, ensure_ascii=False),
            },
        )

    for index, item in enumerate(state.get("complaintRecords", []) or []):
        row_id = str(item.get("id") or f"complaint-{index}")
        upsert_json_row(
            conn,
            "complaints",
            ["id"],
            item,
            {
                "id": row_id,
                "complaint_date": item.get("date") or "",
                "for_type": item.get("forType") or item.get("type") or "",
                "person_name": item.get("personName") or "",
                "category": item.get("category") or "",
                "priority": item.get("priority") or "",
                "status": item.get("status") or "",
                "source": item.get("source") or "",
                "raw_json": json.dumps(item, ensure_ascii=False),
            },
        )

    for index, item in enumerate(state.get("classTimetableEntries", []) or []):
        row_id = str(item.get("id") or f"timetable-{index}")
        upsert_json_row(
            conn,
            "timetable_entries",
            ["id"],
            item,
            {
                "id": row_id,
                "class_name": item.get("className") or item.get("class") or "",
                "section": item.get("section") or "",
                "day_name": item.get("day") or item.get("dayName") or "",
                "subject": item.get("subject") or "",
                "teacher_name": item.get("teacher") or item.get("teacherName") or "",
                "time_from": item.get("timeFrom") or item.get("from") or "",
                "time_to": item.get("timeTo") or item.get("to") or "",
                "room_no": item.get("roomNo") or "",
                "raw_json": json.dumps(item, ensure_ascii=False),
            },
        )

    for index, item in enumerate(state.get("syllabusEntries", []) or []):
        row_id = str(item.get("id") or f"syllabus-{index}")
        upsert_json_row(
            conn,
            "syllabus_entries",
            ["id"],
            item,
            {
                "id": row_id,
                "class_name": item.get("className") or item.get("class") or "",
                "section": item.get("section") or "",
                "subject": item.get("subject") or "",
                "teacher_name": item.get("teacher") or item.get("teacherName") or "",
                "topic": item.get("topic") or item.get("title") or "",
                "status": item.get("status") or "",
                "raw_json": json.dumps(item, ensure_ascii=False),
            },
        )

    for index, item in enumerate(state.get("holidayReports", []) or []):
        row_id = str(item.get("id") or f"holiday-{index}")
        upsert_json_row(
            conn,
            "holiday_reports",
            ["id"],
            item,
            {
                "id": row_id,
                "holiday_date": item.get("date") or "",
                "name": item.get("name") or "",
                "type": item.get("type") or "",
                "details": item.get("details") or "",
                "raw_json": json.dumps(item, ensure_ascii=False),
            },
        )


def read_state():
    record = read_state_record()
    return record["state"] if record else None


def read_state_record():
    with connect() as conn:
        row = conn.execute("SELECT value, updated_at FROM app_state WHERE key = ?", (STATE_KEY,)).fetchone()
    if not row:
        return None
    return {
        "state": json.loads(row["value"]),
        "updated_at": row["updated_at"],
    }


def verify_login(username, password):
    state = read_state() or fresh_state()
    wanted = str(username or "").strip()
    supplied = str(password or "")
    for user in state.get("authUsers", []) or []:
        if str(user.get("id") or "").strip() != wanted:
            continue
        if user.get("status") != "Active":
            return None
        if hmac.compare_digest(str(user.get("password") or ""), supplied):
            return {
                "username": user.get("id"),
                "full_name": user.get("name") or user.get("id"),
                "role_name": user.get("role") or "Administrator",
            }
    for user in state.get("userAccessAccounts", []) or []:
        login_id = str(user.get("loginId") or user.get("id") or user.get("username") or "").strip()
        if login_id != wanted:
            continue
        if user.get("status") != "Active":
            return None
        if hmac.compare_digest(str(user.get("password") or ""), supplied):
            return {
                "username": login_id,
                "full_name": user.get("staffName") or user.get("name") or login_id,
                "role_name": user.get("role") or "Staff",
            }
    for user in state.get("studentUserAccounts", []) or []:
        login_id = str(user.get("loginId") or user.get("id") or "").strip()
        if login_id != wanted:
            continue
        if user.get("status") != "Active":
            return None
        if hmac.compare_digest(str(user.get("password") or ""), supplied):
            return {
                "username": login_id,
                "full_name": user.get("studentName") or user.get("name") or login_id,
                "role_name": "Student",
            }
    if wanted == "admin" and hmac.compare_digest(supplied, "admin123"):
        return {
            "username": "admin",
            "full_name": "Administrator",
            "role_name": "Administrator",
        }
    return None


def write_state(value):
    raw = json.dumps(value, ensure_ascii=False, separators=(",", ":"))
    with connect() as conn:
        conn.execute(
            "INSERT INTO state_backups (reason, value) VALUES (?, ?)",
            (f"auto-save {datetime.now().isoformat(timespec='seconds')}", raw),
        )
        conn.execute(
            """
            DELETE FROM state_backups
            WHERE id NOT IN (
                SELECT id FROM state_backups
                ORDER BY id DESC
                LIMIT 50
            )
            """
        )
        conn.execute(
            """
            INSERT INTO app_state (key, value, updated_at)
            VALUES (?, ?, CURRENT_TIMESTAMP)
            ON CONFLICT(key) DO UPDATE SET
                value = excluded.value,
                updated_at = CURRENT_TIMESTAMP
            """,
            (STATE_KEY, raw),
        )
        sync_state_tables(conn, value)
        state_row = conn.execute("SELECT updated_at FROM app_state WHERE key = ?", (STATE_KEY,)).fetchone()
        conn.execute(
            """
            INSERT INTO audit_events (actor, action, entity_type, entity_id, details)
            VALUES (?, ?, ?, ?, ?)
            """,
            (
                value.get("role") or "system",
                "Save",
                "app_state",
                STATE_KEY,
                f"{len(raw)} bytes synced",
            ),
        )
    return state_row["updated_at"] if state_row else None


def table_rows(table, limit=500):
    allowed = {
        "students",
        "guardians",
        "admission_forms",
        "fee_receipts",
        "fee_payment_allocations",
        "classes",
        "sections",
        "sessions",
        "staff_members",
        "fee_master",
        "fee_groups",
        "transport_villages",
        "transport_routes",
        "transport_vehicles",
        "transport_vehicle_assignments",
        "transport_route_pickup_points",
        "user_accounts",
        "role_permissions",
        "notices",
        "complaints",
        "timetable_entries",
        "syllabus_entries",
        "holiday_reports",
        "audit_events",
    }
    if table not in allowed:
        raise ValueError("Unknown table")
    with connect() as conn:
        rows = conn.execute(f"SELECT * FROM {table} LIMIT ?", (limit,)).fetchall()
    return [dict(row) for row in rows]


def query_params(path):
    return parse_qs(urlparse(path).query)


def first_query_value(params, name, default=""):
    value = params.get(name, [default])
    return str(value[0] if value else default).strip()


def bounded_int(value, default=100, minimum=0, maximum=500):
    try:
        number = int(value)
    except (TypeError, ValueError):
        number = default
    return max(minimum, min(maximum, number))


def paged_query(base_sql, params=None, count_sql=None, count_params=None, limit=100, offset=0):
    params = list(params or [])
    limit = bounded_int(limit, default=100, minimum=1, maximum=500)
    offset = bounded_int(offset, default=0, minimum=0, maximum=1000000)
    with connect() as conn:
        rows = conn.execute(f"{base_sql} LIMIT ? OFFSET ?", [*params, limit, offset]).fetchall()
        if count_sql:
            total = conn.execute(count_sql, count_params if count_params is not None else params).fetchone()[0]
        else:
            total = len(rows)
    return {
        "rows": [dict(row) for row in rows],
        "limit": limit,
        "offset": offset,
        "total": total,
        "has_more": offset + limit < total,
    }


def list_students(params):
    filters = []
    values = []
    search = first_query_value(params, "search")
    class_name = first_query_value(params, "class")
    section = first_query_value(params, "section")
    status = first_query_value(params, "status")
    if search:
        like = f"%{search.lower()}%"
        filters.append(
            """
            (
                lower(s.admission_no) LIKE ?
                OR lower(s.name) LIKE ?
                OR lower(s.city) LIKE ?
                OR lower(COALESCE(g.father_name, '')) LIKE ?
                OR lower(COALESCE(g.mother_name, '')) LIKE ?
                OR lower(COALESCE(g.local_guardian_name, '')) LIKE ?
            )
            """
        )
        values.extend([like, like, like, like, like, like])
    if class_name:
        filters.append("s.class_name = ?")
        values.append(class_name)
    if section:
        filters.append("s.section = ?")
        values.append(section)
    if status:
        filters.append("COALESCE(s.status, '') = ?")
        values.append(status)
    where = f"WHERE {' AND '.join(filters)}" if filters else ""
    sql = f"""
        SELECT
            s.admission_no,
            s.name,
            s.class_name,
            s.section,
            s.roll_no,
            s.gender,
            s.mobile,
            s.city AS village_town,
            s.status,
            g.father_name,
            g.father_mobile,
            g.mother_name,
            g.mother_mobile,
            g.local_guardian_name,
            g.local_guardian_mobile
        FROM students s
        LEFT JOIN guardians g ON g.admission_no = s.admission_no
        {where}
        ORDER BY s.class_name COLLATE NOCASE, s.section COLLATE NOCASE, s.name COLLATE NOCASE
    """
    count_sql = f"SELECT COUNT(*) FROM students s LEFT JOIN guardians g ON g.admission_no = s.admission_no {where}"
    return paged_query(sql, values, count_sql, values, first_query_value(params, "limit", "100"), first_query_value(params, "offset", "0"))


def list_fee_receipts(params):
    filters = []
    values = []
    search = first_query_value(params, "search")
    date_from = first_query_value(params, "from")
    date_to = first_query_value(params, "to")
    fee_head = first_query_value(params, "fee_head")
    fee_month = first_query_value(params, "month")
    if search:
        like = f"%{search.lower()}%"
        filters.append("(lower(receipt_no) LIKE ? OR lower(admission_no) LIKE ? OR lower(student_name) LIKE ?)")
        values.extend([like, like, like])
    if date_from:
        filters.append("payment_date >= ?")
        values.append(date_from)
    if date_to:
        filters.append("payment_date <= ?")
        values.append(date_to)
    if fee_head:
        filters.append("fee_head LIKE ?")
        values.append(f"%{fee_head}%")
    if fee_month:
        filters.append("fee_month LIKE ?")
        values.append(f"%{fee_month}%")
    where = f"WHERE {' AND '.join(filters)}" if filters else ""
    sql = f"""
        SELECT *
        FROM fee_receipts
        {where}
        ORDER BY updated_at DESC, receipt_no DESC
    """
    count_sql = f"SELECT COUNT(*) FROM fee_receipts {where}"
    return paged_query(sql, values, count_sql, values, first_query_value(params, "limit", "100"), first_query_value(params, "offset", "0"))


def list_transport_students(params):
    route_name = first_query_value(params, "route")
    village_name = first_query_value(params, "village")
    filters = ["COALESCE(s.status, '') NOT IN ('Disabled', 'Inactive')"]
    values = []
    if village_name:
        filters.append("s.city = ?")
        values.append(village_name)
    if route_name:
        filters.append("rp.route_name = ?")
        values.append(route_name)
    where = f"WHERE {' AND '.join(filters)}"
    sql = f"""
        SELECT DISTINCT
            s.admission_no,
            s.name,
            s.class_name,
            s.section,
            s.city AS village_town,
            rp.route_name,
            rp.trip_shift,
            va.vehicle_name
        FROM students s
        LEFT JOIN transport_route_pickup_points rp ON rp.village_name = s.city
        LEFT JOIN transport_vehicle_assignments va ON va.route_name = rp.route_name AND va.trip_shift = rp.trip_shift
        {where}
        ORDER BY rp.route_name COLLATE NOCASE, s.city COLLATE NOCASE, s.name COLLATE NOCASE
    """
    count_sql = f"""
        SELECT COUNT(DISTINCT s.admission_no)
        FROM students s
        LEFT JOIN transport_route_pickup_points rp ON rp.village_name = s.city
        LEFT JOIN transport_vehicle_assignments va ON va.route_name = rp.route_name AND va.trip_shift = rp.trip_shift
        {where}
    """
    return paged_query(sql, values, count_sql, values, first_query_value(params, "limit", "100"), first_query_value(params, "offset", "0"))


def list_staff(params):
    filters = []
    values = []
    search = first_query_value(params, "search")
    designation = first_query_value(params, "designation")
    department = first_query_value(params, "department")
    status = first_query_value(params, "status")
    if search:
        like = f"%{search.lower()}%"
        filters.append("(lower(staff_id) LIKE ? OR lower(name) LIKE ? OR lower(mobile) LIKE ? OR lower(email) LIKE ?)")
        values.extend([like, like, like, like])
    if designation:
        filters.append("designation = ?")
        values.append(designation)
    if department:
        filters.append("department = ?")
        values.append(department)
    if status:
        filters.append("status = ?")
        values.append(status)
    where = f"WHERE {' AND '.join(filters)}" if filters else ""
    sql = f"SELECT * FROM staff_members {where} ORDER BY name COLLATE NOCASE"
    count_sql = f"SELECT COUNT(*) FROM staff_members {where}"
    return paged_query(sql, values, count_sql, values, first_query_value(params, "limit", "100"), first_query_value(params, "offset", "0"))


def module_report(params):
    month = first_query_value(params, "month")
    with connect() as conn:
        data = {
            "students": conn.execute("SELECT COUNT(*) FROM students WHERE COALESCE(status, '') NOT IN ('Disabled', 'Inactive')").fetchone()[0],
            "staff": conn.execute("SELECT COUNT(*) FROM staff_members WHERE COALESCE(status, '') NOT IN ('Disabled', 'Inactive')").fetchone()[0],
            "receipts": conn.execute("SELECT COUNT(*) FROM fee_receipts").fetchone()[0],
            "bank": conn.execute("SELECT COALESCE(SUM(bank_amount), 0) FROM fee_receipts").fetchone()[0],
            "cash": conn.execute("SELECT COALESCE(SUM(cash_amount), 0) FROM fee_receipts").fetchone()[0],
            "fine": conn.execute("SELECT COALESCE(SUM(fine), 0) FROM fee_receipts").fetchone()[0],
            "total": conn.execute("SELECT COALESCE(SUM(net_paid), 0) FROM fee_receipts").fetchone()[0],
        }
        if month:
            data["month"] = month
            data["month_total"] = conn.execute(
                "SELECT COALESCE(SUM(net_paid), 0) FROM fee_receipts WHERE fee_month LIKE ?",
                (f"%{month}%",),
            ).fetchone()[0]
    return data


def effective_student_list_count(conn):
    form_names = {
        str(row["student_name"] or "").strip().lower()
        for row in conn.execute("SELECT student_name FROM admission_forms WHERE disabled = 0").fetchall()
        if str(row["student_name"] or "").strip()
    }
    active_forms = conn.execute("SELECT COUNT(*) FROM admission_forms WHERE disabled = 0").fetchone()[0]
    standalone_students = 0
    for row in conn.execute("SELECT name FROM students").fetchall():
        name = str(row["name"] or "").strip().lower()
        if name and name in form_names:
            continue
        standalone_students += 1
    return active_forms + standalone_students


def summary():
    with connect() as conn:
        tables = {}
        for table in (
            "students",
            "guardians",
            "admission_forms",
            "fee_receipts",
            "fee_payment_allocations",
            "classes",
            "sections",
            "sessions",
            "staff_members",
            "fee_master",
            "fee_groups",
            "transport_villages",
            "transport_routes",
            "transport_vehicles",
            "transport_vehicle_assignments",
            "transport_route_pickup_points",
            "user_accounts",
            "role_permissions",
            "notices",
            "complaints",
            "timetable_entries",
            "syllabus_entries",
            "holiday_reports",
            "audit_events",
        ):
            tables[table] = conn.execute(f"SELECT COUNT(*) FROM {table}").fetchone()[0]
        raw_tables = dict(tables)
        effective_students = effective_student_list_count(conn)
        active_admissions = conn.execute(
            "SELECT COUNT(*) FROM admission_forms WHERE disabled = 0"
        ).fetchone()[0]
        disabled_admissions = raw_tables["admission_forms"] - active_admissions
        fee_total = conn.execute(
            "SELECT COALESCE(SUM(net_paid), 0) FROM fee_receipts"
        ).fetchone()[0]
        fine_total = conn.execute(
            "SELECT COALESCE(SUM(fine), 0) FROM fee_receipts"
        ).fetchone()[0]
        bank_total = conn.execute(
            "SELECT COALESCE(SUM(bank_amount), 0) FROM fee_receipts"
        ).fetchone()[0]
        cash_total = conn.execute(
            "SELECT COALESCE(SUM(cash_amount), 0) FROM fee_receipts"
        ).fetchone()[0]
        schema_row = conn.execute(
            "SELECT value FROM schema_meta WHERE key = 'schema_version'"
        ).fetchone()
        tables["students"] = effective_students
        tables["admission_forms"] = active_admissions
        state = conn.execute("SELECT length(value) size, updated_at FROM app_state WHERE key = ?", (STATE_KEY,)).fetchone()
    return {
        "ok": True,
        "database": str(DB_PATH),
        "tables": tables,
        "raw_tables": raw_tables,
        "dashboard": {
            "students": effective_students,
            "admissions": active_admissions,
            "disabled_admissions": disabled_admissions,
            "fee_receipts": raw_tables["fee_receipts"],
            "fees_collected": fee_total or 0,
            "bank_collected": bank_total or 0,
            "cash_collected": cash_total or 0,
            "fine_collected": fine_total or 0,
        },
        "schema": {
            "version": schema_row["value"] if schema_row else str(DB_SCHEMA_VERSION),
            "module_tables": len(tables),
        },
        "state_size": state["size"] if state else 0,
        "updated_at": state["updated_at"] if state else None,
    }


def schema_tables():
    return [
        "students",
        "guardians",
        "admission_forms",
        "fee_receipts",
        "fee_payment_allocations",
        "classes",
        "sections",
        "sessions",
        "staff_members",
        "fee_master",
        "fee_groups",
        "transport_villages",
        "transport_routes",
        "transport_vehicles",
        "transport_vehicle_assignments",
        "transport_route_pickup_points",
        "user_accounts",
        "role_permissions",
        "notices",
        "complaints",
        "timetable_entries",
        "syllabus_entries",
        "holiday_reports",
        "audit_events",
        "state_backups",
        "schema_meta",
    ]


def validate_database():
    issues = []
    with connect() as conn:
        table_rows_found = {
            row["name"]
            for row in conn.execute(
                "SELECT name FROM sqlite_master WHERE type='table'"
            ).fetchall()
        }
        for table in schema_tables():
            if table not in table_rows_found:
                issues.append({"level": "error", "module": "schema", "message": f"Missing table: {table}"})

        duplicate_receipts = conn.execute(
            """
            SELECT receipt_no, COUNT(*) count
            FROM fee_receipts
            GROUP BY receipt_no
            HAVING COUNT(*) > 1
            """
        ).fetchall()
        for row in duplicate_receipts:
            issues.append({"level": "error", "module": "fees", "message": f"Duplicate receipt: {row['receipt_no']}"})

        orphan_allocations = conn.execute(
            """
            SELECT COUNT(*) count
            FROM fee_payment_allocations a
            LEFT JOIN fee_receipts r ON r.receipt_no = a.receipt_no
            WHERE r.receipt_no IS NULL
            """
        ).fetchone()["count"]
        if orphan_allocations:
            issues.append({"level": "error", "module": "fees", "message": f"{orphan_allocations} receipt allocation rows have no receipt"})

        active_students = conn.execute(
            "SELECT COUNT(*) count FROM students WHERE COALESCE(status, '') NOT IN ('Disabled', 'Inactive')"
        ).fetchone()["count"]
        staff_count = conn.execute("SELECT COUNT(*) count FROM staff_members").fetchone()["count"]
        fee_master_count = conn.execute("SELECT COUNT(*) count FROM fee_master").fetchone()["count"]
        user_count = conn.execute("SELECT COUNT(*) count FROM user_accounts").fetchone()["count"]
        backup_count = conn.execute("SELECT COUNT(*) count FROM state_backups").fetchone()["count"]
        village_count = conn.execute("SELECT COUNT(*) count FROM transport_villages").fetchone()["count"]

    if active_students == 0:
        issues.append({"level": "warning", "module": "setup", "message": "No active student records yet"})
    if staff_count == 0:
        issues.append({"level": "warning", "module": "setup", "message": "No staff records yet"})
    if fee_master_count == 0:
        issues.append({"level": "warning", "module": "setup", "message": "No fee master structure yet"})
    if user_count == 0:
        issues.append({"level": "warning", "module": "security", "message": "No role-based user accounts synced yet"})
    if backup_count == 0:
        issues.append({"level": "warning", "module": "backup", "message": "No backup created yet"})
    if village_count == 0:
        issues.append({"level": "warning", "module": "transport", "message": "No pickup point villages synced yet"})

    totals = {
        "errors": sum(1 for issue in issues if issue["level"] == "error"),
        "warnings": sum(1 for issue in issues if issue["level"] == "warning"),
        "issues": len(issues),
    }
    return {"ok": totals["errors"] == 0, "totals": totals, "issues": issues}


def readiness_report():
    validation = validate_database()
    blockers = [issue for issue in validation["issues"] if issue["level"] == "error"]
    warnings = [issue for issue in validation["issues"] if issue["level"] == "warning"]
    return {
        "ready": not blockers,
        "blockers": blockers,
        "warnings": warnings,
        "database": str(DB_PATH),
        "schema_version": str(DB_SCHEMA_VERSION),
    }


def audit_log(limit=100):
    with connect() as conn:
        rows = conn.execute(
            """
            SELECT *
            FROM audit_events
            ORDER BY id DESC
            LIMIT ?
            """,
            (limit,),
        ).fetchall()
    return [dict(row) for row in rows]


def record_audit(action, entity_type="", entity_id="", actor="", details=""):
    with connect() as conn:
        conn.execute(
            """
            INSERT INTO audit_events (actor, action, entity_type, entity_id, details)
            VALUES (?, ?, ?, ?, ?)
            """,
            (actor, action, entity_type, entity_id, details),
        )


def backup_state(reason="manual"):
    state = read_state()
    if state is None:
        return {"ok": False, "error": "No state to backup"}
    raw = json.dumps(state, ensure_ascii=False, separators=(",", ":"))
    with connect() as conn:
        cur = conn.execute("INSERT INTO state_backups (reason, value) VALUES (?, ?)", (reason, raw))
        backup_id = cur.lastrowid
        conn.execute(
            """
            INSERT INTO audit_events (actor, action, entity_type, entity_id, details)
            VALUES (?, ?, ?, ?, ?)
            """,
            ("system", "Backup", "state_backup", str(backup_id), reason),
        )
    stamp = datetime.now().strftime("%Y%m%d-%H%M%S")
    target = BACKUP_DIR / f"anps-state-{stamp}-{backup_id}.json"
    target.write_text(json.dumps({"state": state, "backup_id": backup_id, "reason": reason}, ensure_ascii=False, indent=2))
    return {"ok": True, "backup_id": backup_id, "file": str(target), "created_at": datetime.now().isoformat(timespec="seconds")}


def clear_state_backups():
    with connect() as conn:
        deleted_rows = conn.execute("SELECT COUNT(*) FROM state_backups").fetchone()[0]
        conn.execute("DELETE FROM state_backups")
    deleted_files = 0
    for path in BACKUP_DIR.glob("anps-state-*.json"):
        if path.is_file():
            path.unlink()
            deleted_files += 1
    return {"deleted_rows": deleted_rows, "deleted_files": deleted_files}


def fresh_state():
    return {
        "students": [],
        "attendance": [],
        "fees": [],
        "pipeline": [],
        "messages": [],
        "staff": [],
        "periods": [],
        "routes": [],
        "exams": [],
        "books": [],
        "health": [],
        "events": [],
        "documents": [],
        "certificates": [],
        "hostel": [],
        "meals": [],
        "stock": [],
        "users": [],
        "permissions": [],
        "backups": [],
        "tickets": [],
        "alumni": [],
        "surveys": [],
        "scholarships": [],
        "behaviour": [],
        "assets": [],
        "lessons": [],
        "homework": [],
        "substitutions": [],
        "payroll": [],
        "vendors": [],
        "ledger": [],
        "meetings": [],
        "clubs": [],
        "trips": [],
        "alerts": [],
        "notifications": [],
        "compliance": [],
        "elibrary": [],
        "digitalContent": [],
        "devices": [],
        "learningProgress": [],
        "canteenMenu": [],
        "canteenOrders": [],
        "classes": [],
        "sections": [],
        "sessions": [],
        "admissionForms": [],
        "studentPromotions": [],
        "studentFeeStructures": [],
        "feeStructures": [],
        "transportFees": [],
        "transportMonthlyFees": [],
        "teacherAttendance": [],
        "teacherLeaves": [],
        "studentComplaints": [],
        "audit": [],
        "role": "Admin",
        "selectedSession": "26-27",
        "settings": {
            "schoolName": "Alfred Nobel Public School",
            "portal": "Enabled",
            "sms": "Enabled",
            "payments": "Enabled",
            "academicYear": "2026-27",
            "language": "English",
        },
        "authUsers": [
            {
                "id": "admin",
                "password": "admin123",
                "name": "Administrator",
                "role": "Administrator",
                "team": "Principal Office",
                "status": "Active",
                "lastLogin": "",
            }
        ],
        "roles": [],
        "speedRefreshDone": True,
        "uploadedStudentListSeeded": True,
        "resetReason": "Fresh data entry requested by owner",
        "resetAt": datetime.now().isoformat(timespec="seconds"),
    }


def reset_live_data():
    state = fresh_state()
    raw = json.dumps(state, ensure_ascii=False, separators=(",", ":"))
    with connect() as conn:
        conn.execute("DELETE FROM state_backups")
        conn.execute("DELETE FROM app_state")
        conn.execute(
            "INSERT INTO app_state (key, value, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP)",
            (STATE_KEY, raw),
        )
        sync_state_tables(conn, state)
        conn.execute(
            """
            INSERT INTO audit_events (actor, action, entity_type, entity_id, details)
            VALUES (?, ?, ?, ?, ?)
            """,
            ("system", "Reset", "app_state", STATE_KEY, "Fresh live data state created"),
        )
    deleted_files = 0
    for path in BACKUP_DIR.glob("anps-state-*.json"):
        if path.is_file():
            path.unlink()
            deleted_files += 1
    return {"ok": True, "state": "fresh", "deleted_backup_files": deleted_files}


def origin_allowed(origin):
    if not origin or "*" in ALLOWED_ORIGINS:
        return True
    return origin.rstrip("/") in ALLOWED_ORIGINS


def static_file_allowed(path):
    clean_path = urlparse(path).path or "/"
    if clean_path in ("", "/", "/index.html", "/app.html", "/clear-erp-state.html"):
        return True
    if any(clean_path.lower().startswith(prefix) for prefix in LEGACY_STATIC_PREFIXES):
        return False
    if clean_path not in ALLOWED_STATIC_FILES:
        return False
    requested = Path(clean_path.lstrip("/"))
    name = requested.name
    suffixes = "".join(requested.suffixes[-2:]) if len(requested.suffixes) >= 2 else requested.suffix
    if any(part.startswith(".") for part in requested.parts):
        return False
    if name in SENSITIVE_STATIC_NAMES:
        return False
    if requested.suffix in SENSITIVE_STATIC_SUFFIXES or suffixes in SENSITIVE_STATIC_SUFFIXES:
        return False
    if name.endswith(".json") and name != "school-manifest.webmanifest":
        return False
    return True


class SchoolERPHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def end_headers(self):
        request_path = urlparse(self.path).path
        if request_path in ("", "/", "/index.html", "/clear-erp-state.html", "/school-service-worker.js") or request_path.endswith(".html"):
            self.send_header("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
            self.send_header("Pragma", "no-cache")
            self.send_header("Expires", "0")
        origin = self.headers.get("Origin", "")
        if origin and origin_allowed(origin):
            self.send_header("Access-Control-Allow-Origin", origin)
        elif "*" in ALLOWED_ORIGINS:
            self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, PUT, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization")
        self.send_header("Access-Control-Max-Age", "600")
        self.send_header("X-Content-Type-Options", "nosniff")
        self.send_header("X-Frame-Options", "SAMEORIGIN")
        self.send_header("Referrer-Policy", "strict-origin-when-cross-origin")
        self.send_header("Permissions-Policy", "camera=(), microphone=(), geolocation=(), payment=()")
        self.send_header("Cross-Origin-Resource-Policy", "same-origin")
        self.send_header(
            "Content-Security-Policy",
            "default-src 'self'; "
            "script-src 'self' 'unsafe-inline'; "
            "style-src 'self' 'unsafe-inline'; "
            "img-src 'self' data: blob:; "
            "connect-src 'self' http://127.0.0.1:* http://localhost:*; "
            "worker-src 'self'; manifest-src 'self'; base-uri 'self'; frame-ancestors 'self'",
        )
        super().end_headers()

    def do_OPTIONS(self):
        origin = self.headers.get("Origin", "")
        if origin and not origin_allowed(origin):
            self.send_response(403)
            self.end_headers()
            return
        self.send_response(204)
        self.end_headers()

    def authorized(self, write=False):
        origin = self.headers.get("Origin", "")
        if write and origin and not origin_allowed(origin):
            self.json_response({"ok": False, "error": "Origin not allowed"}, status=403)
            return False
        header = self.headers.get("Authorization", "")
        token = header.replace("Bearer ", "", 1).strip()
        if get_session_user(token):
            return True
        self.json_response({"ok": False, "error": "Unauthorized"}, status=401)
        return False

    def do_GET(self):
        parsed = urlparse(self.path)
        path = parsed.path
        if path in ("", "/", "/index.html", "/app.html"):
            self.send_response(302)
            self.send_header("Location", "/anps-erp.html#dashboard")
            self.end_headers()
            return
        if path == "/clear-erp-state.html":
            self.send_response(302)
            self.send_header("Location", "/anps-erp.html?resetLocal=1&v=fresh-server&open=dashboard")
            self.end_headers()
            return
        if path == "/api/health":
            return self.json_response(summary())
        if path == "/api/version":
            return self.json_response({"name": "ANPS School ERP", "version": "1.1.1"})
        if path == "/api/summary":
            return self.json_response(summary())
        if path == "/api/schema":
            if not self.authorized():
                return
            return self.json_response({
                "ok": True,
                "schema_version": str(DB_SCHEMA_VERSION),
                "tables": schema_tables(),
            })
        if path == "/api/validate-state":
            if not self.authorized():
                return
            return self.json_response({"ok": True, "validation": validate_database()})
        if path == "/api/readiness":
            if not self.authorized():
                return
            return self.json_response({"ok": True, "readiness": readiness_report()})
        if path == "/api/audit-log":
            if not self.authorized():
                return
            return self.json_response({"ok": True, "logs": audit_log()})
        if path == "/api/session":
            if not self.authorized():
                return
            token = self.headers.get("Authorization", "").replace("Bearer ", "", 1).strip()
            return self.json_response({"ok": True, "user": get_session_user(token) or {}})
        if path == "/api/module/students":
            if not self.authorized():
                return
            return self.json_response({"ok": True, **list_students(query_params(self.path))})
        if path == "/api/module/fees":
            if not self.authorized():
                return
            return self.json_response({"ok": True, **list_fee_receipts(query_params(self.path))})
        if path == "/api/module/transport-students":
            if not self.authorized():
                return
            return self.json_response({"ok": True, **list_transport_students(query_params(self.path))})
        if path == "/api/module/staff":
            if not self.authorized():
                return
            return self.json_response({"ok": True, **list_staff(query_params(self.path))})
        if path == "/api/module/report-summary":
            if not self.authorized():
                return
            return self.json_response({"ok": True, "summary": module_report(query_params(self.path))})
        if path == "/api/state":
            if not self.authorized():
                return
            record = read_state_record()
            return self.json_response({
                "state": record["state"] if record else None,
                "updated_at": record["updated_at"] if record else None,
            })
        if path == "/api/students":
            if not self.authorized():
                return
            return self.json_response({"students": table_rows("students")})
        if path == "/api/admissions":
            if not self.authorized():
                return
            return self.json_response({"admissions": table_rows("admission_forms")})
        if path == "/api/fees":
            if not self.authorized():
                return
            return self.json_response({"fees": table_rows("fee_receipts")})
        if path == "/api/export-state":
            if not self.authorized():
                return
            state = read_state() or {}
            raw = json.dumps(state, ensure_ascii=False, indent=2).encode("utf-8")
            file_name = f"anps-state-{datetime.now().strftime('%Y%m%d-%H%M%S')}.json"
            self.send_response(200)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_header("Content-Disposition", f"attachment; filename={file_name}")
            self.send_header("Content-Length", str(len(raw)))
            self.end_headers()
            self.wfile.write(raw)
            return
        if path.startswith("/api/table/"):
            if not self.authorized():
                return
            table = path.rsplit("/", 1)[-1]
            return self.json_response({"rows": table_rows(table)})
        if not static_file_allowed(path):
            self.send_error(403, "Protected file")
            return
        return super().do_GET()

    def do_HEAD(self):
        path = urlparse(self.path).path
        if path in ("", "/", "/index.html", "/app.html", "/clear-erp-state.html"):
            self.send_response(302)
            self.send_header("Location", "/anps-erp.html#dashboard")
            self.end_headers()
            return
        if path.startswith("/api/"):
            self.send_error(405, "HEAD not supported for API")
            return
        if not static_file_allowed(path):
            self.send_error(403, "Protected file")
            return
        return super().do_HEAD()

    def do_POST(self):
        path = urlparse(self.path).path
        if path == "/api/login":
            return self.login_request()
        if not self.authorized(write=True):
            return
        if path == "/api/backup":
            return self.json_response(backup_state("manual"))
        if path == "/api/clear-backups":
            return self.json_response({"ok": True, **clear_state_backups()})
        if path == "/api/reset-data":
            return self.json_response(reset_live_data())
        if path == "/api/logout":
            token = self.headers.get("Authorization", "").replace("Bearer ", "", 1).strip()
            remove_session_token(token)
            return self.json_response({"ok": True})
        self.save_state_request()

    def do_PUT(self):
        if not self.authorized(write=True):
            return
        self.save_state_request()

    def save_state_request(self):
        path = urlparse(self.path).path
        if path != "/api/state":
            self.send_error(404)
            return
        length = int(self.headers.get("Content-Length") or "0")
        if length > MAX_BODY:
            self.send_error(413, "Request body too large")
            return
        try:
            payload = json.loads(self.rfile.read(length).decode("utf-8") or "{}")
            state = payload.get("state", payload)
            if not isinstance(state, dict):
                raise ValueError("state must be an object")
            updated_at = write_state(state)
            self.json_response({"ok": True, "updated_at": updated_at})
        except Exception as exc:
            self.json_response({"ok": False, "error": str(exc)}, status=400)

    def login_request(self):
        length = int(self.headers.get("Content-Length") or "0")
        if length > MAX_BODY:
            self.send_error(413, "Request body too large")
            return
        try:
            payload = json.loads(self.rfile.read(length).decode("utf-8") or "{}")
            user = verify_login(payload.get("username"), payload.get("password"))
            if not user:
                return self.json_response({"ok": False, "error": "Invalid login"}, status=401)
            record_audit("Login", "user", user.get("username") or "", user.get("username") or "", user.get("role_name") or "")
            self.json_response({"ok": True, "token": create_session_token(user), "user": user})
        except Exception as exc:
            self.json_response({"ok": False, "error": str(exc)}, status=400)

    def json_response(self, payload, status=200):
        raw = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(raw)))
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate")
        self.end_headers()
        self.wfile.write(raw)


def main():
    init_db()
    server = ThreadingHTTPServer((HOST, PORT), SchoolERPHandler)
    print(f"School ERP backend running at http://{HOST}:{PORT}/")
    print(f"SQLite database: {DB_PATH}")
    server.serve_forever()


if __name__ == "__main__":
    main()
