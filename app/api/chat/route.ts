// ─────────────────────────────────────────────────────────────────────────────
// app/api/chat/route.ts  (Offline PDF-Powered Knowledge Engine)
//
// Powered by the 3 Camino MVP Resource PDFs:
// 1. Financial & Career Toolkit (financialcareertoolkitmvp.pdf)
// 2. Health & Wellness Navigation (healthwellnessnavigationmvp.pdf)
// 3. Immigration & Legal Resource Guide (immigrationresourceguidemvp.pdf)
//
// Runs 100% locally with NO OpenAI API key needed!
// Streams via AI SDK's createUIMessageStreamResponse for genuine streaming UX.
// ─────────────────────────────────────────────────────────────────────────────

import { createUIMessageStream, createUIMessageStreamResponse } from 'ai'
import { isLanguage, type Language, type Situation, type Topic, SITUATIONS, TOPICS } from '@/lib/i18n'

export const runtime = 'nodejs'

// ── PDF Knowledge Base Definition ───────────────────────────────────────────
type KnowledgeEntry = {
  id: string
  topics: Topic[]
  situations?: Situation[]
  keywords: string[]
  responses: Record<Language, string>
}

const PDF_KNOWLEDGE: KnowledgeEntry[] = [
  // ───────────────────────────────────────────────────────────────────────────
  // 1. FINANCIAL & CAREER TOOLKIT (from financialcareertoolkitmvp.pdf)
  // ───────────────────────────────────────────────────────────────────────────
  {
    id: 'banking-credit',
    topics: ['financeJobs'],
    keywords: ['bank', 'checking', 'account', 'credit', 'score', 'itin', 'passport', 'banco', 'cuenta', 'crédito', 'حساب', 'بانک', 'اعتبار'],
    responses: {
      en: `Here is what the Financial & Career Guide recommends for banking and credit:

1. Opening a Bank Account: You do not always need a Social Security Number. Many banks and credit unions accept an ITIN, a valid foreign passport, or a consular ID (Matrícula Consular) to open a checking account.
2. Building Credit from Zero: Start with a "Secured Credit Card." You put down a small deposit (often $200–$500), which becomes your credit limit. Use it for small purchases and pay off the full balance every month to build a strong credit score.
3. Tax Credits for Families: If you work and have children or dependents, look into the Child Tax Credit and Earned Income Tax Credit (EITC), which provide significant refunds.

Next step: Would you like to explore budgeting basics (like the 50/30/20 rule) or how to translate your skills into a resume?`,
      es: `Esto es lo que recomienda la Guía Financiera y de Carrera sobre bancos y crédito:

1. Abrir una cuenta bancaria: No siempre necesitas un Número de Seguro Social. Muchos bancos y cooperativas de crédito aceptan un ITIN, pasaporte extranjero vigente o Matrícula Consular para abrir una cuenta de cheques.
2. Construir crédito desde cero: Comienza con una "Tarjeta de Crédito Garantizada". Depositas un pequeño monto ($200–$500) que se convierte en tu límite. Paga el total cada mes para generar un buen puntaje de crédito.
3. Créditos fiscales familiares: Si trabajas y tienes dependientes, solicita el Crédito Tributario por Hijos y el EITC para reembolsos significativos.

Siguiente paso: ¿Te gustaría ver cómo armar un presupuesto (regla 50/30/20) o cómo redactar tu currículum?`,
      fa: `راهنمای مالی و شغلی درباره بانکداری و اعتبار این نکات کلیدی را توصیه می‌کند:

۱. باز کردن حساب بانکی: همیشه به شماره تأمین اجتماعی (SSN) نیاز ندارید. بسیاری از بانک‌ها و اتحادیه‌های اعتباری با ITIN، پاسپورت معتبر یا مدرک شناسایی کنسولی حساب جاری باز می‌کنند.
۲. ساخت اعتبار از صفر: با یک «کارت اعتباری تضمین‌شده» شروع کنید. یک ودیعه اولیه (مثلاً ۲۰۰ تا ۵۰۰ دلار) می‌گذارید که سقف خرید شما می‌شود. هر ماه کل مبلغ را بپردازید تا امتیاز اعتباری شما رشد کند.
۳. اعتبار مالیاتی برای خانواده‌ها: اگر کار می‌کنید و فرزند یا فرد تحت تکفل دارید، اعتبار مالیاتی کودک (Child Tax Credit) و EITC را بررسی کنید.

گام بعدی: مایلید درباره بودجه‌بندی (قانون ۵۰/۳۰/۲۰) بدانید یا نوشتن رزومه کاری؟`,
    },
  },
  {
    id: 'foster-firstgen-finance',
    topics: ['financeJobs'],
    keywords: ['fafsa', 'grant', 'chafee', 'waiver', 'college', 'tuition', 'budget', '50/30/20', 'student', 'foster', 'beca', 'estudiante', 'دانشجو', 'شهریه', 'کمک هزینه', 'بودجه'],
    responses: {
      en: `According to the toolkit for Students, Foster Youth, and First-Generation navigators:

1. FAFSA & Chafee Grant: Foster youth are often eligible for maximum federal financial aid plus state-specific grants (like the Chafee Grant). Always mark "independent" status on your FAFSA.
2. College Fee Waivers: Ask your college financial aid office about waivers for college application fees, standardized tests (SAT/ACT/GRE), and subsidized internet or laptop programs.
3. Budgeting 101 (The 50/30/20 Rule): Allocate 50% of income for essential needs (rent, groceries, transit), 30% for personal wants, and 20% for savings or paying down debt.

Would you like to look at high-growth entry careers like IT Helpdesk or Phlebotomy that require short training?`,
      es: `Según la guía para Estudiantes, Jóvenes de Crianza y Universitarios de Primera Generación:

1. FAFSA y Beca Chafee: Los jóvenes de crianza a menudo califican para la ayuda federal máxima y becas estatales especiales (como la Beca Chafee). Siempre marca estado "independiente" en FAFSA.
2. Exenciones de tarifas: Pregunta en la oficina de ayuda financiera de tu universidad sobre exenciones para solicitudes, exámenes y programas de internet o laptops.
3. Presupuesto 101 (Regla 50/30/20): Destina el 50% a necesidades básicas (renta, comida), 30% a gastos personales y 20% a ahorros o pagar deudas.

¿Te gustaría explorar empleos de alta demanda con capacitación corta como Soporte de TI o Flebotomía?`,
      fa: `بر اساس راهنما برای دانشجویان، جوانان تحت سرپرستی و نسل اول دانشگاه:

۱. FAFSA و گرنت Chafee: جوانان تحت سرپرستی اغلب واجد شرایط حداکثر کمک مالی فدرال و گرنت‌های ایالتی ویژه هستند. همیشه در FAFSA گزینه وضعیت "مستقل" را علامت بزنید.
۲. معافیت از هزینه‌ها: از دفتر کمک مالی دانشگاه درباره معافیت از هزینه درخواست‌ها، آزمون‌ها و اینترنت یا لپ‌تاپ بپرسید.
۳. بودجه‌بندی ۱۰۱ (قانون ۵۰/۳۰/۲۰): ۵۰٪ درآمد برای نیازهای ضروری (اجاره، خوراک)، ۳۰٪ برای موارد دلخواه، و ۲۰٪ برای پس‌انداز یا بازپرداخت بدهی.

مایلید مشاغل با رشد سریع مثل پشتیبانی شبکه (IT Helpdesk) یا نمونه‌گیری خون (Phlebotomy) را بررسی کنیم؟`,
    },
  },
  {
    id: 'informal-skills-resume',
    topics: ['financeJobs'],
    keywords: ['resume', 'cv', 'skills', 'job', 'work', 'phlebotomy', 'it helpdesk', 'comptia', 'career', 'currículum', 'empleo', 'trabajo', 'رزومه', 'شغل', 'کار', 'مهارت'],
    responses: {
      en: `Here is how the guide helps you turn informal life experience into a powerful resume:

1. Translating Informal Work:
   • Managed a family shop or informal trade? Put "Operations Manager" (skills: logistics, cash handling, inventory management).
   • Navigated complex immigration or relief systems? Highlight "Crisis Management and Negotiation."
   • Cared for family or managed household expenses? List "Budgeting, Time Management, and Care Coordination."
2. High-Growth Entry Roles (Fast Certifications):
   • Phlebotomy Technician: Under 3–6 months of training, reliable clinical job.
   • IT Helpdesk (CompTIA A+): Practical technical certification leading to immediate office or remote IT jobs.
   • Project Coordination: High demand for organized, bilingual communicators.

Next step: Would you like help outlining bullet points for your draft resume?`,
      es: `Así es cómo la guía te ayuda a convertir tu experiencia de vida informal en un currículum sólido:

1. Traducir experiencia informal:
   • ¿Manejaste un negocio familiar o comercio informal? Titúlalo "Gerente de Operaciones" (logística, manejo de efectivo, inventario).
   • ¿Navegaste sistemas migratorios o de ayuda complejos? Destaca "Manejo de Crisis y Negociación".
2. Empleos de entrada de alto crecimiento (certificados cortos):
   • Técnico de Flebotomía: Capacitación de 3 a 6 meses en el sector salud.
   • Soporte de TI (CompTIA A+): Certificación técnica práctica para puestos de tecnología inmediatos.
   • Coordinación de Proyectos: Gran oportunidad para personas organizadas y bilingües.

Siguiente paso: ¿Quieres que redactemos los puntos clave para tu primer borrador de currículum?`,
      fa: `راهنما نحوه تبدیل تجربیات غیررسمی به یک رزومه حرفه‌ای را این‌گونه توضیح می‌دهد:

۱. ترجمه مهارت‌های غیررسمی:
   • اگر کسب‌وکار خانوادگی را اداره کرده‌اید: عنوان «مدیر عملیات» را بنویسید (مهارت‌ها: لجستیک، مدیریت صندوق، مدیریت موجودی).
   • اگر مسیرهای پیچیده مهاجرتی یا حمایتی را طی کرده‌اید: «مدیریت بحران و مذاکره» را برجسته کنید.
۲. مشاغل پرتقاضا با مدارک کوتاه‌مدت:
   • تکنسین خون‌گیری (Phlebotomy): دوره ۳ تا ۶ ماهه با بازار کار مطمئن در مراکز درمانی.
   • پشتیبانی فناوری اطلاعات (CompTIA A+): مدرک فنی کاربردی برای کار فوری در بخش IT.
   • هماهنگ‌کننده پروژه (Project Coordinator): فرصت عالی برای افراد منظم و چندزبانه.

گام بعدی: مایلید به پیش‌نویس رزومه شما کمک کنم؟`,
    },
  },

  // ───────────────────────────────────────────────────────────────────────────
  // 2. HEALTH & WELLNESS NAVIGATION (from healthwellnessnavigationmvp.pdf)
  // ───────────────────────────────────────────────────────────────────────────
  {
    id: 'fqhc-emergency-medicaid',
    topics: ['health'],
    keywords: ['clinic', 'fqhc', 'medicaid', 'emergency', 'doctor', 'rma', 'hospital', 'clínica', 'salud', 'médico', 'کلینیک', 'پزشک', 'بیمه', 'درمان', 'اورژانس'],
    responses: {
      en: `From the Health & Wellness Navigation guide on accessing medical care:

1. Community Health Centers (FQHCs): Federally Qualified Health Centers provide doctors, dentistry, and prescriptions on a sliding scale based on your income. They welcome everyone regardless of immigration status or insurance.
2. Emergency Medicaid: In life-threatening emergencies, hospitals must treat you by law regardless of status. Emergency Medicaid can often be applied to retroactively cover those hospital costs.
3. Refugee Medical Assistance (RMA): Refugees and granted asylees are typically eligible for short-term health coverage immediately upon arrival.
4. Preventative Care: Most health plans cover 100% of preventative checkups and routine vaccines with zero copay.

Would you like to know about mental health counseling resources or child coverage through CHIP?`,
      es: `De la Guía de Salud y Bienestar sobre acceso a atención médica:

1. Centros de Salud Comunitarios (FQHCs): Ofrecen atención médica, dental y farmacia en una escala de tarifas según tus ingresos, sin importar estatus migratorio ni seguro.
2. Medicaid de Emergencia: En emergencias que ponen en riesgo la vida, los hospitales deben atenderte por ley. Medicaid de Emergencia puede cubrir retroactivamente esos costos.
3. Asistencia Médica para Refugiados (RMA): Los refugiados y asilados tienen cobertura médica a corto plazo inmediatamente al llegar.
4. Atención Preventiva: La mayoría de los seguros cubren vacunas y chequeos anuales al 100% sin copago.

¿Te gustaría saber sobre apoyo de salud mental o cobertura para niños con CHIP?`,
      fa: `بر اساس راهنمای سلامت و درمان درباره دسترسی به خدمات پزشکی:

۱. مراکز بهداشت اجتماعی (FQHCs): این مراکز خدمات پزشک عمومی، دندانپزشکی و دارو را با هزینه متناسب با درآمد شما ارائه می‌دهند و وضعیت اقامت یا بیمه شما مانع درمان نیست.
۲. مدیکید اورژانس (Emergency Medicaid): در شرایط اضطراری تهدیدکننده حیات، بیمارستان‌ها طبق قانون موظف به پذیرش شما هستند و این برنامه می‌تواند هزینه‌ها را پوشش دهد.
۳. کمک پزشکی پناهندگان (RMA): پناهندگان و افراد دارای پناهندگی پذیرفته‌شده بلافاصله پس از ورود واجد شرایط بیمه درمانی کوتاه‌مدت هستند.
۴. مراقبت‌های پیشگیرانه: اکثر بیمه‌ها چکاپ سالانه و واکسن‌ها را ۱۰۰٪ رایگان پوشش می‌دهند.

مایلید درباره منابع سلامت روان یا پوشش فرزندان با CHIP صحبت کنیم؟`,
    },
  },
  {
    id: 'mental-health-chip',
    topics: ['health'],
    keywords: ['mental', 'chip', 'trauma', 'counseling', 'therapy', 'stress', 'caps', 'ship', 'parent', 'salud mental', 'terapia', 'سلامت روان', 'مشاوره', 'استرس', 'کودک'],
    responses: {
      en: `According to the Health & Wellness Guide regarding insurance, mental health, and campus wellness:

1. Medicaid & CHIP for Kids: Children are often eligible for the Children's Health Insurance Program (CHIP) even if their parents are not eligible. Foster youth are generally eligible for full Medicaid until age 26.
2. Trauma-Informed Care: When looking for a counselor or therapist, ask if they practice "Trauma-Informed Care." This ensures they understand the unique stressors of migration, family separation, or displacement.
3. Campus Health & Free Counseling:
   • Most colleges provide 6–10 free therapy sessions per semester through Counseling & Psychological Services (CAPS).
   • If you qualify for Medicaid, you can often waive the costly mandatory university health insurance fee (SHIP).
4. Crisis Support: Dial or text 988 anytime for free, confidential 24/7 mental health crisis support.

Would you like to mark your health navigation steps on your Life Map?`,
      es: `Según la Guía de Salud respecto a seguros, salud mental y bienestar estudiantil:

1. Medicaid y CHIP para hijos: Los menores a menudo califican para CHIP incluso si los padres no son elegibles. Los jóvenes de crianza tienen cobertura de Medicaid hasta los 26 años.
2. Atención informada sobre el trauma: Al buscar terapeuta, pregunta si practican "Atención Informada sobre el Trauma", ideal para quienes han vivido migración o desplazamientos.
3. Salud en el campus y terapia gratis:
   • La mayoría de las universidades ofrecen de 6 a 10 sesiones de terapia gratuitas por semestre (CAPS).
   • Si calificas para Medicaid, puedes solicitar la exención del seguro médico universitario obligatorio (SHIP) y ahorrarte ese costo.
4. Apoyo de crisis: Llama o envía mensaje al 988 en cualquier momento (gratis y confidencial 24/7).

¿Quieres que marquemos estos pasos de salud en tu Mapa de Vida?`,
      fa: `بر اساس راهنمای سلامت درباره بیمه، سلامت روان و دانشگاه:

۱. پوشش CHIP و Medicaid برای کودکان: فرزندان اغلب واجد شرایط برنامه بیمه سلامت کودکان (CHIP) هستند حتی اگر والدین واجد شرایط نباشند. جوانان تحت سرپرستی نیز تا سن ۲۶ سالگی تحت پوشش Medicaid هستند.
۲. مشاوره متناسب با تروما (Trauma-Informed Care): هنگام انتخاب مشاور یا روانشناس بپرسید آیا با رویکرد تروما کار می‌کنند تا شرایط مهاجرت و جابجایی را درک کنند.
۳. خدمات سلامت و مشاوره دانشگاهی:
   • دانشگاه‌ها معمولاً ۶ تا ۱۰ جلسه مشاوره رایگان در هر ترم (CAPS) ارائه می‌دهند.
   • اگر Medicaid دارید، می‌توانید هزینه بیمه اجباری دانشگاه (SHIP) را لغو (Waive) کنید.
۴. خط بحران: تماس یا پیامک با ۹۸۸ در هر ساعت از شبانه‌روز رایگان و محرمانه است.

مایلید مراحل سلامت خود را در نقشه زندگی علامت بزنید؟`,
    },
  },

  // ───────────────────────────────────────────────────────────────────────────
  // 3. IMMIGRATION & LEGAL RESOURCE GUIDE (from immigrationresourceguidemvp.pdf)
  // ───────────────────────────────────────────────────────────────────────────
  {
    id: 'refugee-work-ead-greencard',
    topics: ['immigration'],
    keywords: ['ead', 'work authorization', 'i-765', 'green card', 'travel', 'refugee', 'asylee', 'permiso de trabajo', 'tarjeta verde', 'پناهنده', 'مجوز کار', 'کارت سبز', 'سفر'],
    responses: {
      en: `From the Immigration & Legal Guide for Refugees & Asylees:

1. Immediate Work Authorization: Once granted asylum or refugee status, you are authorized to work in the U.S. immediately.
2. Employment Authorization Document (EAD - Form I-765): While you can work immediately, filing for an official EAD card gives you a standard photo ID that employers easily recognize.
3. Pathway to Green Card (Lawful Permanent Residence): You are required to apply for your Green Card (Form I-485) exactly 1 year after being granted asylum or admitted as a refugee.
4. Travel Precautions: Do NOT travel back to your country of origin, as it can permanently jeopardize your status. If international travel is necessary, obtain an official Refugee Travel Document prior to departure.

Would you like to know how to find free legal aid or learn about your constitutional rights?`,
      es: `De la Guía Legal y de Inmigración para Refugiados y Asilados:

1. Autorización de trabajo inmediata: Una vez concedido el asilo o estatus de refugiado, estás autorizado para trabajar legalmente de inmediato.
2. Documento de Autorización de Empleo (EAD - Formulario I-765): Tramitar esta tarjeta te da una identificación oficial con foto que los empleadores reconocen al instante.
3. Camino a la Tarjeta Verde (Residencia Permanente): Debes solicitar tu Tarjeta Verde exactamente 1 año después de obtener el asilo o ingresar como refugiado.
4. Advertencia de viaje: NO viajes a tu país de origen, pues pone en riesgo tu estatus. Si necesitas viajar internacionalmente, tramita un Documento de Viaje de Refugiado antes de salir.

¿Te gustaría saber cómo encontrar asistencia legal gratuita o conocer tus derechos constitucionales?`,
      fa: `بر اساس راهنمای حقوقی و مهاجرتی برای پناهندگان و افراد دارای پناهندگی:

۱. مجوز کار فوری: به محض پذیرش پناهندگی یا ورود به عنوان پناهنده، شما قانوناً مجاز به کار فوری در آمریکا هستید.
۲. کارت مجوز کار (EAD - فرم I-765): با اینکه مجاز به کار هستید، دریافت کارت فیزیکی EAD به عنوان مدرک شناسایی عکس‌دار کارفرمایان را مطمئن می‌سازد.
۳. مسیر کارت سبز (اقامت دائم): موظف هستید دقیقاً ۱ سال پس از پذیرش پناهندگی، برای کارت سبز خود اقدام کنید.
۴. هشدار سفر: هرگز به کشور مبدا خود سفر نکنید زیرا وضعیت پناهندگی شما را با خطر مواجه می‌کند. برای سفرهای خارجی دیگر باید «سند سفر پناهندگی» دریافت کنید.

مایلید درباره کمک حقوقی رایگان یا حقوق اساسی خود بیشتر بدانید؟`,
    },
  },
  {
    id: 'rights-notarios-itin',
    topics: ['immigration'],
    keywords: ['rights', 'notario', 'itin', 'silent', 'warrant', 'ice', 'lawyer', 'legal aid', 'derechos', 'abogado', 'حقوق', 'وکیل', 'سکوت', 'بازرسی'],
    responses: {
      en: `According to the Immigration & Legal Guide regarding rights and safe navigation:

1. Right to Remain Silent: Everyone in the United States has basic constitutional protections. You have the right to remain silent and do not have to answer questions regarding your immigration status.
2. Home Searches: You have the right to refuse entry into your home unless officers slide a valid search warrant signed by a judge under the door.
3. Avoid Notarios & Scams: In the U.S., a "notario" is NOT a licensed attorney. Never pay a notario for legal advice or form submissions. Seek accredited representatives recognized by the Department of Justice (DOJ) or nonprofit legal aid clinics.
4. ITIN (Individual Taxpayer Identification Number): If you do not have an SSN, you can get an ITIN to pay taxes and open certain bank accounts.

Would you like to know about student visas (F-1/OPT/CPT) or Dreamer Centers on campus?`,
      es: `Según la Guía Legal de Inmigración sobre tus derechos y protección:

1. Derecho a guardar silencio: Todas las personas en EE. UU. tienen derechos constitucionales básicos. Puedes guardar silencio y no tienes que responder sobre tu estatus migratorio.
2. Búsqueda en tu hogar: Tienes derecho a negar la entrada si los agentes no presentan una orden judicial válida firmada por un juez.
3. Cuidado con los "Notarios": En EE. UU., un notario NO es abogado. Nunca pagues a un notario por trámites migratorios. Acude a representantes acreditados por el Departamento de Justicia (DOJ) o clínicas legales comunitarias.
4. Número ITIN: Si no tienes Seguro Social, puedes obtener un ITIN para pagar impuestos y abrir cuentas bancarias.

¿Te gustaría saber sobre visas de estudiante (F-1, CPT, OPT) o centros para Dreamers?`,
      fa: `بر اساس راهنمای حقوقی مهاجرت درباره حقوق بنیادین و محافظت قانونی:

۱. حق سکوت: همه افراد حاضر در خاک آمریکا دارای حقوق قانون اساسی هستند. شما حق دارید سکوت کنید و ملزم به پاسخ دادن درباره وضعیت اقامت خود نیستید.
۲. ورود به خانه: حق دارید اجازه ورود ندهید مگر آنکه ماموران حکم بازرسی معتبر امضاشده توسط قاضی را نشان دهند.
۳. پرهیز از نوتاریوها: در آمریکا «نوتاریو» وکیل دادگستری نیست. هرگز برای امور حقوقی به نوتاریوها پول نپردازید و تنها به وکلای خیریه یا نمایندگان تأییدشده وزارت دادگستری (DOJ) مراجعه کنید.
۴. شماره ITIN: اگر شماره تأمین اجتماعی ندارید، با شماره مالیاتی ITIN می‌توانید مالیات بپردازید و در برخی بانک‌ها حساب باز کنید.

مایلید درباره ویزاهای دانشجویی (F-1 / OPT / CPT) یا مراکز حمایت از دانشجویان (Dreamer Centers) بپرسید؟`,
    },
  },
  {
    id: 'student-visas-daca',
    topics: ['immigration'],
    keywords: ['f-1', 'visa', 'cpt', 'opt', 'daca', 'dreamer', 'undocumented', 'student', 'estudiante', 'دانشجو', 'ویزا', 'کار دانشجویی'],
    responses: {
      en: `From the Legal Guide for International & First-Gen Students:

1. F-1 Visa Maintenance: Maintain full-time enrollment each term to keep legal status active. F-1 students are generally permitted to work on-campus up to 20 hours per week during the school year.
2. CPT vs. OPT:
   • CPT (Curricular Practical Training): Allows authorization for internships or off-campus jobs directly related to your major while you are still a student.
   • OPT (Optional Practical Training): Provides 12 months (or up to 36 months for STEM majors) of full-time work authorization post-graduation.
3. DACA & Undocumented Students: Look for "Dreamer Centers" or undocumented student services on campus. Many states allow in-state tuition rates regardless of federal status.

Would you like to review how these steps connect on your visual Life Map?`,
      es: `De la Guía Legal para Estudiantes Internacionales y de Primera Generación:

1. Mantener la Visa F-1: Inscríbete a tiempo completo cada semestre para conservar tu estatus. Puedes trabajar dentro del campus hasta 20 horas por semana durante clases.
2. Diferencia entre CPT y OPT:
   • CPT: Permite pasantías y prácticas vinculadas a tu carrera mientras estudias.
   • OPT: Otorga 12 meses (hasta 36 meses para carreras STEM) de empleo a tiempo completo después de graduarte.
3. DACA y Estudiantes Indocumentados: Busca los "Dreamer Centers" en tu campus. Varios estados otorgan tarifas de matrícula estatal residente sin importar el estatus federal.

¿Te gustaría revisar cómo se conectan estos pasos en tu Mapa de Vida?`,
      fa: `از راهنمای حقوقی برای دانشجویان بین‌المللی و نسل اول:

۱. حفظ ویزای F-1: برای حفظ ویزا، ثبت‌نام تمام‌وقت در هر ترم الزامی است. دانشجویان F-1 می‌توانند تا ۲۰ ساعت در هفته در داخل دانشگاه کار کنند.
۲. تفاوت CPT و OPT:
   • CPT: مجوز کارآموزی یا کار خارج از دانشگاه مرتبط با رشته در حین تحصیل.
   • OPT: مجوز کار تمام‌وقت به مدت ۱۲ ماه (تا ۳۶ ماه برای رشته‌های STEM) پس از فارغ‌التحصیلی.
۳. دانشجویان DACA و بدون مدرک اقامتی: مراکز Dreamer Centers در دانشگاه‌ها خدمات حمایتی و شهریه درون‌ایالتی ارائه می‌دهند.

مایلید ببینید این مراحل چگونه در نقشه زندگی شما ثبت می‌شوند؟`,
    },
  },
]

