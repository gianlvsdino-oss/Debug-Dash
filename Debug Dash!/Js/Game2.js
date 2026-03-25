import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, doc, getDoc, updateDoc, increment } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const achievementPopupStyle = document.createElement("style");
achievementPopupStyle.textContent = `
  .achievement-toast-container {
    position: fixed;
    top: 24px;
    right: 24px;
    z-index: 9999;
    display: flex;
    flex-direction: column;
    gap: 12px;
    pointer-events: none;
  }

  .achievement-toast {
    min-width: 240px;
    max-width: 320px;
    padding: 15px 17px;
    border-radius: 16px;
    background: linear-gradient(135deg, rgba(15, 26, 64, 0.98), rgba(31, 55, 126, 0.96));
    border: 1px solid rgba(126, 172, 255, 0.45);
    border-left: 5px solid #7ed3ff;
    color: #eef4ff;
    box-shadow: 0 14px 35px rgba(0, 0, 0, 0.34);
    transform: translateX(120%);
    opacity: 0;
    animation: achievementToastIn 0.35s ease forwards, achievementToastOut 0.35s ease forwards 3.2s;
  }

  .achievement-toast strong {
    display: block;
    font-family: "Poppins", sans-serif;
    font-size: 14px;
    font-weight: 700;
    letter-spacing: 0.3px;
    margin-bottom: 5px;
    color: #8fe8ff;
  }

  .achievement-toast span {
    font-family: "Space Grotesk", sans-serif;
    font-size: 12px;
    font-weight: 500;
    letter-spacing: 0.2px;
    color: #d9e6ff;
  }

  @keyframes achievementToastIn {
    from {
      transform: translateX(120%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  @keyframes achievementToastOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(120%);
      opacity: 0;
    }
  }
`;
document.head.appendChild(achievementPopupStyle);

const endlessAchievementTitles = {
  html: {
    3: "Quick Tagger",
    5: "Fast Builder",
    7: "Code Assembler",
    10: "Rapid Structurer",
    12: "Markup Runner",
    15: "Flow Builder",
    18: "DOM Master",
    20: "HTML Warrior",
    25: "Endless Architect",
    30: "Structure Machine"
  },
  css: {
    3: "Quick Styler",
    5: "Fast Designer",
    7: "Style Runner",
    10: "CSS Grinder",
    12: "Visual Builder",
    15: "Layout Master",
    18: "UI Warrior",
    20: "Design Machine",
    25: "Endless Styler",
    30: "CSS God"
  },
  js: {
    3: "Quick Thinker",
    5: "Fast Debugger",
    7: "Logic Runner",
    10: "Bug Hunter",
    12: "Code Breaker",
    15: "JS Warrior",
    18: "Script Master",
    20: "Debug Machine",
    25: "Endless Coder",
    30: "JS God"
  },
  java: {
    3: "Quick Compiler",
    5: "Fast Coder",
    7: "System Runner",
    10: "Bug Crusher",
    12: "Logic Builder",
    15: "Java Warrior",
    18: "OOP Mastermind",
    20: "System Machine",
    25: "Endless Engineer",
    30: "Java God"
  }
};

function getAchievementToastContainer() {
    let container = document.querySelector(".achievement-toast-container");
    if (!container) {
        container = document.createElement("div");
        container.className = "achievement-toast-container";
        document.body.appendChild(container);
    }
    return container;
}

