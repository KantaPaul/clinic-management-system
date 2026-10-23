# Clinic management system plan

Updated **23 Oct 2026**. This checklist is the project record. It does not authorize work by itself. Status values: `pending`, `in_progress`, `blocked`, `completed`, `verified`.

`completed` means the documents for that task exist. `verified` is reserved for checks that were actually run. No application tests exist, so no product task is `verified`.

## Inspection

Recorded 23 Oct 2026 before any product code was written.

- The session started in `/Users/pobon`, which was not a git repository.
- No `package.json`, database schema, authentication, test setup, CI workflow, or Docker file was present there.
- GitHub CLI was authenticated as `KantaPaul`. Git identity: `KantaPaul`, `pobon.paul1994@gmail.com`.
- The first 100 repositories listed for `KantaPaul` had no name matching clinic, hospital, HMS, doctor, or medical.
- A full-disk search for another copy was not run.
- Conclusion: greenfield. These research files are the first contents of `/Users/pobon/Documents/clinic-management-system`.

Reusable assets: none. Security review of an application: not applicable, because there is no application. Healthcare privacy compliance: not yet assessed.

## Decision

No-Go for CodeCanyon. The owner stated on 23 Oct 2026 that they are not an Envato Code author. Envato is not accepting new Code authors ([source](https://help.author.envato.com/hc/en-us/articles/53981083605913-Author-applications-are-paused-new-authors-join-by-invitation-only), updated 25 Sep 2026). Evidence, the recommended outpatient MVP, and the exclusions are in [docs/product/market-research.md](../../docs/product/market-research.md).

## Checklist

| ID | Task | Status | Evidence |
|---|---|---|---|
| P1 | Inspect the starting environment and record that no application exists | completed | This file, inspection section |
| P2 | Write sourced market research, competitor matrix, risks, buyer, MVP, pricing hypothesis, and Go / No-Go | completed | [docs/product/market-research.md](../../docs/product/market-research.md) |
| P2b | Confirm whether the owner can upload to CodeCanyon | completed | Owner: not an Envato Code author (23 Oct 2026) |
| P3 | Push this documentation to a private `KantaPaul/clinic-management-system` repository | completed | Initial commit on `main`: README, market research, roadmap, and this checklist |
| P4 | Write the PRD | blocked | Waiting for a separate approval to build |
| P5 | Write architecture and database design | blocked | Waiting for the PRD |
| M1 | Foundation: auth, roles, settings, dashboard, migrations, Docker | blocked | No application work approved |
| M2 | Doctors, patients, availability, appointments, queue | blocked | Depends on M1 |
| M3 | Notes, medications, prescriptions, visit history | blocked | Depends on M2 |
| M4 | Invoices, recorded payments, reports | blocked | Depends on M3 |
| M5 | Bengali, currency, time zone, print templates, bKash and Nagad references, audit viewer | blocked | Only if a build is approved. No extra modules without new evidence |
| SEC | Security checklist with verification evidence | blocked | Nothing to verify |
| QA | Test plan and executed test results | blocked | No tests have been run |
| PKG | CodeCanyon package and clean-install test | blocked | New Code author uploads are paused |

## Dependencies

No application dependencies are installed. When a build is approved, each new dependency needs one line of justification in this file before it is added. The expected core, not yet chosen as package versions, is Next.js, React, TypeScript in strict mode, PostgreSQL, Drizzle ORM, Zod, and Docker Compose. The authentication library is undecided.

## Out of scope until a new plan

Application source, schema, migrations, seed data, Docker, tests, screenshots, and a marketplace zip.
