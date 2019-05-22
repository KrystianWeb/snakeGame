const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
const colorOfBoard = getComputedStyle(canvas).backgroundColor;
const gridLength = 20;
const startButton = document.querySelector('.gameArea .startGame');
const actualScore = document.querySelector('.scorePanel .score');
const actualSpeed = document.querySelector('.scorePanel .speed');
const bestScore = document.querySelector('.scorePanel .best');
let posX, posY, fruitX, fruitY, speedX, speedY, gameSpeed, changeDirection, speedLevel, score, tail, color, interval;
const messagesEndGame = {
  tail: "tail",
  bomb: "bomb",
  wall: "wall",
  obstacle: "obstacle"
};

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
  }
};

const fruitUpdate = function () {
  fruitX = Math.floor(Math.random() * 20) * gridLength;
  fruitY = Math.floor(Math.random() * 20) * gridLength;
  checkFruit();
};

const checkFruit = function () {
  for (let i = 0; i < tail.length; i++) {
    if (tail[i].x == fruitX && tail[i].y == fruitY) {
      fruitUpdate();
      return;
    }
  };
  drawFruit(fruitX, fruitY);
};

const setNewInterval = function () {
  clearInterval(interval);
  gameSpeed = gameSpeed * (9 / 10);
  interval = setInterval(playGame, gameSpeed);
  speedLevel++;
  actualSpeed.innerHTML = speedLevel;
}

const moveSnake = function () {
  posX += speedX * gridLength;
  if (posX < 0) posX += canvas.width;
  if (posX >= canvas.width) posX -= canvas.width;
  posY += speedY * gridLength;
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
  [...document.querySelectorAll('.leftMenu i')].forEach(el => el.classList.add('disable'));
  document.querySelector('.rightMenu button:not(.active)').style.display = 'none';
};

const unblockMenu = function () {
  [...document.querySelectorAll('.leftMenu i')].forEach(el => el.classList.remove('disable'));
  document.querySelector('.rightMenu button:not(.active)').style.display = '';
};

const initGame = function () {
  posX = 1 * gridLength; //starting position X of snake
  posY = 1 * gridLength; //starting position Y of snake
  fruitX = 5 * gridLength; //starting position X of first fruit
  fruitY = 5 * gridLength; //starting position Y of first fruit
  speedX = 0; //+-1
  speedY = 0; //+-1
  color = document.querySelector('.settings .ticks .colors .active').classList[0];
  speedLevel = document.querySelector('.settings .ticks .speed').value; //actual speed from settings
  gameSpeed = 150 * (0.9 ** (speedLevel - 1));
  changeDirection = false;
  score = 0; //actual score
  actualScore.innerHTML = score;
  tail = [{
    x: posX,
    y: posY
  }];
  document.querySelector('.scorePanel .speed').innerHTML = speedLevel;
  document.querySelector('.gameArea .result p').innerHTML = ""; //clear result div - it will be completed at the end of the game
  blockMenu();

  context.fillStyle = colorOfBoard;
  context.fillRect(0, 0, canvas.width, canvas.height);
  drawGrid(posX, posY, color);
  drawFruit(fruitX, fruitY);
  interval = setInterval(playGame, gameSpeed);
};

const updateLocalStorage = function () {
  let updateLocalObject = JSON.parse(localStorage.getItem('snakeGame'));
  let actualDate = new Date();
  updateLocalObject.scores.data.push({
    score: score,
    time: [`${actualDate.toLocaleDateString().slice(0,5)} '${actualDate.toLocaleDateString().slice(-2)}`, actualDate.toLocaleTimeString().slice(0, -3)],
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

const endGame = function (message) {
  clearInterval(interval);
  unblockMenu();
  updateLocalStorage();

  document.querySelector('.gameArea .result').classList.add('show');
  if (score == bestScore.innerHTML)
    document.querySelector('.gameArea .result p').innerHTML += `<span>This is your best result!!!</span>`;
  document.querySelector('.gameArea .result p').innerHTML += `Your score is ${score}`;
  document.querySelector('.gameArea .result button').innerHTML = 'reset game';
};

const playGame = function () {
  if (speedX == 0 && speedY == 0)
    return;

  changeDirection = false;
  moveSnake();

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
  document.querySelector('.gameArea .result').classList.remove('show');
  initGame();
});
document.addEventListener("keydown", keyEvent);