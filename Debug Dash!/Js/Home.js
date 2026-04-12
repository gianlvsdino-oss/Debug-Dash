function goHome() {
    window.location.href = "Home.html";
}

function goDebug() {
    window.location.href = "/Html/Debug.html";
}

function goEndless() {
    window.location.href = "/Html/Endless.html";
}

function goAchieve() {
    window.location.href = "/Html/Achievements.html";
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

const codeText = `
<span class="keyword">const</span> streak = 0;
<span class="keyword">function</span> updateStreak() {
  <span class="keyword">if</span> (streak > 0) {
    <span class="func">console</span>.log(<span class="string">"Streak updated!"</span>);
    <span class="func">document</span>.getElementById(<span class="string">"DebugDash"</span>);
  } <span class="keyword">else</span> {
    <span class="func">console</span>.log(<span class="string">"Start playing..."</span>);
  }
}
<span class="func">updateStreak</span>();
`;

const typingElement = document.getElementById("typing");

let i = 0;
let currentHTML = "";

function typeChar() {
  if (i < codeText.length) {
    currentHTML += codeText[i];
    typingElement.innerHTML = currentHTML;
    i++;
    setTimeout(typeChar, 35);
  }
}

typeChar();
