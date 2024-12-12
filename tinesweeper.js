var board = document.getElementById("board");

var BOARD_WIDTH = 16;
var BOARD_HEIGHT = 16;
var MINE_CHANCE = 0.15;

var cellReferences = new Array(BOARD_HEIGHT);
var cells = new Array(BOARD_HEIGHT);

function onCellClick(event){
    // There's got to be an easier way of getting the element reference. 
    for(var i = 0; i < cells.length; i++){
    for(var j = 0; j < cells[i].length; j++){
        if(cells[i][j].htmlElement == this){

            this.innerText = cells[i][j].number;
        }
    }
    }
}

function calcCellNumbers() {
    for(var i = 0; i < cells.length; i++){
    for(var j = 0; j < cells[i].length; j++){
        if(cells[i][j].hasBomb){
            cells[i][j].number = -1;
        }
        else {
            cells[i][j].number = getNumber(i, j);
        }
    }
    }
}

function getNumber(row, col){
    var count = 0;
    for(var i = -1; i < 2; i++){
    for(var j = -1; j < 2; j++){
        // Skip if current cell. 
        if(i == 0 && j == 0){
            continue;
        }
        if((row + i) < 0 || (row + i) >= BOARD_HEIGHT || (col + j) < 0 || (col + j) >= BOARD_WIDTH){
            continue;
        }
        if(cells[row + i][col + j].hasBomb){
            count++;
        }
    }
    }
    return count;
}

function reveal() {

}

// Create cells. 
for(var i = 0; i < cellReferences.length; i++){
    cellReferences[i] = new Array(BOARD_WIDTH);
    cells[i] = new Array(BOARD_WIDTH);
    for(var j = 0; j < cellReferences[i].length; j++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        board.appendChild(cell);
        cell.addEventListener("click", onCellClick);
        cellReferences[i][j] = cell;
        cells[i][j] = {
            revealed: false,
            hasBomb: Math.random() < MINE_CHANCE,
            number: -2,
            htmlElement: cell
        }
    }
}

// Create the grid. 
board.style.gridTemplateColumns = `repeat(${BOARD_WIDTH}, minmax(0, 1fr))`;
board.style.gridTemplateRows = `repeat(${BOARD_HEIGHT}, minmax(0, 1fr))`;

calcCellNumbers();
