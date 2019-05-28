const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
const colorOfBoard = getComputedStyle(canvas).backgroundColor;
const gridLength = 20;
const gridsInRow = canvas.width / gridLength;
const gridsInColumn = canvas.height / gridLength;
const amountOfObstacles = 10;
const timeGeneratingBomb = 30 * 1000; //w milisekundach
const startButton = document.querySelector('.result__btn');
const actualScore = document.querySelector('.js-score');
const actualSpeed = document.querySelector('.js-speed');
const bestScore = document.querySelector('.js-best');
const switches = [...document.querySelectorAll('.control__switch')];
let posX, posY, fruitX, fruitY, speedX, speedY, gameSpeed, changeDirection, speedLevel, score, tail, color, interval, bombInterval, bombs, walls, obstacles, obstaclesArray, bombArray, stopGame = true;

const keyEvent = function (button) {
  if (!changeDirection) {
    changeDirection = true;
    switch (button.keyCode) {
      case 37: //leftArrow
        if (speedX != 1) speedX = -1;
        speedY = 0;
        break;
      case 38: //upArrow
        speedX = 0;
        if (speedY != 1) speedY = -1;
        break;
      case 39: //rightArrow
        if (speedX != -1) speedX = 1;
        speedY = 0;
        break;
      case 40: //downArrow
        speedX = 0;
        if (speedY != -1) speedY = 1;
        break;
    }
  };

  if (stopGame && button.keyCode == 13) {
    document.querySelector('.result').classList.remove('result--show');
    initGame();
  };
};

const setNewInterval = function () {
  clearInterval(interval);
  gameSpeed = gameSpeed * (9 / 10);
  interval = setInterval(playGame, gameSpeed);
  speedLevel++;
  actualSpeed.innerHTML = speedLevel;
}

const drawGrid = function (x, y, color, width = 0) {
  context.fillStyle = color;
  context.fillRect(x + 1 + width, y + 1 + width, gridLength - 2 * (1 + width), gridLength - 2 * (1 + width));
};

const clearGrid = function (x, y) {
  context.fillStyle = colorOfBoard;
  context.fillRect(x, y, gridLength, gridLength);
};

const drawFruit = function (x, y) {
  context.beginPath();
  context.fillStyle = "orange";
  context.strokeStyle = "black";
  context.arc(x + gridLength / 2, y + gridLength / 2, gridLength / 3, 0, 2 * Math.PI, false);
  context.fill();
  context.stroke();
};

const fruitUpdate = function () {
  fruitX = Math.floor(Math.random() * gridsInRow) * gridLength;
  fruitY = Math.floor(Math.random() * gridsInColumn) * gridLength;
  checkFruit();
};

const checkFruit = function () {
  if (tail.filter(el => el.x == fruitX && el.y == fruitY).length)
    fruitUpdate()
  else if (obstaclesArray.filter(el => el.x == fruitX && el.y == fruitY).length)
    fruitUpdate()
  else
    drawFruit(fruitX, fruitY);
};

const checkWalls = function () {
  if (posX < 0 || posX >= canvas.width || posY < 0 || posY >= canvas.height) {
    stopGame = true;
    drawGrid(posX - speedX * gridLength, posY - speedY * gridLength, 'orange');
    endGame();
  }
};

const drawBomb = function (x, y) {
  context.fillStyle = 'black';
  context.strokeStyle = 'yellow';
  context.translate(x, y);

  context.beginPath();
  context.arc(gridLength / 2 + 3, gridLength / 2 + 3, 6, 0, 2 * Math.PI, false);
  context.fill();

  context.beginPath();
  context.moveTo(8, 8);
  context.quadraticCurveTo(10, 6, 11, 7);
  context.quadraticCurveTo(12, 8, 10, 10);
  context.quadraticCurveTo(8, 12, 7, 11);
  context.quadraticCurveTo(6, 10, 8, 8);
  context.fill();

  context.fillStyle = 'red';
  context.beginPath();
  context.arc(5, 5, 3, 0, 2 * Math.PI, false);
  context.fill();
  context.stroke();

  context.setTransform(1, 0, 0, 1, 0, 0);
};

