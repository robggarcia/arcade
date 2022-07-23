const body = document.querySelector("body");

// after submitting names, the computer will display welcomes and give the user options for games to play
let player1 = "Computer";
let player2 = "Computer";

const input1 = document.querySelector("#p1-name");
const p1Button = document.querySelector("#p1-submit");
p1Button.addEventListener("click", () => {
  if (input1.value) {
    player1 = input1.value;
    input1.replaceWith(player1);
    p1Button.classList.add("hide");
  }
});

const input2 = document.querySelector("#p2-name");
const p2Button = document.querySelector("#p2-submit");
p2Button.addEventListener("click", () => {
  if (input2.value) {
    player2 = input2.value;
    input2.replaceWith(player2);
    p2Button.classList.add("hide");
  }
});

let isPlayer1Turn = true;

///////////// CONNECT 4 /////////////

// set up game div, then display name of game and objective
const c4Board = document.createElement("div");
c4Board.setAttribute("id", "connect-board");

const c4Title = document.createElement("h2");
c4Title.textContent = "Connect 4";

const c4rules = document.createElement("p");
c4rules.textContent =
  "Be the first to form a horizontal, vertical, or diagonal line of four of one's own tokens.";

// the board is traditionally 7 columns, by 6 rows
let c4Array = [];

const c4gameDiv = document.querySelector("#game");
function newC4Board() {
  c4Array = [];
  c4Board.textContent = "";
  for (let i = 0; i < 6; i++) {
    c4Array[i] = [];
    for (let j = 0; j < 7; j++) {
      c4Array[i].push("");
      let circleDiv = document.createElement("div");
      circleDiv.setAttribute("class", "game-circle");
      c4Board.appendChild(circleDiv);
      circleDiv.dataset.column = j;
      circleDiv.dataset.row = i;
    }
  }
  c4gameDiv.appendChild(c4Title);
  c4gameDiv.appendChild(c4rules);
  c4gameDiv.appendChild(c4Board);
}
const c4Button = document.querySelector("#c4-button");
c4Button.addEventListener("click", newC4Board);

// when a player clicks on a column, their token color is placed on the bottom row
function addToken(e) {
  // find the location to add token
  let column = e.target.dataset.column;
  let row = e.target.dataset.row;
  for (let i = c4Array.length - 1; i >= 0; i--) {
    if (!c4Array[i][column]) {
      row = i;
      break;
    }
  }
  // find the location on the board
  const token = document.querySelectorAll(`[data-column="${column}"]`)[row];
  // check which players turn it is and place token
  let color;
  if (isPlayer1Turn) {
    color = "red";
    c4Array[row][column] = color;
    token.classList.add(color);
    isPlayer1Turn = !isPlayer1Turn;
  } else {
    color = "yellow";
    c4Array[row][column] = color;
    token.classList.add(color);
    isPlayer1Turn = !isPlayer1Turn;
  }

  // then check to see if the current move wins
  checkHorizontal(row);
  checkVertical(column);
  checkDiagonal(row, column);
}
c4Board.addEventListener("click", addToken);

// define a function to check for 4 same tokens in a row, given a single array to check
let winningColor;
function checkWin(arr) {
  let count = 1;
  let color = "";
  let prevColor = "";
  for (let i = 0; i < arr.length; i++) {
    if (arr[i]) {
      color = arr[i];
      if (prevColor === color) {
        count += 1;
      } else {
        count = 1;
      }
      prevColor = color;
      if (count === 4) {
        console.log(`${color} wins!`);
        winningColor = color;
        return true;
      }
    } else {
      count = 1;
      prevColor = "";
    }
  }
  return false;
}

// check Horizontal for win
function checkHorizontal(row) {
  return checkWin(c4Array[row]);
}
/* function checkHorizontal() {
  for (let i = c4Array.length - 1; i >= 0; i--) {
    if (checkWin(c4Array[i])) {
      return true;
    }
  }
  return false;
} */

// check Vertical for win
function checkVertical(col) {
  let checkArray = [];
  for (row in c4Array) {
    checkArray.push(c4Array[row][col]);
  }
  return checkWin(checkArray);
}

/* function checkVertical() {
  let checkArray = [];
  let columnIdx = 0;
  while (columnIdx < c4Array[0].length) {
    for (let i = 0; i < c4Array.length; i++) {
      checkArray.push(c4Array[i][columnIdx]);
    }
    if (checkWin(checkArray)) {
      return true;
    }
    columnIdx += 1;
    checkArray = [];
  }
  return false;
} */

// check Diagonal for win
function checkDiagonal(row, col) {
  let checkArrayRtoL = [];
  let checkArrayLtoR = [];
  // first find starting positions to collect new arrays
  let topToToken = row;
  let bottomToToken = c4Array.length - 1 - row;

  // create an array from right to left
  let startColRtoL = Number(col) + bottomToToken;
  let startRowRtoL = c4Array.length - 1;
  if (startColRtoL > c4Array[0].length - 1) {
    startColRtoL = c4Array[0].length - 1;
    startRowRtoL = row + startColRtoL - Number(col);
  }
  let j = startColRtoL;
  for (let i = startRowRtoL; i >= 0; i--) {
    checkArrayRtoL.push(c4Array[i][j]);
    j -= 1;
  }

  // create an array from left to right
  let startColLtoR = Number(col) - bottomToToken;
  let startRowLtoR = c4Array.length - 1;
  if (startColLtoR < 0) {
    startColLtoR = 0;
    startRowLtoR = row + Number(col);
  }
  j = startColLtoR;
  for (let i = startRowLtoR; i >= 0; i--) {
    checkArrayLtoR.push(c4Array[i][j]);
    j += 1;
  }

  // check if either arrays have a winning number of tokens in a row
  //   console.log(checkArrayLtoR);
  //   console.log(checkArrayRtoL);
  if (checkWin(checkArrayRtoL) || checkWin(checkArrayLtoR)) {
    return true;
  }
  return false;
}

/* function checkDiagonal() {
  let downRight = [];
  let downLeft = [];
  let upRight = [];
  let upLeft = [];
  let colIdxRight;
  let colIdxLeft;
  for (let i = 0; i < c4Array[0].length; i++) {
    colIdxRight = i;
    colIdxLeft = i;
    for (row in c4Array) {
      downRight.push(c4Array[row][colIdxRight]);
      upRight.push(c4Array[c4Array.length - row - 1][colIdxRight]);
      colIdxRight += 1;
      downLeft.push(c4Array[row][colIdxLeft]);
      upLeft.push(c4Array[c4Array.length - row - 1][colIdxLeft]);
      colIdxLeft -= 1;
    }
    if (checkWin(downRight)) {
      return true;
    }
    downRight = [];
    if (checkWin(upRight)) {
      return true;
    }
    upRight = [];
    if (checkWin(downLeft)) {
      return true;
    }
    downLeft = [];
    if (checkWin(upLeft)) {
      return true;
    }
    upLeft = [];
  }
  return false;
} */
