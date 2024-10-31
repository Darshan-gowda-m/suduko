var numSelected = null;
var errors = 0;
var board = generateSudokuBoard();
var solution = getSolution(board); 

window.onload = function () {
    setGame();
    selectRandomNumber();
    document.getElementById("show-solution").addEventListener("click", showSolution); 
};

function generateSudokuBoard() {
    let board = Array.from({ length: 9 }, () => Array(9).fill(0));
    fillBoard(board);
    return board; 
}

function fillBoard(board) {
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            if (board[r][c] === 0) {
                let numbers = shuffle([...Array(9).keys()].map(n => n + 1));
                for (let num of numbers) {
                    if (isValid(board, r, c, num)) {
                        board[r][c] = num;
                        if (fillBoard(board)) return true;
                        board[r][c] = 0;
                    }
                }
                return false;
            }
        }
    }
    return true;
}

function removeNumbers(board) {
    let count = 40; 
    while (count > 0) {
        let r = Math.floor(Math.random() * 9);
        let c = Math.floor(Math.random() * 9);
        if (board[r][c] !== 0) {
            board[r][c] = 0;
            count--;
        }
    }
}

function isValid(board, row, col, num) {
    for (let x = 0; x < 9; x++) {
        if (board[row][x] === num || board[x][col] === num ||
            board[Math.floor(row / 3) * 3 + Math.floor(x / 3)][Math.floor(col / 3) * 3 + x % 3] === num) {
            return false;
        }
    }
    return true;
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function getSolution(board) {
    
    return board.map(row => row.slice());
}

function setGame() {
    removeNumbers(board); 
    for (let i = 1; i <= 9; i++) {
        let number = document.createElement("div");
        number.id = i;
        number.innerText = i;
        number.addEventListener("click", selectNumber);
        number.classList.add("number");
        document.getElementById("digits").appendChild(number);
    }

    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            let tile = document.createElement("div");
            tile.id = r.toString() + "-" + c.toString();
            if (board[r][c] !== 0) {
                tile.innerText = board[r][c];
                tile.classList.add("tile-start");
            }
            if (r == 2 || r == 5) {
                tile.classList.add("horizontal-line");
            }
            if (c == 2 || c == 5) {
                tile.classList.add("vertical-line");
            }
            tile.addEventListener("click", selectTile);
            tile.classList.add("tile");
            document.getElementById("board").append(tile);
        }
    }
}

function showSolution() {
    const tiles = document.querySelectorAll(".tile");
    tiles.forEach(tile => {
        const coords = tile.id.split("-");
        const r = parseInt(coords[0]);
        const c = parseInt(coords[1]);
        
        if (tile.innerText === "") {
            tile.innerText = solution[r][c]; 
            tile.classList.add("tile-solution");
        }
    });
}

function selectRandomNumber() {
    const randomNum = Math.floor(Math.random() * 9) + 1;
    selectNumberById(randomNum);
}

function selectNumberById(num) {
    if (numSelected != null) {
        numSelected.classList.remove("number-selected");
    }
    numSelected = document.getElementById(num);
    numSelected.classList.add("number-selected");
}

function selectNumber() {
    selectNumberById(this.id);
}

function selectTile() {
    if (numSelected) {
        if (this.innerText !== "") return;

        let coords = this.id.split("-");
        let r = parseInt(coords[0]);
        let c = parseInt(coords[1]);

       
        if (solution[r][c] === parseInt(numSelected.id)) {
            this.innerText = numSelected.id;
        } else {
            errors += 1;
            document.getElementById("errors").innerText = errors;
        }
    }
}
