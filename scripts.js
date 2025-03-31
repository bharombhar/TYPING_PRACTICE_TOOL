let textContainer = document.getElementById("text");
let inputBox = document.getElementById("input");
let timerDisplay = document.getElementById("timer");
let wpmDisplay = document.getElementById("wpm");
let accuracyDisplay = document.getElementById("accuracy");
let pauseBtn = document.getElementById("pause-btn");

let text = "";
let userInput = "";
let timer = 0;
let interval;
let startTime;
let errors = 0;
let totalTyped = 0;
let started = false;
let isPaused = false;

function togglePause() {
    if (isPaused) {
        isPaused = false;
        startTime = new Date().getTime() - timer * 1000;
        interval = setInterval(() => {
            timer = Math.floor((new Date().getTime() - startTime) / 1000);
            timerDisplay.textContent = timer;
            calculateWPM();
        }, 1000);
        inputBox.disabled = false;
        inputBox.focus();
        pauseBtn.textContent = "Pause";
    } else {
        isPaused = true;
        clearInterval(interval);
        inputBox.disabled = true;
        pauseBtn.textContent = "Resume";
    }
}

// Random Text Generator (Includes Numbers & Symbols)
function generateText() {
    let characters = "+-*/@#$%&!?= ";
    let words = [
        "the", "be", "to", "of", "and", "a", "in", "that", "have", "I",
        "it", "for", "not", "on", "with", "he", "as", "you", "do", "at",
        // ... (your word list) ...
        "significant", "technology", "potential","bharat", "organization", "alternative", "perspective", "influence", "discipline", "scientific", "achievement"
    ];
    let randomText = "";
    for (let i = 0; i < 40; i++) {
        randomText += Math.random() > 0.5 ? 
            words[Math.floor(Math.random() * words.length)] + " " : 
            `${characters[Math.floor(Math.random() * characters.length)]} `;
    }
    text = randomText.trim();
    displayText();
}

function displayText() {
    textContainer.innerHTML = text.split("").map((char, i) =>
        `<span ${i === 0 ? 'class="highlight"' : ""}>${char}</span>`
    ).join("");
}

document.addEventListener("keydown", function(event) {
    if (event.key === "Tab") {
        event.preventDefault();
        restartTest();
    } else if (event.key === "Escape") {
        togglePause();
    }
});

function startTimer() {
    if (!started) {
        started = true;
        startTime = new Date().getTime();
        interval = setInterval(() => {
            timer = Math.floor((new Date().getTime() - startTime) / 1000);
            timerDisplay.textContent = timer;
            calculateWPM();
        }, 1000);
    }
}

function calculateWPM() {
    let wordsTyped = totalTyped / 5;
    let minutes = timer / 60;
    let wpm = minutes > 0 ? Math.round(wordsTyped / minutes) : 0;
    wpmDisplay.textContent = wpm;
}

function calculateAccuracy() {
    let correct = totalTyped - errors;
    let accuracy = correct > 0 ? Math.round((correct / totalTyped) * 100) : 100;
    accuracyDisplay.textContent = accuracy;
}

inputBox.addEventListener("input", function() {
    startTimer();
    userInput = inputBox.value;
    totalTyped = userInput.length;

    let correct = true;
    let newHTML = text.split("").map((char, i) => {
        if (i < userInput.length) {
            if (userInput[i] === char) {
                return `<span style="color: #58a6ff;">${char}</span>`;
            } else {
                errors++;
                correct = false;
                return `<span style="color: red;">${char}</span>`;
            }
        }
        return i === userInput.length ? `<span class="highlight">${char}</span>` : char;
    }).join("");

    textContainer.innerHTML = newHTML;
    calculateAccuracy();

    if (userInput === text) {
        clearInterval(interval);
        inputBox.disabled = true;
    }
});

function restartTest() {
    clearInterval(interval);
    timer = 0;
    started = false;
    totalTyped = 0;
    errors = 0;
    userInput = "";
    inputBox.value = "";
    inputBox.disabled = false;
    timerDisplay.textContent = "0";
    wpmDisplay.textContent = "0";
    accuracyDisplay.textContent = "100";
    generateText();
    document.getElementById('input').focus();
}

generateText();