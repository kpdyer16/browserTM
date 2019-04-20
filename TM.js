function tmParser(str) {
  var output = {};
  var lines = str.split("\n");
  var newState = false;
  var currentState = "";
  lines.forEach(function (line, index){
    line.trim();
    if(line.endsWith(":")){
      currentState = line.slice(0, line.length-1);
      output[currentState] = {};
    }
    else {
      var x = line.split(',');
      output[currentState][x[0]] = x.slice(1);
    }
  })
  console.log(output);
  return output;
}

var testInput = `S:
  a, nextState, write, direction1
  b, secondState, write, direction1
  c, thirdState, write, direction1
secondState:
  a, nextState, write, direction1
  b, nextState, write, direction1
  c, nextState, write, direction
thirdState:
  blah, secondState, writeChar, R
`;

console.log(tmParser(testInput))
