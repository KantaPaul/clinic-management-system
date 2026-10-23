# Roadmap

Status of this repository on **23 Oct 2026**: research documents only. The application is not started.

The owner confirmed on 23 Oct 2026 that they are not an Envato Code author. [Envato’s author-intake article](https://help.author.envato.com/hc/en-us/articles/53981083605913-Author-applications-are-paused-new-authors-join-by-invitation-only), updated 25 Sep 2026, says new Code authors are not being invited. A CodeCanyon launch is blocked for that reason. Details and sales evidence are in [market research](product/market-research.md).

A phase moves forward only after a separate approval. Approval of the research repository does not approve a build.

## Now

| Item | Status | Notes |
|---|---|---|
| Repository inspection | completed | Greenfield. Notes are in the plan checklist |
| Market research and Go / No-Go | completed | No-Go for CodeCanyon. Private research repo only |
| Publish this documentation to a private GitHub repository | completed | `main` on `KantaPaul/clinic-management-system`. No application code |

## Blocked until a later approval

| Phase | Status | Intended outcome | Why it is blocked |
|---|---|---|---|
| Product requirements | blocked | `docs/product/prd.md` with testable acceptance criteria for the outpatient MVP | Needs an explicit decision to build without CodeCanyon, or confirmation that an upload path exists |
| Architecture and database design | blocked | `docs/architecture/overview.md` and `docs/architecture/database-design.md` | Depends on the PRD |
| Milestone 1: foundation | blocked | Auth, roles, clinic settings, dashboard, migrations, Docker Compose | No application work is approved |
| Milestone 2: clinic operations | blocked | Doctors, patients, availability, calendar, queue | Depends on milestone 1 |
| Milestone 3: clinical workflow | blocked | Notes, medication catalog, prescriptions, visit history | Depends on milestone 2 |
| Milestone 4: billing and reporting | blocked | Invoices, recorded payments, dues, operational reports | Depends on milestone 3 |
| Milestone 5: differentiators supported by the research | blocked | Bengali, currency and time zone, print templates, recorded bKash and Nagad references, audit history | Each item must stay tied to the research. Pharmacy stock and multi-branch stay out |
| Security checklist with verification evidence | blocked | `docs/security/security-checklist.md` | Nothing is implemented to verify |
| Test plan and executed results | blocked | `docs/qa/test-plan.md` | No tests have been run because there is no application |
| CodeCanyon package | blocked | Installer, docs, changelog, screenshots, license notes | Owner cannot submit as a new Code author |

## MVP boundary, if a build is later approved

The recommended first buyer is one small multi-doctor outpatient clinic. The feature list and the exclusions are in [market research](product/market-research.md). Inpatient care, laboratory, radiology, pharmacy inventory, telemedicine, native apps, live payment gateways, multi-tenant SaaS, and compliance claims stay out of v1.

## Pricing and channel, still hypothetical

A regular license around $59 is a hypothesis for a future CodeCanyon listing, based on InfyCare at $49 and on low sales of Next.js listings priced at $98–$118. It is not a decision to sell, and it is not available while new Code author accounts are paused.

Direct delivery to a known clinic is a possible later channel. No buyer interview was done. That channel needs its own approval before any build.
