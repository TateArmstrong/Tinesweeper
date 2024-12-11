var board = document.getElementById("board");

var BOARD_WIDTH = 8;
var BOARD_HEIGHT = 8;
var MINE_CHANCE = 0.15;

var cellReferences = new Array(BOARD_HEIGHT);
var cells = new Array(BOARD_HEIGHT);

// Create cells. 
for(var i = 0; i < cellReferences.length; i++){
    cellReferences[i] = new Array(BOARD_WIDTH);
    cells[i] = new Array(BOARD_WIDTH);
    for(var j = 0; j < cellReferences[i].length; j++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        board.appendChild(cell);
        cellReferences[i][j] = cell;
        cells[i][j] = {
            revealed: false,
            hasBomb: Math.random() < MINE_CHANCE,
            htmlElement: cell
        }
        if(cells[i][j].hasBomb){
            cells[i][j].htmlElement.innerText = "💣";
        }
    }
}

// Create the grid. 
board.style.gridTemplateColumns = `repeat(${BOARD_WIDTH}, minmax(0, 1fr))`;
board.style.gridTemplateRows = `repeat(${BOARD_HEIGHT}, minmax(0, 1fr))`;
