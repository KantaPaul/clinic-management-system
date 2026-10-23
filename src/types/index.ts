export type UserRole = 'admin' | 'doctor' | 'receptionist' | 'accountant' | 'dispenser';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  doctorId?: string; // If user is linked to a doctor profile
}

export interface Doctor {
  id: string;
  name: string;
  nameBn?: string;
  title: string;
  titleBn?: string;
  specialty: string;
  specialtyBn?: string;
  bmdcRegNo: string;
  degrees: string;
  degreesBn?: string;
  roomNo: string;
  phone: string;
  email: string;
  newVisitFee: number;
  returnVisitFee: number;
  reportFollowUpFee: number;
  availableDays: ('Sun' | 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat')[];
  startTime: string; // e.g. "17:00"
  endTime: string;   // e.g. "21:00"
  slotDurationMinutes: number; // e.g. 15
  maxSerialsPerDay: number;    // e.g. 25
  isActive: boolean;
}

export interface Patient {
  id: string; // e.g. "PAT-2026-001"
  name: string;
  nameBn?: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  phone: string;
  email?: string;
  address: string;
  bloodGroup: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-' | 'Unknown';
  allergies: string[];
  chronicConditions: string[];
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  registeredAt: string;
  totalVisits: number;
}

export type AppointmentType = 'slot' | 'serial';
export type VisitCategory = 'new' | 'returning' | 'report_follow_up';
export type AppointmentStatus = 'scheduled' | 'waiting' | 'in_consultation' | 'completed' | 'cancelled' | 'no_show';

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  date: string; // YYYY-MM-DD
  time?: string; // "17:15" for slot
  serialNumber?: number; // 1, 2, 3...
  type: AppointmentType;
  visitCategory: VisitCategory;
  status: AppointmentStatus;
  feeAmount: number;
  notes?: string;
  createdAt: string;
  checkedInAt?: string;
  completedAt?: string;
}

export interface PrescribedMedicine {
  id: string;
  medicineId: string;
  brandName: string;
  genericName: string;
  dosageForm: 'Tablet' | 'Capsule' | 'Syrup' | 'Suspension' | 'Injection' | 'Inhaler' | 'Eye Drop' | 'Ointment';
  strength: string; // e.g. "500mg", "20mg"
  dosageSchedule: string; // e.g. "1+0+1", "1+1+1", "0+0+1", "1 SOS"
  mealTiming: 'before_meal' | 'after_meal' | 'with_meal' | 'empty_stomach';
  duration: string; // e.g. "7 Days", "1 Month", "Continue"
  instructions?: string;
  instructionsBn?: string;
}

export interface Prescription {
  id: string; // e.g. "RX-2026-0104"
  appointmentId: string;
  patientId: string;
  doctorId: string;
  date: string;
  chiefComplaints: string[]; // e.g. ["Fever for 3 days", "Dry cough"]
  clinicalFindings: {
    bloodPressure?: string; // "120/80 mmHg"
    pulse?: string;        // "78 bpm"
    temperature?: string;  // "98.6 °F"
    weight?: string;       // "68 kg"
    height?: string;       // "5 ft 7 in"
    bloodSugar?: string;   // "6.2 mmol/L (RBS)"
    generalNotes?: string;
  };
  diagnosis: string[];     // e.g. ["Acute Bronchitis", "Essential Hypertension"]
  medicines: PrescribedMedicine[];
  investigationsAdvised: string[]; // e.g. ["CBC with ESR", "Chest X-Ray P/A view", "Serum Creatinine"]
  specialAdvice: string[]; // e.g. ["Drink warm water", "Avoid oily and cold food", "Strict low-salt diet"]
  specialAdviceBn?: string[];
  followUpDate?: string;
  followUpNotes?: string;
  createdAt: string;
}

export interface PrescriptionTemplate {
  id: string; // e.g. "TPL-01" or "TPL-CUSTOM-..."
  title: string;
  titleBn?: string;
  category: string; // e.g. "Pulmonology / Respiratory", "Gastroenterology / APD", "Cardiology / Hypertension", etc.
  description?: string;
  doctorId?: string; // 'global' or specific doctor id
  chiefComplaints?: string[];
  diagnosis: string[];
  medicines: PrescribedMedicine[];
  investigationsAdvised?: string[];
  specialAdvice?: string[];
  specialAdviceBn?: string[];
  followUpDays?: number;
  isCustom?: boolean;
  createdAt: string;
}

export interface MedicineCatalogItem {
  id: string;
  brandName: string;
  genericName: string;
  dosageForm: 'Tablet' | 'Capsule' | 'Syrup' | 'Suspension' | 'Injection' | 'Inhaler' | 'Eye Drop' | 'Ointment';
  strength: string;
  manufacturer: string;
  category: string;
  defaultSchedule?: string;
  defaultMealTiming?: 'before_meal' | 'after_meal' | 'with_meal' | 'empty_stomach';
  baseUnit?: string;          // e.g. "Tablet", "Capsule", "Bottle"
  packagingUnit?: string;     // e.g. "Strip (10 tabs)", "Box (100 tabs)", "Bottle"
  unitsPerPack?: number;      // e.g. 10 or 14 (integer conversion)
  allowFractionalDispense?: boolean; // false for tablets/capsules as per plan
  costPerPack?: number;
  retailPricePerPack?: number;
  retailPricePerBaseUnit?: number;
  reorderLevelBaseUnits?: number;
  currentStockBaseUnits?: number;
  barcode?: string;           // EAN-13, UPC, or custom SKU barcode (e.g. "894110023451")
}

