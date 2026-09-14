# BSFV outbox — UPI settlement bank requirement

UPI student-app approvals create a **Bank** tender in `collectedPayments`.
BSFV requires `source_bank_id` on every bank tender, so ANPS must persist
`bankAccountId` before the outbox will enqueue a deliverable fee event.

## UI behaviour

- Module: **UPI Payment Verification**
- Control: **Settlement bank (required to approve)** (`#upiApproveBankAccount`)
- `approveUpiPaymentRequest` refuses approval until an active bank account is selected
- Approved payments store `bankAccountId` / `bankAccountName` for BSFV mapping

## Operator note

Map each ANPS `bankAccounts[].id` once in BSFV Accounting Center →
ANPS bank tender mapping before turning on automatic finance.
