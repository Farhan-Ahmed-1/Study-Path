/* =====================================================================
   Assessment — 13-step wizard, weighted readiness scoring, WhatsApp result.
   State lives in memory; re-renders on language change keeping answers.
   ===================================================================== */
(function () {
  "use strict";

  function t(k) { return window.I18N ? window.I18N.get(k) : k; }

  /* Each options-step: list of {v: value, e: emoji, s: score 0..1}.
     `w` is the question's weight in the final readiness score. */
  const STEPS = [
    { id: "q1", type: "basic" },
    { id: "q2", type: "options", w: 1, opts: [
      { v: "highschool", e: "🎒", s: 0.70 }, { v: "finishedBac", e: "🎓", s: 0.85 },
      { v: "university", e: "📚", s: 0.90 }, { v: "graduated", e: "🏅", s: 1.0 },
      { v: "gap", e: "⏳", s: 0.55 }, { v: "other", e: "✳️", s: 0.60 } ] },
    { id: "q3", type: "year" },
    { id: "q4", type: "options", w: 1, opts: [
      { v: "continuous", e: "📈", s: 1.0 }, { v: "workStudy", e: "💼", s: 0.80 },
      { v: "interrupted", e: "⏸️", s: 0.55 }, { v: "restarting", e: "🔄", s: 0.65 } ] },
    { id: "q5", type: "options", w: 0.5, opts: [
      { v: "degree", e: "🎓", s: 1.0 }, { v: "vocational", e: "🛠️", s: 0.85 },
      { v: "language", e: "🗣️", s: 0.70 }, { v: "undecided", e: "🤔", s: 0.55 } ] },
    { id: "q6", type: "options", w: 0.5, opts: [
      { v: "yesClear", e: "✅", s: 1.0 }, { v: "fewIdeas", e: "💡", s: 0.75 },
      { v: "no", e: "🧭", s: 0.50 } ] },
    { id: "q7", type: "options", w: 3, opts: [
      { v: "yes", e: "💶", s: 1.0 }, { v: "partly", e: "🪙", s: 0.60 },
      { v: "no", e: "🚫", s: 0.25 } ] },
    { id: "q8", type: "options", w: 1, opts: [
      { v: "income", e: "💵", s: 0.90 }, { v: "savings", e: "🏦", s: 1.0 },
      { v: "business", e: "🏪", s: 0.85 }, { v: "propertySale", e: "🏠", s: 0.70 },
      { v: "multiple", e: "➕", s: 0.80 } ] },
    { id: "q9", type: "options", w: 0.5, opts: [
      { v: "father", e: "👨", s: 0.85 }, { v: "mother", e: "👩", s: 0.85 },
      { v: "both", e: "👨‍👩‍👧", s: 1.0 }, { v: "relative", e: "🧑‍🤝‍🧑", s: 0.70 },
      { v: "self", e: "🙋", s: 0.60 } ] },
    { id: "q10", type: "options", w: 1.5, opts: [
      { v: "stableJob", e: "🏢", s: 1.0 }, { v: "ownBusiness", e: "📊", s: 0.90 },
      { v: "freelance", e: "💻", s: 0.70 }, { v: "retired", e: "🧓", s: 0.75 },
      { v: "irregular", e: "🌦️", s: 0.40 } ] },
    { id: "q11", type: "options", w: 1.5, opts: [
      { v: "lt3000", e: "🔹", s: 0.30 }, { v: "b3to6", e: "🔹", s: 0.55 },
      { v: "b6to10", e: "🔸", s: 0.75 }, { v: "b10to20", e: "🔶", s: 0.90 },
      { v: "gt20", e: "💎", s: 1.0 } ] },
    { id: "q12", type: "options", w: 1.5, opts: [
      { v: "fullSupport", e: "💚", s: 1.0 }, { v: "mostly", e: "🙂", s: 0.80 },
      { v: "neutral", e: "😐", s: 0.50 }, { v: "unsure", e: "🤷", s: 0.35 } ] },
    { id: "q13", type: "options", w: 0.5, opts: [
      { v: "asap", e: "🚀", s: 1.0 }, { v: "within6", e: "📅", s: 0.90 },
      { v: "nextYear", e: "🗓️", s: 0.75 }, { v: "exploring", e: "👀", s: 0.40 } ] },
  ];

  const TOTAL = STEPS.length;
  const answers = {};   // id -> value (or {fullName, age, phone} for q1, year for q3)
  let index = 0;

  /* ---------- DOM refs ---------- */
  let elBody, elProgress, elBar, elStepNow, elFoot, elBackBtn, elNextBtn;

  function optionsStepHTML(step) {
    const cols = step.opts.length > 3 ? " cols-2" : "";
    const items = step.opts.map((o) => {
      const sel = answers[step.id] === o.v ? " selected" : "";
      return `<div class="opt${sel}" data-value="${o.v}">
        <span class="check"></span><span class="emoji">${o.e}</span>
        <span>${t("assessment." + step.id + ".opts." + o.v)}</span></div>`;
    }).join("");
    return `<div class="options${cols}">${items}</div>`;
  }

  function basicStepHTML() {
    const a = answers.q1 || {};
    return `
      <div class="field">
        <label data-i18n="assessment.q1.fullName"></label>
        <input class="input" id="f-name" value="${a.fullName ? a.fullName.replace(/"/g, "&quot;") : ""}" data-i18n-attr="placeholder:assessment.q1.fullNamePh" />
      </div>
      <div class="field">
        <label data-i18n="assessment.q1.age"></label>
        <input class="input" id="f-age" type="number" min="14" max="70" value="${a.age || ""}" data-i18n-attr="placeholder:assessment.q1.agePh" />
      </div>
      <div class="field">
        <label data-i18n="assessment.q1.phone"></label>
        <div class="phone-row">
          <input class="input cc" value="+212" readonly aria-label="Country code" />
          <input class="input" id="f-phone" type="tel" value="${a.phone || ""}" data-i18n-attr="placeholder:assessment.q1.phonePh" />
        </div>
        <small class="text-dim" data-i18n="assessment.q1.waNote"></small>
      </div>`;
  }

  function yearStepHTML() {
    return `
      <div class="field">
        <label data-i18n="assessment.q3.label"></label>
        <input class="input" id="f-year" type="number" min="1990" max="2035" value="${answers.q3 || ""}" data-i18n-attr="placeholder:assessment.q3.ph" />
      </div>`;
  }

  function renderStep() {
    const step = STEPS[index];
    const base = "assessment." + step.id + ".";
    let inner = "";
    if (step.type === "basic") inner = basicStepHTML();
    else if (step.type === "year") inner = yearStepHTML();
    else inner = optionsStepHTML(step);

    elBody.innerHTML = `
      <div class="step-pane">
        <span class="q-eyebrow">${t("assessment.stepWord")} ${index + 1} / ${TOTAL}</span>
        <h2 data-i18n="${base}title"></h2>
        <p class="q-help" data-i18n="${base}help"></p>
        ${inner}
        <div class="field-error" id="step-error"></div>
      </div>`;

    window.I18N.apply(elBody);

    // progress + counter
    const pct = Math.round(((index + 1) / TOTAL) * 100);
    elBar.style.width = pct + "%";
    elProgress.textContent = pct + "%";
    elStepNow.textContent = index + 1;

    // wire options
    elBody.querySelectorAll(".opt").forEach((o) =>
      o.addEventListener("click", () => {
        elBody.querySelectorAll(".opt").forEach((x) => x.classList.remove("selected"));
        o.classList.add("selected");
        answers[step.id] = o.dataset.value;
        document.getElementById("step-error").textContent = "";
        setTimeout(next, 220); // auto-advance like the reference
      })
    );

    // back button visibility
    elBackBtn.style.visibility = index === 0 ? "hidden" : "visible";
    elNextBtn.querySelector("span").textContent =
      index === TOTAL - 1 ? t("assessment.seeResult") : t("assessment.next");
  }

  function collectBasic() {
    answers.q1 = {
      fullName: (document.getElementById("f-name") || {}).value || "",
      age: (document.getElementById("f-age") || {}).value || "",
      phone: (document.getElementById("f-phone") || {}).value || "",
    };
  }

  function validate() {
    const step = STEPS[index];
    const err = document.getElementById("step-error");
    if (step.type === "basic") {
      collectBasic();
      const a = answers.q1;
      if (!a.fullName.trim() || !a.age.toString().trim() || !a.phone.trim()) {
        err.textContent = t("assessment.required"); return false;
      }
    } else if (step.type === "year") {
      answers.q3 = (document.getElementById("f-year") || {}).value || "";
      if (!answers.q3.toString().trim()) { err.textContent = t("assessment.required"); return false; }
    } else {
      if (!answers[step.id]) { err.textContent = t("assessment.pickOne"); return false; }
    }
    return true;
  }

  function next() {
    if (!validate()) return;
    if (index < TOTAL - 1) { index++; renderStep(); window.scrollTo({ top: 0, behavior: "smooth" }); }
    else showResult();
  }

  function back() {
    if (STEPS[index].type === "basic") collectBasic();
    else if (STEPS[index].type === "year") answers.q3 = (document.getElementById("f-year") || {}).value || answers.q3;
    if (index > 0) { index--; renderStep(); }
  }

  function computeScore() {
    let sum = 0, weights = 0;
    STEPS.forEach((step) => {
      if (step.type !== "options" || !answers[step.id]) return;
      const opt = step.opts.find((o) => o.v === answers[step.id]);
      if (opt) { sum += step.w * opt.s; weights += step.w; }
    });
    return weights ? Math.round((sum / weights) * 100) : 0;
  }

  function band(score) {
    if (score >= 70) return { key: "High", cls: "band-high" };
    if (score >= 40) return { key: "Mid", cls: "band-mid" };
    return { key: "Low", cls: "band-low" };
  }

  function showResult() {
    const score = computeScore();
    const b = band(score);
    const circ = 628.3; // 2πr, r=100
    const offset = circ * (1 - score / 100);

    document.getElementById("assess-top").classList.add("hidden");
    document.getElementById("assess-progress").classList.add("hidden");
    elFoot.classList.add("hidden");

    const steps = ["n1", "n2", "n3"].map((n) =>
      `<li><span class="ck"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5L20 6"/></svg></span><span>${t("assessment.result." + n)}</span></li>`
    ).join("");

    elBody.innerHTML = `
      <div class="result step-pane">
        <div class="big-ring">
          <svg viewBox="0 0 240 240">
            <circle class="track" cx="120" cy="120" r="100"></circle>
            <circle class="prog" cx="120" cy="120" r="100" stroke-dasharray="${circ}" stroke-dashoffset="${circ}" id="result-ring"></circle>
          </svg>
          <div class="center"><b>${score}<span style="font-size:1.6rem">%</span></b><span>${t("assessment.result.of100")}</span></div>
        </div>
        <div class="band ${b.cls}">${t("assessment.result.band" + b.key)}</div>
        <h2>${t("assessment.result.eyebrow")}</h2>
        <p class="interp">${t("assessment.result.interp" + b.key)}</p>
        <h3 style="font-weight:750;margin-bottom:14px">${t("assessment.result.nextTitle")}</h3>
        <ul class="next-steps">${steps}</ul>
        <div class="result-actions">
          <a href="${window.SITE.formUrl}" target="_blank" rel="noopener" class="btn btn-primary btn-lg" id="submit-app">
            ${t("assessment.result.submit")}
          </a>
          <button class="btn btn-ghost btn-lg" id="retake">${t("assessment.result.retake")}</button>
        </div>
      </div>`;

    requestAnimationFrame(() => {
      const ring = document.getElementById("result-ring");
      if (ring) ring.style.strokeDashoffset = offset;
    });
    document.getElementById("retake").addEventListener("click", restart);
    document.getElementById("submit-app").addEventListener("click", (e) => {
      // No real form yet → don't open the placeholder in a blank tab.
      if (!window.SITE.formUrl || window.SITE.formUrl === "#") e.preventDefault();
      showSubmitted();
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function showSubmitted() {
    document.getElementById("assess-top").classList.add("hidden");
    document.getElementById("assess-progress").classList.add("hidden");
    elFoot.classList.add("hidden");

    elBody.innerHTML = `
      <div class="submitted step-pane">
        <div class="success-badge">
          <svg viewBox="0 0 56 56">
            <circle class="ring" cx="28" cy="28" r="25"></circle>
            <path class="tick" d="M17 29l7 7 15-16"></path>
          </svg>
        </div>
        <h2>${t("assessment.result.submittedTitle")}</h2>
        <p>${t("assessment.result.submittedMsg")}</p>
        <button class="btn btn-ghost btn-lg" id="submitted-back">${t("assessment.result.submittedBack")}</button>
      </div>`;

    document.getElementById("submitted-back").addEventListener("click", restart);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function restart() {
    index = 0;
    Object.keys(answers).forEach((k) => delete answers[k]);
    document.getElementById("assess-top").classList.remove("hidden");
    document.getElementById("assess-progress").classList.remove("hidden");
    elFoot.classList.remove("hidden");
    renderStep();
  }

  function boot() {
    elBody = document.getElementById("assess-body");
    elProgress = document.getElementById("assess-pct");
    elBar = document.getElementById("assess-bar");
    elStepNow = document.getElementById("assess-stepnow");
    elFoot = document.getElementById("assess-foot");
    elBackBtn = document.getElementById("assess-back");
    elNextBtn = document.getElementById("assess-next");
    if (!elBody) return;

    elNextBtn.addEventListener("click", next);
    elBackBtn.addEventListener("click", back);
    renderStep();

    // keep the wizard in sync when language changes mid-assessment
    window.addEventListener("languagechange", function () {
      if (document.getElementById("result-ring")) showResult();
      else renderStep();
    });
  }

  window.addEventListener("components:ready", boot);
})();
