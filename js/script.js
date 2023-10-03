const rulesBtn = document.querySelector('.rules-link');
const closeBtn = document.querySelector('.close-btn');
const oppPlayerBtn = document.querySelector('.player-btn');
const oppCompBtn = document.querySelector('.computer-btn');
const playAgainYes = document.querySelector('.play-again-yes');
const playAgainNo = document.querySelector('.play-again-no');

const playSquares = document.querySelectorAll('.play-square');

const rulesWindow = document.querySelector('.rules-wrapper');
const selectOpponentWindow = document.querySelector('.select-opponent');
const gameBoardWindow = document.querySelector('.game-board');
const winMsgWindow = document.querySelector('.win-msg');

const Player = (name, symbol) => {
    return {name, symbol};
};

const playerOne = Player('Player 1', 'blue');
let playerTwo;

const GameBoard = (() => {
    const grid = [0,0,0,0,0,0,0,0,0];

    const addPiece = (index, currentPlayer, square) => {
        if (grid[index] !== 0) return;
        grid[index] = currentPlayer.symbol === 'blue' ? 1 : 2;
        square.classList.add(`${currentPlayer.symbol}-player`);
        GameLogicController.checkForWin(grid);
        GameLogicController.switchPlayer();
    };

    const getGridState = () => grid;

    const resetGrid= () => {
        for (let i = 0; i < grid.length; i++){
            grid[i] = 0;
        }
    };

    return {addPiece, getGridState, resetGrid};
})();

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
        let winner = false;
        const winningCombos = [[0,1,2],[3,4,5],[6,7,8],
                                [0,3,6],[1,4,7],[2,5,8],
                                [0,4,8],[2,4,6]];

        winningCombos.forEach((combo) => {
            if (combo.every(value => grid[value] === 1)) {
                winner = true;
            } else if (combo.every(value => grid[value] === 2)) {
                winner = true;
            } 
        });
        if (winner === false){
            if (grid.every(value => value !== 0)){
                console.log("It's a draw!");
            }
        }
    }

    const resetGame = () => {
        GameBoard.resetGrid();
        playSquares.forEach(square => {
            square.firstElementChild.classList.value = 'player-symbol';
        });
    };

    return {switchPlayer, getCurrentPlayer, selectOpponent, checkForWin, resetGame}
})();

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
    });
});
