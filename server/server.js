var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.set('port', (process.env.PORT || 3000));
app.use(bodyParser.json());
app.use('/', express.static(path.join(__dirname, './public')));
app.get('/', function(req,res){
  res.sendFile(path.join(__dirname, './public/views/index.html'));
});


var comments = [];
var usersCon = 0;
var id = 0;
io.on('connection', function(socket){
    usersCon++;
    console.log('users connected >>', usersCon);

    io.emit('send msg', comments);

    socket.on('disconnect', function(socket){
      usersCon--;
      console.log('users connected >>', usersCon);
    });

    socket.on('send msg', function(msg){
      var fullMsg = {id: id, username: msg.username, text: msg.text};
      if(comments.length > 250){
        comments = [];
        comments.push(fullMsg);
      }else{
        comments.push(fullMsg);
      }
      id++;
      io.emit('send msg', comments);
    });
});

http.listen(app.get('port'), function(){
  console.log('listening on: 3000');
});
