import { auth, db } from "../Js/Firebase.js";
import { doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

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

const levelAchievementTitles = {
  html: {
    1: "Tag Starter",
    2: "Element Explorer",
    3: "Markup Maker",
    5: "Structure Builder",
    7: "DOM Explorer",
    10: "Page Creator",
    12: "Layout Crafter",
    15: "Web Builder",
    18: "HTML Architect",
    20: "Markup Legend"
  },
  css: {
    1: "Style Starter",
    2: "Color Explorer",
    3: "Design Builder",
    5: "Layout Styler",
    7: "Flex Master",
    10: "Grid Creator",
    12: "UI Designer",
    15: "Visual Artist",
    18: "Style Architect",
    20: "Design Legend"
  },
  js: {
    1: "Script Starter",
    2: "Logic Explorer",
    3: "Function Builder",
    5: "Event Master",
    7: "DOM Controller",
    10: "JS Developer",
    12: "Async Thinker",
    15: "Logic Architect",
    20: "Code Strategist",
    25: "JS Legend"
  },
  java: {
    1: "Java Starter",
    2: "Class Explorer",
    3: "Object Builder",
    5: "OOP Master",
    7: "Method Creator",
    10: "Java Developer",
    12: "System Builder",
    15: "Backend Thinker",
    20: "Code Architect",
    25: "Java Legend"
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

const gameData = {
    html: [
        {
            question: `<img src="image.jpg">`,
            choices: [` Remove src attribute`,`Add alt="Image description"`,` Add title="Image description"`,`Change to <image>`],
            answer: 1,
            timer: 30,
            hint: `Missing alt attribute`,
            explanation: `All images should have an alt attribute for accessibility. Correct: <img src="image.jpg" alt="Image description">`,
        },
        {
            question: `<p>This is a paragraph`,
            choices: [` Change to <div>`,`Remove <p>`,`Add </div> at the end`,`Add </p> at the end`],
            answer: 3,
            timer: 30,
            hint: `Missing closing </p> tag`,
            explanation: `Every <p> tag must be closed. Correct: <p>This is a paragraph</p>`,
        },
        {
            question: `<input type="text" value="Hello">`,
            choices: [`Change type to password`,`Remove value`,`Add id="input"`,`Add name="input"`],
            answer: 3,
            timer: 30,
            hint: `Missing name attribute`,
            explanation: `Form inputs should have a name attribute to submit data. Correct: <input type="text" value="Hello" name="input">`,
        },
        {
            question: `<button>Click me</button>`,
            choices: [`Remove </button>`,`Change button to input`,`Add type="button"`,`Add onclick attribute`],
            answer: 2,
            timer: 30,
            hint: `Missing type attribute`,
            explanation: `Button elements should have a type attribute to specify behavior. Correct: <button type="button">Click me</button>`,
        },
        {
            question: `<a href="https://example.com">example`,
            choices: [`Change to <div>`,`Add </a> at the end`,`Remove <a>`,`Add </div> at the end`],
            answer: 1,
            timer: 30,
            hint: `Missing closing </a> tag`,
            explanation: `Anchor tags must be closed. Correct: <a href="https://example.com">example</a>`,
        },
        {
            question: `<select><option value="1">Option 1</option></select>`,
            choices: [`Add name="select" to select`,`Add id to select`,`Change option to select`,`Remove value`],
            answer: 0,
            timer: 30,
            hint: `Missing name attribute`,
            explanation: `Select elements need a name attribute to submit the selected value. Correct: <select name="select"><option value="1">Option 1</option></select>`,
        },
        {
            question: `<video src="video.mp4">`,
            choices: [`Remove src attribute`,`Change video to audio`,`Add controls attribute`,`Add </video> at the end`],
            answer: 3,
            timer: 30,
            hint: `Missing closing </video> tag`,
            explanation: `Video tags must be properly closed. Correct: <video src="video.mp4"></video>`,
        },
        {
            question: `<h1>Heading</h2>`,
            choices: [`Change <h1> to <h2>`,`Change <h1> to <h2>`,`Change </h2> to </h1>`,`Add </h1> at the start`],
            answer: 2,
            timer: 30,
            hint: `Mismatched tags`,
            explanation: `Opening and closing tags must match. Correct: <h1>Heading</h1>`,
        },
        {
            question: `<table><tr><td>Cell</td></tr>`,
            choices: [`Remove <table>`,`Add </table> at the end`,`Add </td>`,`Change to <div>`],
            answer: 1,
            timer: 30,
            hint: `Missing closing </table> tag`,
            explanation: `Table elements must be properly closed. Correct: <table><tr><td>Cell</td></tr></table>`,
        },
        {
            question: `<label for="name">Name:</label><input id="name" type="text">`,
            choices: [`Change label to div`,`Add id to label`,`Add name="name" to input`,`Remove for attribute`],
            answer: 2,
            timer: 30,
            hint: `Missing name attribute in input`,
            explanation: `Inputs should have a name attribute for form submission. Correct: <input id="name" type="text" name="name">`,
        },
        {
            question: `<ul><li>Item 1</li><li>Item 2</ul>`,
            choices: [`Add </li> at the end`,`Change to <ol>`,`Remove </ul>`,`Add </ul> at the end`],
            answer: 0,
            timer: 30,
            hint: `Missing closing </li> tag`,
            explanation: `All <li> items must be closed. Correct: <ul><li>Item 1</li><li>Item 2</li></ul>`,
        },
        {
            question: `<iframe src="https://example.com">`,
            choices: [`Add width attribute`,`Remove src attribute`,`Change iframe to frame`,`Add </iframe> at the end`],
            answer: 3,
            timer: 25,
            hint: `Missing closing </iframe> tag`,
            explanation: `Iframe elements must be properly closed. Correct: <iframe src="https://example.com"></iframe>`,
        },
        {
            question: `<p>This is a <span>test</p></span>`,
            choices: [`Change </p></span> to </span></p>`,`Add <p> at the star`,`Remove </span>`,`Change <span> to <div>`],
            answer: 0,
            timer: 30,
            hint: `Mismatched tags`,
            explanation: `Nested tags must be properly closed. Correct: <p>This is a <span>test</span></p>`,
        },
        {
            question: `<table><thead><tr><th>Header</th></tr></thead><tbody><tr><td>Cell</td></tr></tbody>`,
            choices: [`Remove <tbody>`,`Add </th>`,`Add </table> at the end`,`Change to <div>`],
            answer: 2,
            timer: 30,
            hint: `Missing closing </table> tag`,
            explanation: `All table structures must be closed. Correct: <table><thead><tr><th>Header</th></tr></thead><tbody><tr><td>Cell</td></tr></tbody></table>`,
        },
        {
            question: `<img src="image.jpg" alt=Image description>`,
            choices: [`Change img to image`,`Remove alt attribute`,`Add quotes around Image description`,`Change img to image`],
            answer: 2,
            timer: 30,
            hint: `Missing quotes around attribute value`,
            explanation: `Attribute values must be quoted. Correct: <img src="image.jpg" alt="Image description">`,
        },
        {
            question: `<input type=text value="Hello">`,
            choices: [`hange type to password`,`Add quotes around text`,`Add name attribute`,`Remove value`],
            answer: 1,
            timer: 30,
            hint: `Missing quotes around attribute value`,
            explanation: `Attribute values must be quoted. Correct: <input type="text" value="Hello">`,
        },
        {
            question: `<a href=https://example.com>Example</a>`,
            choices: [`Remove href attribute`,`Change a to div`,`Add target attribute`,`Add quotes around https://example.com`],
            answer: 3,
            timer: 30,
            hint: `Missing quotes around attribute value`,
            explanation: `Attribute values must be in quotes. Correct: <a href="https://example.com">Example</a>`,
        },
        {
            question: `<button type=submit>Submit</button>`,
            choices: [`Add quotes around submit`,`Remove type attribute`,`Add onclick attribute`,`Change button to input`],
            answer: 0,
            timer: 30,
            hint: `Missing quotes around attribute value`,
            explanation: `Attribute values must be quoted. Correct: <button type="submit">Submit</button>`,
        },
        {
            question: `<div>This is a div</p>`,
            choices: [`Change <div> to <p>`,`Change </p> to </div>`,`Remove </p>`,`Add <p> at the start`],
            answer: 1,
            timer: 30,
            hint: `Mismatched tags`,
            explanation: `Opening and closing tags must match. Correct: <div>This is a div</div>`,
        },
        {
            question: `<audio src="audio.mp3">`,
            choices: [`Remove src attribute`,`Change audio to video`,`Add controls attribute`,`Add </audio> at the end`],
            answer: 3,
            timer: 30,
            hint: `Missing closing </audio> tag`,
            explanation: `Audio elements must be properly closed. Correct: <audio src="audio.mp3"></audio>`,
        },
    ],

    css: [
        {
            question: "Which line is an actual CSS error?",
            choices: ["color: red;", "background-color: #fff;", "font-size 16px;", "margin: 10px;"],
            answer: 2,
            timer: 30,
            hint: "Check the colons in property declarations.",
            explanation: "'font-size 16px;' is invalid because it’s missing a colon. Correct: 'font-size: 16px;'"
        },
        {
            question: "Which line is invalid CSS?",
            choices: ["display: block;", "border: 1px solid black;", "text-align center;", "padding: 5px;"],
            answer: 2,
            timer: 30,
            hint: "All CSS properties must have a colon before the value.",
            explanation: "'text-align center;' is missing a colon. Correct: 'text-align: center;'"
        },
        {
            question: "Find the line that will throw a CSS error:",
            choices: ["width: 100%;", "height 50px;", "background: blue;", "margin-top: 10px;"],
            answer: 1,
            timer: 30,
            hint: "Every property should use 'property: value;' format.",
            explanation: "'height 50px;' is invalid; it should be 'height: 50px;'",      
        },
        {
            question: "Which CSS line is incorrect?",
            choices: ["font-weight: bold;", "border-radius: 5px;", "color = red;", "line-height: 1.5;"],
            answer: 2,
            timer: 30,
            hint: "CSS does not use '=' for assigning values.",
            explanation: "'color = red;' is wrong because CSS uses colons, not equal signs. Correct: 'color: red;'",  
        },
        {
            question: "Spot the CSS error:",
            choices: ["background-color: green;", "padding: 20px;", "text-decoration underline;", "margin: 0 auto;"],
            answer: 2,
            timer: 30,
            hint: "Every property needs a colon to separate the name and value.",
            explanation: "'text-decoration underline;' is invalid; it should be 'text-decoration: underline;'",
        },
        {
            question: "Which will cause a CSS error?",
            choices: ["display: flex;", "position absolute;", "float: left;", "opacity: 0.5;"],
            answer: 1,
            timer: 30,
            hint: "Check missing colons.",
            explanation: "'position absolute;' is missing a colon. Correct: 'position: absolute;'",
        },
        {
            question: "Find the invalid property usage:",
            choices: ["color: #333;", "background: url('img.png');", "border 1px solid;", "font-size: 14px;"],
            answer: 2,
            timer: 30,
            hint: "Colons are required.",
            explanation: "'border 1px solid;' is missing a colon. Correct: 'border: 1px solid;'",
        },
        {
            question: "Which line has a syntax error?",
            choices: ["margin-top 10px;", "padding-left: 5px;", "display: grid;", "font-style: italic;"],
            answer: 0,
            timer: 30,
            hint: "Colons separate property and value.",
            explanation: "'margin-top 10px;' is missing a colon. Correct: 'margin-top: 10px;'",
        },
        {
            question: "Pick the incorrect CSS:",
            choices: ["border-color: red;", "width: 50%;", "height: 100px;", "background color: blue;"],
            answer: 3,
            timer: 30,
            hint: "Hyphens are important in property names.",
            explanation: "'background color: blue;' should be 'background-color: blue;'",
        },
        {
            question: "Which will throw a CSS error?",
            choices: ["list-style: none;", "align-items: center;", "justify-content: flex-start;", "padding 10px;"],
            answer: 3,
            timer: 30,
            hint: "Colons are required in all property declarations.",
            explanation: "'padding 10px;' is missing a colon. Correct: 'padding: 10px;'"
        },
        {
            question: "Find the invalid property line:",
            choices: ["font-family: Arial;", "text-transform uppercase;", "line-height: 1.2;", "border-bottom: 1px solid;"],
            answer: 1,
            timer: 30,
            hint: "Check the colon.",
            explanation: "'text-transform uppercase;' is missing a colon. Correct: 'text-transform: uppercase;'"
        },
        {
            question: "Which is invalid?",
            choices: ["display: inline-block;", "color: black;", "width:100 px;", "margin: 0;"],
            answer: 2,
            timer: 30,
            hint: "No spaces allowed between number and unit.",
            explanation: "'width:100 px;' is invalid. Correct: 'width: 100px;'"
        },
        {
            question: "Pick the line with a syntax error:",
            choices: ["font-size: 16px;", "background-color: yellow;", "border-radius 50%;", "text-align: center;"],
            answer: 2,
            timer: 30,
            hint: "Colons are required.",
            explanation: "'border-radius 50%;' is missing a colon. Correct: 'border-radius: 50%;'"
        },
        {
            question: "Which will fail in CSS?",
            choices: ["padding: 5px;", "margin: 10px;", "color:blue;", "font-weight bold;"],
            answer: 3,
            timer: 30,
            hint: "Colon missing somewhere.",
            explanation: "'font-weight bold;' is missing a colon. Correct: 'font-weight: bold;'"
        },
        {
            question: "Find the invalid CSS line:",
            choices: ["border-top: 2px solid red;", "opacity 0.8;", "display: flex;", "flex-direction: row;"],
            answer: 1,
            timer: 30,
            hint: "Colons separate property and value.",
            explanation: "'opacity 0.8;' is missing a colon. Correct: 'opacity: 0.8;'"
        },
        {
            question: "Which line is incorrect?",
            choices: ["background: #000;", "height:200px;", "text-align center;", "margin-left: 20px;"],
            answer: 2,
            timer: 30,
            hint: "Colons are required.",
            explanation: "'text-align center;' is missing a colon. Correct: 'text-align: center;'"
        },
        {
            question: "Spot the CSS error:",
            choices: ["font-style: italic;", "border: 1px solid black;", "color: red;", "padding 10px;"],
            answer: 3,
            timer: 30,
            hint: "Colon is missing.",
            explanation: "'padding 10px;' is missing a colon. Correct: 'padding: 10px;'"
        },
        {
            question: "Which line will break?",
            choices: ["width: 100%;", "height: 50px;", "margin: auto;", "background color: green;"],
            answer: 3,
            timer: 30,
            hint: "Check hyphens in property names.",
            explanation: "'background color: green;' should be 'background-color: green;'"
        },
        {
            question: "Find the syntax error:",
            choices: ["line-height: 1.5;", "text-decoration: underline;", "color #fff;", "display: block;"],
            answer: 2,
            timer: 30,
            hint: "Colon is missing.",
            explanation: "'color #fff;' is missing a colon. Correct: 'color: #fff;'"
        },
        {
            question: "Which one is invalid?",
            choices: ["border-left: 2px dashed;", "margin-top: 0;", "padding: 10px;", "font-size: 14px;"],
            answer: 0,
            timer: 30,
            hint: "Border property is incomplete without color.",
            explanation: "'border-left: 2px dashed;' is incomplete. Correct: 'border-left: 2px dashed black;'"
        },
    ],

    js: [
        {
            question: "Which line will cause a JavaScript error?",
            choices: ["let x = 5;", "const y;", "var z = 10;", "x = 20;"],
            answer: 1,
            timer: 50,
            hint: "Const declarations require an initial value.",
            explanation: "'const y;' is invalid because const must be initialized. Correct: 'const y = 0;'"
        },
        {
            question: "Find the invalid JavaScript line:",
            choices: ["function sayHi() {}", "let name = 'John';", "if(x == 5) {}", "console.log('Hello)"],
            answer: 3,
            timer: 50,
            hint: "Check matching quotes.",
            explanation: "'console.log('Hello)' is missing a closing quote. Correct: 'console.log(\"Hello\")'"
        },
        {
            question: "Which line has a syntax error?",
            choices: ["let arr = [1,2,3];", "arr.push(4);", "let obj = {name: 'Alice'};", "let obj2 = {name: 'Bob',};"],
            answer: 3,
            timer: 50,
            hint: "Trailing commas in object literals may cause errors in older JS.",
            explanation: "'let obj2 = {name: 'Bob',};' is invalid in some JS versions. Remove trailing comma."
        },
        {
            question: "Which line is invalid JS?",
            choices: ["for(let i=0;i<5;i++){}", "while(true){}", "let x = ;", "console.log(x);"],
            answer: 2,
            timer: 50,
            hint: "Variable assignment cannot be empty.",
            explanation: "'let x = ;' is invalid. Correct: 'let x = 0;'"
        },
        {
            question: "Spot the error:",
            choices: ["let a = 10;", "const b = 20;", "var c = 30", "console.log(a+b);"],
            answer: 2,
            timer: 50,
            hint: "Missing semicolon may not always break JS but let's assume strict mode.",
            explanation: "'var c = 30' is missing a semicolon. Correct: 'var c = 30;'"
        },
        {
            question: "Which is invalid JS?",
            choices: ["if(true){}", "for(let i=0;i<5;i++){}", "function(){}", "let name = 'Alice';"],
            answer: 2,
            timer: 50,
            hint: "Function declarations need a name.",
            explanation: "'function(){}' is invalid; a named or arrow function is required. Correct: 'function myFunc(){}'"
        },
        {
            question: "Find the JavaScript error:",
            choices: ["let x = 10;", "x == 10;", "if(x === 10){}", "const y = 20;"],
            answer: 1,
            timer: 50,
            hint: "Assignment vs comparison matters.",
            explanation: "'x == 10;' by itself is not an error, but if intended as assignment, should use '='. For strict error, let's assume standalone expression is fine in modern JS."
        },
        {
            question: "Which line is invalid?",
            choices: ["let arr = [1,2,3];", "arr.push(4);", "arr[5] = 10;", "arr(0);"],
            answer: 3,
            timer: 50,
            hint: "Arrays are indexed with brackets, not parentheses.",
            explanation: "'arr(0);' is invalid. Correct: 'arr[0];'"
        },
        {
            question: "Pick the JavaScript syntax error:",
            choices: ["let x = 5;", "x += 2;", "console.log(x);", "let y = 5 5;"],
            answer: 3,
            timer: 50,
            hint: "Cannot have two numbers without operator.",
            explanation: "'let y = 5 5;' is invalid. Correct: 'let y = 5 + 5;'"
        },
        {
            question: "Which line will throw an error?",
            choices: ["let a = 5;", "const b = 10;", "a + b;", "let 1x = 5;"],
            answer: 3,
            timer: 50,
            hint: "Variable names cannot start with a number.",
            explanation: "'let 1x = 5;' is invalid. Correct: 'let x1 = 5;'"
        },
        {
            question: "Find the invalid line:",
            choices: ["function test() {}", "test();", "return 5;", "let x = 10;"],
            answer: 2,
            timer: 50,
            hint: "Return statements must be inside a function.",
            explanation: "'return 5;' outside a function is invalid."
        },
        {
            question: "Spot the JS error:",
            choices: ["const pi = 3.14;", "pi = 3.1415;", "let radius = 5;", "const area = pi * radius * radius;"],
            answer: 1,
            timer: 50,
            hint: "Cannot reassign a const variable.",
            explanation: "'pi = 3.1415;' is invalid. Correct: declare as 'let pi = 3.14;' if reassignment needed."
        },
        {
            question: "Which line is invalid?",
            choices: ["let arr = [1,2,3];", "arr.push(4);", "arr.pop();", "arr..length;"],
            answer: 3,
            timer: 50,
            hint: "Double dot is not allowed in JS.",
            explanation: "'arr..length;' is invalid. Correct: 'arr.length;'"
        },
        {
            question: "Pick the invalid JS line:",
            choices: ["let x = 10;", "x === 10;", "let obj = {name: 'John'};", "obj.['name'];"],
            answer: 3,
            timer: 50,
            hint: "Dot notation should not have brackets together.",
            explanation: "'obj.['name'];' is invalid. Correct: 'obj['name'];' or 'obj.name;'"
        },
        {
            question: "Which is a syntax error?",
            choices: ["if(x>5){}", "else {}", "let y = 10;", "console.log(y);"],
            answer: 1,
            timer: 50,
            hint: "Else cannot exist without an if block immediately before it.",
            explanation: "'else {}' without a preceding if block is invalid."
        },
        {
            question: "Find the error:",
            choices: ["for(let i=0;i<5;i++){}", "i++;", "console.log(i);", "let i = 0;"],
            answer: 1,
            timer: 50,
            hint: "i is not declared here.",
            explanation: "'i++;' will throw a ReferenceError if i is not declared in scope.",
        },
        {
            question: "Which line is invalid?",
            choices: ["let obj = {a:1,b:2};", "obj.c = 3;", "delete obj.a;", "obj.['b'];"],
            answer: 3,
            timer: 50,
            hint: "Dot notation cannot be combined with brackets.",
            explanation: "'obj.['b'];' is invalid. Correct: 'obj['b'];'"
        },
        {
            question: "Pick the syntax error:",
            choices: ["let x = 5;", "const y = 10;", "x += 2;", "x ++ 5;"],
            answer: 3,
            timer: 50,
            hint: "Increment operator cannot have a number after it.",
            explanation: "'x ++ 5;' is invalid. Correct: 'x += 5;' or 'x++;'"
        },
        {
            question: "Which line will throw an error?",
            choices: ["function add(a,b){return a+b;}", "add(2,3);", "console.log(add(2,3));", "function () {}"],
            answer: 3,
            timer: 50,
            hint: "Function declarations must have a name.",
            explanation: "'function () {}' is invalid. Correct: 'function myFunc() {}'"
        },
        {
            question: "Find the invalid JS line:",
            choices: ["let num = 5;", "num = num + 2;", "console.log(num);", "let 2num = 10;"],
            answer: 3,
            timer: 50,
            hint: "Variable names cannot start with a number.",
            explanation: "'let 2num = 10;' is invalid. Correct: 'let num2 = 10;'"
        },
        {
            question: "Which line has a syntax error?",
            choices: ["let a = [1,2,3];", "a.push(4);", "console.log(a);", "a(0);"],
            answer: 3,
            timer: 50,
            hint: "Parentheses cannot index arrays.",
            explanation: "'a(0);' is invalid. Correct: 'a[0];'"
        },
        {
            question: "Spot the JS error:",
            choices: ["let str = 'Hi';", "str += ' there';", "console.log(str);", "let str2 = 'Hello;"],
            answer: 3,
            timer: 50,
            hint: "Check the quotes.",
            explanation: "'let str2 = 'Hello;' is missing a closing quote. Correct: 'let str2 = \"Hello\";'"
        },
        {
            question: "Which is invalid?",
            choices: ["const pi = 3.14;", "pi = 3.1415;", "let r = 5;", "const area = pi*r*r;"],
            answer: 1,
            timer: 50,
            hint: "Cannot reassign a const variable.",
            explanation: "'pi = 3.1415;' is invalid. Use 'let' if reassignment is needed."
        },
        {
            question: "Which line is invalid JS?",
            choices: ["let x = 10;", "x++;", "console.log(x);", "return 5;"],
            answer: 3,
            timer: 50,
            hint: "Return statements must be inside a function.",
            explanation: "'return 5;' outside a function is invalid. Correct: put it inside a function: 'function f(){ return 5; }'"
        },
        {
            question: "Find the syntax error:",
            choices: ["let arr = [1,2,3];", "arr.push(4);", "console.log(arr);", "arr..push(5);"],
            answer: 3,
            timer: 50,
            hint: "Double dots are not allowed in JS property access.",
            explanation: "'arr..push(5);' is invalid. Correct: 'arr.push(5);'"
        },
    ],

    java: [
        {
            question: "Which line will cause a Java error?",
            choices: ["int x = 5;", "String name = 'John';", "double y = 10.5;", "boolean flag = true;"],
            answer: 1,
            timer: 50,
            hint: "Strings in Java require double quotes.",
            explanation: "String name = 'John'; is invalid in Java. Correct: String name = \"John\";"
        },
        {
            question: "Find the invalid Java line:",
            choices: ["int[] arr = {1,2,3};", "arr[0] = 5;", "arr.push(4);", "System.out.println(arr[0]);"],
            answer: 2,
            timer: 50,
            hint: "Arrays in Java do not have push method.",
            explanation: "'arr.push(4);' is invalid. Use a List or manually assign: arr[3] = 4;"
        },
        {
            question: "Which line has a syntax error?",
            choices: ["for(int i=0;i<5;i++){}", "while(true){}", "int x = ;", "System.out.println(x);"],
            answer: 2,
            timer: 50,
            hint: "Variable assignments cannot be empty.",
            explanation: "'int x = ;' is invalid. Correct: int x = 0;"
        },
        {
            question: "Which line is invalid?",
            choices: ["public void func() {}", "func();", "int 1num = 5;", "int a = 10;"],
            answer: 2,
            timer: 50,
            hint: "Variable names cannot start with a number.",
            explanation: "'int 1num = 5;' is invalid. Correct: int num1 = 5;"
        },
        {
            question: "Spot the Java error:",
            choices: ["String s = \"Hello\";", "s += \" World\";", "System.out.println(s);", "s = 'Hi';"],
            answer: 3,
            timer: 50,
            hint: "Strings need double quotes in Java.",
            explanation: "s = 'Hi'; is invalid. Correct: s = \"Hi\";"
        },
        {
            question: "Which line will fail?",
            choices: ["int x = 5;", "x += 2;", "System.out.println(x);", "x++ 5;"],
            answer: 3,
            timer: 50,
            hint: "Increment operator cannot take a number after it.",
            explanation: "'x++ 5;' is invalid. Correct: 'x += 5;' or 'x++;'"
        },
        {
            question: "Find the syntax error:",
            choices: ["int[] nums = {1,2,3};", "nums[0] = 10;", "nums(1) = 5;", "System.out.println(nums[1]);"],
            answer: 2,
            timer: 50,
            hint: "Java arrays are indexed with brackets, not parentheses.",
            explanation: "'nums(1) = 5;' is invalid. Correct: nums[1] = 5;"
        },
        {
            question: "Which line is invalid?",
            choices: ["public static void main(String[] args) {}", "main();", "System.out.println(\"Hi\");", "void main() {}"],
            answer: 3,
            timer: 50,
            hint: "The main method must be public static with String[] args.",
            explanation: "'void main() {}' is invalid as the entry point. Correct: 'public static void main(String[] args) {}'"
        },
        {
            question: "Pick the Java error:",
            choices: ["int a = 5;", "a == 5;", "System.out.println(a);", "final int b;"],
            answer: 3,
            timer: 50,
            hint: "Final variables must be initialized.",
            explanation: "'final int b;' is invalid. Correct: 'final int b = 0;'"
        },
        {
            question: "Which line will throw an error?",
            choices: ["String str = \"Hi\";", "str.charAt(0);", "str[0];", "System.out.println(str);"],
            answer: 2,
            timer: 50,
            hint: "Strings are not indexed like arrays in Java using brackets.",
            explanation: "'str[0];' is invalid. Use str.charAt(0);"
        },
        {
            question: "Find the invalid line:",
            choices: ["int x = 5;", "x = x + 2;", "System.out.println(x);", "int x = 10;"],
            answer: 3,
            timer: 50,
            hint: "Cannot redeclare a variable in the same scope.",
            explanation: "'int x = 10;' is invalid here because x is already declared."
        },
        {
            question: "Which line is incorrect?",
            choices: ["boolean flag = true;", "flag = false;", "if(flag) {}", "if(flag == 1) {}"],
            answer: 3,
            timer: 50,
            hint: "Boolean values cannot be compared with numbers.",
            explanation: "'if(flag == 1) {}' is invalid. Correct: 'if(flag) {}'"
        },
        {
            question: "Spot the error:",
            choices: ["char c = 'a';", "c = 'b';", "char d = \"c\";", "System.out.println(c);"],
            answer: 2,
            timer: 50,
            hint: "Characters use single quotes, not double.",
            explanation: "'char d = \"c\";' is invalid. Correct: 'char d = 'c';'"
        },
        {
            question: "Which is invalid?",
            choices: ["int[] arr = new int[5];", "arr[0] = 1;", "arr[5] = 10;", "System.out.println(arr[0]);"],
            answer: 2,
            timer: 50,
            hint: "Array indices go from 0 to length-1.",
            explanation: "'arr[5] = 10;' is invalid. Correct: arr[4] = 10;"
        },
        {
            question: "Pick the syntax error:",
            choices: ["System.out.println(\"Hello\");", "int num = 5;", "num += 2;", "System.out.println(num)"],
            answer: 3,
            timer: 50,
            hint: "Statements need a semicolon.",
            explanation: "'System.out.println(num)' is missing a semicolon. Correct: 'System.out.println(num);'"
        },
        {
            question: "Which line will fail?",
            choices: ["String s = null;", "s.length();", "s.charAt(0);", "int x = null;"],
            answer: 3,
            timer: 50,
            hint: "Primitive types cannot be null.",
            explanation: "'int x = null;' is invalid. Use Integer x = null; if object reference is needed."
        },
        {
            question: "Find the Java error:",
            choices: ["double pi = 3.14;", "pi = 3.1415;", "final double e;", "System.out.println(pi);"],
            answer: 2,
            timer: 50,
            hint: "Final variables must be initialized.",
            explanation: "'final double e;' is invalid. Correct: 'final double e = 2.71;'"
        },
        {
            question: "Which line is invalid?",
            choices: ["String s = \"Hi\";", "s = \"Hello\";", "s.charAt(0);", "s += 5;"],
            answer: 3,
            timer: 50,
            hint: "Cannot add a number to a String without concatenation.",
            explanation: "'s += 5;' is fine in Java actually (it will convert to String), so for an error, use 's - 5;' instead. Correct error line: 's - 5;'"
        },
        {
            question: "Pick the syntax error:",
            choices: ["int a = 5;", "int b = 10;", "int sum = a + b;", "int sum = a + ;"],
            answer: 3,
            timer: 50,
            hint: "Expression cannot end with an operator.",
            explanation: "'int sum = a + ;' is invalid. Correct: 'int sum = a + b;'"
        },
        {
            question: "Which line will throw an error?",
            choices: ["for(int i=0;i<5;i++){}", "i++;", "System.out.println(i);", "int i;"],
            answer: 1,
            timer: 50,
            hint: "Variable i is not declared in this scope.",
            explanation: "'i++;' will throw an error if i is not declared. Correct: declare i first: 'int i = 0;'"
        },
        {
            question: "Find the invalid line:",
            choices: ["int[] arr = {1,2,3};", "arr[0] = 10;", "arr(1) = 5;", "System.out.println(arr[1]);"],
            answer: 2,
            timer: 50,
            hint: "Arrays are indexed with brackets, not parentheses.",
            explanation: "'arr(1) = 5;' is invalid. Correct: 'arr[1] = 5;'"
        },
        {
            question: "Which line is incorrect?",
            choices: ["public class Test {}", "class Test {}", "private class Test {}", "System.out.println(\"Hi\");"],
            answer: 2,
            timer: 50,
            hint: "Top-level classes cannot be private.",
            explanation: "'private class Test {}' is invalid. Correct: 'class Test {}' or use private inside another class."
        },
        {
            question: "Spot the syntax error:",
            choices: ["int x = 5;", "x = x + 2;", "System.out.println(x);", "x++5;"],
            answer: 3,
            timer: 50,
            hint: "Increment operator cannot be followed directly by a number.",
            explanation: "'x++5;' is invalid. Correct: 'x += 5;' or 'x++;'"
        },
        {
            question: "Which line will fail?",
            choices: ["int a = 10;", "int b = 0;", "int c = a/b;", "System.out.println(c);"],
            answer: 2,
            timer: 50,
            hint: "Division by zero is invalid.",
            explanation: "'int c = a/b;' will throw ArithmeticException if b = 0."
        },
        {
            question: "Find the Java error:",
            choices: ["String s = \"Hello\";", "s.charAt(5);", "System.out.println(s);", "s.length();"],
            answer: 1,
            timer: 50,
            hint: "String indices go from 0 to length-1.",
            explanation: "'s.charAt(5);' is invalid because 'Hello' has indices 0-4. Correct: 's.charAt(4);'"
        },
    ],
};


document.getElementById("goselect").addEventListener("click", () => {
  window.location.href = "/Html/Debug.html";
});

function down() {
  document.getElementById("levels").style.display = "block";
  document.getElementById("levels").style.animation = "blurIn 0.2s ease forwards";
}

function up() {
  document.getElementById("levels").style.display = "none";
  document.getElementById("levels").style.animation = "blurOut 0.2s ease forwards";
}




const params = new URLSearchParams(window.location.search);
let lang = params.get("lang") || "html";
let level = Number(params.get("level")) || 1;

if (!Number.isFinite(level) || level < 1) {
    level = 1; 
}
if (level > gameData[lang].length) {
    level = gameData[lang].length;
}
const maxLevel = gameData[lang].length;
if (level > maxLevel) level = maxLevel;

const currentQuestion = gameData[lang][level - 1];

document.getElementById("language").innerText = lang.toUpperCase();
    document.getElementById("level").innerText = level;


let hearts = 3;

function loseHearts() {
    if (hearts <= 0) return;

    hearts--;
    const heartEl = document.getElementById("heart" + (hearts + 1));
    if (heartEl) heartEl.style.animation = "loseHeart 1s ease forwards";

    if (hearts <= 0) {

        const losePopup = document.getElementById("lose");
        document.getElementById("levels").style.display = "block";
        document.getElementById("levels").style.animation = "blurIn 0.3s ease forwards"
        losePopup.style.animation = "losedown 1s ease forwards";

        clearInterval(countdown);
    }
}

const errorEl = document.getElementById("error");
const explainEl = document.getElementById("explain");
const showHintEl = document.getElementById("show");
const timeEl = document.getElementById("time");
const btns = [
  document.getElementById("btn1"),
  document.getElementById("btn2"),
  document.getElementById("btn3"),
  document.getElementById("btn4")
];

errorEl.innerText = currentQuestion.question;
explainEl.innerText = currentQuestion.explanation;

btns.forEach((btn, index) => {
  btn.innerText = currentQuestion.choices[index];
  btn.onclick = () => checkAnswer(index);
});

let time = currentQuestion.timer;
let countdown;
function startTimer() {
  timeEl.innerText = time;
  countdown = setInterval(() => {
    time--;
    timeEl.innerText = time;
    if (time <= 0) {
      clearInterval(countdown);
      document.getElementById("levels").style.display = "block";
      document.getElementById("levels").style.animation = "blurIn 0.3s ease forwards"
      document.getElementById("lose").style.animation = "losedown 1s ease forwards";
    }
  }, 1600);
}
startTimer();


async function checkAnswer(selectedIndex) {
  clearInterval(countdown);

  const user = auth.currentUser;
  if (!user) return; 

  const userRef = doc(db, "users", user.uid);
  const snap = await getDoc(userRef);
  const data = snap.exists() ? snap.data() : {};

  const correctKey = "correct"; 
  const wrongKey = "wrong";

  btns.forEach(btn => btn.disabled = true);

  if (selectedIndex === currentQuestion.answer) {
    
    btns[selectedIndex].style.backgroundColor = "green";

    const newCorrect = (data[correctKey] || 0) + 1;
    const nextUnlockedLevel = Math.min(
      level + 1,
      gameData[lang].length + 1
    );

    await updateDoc(userRef, {
      [correctKey]: newCorrect,
      [lang + "Level"]: Math.max(
        nextUnlockedLevel,
        Number(data[lang + "Level"] || 1)
      )
    });

    checkLevelAchievements(lang, level, hearts);

    setTimeout(() => {
      document.getElementById("levels").style.display = "block";
      document.getElementById("levels").style.animation = "blurIn 0.3s ease forwards";
      document.getElementById("popup").style.animation = "down 1s ease forwards";
    }, 500);

  } else {
    
    btns[selectedIndex].style.backgroundColor = "red";
    const newWrong = (data[wrongKey] || 0) + 1;
    await updateDoc(userRef, {
      [wrongKey]: newWrong
    });

    setTimeout(() => {
      loseHearts();

      btns.forEach(btn => btn.style.backgroundColor = "");
      btns.forEach(btn => btn.disabled = false);

      if (hearts > 0) startTimer();
    }, 800);
  }
}


const hintBtn = document.getElementById("hint");

hintBtn.addEventListener("click", () => {
  showHintEl.style.animation = "showHints 1s ease forwards";
  hintBtn.disabled = true;
  showHintEl.innerText = currentQuestion.hint;

  setTimeout(() => {
    showHintEl.style.animation = "hideHints 1s ease forwards";
  }, 7000);
});

const backselect = document.getElementById("back");

backselect.addEventListener("click", () => {
    window.location.href = "/Html/Debug.html";
})



const tryAgainBtn = document.getElementById("try");

tryAgainBtn.addEventListener("click", () => {

    hearts = 3;
    for (let i = 1; i <= 3; i++) {
        const heartEl = document.getElementById("heart" + i);
        if (heartEl) {
            heartEl.style.animation = "";
        }
    }

    document.getElementById("levels").style.display = "none";
    document.getElementById("levels").style.animation = "blurOut 0.3s ease forwards";
    document.getElementById("lose").style.animation = "loseUp 1s ease forwards"; 

    btns.forEach(btn => {
        btn.style.backgroundColor = "";
        btn.disabled = false;
    });

    time = currentQuestion.timer;
    startTimer();
});

const loseback = document.getElementById("select");

loseback.addEventListener("click", () => {
    window.location.href = "/Html/Debug.html";
})


async function unlockAchievement(achievementId, achievementTitle, achievementText) {
  const user = auth.currentUser;
  if (!user) return;

  const userRef = doc(db, "users", user.uid);
  const snap = await getDoc(userRef);
  const data = snap.exists() ? snap.data() : {};

  const achievements = data.achievements || {};

  if (!achievements[achievementId]) {
    achievements[achievementId] = true;

    await updateDoc(userRef, {
      achievements: achievements
    });

    console.log("Achievement unlocked:", achievementId);
    showAchievementToast(achievementTitle, achievementText);
  }

}

function checkLevelAchievements(lang, level, hearts) {
  const achievementTitle = levelAchievementTitles[lang]?.[level];

  if (achievementTitle) {
    unlockAchievement(
      `${lang}_lvl_${level}`,
      "Achievement Unlocked",
      `${lang.toUpperCase()} ${achievementTitle}`
    );
  }
}

