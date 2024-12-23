var board = document.getElementById("board");
var message = document.getElementById("message");

var BOARD_WIDTH = 16;
var BOARD_HEIGHT = 16;
var MINE_CHANCE = 0.15;

var cellReferences = new Array(BOARD_HEIGHT);
var cells = new Array(BOARD_HEIGHT);

board.addEventListener('contextmenu', function(e) {
  e.preventDefault();
});

function filterClick(event){ // Get cell that was clicked. 
    var row, col = null
    for(var i = 0; i < cells.length; i++){
    for(var j = 0; j < cells[i].length; j++){
        if(cells[i][j].htmlElement == this){
            row = i;
            col = j;
        }
    }
    }

    if(row == null || col == null){
        console.log("Something went WRONG!!!!");
    }

    // On regular click. 
    switch(event.button){
    case 0:
        onLeftClick(row, col); break;
    case 1:
        onMiddleClick(row, col); break;
    case 2:
        onRightClick(row, col); break;
    }
}

function onLeftClick(row, col){
    openBoard(row, col);
}

function onMiddleClick(row, col){
    if(!cells[row][col].revealed){ return; }

    var flagCount = 0;
    for(var i = -1; i < 2; i++){
    for(var j = -1; j < 2; j++){
        if(isOutOfBounds(row + i, col + j)){ continue; }
        if(cells[row + i][col + j].hasFlag){
            flagCount++;
        }
    }}

    if(cells[row][col].number != flagCount){ return; }

    for(var i = -1; i < 2; i++){
    for(var j = -1; j < 2; j++){
        if(isOutOfBounds(row + i, col + j)){ continue; }
        if(cells[row + i][col + j].revealed){ continue; }
        if(cells[row + i][col + j].hasFlag){ continue; }
        openBoard(row + i, col + j);
    }}
}

function onRightClick(row, col){
    if(cells[row][col].revealed){ return; }
    cells[row][col].hasFlag = !cells[row][col].hasFlag;
    if(cells[row][col].hasFlag){
        cells[row][col].htmlElement.innerText = '🚩'; 
    }
    else {
        cells[row][col].htmlElement.innerText = ''; 
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

function openBoard(row, col) {
    if(isOutOfBounds(row, col)){ return; };
    
    var cell = cells[row][col];

    if(cell.number == -1){ reveal(cell); };
    if(cell.revealed){ return; };
    reveal(cell);
    if(cell.number == 0){ 
        for(var i = -1; i < 2; i++){
        for(var j = -1; j < 2; j++){
            if(isOutOfBounds(row + i, col + j)){ continue; }
            openBoard(row-1, col-1);//top left
            openBoard(row-1, col);//top mid
            openBoard(row-1, col+1);//top right
            openBoard(row, col-1);//left
            openBoard(row, col+1);//right
            openBoard(row+1, col-1);//bottom left
            openBoard(row+1, col);//bottom mid
            openBoard(row+1, col+1);//bottom right
        }}
    }
    else {
        for(var i = -1; i < 2; i++){
        for(var j = -1; j < 2; j++){
            if(isOutOfBounds(row + i, col + j)){ return; }
            if(cells[row + i][col + j].number == 0){
                openBoard(row + i, col + j);
            }
        }}
    }
}

function reveal(cell){
    cell.revealed = true;
    
    if(cell.number == -1){
        gameOver();
        return;
    }
    // debugger;

    cell.htmlElement.style.backgroundColor = "#d1ffcd";

    if(cell.number == 0){
        return;
    }

    cell.htmlElement.innerText = cell.number; 

    switch(cell.number){
    case 0:
        break;
    case 1:
        cell.htmlElement.style.color = "blue"; break;
    case 2:
        cell.htmlElement.style.color = "green"; break;
    case 3:
        cell.htmlElement.style.color = "red"; break;
    case 4:
        cell.htmlElement.style.color = "purple"; break;
    case 5:
        cell.htmlElement.style.color = "darkred"; break;
    case 6:
        cell.htmlElement.style.color = "teal"; break;
    case 7:
        cell.htmlElement.style.color = "#bd4aa0"; break;
    case 8:
        cell.htmlElement.style.color = "#000000"; break;
    }
}

function gameOver() {
    revealMines();
    message.innerText = "GAME OVER";
}

function revealMines(){
    for(var i = 0; i < cells.length; i++){
    for(var j = 0; j < cells[i].length; j++){
        if(cells[i][j].hasBomb){
            cells[i][j].htmlElement.innerText = '💣';
        }
    }}
}

function isOutOfBounds(row, col){
    if(row < 0 || row >= BOARD_HEIGHT || col < 0 || col >= BOARD_WIDTH){
        return true;
    }
    return false;
}

// Create cells. 
for(var i = 0; i < cellReferences.length; i++){
    cellReferences[i] = new Array(BOARD_WIDTH);
    cells[i] = new Array(BOARD_WIDTH);
    for(var j = 0; j < cellReferences[i].length; j++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        board.appendChild(cell);
        cell.addEventListener("mouseup", filterClick);
        cellReferences[i][j] = cell;
        cells[i][j] = {
            revealed: false,
            hasBomb: Math.random() < MINE_CHANCE,
            hasFlag: false,
            number: -2,
            htmlElement: cell
        }
    }
}

// Create the grid. 
board.style.gridTemplateColumns = `repeat(${BOARD_WIDTH}, minmax(0, 1fr))`;
board.style.gridTemplateRows = `repeat(${BOARD_HEIGHT}, minmax(0, 1fr))`;

calcCellNumbers();
console.log(cells);
