function tmParser(str) {
  var output = {}; 
  var lines = str.trim().split("\n"); 
  var currentState = ""; 
  lines.forEach(function (line, index){
    line = line.trim(); // remove whitespace from current line
    // setting currentState
    if(line.endsWith(":")){
      currentState = line.slice(0, line.length-1); // get name of state
      output[currentState] = {}; // set currentState as a property (empty object) in output
    }
    // do nothing if we reach an empty line
    else if (line.replace(/\s/g, "") === "");
    // reading in transitions for currentState
    else {
      var x = line.split(',');
      x.forEach(function (element, dex) {
        x[dex] = element.trim();
      })
      output[currentState][x[0]] = x.slice(1); // set read character as property of currentState
    }
  })
  return output;
}


function generateTM(dataTM) {

  // alert if no start state. not a permanent solution
  // might help to have an error checking function
  if (dataTM.S === undefined) {
    alert('Start state S not defined');
    return undefined;
  } 

  // each state is an object with transitions as properties
  // instead of reference by state name, we will reference them
  // by their index, but first we will have to associate each state
  // with a number
  var tm = [{},{},{}]; // three empty objects to represent halt states, because they have no transitions 

  // we can do this by creating an array to hold each state's name
  // for every new state name we reach, we push the name onto an array
  var stateNames = ["A", "R", "H"]; // these are halt states, so we can include them by default 
  
  // get the names of states defined
  for (let state in dataTM) {  
    stateNames.push(state);
  }

  // replace "nextState" parameter in each transition to the index of said state
  // we do this by getting the "nextState" string, looking it up in our stateNames
  // array, and replacing it with the index of that state name
  for (let state in dataTM) {
    // console.log(state); // might help to uncomment this to see what's going on
    for (let transition in dataTM[state]) {
      // get current transition
      let t = dataTM[state][transition]; // t makes it easier to read this code
      let i = stateNames.indexOf(t[0]);  // returns -1 if not in array

      // if nextState is not in our stateNames, add it
      if (i === -1) {
        stateNames.push(t[0]); 
        i = stateNames.length - 1; // set i to the index of nextState (which is now the last element stateNames)
      }

      // set nextState to i
      t[0] = i;
    }
    // after we change each transition, push the entire state definition onto our tm data structure
    tm.push(dataTM[state]);
  }

  console.log(tm);
  console.log(stateNames);
  return {TM: tm, names: stateNames}; // return both 
}

function initializeTape(tapeInput) {
  return tapeInput.split('');
}






var testInput = `S:
  a, S, a, L
  b, secondState, b, R
  c, thirdState, c, S
secondState:
  a, nextState, a, L
  b, A, a, L
  c, R, a, L
thirdState:
  b, secondState, X, R

fourthState:
  a, H, r, R
A:
  d, S, r, R
  c, thirdState, w, L
`;
 
var zz = tmParser(testInput);
var zzTM = generateTM(zz);

// accept even number of a's
var realTMInput = `S: 
  a, 2, a, R
  _, A, _, L
2: 
  a, S, a, R
  _, R, _, S
`;

var realdataTM = tmParser(realTMInput);
var realTM = generateTM(realdataTM);
var tape = initializeTape("aaa");

var TM = {};

function installTM() {
  var tm_code = ''; // change this to retrieve user input from "code" section
  var tape_input = ''; // do the same but with the "tape" section

  // initialize tape
  
  // generate TM
  
  // 
  
  // hook interface to TM

}








