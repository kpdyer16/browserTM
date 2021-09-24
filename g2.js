
function generateTM(initial_tm) {
  var tm = [{},{},{}]
  var stateNames = ['A','R','H'].concat(Object.keys(initial_tm))

  // for each state in initial_tm, get each transition and
  // replace nextState value with its index in the
  // stateNames array. If not in stateNames, add it
  for (var state in initial_tm) {
    var newState = {}
    for (var transition in initial_tm[state]) {
      var nextStateName = initial_tm[state][transition][0]
      var nextStateIndex, newTransition // time to get the index of nextState

      // if nextState is not in stateNames
      if ((nextStateIndex = stateNames.indexOf(nextStateName)) === -1) {
        // Array.prototype.push returns the new length of the array
        nextStateIndex = stateNames.push(nextStateName) - 1
      }

      newTransition = initial_tm[state][transition]
      newTransition[0] = nextStateIndex
      newTransition[2] = directionInt(newTransition[2])
      newState[transition] = newTransition
    }
    tm[stateNames.indexOf(state)] = newState
  }
  return {turing: tm, names: stateNames}
}


function directionInt(direction) {
	switch(direction) {
		case 'L':
		case 'l':
    case '<': return -1
		case 'R':
		case 'r':
    case '>': return 1
		case 'S':
		case 's': return 0
		default: console.log('invalid direction')
	}
}

const enhance = generateTM


function charType(char) {
  switch(char) {
    case 'a':
    case 'b':
    case 'c':
    case 'd':
    case 'e':
    case 'f':
    case 'g':
    case 'h':
    case 'i':
    case 'j':
    case 'k':
    case 'l':
    case 'm':
    case 'n':
    case 'o':
    case 'p':
    case 'q':
    case 'r':
    case 's':
    case 't':
    case 'u':
    case 'v':
    case 'w':
    case 'x':
    case 'y':
    case 'z': 
    case '0':
    case '1':
    case '2':
    case '3':
    case '4':
    case '5':
    case '6':
    case '7':
    case '8':
    case '9': return 'an' // alphanumeric
    case '\n': return 'nl' // new line
    case ':': return ':' // colon
    case ',': return ',' // comma

    default: return false
  }
}

function lex(source) {
  let lineNum = 1
  let lastLineIndex = -1
  let multiChar = /\w\w+/, singleChar = /\w/, symbolChar = /\S/, comment = /\/\/.*/
  let tokenRegex = /\w+|\/\/.*|\S|\n/g
  let tokens = []
  let result
  while((result = tokenRegex.exec(str)) !== null) {
    if (result[0] === '\n') { 
      lineNum++ // track number of lines passed, and index of the end of last line
      lastLineIndex = result.index
    } else if (comment.test(result[0])) { // ignore comments
    } else {
      // give each token a type. These types are considered terminals for the CFG
      let type
      if (multiChar.test(result[0])) {
        type = 'multiChar'
      } else if (singleChar.test(result[0])) {
        type = 'singleChar'
      } else if (symbolChar.test(result[0])) {
        // singleChars are alphanumeric, so any string that enters this branch is a non-white space symbol
        switch(result[0]) {
          case ':': type = ':'; break // colons are tape symbols or they follow state definitions 
          case ',': type = ','; break // commas separate transition definition parameters
          default: type = 'symbol'
        }
      } else {
        // invalid token
        throw Error('invalid token found: ' + result[0]) // I don't think this would catch anything, but just in case
      }
      // combine lexeme, type, line, and column number into one object, and add to tokens queue
      tokens.push({value: result[0], type: type, line: lineNum, col: (result.index - lastLineIndex)})
    }
  }
  return tokens
}


