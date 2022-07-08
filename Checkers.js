const htmlBoard = () => {
    let board = document.getElementById("board")
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            const cell = document.createElement('div');
            const piece = document.createElement('button');
            piece.classList.add('piece');
            cell.classList.add("box");
            board.appendChild(cell);
            if (i % 2 === 0) {
                if (j % 2 === 0)
                    cell.classList.add("white");
                else {
                    cell.classList.add("black");
                    if (i === 0 || i === 2) {
                        piece.classList.add('white_piece');
                        piece.id = i + "" + j;
                        cell.appendChild(piece);
                    }
                    if (i === 6) {
                        piece.classList.add('black_piece');
                        piece.id = i + "" + j;
                        cell.appendChild(piece);
                    }
                    if (i === 3 || i === 4) {
                        piece.classList.add('no_piece');
                        piece.id = i + "" + j;
                        cell.appendChild(piece);
                    }
                }
            }
            else {
                if (j % 2 === 0) {
                    cell.classList.add("black");
                    if (i === 5 || i === 7) {
                        piece.classList.add('black_piece');
                        piece.id = i + "" + j;
                        cell.appendChild(piece);
                    }
                    if (i === 1) {
                        piece.classList.add('white_piece');
                        piece.id = i + "" + j;
                        cell.appendChild(piece);
                    }
                    if (i === 3 || i === 4) {
                        piece.classList.add('no_piece');
                        piece.id = i + "" + j;
                        cell.appendChild(piece);
                    }
                }
                else
                    cell.classList.add("white");
            }
        }
    }
    return board;
}
let visualBoard = htmlBoard();
let pieceClickedId = null;// the last piece clicked on the board and its id
let pieceChosen = null;// the final piece chosen
let boxChosen = null;// where the piece going to
let middleBox = null;
let isWhiteTurn = true, justAte = false;
let whitePieceCounter = 12, blackPieceCounter = 12;
let piecesCanEatId = [], locationPieceMustMove = [];
let arrayCounter = 0;
let pieceMustEatAgain = null;
let wayToGo = 0;
document.getElementById('turn').style = 'background-Color : rgb(233, 224, 173);';
////////////////////first click/////////////////////
visualBoard.addEventListener('click', (event) => {
    pieceClickedId = event.target.id;
    if (pieceClickedId === null || pieceClickedId === 'board') return false;
    if (!(pieceChosen == null || pieceChosen.id === pieceClickedId)) return false;
    pieceChosen = document.getElementById(pieceClickedId);
    if (!checkFirstClick()) {
        pieceChosen = null;
        return false;
    }
    canEat();
    if (piecesCanEatId.length > 0) {
        for (let i = 0; i < piecesCanEatId.length; i++) {
            if (piecesCanEatId[i] === pieceClickedId)
                pieceChosen.classList.toggle('clicked');
        }
    }
    if (piecesCanEatId == null || piecesCanEatId.length === 0)
        pieceChosen.classList.toggle('clicked');
    if (!pieceChosen.classList.contains('clicked'))
        pieceChosen = null;
})
////////////////////second click/////////////////////
visualBoard.addEventListener('click', (event) => {
    if (!event.target.classList.contains('black')) return false;
    boxChosen = event.target.firstChild;
    if (!secondClick(boxChosen)) return false;
    if (justAte) {
        if (checkIfCanEatAgain()) {
            console.log(locationPieceMustMove);
            console.log(piecesCanEatId);
            return false;
        }
    }
    endTurn();
    checkForWin();
})
function checkFirstClick() {
    let result;
    let pieceStyle = checkForPieceStyle(pieceChosen);
    if (pieceStyle === 'white') wayToGo = 1;
    else if (pieceStyle === 'black') wayToGo = -1;
    if (pieceChosen == null) return false;
    if (!((isWhiteTurn === (pieceStyle === 'white')) || ((!isWhiteTurn) === (pieceStyle === 'black')))) return false;
    if (pieceMustEatAgain !== null && pieceChosen.id !== pieceMustEatAgain.id) return false;
    result = checkSons(pieceStyle);
    if (justAte || pieceChosen.classList.contains('king')) {
        wayToGo *= -1;
        result = checkSons(pieceStyle);
    }
    return result;
}
function checkSons(pieceStyle) {
    let rightPieceStyle = checkForPieceStyle(document.getElementById((pieceChosen.id[0] / 1 + wayToGo) + '' + (pieceChosen.id[1] / 1 + 1)));
    let leftPieceStyle = checkForPieceStyle(document.getElementById((pieceChosen.id[0] / 1 + wayToGo) + '' + (pieceChosen.id[1] / 1 - 1)));
    if (rightPieceStyle === 'no' || leftPieceStyle === 'no') return true;
    if (pieceStyle === rightPieceStyle && pieceStyle === leftPieceStyle) return false;
    let right2PieceStyle = checkForPieceStyle(document.getElementById((pieceChosen.id[0] / 1 + 2 * wayToGo) + '' + (pieceChosen.id[1] / 1 + 2)))
    let left2PieceStyle = checkForPieceStyle(document.getElementById((pieceChosen.id[0] / 1 + 2 * wayToGo) + '' + (pieceChosen.id[1] / 1 - 2)))
    if (pieceStyle !== rightPieceStyle && right2PieceStyle === 'no') return true;
    if (pieceStyle !== leftPieceStyle && left2PieceStyle === 'no') return true;
    return false;
}
function secondClick(boxChosen) {
    if (isMoveLegal(pieceChosen, boxChosen))
        movePiece();
    else return false;
    if (isPieceAKing())
        pieceBecomeKing();
    return true;
}
function checkIfCanEatAgain() {
    let rememberPiece;
    rememberPiece = boxChosen;
    resetAll();
    pieceChosen = rememberPiece;
    if (!isMySonAnEatableEnemy(pieceChosen.id[0] / 1, pieceChosen.id[1] / 1, checkForPieceStyle(pieceChosen))) {
        justAte = false;
        return false;
    }
    pieceMustEatAgain = pieceChosen;
    return true;
}
function endTurn() {
    isWhiteTurn = !isWhiteTurn;
    document.getElementById('turn').style = isWhiteTurn ? 'background-Color: rgb(233, 224, 173);' : 'background-Color: rgb(57, 11, 11);';
    resetAll();
}
function canEat() {
    let pieceToCheck, pieceStyle;
    piecesCanEatId = [];
    arrayCounter = 0;
    for (let x = 0; x < 8; x++) {
        for (let y = 0; y < 8; y++) {
            pieceToCheck = document.getElementById(x + "" + y);
            if (pieceToCheck == null) continue;
            pieceStyle = checkForPieceStyle(pieceToCheck);
            if (pieceStyle === 'no') continue;
            if (isMySonAnEatableEnemy(x, y, pieceStyle)) {
                piecesCanEatId[arrayCounter] = (x + '' + y);
                arrayCounter++;
            }
        }
    }
}
function isMySonAnEatableEnemy(x, y, pieceColor) {
    let isNewPiece = false;
    if (pieceColor === 'white') wayToGo = 1;
    else if (pieceColor === 'black') wayToGo = -1;
    else return false;
    if ((x + 1 < 8) || (x - 1 > 0)) {
        if ((y + 1 < 8) || (y - 1 > 0)) {
            if ((x + 2 < 8) || (x - 2 > 0)) {
                if ((y + 2 < 8) || (y - 2 > 0)) {
                    isNewPiece |= checkGrandson(x, y, pieceColor, isNewPiece)
                    if (justAte || pieceChosen.classList.contains('king')) {
                        wayToGo *= -1;
                        isNewPiece |= checkGrandson(x, y, pieceColor, isNewPiece)
                    }
                }
            }
        }
    }
    return isNewPiece;
}
function checkGrandson(x, y, pieceColor, isNewPiece) {
    let rightPieceStyle = checkForPieceStyle(document.getElementById((x + wayToGo) + '' + (y + 1)));
    let leftPieceStyle = checkForPieceStyle(document.getElementById((x + wayToGo) + '' + (y - 1)));
    if (rightPieceStyle === 'no' && leftPieceStyle === 'no') return false;
    let right2PieceStyle = checkForPieceStyle(document.getElementById((x + 2 * wayToGo) + '' + (y + 2)))
    let left2PieceStyle = checkForPieceStyle(document.getElementById((x + 2 * wayToGo) + '' + (y - 2)))
    if (((isWhiteTurn && pieceColor === 'white' && leftPieceStyle === 'black') || (!isWhiteTurn && pieceColor === 'black' && leftPieceStyle === 'white')) && left2PieceStyle === 'no') {
        locationPieceMustMove[locationPieceMustMove.length] = ((x + 2 * wayToGo) + '' + (y - 2));
        isNewPiece = true;
    }
    if (((isWhiteTurn && pieceColor === 'white' && rightPieceStyle === 'black') || (!isWhiteTurn && pieceColor === 'black' && rightPieceStyle === 'white')) && right2PieceStyle === 'no') {
        locationPieceMustMove[locationPieceMustMove.length] = ((x + 2 * wayToGo) + '' + (y + 2));
        isNewPiece = true;
    }
    return isNewPiece;
}
function checkForPieceStyle(pieceTest) {
    if (pieceTest == null) return '';
    if (pieceTest.classList.contains('white_piece')) return 'white';
    if (pieceTest.classList.contains('black_piece')) return 'black';
    if (pieceTest.classList.contains('no_piece')) return 'no';
}
function isMoveLegal(pieceChosen, boxChosen) {
    if (!boxChosen.classList.contains('no_piece')) return false;
    if (pieceChosen == null) return false;
    if (!pieceChosen.classList.contains('king')) {
        if (!justAte) {
            if (!(isWhiteTurn ? boxChosen.id[0] > pieceChosen.id[0] : boxChosen.id[0] < pieceChosen.id[0]))
                return false;
        }
    }
    if (locationPieceMustMove.length > 0) {
        for (let i = 0; i < locationPieceMustMove.length; i++) {
            if (locationPieceMustMove[i] === boxChosen.id) {
                eat();
                return true;
            }
        }
        return false;
    }
    else if (locationPieceMustMove == null || locationPieceMustMove.length === 0) {
        if (Math.abs(boxChosen.id[0] - pieceChosen.id[0]) === 1 && Math.abs(boxChosen.id[1] - pieceChosen.id[1]) === 1)
            return true;
    }
    return true;
}
function eat() {
    middleBox = document.getElementById(getMiddleBoxId());
    if (middleBox.classList.contains('king'))
        removeKing(middleBox);
    middleBox.classList.remove(isWhiteTurn ? 'black_piece' : 'white_piece');
    middleBox.classList.add('no_piece');
    isWhiteTurn ? blackPieceCounter-- : whitePieceCounter--;
    justAte = true;
}
function getMiddleBoxId() {
    let minPieceIdX = pieceChosen.id[0] < boxChosen.id[0] ? pieceChosen.id[0] : boxChosen.id[0];
    let minPieceIdY = pieceChosen.id[1] < boxChosen.id[1] ? pieceChosen.id[1] : boxChosen.id[1];
    minPieceIdX++, minPieceIdY++;
    return (minPieceIdX + "" + minPieceIdY);
}
function movePiece() {
    let whosTurn = isWhiteTurn ? 'white_piece' : 'black_piece';
    boxChosen.classList.remove('no_piece');
    boxChosen.classList.add(whosTurn);
    pieceChosen.classList.remove('clicked', whosTurn);
    pieceChosen.classList.add('no_piece');
    if (pieceChosen.classList.contains('king')) {
        pieceBecomeKing();
        removeKing(pieceChosen);
    }
}
function removeKing(pieceChosen) {
    pieceChosen.classList.remove('king');
    pieceChosen.classList.add('piece');
    pieceChosen.innerHTML = '';
}
function resetAll() {
    pieceChosen = null;
    pieceClickedId = null;
    boxChosen = null;
    middleBox = null;
    piecesCanEatId = [];
    arrayCounter = 0;
    locationPieceMustMove = [];
    pieceMustEatAgain = null;
    wayToGo = 0;
}
function pieceBecomeKing() {
    boxChosen.classList.remove('piece');
    boxChosen.classList.add('king');
    boxChosen.innerHTML = 'K';
}
function isPieceAKing() {
    if ((boxChosen.classList.contains('white_piece') && boxChosen.id[0] == 7) || (boxChosen.classList.contains('black_piece') && boxChosen.id[0] == 0))
        return true;
}
////////////////modal for the win////////
let modal = document.getElementById("myModal");
let btn = document.getElementById("myBtn");
let span = document.getElementsByClassName("close")[0];

span.onclick = () => {
    document.location.reload();
    modal.style.display = "none";
}
window.onclick = (event) => {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}
function checkForWin() {
    if (whitePieceCounter === 0) {
        document.getElementById('massege').innerHTML = "black wins!!"
        modal.style.display = "block";
        return true;
    }
    if (blackPieceCounter === 0) {
        document.getElementById('massege').innerHTML = "white wins!!"
        modal.style.display = "block";
        return true;
    }
    return false;
}