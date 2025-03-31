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
    
    let words = [
        "the", "be", "to", "of", "and", "a", "in", "that", "have", "I",
        "it", "for", "not", "on", "with", "he", "as", "you", "do", "at",
        "this", "but", "his", "by", "from", "they", "we", "say", "her", "she",
        "or", "an", "will", "my", "one", "all", "would", "there", "their", "what",
        "so", "up", "out", "if", "about", "who", "get", "which", "go", "me",
        "when", "make", "can", "like", "time", "no", "just", "him", "know", "take",
        "people", "into", "year", "your", "good", "some", "could", "them", "see", "other",
        "than", "then", "now", "look", "only", "come", "its", "over", "think", "also",
        "back", "after", "use", "two", "how", "our", "work", "first", "well", "way",
        "even", "new", "want", "because", "any", "these", "give", "day", "most", "us",
        "am", "should", "very", "just", "much", "such", "before", "little", "own", "same",
        "may", "long", "big", "down", "man", "find", "thing", "thing", "give", "great",
        "ask", "around", "point", "right", "need", "world", "still", "never", "school", "lead",
        "each", "follow", "between", "few", "problem", "help", "hand", "turn", "leave", "mean",
        "example", "begin", "often", "run", "always", "open", "under", "morning", "something", "next",
        "without", "again", "different", "number", "house", "course", "group", "play", "stand", "continue",
        "everything", "whether", "though", "probably", "seem", "together", "consider", "parent", "include", "however",
        "result", "member", "reason", "difficult", "love", "person", "understand", "watch", "follow", "stop",
        "pass", "within", "stay", "course", "hope", "least", "sure", "learn", "change", "kind",
        "place", "true", "hear", "yet", "listen", "lose", "family", "lead", "become", "believe",
        "across", "today", "early", "million", "real", "team", "best", "whole", "already", "friend",
        "whatever", "cause", "each", "per", "soon", "develop", "reach", "local", "remain", "effect",
        "true", "watch", "pull", "talk", "pick", "care", "listen", "direction", "finish", "situation",
        "almost", "father", "probably", "break", "center", "decide", "record", "college", "although", "building",
        "money", "sort", "level", "church", "religion", "front", "enjoy", "public", "choice", "opportunity",
        "share", "value", "project", "explain", "action", "accept", "common", "cause", "wish", "model",
        "recognize", "hospital", "value", "summer", "individual", "period", "involve", "focus", "agency", "energy",
        "technology", "natural", "floor", "material", "activity", "table", "chance", "society", "news", "support",
        "couple", "order", "deal", "position", "street", "market", "front", "understand", "activity", "program",
        "answer", "prepare", "compare", "certain", "particularly", "realize", "surface", "statement", "direction", "environment",
        "agreement", "certainly", "mention", "method", "economic", "military", "husband", "determine", "private", "concern",
        "determine", "practice", "environmental", "financial", "thousand", "explain", "character", "artist", "performance", "finally",
        "article", "professional", "answer", "various", "technology", "region", "administration", "identify", "hospital", "energy",
        "exist", "produce", "entire", "successful", "deal", "especially", "disease", "serious", "according", "physical",
        "international", "financial", "similar", "strategy", "legislation", "author", "project", "majority", "assume", "opinion",
        "examine", "culture", "attempt", "arrive", "response", "popular", "obtain", "traditional", "entire", "solution",
        "collection", "excellent", "experience", "examine", "purpose","rasve", "statement", "population", "success", "president", "discussion",
        "candidate", "agreement", "possibility", "consumer", "knowledge", "conclusion", "direction", "relationship", "opportunity", "employee",
        "education", "definition", "economic", "historical", "practice", "environment", "science", "strategy", "individual", "character",
        "security", "solution", "behavior", "language", "responsibility", "investment", "technology", "competition", "reality", "procedure",
        "significant", "technology", "potential","bharat", "organization", "alternative", "perspective", "influence", "discipline", "scientific", "achievement"
        ];
    let randomText = "";
    for (let i = 0; i < 40; i++) {
        randomText += words[Math.floor(Math.random() * words.length)] + " ";
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