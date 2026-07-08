/*
 * Site-wide WhatsApp numbers — edit here, propagate everywhere.
 *
 * WHATSAPP_GLOBAL  — Prime Global pillar (study abroad, consultations,
 *                    all pages except prime-academy.html).
 * WHATSAPP_ACADEMY — Prime Academy pillar (courses, bookings, waitlists).
 *                    prime-academy.html overrides SITE_CONFIG.whatsapp
 *                    to this value before components.js runs.
 */
const WHATSAPP_GLOBAL  = "212668686920"; // Prime Global number
const WHATSAPP_ACADEMY = "212668686920"; // Prime Academy number — update when confirmed

window.SITE_CONFIG = {
  whatsapp:        WHATSAPP_GLOBAL,   // default used by components.js (nav, modal, float btn)
  whatsappGlobal:  WHATSAPP_GLOBAL,
  whatsappAcademy: WHATSAPP_ACADEMY,
};
