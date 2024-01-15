"use strict";

const headScore = document.querySelector(".score");
const timerMin = document.querySelector(".min");
const timerSec = document.querySelector(".sec");


const values = new Array(16).fill(0).map((item, index) => index +1);
// console.log(values);

// const page = document.createElement("div");
// page.classList.add("page");
// document.body.appendChild(page);

// const h1 = document.createElement("h1");
// const h1 = page.nextElementSibling;

// document.body.appendChild(h1);
// page.appendChild(h1);
// h1.innerText = ' "Пятнашки" (Fifteen)';

const page = document.getElementById("game1");

// const game_Sh = document.createElement("div");   // Область для фикасции поля при перемешивании
const game_Sh = document.getElementById("game_Shuffle");   // Область для фикасции поля при перемешивании
// game_Sh.classList.add("game_Sh");
// game_Sh.setAttribute("id", "game_Shuffle");
// page.appendChild(game_Sh);


// const game = document.createElement("div");
const game = document.getElementById("game1");
for (const val in values){
    const button = document.createElement("button");
    game.appendChild(button);

    const buttonVal =document.createElement("span");
    button.appendChild(buttonVal);
    // buttonVal.innerText = val;
    buttonVal.classList.add("itemVal");
    buttonVal.classList.add("itemVal_"+val);

    // button.innerText = val;
    button.classList.add("item");

    button.setAttribute("data-matrix-id", val);

};

// document.body.appendChild(game);
// game.classList.add("game");
// game.setAttribute("id", "game1");
// page.appendChild(game);
// game_Sh.appendChild(game); //Обертка для фиксации поля при перемешивании



const shufButton = document.getElementById("shuffle");
// const shufButton = document.createElement("button");
// shufButton.classList.add("shufButton");
// shufButton.setAttribute("id", "shuffle");
// // page.appendChild(shufButton);
// game_Sh.appendChild(shufButton); //****

// shufButton.innerText = "Перемешать (Shuffle)";

//index.js
const gameNode = document.getElementById('game_Shuffle'); //Фиксация поля при перемешивании
const buttonNode = document.getElementById('shuffle');

const containerNode = document.getElementById('game1');
const itemNodes =Array.from(containerNode.querySelectorAll(".item"));
const countItems = 16;

if (itemNodes.length !==16) {
    throw new Error(`Должно быть ровно ${countItems} items in HTML`);
}

//1.Пололжение элементов
//2.Перемешивание (shuffle)
//3.Перемещение элементов при клике
//4.Перемещение элементов кнопками arrows
//5.Визуализация выигрыша (победы)

// console.log(
//     itemNodes.map((item) =>Number(item.dataset.matrixId))
// );
let score = 0;
let timerId;
let minutes = 0;
let seconds = 0;

function update() {
    timerMin.innerHTML = minutes < 10 ? "0" + minutes : minutes;
    seconds ++;

    timerSec.innerHTML = seconds < 10 ? "0" + seconds : seconds;

    if (seconds > 60) {
        minutes++;
        seconds = 0;
    }
    if (minutes === 60 && seconds === 60) {
        clearInterval(timerId);
    }
    console.log(minutes, seconds);
}


//1.Пололжение элементов **********************

itemNodes[countItems-1].style.display = 'none';
let matrix = getMatrix(
    itemNodes.map((item) =>Number(item.dataset.matrixId))
);

setPositionItems(matrix);

// console.log(matrix);

//**** Helpers *****
function getMatrix(arr) {
    const matrix = [[], [], [], []];
    let y = 0;
    let x = 0;

    for (let i =0; i <arr.length; i++) {
        if (x >= 4) {
            y++;
            x = 0;
        }

        matrix[y][x] = arr[i];
        x++;
    }
    return  matrix;
}

function setPositionItems(matrix) {
    for (let y = 0; y < matrix.length; y++) {
        for (let x = 0; x < matrix[y].length; x++){
            const value = matrix[y][x];
            const node = itemNodes[value];    //Должно быть [value-1], т.к. отображаются числа 0...15
            setNodeStyles(node, x, y);
        }
    }
}

function setNodeStyles(node, x, y) {
    const shiftPs = 100;
    node.style.transform = `translate3D(${x * shiftPs}%, ${y * shiftPs}%, 0)`;
}

//2.Перемешивание (shuffle)**********

// document.getElementById("shuffle").addEventListener('click', () =>{
//     const shuffledArray = shuffleArray(matrix.flat());
//     // console.log(shuffledArray);
//     matrix = getMatrix(shuffledArray);
//     setPositionItems(matrix);
// })

//************** Логический Shuffle *****
const maxShuffleCount = 100;
let timer;
let shuffled = false;  // Проверка
const shuffledClassName = "gameShuffle";  //******

document.getElementById("shuffle").addEventListener('click', () =>{
    // console.log(1);
    // 1. Обеспечить RandomSwap (смещение в пустую клетку)
    // 2. Вызов RandomSwap n раз
    RandomSwap(matrix);
    setPositionItems(matrix);

    if (shuffled) {    // Проверка *********
        return;
    }

    shuffled = true;
    let shuffleCount = 0;
    clearInterval(timer);
    gameNode.classList.add(shuffledClassName); //******
    buttonNode.classList.add(shuffledClassName); //******

    if (shuffleCount === 0) {
        timer = setInterval(() => {
            RandomSwap(matrix);
            setPositionItems(matrix);

            shuffleCount += 1;

            if (shuffleCount >= maxShuffleCount) {
                gameNode.classList.remove(shuffledClassName); //******
                buttonNode.classList.remove(shuffledClassName); //******
                clearInterval(timer);
                shuffled = false;

            }
        }, 50);
    }
    setTimeout(() => {
        update();
        timerId = setInterval(update,1000);
    }, 5000);


})

