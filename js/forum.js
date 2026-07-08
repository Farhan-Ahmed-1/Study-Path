/* =====================================================================
   Forum — categories, questions and answers are stored in Firestore.
   Students sign in (see js/auth.js) to ask questions and post answers.
   Admin adds/removes categories directly in the Firestore console
   (collection "forumCategories": { key?, label, order }).
   ===================================================================== */
(function () {
  "use strict";

  function t(k) { return window.I18N ? window.I18N.get(k) : k; }
  function db() { return window.db; }
  function val(id) { const el = document.getElementById(id); return el ? el.value : ""; }
  function esc(s) { return (s || "").replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c])); }

  function catLabel(cat) {
    if (!cat) return "";
    const key = cat.key ? t("forumPage.cats." + cat.key) : null;
    return key && key.indexOf("forumPage.cats.") !== 0 ? key : cat.label;
  }

  function avatarLetter(name) { return (name || "?").trim().charAt(0).toUpperCase(); }

  function relTime(date) {
    if (!date) return "";
    const mins = Math.max(1, Math.round((Date.now() - date.getTime()) / 60000));
    if (mins < 60) return mins + "m";
    const hrs = Math.round(mins / 60);
    if (hrs < 24) return hrs + "h";
    return Math.round(hrs / 24) + "d";
  }

  let categories = [];
  let questions = [];
  let activeCat = "all";
  let currentUser = null;
  let openQuestionId = null;

  /* ------------------------------------------------------------------ */
  /* Data loading                                                        */
  /* ------------------------------------------------------------------ */
  function loadCategories() {
    if (!window.FIREBASE_READY) return Promise.resolve([]);
    return db().collection("forumCategories").orderBy("order").get().then((snap) => {
      categories = snap.docs.map((d) => Object.assign({ id: d.id }, d.data()));
      return categories;
    });
  }

  function loadQuestions() {
    if (!window.FIREBASE_READY) return Promise.resolve([]);
    return db().collection("forumQuestions").orderBy("createdAt", "desc").get().then((snap) => {
      const docs = snap.docs.map((d) => Object.assign({ id: d.id }, d.data()));
      return Promise.all(
        docs.map((q) =>
          db().collection("forumQuestions").doc(q.id).collection("answers").get().then((s) => {
            q.answerCount = s.size;
            return q;
          })
        )
      );
    }).then((docs) => { questions = docs; return questions; });
  }

  function loadAll() {
    return Promise.all([loadCategories(), loadQuestions()]).then(renderAll);
  }

  /* ------------------------------------------------------------------ */
  /* Rendering                                                            */
  /* ------------------------------------------------------------------ */
  function renderToolbar() {
    const el = document.getElementById("forum-toolbar");
    if (!el) return;
    el.innerHTML = currentUser
      ? `<button class="btn btn-gold btn-sm" onclick="openAskModal()">${t("forumPage.ask")}</button>`
      : `<span class="forum-signin-hint">${t("forumPage.signInPrompt")} <a onclick="openAuthModal('signin')" style="color:var(--purple);font-weight:600;cursor:pointer">${t("nav.signin")}</a></span>`;
  }

  function renderCats() {
    const el = document.getElementById("forum-cats");
    if (!el) return;
    if (!window.FIREBASE_READY) { el.innerHTML = ""; return; }
    const chips = [{ id: "all", label: t("forumPage.cats.all") }].concat(
      categories.map((c) => ({ id: c.id, label: catLabel(c) }))
    );
    el.innerHTML = chips.map((c) => {
      const count = c.id === "all" ? questions.length : questions.filter((q) => q.categoryId === c.id).length;
      return `<button class="cat-chip${c.id === activeCat ? " active" : ""}" data-cat="${c.id}">
        <span>${esc(c.label)}</span><span class="count">${count}</span></button>`;
    }).join("");
    el.querySelectorAll(".cat-chip").forEach((b) =>
      b.addEventListener("click", () => { activeCat = b.dataset.cat; renderCats(); renderThreads(); })
    );
  }

  function threadHTML(q) {
    const cat = categories.find((c) => c.id === q.categoryId);
    const created = q.createdAt && q.createdAt.toDate ? q.createdAt.toDate() : null;
    return `
    <div class="card thread reveal in" data-id="${q.id}">
      <span class="avatar">${avatarLetter(q.authorName)}</span>
      <div class="meta">
        <h3>${esc(q.title)}</h3>
        <p class="text-dim" style="font-size:.92rem;margin-bottom:8px">${esc((q.body || "").slice(0, 140))}${(q.body || "").length > 140 ? "…" : ""}</p>
        <div class="sub">
          <span>${t("forumPage.by")} ${esc(q.authorName)}</span>
          ${cat ? `<span class="tag">${esc(catLabel(cat))}</span>` : ""}
          ${created ? `<span>· ${relTime(created)}</span>` : ""}
        </div>
      </div>
      <div class="stats">
        <div><b>${q.answerCount || 0}</b><span>${t("forumPage.replies")}</span></div>
      </div>
    </div>`;
  }

  function renderThreads() {
    const el = document.getElementById("forum-threads");
    if (!el) return;
    if (!window.FIREBASE_READY) {
      el.innerHTML = `<p class="forum-note">${t("forumPage.offline")}</p>`;
      return;
    }
    const list = activeCat === "all" ? questions : questions.filter((q) => q.categoryId === activeCat);
    el.innerHTML = list.length
      ? list.map(threadHTML).join("")
      : `<p class="forum-note">${t("blog.labels.noResults")}</p>`;
    el.querySelectorAll(".thread").forEach((card) =>
      card.addEventListener("click", () => openThread(card.dataset.id))
    );
  }

  function renderAll() {
    renderToolbar();
    renderCats();
    renderThreads();
  }

  /* ------------------------------------------------------------------ */
  /* Ask-question modal                                                   */
  /* ------------------------------------------------------------------ */
  function buildAskModal() {
    return `
    <div class="modal-bg" id="askModal">
      <div class="modal">
        <button class="x" onclick="closeAskModal()" aria-label="Close">×</button>
        <h3 data-i18n="forumPage.askTitle"></h3>
        <label data-i18n="forumPage.askCategory"></label>
        <select id="ask-cat"></select>
        <label data-i18n="forumPage.titleLabel"></label>
        <input id="ask-title" type="text" data-i18n-attr="placeholder:forumPage.askTitlePh" />
        <label data-i18n="forumPage.detailsLabel"></label>
        <textarea id="ask-body" data-i18n-attr="placeholder:forumPage.askBodyPh"></textarea>
        <p class="auth-error" id="askError" style="display:none"></p>
        <button class="btn btn-gold" onclick="submitAskQuestion()" data-i18n="forumPage.askSubmit"></button>
      </div>
    </div>`;
  }

  window.openAskModal = function () {
    const m = document.getElementById("askModal");
    if (!m) return;
    const sel = document.getElementById("ask-cat");
    if (sel) sel.innerHTML = categories.map((c) => `<option value="${c.id}">${esc(catLabel(c))}</option>`).join("");
    m.classList.add("on");
  };
  window.closeAskModal = function () {
    const m = document.getElementById("askModal");
    if (m) m.classList.remove("on");
  };
  window.submitAskQuestion = function () {
    const err = document.getElementById("askError");
    if (err) err.style.display = "none";
    if (!currentUser) return;
    const title = val("ask-title").trim();
    const body = val("ask-body").trim();
    const categoryId = val("ask-cat");
    if (!title || !body) {
      if (err) { err.textContent = t("assessment.required"); err.style.display = "block"; }
      return;
    }
    db().collection("forumQuestions").add({
      authorUid: currentUser.uid,
      authorName: currentUser.displayName || currentUser.email,
      categoryId: categoryId,
      title: title,
      body: body,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    }).then(() => {
      window.closeAskModal();
      document.getElementById("ask-title").value = "";
      document.getElementById("ask-body").value = "";
      return loadQuestions().then(() => { renderCats(); renderThreads(); });
    }).catch((e) => {
      if (err) { err.textContent = e.message; err.style.display = "block"; }
    });
  };

  /* ------------------------------------------------------------------ */
  /* Question detail + answers modal                                      */
  /* ------------------------------------------------------------------ */
  function buildThreadModal() {
    return `
    <div class="modal-bg" id="threadModal">
      <div class="modal" style="max-width:560px">
        <button class="x" onclick="closeThreadModal()" aria-label="Close">×</button>
        <h3 id="qd-title"></h3>
        <div class="sub" style="color:var(--text-faint);font-size:.85rem;margin-top:6px" id="qd-meta"></div>
        <p class="qdetail-body" id="qd-body"></p>
        <h4 data-i18n="forumPage.answersTitle" style="font-size:1rem;color:var(--navy-800)"></h4>
        <div class="answer-list" id="qd-answers"></div>
        <div id="qd-answer-form">
          <textarea id="qd-answer-text" data-i18n-attr="placeholder:forumPage.answerPh"></textarea>
          <p class="auth-error" id="qdAnswerError" style="display:none"></p>
          <button class="btn btn-gold" onclick="submitAnswer()" data-i18n="forumPage.answerSubmit"></button>
        </div>
        <p class="forum-signin-hint" id="qd-signin-hint" style="display:none"></p>
      </div>
    </div>`;
  }

  function renderAnswers(list) {
    const el = document.getElementById("qd-answers");
    if (!el) return;
    el.innerHTML = list.length
      ? list.map((a) => `<div class="answer-item"><div class="who">${esc(a.authorName)}</div><p>${esc(a.body)}</p></div>`).join("")
      : `<p class="text-dim" style="font-size:.9rem">${t("forumPage.noAnswers")}</p>`;
  }

  window.openThread = function (id) {
    const q = questions.find((x) => x.id === id);
    if (!q) return;
    openQuestionId = id;
    const cat = categories.find((c) => c.id === q.categoryId);
    document.getElementById("qd-title").textContent = q.title;
    document.getElementById("qd-meta").textContent =
      t("forumPage.by") + " " + q.authorName + (cat ? " · " + catLabel(cat) : "");
    document.getElementById("qd-body").textContent = q.body;

    const form = document.getElementById("qd-answer-form");
    const hint = document.getElementById("qd-signin-hint");
    if (currentUser) {
      if (form) form.style.display = "block";
      if (hint) hint.style.display = "none";
    } else {
      if (form) form.style.display = "none";
      if (hint) { hint.style.display = "block"; hint.textContent = t("forumPage.signInPrompt"); }
    }

    document.getElementById("qd-answers").innerHTML = `<p class="text-dim" style="font-size:.9rem">${t("forumPage.loading")}</p>`;
    document.getElementById("threadModal").classList.add("on");

    db().collection("forumQuestions").doc(id).collection("answers").orderBy("createdAt").get().then((snap) => {
      renderAnswers(snap.docs.map((d) => d.data()));
    });
  };

  window.closeThreadModal = function () {
    const m = document.getElementById("threadModal");
    if (m) m.classList.remove("on");
    openQuestionId = null;
  };

  window.submitAnswer = function () {
    const err = document.getElementById("qdAnswerError");
    if (err) err.style.display = "none";
    if (!currentUser || !openQuestionId) return;
    const body = val("qd-answer-text").trim();
    if (!body) {
      if (err) { err.textContent = t("assessment.required"); err.style.display = "block"; }
      return;
    }
    db().collection("forumQuestions").doc(openQuestionId).collection("answers").add({
      authorUid: currentUser.uid,
      authorName: currentUser.displayName || currentUser.email,
      body: body,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    }).then(() => {
      document.getElementById("qd-answer-text").value = "";
      return db().collection("forumQuestions").doc(openQuestionId).collection("answers").orderBy("createdAt").get();
    }).then((snap) => {
      renderAnswers(snap.docs.map((d) => d.data()));
      const q = questions.find((x) => x.id === openQuestionId);
      if (q) { q.answerCount = snap.size; renderThreads(); }
    }).catch((e) => {
      if (err) { err.textContent = e.message; err.style.display = "block"; }
    });
  };

  /* ------------------------------------------------------------------ */
  /* Boot                                                                 */
  /* ------------------------------------------------------------------ */
  function mountModals() {
    if (document.getElementById("askModal")) return;
    const wrap = document.createElement("div");
    wrap.innerHTML = buildAskModal() + buildThreadModal();
    document.body.appendChild(wrap);
    ["askModal", "threadModal"].forEach((id) => {
      const m = document.getElementById(id);
      m.addEventListener("click", (e) => { if (e.target === m) m.classList.remove("on"); });
    });
  }

  function init() {
    if (!document.getElementById("forum-threads")) return;
    mountModals();
    window.I18N.apply(document);
    loadAll();
    if (window.Auth) {
      window.Auth.onChange((user) => { currentUser = user; renderToolbar(); });
    }
  }

  window.addEventListener("components:ready", init);
  window.addEventListener("languagechange", () => { if (document.getElementById("forum-threads")) renderAll(); });
})();
