let myChart;

const updateChart = function (chart) {
  const localObject = JSON.parse(localStorage.getItem('snakeGame')).scores;

  const data = localObject.data.map(el => el.score);
  const labels = localObject.data.map(el => el.time);
  const pointsColors = localObject.data.map(el => el.color);
  const maxArray = new Array(data.length).fill(localObject.maxScore);

  chart.data.labels = labels;
  chart.data.datasets[0].data = data;
  chart.data.datasets[0].pointBackgroundColor = pointsColors;
  chart.data.datasets[0].pointBorderColor = pointsColors;
  chart.data.datasets[1].data = maxArray;
  chart.update();
};

const prepareInterface = function () {
  //icons for opening modals
  const modals = [...document.querySelectorAll('.modal')];
  const iconsForModals = [...document.querySelectorAll('.leftMenu i')];
  const confirmButtons = [...document.querySelectorAll('.modal button.close')];
  //buttons for settings
  const colorsOfSnake = [...document.querySelectorAll('.settings .ticks .colors span')];
  // const activeColorOfSnake = colorsOfSnake.filter(el => el.classList.contains('active'));
  const speedOfSnake = document.querySelector('.settings .ticks .speed');
  const switches = [...document.querySelectorAll('.settings .ticks .switch input')];
  //get object from localStorage
  const localObject = JSON.parse(localStorage.getItem('snakeGame'));
  const bestScore = document.querySelector('.scorePanel .best');

  const confirmSettings = function () {
    let updateLocalObject = JSON.parse(localStorage.getItem('snakeGame'));
    updateLocalObject.snakeColor = colorsOfSnake.filter(el => el.classList.contains('active'))[0].classList[0];
    updateLocalObject.hardOptions = switches.map(el => el.checked);
    updateLocalObject.initialSpeed = speedOfSnake.value;

    localStorage.setItem('snakeGame', JSON.stringify(updateLocalObject))
  };

  iconsForModals.forEach((el, index) => {
    el.addEventListener('click', () => {
      if (el.classList.contains('disable')) return;
      //add class for the right modal and for the icon
      el.classList.add('active');
      modals[index].classList.add('show');
      //remove class from other modals and icons
      iconsForModals.filter((el, i) => i != index).forEach(el => el.classList.remove('active'));
      modals.filter((el, i) => i != index).forEach(el => el.classList.remove('show'));

      if (el.classList.contains('chart'))
        updateChart(myChart);
    })
  });

  confirmButtons.forEach((el, index) => {
    el.addEventListener('click', () => {
      //remove class from modal and icon
      iconsForModals[index].classList.remove('active');
      modals[index].classList.remove('show');

      if (el.classList.contains('confirm'))
        confirmSettings();
    });
  });

  speedOfSnake.value = localObject.initialSpeed;
  colorsOfSnake.filter(el => el.classList.contains('active'))[0].classList.remove('active');
  colorsOfSnake.filter(el => el.classList.contains(localObject.snakeColor))[0].classList.add('active');
  colorsOfSnake.forEach((el, index) => {
    el.addEventListener('click', () => {
      colorsOfSnake.filter(el => el.classList.contains('active'))[0].classList.remove('active');
      el.classList.add('active');
    })
  });

  switches.forEach((el, index) => {
    localObject.hardOptions[index] ? el.checked = true : el.checked = false;
  });

  bestScore.innerHTML = localObject.scores.maxScore;
}

const prepareChart = function () {
  const ctx = document.getElementById('myChart').getContext('2d');
  myChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: [],
      datasets: [{
          label: 'Score',
          data: [],
          borderColor: 'gray',
          borderWidth: 2,
          pointBackgroundColor: [],
          pointBorderColor: []
        },
        {
          label: 'Max score',
          data: [],
          borderColor: 'green',
          fill: false,
          pointRadius: 0
        }
      ]
    },
    options: {
      legend: {
        display: false
      },
      tooltips: {
        callbacks: {
          title: (tooltipItem, data) => {
            return;
          }
        }
      },
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true
          }
        }]
      }
    }
  });
};

//obsługa przycisków zmiany poziomu

//jak dobry wynik (lepszy od besta) to stylizować go;

//inicjalizacja całości
(function () {
  //prepare object in localStorage for first run of game
  if (!localStorage.getItem('snakeGame')) {
    let localObject = {
      snakeColor: 'red',
      initialSpeed: 1,
      level: 'easy',
      hardOptions: [false, false, false],
      scores: {
        maxScore: 0,
        data: []
      }
    };
    localStorage.setItem('snakeGame', JSON.stringify(localObject));
  };
  prepareInterface();
  prepareChart();
})()