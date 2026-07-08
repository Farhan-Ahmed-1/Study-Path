/*
 * Academy course catalogue — single source of truth for course cards,
 * schedule table, and booking buttons across prime-academy.html.
 *
 * STATUS WORKFLOW
 * ---------------
 *   status: "waitlist"  — default for ALL courses.
 *                         Card shows "Join the waitlist on WhatsApp".
 *   status: "open"      — set ONLY when a teacher is confirmed AND a start
 *                         date is fixed. Card shows "Book my place on WhatsApp".
 *
 *   Only these two values are valid — nothing else.
 *
 * TO OPEN A COURSE: change status → "open" and update intake to the real date.
 * TO SET AN INTAKE DATE: update the intake field (e.g. "September 2025", "Rolling").
 * If no date is known yet, leave intake as "Ask on WhatsApp".
 */

window.ACADEMY_COURSES = [

  /* ======================================================
     TAB 1 — SCHOOL & BAC SUPPORT
  ====================================================== */

  // ── Level: 3ème Collège ───────────────────────────────
  {
    id: "regional-3eme",
    category: "bac",
    level: "3eme College",
    intake: "Ask on WhatsApp",
    title: {
      en: "Regional Exam Prep — 3eme College",
      fr: "[TRANSLATE] Regional Exam Prep — 3eme College",
      ar: "[TRANSLATE] Regional Exam Prep — 3eme College",
    },
    audience: { en: "Final-year college students" },
    alignment: { en: "Aligned to the Ministry of Education's examen regional unifie (3eme annee college)." },
    covers: { en: "Maths, Physics-Chemistry, SVT, French, Arabic — exam-format training with past regional papers." },
    format: { en: "Small groups, January start + May-June intensive." },
    status: "waitlist",
    whatsappLabel: "Regional Prep — 3eme College",
  },

  // ── Level: Tronc Commun ───────────────────────────────
  {
    id: "support-tc",
    category: "bac",
    level: "Tronc Commun",
    intake: "Ask on WhatsApp",
    title: {
      en: "All-Subject Support — Tronc Commun",
      fr: "[TRANSLATE] All-Subject Support — Tronc Commun",
      ar: "[TRANSLATE] All-Subject Support — Tronc Commun",
    },
    audience: { en: "First-year lycee students" },
    alignment: { en: "Aligned to the official MEN tronc commun program." },
    covers: { en: "Maths, PC, SVT + study-method coaching and test prep for devoirs surveilles." },
    format: { en: "Weekly sessions, all year." },
    status: "waitlist",
    whatsappLabel: "Support — Tronc Commun",
  },

  // ── Level: 1ere Bac ───────────────────────────────────
  {
    id: "regional-1bac",
    category: "bac",
    level: "1ere Bac",
    intake: "Ask on WhatsApp",
    title: {
      en: "Regional Exam Prep — 1ere Bac",
      fr: "[TRANSLATE] Regional Exam Prep — 1ere Bac",
      ar: "[TRANSLATE] Regional Exam Prep — 1ere Bac",
    },
    audience: { en: "1ere Bac students across all streams" },
    alignment: { en: "The regional exam counts for 25% of your final Bac grade (official MEN formula)." },
    covers: { en: "The oeuvres au programme in French (essay + text analysis), Arabic methodology, structured Histoire-Geo responses." },
    format: { en: "Small groups, January start + April-May intensive." },
    status: "waitlist",
    whatsappLabel: "Regional Prep — 1ere Bac",
  },
  {
    id: "sciences-1bac",
    category: "bac",
    level: "1ere Bac",
    intake: "Ask on WhatsApp",
    title: {
      en: "Sciences Support — 1ere Bac",
      fr: "[TRANSLATE] Sciences Support — 1ere Bac",
      ar: "[TRANSLATE] Sciences Support — 1ere Bac",
    },
    audience: { en: "1ere Bac students in science, maths, or technical streams" },
    alignment: { en: "MEN 1ere Bac science programs; also protects the controle continu." },
    covers: { en: "Maths, Physics-Chemistry, SVT." },
    format: { en: "Weekly sessions, all year." },
    status: "waitlist",
    whatsappLabel: "Sciences — 1ere Bac",
  },

  // ── Level: 2eme Bac ───────────────────────────────────
  {
    id: "maths-2bac",
    category: "bac",
    level: "2eme Bac",
    intake: "Ask on WhatsApp",
    title: {
      en: "Mathematiques — National Exam Prep",
      fr: "[TRANSLATE] Mathematiques — National Exam Prep",
      ar: "[TRANSLATE] Mathematiques — National Exam Prep",
    },
    audience: { en: "2eme Bac students — all science and maths streams" },
    alignment: { en: "MEN national program — the heaviest coefficient in science streams." },
    covers: { en: "Analysis, functions, sequences, complex numbers, probability, geometry + past national papers with timing technique." },
    format: { en: "Intensive weekly + mock exams from February." },
    status: "waitlist",
    whatsappLabel: "Maths — 2eme Bac",
  },
  {
    id: "pc-2bac",
    category: "bac",
    level: "2eme Bac",
    intake: "Ask on WhatsApp",
    title: {
      en: "Physique-Chimie — National Exam Prep",
      fr: "[TRANSLATE] Physique-Chimie — National Exam Prep",
      ar: "[TRANSLATE] Physique-Chimie — National Exam Prep",
    },
    audience: { en: "2eme Bac students — science and maths streams" },
    alignment: { en: "MEN national Physique-Chimie program." },
    covers: { en: "Waves, nuclear, electricity, mechanics, chemistry — organized by past-paper theme." },
    format: { en: "Weekly sessions + exam sprints." },
    status: "waitlist",
    whatsappLabel: "PC — 2eme Bac",
  },
  {
    id: "svt-2bac",
    category: "bac",
    level: "2eme Bac",
    intake: "Ask on WhatsApp",
    title: {
      en: "SVT — National Exam Prep",
      fr: "[TRANSLATE] SVT — National Exam Prep",
      ar: "[TRANSLATE] SVT — National Exam Prep",
    },
    audience: { en: "2eme Bac students — science stream" },
    alignment: { en: "MEN national SVT program." },
    covers: { en: "Genetics, immunology, neurophysiology, geology + document-analysis methodology." },
    format: { en: "Weekly sessions + exam sprints." },
    status: "waitlist",
    whatsappLabel: "SVT — 2eme Bac",
  },
  {
    id: "philo-eng-2bac",
    category: "bac",
    level: "2eme Bac",
    intake: "Ask on WhatsApp",
    title: {
      en: "Philosophy & English — Easy Points Module",
      fr: "[TRANSLATE] Philosophy & English — Easy Points Module",
      ar: "[TRANSLATE] Philosophy & English — Easy Points Module",
    },
    audience: { en: "Any 2eme Bac student — add-on to other subjects" },
    alignment: { en: "MEN national program for Philosophy and English." },
    covers: { en: "Philosophy essay methodology + English national exam format." },
    format: { en: "Short add-on modules, flexible timing." },
    status: "waitlist",
    whatsappLabel: "Philo & English — 2eme Bac",
  },
  {
    id: "rattrapage",
    category: "bac",
    level: "2eme Bac",
    intake: "July (after results day)",
    title: {
      en: "Rattrapage Intensive",
      fr: "[TRANSLATE] Rattrapage Intensive",
      ar: "[TRANSLATE] Rattrapage Intensive",
    },
    audience: { en: "Students called to the rattrapage session" },
    alignment: { en: "MEN rattrapage exam program." },
    covers: { en: "2-3 week emergency sprint on the student's weakest subjects, between results day and the rattrapage exams." },
    format: { en: "Intensive daily sessions, 2-3 weeks." },
    status: "waitlist",
    whatsappLabel: "Rattrapage Intensive",
  },

  /* ======================================================
     TAB 2 — LANGUAGES & CERTIFICATES
  ====================================================== */

  {
    id: "english-general",
    category: "languages",
    intake: "Rolling",
    title: {
      en: "English (A1 to C1)",
      fr: "[TRANSLATE] English (A1 to C1)",
      ar: "[TRANSLATE] English (A1 to C1)",
    },
    audience: { en: "All levels — complete beginner to advanced" },
    alignment: { en: "Certificate of completion with CEFR level; pathway to IELTS." },
    covers: { en: "General & academic English, 6 levels, placement test on entry." },
    format: { en: "Small groups, morning / evening / weekend. Rolling intakes." },
    status: "waitlist",
    whatsappLabel: "English — General",
    abroadLink: "prime-global.html",
  },
  {
    id: "french-delf",
    category: "languages",
    intake: "Rolling",
    title: {
      en: "French — DELF/DALF & TCF (A2 to C1)",
      fr: "[TRANSLATE] French — DELF/DALF & TCF (A2 to C1)",
      ar: "[TRANSLATE] French — DELF/DALF & TCF (A2 to C1)",
    },
    audience: { en: "France/Canada applicants and Bac students needing French support" },
    alignment: { en: "Prepares for DELF B1/B2, DALF C1, TCF — certifications Campus France and Canadian universities require." },
    covers: { en: "Oral and written French, exam technique, Campus France preparation." },
    format: { en: "Small groups, all year." },
    status: "waitlist",
    whatsappLabel: "French — DELF/TCF",
    abroadLink: "prime-global.html",
  },
  {
    id: "german",
    category: "languages",
    intake: "Ask on WhatsApp",
    title: {
      en: "German — Ausbildung & Study Track (A1 to B2)",
      fr: "[TRANSLATE] German — Ausbildung & Study Track (A1 to B2)",
      ar: "[TRANSLATE] German — Ausbildung & Study Track (A1 to B2)",
    },
    audience: { en: "Ausbildung candidates (B1/B2 required) and German university applicants" },
    alignment: { en: "Prepares for Goethe-Zertifikat / telc — certificates German embassies and employers accept." },
    covers: { en: "Two tracks: vocational German for Ausbildung (B1/B2 target) and academic German for university entry." },
    format: { en: "Small groups, flexible scheduling." },
    status: "waitlist",
    whatsappLabel: "German",
    abroadLink: "prime-global.html",
    honesty: { en: "Germany placement carries our published service fee — we tell you the number before you start." },
  },
  {
    id: "spanish-dele",
    category: "languages",
    intake: "Ask on WhatsApp",
    title: {
      en: "Spanish — DELE (A1 to B2)",
      fr: "[TRANSLATE] Spanish — DELE (A1 to B2)",
      ar: "[TRANSLATE] Spanish — DELE (A1 to B2)",
    },
    audience: { en: "Spanish university applicants and general learners" },
    alignment: { en: "Prepares for DELE / SIELE." },
    covers: { en: "Spanish language, culture and exam technique." },
    format: { en: "Small groups." },
    status: "waitlist",
    whatsappLabel: "Spanish — DELE",
    abroadLink: "prime-global.html",
  },
  {
    id: "italian",
    category: "languages",
    intake: "Ask on WhatsApp",
    title: {
      en: "Italian — CILS/CELI (A1 to B2)",
      fr: "[TRANSLATE] Italian — CILS/CELI (A1 to B2)",
      ar: "[TRANSLATE] Italian — CILS/CELI (A1 to B2)",
    },
    audience: { en: "Italian public university applicants and general learners" },
    alignment: { en: "Prepares for CILS / CELI. Italian public universities: low tuition, growing English-taught options." },
    covers: { en: "Italian language, culture and university entry requirements." },
    format: { en: "Small groups." },
    status: "waitlist",
    whatsappLabel: "Italian",
    abroadLink: "prime-global.html",
  },
  {
    id: "kids-languages",
    category: "languages",
    intake: "Term-based",
    title: {
      en: "English & French for Kids (7-14)",
      fr: "[TRANSLATE] English & French for Kids (7-14)",
      ar: "[TRANSLATE] English & French for Kids (7-14)",
    },
    audience: { en: "Children aged 7-14" },
    alignment: { en: "CEFR young-learner levels; optional Cambridge Young Learners exam prep." },
    covers: { en: "Games-based small groups, term-based with end-of-term parent showcase." },
    format: { en: "Term-based, 2 sessions per week." },
    status: "waitlist",
    whatsappLabel: "Kids Languages",
    /* Cross-listed in Tab 4 Kids row — do not change id or category */
  },

  /* ======================================================
     TAB 3 — EXAM PREP
  ====================================================== */

  {
    id: "ielts-intensive",
    category: "examprep",
    intake: "Monthly",
    title: {
      en: "IELTS Intensive",
      fr: "[TRANSLATE] IELTS Intensive",
      ar: "[TRANSLATE] IELTS Intensive",
    },
    audience: { en: "Anyone needing IELTS for university, visa, or professional purposes" },
    alignment: { en: "British Council / IDP IELTS exam format — all 4 modules." },
    covers: { en: "Listening, Reading, Writing, Speaking — 4 band-scored mock tests, 6-10 week intensive." },
    format: { en: "6-10 weeks, intensive small groups." },
    status: "waitlist",
    whatsappLabel: "IELTS Intensive",
    honesty: { en: "We prepare you for IELTS; the official exam is sat at an authorized British Council or IDP centre." },
  },
  {
    id: "delf-sprint",
    category: "examprep",
    intake: "Ask on WhatsApp",
    title: {
      en: "DELF/DALF Exam Sprint",
      fr: "[TRANSLATE] DELF/DALF Exam Sprint",
      ar: "[TRANSLATE] DELF/DALF Exam Sprint",
    },
    audience: { en: "Students who already have the level and need focused exam preparation" },
    alignment: { en: "Alliance Francaise / Institut francais DELF/DALF exam format." },
    covers: { en: "Exam technique, timed practice, oral preparation." },
    format: { en: "Short sprint, 3-4 weeks." },
    status: "waitlist",
    whatsappLabel: "DELF Sprint",
  },
  {
    id: "goethe-sprint",
    category: "examprep",
    intake: "Ask on WhatsApp",
    title: {
      en: "Goethe/telc Exam Sprint",
      fr: "[TRANSLATE] Goethe/telc Exam Sprint",
      ar: "[TRANSLATE] Goethe/telc Exam Sprint",
    },
    audience: { en: "German learners preparing for a Goethe-Institut or telc exam" },
    alignment: { en: "Goethe-Institut / telc exam format." },
    covers: { en: "Exam technique, timed practice, oral preparation for German." },
    format: { en: "Short sprint, 3-4 weeks." },
    status: "waitlist",
    whatsappLabel: "Goethe Sprint",
  },

  /* ======================================================
     TAB 4 — KIDS & PROFESSIONAL
     (kids-languages from Tab 2 is cross-listed into the
      Kids row automatically by the renderer — id check)
  ====================================================== */

  // ── Kids row ──────────────────────────────────────────
  {
    id: "soroban",
    category: "kids-pro",
    intake: "Term-based",
    title: {
      en: "Soroban — Japanese Abacus & Mental Math (ages 5-13)",
      fr: "[TRANSLATE] Soroban — Japanese Abacus & Mental Math (ages 5-13)",
      ar: "[TRANSLATE] Soroban — Japanese Abacus & Mental Math (ages 5-13)",
    },
    audience: { en: "Children aged 5-13, grouped by age: 5-7, 8-10, 11-13" },
    alignment: { en: "Traditional Japanese soroban method, kyu grading system. Complements the school math program." },
    covers: { en: "The Japanese abacus method that builds concentration, memory, and lightning mental calculation. Kids progress through the traditional kyu levels — a graded exam and certificate each term — up to anzan: calculating entirely in their head, no abacus needed. Small groups by age (5-7, 8-10, 11-13), 1-2 sessions a week, results parents can see in school math grades." },
    format: { en: "Small groups by age, 1-2 sessions per week, term-based." },
    status: "waitlist",
    whatsappLabel: "Soroban — Kids",
    kidsRow: true,
  },
  {
    id: "kids-coding",
    category: "kids-pro",
    intake: "Term-based",
    title: {
      en: "Kids Coding (9-15)",
      fr: "[TRANSLATE] Kids Coding (9-15)",
      ar: "[TRANSLATE] Kids Coding (9-15)",
    },
    audience: { en: "Children aged 9-15" },
    alignment: { en: "Project-based: Scratch to Python / web fundamentals." },
    covers: { en: "Scratch to basic Python and web development, term-based with a project showcase." },
    format: { en: "Term-based, small groups." },
    status: "waitlist",
    whatsappLabel: "Kids Coding",
    kidsRow: true,
  },

  // ── Professional row ──────────────────────────────────
  {
    id: "management-essentials",
    category: "kids-pro",
    intake: "Ask on WhatsApp",
    title: {
      en: "Management Essentials",
      fr: "[TRANSLATE] Management Essentials",
      ar: "[TRANSLATE] Management Essentials",
    },
    audience: { en: "Junior managers aged 25-40 looking to formalise their management skills" },
    alignment: { en: "Practical management framework — people, planning, communication, finance." },
    covers: { en: "People management, planning, communication, finance for non-financial managers. 6-8 week evening/weekend format." },
    format: { en: "Evenings and weekends, 6-8 weeks." },
    status: "waitlist",
    whatsappLabel: "Management Essentials",
    level7Link: "level7.html",
  },
  {
    id: "business-communication",
    category: "kids-pro",
    intake: "Ask on WhatsApp",
    title: {
      en: "Soft Skills & Business Communication (English)",
      fr: "[TRANSLATE] Soft Skills & Business Communication (English)",
      ar: "[TRANSLATE] Soft Skills & Business Communication (English)",
    },
    audience: { en: "Professionals and job-seekers who use English in the workplace" },
    alignment: { en: "Business English and professional communication frameworks." },
    covers: { en: "Presentations, meetings, email writing, interviews." },
    format: { en: "Evenings / weekends, flexible schedule." },
    status: "waitlist",
    whatsappLabel: "Business Communication",
  },
  {
    id: "digital-skills",
    category: "kids-pro",
    intake: "Ask on WhatsApp",
    title: {
      en: "Digital Skills Certificates",
      fr: "[TRANSLATE] Digital Skills Certificates",
      ar: "[TRANSLATE] Digital Skills Certificates",
    },
    audience: { en: "Anyone looking to gain recognised digital marketing or IT credentials" },
    alignment: { en: "Guided cohorts preparing recognised external certificates (e.g. Google digital marketing fundamentals)." },
    covers: { en: "Digital marketing, analytics, social media and online tools — structured around external certification syllabuses." },
    format: { en: "Cohort-based, flexible schedule." },
    status: "waitlist",
    whatsappLabel: "Digital Skills",
    honesty: { en: "Training by Prime Academy; the recognised certificate is issued by the external body." },
  },
  {
    id: "tefl",
    category: "kids-pro",
    intake: "Ask on WhatsApp",
    title: {
      en: "TEFL Track",
      fr: "[TRANSLATE] TEFL Track",
      ar: "[TRANSLATE] TEFL Track",
    },
    audience: { en: "English teachers and professionals seeking a globally recognised teaching qualification" },
    alignment: { en: "120-hour TEFL via an accredited external provider." },
    covers: { en: "Internationally recognised 120-hour TEFL certificate via an accredited external provider." },
    format: { en: "Blended: workshops + independent study." },
    status: "waitlist",
    whatsappLabel: "TEFL",
    honesty: { en: "Training by Prime Academy; the recognised certificate is issued by the external body." },
  },

];
