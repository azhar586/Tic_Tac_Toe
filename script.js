const cells = document.querySelectorAll(".cell");
const resetButton = document.getElementById("reset");
const gameOverPopup = document.getElementById("game-over-popup");
const newGameButton = document.getElementById("new-game");
const gameContainer = document.querySelector(".game-container");
const playerChoiceDiv = document.getElementById("player-choice");
let currentPlayer = null;
let board = ["", "", "", "", "", "", "", "", ""];
let gameOver = false;

// Winning combinations
const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], 
    [0, 3, 6], [1, 4, 7], [2, 5, 8], 
    [0, 4, 8], [2, 4, 6]
];

// Allow player to choose X or O
document.getElementById("choose-x").addEventListener("click", () => {
    currentPlayer = "X";
    startGame();
});

document.getElementById("choose-o").addEventListener("click", () => {
    currentPlayer = "O";
    startGame();
});

// Start game
function startGame() {
    playerChoiceDiv.style.display = "none";
    gameContainer.style.display = "flex";
    resetGame();
}

// Handle cell click
cells.forEach(cell => {
    cell.addEventListener("click", () => {
        if (gameOver || cell.textContent !== "") return;

        let index = cell.getAttribute("data-index");
        board[index] = currentPlayer;
        cell.textContent = currentPlayer;
        
        if (checkWinner(currentPlayer)) {
            setTimeout(() => {
                alert(`${currentPlayer} Wins!`);
                showGameOverPopup();
            }, 100);
        } else if (board.every(cell => cell !== "")) {
            setTimeout(() => {
                alert("It's a Draw!");
                showGameOverPopup();
            }, 100);
        } else {
            currentPlayer = currentPlayer === "X" ? "O" : "X";
            if (currentPlayer === "O") {
                computerMove();
            }
        }
    });
});

// Computer's challenging move
function computerMove() {
    let bestMove = null;
    const emptyCells = board.map((val, index) => val === "" ? index : null).filter(val => val !== null);

    for (let move of emptyCells) {
        board[move] = "O";
        if (checkWinner("O")) {
            bestMove = move;
            break;
        }
        board[move] = "";
    }

    if (bestMove === null) {
        for (let move of emptyCells) {
            board[move] = "X";
            if (checkWinner("X")) {
                bestMove = move;
                break;
            }
            board[move] = "";
        }
    }

    if (bestMove === null) {
        bestMove = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    }

    board[bestMove] = "O";
    cells[bestMove].textContent = "O";

    if (checkWinner("O")) {
        setTimeout(() => {
            alert("Computer Wins!");
            showGameOverPopup();
        }, 100);
    } else if (board.every(cell => cell !== "")) {
        setTimeout(() => {
            alert("It's a Draw!");
            showGameOverPopup();
        }, 100);
    } else {
        currentPlayer = "X";
    }
}

// Check for a winner
function checkWinner(player) {
    return winPatterns.some(pattern => pattern.every(index => board[index] === player));
}

// Show game over popup
function showGameOverPopup() {
    gameOver = true;
    gameOverPopup.style.display = "flex";
}

// Reset Game
resetButton.addEventListener("click", () => {
    resetGame();
});

// New game button event listener
newGameButton.addEventListener("click", () => {
    resetGame();
    playerChoiceDiv.style.display = "block";
    gameContainer.style.display = "none";
});

// Reset game state and board
function resetGame() {
    board = ["", "", "", "", "", "", "", "", ""];
    gameOver = false;
    currentPlayer = "X";
    cells.forEach(cell => (cell.textContent = ""));
    gameOverPopup.style.display = "none";  // Hide the popup
}
