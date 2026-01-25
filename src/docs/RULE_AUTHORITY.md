# Rule Authority (Day 6 — Final)

This layer enforces legal and platform authority.

Invariants:
- Every critical action requires acceptance of the latest active rules
- Rule acceptance is immutable and auditable
- Rules are language-specific
- Platform is the final authority

Protected Actions:
- Booking creation
- Demand creation
- Escrow payout
- Trust-affecting actions

Breaking this layer is a conscious decision, not an accident.
