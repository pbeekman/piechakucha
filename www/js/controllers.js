angular.module('piecha-kucha.controllers', ['ngCordova'])


.controller('indexCtrl', function($scope, $timeout, $cordovaVibration, $cordovaFlashlight, $ionicModal) {
	$scope.data = {};

	//Clock functions/settings
	$scope.data.slideTime = 20;
	$scope.data.firstWarning = 15;
	$scope.data.vibration = true;
	$scope.data.flash = false;
	$scope.data.countdown = false;
	$scope.counter = 0;
	$scope.timeStarted = false;

  	var mytimeout;

  	$scope.startTimer = function() {
		$scope.counter = 0;
		$scope.timeStarted = true;
		mytimeout = $timeout($scope.clockFunction,1000);
  	}

  	$scope.stopTimer = function(){
    	$timeout.cancel(mytimeout);
    	$scope.timeStarted = false;
  	}

  	$scope.clockFunction = function(){
    	if($scope.counter == $scope.data.slideTime) {
      		$scope.counter = 0;
    	}

    	$scope.counter++;

    	if($scope.counter == $scope.data.firstWarning){
      		if($scope.data.vibration) {
        		$cordovaVibration.vibrate([300, 300, 400]);
      		}

      		if($scope.data.flash) {
        		$cordovaFlashlight.switchOn();
        		$timeout($scope.turnOffFlash,500);
      		}
    	}
    	else if($scope.counter == ($scope.data.slideTime)) {
			if($scope.data.vibration) {
				$cordovaVibration.vibrate(1000);
      		}

      		if($scope.data.flash) {
        		$cordovaFlashlight.switchOn();
        		$timeout($scope.turnOffFlash,1000);
      		}
    	}

		mytimeout = $timeout($scope.clockFunction,1000);
  	}


  	$scope.turnOffFlash = function() {
    	$cordovaFlashlight.switchOff();
  	}

  	//Settings page
  	$scope.data.presetValue = 'pechakucha';

	$scope.setPreset = function() {
		if($scope.data.presetValue == 'pechakucha') {
      		$scope.data.slideTime = 20;
      		$scope.data.firstWarning = 15;
    	}
    	else if($scope.data.presetValue == 'ignite') {
      		$scope.data.slideTime = 15;
      		$scope.data.firstWarning = 10;
    	}
  	};

  	//Modal settings
  	$ionicModal.fromTemplateUrl('templates/settingsModal.html', {
    	scope: $scope,
    	animation: 'slide-in-up'
  	}).then(function(modal) {
    	$scope.modal = modal;
  	});

  	$scope.showSettings = function() {
    	$scope.modal.show();
  	};

  	$scope.closeSettings = function() {
    	$scope.modal.hide();
  	};
});
