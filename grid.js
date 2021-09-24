const boxWidth = 30
const max_boxes = Math.floor(screen.availWidth/boxWidth)

const boxes = document.getElementsByClassName('tape-cell')

function hideBox(box) {
  box.style.display = 'none'
}

function showBox(box) {
  box.style.display = 'block'
}

function updateTape(tape, tapeHead) {
  // get number of elements in boxes
  var numElements = boxes.length
  var middleBoxIndex = Math.floor(numElements/2)
  var tapeSize = tape.length

  for(let i = tapeHead - middleBoxIndex, j = 0; j < numElements; i++, j++) {
    if (i < 0) {
      boxes[j].innerHTML = ''
    } else if (i >= tapeSize) {
      boxes[j].innerHTML = ''
    } else {
      boxes[j].innerHTML = tape[i] === undefined ? '' : tape[i]
    }
  }
}



var t = "is this more readable???".split('')
var th = 0

function watchItGo() {
    var w = setInterval(function() {
      updateTape(t, th);
      if(th < t.length) {
        th++
      } else {
        clearInterval(w);
      }
    }, 100)
}
// watchItGo()
