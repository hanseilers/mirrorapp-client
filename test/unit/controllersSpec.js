'use strict';

/* jasmine specs for controllers go here */

describe('questionCtlr', function() {
  var $scope, $rootScope, $routeParams, $location, createController, mirrorAPIservice, $httpBackend

  beforeEach(module('mirrorApp'));

  beforeEach(inject(function($injector) {
    $httpBackend = $injector.get('$httpBackend');
    $rootScope = $injector.get('$rootScope');
    $location = $injector.get('$location');
    mirrorAPIservice = $injector.get('mirrorAPIservice');

    $scope = $rootScope.$new();


    var $controller = $injector.get('$controller');

    createController = function() {
      //$routeParams = {path: '0'};
      return $controller('questionCtlr', {
        '$scope': $scope,
        'mirrorAPIservice': mirrorAPIservice,
        '$routeParams': $routeParams,
        '$location': $location
      });
    };
  }));


  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('Initially the currentQuestion should be 0', function() {
    $httpBackend.when('GET', '../data/questionnaire.json').respond([{
      "txt": "vraag 1",
      "nr": 1,
      "selectedAnswer": null,
      "answers": [{
        "txt": "antwoord 1",
        "selected": false,
        "nr": 1
      }, {
        "txt": "antwoord 2",
        "selected": false,
        "nr": 2
      }]
    }]);
    $routeParams = {
      path: ''
    };
    var controller = createController();
    $httpBackend.flush();
    expect(parseInt($scope.currentQuestionIndex)).toBe(0);
  });

  it('Location should change to sublevel', function() {
    $httpBackend.when('GET', '../data/questionnaire.json').respond([{
      "nr": 0,
      "selectedAnswerIndex": 0,
      "answers": [
      {
        "nr": 0,
        "questions": [
        {
          "answers": [
            {
              "nr": 0,
            }, {
              "nr": 1,
            }
          ],
          "nr": 1,
          "selectedAnswerIndex": null
        }]
      }, {"nr":1, "score": 3}, 
      {"nr":2, "score": 3}]
    }]);
    $routeParams = {
      path: '0'
    };
    $location.path('/questionnaire/0');
    var controller = createController();
    $httpBackend.flush();
    $scope.validate();
    expect(parseInt($scope.currentQuestionIndex)).toBe(0);

    expect($location.path()).toBe('/questionnaire/0-0-0');
  });

});