// CFG for a TM encoding
// 1 S -> N:TS 
// 2 S -> ''
// 3 T -> T'T 
// 4 T -> ''
// 5 T' -> R,N,R,D
// 6 R -> singleChar 
// 7 R -> symbol 
// 8 R -> : 
// 9 R -> comma
// 10 N -> multiChar 
// 11 N -> singleChar
// 12 C -> colon
// 13 D -> singleChar 
// 14 D -> symbol

// 1 S -> <Def> <Trans> <S>
// 2 S -> <>
// 3 Def -> <Name>:
// 4 Trans -> <char>,<Name>,<char>,<char> <Trans>
// 5 Trans -> <>
// 6 Name -> [a-zA-Z0-9_]+
// 7 char -> [a-zA-Z0-9_`~!@#$%^&*()-=+[]{}\|'";:,.<>/?]

/*
singleChar : singleChar , singleChar , singleChar , singleChar singleChar , multiChar , singleChar , singleChar singleChar 
, multiChar , singleChar , singleChar multiChar : singleChar , multiChar , singleChar , singleChar singleChar , singleChar 
, singleChar , singleChar singleChar , singleChar , singleChar , singleChar multiChar : singleChar , multiChar , singleChar 
, singleChar multiChar : singleChar , singleChar , singleChar, singleChar singleChar : singleChar , singleChar , singleChar 
, singleChar singleChar , multiChar , singleChar , singleChar
*/

/*
-----------------------
 |c |m |s |: |, |
S|1 |1 |--|--|--|
T|  |  |  |  |  |
R|  |  |  |  |  |
N|11|  |  |  |  |
D|  |  |  |  |  |


*/



function parse(tm_code) {
  let tokens = lex(tm_code), i = 0, stack = ['$', 'S']; stack.top = function() {return this[this.length-1]}
  let syntaxErrors = []
  let syntaxTree = {}
  // modeled after a pushdown automaton
  
  /*
  while(tokens[i] && stack.top() !== '$') {
    switch(stack.top()) {                                        // better if before comment
      case 'S': 'T:N'.split('').map(p => stack.push(p)) // push production symbols onto stack
        break
      case 'T': stack.push('t')
        break
      case 't': stack.pop(); 'D,R,N,R'.split('').map(p => stack.push(p))
        break
      case 'D': stack.pop(); 
        break
      default: console.log('huh?')
    }
  }
  */
  // LL(1) parser
  // Builds a syntax tree, while validating syntax
  // algorithm:
  //  go through input buffer, removing elments as you go
  //  if the current token's type matches the top of the stack, i.e. a valid terminal
  //  pop the stack and add the element to the tree
  //  otherwise,
  //  use parse table to choose a production for current nonterminal
  //  we build the syntax tree based on 
  //  if no valid production, we raise an error and panic
  tokens.push('$')
  while(tokens) {
    if (tokens[0].type === stack.top()) {

    }
  }


  function S(tree, tokens) {
    let stateName, colon, transitions, newState
    if ((stateName = N(tokens)).result === null) {
      // expected state name, got stateName.value
    }
  }

}


function secondParse(source) {
  let line = 1
  let tokenRegex = /\w+|\/\/.*|\S|\n/g
  source = source.replace(/\/\/.*/g, '')
  function lex_single(source) {
    let multiChar = /\w\w+/, singleChar = /\w/, symbolChar = /\S/
    let result = tokenRegex.exec(source)
    if (result) {
      if (result === '\n') {
        line++;
        return lex_single(source)
      }
      // evaluate 
    } else {
      return null
    }
  }

  return null
}

/*
Logic errors: 
- User created states A, R, and H
- Multiple states of the same name (might encompass above rule)
- Multiple transitions for the same read symbol

Syntax errors:
- incomplete transition (not enough commas)
- invalid tape head direction
- invalid state name (alphanumeric characters only)
- invalid next state name
- dangling transition, not attached to state
- 

*/

// temporarily named fullInstall. will name install when finished
function fullInstall() {
  // we do error checking in this one
  try {
    // 

    // set simstate to installed
  }
  catch (e) {

  }

}
