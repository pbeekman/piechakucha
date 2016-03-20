angular.module('piecha-kucha.controllers', ['ngCordova'])

.service('sharedSettings', function () {
	var settings = {
		'slideTime' : 20,
		'firstWarning' : 15,
		'fistWarningOn' : true,
		'vibration' : true,
		'flash' : false,
		'countdown' : false
	};

	return {
		getSettings: function () {
			return settings;
		},
		setSetting: function(newSettings) {
			settings = newSettings;
		}
	};
})

.controller('indexCtrl', function($scope, sharedSettings, $timeout, $cordovaVibration, $cordovaFlashlight, $ionicModal) {
	$scope.data = {};
	$scope.settings = sharedSettings.getSettings();

	//Clock functions/settings
	$scope.counter = 0;
	$scope.timeStarted = false;
	$scope.countdownActive = false;

  	var clock;

  	$scope.startTimer = function() {
		$scope.timeStarted = true;

		if($scope.settings.countdown){
			$scope.countdownActive = true;
			$scope.counter = 5;
			countdown = $timeout($scope.countdownFunction,1000);
		}
		else {
			clock = $timeout($scope.clockFunction,1000);
		}
  	}

  	$scope.stopTimer = function(){
    	$timeout.cancel(clock);
    	$scope.counter = 0;
		$scope.timeStarted = false;
  	}

	$scope.startCountdown = function(){
		$scope.counter = 5;
		countdown = $timeout($scope.countdownFunction,1000);
	}

	$scope.countdownFunction = function(){
		$scope.counter--;
		if($scope.counter == 0) {
			$cordovaVibration.vibrate(1000);
			clock = $timeout($scope.clockFunction,1000);
		}
		else {
			countdown = $timeout($scope.countdownFunction,1000);
		}
	}

  	$scope.clockFunction = function(){
		$scope.countdownActive = false;
		if($scope.counter == $scope.settings.slideTime) {
      		$scope.counter = 0;
    	}

    	$scope.counter++;

    	if($scope.counter == $scope.settings.firstWarning && $scope.settings.fistWarningOn){
      		if($scope.settings.vibration) {
				$cordovaVibration.vibrate([300, 300, 400]);
      		}

      		if($scope.settings.flash) {
        		$cordovaFlashlight.switchOn();
				$cordovaFlashlight.switchOff();
      		}
    	}
    	else if($scope.counter == ($scope.settings.slideTime)) {
			if($scope.settings.vibration) {
				$cordovaVibration.vibrate(1000);
      		}

      		if($scope.settings.flash) {
        		$cordovaFlashlight.switchOn();
				$cordovaFlashlight.switchOff();
      		}
    	}

		clock = $timeout($scope.clockFunction,1000);
  	}


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
})

.controller('settingsCtrl', function($scope, sharedSettings) {
	$scope.settings = sharedSettings.getSettings();
	$scope.data.presetValue = 'pechakucha';
	$scope.data.error = false;

	$scope.changeSetting = function() {
		if(parseInt($scope.settings.slideTime) < parseInt($scope.settings.firstWarning)){
			$scope.data.error = true;
			$scope.settings.fistWarningOn = false;
		}
		else {
			$scope.data.error = false;
			$scope.settings.fistWarningOn = true;
		}

		sharedSettings.setSetting($scope.settings);
	}

	$scope.setPreset = function() {
		if($scope.data.presetValue == 'pechakucha') {
			$scope.settings.slideTime = 20;
			$scope.settings.firstWarning = 15;
		}
		else if($scope.data.presetValue == 'ignite') {
			$scope.settings.slideTime = 15;
			$scope.settings.firstWarning = 10;
		}
		sharedSettings.setSetting($scope.settings);
	};
});
