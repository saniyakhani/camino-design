export const LANGUAGES = ['en', 'es', 'fa'] as const
export type Language = (typeof LANGUAGES)[number]

export const SITUATIONS = [
  'student',
  'immigrant',
  'asylee',
  'refugee',
  'parent',
  'fosterYouth',
  'firstGen',
  'graduate',
] as const
export type Situation = (typeof SITUATIONS)[number]

export const TOPICS = ['immigration', 'financeJobs', 'health'] as const
export type Topic = (typeof TOPICS)[number]

type Dictionary = {
  languageName: string
  brand: string
  tagline: string
  intro: string
  chatTitle: string
  chatSubtitle: string
  askName: string
  greetName: (name: string) => string
  askSituation: string
  situationHint: string
  askTopic: string
  topicHint: string
  topicRetry: string
  continueLabel: string
  placeholder: string
  send: string
  restart: string
  thinking: string
  error: string
  disclaimer: string
  situations: Record<Situation, string>
  topicLetters: Record<Topic, string>
  topics: Record<Topic, string>
}

export const dictionary: Record<Language, Dictionary> = {
  en: {
    languageName: 'English',
    brand: 'Camino',
    tagline: 'A calm place to plan your next steps.',
    intro:
      'Ask about immigration, work, money, or health. Answers are in plain language, in English, Spanish, or Farsi.',
    chatTitle: 'Your planning guide',
    chatSubtitle: 'Private. No account needed.',
    askName: "Hello, what's your name?",
    greetName: (name) => `Nice to meet you, ${name}.`,
    askSituation: 'What is your current life situation?',
    situationHint: 'Choose all that apply, then continue.',
    askTopic: 'What would you like help with?',
    topicHint: 'Tap an option or type A, B, or C.',
    topicRetry: 'Please choose A, B, or C.',
    continueLabel: 'Continue',
    placeholder: 'Type your message…',
    send: 'Send',
    restart: 'Start over',
    thinking: 'Thinking…',
    error: 'Something went wrong. Please try again.',
    disclaimer:
      'General information only, not legal or medical advice. In an emergency, call 911.',
    situations: {
      student: 'Student',
      immigrant: 'Immigrant',
      asylee: 'Asylee',
      refugee: 'Refugee',
      parent: 'Parent',
      fosterYouth: 'Foster youth',
      firstGen: 'First-generation student',
      graduate: 'Graduate',
    },
    topicLetters: { immigration: 'A', financeJobs: 'B', health: 'C' },
    topics: {
      immigration: 'For immigration information',
      financeJobs: 'For finance and job information',
      health: 'For health information',
    },
  },
  es: {
    languageName: 'Español',
    brand: 'Camino',
    tagline: 'Un lugar tranquilo para planear tus próximos pasos.',
    intro:
      'Pregunta sobre inmigración, trabajo, dinero o salud. Respuestas claras en inglés, español o farsi.',
    chatTitle: 'Tu guía de planificación',
    chatSubtitle: 'Privado. No necesitas una cuenta.',
    askName: 'Hola, ¿cómo te llamas?',
    greetName: (name) => `Mucho gusto, ${name}.`,
    askSituation: '¿Cuál es tu situación de vida actual?',
    situationHint: 'Elige todas las que apliquen y continúa.',
    askTopic: '¿Con qué te gustaría recibir ayuda?',
    topicHint: 'Toca una opción o escribe A, B o C.',
    topicRetry: 'Por favor elige A, B o C.',
    continueLabel: 'Continuar',
    placeholder: 'Escribe tu mensaje…',
    send: 'Enviar',
    restart: 'Empezar de nuevo',
    thinking: 'Pensando…',
    error: 'Algo salió mal. Inténtalo de nuevo.',
    disclaimer:
      'Solo información general, no es asesoría legal ni médica. En una emergencia, llama al 911.',
    situations: {
      student: 'Estudiante',
      immigrant: 'Inmigrante',
      asylee: 'Asilado/a',
      refugee: 'Refugiado/a',
      parent: 'Padre o madre',
      fosterYouth: 'Joven en cuidado de crianza',
      firstGen: 'Estudiante de primera generación',
      graduate: 'Graduado/a',
    },
    topicLetters: { immigration: 'A', financeJobs: 'B', health: 'C' },
    topics: {
      immigration: 'Información sobre inmigración',
      financeJobs: 'Información sobre finanzas y empleo',
      health: 'Información sobre salud',
    },
  },
  fa: {
    languageName: 'فارسی',
    brand: 'کامینو',
    tagline: 'جایی آرام برای برنامه‌ریزی قدم‌های بعدی شما.',
    intro:
      'درباره مهاجرت، کار، امور مالی یا سلامت بپرسید. پاسخ‌ها به زبان ساده، به انگلیسی، اسپانیایی یا فارسی.',
    chatTitle: 'راهنمای برنامه‌ریزی شما',
    chatSubtitle: 'خصوصی. بدون نیاز به حساب کاربری.',
    askName: 'سلام، اسم شما چیست؟',
    greetName: (name) => `از آشنایی با شما خوشحالم، ${name}.`,
    askSituation: 'وضعیت فعلی زندگی شما چیست؟',
    situationHint: 'همه موارد مربوط را انتخاب کنید و ادامه دهید.',
    askTopic: 'در چه زمینه‌ای به کمک نیاز دارید؟',
    topicHint: 'یک گزینه را انتخاب کنید یا الف، ب یا ج را بنویسید.',
    topicRetry: 'لطفاً الف، ب یا ج را انتخاب کنید.',
    continueLabel: 'ادامه',
    placeholder: 'پیام خود را بنویسید…',
    send: 'ارسال',
    restart: 'شروع دوباره',
    thinking: 'در حال فکر کردن…',
    error: 'مشکلی پیش آمد. لطفاً دوباره تلاش کنید.',
    disclaimer:
      'فقط اطلاعات عمومی است و مشاوره حقوقی یا پزشکی نیست. در شرایط اضطراری با ۹۱۱ تماس بگیرید.',
    situations: {
      student: 'دانشجو',
      immigrant: 'مهاجر',
      asylee: 'دارای پناهندگی (پناه‌جوی پذیرفته‌شده)',
      refugee: 'پناهنده',
      parent: 'والد',
      fosterYouth: 'نوجوان تحت سرپرستی',
      firstGen: 'دانشجوی نسل اول',
      graduate: 'فارغ‌التحصیل',
    },
    topicLetters: { immigration: 'الف', financeJobs: 'ب', health: 'ج' },
    topics: {
      immigration: 'اطلاعات مهاجرت',
      financeJobs: 'اطلاعات مالی و شغلی',
      health: 'اطلاعات سلامت',
    },
  },
}

const topicAliases: Record<Topic, string[]> = {
  immigration: ['a', '1', 'الف', 'ا', '۱'],
  financeJobs: ['b', '2', 'ب', '۲'],
  health: ['c', '3', 'ج', '۳'],
}

export function parseTopic(input: string): Topic | null {
  const normalized = input.trim().toLowerCase().replace(/[.)\s]+$/g, '')
  for (const topic of TOPICS) {
    if (topicAliases[topic].includes(normalized)) return topic
  }
  return null
}

export function isLanguage(value: unknown): value is Language {
  return typeof value === 'string' && (LANGUAGES as readonly string[]).includes(value)
}
