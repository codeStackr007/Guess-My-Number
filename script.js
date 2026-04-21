"use strict";

// 1. AUDIO
const winSound = new Audio("sounds/WIN.mp3");
const errorSound = new Audio("sounds/ERROR.mp3");
const gameOverSound = new Audio("sounds/OVER.mp3");
// The "Ding" sound for that Game Boy feel
const startSound = new Audio("sounds/START.mp3");

// 2. DATA
let secretNumber = Math.floor(Math.random() * 20) + 1;
let score = 20;
let attempts = 0;
let highscore = 0;
let gameActive = false; // Start locked for the intro

// 3. HELPERS
const displayMessage = function (message) {
  document.getElementById("js-message").textContent = message;
};

const setHint = function (type) {
  document.documentElement.setAttribute("data-hint", type);
};

const lockControls = function () {
  document.getElementById("js-input").disabled = true;
  document.getElementById("js-check").disabled = true;
};

const unlockControls = function () {
  document.getElementById("js-input").disabled = false;
  document.getElementById("js-check").disabled = false;
  document.getElementById("js-input").focus();
};

// 4. BUILD GRID
const gridContainer = document.getElementById("js-grid");
for (let i = 1; i <= 20; i++) {
  const cell = document.createElement("span");
  cell.className = "numgrid__cell";
  cell.textContent = i;
  cell.id = "cell-" + i;
  gridContainer.appendChild(cell);
}
document.getElementById("js-highscore").textContent = highscore;

// ── NEW: GAME BOY START FEATURE ──
// This creates that "Nintendo" logo feel where the screen is locked
// until the "Ding" sound finishes.
const playStartSequence = function () {
  lockControls();
  gameActive = false;
  displayMessage("⭐ LOADING...");

  // Reset sound to beginning
  startSound.currentTime = 0;

  startSound
    .play()
    .then(() => {
      // Once the sound ends, the game "unlocks"
      startSound.onended = function () {
        gameActive = true;
        unlockControls();
        displayMessage("Start guessing...");
      };
    })
    .catch(() => {
      // If the browser blocks the sound, we just start the game
      gameActive = true;
      unlockControls();
      displayMessage("Start guessing...");
    });
};

// 5. LOSE
const handleLoss = function () {
  displayMessage("💥 You lose! Try again.");
  gameActive = false;

  gameOverSound.currentTime = 0;
  gameOverSound.play();

  document.getElementById("js-score").textContent = 0;
  document.querySelector("body").style.backgroundColor = "#950303";
  document.getElementById("js-badge").textContent = secretNumber;

  const allCells = document.querySelectorAll(".numgrid__cell");
  for (let i = 0; i < allCells.length; i++) {
    allCells[i].style.color = "#fff";
    allCells[i].style.borderColor = "#fff";
  }

  document.querySelector(".numgrid__label").style.color = "#fff";
  document.querySelector(".panel__attempts").style.color = "#fff";
};

// 6. CHECK GUESS
const checkGuess = function () {
  if (!gameActive) return;

  const guessInput = document.getElementById("js-input");
  const guess = Number(guessInput.value);

  if (!guessInput.value.trim()) {
    displayMessage("⛔ No Number!");
    errorSound.currentTime = 0;
    errorSound.play();
    return;
  }

  if (guess < 1 || guess > 20) {
    displayMessage("⛔ Out of range!");
    errorSound.currentTime = 0;
    errorSound.play();
    return;
  }

  attempts++;
  document.getElementById("js-attempts").textContent = attempts;

  const cell = document.getElementById("cell-" + guess);

  if (guess === secretNumber) {
    displayMessage("Correct 🎉");
    gameActive = false;

    winSound.currentTime = 0;
    winSound.play();

    setHint("win");

    const badge = document.getElementById("js-badge");
    badge.textContent = secretNumber;
    badge.style.backgroundColor = "#c8f77b";
    badge.style.color = "#222222";

    cell.classList.add("numgrid__cell--win");

    const allCells = document.querySelectorAll(".numgrid__cell");
    for (let i = 0; i < allCells.length; i++) {
      if (
        !allCells[i].classList.contains("numgrid__cell--win") &&
        !allCells[i].classList.contains("numgrid__cell--high") &&
        !allCells[i].classList.contains("numgrid__cell--low")
      ) {
        allCells[i].style.color = "#c8f77b";
        allCells[i].style.borderColor = "#c8f77b";
      }
    }

    document.querySelector(".numgrid__label").style.color = "#222222";
    document.querySelector(".panel__attempts").style.color = "#222222";

    if (score > highscore) {
      highscore = score;
      document.getElementById("js-highscore").textContent = highscore;
    }
  } else {
    if (score > 1) {
      displayMessage(guess > secretNumber ? "Too High! 📈" : "Too Low 📉");
      setHint(guess > secretNumber ? "high" : "low");
      cell.classList.add(
        guess > secretNumber ? "numgrid__cell--high" : "numgrid__cell--low",
      );

      errorSound.currentTime = 0;
      errorSound.play();

      score--;
      document.getElementById("js-score").textContent = score;
    } else {
      handleLoss();
    }
  }

  guessInput.value = "";
  // On mobile, focusing can pop the keyboard up and down.
  // If users find it annoying, we could remove this line.
  guessInput.focus();
};

// 7. LISTENERS
document.getElementById("js-check").addEventListener("click", checkGuess);
document.getElementById("js-input").addEventListener("keydown", function (e) {
  if (e.key === "Enter") checkGuess();
});

// 8. RESET
document.getElementById("js-again").addEventListener("click", function () {
  secretNumber = Math.floor(Math.random() * 20) + 1;
  score = 20;
  attempts = 0;

  document.getElementById("js-score").textContent = score;
  document.getElementById("js-attempts").textContent = attempts;
  document.getElementById("js-badge").textContent = "?";

  const badge = document.getElementById("js-badge");
  badge.style.backgroundColor = "";
  badge.style.color = "";

  document.querySelector("body").style.backgroundColor = "";
  document.getElementById("js-grid").style.backgroundColor = "";
  document.querySelector(".numgrid__label").style.color = "";
  document.querySelector(".panel__attempts").style.color = "";
  document.documentElement.removeAttribute("data-hint");

  const allCells = document.querySelectorAll(".numgrid__cell");
  for (let i = 0; i < allCells.length; i++) {
    allCells[i].className = "numgrid__cell";
    allCells[i].style.color = "";
    allCells[i].style.borderColor = "";
    allCells[i].style.backgroundColor = "";
  }

  const guessInput = document.getElementById("js-input");
  guessInput.value = "";

  // Re-run the intro sequence
  playStartSequence();
});

// 9. KICK OFF
playStartSequence();
