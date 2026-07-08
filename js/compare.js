/* =====================================================================
   Country comparator — up to 3 destinations side by side. Data comes
   from window.Countries (js/countries.js), which loads from Firestore.
   ===================================================================== */
(function () {
  "use strict";

  function t(k) { return window.I18N ? window.I18N.get(k) : k; }
  const SLOTS = 3;
  let selected = ["", "", ""];

  function renderSelects() {
    const el = document.getElementById("compare-selects");
    if (!el) return;
    const countries = window.Countries ? window.Countries.all : [];
    const options = countries.map((c) => `<option value="${c.id}">${c.flag} ${c.name}</option>`).join("");
    el.innerHTML = Array.from({ length: SLOTS }).map((_, i) => `
      <select data-slot="${i}">
        <option value="">${t("comparePage.placeholder")}</option>
        ${options}
      </select>`).join("");
    el.querySelectorAll("select").forEach((sel, i) => {
      sel.value = selected[i];
      sel.addEventListener("change", () => { selected[i] = sel.value; renderTable(); });
    });
  }

  function renderTable() {
    const el = document.getElementById("compare-result");
    if (!el) return;
    const countries = window.Countries ? window.Countries.all : [];
    const picked = selected.map((id) => countries.find((c) => c.id === id)).filter(Boolean);

    if (picked.length < 2) {
      el.innerHTML = `<p class="forum-note">${t("comparePage.empty")}</p>`;
      return;
    }

    const rows = [
      { label: t("comparePage.rowTuition"), get: (c) => window.Countries.fmtRange(c.tuitionMin, c.tuitionMax, c.currency) },
      { label: t("comparePage.rowLiving"), get: (c) => window.Countries.fmtRange(c.livingMin, c.livingMax, c.currency) },
      { label: t("comparePage.rowProof"), get: (c) => window.Countries.fmtMoney(c.proofAmount, c.currency) },
      { label: t("comparePage.rowWork"), get: (c) => window.Countries.L(c.work) },
      { label: t("comparePage.rowIntake"), get: (c) => window.Countries.L(c.intake) },
      { label: t("comparePage.rowLangs"), get: (c) => c.langs || "" },
    ];

    el.innerHTML = `
    <table class="compare-table">
      <thead><tr><th></th>${picked.map((c) => `<th>${c.flag} ${c.name}</th>`).join("")}</tr></thead>
      <tbody>
        ${rows.map((r) => `<tr><th>${r.label}</th>${picked.map((c) => `<td>${r.get(c)}</td>`).join("")}</tr>`).join("")}
      </tbody>
    </table>`;
  }

  function render() {
    renderSelects();
    renderTable();
  }

  window.addEventListener("components:ready", render);
  window.addEventListener("countries:ready", render);
  window.addEventListener("languagechange", render);
})();
