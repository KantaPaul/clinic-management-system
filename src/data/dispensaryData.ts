import {
  MedicineBatch,
  GoodsReceiptNote,
  DispenseRecord,
} from '../types';

export const initialMedicineBatches: MedicineBatch[] = [
  {
    id: 'BAT-2026-001',
    medicineId: 'MED-01', // Napa Extend 665mg
    brandName: 'Napa Extend',
    genericName: 'Paracetamol',
    lotNumber: 'LOT-BX-9021',
    manufacturingDate: '2025-11-01',
    expiryDate: '2026-12-31', // FEFO: Earlier expiry (69 days away)
    costPerBaseUnit: 2.10,
    retailPricePerBaseUnit: 2.50,
    initialQuantity: 300,
    currentQuantity: 180,
    status: 'active',
    goodsReceiptId: 'GRN-2026-001',
    supplierName: 'Beximco Pharmaceuticals Ltd.',
    notes: 'FEFO Primary Batch for Napa Extend',
  },
  {
    id: 'BAT-2026-002',
    medicineId: 'MED-01', // Napa Extend 665mg
    brandName: 'Napa Extend',
    genericName: 'Paracetamol',
    lotNumber: 'LOT-BX-9844',
    manufacturingDate: '2026-03-15',
    expiryDate: '2027-09-30', // FEFO: Later expiry
    costPerBaseUnit: 2.15,
    retailPricePerBaseUnit: 2.50,
    initialQuantity: 500,
    currentQuantity: 500,
    status: 'active',
    goodsReceiptId: 'GRN-2026-002',
    supplierName: 'Beximco Pharmaceuticals Ltd.',
  },
  {
    id: 'BAT-2026-003',
    medicineId: 'MED-02', // Sergel 20mg
    brandName: 'Sergel',
    genericName: 'Esomeprazole Magnesium Trihydrate',
    lotNumber: 'LOT-HC-7741',
    manufacturingDate: '2025-08-10',
    expiryDate: '2027-02-28', // FEFO Active batch
    costPerBaseUnit: 5.80,
    retailPricePerBaseUnit: 7.00,
    initialQuantity: 280,
    currentQuantity: 140, // 10 strips of 14
    status: 'active',
    goodsReceiptId: 'GRN-2026-003',
    supplierName: 'Healthcare Pharmaceuticals Ltd.',
  },
  {
    id: 'BAT-2026-004',
    medicineId: 'MED-02', // Sergel 20mg (Expired batch example)
    brandName: 'Sergel',
    genericName: 'Esomeprazole Magnesium Trihydrate',
    lotNumber: 'LOT-HC-6510',
    manufacturingDate: '2024-09-01',
    expiryDate: '2026-10-10', // EXPIRED: System strictly blocks dispensing!
    costPerBaseUnit: 5.50,
    retailPricePerBaseUnit: 7.00,
    initialQuantity: 140,
    currentQuantity: 28,
    status: 'expired',
    goodsReceiptId: 'GRN-2026-001',
    supplierName: 'Healthcare Pharmaceuticals Ltd.',
    notes: 'EXPIRED batch - locked from dispensing pursuant to DGDA protocol',
  },
  {
    id: 'BAT-2026-005',
    medicineId: 'MED-03', // Seclo 20mg
    brandName: 'Seclo',
    genericName: 'Omeprazole',
    lotNumber: 'LOT-SQ-4102',
    manufacturingDate: '2025-10-01',
    expiryDate: '2027-04-30',
    costPerBaseUnit: 4.20,
    retailPricePerBaseUnit: 5.00,
    initialQuantity: 300,
    currentQuantity: 210, // 21 strips of 10
    status: 'active',
    goodsReceiptId: 'GRN-2026-001',
    supplierName: 'Square Pharmaceuticals PLC',
  },
  {
    id: 'BAT-2026-006',
    medicineId: 'MED-04', // Cef-3 200mg
    brandName: 'Cef-3',
    genericName: 'Cefixime Trihydrate',
    lotNumber: 'LOT-SQ-8812',
    manufacturingDate: '2026-01-10',
    expiryDate: '2027-06-30',
    costPerBaseUnit: 38.00,
    retailPricePerBaseUnit: 45.00,
    initialQuantity: 140,
    currentQuantity: 70, // 5 strips of 14
    status: 'active',
    goodsReceiptId: 'GRN-2026-001',
    supplierName: 'Square Pharmaceuticals PLC',
  },
  {
    id: 'BAT-2026-007',
    medicineId: 'MED-05', // Monas 10mg
    brandName: 'Monas',
    genericName: 'Montelukast Sodium',
    lotNumber: 'LOT-AC-3199',
    manufacturingDate: '2025-12-01',
    expiryDate: '2027-08-31',
    costPerBaseUnit: 13.50,
    retailPricePerBaseUnit: 16.00,
    initialQuantity: 200,
    currentQuantity: 130, // 13 strips of 10
    status: 'active',
    goodsReceiptId: 'GRN-2026-002',
    supplierName: 'Acme Laboratories Ltd.',
  },
  {
    id: 'BAT-2026-008',
    medicineId: 'MED-06', // Comprid 500mg (Low stock demo)
    brandName: 'Comprid',
    genericName: 'Metformin Hydrochloride',
    lotNumber: 'LOT-SQ-1940',
    manufacturingDate: '2025-05-01',
    expiryDate: '2027-05-15',
    costPerBaseUnit: 3.20,
    retailPricePerBaseUnit: 4.00,
    initialQuantity: 200,
    currentQuantity: 25, // LOW STOCK (< 50)
    status: 'active',
    goodsReceiptId: 'GRN-2026-001',
    supplierName: 'Square Pharmaceuticals PLC',
    notes: 'Low stock threshold reached; triggers reorder banner',
  },
  {
    id: 'BAT-2026-009',
    medicineId: 'MED-07', // Camlod 5mg (Near-expiry demo)
    brandName: 'Camlod',
    genericName: 'Amlodipine Besylate',
    lotNumber: 'LOT-SQ-0912',
    manufacturingDate: '2024-11-20',
    expiryDate: '2026-11-15', // NEAR EXPIRY (< 30 days)
    costPerBaseUnit: 4.00,
    retailPricePerBaseUnit: 5.00,
    initialQuantity: 150,
    currentQuantity: 40,
    status: 'near_expiry',
    goodsReceiptId: 'GRN-2026-001',
    supplierName: 'Square Pharmaceuticals PLC',
    notes: 'Flagged for FEFO liquidation before 15 Nov 2026',
  },
  {
    id: 'BAT-2026-010',
    medicineId: 'MED-08', // Bisocor 2.5mg (Quarantined demo)
    brandName: 'Bisocor',
    genericName: 'Bisoprolol Fumarate',
    lotNumber: 'LOT-SQ-Q991',
    manufacturingDate: '2026-02-01',
    expiryDate: '2028-02-01',
    costPerBaseUnit: 6.00,
    retailPricePerBaseUnit: 7.50,
    initialQuantity: 100,
    currentQuantity: 100,
    status: 'quarantined',
    goodsReceiptId: 'GRN-2026-001',
    supplierName: 'Square Pharmaceuticals PLC',
    notes: 'Quarantined for manufacturer packaging batch recall verification',
  },
];

