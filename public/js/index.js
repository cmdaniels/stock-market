var stockTickers = ['AAPL', 'FB'];
var ctx = document.getElementById("stockChart").getContext('2d');

function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

$.ajax({
  type: 'POST',
  url: '/yahoo',
  data: {
    stocks: stockTickers.toString()
  },
  success: function(res) {
    console.log(res);
    var datasets = [];
    res.forEach(function(stockData) {
      var data = [];
      stockData.records.forEach(function(rec) {
        data.push({
          x: new Date(rec.time * 1000),
          y: rec.close
        });
      });
      datasets.push({
        label: stockData.ticker,
        fill: false,
        data: data
      });
    });
    for(var i = 0; i < datasets.length; i++) {
      var color = getRandomColor();
      datasets[i].backgroundColor = color;
      datasets[i].borderColor = color;
    }
    var stockChart = new Chart(ctx, {
      type: 'line',
      data: {
        datasets: datasets
      },
      options: {
        responsive: true,
        elements: {
          point: {
            radius: 0
          }
        },
        scales: {
          xAxes: [{
            type: 'time',
            display: true,
            scaleLabel: {
              display: true,
              labelString: 'Date'
            },
            ticks: {
              major: {
                fontStyle: 'bold',
                fontColor: '#FF0000'
              }
            }
          }],
          yAxes: [{
            display: true,
            scaleLabel: {
              display: true,
              labelString: 'Price'
            }
          }]
        }
      }
    });
  }
});
