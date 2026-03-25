
document.getElementById("home").addEventListener("click", () => {
    window.location.href = "/Html/Home.html";
})

document.getElementById("debug").addEventListener("click", () => {
    window.location.href = "/Html/Debug.html";
})

document.getElementById("endless").addEventListener("click", () => {
    window.location.href = "/Html/Endless.html";
})

document.getElementById("achieve").addEventListener("click", () => {
    window.location.href = "/Html/Achievements.html";
})

function setupUserSearch() {
    const profileIcon = document.getElementById("profile");
    if (!profileIcon || document.getElementById("navUserSearch")) return;

    const searchWrap = document.createElement("div");
    searchWrap.id = "navUserSearch";
    searchWrap.style.display = "flex";
    searchWrap.style.alignItems = "center";
    searchWrap.style.gap = "8px";
    searchWrap.style.position = "absolute";
    searchWrap.style.right = "100px";
    searchWrap.style.top = `${profileIcon.offsetTop + 5}px`;

    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "Search user";
    input.style.width = "150px";
    input.style.height = "30px";
    input.style.borderRadius = "999px";
    input.style.border = "1px solid rgba(255,255,255,0.18)";
    input.style.background = "rgba(10, 16, 30, 0.88)";
    input.style.color = "white";
    input.style.padding = "0 12px";
    input.style.outline = "none";

    const button = document.createElement("button");
    button.type = "button";
    button.textContent = "Search";
    button.style.height = "30px";
    button.style.padding = "0 12px";
    button.style.borderRadius = "999px";
    button.style.border = "0";
    button.style.fontWeight = "600";
    button.style.cursor = "pointer";

    const submitSearch = () => {
        const value = input.value.trim();
        if (!value) return;
        window.location.href = `/Html/Profile.html?user=${encodeURIComponent(value)}`;
    };

    button.addEventListener("click", submitSearch);
    input.addEventListener("keydown", (event) => {
        if (event.key === "Enter") submitSearch();
    });

    searchWrap.appendChild(input);
    searchWrap.appendChild(button);
    profileIcon.parentNode.insertBefore(searchWrap, profileIcon);

    window.addEventListener("resize", () => {
        searchWrap.style.top = `${profileIcon.offsetTop + 5}px`;
    });
}

const profile = document.getElementById("profile");
setupUserSearch();

profile.addEventListener("click", () => {
    window.location.href = "/Html/Profile.html";
})




const levels = document.getElementById("levels")

const game1 = document.getElementById("game1");
const game2 = document.getElementById("game2");
const game3 = document.getElementById("game3");
const game4 = document.getElementById("game4");



game1.addEventListener("click", () => {
    levels.style.display = "block";
    levels.style.animation = "blurIn 0.3s ease forwards";
    document.getElementById("html").style.animation = "levelIn 1s ease forwards";
})

game2.addEventListener("click", () => {
    levels.style.display = "block";
    levels.style.animation = "blurIn 0.3s ease forwards";
    document.getElementById("css").style.animation = "levelIn 1s ease forwards";
})

game3.addEventListener("click", () => {
    levels.style.display = "block";
    levels.style.animation = "blurIn 0.3s ease forwards";
    document.getElementById("Js").style.animation = "levelIn 1s ease forwards";
});

game4.addEventListener("click", () => {
    levels.style.display = "block";
    levels.style.animation = "blurIn 0.3s ease forwards";
    document.getElementById("java").style.animation = "levelIn 1s ease forwards";
})

const exit1 = document.getElementById("exit1");
const exit2 = document.getElementById("exit2");
const exit3 = document.getElementById("exit3");
const exit4 = document.getElementById("exit4");

exit1.addEventListener("click", () => {
    document.getElementById("html").style.animation = "levelOut 1s ease forwards";
    levels.style.animation = "blurOut 0.3s ease forwards";
    levels.style.display = "none";
});

exit2.addEventListener("click", () => {
    document.getElementById("css").style.animation = "levelOut 1s ease forwards";
    levels.style.animation = "blurOut 0.3s ease forwards";
    levels.style.display = "none";
})

exit3.addEventListener("click", () => {
    document.getElementById("Js").style.animation = "levelOut 1s ease forwards";
    levels.style.animation = "blurOut 0.3s ease forwards";
    levels.style.display = "none";
})

exit4.addEventListener("click", () => {
    document.getElementById("java").style.animation = "levelOut 1s ease forwards";
    levels.style.animation = "blurOut 0.3s ease forwards";
    levels.style.display = "none";
})


import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { renderAchievements } from '/Js/Achievements.js';

const firebaseConfig = {
  apiKey: "AIzaSyCzfz11yiUX9nT0eGD6vG7RfdKQ4aMu14I",
  authDomain: "debugdash.firebaseapp.com",
  projectId: "debugdash",
  storageBucket: "debugdash.firebasestorage.app",
  messagingSenderId: "38852642244",
  appId: "1:38852642244:web:a25c903370779914a19091",
  measurementId: "G-6KBYQ2ZKFG"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

async function getUserLevels() {
  const user = auth.currentUser;
  if (!user) return { htmlLevel: 1, cssLevel: 1, jsLevel: 1, javaLevel: 1 };

  try {
    const userRef = doc(db, "users", user.uid); 
    const docSnap = await getDoc(userRef);

    if (!docSnap.exists()) return { htmlLevel: 1, cssLevel: 1, jsLevel: 1, javaLevel: 1 };

    const data = docSnap.data();
    return {
      htmlLevel: Math.max(Number(data.htmlLevel ?? 1), 1),
      cssLevel: Math.max(Number(data.cssLevel ?? 1), 1),
      jsLevel: Math.max(Number(data.jsLevel ?? 1), 1),
      javaLevel: Math.max(Number(data.javaLevel ?? 1), 1)
    };
  } catch(e) {
    console.error("Firestore error:", e);
    return { htmlLevel: 1, cssLevel: 1, jsLevel: 1, javaLevel: 1 };
  }
  
}

auth.onAuthStateChanged(async (user) => {
  if (!user) return;

  const levels = await getUserLevels();

  document.querySelectorAll(".level-btn").forEach(btn => {
  const lang = btn.dataset.lang;
  const btnLevel = parseInt(btn.dataset.level);
  const maxLevel = Number(levels[`${lang}Level`] ?? 1);

  if (btnLevel <= maxLevel) {
  btn.disabled = false;
  btn.style.opacity = 1;
  btn.addEventListener("click", () => {
    window.location.href = `Game1.html?lang=${lang}&level=${btnLevel}`;
  });
} else {
  btn.disabled = true;
  btn.style.opacity = 0.5;
}
});

  renderAchievements(levels);
});
