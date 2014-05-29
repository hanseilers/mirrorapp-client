'use strict';


// Declare app level module which depends on filters, and services
angular.module('mirrorApp', [
	'ngRoute',
	'ngAnimate',
	'mirrorApp.filters',
	'mirrorApp.services',
	'mirrorApp.directives',
	'mirrorApp.controllers'
]).
config(['$routeProvider',
	function($routeProvider) {
		$routeProvider.when('/start', {
			templateUrl: 'partials/start.html',
			controller: 'MyCtrl2'
		});
		
		$routeProvider.when('/questionnaire', {
			redirectTo: '/questionnaire/0'
		});

		$routeProvider.when('/questionnaire/:path', {
			templateUrl: 'partials/questionnaire.html',
			controller: 'questionCtlr'
		});
		
		
		$routeProvider.when('/result/:score', {
			templateUrl: 'partials/result.html',
			controller: 'resultCtrl'
		});
		
		$routeProvider.otherwise({
			redirectTo: '/start'
		});
	}
]);



