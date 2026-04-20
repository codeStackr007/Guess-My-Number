"use strict";

// ==========================================
// 1. AUDIO
// ==========================================
const winSound = new Audio("sounds/WIN.mp3");
const errorSound = new Audio("sounds/ERROR.mp3");
const gameOverSound = new Audio("sounds/OVER.mp3");
const startSound = new Audio("sounds/START.mp3");

// ==========================================
// 2. DATA
// ==========================================
let secretNumber = Math.floor(Math.random() * 20) + 1;
let score = 20;
let attempts = 0;
let highscore = 0;
let gameActive = false; // locked until start sound finishes

// ==========================================
// 3. HELPERS
// ==========================================
const displayMessage = function (message) {
  document.getElementById("js-message").textContent = message;
};

const setHint = function (type) {
  document.documentElement.setAttribute("data-hint", type);
};

// Lock/unlock the game controls (input + check button)
const lockControls = function () {
  document.getElementById("js-input").disabled = true;
  document.getElementById("js-check").disabled = true;
};

const unlockControls = function () {
  document.getElementById("js-input").disabled = false;
  document.getElementById("js-check").disabled = false;
  document.getElementById("js-input").focus();
};

// ==========================================
// 4. BUILD GRID (once, on page load)
// ==========================================
const gridContainer = document.getElementById("js-grid");
for (let i = 1; i <= 20; i++) {
  const cell = document.createElement("span");
  cell.className = "numgrid__cell";
  cell.textContent = i;
  cell.id = "cell-" + i;
  gridContainer.appendChild(cell);
}

document.getElementById("js-highscore").textContent = highscore;

// ==========================================
// 5. START SOUND
// ==========================================
// Browser requires a user gesture before any audio can play.
// We unlock audio silently on the very first interaction,
// then immediately play the start sound.
const playStartSound = function (callback) {
  lockControls();

  // Try to play directly — works if audio context is already unlocked
  const tryPlay = function () {
    startSound.currentTime = 0;
    const playPromise = startSound.play();

    if (playPromise !== undefined) {
      playPromise
        .then(function () {
          // Sound is playing — unlock controls when it ends
          startSound.onended = function () {
            gameActive = true;
            unlockControls();
            if (callback) callback();
          };
        })
        .catch(function () {
          // Autoplay blocked — wait for first interaction then retry
          const unlock = function () {
            startSound.currentTime = 0;
            startSound.play().then(function () {
              startSound.onended = function () {
                gameActive = true;
                unlockControls();
                if (callback) callback();
              };
            });
            window.removeEventListener("mousedown", unlock);
            window.removeEventListener("keydown", unlock);
          };
          window.addEventListener("mousedown", unlock);
          window.addEventListener("keydown", unlock);
        });
    } else {
      // Old browser fallback
      gameActive = true;
      unlockControls();
    }
  };

  tryPlay();
};

// ==========================================
// 6. LOSE
// ==========================================
const handleLoss = function () {
  displayMessage("💥 You lose! Try again.");
  gameActive = false;

  gameOverSound.currentTime = 0;
  gameOverSound.play();

  document.getElementById("js-score").textContent = 0;
  document.querySelector("body").style.backgroundColor = "#950303";
  document.getElementById("js-badge").textContent = secretNumber;

  document.querySelectorAll(".numgrid__cell").forEach(function (cell) {
    cell.style.color = "#fff";
    cell.style.borderColor = "#fff";
  });

  document.querySelector(".numgrid__label").style.color = "#fff";
  document.querySelector(".panel__attempts").style.color = "#fff";
};

// ==========================================
// 7. CHECK GUESS
// ==========================================
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
    // WIN
    displayMessage("Correct 🎉");
    gameActive = false;

    winSound.currentTime = 0;
    winSound.play();

    setHint("win");
    document.getElementById("js-badge").textContent = secretNumber;
    cell.classList.add("numgrid__cell--win");

    document.querySelector("body").style.backgroundColor = "#7eb604";

    document.querySelectorAll(".numgrid__cell").forEach(function (cell) {
      cell.style.color = "#fffff";
      cell.style.borderColor = "#ffffff";
    });

    document.querySelector(".numgrid__label").style.color = "#222222";
    document.querySelector(".panel__attempts").style.color = "#222222";

    if (score > highscore) {
      highscore = score;
      document.getElementById("js-highscore").textContent = highscore;
    }
  } else {
    // WRONG GUESS
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
  guessInput.focus();
};

// ==========================================
// 8. LISTENERS
// ==========================================
document.getElementById("js-check").addEventListener("click", checkGuess);
document.getElementById("js-input").addEventListener("keydown", function (e) {
  if (e.key === "Enter") checkGuess();
});

// ==========================================
// 9. RESET
// ==========================================
document.getElementById("js-again").addEventListener("click", function () {
  // Reset data
  secretNumber = Math.floor(Math.random() * 20) + 1;
  score = 20;
  attempts = 0;
  gameActive = false; // locked until start sound finishes

  // Reset UI text
  displayMessage("Start guessing...");
  document.getElementById("js-score").textContent = score;
  document.getElementById("js-attempts").textContent = attempts;
  document.getElementById("js-badge").textContent = "?";

  // Reset styles
  document.querySelector("body").style.backgroundColor = "";
  document.getElementById("js-grid").style.backgroundColor = "";
  document.querySelector(".numgrid__label").style.color = "";
  document.querySelector(".panel__attempts").style.color = "";
  document.documentElement.removeAttribute("data-hint");

  // Reset grid cells
  document.querySelectorAll(".numgrid__cell").forEach(function (cell) {
    cell.className = "numgrid__cell";
    cell.style.color = "";
    cell.style.borderColor = "";
    cell.style.backgroundColor = "";
  });

  // Play start sound — controls unlock when it finishes
  playStartSound();
});

// ==========================================
// 10. KICK OFF
// ==========================================
playStartSound();
