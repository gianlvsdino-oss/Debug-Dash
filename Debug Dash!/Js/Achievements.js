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
  searchWrap.style.top = `${profileIcon.offsetTop + 4}px`;

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


import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

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


const htmlAchievements = [
  { id:"html_lvl_1", name:"Level 1 Complete", type:"level", req:1, title:"Tag Starter" },
  { id:"html_lvl_2", name:"Level 2 Complete", type:"level", req:2, title:"Element Explorer" },
  { id:"html_lvl_3", name:"Level 3 Complete", type:"level", req:3, title:"Markup Maker" },
  { id:"html_lvl_5", name:"Level 5 Complete", type:"level", req:5, title:"Structure Builder" },
  { id:"html_lvl_7", name:"Level 7 Complete", type:"level", req:7, title:"DOM Explorer" },
  { id:"html_lvl_10", name:"Level 10 Complete", type:"level", req:10, title:"Page Creator" },
  { id:"html_lvl_12", name:"Level 12 Complete", type:"level", req:12, title:"Layout Crafter" },
  { id:"html_lvl_15", name:"Level 15 Complete", type:"level", req:15, title:"Web Builder" },
  { id:"html_lvl_18", name:"Level 18 Complete", type:"level", req:18, title:"HTML Architect" },
  { id:"html_lvl_20", name:"Level 20 Complete", type:"level", req:20, title:"Markup Legend" },

  { id:"html_end_3", name:"Streak 3", type:"endless", req:3, title:"Quick Tagger" },
  { id:"html_end_5", name:"Streak 5", type:"endless", req:5, title:"Fast Builder" },
  { id:"html_end_7", name:"Streak 7", type:"endless", req:7, title:"Code Assembler" },
  { id:"html_end_10", name:"Streak 10", type:"endless", req:10, title:"Rapid Structurer" },
  { id:"html_end_12", name:"Streak 12", type:"endless", req:12, title:"Markup Runner" },
  { id:"html_end_15", name:"Streak 15", type:"endless", req:15, title:"Flow Builder" },
  { id:"html_end_18", name:"Streak 18", type:"endless", req:18, title:"DOM Master" },
  { id:"html_end_20", name:"Streak 20", type:"endless", req:20, title:"HTML Warrior" },
  { id:"html_end_25", name:"Streak 25", type:"endless", req:25, title:"Endless Architect" },
  { id:"html_end_30", name:"Streak 30", type:"endless", req:30, title:"Structure Machine" }
];

const cssAchievements = [
  { id:"css_lvl_1", name:"Level 1 Complete", type:"level", req:1, title:"Style Starter" },
  { id:"css_lvl_2", name:"Level 2 Complete", type:"level", req:2, title:"Color Explorer" },
  { id:"css_lvl_3", name:"Level 3 Complete", type:"level", req:3, title:"Design Builder" },
  { id:"css_lvl_5", name:"Level 5 Complete", type:"level", req:5, title:"Layout Styler" },
  { id:"css_lvl_7", name:"Level 7 Complete", type:"level", req:7, title:"Flex Master" },
  { id:"css_lvl_10", name:"Level 10 Complete", type:"level", req:10, title:"Grid Creator" },
  { id:"css_lvl_12", name:"Level 12 Complete", type:"level", req:12, title:"UI Designer" },
  { id:"css_lvl_15", name:"Level 15 Complete", type:"level", req:15, title:"Visual Artist" },
  { id:"css_lvl_18", name:"Level 18 Complete", type:"level", req:18, title:"Style Architect" },
  { id:"css_lvl_20", name:"Level 20 Complete", type:"level", req:20, title:"Design Legend" },

  { id:"css_end_3", name:"Streak 3", type:"endless", req:3, title:"Quick Styler" },
  { id:"css_end_5", name:"Streak 5", type:"endless", req:5, title:"Fast Designer" },
  { id:"css_end_7", name:"Streak 7", type:"endless", req:7, title:"Style Runner" },
  { id:"css_end_10", name:"Streak 10", type:"endless", req:10, title:"CSS Grinder" },
  { id:"css_end_12", name:"Streak 12", type:"endless", req:12, title:"Visual Builder" },
  { id:"css_end_15", name:"Streak 15", type:"endless", req:15, title:"Layout Master" },
  { id:"css_end_18", name:"Streak 18", type:"endless", req:18, title:"UI Warrior" },
  { id:"css_end_20", name:"Streak 20", type:"endless", req:20, title:"Design Machine" },
  { id:"css_end_25", name:"Streak 25", type:"endless", req:25, title:"Endless Styler" },
  { id:"css_end_30", name:"Streak 30", type:"endless", req:30, title:"CSS God" }
];

