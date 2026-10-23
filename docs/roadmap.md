# Roadmap

Status of this repository on **23 Oct 2026**: research documents only. The application is not started.

The owner confirmed on 23 Oct 2026 that they are not an Envato Code author. [Envato’s author-intake article](https://help.author.envato.com/hc/en-us/articles/53981083605913-Author-applications-are-paused-new-authors-join-by-invitation-only), updated 25 Sep 2026, says new Code authors are not being invited. A CodeCanyon launch is blocked for that reason.

A second research pass the same day added pharmacy listings. The decision is **No-Go for a CodeCanyon submission and No-Go for the 12-phase clinic-plus-pharmacy build.** Sales evidence, the unapproved dispensary scope, and the deferred modules are in [market research](product/market-research.md).

A phase moves forward only after a separate approval. Approval of the research repository does not approve a build. The dispensary list in the research is a scope proposal. It is not an approved MVP.

## Now

| Item | Status | Notes |
|---|---|---|
| Repository inspection | completed | Greenfield. Notes are in the plan checklist |
| Market research and Go / No-Go | completed | Clinic pass and pharmacy pass. No-Go for CodeCanyon and for the 12-phase build |
| Publish the first research documents to a private GitHub repository | completed | `main` on `KantaPaul/clinic-management-system`. No application code. The pharmacy pass is a later documentation edit |

## Blocked until a later approval

| Phase | Status | Intended outcome | Why it is blocked |
|---|---|---|---|
| Buyer interviews | blocked | Notes from clinic owners, one doctor, one dispenser, and two CodeCanyon buyers, using the guide in the market research | No interviews have been conducted. The dispensary scope is not validated demand |
| Product requirements | blocked | `docs/product/prd.md` with testable acceptance criteria for the dispensary scope | Needs interviews, or a written commitment from a named clinic, plus an explicit decision to build without CodeCanyon |
| Architecture and database design | blocked | `docs/architecture/overview.md` and `docs/architecture/database-design.md` | Depends on the PRD |
| Milestone 1: foundation | blocked | Auth, assignable permissions, clinic settings, dashboard, migrations, Docker Compose | No application work is approved |
| Milestone 2: clinic operations | blocked | Doctors, patients, availability, calendar, queue | Depends on milestone 1 |
| Milestone 3: prescription and dispensing | blocked | Notes, clinic-entered medicines, prescriptions that do not change stock, batches, goods receipts, partial dispense, strip and tablet units | Depends on milestone 2. This is the proposed differentiator. It is unapproved |
| Milestone 4: billing and reporting | blocked | One invoice for the consultation and the dispensed lines, recorded payments, dues, low stock, near expiry | Depends on milestone 3 |
| Milestone 5: settings tied to the research | blocked | Bengali translation, currency and time zone, print templates, recorded bKash and Nagad references, audit history, a license check that does not hide records | Only if a build is approved. No extra modules without new evidence |
| Security checklist with verification evidence | blocked | `docs/security/security-checklist.md` | Nothing is implemented to verify |
| Test plan and executed results | blocked | `docs/qa/test-plan.md` | No tests have been run because there is no application |
| CodeCanyon package | blocked | Installer, docs, changelog, screenshots, license notes | Owner cannot submit as a new Code author |

## Unapproved scope, if a build is later approved

The proposed first operator is one outpatient clinic with an in-house dispensary. The feature list and the deferred modules are in [market research](product/market-research.md).

The earlier outpatient-only boundary, which left pharmacy inventory out, is superseded. The replacement is still not approved.

Deferred until a buyer asks and a new plan says so: barcode point of sale, cashier shifts, walk-in retail as a separate mode, supplier returns, physical stock counts, inter-branch transfers, an online store, laboratory, radiology, inpatient beds, telemedicine, native apps, live payment gateways, multi-tenant SaaS, a copied medicine database, full accounting statements, and compliance claims.

## Pricing and channel, still hypothetical

A regular license at $59 is the test price if a listing ever exists. $69 is a later test only after a demo shows goods-receipt stock, partial dispense, and unit conversion. $89 stays unused unless the finished scope is visibly broader than Medicine Care and still simple to install. The anchors are InfyCare at $49, Medicine Care at $60, Medix at $75, and KiviCare Pharma at $89 with 10 sales. This is not a decision to sell, and it is not available while new Code author accounts are paused.

Direct delivery to a known clinic is a possible later channel. No buyer interview was done. That channel needs its own approval before any build.
