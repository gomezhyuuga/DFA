var aut1 = {
	language: "Tiene un número par de 1s",
	alphabet: "01",
	initial_state: "q0",
	accepted_states: ["q0"],
	states: [
		{
			description: "q0",
			accepted: true
		},
		{
			description: "q1",
			accepted: false
		},
	],
	transition_function: {
		"q0": {
			"0": "q0",
			"1": "q1"
		},
		"q1": {
			"0": "q1",
			"1": "q0"
		}
	}
}

var aut2 = {
	language: "Srting vacío o aquellos que terminan en 0",
	alphabet: "01",
	initial_state: "q0",
	accepted_states: ["q0"],
	states: [
		{
			description: "q0",
			accepted: true
		},
		{
			description: "q1",
			accepted: false
		}
	],
	transition_function: {
		"q0": {
			"0": "q0",
			"1": "q1"
		},
		"q1": {
			"0": "q0",
			"1": "q1"
		}
	}
}

var aut3 = {
	language: "Comienza y termina con el mismo símbolo",
	alphabet: "01",
	initial_state: "q0",
	accepted_states: ["q0", "q3"],
	states: [
		{
			description: "q0",
			accepted: false
		},
		{
			description: "q1",
			accepted: true
		},
		{
			description: "q2",
			accepted: false
		},
		{
			description: "q3",
			accepted: true
		},
		{
			description: "q4",
			accepted: false
		}
	],
	transition_function: {
		"q0": {
			"0": "q1",
			"1": "q3"
		},
		"q1": {
			"0": "q1",
			"1": "q2"
		},
		"q2": {
			"0": "q1",
			"1": "q2"
		},
		"q3": {
			"0": "q4",
			"1": "q3"
		},
		"q4": {
			"0": "q4",
			"1": "q3"
		}
	}
}