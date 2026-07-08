/* =====================================================================
   Homepage testimonials — pulls "testimony"-type docs from the same
   Firestore "posts" collection used by js/blog.js, so the admin only
   manages testimonials in one place. Renders into the existing
   ".stories" container on index.html (markup/CSS unchanged).
   ===================================================================== */
(function () {
  "use strict";

  function esc(s) { return (s || "").replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c])); }
  function initial(name) { return (name || "?").trim().charAt(0).toUpperCase(); }

  function storyHTML(p) {
    return `
    <div class="story reveal in">
      <div class="q">${esc(p.title || p.body)}</div>
      <div class="who"><div class="av">${initial(p.author)}</div><div><div class="nm">${esc(p.author)}</div><div class="dt">${esc(p.route)}</div></div></div>
    </div>`;
  }

  function render(posts) {
    const el = document.querySelector(".stories");
    if (!el || !posts.length) return;
    el.innerHTML = posts.slice(0, 6).map(storyHTML).join("");
  }

  function init() {
    if (!document.querySelector(".stories") || !window.FIREBASE_READY) return;
    window.db.collection("posts").where("type", "==", "testimony").orderBy("createdAt", "desc").get()
      .then((snap) => render(snap.docs.map((d) => d.data())))
      .catch(() => {});
  }

  window.addEventListener("components:ready", init);
})();
