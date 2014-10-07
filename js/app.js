(function() {
	var app = angular.module('dfaMachine', ['ngSanitize', 'dfa-directives', 'diagram-controller']);

	app.controller('dfaController', ["$scope" , function($scope) {
		// HELPER VARS
		this.statesCounter = 0;

		// INSTANCE VARS
		this.alphabet = "";
		this.initial_state = "";
		this.states = [];
		this.accepted_states = [];
		this.transition_function = {};


		// Helper Functions
		var emptyState, buildAcceptedStates;

		// Machine running vars
		this.string = "";

		this.current_state = "";
		this.accepted = false;
		this.next_symbol_index = -1;
		this.next_symbol = '';
		this.finished = false;


		this.test = function() {
			// Create diagram
			$scope.$$childHead.diag.create(this);
			this.accepted = this.run();
			this.finished = true;
			this.next_symbol_index = this.string.length;
		}
		this.testByStep = function() {
			// Va empezando
			if (this.next_symbol_index == -1 ) {
				this.current_state = this.initial_state;
				this.next_symbol = this.string[0];
				// Create diagram
				$scope.$$childHead.diag.create(this);
				// Highlight el estado
				$scope.$$childHead.diag.highlight(this.current_state);
				this.next_symbol_index++;
			} else if (this.next_symbol_index < this.string.length) { // Ya empezó pero aún no termina de probar todo el string
				var symbol = this.string[this.next_symbol_index];
				this.current_state = this.transition(this.current_state, symbol);
				this.next_symbol_index++;
				this.next_symbol = this.string[this.next_symbol_index];
				// Highlight el estado
				$scope.$$childHead.diag.highlight(this.current_state);
			}

			if (this.next_symbol_index == this.string.length) { // Terminó de probar todo el string
				this.finished = true;
				this.accepted = ( this.accepted_states.indexOf(this.current_state) >= 0 );
			}
		}
		this.restart = function() {
			this.next_symbol_index = -1;
			this.accepted = false;
			this.finished = false;
			this.current_state = "";
		}
		this.run = function() {
			// this.next_symbol_index = 0;
			this.current_state = this.initial_state;
			for (var i = 0; i < this.string.length; i++) {
				var s = this.string[i]; // obtener el simbolo en la posicion i
				this.current_state = this.transition(this.current_state, s);
			}
			$scope.$$childHead.diag.highlight(this.current_state); // Highlight
			// 2) True si lo acepta, false si no
			return (this.accepted_states.indexOf(this.current_state) >= 0);
		}
		this.transition = function(q, s) {
			// return transitionFn['q1']['b']; //  return q0
			return this.transition_function[q][s];
		}

		// Instance Functions
		this.addState = function() {
			this.states.push(this.state);
			this.statesCounter++;

			// Update accepted_states
			this.accepted_states = buildAcceptedStates(this.states);

			// Update transition_function
			updateTransitionFunction(this.transition_function, this.getSymbols(), this.state);

			// Add the state to the diagram

			// Empty state
			this.state = emptyState(this.statesCounter);
		};

		this.removeState = function(index) {
			var deleted = this.states.splice(index, 1)[0];
			this.statesCounter--;
			this.state = emptyState(this.statesCounter);

			if (this.statesCounter == 0 || deleted.description === this.initial_state) {
				this.initial_state = "";
			}

			// Update accepted_states
			this.accepted_states = buildAcceptedStates(this.states);

			// Update transition_function
			this.transition_function = buildTransitionFunction(this.states, this.getSymbols());
		}

		this.showInput = function() {
			var input = "";
			for (var i = 0; i < this.string.length; i++) {
				if ( (i+1) == this.next_symbol_index) {
					input += "<strong>" + this.string[i] + "</strong>";
				} else {
					input += this.string[i];
				}
			}
			return input;
		}

		this.getSymbols = function() {
			return this.alphabet.split('');
		}
		this.nextSymbol = function() {
			return this.alphabet[this.next_symbol_index];
		}

		this.refreshTransitionFunction = function() {
			this.transition_function = buildTransitionFunction(this.states, this.getSymbols());
		}

		// Helper Functions
		buildAcceptedStates = function(states) {
			var accepted_states = [];
			for(var i = 0; i < states.length; i++) {
				if (states[i].accepted) {
					accepted_states.push(states[i].description);
				}
			}
			return accepted_states;
		}

		emptyState = function(counter) {
			return {
				description: "q" + counter,
				accepted: false
			};
		}
		var buildTransitionFunction = function(states, symbols) {
			var transitionFn = {};
			for (var i = 0; i < states.length; i++) {
				var el = {};
				transitionFn[states[i].description] = el;
				for(var j = 0; j < symbols.length; j++) {
					el[symbols[j]] = "";
				}
			}
			return transitionFn;
		}
		var updateTransitionFunction = function(transitionFn, symbols, state) {
			var el = {};
			for (var i = 0; i < symbols.length; i++) {
				el[symbols[i]] = "";
			}
			transitionFn[state.description] = el;
		}

		// Sample initial input
		this.initialize = function() {
			this.statesCounter = 2;
			this.string = "abbababb";
			this.alphabet = "ab";
			this.initial_state = "q0";

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
			this.transition_function = {
				"q0": {
					"a": "q0",
					"b": "q1"
				},
				"q1": {
					"a": "q0",
					"b": "q1"
				}
			};
		}
		// this.initialize();
		this.accepted_states = buildAcceptedStates(this.states);
		this.state = emptyState(this.statesCounter);
	}]);

})();