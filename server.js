var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mongodb = require('mongoose');


mongodb.connect('mongodb://localhost:27017');
var Conversation = mongodb.model('conversation',
          { time: Date,
            user: String,
            message: String }
    );


app.get('/', function(req, res){
  res.sendfile('index.html');
});

app.get('/conversations', function(req, res){
  res.sendfile('conversations.html');
});

app.get('/conversations/delete', function(req, res){
   console.log("deleting stuff..");
   Conversation.remove({}, function(err) {
      console.log(err);
      res.statusCode = 302;
      res.setHeader('location', '/');
      res.end();
    });
  });

app.get('/conversations/all', function(req, res){
   console.log("querying database..");
   Conversation.find(function(err, data){
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      var arr = new Array();
      for (conv in data)
      {
        arr.push({time: data[conv].time, user: data[conv].user, message: data[conv].message});
      }
      res.write(JSON.stringify(arr));
      res.end();
    });
  }); 

io.on('connection', function(socket){
  console.log("connection created")
  socket.on('chat message', function(msg){
    console.log("message arrived");
    var conv = new Conversation();
    conv.user = msg.user;
    conv.message = msg.message;
    conv.time = msg.time;
    conv.save(function (err) {
      if (!err) {
        console.log("conversation is saved...");  }
      });
    io.emit('chat message', msg);
  });
});

http.listen(80, function(){
  console.log('listening on *:80');
});