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
- Conclusion: greenfield. The research files are the contents of this repository. The second-pass edits are in `/Users/pobon/Documents/testing/clinic-management-system`.

Reusable assets: none. Security review of an application: not applicable, because there is no application. Healthcare privacy compliance: not yet assessed.

## Decision

No-Go for CodeCanyon, and No-Go for the 12-phase clinic-plus-pharmacy build. The owner stated on 23 Oct 2026 that they are not an Envato Code author. Envato is not accepting new Code authors ([source](https://help.author.envato.com/hc/en-us/articles/53981083605913-Author-applications-are-paused-new-authors-join-by-invitation-only), updated 25 Sep 2026).

The pharmacy pass the same day replaced the outpatient-only recommendation. The replacement is one clinic with an in-house dispensary. That scope is recorded and **unapproved**. Evidence, the price hypothesis, and the deferred modules are in [docs/product/market-research.md](../../docs/product/market-research.md).

## Checklist

| ID | Task | Status | Evidence |
|---|---|---|---|
| P1 | Inspect the starting environment and record that no application exists | completed | This file, inspection section |
| P2 | Write sourced market research, competitor matrix, risks, buyer, MVP, pricing hypothesis, and Go / No-Go | completed | [docs/product/market-research.md](../../docs/product/market-research.md) |
| P2b | Confirm whether the owner can upload to CodeCanyon | completed | Owner: not an Envato Code author (23 Oct 2026) |
| P2c | Pharmacy and dispensary pass; replace the outpatient-only recommendation | completed | Market research sections 3, 5, 10, 11, and 12. No-Go stands. Dispensary scope is unapproved |
| P3 | Push the first documentation commit to a private `KantaPaul/clinic-management-system` repository | completed | Initial commit on `main`: README, market research, roadmap, and this checklist. The pharmacy pass is a later documentation edit and is not claimed as pushed |
| INT | Structured buyer interviews before any PRD | blocked | Not conducted. The guide is in the market research. Notes must not be turned into a market-size figure |
| P4 | Write the PRD for the dispensary scope | blocked | Waiting for interviews, or a written commitment from a named clinic, and a separate approval to build |
| P5 | Write architecture and database design | blocked | Waiting for the PRD |
| M1 | Foundation: auth, assignable permissions, settings, dashboard, migrations, Docker | blocked | No application work approved |
| M2 | Doctors, patients, availability, appointments, queue | blocked | Depends on M1 |
| M3 | Notes, clinic-entered medicines, prescriptions that do not change stock, batches, goods receipts, partial dispense, strip and tablet units | blocked | Unapproved dispensary scope. Depends on M2 |
| M4 | One invoice for consultation and dispensed lines, recorded payments, low stock, near expiry | blocked | Depends on M3. Dispensing must not duplicate invoice lines |
| M5 | Bengali, currency, time zone, print templates, bKash and Nagad references, audit history, license check that does not hide records | blocked | Only if a build is approved. No extra modules without new evidence |
| SEC | Security checklist with verification evidence | blocked | Nothing to verify |
| QA | Test plan and executed test results | blocked | No tests have been run |
| PKG | CodeCanyon package and clean-install test | blocked | New Code author uploads are paused |

## Dependencies

No application dependencies are installed. When a build is approved, each new dependency needs one line of justification in this file before it is added. The expected core, not yet chosen as package versions, is Next.js, React, TypeScript in strict mode, PostgreSQL, Drizzle ORM, Zod, and Docker Compose. The authentication library is undecided.

## Out of scope until a new plan

Application source, schema, migrations, seed data, Docker, tests, screenshots, and a marketplace zip.

Also deferred inside any future dispensary build until a buyer asks and a new plan says so: barcode point of sale, cashier shifts, walk-in retail as a separate mode, supplier returns, physical stock counts, inter-branch transfers, an online store, laboratory, radiology, inpatient beds, telemedicine, native apps, live payment gateways, multi-tenant SaaS, a copied medicine database, and full accounting statements.
