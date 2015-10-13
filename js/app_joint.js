var states = [];
var alphabet = "abc";

var paper_width = 900;
var paper_height = 500;

var graph = new joint.dia.Graph;

var paper = new joint.dia.Paper({
    el: $('#diagram'),
    width: paper_width,
    height: paper_height,
    gridSize: 1,
    model: graph
});


paper.on('blank:pointerclick', function(evt, x, y) {
	console.log("pulsaste ");
	// console.log(paper);
	states.push(state(getRandomInt(5, paper_width-40), getRandomInt(5, paper_height-40), "q0"));
	console.log(states);
});

function state(x, y, label) {
    
    var cell = new joint.shapes.fsa.State({
        position: { x: x, y: y },
        inPorts: ["a", "b"],
        size: { width: 60, height: 60 },
        attrs: { text : { text: label }}
    });
    graph.addCell(cell);
    return cell;
};

function link(source, target, label, vertices) {
    
    var cell = new joint.shapes.fsa.Arrow({
        source: { id: source.id },
        target: { id: target.id },
        labels: [{ position: .5, attrs: { text: { text: label || '', 'font-weight': 'bold' } } }],
        vertices: vertices || []
    });
    graph.addCell(cell);
    return cell;
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}