// ── Fallback responses per topic ─────────────────────────────────────────────
const TOPIC_FALLBACKS: Record<Topic, Record<Language, string>> = {
  financeJobs: {
    en: `Welcome to the Financial & Career guidance module! Here are key areas from our toolkit:

1. Banking & Credit: You can open accounts with an ITIN or passport, and build credit with a secured card.
2. Education & Grants: Foster youth and first-gen students can access FAFSA, Chafee Grants, and campus fee waivers.
3. Translating Skills: Turn informal experience into professional resume bullet points, and explore high-growth entry roles like Phlebotomy or IT Helpdesk.

What would you like to explore first — banking, credit, budgeting, or resume building?`,
    es: `¡Bienvenido al módulo Financiero y Laboral! Puntos clave de nuestra guía:

1. Banca y Crédito: Abre cuentas con ITIN o pasaporte y construye crédito con tarjetas garantizadas.
2. Becas y Universidad: Accede a FAFSA, Becas Chafee y exenciones de matrícula para estudiantes.
3. Traducir Habilidades: Convierte experiencia informal en un currículum profesional y explora puestos como Soporte de TI o Flebotomía.

¿Qué te gustaría ver primero — cuentas bancarias, crédito, presupuesto o currículum?`,
    fa: `به بخش مالی و شغلی کامینو خوش آمدید! نکات اصلی راهنمای ما:

۱. بانک و اعتبار: با ITIN یا پاسپورت حساب باز کنید و با کارت تضمین‌شده سابقه اعتباری بسازید.
۲. کمک‌های تحصیلی: دانشجویان می‌توانند از FAFSA، گرنت Chafee و معافیت‌های شهریه استفاده کنند.
۳. مهارت‌ها و رزومه: تجربیات زندگی را به زبان رزومه تبدیل کنید و مشاغل با آموزش کوتاه مثل IT Helpdesk یا نمونه‌گیری خون را بررسی کنید.

کدام موضوع را ترجیح می‌دهید — حساب بانکی، اعتبار، بودجه‌بندی یا رزومه؟`,
  },
  health: {
    en: `Welcome to the Health & Wellness Navigation module! Here are the core resources:

1. Community Clinics (FQHCs): Affordable medical, dental, and prescription services on a sliding fee scale.
2. Emergency & Coverage: Emergency Medicaid covers life-threatening hospital care; CHIP covers kids.
3. Mental Health & Campus: Access Trauma-Informed counseling, 6–10 free therapy sessions at college (CAPS), or call/text 988.

Would you like to learn more about finding a local clinic, Medicaid qualifications, or mental health resources?`,
    es: `¡Bienvenido al módulo de Navegación de Salud! Recursos esenciales:

1. Clínicas Comunitarias (FQHCs): Servicios médicos y dentales a bajo costo según tus ingresos.
2. Cobertura de Emergencia: Medicaid de Emergencia para hospitales y CHIP para niños.
3. Salud Mental: Consejería informada sobre trauma, sesiones gratuitas en la universidad (CAPS) o el 988.

¿Deseas saber más sobre clínicas locales, requisitos de Medicaid o apoyo de salud mental?`,
    fa: `به بخش سلامت و درمان کامینو خوش آمدید! منابع اساسی:

۱. کلینیک‌های اجتماعی (FQHCs): خدمات پزشکی و دندانپزشکی ارزان با مقیاس متناسب با درآمد.
۲. پوشش اورژانس: مدیکید اورژانس برای هزینه‌های بیمارستان و برنامه CHIP برای کودکان.
۳. سلامت روان: مشاوره‌های متناسب با تروما، جلسات درمانی رایگان دانشگاه (CAPS) یا تماس با ۹۸۸.

می‌خواهید درباره یافتن کلینیک، شرایط مدیکید یا منابع سلامت روان بیشتر بدانید؟`,
  },
  immigration: {
    en: `Welcome to the Immigration & Legal Resource module! Highlights from the legal guide:

1. Know Your Rights: You have the right to remain silent and refuse entry without a judge's warrant.
2. Refugee & Asylee Rights: Immediate work authorization, EAD cards, and a pathway to a Green Card in 1 year.
3. Beware of Scams: Avoid "notarios." Only use DOJ-accredited legal aid or licensed attorneys.
4. Student Visas: F-1 requirements, CPT internships, and OPT work authorization.

What question can I help you answer first?`,
    es: `¡Bienvenido al módulo de Recursos Legales y de Inmigración! Puntos destacados:

1. Conoce tus derechos: Derecho a guardar silencio y exigir orden judicial antes de abrir tu puerta.
2. Refugiados y Asilados: Permiso de trabajo inmediato y solicitud de Tarjeta Verde al año.
3. Evita estafas: No uses "notarios". Consulta a representantes acreditados por el DOJ.
4. Visas de Estudiante: Reglas de F-1, prácticas CPT y permisos OPT.

¿Con qué tema empezamos hoy?`,
    fa: `به بخش راهنمای حقوقی و مهاجرتی کامینو خوش آمدید! گزیده‌ای از راهنما:

۱. آشنایی با حقوق: حق سکوت و ممانعت از بازرسی بدون حکم امضاشده قاضی.
۲. حقوق پناهندگان: مجوز کار فوری، دریافت کارت EAD و درخواست کارت سبز پس از ۱ سال.
۳. پیشگیری از کلاهبرداری: از مراجعه به نوتاریوها خودداری کنید و از وکلای معتبر DOJ استفاده نمایید.
۴. ویزای دانشجویی: مقررات F-1، دوره‌های کارآموزی CPT و مجوز کار OPT.

کدام مبحث را مایلید ابتدا بررسی کنیم؟`,
  },
}

