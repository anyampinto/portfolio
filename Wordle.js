/*
 * File: Wordle.js
 * -----------------
 * This program implements the Wordle game.
 */
"use strict";
/**
 * GAME RULES CONSTANTS
 * ---------------------
 */
const NUM_LETTERS = 5;  // The number of letters in each guess 
const NUM_GUESSES = 6;  // The number of guesses the player has to win

/**
 * SIZING AND POSITIONING CONSTANTS
 * --------------------------------
 */
const SECTION_SEP = 32; // The space between the grid, alert, and keyboard sections
const GUESS_MARGIN = 8; // The space around each guess square
const GWINDOW_WIDTH = 400;  // The width of the GWindow

// The size of each guess square (computed to fill the entire GWINDOW_WIDTH)
const GUESS_SQUARE_SIZE =
  (GWINDOW_WIDTH - GUESS_MARGIN * 2 * NUM_LETTERS) / NUM_LETTERS;

// Height of the guess section in total
const GUESS_SECTION_HEIGHT =
  GUESS_SQUARE_SIZE * NUM_GUESSES + GUESS_MARGIN * NUM_GUESSES * 2;

// X and Y position where alerts should be centered
const ALERT_X = GWINDOW_WIDTH / 2;
const ALERT_Y = GUESS_SECTION_HEIGHT + SECTION_SEP;

// X and Y position to place the keyboard
const KEYBOARD_X = 0;
const KEYBOARD_Y = ALERT_Y + SECTION_SEP;

// GWINDOW_HEIGHT calculated to fit everything perfectly.
const GWINDOW_HEIGHT = KEYBOARD_Y + GKeyboard.getHeight(GWINDOW_WIDTH);


/**
 * STYLISTIC CONSTANTS
 * -------------------
 */
const COLORBLIND_MODE = false; // If true, uses R/G colorblind friendly colors

// Background/Border Colors
const BORDER_COLOR = "#3A3A3C"; // Color for border around guess squares
const BACKGROUND_DEFAULT_COLOR = "#121213";
const KEYBOARD_DEFAULT_COLOR = "#818384";
const BACKGROUND_CORRECT_COLOR = COLORBLIND_MODE ? "#E37E43" : "#618C55"; 
const BACKGROUND_FOUND_COLOR = COLORBLIND_MODE ? "#94C1F6" : "#B1A04C";
const BACKGROUND_WRONG_COLOR = "#3A3A3C";

// Text Colors
const TEXT_DEFAULT_COLOR = "#FFFFFF";
const TEXT_ALERT_COLOR = "#B05050";
const TEXT_WIN_COLOR = COLORBLIND_MODE ? "#94C1F6" : "#618C55";
const TEXT_LOSS_COLOR = "#B05050";

// Fonts
const GUESS_FONT = "700 36px HelveticaNeue";
const ALERT_FONT = "700 20px HelveticaNeue";

/**
 * Accepts a KeyboardEvent and returns
 * the letter that was pressed, or null
 * if a letter wasn't pressed.
 */
function getKeystrokeLetter(e) {
  if (e.altKey || e.ctrlKey || e.metaKey) return null;
  const key = e.key.toLowerCase();

  if (!/^[a-z]$/.exec(key)) return null;

  return key;
}

/**
 * Accepts a KeyboardEvent and returns true
 * if that KeyboardEvent was the user pressing
 * enter (or return), and false otherwise.
 */
function isEnterKeystroke(e) {
  return (
    !e.altKey &&
    !e.ctrlKey &&
    !e.metaKey &&
    (e.code === "Enter" || e.code === "Return")
  );
}

/**
 * Accepts a KeyboardEvent and returns true
 * if that KeyboardEvent was the user pressing
 * backspace (or delete), and false otherwise.
 */
function isBackspaceKeystroke(e) {
  return (
    !e.altKey &&
    !e.ctrlKey &&
    !e.metaKey &&
    (e.code === "Backspace" || e.code === "Delete")
  );
}

