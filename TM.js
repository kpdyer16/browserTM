function tmParser(str) {
  var output = {};
  var lines = str.trim().split("\n");
  var currentState = "";
  lines.forEach(function (line, index){
    //ignore comments
    var commentIndex = line.indexOf('//')
    if (commentIndex !== -1) {
      line = line.substr(0,commentIndex)
    }

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
  // error handling
  //var errors = errorCheck(output);
  //return {e: errors, tm: output};

  return output;
}





function errorCheck(transitions) { return } /*
  var errors = [];

  // A, R, and H are not defined states
  if (transitions.A !== undefined) {
    // throw error
  }
  if (transitions.R !== undefined) {
    // throw error
  }
  if (transitions.H !== undefined) {
    // throw error
  }

  transitions.A = {};
  transitions.R = {};
  transitions.H = {};

  transitions.forEach(states) {
    states.forEach(t) {
      // each nextState doesnt exist
      if (transitions[t[0]] === undefined) {
        // dont throw error
        // gonna move this somewhere else. dont ask me where
      }

      // read symbol is not one character
      if (t.length !== 1) {
        // throw error
      }

      // write symbol is not one character
      if (t[1].length !== 1) {
        // throw error
      }

      // tape direction is not L || R || S
      if (t[2] !== "L" && t[2] !== "R" && t[2] !== "S") {
        // throw error
      }
    }

  }
  return errors;
}
*/


function initializeTM(tmInput) {
  return errorCheck(tmParser(tmInput))
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

//var zz = tmParser(testInput);
//var zzTM = generateTM(zz);

// accept even number of a's
var realTMInput = `S:
  a, 2, a, R
  _, A, _, L
2:
  a, S, a, R
  _, R, _, S
`;

function initializeTape(tapeInput) {
  let tape = tapeInput.split('')
  tape.forEach(function (char, index) {
    if (char === ' ' || char === '_') {
      tape[index] = undefined
    }
  })
  return tape
}
