var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var yahooStocks = require('yahoo-stocks');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var tickerSymbols = ['AAPL', 'FB'];

io.on('connection', function(socket){
  socket.emit('welcome', {
    stocks: tickerSymbols
  });
});

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

app.post('/yahoo', function(req, res) {
  var responses = [];
  var i = 0;
  req.body.stocks.split(',').forEach(function(stock) {
    yahooStocks.history(stock).then(function(response) {
      response.ticker = stock;
      responses.push(response);
      i++;
      if(i === req.body.stocks.split(',').length){
        res.send(responses);
      }
    });
  });
});

http.listen(process.env.PORT || 3000, function(){
  console.log('Stock Market is listening on port ' + (process.env.PORT || 3000) + '!');
});