export const initialGoodsReceiptNotes: GoodsReceiptNote[] = [
  {
    id: 'GRN-2026-001',
    grnNumber: 'GRN-2026-001',
    supplierName: 'Square Pharmaceuticals PLC (Banani Depot)',
    supplierInvoiceNo: 'SQ-INV-993821',
    receivedDate: '2026-10-15',
    receivedByUserId: 'USR-06',
    receivedByName: 'Tanvir Hossain (PharmD)',
    status: 'verified',
    totalAmount: 18450,
    paymentStatus: 'paid',
    notes: 'Quarterly clinic stock replenishment delivered via temperature-controlled van.',
    items: [
      {
        medicineId: 'MED-03',
        brandName: 'Seclo',
        genericName: 'Omeprazole',
        lotNumber: 'LOT-SQ-4102',
        manufacturingDate: '2025-10-01',
        expiryDate: '2027-04-30',
        packQuantity: 30, // 30 strips
        unitsPerPack: 10,
        totalBaseUnits: 300,
        costPerPack: 42.00,
        totalCost: 1260.00,
        retailPricePerBaseUnit: 5.00,
      },
      {
        medicineId: 'MED-04',
        brandName: 'Cef-3',
        genericName: 'Cefixime Trihydrate',
        lotNumber: 'LOT-SQ-8812',
        manufacturingDate: '2026-01-10',
        expiryDate: '2027-06-30',
        packQuantity: 10, // 10 strips of 14
        unitsPerPack: 14,
        totalBaseUnits: 140,
        costPerPack: 532.00,
        totalCost: 5320.00,
        retailPricePerBaseUnit: 45.00,
      },
      {
        medicineId: 'MED-06',
        brandName: 'Comprid',
        genericName: 'Metformin Hydrochloride',
        lotNumber: 'LOT-SQ-1940',
        manufacturingDate: '2025-05-01',
        expiryDate: '2027-05-15',
        packQuantity: 20,
        unitsPerPack: 10,
        totalBaseUnits: 200,
        costPerPack: 32.00,
        totalCost: 640.00,
        retailPricePerBaseUnit: 4.00,
      },
    ],
  },
  {
    id: 'GRN-2026-002',
    grnNumber: 'GRN-2026-002',
    supplierName: 'Beximco Pharmaceuticals Ltd. (Tejgaon)',
    supplierInvoiceNo: 'BX-CH-110482',
    receivedDate: '2026-10-18',
    receivedByUserId: 'USR-06',
    receivedByName: 'Tanvir Hossain (PharmD)',
    status: 'verified',
    totalAmount: 11250,
    paymentStatus: 'credit',
    notes: 'Standard replenishment for paracetamol & antihistamines. Supplier credit term: 30 days.',
    items: [
      {
        medicineId: 'MED-01',
        brandName: 'Napa Extend',
        genericName: 'Paracetamol',
        lotNumber: 'LOT-BX-9844',
        manufacturingDate: '2026-03-15',
        expiryDate: '2027-09-30',
        packQuantity: 50,
        unitsPerPack: 10,
        totalBaseUnits: 500,
        costPerPack: 21.50,
        totalCost: 1075.00,
        retailPricePerBaseUnit: 2.50,
      },
    ],
  },
];

