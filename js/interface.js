//handling icons and buttons
const prepareInterface = function () {
  //icons for opening modals
  const modals = [...document.querySelectorAll('.modal')];
  const iconsForModals = [...document.querySelectorAll('.leftMenu i')];
  const confirmButtons = [...document.querySelectorAll('.modal button.close')];
  //buttons for settings
  const colorOfSnake = document.querySelector('.settings .ticks .color');
  const switches = [...document.querySelectorAll('.settings .ticks .switch input')];
  //get object from localStorage
  const localObject = JSON.parse(localStorage.getItem('snakeGame'));

  const confirmSettings = function () {
    let updateLocalObject = JSON.parse(localStorage.getItem('snakeGame'));
    updateLocalObject.color = colorOfSnake.style.backgroundColor;
    updateLocalObject.hardOptions = switches.map(el => el.checked);

    localStorage.setItem('snakeGame', JSON.stringify(updateLocalObject))
  };

  //init
  iconsForModals.forEach((el, index) => {
    el.addEventListener('click', () => {
      //add class for the right modal and for the icon
      iconsForModals[index].classList.add('active');
      modals[index].classList.add('show');
      //remove class from other modals and icons
      iconsForModals.filter((el, i) => i != index).forEach(el => el.classList.remove('active'));
      modals.filter((el, i) => i != index).forEach(el => el.classList.remove('show'))
    })
  });

  confirmButtons.forEach((el, index) => {
    el.addEventListener('click', () => {
      //remove class from modal and icon
      iconsForModals[index].classList.remove('active');
      modals[index].classList.remove('show');

      if (el.classList.contains('confirm')) {
        confirmSettings();
      }
    });
  });

  colorOfSnake.style.backgroundColor = localObject.color;
  colorOfSnake.addEventListener('click', function () {
    const availableColors = ['red', 'blue', 'green'];
    const color = this.style.backgroundColor;
    this.style.backgroundColor = availableColors[(availableColors.indexOf(color) + 1) % 3];
  });

  switches.forEach((el, index) => {
    localObject.hardOptions[index] ? el.checked = true : el.checked = false;
  });
}

//wykres
const prepareChart = function () {
  let maxScore = 124;
  let data = [100, 124, 54, 10, 34, 65, 7];
  let pointColors = ['red', 'red', 'red', 'blue', 'blue', 'green', 'blue'];
  const ctx = document.getElementById('myChart').getContext('2d');
  let myChart = new Chart(ctx, {
    plugins: [{
      beforeInit: function (chart) {
        chart.data.labels.forEach(function (e, i, a) {
          if (/\n/.test(e)) {
            a[i] = e.split(/\n/);
          }
        });
      }
    }],
    type: 'line',
    data: {
      labels: ['18.05.2019\n14:10', '18.05.2019\n14:10', '18.05.2019\n14:10', '18.05.2019\n14:10', '18.05.2019\n14:10', '18.05.2019\n14:10', '18.05.2019\n14:10'],
      datasets: [{
        label: 'Score',
        data: data,
        borderColor: 'gray',
        borderWidth: 2,
        pointBackgroundColor: pointColors,
        pointBorderColor: pointColors
      }, {
        label: 'Max score',
        data: [124, 124, 124, 124, 124, 124, 124],
        borderColor: 'green',
        fill: false,
        pointRadius: 0
      }]
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

//pomysły: blokowanie ścian, bomby zabierające punkty i skracające węża, generowanie przeszkód - do włączenia w ustawieniach;
//jak dobry wynik (lepszy od besta) to stylizować go

//inicjalizacja całości
(function () {
  //prepare object in localStorage for first run of game
  if (!localStorage.getItem('snakeGame')) {
    let localObject = {
      color: 'green',
      level: 'easy',
      hardOptions: [true, false, false],
      scores: {
        maxScore: 101
      }
    };
    localStorage.setItem('snakeGame', JSON.stringify(localObject));
  };
  prepareInterface();
  prepareChart();
})()