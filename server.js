var http = require('http');
var fs = require('fs');
var exec = require('child_process').exec, child;

child = exec('notepad');

console.log('we are watching the files in nodehw');
fs.watchFile ('john.txt', function(event, file){
  console.log('aahaa  iemand zit aan onze bestandjes');
}); 

console.log('press crtl+c to exit this application');