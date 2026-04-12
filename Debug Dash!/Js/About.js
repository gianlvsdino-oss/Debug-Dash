window.goHome = () => {
  window.location.href = "/Html/Home.html";
};

window.goDebug = () => {
  window.location.href = "/Html/Debug.html";
};

window.goEndless = () => {
  window.location.href = "/Html/Endless.html";
};

window.goAchieve = () => {
  window.location.href = "/Html/Achievements.html";
};

function setupUserSearch() {
  const profileIcon = document.getElementById("profile");
  if (!profileIcon || document.getElementById("navUserSearch")) return;

  const searchWrap = document.createElement("div");
  searchWrap.id = "navUserSearch";
  searchWrap.style.position = "absolute";
  searchWrap.style.right = "100px";
  searchWrap.style.top = `${profileIcon.offsetTop + 4}px`;
  searchWrap.style.zIndex = "20";
  searchWrap.style.display = "flex";
  searchWrap.style.alignItems = "center";
  searchWrap.style.gap = "8px";

  const input = document.createElement("input");
  input.type = "text";
  input.placeholder = "Search user...";
  input.style.width = "170px";
  input.style.padding = "8px 12px";
  input.style.borderRadius = "999px";
  input.style.border = "1px solid rgba(145, 176, 255, 0.35)";
  input.style.background = "rgba(11, 20, 54, 0.95)";
  input.style.color = "#eef4ff";
  input.style.fontFamily = '"Space Grotesk", sans-serif';
  input.style.fontSize = "12px";
  input.style.outline = "none";

  const button = document.createElement("button");
  button.type = "button";
  button.textContent = "Search";
  button.style.height = "30px";
  button.style.padding = "0 12px";
  button.style.borderRadius = "999px";
  button.style.border = "0";
  button.style.background = "rgba(255, 255, 255, 0.95)";
  button.style.color = "#000000";
  button.style.fontFamily = '"Space Grotesk", sans-serif';
  button.style.fontWeight = "600";
  button.style.cursor = "pointer";

  const submitSearch = () => {
    const value = input.value.trim();
    if (!value) return;
    window.location.href = `/Html/Profile.html?user=${encodeURIComponent(value)}`;
  };

  input.addEventListener("keydown", (event) => {
    if (event.key !== "Enter") return;
    submitSearch();
  });

  button.addEventListener("click", submitSearch);

  searchWrap.appendChild(input);
  searchWrap.appendChild(button);
  profileIcon.parentNode.insertBefore(searchWrap, profileIcon);

  window.addEventListener("resize", () => {
    searchWrap.style.top = `${profileIcon.offsetTop + 5}px`;
  });
}

const profile = document.getElementById("profile");
if (profile) {
  profile.addEventListener("click", () => {
    window.location.href = "/Html/Profile.html";
  });
}

setupUserSearch();