/**
 * Accepts a string, and returns if it is a valid English word.
 */
function isEnglishWord(str) {
  return _DICTIONARY.has(str) || _COMMON_WORDS.has(str);
}

/**
 * Returns a random common word from the English lexicon,
 * that is NUM_LETTERS long.
 * 
 * Throws an error if no such word exists.
 */
function getRandomWord() {
  const nLetterWords = [..._COMMON_WORDS].filter(
    (word) => word.length === NUM_LETTERS
  );

  if (nLetterWords.length === 0) {
    throw new Error(
      `The list of common words does not have any words that are ${NUM_LETTERS} long!`
    );
  }

  return nLetterWords[randomInteger(0, nLetterWords.length)];
}

/** Main Function */
function Wordle() {
  const gw = GWindow(GWINDOW_WIDTH, GWINDOW_HEIGHT);
  let guessSquare = null;
  let guessSquareFill = null;
  let guessSquareOutline = null;
  let letter = null;
  let letterInput = "";
  let testArray = [""];
  let alertMessage = ""
  let alertColor = null;
  let alert = null;
  let secretWord = getRandomWord();
  console.log(secretWord);
  let guessLetters = [];
  let guessWord = testArray[testArray.length - 1];
  let isWord = false;
  let hasWon = false;
  let keyboard = GKeyboard(KEYBOARD_X, KEYBOARD_Y, GWINDOW_WIDTH, TEXT_DEFAULT_COLOR, KEYBOARD_DEFAULT_COLOR);
  gw.add(keyboard);
  drawGuessGrid();
  //draw guess square individually
  function drawGuessSquare(x, y, color, letterInput) { //separate out into individual square and run loop separately outside this
    guessSquare = GCompound();
    guessSquareFill = GRect(GUESS_MARGIN * ((x + 0.5) * 2) + GUESS_SQUARE_SIZE * x, GUESS_MARGIN * ((y + 0.5) * 2) + GUESS_SQUARE_SIZE * y, GUESS_SQUARE_SIZE, GUESS_SQUARE_SIZE);
    guessSquareOutline = GRect(GUESS_MARGIN * ((x + 0.5) * 2) + GUESS_SQUARE_SIZE * x, GUESS_MARGIN * ((y + 0.5) * 2) + GUESS_SQUARE_SIZE * y, GUESS_SQUARE_SIZE, GUESS_SQUARE_SIZE);
    guessSquareFill.setFillColor(color);
    guessSquareFill.setFilled(true);
    guessSquareOutline.setColor(BORDER_COLOR);
    letterInput = letterInput.toUpperCase();
    letter = GLabel(letterInput, GUESS_MARGIN * ((x + 0.5) * 2) + ((GUESS_SQUARE_SIZE * (2 * x + 1)) / 2), GUESS_MARGIN * ((y + 0.5) * 2) + (GUESS_SQUARE_SIZE * (2 * y + 1)) / 2);
    letter.setFont(GUESS_FONT);
    letter.setColor(TEXT_DEFAULT_COLOR);
    letter.setTextAlign("center");
    letter.setBaseline("middle");
    guessSquare.add(guessSquareFill);
    guessSquare.add(guessSquareOutline);
    guessSquare.add(letter);
    gw.add(guessSquare);
    return guessSquare;
  }
  //draws the grid and updates the colors of each square by calling drawGuessSquare based on letterInput. updates the screen after every interaction.
  function drawGuessGrid() {
    for (let y = 0; y < NUM_GUESSES; y++) {
      let word = testArray[y];
      for (let x = 0; x < NUM_LETTERS; x++) {
        if (y >= testArray.length) {
          word = "     ";
          letterInput = word.charAt(x);
        }
        letterInput = word.charAt(x);
        if (letterInput === "" || y >= testArray.length - 1) { 
          drawGuessSquare(x, y, BACKGROUND_DEFAULT_COLOR, letterInput);
        }
        else if (word.toUpperCase().charAt(x) === secretWord.toUpperCase().charAt(x)) {
          drawGuessSquare(x, y, BACKGROUND_CORRECT_COLOR, letterInput);
          if (letterInput !== " " && letterInput !== null) {
          keyboard.setKeyColor(letterInput, BACKGROUND_CORRECT_COLOR);
          }
        }
        else if (secretWord.toUpperCase().includes(letterInput)) {
          drawGuessSquare(x, y, BACKGROUND_FOUND_COLOR, letterInput);
          if (letterInput !== " " && letterInput !== null) {
          keyboard.setKeyColor(letterInput, BACKGROUND_FOUND_COLOR);
          }
        }
        else  {
          drawGuessSquare(x, y, BACKGROUND_WRONG_COLOR, letterInput);
          if (letterInput !== " " && letterInput !== null) {
          keyboard.setKeyColor(letterInput, BACKGROUND_WRONG_COLOR);
          }
        }
      }      
    }
  }
  //allows the user to type, updating the user's guess word (current element of the array testArray)
  function keyclick(e) {
    if (hasWon === false) {
      if (alert !== null) {
      gw.remove(alert);
        }
    if (testArray[testArray.length - 1].length < NUM_LETTERS) {
    testArray[testArray.length - 1] += e.toUpperCase();
    drawGuessGrid();
      }
    }
  }
  keyboard.addEventListener("keyclick", keyclick);
  //enters the user's guess, producing one of four outputs: the word is either too short, not a word in the dictionary, the winning word, or the losing word (i.e. the user has not guessed the winning word). 
  function enter() {
    guessWord = testArray[testArray.length - 1];
    if (guessWord.length < NUM_LETTERS) {
      sendAlert("Please enter a five-letter word!", TEXT_LOSS_COLOR);
    }
    if (guessWord.length === NUM_LETTERS && isEnglishWord(testArray[testArray.length -1].toLowerCase())) {
    if (guessWord.toLowerCase() === secretWord.toLowerCase()) {
      sendAlert("You Win!", TEXT_WIN_COLOR);
      hasWon = true;
    }
    else if (testArray.length === NUM_GUESSES) {      
      sendAlert("You Lose.", TEXT_LOSS_COLOR);
    }
    testArray.push("");
    }
    else if (guessWord.length === NUM_LETTERS && isEnglishWord(guessWord.toLowerCase()) === false) {
      sendAlert(guessWord.toUpperCase() + " is not a word!", TEXT_ALERT_COLOR)
    }
        drawGuessGrid();
  }
    keyboard.addEventListener("enter", enter);
//deletes the previous letter by updating the length of the string guessWord (the last/current element in testArray)
  function backspace() {
    guessWord = testArray[testArray.length - 1];
    if (hasWon === false) {
      if (alert !== null) {
      gw.remove(alert);
      }
    testArray[testArray.length - 1] = guessWord.substring(0, guessWord.length - 1);
      drawGuessGrid();
    }
  }
    keyboard.addEventListener("backspace", backspace);
//sets the alerts so that they can be called with different messages/colors depending on the interaction.
  function sendAlert(alertMessage, alertColor) {
    alert = GLabel(alertMessage, ALERT_X, ALERT_Y);
    alert.setColor(alertColor);
    alert.setFont(ALERT_FONT);
    alert.setTextAlign("center");
    alert.setBaseline("middle");
    gw.add(alert);
    return alert;
  }
//connects the physical keyboard to the on-screen keyboard.
  function keydown(e) {
    if (hasWon === false) {
      if (alert !== null) {
      gw.remove(alert);
      }
    if (isEnterKeystroke(e)) {
      enter();
    }
    else if (isBackspaceKeystroke(e)) {
      backspace();
    }
    else if (getKeystrokeLetter(e) !== null) {
      keyclick(getKeystrokeLetter(e));
    }
      drawGuessGrid();
    }
  }
  gw.addEventListener("keydown", keydown);
}
