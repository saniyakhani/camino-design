// ─────────────────────────────────────────────────────────────────────────────
// components/pdf/life-map-document.tsx
//
// React-PDF document template. Renders entirely client-side — no server
// round-trip needed, so it works fully offline after the first page load.
//
// Supports EN / ES / FA. Farsi pages use direction:'rtl' + a registered
// Unicode font so Persian text renders correctly in the PDF.
// ─────────────────────────────────────────────────────────────────────────────

import {
  Document,
  Font,
  Page,
  StyleSheet,
  Text,
  View,
} from '@react-pdf/renderer'
import { type Language } from '@/lib/i18n'
import { type MilestoneWithStatus } from '@/hooks/use-milestones'
import { type Topic } from '@/lib/milestones'

// ── Font registration ─────────────────────────────────────────────────────
// Noto Sans covers Latin, Cyrillic, Greek, Arabic/Persian glyphs.
// Loaded once; react-pdf caches it after the first download.
Font.register({
  family: 'NotoSans',
  fonts: [
    {
      src: 'https://fonts.gstatic.com/s/notosans/v36/o-0NIpQlx3QUlC5A4PNjXhFlY9aA5W0.ttf',
      fontWeight: 400,
    },
    {
      src: 'https://fonts.gstatic.com/s/notosans/v36/o-0MIpQlx3QUlC5A4PNb4j5Ba_2c7A.ttf',
      fontWeight: 700,
    },
  ],
})

// Suppress the missing-glyph warning for glyphs outside the font's coverage
Font.registerHyphenationCallback((word) => [word])

// ── Camino colour palette ─────────────────────────────────────────────────
const C = {
  primary:   '#4f6b4c',
  bg:        '#ece4d4',
  card:      '#f7f3ea',
  ink:       '#2a3127',
  muted:     '#5c6457',
  border:    '#ddd3c0',
  secondary: '#d5dfcc',
  white:     '#ffffff',
  complete:  '#4f6b4c',
  unlocked:  '#8ea284',
  locked:    '#c7b99c',
}

// ── Shared styles ─────────────────────────────────────────────────────────
const s = StyleSheet.create({
  page: {
    fontFamily: 'NotoSans',
    backgroundColor: C.bg,
    paddingTop: 48,
    paddingBottom: 48,
    paddingHorizontal: 48,
    fontSize: 10,
    color: C.ink,
  },
  pageRtl: {
    fontFamily:    'NotoSans',
    backgroundColor: C.bg,
    paddingTop:    48,
    paddingBottom: 48,
    paddingHorizontal: 48,
    fontSize:      10,
    color:         C.ink,
  },

  // Header
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 28 },
  headerRtl: { flexDirection: 'row-reverse', alignItems: 'center', marginBottom: 28 },
  brand:  { fontSize: 18, fontWeight: 700, color: C.primary },
  tagline:{ fontSize: 9, color: C.muted, marginTop: 2 },

  divider: { height: 1, backgroundColor: C.border, marginVertical: 14 },

  // Section labels
  sectionLabel: {
    fontSize: 7,
    fontWeight: 700,
    color: C.muted,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 8,
  },
  sectionLabelRtl: {
    fontSize:    7,
    fontWeight:  700,
    color:       C.muted,
    letterSpacing: 1.2,
    marginBottom: 8,
    textAlign:   'right',
  },

  // User card
  userCard: {
    backgroundColor: C.card,
    borderRadius: 10,
    padding: 14,
    marginBottom: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  userName:  { fontSize: 15, fontWeight: 700, color: C.ink },
  userTopic: { fontSize: 9,  color: C.muted, marginTop: 3 },

  // Progress bar
  progressRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 18 },
  progressBg:  { flex: 1, height: 6, backgroundColor: C.secondary, borderRadius: 3 },
  progressFill:{ height: 6, backgroundColor: C.primary, borderRadius: 3 },
  progressPct: { fontSize: 9, fontWeight: 700, color: C.primary, width: 30, textAlign: 'right' },

  // Milestone rows
  milestoneRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 10,
    backgroundColor: C.card,
    borderRadius: 8,
    padding: 10,
  },
  milestoneRowRtl: {
    flexDirection: 'row-reverse',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 10,
    backgroundColor: C.card,
    borderRadius: 8,
    padding: 10,
  },
  dot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginTop: 1,
    flexShrink: 0,
  },
  milestoneText:   { flex: 1, fontSize: 10, color: C.ink, lineHeight: 1.5 },
  milestoneTextRtl:{ flex: 1, fontSize: 10, color: C.ink, lineHeight: 1.5, textAlign: 'right' },
  milestoneDesc:   { fontSize: 8, color: C.muted, marginTop: 2, lineHeight: 1.4 },
  milestoneDescRtl:{ fontSize: 8, color: C.muted, marginTop: 2, lineHeight: 1.4, textAlign: 'right' },

  tierLabel: {
    fontSize: 7,
    fontWeight: 700,
    color: C.muted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: 10,
    marginBottom: 5,
  },

  // Resource guide
  tipBox: {
    backgroundColor: C.secondary,
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
  },
  tipTitle: { fontSize: 10, fontWeight: 700, color: C.primary, marginBottom: 3 },
  tipText:  { fontSize: 9,  color: C.ink, lineHeight: 1.5 },

  // Footer
  footer: {
    position: 'absolute',
    bottom: 24,
    left: 48,
    right: 48,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerText: { fontSize: 7, color: C.muted },
  pageNum:    { fontSize: 7, color: C.muted },
})

