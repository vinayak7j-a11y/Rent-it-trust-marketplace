# RENT IT — EXECUTION LOG

## DAY 0 — PROJECT & CONTROL FILES
Status: DONE
Start Time:
End Time:

Completed:
- Git initialized
- Folder structure created
- SYSTEM_RULES.md force-written
- Execution log updated

Decisions Locked:
- Backend stack: Node.js + TypeScript
- main branch = stable only

Problems Faced:
- Editor save confusion resolved via terminal write

Notes to Future Self:
- Terminal writes never lie 

## DAY 1 — DOMAIN ENUMS
Status: DONE

Completed:
- Defined all core domain enums as system constraints
- Created enums for user roles, user status, trust tiers, languages
- Created lifecycle enums for items and bookings
- Defined damage categories as fixed enum values

Decisions Locked:
- Domain behavior is constrained by enums, not free text
- No hybrid or ambiguous user roles allowed
- Item and booking lifecycles are finite and explicit
- Damage types are categorized and enumerable (no “other”)

Notes to Future Self:
- Enums are laws of physics in the system
- If you feel friction while building features, do not loosen enums
- Adding an enum value is a system-level decision, not a convenience
- If behavior does not fit existing enums, reconsider the feature 

## DAY 2 — STATE TRANSITIONS
Status: DONE

Completed:
- Item state machine implemented
- Booking state machine implemented
- Enum barrel file added
- TypeScript compilation fixed and verified

Decisions Locked:
- All state changes go through state machines
- Enums are imported only via domain barrel
- Direct state mutation is forbidden

Notes to Future Self:
- If a feature requires a new transition, justify breaking the lifecycle first.

## DAY 3 — EVENT LOGGING
Status: DONE

Completed:
- Defined canonical domain event types
- Implemented append-only in-memory event store
- Created centralized event emitter
- Wired state transitions to emit immutable events

Decisions Locked:
- Events are append-only and never mutated
- All significant actions must emit events
- Event emission is centralized via emitter utility

Notes to Future Self:
- If something is hard to debug, it probably lacks an event
- Never rewrite history — append a new event instead 

## DAY 4 — AUTHENTICATION
Status: DONE

Start Time:
End Time:

Completed:
- Installed Fastify, JWT, Prisma, and auth-related dependencies
- Evaluated npm audit warnings and explicitly rejected force fixes
- Initialized Prisma configuration
- Started local PostgreSQL using `npx prisma dev`
- Resolved DATABASE_URL conflicts and enforced single source of truth
- Defined User schema with role, status, language, and trustScore
- Ran Prisma migration successfully
- Verified database connectivity (migration sync)
- Implemented OTP-based login (dev stub)
- Implemented JWT issuance on verification
- Auth foundation ready for protected routes

Security Notes:
- npm audit reported high severity vulnerability in `hono`
- `hono` is a transitive dev dependency via `@prisma/dev`
- Not used at runtime, not reachable by user traffic
- Decision: DO NOT force-fix, revisit before production deploy

Decisions Locked:
- Phone number is the sole user identity
- Authentication precedes all system actions
- User role and status are enforced at the system level
- No breaking dependency upgrades for tooling warnings

Problems Faced:
- Prisma migration failed initially due to database not running
- Conflict caused by multiple DATABASE_URL entries
- Prisma Studio unsupported for `prisma+postgres` protocol

Resolutions:
- Started local database via `npx prisma dev`
- Removed duplicate DATABASE_URL values
- Accepted Prisma Studio limitation and proceeded without it

Notes to Future Self:
- Never paste plain text into terminal
- One database, one DATABASE_URL
- Tooling warnings are not runtime risks by default
