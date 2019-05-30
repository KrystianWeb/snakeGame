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
  const modals = [...document.querySelectorAll('.settings, .instruction, .scores')];
  const iconsForModals = [...document.querySelectorAll('.menu__icon')];
  const confirmButtons = [...document.querySelectorAll('.js_closeModal')];
  //buttons for settings
  const colorsOfSnake = [...document.querySelectorAll('[class^=control__color]')];
  const speedOfSnake = document.querySelector('.control__speed-range');
  const speedText = document.querySelector('.control__speed-value');
  const switches = [...document.querySelectorAll('.control__switch')];
  //get object from localStorage
  const localObject = JSON.parse(localStorage.getItem('snakeGame'));
  const bestScore = document.querySelector('.js-best');

  const confirmSettings = function () {
    let updateLocalObject = JSON.parse(localStorage.getItem('snakeGame'));
    updateLocalObject.snakeColor = colorsOfSnake.filter(el => el.classList.contains('control__color--active'))[0].classList.item(0).split('-')[1];
    updateLocalObject.hardOptions = switches.map(el => el.checked);
    if (switches.filter(el => el.checked).length) {
      document.querySelector('.js-easy').classList.remove('menu__btn--active');
      document.querySelector('.js-hard').classList.add('menu__btn--active');
    } else {
      document.querySelector('.js-easy').classList.add('menu__btn--active');
      document.querySelector('.js-hard').classList.remove('menu__btn--active');
    };
    updateLocalObject.initialSpeed = speedOfSnake.value;

    localStorage.setItem('snakeGame', JSON.stringify(updateLocalObject))
  };

  iconsForModals.forEach((el, index) => {
    el.addEventListener('click', () => {
      if (el.classList.contains('menu__icon--disable')) return;
      //add class for the right modal and for the icon
      el.classList.add('menu__icon--active');
      modals[index].classList.add('modal--show');
      //remove class from other modals and icons
      iconsForModals.filter((el, i) => i != index).forEach(el => el.classList.remove('menu__icon--active'));
      modals.filter((el, i) => i != index).forEach(el => el.classList.remove('modal--show'));

      if (el.classList.contains('js-chart'))
        updateChart(myChart);
    })
  });

  confirmButtons.forEach((el, index) => {
    el.addEventListener('click', () => {
      //remove class from modal and icon
      iconsForModals[index].classList.remove('menu__icon--active');
      modals[index].classList.remove('modal--show');

      if (el.classList.contains('settings__btn'))
        confirmSettings();
    });
  });

  speedOfSnake.value = localObject.initialSpeed;
  speedText.value = localObject.initialSpeed;
  speedOfSnake.addEventListener('input', () => {
    speedText.value = speedOfSnake.value;
  }); //'change' dla edge? opera?

  colorsOfSnake.filter(el => el.classList.contains('control__color--active'))[0].classList.remove('control__color--active');
  colorsOfSnake.filter(el => el.classList.contains(`control__color-${localObject.snakeColor}`))[0].classList.add('control__color--active');
  colorsOfSnake.forEach((el, index) => {
    el.addEventListener('click', () => {
      colorsOfSnake.filter(el => el.classList.contains('control__color--active'))[0].classList.remove('control__color--active');
      el.classList.add('control__color--active');
    })
  });

  switches.forEach((el, index) => {
    localObject.hardOptions[index] ? el.checked = true : el.checked = false;
  });
  if (switches.filter(el => el.checked).length) {
    document.querySelector('.js-easy').classList.remove('menu__btn--active');
    document.querySelector('.js-hard').classList.add('menu__btn--active');
  } else {
    document.querySelector('.js-easy').classList.add('menu__btn--active');
    document.querySelector('.js-hard').classList.remove('menu__btn--active');
  };

  bestScore.textContent = localObject.scores.maxScore;
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