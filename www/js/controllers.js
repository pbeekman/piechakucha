angular.module('piecha-kucha.controllers', ['ngCordova'])

.controller('indexCtrl', function($scope, $timeout, $cordovaVibration) {
  $scope.slideTime = 20;
  $scope.firstWarning = 15;
  $scope.counter = 0;
  $scope.timeStarted = false;

  var mytimeout;

  $scope.setPreset = function() {

    if($scope.presetValue == 'pechakucha') {
      $scope.slideTime = 20;
      $scope.firstWarning = 15;
    }
    else if($scope.presetValue == 'ignite') {
      $scope.slideTime = 15;
      $scope.firstWarning = 10;
    }
  }

  $scope.stopTimer = function(){
    $timeout.cancel(mytimeout);
    $scope.timeStarted = false;
  }

  $scope.clockFunction = function(){
    if($scope.counter == $scope.slideTime) {
      $scope.counter = 0;
    }

    $scope.counter++;

    if($scope.counter == $scope.firstWarning){
      //console.log('buzz!');
      $cordovaVibration.vibrate([300, 300, 400]);
    }
    else if($scope.counter == ($scope.slideTime -1)) {
      //console.log('buzzzzzzzzz');
      $cordovaVibration.vibrate(1000);
    }
    mytimeout = $timeout($scope.clockFunction,1000);
  }


  $scope.startTimer = function() {
    $scope.counter = 0;
    $scope.timeStarted = true;
    mytimeout = $timeout($scope.clockFunction,1000);
  }
});
