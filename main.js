 // hier maak ik de module...
 var module = angular.module('john', ['ngRoute', 'ngResource']);

// hier tuig ik de module op...
module.service('chatservice', function($rootScope){
      
    var socket = io();
    
    this.sendMessage = function(message){
      socket.emit('chat message', message);
    };
      
    this.startup = function() {
      socket.on('chat message', function(msg){ 
        $rootScope.$broadcast("chatservice_newmessage", msg);
      });
    };
});
    
module.run(function(chatservice){
   chatservice.startup();
}); 
    
module.config(function($routeProvider){
  $routeProvider.
    when('/history', {
        templateUrl: 'history.html',
        controller: 'historycontroller'
      }).
      when('/', {
        templateUrl: 'main.html',
        controller: 'mainCtrl'
      }).
      otherwise({
        redirectTo: '/'
      });
});
    
module.controller("historycontroller", function($scope, $resource){
        var resource = $resource('/conversation/:id', { id:"@id"});
        $scope.convs = resource.query();
        $scope.delete = function(c){
            $scope.convs.splice(c, 1);
            c.$delete();
            console.log("deleted ",c);
        }
      });
    
module.controller('mainCtrl', function($scope, chatservice){
      $scope.message = {};
      $scope.messages = [];
    
      $scope.$on('chatservice_newmessage', function(sender, msg){
         $scope.messages.push(msg);
         $scope.$apply();
        });
      
      $scope.sendMessage = function(){
        $scope.message.time = new Date();
        chatservice.sendMessage(angular.copy($scope.message));
        $scope.message = {};
      };
      
    });