// ── Match response ───────────────────────────────────────────────────────────
function findPdfResponse(text: string, language: Language, chosenTopic: Topic | null): string {
  const lower = text.toLowerCase()

  // First check specific entries
  for (const entry of PDF_KNOWLEDGE) {
    if (chosenTopic && !entry.topics.includes(chosenTopic)) continue
    if (entry.keywords.some((kw) => lower.includes(kw.toLowerCase()))) {
      return entry.responses[language]
    }
  }

  // Next check all entries regardless of topic
  for (const entry of PDF_KNOWLEDGE) {
    if (entry.keywords.some((kw) => lower.includes(kw.toLowerCase()))) {
      return entry.responses[language]
    }
  }

  // Topic fallback
  if (chosenTopic && TOPIC_FALLBACKS[chosenTopic]) {
    return TOPIC_FALLBACKS[chosenTopic][language]
  }

  return TOPIC_FALLBACKS.financeJobs[language]
}

// ── Route handler ─────────────────────────────────────────────────────────────
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const language: Language = isLanguage(body.language) ? body.language : 'en'
    const topic: Topic | null =
      typeof body.topic === 'string' && (TOPICS as readonly string[]).includes(body.topic)
        ? (body.topic as Topic)
        : null

    const messages = Array.isArray(body.messages) ? body.messages : []
    const lastUserMsg = [...messages].reverse().find((m) => m.role === 'user')
    const userText =
      lastUserMsg?.parts?.map((p: any) => (p.type === 'text' ? p.text ?? '' : '')).join('') ??
      lastUserMsg?.content ??
      ''

    const responseText = findPdfResponse(userText, language, topic)

    // Stream using AI SDK's createUIMessageStream so @ai-sdk/react renders seamlessly
    const stream = createUIMessageStream({
      execute({ writer }) {
        writer.write({ type: 'start-step' })
        writer.write({ type: 'text-start', id: 'resp-part' })

        // Stream word by word
        const words = responseText.split(' ')
        for (let i = 0; i < words.length; i++) {
          const chunk = (i === 0 ? '' : ' ') + words[i]
          writer.write({ type: 'text-delta', id: 'resp-part', delta: chunk })
        }

        writer.write({ type: 'text-end', id: 'resp-part' })
        writer.write({ type: 'finish-step' })
        writer.write({ type: 'finish' })
      },
    })

    return createUIMessageStreamResponse({ stream })
  } catch (err) {
    console.error('[Camino Local PDF Engine error]:', err)
    return new Response(JSON.stringify({ error: 'Internal Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