export const initialDispenseRecords: DispenseRecord[] = [
  {
    id: 'DSP-2026-001',
    dispenseNumber: 'DSP-2026-001',
    prescriptionId: 'RX-2026-001',
    appointmentId: 'APT-2026-002',
    patientId: 'PAT-2026-002',
    patientName: 'Begum Rokeya',
    doctorId: 'DOC-01',
    doctorName: 'Dr. Nusrat Jahan',
    dispensedByUserId: 'USR-06',
    dispensedByName: 'Tanvir Hossain (PharmD)',
    dispensedAt: '2026-10-23T10:45:00Z',
    status: 'partially_dispensed',
    totalMedicineAmount: 325,
    invoiceId: 'INV-2026-002',
    notes: 'Patient took 1-week course initially due to cash on hand; returning next week for remaining balance.',
    items: [
      {
        prescribedMedicineId: 'rx-m1',
        medicineId: 'MED-01',
        brandName: 'Napa Extend',
        genericName: 'Paracetamol',
        dosageForm: 'Tablet',
        strength: '665mg',
        dosageSchedule: '1+0+1',
        duration: '7 Days',
        prescribedBaseQuantity: 14,
        dispensedBaseQuantity: 10, // Partial: 1 strip of 10 instead of 14 loose tabs
        packagingUnit: 'Strip (10 tabs)',
        unitsPerPack: 10,
        dispensedPacks: 1,
        dispensedLooseUnits: 0,
        selectedBatchId: 'BAT-2026-001',
        batchLotNumber: 'LOT-BX-9021',
        batchExpiryDate: '2026-12-31',
        unitPrice: 2.50,
        totalPrice: 25.00,
        fefoSelected: true,
        partialReason: 'Patient purchased 1 sealed strip (10 tablets)',
      },
      {
        prescribedMedicineId: 'rx-m2',
        medicineId: 'MED-02',
        brandName: 'Sergel',
        genericName: 'Esomeprazole Magnesium Trihydrate',
        dosageForm: 'Capsule',
        strength: '20mg',
        dosageSchedule: '1+0+1',
        duration: '14 Days',
        prescribedBaseQuantity: 28,
        dispensedBaseQuantity: 14, // Partial: 1 strip (14 caps) instead of 28
        packagingUnit: 'Strip (14 caps)',
        unitsPerPack: 14,
        dispensedPacks: 1,
        dispensedLooseUnits: 0,
        selectedBatchId: 'BAT-2026-003',
        batchLotNumber: 'LOT-HC-7741',
        batchExpiryDate: '2027-02-28',
        unitPrice: 7.00,
        totalPrice: 98.00,
        fefoSelected: true,
        partialReason: 'Patient bought 1 strip now, remaining strip on follow-up visit',
      },
      {
        prescribedMedicineId: 'rx-m3',
        medicineId: 'MED-04',
        brandName: 'Cef-3',
        genericName: 'Cefixime Trihydrate',
        dosageForm: 'Capsule',
        strength: '200mg',
        dosageSchedule: '1+0+1',
        duration: '7 Days',
        prescribedBaseQuantity: 14,
        dispensedBaseQuantity: 14, // Full dispense
        packagingUnit: 'Strip (14 caps)',
        unitsPerPack: 14,
        dispensedPacks: 1,
        dispensedLooseUnits: 0,
        selectedBatchId: 'BAT-2026-006',
        batchLotNumber: 'LOT-SQ-8812',
        batchExpiryDate: '2027-06-30',
        unitPrice: 45.00,
        totalPrice: 630.00,
        fefoSelected: true,
      },
    ],
  },
];

