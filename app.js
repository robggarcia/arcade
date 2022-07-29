// begin by creating an object to represent the Arcade
const arcade = {
  player1: {
    name: "Computer",
    color: "red",
    score: 0,
    turn: true,
    symbol: "X",
  },
  player2: {
    name: "Computer",
    color: "yellow",
    score: 0,
    symbol: "O",
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
    arcade.player2.score = 0;
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

////////////////////////////////////
/////////// CONNECT 4 //////////////
///////////////////////////////////

// set up game div, then display name of game and objective
const c4Board = document.createElement("div");
c4Board.setAttribute("id", "connect-board");

const c4Title = document.createElement("h2");
c4Title.textContent = "Connect 4";

const c4rules = document.createElement("p");
c4rules.textContent =
  "Be the first to form a horizontal, vertical, or diagonal line of four of one's own tokens.";

// set global variables to switch between players
let name = "";
let color = "";
let play = false;

// the board is traditionally 7 columns, by 6 rows
const gameDiv = document.querySelector("#game");
function newC4Board() {
  gameDiv.textContent = "";
  arcade.board = [];
  c4Board.textContent = "";
  message.classList.add("hide");
  scoreDiv[0].classList.remove(`${arcade.player1.color}`);
  scoreDiv[1].classList.remove(`${arcade.player2.color}`);

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
  gameDiv.appendChild(c4Title);
  gameDiv.appendChild(c4rules);
  gameDiv.appendChild(c4Board);

  // randomly choose a player to start
  if (Math.floor(Math.random() * 10) % 2 === 0) {
    scoreDiv[0].classList.add(`${arcade.player1.color}`);
    play = true;
    if (arcade.player1.name === "Computer") {
      setTimeout(compTurn, 1000);
      return;
    }
  } else {
    arcade.player1.turn = false;
    scoreDiv[1].classList.add(`${arcade.player2.color}`);
    play = true;
    if (arcade.player2.name === "Computer") {
      setTimeout(compTurn, 1000);
      return;
    }
  }
}
const c4Button = document.querySelector("#c4-button");
c4Button.addEventListener("click", newC4Board);

// when a player clicks on a column, their token color is placed on the bottom row
function addToken(e) {
  if (play) {
    message.classList.add("hide");
    if (arcade.player1.turn) {
      color = arcade.player1.color;
      name = arcade.player1.name;
    } else {
      color = arcade.player2.color;
      name = arcade.player2.name;
    }
    // find the location to add token
    let column = e.target.dataset.column;
    let row = e.target.dataset.row;

    row = lowestRow(row, column);

    const token = document.querySelectorAll(`[data-column="${column}"]`)[row];
    arcade.board[row][column] = color;
    token.classList.add(`${color}`);
    if (
      checkHorizontal(row) ||
      checkVertical(column) ||
      checkDiagonal(row, column)
    ) {
      message.textContent = `${name} wins!!`;
      message.classList.remove("hide");
      play = false;
      updateScore(25);
      return;
    }
    if (arcade.player1.turn) {
      scoreDiv[0].classList.remove(`${arcade.player1.color}`);
      scoreDiv[1].classList.add(`${arcade.player2.color}`);
      arcade.player1.turn = !arcade.player1.turn;
      if (arcade.player2.name === "Computer") {
        setTimeout(compTurn, 1000, arcade.player2.color);
      }
    } else {
      scoreDiv[0].classList.add(`${arcade.player1.color}`);
      scoreDiv[1].classList.remove(`${arcade.player2.color}`);
      arcade.player1.turn = !arcade.player1.turn;
      if (arcade.player1.name === "Computer") {
        setTimeout(compTurn, 1000, arcade.player1.color);
      }
    }
    checkDraw();
  }
}
c4Board.addEventListener("click", addToken);

// define a function to check for 4 same tokens in a row, given a single array to check
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

// this function selects the lowest available row for a given column
// if a row is not available, a message is sent explaining to choose another column
function lowestRow(row, col) {
  for (let i = arcade.board.length - 1; i >= 0; i--) {
    if (arcade.board[i][col] === "") {
      row = i;
      return row;
    }
  }
  message.textContent = "Choose an empty column";
  message.classList.remove("hide");
  return false;
}

// this function checks the current status of the board
// if all spots on the board are full, gameplay is set to false and message is displayed
function checkDraw() {
  for (col of arcade.board[0]) {
    if (col === "") {
      console.log("there is still an empty space");
      return false;
    }
  }

  message.textContent = "No More Moves Available :(";
  message.classList.remove("hide");
  scoreDiv[0].classList.remove(`${arcade.player1.color}`);
  scoreDiv[1].classList.remove(`${arcade.player2.color}`);
  play = false;
  return true;
}

// this function accepts a point value and adds it to the current users score and updates the HTML
function updateScore(score) {
  if (arcade.player1.turn) {
    arcade.player1.score += score;
    p1Score.textContent = `Score: ${arcade.player1.score}`;
    scoreDiv[0].classList.remove(`${arcade.player1.color}`);
  } else {
    arcade.player2.score += score;
    p2Score.textContent = `Score: ${arcade.player2.score}`;
    scoreDiv[1].classList.remove(`${arcade.player2.color}`);
  }
}

// if either player is the computer create a function play their turn
// check each column to see if a winning token will be placed
// if a win, place token in that location
// if not, randomly choose a column
function compTurn(color) {
  if (checkDraw()) {
    return;
  }
  let col = 0;
  let row = 0;
  let event = {
    target: {
      dataset: {
        column: col,
        row: row,
      },
    },
  };
  for (col in arcade.board[0]) {
    console.log("lowest row: ", lowestRow(row, col));
    if (lowestRow(row, col)) {
      row = lowestRow(row, col);
      arcade.board[row][col] = color;
      if (
        checkHorizontal(row) ||
        checkVertical(col) ||
        checkDiagonal(row, col)
      ) {
        event.target.dataset.column = col;
        event.target.dataset.row = row;
        arcade.board[row][col] = "";
        addToken(event);
        return;
      }
      arcade.board[row][col] = "";
    } else {
      continue;
    }
  }
  col = Math.floor(Math.random() * arcade.board[0].length);
  if (arcade.board[0][col] === "") {
    event.target.dataset.column = col;
    addToken(event);
    return;
  } else {
    for (col in arcade.board[0]) {
      if (arcade.board[0][col] === "") {
        event.target.dataset.column = col;
        addToken(event);
        return;
      }
    }
  }
}

///////////////////////////////////////
/////////// TIC TAC TOE //////////////
/////////////////////////////////////

// set up game div, then display name of game and objective
const ticBoard = document.createElement("div");
ticBoard.setAttribute("id", "tic-board");

const ticTitle = document.createElement("h2");
ticTitle.textContent = "Tic-Tac-Toe";

const ticRules = document.createElement("p");
ticRules.textContent =
  "The first player to get 3 marks in a row is the winner.";

// the board is traditionally 3 columns, by 3 rows
function newTicBoard() {
  gameDiv.textContent = "";
  arcade.board = [];
  ticBoard.textContent = "";
  message.classList.add("hide");
  scoreDiv[0].classList.remove(`${arcade.player1.color}`);
  scoreDiv[1].classList.remove(`${arcade.player2.color}`);

  for (let i = 0; i < 3; i++) {
    arcade.board[i] = [];
    for (let j = 0; j < 3; j++) {
      arcade.board[i].push("");
      let ticTocDiv = document.createElement("div");
      ticTocDiv.setAttribute("class", "tic-square");
      ticBoard.appendChild(ticTocDiv);
      ticTocDiv.dataset.column = j;
      ticTocDiv.dataset.row = i;
    }
  }
  gameDiv.appendChild(ticTitle);
  gameDiv.appendChild(ticRules);
  gameDiv.appendChild(ticBoard);

  // randomly choose a player to start
  if (Math.floor(Math.random() * 10) % 2 === 0) {
    scoreDiv[0].classList.add(`${arcade.player1.color}`);
    play = true;
    if (arcade.player1.name === "Computer") {
      setTimeout(compTic, 1000, arcade.player1.symbol);
      return;
    }
  } else {
    arcade.player1.turn = false;
    scoreDiv[1].classList.add(`${arcade.player2.color}`);
    play = true;
    if (arcade.player2.name === "Computer") {
      setTimeout(compTic, 1000, arcade.player2.symbol);
      return;
    }
  }
}
const ticButton = document.querySelector("#tic-button");
ticButton.addEventListener("click", newTicBoard);

// set global variables to switch between players
let symbol = "";

// when a player selects a location on the board, their symbol is placed
function ticPlay(e) {
  if (play) {
    message.classList.add("hide");
    if (arcade.player1.turn) {
      symbol = arcade.player1.symbol;
      name = arcade.player1.name;
    } else {
      symbol = arcade.player2.symbol;
      name = arcade.player2.name;
    }
    // find the location to add token
    let column = e.target.dataset.column;
    let row = e.target.dataset.row;

    const mark = document.querySelectorAll(`[data-column="${column}"]`)[row];
    console.log(mark);
    arcade.board[row][column] = symbol;
    mark.textContent = symbol;

    if (checkTicWin(row, column)) {
      message.textContent = `${name} wins!!`;
      message.classList.remove("hide");
      play = false;
      updateScore(5);
      return;
    }
    if (arcade.player1.turn) {
      scoreDiv[0].classList.remove(`${arcade.player1.color}`);
      scoreDiv[1].classList.add(`${arcade.player2.color}`);
      arcade.player1.turn = !arcade.player1.turn;
      if (arcade.player2.name === "Computer") {
        setTimeout(compTic, 1000, symbol);
      }
    } else {
      scoreDiv[0].classList.add(`${arcade.player1.color}`);
      scoreDiv[1].classList.remove(`${arcade.player2.color}`);
      arcade.player1.turn = !arcade.player1.turn;
      if (arcade.player1.name === "Computer") {
        setTimeout(compTic, 1000, symbol);
      }
    }
    checkDraw();
  }
}
ticBoard.addEventListener("click", ticPlay);

function checkTicWin(row, col) {
  let arr = arcade.board;
  // check horizontal
  if (arr[row][0] === arr[row][1] && arr[row][1] === arr[row][2]) {
    console.log("win horizontal");
    return true;
  }
  // reset and check vertical
  if (arr[0][col] === arr[1][col] && arr[1][col] === arr[2][col]) {
    console.log("win vertical");
    return true;
  }
  //check diagonal
  if (arr[1][1]) {
    if (arr[0][0] === arr[1][1] && arr[1][1] === arr[2][2]) {
      return true;
    }
    if (arr[2][0] === arr[1][1] && arr[1][1] === arr[0][2]) {
      return true;
    }
  }
  return false;
}

// for the computer, check through open spots to see if any would win the game
// if not, chose a random open spot
function compTic(symbol) {
  if (checkDraw()) {
    return;
  }
  let event = {
    target: {
      dataset: {
        column: randomTic(),
        row: randomTic(),
      },
    },
  };
  for (rowIdx in arcade.board) {
    for (colIdx in arcade.board[rowIdx]) {
      if (arcade.board[rowIdx][colIdx] === "") {
        console.log("an empty field was found");
        arcade.board[rowIdx][colIdx] = symbol;
        if (checkTicWin(rowIdx, colIdx)) {
          arcade.board[rowIdx][colIdx] = "";
          event.target.dataset.column = colIdx;
          event.target.dataset.row = rowIdx;
          ticPlay(event);
          return;
        }
        arcade.board[rowIdx][colIdx] = "";
      }
    }
  }
  if (
    arcade.board[event.target.dataset.row][event.target.dataset.column] === ""
  ) {
    ticPlay(event);
    return;
  }
  compTic(symbol);
}

function randomTic() {
  return Math.floor(Math.random() * arcade.board[0].length);
}

///////////////////////////////////////
////////////// SNAKE /////////////////
/////////////////////////////////////

// set up game div, then display name of game and objective
const snakeBoard = document.createElement("div");
snakeBoard.setAttribute("id", "snake-board");

const snakeTitle = document.createElement("h2");
snakeTitle.textContent = "Snake";

const snakeRules = document.createElement("p");
snakeRules.textContent =
  "Use the arrows on your keyboard to control the snake. \nEat apples, but don't run into yourself!";

let snake = {};
let snakeState = {};

// the board is traditionally 3 columns, by 3 rows
function newSnakeBoard() {
  clearInterval(interval);
  gameDiv.textContent = "";
  arcade.board = [];
  snakeBoard.textContent = "";
  message.classList.add("hide");
  scoreDiv[0].classList.remove(`${arcade.player1.color}`);
  scoreDiv[1].classList.remove(`${arcade.player2.color}`);
  let count = 0;
  for (let i = 0; i < 20; i++) {
    arcade.board[i] = [];
    for (let j = 0; j < 20; j++) {
      arcade.board[i].push("");
      let snakeDiv = document.createElement("div");
      snakeDiv.setAttribute("class", "snake-square");
      snakeBoard.appendChild(snakeDiv);
      snakeDiv.dataset.column = j;
      snakeDiv.dataset.row = i;
      count += 1;
    }
  }
  gameDiv.appendChild(snakeTitle);
  gameDiv.appendChild(snakeRules);
  gameDiv.appendChild(snakeBoard);

  // define the snake object with the starting condition
  snake = {
    body: [
      [10, 5],
      [10, 6],
      [10, 7],
      [10, 8],
    ],
    nextDirection: [1, 0],
  };

  snakeState = {
    apple: [11, 8],
    snake: snake,
    time: 5,
  };

  // randomly choose a player to start
  if (Math.floor(Math.random() * 10) % 2 === 0) {
    scoreDiv[0].classList.add(`${arcade.player1.color}`);
  } else {
    arcade.player1.turn = false;
    scoreDiv[1].classList.add(`${arcade.player2.color}`);
    if (arcade.player2.name === "Computer") {
      scoreDiv[0].classList.add(`${arcade.player1.color}`);
      scoreDiv[1].classList.remove(`${arcade.player2.color}`);
      arcade.player1.turn = true;
    }
  }

  message.textContent = "Press S to start.";
  message.classList.remove("hide");
  renderSnakeState();
}
const snakeButton = document.querySelector("#snake-button");
snakeButton.addEventListener("click", newSnakeBoard);

///////////////////////////////

function tick() {
  if (play) {
    let nextSnake = [];
    let prevPart = snake.body[0];
    let count = 0;
    for (bodyPart of snake.body) {
      const square = document.querySelectorAll(
        `[data-column="${bodyPart[0]}"]`
      )[bodyPart[1]];
      if (count === 0) {
        nextSnake.push([
          bodyPart[0] + snake.nextDirection[0],
          bodyPart[1] + snake.nextDirection[1],
        ]);
        // check to see if next move eats an apple
        if (
          nextSnake[0][0] === snakeState.apple[0] &&
          nextSnake[0][1] === snakeState.apple[1]
        ) {
          console.log("eating an apple!");
          eatApple();
          snake.body.unshift([nextSnake[0][0], nextSnake[0][1]]);
          return;
        }
        // check to see if next move hits a wall or self
        if (
          hitWall([nextSnake[0][0], nextSnake[0][1]]) ||
          hitSelf([nextSnake[0][0], nextSnake[0][1]])
        ) {
          if (arcade.player1.turn && arcade.player2.name != "Computer") {
            return;
          } else if (arcade.player1.turn) {
            scoreDiv[0].classList.remove(`${arcade.player1.color}`);
            scoreDiv[1].classList.add(`${arcade.player2.color}`);
            arcade.player1.turn = !arcade.player1.turn;
          } else {
            scoreDiv[0].classList.add(`${arcade.player1.color}`);
            scoreDiv[1].classList.remove(`${arcade.player2.color}`);
            arcade.player1.turn = !arcade.player1.turn;
          }
        }
      } else {
        nextSnake.push(prevPart);
        prevPart = bodyPart;
      }
      count += 1;
      square.classList.remove("snake-body");
    }
    snake.body = nextSnake;
    renderSnakeState();
  }
}
let interval;
// add event listeners for keyboard hits and define what specific buttons do
document.addEventListener("keydown", (e) => {
  e.code === "ArrowLeft"
    ? (snake.nextDirection = [-1, 0])
    : e.code === "ArrowUp"
    ? (snake.nextDirection = [0, -1])
    : e.code === "ArrowRight"
    ? (snake.nextDirection = [1, 0])
    : e.code === "ArrowDown"
    ? (snake.nextDirection = [0, 1])
    : console.log("choose another");

  if (e.code === "KeyS") {
    newSnakeBoard();
    play = true;
    interval = setInterval(tick, 1000 / snakeState.time); // as close to 30 frames per second as possible
  }
});

function renderSnakeState() {
  const apple = document.querySelectorAll(
    `[data-column="${snakeState.apple[0]}"]`
  )[snakeState.apple[1]];
  apple.classList.add("apple");
  for (bodyPart of snake.body) {
    const square = document.querySelectorAll(`[data-column="${bodyPart[0]}"]`)[
      bodyPart[1]
    ];
    square.classList.add("snake-body");
  }
}

function eatApple() {
  const appleToSnake = document.querySelectorAll(
    `[data-column="${snakeState.apple[0]}"]`
  )[snakeState.apple[1]];
  appleToSnake.classList.remove("apple");
  appleToSnake.classList.add("snake-body");
  // increase time difficulty by 4
  snakeState.time += 4;
  // increase playerScore
  updateScore(1);
  // find a random location for a new apple
  newApple();
}

// randomly select an open location to place a new apple
function newApple() {
  let randRow = randomTic();
  let randCol = randomTic();
  const newApple = document.querySelectorAll(`[data-column="${randRow}"]`)[
    randCol
  ];
  if (
    newApple.classList.contains("apple") ||
    newApple.classList.contains("snake-body")
  ) {
    newApple();
  }
  snakeState.apple[0] = randRow;
  snakeState.apple[1] = randCol;
  newApple.classList.add("apple");
}

// if a wall is hit display a message, set play to false, and return false
function hitWall(arr) {
  if (arr[0] < 0 || arr[0] > 19 || arr[1] < 0 || arr[1] > 19) {
    message.textContent = "Hit Wall! Game Over";
    message.classList.remove("hide");
    play = false;
    return true;
  }
}

// if self is hit display a message, set play to false, and return false
function hitSelf(head) {
  if (
    snake.body.some((part) => {
      if (part[0] === head[0] && part[1] === head[1]) return true;
    })
  ) {
    message.textContent = "Hit Self! Game Over";
    message.classList.remove("hide");
    play = false;
    return true;
  }
}
