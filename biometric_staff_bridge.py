#!/usr/bin/env python3
"""
ANPS staff biometric bridge.

Use this on the office computer that can reach the TeamOffice device LAN IP.
It keeps ERP work light: the bridge reads/export-imports punches locally, then posts
only normalized staff attendance rows to the ERP backend.
"""

import argparse
import csv
import json
import os
import socket
import sys
import urllib.error
import urllib.request
from datetime import datetime
from pathlib import Path


DEFAULT_DEVICE_IP = "192.168.16.174"
DEFAULT_DEVICE_PORT = 5005
DEFAULT_ERP_URL = "https://anps.thebrainerp.com/api/staff-biometric/punches"


def normalize_header(value):
    return "".join(ch for ch in str(value or "").strip().lower() if ch.isalnum())


def first_value(row, names):
    normalized = {normalize_header(key): value for key, value in row.items()}
    for name in names:
        value = normalized.get(normalize_header(name))
        if value is not None and str(value).strip():
            return str(value).strip()
    return ""


def load_csv_punches(path):
    with Path(path).open("r", encoding="utf-8-sig", newline="") as handle:
        reader = csv.DictReader(handle)
        punches = []
        for row in reader:
            date = first_value(row, ["date", "attendance date", "punch date"])
            timestamp = first_value(row, ["timestamp", "punch time", "time", "datetime", "date time"])
            if not timestamp and date:
                time_text = first_value(row, ["in time", "check in", "first punch", "time"])
                timestamp = f"{date} {time_text}".strip()
            punches.append(
                {
                    "staffId": first_value(row, ["staff id", "staff code", "employee code"]),
                    "biometricId": first_value(row, ["biometric id", "user id", "user no", "enroll id", "employee id", "emp id", "id"]),
                    "staffName": first_value(row, ["staff name", "employee name", "name"]),
                    "date": date,
                    "timestamp": timestamp,
                    "inTime": first_value(row, ["in time", "check in", "first punch"]),
                    "outTime": first_value(row, ["out time", "check out", "last punch"]),
                    "department": first_value(row, ["department", "dept"]),
                    "designation": first_value(row, ["designation", "post"]),
                    "deviceId": first_value(row, ["device id", "device", "machine id"]),
                }
            )
        return punches


def load_json_punches(path):
    raw = Path(path).read_text(encoding="utf-8").strip()
    if not raw:
        raise ValueError(f"{path} is empty")
    data = json.loads(raw)
    if isinstance(data, dict) and isinstance(data.get("punches"), list):
        return data["punches"]
    if isinstance(data, list):
        return data
    raise ValueError("JSON file must be a list or an object with a punches list")


def test_device_connection(ip, port, timeout):
    with socket.create_connection((ip, port), timeout=timeout):
        return True


def post_punches(endpoint, token, payload):
    raw = json.dumps(payload, ensure_ascii=False).encode("utf-8")
    headers = {"Content-Type": "application/json"}
    if token:
        headers["X-Biometric-Bridge-Token"] = token
    request = urllib.request.Request(endpoint, data=raw, headers=headers, method="POST")
    with urllib.request.urlopen(request, timeout=30) as response:
        return json.loads(response.read().decode("utf-8") or "{}")


def main():
    parser = argparse.ArgumentParser(description="Sync ANPS staff biometric attendance punches to ERP.")
    parser.add_argument("--device-ip", default=os.environ.get("ANPS_BIOMETRIC_DEVICE_IP", DEFAULT_DEVICE_IP))
    parser.add_argument("--device-port", type=int, default=int(os.environ.get("ANPS_BIOMETRIC_DEVICE_PORT", DEFAULT_DEVICE_PORT)))
    parser.add_argument("--device-model", default=os.environ.get("ANPS_BIOMETRIC_DEVICE_MODEL", "TeamOffice TM23C01(W)"))
    parser.add_argument("--endpoint", default=os.environ.get("ANPS_BIOMETRIC_ERP_URL", DEFAULT_ERP_URL))
    parser.add_argument("--token", default=os.environ.get("ANPS_BIOMETRIC_BRIDGE_TOKEN", ""))
    parser.add_argument("--csv", help="TeamOffice/software exported CSV file")
    parser.add_argument("--json", help="Punch JSON file")
    parser.add_argument("--test-connection", action="store_true", help="Only test TCP connection to device")
    parser.add_argument("--dry-run", action="store_true", help="Print payload, do not upload")
    parser.add_argument("--timeout", type=float, default=5)
    args = parser.parse_args()

    if args.test_connection:
        try:
            test_device_connection(args.device_ip, args.device_port, args.timeout)
            print(f"OK: device reachable at {args.device_ip}:{args.device_port}")
            return 0
        except OSError as exc:
            print(f"FAILED: cannot reach {args.device_ip}:{args.device_port}: {exc}", file=sys.stderr)
            return 2

    try:
        if args.csv:
            punches = load_csv_punches(args.csv)
        elif args.json:
            punches = load_json_punches(args.json)
        else:
            print("Give --csv exported-file.csv or --json punches.json. Use --test-connection to check LAN reachability.", file=sys.stderr)
            return 2
    except Exception as exc:
        print(f"FAILED: could not read punch file: {exc}", file=sys.stderr)
        return 2

    payload = {
        "device": {
            "ip": args.device_ip,
            "port": args.device_port,
            "model": args.device_model,
            "note": "Office staff biometric",
        },
        "syncedAt": datetime.now().isoformat(timespec="seconds"),
        "punches": punches,
    }
    if args.dry_run:
        print(json.dumps(payload, ensure_ascii=False, indent=2))
        return 0
    try:
        result = post_punches(args.endpoint, args.token, payload)
    except urllib.error.HTTPError as exc:
        print(f"FAILED: ERP rejected upload ({exc.code}): {exc.read().decode('utf-8', errors='replace')}", file=sys.stderr)
        return 1
    except Exception as exc:
        print(f"FAILED: could not upload to ERP: {exc}", file=sys.stderr)
        return 1
    print(json.dumps(result, ensure_ascii=False, indent=2))
    return 0 if result.get("ok") else 1


if __name__ == "__main__":
    raise SystemExit(main())
