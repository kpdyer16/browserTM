
// todo
// add universal machine state logic
// states: uninstalled, stopped, running

var speed = document.getElementById('speed').value // delay between step intervals
var clockID = null
var machineStatus = 'uninstalled'

var currentState
var tm
var tape
var tapeHead
var startState
var stopped = false
var muted = false

var transitionStack = []

function printstuff() {
	console.log('current state: ' + currentState)
	console.log('tape: |' + tape + '|')
	console.log('tape head is at: ' + tapeHead)
	console.log('clockID: ' + clockID)
	console.log('___________________________________')
}

function postMessage(message) {
	document.getElementById('message-box').value += message + '\n'
}

function play() {
	// check if tm is installed
	if (machineStatus === 'uninstalled') {
		postMessage('Machine not installed')
	} else if (machineStatus === 'running') {
		postMessage('Already running')
	} else {
		machineStatus = 'running'
		if (speed != 0) {
			if (!muted) {
				document.getElementById('rebota').play()
			}
			
			clockID = setInterval(function() {
				// printstuff()
				var stepMessage = step()
				if (stepMessage) {
					clearInterval(clockID)
					postMessage(stepMessage)
					if (!muted) {
						document.getElementById('rebota').pause()
					}
				}
			}, speed)
		} else {
			var haltMessage = compute()
			if (haltMessage) {
				postMessage(haltMessage)
			}
		}
	}
}

function restartIfRunning() {
	if (machineStatus === 'running') {
		stop()
		play()
	}
}

function compute() {
	while(!stopped) {

		var transitions = tm[currentState]
		var readSymbol = readCharacter(tape, tapeHead)
		if (transitions) {
			if (!transitions[readSymbol]) {
				updateTape(tape, tapeHead)
				return 'no suitable transition'
			}
			currentState = transitions[readSymbol][0]
			writeCharacter(transitions[readSymbol][1])
			tapeHead += directionInt(transitions[readSymbol][2])
		} else {
			updateTape(tape, tapeHead)
			switch (currentState) {
					case 'A': return 'Machine halted: Accept state reached'
					case 'R': return 'Machine halted: Reject state reached'
					case 'H': return 'Machine halted: Halt state reached'
					default: return 'Machine halted: ' + currentState + ' is not a state'
			}
		}
	}
}

function stop() {
	if (!muted) {
		document.getElementById('rebota').pause()
	}

	stopped = true
	if (machineStatus === 'running') {
		clearInterval(clockID)
		machineStatus = 'installed'
	} else {
		postMessage('machine not running')
	}
}

function resume() {
	console.log('resume pressed')
}

function clear() {
	postMessage('clear pressed')
	document.getElementById('message-box').value = ''
	// clear all textarea objects
	// stop machine if running
	// set tm, tape objects to null
}

function changeSpeed(value) {
	speed = value
	restartIfRunning()
}

withX = `S:
		0, S, 0, R
		1, S, 0, R
		_, inc, X, S
	inc:
		0, S, 1, R
		1, inc, 0, L
		_, end, 1, R
		X, inc, _, L
	end:
		0, end, 0, R
		1, end, 1, R
		_, H, X, S`

withoutX = `S:
		0, S, 0, R
		1, S, 0, R
		_, inc, _, L
	inc:
		0, S, 1, R
		1, inc, 0, L
		_, H, 1, S`

function install() {

	postMessage('Installing program...')
	tm = tmParser(document.getElementById('input').value)
	tape = initializeTape(document.getElementById('tape-input').value)

	startState = document.getElementById('startState').value
	currentState = startState
	tapeHead = 0
	machineStatus = 'installed'
	updateTape(tape, tapeHead)
	postMessage('Successfully installed program')
}



function step() {
	var transitions = tm[currentState]
	var readSymbol = readCharacter(tape, tapeHead)
	if (transitions !== undefined) {
		transitionStack.push({state: currentState, read: readSymbol, tHead: tapeHead})

		if(transitions[readSymbol] === undefined) {
			return 'Machine halted: No suitable transition found'
		}

		currentState = transitions[readSymbol][0]
		writeCharacter(transitions[readSymbol][1])
		tapeHead += directionInt(transitions[readSymbol][2])
		updateTape(tape, tapeHead)
	} else {
		switch (currentState) {
				case 'A': return 'Machine halted: Accept state reached'
				case 'R': return 'Machine halted: Reject state reached'
				case 'H': return 'Machine halted: Halt state reached'
				default: return 'Machine halted: ' + currentState + ' is not a state'
		}
	}
}

