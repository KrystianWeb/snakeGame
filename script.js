window.onload = function () {
  canvas = document.getElementById("canvas");
  context = canvas.getContext("2d");
  document.addEventListener("keydown", keyEvent);
  levelDiv = document.getElementById("levelSpeed");
  scoreDiv = document.getElementById("score");

  gameSpeed = 100; //prędkość początkowa węża (odświeżanie ekranu co 100ms)
  interval = setInterval(game, gameSpeed);

  // ZMIENNE DLA PROGRAMU
  changeDirection = false; //zmiana kierunku możliwa raz na odświeżenie ekranu
  len = 20; //szerokość kratki
  posX = 1 * len; //obecna pozycja X
  posY = 1 * len; //obecna pozycja Y
  speedX = 0; //prędkość w osi X
  speedY = 0; //prędkość w osi Y
  tail = [{
    x: posX,
    y: posY
  }]; //kolejne punkty w całym ogonie
  fruitX = 5 * len; //pierwszy owoc
  fruitY = 5 * len; //na stałej pozycji
  speedLevel = 1; //poziom prędkości
  score = 0; //aktualny wynik

  function setNewInterval() {
    clearInterval(interval);
    gameSpeed = gameSpeed * (9 / 10);
    interval = setInterval(game, gameSpeed);
    speedLevel++;
    levelDiv.innerHTML = "Speed:<br /><b>" + speedLevel + "</b>";
  }

  function game() {
    changeDirection = false;
    context.fillStyle = "rgba(230,255,255,1)";
    context.fillRect(0, 0, canvas.width, canvas.height); //maluj tło na kolor określony wyżej
    for (i = 0; i < tail.length; i++) {
      draw(tail[i].x, tail[i].y); //rysuj cały ogon węża
    }
    fruitUpdate(); //przenieś owoc jeśli zjedzony
    fruit(fruitX, fruitY); //rysuj owoc
    move(); //porusz węża
    checkTail(); //sprawdź czy nie zjadłem samego siebie
  }

  function draw(x, y) //rysuj kratkę na pozycji (x,y)
  {
    context.fillStyle = "red";
    context.strokeStyle = "black";
    context.fillRect(x, y, len, len);
    context.strokeRect(x, y, len, len);
  }

  function fruitUpdate() //rysuj owoc w nowym miejscu
  {
    if (posX == fruitX && posY == fruitY) {
      fruitX = Math.floor(Math.random() * 20) * len;
      fruitY = Math.floor(Math.random() * 20) * len;
      checkFruit();
    }
  }

  function checkFruit() //sprawdź czy nowy owoc nie tworzy się w miejscu ogona
  {
    for (i = 0; i < tail.length; i++) {
      if (tail[i].x == fruitX && tail[i].y == fruitY) {
        fruitX = Math.floor(Math.random() * 20) * len;
        fruitY = Math.floor(Math.random() * 20) * len;
        checkFruit();
      }
    }
  }

  function fruit(x, y) //rysuj owoc na pozycji (x,y)
  {
    context.beginPath();
    context.fillStyle = "green";
    context.strokeStyle = "black";
    context.arc(x + len / 2, y + len / 2, len / 3, 0, 2 * Math.PI, false);
    context.fill();
    context.stroke();
  }

  function move() //porusz węża
  {
    posX += speedX * len;
    if (posX < 0) posX += canvas.width;
    if (posX >= canvas.width) posX -= canvas.width;
    posY += speedY * len;
    if (posY < 0) posY += canvas.height;
    if (posY >= canvas.height) posY -= canvas.height;

    tail.push({
      x: posX,
      y: posY
    }); //dodaj punkt do tablicy ogona

    if (posX != fruitX || posY != fruitY) //i usuń ostatni z tablicy jeśli właśnie nie został zjedzony owoc
    {
      tail.shift();
    } else {
      score++;
      scoreDiv.innerHTML = "Score:<br /><b>" + score + "</b>";
      if ((tail.length - 1) % 10 == 0) {
        setNewInterval();
      }
    }
  }

  function checkTail() //sprawdź czy nie zjadłem własnego ogona
  {
    for (i = 0; i < tail.length - 1; i++) {
      if (tail[i].x == posX && tail[i].y == posY) {
        context.fillStyle = "orange";
        context.strokeStyle = "black";
        context.fillRect(posX, posY, len, len);
        context.strokeRect(posX, posY, len, len);
        endGame()
      }
    }
  }

  function keyEvent(button) {
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
  }

  function endGame() {
    var message = document.getElementById("message");
    message.style.display = "inline";
    message.innerHTML = "Thanks for playing game.<br />Score: <b>" + score +
      "</b><br /><input type='button' value='Play again' onclick='window.location.reload();' />";
    //document.getElementById("canvas").style.display = 'none';
    window.clearInterval(interval);
  }
}