function showAchievementToast(title, subtitle) {
    const container = getAchievementToastContainer();
    const toast = document.createElement("div");
    toast.className = "achievement-toast";
    toast.innerHTML = `<strong>${title}</strong><span>${subtitle}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3700);
}

async function unlockAchievement(achievementId, achievementText) {
    const user = auth.currentUser;
    if (!user) return;

    const userRef = doc(db, "users", user.uid);
    const snap = await getDoc(userRef);
    const data = snap.exists() ? snap.data() : {};
    const achievements = data.achievements || {};

    if (achievements[achievementId]) {
        return;
    }

    achievements[achievementId] = true;
    await updateDoc(userRef, {
        achievements: achievements
    });

    showAchievementToast("Achievement Unlocked", achievementText);
}

function getAchievementLangKey(language) {
    const langMap = {
        HTML: "html",
        CSS: "css",
        JavaScript: "js",
        Java: "java"
    };

    return langMap[language];
}

async function checkEndlessAchievements(language, streakValue) {
    const achievementLang = getAchievementLangKey(language);
    const achievementTitle = endlessAchievementTitles[achievementLang]?.[streakValue];

    if (!achievementLang || !achievementTitle) {
        return;
    }

    await unlockAchievement(
        `${achievementLang}_end_${streakValue}`,
        `${language} ${achievementTitle}`
    );
}

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

console.log("JS LOADED");

const backbtn = document.getElementById("back");

backbtn.addEventListener("click", function() {
    window.location.href = "/Html/Endless.html";
})

const urlParams = new URLSearchParams(window.location.search);
const selectedLanguage = urlParams.get('language') || "HTML";
document.getElementById('language').innerText = selectedLanguage;


const quizzes = {
    HTML: [
        { question: "<p>Unclosed paragraph tag:</p><p><div></div>", choices: ["Valid HTML","Missing </p>","Missing <html>","Missing <head>"], answer: 1 },
        { question: "<img src='image.png'> missing attribute", choices: ["Missing alt","Missing src","Missing href","Missing style"], answer: 0 },
        { question: "<p>Unclosed paragraph tag:<p>", choices: ["Valid HTML","Missing </p>","Missing <html>","Missing <head>"], answer: 1 },
        { question: "<img src='image.png'>", choices: ["Missing alt","Valid","Missing href","Invalid"], answer: 0 },
        { question: "<div><h1>Hello</div>", choices: ["Valid","Missing </h1>","Missing </div>","Incorrect nesting"], answer: 3 },
        { question: "<a href='link.html'>Click", choices: ["Valid","Missing </a>","Missing href","Missing text"], answer: 1 },
        { question: "<ul><li>Item 1<li>Item2</ul>", choices: ["Valid","Missing </li>","Missing <ul>","Extra tag"], answer: 1 },
        { question: "<!DOCTYPE html>", choices: ["HTML5 declaration","CSS rule","JS function","Meta tag"], answer: 0 },
        { question: "<span></spn>", choices: ["Valid","Incorrect closing tag","Missing </span>","Extra tag"], answer: 1 },
        { question: "<form><input type='text'></form>", choices: ["Valid","Missing action","Missing method","Invalid input"], answer: 0 },
        { question: "<table><tr><td>Data</td></tr>", choices: ["Valid","Missing </table>","Missing <tr>","Missing <td>"], answer: 1 },
        { question: "<head><title>Page</title>", choices: ["Valid","Missing </head>","Missing <html>","Missing <body>"], answer: 1 },
        { question: "<div class='container'>", choices: ["Valid","Missing </div>","Missing class","Invalid syntax"], answer: 1 },
        { question: "<p id='para'>Text", choices: ["Valid","Missing </p>","Missing id","Extra tag"], answer: 1 },
        { question: "<h2>Heading", choices: ["Valid","Missing </h2>","Extra tag","Incorrect nesting"], answer: 1 },
        { question: "<meta charset='UTF-8'>", choices: ["Valid","Missing head","Missing charset","Wrong syntax"], answer: 0 },
        { question: "<link rel='stylesheet' href='style.css'>", choices: ["Valid","Missing rel","Missing href","Incorrect link"], answer: 0 },
        { question: "<input type='checkbox'", choices: ["Valid","Missing >","Wrong type","Extra attribute"], answer: 1 },
        { question: "<script src='app.js'>", choices: ["Valid","Missing </script>","Wrong src","Extra tag"], answer: 1 },
        { question: "<div><p>Text</div>", choices: ["Valid","Incorrect nesting","Missing </p>","Missing </div>"], answer: 1 },
        { question: "<br>", choices: ["Valid self-closing","Needs </br>","Invalid tag","Extra attribute"], answer: 0 },
        { question: "<hr>", choices: ["Valid self-closing","Needs </hr>","Invalid tag","Extra attribute"], answer: 0 },
        { question: "<audio src='audio.mp3'>", choices: ["Valid","Missing controls","Missing src","Extra tag"], answer: 0 },
        { question: "<video src='video.mp4'>", choices: ["Valid","Missing controls","Missing src","Extra tag"], answer: 0 },
        { question: "<button>Click</button>", choices: ["Valid","Missing </button>","Wrong tag","Extra attribute"], answer: 0 },
        { question: "<header><h1>Title</h1>", choices: ["Valid","Missing </header>","Missing <body>","Extra tag"], answer: 1 },
        { question: "<footer>Text</footer>", choices: ["Valid","Missing </footer>","Extra tag","Incorrect nesting"], answer: 0 },
        { question: "<nav><ul><li>Menu</li></ul></nav>", choices: ["Valid","Missing <ul>","Missing <li>","Extra tag"], answer: 0 },
        { question: "<section><p>Content</p></section>", choices: ["Valid","Missing </section>","Extra tag","Incorrect nesting"], answer: 0 },
        { question: "<main><h2>Heading</h2></main>", choices: ["Valid","Missing </main>","Extra tag","Incorrect nesting"], answer: 0 },
        { question:"<div><span>Text</div>",choices:["Missing </span>","Valid","Missing <div>","Extra tag"],answer:0},
        { question:"<title>My Page",choices:["Missing </title>","Valid","Missing <head>","Invalid tag"],answer:0},
        { question:"<body><h1>Hello</h2></body>",choices:["Wrong closing tag","Valid","Missing <body>","Missing <html>"],answer:0},
        { question:"<img alt='photo'>",choices:["Missing src","Valid","Missing alt","Invalid tag"],answer:0},
        { question:"<a>Link</a>",choices:["Missing href","Valid","Missing text","Missing target"],answer:0},
         {question:"<html><body></html>",choices:["Missing </body>","Valid","Wrong order","Missing <head>"],answer:0},
        { question:"<div><p>Hello</p>",choices:["Missing </div>","Valid","Missing </p>","Extra tag"],answer:0},
        {question:"<li>Item</li>",choices:["Missing <ul> or <ol>","Valid","Missing </li>","Extra tag"],answer:0},
        {question:"<table><tr><td>1</td></table>",choices:["Missing </tr>","Valid","Missing <td>","Extra tag"],answer:0},
        {question:"<meta charset=UTF-8>",choices:["Missing quotes","Valid","Missing meta","Invalid tag"],answer:0},
        {question:"<input type='text'",choices:["Missing >","Valid","Missing type","Invalid syntax"],answer:0},
        {question:"<p><b>Bold</p></b>",choices:["Incorrect nesting","Valid","Missing </b>","Extra tag"],answer:0},
        {question:"<iframe src='page.html'>",choices:["Missing </iframe>","Valid","Missing src","Invalid tag"],answer:0},
        {question:"<link href='style.css'>",choices:["Missing rel","Valid","Missing href","Invalid"],answer:0},
        {question:"<button type='submit'>",choices:["Missing </button>","Valid","Wrong type","Extra tag"],answer:0},
        {question:"<form action='submit.php'>",choices:["Missing </form>","Valid","Missing action","Extra tag"],answer:0},
        {question:"<section><article></section>",choices:["Missing </article>","Valid","Wrong nesting","Extra tag"],answer:0},
        {question:"<strong>Text",choices:["Missing </strong>","Valid","Extra tag","Wrong syntax"],answer:0},
        {question:"<nav><ul><li>Menu</nav>",choices:["Missing </li> and </ul>","Valid","Missing nav","Extra tag"],answer:0},
        {question:"<video src='movie.mp4'",choices:["Missing >","Valid","Missing src","Invalid tag"],answer:0},
        {question:"<canvas id='myCanvas'>",choices:["Missing </canvas>","Valid","Wrong attribute","Extra tag"],answer:0},
        {question:"<style>body{color:red}</style",choices:["Missing >","Valid","Missing style","Invalid tag"],answer:0},
        {question:"<html lang=en>",choices:["Missing quotes","Valid","Wrong syntax","Extra tag"],answer:0},
        {question:"<p>Hello<br>Hello",choices:["Missing </p>","Valid","Missing br","Invalid"],answer:0},
        {question:"<script>alert('hi')</script",choices:["Missing >","Valid","Missing script","Invalid"],answer:0},
        {question:"<aside><p>Note</aside>",choices:["Missing </p>","Valid","Wrong nesting","Extra tag"],answer:0},
        {question:"<main><section>",choices:["Missing closing tags","Valid","Wrong nesting","Extra tag"],answer:0},
        {question:"<header><h1>Title</header>",choices:["Missing </h1>","Valid","Wrong syntax","Extra tag"],answer:0},
        {question:"<footer><p>Text</footer>",choices:["Missing </p>","Valid","Extra tag","Invalid"],answer:0},
        {question:"<details><summary>More</details>",choices:["Missing </summary>","Valid","Extra tag","Wrong nesting"],answer:0}
        ],

    CSS: [
        { question: "colorr: red;", choices: ["Typo in property","Valid","Missing value","Missing ;"], answer: 0 },
        { question: "background-color: #fff", choices: ["Valid","Missing ;","Typo in property","Invalid color"], answer: 1 },
        { question: "colorr: red;", choices: ["Typo in property","Valid","Missing value","Missing ;"], answer: 0 },
        { question: "background-color: #fff", choices: ["Valid","Missing ;","Typo","Invalid color"], answer: 1 },
        { question: "font-size 16px;", choices: ["Missing :","Valid","Typo","Missing ;"], answer: 0 },
        { question: "border: 1px solid black", choices: ["Missing ;","Valid","Typo","Invalid"], answer: 0 },
        { question: "margin 0 auto;", choices: ["Missing :","Valid","Typo","Invalid"], answer: 0 },
        { question: "padding: 10px", choices: ["Missing ;","Valid","Typo","Invalid"], answer: 0 },
        { question: "background-colr: blue;", choices: ["Typo","Valid","Missing ;","Invalid"], answer: 0 },
        { question: "color: #333;", choices: ["Valid","Missing ;","Typo","Invalid"], answer: 0 },
        { question: "display block;", choices: ["Missing :","Valid","Typo","Invalid"], answer: 0 },
        { question: "position: relatve;", choices: ["Typo","Valid","Missing ;","Invalid"], answer: 0 },
        { question: "text-align: center;", choices: ["Valid","Missing ;","Typo","Invalid"], answer: 0 },
        { question: "flex-direction row;", choices: ["Missing :","Valid","Typo","Invalid"], answer: 0 },
        { question: "justify-content: center", choices: ["Missing ;","Valid","Typo","Invalid"], answer: 0 },
        { question: "align-items: flex-start;", choices: ["Valid","Missing ;","Typo","Invalid"], answer: 0 },
        { question: "grid-template-columns 1fr 1fr;", choices: ["Missing :","Valid","Typo","Invalid"], answer: 0 },
        { question: "overflow: hiddden;", choices: ["Typo","Valid","Missing ;","Invalid"], answer: 1 },
        { question: "position: absolute;", choices: ["Valid","Missing ;","Typo","Invalid"], answer: 0 },
        { question: "top: 10px", choices: ["Missing ;","Valid","Typo","Invalid"], answer: 0 },
        { question: "left: 20px;", choices: ["Valid","Missing ;","Typo","Invalid"], answer: 0 },
        { question: "float left;", choices: ["Missing :","Valid","Typo","Invalid"], answer: 0 },
        { question: "clear: both;", choices: ["Valid","Missing ;","Typo","Invalid"], answer: 0 },
        { question: "z-index 10;", choices: ["Missing :","Valid","Typo","Invalid"], answer: 0 },
        { question: "position: fixd;", choices: ["Typo","Valid","Missing ;","Invalid"], answer: 0 },
        { question: "border-raduis: 5px;", choices: ["Typo","Valid","Missing ;","Invalid"], answer: 0 },
        { question: "opacity: 0.5", choices: ["Missing ;","Valid","Typo","Invalid"], answer: 0 },
        { question: "visibility: hiddn;", choices: ["Typo","Valid","Missing ;","Invalid"], answer: 0 },
        { question: "background: #000;", choices: ["Valid","Missing ;","Typo","Invalid"], answer: 0 },
        { question: "font-weight bold;", choices: ["Missing :","Valid","Typo","Invalid"], answer: 0 },
        { question: "line-height: 1.5;", choices: ["Valid","Missing ;","Typo","Invalid"], answer: 0 },
        {question:"widht:100px;",choices:["Typo in property","Valid","Missing ;","Invalid"],answer:0},
        {question:"height 200px;",choices:["Missing :","Valid","Typo","Invalid"],answer:0},
        {question:"background-colour:red;",choices:["Typo property","Valid","Missing ;","Invalid"],answer:0},
        {question:"display:flex",choices:["Missing ;","Valid","Typo","Invalid"],answer:0},
        {question:"margin:10px 20px",choices:["Missing ;","Valid","Typo","Invalid"],answer:0},
        {question:"padding 15px;",choices:["Missing :","Valid","Typo","Invalid"],answer:0},
        {question:"font-weigth:bold;",choices:["Typo","Valid","Missing ;","Invalid"],answer:0},
        {question:"text-algin:center;",choices:["Typo","Valid","Missing ;","Invalid"],answer:0},
        {question:"border 1px solid black;",choices:["Missing :","Valid","Typo","Invalid"],answer:0},
        {question:"overflow:hiddden;",choices:["Typo","Valid","Missing ;","Invalid"],answer:0},
        {question:"background:#fff",choices:["Missing ;","Valid","Typo","Invalid"],answer:0},
        {question:"position absolut;",choices:["Missing :","Valid","Typo","Invalid"],answer:0},
        {question:"top 10px;",choices:["Missing :","Valid","Typo","Invalid"],answer:0},
        {question:"left:20px",choices:["Missing ;","Valid","Typo","Invalid"],answer:0},
        {question:"float:left",choices:["Missing ;","Valid","Typo","Invalid"],answer:0},
        {question:"clear both;",choices:["Missing :","Valid","Typo","Invalid"],answer:0},
        {question:"opacity:0.5",choices:["Missing ;","Valid","Typo","Invalid"],answer:0},
        {question:"display:grid",choices:["Missing ;","Valid","Typo","Invalid"],answer:0},
        {question:"grid-template-columns 1fr 1fr;",choices:["Missing :","Valid","Typo","Invalid"],answer:0},
        {question:"align-items center;",choices:["Missing :","Valid","Typo","Invalid"],answer:0},
        {question:"justify-content center;",choices:["Missing :","Valid","Typo","Invalid"],answer:0},
        {question:"border-raduis:10px;",choices:["Typo","Valid","Missing ;","Invalid"],answer:0},
        {question:"font-size 18px;",choices:["Missing :","Valid","Typo","Invalid"],answer:0},
        {question:"line-height 1.5;",choices:["Missing :","Valid","Typo","Invalid"],answer:0},
        {question:"z-index10;",choices:["Missing :","Valid","Typo","Invalid"],answer:0},
        {question:"visibility hiddden;",choices:["Missing :","Valid","Typo","Invalid"],answer:0},
        {question:"background-image url(img.png);",choices:["Missing :","Valid","Typo","Invalid"],answer:0},
        {question:"cursor pointer;",choices:["Missing :","Valid","Typo","Invalid"],answer:0},
        {question:"object-fit cover;",choices:["Missing :","Valid","Typo","Invalid"],answer:0},
        ],

    JavaScript: [
        { question: "consol.log('Hello');", choices: ["Typo","Valid","Missing ;","Invalid"], answer: 0 },
        { question: "let x = 5", choices: ["Missing ;","Valid","Typo","Invalid"], answer: 0 },
        { question: "consol.log('Hello');", choices: ["Typo","Valid","Missing ;","Invalid"], answer: 0 },
        { question: "let x = 5", choices: ["Missing ;","Valid","Typo","Invalid"], answer: 0 },
        { question: "function() {}", choices: ["Missing name","Valid","Typo","Invalid"], answer: 0 },
        { question: "const = 10;", choices: ["Missing variable name","Valid","Typo","Invalid"], answer: 0 },
        { question: "var x = ;", choices: ["Missing value","Valid","Typo","Invalid"], answer: 0 },
        { question: "if(x = 5)", choices: ["Typo operator","Valid","Missing ;","Invalid"], answer: 0 },
        { question: "document.getElementById('id').innerText = 'Hello", choices: ["Missing '","Valid","Typo","Invalid"], answer: 0 },
        { question: "console.log('Test')", choices: ["Missing ;","Valid","Typo","Invalid"], answer: 0 },
        { question: "for(let i = 0 i < 5 i++) {}", choices: ["Missing ;","Valid","Typo","Invalid"], answer: 0 },
        { question: "alert('Hello);", choices: ["Missing '","Valid","Typo","Invalid"], answer: 0 },
        { question: "let arr = [1,2,3;", choices: ["Missing ]","Valid","Typo","Invalid"], answer: 0 },
        { question: "return x", choices: ["Missing ;","Valid","Typo","Invalid"], answer: 0 },
        { question: "if(x === 5){", choices: ["Missing }","Valid","Typo","Invalid"], answer: 0 },
        { question: "switch(x) case 1:", choices: ["Missing {}","Valid","Typo","Invalid"], answer: 0 },
        { question: "while(x < 5", choices: ["Missing )","Valid","Typo","Invalid"], answer: 0 },
        { question: "do { } while(x < 5", choices: ["Missing )","Valid","Typo","Invalid"], answer: 0 },
        { question: "const obj = {a:1,b:2", choices: ["Missing }","Valid","Typo","Invalid"], answer: 0 },
        { question: "let x == 5;", choices: ["Typo operator","Valid","Missing ;","Invalid"], answer: 0 },
        { question: "x = y + ;", choices: ["Missing value","Valid","Typo","Invalid"], answer: 0 },
        { question: "function test( {}", choices: ["Missing )","Valid","Typo","Invalid"], answer: 0 },
        { question: "const x = 'Hello", choices: ["Missing '","Valid","Typo","Invalid"], answer: 0 },
        { question: "console.log('Hi);", choices: ["Missing '","Valid","Typo","Invalid"], answer: 0 },
        { question: "let y = 10", choices: ["Missing ;","Valid","Typo","Invalid"], answer: 0 },
        { question: "for(i = 0 i<5 i++) {}", choices: ["Missing ;","Valid","Typo","Invalid"], answer: 0 },
        { question: "var a = ;", choices: ["Missing value","Valid","Typo","Invalid"], answer: 0 },
        { question: "if(x = y)", choices: ["Typo operator","Valid","Missing ;","Invalid"], answer: 0 },
        { question: "let z == 5;", choices: ["Typo operator","Valid","Missing ;","Invalid"], answer: 0 },
        { question: "console.log(x;", choices: ["Missing )","Valid","Typo","Invalid"], answer: 0 },
        {question:"console.lg('Hi');",choices:["Typo method","Valid","Missing ;","Invalid"],answer:0},
        {question:"let x == 5;",choices:["Wrong operator","Valid","Missing ;","Invalid"],answer:0},
        {question:"var y =",choices:["Missing value","Valid","Typo","Invalid"],answer:0},
        {question:"function test( {}",choices:["Missing )","Valid","Typo","Invalid"],answer:0},
        {question:"if(x > 5 {",choices:["Missing )","Valid","Typo","Invalid"],answer:0},
        {question:"for(i=0;i<5 i++)",choices:["Missing ;","Valid","Typo","Invalid"],answer:0},
        {question:"alert('Hello)",choices:["Missing '","Valid","Typo","Invalid"],answer:0},
        {question:"let arr = [1,2,3",choices:["Missing ]","Valid","Typo","Invalid"],answer:0},
        {question:"document.getElementById(id)",choices:["Missing quotes","Valid","Typo","Invalid"],answer:0},
        {question:"const obj = {a:1,b:2",choices:["Missing }","Valid","Typo","Invalid"],answer:0},
        {question:"while(x<5",choices:["Missing )","Valid","Typo","Invalid"],answer:0},
        {question:"do { } while(x<5",choices:["Missing )","Valid","Typo","Invalid"],answer:0},
        {question:"console.log(x;",choices:["Missing )","Valid","Typo","Invalid"],answer:0},
        {question:"let a 5;",choices:["Missing =","Valid","Typo","Invalid"],answer:0},
        {question:"const name 'John';",choices:["Missing =","Valid","Typo","Invalid"],answer:0},
        {question:"return;",choices:["Valid","Missing ;","Typo","Invalid"],answer:0},
        {question:"function(){}",choices:["Missing name","Valid","Typo","Invalid"],answer:0},
        {question:"if(x=10)",choices:["Wrong operator","Valid","Typo","Invalid"],answer:0},
        {question:"console.log()",choices:["Valid","Missing ;","Typo","Invalid"],answer:0},
        {question:"let num = '5",choices:["Missing '","Valid","Typo","Invalid"],answer:0},
        {question:"x = y + ;",choices:["Missing value","Valid","Typo","Invalid"],answer:0},
        {question:"document.write('Hi)",choices:["Missing '","Valid","Typo","Invalid"],answer:0},
        {question:"for(let i=0;i<10)",choices:["Missing i++","Valid","Typo","Invalid"],answer:0},
        {question:"setTimeout()",choices:["Valid","Missing ;","Typo","Invalid"],answer:0},
        {question:"JSON.parse()",choices:["Valid","Missing ;","Typo","Invalid"],answer:0},
        {question:"Math.random(",choices:["Missing )","Valid","Typo","Invalid"],answer:0},
        {question:"console.log('Test'",choices:["Missing )","Valid","Typo","Invalid"],answer:0},
        {question:"let a = ;",choices:["Missing value","Valid","Typo","Invalid"],answer:0},
        {question:"while true {}",choices:["Missing ()","Valid","Typo","Invalid"],answer:0},
        {question:"function test(){",choices:["Missing }","Valid","Typo","Invalid"],answer:0}
        ],

    Java: [
        { question: "public statc void main(String[] args) {}", choices: ["Typo in static","Valid","Missing ;","Invalid"], answer: 0 },
        { question: "int x = 5", choices: ["Missing ;","Valid","Typo","Invalid"], answer: 0 },
        { question: "public statc void main(String[] args) {}", choices: ["Typo in static","Valid","Missing ;","Invalid"], answer: 0 },
        { question: "int x = 5", choices: ["Missing ;","Valid","Typo","Invalid"], answer: 0 },
        { question: "System.out.println('Hello)", choices: ["Missing '","Valid","Typo","Invalid"], answer: 0 },
        { question: "if(x = 5) {}", choices: ["Typo operator","Valid","Missing ;","Invalid"], answer: 0 },
        { question: "for(int i = 0 i < 5 i++) {}", choices: ["Missing ;","Valid","Typo","Invalid"], answer: 0 },
        { question: "String name = 'John;", choices: ["Missing '","Valid","Typo","Invalid"], answer: 0 },
        { question: "class MyClass { public MyClass() {}", choices: ["Valid","Missing }","Typo","Invalid"], answer: 1 },
        { question: "int[] arr = new int[5", choices: ["Missing ]","Valid","Typo","Invalid"], answer: 0 },
        { question: "public void func() {", choices: ["Missing }","Valid","Typo","Invalid"], answer: 0 },
        { question: "System.out.println('Test');", choices: ["Valid","Missing ;","Typo","Invalid"], answer: 0 },
        { question: "double x = 5.0", choices: ["Missing ;","Valid","Typo","Invalid"], answer: 0 },
        { question: "boolean flag = true", choices: ["Missing ;","Valid","Typo","Invalid"], answer: 0 },
        { question: "char c = 'A", choices: ["Missing '","Valid","Typo","Invalid"], answer: 0 },
        { question: "String s = \"Hello", choices: ["Missing \"","Valid","Typo","Invalid"], answer: 0 },
        { question: "System.out.print('Hi')", choices: ["Missing ;","Valid","Typo","Invalid"], answer: 0 },
        { question: "int y = ;", choices: ["Missing value","Valid","Typo","Invalid"], answer: 0 },
        { question: "if(a == 5)", choices: ["Valid","Typo","Missing ;","Invalid"], answer: 0 },
        { question: "for(int j = 0 j<5 j++)", choices: ["Missing ;","Valid","Typo","Invalid"], answer: 0 },
        { question: "public class Test {", choices: ["Missing }","Valid","Typo","Invalid"], answer: 0 },
        { question: "try { ... } catch(Exception e", choices: ["Missing )","Valid","Typo","Invalid"], answer: 0 },
        { question: "int[] nums = new int[5;", choices: ["Missing ]","Valid","Typo","Invalid"], answer: 0 },
        { question: "String[] arr = {\"a\",\"b\"", choices: ["Missing }","Valid","Typo","Invalid"], answer: 0 },
        { question: "System.out.println(x;", choices: ["Missing )","Valid","Typo","Invalid"], answer: 0 },
        { question: "float f = 5.0f", choices: ["Missing ;","Valid","Typo","Invalid"], answer: 0 },
        { question: "boolean b = tru", choices: ["Typo","Valid","Missing ;","Invalid"], answer: 0 },
        { question: "switch(x) case 1:", choices: ["Missing {}","Valid","Typo","Invalid"], answer: 0 },
        { question: "do { } while(x < 5", choices: ["Missing )","Valid","Typo","Invalid"], answer: 0 },
        {question:"System.out.printn('Hi');",choices:["Typo method","Valid","Missing ;","Invalid"],answer:0},
        {question:"int x = ;",choices:["Missing value","Valid","Typo","Invalid"],answer:0},
        {question:"String name = \"John",choices:["Missing \"","Valid","Typo","Invalid"],answer:0},
        {question:"if(x=5)",choices:["Wrong operator","Valid","Typo","Invalid"],answer:0},
        {question:"for(int i=0;i<5 i++)",choices:["Missing ;","Valid","Typo","Invalid"],answer:0},
        {question:"public class Test {",choices:["Missing }","Valid","Typo","Invalid"],answer:0},
        {question:"System.out.println(x;",choices:["Missing )","Valid","Typo","Invalid"],answer:0},
        {question:"boolean b = tru;",choices:["Typo","Valid","Missing ;","Invalid"],answer:0},
        {question:"float f = 5.0",choices:["Missing ;","Valid","Typo","Invalid"],answer:0},
        {question:"char c = 'A",choices:["Missing '","Valid","Typo","Invalid"],answer:0},
        {question:"double d = ;",choices:["Missing value","Valid","Typo","Invalid"],answer:0},
        {question:"try { } catch(Exception e",choices:["Missing )","Valid","Typo","Invalid"],answer:0},
        {question:"int[] arr = new int[5;",choices:["Missing ]","Valid","Typo","Invalid"],answer:0},
        {question:"String[] s = {\"a\",\"b\"",choices:["Missing }","Valid","Typo","Invalid"],answer:0},
        {question:"while(x<5",choices:["Missing )","Valid","Typo","Invalid"],answer:0},
        {question:"do { } while(x<5",choices:["Missing )","Valid","Typo","Invalid"],answer:0},
        {question:"switch(x) case 1:",choices:["Missing {}","Valid","Typo","Invalid"],answer:0},
        {question:"return",choices:["Missing ;","Valid","Typo","Invalid"],answer:0},
        {question:"public void test(",choices:["Missing )","Valid","Typo","Invalid"],answer:0},
        {question:"class A { public A() {}",choices:["Missing }","Valid","Typo","Invalid"],answer:0},
        {question:"System.out.println(\"Hi\"",choices:["Missing )","Valid","Typo","Invalid"],answer:0},
        {question:"int y 5;",choices:["Missing =","Valid","Typo","Invalid"],answer:0},
        {question:"String s = Hello;",choices:["Missing quotes","Valid","Typo","Invalid"],answer:0},
        {question:"for(int i=0;i<5;i++",choices:["Missing )","Valid","Typo","Invalid"],answer:0},
        {question:"boolean flag = true",choices:["Missing ;","Valid","Typo","Invalid"],answer:0},
        {question:"float num = 5.0f",choices:["Missing ;","Valid","Typo","Invalid"],answer:0},
        {question:"int[] nums = new int[",choices:["Missing size","Valid","Typo","Invalid"],answer:0},
        {question:"System.out.println();",choices:["Valid","Missing ;","Typo","Invalid"],answer:0},
        {question:"public static void main(String args[]",choices:["Missing )","Valid","Typo","Invalid"],answer:0},
        {question:"System.out.print(\"Hello\"",choices:["Missing ;","Valid","Typo","Invalid"],answer:0}
    ]
};

const languageMap = {
  "HTML": "HTML",
  "CSS": "CSS",
  "Java Script": "JavaScript",
  "JS": "JavaScript",
  "Java": "Java"
};

const key = languageMap[selectedLanguage];
let currentQuiz = shuffleArray([...quizzes[key]]);

let currentIndex = 0;
let streak = 0;
let hearts = 3;

const btns = [
    document.getElementById('btn1'),
    document.getElementById('btn2'),
    document.getElementById('btn3'),
    document.getElementById('btn4')
];

let acceptingClick = true; 

function showQuestion() {
    if(currentIndex >= currentQuiz.length){
        currentIndex = 0;
        currentQuiz = shuffleArray([...quizzes[key]]);
    }

    const q = currentQuiz[currentIndex];
    document.getElementById('error').innerText = q.question;

    const choices = [...q.choices];
    const indices = [0,1,2,3];
    const shuffledIndices = shuffleArray(indices);

    shuffledIndices.forEach((choiceIndex, i) => {
        const btn = btns[i];
        btn.disabled = false;
        btn.innerText = choices[choiceIndex];

        btn.onclick = () => {
            if(!acceptingClick) return;
            acceptingClick = false;

            btn.style.backgroundColor = (choiceIndex === q.answer) ? "green" : "red";

            checkAnswer(choiceIndex, q.answer)
                .then(() => {
                    acceptingClick = true; 
                    resetButtonColors();
                })
                .catch(err => {
                    console.error(err);
                    acceptingClick = true;
                });
        };
    });
}

function resetButtonColors(){
    btns.forEach(b => b.style.backgroundColor = "");
}

function loseHeart() {

    if (hearts < 3) {
        document.getElementById("heart1").style.animation = "loseHeart 1s ease forwards";
    }

    if (hearts < 2) {
        document.getElementById("heart2").style.animation = "loseHeart 1s ease forwards";
    }

    if (hearts < 1) {
        document.getElementById("heart3").style.animation = "loseHeart 1s ease forwards";
        document.getElementById("levels").style.display = "block";
        document.getElementById("levels").style.animation = "blurIn 0.3s ease forwards";
        document.getElementById("lose").style.animation = "losedown 0.8s ease forwards";
    }
}

async function checkAnswer(selectedIndex, correctIndex){
    const user = auth.currentUser;
    if (!user) return; 

    const ref = doc(db, "users", user.uid);

    const streakFieldMap = {
        "HTML": "htmlStreak",
        "CSS": "cssStreak",
        "JavaScript": "jsStreak",
        "Java": "javaStreak"
    };

    const key = languageMap[selectedLanguage];
    const streakField = streakFieldMap[key];
    if (!streakField) {
        console.error("Invalid streak field for language:", selectedLanguage);
        return;
    }

    try {
        if(selectedIndex === correctIndex){
            streak++;
            currentIndex++;

            await updateDoc(ref, {
                correct: increment(1)
            });

            const snap = await getDoc(ref);
            const data = snap.exists() ? snap.data() : {};

            if(streak > (data[streakField] || 0)){
                await updateDoc(ref, {
                    [streakField]: streak
                });
            }

            await checkEndlessAchievements(key, streak);

        } else {
            streak = 0;
            hearts--;
            loseHeart();
            currentIndex++;

            await updateDoc(ref, {
                wrong: increment(1)
            });

            if(hearts < 1){
                hearts = 3;
                streak = 0;
            }
        }

        document.getElementById('streak').innerText = streak;
        showQuestion();

    } catch(err){
        console.error("Firestore error:", err);
    }
}

function shuffleArray(array){
    return array.sort(() => Math.random() - 0.5);
}

function resetGame(){
    hearts = 3;
    streak = 0;
    currentIndex = 0;

    document.getElementById('streak').innerText = streak;

    for(let i = 1; i <= 3; i++){
        const heart = document.getElementById("heart" + i);
        if(heart){
            heart.style.animation = "none";
            heart.offsetHeight;
            heart.style.animation = "";
        }
    }
    document.getElementById("levels").style.animation = "blurOut 0.3s ease forwards";
    document.getElementById("levels").style.display = "none";
    document.getElementById("lose").style.animation = "loseUp 1s ease forwards";

    currentQuiz = shuffleArray([...quizzes[key]]);

    showQuestion();
}

document.getElementById("try").addEventListener("click", resetGame);

const loseback = document.getElementById("select");

loseback.addEventListener("click", () => {
    window.location.href = "/Html/Endless.html";
})

loseHeart();
showQuestion();
