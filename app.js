// begin by creating an object to represent the Arcade
const arcade = {
  player1: {
    name: "Computer",
    color: "red",
    score: 0,
    turn: true,
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

const scoreDiv = document.querySelectorAll(".score");

const p1Score = document.querySelector("#p1score");
p1Score.textContent = `Score: ${arcade.player1.score}`;
const p1Name = document.querySelector("#p1name");
const p1Turn = document.querySelector("#p1turn");

const p2Score = document.querySelector("#p2score");
p2Score.textContent = `Score: ${arcade.player2.score}`;
const p2Name = document.querySelector("#p2name");
const p2Turn = document.querySelector("#p2turn");

const input1 = document.querySelector("#p1-name");
const p1Button = document.querySelector("#p1-submit");
const player1field = document.querySelector("#input-name1");

const showGames = document.querySelector(".select-game");
const message = document.querySelector("#message");

p1Button.addEventListener("click", () => {
  if (input1.value) {
    arcade.player1.name = input1.value;
    const player1Input = document.createElement("h3");
    player1Input.textContent = `${arcade.player1.name}`;
    input1.classList.add("hide");
    p1Button.classList.add("hide");
    player1field.appendChild(player1Input);

    p1Name.textContent = `${arcade.player1.name}`;
    scoreDiv[0].classList.remove("hide");
    scoreDiv[1].classList.remove("hide");
    showGames.classList.remove("hide");
    message.classList.add("hide");
  }
});

const input2 = document.querySelector("#p2-name");
const p2Button = document.querySelector("#p2-submit");
const player2field = document.querySelector("#input-name2");

p2Button.addEventListener("click", () => {
  if (input2.value) {
    arcade.player2.name = input2.value;
    const player2Input = document.createElement("h3");
    player2Input.textContent = `${arcade.player2.name}`;
    input2.classList.add("hide");
    p2Button.classList.add("hide");
    player2field.appendChild(player2Input);

    p2Name.textContent = `${arcade.player2.name}`;
    scoreDiv[0].classList.remove("hide");
    scoreDiv[1].classList.remove("hide");
    showGames.classList.remove("hide");
    message.classList.add("hide");
  }
});

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

const c4gameDiv = document.querySelector("#game");
function newC4Board() {
  arcade.board = [];
  c4Board.textContent = "";
  for (let i = 0; i < 6; i++) {
    arcade.board[i] = [];
    for (let j = 0; j < 7; j++) {
      arcade.board[i].push("");
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

  // randomly choose a player to start
  if (Math.floor(Math.random() * 10) % 2 === 0) {
    scoreDiv[0].classList.add(`${arcade.player1.color}`);
    p1Turn.classList.remove("hide");
  } else {
    arcade.player1.turn = false;
    scoreDiv[1].classList.add(`${arcade.player2.color}`);
    p2Turn.classList.remove("hide");
  }
}
const c4Button = document.querySelector("#c4-button");
c4Button.addEventListener("click", newC4Board);

// when a player clicks on a column, their token color is placed on the bottom row
function addToken(e) {
  console.log(arcade.message);
  message.classList.add("hide");
  // find the location to add token
  let column = e.target.dataset.column;
  let row = e.target.dataset.row;
  for (let i = arcade.board.length - 1; i >= 0; i--) {
    if (!arcade.board[i][column]) {
      row = i;
      break;
    }
  }
  if (arcade.board[row][column]) {
    arcade.message = "Choose an empty column";
    message.textContent = arcade.message;
    message.classList.remove("hide");
    return;
  }
  const token = document.querySelectorAll(`[data-column="${column}"]`)[row];

  // check which players turn it is and place token
  if (arcade.player1.turn) {
    arcade.board[row][column] = arcade.player1.color;
    token.classList.add(`${arcade.player1.color}`);
    console.log(arcade.player1.turn);
    arcade.player1.turn = !arcade.player1.turn;
    scoreDiv[0].classList.remove(`${arcade.player1.color}`);
    p1Turn.classList.add("hide");
    scoreDiv[1].classList.add(`${arcade.player2.color}`);
    p2Turn.classList.remove("hide");
  } else {
    arcade.board[row][column] = arcade.player2.color;
    token.classList.add(`${arcade.player2.color}`);
    console.log(arcade.player1.turn);
    arcade.player1.turn = !arcade.player1.turn;
    scoreDiv[0].classList.add(`${arcade.player1.color}`);
    p2Turn.classList.remove("hide");
    scoreDiv[1].classList.remove(`${arcade.player2.color}`);
    p1Turn.classList.remove("hide");
  }

  // NEED TO DISPLAY MESSAGE TO WINNER AND NOT MOVE TO NEXT TURN

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
  return checkWin(arcade.board[row]);
}

// check Vertical for win
function checkVertical(col) {
  let checkArray = [];
  for (row in arcade.board) {
    checkArray.push(arcade.board[row][col]);
  }
  return checkWin(checkArray);
}

// check Diagonal for win
function checkDiagonal(row, col) {
  let checkArrayRtoL = [];
  let checkArrayLtoR = [];
  // first find starting positions to collect new arrays
  let bottomToToken = arcade.board.length - 1 - row;
  // create an array from right to left
  let startColRtoL = Number(col) + bottomToToken;
  let startRowRtoL = arcade.board.length - 1;
  if (startColRtoL > arcade.board[0].length - 1) {
    startColRtoL = arcade.board[0].length - 1;
    startRowRtoL = row + startColRtoL - Number(col);
  }
  let j = startColRtoL;
  for (let i = startRowRtoL; i >= 0; i--) {
    checkArrayRtoL.push(arcade.board[i][j]);
    j -= 1;
  }
  // create an array from left to right
  let startColLtoR = Number(col) - bottomToToken;
  let startRowLtoR = arcade.board.length - 1;
  if (startColLtoR < 0) {
    startColLtoR = 0;
    startRowLtoR = row + Number(col);
  }
  j = startColLtoR;
  for (let i = startRowLtoR; i >= 0; i--) {
    checkArrayLtoR.push(arcade.board[i][j]);
    j += 1;
  }
  // check if either arrays have a winning number of tokens in a row
  if (checkWin(checkArrayRtoL) || checkWin(checkArrayLtoR)) {
    return true;
  }
  return false;
}
