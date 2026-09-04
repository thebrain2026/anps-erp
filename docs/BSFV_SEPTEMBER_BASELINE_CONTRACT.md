# September baseline contract

ANPS compares canonical finance payloads, rather than raw UI state, before
creating a correction. Normalization-only changes to session/school aliases,
date formatting, money formatting, or allocation metadata do not advance the
aggregate version.

Bank tenders carry only the durable `source_bank_id` from `bankAccountId`.
They never carry a bank display name, account number, credential, PIN, OTP, or
password. A bank payment without that durable identity fails closed.

`build_fee_baseline_envelope` is a non-mutating preparation primitive. It reads
the existing aggregate high-water version and builds one canonical
`anps.fee_collection.baseline` snapshot. It does not enqueue, persist, sign, or
transmit an event. Production preparation and delivery remain separate,
explicitly authorized operations.

For the September 1–3 initial snapshot, each payment baseline uses its current
authoritative source version (currently version 2). The existing version 1
created and version 2 no-op correction records remain immutable and are not
rewritten or selected by this mechanism. After the receiver accepts a baseline
at version 2, the next genuine mutation is version 3.

The BSFV source must explicitly allow the baseline event type before it can be
accepted. Sender, receiver, and domain-processing gates remain independent.
