export interface ICD11Code {
  code: string;
  title: string;
  titleBn?: string;
  category: string;
  description?: string;
}

export interface LabTestItem {
  id: string;
  name: string;
  nameBn?: string;
  category: 'Hematology' | 'Biochemistry' | 'Cardiology & Imaging' | 'Urine & Renal' | 'Endocrine & Hormones' | 'Microbiology & Serology';
  sampleType: string;
  normalTurnaround: string;
  estimatedFee: number;
}

export const commonICD11Codes: ICD11Code[] = [
  // Endocrine, nutritional or metabolic diseases
  {
    code: '5A11',
    title: 'Type 2 diabetes mellitus',
    titleBn: 'টাইপ ২ ডায়াবেটিস মেলিটাস',
    category: 'Endocrine & Metabolic',
    description: 'Non-insulin-dependent diabetes characterized by high blood sugar, insulin resistance, and relative lack of insulin.',
  },
  {
    code: '5A10',
    title: 'Type 1 diabetes mellitus',
    titleBn: 'টাইপ ১ ডায়াবেটিস মেলিটাস',
    category: 'Endocrine & Metabolic',
    description: 'Autoimmune destruction of insulin-producing beta cells in the pancreas.',
  },
  {
    code: '5A00',
    title: 'Hypothyroidism, unspecified',
    titleBn: 'হাইপোথাইরয়েডিজম',
    category: 'Endocrine & Metabolic',
    description: 'Deficiency of thyroid hormone production by the thyroid gland.',
  },
  {
    code: '5B81',
    title: 'Hyperlipidaemia / Dyslipidaemia',
    titleBn: 'ডিসলিপিডেমিয়া (উচ্চ কোলেস্টেরল)',
    category: 'Endocrine & Metabolic',
    description: 'Elevated plasma cholesterol, triglycerides, or both, or a low HDL cholesterol level.',
  },
  {
    code: '5B80',
    title: 'Hyperuricaemia and Gout',
    titleBn: 'গাউট ও অতিরিক্ত ইউরিক এসিড',
    category: 'Endocrine & Metabolic',
    description: 'Recurrent attacks of acute inflammatory arthritis caused by elevated uric acid in the blood.',
  },

  // Diseases of the circulatory system
  {
    code: 'BA00',
    title: 'Essential hypertension',
    titleBn: 'উচ্চ রক্তচাপ (হাইপারটেনশন)',
    category: 'Cardiovascular',
    description: 'High blood pressure with no identifiable secondary cause.',
  },
  {
    code: 'BA40',
    title: 'Angina pectoris',
    titleBn: 'এনজাইনা পেকটোরিস (হৃদশূল)',
    category: 'Cardiovascular',
    description: 'Chest pain or pressure due to insufficient blood flow to the heart muscle.',
  },
  {
    code: 'BA80',
    title: 'Atrial fibrillation or flutter',
    titleBn: 'অ্যাট্রিয়াল ফিব্রিলেশন',
    category: 'Cardiovascular',
    description: 'Abnormal cardiac rhythm characterized by rapid and irregular beating of the atria.',
  },
  {
    code: 'BD10',
    title: 'Chronic venous insufficiency of lower extremities',
    titleBn: 'ক্রনিক ভেনাস অপ্রতুলতা',
    category: 'Cardiovascular',
    description: 'Incompetence of valves in the veins of the leg causing swelling and varicose changes.',
  },

  // Diseases of the respiratory system
  {
    code: 'CA23',
    title: 'Asthma, unspecified',
    titleBn: 'অ্যাজমা / হাঁপানি',
    category: 'Respiratory',
    description: 'Chronic inflammatory disease of the airways of the lungs characterized by reversible airflow obstruction and bronchospasm.',
  },
  {
    code: 'CA40',
    title: 'Acute bronchitis',
    titleBn: 'তীব্র ব্রঙ্কাইটিস',
    category: 'Respiratory',
    description: 'Inflammation of the large airways of the lungs that is usually caused by viral infections.',
  },
  {
    code: 'CA22',
    title: 'Chronic obstructive pulmonary disease (COPD)',
    titleBn: 'সিওপিডি (ক্রনিক ফুসফুসের রোগ)',
    category: 'Respiratory',
    description: 'Progressive lung disease causing long-term breathing problems and poor airflow.',
  },
  {
    code: 'CA01',
    title: 'Acute viral upper respiratory tract infection (Common Cold)',
    titleBn: 'সাধারণ সর্দি-কাশি ও ভাইরাল সংক্রমণ',
    category: 'Respiratory',
    description: 'Infection of the upper respiratory tract by rhinoviruses, adenoviruses or coronaviruses.',
  },
  {
    code: 'CA03',
    title: 'Acute tonsillitis or pharyngitis',
    titleBn: 'টনসিলাইটিস বা ফ্যারিঞ্জাইটিস',
    category: 'Respiratory',
    description: 'Acute inflammation of the pharyngeal tonsils and throat mucosa.',
  },

  // Diseases of the digestive system
  {
    code: 'DA42',
    title: 'Gastro-oesophageal reflux disease (GERD)',
    titleBn: 'গ্যাস্ট্রো-ইসোফেজিয়াল রিফ্লাক্স (গ্যাস্ট্রিক)',
    category: 'Digestive',
    description: 'Stomach contents flow back into the esophagus resulting in heartburn and acid regurgitation.',
  },
  {
    code: 'DA60',
    title: 'Gastric ulcer (Peptic ulcer disease)',
    titleBn: 'পেপটিক আলসার ডিজিজ (পিইউডি)',
    category: 'Digestive',
    description: 'A sore on the inner lining of the stomach or small intestine.',
  },
  {
    code: 'DD91',
    title: 'Irritable bowel syndrome (IBS)',
    titleBn: 'আইবিএস (ইরিটেবল বাওয়েল সিন্ড্রোম)',
    category: 'Digestive',
    description: 'Common disorder affecting the large intestine with cramping, abdominal pain, bloating, gas, and diarrhea/constipation.',
  },
  {
    code: 'DB90',
    title: 'Non-alcoholic fatty liver disease (NAFLD)',
    titleBn: 'ফ্যাটি লিভার ডিজিজ',
    category: 'Digestive',
    description: 'Accumulation of fat in liver cells in people who drink little or no alcohol.',
  },

  // Diseases of the nervous system
  {
    code: '8A80',
    title: 'Migraine without aura',
    titleBn: 'মাইগ্রেন মাথা ব্যথা',
    category: 'Neurological',
    description: 'Recurrent severe throbbing headache typically affecting one side of the head.',
  },
  {
    code: '8A81',
    title: 'Tension-type headache',
    titleBn: 'টেনশন হেডেক (মানসিক চাপের মাথাব্যথা)',
    category: 'Neurological',
    description: 'Mild to moderate bilateral headache band-like sensation around the forehead.',
  },
  {
    code: '8B80',
    title: 'Benign paroxysmal positional vertigo (BPPV)',
    titleBn: 'ভার্টিগো বা মাথা ঘোরা',
    category: 'Neurological',
    description: 'Episodes of dizziness and a sensation of spinning triggered by specific head position changes.',
  },

  // Diseases of the musculoskeletal system
  {
    code: 'FA00',
    title: 'Osteoarthritis of knee',
    titleBn: 'হাঁটুর অস্টিওআর্থ্রাইটিস',
    category: 'Musculoskeletal',
    description: 'Degenerative joint disease of the knee causing stiffness and joint pain.',
  },
  {
    code: 'ME84',
    title: 'Low back pain, unspecified',
    titleBn: 'কোমরের ব্যথা (লাম্বাগো)',
    category: 'Musculoskeletal',
    description: 'Pain affecting the lumbosacral region without specified radicular compression.',
  },
  {
    code: 'FA20',
    title: 'Rheumatoid arthritis',
    titleBn: 'রিউমাটয়েড আর্থ্রাইটিস (বাতের রোগ)',
    category: 'Musculoskeletal',
    description: 'Chronic inflammatory autoimmune disorder that typically affects small joints in hands and feet.',
  },

  // Infectious diseases & General
  {
    code: '1D00',
    title: 'Dengue fever without warning signs',
    titleBn: 'ডেঙ্গু জ্বর',
    category: 'Infectious',
    description: 'Mosquito-borne viral infection caused by dengue viruses causing acute high fever and myalgia.',
  },
  {
    code: '1A00',
    title: 'Typhoid or paratyphoid fever (Enteric fever)',
    titleBn: 'টাইফয়েড জ্বর',
    category: 'Infectious',
    description: 'Bacterial infection due to Salmonella typhi causing prolonged fever, abdominal rose spots, and headache.',
  },
  {
    code: 'MD81',
    title: 'Fever of unknown origin (Pyrexia)',
    titleBn: 'অজ্ঞাত কারণের জ্বর (পাইরেক্সিয়া)',
    category: 'General Symptoms',
    description: 'Body temperature elevated above normal range where immediate clinical cause is pending test results.',
  },
  {
    code: 'MG45',
    title: 'Generalised fatigue and asthenia',
    titleBn: 'অতিরিক্ত ক্লান্তি ও শারীরিক দুর্বলতা',
    category: 'General Symptoms',
    description: 'Non-specific persistent lack of energy and subjective feeling of exhaustion.',
  },
];

