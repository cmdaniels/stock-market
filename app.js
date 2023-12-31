var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var yahooStocks = require('yahoo-stocks');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var tickerSymbols = ['AMZN','GOOG','AMD'];

io.on('connection', function(socket){
  socket.emit('welcome', {
    stocks: tickerSymbols
  });
  socket.on('add', function(data) {
    tickerSymbols.push(data.symbol);
    socket.broadcast.emit('add', data);
  });
  socket.on('remove', function(data) {
    tickerSymbols.splice(tickerSymbols.indexOf(data.symbol), 1);
    socket.broadcast.emit('remove', data);
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
