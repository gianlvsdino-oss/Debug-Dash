import { initializeApp, getApps, getApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCzfz11yiUX9nT0eGD6vG7RfdKQ4aMu14I",
  authDomain: "debugdash.firebaseapp.com",
  projectId: "debugdash",
  storageBucket: "debugdash.firebasestorage.app",
  messagingSenderId: "38852642244",
  appId: "1:38852642244:web:a25c903370779914a19091",
  measurementId: "G-6KBYQ2ZKFG"
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);

function createMenu() {
  const toggle = document.createElement("button");
  toggle.type = "button";
  toggle.className = "side-menu-toggle";
  toggle.setAttribute("aria-label", "Open quick menu");
  toggle.textContent = "Menu";

  const menu = document.createElement("div");
  menu.className = "profile-menu";
  menu.innerHTML = `
    <button type="button" data-action="about">About Us</button>
    <button type="button" data-action="contact">Contact</button>
    <button type="button" data-action="howto">How To Play</button>
    <button type="button" class="logout" data-action="logout">Log Out</button>
  `;

  document.body.appendChild(toggle);
  document.body.appendChild(menu);
  return { toggle, menu };
}

function createHowToPlayModal() {
  const modal = document.createElement("div");
  modal.className = "menu-modal-backdrop";
  modal.innerHTML = `
    <div class="menu-modal" role="dialog" aria-modal="true" aria-labelledby="howToPlayTitle">
      <div class="menu-modal-header">
        <h2 id="howToPlayTitle">How To Play</h2>
        <button type="button" class="menu-modal-close" aria-label="Close">×</button>
      </div>
      <ul class="how-to-play-list">
        <li><strong>1. Choose a mode</strong>Pick Debug, Endless, or other quiz modes from the navigation to start a challenge.</li>
        <li><strong>2. Read the code carefully</strong>Each question shows a bug or syntax issue. Focus on what is wrong before rushing.</li>
        <li><strong>3. Pick the best answer fast</strong>Your score improves when you answer correctly and keep your streak alive.</li>
        <li><strong>4. Track your progress</strong>Use the profile page to see completed levels, streaks, achievements, and your current tags.</li>
        <li><strong>5. Keep practicing</strong>Replay modes to improve accuracy, reaction time, and debugging confidence.</li>
      </ul>
    </div>
  `;

  document.body.appendChild(modal);
  return modal;
}

async function logoutUser() {
  try {
    localStorage.removeItem("userAvatar");
    await signOut(auth);
    window.location.href = "/index.html";
  } catch (error) {
    console.error("Logout failed:", error);
    alert("Unable to log out right now. Please try again.");
  }
}

function setupProfileMenu() {
  if (!document.body) {
    return;
  }

  const { toggle, menu } = createMenu();
  const howToPlayModal = createHowToPlayModal();
  const closeModalButton = howToPlayModal.querySelector(".menu-modal-close");

  const closeMenu = () => menu.classList.remove("is-open");
  const openMenu = () => menu.classList.add("is-open");
  const toggleMenu = () => menu.classList.toggle("is-open");
  const openHowToPlay = () => howToPlayModal.classList.add("is-open");
  const closeHowToPlay = () => howToPlayModal.classList.remove("is-open");

  toggle.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    toggleMenu();
  });

  menu.addEventListener("click", async (event) => {
    const actionButton = event.target.closest("button[data-action]");
    if (!actionButton) {
      return;
    }

    const action = actionButton.dataset.action;
    closeMenu();

    if (action === "about") {
      window.location.href = "/Html/About.html";
      return;
    }

    if (action === "contact") {
      window.location.href = "/Html/Contact.html";
      return;
    }

    if (action === "howto") {
      openHowToPlay();
      return;
    }

    if (action === "logout") {
      await logoutUser();
    }
  });

  closeModalButton.addEventListener("click", closeHowToPlay);

  howToPlayModal.addEventListener("click", (event) => {
    if (event.target === howToPlayModal) {
      closeHowToPlay();
    }
  });

  document.addEventListener("click", (event) => {
    if (!menu.contains(event.target) && event.target !== toggle) {
      closeMenu();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
      closeHowToPlay();
    }
  });
}

window.logoutUser = logoutUser;

setupProfileMenu();
