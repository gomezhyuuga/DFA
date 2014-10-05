(function() {
	var app = angular.module('dfaMachine', ['dfa-directives']);

	app.controller('diagramController', ["$scope", function($scope) {
		this.paper_width = 900;
		this.paper_height = 400;

		this.graph = new joint.dia.Graph;

		this.paper = new joint.dia.Paper({
		    el: $('#diagram'),
		    width: this.paper_width,
		    height: this.paper_height,
		    gridSize: 1,
		    model: this.graph
		});

		this.create = function(dfa) {
			var cells = {};
			var links = [];
			// 1) Crear un círculo por cada estado
			for (var i = 0; i < dfa.states.length; i++) {
				console.log("Creating state");
				var s = dfa.states[i];
				var cell = this.state(
					getRandomInt(70, this.paper_width-100),
					getRandomInt(70, this.paper_height-100),
					s.description,
					s.accepted);
				cells[s.description] = cell;
			}
			// 2) Crear enlaces
			for (var q in dfa.transition_function) {
				for (var s in dfa.transition_function[q]) {
					console.log(cells[q].get('position').x);
					var source = cells[q];
					var target = dfa.transition_function[q][s];
					// cambiar vertex si self loop
					var vert = [];
					if (source === cells[target]) {
						vert.push({
							x: cells[q].get('position').x + 80,
							y: cells[q].get('position').y + 80
						});
					}
					console.log(vert);
					var l = this.link(source, cells[target], s, vert);
				}
			}
		}

		this.state = function(x, y, label, accepted) {
		    
		    var props = {
		        position: { x: x, y: y },
		        size: { width: 60, height: 60 },
		        attrs: { text : { text: label }}
		    };
		    var cell;
		    if (accepted) {
		    	cell = new joint.shapes.fsa.EndState(props);
		    } else {
		    	cell = new joint.shapes.fsa.State(props);
		    }
		    
		    this.graph.addCell(cell);
		    return cell;
		};

		this.link = function(source, target, label, vertices) {
		    var cell = new joint.shapes.fsa.Arrow({
		        source: { id: source.id },
		        target: { id: target.id },
		        labels: [{ position: .5, attrs: { text: { text: label || '', 'font-weight': 'bold' } } }],
		        vertices: vertices || []
		    });
		    // cell.set('router', { name: 'manhattan' });
		    // cell.set('router', { name: 'metro' });
		    cell.set('router', { name: 'orthogonal' });
		    cell.attr({
		    	'.link-tools': { style: "opacity:0" }
		    });
		    this.graph.addCell(cell);
		    return cell;
		}

		function getRandomInt(min, max) {
		  return Math.floor(Math.random() * (max - min)) + min;
		}

		this.paper.on('blank:pointerclick', function(evt, x, y) {
			console.log($scope.$parent.dfa);

			// console.log(paper);
			// states.push(state(getRandomInt(5, paper_width-40), getRandomInt(5, paper_height-40), "q0"));
			// console.log(states);
		});

	}]);

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
		this.string = "abbb";

		this.current_state = "";
		this.accepted = false;
		this.next_symbol_index = 0;
		this.finished = false;


		this.test = function() {
			this.accepted = this.run();
			this.finished = true;
			this.next_symbol_index = this.string.length;
		}
		this.testByStep = function() {
			// Va empezando
			if (this.next_symbol_index == 0) {
				this.current_state = this.initial_state;
			}
			// Aún no termina de probar todo el string
			if (this.next_symbol_index < this.string.length) {
				var symbol = this.string[this.next_symbol_index];
				this.current_state = this.transition(this.current_state, symbol);
				this.next_symbol_index++;
			} else { // Terminó de probar todo el string
				this.finished = true;
				this.accepted = ( this.accepted_states.indexOf(this.current_state) >= 0 );
			}
		}
		this.restart = function() {
			this.next_symbol_index = 0;
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

		this.getSymbols = function() {
			return this.alphabet.split('');
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
		this.initialize();
		this.accepted_states = buildAcceptedStates(this.states);
		this.state = emptyState(this.statesCounter);
	}]);

})();