
// ****************************************
//	redesign of the original test.js file
//	the simulator will loosely follow the
//  paradigm of the activity lifecycle 
//  in Android, where each state change
//  in the simulator is followed by a 
//  callback. this makes it easier to 
//	add or change additional behavior
//  without having to change core functions
// ****************************************

// ********************
// * simulator states *
// ********************
// uninstalled: user has not yet programmed a machine and hit the install button
// ready: machine is installed, but has not yet been run
// running: machine is currently running
// paused: machine was interrupted by user, reaching a final state, or by runtime error
// finished: machine has reached final state or runtime error, and will not continue to run unless restarted or reinstalled

// The simulator has its own internal states, listed above, as well as its own properties.
// These simulator states are not to be confused with the user's programmed Turing Machine 
// states. 

var simulator = {
	// properties of simulator
	speed: document.getElementById('speed').value, // delay between step intervals
	clockID: null, // id of interval timer for setInterval()
	simState: 'uninstalled', // simulator state
	// virtual TM
	tm: [],
	stateNames: [],
	currentState: null,
	tape = [],
	tapeHead: 25000,
	muted: false,
	transitionStack: [],
	// simulator state change callbacks
	onInstall: function() {},
	onStart: function() {},
	onResume: function() {},
	onPause: function() {},
	onFinish: function() {},
	// core simulation functions
	install: function() {

		onInstall()
	},
	play: function() {
		switch(simState) {
			case 'uninstalled': this.postMessage('machine not installed') // machine not installed
				break
			case 'running': // machine already running
				break
				// no break statement to continue execution of code common to these cases
			case 'finished': install() // reset tape
			case 'ready': onStart() // call onStart
			case 'paused': // actually start the machine

				onResume()
				break
			default: alert('somehow simState is not what it is supposed to be') // this is terrible
		}
	},
	compute: function() {

	},
	stop: function() {

	},
	step: function() {

	},
	stepBack: function() {

	},
	// helpers or side functions
	postMessage: function() {

	},
	mute: function() {

	},
}