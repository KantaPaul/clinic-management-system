# Market research: clinic with an in-house dispensary

Research date: **23 Oct 2026**.

Two passes were made on that date. The first pass recorded clinic and hospital listings. The second pass opened pharmacy listings and Bangladesh dispensary vendors, then replaced the outpatient-only product recommendation. This document keeps the sourced clinic evidence and adds the pharmacy evidence.

It does not estimate hidden CodeCanyon data. Sales counts moved by a few units between pages opened the same day. Each figure names the page it came from.

Labels:

- **VERIFIED**: observed on the cited page on 23 Oct 2026, or stated by the project owner in this project’s planning session on that date.
- **ASSUMPTION**: a working conclusion from those facts, with the reasoning stated.
- **HYPOTHESIS**: a claim that still needs evidence before it should drive a build or a price.

No buyer interviews were conducted. No application code, schema, or tests exist.

## 1. Go / No-Go

**Decision: No-Go for a CodeCanyon submission, and No-Go for starting the 12-phase clinic-plus-pharmacy build. Go only for this private research repository.**

Reasoning:

1. **VERIFIED (owner, 23 Oct 2026):** the project owner is not an Envato Code author. The later product brief still names CodeCanyon as the sales channel. That author status needs confirmation if it has changed.
2. **VERIFIED:** Envato is not creating new Market author accounts, and Code is not in the current invitation set. Source: [Author applications are paused](https://help.author.envato.com/hc/en-us/articles/53981083605913-Author-applications-are-paused-new-authors-join-by-invitation-only), article updated 25 Sep 2026, accessed again 23 Oct 2026. There is no application form, no waitlist, and no published reopening date. Existing Code authors can still be supported. That path is unavailable to this owner.
3. **VERIFIED:** the CodeCanyon hospital and clinic shelf is occupied by PHP products with hundreds to about two thousand sales. The pharmacy shelf’s strongest current listing, Medicine Care, has 146 sales at $60 and was updated on 19 Oct 2026. The closest clinic-plus-pharmacy add-on, KiviCare Pharma, has 10 sales at $89. Next.js and Node listings visible the same day had tens of sales, not hundreds.
4. **ASSUMPTION:** writing the full hospital, pharmacy POS, ecommerce, and accounting scope before a distribution channel exists spends the largest cost on a shelf this owner cannot currently enter, and on modules the sales counts do not single out.

A later, separate approval could authorize a short PRD for one clinic with an in-house dispensary. That approval is not part of this research. It needs the interviews in section 13, or a written commitment from a named clinic. See [roadmap](../roadmap.md).

## 2. Repository inspection

**VERIFIED (local session, 23 Oct 2026):**

- The working directory at inspection time was `/Users/pobon`. It was not a git repository and contained no clinic application, `package.json`, database schema, authentication, tests, CI, or Docker setup.
- GitHub CLI was authenticated as `KantaPaul`. The git identity was `KantaPaul` / `pobon.paul1994@gmail.com`.
- A name filter over the first 100 repositories on `KantaPaul` returned no repository whose name matched clinic, hospital, HMS, doctor, or medical.
- A search of the whole disk for another copy was not run.
- The second-pass edits in this file are in the repository at `/Users/pobon/Documents/testing/clinic-management-system`.

**ASSUMPTION:** this is a greenfield product. There is no existing UI or schema to preserve. The GitHub repository is private so the notes are not a public product listing.

## 3. What the public sales counts support

**VERIFIED** from the pages in the matrix below. CodeCanyon is separating into three shelves.

| Shelf | Evidence opened on 23 Oct 2026 | What it shows |
|---|---|---|
| Clinic and hospital scripts | Smart Hospital 2,036 sales at $89; KiviCare Pro 1,229 sales at $149; Doxe 514 sales at $39; InfyCare 403 sales at $49 | Years-old PHP clinic and hospital products sell in the hundreds to low thousands |
| Standalone pharmacy POS | Medicine Care 146 sales at $60 over about 5 years, updated 19 Oct 2026; Medix 164 sales at $75, last update 23 Oct 2023; Acnoo Pharmacy SaaS 119 sales at $29 | Pharmacy scripts sell, more slowly than the clinic leaders |
| Clinic pharmacy add-on | KiviCare Pharma 10 sales at $89, item page created about 11 months before this research | The closest CodeCanyon match to a combined product has 10 sales |

A React and Node listing on the pharmacy search page, AI Pharmacy SaaS, showed $98 and 18 sales, last update 20 Jul 2026. **ASSUMPTION:** that count does not support a premium price for the stack alone.

**HYPOTHESIS, not a survey:** marketplace buyers are buying a clinic script or a pharmacy script. Bangladesh clinic owners visible in vendor marketing pay a monthly hosted fee. Those are different buyers. No public count says which one would buy a new self-hosted Next.js product.

**MitiMed:** no current public product page was found under that name on 23 Oct 2026. It is omitted rather than described.

## 4. Clinic and hospital comparison

Prices are in US dollars and are the item price shown on CodeCanyon. Envato buyer fees are extra when the page said so. Star averages are listed only when the opened page showed them.

The first pass recorded this table. On the second pass, the InfyCare, Doxe, and KiviCare Pro item pages were opened again. Their prices and sales counts matched the cells below. KiviCare Pro’s sales count is stated as 1,229 from that item page; the first pass had recorded 1.2K.

| Product | Price | Sales | Ratings | Last update | Stack (as labeled by the listing) | Scope visible without purchase | Source |
|---|---:|---:|---|---|---|---|---|
| Smart Hospital | $89 | 2,036 | 161 ratings; star average not shown on the pages opened | 11 Aug 2026 | CodeIgniter, PHP 7.x–8.x, MySQL 5.x | Hospital: OPD, IPD, pharmacy, pathology, radiology, blood bank, billing, appointments. Created about 8 years ago | [Item comments](https://codecanyon.net/item/smart-hospital-hospital-management-system/23205038/comments). Author portfolio the same day also showed 2,036 sales and 161 ratings: [QDOCS](https://codecanyon.net/user/qdocs/portfolio). First pass; not re-fetched in the pharmacy pass |
| KiviCare Pro | $149 | 1,229 | 73 ratings on the portfolio card; star average not opened | 29 Sep 2026 | WordPress 5.4.x–7.0.x, PHP | Clinic and patient management EHR add-on: appointments, encounters, multi-clinic, RTL. Pharmacy is a separate item | [Item](https://codecanyon.net/item/kivicare-pro-clinic-patient-management-system-ehr-addon/30690654), re-opened 23 Oct 2026. Portfolio: [iqonicdesign](https://codecanyon.net/user/iqonicdesign/portfolio?order_by=sales) |
| Multi Hospital (codearistos) | $98 | 841 | 55 ratings; star average not shown on the portfolio card | Portfolio did not show the item’s last-update date | CodeIgniter, PHP 7.x–8.x | Portfolio card: AI-powered SaaS hospital management. codearistos author location on that page: Bangladesh. Author rating 4.59 from 179 ratings and 2,436 author sales are author totals, not this item | [codearistos portfolio](https://codecanyon.net/user/codearistos/portfolio?direction=desc&order_by=sortable_at&view=list). First pass |
| Hospital – Hospital Management System | $39 | 668 | 35 ratings; star average not opened | 7 Dec 2025 | CodeIgniter, PHP 8.x, MySQL 8.x | Search card only. Features unverified | [Search: hospital management system](https://codecanyon.net/search/hospital%20management%20system). First pass |
| HMS – Smart Hospital & Appointment Scheduling (infyomlabs) | $49 | 603 | Rating count not captured | 20 Aug 2026 | Laravel, Symfony, PHP 8.x, MySQL 5.x | Search card only. Features unverified. Distinct from QDOCS Smart Hospital | Same search page. First pass |
| HMS SaaS (infyomlabs) | $79 | 544 on one search card and 545 on another | Rating count not captured on the opened item text | 26 Jun 2026 | Laravel, PHP 8.x | Multi-hospital SaaS, landing page, doctor time-slot booking, created about 5 years ago. Mobile app is named in the title. Full module list was not copied from a complete feature table | [Item](https://codecanyon.net/item/infyhmssaas-laravel-multi-hospital-management-system-saas-hospital/35427978) and the hospital search page. First pass |
| Doxe | $39 | 514 | Rating not shown on the fetched item text | 19 Apr 2026 | CodeIgniter, PHP 7.x–8.x, MySQL 5.x | SaaS chambers: serial numbers, appointments, a drug list, printed prescriptions, PayPal, Stripe. Changelog includes bulk drug upload and millilitre notes. No batch, expiry, receiving, or stock movement is described. Install wizard claimed by the author | [Item](https://codecanyon.net/item/doxe-saas-doctors-chamber-prescription-appointment-software/28839037), re-opened 23 Oct 2026 |
| InfyCare | $49 | 403 | Search card in the first pass showed (18). Star average was not on the fetched item text | 29 May 2026 | Laravel, PHP 8.x | Multi-doctor clinic: landing page, schedules, visits, prescriptions, service charges, roles, currencies, countries. Public live demo. The item page does not mention batches or FEFO. Created about 5 years ago | [Item](https://codecanyon.net/item/infycare-laravel-clinic-appointment-booking-management/34157995), re-opened 23 Oct 2026 |
| Doctorly | $49 | 182 | Rating count not captured | 1 Jan 2024 | Laravel 9, PHP 8.1, MySQL 8.x, Bootstrap 5.3, Vite | Admin, doctor, receptionist, accountant, patient. Appointments, prescriptions, invoices, email of prescriptions and invoices. No update shown after 1 Jan 2024 | [Item](https://codecanyon.net/item/doctorly-hospital-clinic-management-laravel-system/35099826). First pass |
| Medicare (XemaAI) | $59 on a search snippet | 134 on one snippet and 160 on another. Not reconciled | Search snippet said 5.00 from 18 reviews. Not re-read on a saved item page | Search snippet said recently updated; exact date not copied | Flutter, PHP, HTML, JS as listed on the search snippet | Author text: admin, user app, doctor app, website, queue, pathology, prescriptions, invoices, Razorpay and Stripe, AI doctor recommendation chat, video consultations | [Item](https://codecanyon.net/item/medicare-complete-hospital-clinic-appointment-system-with-admin-web-user-doctor-apps/56035885). Treat sales and rating as unverified until the item page is opened again |
| Medigo | $99 | 5 | Rating count not shown | 14 Aug 2026 on the item page; a search card said 15 Aug 2026 | Laravel, Flutter 3.x, PHP 8.4, MySQL 8, Composer | Full hospital plus mobile apps: appointments, encounters, multi-clinic, billing, telemedicine, beds, pharmacy, lab, radiology, IPD/OPD. Created about 2 months before this research. Third-party AI, telemedicine, payments, and notifications are extra | [Item](https://codecanyon.net/item/medigo-hospital-management-system-php-script-with-laravel-and-flutter/63788685). First pass |
| HospitalNext SaaS | $118 | 25 | Not captured | Not captured on the search card used | Node.js; title says Next.js | Search card only | [Search: hospital management system](https://codecanyon.net/search/hospital%20management%20system). First pass |
| AI Hospital | $98 | 42 | Not captured | 20 Jul 2026 on one search card | Node.js | Search card only | [Search: medical clinic system](https://codecanyon.net/search/medical%20clinic%20system). First pass |
| CareNova | $49 | 16 | Not captured | 12 Sep 2026 | React, Node.js | Search card: clinic web app, patients and appointments | Same medical-clinic search. First pass |
| EyeCare Pro | $98 | 9 | Not captured | 7 Aug 2026 | React, Node.js | Search card: eye hospital, AI in the title | Hospital search page. First pass |
| Bayanno | $50 | 1.3K | (85) on the search card; star average not opened | 23 May 2019 | CodeIgniter, PHP 7.x | Included because the sales count is large and the last update is years old. Features not opened | Hospital search page. First pass |
| GoDoctor | $49 | 28 on one card and 30 on another | Not captured | 3 Jun 2026 | Flutter 3.x | Search card: doctor appointment, clinic, hospital, lab, medical store | Medical-clinic and hospital search pages. First pass |

QDOCS author rating **4.59 from 907 ratings** is the author’s portfolio total, not the Smart Hospital item score. Source: [QDOCS portfolio](https://codecanyon.net/user/qdocs/portfolio), accessed 23 Oct 2026.

### KiviCare family, kept distinct

These are separate products. Mixing their sales counts would overstate the pharmacy add-on.

- **VERIFIED, KiviCare Pro:** WordPress clinic EHR add-on. $149, 1,229 sales, last update 29 Sep 2026. Pharmacy is not this item. Source: item page above.
- **KiviCare Laravel clinic:** a search excerpt of [item 53137285](https://codecanyon.net/item/kivicare-complete-clinic-management-system-laravel-flutter/53137285) showed $149, 308 sales, and 4.47 from 17 reviews. The full page was not saved separately. The excerpt lists appointments, encounters, billing, telemedicine, multi-clinic, and Flutter apps. Pharmacy is the add-on below. The vendor site also shows a service pack from $599 or $799. That is a service price, not the CodeCanyon item price.
- **VERIFIED, KiviCare Pharma:** see section 5.

### License and deployment, where the page stated it

- **VERIFIED:** Medigo’s item page describes a Regular License as use by the buyer or one client in a single end product whose end users can be charged. The page says the total price includes the item price and a buyer fee. It does not quote the buyer fee amount.
- **VERIFIED:** Smart Hospital comment replies say Regular and Extended licenses apply to the main product, and that a SaaS add-on is separate. One buyer mentioned a **$999** Extended License in a question. That number is the buyer’s wording on the comment thread, not an Envato price table checked independently. Source: [comments](https://codecanyon.net/item/smart-hospital-hospital-management-system/23205038/comments).
- **VERIFIED:** InfyCare and HMS SaaS are described by their author as multi-tenant SaaS-style installs. Doxe is described as SaaS with membership packages. Doctorly reads as one hospital or clinic install with staff roles.
- **Unverified:** hosting requirements for most items beyond the software version tags. Smart Hospital’s own documentation is the exception below.

### Demos

- **VERIFIED:** InfyCare publishes a frontend URL and a backend login URL on the item page, and publishes demo account passwords there. The passwords are intentionally omitted from this repository.
- **VERIFIED:** Smart Hospital support text says the public demo matches the purchased feature set, and that demo-site data is not part of the purchase. Source: [support tab](https://codecanyon.net/item/smart-hospital-hospital-management-system/23205038/support).
- Live-demo quality was not exercised. No competitor demo was clicked through for this report.

### InfyCare medicine stock, from the author’s docs

**Search excerpt, not a full saved page:** [InfyCare admin docs](https://infyom.com/docs/infy-care/admin-panel.html) describe medicine categories, brands, a quantity recorded at entry, purchases, used medicine, and medicine bills. The CodeCanyon item page re-opened the same day does not mention batch numbers, expiry, or FEFO. **ASSUMPTION:** the public InfyCare material describes a stock counter. It is not evidence of batch-level first-expiry-first-out dispensing.

## 5. Pharmacy and dispensary comparison

“Documented” means the public listing or the vendor’s own page. It is not a code audit and not a clicked-through demo.

| Product | Price | Sales | Last update | Stack as labeled | Documented pharmacy scope | Source |
|---|---:|---:|---|---|---|---|
| Medicine Care (Pharmacy Management Software with Ecommerce Store-PWA) | $60 | 146 | 19 Oct 2026 | Laravel 11, PHP 8.x, MySQL 8.x | POS, batches, expiry, FEFO, purchases, prescriptions converted to a sale, returns. Strongest current pharmacy incumbent | [Item](https://codecanyon.net/item/pharmacy-management-software-laravel/36422063) |
| Medix | $75 | 164 | 23 Oct 2023 | Laravel, PHP 8.x, MySQL 8.x | POS, stock, suppliers, purchase orders, purchase returns, multi-store, accounting reports. Batch, expiry, FEFO, and barcode were not confirmed on the text captured | [Search card](https://codecanyon.net/search/pharmacy%20management%20system) and [item](https://codecanyon.net/item/medix-the-pharmacy-pos-management-system/20479904) |
| Acnoo Pharmacy SaaS | $29 | 119 | 14 Aug 2026 | Flutter 3.x, PHP | Pharmacy SaaS and mobile app. Not a clinic record. Search card used; an earlier item excerpt showed 106 sales | [Search card](https://codecanyon.net/search/pharmacy%20management%20system) |
| KiviCare Pharma add-on | $89 | 10 | 27 Jan 2026 on the item page | Laravel, PHP 8.x, MySQL 8.x | Clinic add-on: batch-wise stock, expiry, suppliers, prescription assigned to a pharma user | [Item](https://codecanyon.net/item/kivicare-tm-pharma-addon-pharmacy-inventory-management-in-laravel/60994895) |
| Hospital and Pharmacy Management System (ASP.NET) | $69 | 81 | 17 Apr 2026 | .NET 10.x | Title only on the search card. Features not opened | Same pharmacy search page |
| MyMedicine | $49 | 3 | 14 Aug 2026 | Flutter 3.x | Author text lists sales, purchases, expired products, barcode labels, and prescription orders | [Item](https://codecanyon.net/item/mymedicine-pharmacy-management-php-script-with-flutter-mobile-app/64055366) and the search card |
| AI Pharmacy SaaS | $98 | 18 | 20 Jul 2026 | ReactJS, Node.js | Title and price on the search card. Features not opened | Same pharmacy search page |
| GST Enabled Pharmacy | $249 | 2 | Not re-read | Not re-read | Search excerpt only. Not used for pricing | First-pass search excerpt of [item 24946652](https://codecanyon.net/item/gst-enabled-pharmacy-management-software/24946652) |

The pharmacy search page also listed general POS products, including Stocky at about 2.5K sales and SalePro at about 3.2K sales. Those are not pharmacy competitors. **ASSUMPTION:** their counts show that a general Laravel POS outsells the pharmacy scripts above. They are not evidence for a clinic-dispensary feature list.

### Medicine Care, opened in full

**VERIFIED** from the [item page](https://codecanyon.net/item/pharmacy-management-software-laravel/36422063), accessed 23 Oct 2026:

- $60, 146 sales, created about 5 years ago, last update 19 Oct 2026. The search card showed (20) ratings. The star average was not on the item text captured.
- Version text on the page: 2.5.2. Framework line: Laravel 11.
- Documented: POS with cash, card, MFS, and due; discounts; tax; sales returns and partial refunds; product catalog; batch tracking with expiry; FEFO; low-stock and expiring-product alerts; bulk upload; purchases and purchase returns; vendor dues; prescription entry with status and conversion to a sale; multi-language; PWA; demo data; local and cPanel installation videos.
- Multi-store is named as a separate add-on.
- Default VAT and tax rates on the page are 0%.

**VERIFIED** from the start of the [comment thread](https://codecanyon.net/item/pharmacy-management-software-laravel/36422063/comments). The thread contained 154 comments. Only the first portion was read.

- A buyer reported that a product’s category and units cannot be updated on entry. The author tied that limit to architecture and integrity and said a later update was planned.
- A buyer on an existing subdomain hit `UPDATE_HMAC_SECRET` not set and then an update-package checksum mismatch. The author said the main zip is for a new install, and that existing sites need a separate update zip. The author said those messages stop and roll back, and do not remove existing data.
- The author said the Laravel source is editable and is not ionCube or SourceGuardian encoded.
- The author said daily work can run on a local Windows server with PHP and MySQL, and that several staff can share it over a LAN. Activation uses `license.ayaantec.com`. A new install may run for 7 days before activation. After activation, a license check is due about every 24 hours. If the computer stays offline past the grace date on the license certificate, the author said the system stays locked until it can validate again. The author said there is no permanent offline license.
- The author said built-in stock reduction is an invoice. A screen that issues stock to a department without an invoice is custom work. A custom issue must reduce both the product quantity and the selected batch quantity.
- The author said each purchase stores a batch number, an expiry date, and its own quantity. Scanning a product takes the batch that expires first. Staff can choose a specific batch. One line comes from a single batch. The author said it does not use FIFO.
- The author said barcode label printing is not in the main file. It was described as a separate Labels & Barcodes add-on, in review at the time of the comment. A sale still uses the product barcode and takes the earliest-expiring batch.
- A buyer said the financial report was not downloadable. The author later replied that a new update added the download.
- The author said offline POS synchronization, so the till keeps selling through a network outage and syncs later, is custom work. The public support reply pointed buyers to WhatsApp and email.
- One buyer’s activation error was answered by directing them to WhatsApp or email.

**ASSUMPTION:** Medicine Care already advertises the inventory claims a new listing would be compared against: batches, expiry, FEFO, purchases, and a prescription converted into a sale. A new product that only repeats that list has a weak CodeCanyon case. The comment thread shows live friction around unit edits, update packaging, and a license check that can lock an offline install.

### Medix

**VERIFIED** from the pharmacy [search card](https://codecanyon.net/search/pharmacy%20management%20system) and the item excerpt captured the same day:

- $75, 164 sales, Laravel, PHP 8.x, MySQL 8.x, created about 9 years ago, last update 23 Oct 2023.
- Feature text in the excerpt includes POS, discounts, roles, medicines, CSV upload, stock, categories, suppliers, supplier payments, purchase orders, purchase returns, multi-store, expenses, and accounting reports such as a journal, income statement, and trial balance.
- A changelog line dated 30 Dec 2022 says the product was upgraded to Laravel 8 and Vue 3, and that multi-store and multi-payments were added.
- Batch, expiry, FEFO, and barcode were not confirmed on the page text captured. The listing had gone three years without an update on the date of this research.

### KiviCare Pharma

**VERIFIED** from the [item page](https://codecanyon.net/item/kivicare-tm-pharma-addon-pharmacy-inventory-management-in-laravel/60994895):

- $89, 10 sales. The item page says created about 11 months ago and last updated 27 Jan 2026.
- The category search card on the same day said last updated 9 Jul 2026. Those two dates disagree. This report cites the item page.
- Laravel, PHP 8.x, MySQL 8.x. It extends the KiviCare clinic product. The regular-license sentence on the page says end users are not charged for. That wording differs from Medicine Care’s fetched license sentence, which said end users can be charged. Both are quoted from the pages. Envato’s current license text was not opened as a separate article.
- Public features: pharma role, suppliers, medicine categories and forms, stock, expiry, pricing, batch details, purchase orders with stock updates, a doctor assigning a prescription to a pharma user, tax, dashboards, and earnings.
- Reviews were not opened.

**Search excerpt** of the [feature documentation](https://documentation.iqonic.design/kivicare-pharma/all-features/): completing a purchase order and updating its payment status adds the purchased quantity to medicine stock. Medicine fields described there include dosage, category, form, supplier, quantity, expiry, reorder level, manufacturer, batch and serial numbers, and purchase and selling price. FEFO, barcode, and strip-to-tablet conversion were not in that feature list. The [integration doc](https://documentation.iqonic.design/kivicare-pharma/integrating-pharma-module-in-admin-panel/) says the add-on zip is uploaded into the KiviCare admin and is not extracted first.

**ASSUMPTION:** the public KiviCare Pharma material describes batch fields and an expiry list. It does not document a goods receipt that is separate from purchase-order completion, and it does not document packaging conversion.

## 6. Buyer pain with a source

### Smart Hospital, first pass

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

Review text for InfyCare, KiviCare Pro, KiviCare Pharma, Doxe, Doctorly, Medix, and the Next.js listings was not collected.

### Medicine Care buyers, second pass

The comment findings are in section 5. **ASSUMPTION:** the CodeCanyon buyer visible in that thread is a developer asking about editable source, LAN install, barcode hardware, and whether a license server can lock the PC. That buyer is comparing install and license behavior. The thread does not show a clinic owner describing a dispensary shift.

## 7. Bangladesh and international buyers

### Bangladesh product evidence

These are vendor descriptions of their own products, checked on 23 Oct 2026. They are not independent audits. No sales counts were published on the pages opened.

**VERIFIED** from [ChamberBD features](https://chamberbd.com/features):

- Serial-number booking by chamber and date, with new, old, and follow-up fees.
- Weekly schedules, slot length, and a maximum number of patients per slot.
- Staff-recorded payments: cash, bKash, Nagad, and card. Full or partial payment, dues, and printed money receipts.
- Invoice print sizes named on the page: A4, A5, or thermal, on Pro and Premium.
- Online serial booking from a public page.
- A stated medicine catalogue count of 23,429, with the page saying the count was verified 22 Oct 2026. This report did not recount that catalogue. That catalogue must not be copied into this product.

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

**VERIFIED** from [Bisnesy pharmacy](https://bisnesy.com/pharmacy-software):

- Hosted POS. The page says plans start at ৳499 per month, with no setup fee, a 7-day trial, and a 30-day money-back claim.
- The vendor states more than 26,000 medicine brands sold in Bangladesh, with generic, strength, company, and MRP filled from that database. A missing brand can be added by hand.
- Every purchase line carries batch and expiry. The page says the owner gets a daily alert for batches expiring within 7 days.
- Tablets per strip are set per brand, and the POS can sell a strip or loose tablets.
- The same page states that Bisnesy does not store prescriptions or patient records, and does not file with the DGDA.
- The medicine database is theirs. This product must not copy it.

**VERIFIED** from the [ShifaSoft homepage](https://shifasoft.com/):

- Hosted hospital ERP. The page claims 200+ healthcare facilities, 5 lac+ patients served, and 99.9% uptime. Those claims were not checked against any register.
- Pharmacy bullets on the page: medicine stock, expiry alerts, prescription-linked dispensing, supplier and purchase, and reorder alerts.
- The clinic section on that page emphasizes registration, visit history, digital prescription, SMS reminders, and billing. It does not put pharmacy in the clinic bullet list.
- Displayed prices, exclusive of VAT: Diagnostic ৳3,000 per month; Hospital ৳8,000 per month, including a line written “Full Pharmacy (LIS)”; Enterprise custom. Annual billing is described with a 15% discount. Cloud or on-premise is claimed.
- A separate prescription page, seen in search results and not fully fetched, listed Starter ৳999, Professional ৳1,499, and Clinic ৳3,999 per month, with pharmacy or lab integration marked optional on the clinic plan. Treat that as a second price table, not the homepage price. Source URL in the search result: [shifasoft.com/prescription](https://www.shifasoft.com/prescription).

**Search excerpt** of [Shafa Care’s clinic page](https://shafa.care/en/solutions/clinics): the page describes an e-prescription arriving at a dispensary as a sale, with batch and expiry, and consultation plus dispensary money on one ledger. No price was captured. This was not a code review.

**HYPOTHESIS:** clinics that want software on their own server are a different buyer from clinics that will use ChamberBD, Bisnesy, or ShifaSoft as a hosted app. No public count of Bangladeshi CodeCanyon purchases was found, so the size of the self-hosted segment is unknown.

**HYPOTHESIS:** serial numbers, follow-up fees, recorded bKash and Nagad references, Bangla prescription print, strip-to-tablet stock, and expiry alerts are the local workflow details a self-hosted dispensary product would need if the buyer is a Bangladesh clinic. International buyers still need configurable currency, time zone, and an English interface. Both can live in settings. That combination was not tested with buyers.

### International buyers

**VERIFIED:** CodeCanyon item pages reviewed here are in English, priced in US dollars, and sold under Envato’s regular license wording where that wording was shown (Medigo, KiviCare Pharma, Medicine Care comments). InfyCare exposes a currencies setting in its feature description.

**Unverified:** which countries buy these items. CodeCanyon does not show a public buyer-country breakdown on the pages opened.

### Preference between pharmacy, clinic, and a combined product

**VERIFIED counts, kept separate from the interpretation:**

- Standalone pharmacy scripts have public sales in the low hundreds over several years.
- Clinic and hospital scripts have public sales in the hundreds to low thousands.
- The integrated KiviCare Pharma add-on has 10 sales.
- Bisnesy states that it sells pharmacy operations and does not store prescriptions.
- ShifaSoft’s homepage advertises prescription-linked dispensing inside a hospital suite priced at ৳8,000 per month.

**HYPOTHESIS:** the combined workflow is a documented way some Bangladesh facilities describe their work. It is not a proven CodeCanyon category. A self-hosted Next.js product that joins the visit to the dispensary is a differentiation proposal, not a demand measurement.

## 8. Envato submission requirements

Checked 23 Oct 2026. The author-intake article was opened again during the pharmacy pass. The other articles in this section were opened in the first pass and were not re-fetched.

**VERIFIED**, [author applications paused](https://help.author.envato.com/hc/en-us/articles/53981083605913-Author-applications-are-paused-new-authors-join-by-invitation-only), updated 25 Sep 2026:

- Open applications are paused. New Envato Market author accounts cannot be created unless Envato sends an invitation.
- Code, Theme, Photo, Audio, and Graphics are named as categories not currently being invited, with a stated exception for Animated Graphics and Fonts later in 2026.
- Existing authors in those categories continue to be supported.
- Existing authors cannot apply to add a new content type during the pause.
- There is no waitlist. Support requests do not create an invitation. No reopening date is given.
- The same pause is repeated on [How to Join and Sell on Envato](https://help.author.envato.com/hc/en-us/articles/360000424443-How-to-Join-and-Sell-on-Envato), updated 27 May 2026, and [Becoming an Envato Author](https://help.author.envato.com/hc/en-us/articles/57391878017817-Becoming-an-Envato-Author-How-to-apply), updated 21 Oct 2026. Those two articles were opened in the first pass.

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

**Unverified:** the body of Envato’s Node.js category requirements. The article is listed on [Code Item Requirements](https://help.author.envato.com/hc/en-us/sections/360000089563-Code-Item-Requirements) and was not retrieved in either pass. Re-read it before any future upload. A Next.js zip is not review-ready on the evidence in this file.

**Not treated as fact:** a Smart Hospital comment that CodeCanyon raised platform fees on 1 Jul 2026. That statement is the vendor’s comment. No Envato fee schedule was opened.

## 9. Target customer

**ASSUMPTION, for a later product decision:** if a product is ever built, the first operator is one outpatient site with an in-house dispensary.

- About 2–10 doctors.
- Daily users: receptionist, doctor, dispenser, and a person who records payments.
- The doctor writes the prescription. Saving it does not change stock.
- The dispenser chooses a valid batch and records the quantity that left the shelf.
- Consultation money and medicine money stay distinguishable on one invoice.

The earlier recommendation, a clinic with no pharmacy inventory, is superseded by this dispensary scope. The full retail POS, ecommerce store, laboratory, inpatient wards, and accounting suite are not the first operator.

No interviews were run. The profiles below are working labels for the interview guide in section 13. They are not findings from customers.

| Profile | What the public record supports | What it does not support |
|---|---|---|
| CodeCanyon buyer | Medicine Care presales ask about editable source, LAN install, barcode hardware, and a license check that can lock an offline PC | A clinic owner describing a dispensary shift |
| Bangladesh operator, from vendor pages | Serial or token, Bangla print, strip and loose tablet, expiry, supplier dues, recorded bKash or Nagad. Displayed fees run from Bisnesy at ৳499 per month to ShifaSoft’s hospital plan at ৳8,000 per month | Willingness to install Docker, or to pay $59 for a script |
| Doctor | Doxe’s 514 sales and the prescription plans above support a short prescription with brand or generic, dose, duration, and print | The doctor managing stock |
| Dispenser | Bisnesy states expired stock, loose tablets, and unrecorded credit as the costly failures. ShifaSoft’s homepage advertises prescription-linked dispensing | A measured demand for a self-hosted Next.js dispensary |

Segment notes from the first pass, kept as context. Scores are judgment, not measurements. Scale: 1 low, 5 high.

| Segment | Evidence that someone pays | Build size | Price room | Difference from the leaders | Fits a first release | Judgment |
|---|---:|---:|---:|---:|---:|---|
| Independent single-doctor chamber | Doxe (514 sales, $39) and ChamberBD’s own feature page | 4 | 2, because hosted local apps already exist | 3, if serials and Bangla print are solid | 4 | Credible, and easy to under-scope into a clone of Doxe |
| Small multi-doctor outpatient clinic with a dispensary | InfyCare (403 sales, $49) plus Medicine Care (146 sales, $60). KiviCare Pharma (10 sales, $89) is the weak combined signal | 2, because batches and dispensing are harder than a visit note | 3 | 4, if the prescription and the batch movement share one trail | 4 | Preferred first operator if a build is later approved. Still unvalidated by interviews |
| Retail pharmacy with no patient record | Medicine Care, Medix, Acnoo, and Bisnesy’s own statement that it stores no prescriptions | 2 | 2, because Medicine Care already advertises FEFO at $60 | 2 | 2 | A crowded shelf. Not the first product |
| Specialist consultation center | No separate sales figure found | 3 | 3 | 3 | 3 | A settings variant of the multi-doctor clinic, not a separate product |
| Diagnostic practice or full hospital | Smart Hospital comments show lab workflows confuse buyers. ShifaSoft sells this as a monthly hospital suite | 1 | 2 | 1 | 1 | Out of the first release |

**Core problem this would address, if a later build is approved:** the front desk needs a serial or a slot, the doctor needs a note and a prescription, and the dispenser needs the stock count to change only when a valid batch is handed over, with a receipt that does not count the medicine twice.

**Primary journeys, if a later build is approved:**

1. Reception registers or finds a patient, books a slot or issues a serial, checks the patient in, and watches the queue.
2. The doctor opens the checked-in visit, writes a note, and saves a prescription. Stock does not change.
3. The dispenser sees that prescription, checks a valid batch, records the quantity actually issued, and the stock movement is stored.
4. The invoice carries the consultation charge and the dispensed lines once. A payment or a balance is recorded.
5. The admin reads the day’s appointments, collections, low stock, and near-expiry batches.

**Positioning, if a later build is approved:** one clinic on the buyer’s own server, with the visit, the prescription, the batch, and the invoice on one trail. English first, Bengali as a translation, recorded mobile-wallet references, and an installer that does not require the cPanel file-permission steps documented for Smart Hospital. This is a positioning statement. The installer does not exist.

## 10. SWOT

- **Strengths to design toward:** one prescription-to-dispense trail; stock increases only on a goods receipt; prescribed quantity stored separately from dispensed quantity; Docker install; strict TypeScript; a license check that cannot lock the clinic out of its own records. Medicine Care’s author described a lock after the offline grace date.
- **Weaknesses:** no Code author account; no interviews; no application code; Next.js listings visible on 23 Oct 2026 had tens of sales; Medicine Care already advertises FEFO at $60 and was updated four days before this research.
- **Opportunities:** Smart Hospital support said prescription-numbered pharmacy billing was absent. InfyCare’s item page does not document batch FEFO. KiviCare Pharma’s public docs tie the stock increase to purchase-order completion. Medicine Care’s public comments show category and unit edits, update packaging, and offline license locks. Strip-to-tablet conversion is documented by Bisnesy and was absent from the CodeCanyon feature lists read on this date.
- **Threats:** buyers stay on cPanel PHP; a new author cannot upload; copying a medicine database creates a legal and licensing problem; every extra module adds a support promise, which the Smart Hospital thread already shows.

## 11. Differentiation and price test

Positioning that matches the evidence is a self-hosted dispensary attached to the visit, with an audit trail from prescription line to batch movement to invoice line. Competing by listing more hospital modules, or by using Next.js, is not supported by the sales counts.

These are design targets. They are not claims about a product, because nothing has been built:

- First-expiry-first-out selection that refuses expired, quarantined, and blocked batches.
- Partial dispensing, with prescribed quantity and dispensed quantity stored separately.
- Idempotent stock updates so a retried request does not dispense twice.
- A goods receipt that is the only event that increases stock, including a partial delivery.
- Integer strip and tablet conversion, stored in a base unit.
- English first, with a Bengali translation.
- Currency, time zone, and print layout in settings.
- License activation that leaves clinical and stock history readable when a license server is unreachable.

**HYPOTHESIS, not a list price.** The $59–$89 range discussed in the product brief sits next to InfyCare at $49, Medicine Care at $60, Medix at $75, and KiviCare Pharma at $89. KiviCare Pharma’s 10 sales argue against opening at $89. The Node pharmacy card at $98 with 18 sales argues against a stack premium. The first-pass hypothesis of about $59, based on InfyCare and on Next.js hospital cards at $98–$118 with 9–42 sales, still fits. The pharmacy pass does not raise it.

- If a listing ever exists, test a regular license at **$59**. Move the test to **$69** only after a demo shows goods-receipt stock, partial dispense, and unit conversion. Leave **$89** unused unless the finished scope is visibly broader than Medicine Care and still simple to install.
- Compare early sales with Medicine Care’s 146 sales over about five years, not with Smart Hospital’s 2,036. No monthly forecast is stated. There is no evidence for one.
- The extended license price is chosen in Envato’s upload flow. Another product’s extended price should not be copied. The $999 figure on the Smart Hospital thread is a buyer’s question, not a verified Envato rule.
- For a Bangladesh clinic conversation, ask what they pay per month and what implementation costs. ShifaSoft’s displayed hospital plan is ৳8,000 per month. A $59 script price is a developer price. It is a poor proxy for what a clinic owner pays.

## 12. MVP and exclusions

Recommended only if a future plan approves a build. None of this is implemented. The earlier outpatient MVP, which excluded pharmacy inventory, is superseded by the list below. This list is narrower than a full pharmacy POS and narrower than a hospital system.

**Unapproved MVP**

- One clinic per installation. Permissions for administrator, doctor, receptionist, and dispenser. Extra permissions are assignable. Job titles are not hard-coded roles that every clinic must use.
- Patients, doctors, weekly availability.
- Appointments that the database rejects when they overlap. Walk-in serials and timed slots. Check-in, reschedule, cancel, and a queue.
- Consultation note and prescription. Saving the prescription does not change stock.
- Medicines entered by the clinic. No bundled national catalogue.
- Batches with lot, expiry, cost, and quantity. Stock rises on a goods receipt, including a partial receipt. Expired or blocked batches cannot be dispensed.
- The dispenser records the quantity actually issued. That quantity may be lower than the prescribed quantity. The default batch choice is first-expiry-first-out. The dispenser can pick another valid batch.
- One invoice can carry the consultation charge and the dispensed lines. Dispensing does not create a second copy of those lines.
- Recorded payments and an outstanding balance. Cash, card, and a mobile-wallet reference such as bKash or Nagad. No live gateway.
- Fees for new, returning, and follow-up visits. Follow-up booked from a visit.
- Strip and tablet, stored as an integer base unit. Fractional tablets rejected when the unit forbids them.
- Low-stock and near-expiry lists. Reports for the day’s appointments, collections, and doctor workload.
- Audit rows for prescriptions, dispensing, stock movements, and payments.
- Docker Compose, a setup wizard, synthetic demo data labeled as synthetic, English by default, Bengali as a translation, configurable currency and time zone.
- License activation isolated from the clinical database. Local use continues when a license server is unreachable.

**Deferred until a buyer asks and a new plan says so**

- Barcode point of sale, cashier shifts, and walk-in retail as a separate mode.
- Supplier returns, physical stock counts, and inter-branch transfers.
- Online storefront, laboratory, radiology, inpatient beds, and telemedicine.
- Native mobile apps, live payment gateways, and SMS or WhatsApp gateways.
- Multi-branch and multi-tenant SaaS.
- A scraped or copied medicine database.
- Full accounting statements such as a trial balance or a journal.
- Any statement that the product complies with HIPAA, GDPR, DGDA rules, or Bangladesh health-privacy law. Those requirements are **not yet assessed**. A lawyer has not reviewed them.

## 13. Interview guide to run before a PRD

Eight to ten conversations. Record notes. Do not turn the notes into a market-size number. Ask clinic owners, one doctor, one dispenser, and two people who have bought a CodeCanyon medical script.

- Walk through yesterday’s last prescription: who typed it, who handed over the medicine, who took the money, and where the stock number changed.
- Ask what happens when a strip is opened and two tablets are sold.
- Ask what they do with a short supply, an expired box, and a supplier who delivers part of the order.
- Ask what they pay now, whether they will install Docker or only cPanel, and whether English screens with Bangla print is acceptable.
- Ask CodeCanyon buyers which file they last bought, how long install took, and whether they would pay $59 or $89 for a dispensary attached to the visit.

Until those notes exist, section 12 is a scope proposal, not validated demand.

## 14. Risks

| Risk | Evidence | Consequence |
|---|---|---|
| No CodeCanyon account | Owner confirmed they are not a Code author. Envato’s 25 Sep 2026 article blocks new Code authors | A finished item cannot be submitted through the normal author application |
| Saturated PHP clinic shelf | Smart Hospital 2,036 sales; several other clinic items above 400 sales | A similar clinic feature list is not a commercial advantage |
| Pharmacy incumbent | Medicine Care, $60, 146 sales, updated 19 Oct 2026, with FEFO already on the listing | Repeating that feature list is a weak reason to build |
| Weak combined-product signal | KiviCare Pharma, $89, 10 sales | The CodeCanyon add-on closest to this brief has not shown category demand |
| Weak Next.js sales signal | HospitalNext 25 sales at $118; AI Pharmacy SaaS 18 sales at $98; other Node cards from 9 to 42 sales | Buyers on this marketplace still pay for PHP and cPanel installers |
| Installer expectations | Smart Hospital docs require cPanel, writable PHP files, `mod_rewrite`, and a non-default MySQL `sql_mode`. Medicine Care buyers asked about cPanel updates and offline license checks | A Docker install helps a technical buyer and can raise support load for a buyer who expects shared hosting |
| License lock | Medicine Care’s author said an offline install locks after the grace date | A license module must not hide patient, prescription, or stock records |
| Support load | 2,304 public comments on one hospital product; 154 on Medicine Care, of which the first portion was read | Every extra module is a support promise. The unapproved MVP stays at one clinic dispensary |
| Medicine data | Bisnesy and ChamberBD publish catalogue counts. Those databases were not licensed for reuse | Medicines are entered by the clinic. No national catalogue is bundled |
| Legal and clinical | No legal review was done. Prescriptions and patient data are regulated in ways this research did not verify | Do not claim compliance. Do not design a license check that hides patient records when a license server is down |
| Public source | A public GitHub repository would publish the item a marketplace would charge for | This repository is private |
| Incomplete review reading | Only the first Smart Hospital comment page was read. Only the first portion of Medicine Care’s 154 comments was read. KiviCare Pharma reviews were not opened. Medicare’s sales figures conflicted across snippets. KiviCare Pharma’s search card and item page disagree on the last-update date | Do not cite unread review themes as market proof |

## 15. What this research does not decide

- It does not approve application code, a database, a PRD, or a CodeCanyon zip.
- It does not select an authentication library.
- It does not assert demand beyond the public sales counts above.
- It does not assess healthcare privacy law.
- It does not treat the dispensary MVP as validated. Interviews have not been run.

The next decision is whether to approve interviews, or a written commitment from a named clinic, before any PRD. A private build aimed at direct delivery remains possible later. CodeCanyon remains closed to new authors. That decision is not part of this document.