export interface MarketResearchCompetitor {
  name: string;
  category: 'Clinic Script' | 'Standalone Pharmacy POS' | 'Clinic Pharmacy Add-on' | 'Bangladesh Hosted ERP';
  salesCount: string;
  priceModel: string;
  lastUpdated: string;
  fefoBatchSupported: boolean;
  stripConversionSupported: boolean;
  prescriptionLinked: boolean;
  keyLimitationOrNote: string;
}

export const marketResearchCompetitors: MarketResearchCompetitor[] = [
  {
    name: 'KiviCare Pharma Add-on',
    category: 'Clinic Pharmacy Add-on',
    salesCount: '10 sales',
    priceModel: '$89 one-time (Requires KiviCare clinic)',
    lastUpdated: 'Jan 2026',
    fefoBatchSupported: false,
    stripConversionSupported: false,
    prescriptionLinked: true,
    keyLimitationOrNote: 'Ties stock increase directly to purchase-order completion; no FEFO or strip-tablet conversion documented.',
  },
  {
    name: 'Medicine Care (Laravel)',
    category: 'Standalone Pharmacy POS',
    salesCount: '146 sales',
    priceModel: '$60 one-time',
    lastUpdated: '19 Oct 2026',
    fefoBatchSupported: true,
    stripConversionSupported: false,
    prescriptionLinked: false,
    keyLimitationOrNote: 'Strong retail POS incumbent; locks offline PC on periodic remote license check; rigid unit/category schema.',
  },
  {
    name: 'Smart Hospital (CodeIgniter)',
    category: 'Clinic Script',
    salesCount: '2,036 sales',
    priceModel: '$89 one-time',
    lastUpdated: '11 Aug 2026',
    fefoBatchSupported: false,
    stripConversionSupported: false,
    prescriptionLinked: false,
    keyLimitationOrNote: 'Author confirmed pharmacy billing does not carry or follow the prescription number.',
  },
  {
    name: 'InfyCare (Laravel)',
    category: 'Clinic Script',
    salesCount: '403 sales',
    priceModel: '$49 one-time',
    lastUpdated: '29 May 2026',
    fefoBatchSupported: false,
    stripConversionSupported: false,
    prescriptionLinked: true,
    keyLimitationOrNote: 'Simple aggregate stock counter without batch tracking, lot numbers, or FEFO expiry enforcement.',
  },
  {
    name: 'Bisnesy Pharmacy (BD)',
    category: 'Bangladesh Hosted ERP',
    salesCount: 'Local Hosted SaaS',
    priceModel: '৳499 - ৳2,000 / month',
    lastUpdated: 'Active 2026',
    fefoBatchSupported: true,
    stripConversionSupported: true,
    prescriptionLinked: false,
    keyLimitationOrNote: 'Supports 26k BD brands & strip conversion, but explicitly does NOT store prescriptions or patient records.',
  },
  {
    name: 'ShifaSoft Hospital ERP (BD)',
    category: 'Bangladesh Hosted ERP',
    salesCount: '200+ facilities claimed',
    priceModel: '৳8,000 / month (excludes VAT)',
    lastUpdated: 'Active 2026',
    fefoBatchSupported: true,
    stripConversionSupported: true,
    prescriptionLinked: true,
    keyLimitationOrNote: 'Full enterprise suite; expensive monthly operational cost for independent 1-5 doctor clinics.',
  },
];

