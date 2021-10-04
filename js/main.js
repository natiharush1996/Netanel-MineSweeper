// 'use strict';
const MINE = '*';
var gBoard;
var gNeighborsCount;

var gLevel = {
    size: 4,
    mines: 2
};
var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
};



function createMat(ROWS, COLS) {
    var mat = []
    for (var i = 0; i < ROWS; i++) {
        var row = []
        for (var j = 0; j < COLS; j++) {
            row.push('')
        }
        mat.push(row)
    }
    return mat
}


function initGame() {
    strHtml = '';
    strHtml += 'Mines: ' + gLevel.mines;
    var elh1 = document.querySelector('h1 span');
    elh1.innerHTML = strHtml;
    gBoard = buildBoard();
    renderBoard(gBoard);
}


function buildBoard() {
    var board = createMat(gLevel.size, gLevel.size);
    var cellsArr = []
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            var cell = { minesAroundCount: gNeighborsCount, isShown: true, isMine: false, isMarked: true };
            board[i][j] = cell;
            cellsArr.push({ i: i, j: j });
        }
    }
    //place mines:
    for (var i = 0; i < gLevel.mines; i++) {
        var randIdx = getRandomIntInclusive(0, cellsArr.length - 1);
        var randomCell = cellsArr[randIdx];
        board[randomCell.i][randomCell.j].isMine = true;
        board[randomCell.i][randomCell.j].isShown = false;
    }
    console.table(board);
    return board;
}


function renderBoard(board) {
    var strHtml = '';
    for (var i = 0; i < board.length; i++) {
        strHtml += '<tr>'
        for (var j = 0; j < board[0].length; j++) {
            var currCell = board[i][j];
            var className = '';
            if (currCell.isMine) {
                className += ' mine ';
            }
            if (currCell.isShown) {
                className += ' shown ';
            }
            if (currCell.isMarked) {
                className += ' mark ';
            }
            strHtml += `<td data-i="${i}" data-j="${j}" class="cell ${className}" onClick="cellClicked(this, ${i}, ${j})">`
            if (currCell.isMine) {
                strHtml += MINE
            }
            strHtml += '</td>'
        }
        strHtml += '</tr>';
    }
    var elBoard = document.querySelector('.board');
    elBoard.innerHTML = strHtml;
}


function cellClicked(elCell, i, j) {
    var gNeighborsCount = countNeighbors(i, j, gBoard);
    // console.log(gNeighborsCount)
    var cell = gBoard[i][j];
    console.log('cell ' + i + ',' + j);
    cell.minesAroundCount = gNeighborsCount
    console.log(cell.minesAroundCount)
    if (!cell.isMine) {
        renderCell(i, j, gNeighborsCount);
    }
    // if (elCell.classList.contains('mine')) {
    //     renderCell(i, j, '')
    // }
}



function setMinesNegsCount(board) {

}





function renderCell(i, j, value) {
    var elCell = document.querySelector(`[data-i="${i}"][data-j="${j}"]`);
    // console.log('elCell', elCell);
    elCell.innerText = value;
    console.log(elCell.classList)
    // elCell.classList.remove('occupied');
    
}




function countNeighbors(cellI, cellJ, mat) {
    gNeighborsCount = 0;
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= mat.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= mat[i].length) continue;
            if (i === cellI && j === cellJ) continue;
            // var cell = mat[i][j];
            if (mat[i][j].isMine) {
                gNeighborsCount++;
            }
        }
    }
    return gNeighborsCount;
}






























function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
}
