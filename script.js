//obsługa ikon do otwierania dodatkowych okien
(function () {
  const modals = [...document.querySelectorAll('.modal')];
  const iconsForModals = [...document.querySelectorAll('.leftMenu i')];
  const confirmButtons = [...document.querySelectorAll('.modal button.close')];

  iconsForModals.forEach((value, index) => {
    value.addEventListener('click', () => {
      //add class for the right modal and for the icon
      iconsForModals[index].classList.add('active');
      modals[index].classList.add('show');
      //remove class from other modals and icons
      iconsForModals.filter((el, i) => i != index).forEach(el => el.classList.remove('active'));
      modals.filter((el, i) => i != index).forEach(el => el.classList.remove('show'))
    })
  });

  confirmButtons.forEach((value, index) => {
    value.addEventListener('click', () => {
      //remove class from modal and icon
      iconsForModals[index].classList.remove('active');
      modals[index].classList.remove('show');
    })
  })
})()

//obsługa dodatkowych okien + wykres

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

//obsługa przycisków zmiany poziomu

//pomysły: blokowanie ścian, bomby zabierające punkty i skracające węża, generowanie przeszkód - do włączenia w ustawieniach

//obsługa gry