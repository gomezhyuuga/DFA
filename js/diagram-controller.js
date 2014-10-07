(function() {
	var app = angular.module('diagram-controller', []);

	app.controller('diagramController', ["$scope", function($scope) {
		this.paper_width = 700;
		this.paper_height = 400;

		this.graph = new joint.dia.Graph;

		this.paper = new joint.dia.Paper({
		    el: $('#diagram'),
		    width: this.paper_width,
		    height: this.paper_height,
		    gridSize: 1,
		    model: this.graph
		});

		this.cells = {};

		this.create = function(dfa) {
			this.graph.resetCells();
			this.cells = {};
			var links = [];
			// 1) Crear un círculo por cada estado
			for (var i = 0; i < dfa.states.length; i++) {
				var s = dfa.states[i];
				var start = false;
				if (dfa.initial_state === s.description) {
					start = true;
				}
				var cell = this.state(
					getRandomInt(70, this.paper_width-100),
					getRandomInt(70, this.paper_height-100),
					s.description,
					s.accepted,
					start);
				// console.log(cell);
				// cell.findView(this.paper).highlight();
				this.cells[s.description] = cell;
			}
			// 2) Crear enlaces
			for (var q in dfa.transition_function) {
				var flip = 1;
				for (var s in dfa.transition_function[q]) {
					var source = this.cells[q];
					var target = dfa.transition_function[q][s];
					// cambiar vertex si self loop
					var vert = [];
					if (source === this.cells[target]) {
						vert.push({
							x: this.cells[q].get('position').x + 60,
							y: this.cells[q].get('position').y + 60*flip
						});
					}
					var l = this.link(source, this.cells[target], s, vert);

					flip = flip * (-1);
				}
			}
		}

		this.state = function(x, y, label, accepted, start) {
		    
		    var props = {
		        position: { x: x, y: y },
		        size: { width: 40, height: 40 },
		        attrs: { text : { text: label }}
		    };
		    var cell;
		    if (accepted) {
		    	cell = new joint.shapes.fsa.EndState(props);
		    } else if(start) {
		    	cell = new joint.shapes.fsa.StartState(props);
		    } else {
		    	cell = new joint.shapes.fsa.State(props);
		    }

		    if (start) {
		    	cell.attr({
		    		circle: { fill: '#e1fde5', stroke: '#3a5641' }
		    	});
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

		this.highlight = function(state) {
			for(var s in this.cells) {
				// Remover highlight
				this.cells[s].attr({
					circle: { stroke: '#333' }
				});
			}
			this.cells[state].attr({
				circle: { stroke: 'red' }
			});
		}

		function getRandomInt(min, max) {
		  return Math.floor(Math.random() * (max - min)) + min;
		}

		this.paper.on('blank:pointerclick', function(evt, x, y) {
			// console.log($scope.$parent.dfa);

			// $scope.$parent.dfa.addState();

			// var cell = $scope.diag.state(
			// 	getRandomInt(70, this.paper_width-100),
			// 	getRandomInt(70, this.paper_height-100),
			// 	"ass", true);
		});

	}]);
})();