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

const profile = document.getElementById("profile");

profile.addEventListener("click", () => { 
    window.location.href = "/Html/Profile.html";
})



import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { collection, getFirestore, doc, getDoc, getDocs, limit, query, updateDoc, where } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

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
const profileParams = new URLSearchParams(window.location.search);
const searchedUsername = profileParams.get("user");

function normalizeSearchValue(value) {
  return String(value || "").trim().toLowerCase();
}

function getDisplayUsername(rawUsername) {
  let username = String(rawUsername || "Player").trim();
  const words = username.split(/\s+/).filter(Boolean);

  if (words.length > 1) {
    username = words[0] + words[1][0];
  }

  username = username.substring(0, 8);
  if (username.length < 6) {
    username = username.padEnd(6, "_");
  }

  return username;
}

function getSearchableUsernameKeys(data) {
  const keys = new Set();
  const rawUsername = String(data?.username || "").trim();
  const usernameLower = normalizeSearchValue(data?.usernameLower);

  if (usernameLower) {
    keys.add(usernameLower);
  }

  if (!rawUsername) {
    return keys;
  }

  const rawLower = normalizeSearchValue(rawUsername);
  const displayUsername = getDisplayUsername(rawUsername);
  const displayLower = normalizeSearchValue(displayUsername);
  const displayWithoutPadding = displayLower.replace(/_+$/g, "");
  const compactLower = rawLower.replace(/\s+/g, "");

  keys.add(rawLower);
  keys.add(compactLower);
  keys.add(displayLower);

  if (displayWithoutPadding) {
    keys.add(displayWithoutPadding);
  }

  return keys;
}

const sitePopupStyle = document.createElement("style");
sitePopupStyle.textContent = `
  .site-popup-container {
    position: fixed;
    top: 22px;
    right: 22px;
    z-index: 10000;
    display: flex;
    flex-direction: column;
    gap: 10px;
    pointer-events: none;
  }

  .site-popup {
    min-width: 240px;
    max-width: 320px;
    padding: 14px 16px;
    border-radius: 14px;
    background: linear-gradient(135deg, rgba(17, 28, 68, 0.98), rgba(34, 60, 138, 0.95));
    border: 1px solid rgba(138, 173, 255, 0.4);
    color: #eef4ff;
    box-shadow: 0 14px 35px rgba(0, 0, 0, 0.28);
    transform: translateX(120%);
    opacity: 0;
    animation: sitePopupIn 0.28s ease forwards, sitePopupOut 0.28s ease forwards 3s;
  }

  .site-popup strong {
    display: block;
    margin-bottom: 4px;
    font-family: "Poppins", sans-serif;
    font-size: 14px;
    color: #97e7ff;
  }

  .site-popup span {
    display: block;
    font-family: "Space Grotesk", sans-serif;
    font-size: 12px;
    color: #dce8ff;
  }

  @keyframes sitePopupIn {
    from { transform: translateX(120%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }

  @keyframes sitePopupOut {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(120%); opacity: 0; }
  }
`;
document.head.appendChild(sitePopupStyle);

function getSitePopupContainer() {
  let container = document.querySelector(".site-popup-container");
  if (!container) {
    container = document.createElement("div");
    container.className = "site-popup-container";
    document.body.appendChild(container);
  }
  return container;
}

function showSitePopup(title, message) {
  const container = getSitePopupContainer();
  const popup = document.createElement("div");
  popup.className = "site-popup";
  popup.innerHTML = `<strong>${title}</strong><span>${message}</span>`;
  container.appendChild(popup);

  setTimeout(() => {
    popup.remove();
  }, 3400);
}

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
  input.value = searchedUsername || "";
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
  button.style.fontWeight = "600";

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

