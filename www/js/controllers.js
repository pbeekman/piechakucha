angular.module('piecha-kucha.controllers', ['ngCordova'])

.service('sharedSettings', function () {
	var settings = {
		'slideTime' : 20,
		'firstWarning' : 15,
		'vibration' : true,
		'flash' : false
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
    	if($scope.counter == $scope.settings.slideTime) {
      		$scope.counter = 0;
    	}

    	$scope.counter++;

    	if($scope.counter == $scope.settings.firstWarning){
      		if($scope.settings.vibration) {
        		$cordovaVibration.vibrate([300, 300, 400]);
      		}

      		if($scope.settings.flash) {
        		$cordovaFlashlight.switchOn();
        		$timeout($scope.turnOffFlash,500);
      		}
    	}
    	else if($scope.counter == ($scope.settings.slideTime)) {
			if($scope.settings.vibration) {
				$cordovaVibration.vibrate(1000);
      		}

      		if($scope.settings.flash) {
        		$cordovaFlashlight.switchOn();
        		$timeout($scope.turnOffFlash,1000);
      		}
    	}

		mytimeout = $timeout($scope.clockFunction,1000);
  	}


  	$scope.turnOffFlash = function() {
    	$cordovaFlashlight.switchOff();
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

	$scope.changeSetting = function(setting) {
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
