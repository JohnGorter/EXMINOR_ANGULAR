var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mongodb = require('mongoose');


mongodb.connect('mongodb://localhost:27017');
var Conversation = mongodb.model('conversation', { log: String });

var conv = new Conversation();
conv.log = "Hello world";
conv.save(function (err) {
  if (!err) {
    console.log("conversation is saved...");  }
  });


Conversation.find(function(err, data){
  for (c in data){
    console.log("conversation: " + data[c]);
  }
  
  });

console.log("Done");