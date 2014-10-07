(function() {
	var app = angular.module('dfa-directives', []);

	app.directive('navbar', function() {
		return {
			restrict: 'E',
			templateUrl: 'navbar.html'
		}
	});

	app.directive('footerContent', function() {
		return {
			restrict: 'E',
			templateUrl: 'footer.html'
		}
	});

	app.directive('diagram', function() {
		return {
			restrict: 'E',
			templateUrl: "diagram.html"
		}
	});
	app.directive('statesList', function() {
		return {
			restrict: 'E',
			templateUrl: "states-list.html"
		}
	});

	app.directive('transitionFunction', function() {
		return {
			restrict: 'E',
			templateUrl: 'transition-function.html',
			scope: {
				dfa: '=info'
			}
		}
	});

	app.directive('inputData', function() {
		return {
			restrict: 'E',
			templateUrl: 'input-data.html',
			scope: {
				dfa: '=info'
			}
		}
	});

	app.directive('runControls', function() {
		return {
			restrict: 'E',
			templateUrl: 'run-controls.html'
		}
	});

	app.directive('inspection', function() {
		return {
			restrict: 'E',
			templateUrl: 'inspection.html',
			scope: {
				dfa: '=info'
			}
		}
	});
})();