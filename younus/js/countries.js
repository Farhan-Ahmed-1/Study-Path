/* =====================================================================
   Countries — data + rendering for the home strip, the countries list,
   and the country-details page. Localizable text fields are {lang} maps;
   numbers / proper nouns stay the same across languages.
   ===================================================================== */
(function () {
  "use strict";

  function L(field) {
    if (field == null) return "";
    if (typeof field === "string") return field;
    const c = window.I18N ? window.I18N.current : "en";
    return field[c] || field.en || "";
  }

  const DATA = [
    {
      id: "spain", flag: "🇪🇸", name: "Spain",
      region: { en: "Southern Europe", ar: "جنوب أوروبا", fr: "Europe du Sud", es: "Europa del Sur", hi: "दक्षिणी यूरोप" },
      tuition: "€1,000 – €4,000", living: "€700 – €1,000",
      proof: "≈ €8,000", langs: "Español, English",
      intake: { en: "Sept / Feb", ar: "سبتمبر / فبراير", fr: "Sept. / Fév.", es: "Sept / Feb", hi: "सितंबर / फ़रवरी" },
      work: { en: "Up to 30h/week", ar: "حتى 30 ساعة/أسبوع", fr: "Jusqu'à 30h/sem.", es: "Hasta 30h/semana", hi: "30 घंटे/सप्ताह तक" },
      unis: ["Universidad Complutense de Madrid", "Universitat de Barcelona", "Universidad de Valencia"],
      desc: {
        en: "Affordable tuition, warm climate and a fast-growing destination for international students.",
        ar: "رسوم معقولة، مناخ دافئ، ووجهة سريعة النمو للطلاب الدوليين.",
        fr: "Frais abordables, climat agréable et destination en plein essor pour les étudiants.",
        es: "Matrícula asequible, clima cálido y un destino en auge para estudiantes internacionales.",
        hi: "किफ़ायती फ़ीस, गर्म जलवायु और अंतरराष्ट्रीय छात्रों के लिए तेज़ी से बढ़ता गंतव्य।",
      },
      notes: {
        en: "Proof of funds and a NIE student permit are required. Language courses can be a smart first step.",
        ar: "يلزم إثبات الأموال وتصريح طالب (NIE). قد تكون دورات اللغة خطوة أولى ذكية.",
        fr: "Preuve de fonds et permis étudiant (NIE) requis. Les cours de langue sont un bon premier pas.",
        es: "Se requiere prueba de fondos y permiso de estudiante (NIE). Los cursos de idioma son un buen primer paso.",
        hi: "फ़ंड का प्रमाण और छात्र परमिट (NIE) आवश्यक है। भाषा कोर्स एक अच्छा पहला कदम हो सकता है।",
      },
    },
    {
      id: "france", flag: "🇫🇷", name: "France",
      region: { en: "Western Europe", ar: "غرب أوروبا", fr: "Europe de l'Ouest", es: "Europa Occidental", hi: "पश्चिमी यूरोप" },
      tuition: "€170 – €3,800", living: "€800 – €1,200",
      proof: "≈ €7,400", langs: "Français, English",
      intake: { en: "Sept / Jan", ar: "سبتمبر / يناير", fr: "Sept. / Jan.", es: "Sept / Ene", hi: "सितंबर / जनवरी" },
      work: { en: "Up to 964h/year", ar: "حتى 964 ساعة/سنة", fr: "Jusqu'à 964h/an", es: "Hasta 964h/año", hi: "964 घंटे/वर्ष तक" },
      unis: ["Sorbonne Université", "Université PSL", "Sciences Po"],
      desc: {
        en: "Low public tuition, world-class universities and strong support for international students.",
        ar: "رسوم عامة منخفضة، جامعات عالمية المستوى، ودعم قوي للطلاب الدوليين.",
        fr: "Frais publics bas, universités de premier plan et fort soutien aux étudiants internationaux.",
        es: "Matrícula pública baja, universidades de primer nivel y gran apoyo a estudiantes internacionales.",
        hi: "कम सार्वजनिक फ़ीस, विश्वस्तरीय विश्वविद्यालय और अंतरराष्ट्रीय छात्रों के लिए मज़बूत सहयोग।",
      },
      notes: {
        en: "Campus France procedure applies. A B2 French level helps for many programs.",
        ar: "تطبق إجراءات Campus France. مستوى فرنسي B2 يساعد في كثير من البرامج.",
        fr: "La procédure Campus France s'applique. Un niveau B2 en français aide pour de nombreux programmes.",
        es: "Se aplica el procedimiento Campus France. Un nivel B2 de francés ayuda en muchos programas.",
        hi: "Campus France प्रक्रिया लागू होती है। कई कार्यक्रमों के लिए B2 फ़्रेंच स्तर मददगार है।",
      },
    },
    {
      id: "germany", flag: "🇩🇪", name: "Germany",
      region: { en: "Central Europe", ar: "وسط أوروبا", fr: "Europe centrale", es: "Europa Central", hi: "मध्य यूरोप" },
      tuition: "€0 – €3,000", living: "€850 – €1,100",
      proof: "≈ €11,200", langs: "Deutsch, English",
      intake: { en: "Oct / Apr", ar: "أكتوبر / أبريل", fr: "Oct. / Avr.", es: "Oct / Abr", hi: "अक्टूबर / अप्रैल" },
      work: { en: "120 full days/year", ar: "120 يوماً كاملاً/سنة", fr: "120 jours pleins/an", es: "120 días completos/año", hi: "120 पूर्ण दिन/वर्ष" },
      unis: ["TU München", "LMU München", "Heidelberg University"],
      desc: {
        en: "Many tuition-free public universities and a strong job market after graduation.",
        ar: "العديد من الجامعات العامة المجانية وسوق عمل قوي بعد التخرج.",
        fr: "De nombreuses universités publiques gratuites et un marché de l'emploi solide après le diplôme.",
        es: "Muchas universidades públicas gratuitas y un fuerte mercado laboral tras graduarse.",
        hi: "कई निःशुल्क सार्वजनिक विश्वविद्यालय और स्नातक के बाद मज़बूत नौकरी बाज़ार।",
      },
      notes: {
        en: "A blocked account is usually required as proof of funds. APS certificate may apply.",
        ar: "يلزم عادة حساب مجمّد كإثبات للأموال. قد تنطبق شهادة APS.",
        fr: "Un compte bloqué est généralement exigé comme preuve de fonds. Le certificat APS peut s'appliquer.",
        es: "Suele exigirse una cuenta bloqueada como prueba de fondos. Puede aplicar el certificado APS.",
        hi: "फ़ंड के प्रमाण के रूप में आमतौर पर ब्लॉक्ड अकाउंट आवश्यक होता है। APS प्रमाणपत्र लागू हो सकता है।",
      },
    },
    {
      id: "canada", flag: "🇨🇦", name: "Canada",
      region: { en: "North America", ar: "أمريكا الشمالية", fr: "Amérique du Nord", es: "Norteamérica", hi: "उत्तरी अमेरिका" },
      tuition: "$13,000 – $30,000", living: "$1,000 – $1,500",
      proof: "≈ $20,635", langs: "English, Français",
      intake: { en: "Sept / Jan / May", ar: "سبتمبر / يناير / مايو", fr: "Sept. / Jan. / Mai", es: "Sept / Ene / May", hi: "सितंबर / जनवरी / मई" },
      work: { en: "Up to 24h/week", ar: "حتى 24 ساعة/أسبوع", fr: "Jusqu'à 24h/sem.", es: "Hasta 24h/semana", hi: "24 घंटे/सप्ताह तक" },
      unis: ["University of Toronto", "McGill University", "UBC"],
      desc: {
        en: "Welcoming immigration policies and clear post-study work and residency pathways.",
        ar: "سياسات هجرة مرحّبة ومسارات واضحة للعمل والإقامة بعد الدراسة.",
        fr: "Politiques d'immigration accueillantes et voies claires de travail et de résidence après les études.",
        es: "Políticas de inmigración acogedoras y vías claras de trabajo y residencia tras estudiar.",
        hi: "स्वागतपूर्ण आव्रजन नीतियाँ और पढ़ाई के बाद काम व निवास के स्पष्ट रास्ते।",
      },
      notes: {
        en: "A study permit and proof of funds (GIC) are required. SDS stream can speed up the visa.",
        ar: "يلزم تصريح دراسة وإثبات أموال (GIC). قد يسرّع مسار SDS التأشيرة.",
        fr: "Un permis d'études et une preuve de fonds (GIC) sont requis. Le volet SDS peut accélérer le visa.",
        es: "Se requiere permiso de estudios y prueba de fondos (GIC). La vía SDS puede acelerar el visado.",
        hi: "अध्ययन परमिट और फ़ंड का प्रमाण (GIC) आवश्यक है। SDS स्ट्रीम वीज़ा तेज़ कर सकती है।",
      },
    },
    {
      id: "usa", flag: "🇺🇸", name: "United States",
      region: { en: "North America", ar: "أمريكا الشمالية", fr: "Amérique du Nord", es: "Norteamérica", hi: "उत्तरी अमेरिका" },
      tuition: "$20,000 – $45,000", living: "$1,200 – $2,000",
      proof: { en: "Varies by school", ar: "يختلف حسب الجامعة", fr: "Variable selon l'école", es: "Varía según la escuela", hi: "स्कूल के अनुसार भिन्न" },
      langs: "English",
      intake: { en: "Aug / Jan", ar: "أغسطس / يناير", fr: "Août / Jan.", es: "Ago / Ene", hi: "अगस्त / जनवरी" },
      work: { en: "On-campus, then OPT", ar: "داخل الحرم ثم OPT", fr: "Sur le campus, puis OPT", es: "En el campus, luego OPT", hi: "कैंपस में, फिर OPT" },
      unis: ["Arizona State University", "NYU", "University of Illinois"],
      desc: {
        en: "The widest range of programs in the world and unmatched research opportunities.",
        ar: "أوسع مجموعة برامج في العالم وفرص بحثية لا تُضاهى.",
        fr: "La plus grande variété de programmes au monde et des opportunités de recherche inégalées.",
        es: "La gama de programas más amplia del mundo y oportunidades de investigación inigualables.",
        hi: "दुनिया में कार्यक्रमों की सबसे विस्तृत श्रृंखला और बेजोड़ शोध अवसर।",
      },
      notes: {
        en: "An I-20 form and F-1 visa are required, with a SEVIS fee and an embassy interview.",
        ar: "يلزم نموذج I-20 وتأشيرة F-1 مع رسوم SEVIS ومقابلة في السفارة.",
        fr: "Un formulaire I-20 et un visa F-1 sont requis, avec des frais SEVIS et un entretien à l'ambassade.",
        es: "Se requiere un formulario I-20 y visa F-1, con tarifa SEVIS y entrevista en la embajada.",
        hi: "I-20 फ़ॉर्म और F-1 वीज़ा आवश्यक है, साथ में SEVIS शुल्क और दूतावास साक्षात्कार।",
      },
    },
    {
      id: "uk", flag: "🇬🇧", name: "United Kingdom",
      region: { en: "Western Europe", ar: "غرب أوروبا", fr: "Europe de l'Ouest", es: "Europa Occidental", hi: "पश्चिमी यूरोप" },
      tuition: "£11,000 – £25,000", living: "£1,000 – £1,500",
      proof: "≈ £9,200+", langs: "English",
      intake: { en: "Sept / Jan", ar: "سبتمبر / يناير", fr: "Sept. / Jan.", es: "Sept / Ene", hi: "सितंबर / जनवरी" },
      work: { en: "Up to 20h/week", ar: "حتى 20 ساعة/أسبوع", fr: "Jusqu'à 20h/sem.", es: "Hasta 20h/semana", hi: "20 घंटे/सप्ताह तक" },
      unis: ["University of Manchester", "King's College London", "University of Leeds"],
      desc: {
        en: "Shorter degrees, globally recognised qualifications and a 2-year graduate work visa.",
        ar: "درجات أقصر، شهادات معترف بها عالمياً، وتأشيرة عمل للخريجين لمدة سنتين.",
        fr: "Diplômes plus courts, qualifications reconnues mondialement et visa de travail post-diplôme de 2 ans.",
        es: "Títulos más cortos, cualificaciones reconocidas mundialmente y visado de trabajo de 2 años tras graduarse.",
        hi: "छोटी डिग्रियाँ, वैश्विक रूप से मान्य योग्यताएँ और 2-वर्षीय ग्रेजुएट वर्क वीज़ा।",
      },
      notes: {
        en: "A Student Route visa and CAS from your university are required. IELTS is often needed.",
        ar: "تلزم تأشيرة Student Route وخطاب CAS من جامعتك. غالباً ما يُطلب IELTS.",
        fr: "Un visa Student Route et un CAS de votre université sont requis. L'IELTS est souvent nécessaire.",
        es: "Se requiere visado Student Route y un CAS de tu universidad. Suele necesitarse IELTS.",
        hi: "Student Route वीज़ा और आपके विश्वविद्यालय से CAS आवश्यक है। अक्सर IELTS चाहिए।",
      },
    },
  ];

  function t(key) { return window.I18N ? window.I18N.get(key) : key; }

  function arrowSvg() {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
  }

  function cardHTML(c) {
    return `
    <a href="country-details.html?c=${c.id}" class="card country-card reveal">
      <div class="top"><span class="flag">${c.flag}</span><div><h3>${c.name}</h3><span class="region">${L(c.region)}</span></div></div>
      <div class="body">
        <p>${L(c.desc)}</p>
        <div>
          <div class="kv"><span>${t("countriesPage.tuition")}</span><b>${L(c.tuition)}</b></div>
          <div class="kv"><span>${t("countriesPage.living")}</span><b>${L(c.living)}</b></div>
          <div class="kv"><span>${t("countriesPage.intake")}</span><b>${L(c.intake)}</b></div>
        </div>
        <span class="go">${t("countriesPage.cta")} ${arrowSvg()}</span>
      </div>
    </a>`;
  }

  function reveal(container) {
    container.querySelectorAll(".reveal").forEach((e) => e.classList.add("in"));
  }

  const Countries = {
    all: DATA,
    get(id) { return DATA.find((c) => c.id === id); },

    renderHome(containerId, count) {
      const el = document.getElementById(containerId);
      if (!el) return;
      el.innerHTML = DATA.slice(0, count || 3).map(cardHTML).join("");
      reveal(el);
    },

    renderList(containerId) {
      const el = document.getElementById(containerId);
      if (!el) return;
      el.innerHTML = DATA.map(cardHTML).join("");
      reveal(el);
    },

    renderDetail(rootId) {
      const root = document.getElementById(rootId);
      if (!root) return;
      const params = new URLSearchParams(location.search);
      const c = this.get(params.get("c"));
      if (!c) { root.innerHTML = `<p class="center text-dim">${t("countryDetail.notFound")}</p>`; return; }

      document.title = c.name + " — " + window.SITE.brand;
      const unis = c.unis.map((u) => `<li><span class="dot"></span>${u}</li>`).join("");

      root.innerHTML = `
      <div class="container">
        <a href="countries.html" class="go" style="display:inline-flex;align-items:center;gap:8px;color:var(--cyan-300);font-weight:700;margin-bottom:24px">
          <span class="arrow-ic" style="display:inline-flex;transform:scaleX(-1)">${arrowSvg()}</span> ${t("countryDetail.back")}
        </a>
        <div class="detail-hero">
          <div>
            <div class="flag-xl">${c.flag}</div>
            <h1 style="font-size:clamp(2rem,5vw,3rem);font-weight:800;margin-top:10px">${c.name}</h1>
            <p class="text-dim" style="font-size:1.1rem;margin-top:8px">${L(c.region)} · ${L(c.desc)}</p>
            <a href="assessment.html" class="btn btn-primary btn-lg mt-2" data-i18n="common.getStarted"></a>
          </div>
          <div class="card">
            <div class="kv"><span>${t("countryDetail.tuition")}</span><b>${L(c.tuition)}</b></div>
            <div class="kv"><span>${t("countryDetail.living")}</span><b>${L(c.living)}</b></div>
            <div class="kv"><span>${t("countryDetail.visa")}</span><b>${L(c.proof)}</b></div>
            <div class="kv"><span>${t("countryDetail.language")}</span><b>${L(c.langs)}</b></div>
            <div class="kv"><span>${t("countryDetail.intake")}</span><b>${L(c.intake)}</b></div>
            <div class="kv"><span>${t("countryDetail.work")}</span><b>${L(c.work)}</b></div>
          </div>
        </div>

        <div class="detail-grid" style="margin-top:40px">
          <div class="card" style="grid-column:span 2">
            <h3 style="font-size:1.3rem;font-weight:750;margin-bottom:10px">${t("countryDetail.visaNotes")}</h3>
            <p class="text-dim">${L(c.notes)}</p>
            <h3 style="font-size:1.3rem;font-weight:750;margin:22px 0 6px">${t("countryDetail.topUnis")}</h3>
            <ul class="uni-list">${unis}</ul>
          </div>
          <div class="cta-band" style="display:flex;flex-direction:column;justify-content:center">
            <h2 style="font-size:1.5rem">${t("countryDetail.ctaTitle")}</h2>
            <p style="margin:12px 0 20px">${t("countryDetail.ctaLead")}</p>
            <a href="assessment.html" class="btn btn-primary" data-i18n="nav.startCta"></a>
          </div>
        </div>
      </div>`;
      window.I18N.apply(root);
      reveal(root);
    },
  };

  window.Countries = Countries;
})();
