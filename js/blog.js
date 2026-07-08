/* =====================================================================
   Blog & Opportunities — posts (news / scholarships / testimonials) are
   stored in Firestore ("posts" collection) and added/edited by the admin
   directly in the Firebase console. Supports tab filtering and
   re-renders labels on language change.

   Firestore doc shape (collection "posts"):
     type   — "news" | "scholarship" | "testimony"
     date   — display string e.g. "July 2025" or "Deadline: Jan 2026"
     title  — headline of the post
     body   — short paragraph
     link   — href for a "Learn more" button (news only, optional)
     badge  — award text shown on scholarship cards e.g. "Up to €4,000" (optional)
     author — student name (testimony only, optional)
     route  — journey string e.g. "Morocco → UK" (testimony only, optional)
     createdAt — Firestore server timestamp, used for ordering
   ===================================================================== */
(function () {
  "use strict";

  function t(k) { return window.I18N ? window.I18N.get(k) : k; }

  var POSTS = [];

  function loadPosts() {
    if (!window.FIREBASE_READY) return Promise.resolve([]);
    return window.db.collection("posts").orderBy("createdAt", "desc").get().then(function (snap) {
      POSTS = snap.docs.map(function (d) { return Object.assign({ id: d.id }, d.data()); });
      return POSTS;
    });
  }

  /* ------------------------------------------------------------------ */
  /*  Filter state                                                        */
  /* ------------------------------------------------------------------ */
  var FILTER_KEYS = ["all", "news", "scholarship", "testimony"];
  var TAB_I18N    = ["all", "news", "scholarships", "testimonials"];
  var activeFilter = "all";

  function initials(name) {
    return (name || "?").split(" ").slice(0, 2).map(function (w) { return w[0]; }).join("").toUpperCase();
  }

  /* ------------------------------------------------------------------ */
  /*  Render tabs                                                         */
  /* ------------------------------------------------------------------ */
  function renderTabs() {
    var container = document.getElementById("blogTabs");
    if (!container) return;
    container.innerHTML = FILTER_KEYS.map(function (f, i) {
      var label = t("blog.tabs." + TAB_I18N[i]);
      return '<button class="blog-tab' + (f === activeFilter ? " active" : "") +
        '" data-filter="' + f + '">' + label + "</button>";
    }).join("");
    container.querySelectorAll(".blog-tab").forEach(function (btn) {
      btn.addEventListener("click", function () {
        activeFilter = btn.dataset.filter;
        renderTabs();
        renderGrid();
      });
    });
  }

  /* ------------------------------------------------------------------ */
  /*  Render post cards                                                   */
  /* ------------------------------------------------------------------ */
  function renderGrid() {
    var container = document.getElementById("blogGrid");
    if (!container) return;
    var visible = activeFilter === "all"
      ? POSTS
      : POSTS.filter(function (p) { return p.type === activeFilter; });

    if (!visible.length) {
      container.innerHTML = '<p class="blog-empty">' + t("blog.labels.noResults") + "</p>";
      return;
    }

    container.innerHTML = visible.map(function (p) {
      var catLabel = t("blog.labels." + p.type);
      var extra = "";

      if (p.type === "testimony") {
        extra =
          '<div class="blog-author">' +
            '<div class="blog-avatar">' + initials(p.author) + "</div>" +
            '<div class="blog-author-info">' +
              '<span class="blog-author-name">' + p.author + "</span>" +
              '<span class="blog-author-route">' + p.route + "</span>" +
            "</div>" +
          "</div>";
      } else if (p.type === "scholarship") {
        extra =
          '<div class="blog-card-footer">' +
            '<div class="blog-badge">🏆 ' + p.badge + "</div>" +
            '<button class="btn btn-ghost btn-sm" style="margin-top:12px;width:100%" onclick="openModal()">' +
              t("blog.labels.askQualify") +
            "</button>" +
          "</div>";
      } else if (p.link) {
        extra =
          '<div class="blog-card-footer">' +
            '<a href="' + p.link + '" class="btn btn-ghost btn-sm" style="margin-top:12px">' +
              t("blog.labels.readMore") + " →" +
            "</a>" +
          "</div>";
      }

      return (
        '<article class="card blog-card">' +
          '<div class="blog-meta">' +
            '<span class="blog-cat blog-cat--' + p.type + '">' + catLabel + "</span>" +
            '<span class="blog-date">' + p.date + "</span>" +
          "</div>" +
          '<h3 class="blog-card-title">' + p.title + "</h3>" +
          '<p class="blog-card-body">' + p.body + "</p>" +
          extra +
        "</article>"
      );
    }).join("");
  }

  function render() {
    renderTabs();
    renderGrid();
  }

  function init() {
    if (!document.getElementById("blogGrid")) return;
    var tab = new URLSearchParams(location.search).get("tab");
    if (tab && FILTER_KEYS.indexOf(tab) !== -1) activeFilter = tab;
    render();
    loadPosts().then(render);
  }

  window.addEventListener("components:ready", init);
  window.addEventListener("languagechange", render);
})();
