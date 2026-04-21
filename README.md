# Guess My Number!

Two versions of the same game — one from a tutorial, one extended with my own ideas.

## Folder Structure

```
guess-my-number/
├── original/
│   ├── index.html
│   ├── style.css
│   └── script.js
│
├── upgraded/
│   ├── index.html
│   ├── style.css
│   ├── script.js
│   └── sounds/
│       ├── START.mp3
│       ├── WIN.mp3
│       ├── ERROR.mp3
│       └── OVER.mp3
│
└── README.md
```

## Original Version

Built while following Jonas Schmedtmann’s JavaScript course. This is the foundation.

### How to Run

1. Open the `original/` folder
2. Double‑click `index.html`
3. The browser opens — start guessing

Or use Live Server in VS Code.

### Features

- Guess a number between 1 and 20
- Score starts at 20, decreases with each wrong guess
- Highscore tracks best performance per session
- Win: green background
- Lose: red background

---

## Upgraded Version

Same core game, but with a new interface and extra features I added after learning the fundamentals.

### How to Run

1. Open the `upgraded/` folder
2. Double‑click `index.html`
3. Ensure sound files are in `upgraded/sounds/`

### Requirements

Audio files must be present with exact names:

| File        | Purpose                      |
| ----------- | ---------------------------- |
| `START.mp3` | Plays on page load and reset |
| `WIN.mp3`   | Plays on correct guess       |
| `ERROR.mp3` | Plays on wrong guess         |
| `OVER.mp3`  | Plays on game over           |

### Features Added

| Feature         | Description                                   |
| --------------- | --------------------------------------------- |
| Number grid     | Visual 1–20 layout instead of typing          |
| Mobile tap      | Tap cells directly on phones and tablets      |
| Sound design    | Audio feedback for all game events            |
| Loading lock    | Input disabled during start sound             |
| Win/lose themes | Full‑page color changes with matching borders |
| Already tried   | Re‑guessing same number counts as attempt     |

### Game Rules

1. Game selects random number between 1 and 20
2. Click or tap grid cells to guess
3. Wrong guess: cell turns blue (too low) or orange (too high)
4. Score decreases by 1 for each wrong guess
5. Score reaches 0 = game over
6. Correct guess: cell turns green, badge reveals number

---

## Which Version Should You View?

| If you want to see...                         | Open        |
| --------------------------------------------- | ----------- |
| Tutorial code I learned from                  | `original/` |
| What I built after understanding the concepts | `upgraded/` |
| Clean, simple DOM manipulation                | `original/` |
| Event delegation and dynamic elements         | `upgraded/` |
| Mobile‑first design approach                  | `upgraded/` |

---

## Tech Stack

- HTML5
- CSS3 (Flexbox, Grid, Custom Properties)
- Vanilla JavaScript (ES6+)
- Web Audio API

No frameworks. No build tools.

---

## What I Learned

### Original Version:

- DOM selection and manipulation
- Click event handling
- Game state management
- CSS updates via JavaScript

### Upgraded Version:

- Dynamic element creation with loops
- Event delegation for grid clicks
- Media query matching in JavaScript
- Audio playback with Promise handling
- Disabled state management during async operations
- Mobile and tablet responsive design

---

## Why Two Versions?

The original shows where I started. The upgraded shows where I went after I understood the concepts. Both represent honest learning in progress.

Tutorials are starting points. This is what happened when I kept going.
