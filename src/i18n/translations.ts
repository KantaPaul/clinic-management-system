export interface Translations {
  appName: string;
  tagline: string;
  roles: {
    admin: string;
    doctor: string;
    receptionist: string;
    accountant: string;
  };
  nav: {
    dashboard: string;
    queue: string;
    patients: string;
    doctors: string;
    consultation: string;
    billing: string;
    reports: string;
    auditLogs: string;
    settings: string;
  };
  dashboard: {
    todayAppointments: string;
    patientsInQueue: string;
    todayCollections: string;
    pendingDues: string;
    liveDoctorOccupancy: string;
    quickActions: string;
    newPatient: string;
    bookAppointment: string;
    issueSerial: string;
    createInvoice: string;
    servingNow: string;
    nextInQueue: string;
    room: string;
  };
  queue: {
    title: string;
    subtitle: string;
    selectDoctor: string;
    allDoctors: string;
    tabWaiting: string;
    tabInConsultation: string;
    tabCompleted: string;
    tabAll: string;
    serialNo: string;
    patientName: string;
    appointmentTime: string;
    type: string;
    status: string;
    actions: string;
    checkIn: string;
    callIn: string;
    complete: string;
    cancel: string;
    noShow: string;
    walkInSerial: string;
    bookSlot: string;
    estimatedWaitTime: string;
    scheduled: string;
    waiting: string;
    inConsultation: string;
    completed: string;
    cancelled: string;
  };
  patient: {
    directory: string;
    searchPlaceholder: string;
    addPatient: string;
    patientId: string;
    name: string;
    phone: string;
    age: string;
    gender: string;
    bloodGroup: string;
    address: string;
    allergies: string;
    chronicConditions: string;
    emergencyContact: string;
    totalVisits: string;
    viewHistory: string;
    edit: string;
    male: string;
    female: string;
    other: string;
  };
  doctor: {
    directory: string;
    bmdcReg: string;
    specialty: string;
    chamberRoom: string;
    consultationFees: string;
    newPatient: string;
    returningPatient: string;
    reportFollowUp: string;
    schedule: string;
    slotDuration: string;
    maxSerials: string;
    minutes: string;
    status: string;
    active: string;
    inactive: string;
  };
  consultation: {
    title: string;
    selectPatientPrompt: string;
    vitals: string;
    bloodPressure: string;
    pulse: string;
    temperature: string;
    weight: string;
    bloodSugar: string;
    chiefComplaints: string;
    clinicalFindings: string;
    diagnosis: string;
    rxMedicines: string;
    addMedicine: string;
    investigations: string;
    advice: string;
    followUp: string;
    followUpInDays: string;
    savePrescription: string;
    printPrescription: string;
    dosageForm: string;
    brandName: string;
    genericName: string;
    schedule: string;
    mealTiming: string;
    duration: string;
    beforeMeal: string;
    afterMeal: string;
    withMeal: string;
    emptyStomach: string;
  };
  billing: {
    title: string;
    invoices: string;
    createInvoice: string;
    invoiceNo: string;
    date: string;
    patient: string;
    amount: string;
    paid: string;
    due: string;
    paymentStatus: string;
    paymentMethod: string;
    cash: string;
    bkash: string;
    nagad: string;
    card: string;
    transactionId: string;
    senderPhone: string;
    recordPayment: string;
    printReceipt: string;
    subtotal: string;
    discount: string;
    grandTotal: string;
    settleDue: string;
    cashCloseSummary: string;
  };
  reports: {
    title: string;
    dailyCollection: string;
    byPaymentMethod: string;
    doctorWorkload: string;
    appointmentStats: string;
    totalRevenue: string;
    consultationCount: string;
    dateFilter: string;
    exportReport: string;
  };
  audit: {
    title: string;
    subtitle: string;
    filterByRole: string;
    allRoles: string;
    timestamp: string;
    user: string;
    action: string;
    entity: string;
    details: string;
  };
  settings: {
    title: string;
    clinicInfo: string;
    clinicName: string;
    clinicAddress: string;
    phone: string;
    email: string;
    bmdcDisclaimer: string;
    currency: string;
    timeZone: string;
    language: string;
    defaultFees: string;
    receiptNotes: string;
    saveChanges: string;
    resetDemoData: string;
    syntheticDataNotice: string;
  };
  common: {
    save: string;
    cancel: string;
    delete: string;
    edit: string;
    view: string;
    print: string;
    search: string;
    filter: string;
    close: string;
    confirm: string;
    status: string;
    success: string;
    error: string;
    loading: string;
    noData: string;
  };
}