const profileTitleOrder = [
  { id: "html_lvl_1", title: "Tag Starter" },
  { id: "html_lvl_2", title: "Element Explorer" },
  { id: "html_lvl_3", title: "Markup Maker" },
  { id: "html_lvl_5", title: "Structure Builder" },
  { id: "html_lvl_7", title: "DOM Explorer" },
  { id: "html_lvl_10", title: "Page Creator" },
  { id: "html_lvl_12", title: "Layout Crafter" },
  { id: "html_lvl_15", title: "Web Builder" },
  { id: "html_lvl_18", title: "HTML Architect" },
  { id: "html_lvl_20", title: "Markup Legend" },
  { id: "html_end_3", title: "Quick Tagger" },
  { id: "html_end_5", title: "Fast Builder" },
  { id: "html_end_7", title: "Code Assembler" },
  { id: "html_end_10", title: "Rapid Structurer" },
  { id: "html_end_12", title: "Markup Runner" },
  { id: "html_end_15", title: "Flow Builder" },
  { id: "html_end_18", title: "DOM Master" },
  { id: "html_end_20", title: "HTML Warrior" },
  { id: "html_end_25", title: "Endless Architect" },
  { id: "html_end_30", title: "Structure Machine" },
  { id: "css_lvl_1", title: "Style Starter" },
  { id: "css_lvl_2", title: "Color Explorer" },
  { id: "css_lvl_3", title: "Design Builder" },
  { id: "css_lvl_5", title: "Layout Styler" },
  { id: "css_lvl_7", title: "Flex Master" },
  { id: "css_lvl_10", title: "Grid Creator" },
  { id: "css_lvl_12", title: "UI Designer" },
  { id: "css_lvl_15", title: "Visual Artist" },
  { id: "css_lvl_18", title: "Style Architect" },
  { id: "css_lvl_20", title: "Design Legend" },
  { id: "css_end_3", title: "Quick Styler" },
  { id: "css_end_5", title: "Fast Designer" },
  { id: "css_end_7", title: "Style Runner" },
  { id: "css_end_10", title: "CSS Grinder" },
  { id: "css_end_12", title: "Visual Builder" },
  { id: "css_end_15", title: "Layout Master" },
  { id: "css_end_18", title: "UI Warrior" },
  { id: "css_end_20", title: "Design Machine" },
  { id: "css_end_25", title: "Endless Styler" },
  { id: "css_end_30", title: "CSS God" },
  { id: "js_lvl_1", title: "Script Starter" },
  { id: "js_lvl_2", title: "Logic Explorer" },
  { id: "js_lvl_3", title: "Function Builder" },
  { id: "js_lvl_5", title: "Event Master" },
  { id: "js_lvl_7", title: "DOM Controller" },
  { id: "js_lvl_10", title: "JS Developer" },
  { id: "js_lvl_12", title: "Async Thinker" },
  { id: "js_lvl_15", title: "Logic Architect" },
  { id: "js_lvl_20", title: "Code Strategist" },
  { id: "js_lvl_25", title: "JS Legend" },
  { id: "js_end_3", title: "Quick Thinker" },
  { id: "js_end_5", title: "Fast Debugger" },
  { id: "js_end_7", title: "Logic Runner" },
  { id: "js_end_10", title: "Bug Hunter" },
  { id: "js_end_12", title: "Code Breaker" },
  { id: "js_end_15", title: "JS Warrior" },
  { id: "js_end_18", title: "Script Master" },
  { id: "js_end_20", title: "Debug Machine" },
  { id: "js_end_25", title: "Endless Coder" },
  { id: "js_end_30", title: "JS God" },
  { id: "java_lvl_1", title: "Java Starter" },
  { id: "java_lvl_2", title: "Class Explorer" },
  { id: "java_lvl_3", title: "Object Builder" },
  { id: "java_lvl_5", title: "OOP Master" },
  { id: "java_lvl_7", title: "Method Creator" },
  { id: "java_lvl_10", title: "Java Developer" },
  { id: "java_lvl_12", title: "System Builder" },
  { id: "java_lvl_15", title: "Backend Thinker" },
  { id: "java_lvl_20", title: "Code Architect" },
  { id: "java_lvl_25", title: "Java Legend" },
  { id: "java_end_3", title: "Quick Compiler" },
  { id: "java_end_5", title: "Fast Coder" },
  { id: "java_end_7", title: "System Runner" },
  { id: "java_end_10", title: "Bug Crusher" },
  { id: "java_end_12", title: "Logic Builder" },
  { id: "java_end_15", title: "Java Warrior" },
  { id: "java_end_18", title: "OOP Mastermind" },
  { id: "java_end_20", title: "System Machine" },
  { id: "java_end_25", title: "Endless Engineer" },
  { id: "java_end_30", title: "Java God" }
];

const legacyAchievementMap = {
  html1: "html_lvl_1",
  css1: "css_lvl_1",
  js1: "js_lvl_1",
  java1: "java_lvl_1",
  html10: "html_lvl_10",
  css10: "css_lvl_10",
  js10: "js_lvl_10",
  java10: "java_lvl_10",
  html12: "html_lvl_20",
  css12: "css_lvl_20",
  js12: "js_lvl_12",
  java12: "java_lvl_12"
};

const validAchievementIds = new Set(profileTitleOrder.map((entry) => entry.id));

function getCompletedLevel(value) {
  return Math.max(Number(value ?? 1) - 1, 0);
}

