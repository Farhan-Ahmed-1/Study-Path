/* =====================================================================
   Forum — mock threads + category filter. Display-only preview.
   Thread titles/excerpts are localized {lang} maps.
   ===================================================================== */
(function () {
  "use strict";

  function L(f) {
    if (f == null) return "";
    if (typeof f === "string") return f;
    const c = window.I18N ? window.I18N.current : "en";
    return f[c] || f.en || "";
  }
  function t(k) { return window.I18N ? window.I18N.get(k) : k; }

  const CATS = ["all", "visa", "money", "spain", "france", "life"];

  const THREADS = [
    {
      cat: "money", author: "Sara B.", color: "#3b6fff,#34d6ec", replies: 24, views: 312, time: "2h",
      title: { en: "How did you prepare proof of funds for €8,000?", ar: "كيف جهّزتم إثبات الأموال بقيمة 8000 يورو؟", fr: "Comment avez-vous préparé la preuve de fonds de 8 000 € ?", es: "¿Cómo prepararon la prueba de fondos de 8.000 €?", hi: "आपने €8,000 के लिए फ़ंड का प्रमाण कैसे तैयार किया?" },
      excerpt: { en: "Sharing my bank statement timeline — what worked and what didn't.", ar: "أشارك جدول كشف حسابي — ما نجح وما لم ينجح.", fr: "Je partage la chronologie de mon relevé bancaire — ce qui a marché ou non.", es: "Comparto la cronología de mi extracto bancario — qué funcionó y qué no.", hi: "मैं अपने बैंक स्टेटमेंट की समयरेखा साझा कर रहा हूँ — क्या काम आया और क्या नहीं।" },
    },
    {
      cat: "spain", author: "Yassine M.", color: "#ff7a18,#ffb347", replies: 18, views: 256, time: "5h",
      title: { en: "NIE appointment in Spain — step by step", ar: "موعد NIE في إسبانيا — خطوة بخطوة", fr: "Rendez-vous NIE en Espagne — étape par étape", es: "Cita NIE en España — paso a paso", hi: "स्पेन में NIE अपॉइंटमेंट — चरण दर चरण" },
      excerpt: { en: "Here's the exact process I followed after landing in Valencia.", ar: "هذه العملية الدقيقة التي اتبعتها بعد وصولي إلى فالنسيا.", fr: "Voici la procédure exacte que j'ai suivie après mon arrivée à Valence.", es: "Este es el proceso exacto que seguí tras llegar a Valencia.", hi: "वालेंसिया पहुँचने के बाद मैंने जो सटीक प्रक्रिया अपनाई वह यहाँ है।" },
    },
    {
      cat: "visa", author: "Imane K.", color: "#34d6ec,#6ee7f5", replies: 31, views: 489, time: "1d",
      title: { en: "Campus France interview — questions they asked me", ar: "مقابلة Campus France — الأسئلة التي طُرحت عليّ", fr: "Entretien Campus France — les questions qu'on m'a posées", es: "Entrevista Campus France — las preguntas que me hicieron", hi: "Campus France साक्षात्कार — मुझसे पूछे गए सवाल" },
      excerpt: { en: "Full list of questions and how I answered them honestly.", ar: "قائمة كاملة بالأسئلة وكيف أجبت عنها بصدق.", fr: "Liste complète des questions et comment j'y ai répondu honnêtement.", es: "Lista completa de preguntas y cómo las respondí con honestidad.", hi: "सवालों की पूरी सूची और मैंने उन्हें ईमानदारी से कैसे जवाब दिया।" },
    },
    {
      cat: "france", author: "Omar T.", color: "#3b6fff,#5b8bff", replies: 12, views: 178, time: "1d",
      title: { en: "Cheapest cities for students in France?", ar: "أرخص المدن للطلاب في فرنسا؟", fr: "Les villes les moins chères pour étudiants en France ?", es: "¿Ciudades más baratas para estudiantes en Francia?", hi: "फ़्रांस में छात्रों के लिए सबसे सस्ते शहर?" },
      excerpt: { en: "Comparing rent and transport in Lille, Lyon and Toulouse.", ar: "مقارنة الإيجار والنقل في ليل وليون وتولوز.", fr: "Comparaison du loyer et des transports à Lille, Lyon et Toulouse.", es: "Comparando alquiler y transporte en Lille, Lyon y Toulouse.", hi: "लिल, ल्यों और तुलूज़ में किराया और परिवहन की तुलना।" },
    },
    {
      cat: "life", author: "Nadia R.", color: "#ff7a18,#ff9a4d", replies: 27, views: 401, time: "2d",
      title: { en: "Finding part-time work as an international student", ar: "إيجاد عمل بدوام جزئي كطالب دولي", fr: "Trouver un emploi à temps partiel en tant qu'étudiant international", es: "Encontrar trabajo a tiempo parcial como estudiante internacional", hi: "अंतरराष्ट्रीय छात्र के रूप में अंशकालिक काम ढूँढना" },
      excerpt: { en: "Realistic tips that actually helped me land my first job.", ar: "نصائح واقعية ساعدتني فعلاً في الحصول على أول عمل.", fr: "Des conseils réalistes qui m'ont vraiment aidé à décrocher mon premier emploi.", es: "Consejos realistas que de verdad me ayudaron a conseguir mi primer trabajo.", hi: "व्यावहारिक सुझाव जिन्होंने सच में मुझे पहली नौकरी दिलाने में मदद की।" },
    },
    {
      cat: "money", author: "Hamza L.", color: "#34d6ec,#3b6fff", replies: 9, views: 143, time: "3d",
      title: { en: "Scholarships worth applying to from Morocco", ar: "منح دراسية تستحق التقديم من المغرب", fr: "Bourses qui valent la peine depuis le Maroc", es: "Becas que vale la pena solicitar desde Marruecos", hi: "मोरक्को से आवेदन करने लायक छात्रवृत्तियाँ" },
      excerpt: { en: "A short list of scholarships with realistic chances.", ar: "قائمة قصيرة بالمنح ذات الفرص الواقعية.", fr: "Une courte liste de bourses avec des chances réalistes.", es: "Una breve lista de becas con posibilidades realistas.", hi: "वास्तविक संभावनाओं वाली छात्रवृत्तियों की छोटी सूची।" },
    },
  ];

  function avatarLetter(name) { return name.trim().charAt(0).toUpperCase(); }

  function threadHTML(th) {
    const [c1, c2] = th.color.split(",");
    return `
    <div class="card thread reveal">
      <span class="avatar" style="background:linear-gradient(135deg,${c1},${c2})">${avatarLetter(th.author)}</span>
      <div class="meta">
        <h3>${L(th.title)}</h3>
        <p class="text-dim" style="font-size:.92rem;margin-bottom:8px">${L(th.excerpt)}</p>
        <div class="sub">
          <span>${t("forumPage.by")} ${th.author}</span>
          <span class="tag">${t("forumPage.cats." + th.cat)}</span>
          <span>· ${th.time}</span>
        </div>
      </div>
      <div class="stats">
        <div><b>${th.replies}</b><span>${t("forumPage.replies")}</span></div>
        <div><b>${th.views}</b><span>${t("forumPage.views")}</span></div>
      </div>
    </div>`;
  }

  let activeCat = "all";

  function render() {
    const catsEl = document.getElementById("forum-cats");
    const listEl = document.getElementById("forum-threads");
    if (!catsEl || !listEl) return;

    catsEl.innerHTML = CATS.map((cat) => {
      const count = cat === "all" ? THREADS.length : THREADS.filter((x) => x.cat === cat).length;
      return `<button class="cat-chip${cat === activeCat ? " active" : ""}" data-cat="${cat}">
        <span>${t("forumPage.cats." + cat)}</span><span class="count">${count}</span></button>`;
    }).join("");

    const list = activeCat === "all" ? THREADS : THREADS.filter((x) => x.cat === activeCat);
    listEl.innerHTML = list.map(threadHTML).join("");
    listEl.querySelectorAll(".reveal").forEach((e) => e.classList.add("in"));

    catsEl.querySelectorAll(".cat-chip").forEach((b) =>
      b.addEventListener("click", () => { activeCat = b.dataset.cat; render(); })
    );
  }

  window.Forum = { render };
  window.addEventListener("components:ready", render);
  window.addEventListener("languagechange", render);
})();