// ── i18n strings for the PDF ───────────────────────────────────────────────
const PDF_COPY = {
  en: {
    brand:         'Camino',
    tagline:       'Your Personal Life Map',
    generatedOn:   'Generated on',
    yourPlan:      'Your Plan',
    progress:      'Progress',
    completed:     'Completed',
    nextSteps:     'Your Next Steps',
    resources:     'Quick Resource Guide',
    disclaimer:    'This is general information only — not legal or medical advice.',
    noCompleted:   'No milestones completed yet. Keep going!',
    noNext:        'All milestones complete — amazing work!',
    topicNames:    { financeJobs: 'Finance & Jobs', health: 'Health', immigration: 'Immigration' } as Record<Topic,string>,
    tier:          ['Foundation', 'Building Up', 'Advanced'] as [string,string,string],
  },
  es: {
    brand:         'Camino',
    tagline:       'Tu Mapa de Vida Personal',
    generatedOn:   'Generado el',
    yourPlan:      'Tu Plan',
    progress:      'Progreso',
    completed:     'Completados',
    nextSteps:     'Tus Próximos Pasos',
    resources:     'Guía de Recursos Rápidos',
    disclaimer:    'Esta es información general — no es asesoría legal ni médica.',
    noCompleted:   '¡Aún no hay logros completados. ¡Sigue adelante!',
    noNext:        '¡Todos los logros completados — increíble!',
    topicNames:    { financeJobs: 'Finanzas y Trabajo', health: 'Salud', immigration: 'Inmigración' } as Record<Topic,string>,
    tier:          ['Fundamento', 'Avanzando', 'Avanzado'] as [string,string,string],
  },
  fa: {
    brand:         'کامینو',
    tagline:       'نقشه زندگی شخصی شما',
    generatedOn:   'تاریخ تولید:',
    yourPlan:      'برنامه شما',
    progress:      'پیشرفت',
    completed:     'تکمیل‌شده',
    nextSteps:     'گام‌های بعدی شما',
    resources:     'راهنمای منابع سریع',
    disclaimer:    'این اطلاعات عمومی است — مشاوره حقوقی یا پزشکی نیست.',
    noCompleted:   'هنوز هیچ مرحله‌ای کامل نشده. ادامه بده!',
    noNext:        'همه مراحل کامل شد — عالی!',
    topicNames:    { financeJobs: 'مالی و شغل', health: 'سلامت', immigration: 'مهاجرت' } as Record<Topic,string>,
    tier:          ['پایه', 'در حال رشد', 'پیشرفته'] as [string,string,string],
  },
}

