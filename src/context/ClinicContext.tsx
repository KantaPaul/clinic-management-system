import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  ClinicSettings,
  User,
  Doctor,
  Patient,
  Appointment,
  Prescription,
  PrescriptionTemplate,
  MedicineCatalogItem,
  Invoice,
  AuditLog,
  AppointmentStatus,
  PaymentMethod,
  MedicineBatch,
  GoodsReceiptNote,
  DispenseRecord,
  DispenseItem,
} from '../types';
import { parseDispensaryBarcode, ParsedBarcode } from '../utils/barcodeUtils';
import {
  initialClinicSettings,
  initialUsers,
  initialDoctors,
  initialPatients,
  initialAppointments,
  initialMedicines,
  initialPrescriptions,
  initialInvoices,
  initialAuditLogs,
} from '../data/mockData';
import {
  initialMedicineBatches,
  initialGoodsReceiptNotes,
  initialDispenseRecords,
} from '../data/dispensaryData';
import { initialPrescriptionTemplates } from '../data/prescriptionTemplatesData';
import { translations, Translations } from '../i18n/translations';

interface ClinicContextType {
  settings: ClinicSettings;
  updateSettings: (newSettings: Partial<ClinicSettings>) => void;
  users: User[];
  currentUser: User;
  setCurrentUser: (user: User) => void;
  doctors: Doctor[];
  addDoctor: (doctor: Omit<Doctor, 'id'>) => Doctor;
  updateDoctor: (id: string, updates: Partial<Doctor>) => void;
  patients: Patient[];
  addPatient: (patient: Omit<Patient, 'id' | 'registeredAt' | 'totalVisits'>) => Patient;
  updatePatient: (id: string, updates: Partial<Patient>) => void;
  appointments: Appointment[];
  bookAppointment: (apt: {
    patientId: string;
    doctorId: string;
    date: string;
    time?: string;
    type: 'slot' | 'serial';
    visitCategory: 'new' | 'returning' | 'report_follow_up';
    notes?: string;
  }) => { success: boolean; error?: string; appointment?: Appointment };
  updateAppointmentStatus: (id: string, status: AppointmentStatus) => void;
  medicines: MedicineCatalogItem[];
  addMedicineToCatalog: (medicine: Omit<MedicineCatalogItem, 'id'>) => MedicineCatalogItem;
  prescriptions: Prescription[];
  savePrescription: (prescription: Omit<Prescription, 'id' | 'createdAt'>) => Prescription;
  prescriptionTemplates: PrescriptionTemplate[];
  savePrescriptionTemplate: (template: Omit<PrescriptionTemplate, 'id' | 'createdAt'>) => PrescriptionTemplate;
  deletePrescriptionTemplate: (id: string) => void;
  invoices: Invoice[];
  createInvoice: (invoice: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt' | 'paidAmount' | 'dueAmount' | 'paymentStatus' | 'transactions'>) => Invoice;
  recordPayment: (invoiceId: string, payment: {
    amount: number;
    method: PaymentMethod;
    transactionReference?: string;
    senderPhone?: string;
  }) => { success: boolean; error?: string; invoice?: Invoice };
  auditLogs: AuditLog[];
  addAuditLog: (log: Omit<AuditLog, 'id' | 'timestamp' | 'userId' | 'userName' | 'userRole'>) => void;
  // Dispensary & FEFO Inventory (Plan 0a82bd6e)
  batches: MedicineBatch[];
  addBatch: (batch: Omit<MedicineBatch, 'id'>) => MedicineBatch;
  updateBatch: (id: string, updates: Partial<MedicineBatch>) => void;
  adjustBatchStock: (batchId: string, newQuantity: number, reason: string) => void;
  quickRestockBatch: (batchId: string, additionalUnits: number, notes?: string) => void;
  toggleBatchQuarantine: (batchId: string, reason?: string) => void;
  findInventoryByBarcode: (scannedText: string) => {
    medicine?: MedicineCatalogItem;
    batch?: MedicineBatch;
    matchingBatches: MedicineBatch[];
    prescription?: Prescription;
    parsed: ParsedBarcode;
  };
  getFefoBatchForMedicine: (medicineId: string) => MedicineBatch | undefined;
  goodsReceiptNotes: GoodsReceiptNote[];
  createGoodsReceipt: (grn: Omit<GoodsReceiptNote, 'id' | 'grnNumber'>) => GoodsReceiptNote;
  dispenseRecords: DispenseRecord[];
  processDispense: (dispenseData: {
    prescriptionId: string;
    patientId: string;
    doctorId: string;
    items: DispenseItem[];
    notes?: string;
    createConsolidatedInvoice?: boolean;
  }) => { success: boolean; dispenseRecord?: DispenseRecord; invoice?: Invoice; error?: string };
  activeTab: string;
  setActiveTab: (tab: string) => void;
  language: 'en' | 'bn';
  setLanguage: (lang: 'en' | 'bn') => void;
  t: Translations;
  selectedAppointmentForConsultation: Appointment | null;
  startConsultation: (appointment: Appointment) => void;
  resetToMockData: () => void;
}

const STORAGE_KEYS = {
  SETTINGS: 'medichamber_settings_v1',
  USERS: 'medichamber_users_v1',
  CURRENT_USER: 'medichamber_current_user_v1',
  DOCTORS: 'medichamber_doctors_v1',
  PATIENTS: 'medichamber_patients_v1',
  APPOINTMENTS: 'medichamber_appointments_v1',
  MEDICINES: 'medichamber_medicines_v1',
  PRESCRIPTIONS: 'medichamber_prescriptions_v1',
  PRESCRIPTION_TEMPLATES: 'medichamber_prescription_templates_v1',
  INVOICES: 'medichamber_invoices_v1',
  AUDIT_LOGS: 'medichamber_audit_logs_v1',
  LANGUAGE: 'medichamber_language_v1',
  BATCHES: 'medichamber_batches_v1',
  GRN: 'medichamber_grn_v1',
  DISPENSE: 'medichamber_dispense_v1',
};

const ClinicContext = createContext<ClinicContextType | undefined>(undefined);

export const ClinicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial states from LocalStorage or fall back to mock data
  const [settings, setSettings] = useState<ClinicSettings>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return saved ? JSON.parse(saved) : initialClinicSettings;
  });

  const [users] = useState<User[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USERS);
    return saved ? JSON.parse(saved) : initialUsers;
  });

  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return initialUsers[0]; // Admin by default
  });

  const [doctors, setDoctors] = useState<Doctor[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.DOCTORS);
    return saved ? JSON.parse(saved) : initialDoctors;
  });

  const [patients, setPatients] = useState<Patient[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PATIENTS);
    return saved ? JSON.parse(saved) : initialPatients;
  });

  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.APPOINTMENTS);
    return saved ? JSON.parse(saved) : initialAppointments;
  });

  const [medicines, setMedicines] = useState<MedicineCatalogItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.MEDICINES);
    return saved ? JSON.parse(saved) : initialMedicines;
  });

  const [prescriptions, setPrescriptions] = useState<Prescription[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PRESCRIPTIONS);
    return saved ? JSON.parse(saved) : initialPrescriptions;
  });

  const [prescriptionTemplates, setPrescriptionTemplates] = useState<PrescriptionTemplate[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PRESCRIPTION_TEMPLATES);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        // fallback
      }
    }
    return initialPrescriptionTemplates;
  });

  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.INVOICES);
    return saved ? JSON.parse(saved) : initialInvoices;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS);
    return saved ? JSON.parse(saved) : initialAuditLogs;
  });

  // Dispensary & FEFO Inventory states
  const [batches, setBatches] = useState<MedicineBatch[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.BATCHES);
    return saved ? JSON.parse(saved) : initialMedicineBatches;
  });

  const [goodsReceiptNotes, setGoodsReceiptNotes] = useState<GoodsReceiptNote[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.GRN);
    return saved ? JSON.parse(saved) : initialGoodsReceiptNotes;
  });

  const [dispenseRecords, setDispenseRecords] = useState<DispenseRecord[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.DISPENSE);
    return saved ? JSON.parse(saved) : initialDispenseRecords;
  });

  const [language, setLanguageState] = useState<'en' | 'bn'>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.LANGUAGE);
    return (saved === 'bn' || saved === 'en') ? saved : 'en';
  });

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [selectedAppointmentForConsultation, setSelectedAppointmentForConsultation] = useState<Appointment | null>(null);

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DOCTORS, JSON.stringify(doctors));
  }, [doctors]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(patients));
  }, [patients]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MEDICINES, JSON.stringify(medicines));
  }, [medicines]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PRESCRIPTIONS, JSON.stringify(prescriptions));
  }, [prescriptions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PRESCRIPTION_TEMPLATES, JSON.stringify(prescriptionTemplates));
  }, [prescriptionTemplates]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(invoices));
  }, [invoices]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.BATCHES, JSON.stringify(batches));
  }, [batches]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.GRN, JSON.stringify(goodsReceiptNotes));
  }, [goodsReceiptNotes]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DISPENSE, JSON.stringify(dispenseRecords));
  }, [dispenseRecords]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LANGUAGE, language);
  }, [language]);

  const setLanguage = (lang: 'en' | 'bn') => {
    setLanguageState(lang);
    setSettings(prev => ({ ...prev, language: lang }));
  };

  const t = translations[language];

  // Helper for audit logging
  const logAction = (
    action: AuditLog['action'],
    entity: AuditLog['entity'],
    details: string
  ) => {
    const newLog: AuditLog = {
      id: `LOG-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      userId: currentUser.id,
      userName: currentUser.name,
      userRole: currentUser.role,
      action,
      entity,
      details,
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const addAuditLog = (log: Omit<AuditLog, 'id' | 'timestamp' | 'userId' | 'userName' | 'userRole'>) => {
    logAction(log.action, log.entity, log.details);
  };

  const updateSettings = (newSettings: Partial<ClinicSettings>) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };
      logAction('update', 'settings', 'Updated clinic profile and operational settings');
      return updated;
    });
  };

  const addDoctor = (docData: Omit<Doctor, 'id'>): Doctor => {
    const newId = `DOC-${(doctors.length + 1).toString().padStart(2, '0')}`;
    const newDoc: Doctor = { ...docData, id: newId };
    setDoctors(prev => [...prev, newDoc]);
    logAction('create', 'doctor', `Added specialist doctor: ${newDoc.name} (${newDoc.specialty})`);
    return newDoc;
  };

  const updateDoctor = (id: string, updates: Partial<Doctor>) => {
    setDoctors(prev =>
      prev.map(d => {
        if (d.id === id) {
          const updated = { ...d, ...updates };
          logAction('update', 'doctor', `Updated doctor profile: ${updated.name}`);
          return updated;
        }
        return d;
      })
    );
  };

  const addPatient = (patientData: Omit<Patient, 'id' | 'registeredAt' | 'totalVisits'>): Patient => {
    const year = new Date().getFullYear();
    const nextNum = (patients.length + 1).toString().padStart(3, '0');
    const newId = `PAT-${year}-${nextNum}`;
    const newPatient: Patient = {
      ...patientData,
      id: newId,
      registeredAt: new Date().toISOString().split('T')[0],
      totalVisits: 0,
    };
    setPatients(prev => [newPatient, ...prev]);
    logAction('create', 'patient', `Registered new patient: ${newPatient.name} (Phone: ${newPatient.phone})`);
    return newPatient;
  };

  const updatePatient = (id: string, updates: Partial<Patient>) => {
    setPatients(prev =>
      prev.map(p => {
        if (p.id === id) {
          const updated = { ...p, ...updates };
          logAction('update', 'patient', `Updated patient record for: ${updated.name}`);
          return updated;
        }
        return p;
      })
    );
  };

  // Appointment creation with double-booking / overlap prevention!
  const bookAppointment = (data: {
    patientId: string;
    doctorId: string;
    date: string;
    time?: string;
    type: 'slot' | 'serial';
    visitCategory: 'new' | 'returning' | 'report_follow_up';
    notes?: string;
  }): { success: boolean; error?: string; appointment?: Appointment } => {
    const doctor = doctors.find(d => d.id === data.doctorId);
    const patient = patients.find(p => p.id === data.patientId);

    if (!doctor || !patient) {
      return { success: false, error: 'Doctor or patient not found' };
    }

    // Determine fee based on category
    let fee = doctor.newVisitFee;
    if (data.visitCategory === 'returning') fee = doctor.returnVisitFee;
    if (data.visitCategory === 'report_follow_up') fee = doctor.reportFollowUpFee;

    // Check for overlap if timed slot
    if (data.type === 'slot' && data.time) {
      const conflict = appointments.find(
        apt =>
          apt.doctorId === data.doctorId &&
          apt.date === data.date &&
          apt.time === data.time &&
          apt.status !== 'cancelled'
      );
      if (conflict) {
        return {
          success: false,
          error: `Dr. ${doctor.name} already has an appointment booked at ${data.time} on ${data.date}. Please pick another time slot.`,
        };
      }
    }

    // Calculate next serial number for this doctor on this day
    const sameDayAppointments = appointments.filter(
      apt => apt.doctorId === data.doctorId && apt.date === data.date && apt.status !== 'cancelled'
    );
    const maxSerial = sameDayAppointments.reduce((max, apt) => Math.max(max, apt.serialNumber || 0), 0);
    const nextSerial = maxSerial + 1;

    if (doctor.maxSerialsPerDay && nextSerial > doctor.maxSerialsPerDay) {
      return {
        success: false,
        error: `Doctor has reached maximum quota of ${doctor.maxSerialsPerDay} serials for ${data.date}.`,
      };
    }

    const aptId = `APT-${new Date().getFullYear()}-${(appointments.length + 1).toString().padStart(3, '0')}`;
    const newApt: Appointment = {
      id: aptId,
      patientId: data.patientId,
      doctorId: data.doctorId,
      date: data.date,
      time: data.time || (data.type === 'serial' ? doctor.startTime : undefined),
      serialNumber: nextSerial,
      type: data.type,
      visitCategory: data.visitCategory,
      status: 'scheduled',
      feeAmount: fee,
      notes: data.notes,
      createdAt: new Date().toISOString(),
    };

    setAppointments(prev => [newApt, ...prev]);

    // Update patient visit count
    setPatients(prev =>
      prev.map(p => (p.id === data.patientId ? { ...p, totalVisits: p.totalVisits + 1 } : p))
    );

    logAction(
      'create',
      'appointment',
      `Booked ${data.type === 'serial' ? `Serial #${nextSerial}` : `Slot ${data.time}`} for ${patient.name} with ${doctor.name}`
    );

    return { success: true, appointment: newApt };
  };

  const updateAppointmentStatus = (id: string, status: AppointmentStatus) => {
    setAppointments(prev =>
      prev.map(apt => {
        if (apt.id === id) {
          const now = new Date().toISOString();
          const updated: Appointment = {
            ...apt,
            status,
            checkedInAt: status === 'waiting' && !apt.checkedInAt ? now : apt.checkedInAt,
            completedAt: status === 'completed' && !apt.completedAt ? now : apt.completedAt,
          };
          const patient = patients.find(p => p.id === apt.patientId);
          logAction(
            status === 'waiting' ? 'check_in' : status === 'completed' ? 'complete' : 'update',
            'appointment',
            `Status changed to "${status}" for patient ${patient?.name || apt.patientId} (${apt.id})`
          );
          return updated;
        }
        return apt;
      })
    );
  };

  const addMedicineToCatalog = (med: Omit<MedicineCatalogItem, 'id'>): MedicineCatalogItem => {
    const newId = `MED-${(medicines.length + 1).toString().padStart(2, '0')}`;
    const newMed: MedicineCatalogItem = { ...med, id: newId };
    setMedicines(prev => [newMed, ...prev]);
    logAction('create', 'settings', `Added drug to formulary catalog: ${newMed.brandName} (${newMed.genericName})`);
    return newMed;
  };

  const savePrescription = (rxData: Omit<Prescription, 'id' | 'createdAt'>): Prescription => {
    const rxId = `RX-${new Date().getFullYear()}-${(prescriptions.length + 101).toString()}`;
    const newRx: Prescription = {
      ...rxData,
      id: rxId,
      createdAt: new Date().toISOString(),
    };
    setPrescriptions(prev => [newRx, ...prev]);

    // Automatically mark the appointment as completed
    updateAppointmentStatus(rxData.appointmentId, 'completed');

    const patient = patients.find(p => p.id === rxData.patientId);
    logAction('create', 'prescription', `Generated prescription ${rxId} for ${patient?.name || rxData.patientId}`);
    return newRx;
  };

  const savePrescriptionTemplate = (
    tplData: Omit<PrescriptionTemplate, 'id' | 'createdAt'>
  ): PrescriptionTemplate => {
    const tplId = `TPL-CUSTOM-${Date.now().toString().slice(-6)}`;
    const newTemplate: PrescriptionTemplate = {
      ...tplData,
      id: tplId,
      isCustom: true,
      createdAt: new Date().toISOString(),
    };
    setPrescriptionTemplates(prev => [newTemplate, ...prev]);
    logAction(
      'create',
      'prescription',
      `Saved reusable prescription template "${newTemplate.title}" (${newTemplate.medicines.length} medicines)`
    );
    return newTemplate;
  };

  const deletePrescriptionTemplate = (id: string) => {
    const target = prescriptionTemplates.find(t => t.id === id);
    setPrescriptionTemplates(prev => prev.filter(t => t.id !== id));
    if (target) {
      logAction(
        'delete',
        'prescription',
        `Deleted prescription template "${target.title}"`
      );
    }
  };

  const createInvoice = (invData: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt' | 'paidAmount' | 'dueAmount' | 'paymentStatus' | 'transactions'>): Invoice => {
    const invId = `INV-${new Date().getFullYear()}-${(invoices.length + 1).toString().padStart(3, '0')}`;
    const now = new Date().toISOString();
    const newInvoice: Invoice = {
      ...invData,
      id: invId,
      paidAmount: 0,
      dueAmount: invData.grandTotal,
      paymentStatus: 'due',
      transactions: [],
      createdAt: now,
      updatedAt: now,
    };
    setInvoices(prev => [newInvoice, ...prev]);
    const patient = patients.find(p => p.id === invData.patientId);
    logAction('create', 'invoice', `Created invoice ${invId} for ${patient?.name || invData.patientId} total: ৳${invData.grandTotal}`);
    return newInvoice;
  };

  const recordPayment = (
    invoiceId: string,
    payment: {
      amount: number;
      method: PaymentMethod;
      transactionReference?: string;
      senderPhone?: string;
    }
  ): { success: boolean; error?: string; invoice?: Invoice } => {
    const targetInvoice = invoices.find(inv => inv.id === invoiceId);
    if (!targetInvoice) {
      return { success: false, error: 'Invoice not found' };
    }

    if (payment.amount <= 0) {
      return { success: false, error: 'Payment amount must be greater than zero' };
    }

    if (payment.amount > targetInvoice.dueAmount) {
      return { success: false, error: `Payment cannot exceed outstanding due of ৳${targetInvoice.dueAmount}` };
    }

    if ((payment.method === 'bkash' || payment.method === 'nagad') && !payment.transactionReference) {
      return { success: false, error: `Transaction Reference (TxID) is required for ${payment.method.toUpperCase()} payments.` };
    }

    const txnId = `TXN-${Date.now().toString(36).toUpperCase()}`;
    const newTxn = {
      id: txnId,
      amount: payment.amount,
      method: payment.method,
      transactionReference: payment.transactionReference,
      senderPhone: payment.senderPhone,
      recordedAt: new Date().toISOString(),
      recordedByUserId: currentUser.id,
    };

    const newPaid = targetInvoice.paidAmount + payment.amount;
    const newDue = targetInvoice.grandTotal - newPaid;
    const newStatus = newDue <= 0 ? 'paid' : 'partial';

    const updatedInvoice: Invoice = {
      ...targetInvoice,
      paidAmount: newPaid,
      dueAmount: newDue,
      paymentStatus: newStatus,
      transactions: [...targetInvoice.transactions, newTxn],
      updatedAt: new Date().toISOString(),
    };

    setInvoices(prev => prev.map(inv => (inv.id === invoiceId ? updatedInvoice : inv)));

    const methodLabel = payment.method.toUpperCase();
    const refText = payment.transactionReference ? ` [TxID: ${payment.transactionReference}]` : '';
    logAction(
      'payment_received',
      'invoice',
      `Recorded ${methodLabel} payment ৳${payment.amount}${refText} for ${invoiceId}. Remaining due: ৳${newDue}`
    );

    return { success: true, invoice: updatedInvoice };
  };

  const startConsultation = (appointment: Appointment) => {
    setSelectedAppointmentForConsultation(appointment);
    updateAppointmentStatus(appointment.id, 'in_consultation');
    setActiveTab('consultation');
  };

  // Dispensary & FEFO Inventory Implementation
  const getFefoBatchForMedicine = (medicineId: string): MedicineBatch | undefined => {
    const today = new Date().toISOString().split('T')[0];
    const validBatches = batches.filter(
      b => b.medicineId === medicineId &&
           b.status !== 'expired' &&
           b.status !== 'quarantined' &&
           b.status !== 'blocked' &&
           b.currentQuantity > 0 &&
           b.expiryDate >= today
    );
    if (validBatches.length === 0) return undefined;
    return validBatches.sort((a, b) => a.expiryDate.localeCompare(b.expiryDate))[0];
  };

  const addBatch = (batchData: Omit<MedicineBatch, 'id'>): MedicineBatch => {
    const newId = `BAT-2026-${String(batches.length + 1).padStart(3, '0')}`;
    const newBatch: MedicineBatch = {
      ...batchData,
      id: newId,
    };
    setBatches(prev => [newBatch, ...prev]);
    logAction('create', 'batch', `Added batch ${newBatch.lotNumber} for ${newBatch.brandName} (${newBatch.currentQuantity} base units)`);
    return newBatch;
  };

  const updateBatch = (id: string, updates: Partial<MedicineBatch>) => {
    setBatches(prev =>
      prev.map(b => (b.id === id ? { ...b, ...updates } : b))
    );
    logAction('update', 'batch', `Updated batch status/quantity for ${id}`);
  };

  const adjustBatchStock = (batchId: string, newQuantity: number, reason: string) => {
    const target = batches.find(b => b.id === batchId);
    if (!target) return;
    const oldQty = target.currentQuantity;
    const diff = newQuantity - oldQty;
    const sign = diff >= 0 ? `+${diff}` : `${diff}`;
    const safeQty = Math.max(0, Math.round(newQuantity));

    setBatches(prev =>
      prev.map(b => (b.id === batchId ? { ...b, currentQuantity: safeQty } : b))
    );
    logAction(
      'update',
      'batch',
      `Manual Stock Adjustment for ${target.brandName} (${target.lotNumber}): ${oldQty} -> ${safeQty} base units (${sign} u). Reason: ${reason}`
    );
  };

  const quickRestockBatch = (batchId: string, additionalUnits: number, notes?: string) => {
    const target = batches.find(b => b.id === batchId);
    if (!target || additionalUnits <= 0) return;
    const newQty = target.currentQuantity + Math.round(additionalUnits);

    setBatches(prev =>
      prev.map(b =>
        b.id === batchId
          ? {
              ...b,
              currentQuantity: newQty,
              status: b.status === 'expired' ? 'expired' : 'active',
            }
          : b
      )
    );
    logAction(
      'goods_receipt',
      'batch',
      `Quick Restock of +${additionalUnits} units for ${target.brandName} (${target.lotNumber}). New Total: ${newQty} base units.${notes ? ` Note: ${notes}` : ''}`
    );
  };

  const toggleBatchQuarantine = (batchId: string, reason?: string) => {
    const target = batches.find(b => b.id === batchId);
    if (!target) return;
    const newStatus = target.status === 'quarantined' ? 'active' : 'quarantined';

    setBatches(prev =>
      prev.map(b => (b.id === batchId ? { ...b, status: newStatus } : b))
    );
    logAction(
      'update',
      'batch',
      `Batch ${target.lotNumber} (${target.brandName}) status changed to ${newStatus.toUpperCase()}.${reason ? ` Reason: ${reason}` : ''}`
    );
  };

  const findInventoryByBarcode = (scannedText: string) => {
    const parsed = parseDispensaryBarcode(scannedText);
    const query = scannedText.trim().toLowerCase();

    // 1. Direct prescription match
    if (parsed.prescriptionId) {
      const rx = prescriptions.find(
        p => p.id.toLowerCase() === parsed.prescriptionId!.toLowerCase()
      );
      if (rx) return { prescription: rx, parsed, matchingBatches: [] };
    }

    // 2. Exact Batch match by Lot Number or Batch ID
    if (parsed.lotNumber) {
      const targetLot = parsed.lotNumber.toLowerCase();
      const directBatch = batches.find(
        b =>
          b.lotNumber.toLowerCase() === targetLot ||
          b.id.toLowerCase() === targetLot ||
          (b.barcode && b.barcode.toLowerCase() === targetLot)
      );
      if (directBatch) {
        const med = medicines.find(m => m.id === directBatch.medicineId);
        const siblings = batches.filter(b => b.medicineId === directBatch.medicineId);
        return { medicine: med, batch: directBatch, matchingBatches: siblings, parsed };
      }
    }

    // 3. Medicine match by GTIN / Barcode
    if (parsed.gtin || parsed.medicineId) {
      const targetCode = (parsed.gtin || parsed.medicineId)!.toLowerCase();
      const med = medicines.find(
        m =>
          (m.barcode && m.barcode.toLowerCase() === targetCode) ||
          m.id.toLowerCase() === targetCode
      );
      if (med) {
        const matching = batches.filter(b => b.medicineId === med.id);
        const fefoBatch = getFefoBatchForMedicine(med.id) || matching[0];
        return { medicine: med, batch: fefoBatch, matchingBatches: matching, parsed };
      }
    }

    // 4. Fuzzy fallback search across lot, barcode, id, brandName
    const batchByLot = batches.find(
      b =>
        b.lotNumber.toLowerCase().includes(query) ||
        b.id.toLowerCase() === query ||
        (b.barcode && b.barcode.toLowerCase() === query)
    );
    if (batchByLot) {
      const med = medicines.find(m => m.id === batchByLot.medicineId);
      const siblings = batches.filter(b => b.medicineId === batchByLot.medicineId);
      return { medicine: med, batch: batchByLot, matchingBatches: siblings, parsed };
    }

    const medByCode = medicines.find(
      m =>
        (m.barcode && m.barcode.toLowerCase() === query) ||
        m.id.toLowerCase() === query ||
        m.brandName.toLowerCase().includes(query)
    );
    if (medByCode) {
      const matching = batches.filter(b => b.medicineId === medByCode.id);
      const fefoBatch = getFefoBatchForMedicine(medByCode.id) || matching[0];
      return { medicine: medByCode, batch: fefoBatch, matchingBatches: matching, parsed };
    }

    // Check prescriptions for fallback
    const rxFallback = prescriptions.find(p => p.id.toLowerCase().includes(query));
    if (rxFallback) {
      return { prescription: rxFallback, parsed, matchingBatches: [] };
    }

    return { parsed, matchingBatches: [] };
  };

  const createGoodsReceipt = (grnData: Omit<GoodsReceiptNote, 'id' | 'grnNumber'>): GoodsReceiptNote => {
    const newGrnNum = `GRN-2026-${String(goodsReceiptNotes.length + 1).padStart(3, '0')}`;
    const newGRN: GoodsReceiptNote = {
      ...grnData,
      id: newGrnNum,
      grnNumber: newGrnNum,
    };

    // Idempotent stock intake: increase existing batch or create new batch for each item
    setBatches(prevBatches => {
      const updated = [...prevBatches];
      grnData.items.forEach(item => {
        const existingIdx = updated.findIndex(
          b => b.medicineId === item.medicineId && b.lotNumber.toLowerCase() === item.lotNumber.toLowerCase()
        );
        if (existingIdx >= 0) {
          updated[existingIdx] = {
            ...updated[existingIdx],
            currentQuantity: updated[existingIdx].currentQuantity + item.totalBaseUnits,
            status: 'active',
          };
        } else {
          updated.push({
            id: `BAT-2026-${String(updated.length + 1).padStart(3, '0')}`,
            medicineId: item.medicineId,
            brandName: item.brandName,
            genericName: item.genericName,
            lotNumber: item.lotNumber,
            manufacturingDate: item.manufacturingDate,
            expiryDate: item.expiryDate,
            costPerBaseUnit: item.costPerPack / item.unitsPerPack,
            retailPricePerBaseUnit: item.retailPricePerBaseUnit || 5.0,
            initialQuantity: item.totalBaseUnits,
            currentQuantity: item.totalBaseUnits,
            status: 'active',
            goodsReceiptId: newGRN.id,
            supplierName: grnData.supplierName,
          });
        }
      });
      return updated;
    });

    setGoodsReceiptNotes(prev => [newGRN, ...prev]);
    logAction(
      'goods_receipt',
      'goods_receipt',
      `Received GRN #${newGRN.grnNumber} from ${newGRN.supplierName} (${grnData.items.length} items, Total: ৳${newGRN.totalAmount})`
    );
    return newGRN;
  };

  const processDispense = (data: {
    prescriptionId: string;
    patientId: string;
    doctorId: string;
    items: DispenseItem[];
    notes?: string;
    createConsolidatedInvoice?: boolean;
  }): { success: boolean; dispenseRecord?: DispenseRecord; invoice?: Invoice; error?: string } => {
    const today = new Date().toISOString().split('T')[0];

    // 1. Rigorous validation against expired or blocked lots
    for (const item of data.items) {
      if (item.dispensedBaseQuantity <= 0) continue;
      const batch = batches.find(b => b.id === item.selectedBatchId);
      if (!batch) {
        return { success: false, error: `Batch not found for ${item.brandName}` };
      }
      if (batch.status === 'expired' || batch.expiryDate < today) {
        return {
          success: false,
          error: `Batch ${batch.lotNumber} for ${item.brandName} is EXPIRED (Expired: ${batch.expiryDate}) and cannot be dispensed.`,
        };
      }
      if (batch.status === 'quarantined' || batch.status === 'blocked') {
        return {
          success: false,
          error: `Batch ${batch.lotNumber} for ${item.brandName} is ${batch.status.toUpperCase()} and locked from dispensing.`,
        };
      }
      if (batch.currentQuantity < item.dispensedBaseQuantity) {
        return {
          success: false,
          error: `Insufficient stock in batch ${batch.lotNumber} for ${item.brandName}. Available: ${batch.currentQuantity}, Requested: ${item.dispensedBaseQuantity}`,
        };
      }
    }

    const patient = patients.find(p => p.id === data.patientId);
    const doctor = doctors.find(d => d.id === data.doctorId);
    const dispenseNum = `DSP-2026-${String(dispenseRecords.length + 1).padStart(3, '0')}`;
    const totalAmount = data.items.reduce((sum, item) => sum + item.totalPrice, 0);

    const isPartial = data.items.some(it => it.dispensedBaseQuantity < it.prescribedBaseQuantity);

    const newRecord: DispenseRecord = {
      id: dispenseNum,
      dispenseNumber: dispenseNum,
      prescriptionId: data.prescriptionId,
      appointmentId: '',
      patientId: data.patientId,
      patientName: patient ? patient.name : 'Unknown Patient',
      doctorId: data.doctorId,
      doctorName: doctor ? doctor.name : 'Chamber Doctor',
      dispensedByUserId: currentUser.id,
      dispensedByName: currentUser.name,
      dispensedAt: new Date().toISOString(),
      status: isPartial ? 'partially_dispensed' : 'fully_dispensed',
      items: data.items,
      totalMedicineAmount: totalAmount,
      notes: data.notes,
    };

    // 2. Deduct batch inventory
    setBatches(prev => {
      const copy = [...prev];
      data.items.forEach(item => {
        if (item.dispensedBaseQuantity <= 0) return;
        const idx = copy.findIndex(b => b.id === item.selectedBatchId);
        if (idx >= 0) {
          copy[idx] = {
            ...copy[idx],
            currentQuantity: Math.max(0, copy[idx].currentQuantity - item.dispensedBaseQuantity),
          };
        }
      });
      return copy;
    });

    let createdInvoice: Invoice | undefined;

    // 3. Consolidated billing integration
    if (data.createConsolidatedInvoice !== false && totalAmount > 0) {
      const existingInvoice = invoices.find(
        inv => inv.patientId === data.patientId && inv.paymentStatus !== 'paid'
      );

      const medicineInvoiceItems = data.items
        .filter(it => it.dispensedBaseQuantity > 0)
        .map(it => ({
          id: `inv-med-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          description: `${it.brandName} ${it.strength} (${it.dispensedPacks > 0 ? `${it.dispensedPacks} ${it.packagingUnit}` : ''}${it.dispensedLooseUnits > 0 ? ` + ${it.dispensedLooseUnits} loose` : ''}) - Lot: ${it.batchLotNumber}`,
          descriptionBn: `${it.brandName} ${it.strength} - লট: ${it.batchLotNumber}`,
          quantity: it.dispensedBaseQuantity,
          unitPrice: it.unitPrice,
          total: it.totalPrice,
          type: 'dispensed_medicine' as const,
          dispenseId: newRecord.id,
          batchLotNumber: it.batchLotNumber,
        }));

      if (existingInvoice) {
        const updatedItems = [...existingInvoice.items, ...medicineInvoiceItems];
        const newSubtotal = updatedItems.reduce((acc, it) => acc + it.total, 0);
        const newGrandTotal = Math.max(0, newSubtotal - existingInvoice.discountAmount + existingInvoice.taxAmount);
        const newDue = Math.max(0, newGrandTotal - existingInvoice.paidAmount);

        const updatedInv: Invoice = {
          ...existingInvoice,
          items: updatedItems,
          subtotal: newSubtotal,
          grandTotal: newGrandTotal,
          dueAmount: newDue,
          dispenseId: newRecord.id,
          paymentStatus: newDue === 0 ? 'paid' : (existingInvoice.paidAmount > 0 ? 'partial' : 'due'),
          updatedAt: new Date().toISOString(),
        };

        setInvoices(prev => prev.map(inv => inv.id === existingInvoice.id ? updatedInv : inv));
        newRecord.invoiceId = existingInvoice.id;
        createdInvoice = updatedInv;
      } else {
        const invId = `INV-2026-${String(invoices.length + 1).padStart(3, '0')}`;
        const newInv: Invoice = {
          id: invId,
          patientId: data.patientId,
          doctorId: data.doctorId,
          dispenseId: newRecord.id,
          date: new Date().toISOString().split('T')[0],
          items: medicineInvoiceItems,
          subtotal: totalAmount,
          discountAmount: 0,
          taxAmount: 0,
          grandTotal: totalAmount,
          paidAmount: 0,
          dueAmount: totalAmount,
          paymentStatus: 'due',
          transactions: [],
          notes: `Prescription Dispense #${dispenseNum}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        setInvoices(prev => [newInv, ...prev]);
        newRecord.invoiceId = invId;
        createdInvoice = newInv;
      }
    }

    setDispenseRecords(prev => [newRecord, ...prev]);
    logAction(
      'dispense',
      'dispensary',
      `Dispensed #${newRecord.dispenseNumber} for ${patient?.name || 'Patient'} (${isPartial ? 'PARTIAL' : 'FULL'}, Total: ৳${totalAmount})`
    );

    return {
      success: true,
      dispenseRecord: newRecord,
      invoice: createdInvoice,
    };
  };

  const resetToMockData = () => {
    setSettings(initialClinicSettings);
    setCurrentUser(initialUsers[0]);
    setDoctors(initialDoctors);
    setPatients(initialPatients);
    setAppointments(initialAppointments);
    setMedicines(initialMedicines);
    setPrescriptions(initialPrescriptions);
    setPrescriptionTemplates(initialPrescriptionTemplates);
    setInvoices(initialInvoices);
    setAuditLogs(initialAuditLogs);
    setBatches(initialMedicineBatches);
    setGoodsReceiptNotes(initialGoodsReceiptNotes);
    setDispenseRecords(initialDispenseRecords);
    setLanguageState('en');
    setSelectedAppointmentForConsultation(null);

    Object.values(STORAGE_KEYS).forEach(k => localStorage.removeItem(k));
    logAction('update', 'settings', 'Reset all clinic database to synthetic demonstration baseline');
  };

  return (
    <ClinicContext.Provider
      value={{
        settings,
        updateSettings,
        users,
        currentUser,
        setCurrentUser,
        doctors,
        addDoctor,
        updateDoctor,
        patients,
        addPatient,
        updatePatient,
        appointments,
        bookAppointment,
        updateAppointmentStatus,
        medicines,
        addMedicineToCatalog,
        prescriptions,
        savePrescription,
        prescriptionTemplates,
        savePrescriptionTemplate,
        deletePrescriptionTemplate,
        invoices,
        createInvoice,
        recordPayment,
        auditLogs,
        addAuditLog,
        batches,
        addBatch,
        updateBatch,
        adjustBatchStock,
        quickRestockBatch,
        toggleBatchQuarantine,
        findInventoryByBarcode,
        getFefoBatchForMedicine,
        goodsReceiptNotes,
        createGoodsReceipt,
        dispenseRecords,
        processDispense,
        activeTab,
        setActiveTab,
        language,
        setLanguage,
        t,
        selectedAppointmentForConsultation,
        startConsultation,
        resetToMockData,
      }}
    >
      {children}
    </ClinicContext.Provider>
  );
};

export const useClinic = () => {
  const context = useContext(ClinicContext);
  if (!context) {
    throw new Error('useClinic must be used within a ClinicProvider');
  }
  return context;
};
