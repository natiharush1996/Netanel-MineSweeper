// 'use strict';
const MINE = '💣';
const FLAG = '🚩';
const SMILE = '😏';
const SAD = '😔';
const WIN = '🤑';
var gcountCells;
var gBoard;
var gNeighborsCount;
// var firstTimeCount = 0;


var gLevel = {
    size: 4,
    mines: 2,
    life: 2
};

var lifes = gLevel.life

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
    gGame.isOn = true;
    startTimer();
    var elh2 = document.querySelector('h2');
    elh2.innerText = SMILE;
    strHtml = '';
    strHtml += 'Mines: ' + gLevel.mines;
    var elmines = document.querySelector('.mines');
    elmines.innerHTML = strHtml;
    strHtml = '';
    strHtml += 'life: ' + gLevel.life;
    console.log(gLevel.life)
    elLife = document.querySelector('.life');
    elLife.innerHTML = strHtml;
    gBoard = buildBoard();
    renderBoard(gBoard);
}


function buildBoard() {
    var board = createMat(gLevel.size, gLevel.size);
    var cellsArr = []
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            var cell = { minesAroundCount: gNeighborsCount, isShown: false, isMine: false, isMarked: true };
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
            strHtml += `<td data-i="${i}" data-j="${j}" class="cell ${className}" onClick="cellClicked(this, ${i}, ${j})"  oncontextmenu="myFunction(this, event, ${i}, ${j})">`
            if (currCell.isMine) {
                strHtml += ''
            }
            strHtml += '</td>'
        }
        strHtml += '</tr>';
    }
    var elBoard = document.querySelector('.board');
    elBoard.innerHTML = strHtml;
}


function cellClicked(elCell, i, j) {
    if (gGame.isOn === true) {
        var gNeighborsCount = countNeighbors(i, j, gBoard);
        // console.log(gNeighborsCount)
        var cell = gBoard[i][j];
        console.log('cell ' + i + ',' + j);
        cell.minesAroundCount = gNeighborsCount
        // console.log(cell.minesAroundCount);
        if (!checkForWin()) {
            if (elCell.innerText !== FLAG) {
                if (!cell.isMine) {
                    if (gNeighborsCount === 0) {
                        renderZeroNegs(i, j, gBoard);
                    } else {
                        renderCell(i, j, gNeighborsCount);
                    }
                } else {
                    if (elCell.innerText === '') {
                        gLevel.life--;
                        elCell.classList.add('mineCell');
                        if (gLevel.life > 0) {
                            renderLife(gLevel.life);
                            renderCell(i, j, MINE)
                        } else {
                            renderLife(gLevel.life);
                            renderCell(i, j, MINE)
                            stopTimer();
                            gameOverForLose();
                        }
                    }
                }
            }
        } else {
            renderLife(gLevel.life);
            renderCell(i, j, gNeighborsCount)
            stopTimer();
            gameOverForWin();
        }
    }
}


function renderZeroNegs(cellI, cellJ, mat) {
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= mat.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= mat[i].length) continue;
            var gNeighborsCount = countNeighbors(i, j, gBoard);
            if (mat[i][j].isMine) {
                renderCell(i, j, MINE)
            } else {
                renderCell(i, j, gNeighborsCount)
            }
        }
    }
}



function checkForWin() {
    gcountCells = 0;
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[i].length; j++) {
            var elCell = document.querySelector(`[data-i="${i}"][data-j="${j}"]`);
            // console.log(elCell.innerText)
            if (elCell.innerText !== '') {
                gcountCells++
                console.log(gcountCells);
            }
        }
    } if ((gcountCells === (gLevel.size * gLevel.size) - 1)) {
        return true;
    } else {
        return false;
    }
}



function gameOverForLose() {
    gGame.isOn = false;
    stopTimer();
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[i].length; j++) {
            if (gBoard[i][j].isMine) {
                renderCell(i, j, MINE);
                elCell = document.querySelector(`[data-i="${i}"][data-j="${j}"]`)
                elCell.classList.add('mineCell');
            }
        }
    }
    var strHtml = '';
    strHtml += `<button class="resBtn" onClick="initGame()">${SAD}</button>`;
    elh2 = document.querySelector('h2');
    elh2.innerHTML = strHtml;
    gLevel.life = lifes;

}


function gameOverForWin() {
    gGame.isOn = false;
    stopTimer();
    var strHtml = '';
    strHtml += `<button class="resBtn" onClick="initGame()">${WIN}</button>`;
    elh2 = document.querySelector('h2');
    elh2.innerHTML = strHtml;
    gLevel.life = lifes;
}



function renderCell(i, j, value) {
    var elCell = document.querySelector(`[data-i="${i}"][data-j="${j}"]`);
    // console.log('elCell', elCell);
    elCell.innerText = value;
    console.log(elCell.classList)
    // elCell.classList.remove('occupied');

}


function renderLife(gLife) {
    var strHtml = '';
    strHtml += 'life: ' + gLife;
    elLife = document.querySelector('.life');
    elLife.innerHTML = strHtml;
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



function chooseSize(elBtn) {
    stopTimer()
    var level = elBtn.innerText
    // console.log(elBtn);
    if (level === 'begginer') {
        gLevel.mines = 2;
        gLevel.size = 4;
        gLevel.life = 2;
        lifes = 2;
    } else if (level === 'Medium') {
        gLevel.mines = 12;
        gLevel.size = 8;
        gLevel.life = 3;
        lifes = 3;
    } else {
        gLevel.mines = 30;
        gLevel.size = 12;
        gLevel.life = 5;
        lifes = 5;
    }
    initGame()
}



function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
}



function startTimer() {
    var startTime = Date.now();
    updateTimer(startTime);
}
function updateTimer(startTime) {
    var elTimer = document.querySelector('.timer');
    gInterval = setInterval(function () {
        var timeNow = Date.now()
        var seconds = (timeNow - startTime) / 1000;
        elTimer.innerText = seconds;
    }, 100);
}


function stopTimer() {
    clearInterval(gInterval);
}



function myFunction(elCell, e, i, j) {
    e.preventDefault();
    //do something differant context menu
    if (gGame.isOn === true) {
        if (elCell.innerText === FLAG) {
            renderCell(i, j, '');
        } else {
            renderCell(i, j, FLAG)
        }
    }

}





