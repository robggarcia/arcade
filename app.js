// begin by creating an object to represent the Arcade
const arcade = {
  player1: {
    name: "Computer",
    color: "red",
    score: 0,
  },
  player2: {
    name: "Computer",
    color: "yellow",
    score: 0,
  },
  board: [],
  message: "",
};

const body = document.querySelector("body");

// after submitting names, the computer will display welcomes and give the user options for games to play
const scoreDiv = document.createElement("div");
scoreDiv.setAttribute("id", "scores");
const p1StatsDiv = document.createElement("div");
p1StatsDiv.classList.add("stats");
const p2StatsDiv = document.createElement("div");
p2StatsDiv.classList.add("stats");
scoreDiv.appendChild(p1StatsDiv);
scoreDiv.appendChild(p2StatsDiv);

let p1Score = document.createElement("p");
p1Score.textContent = `Score = ${arcade.player1.score}`;

let p2Score = document.createElement("p");
p2Score.textContent = `Score = ${arcade.player2.score}`;

const input1 = document.querySelector("#p1-name");
const p1Button = document.querySelector("#p1-submit");
const player1field = document.querySelector("#input-name1");
const player2field = document.querySelector("#input-name2");

const showGames = document.querySelector(".select-game");

p1Button.addEventListener("click", () => {
  if (input1.value) {
    arcade.player1 = input1.value;
    const player1Welcome = document.createElement("h3");
    player1Welcome.textContent = `${arcade.player1}`;
    input1.classList.add("hide");
    // input1.replaceWith(arcade.player1);
    p1Button.classList.add("hide");
    player1field.appendChild(player1Welcome);

    showGames.classList.remove("hide");
    scoreDiv.appendChild(player1Welcome);
    scoreDiv.appendChild(p1Score);
    showGames.appendChild(scoreDiv);

    // why is the name not showing up in place of the input field??
  }
});

const input2 = document.querySelector("#p2-name");
const p2Button = document.querySelector("#p2-submit");
p2Button.addEventListener("click", () => {
  if (input2.value) {
    arcade.player2 = input2.value;
    const player2Welcome = document.createElement("h3");
    console.log(player2Welcome);
    player2Welcome.textContent = `${arcade.player2}`;
    input2.classList.add("hide");

    // input2.replaceWith(arcade.player2);
    p2Button.classList.add("hide");
    player2field.appendChild(player2Welcome);
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
  if (c4Array[row][column]) {
    console.log("Please Choose an empty column");
    return;
  }
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
  if (
    checkHorizontal(row) ||
    checkVertical(column) ||
    checkDiagonal(row, column)
  ) {
    console.log("CONGRATULATIONS TO THE WINNER!");
  }
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

// check Vertical for win
function checkVertical(col) {
  let checkArray = [];
  for (row in c4Array) {
    checkArray.push(c4Array[row][col]);
  }
  return checkWin(checkArray);
}

// check Diagonal for win
function checkDiagonal(row, col) {
  let checkArrayRtoL = [];
  let checkArrayLtoR = [];
  // first find starting positions to collect new arrays
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
  if (checkWin(checkArrayRtoL) || checkWin(checkArrayLtoR)) {
    return true;
  }
  return false;
}
