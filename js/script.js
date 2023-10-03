const rulesBtn = document.querySelector('.rules-link');
const closeBtn = document.querySelector('.close-btn');
const oppPlayerBtn = document.querySelector('.player-btn');
const oppCompBtn = document.querySelector('.computer-btn');
const playAgainYesBtn = document.querySelector('.play-again-yes');
const playAgainNoBtn = document.querySelector('.play-again-no');

const playSquares = document.querySelectorAll('.play-square');
const winText = document.querySelector('.win-text');
const winSymbol = document.querySelector('.win-symbol');

const rulesWindow = document.querySelector('.rules-wrapper');
const selectOpponentWindow = document.querySelector('.select-opponent');
const gameBoardWindow = document.querySelector('.game-board');
const winMsgWindow = document.querySelector('.win-msg');

// Factory function for creating players
const Player = (name, symbol) => ({name, symbol});

const playerOne = Player('Player 1', 'blue');
let playerTwo;

// Game board module to handle game board logic
const GameBoard = (() => {
    const grid = [0,0,0,0,0,0,0,0,0];

    const addPiece = (index, currentPlayer, square) => {
        if (grid[index] !== 0) return;

        grid[index] = currentPlayer.symbol === 'blue' ? 1 : 2;
        square.classList.add(`${currentPlayer.symbol}-player`);

        const gameStateCheck = GameLogicController.checkForWin(grid);

        if (gameStateCheck.isWinner){
            GameLogicController.declareWinner(gameStateCheck.player)
        } else if (gameStateCheck.isDraw) {
            GameLogicController.declareDraw();
        } else {
            GameLogicController.switchPlayer();
        }
    };

    const getGridState = () => grid;

    const resetGrid= () => {
        grid.fill(0);
    };

    return {addPiece, getGridState, resetGrid};
})();

// Game controller
const GameLogicController = (() => {
    let currentPlayer = playerOne;

    const switchPlayer = () => {
        currentPlayer = currentPlayer === playerOne ? playerTwo : playerOne;
    };

    const getCurrentPlayer = () => currentPlayer;

    const selectOpponent = (name) => {
        playerTwo = Player(name, 'red');
        selectOpponentWindow.classList.toggle('hide');
        gameBoardWindow.classList.toggle('hide');
    };

    const checkForWin = (grid) => {
        let isWinner = false;
        let isDraw = false;
        const player = getCurrentPlayer();
        const winningCombos = [
            [0,1,2],
            [3,4,5],
            [6,7,8],
            [0,3,6],
            [1,4,7],
            [2,5,8],
            [0,4,8],
            [2,4,6],
        ];

        // Check if every grid value at the specified indices in the combo
        // is equal to 1 or 2, indicating a winning combination.
        winningCombos.forEach((combo) => {
            if (
                combo.every(value => grid[value] === 1) ||
                combo.every(value => grid[value] === 2)) {
                    isWinner = true;
            }
        });

        // if no winner was found, check if all the values in grid are not zero
        // and declare a draw if they are not
        if (!isWinner && grid.every(value => value !== 0)){
            isDraw = true;
        }
        return {isWinner, isDraw, player};
    };

    const declareWinner = (winningPlayer) => {
        winMsgWindow.classList.toggle('hide');
        winText.textContent = `${winningPlayer.name} Wins!`;
        winText.style.color = winningPlayer.symbol === 'blue' ? 'rgb(121, 245, 228)' : 'red';
        winSymbol.classList.add(`${winningPlayer.symbol}`);
    };

    const declareDraw = () => {
        winMsgWindow.classList.toggle('hide');
        winText.textContent = "It's A Draw!"
        winSymbol.style.display = 'none';
    };

    const resetGame = (playAgain) => {
        GameBoard.resetGrid();

        playSquares.forEach(square => {
            square.firstElementChild.classList.value = 'player-symbol';
        });

        winSymbol.style.display = 'block';
        winSymbol.classList.value = 'win-symbol ctr-img'
        winMsgWindow.classList.toggle('hide');
        currentPlayer = playerOne;

        if (!playAgain) {
            gameBoardWindow.classList.toggle('hide');
            selectOpponentWindow.classList.toggle('hide');
            playerTwo = null;
        }
    };

    const AIMove = () => {
        const possibleMoves = GameBoard.getGridState()
        .map((val, ind) => val === 0 ? ind : -1)
        .filter(ind => ind !== -1);
        if (possibleMoves.length > 0){
            const randomIndex = Math.floor(Math.random() * possibleMoves.length)
            const moveIndex = possibleMoves[randomIndex];
            const boardPosition = document.querySelector(`[data-index="${moveIndex}"]`).firstElementChild;
            GameBoard.addPiece(moveIndex, GameLogicController.getCurrentPlayer(), boardPosition);
        }
    }
    return {switchPlayer, getCurrentPlayer, selectOpponent, checkForWin, resetGame, AIMove, declareDraw, declareWinner}
})();


playAgainYesBtn.addEventListener('click', () => {
    GameLogicController.resetGame(true);
});

playAgainNoBtn.addEventListener('click', () => {
    GameLogicController.resetGame(false)
});

rulesBtn.addEventListener('click', () => {
    rulesWindow.classList.toggle('hide');
})

closeBtn.addEventListener('click', () => {
    rulesWindow.classList.toggle('hide');
});

oppPlayerBtn.addEventListener('click', () => {
    GameLogicController.selectOpponent('Player 2');

});

oppCompBtn.addEventListener('click', () => {
    GameLogicController.selectOpponent('Computer');
});

playSquares.forEach(square => {
    square.addEventListener('click', () => {
        const index = parseInt(square.getAttribute('data-index'));
        const boardPosition = square.firstElementChild;
        GameBoard.addPiece(index, GameLogicController.getCurrentPlayer(), boardPosition);

        if (GameLogicController.getCurrentPlayer().name === 'Computer'){
            GameLogicController.AIMove();
        }
    });
});

