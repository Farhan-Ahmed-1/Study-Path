/* =====================================================================
   Budget calculator — estimates total first-year(s) cost in MAD
   (tuition + housing + proof of funds + flight) for a chosen destination
   and study duration. Country data comes from window.Countries; the
   currency-to-MAD rates come from Firestore "settings/fxRates".
   ===================================================================== */
(function () {
  "use strict";

  function t(k) { return window.I18N ? window.I18N.get(k) : k; }
  let fx = {};

  function loadFx() {
    if (!window.FIREBASE_READY) return Promise.resolve(null);
    return window.db.collection("settings").doc("fxRates").get().then((doc) => {
      fx = doc.exists ? doc.data() : {};
      return fx;
    });
  }

  function renderSelect() {
    const el = document.getElementById("calc-country");
    if (!el) return;
    const prev = el.value;
    const countries = window.Countries ? window.Countries.all : [];
    el.innerHTML = `<option value="">${t("calcPage.placeholder")}</option>` +
      countries.map((c) => `<option value="${c.id}">${c.flag} ${c.name}</option>`).join("");
    el.value = prev;
  }

  function row(label, localAmt, currency, rate) {
    const localStr = window.Countries.fmtMoney(Math.round(localAmt), currency);
    const madStr = rate ? Math.round(localAmt * rate).toLocaleString() + " MAD" : "—";
    return `<tr><th>${label}</th><td>${localStr}</td><td>${madStr}</td></tr>`;
  }

  function compute() {
    const el = document.getElementById("calc-result");
    if (!el) return;
    const countries = window.Countries ? window.Countries.all : [];
    const countrySel = document.getElementById("calc-country");
    const yearsInput = document.getElementById("calc-years");
    const c = countries.find((x) => x.id === (countrySel && countrySel.value));
    if (!c) { el.innerHTML = `<p class="forum-note">${t("calcPage.empty")}</p>`; return; }

    const years = Math.max(1, parseInt(yearsInput.value, 10) || 1);
    const rate = fx[c.currency] || 0;
    const tuitionTotal = (((c.tuitionMin || 0) + (c.tuitionMax || 0)) / 2) * years;
    const livingTotal = (((c.livingMin || 0) + (c.livingMax || 0)) / 2) * 12 * years;
    const proof = c.proofAmount || 0;
    const flight = c.flightEstimate || 0;
    const totalMad = rate ? (tuitionTotal + livingTotal + proof) * rate + flight : null;

    el.innerHTML = `
    <table class="compare-table">
      <thead><tr><th></th><th>${t("calcPage.colLocal")}</th><th>${t("calcPage.colMad")}</th></tr></thead>
      <tbody>
        ${row(t("calcPage.rowTuition"), tuitionTotal, c.currency, rate)}
        ${row(t("calcPage.rowLiving"), livingTotal, c.currency, rate)}
        ${row(t("calcPage.rowProof"), proof, c.currency, rate)}
        <tr><th>${t("calcPage.rowFlight")}</th><td>—</td><td>${flight ? flight.toLocaleString() + " MAD" : "—"}</td></tr>
        <tr><th><b>${t("calcPage.rowTotal")}</b></th><td></td><td><b>${totalMad != null ? Math.round(totalMad).toLocaleString() + " MAD" : t("calcPage.rateUnavailable")}</b></td></tr>
      </tbody>
    </table>
    <p class="text-dim" style="font-size:.85rem;margin-top:14px">${t("calcPage.disclaimer")}</p>`;
  }

  function render() {
    renderSelect();
    compute();
  }

  function init() {
    if (!document.getElementById("calc-country")) return;
    render();
    loadFx().then(compute);
    document.getElementById("calc-country").addEventListener("change", compute);
    document.getElementById("calc-years").addEventListener("input", compute);
  }

  window.addEventListener("components:ready", init);
  window.addEventListener("countries:ready", render);
  window.addEventListener("languagechange", render);
})();