let blockedCoords = null;          //Фиксация коллизий (движение одного и того же элемента)
function RandomSwap(matrix) {
    const blankCoords = findCoordinatesByNumber(blankNumber, matrix);
    // console.log(matrix, blankCoords);
    const validCoords = findValidCoords({
        blankCoords,
        matrix,
        blockedCoords,
    });

    // console.log(validCoords);

    const swapCoords = validCoords[
        Math.floor(Math.random() * validCoords.length)
        ];
    swap(blankCoords, swapCoords, matrix);
    blockedCoords = blankCoords;
}

function findValidCoords({blankCoords, matrix, blockedCoords}) {
    const validCoords = [];
    for (let y = 0; y < matrix.length; y++) {
        for (let x = 0; x < matrix[y].length; x++){
            if (isValidForSwap({x, y}, blankCoords)) {
                if (!blockedCoords || !(
                    blockedCoords.x === x && blockedCoords.y === y
                )) {
                    validCoords.push({x, y});
                }

            }
        }
    }
    return validCoords;
}



// function shuffleArray(arr){
//     return arr
//         .map(value => ({value, sort: Math.random()}))
//         .sort((a, b) => a.sort - b.sort)
//         .map(({value}) => value)
// }

//3.Перемещение элементов при клике *****************

const blankNumber = 15; //!!!Значение кнопки пустой (Должно быть 16)
containerNode.addEventListener("click", (event) => {
    if (shuffled) {    // Проверка *********
        return;
    }
    const buttonNode = event.target.closest('button');
    if (!buttonNode) {
        return;
    }
    // console.log(buttonNode);
    const buttonNumber = Number(buttonNode.dataset.matrixId);
    // console.log(buttonNumber);
    const buttonCoords = findCoordinatesByNumber(buttonNumber, matrix);
    const blankCoords = findCoordinatesByNumber(blankNumber, matrix);
    // console.log(buttonCoords);
    // console.log(blankCoords);
    const isValid = isValidForSwap(buttonCoords, blankCoords);  //Сравнение координат элементов (возможные к перемещению)
    // console.log(isValid);

    let minutes = 0;
    let seconds = 0;


    if (isValid) {
        swap(blankCoords, buttonCoords, matrix);
        setPositionItems(matrix);
    }
    score +=1;
    headScore.innerText = +score;

    // update();
    // timerId = setInterval(update,1000);
})



function findCoordinatesByNumber(number, matrix) {
    for (let y = 0; y < matrix.length; y++) {
        for (let x = 0; x < matrix[y].length; x++){
            if (matrix[y][x] === number) {
                return {x, y};
            }
        }
    }
    return null;
}

function isValidForSwap(coords1, coords2) {
    const diffX = Math.abs(coords1.x - coords2.x);
    const diffY = Math.abs(coords1.y - coords2.y);

    return (diffX ===1 || diffY ===1) && (coords1.x === coords2.x || coords1.y === coords2.y); //Можно перепрыгивать через элементы (удалить условие после &&)
}

//Замена координат в матрице
function swap(coords1, coords2, matrix) {
    const coords1Number = matrix[coords1.y][coords1.x];
    matrix[coords1.y][coords1.x] = matrix[coords2.y][coords2.x];
    matrix[coords2.y][coords2.x] = coords1Number;

    if (isWon(matrix)) {
        addWonClass();

        headScore.innerText = score;
        clearInterval(timerId);
    }
}

//4.Перемещение элементов кнопками arrows **************
window.addEventListener("keydown", (event) => {
    if (shuffled) {    // Проверка *********
        return;
    }
    // console.log(event.key);
    if (!event.key.includes('Arrow')) {
        return;
    }

    const blankCoords = findCoordinatesByNumber(blankNumber, matrix);
    const buttonCoords = {
        x: blankCoords.x,
        y: blankCoords.y,
    };
    const direction = event.key.split('Arrow')[1].toLowerCase();
    // console.log(direction);
    const maxIndexMatrix = matrix.length;
    // console.log(direction);
    switch (direction) {
        case 'up':
            buttonCoords.y +=1;
            break;
        case 'down':
            buttonCoords.y -=1;
            break;
        case 'left':
            buttonCoords.x +=1;
            break;
        case 'right':
            buttonCoords.x -=1;
            break;
    }

    if (buttonCoords.y >=maxIndexMatrix || buttonCoords.y < 0 ||  // Проверка на валидность координат
        buttonCoords.x >=maxIndexMatrix || buttonCoords.x < 0) {
        return;
    }

    if (event.key.includes('Arrow')) {
        score +=1;
    }

    swap(blankCoords, buttonCoords, matrix); // Замена координат
    setPositionItems(matrix);
})

// headScore.innerText = score;

// timerId = setInterval(update,1000);

//5.Визуализация выигрыша (победы) ****************

const winFlatArr = new Array(16).fill(0).map((_item, i) => i + 1)
// console.log(winFlatArr);
function isWon(matrix) {
    const flatMatrix = matrix.flat();
    for (let i = 0; i < winFlatArr.length; i++) {
        if (flatMatrix[i] !== winFlatArr[i]) {
            return false;
        }
    }
    return true;

}

const wonClass = 'fifteenWon';
function addWonClass() {
    setTimeout(() => {
        game.classList.add('wonClass');
        setTimeout(() => {
            game.classList.remove('wonClass');
        }, 1000);
    }, 200);
}

function UpdateImageUrl {
    const imageUrl = imgUrl.value;
    img.setAttribute('src',imageUrl)
}