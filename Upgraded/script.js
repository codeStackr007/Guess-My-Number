"use strict";

// 1. AUDIO
const winSound = new Audio("/Upgraded/sounds/WIN.mp3");
const errorSound = new Audio("/Upgraded/sounds/ERROR.mp3");
const gameOverSound = new Audio("/Upgraded/sounds/OVER.mp3");
const startSound = new Audio("/Upgraded/sounds/START.mp3");

// 2. DATA
let secretNumber = Math.floor(Math.random() * 20) + 1;
let score = 20;
let attempts = 0;
let highscore = 0;
let gameActive = false;

// 3. HELPERS
const displayMessage = function (message) {
  document.getElementById("js-message").textContent = message;
};

const setHint = function (type) {
  if (type) {
    document.documentElement.setAttribute("data-hint", type);
  } else {
    document.documentElement.removeAttribute("data-hint");
  }
};

const lockControls = function () {
  document.getElementById("js-input").disabled = true;
  document.getElementById("js-check").disabled = true;
};

const unlockControls = function () {
  document.getElementById("js-input").disabled = false;
  document.getElementById("js-check").disabled = false;
  if (window.matchMedia("(min-width: 64.0625rem)").matches) {
    document.getElementById("js-input").focus();
  }
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

// 5. START SEQUENCE
const playStartSequence = function () {
  lockControls();
  gameActive = false;
  displayMessage("⭐ LOADING...");
  setHint("");

  startSound.currentTime = 0;

  startSound
    .play()
    .then(() => {
      startSound.onended = function () {
        gameActive = true;
        unlockControls();
        displayMessage("Start guessing...");
      };
    })
    .catch(() => {
      gameActive = true;
      unlockControls();
      displayMessage("Start guessing...");
    });
};

// 6. LOSE
const handleLoss = function () {
  displayMessage("💥 You lose! Try again.");
  gameActive = false;
  setHint("");

  gameOverSound.currentTime = 0;
  gameOverSound.play();

  document.getElementById("js-score").textContent = 0;
  document.querySelector("body").style.backgroundColor = "#950303";
  document.getElementById("js-badge").textContent = secretNumber;

  document.querySelectorAll(".numgrid__cell").forEach(function (c) {
    c.style.color = "#fff";
    c.style.borderColor = "#fff";
  });

  document.querySelector(".numgrid__label").style.color = "#fff";
  document.querySelector(".panel__attempts").style.color = "#fff";
  document.querySelector(".panel__message").style.color = "#fff";
  document.querySelector(".panel--left").style.borderColor = "#fff";
  document.querySelectorAll(".panel__divider").forEach(function (el) {
    el.style.borderColor = "#fff";
  });
};

// 7. CHECK GUESS
const checkGuess = function (forcedGuess) {
  if (!gameActive) return;

  const guessInput = document.getElementById("js-input");
  let guess;

  if (forcedGuess !== undefined) {
    guess = forcedGuess;
  } else {
    const rawValue = guessInput.value.trim();

    // Check for empty input
    if (!rawValue) {
      displayMessage("⛔ No Number!");
      errorSound.currentTime = 0;
      errorSound.play();
      setHint("");
      return;
    }

    guess = Number(rawValue);

    // Check if it's a valid number
    if (isNaN(guess) || !Number.isInteger(guess)) {
      displayMessage("⛔ Invalid number!");
      errorSound.currentTime = 0;
      errorSound.play();
      setHint("");
      guessInput.value = "";
      return;
    }

    // Check range
    if (guess < 1 || guess > 20) {
      displayMessage("⛔ Out of range!");
      errorSound.currentTime = 0;
      errorSound.play();
      setHint("");
      guessInput.value = "";
      return;
    }

    const guessedCell = document.getElementById("cell-" + guess);
    const alreadyTried =
      guessedCell.classList.contains("numgrid__cell--high") ||
      guessedCell.classList.contains("numgrid__cell--low");

    if (alreadyTried) {
      attempts++;
      document.getElementById("js-attempts").textContent = attempts;

      if (score > 1) {
        displayMessage("⚠️ Already tried!");
        errorSound.currentTime = 0;
        errorSound.play();
        score--;
        document.getElementById("js-score").textContent = score;
      } else {
        handleLoss();
      }
      guessInput.value = "";
      return;
    }
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
    badge.classList.add("header__badge--win");

    cell.classList.add("numgrid__cell--win");

    if (score > highscore) {
      highscore = score;
      document.getElementById("js-highscore").textContent = highscore;
    }
  } else {
    if (score > 1) {
      const isHigh = guess > secretNumber;
      displayMessage(isHigh ? "Too High! 📈" : "Too Low 📉");
      setHint(isHigh ? "high" : "low");
      cell.classList.add(isHigh ? "numgrid__cell--high" : "numgrid__cell--low");

      errorSound.currentTime = 0;
      errorSound.play();

      score--;
      document.getElementById("js-score").textContent = score;
    } else {
      handleLoss();
    }
  }

  guessInput.value = "";
  if (window.matchMedia("(min-width: 64.0625rem)").matches) {
    guessInput.focus();
  }
};

// 8. LISTENERS
document.getElementById("js-check").addEventListener("click", function () {
  checkGuess();
});

document.getElementById("js-input").addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    checkGuess();
  }
});

gridContainer.addEventListener("click", function (e) {
  if (window.matchMedia("(min-width: 64.0625rem)").matches) return;

  const cell = e.target.closest(".numgrid__cell");
  if (!cell) return;
  if (!gameActive) return;
  if (cell.classList.contains("numgrid__cell--win")) return;

  if (
    cell.classList.contains("numgrid__cell--high") ||
    cell.classList.contains("numgrid__cell--low")
  ) {
    attempts++;
    document.getElementById("js-attempts").textContent = attempts;

    if (score > 1) {
      displayMessage("⚠️ Already tried!");
      errorSound.currentTime = 0;
      errorSound.play();
      score--;
      document.getElementById("js-score").textContent = score;
    } else {
      handleLoss();
    }
    return;
  }

  const number = parseInt(cell.textContent, 10);
  checkGuess(number);
});

// 9. RESET
document.getElementById("js-again").addEventListener("click", function () {
  secretNumber = Math.floor(Math.random() * 20) + 1;
  score = 20;
  attempts = 0;

  document.getElementById("js-score").textContent = score;
  document.getElementById("js-attempts").textContent = attempts;

  const badge = document.getElementById("js-badge");
  badge.textContent = "?";
  badge.style.backgroundColor = "";
  badge.style.color = "";
  badge.classList.remove("header__badge--win");

  document.querySelector("body").style.backgroundColor = "";
  document.getElementById("js-grid").style.backgroundColor = "";
  document.querySelector(".numgrid__label").style.color = "";
  document.querySelector(".panel__attempts").style.color = "";
  document.querySelector(".panel__message").style.color = "";
  document.querySelector(".panel--left").style.borderColor = "";
  document.querySelectorAll(".panel__divider").forEach(function (el) {
    el.style.borderColor = "";
  });

  setHint("");

  document.querySelectorAll(".numgrid__cell").forEach(function (c) {
    c.className = "numgrid__cell";
    c.style.color = "";
    c.style.borderColor = "";
    c.style.backgroundColor = "";
  });

  document.getElementById("js-input").value = "";

  playStartSequence();
});

// 10. KICK OFF
playStartSequence();
