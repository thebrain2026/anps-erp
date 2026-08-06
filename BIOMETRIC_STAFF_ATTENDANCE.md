# ANPS Staff Biometric Attendance

Device found:

- Model: TeamOffice TM23C01(W)
- IP: `192.168.16.174`
- Port: `5005`

## Staff Mapping

ERP > Staff Details-e prottek staff-er `Biometric User ID` fill korte hobe. Ei ID holo biometric machine-er user/enroll number. Eta dile punch auto staff-er sathe match hobe.

## Connection Test

Office computer theke:

```bash
python3 biometric_staff_bridge.py --test-connection
```

Success hole dekhabe:

```text
OK: device reachable at 192.168.16.174:5005
```

## CSV Sync

TeamOffice software/device theke attendance CSV export kore:

```bash
ANPS_BIOMETRIC_BRIDGE_TOKEN="your-render-token" python3 biometric_staff_bridge.py --csv /path/to/attendance.csv
```

CSV column names flexible: `Staff ID`, `Staff Name`, `Date`, `In Time`, `Out Time`, `User ID`, `Enroll ID`, `Device ID`.

ERP backend endpoint:

```text
/api/staff-biometric/punches
```

Production-e Render environment variable set korte hobe:

```text
ANPS_BIOMETRIC_BRIDGE_TOKEN
```

ERP-er main page-e heavy polling cholbe na; local bridge punch pathabe, tai software slow hobe na.