function stepBack() {
	var prevConfig = transitionStack.pop()
	if (prevConfig !== undefined) {
		tapeHead = prevConfig.tHead
		writeCharacter(prevConfig.read)
		currentState = prevConfig.state
	}
}

// function directionInt(direction) {
// 	switch(direction) {
// 		case 'L':
// 		case 'l': return -1
// 		case 'R':
// 		case 'r': return 1
// 		case 'S':
// 		case 's': return 0
// 		default: console.log('invalid direction')
// 	}
// }

function readCharacter() {
	if (tape[tapeHead] === undefined) {
		return '_'
	} else {
		return tape[tapeHead]
	}
}

function writeCharacter(char) {
	if (char === '_' || char === ' ') {
		char = undefined
	}
	if (tapeHead === -1) {
		tape.unshift(char)
		tapeHead = 0
	} else if (tapeHead === tape.length) {
		tape.push(char)
	} else {
		tape[tapeHead] = char
	}
}

var stateNames
var tm2
function install2() {
	var generatedTM = generateTM(tmParser(document.getElementById('input').value))
	tm2 = generatedTM.turing
	stateNames = generatedTM.names
	tape = initializeTape(document.getElementById('tape-input').value)

	startState = 3
	currentState = startState
	tapeHead = 0
	updateTape(tape, tapeHead)
}

function play2() {
	stopped = false
	compute2()
}

function compute2() {
	while(!stopped) {

		var transitions = tm2[currentState]
		var readSymbol = readCharacter(tape, tapeHead)
		if (transitions) {
			if (!transitions[readSymbol]) {
				updateTape(tape, tapeHead)
				return 'no suitable transition'
			}
			currentState = transitions[readSymbol][0]
			writeCharacter(transitions[readSymbol][1])
			tapeHead += transitions[readSymbol][2]
		} else {
			updateTape(tape, tapeHead)
			switch (currentState) {
					case 0: return 'Machine halted: Accept state reached'
					case 1: return 'Machine halted: Reject state reached'
					case 2: return 'Machine halted: Halt state reached'
					default: return 'Machine halted: ' + currentState + ' is not a state'
			}
		}
	}
}

function mute() {
	muted = !muted
	if (muted) {
		document.getElementById('sound').innerHTML = 'unmute'
	} else {
		document.getElementById('sound').innerHTML = 'mute'
	}
}

document.getElementById('play2').addEventListener('click', play2, false)
document.getElementById('install2').addEventListener('click', install2, false)
document.getElementById('sound').addEventListener('click', mute, false)


document.getElementById('play').addEventListener('click', play, false)
document.getElementById('resume').addEventListener('click', resume, false)
document.getElementById('stop').addEventListener('click', stop, false)
document.getElementById('clear').addEventListener('click', clear, false)
document.getElementById('install').addEventListener('click', install, false)
document.getElementById('step').addEventListener('click', step, false)
document.getElementById('stepBack').addEventListener('click', stepBack, false)
document.getElementById('speed').addEventListener('change', function() { changeSpeed(this.value) }, false)
document.getElementById('input').addEventListener('keydown', function(e) {
	var start, end;
	if (e.keyCode === 9) {
		start = this.selectionStart
		end = this.selectionEnd
		e.preventDefault()
		this.value = this.value.substring(0,start) + '   ' + this.value.substring(end)
		this.selectionStart = this.selectionEnd = start + 3
	}
})


function testPerformance() {
	var sum1 = 0, sum2 = 0
	for (var i = 0; i < 10; i++) {
		install()
		let t0 = performance.now()
		play()
		let t1 = performance.now()
		sum1 += (t1 - t0)
		console.log(sum1)
	}

	for (var i = 0; i < 10; i++) {
		install2()
		let t0 = performance.now()
		play2()
		let t1 = performance.now()
		sum2 += (t1 - t0)
		console.log(sum2)
	}

	sum1 = sum1 / 10
	sum2 = sum2 / 10

	console.log('Average performance for play1: ' + sum1)
	console.log('Average performance for play1: ' + sum2)

}
