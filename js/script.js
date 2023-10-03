const rulesBtn = document.querySelector('.rules-link');
const closeBtn = document.querySelector('.close-btn');
const oppPlayerBtn = document.querySelector('.player-btn');
const oppCompBtn = document.querySelector('.computer-btn');

const rulesWindow = document.querySelector('.rules-wrapper');

const Player = (name, symbol) => {
    return {name, symbol};
};

const GameBoard = (() => {
    const grid = [0,0,0,0,0,0,0,0,0];
    const addPiece = (index, currentPlayer) => {
        if (grid[index] !== 0) return;
        grid[index] = currentPlayer.symbol === 'blue' ? 1 : 2;
    };
    const getGridState = () => grid;
})();


rulesBtn.addEventListener('click', () => {
    rulesWindow.classList.toggle('hide');
})

closeBtn.addEventListener('click', () => {
    rulesWindow.classList.toggle('hide');
});

oppPlayerBtn.addEventListener('click', () => {
    opponent
});