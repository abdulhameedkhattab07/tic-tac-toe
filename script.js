const board = ["", "", "", "", "", "", "", "", ""]; //  Empty Array to store each board grid
let currentPlayer = "X"; // current player should be default to Player(i.e "X")
let gameActive = true; // boolean to represent that game is ongoing

const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // colums
    [0, 4, 8], [2, 4, 6] // diagonals
];

const gameBoardElement = document.querySelector("#game-board");
const messageElement = document.querySelector("#game-message");
const resetButton = document.querySelector("#reset-button");

// function to display the 3x3 grid for the game
function renderBoard() {
    gameBoardElement.innerHTML = ""; // set the innerHTML to empty

    for (let i = 0; i < board.length; i++) { // this will create 9 boxes
        let cellElement = document.createElement("div"); // create a new element
        cellElement.textContent = board[i]; // set the text content to the values in the board array
        cellElement.classList.add("cell"); // add a new class to the cellElemt
        cellElement.addEventListener("click", () => { playerMove(cellElement);});
        cellElement.setAttribute("value", i);
        gameBoardElement.appendChild(cellElement); // append child
    }
}

// function to determine player move with the cellElement div as a parameter
function playerMove(cell) {
    let index = cell.getAttribute("value"); // our index here will be the value of the cell the player clicks
    if (board[index] !== "" || !gameActive || currentPlayer !== "X") 
        return; // check if board at position index is empty, and game is ongoing, and that the current player is computer
    board[index] = currentPlayer; // update the board array at position index to hold the current player i.e, X
    updateGame(); // calls the updateGame function
    if (gameActive) { // if game is ongoing let computer play
        computerMove();
    }
}

// function to determine computer move
function computerMove() {
    // check if computer can win
    let winningMove = findBestMove("O"); // find the best move for the computer
    if (winningMove) {
        board[winningMove] = "O";
        updateGame();
        return;
    }

    // check if the player is about to win or block
    let blockingMove = findBestMove("X");
    if (blockingMove) {
        board[blockingMove] = "O";
        updateGame();
        return;
    }

    let availableMoves = []; // create a temporary array for storing the empty spaces in the board element
    for (let i = 0; i < board.length; i++) {
        if (board[i] === "") { // if board at at postion i is empty, push it into the availableMoves array
            availableMoves.push(i);
        }
    }
    let moveIndex = Math.floor(Math.random() * availableMoves.length) // generate a random number and round it up to the nearest whole number
    let randomIndex = availableMoves[(moveIndex )]; // generate a random index for the computer to move to
    board[randomIndex] = "O"; // update the board array at position index to hold the computer choice i.e, O
    updateGame();// calls the updateGame function
}

function findBestMove(player) {
    // check each array in the winPatterns array
    for (let i = 0; i < winPatterns.length; i++) {
        let pattern = winPatterns[i]; // get each pattern in the Whole Array
        let count = 0; // to count the number of times a particular player occur
        let emptyIndex = 0;

        // Check each cell in the pattern
        for (let j = 0; j < pattern.length; j++) {
            let index = pattern[j];
            if (board[index] === player) 
                count++;
            else if (board[index] === "") 
                emptyIndex = index;
        }

        // If there are two of the same player's marks and one empty spot, return that index
        if (count === 2 && emptyIndex !== 0) 
            return emptyIndex;
    }
    return false;
}

function checkWin() {
    for (let i = 0; i < winPatterns.length; i++) {
        let pattern = winPatterns[i]; // pattern will also be an array 
        // check if all the three element in the pattern array is X or O
        if (board[pattern[0]] === currentPlayer && // 
            board[pattern[1]] === currentPlayer &&
            board[pattern[2]] === currentPlayer) {
            return true;
        }
    }
    return false;
}

function updateGame() {
    renderBoard(); // render the game board

    // if there is a winner
    if (checkWin()) {
        gameActive = false; // let the game end
        if (currentPlayer === "X") {
            currentPlayer = "Player"
        } else {
            currentPlayer = "Computer"
        }
        messageElement.textContent = currentPlayer + " wins!"; // display the winning message
    } else { // if there is no winner, we will check if there's a draw
        let isDraw = true; // boolean to represent that there's draw
        for (let i = 0; i < board.length; i++) {
            if (board[i] === "") { // if any space in the board array is still empty
                isDraw = false; // There is no draw yet
                break; // break out
            }
        }
        if (isDraw) { //if there's a draw
            gameActive = false; // let the game end
            messageElement.textContent = "It's a draw!"; // display the draw message
        } else { // if there's still no draw, that means the game should continue 
            currentPlayer = currentPlayer === "X" ? "O" : "X"; // set currentPlayer to either X or )
            messageElement.textContent = (currentPlayer === "X" ? "Player" : "Computer") + "'s turn"; // display player or computer turns
        }
    }
}

resetButton.addEventListener("click", () => { // once the reset button is clicked, start the game all over
    for (let i = 0; i < board.length; i++) {
        board[i] = "";
    }
    gameActive = true;
    currentPlayer = "X";
    messageElement.textContent = "Player's turn";
    renderBoard();
});

document.addEventListener("DOMContentLoaded", renderBoard); // once all the DOM has loaded display the 3x3 grids