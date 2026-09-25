from anps_erp_backend import merge_state_without_losing_receipts


def test_homework_from_other_role_is_kept():
    server = {
        "homework": [{"id": "HW-1", "text": "from teacher"}],
        "collectedPayments": {},
        "students": [],
    }
    incoming = {
        "homework": [{"id": "HW-2", "text": "from admin"}],
        "collectedPayments": {},
        "students": [],
    }
    merged = merge_state_without_losing_receipts(server, incoming)
    ids = {item["id"] for item in merged["homework"]}
    assert ids == {"HW-1", "HW-2"}


def test_finance_sessions_fee_master_is_merged():
    server = {
        "financeSessions": {
            "2026-27": {
                "feeMaster": [{"id": "a", "className": "I", "studentType": "New Student", "monthlyTuitionFee": 1000, "updatedAt": "2026-09-01T00:00:00"}],
            }
        },
        "collectedPayments": {},
        "students": [],
    }
    incoming = {
        "financeSessions": {
            "2026-27": {
                "feeMaster": [{"id": "b", "className": "II", "studentType": "New Student", "monthlyTuitionFee": 1200, "updatedAt": "2026-09-02T00:00:00"}],
            }
        },
        "collectedPayments": {},
        "students": [],
        "receiptSerial": 5,
    }
    merged = merge_state_without_losing_receipts(server, incoming)
    classes = {row["className"] for row in merged["financeSessions"]["2026-27"]["feeMaster"]}
    assert classes == {"I", "II"}
    assert merged["receiptSerial"] == 5


def test_receipt_serial_keeps_max():
    merged = merge_state_without_losing_receipts(
        {"receiptSerial": 12, "collectedPayments": {}, "students": []},
        {"receiptSerial": 7, "collectedPayments": {}, "students": []},
    )
    assert merged["receiptSerial"] == 12