export const swotData = {
  strengths: [
    {
      title: 'End-to-End Audit Trail',
      description: 'Unified prescription line → batch deduction → invoice line → recorded payment reference (bKash/Nagad/Cash).',
    },
    {
      title: 'Receipt-Driven Stock Increase',
      description: 'Stock strictly rises only upon verified Goods Receipt (GRN), keeping inventory ledger idempotent.',
    },
    {
      title: 'Separation of Prescribed vs Dispensed',
      description: 'Saving a doctor prescription never alters shelf stock; dispensers log actual quantity handed over (partial dispense).',
    },
    {
      title: 'Strict FEFO with Auto-Lockout',
      description: 'Default batch recommendation selects earliest expiry; system hard-rejects expired or quarantined lots.',
    },
    {
      title: 'Integer Strip & Tablet Conversion',
      description: 'Base inventory stored as integer units (tablets), preventing rounding errors and fractional slippage.',
    },
    {
      title: 'Offline Continuity',
      description: 'No remote kill-switch; license checks isolated from clinical operations so local care is never halted.',
    },
  ],
  weaknesses: [
    {
      title: 'Envato Author Account Pause',
      description: 'Market author onboarding paused since 25 Sep 2026; cannot list as a new CodeCanyon author immediately.',
    },
    {
      title: 'No Live Direct Buyer Interviews',
      description: 'Document based on public vendor audits and marketplace records; customer discovery interviews still pending.',
    },
    {
      title: 'Entrenched Laravel/PHP Incumbents',
      description: 'Traditional cPanel hosting developers still favor PHP scripts ($59-$60) over modern TypeScript/Docker stacks.',
    },
  ],
  opportunities: [
    {
      title: 'Prescription-Numbered Dispensary Billing Gap',
      description: 'Smart Hospital and InfyCare lack batch-aware, prescription-linked billing for outpatient chambers.',
    },
    {
      title: 'Local Packaging Realities (Strip vs Loose)',
      description: 'Bangladesh dispensers frequently split strips; competitors lack integer pack-conversion rules.',
    },
    {
      title: 'Bilingual Doctor & Patient Experience',
      description: 'Native English clinical workflow with instant Bengali (Bangla) patient instructions and receipt prints.',
    },
    {
      title: 'Direct Private Deployments',
      description: 'High willingness to pay for customized clinic chamber installations (৳15,000 - ৳45,000 setup + support).',
    },
  ],
  threats: [
    {
      title: 'Commoditized Marketplace Pricing',
      description: 'CodeCanyon script prices compressed to $29–$69 range despite complex clinical logic.',
    },
    {
      title: 'Legal & Drug Catalog Intellectual Property',
      description: 'Copying third-party brand databases creates legal exposure; must rely on clinic-entered medicines.',
    },
    {
      title: 'Support Overhead for Multi-Module Stacks',
      description: 'Over-extending into full ERP, lab, and inpatient beds creates unsustainable developer support burdens.',
    },
  ],
};

export const mvpScopeChecklist = [
  {
    feature: 'Single-Clinic Installation & Multi-Role Access',
    description: 'Admin, Doctor, Receptionist, Dispenser with granular permissions',
    status: 'Implemented in Design View',
    category: 'Core Architecture',
  },
  {
    feature: 'Prescription-to-Dispense Trail',
    description: 'Doctor issues prescription; dispenser validates batches without double billing',
    status: 'Implemented in Design View',
    category: 'Clinical & Dispensing',
  },
  {
    feature: 'First-Expiry-First-Out (FEFO) Selection',
    description: 'Earliest expiring valid batches recommended; expired and quarantined batches hard-blocked',
    status: 'Implemented in Design View',
    category: 'Inventory & Batches',
  },
  {
    feature: 'Partial Dispense Support',
    description: 'Records actual issued vs prescribed quantity with rationale tracking',
    status: 'Implemented in Design View',
    category: 'Clinical & Dispensing',
  },
  {
    feature: 'Integer Strip & Tablet Conversion',
    description: 'Integer base units; packs to loose tablet conversion without fractional rounding errors',
    status: 'Implemented in Design View',
    category: 'Inventory & Batches',
  },
  {
    feature: 'Goods Receipt Note (GRN) Intake',
    description: 'Stock increases only on verified goods receipt, independent of purchase orders',
    status: 'Implemented in Design View',
    category: 'Supply Chain',
  },
  {
    feature: 'Consolidated Billing with Consultation & Medicines',
    description: 'Single invoice carries doctor consultation fee and dispensed items without duplication',
    status: 'Implemented in Design View',
    category: 'Billing & Payments',
  },
  {
    feature: 'Local Payment Tracking (bKash, Nagad, Cash, Card)',
    description: 'Records transaction references and mobile numbers without complex payment gateways',
    status: 'Implemented in Design View',
    category: 'Billing & Payments',
  },
  {
    feature: 'Near-Expiry & Low-Stock Early Warnings',
    description: 'Visual threshold alerts (<30 days expiry or below reorder level)',
    status: 'Implemented in Design View',
    category: 'Inventory & Batches',
  },
  {
    feature: 'Bilingual Interface (English & Bengali)',
    description: 'English clinical screens with Bengali patient instructions and print layouts',
    status: 'Implemented in Design View',
    category: 'Localization',
  },
  {
    feature: 'Deferred Modules (POS barcode shifts, Lab LIS, Inpatient Beds)',
    description: 'Intentionally excluded to preserve lean, robust outpatient focus as per research findings',
    status: 'Deferred per Plan',
    category: 'Roadmap Guardrail',
  },
];
