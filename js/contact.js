/* =====================================================================
   Contact form — no backend. Builds a mailto: link (email button) or a
   pre-filled WhatsApp message (WhatsApp button).
   ===================================================================== */
(function () {
  "use strict";

  function val(id) { const e = document.getElementById(id); return e ? e.value.trim() : ""; }

  function fillInfo() {
    const s = window.SITE;
    const email = document.getElementById("ci-email");
    const wa = document.getElementById("ci-wa");
    if (email) { email.textContent = s.email; email.href = "mailto:" + s.email; }
    if (wa) { wa.textContent = "+" + s.whatsapp; wa.href = "https://wa.me/" + s.whatsapp; }
  }

  function setup() {
    fillInfo();
    const form = document.getElementById("contact-form");
    if (!form) return;

    const sendEmail = document.getElementById("send-email");
    const sendWa = document.getElementById("send-wa");

    sendEmail.addEventListener("click", function (e) {
      e.preventDefault();
      if (!form.reportValidity()) return;
      const subject = encodeURIComponent(val("c-subject") || "Prime' New Generation enquiry");
      const body = encodeURIComponent(
        "Name: " + val("c-name") + "\nEmail: " + val("c-email") + "\n\n" + val("c-message")
      );
      window.location.href = "mailto:" + window.SITE.email + "?subject=" + subject + "&body=" + body;
    });

    sendWa.addEventListener("click", function (e) {
      e.preventDefault();
      if (!form.reportValidity()) return;
      const msg = encodeURIComponent(
        "Hello Prime' New Generation!\n\nName: " + val("c-name") +
        "\nEmail: " + val("c-email") +
        "\nSubject: " + val("c-subject") +
        "\n\n" + val("c-message")
      );
      window.open("https://wa.me/" + window.SITE.whatsapp + "?text=" + msg, "_blank");
    });
  }

  window.addEventListener("components:ready", setup);
})();