const generateBomb = function () {
  let posX, posY;
  posX = Math.floor(Math.random() * gridsInRow) * gridLength;
  posY = Math.floor(Math.random() * gridsInColumn) * gridLength;

  while (tail.filter(el => el.x == posX && el.y == posY).length > 0 || obstaclesArray.filter(el => el.x == posX && el.y == posY).length > 0 || (posX == fruitX && posY == fruitY)) {
    posX = Math.floor(Math.random() * gridsInRow) * gridLength;
    posY = Math.floor(Math.random() * gridsInColumn) * gridLength;
  };
  bombArray.push({
    x: posX,
    y: posY
  });
  drawBomb(posX, posY);
  console.log('wygenerowano bombę');
  setTimeout(() => {
    if (bombArray.length) {
      console.log('bomba zniknęła'); //dokończyć
      clearGrid(bombArray[0].x, bombArray[0].y);
      bombArray = [];
    }
  }, 5000);
};

const checkBomb = function () {
  if (bombArray.length && bombArray[0].x == posX && bombArray[0].y == posY) {
    score < 3 ? score = 0 : score -= 3;
    actualScore.innerHTML = score;
    bombArray = [];
  }
};

const drawObstacle = function (x, y) {
  context.fillStyle = 'black';
  context.strokeStyle = '#aaa';
  context.translate(x, y);

  context.beginPath();
  context.moveTo(15, 1);
  context.quadraticCurveTo(19, 0, 19, 5);
  context.lineTo(19, 15);
  context.quadraticCurveTo(19, 19, 15, 19);
  context.lineTo(5, 19);
  context.quadraticCurveTo(1, 19, 1, 15);
  context.lineTo(1, 5);
  context.quadraticCurveTo(1, 1, 5, 1);
  context.lineTo(15, 1);
  // context.stroke();
  context.fill();

  context.beginPath();
  context.moveTo(2, 5);
  context.lineTo(15, 18);
  context.moveTo(5, 2);
  context.lineTo(18, 15);
  context.stroke();

  context.setTransform(1, 0, 0, 1, 0, 0);
};

const generateObstacles = function (amount) {
  obstaclesArray = [];
  let posX, posY;
  for (let i = 0; i < amount; i++) {
    posX = Math.floor(Math.random() * gridsInRow) * gridLength;
    posY = Math.floor(Math.random() * gridsInColumn) * gridLength;

    while ((posX == tail[0].x && posY == tail[0].y) || (posX == fruitX && posY == fruitY)) {
      posX = Math.floor(Math.random() * gridsInRow) * gridLength;
      posY = Math.floor(Math.random() * gridsInColumn) * gridLength;
    };
    obstaclesArray.push({
      x: posX,
      y: posY
    });
    drawObstacle(posX, posY);
  }
};

const checkObstacles = function () {
  if (obstaclesArray.filter(el => el.x == posX && el.y == posY).length) {
    stopGame = true;
    drawGrid(posX - speedX * gridLength, posY - speedY * gridLength, 'orange');
    endGame();
  }

  // for (let i = 0; i < obstaclesArray.length; i++) {
  //   if (posX == obstaclesArray[i].x && posY == obstaclesArray[i].y) {
  //     stopGame = true;
  //     drawGrid(posX - speedX * gridLength, posY - speedY * gridLength, 'orange');
  //     endGame();
  //   }
  // };
};

const moveSnake = function () {
  posX += speedX * gridLength;
  posY += speedY * gridLength;

  if (walls) checkWalls();
  if (obstacles) checkObstacles();
  if (bombs) checkBomb();
  if (stopGame) return; //stopGame

  if (posX < 0) posX += canvas.width;
  if (posX >= canvas.width) posX -= canvas.width;
  if (posY < 0) posY += canvas.height;
  if (posY >= canvas.height) posY -= canvas.height;
  tail.push({
    x: posX,
    y: posY
  });

  if (posX != fruitX || posY != fruitY) {
    clearGrid(tail[0].x, tail[0].y);
    tail.shift(); //delete first element from array if actual fruit is not eaten
  } else {
    fruitUpdate();
    score++;
    actualScore.innerHTML = score;
    if (score != 0 && score % 10 == 0) {
      setNewInterval(); //faster snake
    }
  }
};

const checkTail = function () {
  for (let i = 0; i < tail.length - 1; i++) {
    if (tail[i].x == posX && tail[i].y == posY) {
      drawGrid(posX, posY, 'orange');
      endGame();
    }
  }
};

const blockMenu = function () {
  [...document.querySelectorAll('.menu__icon')].forEach(el => el.classList.add('menu__icon--disable'));
};

const unblockMenu = function () {
  [...document.querySelectorAll('.menu__icon')].forEach(el => el.classList.remove('menu__icon--disable'));
};

