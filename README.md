// state
let initialState;

function buildInitialState() {}

// render
function renderState() {}

// maybe a dozen or so helper functions for tiny pieces of the interface

// listeners
function onBoardClick() {
// update state, maybe with another dozen or so helper functions...

renderState(); // show the user the new state
}
const board = document.getElementById("board");
board.addEventListener("click", onBoardClick); // etc

// add to above
function tick() {
// this is an incremental change that happens to the state every time you update...

    renderState()

}

setInterval(tick, 1000 / 30) // as close to 30 frames per second as possible

// now you might have things like
document.addEventListener('keydown', function (event) {
// here you might read which key was pressed and update the state accordingly
})