export type BatchStatus = 'active' | 'near_expiry' | 'expired' | 'quarantined' | 'blocked';

export interface MedicineBatch {
  id: string;                // e.g. "BAT-2026-001"
  medicineId: string;
  brandName: string;
  genericName: string;
  lotNumber: string;         // e.g. "LOT-SQ-9842"
  manufacturingDate: string; // YYYY-MM-DD
  expiryDate: string;        // YYYY-MM-DD (Used for FEFO sorting)
  costPerBaseUnit: number;
  retailPricePerBaseUnit: number;
  initialQuantity: number;   // base units
  currentQuantity: number;   // base units
  status: BatchStatus;
  barcode?: string;          // Specific batch/lot barcode or GS1 DataMatrix string
  goodsReceiptId?: string;
  supplierName?: string;
  notes?: string;
}

export interface GoodsReceiptItem {
  medicineId: string;
  brandName: string;
  genericName: string;
  lotNumber: string;
  manufacturingDate: string;
  expiryDate: string;
  packQuantity: number;
  unitsPerPack: number;
  totalBaseUnits: number;
  costPerPack: number;
  totalCost: number;
  retailPricePerBaseUnit: number;
}

export interface GoodsReceiptNote {
  id: string;                // e.g. "GRN-2026-001"
  grnNumber: string;
  supplierName: string;
  supplierInvoiceNo: string;
  receivedDate: string;
  receivedByUserId: string;
  receivedByName: string;
  status: 'received' | 'partial' | 'verified';
  items: GoodsReceiptItem[];
  totalAmount: number;
  paymentStatus: 'paid' | 'credit';
  notes?: string;
}

export interface DispenseItem {
  prescribedMedicineId: string;
  medicineId: string;
  brandName: string;
  genericName: string;
  dosageForm: string;
  strength: string;
  dosageSchedule: string;
  duration: string;
  prescribedBaseQuantity: number; // e.g. 20 tablets
  dispensedBaseQuantity: number;  // e.g. 10 tablets (partial dispense!)
  packagingUnit: string;          // e.g. "Strip"
  unitsPerPack: number;           // e.g. 10
  dispensedPacks: number;         // e.g. 1 strip
  dispensedLooseUnits: number;    // e.g. 0 loose tablets
  selectedBatchId: string;
  batchLotNumber: string;
  batchExpiryDate: string;
  unitPrice: number;              // per base unit
  totalPrice: number;
  fefoSelected: boolean;
  partialReason?: string;
}

export interface DispenseRecord {
  id: string;                     // e.g. "DSP-2026-001"
  dispenseNumber: string;
  prescriptionId: string;
  appointmentId: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  dispensedByUserId: string;
  dispensedByName: string;
  dispensedAt: string;
  status: 'pending' | 'partially_dispensed' | 'fully_dispensed' | 'cancelled';
  items: DispenseItem[];
  totalMedicineAmount: number;
  invoiceId?: string;
  notes?: string;
}

export type PaymentMethod = 'cash' | 'bkash' | 'nagad' | 'card';
export type PaymentStatus = 'paid' | 'partial' | 'due';

export interface InvoiceItem {
  id: string;
  description: string;
  descriptionBn?: string;
  quantity: number;
  unitPrice: number;
  total: number;
  type?: 'consultation' | 'dispensed_medicine' | 'investigation' | 'service';
  dispenseId?: string;
  batchLotNumber?: string;
}

export interface PaymentTransaction {
  id: string;
  amount: number;
  method: PaymentMethod;
  transactionReference?: string; // e.g. "9X7A2K10" for bKash/Nagad
  senderPhone?: string;          // e.g. "017XXXXXXXX"
  recordedAt: string;
  recordedByUserId: string;
}

export interface Invoice {
  id: string; // e.g. "INV-2026-042"
  appointmentId?: string;
  patientId: string;
  doctorId?: string;
  dispenseId?: string;           // One invoice carrying consultation + dispensary lines!
  date: string;
  items: InvoiceItem[];
  subtotal: number;
  discountAmount: number;
  discountPercent?: number;
  taxAmount: number;
  grandTotal: number;
  paidAmount: number;
  dueAmount: number;
  paymentStatus: PaymentStatus;
  transactions: PaymentTransaction[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  action: 'create' | 'update' | 'delete' | 'check_in' | 'complete' | 'payment_received' | 'login' | 'goods_receipt' | 'dispense' | 'fefo_override';
  entity: 'appointment' | 'patient' | 'doctor' | 'prescription' | 'invoice' | 'settings' | 'auth' | 'dispensary' | 'batch' | 'goods_receipt';
  details: string;
  ipAddress?: string;
}

export interface ClinicSettings {
  name: string;
  nameBn: string;
  tagline: string;
  taglineBn: string;
  bmdcRegInfo: string;
  address: string;
  addressBn: string;
  phone: string;
  email: string;
  currency: 'BDT' | 'USD';
  currencySymbol: string;
  timeZone: string;
  language: 'en' | 'bn';
  defaultNewVisitFee: number;
  defaultReturnVisitFee: number;
  defaultReportFollowUpFee: number;
  followUpDaysValidity: number; // e.g. 14 days
  receiptFooterNote: string;
  receiptFooterNoteBn: string;
  prescriptionDisclaimer: string;
  prescriptionDisclaimerBn: string;
}
