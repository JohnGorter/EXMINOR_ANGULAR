var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mongodb = require('mongoose');
var logger = require('Logger');


mongodb.connect('mongodb://localhost:27017');
var Conversation = mongodb.model('conversation',
          { time: Date,
            user: String,
            message: String }
    );


app.get('/', function(req, res){
  res.sendfile('index.html'); 
});
  
app.get('/main.js', function(req, res){
 res.sendfile('main.js');
});
  
app.get('/main.html', function(req, res){
 res.sendfile('main.html');
});

app.get('/history.html', function(req, res){
 res.sendfile('history.html');
});



app.get('/conversations.html', function(req, res){
 res.sendfile('conversations.html');
});

app.get('/conversation', function(req, res){
 Conversation.find(function(err, data){
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      var arr = new Array();
      var i = 0;
      for (conv in data)
      {
        arr.push({id:i++,time: data[conv].time, user: data[conv].user, message: data[conv].message});
      }
      res.write(JSON.stringify(arr));
      res.end();
    });
  }); 


app.get('/conversation/delete', function(req, res){
   logger.log("deleting stuff..");
   Conversation.remove({}, function(err) {
      logger.log(err);
      res.statusCode = 302;
      res.setHeader('location', '/');
      res.end();
    });
  });

app.get('/conversations/all', function(req, res){
   logger.log("querying database..");
   Conversation.find(function(err, data){
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      var arr = new Array();
      var i = 0;
      for (conv in data)
      {
        arr.push({id:i++,time: data[conv].time, user: data[conv].user, message: data[conv].message});
      }
      res.write(JSON.stringify(arr));
      res.end();
    });
  }); 

io.on('connection', function(socket){
  logger.log("connection created")
  socket.on('chat message', function(msg){
    logger.log("message arrived");
    var conv = new Conversation();
    conv.user = msg.user;
    conv.message = msg.message;
    conv.time = msg.time;
    conv.save(function (err) {
      if (!err) {
        logger.log("conversation is saved...");  }
      });
    io.emit('chat message', msg);
  });
});

http.listen(80, function(){
  logger.log('listening on *:80');
});