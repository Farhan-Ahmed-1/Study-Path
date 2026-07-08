(function () {
  "use strict";

  var firebaseConfig = {
    apiKey: "AIzaSyDiZGufc89B5QLTsNo7kT3VybSZjSbhB-M",
    authDomain: "prime-group-4b715.firebaseapp.com",
    projectId: "prime-group-4b715",
    storageBucket: "prime-group-4b715.firebasestorage.app",
    messagingSenderId: "96465181219",
    appId: "1:96465181219:web:4de75364e3c16a21e22f96",
    measurementId: "G-4EMP2HJTZS",
  };

  try {
    firebase.initializeApp(firebaseConfig);
    window.db = firebase.firestore();
    window.FIREBASE_READY = true;
  } catch (err) {
    console.error("Firebase init failed:", err);
    window.FIREBASE_READY = false;
  }
})();
