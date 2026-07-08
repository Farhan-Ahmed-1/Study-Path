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
    whatsapp: (window.SITE_CONFIG && window.SITE_CONFIG.whatsapp) || "2126XXXXXXXX",
    formUrl: "https://docs.google.com/forms/d/e/1FAIpQLSflaCkzDTBgWr_xWtWMYX-aAJiPZQuf0-aXgdoERDQAticmkQ/viewform?usp=pp_url",
    formResponseUrl: "https://docs.google.com/forms/d/e/1FAIpQLSflaCkzDTBgWr_xWtWMYX-aAJiPZQuf0-aXgdoERDQAticmkQ/formResponse",
    formEntries: {
      name: "entry.1778743459",
      destination: "entry.548490064",
      whatsapp: "entry.1143665063",
    },
    email: "hello@primeeducation.group",       // TODO: real email
    instagram: "#",
    facebook: "#",
    tiktok: "#",
    logo: "logo_prime.png",
    logoLight: "logo_prime_light.png",
  };
  window.SITE = SITE;

  const PAGES = [
    { href: "index.html", key: "nav.home" },
    { href: "about.html", key: "nav.about" },
    { href: "countries.html", key: "nav.countries" },
    { href: "level7.html", key: "nav.level7" },
    { href: "support.html", key: "nav.support" },
    { href: "contact.html", key: "nav.contact" },
    // Re-enable when content exists:
    // { href: "blog.html", key: "nav.blog" },
    // { href: "forum.html", key: "nav.forum" },
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
    return `<a href="index.html" class="brand nav-logo" aria-label="${SITE.brand}">
      <img src="${SITE.logoLight}" alt="${SITE.brand}">
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
          <div class="auth-slot" id="authSlot"></div>
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
              <li><a href="countries.html" data-i18n="footer.a2"></a></li>
              <li><a href="level7.html" data-i18n="footer.a4"></a></li>
              <li><a href="support.html" data-i18n="footer.a5"></a></li>
              <!-- Re-enable when content exists:
              <li><a href="blog.html" data-i18n="footer.a1"></a></li>
              <li><a href="forum.html" data-i18n="footer.a3"></a></li> -->
            </ul>
          </div>
          <div>
            <h4 data-i18n="footer.resourcesTitle"></h4>
            <ul>
              <li><a href="prime-academy.html" data-i18n="footer.r1"></a></li>
              <li><a href="countries.html" data-i18n="footer.r2"></a></li>
              <li><a href="assessment.html" data-i18n="footer.r4"></a></li>
            </ul>
          </div>
          <div>
            <h4 data-i18n="footer.companyTitle"></h4>
            <ul>
              <li><a href="about.html" data-i18n="footer.c1"></a></li>
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
    const destinations = ["United Kingdom", "Canada", "Germany", "France", "United States", "Spain"];
    const destOpts = destinations.map((d) => `<option>${d}</option>`).join("");
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
          <select id="m-dest">${destOpts}<option data-i18n="modal.notSure"></option></select>
          <button class="btn btn-gold" style="width:100%;margin-top:18px" onclick="submitConsultWA()" data-i18n="modal.waBtn"></button>
          <p style="margin-top:10px;font-size:0.78rem;color:var(--muted,#888);text-align:center" data-i18n="modal.waSub"></p>
        </div>
        <div id="ok-view" style="display:none">
          <div class="ok">
            <div class="tick">✓</div>
            <h3 data-i18n="modal.okTitle"></h3>
            <p data-i18n="modal.okMsg"></p>
            <button class="btn btn-gold" style="margin-top:18px" onclick="closeModal()" data-i18n="modal.close"></button>
          </div>
        </div>
        <div id="error-view" style="display:none">
          <div class="ok">
            <p data-i18n="modal.errMsg"></p>
            <a id="modal-direct-wa" class="btn btn-gold" style="display:block;text-align:center;margin-top:12px" target="_blank" rel="noopener" data-i18n="modal.waBtn"></a>
            <button class="btn btn-ghost" style="margin-top:10px;width:100%" onclick="closeModal()" data-i18n="modal.close"></button>
          </div>
        </div>
      </div>
    </div>`;
  }

  function val(id) { const el = document.getElementById(id); return el ? el.value : ""; }

  function addHiddenField(form, name, value) {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = name;
    input.value = value;
    form.appendChild(input);
  }

  /* Fires Google Form silently in the background — backup data capture only. */
  function submitConsultFormBackground(name, dest) {
    const frameName = "consult-submit-frame";
    let frame = document.querySelector('iframe[name="' + frameName + '"]');
    if (!frame) {
      frame = document.createElement("iframe");
      frame.name = frameName;
      frame.style.display = "none";
      document.body.appendChild(frame);
    }
    const form = document.createElement("form");
    form.action = SITE.formResponseUrl;
    form.method = "POST";
    form.target = frameName;
    form.style.display = "none";
    addHiddenField(form, SITE.formEntries.name, name);
    addHiddenField(form, SITE.formEntries.destination, dest);
    addHiddenField(form, SITE.formEntries.whatsapp, "via-whatsapp");
    addHiddenField(form, "fvv", "1");
    addHiddenField(form, "pageHistory", "0");
    document.body.appendChild(form);
    try { form.submit(); } catch (e) { console.warn("[Modal] Form backup failed:", e); }
    form.remove();
  }

  window.openModal = function () {
    const m = document.getElementById("consultModal");
    if (!m) return;
    m.classList.add("on");
    const fv = document.getElementById("form-view");
    const ok = document.getElementById("ok-view");
    const err = document.getElementById("error-view");
    if (fv) fv.style.display = "block";
    if (ok) ok.style.display = "none";
    if (err) err.style.display = "none";
  };
  window.closeModal = function () {
    const m = document.getElementById("consultModal");
    if (m) m.classList.remove("on");
  };

  /* WhatsApp-primary submission: open WA chat + silent form backup. */
  window.submitConsultWA = function () {
    const name = val("m-name").trim();
    const dest = val("m-dest").trim();
    const waNumber = SITE.whatsapp;
    const msg = encodeURIComponent(
      "Hi Prime Education Group! I’d like to book a free consultation.\n" +
      "Name: " + (name || "—") + "\n" +
      "Destination: " + (dest || "Not decided yet")
    );
    const waUrl = "https://wa.me/" + waNumber + "?text=" + msg;

    console.log("[Modal] Consultation submitted:", new Date().toISOString(), { name, dest });

    window.open(waUrl, "_blank", "noopener,noreferrer");
    submitConsultFormBackground(name, dest);

    const fv = document.getElementById("form-view");
    const ok = document.getElementById("ok-view");
    if (fv) fv.style.display = "none";
    if (ok) ok.style.display = "block";
  };

  /* ---- Site-wide sign in / sign up modal ---- */
  function buildAuthModal() {
    return `
    <div class="modal-bg" id="authModal">
      <div class="modal">
        <button class="x" onclick="closeAuthModal()" aria-label="Close">×</button>
        <div id="signin-view">
          <h3 data-i18n="auth.signInTitle"></h3>
          <p class="auth-lead" data-i18n="auth.signInLead"></p>
          <label data-i18n="auth.email"></label>
          <input id="a-in-email" type="email" data-i18n-attr="placeholder:auth.emailPh" />
          <label data-i18n="auth.password"></label>
          <input id="a-in-password" type="password" data-i18n-attr="placeholder:auth.passwordPh" />
          <p class="auth-error" id="authInError" style="display:none"></p>
          <button class="btn btn-gold" onclick="submitSignIn()" data-i18n="auth.signInBtn"></button>
          <p class="auth-switch"><a onclick="showAuthView('signup')" data-i18n="auth.toSignUp"></a></p>
        </div>
        <div id="signup-view" style="display:none">
          <h3 data-i18n="auth.signUpTitle"></h3>
          <p class="auth-lead" data-i18n="auth.signUpLead"></p>
          <label data-i18n="auth.name"></label>
          <input id="a-up-name" type="text" data-i18n-attr="placeholder:auth.namePh" />
          <label data-i18n="auth.email"></label>
          <input id="a-up-email" type="email" data-i18n-attr="placeholder:auth.emailPh" />
          <label data-i18n="auth.password"></label>
          <input id="a-up-password" type="password" data-i18n-attr="placeholder:auth.passwordPh" />
          <p class="auth-error" id="authUpError" style="display:none"></p>
          <button class="btn btn-gold" onclick="submitSignUp()" data-i18n="auth.signUpBtn"></button>
          <p class="auth-switch"><a onclick="showAuthView('signin')" data-i18n="auth.toSignIn"></a></p>
        </div>
      </div>
    </div>`;
  }

  window.showAuthView = function (view) {
    const inView = document.getElementById("signin-view");
    const upView = document.getElementById("signup-view");
    if (inView) inView.style.display = view === "signin" ? "block" : "none";
    if (upView) upView.style.display = view === "signup" ? "block" : "none";
  };

  window.openAuthModal = function (view) {
    const m = document.getElementById("authModal");
    if (!m) return;
    m.classList.add("on");
    window.showAuthView(view || "signin");
  };

  window.closeAuthModal = function () {
    const m = document.getElementById("authModal");
    if (m) m.classList.remove("on");
  };

  function showAuthError(id, err) {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = (err && err.message) || window.I18N.get("auth.error");
    el.style.display = "block";
  }

  window.submitSignIn = function () {
    const err = document.getElementById("authInError");
    if (err) err.style.display = "none";
    window.Auth.signIn(val("a-in-email"), val("a-in-password"))
      .then(function () { window.closeAuthModal(); })
      .catch(function (e) { showAuthError("authInError", e); });
  };

  window.submitSignUp = function () {
    const err = document.getElementById("authUpError");
    if (err) err.style.display = "none";
    window.Auth.signUp(val("a-up-name"), val("a-up-email"), val("a-up-password"))
      .then(function (user) { window.closeAuthModal(); renderAuthSlot(user); })
      .catch(function (e) { showAuthError("authUpError", e); });
  };

  function renderAuthSlot(user) {
    const slot = document.getElementById("authSlot");
    if (!slot) return;
    if (user) {
      slot.innerHTML = `<div class="auth-account">
        <span class="auth-name">${(user.displayName || user.email || "").replace(/</g, "&lt;")}</span>
        <button class="btn btn-ghost btn-sm" data-i18n="nav.logout" onclick="Auth.signOut()"></button>
      </div>`;
    } else {
      slot.innerHTML = `<button class="btn btn-ghost" data-i18n="nav.signin" onclick="openAuthModal('signin')"></button>`;
    }
    window.I18N.apply(slot);
  }

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
    extras.innerHTML = buildModal() + buildAuthModal() + buildFloatWa();
    document.body.appendChild(extras);
    const modal = document.getElementById("consultModal");
    if (modal) modal.addEventListener("click", function (e) { if (e.target === modal) window.closeModal(); });
    const authModal = document.getElementById("authModal");
    if (authModal) authModal.addEventListener("click", function (e) { if (e.target === authModal) window.closeAuthModal(); });

    window.I18N.init();          // applies saved language across the whole page
    if (navMount) { wireLangSwitch(); wireMobileNav(); }
    // Re-enable when user accounts are part of the public experience:
    // if (navMount && window.Auth) window.Auth.onChange(renderAuthSlot);

    // Let page-specific scripts render translatable content, then reveal.
    window.dispatchEvent(new CustomEvent("components:ready"));
    wireReveal();
  });
})();
