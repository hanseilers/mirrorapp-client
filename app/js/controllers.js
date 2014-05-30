'use strict';

/* Controllers */

angular.module('mirrorApp.controllers', [])
	.controller('questionCtlr', ['$scope', 'mirrorAPIservice', '$routeParams', '$location', '$timeout',
		function($scope, mirrorAPIservice, $routeParams, $location, $timeout) {
			mirrorAPIservice.getQuestions(function(res) {
				var path = $routeParams.path.split('-');
				//recursivly find the current set of questions, starting at root, using path querystring
				var findQuestions = function(questions, path) {
					if (path.length > 1) {
						return findQuestions(questions[path.shift()].answers[path.shift()].questions, path);
					} else {
						return questions;
					}
				}
				$scope.questions = findQuestions(res, path);
			});

			$scope.validate = function() {
				var currentQuestion = $scope.questions[$scope.currentQuestionIndex];
				var currentAnswer = currentQuestion.answers[currentQuestion.selectedAnswerIndex];
					//has an answer been given?
				if (answered(currentQuestion)) {
					console.log('answer given')
					//is there a subquestion?
					if (hasSubquestion(currentQuestion)) {
						console.log('subquestion')
						$location.path('/questionnaire/' + $routeParams.path + "-" + currentAnswer.nr + "-0");
					} else { //no subquestion	
						console.log('NO subquestion')					
						//are there more questions?
						var path = $routeParams.path.split('-');
						if ($scope.currentQuestionIndex < $scope.questions.length - 1) {
							console.log('more question on same level')
							//if we are on root, don't add path
							if (path.length > 2) {
								path.pop();
								$location.path('/questionnaire/' + path.join('-') + '-' + ++$scope.currentQuestionIndex);
							} else {
								$location.path('/questionnaire/' + ++$scope.currentQuestionIndex);
							}
						} else { //no more questions on this level
							console.log('no more questions on this level');
							//are there upper levels?

							//if (path.length > 1) {
							//	console.log('continue on parent branch');
								//continue on parent branch
								continueOnParentLevel(path, $location, $scope);//rename
							//} else { //no upper levels, do the score
							//	$location.path('/result/' + calculateScore($scope.questions));
							//}
						}
					};
				} else { //no answer has been given
					console.log('NO answer given');console.log(currentQuestion.answers[0])
					$scope.effect = "shake";
					$timeout(function() {
						$scope.effect = "";
					}, 500);
				}

			}

			$scope.currentQuestionIndex = $routeParams.path.split('-').pop() || 0;
			
			$scope.Steps = function(steps){
				return new Array(steps);
			}

			var hasSubquestion = function(question){
				if (question.type == "steps") {
					return false
				}else{
					return question.answers[question.selectedAnswerIndex].questions
				};
			}

			var answered = function(currentQuestion){
				if (currentQuestion.type == "steps") {
					return currentQuestion.selectedAnswerIndex!=null
				}else{
					return currentQuestion.answers[currentQuestion.selectedAnswerIndex]
				};
			}

			var calculateScore = function(questions) {
				var scoresAndFormulas = {
					score: 0,
					formulas: []
				};
				sumScoresAndGetFormulas(questions, scoresAndFormulas);

				angular.forEach(scoresAndFormulas.formulas, function(formula) {
					//eval the score with the factor, factor should be some kind of formula e.g: *(score*20/100)
					scoresAndFormulas.score = eval('scoresAndFormulas.score' + formula);
				});
				return scoresAndFormulas.score;
			}

			var sumScoresAndGetFormulas = function(questions, scoreAndformulas) {
				angular.forEach(questions, function(question) {
					angular.forEach(question.answers, function(answer) {
						if (answer.questions) {
							sumScoresAndGetFormulas(answer.questions, scoreAndformulas);
						};
					});
					if(question.selectedAnswerIndex){
						var questionScore = question.answers[question.selectedAnswerIndex].score;
						//is this a normal number or some kind of formula?
						if (!isNaN(parseFloat(questionScore))) {
							scoreAndformulas.score = scoreAndformulas.score + questionScore;
						} else { //save formula for later eval
							scoreAndformulas.formulas.push(questionScore);
						};
					}

				});
			}

			var continueOnParentLevel = function(path, $location, $scope) {
				//GET all questionnodes above current node
					var parentNodes = findParentNodes(mirrorAPIservice.questions, path.slice(0, path.length), []);
				//get index of parent node from path
				{
					var pathIndex = (path.length - 1)-2;
					var nodeIndex = pathIndex/2;
				}

				var newParentIndex = parseInt(path[pathIndex])+1;

				while(!parentNodes[newParentIndex] && pathIndex>0){
					pathIndex = pathIndex-2;
					newParentIndex = pathIndex/2;
				}

				if(pathIndex==0){//we are at the root
					$location.path('/result/' + calculateScore($scope.questions));
				}else{
					var parentAnswer = path[pathIndex];
					//var parentQuestion = path[pathIndex-1];
					path = path.slice(0,pathIndex);
					$location.path('/questionnaire/' + path.join('-') + '-' + newParentIndex);
				}
			}

			//find the upperlying nodes on the path
			var findParentNodes = function(questions, path, nodes) {
				if (path.length > 3) {
					var p = path.shift();
					var a = path.shift();

					nodes.push(questions);
					nodes.push(findParentNodes(questions[p].answers[a].questions, path, nodes));
					return nodes;
				} else {
					return questions;
				}
			}
		}
	])
	.controller('MyCtrl2', ['$scope', '$location',
		function($scope, $location) {
			$scope.start = function() {
				$location.path('/questionnaire')
			}
		}
	]).controller('resultCtrl', ['$scope', '$routeParams', '$location',
		function($scope, $routeParams, $location) {

			$scope.score = $routeParams.score;
		}
	])