export const commonLabTestPanels: LabTestItem[] = [
  // Hematology
  {
    id: 'LAB-01',
    name: 'Complete Blood Count (CBC) with ESR & PBF',
    nameBn: 'সিবিসি ও ইএসআর পরীক্ষা',
    category: 'Hematology',
    sampleType: 'Whole Blood (EDTA)',
    normalTurnaround: '2-4 Hours',
    estimatedFee: 400,
  },
  {
    id: 'LAB-02',
    name: 'Blood Grouping & Rh Factor',
    nameBn: 'রক্তের গ্রুপ ও আরএইচ ফ্যাক্টর',
    category: 'Hematology',
    sampleType: 'Whole Blood (EDTA)',
    normalTurnaround: '1 Hour',
    estimatedFee: 150,
  },
  {
    id: 'LAB-03',
    name: 'Dengue NS1 Antigen & IgM/IgG Antibody',
    nameBn: 'ডেঙ্গু এনএস১ ও অ্যান্টিবডি টেস্ট',
    category: 'Hematology',
    sampleType: 'Serum',
    normalTurnaround: '1 Hour',
    estimatedFee: 500,
  },

  // Biochemistry & Metabolic
  {
    id: 'LAB-04',
    name: 'Fasting Blood Sugar (FBS) & 2hr ABF',
    nameBn: 'খালি পেটে ও খাওয়ার পর সুগার পরীক্ষা',
    category: 'Biochemistry',
    sampleType: 'Sodium Fluoride Plasma',
    normalTurnaround: '2 Hours',
    estimatedFee: 200,
  },
  {
    id: 'LAB-05',
    name: 'HbA1c (Glycated Hemoglobin)',
    nameBn: 'এইচবি-এ১সি (৩ মাসের গড় সুগার)',
    category: 'Biochemistry',
    sampleType: 'Whole Blood (EDTA)',
    normalTurnaround: '2 Hours',
    estimatedFee: 800,
  },
  {
    id: 'LAB-06',
    name: 'Serum Creatinine with eGFR',
    nameBn: 'সিরাম ক্রিয়েটিনিন ও কিডনি ফাংশন',
    category: 'Biochemistry',
    sampleType: 'Serum',
    normalTurnaround: '2 Hours',
    estimatedFee: 350,
  },
  {
    id: 'LAB-07',
    name: 'Fasting Lipid Profile (Total Cholesterol, HDL, LDL, Triglycerides)',
    nameBn: 'লিপিড প্রোফাইল (রক্তের চর্বি পরীক্ষা)',
    category: 'Biochemistry',
    sampleType: 'Serum (12h Fasting)',
    normalTurnaround: '3 Hours',
    estimatedFee: 900,
  },
  {
    id: 'LAB-08',
    name: 'Liver Function Test (LFT - SGPT, SGOT, Bilirubin, Alk Phos)',
    nameBn: 'লিভার ফাংশন টেস্ট (এসজিপিটি, বিলিরুবিন)',
    category: 'Biochemistry',
    sampleType: 'Serum',
    normalTurnaround: '3 Hours',
    estimatedFee: 850,
  },
  {
    id: 'LAB-09',
    name: 'Serum Uric Acid',
    nameBn: 'সিরাম ইউরিক এসিড',
    category: 'Biochemistry',
    sampleType: 'Serum',
    normalTurnaround: '2 Hours',
    estimatedFee: 300,
  },
  {
    id: 'LAB-10',
    name: 'Serum Electrolytes (Sodium, Potassium, Chloride, Bicarbonate)',
    nameBn: 'ইলেক্ট্রোলাইটস (সোডিয়াম, পটাশিয়াম)',
    category: 'Biochemistry',
    sampleType: 'Serum',
    normalTurnaround: '2 Hours',
    estimatedFee: 800,
  },

  // Urine & Renal
  {
    id: 'LAB-11',
    name: 'Urine Routine & Microscopic Examination (R/M/E)',
    nameBn: 'প্রস্রাবের সাধারণ ও মাইক্রোস্কোপিক পরীক্ষা',
    category: 'Urine & Renal',
    sampleType: 'Midstream Clean Urine',
    normalTurnaround: '1-2 Hours',
    estimatedFee: 200,
  },
  {
    id: 'LAB-12',
    name: 'Urine for Microalbumin / Protein-Creatinine Ratio (ACR)',
    nameBn: 'ইউরিন মাইক্রোঅ্যালবুমিন',
    category: 'Urine & Renal',
    sampleType: 'Spot Urine Sample',
    normalTurnaround: '3 Hours',
    estimatedFee: 600,
  },

  // Endocrine & Hormones
  {
    id: 'LAB-13',
    name: 'Thyroid Function Panel (Serum TSH, Free T3, Free T4)',
    nameBn: 'থাইরয়েড ফাংশন প্যানেল (টিএসএইচ, এফটি৩, এফটি৪)',
    category: 'Endocrine & Hormones',
    sampleType: 'Serum',
    normalTurnaround: '4 Hours',
    estimatedFee: 1200,
  },
  {
    id: 'LAB-14',
    name: 'Serum 25-Hydroxy Vitamin D (Total)',
    nameBn: 'ভিটামিন ডি টেস্ট',
    category: 'Endocrine & Hormones',
    sampleType: 'Serum',
    normalTurnaround: '6 Hours',
    estimatedFee: 1800,
  },
  {
    id: 'LAB-15',
    name: 'Serum Ferritin & Iron Profile',
    nameBn: 'সিরাম ফেরিটিন (শরীরে আয়রনের পরিমাণ)',
    category: 'Endocrine & Hormones',
    sampleType: 'Serum',
    normalTurnaround: '4 Hours',
    estimatedFee: 900,
  },

  // Cardiology & Imaging
  {
    id: 'LAB-16',
    name: '12-Lead Electrocardiogram (ECG / EKG)',
    nameBn: '১২-লিড ইসিজি পরীক্ষা',
    category: 'Cardiology & Imaging',
    sampleType: 'Non-invasive procedure',
    normalTurnaround: 'Immediate (15 mins)',
    estimatedFee: 400,
  },
  {
    id: 'LAB-17',
    name: 'Chest X-Ray P/A View with Formal Radiological Report',
    nameBn: 'বুকের এক্স-রে পি/এ ভিউ',
    category: 'Cardiology & Imaging',
    sampleType: 'Radiological film & report',
    normalTurnaround: '1 Hour',
    estimatedFee: 600,
  },
  {
    id: 'LAB-18',
    name: 'Ultrasonography (USG) of Whole Abdomen with PVR',
    nameBn: 'সম্পূর্ণ পেটের আল্ট্রাসনোগ্রাম (ইউএসজি)',
    category: 'Cardiology & Imaging',
    sampleType: 'Imaging report & film',
    normalTurnaround: '1 Hour',
    estimatedFee: 1200,
  },
  {
    id: 'LAB-19',
    name: 'Transthoracic 2D Echocardiogram with Color Doppler',
    nameBn: 'ইকোকার্ডিওগ্রাম ও কালার ডপলার',
    category: 'Cardiology & Imaging',
    sampleType: 'Cardiac imaging report',
    normalTurnaround: '2 Hours',
    estimatedFee: 2000,
  },
];