const initGame = function () {
  stopGame = false;
  posX = 1 * gridLength; //starting position X of snake
  posY = 1 * gridLength; //starting position Y of snake
  fruitX = 5 * gridLength; //starting position X of first fruit
  fruitY = 5 * gridLength; //starting position Y of first fruit
  speedX = 0; //+-1
  speedY = 0; //+-1
  color = document.querySelector('.control__color--active').classList.item(0).split('-')[1];
  speedLevel = document.querySelector('.control__speed-range').value; //actual speed from settings
  gameSpeed = 150 * (0.9 ** (speedLevel - 1));
  changeDirection = false;
  score = 0; //actual score
  actualScore.innerHTML = score;
  tail = [{
    x: posX,
    y: posY
  }];
  obstaclesArray = [];
  bombArray = [];
  actualSpeed.innerHTML = speedLevel;
  [bombs, walls, obstacles] = switches.map(el => el.checked);
  document.querySelector('.result__paragraph').innerHTML = ""; //clear result div - it will be completed at the end of the game
  blockMenu();

  context.fillStyle = colorOfBoard;
  context.fillRect(0, 0, canvas.width, canvas.height);
  drawGrid(posX, posY, color);
  drawFruit(fruitX, fruitY);
  if (obstacles) generateObstacles(amountOfObstacles);
  if (bombs) bombInterval = setInterval(generateBomb, timeGeneratingBomb);

  interval = setInterval(playGame, gameSpeed);
};

const updateLocalStorage = function () {
  let updateLocalObject = JSON.parse(localStorage.getItem('snakeGame'));
  let actualDate = new Date();
  updateLocalObject.scores.data.push({
    score: score,
    time: [`${(actualDate.getDate()+"").padStart(2,0)}.${(actualDate.getMonth()+1+"").padStart(2,0)}.${(actualDate.getFullYear()+"").slice(-2)}`, `${(actualDate.getHours()+"").padStart(2,0)}:${(actualDate.getMinutes()+"").padStart(2,0)}`],
    //time: [`${actualDate.toLocaleDateString().slice(0,5)}.${actualDate.toLocaleDateString().slice(-2)}`, actualDate.toLocaleTimeString().slice(0, -3)], - NOT WORKING ON EDGE??
    color: color
  });
  if (score > bestScore.innerHTML) {
    bestScore.innerHTML = score;
    updateLocalObject.scores.maxScore = score;
  };
  //keep only last 10 scores (inclugind the best one)
  if (updateLocalObject.scores.data.length > 10) {
    let lastScoreDeleted = false,
      scoreIndex = 0;
    while (!lastScoreDeleted) {
      if (updateLocalObject.scores.data[scoreIndex].score < bestScore.innerHTML) {
        updateLocalObject.scores.data.splice(scoreIndex, 1);
        lastScoreDeleted = true
      } else scoreIndex++
    }
  };

  localStorage.setItem('snakeGame', JSON.stringify(updateLocalObject))
};

const endGame = function () {
  stopGame = true;
  clearInterval(interval);
  clearInterval(bombInterval);
  unblockMenu();
  updateLocalStorage();

  document.querySelector('.result').classList.add('result--show');
  if (score == bestScore.innerHTML)
    document.querySelector('.result__paragraph').innerHTML += `<span class="result__paragraph--bold">This is your best result!!!</span>`;
  document.querySelector('.result__paragraph').innerHTML += `Your score is ${score}`;
  document.querySelector('.result__btn').innerHTML = 'reset game';
};

const playGame = function () {
  if (speedX == 0 && speedY == 0)
    return;

  changeDirection = false;
  moveSnake();
  if (stopGame) return; //stopGame

  for (let i = 0; i < Math.min(tail.length - 1, 5); i++) { //draw end of the tile with smaller grids
    clearGrid(tail[i].x, tail[i].y);
    let width = Math.min(tail.length - 1, 5) - i;
    drawGrid(tail[i].x, tail[i].y, color, width);
  };
  for (let i = Math.min(tail.length - 1, 5); i < tail.length; i++) {
    drawGrid(tail[i].x, tail[i].y, color);
  };
  drawFruit(fruitX, fruitY);

  checkTail();
};

startButton.addEventListener('click', function () {
  document.querySelector('.result').classList.remove('result--show');
  initGame();
});
document.addEventListener("keydown", keyEvent);