function getNormalizedAchievements(data) {
  const rawAchievements = data.achievements || {};
  const normalizedAchievements = {};

  Object.keys(rawAchievements).forEach((achievementId) => {
    if (!rawAchievements[achievementId]) {
      return;
    }

    const normalizedId = legacyAchievementMap[achievementId] || achievementId;
    if (validAchievementIds.has(normalizedId)) {
      normalizedAchievements[normalizedId] = true;
    }
  });

  return normalizedAchievements;
}

async function getProfileData(user) {
  if (searchedUsername) {
    const normalizedSearch = normalizeSearchValue(searchedUsername);
    const searchedQuery = query(
      collection(db, "users"),
      where("usernameLower", "==", normalizedSearch),
      limit(1)
    );
    const searchSnap = await getDocs(searchedQuery);
    if (!searchSnap.empty) {
      return {
        data: searchSnap.docs[0].data(),
        isOwnProfile: !!user && searchSnap.docs[0].id === user.uid
      };
    }

    const usersSnap = await getDocs(collection(db, "users"));
    const matchedDoc = usersSnap.docs.find((userDoc) =>
      getSearchableUsernameKeys(userDoc.data()).has(normalizedSearch)
    );

    if (matchedDoc) {
      return {
        data: matchedDoc.data(),
        isOwnProfile: !!user && matchedDoc.id === user.uid
      };
    }

    return null;
  }

  if (!user) {
    return null;
  }

  const docRef = doc(db, "users", user.uid);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) {
    return null;
  }

  return {
    data: docSnap.data(),
    isOwnProfile: true
  };
}

function getEarnedTitles(data) {
  const unlockedAchievements = getNormalizedAchievements(data);
  return profileTitleOrder
    .filter((entry) => unlockedAchievements[entry.id])
    .map((entry) => entry.title);
}

function getDisplayedTitles(data) {
  const earnedTitles = getEarnedTitles(data);
  const selectedTitles = Array.isArray(data.profileTitles) ? data.profileTitles : [];
  const validSelectedTitles = selectedTitles.filter((title) => earnedTitles.includes(title)).slice(0, 4);

  if (validSelectedTitles.length > 0) {
    return validSelectedTitles;
  }

  return earnedTitles.slice(0, 4);
}

function renderProfileTitles(data) {
  const titleElements = [
    document.getElementById("title1"),
    document.getElementById("title2"),
    document.getElementById("title3"),
    document.getElementById("title4")
  ];

  const earnedTitles = getDisplayedTitles(data);

  titleElements.forEach((element, index) => {
    element.textContent = earnedTitles[index] || "";
    element.style.display = earnedTitles[index] ? "inline-flex" : "none";
  });

  if (earnedTitles.length === 0) {
    titleElements[0].textContent = "No title yet";
    titleElements[0].style.display = "inline-flex";
  }
}

function renderTagSelector(data) {
  const tagOptions = document.getElementById("tagOptions");
  const earnedTitles = getEarnedTitles(data);
  const selectedTitles = new Set(getDisplayedTitles(data));

  tagOptions.innerHTML = "";

  if (earnedTitles.length === 0) {
    tagOptions.innerHTML = "<p>No unlocked tags yet.</p>";
    return;
  }

  earnedTitles.forEach((title) => {
    const tagButton = document.createElement("button");
    tagButton.type = "button";
    tagButton.className = "tag-option";
    tagButton.textContent = title;

    if (selectedTitles.has(title)) {
      tagButton.classList.add("selected");
    }

    tagButton.addEventListener("click", () => {
      const isSelected = tagButton.classList.contains("selected");

      if (!isSelected && selectedTitles.size >= 4) {
        showSitePopup("Tag Limit", "You can select up to 4 tags only.");
        return;
      }

      if (isSelected) {
        selectedTitles.delete(title);
        tagButton.classList.remove("selected");
      } else {
        selectedTitles.add(title);
        tagButton.classList.add("selected");
      }

      tagOptions.dataset.selectedTitles = JSON.stringify(Array.from(selectedTitles));
    });

    tagOptions.appendChild(tagButton);
  });

  tagOptions.dataset.selectedTitles = JSON.stringify(Array.from(selectedTitles));
}

