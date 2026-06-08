/* =====================================================================
   i18n engine — applies translations site-wide, persists choice,
   handles RTL. Works on file:// (translations are JS, not fetched JSON).
   ===================================================================== */
(function () {
  "use strict";

  const LANGS = [
    { code: "en", flag: "🇬🇧", label: "English", native: "English", dir: "ltr" },
    { code: "ar", flag: "🇸🇦", label: "Arabic", native: "العربية", dir: "rtl" },
    { code: "fr", flag: "🇫🇷", label: "French", native: "Français", dir: "ltr" },
    { code: "es", flag: "🇪🇸", label: "Spanish", native: "Español", dir: "ltr" },
    { code: "hi", flag: "🇮🇳", label: "Hindi", native: "हिन्दी", dir: "ltr" },
  ];
  const STORE_KEY = "Prime' New Generation_lang";
  const DEFAULT = "en";

  function resolve(obj, path) {
    return path.split(".").reduce((o, k) => (o && o[k] != null ? o[k] : null), obj);
  }

  const I18N = {
    langs: LANGS,
    current: DEFAULT,

    get(key, fallback) {
      const dict = (window.TRANSLATIONS && window.TRANSLATIONS[this.current]) || {};
      const val = resolve(dict, key);
      if (val != null) return val;
      const en = (window.TRANSLATIONS && window.TRANSLATIONS.en) || {};
      return resolve(en, key) != null ? resolve(en, key) : (fallback != null ? fallback : key);
    },

    meta(code) { return LANGS.find((l) => l.code === (code || this.current)); },

    apply(root) {
      const scope = root || document;
      // text content
      scope.querySelectorAll("[data-i18n]").forEach((el) => {
        const v = this.get(el.getAttribute("data-i18n"));
        if (v != null) el.innerHTML = v;
      });
      // attributes: data-i18n-attr="placeholder:key.path;aria-label:other.key"
      scope.querySelectorAll("[data-i18n-attr]").forEach((el) => {
        el.getAttribute("data-i18n-attr").split(";").forEach((pair) => {
          const [attr, key] = pair.split(":").map((s) => s.trim());
          if (attr && key) el.setAttribute(attr, this.get(key));
        });
      });
    },

    set(code, opts) {
      const meta = this.meta(code) || this.meta(DEFAULT);
      this.current = meta.code;
      try { localStorage.setItem(STORE_KEY, meta.code); } catch (e) {}
      document.documentElement.lang = meta.code;
      document.documentElement.dir = meta.dir;
      this.apply(document);
      document.title = this.get("meta.title", document.title);
      window.dispatchEvent(new CustomEvent("languagechange", { detail: { code: meta.code } }));
    },

    init() {
      let saved = DEFAULT;
      try { saved = localStorage.getItem(STORE_KEY) || DEFAULT; } catch (e) {}
      this.set(saved);
    },
  };

  window.I18N = I18N;
})();