// ── Static resource tips per topic ────────────────────────────────────────
const TIPS: Record<Topic, Record<Language, { title: string; body: string }[]>> = {
  financeJobs: {
    en: [
      { title: 'Free Tax Filing (VITA)', body: 'IRS Volunteer Income Tax Assistance prepares free tax returns for people who earn $67,000 or less.' },
      { title: 'Secured Credit Cards', body: 'Many credit unions offer secured cards with low deposits ($200–$500) to help build U.S. credit history safely.' },
      { title: '211 — Financial Help Line', body: 'Dial 2-1-1 from any phone to find local financial assistance programs, food banks, and job training.' },
    ],
    es: [
      { title: 'Declaración de Impuestos Gratis (VITA)', body: 'El programa VITA del IRS prepara declaraciones gratuitas para personas que ganan $67,000 o menos.' },
      { title: 'Tarjetas de Crédito Garantizadas', body: 'Muchas cooperativas de crédito ofrecen tarjetas con depósitos bajos ($200–$500) para construir historial crediticio.' },
      { title: '211 — Línea de Ayuda Financiera', body: 'Marca 2-1-1 desde cualquier teléfono para encontrar programas de asistencia financiera y bancos de alimentos locales.' },
    ],
    fa: [
      { title: 'تهیه اظهارنامه مالیاتی رایگان (VITA)', body: 'برنامه VITA از IRS برای افرادی با درآمد ۶۷٬۰۰۰ دلار یا کمتر، اظهارنامه مالیاتی رایگان تهیه می‌کند.' },
      { title: 'کارت اعتباری تضمین‌شده', body: 'بسیاری از اتحادیه‌های اعتباری با سپرده کم (۲۰۰–۵۰۰ دلار) کارت‌هایی برای ساختن سابقه اعتباری ارائه می‌دهند.' },
      { title: '211 — خط کمک مالی', body: 'با شماره ۲-۱-۱ از هر تلفنی تماس بگیرید تا برنامه‌های کمک مالی و بانک‌های غذایی محلی پیدا کنید.' },
    ],
  },
  health: {
    en: [
      { title: 'Find a Free Clinic (FQHC)', body: 'Federally Qualified Health Centers serve everyone on a sliding fee scale — you pay what you can afford.' },
      { title: 'Medicaid & CHIP', body: 'Government health coverage for low-income adults, children, pregnant women, and people with disabilities.' },
      { title: 'Crisis Line — 988', body: 'Call or text 988 anytime for free, confidential mental health and crisis support.' },
    ],
    es: [
      { title: 'Clínicas Gratuitas (FQHC)', body: 'Los Centros de Salud Calificados a nivel Federal atienden a todos según lo que pueden pagar.' },
      { title: 'Medicaid y CHIP', body: 'Cobertura de salud del gobierno para adultos de bajos ingresos, niños, mujeres embarazadas y personas con discapacidades.' },
      { title: 'Línea de Crisis — 988', body: 'Llama o envía un mensaje al 988 en cualquier momento para apoyo de salud mental gratuito y confidencial.' },
    ],
    fa: [
      { title: 'کلینیک‌های رایگان (FQHC)', body: 'مراکز بهداشتی واجد شرایط فدرال بر اساس درآمد شما هزینه می‌گیرند — شما به اندازه توانتان پرداخت می‌کنید.' },
      { title: 'Medicaid و CHIP', body: 'پوشش بهداشتی دولتی برای بزرگسالان کم‌درآمد، کودکان، زنان باردار و معلولان.' },
      { title: 'خط بحران — 988', body: 'هر زمان با ۹۸۸ تماس بگیرید یا پیام بفرستید برای حمایت رایگان و محرمانه سلامت روان.' },
    ],
  },
  immigration: {
    en: [
      { title: 'Free Legal Aid', body: 'Search "BIA accredited representatives" or "nonprofit immigration legal aid" in your city for free or low-cost help.' },
      { title: 'Avoid Notarios', body: 'Only a licensed attorney or BIA-accredited representative can give legal immigration advice. Notarios are not lawyers.' },
      { title: 'USCIS Official Website', body: 'uscis.gov is the only official source for forms, fees, and case status. All forms are free to download.' },
    ],
    es: [
      { title: 'Ayuda Legal Gratuita', body: 'Busca "representantes acreditados por BIA" o "ayuda legal de inmigración sin fines de lucro" en tu ciudad.' },
      { title: 'Cuidado con los Notarios', body: 'Solo un abogado con licencia o representante acreditado por BIA puede dar asesoría legal de inmigración.' },
      { title: 'Sitio Oficial de USCIS', body: 'uscis.gov es la única fuente oficial para formularios, tarifas y estado del caso. Todos los formularios son gratuitos.' },
    ],
    fa: [
      { title: 'کمک حقوقی رایگان', body: 'در شهرتان "نمایندگان معتمد BIA" یا "کمک حقوقی مهاجرتی غیرانتفاعی" را جستجو کنید.' },
      { title: 'از نوتاریوها دوری کنید', body: 'فقط وکیل دارای مجوز یا نماینده تأیید شده BIA می‌تواند مشاوره حقوقی مهاجرتی بدهد.' },
      { title: 'سایت رسمی USCIS', body: 'uscis.gov تنها منبع رسمی برای فرم‌ها، هزینه‌ها و وضعیت پرونده است. همه فرم‌ها رایگان هستند.' },
    ],
  },
}

