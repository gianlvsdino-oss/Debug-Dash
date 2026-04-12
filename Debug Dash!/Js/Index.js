import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInAnonymously, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc 
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const login = document.getElementById("create");
const singin = document.getElementById("already");
const leftTitle = document.getElementById("title-left");
const rightTitle = document.getElementById("title-right");

function showGameName(side) {
    if (side === "left") {
        leftTitle.classList.add("show");
        rightTitle.classList.remove("show");
        return;
    }

    rightTitle.classList.add("show");
    leftTitle.classList.remove("show");
}

login.addEventListener("click", () => {
    document.getElementById("box1").style.animation = "loginOut 1s ease forwards";
    document.getElementById("box2").style.animation = "signIn 1s ease forwards";
    showGameName("left");
})

singin.addEventListener("click", () => {
    document.getElementById("box1").style.animation = "loginIn 1s ease forwards";
    document.getElementById("box2").style.animation = "signOut 1s ease forwards";
    showGameName("right");
})

// Password toggle functionality
document.getElementById("toggle1").addEventListener("click", function() {
    const passInput = document.getElementById("pass1");
    const isPassword = passInput.type === "password";
    passInput.type = isPassword ? "text" : "password";
    this.textContent = isPassword ? "🙈" : "👁️";
});

document.getElementById("toggle2").addEventListener("click", function() {
    const passInput = document.getElementById("pass2");
    const isPassword = passInput.type === "password";
    passInput.type = isPassword ? "text" : "password";
    this.textContent = isPassword ? "🙈" : "👁️";
});

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
const provider = new GoogleAuthProvider();

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

window.guestLogin = async () => {
  try {
    const userCred = await signInAnonymously(auth);
    const user = userCred.user;

    const username = "Guest" + Math.floor(Math.random() * 9000 + 1000);

    await setDoc(doc(db, "users", user.uid), {
      username: username,
      usernameLower: username.toLowerCase(),
      cssLevel: 1,
      htmlLevel: 1,
      javaLevel: 1,
      jsLevel: 1,
      correct: 0,
      wrong: 0,
      isGuest: true,
      htmlStreak: 0,
      cssStreak: 0,
      jsStreak: 0,
      javaStreak: 0,
    });

    window.location.href = "/Html/Home.html";
  } catch (error) {
    console.error(error);
    showSitePopup("Login Error", error.message);
  }
};

window.signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    const username = user.email ? user.email.split("@")[0] : "user" + Math.random().toString(36).substr(2, 9);

    const userRef = doc(db, "users", user.uid);
    const snap = await getDoc(userRef);

    if (!snap.exists()) {

      await setDoc(userRef, {
        username: username,
        usernameLower: username.toLowerCase(),
        email: user.email,
        cssLevel: 1,
        htmlLevel: 1,
        javaLevel: 1,
        jsLevel: 1,
        correct: 0,
        wrong: 0,
        isGuest: false,
        htmlStreak: 0,
        cssStreak: 0,
        jsStreak: 0,
        javaStreak: 0,
      });
    } else {
  
      await setDoc(userRef, {
        username: username,           
        usernameLower: username.toLowerCase(),
        email: user.email,             
      }, { merge: true });
    }

    window.location.href = "/Html/Home.html";
  } catch (error) {
    console.error("Google Sign-In Error:", error);
    showSitePopup("Google Login Failed", error.message || "Please enable Google Sign-In in Firebase Console and ensure authorized domains are configured.");
  }
};

document.getElementById("googlelog").addEventListener("click", signInWithGoogle);
document.getElementById("googlesign").addEventListener("click", signInWithGoogle);

document.getElementById("guestlog").addEventListener("click", guestLogin);
document.getElementById("guestsign").addEventListener("click", guestLogin);

document.getElementById("btn2").onclick = async () => {
  const email = document.getElementById("gmail2").value;
  const usernameInput = document.getElementById("user2").value;
  const password = document.getElementById("pass2").value;

  try {
    const userCred = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCred.user;

    const shortUsername = usernameInput.substring(0,8);

    await setDoc(doc(db, "users", user.uid), {
      username: shortUsername,
      usernameLower: shortUsername.toLowerCase(),
      email: email,
      cssLevel: 1,
      htmlLevel: 1,
      javaLevel: 1,
      jsLevel: 1,
      correct: 0,
      wrong: 0,
      isGuest: false,
      htmlStreak: 0,
      cssStreak: 0,
      jsStreak: 0,
      javaStreak: 0,
    }, { merge: true });

    window.location.href = "/Html/Home.html";
  } catch (error) {
    console.error(error);
    showSitePopup("Sign Up Error", error.message);
  }
};

document.getElementById("btn1").onclick = async () => {
  const email = document.getElementById("user1").value;
  const password = document.getElementById("pass1").value;

  try {
    const userCred = await signInWithEmailAndPassword(auth, email, password);
    const user = userCred.user;

    window.location.href = "/Html/Home.html";
  } catch (error) {
    console.error(error);
    showSitePopup("Login Error", error.message);
  }
};