onAuthStateChanged(auth, async (user) => {
  const userElement = document.getElementById("user");
  const profilePic = document.querySelector(".pfp img");
  const changepfp = document.getElementById("changepfp"); 
  const editTags = document.getElementById("editTags");

  if (!user) {
    userElement.textContent = "Guest";
    profilePic.src = "/Pics/guest.jfif";
    changepfp.style.display = "none";
    editTags.style.display = "none";
    return;
  }

  const profileData = await getProfileData(user);
  if (!profileData) {
    userElement.textContent = searchedUsername ? "User not found" : "Guest";
    profilePic.src = "/Pics/guest.jfif";
    changepfp.style.display = "none";
    editTags.style.display = "none";
    renderProfileTitles({});
    return;
  }

  const { data, isOwnProfile } = profileData;

  userElement.textContent = getDisplayUsername(data.username);

  document.getElementById("htmlStreak").textContent = data.htmlStreak || 0;
  document.getElementById("cssStreak").textContent = data.cssStreak || 0;
  document.getElementById("jsStreak").textContent = data.jsStreak || 0;
  document.getElementById("javaStreak").textContent = data.javaStreak || 0;

  document.getElementById("correct").textContent = data.correct || 0;
  document.getElementById("wrong").textContent = data.wrong || 0;

  const htmlLevel = getCompletedLevel(data.htmlLevel);
  const cssLevel  = getCompletedLevel(data.cssLevel);
  const jsLevel   = getCompletedLevel(data.jsLevel);
  const javaLevel = getCompletedLevel(data.javaLevel);
  const totalCompleted = htmlLevel + cssLevel + jsLevel + javaLevel;
  document.getElementById("complete").textContent = totalCompleted;
  document.getElementById("end").textContent = Math.max(
    Number(data.htmlStreak || 0),
    Number(data.cssStreak || 0),
    Number(data.jsStreak || 0),
    Number(data.javaStreak || 0)
  );
  document.getElementById("achi").textContent = Object.keys(getNormalizedAchievements(data)).length;
  renderProfileTitles(data);
  renderTagSelector(data);

  const isGuestAccount = Boolean(data.isGuest);

  changepfp.style.display = isOwnProfile ? "block" : "none";
  editTags.style.display = isOwnProfile && !isGuestAccount ? "inline-flex" : "none";

  if (isGuestAccount) {
    profilePic.src = "/Pics/guest.jfif";
    if (isOwnProfile) {
      localStorage.removeItem("userAvatar");
    }
  } else {
    const savedAvatar = isOwnProfile ? localStorage.getItem("userAvatar") : null;
    profilePic.src = savedAvatar ? "/Pics/" + savedAvatar : "/Pics/guest.jfif";
  }
});

const changepfp = document.getElementById("changepfp");

changepfp.addEventListener("click", () => {
  document.getElementById("levels").style.display = "block";
  document.getElementById("levels").style.animation = "blurIn 0.2s ease forwards"
  document.getElementById("imgs").style.animation = "showdown 0.3s ease forwards";
})


const exit = document.getElementById("exit");
const editTags = document.getElementById("editTags");
const tagSelector = document.getElementById("tagSelector");
const saveTags = document.getElementById("saveTags");
const closeTags = document.getElementById("closeTags");

exit.addEventListener("click", () => {
  document.getElementById("levels").style.animation = "blurOut 0.2s ease forwards"
  document.getElementById("imgs").style.animation = "hideup 0.3s ease forwards";
  document.getElementById("levels").style.display = "none";
})

const profilePic = document.querySelector(".pfp img");
const avatars = document.querySelectorAll(".imgs img:not(#exit)");

avatars.forEach(img => {
  img.addEventListener("click", () => {
    if (!auth.currentUser) {
      showSitePopup("Login Required", "Please log in first to change your avatar.");
      return;
    }

    if (auth.currentUser.isAnonymous) {
      showSitePopup("Guest Account", "Guest accounts use the default guest avatar.");
      return;
    }

    const fileName = img.src.split("/Pics/")[1];

    localStorage.setItem("userAvatar", fileName);

    profilePic.src = "/Pics/" + fileName;

    document.getElementById("levels").style.display = "none";
    document.getElementById("imgs").style.animation = "hideup 0.3s ease forwards";
  });
});

editTags.addEventListener("click", () => {
  document.getElementById("levels").style.display = "block";
  document.getElementById("levels").style.animation = "blurIn 0.2s ease forwards";
  tagSelector.style.display = "block";
});

closeTags.addEventListener("click", () => {
  tagSelector.style.display = "none";
  document.getElementById("levels").style.display = "none";
});

saveTags.addEventListener("click", async () => {
  const user = auth.currentUser;
  if (!user) return;

  const tagOptions = document.getElementById("tagOptions");
  const selectedTitles = JSON.parse(tagOptions.dataset.selectedTitles || "[]").slice(0, 4);

  await updateDoc(doc(db, "users", user.uid), {
    profileTitles: selectedTitles
  });

  const updatedSnap = await getDoc(doc(db, "users", user.uid));
  if (updatedSnap.exists()) {
    renderProfileTitles(updatedSnap.data());
    renderTagSelector(updatedSnap.data());
  }

  tagSelector.style.display = "none";
  document.getElementById("levels").style.display = "none";
});