const jsAchievements = [
  { id:"js_lvl_1", name:"Level 1 Complete", type:"level", req:1, title:"Script Starter" },
  { id:"js_lvl_2", name:"Level 2 Complete", type:"level", req:2, title:"Logic Explorer" },
  { id:"js_lvl_3", name:"Level 3 Complete", type:"level", req:3, title:"Function Builder" },
  { id:"js_lvl_5", name:"Level 5 Complete", type:"level", req:5, title:"Event Master" },
  { id:"js_lvl_7", name:"Level 7 Complete", type:"level", req:7, title:"DOM Controller" },
  { id:"js_lvl_10", name:"Level 10 Complete", type:"level", req:10, title:"JS Developer" },
  { id:"js_lvl_12", name:"Level 12 Complete", type:"level", req:12, title:"Async Thinker" },
  { id:"js_lvl_15", name:"Level 15 Complete", type:"level", req:15, title:"Logic Architect" },
  { id:"js_lvl_20", name:"Level 20 Complete", type:"level", req:20, title:"Code Strategist" },
  { id:"js_lvl_25", name:"Level 25 Complete", type:"level", req:25, title:"JS Legend" },

  { id:"js_end_3", name:"Streak 3", type:"endless", req:3, title:"Quick Thinker" },
  { id:"js_end_5", name:"Streak 5", type:"endless", req:5, title:"Fast Debugger" },
  { id:"js_end_7", name:"Streak 7", type:"endless", req:7, title:"Logic Runner" },
  { id:"js_end_10", name:"Streak 10", type:"endless", req:10, title:"Bug Hunter" },
  { id:"js_end_12", name:"Streak 12", type:"endless", req:12, title:"Code Breaker" },
  { id:"js_end_15", name:"Streak 15", type:"endless", req:15, title:"JS Warrior" },
  { id:"js_end_18", name:"Streak 18", type:"endless", req:18, title:"Script Master" },
  { id:"js_end_20", name:"Streak 20", type:"endless", req:20, title:"Debug Machine" },
  { id:"js_end_25", name:"Streak 25", type:"endless", req:25, title:"Endless Coder" },
  { id:"js_end_30", name:"Streak 30", type:"endless", req:30, title:"JS God" }
];

const javaAchievements = [
  { id:"java_lvl_1", name:"Level 1 Complete", type:"level", req:1, title:"Java Starter" },
  { id:"java_lvl_2", name:"Level 2 Complete", type:"level", req:2, title:"Class Explorer" },
  { id:"java_lvl_3", name:"Level 3 Complete", type:"level", req:3, title:"Object Builder" },
  { id:"java_lvl_5", name:"Level 5 Complete", type:"level", req:5, title:"OOP Master" },
  { id:"java_lvl_7", name:"Level 7 Complete", type:"level", req:7, title:"Method Creator" },
  { id:"java_lvl_10", name:"Level 10 Complete", type:"level", req:10, title:"Java Developer" },
  { id:"java_lvl_12", name:"Level 12 Complete", type:"level", req:12, title:"System Builder" },
  { id:"java_lvl_15", name:"Level 15 Complete", type:"level", req:15, title:"Backend Thinker" },
  { id:"java_lvl_20", name:"Level 20 Complete", type:"level", req:20, title:"Code Architect" },
  { id:"java_lvl_25", name:"Level 25 Complete", type:"level", req:25, title:"Java Legend" },

  { id:"java_end_3", name:"Streak 3", type:"endless", req:3, title:"Quick Compiler" },
  { id:"java_end_5", name:"Streak 5", type:"endless", req:5, title:"Fast Coder" },
  { id:"java_end_7", name:"Streak 7", type:"endless", req:7, title:"System Runner" },
  { id:"java_end_10", name:"Streak 10", type:"endless", req:10, title:"Bug Crusher" },
  { id:"java_end_12", name:"Streak 12", type:"endless", req:12, title:"Logic Builder" },
  { id:"java_end_15", name:"Streak 15", type:"endless", req:15, title:"Java Warrior" },
  { id:"java_end_18", name:"Streak 18", type:"endless", req:18, title:"OOP Mastermind" },
  { id:"java_end_20", name:"Streak 20", type:"endless", req:20, title:"System Machine" },
  { id:"java_end_25", name:"Streak 25", type:"endless", req:25, title:"Endless Engineer" },
  { id:"java_end_30", name:"Streak 30", type:"endless", req:30, title:"Java God" }
];


const achievements = {
  html: htmlAchievements,
  css: cssAchievements,
  js: jsAchievements,
  java: javaAchievements
};

function getCompletedLevel(data, lang) {
  const unlockedLevel = Number(data[lang + "Level"] ?? 1);
  return Math.max(unlockedLevel - 1, 0);
}

function isUnlocked(ach, data, lang) {
  const streakKey = lang + "Streak";

  const level = getCompletedLevel(data, lang);
  const streak = Number(data[streakKey] ?? 0);

  if (ach.type === "level") {
    return level >= ach.req; 
  }

  if (ach.type === "endless") {
    return streak >= ach.req;
  }

  return false;
}


function renderAchievements(data) {
  const containers = {
    html: document.querySelector(".htmlAchievements"),
    css: document.querySelector(".cssAchievements"),
    js: document.querySelector(".jsAchievements"),
    java: document.querySelector(".javaAchievements")
  };

  for (let lang in achievements) {
    const container = containers[lang];
    if (!container) continue;

    container.innerHTML = ""; 

    achievements[lang].forEach(ach => {
      const unlocked = isUnlocked(ach, data, lang);

      const div = document.createElement("div");
      div.className = "achievement " + (unlocked ? "unlocked" : "locked");

      div.innerHTML = `
  <div style="display:flex; justify-content:space-between;">
    <span>${ach.name}</span>
    <span>${unlocked ? "✅" : "🔒"}</span>
  </div>
  <small>${ach.title}</small>
`;

      container.appendChild(div);
    });
  }
}

onAuthStateChanged(auth, async (user) => {
  if (!user) {

    renderAchievements({
  htmlLevel: 1,
  cssLevel: 1,
  jsLevel: 1,
  javaLevel: 1,
  htmlStreak: 0,
  cssStreak: 0,
  jsStreak: 0,
  javaStreak: 0
});
    return;
  }

  const docSnap = await getDoc(doc(db, "users", user.uid));
  if (!docSnap.exists()) {
    renderAchievements({
  htmlLevel: 1,
  cssLevel: 1,
  jsLevel: 1,
  javaLevel: 1,
  htmlStreak: 0,
  cssStreak: 0,
  jsStreak: 0,
  javaStreak: 0
});
    return;
  }

  const data = docSnap.data();
  console.log("FIRESTORE DATA:", data);
  renderAchievements(data);
  
});

export { renderAchievements };