export const translations: Record<'en' | 'bn', Translations> = {
  en: {
    appName: 'MediChamber OMS',
    tagline: 'Outpatient Clinic & Consultation Management',
    roles: {
      admin: 'Clinic Admin',
      doctor: 'Doctor',
      receptionist: 'Receptionist',
      accountant: 'Accountant',
    },
    nav: {
      dashboard: 'Dashboard',
      queue: 'Queue & Appointments',
      patients: 'Patient Directory',
      doctors: 'Doctor Roster',
      consultation: 'Doctor Chamber',
      billing: 'Billing & Invoices',
      reports: 'Reports & Day Close',
      auditLogs: 'Audit Trail',
      settings: 'Clinic Settings',
    },
    dashboard: {
      todayAppointments: "Today's Appointments",
      patientsInQueue: 'Waiting in Queue',
      todayCollections: "Today's Collection",
      pendingDues: 'Outstanding Dues',
      liveDoctorOccupancy: 'Doctor Chamber Status',
      quickActions: 'Quick Front Desk Actions',
      newPatient: 'Register Patient',
      bookAppointment: 'Book Appointment',
      issueSerial: 'Issue Walk-in Serial',
      createInvoice: 'Raise Invoice',
      servingNow: 'Now In Consultation',
      nextInQueue: 'Next in Queue',
      room: 'Room',
    },
    queue: {
      title: 'Outpatient Queue & Scheduling',
      subtitle: 'Real-time patient queue, slot booking, and serial management',
      selectDoctor: 'Filter by Doctor',
      allDoctors: 'All Active Chambers',
      tabWaiting: 'Waiting Room',
      tabInConsultation: 'In Consultation',
      tabCompleted: 'Completed Today',
      tabAll: 'All Visits',
      serialNo: 'Serial #',
      patientName: 'Patient Name',
      appointmentTime: 'Time / Slot',
      type: 'Visit Type',
      status: 'Queue Status',
      actions: 'Actions',
      checkIn: 'Check In',
      callIn: 'Call In Chamber',
      complete: 'Mark Done',
      cancel: 'Cancel',
      noShow: 'Mark No-Show',
      walkInSerial: 'Issue Serial',
      bookSlot: 'Schedule Slot',
      estimatedWaitTime: 'Est. Wait',
      scheduled: 'Scheduled',
      waiting: 'Waiting',
      inConsultation: 'In Chamber',
      completed: 'Completed',
      cancelled: 'Cancelled',
    },
    patient: {
      directory: 'Patient Records',
      searchPlaceholder: 'Search by phone number, patient ID, or name...',
      addPatient: 'Register New Patient',
      patientId: 'Patient ID',
      name: 'Full Name',
      phone: 'Mobile Phone',
      age: 'Age (Years)',
      gender: 'Gender',
      bloodGroup: 'Blood Group',
      address: 'Address / Area',
      allergies: 'Known Allergies',
      chronicConditions: 'Chronic Conditions',
      emergencyContact: 'Emergency Contact',
      totalVisits: 'Past Visits',
      viewHistory: 'History & Prescriptions',
      edit: 'Edit Patient',
      male: 'Male',
      female: 'Female',
      other: 'Other',
    },
    doctor: {
      directory: 'Medical Specialists & Chambers',
      bmdcReg: 'BMDC Reg. No.',
      specialty: 'Specialty & Department',
      chamberRoom: 'Chamber Room',
      consultationFees: 'Consultation Fee Structure',
      newPatient: 'New Visit Fee',
      returningPatient: 'Return Visit Fee',
      reportFollowUp: 'Report Follow-up Fee',
      schedule: 'Weekly Schedule',
      slotDuration: 'Slot Duration',
      maxSerials: 'Max Serials / Shift',
      minutes: 'mins',
      status: 'Status',
      active: 'On Duty',
      inactive: 'Off Duty',
    },
    consultation: {
      title: 'Doctor Encounter & Prescription',
      selectPatientPrompt: 'Select a patient from today’s waiting room to start consultation',
      vitals: 'Vital Signs & Examination',
      bloodPressure: 'Blood Pressure',
      pulse: 'Pulse Rate',
      temperature: 'Temperature',
      weight: 'Weight',
      bloodSugar: 'Blood Sugar (RBS)',
      chiefComplaints: 'Chief Complaints (C/C)',
      clinicalFindings: 'On Examination / Findings (O/E)',
      diagnosis: 'Clinical Diagnosis',
      rxMedicines: 'Rx - Prescribed Medications',
      addMedicine: 'Add Medicine',
      investigations: 'Investigations Advised (Tests)',
      advice: 'Doctor’s Advice & Instructions',
      followUp: 'Next Follow-up Visit',
      followUpInDays: 'Follow up in (Days)',
      savePrescription: 'Save & Generate Prescription',
      printPrescription: 'Print Prescription (Rx)',
      dosageForm: 'Type',
      brandName: 'Brand Name',
      genericName: 'Generic Name',
      schedule: 'Dose',
      mealTiming: 'Meal Timing',
      duration: 'Duration',
      beforeMeal: 'Before Meal',
      afterMeal: 'After Meal',
      withMeal: 'With Meal',
      emptyStomach: 'Empty Stomach',
    },
    billing: {
      title: 'Billing, Invoices & Collections',
      invoices: 'Invoice Records',
      createInvoice: 'New Invoice',
      invoiceNo: 'Invoice #',
      date: 'Date',
      patient: 'Patient',
      amount: 'Total Amount',
      paid: 'Amount Paid',
      due: 'Balance Due',
      paymentStatus: 'Status',
      paymentMethod: 'Payment Mode',
      cash: 'Cash',
      bkash: 'bKash',
      nagad: 'Nagad',
      card: 'Debit/Credit Card',
      transactionId: 'Transaction ID (TxID)',
      senderPhone: 'Sender Mobile Number',
      recordPayment: 'Collect Payment',
      printReceipt: 'Print Money Receipt',
      subtotal: 'Subtotal',
      discount: 'Discount',
      grandTotal: 'Grand Total',
      settleDue: 'Settle Balance Due',
      cashCloseSummary: 'Today’s Cash Close Statement',
    },
    reports: {
      title: 'Clinic Analytics & Daily Close',
      dailyCollection: 'Daily Collections by Channel',
      byPaymentMethod: 'Payment Channel Breakdown',
      doctorWorkload: 'Doctor Workload & Revenue',
      appointmentStats: 'Appointment Performance',
      totalRevenue: 'Total Gross Collections',
      consultationCount: 'Total Consultations',
      dateFilter: 'Reporting Date',
      exportReport: 'Export Statement',
    },
    audit: {
      title: 'System Audit Trail',
      subtitle: 'Immutable record of staff actions, appointments, prescriptions, and financial transactions',
      filterByRole: 'Filter by Role',
      allRoles: 'All Staff Roles',
      timestamp: 'Timestamp',
      user: 'Staff Member',
      action: 'Action',
      entity: 'Module',
      details: 'Audit Details',
    },
    settings: {
      title: 'Clinic Settings & Configuration',
      clinicInfo: 'Clinic Identity & Contact Information',
      clinicName: 'Clinic / Center Name',
      clinicAddress: 'Clinic Address',
      phone: 'Contact Phone',
      email: 'Contact Email',
      bmdcDisclaimer: 'BMDC Legal Disclaimer',
      currency: 'Operating Currency',
      timeZone: 'Time Zone',
      language: 'Interface Language',
      defaultFees: 'Default Consultation Rates',
      receiptNotes: 'Receipt Footer Notes',
      saveChanges: 'Save Configurations',
      resetDemoData: 'Reset Demo / Synthetic Data',
      syntheticDataNotice: 'Synthetic Demo Data: Safely explore all features without affecting real operations.',
    },
    common: {
      save: 'Save Changes',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      view: 'View',
      print: 'Print',
      search: 'Search',
      filter: 'Filter',
      close: 'Close',
      confirm: 'Confirm',
      status: 'Status',
      success: 'Operation Successful',
      error: 'An error occurred',
      loading: 'Loading...',
      noData: 'No records found',
    },
  },
  bn: {
    appName: 'মেডিচেম্বার সিএমএস',
    tagline: 'বহিঃবিভাগ ক্লিনিক ও চেম্বার ব্যবস্থাপনা পদ্ধতি',
    roles: {
      admin: 'ক্লিনিক অ্যাডমিন',
      doctor: 'চিকিৎসক (ডাক্তার)',
      receptionist: 'রিসেপশনিস্ট',
      accountant: 'অ্যাকাউন্ট্যান্ট (ক্যাশিয়ার)',
    },
    nav: {
      dashboard: 'ড্যাশবোর্ড',
      queue: 'সিরিয়াল ও অ্যাপয়েন্টমেন্ট',
      patients: 'রোগীর তালিকা',
      doctors: 'ডাক্তার রোস্টার',
      consultation: 'ডাক্তার চেম্বার (প্রেসক্রিপশন)',
      billing: 'বিলিং ও মানি রিসিট',
      reports: 'রিপোর্ট ও ডে-ক্লোজ',
      auditLogs: 'অডিট হিস্ট্রি',
      settings: 'ক্লিনিক সেটিংস',
    },
    dashboard: {
      todayAppointments: 'আজকের মোট অ্যাপয়েন্টমেন্ট',
      patientsInQueue: 'অপেক্ষমাণ রোগী (সিরিয়াল)',
      todayCollections: 'আজকের মোট কালেকশন',
      pendingDues: 'বকেয়া বিল',
      liveDoctorOccupancy: 'চেম্বার বর্তমান অবস্থা',
      quickActions: 'ফ্রন্ট ডেস্ক শর্টকাট',
      newPatient: 'নতুন রোগী নিবন্ধন',
      bookAppointment: 'অ্যাপয়েন্টমেন্ট বুকিং',
      issueSerial: 'ওয়াক-ইন সিরিয়াল প্রদান',
      createInvoice: 'নতুন ইনভয়েস তৈরি',
      servingNow: 'বর্তমানে চেম্বারে আছেন',
      nextInQueue: 'পরবর্তী রোগী',
      room: 'রুম নং',
    },
    queue: {
      title: 'বহিঃবিভাগ সিরিয়াল ও অ্যাপয়েন্টমেন্ট কিউ',
      subtitle: 'রিয়েল-টাইম রোগী সিরিয়াল, টাইম-স্লট এবং চেম্বার নিয়ন্ত্রণ',
      selectDoctor: 'ডাক্তার নির্বাচন করুন',
      allDoctors: 'সকল সক্রিয় চেম্বার',
      tabWaiting: 'অপেক্ষমাণ সিরিয়াল',
      tabInConsultation: 'চেম্বারে আছেন',
      tabCompleted: 'আজকে সম্পন্ন',
      tabAll: 'সকল ভিজিট',
      serialNo: 'সিরিয়াল নং',
      patientName: 'রোগীর নাম',
      appointmentTime: 'সময় / স্লট',
      type: 'ভিজিট ধরন',
      status: 'বর্তমান অবস্থা',
      actions: 'অ্যাকশন',
      checkIn: 'চেক-ইন করুন',
      callIn: 'চেম্বারে ডাকুন',
      complete: 'সম্পন্ন করুন',
      cancel: 'বাতিল করুন',
      noShow: 'অনুপস্থিত',
      walkInSerial: 'ওয়াক-ইন সিরিয়াল',
      bookSlot: 'সময় স্লট বুকিং',
      estimatedWaitTime: 'আনুমানিক সময়',
      scheduled: 'নির্ধারিত',
      waiting: 'অপেক্ষমাণ',
      inConsultation: 'পরামর্শ চলছে',
      completed: 'সম্পন্ন',
      cancelled: 'বাতিল',
    },
    patient: {
      directory: 'রোগীদের তথ্য ভাণ্ডার',
      searchPlaceholder: 'মোবাইল নম্বর, পেশেন্ট আইডি অথবা নাম দিয়ে খুঁজুন...',
      addPatient: 'নতুন রোগী নিবন্ধন',
      patientId: 'পেশেন্ট আইডি',
      name: 'রোগীর পুরো নাম',
      phone: 'মোবাইল ফোন',
      age: 'বয়স (বছর)',
      gender: 'লিঙ্গ',
      bloodGroup: 'রক্তের গ্রুপ',
      address: 'ঠিকানা / এলাকা',
      allergies: 'জানা অ্যালার্জি',
      chronicConditions: 'দীর্ঘমেয়াদী রোগ',
      emergencyContact: 'জরুরি যোগাযোগ',
      totalVisits: 'মোট ভিজিট সংখ্যা',
      viewHistory: 'ইতিহাস ও প্রেসক্রিপশন',
      edit: 'তথ্য পরিবর্তন',
      male: 'পুরুষ',
      female: 'মহিলা',
      other: 'অন্যান্য',
    },
    doctor: {
      directory: 'বিশেষজ্ঞ চিকিৎসক ও চেম্বার',
      bmdcReg: 'বিএমডিসি রেজি. নং',
      specialty: 'বিভাগ ও বিশেষত্ব',
      chamberRoom: 'চেম্বার রুম নং',
      consultationFees: 'পরামর্শ ফি বিবরণ',
      newPatient: 'নতুন রোগী ফি',
      returningPatient: 'পুরাতন রোগী ফি',
      reportFollowUp: 'রিপোর্ট দেখানো ফি',
      schedule: 'সাপ্তাহিক সূচি',
      slotDuration: 'স্লটের সময়',
      maxSerials: 'সর্বোচ্চ সিরিয়াল',
      minutes: 'মিনিট',
      status: 'চেম্বার স্ট্যাটাস',
      active: 'চেম্বারে উপস্থিত',
      inactive: 'অনুপস্থিত',
    },
    consultation: {
      title: 'ডাক্তারের চেম্বার ও প্রেসক্রিপশন তৈরি',
      selectPatientPrompt: 'পরামর্শ শুরু করতে আজকের অপেক্ষমাণ তালিকা থেকে রোগী নির্বাচন করুন',
      vitals: 'শারীরিক লক্ষণ ও পরীক্ষা (Vitals)',
      bloodPressure: 'রক্তচাপ (BP)',
      pulse: 'পালস রেট (নাড়ীর গতি)',
      temperature: 'শারীরিক তাপমাত্রা',
      weight: 'ওজন (কেজি)',
      bloodSugar: 'ব্লাড সুগার (RBS)',
      chiefComplaints: 'প্রধান উপসর্গ (Chief Complaints - C/C)',
      clinicalFindings: 'শারীরিক পরীক্ষা ও পর্যবেক্ষণ (O/E)',
      diagnosis: 'রোগ নির্ণয় (Diagnosis)',
      rxMedicines: 'ওষুধের তালিকা (Rx)',
      addMedicine: 'নতুন ওষুধ যুক্ত করুন',
      investigations: 'প্রয়োজনীয় প্যাথলজি ও পরীক্ষা (Investigations)',
      advice: 'ডাক্তারের পরামর্শ ও নির্দেশনা',
      followUp: 'পরবর্তী সাক্ষাতের তারিখ',
      followUpInDays: 'কত দিন পর আসবেন',
      savePrescription: 'প্রেসক্রিপশন সংরক্ষণ ও প্রিন্ট',
      printPrescription: 'প্রেসক্রিপশন প্রিন্ট (Rx)',
      dosageForm: 'ধরন',
      brandName: 'ব্র্যান্ডের নাম',
      genericName: 'জেনেরিক নাম',
      schedule: 'ডোজ',
      mealTiming: 'খাওয়ার নিয়ম',
      duration: 'কতদিন',
      beforeMeal: 'খাওয়ার আগে',
      afterMeal: 'খাওয়ার পরে',
      withMeal: 'খাওয়ার সাথে',
      emptyStomach: 'খালি পেটে',
    },
    billing: {
      title: 'বিলিং, ইনভয়েস ও কালেকশন',
      invoices: 'ইনভয়েস রেকর্ড',
      createInvoice: 'নতুন বিল তৈরি',
      invoiceNo: 'ইনভয়েস নং',
      date: 'তারিখ',
      patient: 'রোগী',
      amount: 'মোট টাকা',
      paid: 'পরিশোধিত টাকা',
      due: 'বকেয়া টাকা',
      paymentStatus: 'পেমেন্ট অবস্থা',
      paymentMethod: 'পরিশোধের মাধ্যম',
      cash: 'নগদ টাকা (Cash)',
      bkash: 'বিকাশ (bKash)',
      nagad: 'নগদ (Nagad)',
      card: 'ব্যাংক কার্ড (Card)',
      transactionId: 'ট্রানজেকশন আইডি (TxID)',
      senderPhone: 'প্রেরকের মোবাইল নম্বর',
      recordPayment: 'পেমেন্ট গ্রহণ করুন',
      printReceipt: 'মানি রিসিট প্রিন্ট',
      subtotal: 'সাব-টোটাল',
      discount: 'ছাড় (ডিসকাউন্ট)',
      grandTotal: 'সর্বমোট টাকা',
      settleDue: 'বকেয়া পরিশোধ',
      cashCloseSummary: 'আজকের ডে-ক্লোজ ও ক্যাশ সামারি',
    },
    reports: {
      title: 'ক্লিনিক রিপোর্ট ও সারসংক্ষেপ',
      dailyCollection: 'দৈনিক কালেকশন হিসাব',
      byPaymentMethod: 'পেমেন্ট মাধ্যমভিত্তিক জমা (ক্যাশ/বিকাশ/নগদ)',
      doctorWorkload: 'ডাক্তারভিত্তিক রোগী ও আয়',
      appointmentStats: 'অ্যাপয়েন্টমেন্ট পরিসংখ্যান',
      totalRevenue: 'সর্বমোট জমা',
      consultationCount: 'মোট রোগী দেখা হয়েছে',
      dateFilter: 'রিপোর্টের তারিখ',
      exportReport: 'রিপোর্ট এক্সপোর্ট করুন',
    },
    audit: {
      title: 'সিস্টেম অডিট ট্রেইল ও লগ',
      subtitle: 'কর্মী কার্যক্রম, অ্যাপয়েন্টমেন্ট, প্রেসক্রিপশন ও আর্থিক লেনদেনের রেকর্ড',
      filterByRole: 'পদবী অনুযায়ী ফিল্টার',
      allRoles: 'সকল কর্মী',
      timestamp: 'সময় ও তারিখ',
      user: 'ব্যবহারকারী',
      action: 'কর্মকাণ্ড',
      entity: 'মডিউল',
      details: 'বিস্তারিত বিবরণ',
    },
    settings: {
      title: 'ক্লিনিক সেটিংস ও তথ্য',
      clinicInfo: 'ক্লিনিকের নাম ও যোগাযোগের তথ্য',
      clinicName: 'ক্লিনিক / সেন্টারের নাম',
      clinicAddress: 'ক্লিনিকের ঠিকানা',
      phone: 'যোগাযোগের ফোন নম্বর',
      email: 'ইমেইল অ্যাড্রেস',
      bmdcDisclaimer: 'বিএমডিসি আইনি ডিসক্লেইমার',
      currency: 'মুদ্রা',
      timeZone: 'টাইম জোন',
      language: 'ভাষার পছন্দ',
      defaultFees: 'সাধারণ পরামর্শ ফি রেট',
      receiptNotes: 'রিসিটের নিচের মন্তব্য',
      saveChanges: 'তথ্য সংরক্ষণ করুন',
      resetDemoData: 'ডেমো ডেটা রিসেট করুন',
      syntheticDataNotice: 'সিন্থেটিক ডেমো ডেটা: আসল তথ্য প্রভাবিত না করেই সকল সুবিধা নিরাপদে পরীক্ষা করুন।',
    },
    common: {
      save: 'সংরক্ষণ করুন',
      cancel: 'বাতিল',
      delete: 'মুছে ফেলুন',
      edit: 'সম্পাদনা',
      view: 'দেখুন',
      print: 'প্রিন্ট করুন',
      search: 'অনুসন্ধান',
      filter: 'ফিল্টার',
      close: 'বন্ধ করুন',
      confirm: 'নিশ্চিত করুন',
      status: 'স্ট্যাটাস',
      success: 'সফলভাবে সম্পন্ন হয়েছে',
      error: 'একটি ত্রুটি ঘটেছে',
      loading: 'লোড হচ্ছে...',
      noData: 'কোন তথ্য পাওয়া যায়নি',
    },
  },
};
