/* =====================================================================
   Countries — data lives in Firestore ("countries" collection, one doc
   per destination) and is added/edited by the admin directly in the
   Firebase console. This file renders the home strip, the countries
   list, and the country-details page from that data.

   Firestore doc shape (collection "countries", doc id = slug e.g. "france"):
     flag, name           — plain strings
     region, intake, work, desc, notes, afterGraduation — {en, ar, fr} localized maps
     currency             — "EUR" | "USD" | "GBP" | "CAD"
     tuitionMin/Max        — per year, numeric (overall range across partner universities)
     livingMin/Max         — per month, numeric
     proofAmount           — numeric
     flightEstimate        — numeric, in MAD
     langs                 — plain string
     unis                  — [{ name, type: "private"|"public", tuitionMin, tuitionMax }, ...]
     visaSteps              — [{en, ar, fr}, ...] ordered checklist
     profile                — { capital, population, currencyName (plain strings),
                                 climate, terrain, keyIndustries, gdp ({en,ar,fr} maps) }
     order                  — display order
   ===================================================================== */
(function () {
  "use strict";

  function L(field) {
    if (field == null) return "";
    if (typeof field === "string") return field;
    const c = window.I18N ? window.I18N.current : "en";
    return field[c] || field.en || "";
  }

  const CURRENCY_SYMBOL = { EUR: "€", USD: "$", GBP: "£", CAD: "CA$", AUD: "A$" };
  const UNI_PREVIEW_COUNT = 8;

  function fmtMoney(amount, currency) {
    if (amount == null) return "";
    return (CURRENCY_SYMBOL[currency] || "") + Number(amount).toLocaleString();
  }
  function fmtRange(min, max, currency) {
    if (min == null || max == null) return "";
    return fmtMoney(min, currency) + " – " + fmtMoney(max, currency);
  }

  let DATA = [];

  function loadCountries() {
    if (!window.FIREBASE_READY) return Promise.resolve([]);
    return window.db.collection("countries").orderBy("order").get().then((snap) => {
      DATA = snap.docs.map((d) => Object.assign({ id: d.id }, d.data()));
      return DATA;
    });
  }

  function t(key) { return window.I18N ? window.I18N.get(key) : key; }

  function arrowSvg() {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
  }

  function cardHTML(c) {
    return `
    <a href="country-details.html?c=${c.id}" class="card country-card reveal in">
      <div class="top"><span class="flag">${c.flag}</span><div><h3>${c.name}</h3><span class="region">${L(c.region)}</span></div></div>
      <div class="body">
        <p>${L(c.desc)}</p>
        <div>
          <div class="kv"><span>${t("countriesPage.tuition")}</span><b>${fmtRange(c.tuitionMin, c.tuitionMax, c.currency)}</b></div>
          <div class="kv"><span>${t("countriesPage.living")}</span><b>${fmtRange(c.livingMin, c.livingMax, c.currency)}</b></div>
          <div class="kv"><span>${t("countriesPage.intake")}</span><b>${L(c.intake)}</b></div>
        </div>
        <span class="go">${t("countriesPage.cta")} ${arrowSvg()}</span>
      </div>
    </a>`;
  }

  function reveal(container) {
    container.querySelectorAll(".reveal").forEach((e) => e.classList.add("in"));
  }

  function scholarshipsSection(id) {
    if (!window.FIREBASE_READY) return Promise.resolve("");
    return window.db.collection("posts").where("type", "==", "scholarship").where("country", "==", id).get()
      .then((snap) => {
        if (snap.empty) return "";
        const items = snap.docs.map((d) => d.data()).map((p) => `
          <div class="card" style="margin-bottom:12px">
            <div class="blog-meta"><span class="blog-date">${p.date || ""}</span></div>
            <h4 style="font-weight:700;margin:6px 0">${p.title || ""}</h4>
            <p class="text-dim" style="font-size:.92rem">${p.body || ""}</p>
          </div>`).join("");
        return `
          <h3 style="font-size:1.3rem;font-weight:750;margin:22px 0 10px">${t("countryDetail.scholarshipsTitle")}</h3>
          ${items}`;
      }).catch(() => "");
  }

  const Countries = {
    all: DATA,
    get(id) { return DATA.find((c) => c.id === id); },
    L: L,
    fmtMoney: fmtMoney,
    fmtRange: fmtRange,

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
      if (!c) {
        root.innerHTML = `<p class="center text-dim">${window.FIREBASE_READY === false ? t("forumPage.offline") : t("countryDetail.notFound")}</p>`;
        return;
      }

      document.title = c.name + " — " + window.SITE.brand;
      const uniItemHTML = (u) => `
        <li><span class="dot"></span>
          <div style="flex:1">
            <div>${u.name}<span class="tag" style="margin-inline-start:8px">${t("countryDetail." + (u.type === "public" ? "publicUni" : "privateUni"))}</span></div>
            ${u.tuitionMin != null ? `<div class="text-dim" style="font-size:.85rem;margin-top:2px">${fmtRange(u.tuitionMin, u.tuitionMax, c.currency)} / ${t("countryDetail.perYear")}</div>` : ""}
          </div>
        </li>`;
      const allUnis = c.unis || [];
      const unisPreview = allUnis.slice(0, UNI_PREVIEW_COUNT).map(uniItemHTML).join("");
      const unisRest = allUnis.slice(UNI_PREVIEW_COUNT).map(uniItemHTML).join("");
      const unisMore = unisRest
        ? `<ul class="uni-list" style="display:none">${unisRest}</ul>
           <button class="btn btn-ghost btn-sm" style="margin-top:12px" onclick="this.previousElementSibling.style.display='block';this.remove()">${t("countryDetail.showAllUnis").replace("{n}", allUnis.length)}</button>`
        : "";
      const steps = (c.visaSteps || []).map((s, i) =>
        `<li><span class="dot"></span><b>${i + 1}.</b> ${L(s)}</li>`).join("");
      const p = c.profile || {};
      const profileRows = [
        [t("countryDetail.capital"), p.capital],
        [t("countryDetail.population"), p.population],
        [t("countryDetail.currencyName"), p.currencyName],
        [t("countryDetail.climate"), L(p.climate)],
        [t("countryDetail.terrain"), L(p.terrain)],
        [t("countryDetail.keyIndustries"), L(p.keyIndustries)],
        [t("countryDetail.gdp"), L(p.gdp)],
      ].filter((row) => row[1]);

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
            <div class="kv"><span>${t("countryDetail.tuition")}</span><b>${fmtRange(c.tuitionMin, c.tuitionMax, c.currency)}</b></div>
            <div class="kv"><span>${t("countryDetail.living")}</span><b>${fmtRange(c.livingMin, c.livingMax, c.currency)}</b></div>
            <div class="kv"><span>${t("countryDetail.visa")}</span><b>${fmtMoney(c.proofAmount, c.currency)}</b></div>
            <div class="kv"><span>${t("countryDetail.language")}</span><b>${c.langs || ""}</b></div>
            <div class="kv"><span>${t("countryDetail.intake")}</span><b>${L(c.intake)}</b></div>
            <div class="kv"><span>${t("countryDetail.work")}</span><b>${L(c.work)}</b></div>
          </div>
        </div>

        ${profileRows.length ? `
        <div class="card" style="margin-top:40px">
          <h3 style="font-size:1.3rem;font-weight:750;margin-bottom:14px">${t("countryDetail.profileTitle")}</h3>
          ${profileRows.map((row) => `<div class="kv"><span>${row[0]}</span><b style="text-align:end;max-width:65%">${row[1]}</b></div>`).join("")}
        </div>` : ""}

        <div class="detail-grid" style="margin-top:40px">
          <div class="card" style="grid-column:span 2">
            <h3 style="font-size:1.3rem;font-weight:750;margin-bottom:10px">${t("countryDetail.visaNotes")}</h3>
            <p class="text-dim">${L(c.notes)}</p>
            ${steps ? `<h3 style="font-size:1.3rem;font-weight:750;margin:22px 0 6px">${t("countryDetail.visaStepsTitle")}</h3><ul class="uni-list">${steps}</ul>` : ""}
            <h3 style="font-size:1.3rem;font-weight:750;margin:22px 0 6px">${t("countryDetail.topUnis")}</h3>
            <ul class="uni-list">${unisPreview}</ul>
            ${unisMore}
            <div id="country-scholarships"></div>
          </div>
          <div class="cta-band" style="display:flex;flex-direction:column;justify-content:center">
            <h2 style="font-size:1.5rem">${t("countryDetail.ctaTitle")}</h2>
            <p style="margin:12px 0 20px">${t("countryDetail.ctaLead")}</p>
            <a href="assessment.html" class="btn btn-primary" data-i18n="nav.startCta"></a>
          </div>
        </div>

        ${L(c.afterGraduation) ? `
        <div class="card" style="margin-top:40px">
          <h3 style="font-size:1.3rem;font-weight:750;margin-bottom:10px">${t("countryDetail.afterGradTitle")}</h3>
          <p class="text-dim">${L(c.afterGraduation)}</p>
        </div>` : ""}
      </div>`;
      window.I18N.apply(root);
      reveal(root);

      scholarshipsSection(c.id).then((html) => {
        const el = document.getElementById("country-scholarships");
        if (el) el.innerHTML = html;
      });
    },
  };

  window.Countries = Countries;

  window.addEventListener("components:ready", function () {
    loadCountries().then(function () {
      Countries.all = DATA;
      window.dispatchEvent(new CustomEvent("countries:ready"));
    });
  });
})();
