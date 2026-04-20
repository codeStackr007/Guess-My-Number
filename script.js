"use strict";

// ==========================================
// 1. DATA (The Game's Memory)
// ==========================================
let secretNumber = Math.floor(Math.random() * 20) + 1;
let score = 20;
let attempts = 0;
let gameActive = true;

// Load highscore from localStorage (persist across reloads)
let highscore = localStorage.getItem("highscore") || 0;
document.getElementById("js-highscore").textContent = highscore;

// ==========================================
// 2. AUDIO (The Game's Voice)
// ==========================================
const winSound = new Audio("sounds/WIN.mp3");
const errorSound = new Audio("sounds/ERROR.mp3");
const gameOverSound = new Audio("sounds/GAME%20OVER.mp3"); // %20 is for the space
const startSound = new Audio("sounds/START.mp3");

// ==========================================
// 3. TOOLS (Helper Functions)
// ==========================================
const displayMessage = function (message) {
  document.getElementById("js-message").textContent = message;
};

const setHint = function (type) {
  document.documentElement.setAttribute("data-hint", type);
};

// ==========================================
// 4. SETUP (Building the Grid)
// ==========================================
const gridContainer = document.getElementById("js-grid");
for (let i = 1; i <= 20; i++) {
  const cell = document.createElement("span");
  cell.className = "numgrid__cell";
  cell.textContent = i;
  cell.id = "cell-" + i;
  gridContainer.appendChild(cell);
}

// ==========================================
// 5. THE STARTING SOUND
// ==========================================
const playStartOnce = function () {
  startSound.currentTime = 0;
  startSound.play();
  window.removeEventListener("mousedown", playStartOnce);
};
window.addEventListener("mousedown", playStartOnce);

// ==========================================
// 6. LOSING THE GAME
// ==========================================
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

// ==========================================
// 7. CHECKING THE GUESS
// ==========================================
const checkGuess = function () {
  if (gameActive === false) return;

  const guessInput = document.getElementById("js-input");
  const guess = Number(guessInput.value);

  if (!guessInput.value) {
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
    document.getElementById("js-badge").textContent = secretNumber;
    cell.classList.add("numgrid__cell--win");

    // Apply win color to message panel
    const messageBox = document.getElementById("panel__message");
    messageBox.style.backgroundColor = getComputedStyle(
      document.documentElement,
    ).getPropertyValue("--color-win");
    messageBox.style.color = "#000";

    if (score > highscore) {
      highscore = score;
      localStorage.setItem("highscore", highscore); // save persistently
      document.getElementById("js-highscore").textContent = highscore;
    }
  } else {
    if (score > 1 && attempts < 20) {
      if (guess > secretNumber) {
        displayMessage("Too High! 📈");
        setHint("high");
        cell.classList.add("numgrid__cell--high");
      } else {
        displayMessage("Too Low 📉");
        setHint("low");
        cell.classList.add("numgrid__cell--low");
      }

      errorSound.currentTime = 0;
      errorSound.play();

      score--;
      document.getElementById("js-score").textContent = score;
    } else {
      handleLoss();
    }
  }

  guessInput.value = "";
  guessInput.focus();
};

// --- LISTENERS ---
document.getElementById("js-check").addEventListener("click", checkGuess);
document
  .getElementById("js-input")
  .addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      checkGuess();
    }
  });

// ==========================================
// 8. RESETTING (The "Again" Button)
// ==========================================
document.getElementById("js-again").addEventListener("click", function () {
  // Save highscore before reload
  localStorage.setItem("highscore", highscore);
  location.reload(); // one-line refresh
});
