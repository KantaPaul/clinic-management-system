# Market research: outpatient clinic management system

Research date: **23 Oct 2026**.

This document records what was publicly visible on that date. It does not estimate hidden CodeCanyon data. Sales counts moved by a few units between pages opened the same day. Each figure below names the page it came from.

Labels:

- **VERIFIED**: observed on the cited page on 23 Oct 2026, or stated by the project owner in this project’s planning session on that date.
- **ASSUMPTION**: a working conclusion from those facts, with the reasoning stated.
- **HYPOTHESIS**: a claim that still needs evidence before it should drive a build or a price.

## 1. Go / No-Go

**Decision: No-Go for a CodeCanyon submission. Go only for this private research repository.**

Reasoning:

1. **VERIFIED (owner, 23 Oct 2026):** the project owner is not an Envato Code author.
2. **VERIFIED:** Envato is not creating new Market author accounts, and Code is not in the current invitation set. Source: [Author applications are paused](https://help.author.envato.com/hc/en-us/articles/53981083605913-Author-applications-are-paused-new-authors-join-by-invitation-only), article updated 25 Sep 2026, accessed 23 Oct 2026. There is no application form and no published reopening date. Existing Code authors can still be supported. That path is unavailable to this owner.
3. **VERIFIED:** the CodeCanyon hospital and clinic shelf is already occupied by PHP products with hundreds to about two thousand sales. Next.js and Node listings visible on the same day had tens of sales, not hundreds. See the matrix below.
4. **ASSUMPTION:** writing a full hospital system before a distribution channel exists spends the largest cost on a shelf this owner cannot currently enter.

A later build of a small outpatient product remains possible for direct sale or for a future Envato invitation. That build is not approved. See [roadmap](../roadmap.md).

## 2. Repository inspection

**VERIFIED (local session, 23 Oct 2026):**

- The working directory at inspection time was `/Users/pobon`. It was not a git repository and contained no clinic application, `package.json`, database schema, authentication, tests, CI, or Docker setup.
- GitHub CLI was authenticated as `KantaPaul`. The git identity was `KantaPaul` / `pobon.paul1994@gmail.com`.
- A name filter over the first 100 repositories on `KantaPaul` returned no repository whose name matched clinic, hospital, HMS, doctor, or medical.
- A search of the whole disk for another copy was not run.

**ASSUMPTION:** this is a greenfield product. There is no existing UI or schema to preserve. The local project path chosen for these documents is `/Users/pobon/Documents/clinic-management-system`. The GitHub repository is private so the notes are not a public product listing.

## 3. Competitor comparison

Prices are in US dollars and are the item price shown on CodeCanyon. Envato buyer fees are extra when the page said so. Star averages are listed only when the opened page showed them.

| Product | Price | Sales | Ratings | Last update | Stack (as labeled by the listing) | Scope visible without purchase | Source |
|---|---:|---:|---|---|---|---|---|
| Smart Hospital | $89 | 2,036 | 161 ratings; star average not shown on the pages opened | 11 Aug 2026 | CodeIgniter, PHP 7.x–8.x, MySQL 5.x | Hospital: OPD, IPD, pharmacy, pathology, radiology, blood bank, billing, appointments. Created about 8 years ago | [Item comments](https://codecanyon.net/item/smart-hospital-hospital-management-system/23205038/comments). Author portfolio the same day also showed 2,036 sales and 161 ratings: [QDOCS](https://codecanyon.net/user/qdocs/portfolio) |
| KiviCare Pro | $149 | 1.2K | 73 ratings; star average not opened | 29 Sep 2026 | WordPress 5.4.x–7.0.x, PHP | Search card calls it a clinic and patient management EHR add-on. Item page was not opened. Feature list and review text are unverified | [Search: medical clinic system](https://codecanyon.net/search/medical%20clinic%20system) |
| Multi Hospital (codearistos) | $98 | 841 | 55 ratings; star average not shown on the portfolio card | Portfolio did not show the item’s last-update date | CodeIgniter, PHP 7.x–8.x | Portfolio card: AI-powered SaaS hospital management. codearistos author location on that page: Bangladesh. Author rating 4.59 from 179 ratings and 2,436 author sales are author totals, not this item | [codearistos portfolio](https://codecanyon.net/user/codearistos/portfolio?direction=desc&order_by=sortable_at&view=list) |
| Hospital – Hospital Management System | $39 | 668 | 35 ratings; star average not opened | 7 Dec 2025 | CodeIgniter, PHP 8.x, MySQL 8.x | Search card only. Features unverified | [Search: hospital management system](https://codecanyon.net/search/hospital%20management%20system) |
| HMS – Smart Hospital & Appointment Scheduling (infyomlabs) | $49 | 603 | Rating count not captured | 20 Aug 2026 | Laravel, Symfony, PHP 8.x, MySQL 5.x | Search card only. Features unverified. Distinct from QDOCS Smart Hospital | Same search page |
| HMS SaaS (infyomlabs) | $79 | 544 on one search card and 545 on another | Rating count not captured on the opened item text | 26 Jun 2026 | Laravel, PHP 8.x | Multi-hospital SaaS, landing page, doctor time-slot booking, created about 5 years ago. Mobile app is named in the title. Full module list was not copied from a complete feature table | [Item](https://codecanyon.net/item/infyhmssaas-laravel-multi-hospital-management-system-saas-hospital/35427978) and the hospital search page |
| Doxe | $39 | 514 | Rating not shown on the fetched item text | 19 Apr 2026 | CodeIgniter, PHP 7.x–8.x, MySQL 5.x | SaaS chambers: serial numbers, appointments, prescriptions, drugs, print, PayPal, Stripe, multilingual and RTL added in version 1.2 (25 Jan 2021). Install wizard claimed by the author | [Item](https://codecanyon.net/item/doxe-saas-doctors-chamber-prescription-appointment-software/28839037) |
| InfyCare | $49 | 403 on the item page; a search card the same day showed 398 | Search card showed (18). Star average was not on the fetched item text | 29 May 2026 | Laravel, PHP 8.x | Multi-doctor clinic: landing page, schedules, visits, prescriptions, service charges, roles, currencies, countries. Public live demo. Created about 5 years ago. Author describes it as a SaaS application with a super admin and a separate admin per signed-up clinic | [Item](https://codecanyon.net/item/infycare-laravel-clinic-appointment-booking-management/34157995) |
| Doctorly | $49 | 182 | Rating count not captured | 1 Jan 2024 | Laravel 9, PHP 8.1, MySQL 8.x, Bootstrap 5.3, Vite | Admin, doctor, receptionist, accountant, patient. Appointments, prescriptions, invoices, email of prescriptions and invoices. No update shown after 1 Jan 2024 | [Item](https://codecanyon.net/item/doctorly-hospital-clinic-management-laravel-system/35099826) |
| Medicare (XemaAI) | $59 on a search snippet | 134 on one snippet and 160 on another. Not reconciled | Search snippet said 5.00 from 18 reviews. Not re-read on a saved item page for this report | Search snippet said recently updated; exact date not copied into this report | Flutter, PHP, HTML, JS as listed on the search snippet | Author text: admin, user app, doctor app, website, queue, pathology, prescriptions, invoices, Razorpay and Stripe, AI doctor recommendation chat, video consultations | [Item](https://codecanyon.net/item/medicare-complete-hospital-clinic-appointment-system-with-admin-web-user-doctor-apps/56035885). Treat sales and rating as unverified until the item page is opened again |
| Medigo | $99 | 5 | Rating count not shown | 14 Aug 2026 on the item page; a search card said 15 Aug 2026 | Laravel, Flutter 3.x, PHP 8.4, MySQL 8, Composer | Full hospital plus mobile apps: appointments, encounters, multi-clinic, billing, telemedicine, beds, pharmacy, lab, radiology, IPD/OPD. Created about 2 months before this research. Third-party AI, telemedicine, payments, and notifications are extra | [Item](https://codecanyon.net/item/medigo-hospital-management-system-php-script-with-laravel-and-flutter/63788685) |
| HospitalNext SaaS | $118 | 25 | Not captured | Not captured on the search card used | Node.js; title says Next.js | Search card only | [Search: hospital management system](https://codecanyon.net/search/hospital%20management%20system) |
| AI Hospital | $98 | 42 | Not captured | 20 Jul 2026 on one search card | Node.js | Search card only | [Search: medical clinic system](https://codecanyon.net/search/medical%20clinic%20system) |
| CareNova | $49 | 16 | Not captured | 12 Sep 2026 | React, Node.js | Search card: clinic web app, patients and appointments | Same medical-clinic search |
| EyeCare Pro | $98 | 9 | Not captured | 7 Aug 2026 | React, Node.js | Search card: eye hospital, AI in the title | Hospital search page |
| Bayanno | $50 | 1.3K | (85) on the search card; star average not opened | 23 May 2019 | CodeIgniter, PHP 7.x | Included because the sales count is large and the last update is years old. Features not opened | Hospital search page |
| GoDoctor | $49 | 28 on one card and 30 on another | Not captured | 3 Jun 2026 | Flutter 3.x | Search card: doctor appointment, clinic, hospital, lab, medical store | Medical-clinic and hospital search pages |

QDOCS author rating **4.59 from 907 ratings** is the author’s portfolio total, not the Smart Hospital item score. Source: [QDOCS portfolio](https://codecanyon.net/user/qdocs/portfolio), accessed 23 Oct 2026.

### License and deployment, where the page stated it

- **VERIFIED:** Medigo’s item page describes a Regular License as use by the buyer or one client in a single end product whose end users can be charged. The page says the total price includes the item price and a buyer fee. It does not quote the buyer fee amount.
- **VERIFIED:** Smart Hospital comment replies say Regular and Extended licenses apply to the main product, and that a SaaS add-on is separate. One buyer mentioned a **$999** Extended License in a question. That number is the buyer’s wording on the comment thread, not an Envato price table checked independently. Source: [comments](https://codecanyon.net/item/smart-hospital-hospital-management-system/23205038/comments).
- **VERIFIED:** InfyCare and HMS SaaS are described by their author as multi-tenant SaaS-style installs. Doxe is described as SaaS with membership packages. Doctorly reads as one hospital or clinic install with staff roles.
- **Unverified:** hosting requirements for most items beyond the software version tags. Smart Hospital’s own documentation is the exception in the next section.

### Demos

- **VERIFIED:** InfyCare publishes a frontend URL and a backend login URL on the item page, and publishes demo account passwords there. The passwords are intentionally omitted from this repository.
- **VERIFIED:** Smart Hospital support text says the public demo matches the purchased feature set, and that demo-site data is not part of the purchase. Source: [support tab](https://codecanyon.net/item/smart-hospital-hospital-management-system/23205038/support).
- Live-demo quality was not exercised. No competitor demo was clicked through for this report.

## 4. Buyer pain with a source

The evidence below is the first page of Smart Hospital’s comment thread and that product’s public docs. The thread contained **2,304 comments**. Only the first page was read. This is not a sample of all CodeCanyon healthcare buyers.

**VERIFIED** from [comments](https://codecanyon.net/item/smart-hospital-hospital-management-system/23205038/comments), accessed 23 Oct 2026:

- A buyer reported a blank page after installing version 7.0 and called the 7.0 install defective. Support asked for a ticket.
- A buyer reported that patient age stays at the age stored when the profile was created. The example given: date of birth 7 Jul 1983 shown as 42 in 2026. The buyer said the public demo behaved the same way. Support first said age updates correctly on their side.
- A buyer asked for pharmacy billing to follow a prescription number the way pathology billing does. Support said that behavior does not exist and pointed customization to WhatsApp.
- Buyers asked how IPD lab investigation relates to pathology, and how to record advance payments. Support answers point at ticket portals, screenshots, or WhatsApp. Some buyer follow-ups on the thread say they received no reply, including a WhatsApp follow-up.
- Buyers asked whether SaaS, multi-branch, and package subscriptions are included. Support said those need separate add-ons and sent pricing questions to WhatsApp.

**VERIFIED** support policy on the [support tab](https://codecanyon.net/item/smart-hospital-hospital-management-system/23205038/support):

- Response time can be up to one business day.
- Hours stated by the author: Monday–Saturday, 10:00–18:00 IST. Sunday and holidays excluded.
- Support is for the latest version.
- The author does not provide general CodeIgniter or PHP support, TeamViewer or AnyDesk support, or refunds after download.
- Installation help is offered when the server meets their requirements, through a ticket. Localhost support is described as very limited.
- The author may ask for super-admin and hosting or FTP details to reproduce an issue.

**VERIFIED** installation requirements from [Smart Hospital documentation](https://smart-hospital.in/docs/), accessed 23 Oct 2026:

- PHP 8.1 or higher, with PHP 8.4 described as supported. The same page also says PHP 8.4 or higher in one sentence and PHP 8.1 or higher in another. Both wordings are on that page.
- MySQL 5.5 or higher, MySQL 8 described as supported.
- `sql_mode` must not contain `ONLY_FULL_GROUP_BY`.
- Apache `mod_rewrite`, MBString, MySQLi, Zip, and recommended cURL.
- `max_execution_time` of at least 60 seconds.
- Writable config files plus `temp`, `backup`, and `uploads`.
- Install path: upload `smart_hospital_src`, open the site, complete a web installer, create the database in cPanel first, then delete the install directory.

**VERIFIED:** [troubleshooting](https://smart-hospital.in/category/common-issues-troubleshooting) documents a 404 during installation when `.htaccess` is missing. The article notes that cPanel hides dotfiles.

**ASSUMPTION:** buyers of PHP clinic scripts are sensitive to installer fragility, unclear module boundaries, and support that leaves the public comment thread. A smaller product with one documented install path is a response to that evidence. It is not proof that buyers will pay more for Next.js.

Review text for InfyCare, KiviCare, Doxe, Doctorly, and the Next.js listings was not collected. CodeCanyon review bodies for those items were not opened.

## 5. Bangladesh and international buyers

### Bangladesh product evidence

These are vendor descriptions of their own products, checked on 23 Oct 2026. They show how local products describe clinic work. They are not independent audits.

**VERIFIED** from [ChamberBD features](https://chamberbd.com/features):

- Serial-number booking by chamber and date, with new, old, and follow-up fees.
- Weekly schedules, slot length, and a maximum number of patients per slot.
- Staff-recorded payments: cash, bKash, Nagad, and card. Full or partial payment, dues, and printed money receipts.
- Invoice print sizes named on the page: A4, A5, or thermal, on Pro and Premium.
- Online serial booking from a public page.
- A stated medicine catalogue count of 23,429, with the page saying the count was verified 22 Oct 2026. This report did not recount that catalogue.

**VERIFIED** from [ChamberBD’s clinic buyer guide](https://chamberbd.com/clinic-management-software-bangladesh):

- The clinic product records payments by staff. The page says patients cannot pay online.
- Receipts are in English.
- The panel can switch between Bangla and English. The page says core clinic screens are translated, and that dental, hijama, HR, referrer, diagnostics, and roles screens were still in English.
- Prescriptions are structured (complaints, history, examination, tests, diagnosis, medicines, advice, follow-up). The page says medicine search is by brand or generic, standard meal labels print in English, and Bangla text can be typed.
- Day-close exists for consultation collections and is described as partial: invoice, diagnostic-order, and hijama payments are left out.

**VERIFIED** from [OCN Doctor Management](https://onlinecreative.net/pos-solutions/doctor-management):

- The vendor describes a serial queue, phone-number lookup, A5 Bangla prescription PDF, BMDC number on the print, bKash and Nagad transaction-ID checks by the desk, and WhatsApp or SMS reminders.
- The page describes the product as browser software for a Bangladesh private chamber, with Bangla and English.

**VERIFIED** from [SaaSHub’s ChamberBD page](https://www.saashub.com/chamberbd):

- 0 reviews on that page.
- The page lists paid plans starting at BDT 900 per month, a free plan, and a 14-day trial.
- That price was not found on the ChamberBD pages opened for this report. Treat BDT 900/month as a third-party listing, not as ChamberBD’s confirmed price.

**HYPOTHESIS:** clinics that want software on their own server are a different buyer from clinics that will use ChamberBD’s hosted app. No public count of Bangladeshi CodeCanyon purchases was found, so the size of the self-hosted segment is unknown.

**HYPOTHESIS:** serial numbers, follow-up fees, recorded bKash and Nagad references, and Bangla prescription print are the local workflow details a self-hosted outpatient product would need if the buyer is a Bangladesh clinic. International buyers still need configurable currency, time zone, and an English interface. Both can live in one settings screen. That combination was not tested with buyers.

### International buyers

**VERIFIED:** CodeCanyon item pages reviewed here are in English, priced in US dollars, and sold under Envato’s regular license wording where that wording was shown (Medigo). InfyCare exposes a currencies setting in its feature description.

**Unverified:** which countries buy these items. CodeCanyon does not show a public buyer-country breakdown on the pages opened.

## 6. Envato submission requirements

Checked 23 Oct 2026.

**VERIFIED**, [author applications paused](https://help.author.envato.com/hc/en-us/articles/53981083605913-Author-applications-are-paused-new-authors-join-by-invitation-only), updated 25 Sep 2026:

- Open applications are paused. New Envato Market author accounts cannot be created unless Envato sends an invitation.
- Code, Theme, Photo, Audio, and Graphics are named as categories not currently being invited, with a stated exception for Animated Graphics and Fonts later in 2026.
- Existing authors in those categories continue to be supported.
- Existing authors cannot apply to add a new content type during the pause.
- There is no waitlist. Support requests do not create an invitation. No reopening date is given.
- The same pause is repeated on [How to Join and Sell on Envato](https://help.author.envato.com/hc/en-us/articles/360000424443-How-to-Join-and-Sell-on-Envato), updated 27 May 2026, and [Becoming an Envato Author](https://help.author.envato.com/hc/en-us/articles/57391878017817-Becoming-an-Envato-Author-How-to-apply), updated 21 Oct 2026.

**VERIFIED**, [Code item preparation](https://help.author.envato.com/hc/en-us/articles/360000471583-Code-Item-Preparation-Technical-Requirements), updated 25 Mar 2026:

- Organize source so a buyer can edit it. Validate code. Follow current practice.
- Do not place all scripts, images, and documentation in the root of the zip. The article says that structure is rejected.
- Commercial licenses are required for assets, including preview-only assets. Attribution must be stated when an asset requires it. Preview-only assets must be identified as not included in the purchase.
- No malware.
- Documentation in English as PDF or HTML, covering installation, customization, use, and credits. A video may be added and does not replace the text. Documentation must also be on a public URL, not behind a purchase key.
- Write for a beginner.
- One zip. Recommended maximum 2 GB.
- Preview images, thumbnail, title, description, and tags must follow Envato formatting rules. Those formatting rules were not opened for this report.

**VERIFIED**, [common rejection factors](https://help.author.envato.com/hc/en-us/articles/360000536823-Common-Rejection-Factors-for-Code-Items):

- PHP items can be rejected as too general, poorly implemented, insecure, thin, hard to integrate, poorly documented, or lacking sales prospects.
- JavaScript items can be rejected for insufficient complexity or implementation quality. The same article still describes a progressive-enhancement rule written for browser scripts. How reviewers apply that rule to a Next.js application was not stated on the page.

**Unverified:** the body of Envato’s Node.js category requirements. The article is listed on [Code Item Requirements](https://help.author.envato.com/hc/en-us/sections/360000089563-Code-Item-Requirements) and was not retrieved. Re-read it before any future upload.

**Not treated as fact:** a Smart Hospital comment that CodeCanyon raised platform fees on 1 Jul 2026. That statement is the vendor’s comment. No Envato fee schedule was opened.

## 7. Target customer

**ASSUMPTION, for a later product decision:** the first buyer is a small multi-doctor outpatient clinic.

- One site.
- About 2–8 doctors.
- Daily users: receptionist, doctor, clinic admin, and a person who records payments.
- The clinic wants appointments, a queue, visit notes, a printed prescription, and a same-day money record.
- The clinic is not buying inpatient beds, a laboratory, or a pharmacy warehouse.

Segment notes, scored only from the evidence above. Scores are judgment, not measurements. Scale: 1 low, 5 high.

| Segment | Evidence that someone pays | Build size | Price room | Difference from the leaders | Fits a first release | Judgment |
|---|---:|---:|---:|---:|---:|---|
| Independent single-doctor chamber | Doxe (514 sales, $39) and ChamberBD’s own feature page | 4 | 2, because hosted local apps already exist | 3, if serials and Bangla print are solid | 4 | Credible, and easy to under-scope into a clone of Doxe |
| Small multi-doctor outpatient clinic | InfyCare (403 sales, $49) and Doctorly (182 sales, $49, stale update) | 3 | 3 | 4, if the product stays outpatient and installs cleanly | 5 | Preferred first buyer |
| Specialist consultation center | No separate sales figure found | 3 | 3 | 3 | 3 | A settings variant of the multi-doctor clinic, not a separate product |
| Diagnostic practice | Smart Hospital comments show lab workflows confuse buyers. Medicare’s author advertises pathology. No isolated diagnostic-script sales figure was opened | 2 | 3 | 2 | 1 | Out of scope |

**Core problem this would address:** the front desk needs a serial or a slot, the doctor needs a note and a prescription, and the clinic needs a receipt and a balance, without operating a hospital information system.

**Primary journeys, if a later build is approved:**

1. Reception registers or finds a patient, books a slot or issues a serial, checks the patient in, and watches the queue.
2. The doctor opens the checked-in visit, writes a note, prints a prescription, and books a follow-up.
3. The accountant or receptionist raises an invoice, records a full or partial payment, and prints a receipt.
4. The admin reads the day’s appointments, collections, and doctor workload.

**Positioning, if a later build is approved:** one outpatient clinic on the buyer’s own server, with English and Bengali, recorded mobile-wallet payments, and an installer that does not require cPanel file-permission steps. This is a positioning statement, not a claim that the installer already exists.

## 8. MVP and exclusions

Recommended only if a future plan approves a build. None of this is implemented.

**MVP**

- One clinic. Roles: admin, receptionist, doctor, accountant.
- Patients, doctors, weekly availability.
- Appointments that the database rejects when they overlap.
- Walk-in serials and timed slots. Check-in, reschedule, cancel.
- Visit notes, a medication catalog, prescription print on A4 and A5, English and Bengali.
- Invoice, discount, partial payment, outstanding balance, receipt.
- Recorded payment methods: cash, card, bKash, Nagad, each with an optional transaction reference. No live gateway.
- Fees for new, returning, and follow-up visits. Follow-up booked from a visit.
- Reports: daily appointments, collections, doctor workload.
- Audit log for writes.
- Docker Compose install, a setup wizard, synthetic demo data labeled as synthetic, English by default and Bengali as a second language.

**Excluded from v1**

- Inpatient beds, wards, and admission.
- Laboratory, radiology, and pharmacy inventory.
- Telemedicine and native mobile apps.
- AI diagnosis, AI prescribing, or any clinical decision claim.
- Live payment gateways and SMS or WhatsApp gateways.
- Multi-branch and multi-tenant SaaS.
- Any statement that the product complies with HIPAA, GDPR, or Bangladesh health-privacy rules. Those requirements are **not yet assessed**. A lawyer has not reviewed them.

## 9. Pricing hypothesis

**HYPOTHESIS, not a list price:**

- If this were ever sold on CodeCanyon, a regular license around **$59** matches the clinic items that actually sell: InfyCare at $49 with 403 sales, Doctorly at $49 with 182 sales. Next.js hospital cards at $98–$118 had 9–42 sales on 23 Oct 2026. Those counts do not support a premium stack price.
- The extended license price is chosen in Envato’s upload flow. Another product’s extended price should not be copied. The $999 figure on the Smart Hospital thread is a buyer’s question, not a verified Envato rule.
- Early sales, if a listing ever exists, are more reasonably compared with HospitalNext’s 25 sales than with Smart Hospital’s 2,036. Smart Hospital has about eight years on the market and a hospital-wide feature list. A new Next.js outpatient item has neither.

No revenue forecast is stated. There is no evidence for one.

## 10. Risks

| Risk | Evidence | Consequence |
|---|---|---|
| No CodeCanyon account | Owner confirmed they are not a Code author. Envato’s 25 Sep 2026 article blocks new Code authors | A finished item cannot be submitted through the normal author application |
| Saturated PHP shelf | Smart Hospital 2,036 sales; several other items above 400 sales | A similar feature list is not a commercial advantage |
| Weak Next.js sales signal | HospitalNext 25 sales at $118; other Node cards from 9 to 42 sales | Buyers on this marketplace still pay for PHP and cPanel installers |
| Installer expectations | Smart Hospital docs require cPanel, writable PHP files, `mod_rewrite`, and a non-default MySQL `sql_mode` | A Docker install helps a technical buyer and can raise support load for a buyer who expects shared hosting |
| Support load | 2,304 public comments on one hospital product, with module and billing questions | Every extra module is a support promise. v1 stays outpatient |
| Legal and clinical | No legal review was done. Prescriptions and patient data are regulated in ways this research did not verify | Do not claim compliance. Do not design a license check that hides patient records when a license server is down |
| Public source | A public GitHub repository would publish the item a marketplace would charge for | This repository is private |
| Incomplete review reading | Only the first Smart Hospital comment page was read. KiviCare’s item page was not opened. Medicare’s sales figures conflicted across snippets | Do not cite unread review themes as market proof |

## 11. What this research does not decide

- It does not approve application code, a database, or a CodeCanyon zip.
- It does not select an authentication library.
- It does not assert demand beyond the public sales counts above.
- It does not assess healthcare privacy law.

The next decision is whether to approve a second plan for a small outpatient build aimed at direct delivery, while CodeCanyon remains closed to new authors. That decision is not part of this document.
