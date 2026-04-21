"use strict";

// ====================================
// GUESS MY NUMBER!
// Started: 07/04/26 | 22:05
// Completed: 14/04/26 | 23:08
// Built with Jonas Schmedtmann
// ====================================

// ====================================
// GAME STATE VARIABLES
// ====================================
let secretNumber = Math.floor(Math.random() * 20) + 1;
let score = 20;
let highscore = 0;

// ====================================
// HELPER FUNCTIONS
// ====================================
const displayMessage = (message) =>
  (document.querySelector(".message").textContent = message);

// ====================================
// CORE GAME LOGIC — CHECK GUESS
// ====================================
document.querySelector(".check").addEventListener("click", function () {
  let guess = +document.querySelector(".guess").value;

  // Validation: Empty input or out of range
  if (!document.querySelector(".guess").value.trim()) {
    displayMessage("⛔ No Number, Input a number!");
  } else if (guess < 1 || guess > 20) {
    displayMessage("⛔ Invalid Number, Number must be between 1 and 20!");
  }

  // Win condition
  else if (guess === secretNumber) {
    document.querySelector(".number").textContent = secretNumber;
    displayMessage("Correct 🎉");
    document.querySelector("body").style.backgroundColor = "#60b347";
    document.querySelector(".number").style.width = "30rem";

    // Update highscore if current score beats it
    if (score > highscore) {
      highscore = score;
      document.querySelector(".highscore").textContent = highscore;
    }
  }

  // Wrong guess handling
  else if (guess !== secretNumber) {
    if (score > 1) {
      displayMessage(guess > secretNumber ? "Too High! 📈" : "Too Low 📉");
      score--;
      document.querySelector(".score").textContent = score;
    } else {
      // Lose condition
      displayMessage("💥💣 You lose!, Try again...");
      document.querySelector(".score").textContent = 0;
      document.querySelector("body").style.backgroundColor = "#950303";
    }
  }
});

// ====================================
// RESET GAME — AGAIN BUTTON
// ====================================
document.querySelector(".again").addEventListener("click", () => {
  score = 20;
  secretNumber = Math.floor(Math.random() * 20) + 1;

  displayMessage("Start guessing...");
  document.querySelector(".score").textContent = score;
  document.querySelector(".number").textContent = "?";
  document.querySelector(".guess").value = "";
  document.querySelector("body").style.backgroundColor = "#222";
  document.querySelector(".number").style.width = "15rem";
});
