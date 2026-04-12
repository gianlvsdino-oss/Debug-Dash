import { db } from "../Js/Firebase.js";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

document.getElementById("home").addEventListener("click", () => {
  window.location.href = "/Html/Home.html";
});

document.getElementById("debug").addEventListener("click", () => {
  window.location.href = "/Html/Debug.html";
});

document.getElementById("endless").addEventListener("click", () => {
  window.location.href = "/Html/Endless.html";
});

document.getElementById("achieve").addEventListener("click", () => {
  window.location.href = "/Html/Achievements.html";
});

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

setupUserSearch();

document.getElementById("profile").addEventListener("click", () => {
  window.location.href = "/Html/Profile.html";
});

const items = document.querySelectorAll(".carousel-item");
const leftArrow = document.getElementById("leftarrow");
const rightArrow = document.getElementById("rightarrow");
let index = 0;

const endlessLanguageMap = {
  HTML: "HTML",
  CSS: "CSS",
  "Java Script": "Java Script",
  Java: "Java"
};

if (items.length > 0) {
  items[index].classList.add("active");
}

function updateCarousel(newIndex) {
  items.forEach((item, i) => {
    item.classList.remove("active", "prev");
    if (i === newIndex) item.classList.add("active");
    if (i === index) item.classList.add("prev");
  });
  index = newIndex;
}

leftArrow.addEventListener("click", () => {
  let newIndex = index - 1;
  if (newIndex < 0) newIndex = items.length - 1;
  updateCarousel(newIndex);
});

rightArrow.addEventListener("click", () => {
  let newIndex = index + 1;
  if (newIndex >= items.length) newIndex = 0;
  updateCarousel(newIndex);
});

items.forEach((item) => {
  item.addEventListener("click", () => {
    const label = item.querySelector("h3")?.innerText?.trim() || "HTML";
    const language = endlessLanguageMap[label] || label;
    window.location.href = `/Html/Game2.html?language=${encodeURIComponent(language)}`;
  });
});

async function loadLeaderboards() {
  const leaderboardMap = {
    html: { ulId: "htmlLeaderboard", field: "htmlStreak" },
    css: { ulId: "cssLeaderboard", field: "cssStreak" },
    js: { ulId: "jsLeaderboard", field: "jsStreak" },
    java: { ulId: "javaLeaderboard", field: "javaStreak" }
  };

  for (const lang in leaderboardMap) {
    const { ulId, field } = leaderboardMap[lang];
    const ul = document.getElementById(ulId);
    if (!ul) continue;

    ul.innerHTML = "<li>Loading...</li>";

    try {
      const leaderboardQuery = query(
        collection(db, "users"),
        orderBy(field, "desc"),
        limit(15)
      );
      const snap = await getDocs(leaderboardQuery);

      ul.innerHTML = "";

      const entries = snap.docs
        .filter((entry) => {
          const data = entry.data();
          return !data.isGuest && Number(data[field] || 0) > 0;
        })
        .slice(0, 5);

      if (entries.length === 0) {
        ul.innerHTML = "<li>No data yet</li>";
        continue;
      }

      entries.forEach((entry) => {
        const data = entry.data();
        const li = document.createElement("li");

        const usernameSpan = document.createElement("span");
        usernameSpan.classList.add("username");
        usernameSpan.innerText = data.username || "User";

        const streakSpan = document.createElement("span");
        streakSpan.classList.add("streak");
        streakSpan.innerText = `${data[field] || 0} 🔥`;

        li.appendChild(usernameSpan);
        li.appendChild(streakSpan);
        ul.appendChild(li);
      });
    } catch (error) {
      console.error(`Failed to load ${lang} leaderboard:`, error);
      ul.innerHTML = "<li>No data yet</li>";
    }
  }
}

loadLeaderboards();
