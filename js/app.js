(function() {
	var app = angular.module('dfaMachine', []);

	var buildTransitionFn = function(states, alphabet) {
		var transitionFn = {};
		for (var i = 0; i < states.length; i++) {
			var el = {};
			transitionFn[states[i].description] = el;
			for(var j = 0; j < alphabet.length; j++) {
				el[alphabet[j]] = "";
			}
		}
		return transitionFn;
	}

	app.controller('DFAController', function($scope) {
		this.string = "abbbb";
		this.alphabet = "ab";
		this.states = [
			{
				description: "q0",
				accepted: false
			},
			{
				description: "q1",
				accepted: true
			}
		];
		this.initialState = 'q0';
		this.acceptedStates = ['q1'];
		this.transitionFn = {
			"q0": {
				"a": "q0",
				"b": "q1"
			},
			"q1": {
				"a": "q0",
				"b": "q1"
			}
		}


		this.getSymbols = function() {
			return this.alphabet.split('');
		};

		this.test = function(w) {
			/* 0) Validaciones:
				- Revisar que los caracteres en w estén en el alfabeto
			*/
			// 1) Dividir string en caracters
			// var currentState = initialState;
			// for (var i = 0; i < w.length; i++) {
			// 	currentSymbol = w[i]; // obtener el simbolo en la posicion i
			// 	currentState = transition(currentState, s);
			// }

			// // 2) Revisar si el estado final es de aceptacion
			// return currentState.accepted;
			// console.log("string: " + this.string);
			this.testByStep(this.string, false);
		};


		this.testByStep = function(w, step) {
			/* 0) Validaciones:
				- Revisar que los caracteres en w estén en el alfabeto
			*/
			// 1) Dividir string en caracters
			this.currentState = this.initialState;
			for (var i = 0; i < w.length; i++) {
				var s = w[i]; // obtener el simbolo en la posicion i
				this.currentState = this.transition(this.currentState, s);
				if(step) {
					// detener la ejecucion hasta que el usuario pulse Next
					
				}
			}

			// 2) Revisar si el estado final es de aceptacion
			console.log("Estado final: " + this.state);

			// 3) Verificar si state está en acceptedStates
			var accepted = false;
			if ( this.acceptedStates.indexOf(this.state) >= 0) {
				accepted = true;
			}
			console.log("Is in the array:  " + accepted);
			return this.state;
		};

		this.transition = function(q, s) {
			// return transitionFn['q1']['b']; //  return q0
			return this.transitionFn[q][s];
		}

		this.log = function() {
			console.log(angular.toJson(this.transitionFn, true));
		}

	});

	app.controller('StatesController', function($scope) {
		this.state = {};

		this.addState = function(states, alphabet) {
			states.push(this.state);
			this.state = {};
			// var a = buildTransitionFn(states, alphabet);
			// console.log(angular.toJson(a, true));
		};

		this.removeState = function(states, index, alphabet) {
			states.splice(index, 1);
			// transitionFn = buildTransitionFn(states, alphabet);
			// console.log(angular.toJson(transitionFn, true));
		};
	});

})();