// ── Helper: format today's date ───────────────────────────────────────────
function todayString(language: Language): string {
  const opts: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' }
  const locale = language === 'fa' ? 'fa-IR' : language === 'es' ? 'es' : 'en-US'
  try { return new Date().toLocaleDateString(locale, opts) } catch { return new Date().toLocaleDateString('en-US', opts) }
}

// ── Status dot colour ─────────────────────────────────────────────────────
function dotColor(status: MilestoneWithStatus['status']): string {
  if (status === 'complete')  return C.complete
  if (status === 'unlocked')  return C.unlocked
  return C.locked
}

// ── Props ─────────────────────────────────────────────────────────────────
interface LifeMapDocumentProps {
  userName:  string
  language:  Language
  topic:     Topic
  nodes:     MilestoneWithStatus[]
}

// ─────────────────────────────────────────────────────────────────────────────
// Document
// ─────────────────────────────────────────────────────────────────────────────
export function LifeMapDocument({ userName, language, topic, nodes }: LifeMapDocumentProps) {
  const copy   = PDF_COPY[language]
  const isRtl  = language === 'fa'
  const tips   = TIPS[topic][language]

  const completed = nodes.filter((n) => n.status === 'complete')
  const nextUp    = nodes.filter((n) => n.status === 'unlocked')
  const pct       = nodes.length > 0 ? Math.round((completed.length / nodes.length) * 100) : 0

  const pageStyle    = isRtl ? s.pageRtl    : s.page
  const headerStyle  = isRtl ? s.headerRtl  : s.header
  const secLblStyle  = isRtl ? s.sectionLabelRtl : s.sectionLabel
  const rowStyle     = isRtl ? s.milestoneRowRtl  : s.milestoneRow
  const textStyle    = isRtl ? s.milestoneTextRtl : s.milestoneText
  const descStyle    = isRtl ? s.milestoneDescRtl : s.milestoneDesc

  const tierNames = copy.tier

  return (
    <Document
      title={`${copy.brand} — ${userName}`}
      author="Camino"
      language={language}
    >
      <Page size="A4" style={pageStyle}>

        {/* ── Header ───────────────────────────────────────────────────── */}
        <View style={headerStyle}>
          <View style={{ flex: 1 }}>
            <Text style={s.brand}>🌿 {copy.brand}</Text>
            <Text style={s.tagline}>{copy.tagline}</Text>
          </View>
          <Text style={s.footerText}>{copy.generatedOn} {todayString(language)}</Text>
        </View>

        <View style={s.divider} />

        {/* ── User card ─────────────────────────────────────────────────── */}
        <View style={s.userCard}>
          <View>
            <Text style={s.userName}>{userName}</Text>
            <Text style={s.userTopic}>{copy.topicNames[topic]}</Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={{ fontSize: 9, color: C.muted }}>{copy.completed}</Text>
            <Text style={{ fontSize: 20, fontWeight: 700, color: C.primary }}>
              {completed.length}/{nodes.length}
            </Text>
          </View>
        </View>

        {/* ── Progress bar ──────────────────────────────────────────────── */}
        <Text style={secLblStyle}>{copy.progress}</Text>
        <View style={s.progressRow}>
          <View style={s.progressBg}>
            <View style={[s.progressFill, { width: `${pct}%` }]} />
          </View>
          <Text style={s.progressPct}>{pct}%</Text>
        </View>

        <View style={s.divider} />

        {/* ── Completed milestones ──────────────────────────────────────── */}
        <Text style={secLblStyle}>{copy.completed}</Text>
        {completed.length === 0
          ? <Text style={{ fontSize: 9, color: C.muted, marginBottom: 10 }}>{copy.noCompleted}</Text>
          : ([1, 2, 3] as const).map((tier) => {
              const tierNodes = completed.filter((n) => n.tier === tier)
              if (tierNodes.length === 0) return null
              return (
                <View key={tier}>
                  <Text style={s.tierLabel}>{tierNames[tier - 1]}</Text>
                  {tierNodes.map((node) => (
                    <View key={node.id} style={rowStyle}>
                      <View style={[s.dot, { backgroundColor: dotColor(node.status) }]} />
                      <View style={{ flex: 1 }}>
                        <Text style={textStyle}>{node.title[language]}</Text>
                      </View>
                    </View>
                  ))}
                </View>
              )
            })
        }

        <View style={s.divider} />

        {/* ── Next steps ───────────────────────────────────────────────── */}
        <Text style={secLblStyle}>{copy.nextSteps}</Text>
        {nextUp.length === 0
          ? <Text style={{ fontSize: 9, color: C.muted, marginBottom: 10 }}>{copy.noNext}</Text>
          : nextUp.map((node) => (
              <View key={node.id} style={rowStyle}>
                <View style={[s.dot, { backgroundColor: dotColor(node.status) }]} />
                <View style={{ flex: 1 }}>
                  <Text style={textStyle}>{node.title[language]}</Text>
                  <Text style={descStyle}>{node.description[language]}</Text>
                </View>
              </View>
            ))
        }

        <View style={s.divider} />

        {/* ── Resource tips ─────────────────────────────────────────────── */}
        <Text style={secLblStyle}>{copy.resources}</Text>
        {tips.map((tip, i) => (
          <View key={i} style={s.tipBox}>
            <Text style={s.tipTitle}>{tip.title}</Text>
            <Text style={s.tipText}>{tip.body}</Text>
          </View>
        ))}

        {/* ── Footer ───────────────────────────────────────────────────── */}
        <View style={s.footer} fixed>
          <Text style={s.footerText}>{copy.disclaimer}</Text>
          <Text style={s.pageNum} render={({ pageNumber, totalPages }) =>
            `${pageNumber} / ${totalPages}`
          } />
        </View>

      </Page>
    </Document>
  )
}
