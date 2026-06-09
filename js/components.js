/* =====================================================================
   Shared components — injects navbar + trust strip + footer on every
   page, the site-wide "Book free consultation" modal and the floating
   WhatsApp button, and wires the language switcher, mobile menu and
   scroll-reveal. One source of truth.
   ===================================================================== */
(function () {
  "use strict";

  /* ---- Editable site config (change these to your real details) ---- */
  const SITE = {
    brand: "Prime Education Group",
    whatsapp: "447849742063",                 // +44 7849 742063
    formUrl: "#",                              // TODO: real consultation form / CRM link
    email: "hello@primeeducation.group",       // TODO: real email
    instagram: "#",
    facebook: "#",
    tiktok: "#",
    logo: "logo_prime.png",
  };
  window.SITE = SITE;

  const PAGES = [
    { href: "index.html", key: "nav.home" },
    { href: "countries.html", key: "nav.countries" },
    { href: "assessment.html", key: "nav.assessment" },
    { href: "support.html", key: "nav.support" },
    { href: "forum.html", key: "nav.forum" },
    { href: "contact.html", key: "nav.contact" },
  ];

  const ICON = {
    chev: '<svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>',
    menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
    insta: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="6"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>',
    fb: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M14 9h3V6h-3c-2.2 0-4 1.8-4 4v2H7v3h3v7h3v-7h3l1-3h-4v-2c0-.6.4-1 1-1z"/></svg>',
    tiktok: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M16 3c.3 2.3 1.9 4 4 4.2V10c-1.5 0-2.9-.5-4-1.3V15a6 6 0 11-6-6c.3 0 .7 0 1 .1V12a3 3 0 102 2.8V3h3z"/></svg>',
    wa: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 00-8.5 15.2L2 22l4.9-1.3A10 10 0 1012 2zm0 18a8 8 0 01-4.1-1.1l-.3-.2-2.9.8.8-2.8-.2-.3A8 8 0 1112 20zm4.4-6c-.2-.1-1.4-.7-1.6-.8s-.4-.1-.5.1-.6.8-.8 1-.3.2-.5.1a6.5 6.5 0 01-1.9-1.2 7.3 7.3 0 01-1.3-1.7c-.1-.2 0-.4.1-.5l.4-.4.2-.4v-.4l-.8-1.8c-.2-.5-.4-.4-.5-.4h-.5a1 1 0 00-.7.3A2.8 2.8 0 006 8.3c0 1.7 1.2 3.3 1.4 3.5s2.4 3.7 5.8 5c2 .8 2.4.6 2.9.6s1.4-.6 1.6-1.1.2-1 .2-1.1-.3-.2-.5-.3z"/></svg>',
  };

  function logoBrand() {
    return `<a href="index.html" class="brand" aria-label="${SITE.brand}">
      <span class="brandmark">
        <span class="bm-name">Prim<span class="bm-i">e</span><span class="bm-nib"></span></span>
        <span class="bm-sub"><span class="ln"></span>Education Group<span class="ln"></span></span>
      </span>
    </a>`;
  }

  function currentPage() {
    const p = location.pathname.split("/").pop() || "index.html";
    return p === "" ? "index.html" : p;
  }

  function buildNav() {
    const cur = currentPage();
    const links = PAGES.map(
      (p) => `<a href="${p.href}" data-i18n="${p.key}"${p.href === cur ? ' class="active"' : ""}></a>`
    ).join("");

    const langBtns = window.I18N.langs
      .map(
        (l) =>
          `<button data-lang="${l.code}"><span class="flag">${l.flag}</span><span data-lang-label>${l.label}</span><span class="native">${l.native}</span></button>`
      )
      .join("");

    return `
    <header class="nav" id="siteNav">
      <div class="container">
        ${logoBrand()}
        <nav class="nav-links" id="navLinks">
          ${links}
        </nav>
        <div class="nav-actions">
          <div class="lang" id="langSwitch">
            <button class="lang-btn" id="langBtn" aria-haspopup="true" aria-expanded="false">
              <span class="flag" id="langFlag"></span><span id="langCode"></span>${ICON.chev}
            </button>
            <div class="lang-menu" id="langMenu" role="menu">${langBtns}</div>
          </div>
          <button class="btn btn-gold" data-i18n="nav.book" onclick="openModal()"></button>
        </div>
        <button class="nav-toggle" id="navToggle" aria-label="Menu">${ICON.menu}</button>
      </div>
    </header>`;
  }

  function buildTrust() {
    return `
    <div class="trust">
      <div class="row">
        <span><b>★</b> <span data-i18n="trust.t1"></span></span>
        <span class="dot"></span>
        <span data-i18n="trust.t2"></span>
        <span class="dot"></span>
        <span data-i18n="trust.t3"></span>
        <span class="dot"></span>
        <span data-i18n="trust.t4"></span>
      </div>
    </div>`;
  }

  function buildFooter() {
    const y = new Date().getFullYear();
    return `
    <footer class="footer">
      <div class="container">
        <div class="footer-grid">
          <div>
            <a href="index.html" class="foot-logo" aria-label="${SITE.brand}"><img src="${SITE.logo}" alt="${SITE.brand}"></a>
            <p class="about" data-i18n="footer.about"></p>
            <div class="socials">
              <a href="${SITE.instagram}" aria-label="Instagram">${ICON.insta}</a>
              <a href="${SITE.facebook}" aria-label="Facebook">${ICON.fb}</a>
              <a href="${SITE.tiktok}" aria-label="TikTok">${ICON.tiktok}</a>
              <a href="https://wa.me/${SITE.whatsapp}" aria-label="WhatsApp">${ICON.wa}</a>
            </div>
          </div>
          <div>
            <h4 data-i18n="footer.exploreTitle"></h4>
            <ul>
              <li><a href="assessment.html" data-i18n="footer.a1"></a></li>
              <li><a href="countries.html" data-i18n="footer.a2"></a></li>
              <li><a href="forum.html" data-i18n="footer.a3"></a></li>
            </ul>
          </div>
          <div>
            <h4 data-i18n="footer.resourcesTitle"></h4>
            <ul>
              <li><a href="assessment.html" data-i18n="footer.r1"></a></li>
              <li><a href="countries.html" data-i18n="footer.r2"></a></li>
              <li><a href="forum.html" data-i18n="footer.r3"></a></li>
            </ul>
          </div>
          <div>
            <h4 data-i18n="footer.companyTitle"></h4>
            <ul>
              <li><a href="index.html" data-i18n="footer.c1"></a></li>
              <li><a href="contact.html" data-i18n="footer.c2"></a></li>
              <li><a href="contact.html" data-i18n="footer.c3"></a></li>
            </ul>
          </div>
        </div>
        <div class="footer-bottom">
          <span>© ${y} ${SITE.brand}. <span data-i18n="footer.rights"></span></span>
          <span data-i18n="footer.made"></span>
        </div>
      </div>
    </footer>`;
  }

  /* ---- Site-wide "Book free consultation" modal ---- */
  function buildModal() {
    const dest = ["United Kingdom", "Canada", "Germany", "France", "United States", "Spain"]
      .map((d) => `<option>${d}</option>`)
      .join("");
    return `
    <div class="modal-bg" id="consultModal">
      <div class="modal">
        <button class="x" onclick="closeModal()" aria-label="Close">×</button>
        <div id="form-view">
          <h3 data-i18n="modal.title"></h3>
          <p data-i18n="modal.lead"></p>
          <label data-i18n="modal.name"></label>
          <input id="m-name" type="text" data-i18n-attr="placeholder:modal.namePh" />
          <label data-i18n="modal.dest"></label>
          <select id="m-dest">${dest}<option data-i18n="modal.notSure"></option></select>
          <label data-i18n="modal.wa"></label>
          <input id="m-wa" type="tel" data-i18n-attr="placeholder:modal.waPh" />
          <button class="btn btn-gold" onclick="submitConsult()" data-i18n="modal.submit"></button>
        </div>
        <div id="ok-view" style="display:none">
          <div class="ok">
            <div class="tick">✓</div>
            <h3 data-i18n="modal.okTitle"></h3>
            <p data-i18n="modal.okMsg"></p>
            <button class="btn btn-gold" style="margin-top:18px" onclick="closeModal()" data-i18n="modal.close"></button>
          </div>
        </div>
      </div>
    </div>`;
  }

  function val(id) { const el = document.getElementById(id); return el ? el.value : ""; }

  window.openModal = function () {
    const m = document.getElementById("consultModal");
    if (!m) return;
    m.classList.add("on");
    const fv = document.getElementById("form-view");
    const ok = document.getElementById("ok-view");
    if (fv) fv.style.display = "block";
    if (ok) ok.style.display = "none";
  };
  window.closeModal = function () {
    const m = document.getElementById("consultModal");
    if (m) m.classList.remove("on");
  };
  window.submitConsult = function () {
    const intro = (window.I18N && window.I18N.get("modal.waIntro")) || "Hello Prime Education Group! I'd like to book a free consultation.";
    const msg = encodeURIComponent(
      intro + "\n\nName: " + val("m-name") + "\nDestination: " + val("m-dest") + "\nWhatsApp: " + val("m-wa")
    );
    try { window.open("https://wa.me/" + SITE.whatsapp + "?text=" + msg, "_blank"); } catch (e) {}
    const fv = document.getElementById("form-view");
    const ok = document.getElementById("ok-view");
    if (fv) fv.style.display = "none";
    if (ok) ok.style.display = "block";
  };

  function buildFloatWa() {
    return `<a href="https://wa.me/${SITE.whatsapp}" class="float-wa" target="_blank" rel="noopener" aria-label="WhatsApp">${ICON.wa}</a>`;
  }

  function wireLangSwitch() {
    const wrap = document.getElementById("langSwitch");
    const btn = document.getElementById("langBtn");
    const menu = document.getElementById("langMenu");
    const flag = document.getElementById("langFlag");
    const code = document.getElementById("langCode");

    function refreshButton() {
      const m = window.I18N.meta();
      flag.textContent = m.flag;
      code.textContent = m.code.toUpperCase();
      menu.querySelectorAll("button").forEach((b) => {
        b.classList.toggle("active", b.dataset.lang === window.I18N.current);
        const lbl = b.querySelector("[data-lang-label]");
        const meta = window.I18N.meta(b.dataset.lang);
        if (lbl) lbl.textContent = window.I18N.get("lang." + b.dataset.lang, meta.label);
      });
    }

    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      wrap.classList.toggle("open");
      btn.setAttribute("aria-expanded", wrap.classList.contains("open"));
    });
    menu.querySelectorAll("button").forEach((b) => {
      b.addEventListener("click", () => {
        window.I18N.set(b.dataset.lang);
        wrap.classList.remove("open");
      });
    });
    document.addEventListener("click", (e) => {
      if (!wrap.contains(e.target)) wrap.classList.remove("open");
    });

    window.addEventListener("languagechange", refreshButton);
    refreshButton();
  }

  function wireMobileNav() {
    const nav = document.getElementById("siteNav");
    const toggle = document.getElementById("navToggle");
    toggle.addEventListener("click", () => nav.classList.toggle("open"));
    document.querySelectorAll("#navLinks a").forEach((a) =>
      a.addEventListener("click", () => nav.classList.remove("open"))
    );
  }

  function wireReveal() {
    const els = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window) || !els.length) {
      els.forEach((e) => e.classList.add("in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => entries.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      }),
      { threshold: 0.12 }
    );
    els.forEach((e) => io.observe(e));
  }

  /* ---- Boot ---- */
  document.addEventListener("DOMContentLoaded", function () {
    const navMount = document.getElementById("nav-root");
    const footMount = document.getElementById("footer-root");
    if (navMount) navMount.innerHTML = buildNav() + buildTrust();
    if (footMount) footMount.innerHTML = buildFooter();

    // Site-wide modal + floating WhatsApp button.
    const extras = document.createElement("div");
    extras.innerHTML = buildModal() + buildFloatWa();
    document.body.appendChild(extras);
    const modal = document.getElementById("consultModal");
    if (modal) modal.addEventListener("click", function (e) { if (e.target === modal) window.closeModal(); });

    window.I18N.init();          // applies saved language across the whole page
    if (navMount) { wireLangSwitch(); wireMobileNav(); }

    // Let page-specific scripts render translatable content, then reveal.
    window.dispatchEvent(new CustomEvent("components:ready"));
    wireReveal();
  });
})();
