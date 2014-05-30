'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
var servicesModule = angular.module('mirrorApp.services', [])


servicesModule.factory('mirrorAPIservice', function($http) {
	var mirrorAPI = {};
	mirrorAPI.questions = null;
	mirrorAPI.getQuestions = function(result) {
		if (mirrorAPI.questions) {
			result(mirrorAPI.questions);
		} else {
			$http({
				method: 'GET',
				url: '../data/questionnaire.json'
			}).success(function(res) {
				mirrorAPI.questions = res;
				result(mirrorAPI.questions);
			});;
		}
	}
	return mirrorAPI;
});

servicesModule.value('version', '0.1');