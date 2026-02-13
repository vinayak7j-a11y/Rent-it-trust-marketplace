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

Additional Fix:
- Implemented enforceUserStatus middleware to block banned and limited users
- Ensured access control is enforced at route level 

## DAY 5 — LANGUAGE SELECTION
Status: DONE

Start Time:
End Time:

Completed:
- Added explicit language selection for users (EN / HI)
- Stored language preference in user profile
- Created language-specific system rule files
- Implemented rule loading strictly based on selected language
- Ensured no default or fallback language is used

Decisions Locked:
- Users must explicitly choose a language
- Rules are served only in the selected language
- No silent fallback to English is allowed
- Legal clarity overrides convenience

Problems Faced:
- None critical; required discipline to avoid auto-defaults

Resolutions:
- Enforced language persistence at the user level
- Forced hard failure if rules for a language are missing

Notes to Future Self:
- Never assume a user understands rules in another language
- If a new language is added, rules must be added first
- Language ambiguity is a legal and trust risk 

## DAY 6 — RULE ACCEPTANCE (BLOCKING)
Status: DONE

Start Time:
End Time:

Completed:
- Designed versioned rule acceptance system
- Added RuleVersion and UserRuleAcceptance models
- Enforced bidirectional relations for legal integrity
- Implemented Prisma v7-compatible config (schema vs config separation)
- Successfully migrated rule versioning tables
- Verified DB state via Prisma Studio

Decisions Locked:
- Rule acceptance is immutable and versioned
- No critical action allowed without accepting latest rules
- Legal consent history must always be auditable
- Prisma v7 config is canonical (no datasource URL in schema)

Problems Faced:
- Prisma v7 breaking changes caused repeated migration failures
- Datasource URL handling differed from older Prisma versions
- CLI did not auto-load .env variables

Resolutions:
- Moved DATABASE_URL to prisma.config.ts (v7-compliant)
- Exported DATABASE_URL into shell for Prisma CLI
- Installed dotenv-cli to prevent future env loading issues
- Fixed missing opposite relation fields in schema

Notes to Future Self:
- Do NOT bypass rule acceptance middleware
- If Prisma migration fails, check env loading first
- This day was painful — but it permanently hardened the system 

## DAY 6 — RULE ACCEPTANCE (BLOCKING)

Status: ✅ COMPLETE

Start Time: —
End Time: —

### Implemented
- Added `RuleVersion` model (versioned, language-specific, immutable)
- Added `UserRuleAcceptance` model (user ↔ ruleVersion, auditable)
- Enforced unique constraints on `(userId, ruleVersionId)`
- Added bidirectional relations with `User`
- Implemented rule authority service:
  - `getActiveRule(language)`
  - `acceptActiveRule(userId, language)`
  - `hasAcceptedActiveRule(userId, language)`
- Implemented blocking middleware for protected actions
- Integrated language-based rule loading
- Decoupled domain enums from Prisma enums

### Guarantees Enforced
- No booking / demand / payout without latest rule acceptance
- Rule acceptance history is permanent
- New rule versions force re-acceptance
- Platform is final authority (no user-side ambiguity)

### Infra / Tooling
- Prisma schema stabilized
- Clean DB reset (pre-MVP safe)
- Single canonical migration created
- Prisma Client regenerated successfully
- TypeScript validation passed (`tsc --noEmit`)

### Issues Encountered
- Prisma client generated without enums/models
- Prisma enum exports unavailable
- Migration history drift after resets

### Resolutions
- Forced single schema usage
- Reset DB and migrations
- Regenerated Prisma Client
- Switched to domain-level `Language` enum

### Final State
- Rule acceptance layer fully functional
- Compile-safe and migration-safe
- Day 6 locked and must not be overwritten 


## Day 7 — Wallet & Ledger (Infrastructure)

Status: ✅ COMPLETE

Summary:
- Prisma setup stabilized after toolchain conflicts
- Prisma Client successfully generated (v5.22.0)
- schema.prisma validated and cleaned
- User domain model restored
- TypeScript and Prisma fully aligned
- `prisma.user` access confirmed across services

Notes:
- Encountered Prisma v7 + TS incompatibility
- Resolved by pinning Prisma v5 and hard-resetting schema
- Infra is now stable and ready for escrow logic

Decision:
- Day 7 locked
- Proceeding to Day 8 (Escrow System)


## Day 8 — Escrow System (Money Authority)

Status: ✅ COMPLETE & VERIFIED

Summary:
- Escrow model implemented and tied 1:1 with booking lifecycle
- Rental fee and deposit captured upfront under platform control
- Owner payout blocked until escrow release
- Deposit isolated from owner wallet
- Escrow status governs fund movement
- `createdAt` and `updatedAt` timestamps verified

Notes:
- Initial confusion caused by Prisma Studio column visibility (scroll issue)
- Database schema confirmed via psql inspection
- Timestamp behavior verified via manual row creation and update
- `createdAt` confirmed immutable
- `updatedAt` confirmed to update automatically on Prisma updates

Verification:
- `prisma migrate status` clean (no drift)
- Escrow table inspected directly in Postgres
- Escrow row created and updated in Prisma Studio
- Times

## DAY 9 — TRUST SIGNALS
Status: DONE

Completed:
- Trust events model created
- Centralized trust delta rules
- Atomic trust update service

Decisions Locked:
- Trust changes only via events
- Trust logic is invisible to users

Notes to Future Self:
- Never add UI explanations for trust math

## DAY 10 — TRUST EFFECTS
Status: DONE

Completed:
- Trust tier resolution
- Deposit multipliers enforced by tier
- Eligibility gates defined

Decisions Locked:
- Trust affects outcomes, not explanations
- No feature bypasses trust context

Notes to Future Self:
- If users complain, trust is working. 

Recheck Fixes Applied:
- Removed floating-point deposit math
- Implemented integer-safe deposit ratios
- Forward-compatible booking access levels
- Trust policy documented

Status: VERIFIED 

## DAY 11 — TRUST DECAY
Status: DONE

Completed:
- Trust inactivity tracking added
- Daily decay job implemented
- Trust erosion bounded at zero

Decisions Locked:
- Trust is earned continuously, not permanently
- Inactivity causes slow decay

Notes to Future Self:
- Never “reset” trust manually to zero.

