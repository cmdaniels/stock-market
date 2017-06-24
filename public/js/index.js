var tickerSymbols = ['AAPL', 'FB'];
var ctx = document.getElementById("stockChart").getContext('2d');
var stockChart;

function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function buildDatasets(res) {
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
  return datasets;
}

$.ajax({
  type: 'POST',
  url: '/yahoo',
  data: {
    stocks: tickerSymbols.toString()
  },
  success: function(res) {
    var datasets = buildDatasets(res);
    stockChart = new Chart(ctx, {
      type: 'line',
      data: {
        datasets: datasets
      },
      options: {
        responsive: true,
        elements: {
          point: {
            radius: 0
          },
          line: {
            tension: 0
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

function addStock() {
  var symbol = $('#tickerSymbol')[0].value;
  $('#tickerSymbol')[0].value = '';
  $.ajax({
    type: 'POST',
    url: '/yahoo',
    data: {
      stocks: symbol
    },
    success: function(res) {
      var dataset = buildDatasets(res);
      stockChart.data.datasets.push(dataset[0]);
      stockChart.update();
    }
  });
}
