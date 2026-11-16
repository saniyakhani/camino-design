// ─────────────────────────────────────────────────────────────────────────────
// lib/milestones.ts
// Defines every milestone node for all three Life Map trees.
// ─────────────────────────────────────────────────────────────────────────────

export type Topic = 'financeJobs' | 'health' | 'immigration'

export type NodeStatus = 'locked' | 'unlocked' | 'complete'

export interface MilestoneNode {
  id: string
  topic: Topic
  /** Tier 1 = foundational, Tier 2 = intermediate, Tier 3 = advanced */
  tier: 1 | 2 | 3
  title: { en: string; es: string; fa: string }
  description: { en: string; es: string; fa: string }
  /** IDs that must be 'complete' before this node becomes 'unlocked' */
  dependsOn: string[]
  /** Keywords from AI chat that auto-complete this node */
  keywords: string[]
}

// ─────────────────────────────────────────────────────────────────────────────
// FINANCE & JOBS TREE
// ─────────────────────────────────────────────────────────────────────────────
const financeJobsNodes: MilestoneNode[] = [
  // ── Tier 1 ──────────────────────────────────────────────────────────────
  {
    id: 'open-bank-account',
    topic: 'financeJobs',
    tier: 1,
    title: {
      en: 'Open a Checking Account',
      es: 'Abrir una cuenta de cheques',
      fa: 'باز کردن حساب جاری',
    },
    description: {
      en: 'Open a free or low-fee checking account at a bank or credit union.',
      es: 'Abre una cuenta de cheques gratuita o de bajo costo en un banco o cooperativa de crédito.',
      fa: 'یک حساب جاری رایگان یا با کارمزد پایین در بانک یا اتحادیه اعتباری باز کنید.',
    },
    dependsOn: [],
    keywords: ['checking account', 'bank account', 'open an account', 'cuenta de cheques', 'حساب بانکی'],
  },
  {
    id: 'draft-resume',
    topic: 'financeJobs',
    tier: 1,
    title: {
      en: 'Draft a Basic Resume',
      es: 'Redactar un currículum básico',
      fa: 'نوشتن رزومه ساده',
    },
    description: {
      en: 'Write a one-page resume listing your work history, skills, and contact info.',
      es: 'Escribe un currículum de una página con tu historial laboral, habilidades e información de contacto.',
      fa: 'یک رزومه یک‌صفحه‌ای با سابقه کاری، مهارت‌ها و اطلاعات تماس بنویسید.',
    },
    dependsOn: [],
    keywords: ['resume', 'cv', 'curriculum vitae', 'currículum', 'رزومه'],
  },
  {
    id: 'understand-credit',
    topic: 'financeJobs',
    tier: 1,
    title: {
      en: 'Learn What a Credit Score Is',
      es: 'Aprender qué es un puntaje de crédito',
      fa: 'آشنایی با امتیاز اعتباری',
    },
    description: {
      en: 'Understand the basics of how a credit score is calculated and why it matters.',
      es: 'Comprende los conceptos básicos de cómo se calcula un puntaje de crédito y por qué es importante.',
      fa: 'با نحوه محاسبه امتیاز اعتباری و اهمیت آن آشنا شوید.',
    },
    dependsOn: [],
    keywords: ['credit score', 'credit report', 'fico', 'puntaje de crédito', 'امتیاز اعتباری'],
  },

  // ── Tier 2 ──────────────────────────────────────────────────────────────
  {
    id: 'create-budget',
    topic: 'financeJobs',
    tier: 2,
    title: {
      en: 'Create a Monthly Budget',
      es: 'Crear un presupuesto mensual',
      fa: 'ساختن بودجه ماهانه',
    },
    description: {
      en: 'List your monthly income and expenses to see where your money goes.',
      es: 'Anota tus ingresos y gastos mensuales para ver en qué se va tu dinero.',
      fa: 'درآمد و هزینه‌های ماهانه‌تان را برای مدیریت بهتر پول فهرست کنید.',
    },
    dependsOn: ['open-bank-account'],
    keywords: ['budget', 'budgeting', 'monthly expenses', 'presupuesto', 'بودجه'],
  },
  {
    id: 'apply-for-job',
    topic: 'financeJobs',
    tier: 2,
    title: {
      en: 'Apply for Your First Job',
      es: 'Solicitar tu primer empleo',
      fa: 'درخواست اولین شغل',
    },
    description: {
      en: 'Submit applications to at least two jobs using your new resume.',
      es: 'Envía solicitudes a al menos dos trabajos usando tu nuevo currículum.',
      fa: 'با رزومه جدیدتان برای حداقل دو شغل درخواست بدهید.',
    },
    dependsOn: ['draft-resume'],
    keywords: ['job application', 'apply for a job', 'job interview', 'solicitud de empleo', 'درخواست شغل'],
  },
  {
    id: 'build-credit',
    topic: 'financeJobs',
    tier: 2,
    title: {
      en: 'Get a Secured Credit Card',
      es: 'Obtener una tarjeta de crédito garantizada',
      fa: 'دریافت کارت اعتباری تضمین‌شده',
    },
    description: {
      en: 'Open a secured card to start building a U.S. credit history safely.',
      es: 'Abre una tarjeta garantizada para comenzar a construir tu historial crediticio en EE. UU. de forma segura.',
      fa: 'یک کارت اعتباری تضمین‌شده باز کنید تا سابقه اعتباری در آمریکا بسازید.',
    },
    dependsOn: ['understand-credit', 'open-bank-account'],
    keywords: ['secured card', 'secured credit', 'build credit', 'tarjeta garantizada', 'کارت اعتباری'],
  },

  // ── Tier 3 ──────────────────────────────────────────────────────────────
  {
    id: 'file-taxes',
    topic: 'financeJobs',
    tier: 3,
    title: {
      en: 'File Your First Tax Return',
      es: 'Presentar tu primera declaración de impuestos',
      fa: 'ارائه اولین اظهارنامه مالیاتی',
    },
    description: {
      en: 'Use free tax filing programs (like VITA) to submit your federal tax return.',
      es: 'Usa programas de declaración gratuita (como VITA) para presentar tu declaración federal.',
      fa: 'با برنامه‌های رایگان (مانند VITA) اظهارنامه مالیاتی فدرال خود را ارائه دهید.',
    },
    dependsOn: ['create-budget', 'apply-for-job'],
    keywords: ['taxes', 'tax return', 'irs', 'vita', 'impuestos', 'مالیات'],
  },
  {
    id: 'negotiate-salary',
    topic: 'financeJobs',
    tier: 3,
    title: {
      en: 'Negotiate Your First Salary',
      es: 'Negociar tu primer salario',
      fa: 'مذاکره درباره حقوق',
    },
    description: {
      en: 'Learn how to research fair pay and confidently ask for a better salary.',
      es: 'Aprende a investigar un pago justo y pedir con confianza un mejor salario.',
      fa: 'بیاموزید چطور حقوق منصفانه را تحقیق کرده و با اطمینان درخواست افزایش حقوق بدهید.',
    },
    dependsOn: ['apply-for-job', 'build-credit'],
    keywords: ['salary', 'negotiate', 'pay raise', 'salario', 'حقوق', 'مذاکره'],
  },
  {
    id: 'open-savings',
    topic: 'financeJobs',
    tier: 3,
    title: {
      en: 'Open a Savings Account',
      es: 'Abrir una cuenta de ahorros',
      fa: 'باز کردن حساب پس‌انداز',
    },
    description: {
      en: 'Start saving with an interest-bearing savings account, even a small amount monthly.',
      es: 'Comienza a ahorrar con una cuenta que genera intereses, aunque sea una cantidad pequeña al mes.',
      fa: 'با یک حساب پس‌انداز با بهره شروع کنید، حتی مقدار کمی در ماه.',
    },
    dependsOn: ['create-budget', 'build-credit'],
    keywords: ['savings', 'savings account', 'save money', 'cuenta de ahorros', 'پس‌انداز'],
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// HEALTH TREE
// ─────────────────────────────────────────────────────────────────────────────
const healthNodes: MilestoneNode[] = [
  // ── Tier 1 ──────────────────────────────────────────────────────────────
  {
    id: 'find-clinic',
    topic: 'health',
    tier: 1,
    title: {
      en: 'Find a Free or Low-Cost Clinic',
      es: 'Encontrar una clínica gratuita o de bajo costo',
      fa: 'پیدا کردن کلینیک رایگان یا ارزان',
    },
    description: {
      en: 'Locate a Federally Qualified Health Center (FQHC) near you that serves everyone.',
      es: 'Encuentra un Centro de Salud Calificado a nivel Federal (FQHC) cerca de ti que atiende a todos.',
      fa: 'یک مرکز بهداشتی واجد شرایط فدرال (FQHC) نزدیک خود پیدا کنید.',
    },
    dependsOn: [],
    keywords: ['clinic', 'health center', 'fqhc', 'clínica', 'کلینیک', 'مرکز بهداشت'],
  },
  {
    id: 'medicaid-basics',
    topic: 'health',
    tier: 1,
    title: {
      en: 'Learn About Medicaid & CHIP',
      es: 'Aprender sobre Medicaid y CHIP',
      fa: 'آشنایی با Medicaid و CHIP',
    },
    description: {
      en: 'Understand if you or your children qualify for free or low-cost government health coverage.',
      es: 'Comprende si tú o tus hijos califican para cobertura de salud gratuita o de bajo costo del gobierno.',
      fa: 'بررسی کنید که آیا شما یا فرزندانتان برای پوشش بهداشتی دولتی رایگان یا ارزان واجد شرایط هستید.',
    },
    dependsOn: [],
    keywords: ['medicaid', 'chip', 'health insurance', 'coverage', 'seguro médico', 'بیمه درمانی'],
  },
  {
    id: 'first-aid-basics',
    topic: 'health',
    tier: 1,
    title: {
      en: 'Complete a First Aid Basics Module',
      es: 'Completar un módulo básico de primeros auxilios',
      fa: 'تکمیل دوره پایه کمک‌های اولیه',
    },
    description: {
      en: 'Learn basic first aid skills like CPR, treating cuts, and handling emergencies.',
      es: 'Aprende habilidades básicas de primeros auxilios como RCP, tratar cortadas y manejar emergencias.',
      fa: 'مهارت‌های پایه کمک‌های اولیه مانند CPR، درمان زخم و رسیدگی به موارد اورژانسی را بیاموزید.',
    },
    dependsOn: [],
    keywords: ['first aid', 'cpr', 'emergency', 'primeros auxilios', 'کمک‌های اولیه'],
  },

  // ── Tier 2 ──────────────────────────────────────────────────────────────
  {
    id: 'schedule-checkup',
    topic: 'health',
    tier: 2,
    title: {
      en: 'Schedule an Annual Check-up',
      es: 'Programar un chequeo médico anual',
      fa: 'برنامه‌ریزی برای معاینه سالانه',
    },
    description: {
      en: 'Book a preventive care visit with a primary care doctor once a year.',
      es: 'Reserva una visita de atención preventiva con un médico de atención primaria una vez al año.',
      fa: 'یک بار در سال یک ویزیت پیشگیرانه با پزشک عمومی رزرو کنید.',
    },
    dependsOn: ['find-clinic', 'medicaid-basics'],
    keywords: ['check-up', 'checkup', 'annual visit', 'doctor appointment', 'chequeo', 'معاینه'],
  },
  {
    id: 'mental-health-resource',
    topic: 'health',
    tier: 2,
    title: {
      en: 'Find a Mental Health Resource',
      es: 'Encontrar un recurso de salud mental',
      fa: 'پیدا کردن منبع سلامت روان',
    },
    description: {
      en: 'Learn about free or low-cost mental health counseling options in your area.',
      es: 'Conoce las opciones de consejería de salud mental gratuita o de bajo costo en tu área.',
      fa: 'با گزینه‌های مشاوره سلامت روان رایگان یا ارزان در منطقه خود آشنا شوید.',
    },
    dependsOn: ['find-clinic'],
    keywords: ['mental health', 'counseling', 'therapy', 'stress', 'anxiety', 'salud mental', 'سلامت روان'],
  },
  {
    id: 'dental-basics',
    topic: 'health',
    tier: 2,
    title: {
      en: 'Find Dental Care Options',
      es: 'Encontrar opciones de atención dental',
      fa: 'پیدا کردن گزینه‌های مراقبت دندانی',
    },
    description: {
      en: 'Locate a dental clinic or school clinic that offers affordable cleanings and care.',
      es: 'Encuentra una clínica dental o clínica escolar que ofrezca limpiezas y atención asequibles.',
      fa: 'یک کلینیک دندانپزشکی یا کلینیک دانشگاهی با خدمات مقرون‌به‌صرفه پیدا کنید.',
    },
    dependsOn: ['medicaid-basics'],
    keywords: ['dental', 'dentist', 'teeth', 'dental care', 'dentista', 'دندانپزشک'],
  },

  // ── Tier 3 ──────────────────────────────────────────────────────────────
  {
    id: 'health-insurance',
    topic: 'health',
    tier: 3,
    title: {
      en: 'Understand Employer Health Insurance',
      es: 'Entender el seguro de salud del empleador',
      fa: 'درک بیمه درمانی کارفرما',
    },
    description: {
      en: 'Learn how to compare and enroll in employer-sponsored health insurance during open enrollment.',
      es: 'Aprende a comparar e inscribirte en el seguro médico patrocinado por tu empleador durante la inscripción abierta.',
      fa: 'بیاموزید چطور بیمه درمانی کارفرما را مقایسه کرده و در دوره ثبت‌نام باز ثبت‌نام کنید.',
    },
    dependsOn: ['schedule-checkup', 'mental-health-resource'],
    keywords: ['employer insurance', 'open enrollment', 'health benefits', 'seguro del empleador', 'بیمه کارفرما'],
  },
  {
    id: 'prescription-plan',
    topic: 'health',
    tier: 3,
    title: {
      en: 'Get a Prescription Discount Plan',
      es: 'Obtener un plan de descuento de medicamentos',
      fa: 'دریافت طرح تخفیف نسخه',
    },
    description: {
      en: 'Sign up for a free prescription discount card (like GoodRx) to lower medication costs.',
      es: 'Regístrate para una tarjeta de descuento de medicamentos gratuita (como GoodRx) para reducir costos.',
      fa: 'برای یک کارت تخفیف نسخه رایگان (مانند GoodRx) ثبت‌نام کنید تا هزینه دارو را کاهش دهید.',
    },
    dependsOn: ['schedule-checkup', 'dental-basics'],
    keywords: ['prescription', 'medication', 'goodrx', 'discount card', 'medicamento', 'نسخه دارو'],
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// IMMIGRATION TREE
// ─────────────────────────────────────────────────────────────────────────────
const immigrationNodes: MilestoneNode[] = [
  // ── Tier 1 ──────────────────────────────────────────────────────────────
  {
    id: 'know-your-rights',
    topic: 'immigration',
    tier: 1,
    title: {
      en: 'Learn Your Basic Rights',
      es: 'Conocer tus derechos básicos',
      fa: 'آشنایی با حقوق پایه',
    },
    description: {
      en: 'Everyone in the U.S. has certain rights regardless of immigration status. Learn what they are.',
      es: 'Todas las personas en EE. UU. tienen ciertos derechos independientemente de su estatus migratorio.',
      fa: 'همه افراد در آمریکا صرف نظر از وضعیت مهاجرتی حقوق معینی دارند. آن‌ها را بیاموزید.',
    },
    dependsOn: [],
    keywords: ['rights', 'right to remain silent', 'know your rights', 'derechos', 'حقوق'],
  },
  {
    id: 'avoid-notarios',
    topic: 'immigration',
    tier: 1,
    title: {
      en: 'Learn to Avoid Immigration Scams',
      es: 'Aprender a evitar fraudes de inmigración',
      fa: 'آشنایی با کلاهبرداری‌های مهاجرتی',
    },
    description: {
      en: 'Understand the difference between a licensed immigration attorney and a "notario" who is not qualified.',
      es: 'Comprende la diferencia entre un abogado de inmigración con licencia y un "notario" que no está calificado.',
      fa: 'تفاوت بین وکیل مجاز مهاجرت و "نوتاریو" (فاقد صلاحیت) را بشناسید.',
    },
    dependsOn: [],
    keywords: ['notario', 'scam', 'fraud', 'immigration scam', 'estafa', 'کلاهبرداری مهاجرتی'],
  },
  {
    id: 'gather-documents',
    topic: 'immigration',
    tier: 1,
    title: {
      en: 'Gather Your Important Documents',
      es: 'Reunir tus documentos importantes',
      fa: 'جمع‌آوری اسناد مهم',
    },
    description: {
      en: 'Collect and safely store passports, visas, birth certificates, and any immigration papers you have.',
      es: 'Reúne y guarda de forma segura pasaportes, visas, actas de nacimiento y cualquier documento migratorio.',
      fa: 'گذرنامه‌ها، ویزاها، شناسنامه‌ها و هر مدرک مهاجرتی را جمع‌آوری و به‌طور ایمن نگهداری کنید.',
    },
    dependsOn: [],
    keywords: ['documents', 'passport', 'visa', 'birth certificate', 'documentos', 'اسناد', 'مدارک'],
  },

  // ── Tier 2 ──────────────────────────────────────────────────────────────
  {
    id: 'find-legal-aid',
    topic: 'immigration',
    tier: 2,
    title: {
      en: 'Find Free Legal Aid',
      es: 'Encontrar asistencia legal gratuita',
      fa: 'پیدا کردن کمک حقوقی رایگان',
    },
    description: {
      en: 'Locate a nonprofit immigration legal aid organization in your city.',
      es: 'Encuentra una organización de ayuda legal en inmigración sin fines de lucro en tu ciudad.',
      fa: 'یک سازمان کمک حقوقی مهاجرتی غیرانتفاعی در شهر خود پیدا کنید.',
    },
    dependsOn: ['know-your-rights', 'avoid-notarios'],
    keywords: ['legal aid', 'free lawyer', 'nonprofit', 'ayuda legal', 'کمک حقوقی رایگان'],
  },
  {
    id: 'understand-status',
    topic: 'immigration',
    tier: 2,
    title: {
      en: 'Understand Your Current Status',
      es: 'Entender tu estatus migratorio actual',
      fa: 'درک وضعیت مهاجرتی فعلی',
    },
    description: {
      en: 'Work with a legal aid attorney to fully understand your current immigration status and options.',
      es: 'Trabaja con un abogado de ayuda legal para entender tu estatus migratorio actual y tus opciones.',
      fa: 'با یک وکیل کمک حقوقی برای درک کامل وضعیت مهاجرتی و گزینه‌های خود همکاری کنید.',
    },
    dependsOn: ['gather-documents', 'find-legal-aid'],
    keywords: ['immigration status', 'visa status', 'estatus migratorio', 'وضعیت مهاجرتی'],
  },
  {
    id: 'uscis-account',
    topic: 'immigration',
    tier: 2,
    title: {
      en: 'Create a USCIS Online Account',
      es: 'Crear una cuenta en línea de USCIS',
      fa: 'ایجاد حساب آنلاین USCIS',
    },
    description: {
      en: 'Set up a free myUSCIS account to track your case status and receive official updates.',
      es: 'Crea una cuenta gratuita myUSCIS para rastrear el estado de tu caso y recibir actualizaciones oficiales.',
      fa: 'یک حساب رایگان myUSCIS ایجاد کنید تا وضعیت پرونده‌تان را پیگیری کنید.',
    },
    dependsOn: ['gather-documents'],
    keywords: ['uscis', 'myuscis', 'case status', 'online account', 'حساب USCIS'],
  },

  // ── Tier 3 ──────────────────────────────────────────────────────────────
  {
    id: 'asylum-basics',
    topic: 'immigration',
    tier: 3,
    title: {
      en: 'Learn About the Asylum Process',
      es: 'Aprender sobre el proceso de asilo',
      fa: 'آشنایی با فرآیند پناهندگی',
    },
    description: {
      en: 'Understand the affirmative and defensive asylum processes and key deadlines.',
      es: 'Comprende los procesos de asilo afirmativo y defensivo y los plazos clave.',
      fa: 'با فرآیندهای پناهندگی تأییدی و تدافعی و مهلت‌های کلیدی آشنا شوید.',
    },
    dependsOn: ['find-legal-aid', 'understand-status'],
    keywords: ['asylum', 'asylee', 'refugee', 'asilo', 'پناهندگی'],
  },
  {
    id: 'green-card-basics',
    topic: 'immigration',
    tier: 3,
    title: {
      en: 'Learn About Green Card Pathways',
      es: 'Aprender sobre las vías para obtener una tarjeta verde',
      fa: 'آشنایی با مسیرهای کارت سبز',
    },
    description: {
      en: 'Learn the main ways to apply for permanent residence (green card) based on your situation.',
      es: 'Conoce las principales formas de solicitar la residencia permanente (tarjeta verde) según tu situación.',
      fa: 'با راه‌های اصلی درخواست اقامت دائم (کارت سبز) بر اساس وضعیت‌تان آشنا شوید.',
    },
    dependsOn: ['understand-status', 'uscis-account'],
    keywords: ['green card', 'permanent residence', 'lawful permanent resident', 'tarjeta verde', 'کارت سبز'],
  },
  {
    id: 'citizenship-basics',
    topic: 'immigration',
    tier: 3,
    title: {
      en: 'Learn About Naturalization',
      es: 'Aprender sobre la naturalización',
      fa: 'آشنایی با شهروندی',
    },
    description: {
      en: 'Understand the requirements and steps to apply for U.S. citizenship.',
      es: 'Comprende los requisitos y pasos para solicitar la ciudadanía estadounidense.',
      fa: 'با شرایط و مراحل درخواست شهروندی آمریکا آشنا شوید.',
    },
    dependsOn: ['green-card-basics'],
    keywords: ['citizenship', 'naturalization', 'citizen', 'naturalización', 'ciudadanía', 'شهروندی'],
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// Merged export
// ─────────────────────────────────────────────────────────────────────────────
export const ALL_MILESTONES: MilestoneNode[] = [
  ...financeJobsNodes,
  ...healthNodes,
  ...immigrationNodes,
]

/** Returns only the nodes for a given topic, sorted by tier. */
export function getMilestonesByTopic(topic: Topic): MilestoneNode[] {
  return ALL_MILESTONES.filter((n) => n.topic === topic).sort((a, b) => a.tier - b.tier)
}

/**
 * Given a plain-text AI message, return the IDs of any milestone nodes
 * whose keywords appear in the message (case-insensitive).
 */
export function detectMilestonesInText(text: string): string[] {
  const lower = text.toLowerCase()
  return ALL_MILESTONES
    .filter((node) => node.keywords.some((kw) => lower.includes(kw.toLowerCase())))
    .map((node) => node.id)
}
