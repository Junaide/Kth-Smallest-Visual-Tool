let array = [];
let cellSize = 50;
let pivotValue = null;
let pivotIndex = null;
let k = 0;
let originalK = 0;
let remainingArray = [];
let left = [];
let right = [];
let equal = [];
let foundElement = null;

function setup() {
  const canvasWidth = 600;
  const canvasHeight = 300;
  createCanvas(canvasWidth, canvasHeight);
  noLoop();
}

function draw() {
  background(220);
  if (array.length === 0) return;

  if (pivotValue !== null) {
    const partitionedArray = [...left, ...equal, ...right];
    drawArray(partitionedArray, true);
    highlightPivot(left.length);
  } else {
    drawArray(array, false);
  }

  if (foundElement !== null) {
    displayResult();
  }
}

function startAlgorithm() {
  const arrayInput = document.getElementById('arrayInput').value.trim();
  const kInput = parseInt(document.getElementById('kInput').value.trim(), 10);

  if (!arrayInput || isNaN(kInput)) {
    alert('Please enter a valid array and k value.');
    return;
  }

  array = arrayInput.split(',').map(Number).filter(n => !isNaN(n));

  if(array.length > 12) {
    alert('Array length must be less than or equal to 12.');
    return;
  }

  if (kInput < 1 || kInput > array.length) {
    alert(`k must be between 1 and ${array.length}`);
    return;
  }

  k = kInput;
  originalK = k;
  remainingArray = [...array];
  pivotValue = null;
  foundElement = null;
  left = [];
  right = [];
  equal = [];
  redraw();
}

function drawArray(elements, isPartitioned) {
  textAlign(CENTER, CENTER);
  textSize(20);
  stroke(0);
  strokeWeight(1);
  const startX = (width - elements.length * cellSize) / 2;

  for (let i = 0; i < elements.length; i++) {
    if (isPartitioned) {
      if (i < left.length) {
        fill(255, 100, 100);
      } else if (i < left.length + equal.length) {
        fill(255, 255, 100);
      } else {
        fill(100, 255, 100);
      }
    } else {
      fill(100, 150, 255);
      if (i === pivotIndex) {
        fill(255, 100, 100);
      }
    }
    rect(startX + i * cellSize, height / 3 - cellSize / 2, cellSize, cellSize);
    fill(0);
    text(elements[i], startX + i * cellSize + cellSize / 2, height / 3);
  }
}

function highlightPivot(index) {
  fill(0);
  noStroke();
  const partitionedArray = [...left, ...equal, ...right];
  const startX = (width - partitionedArray.length * cellSize) / 2;
  const x = startX + index * cellSize + cellSize / 2;
  const y = height / 3 + cellSize / 2;
  triangle(x - 10, y + 30, x + 10, y + 30, x, y + 10);
  textSize(15);
  text("Pivot", x, y + 50);
}

function stepSearch() {
  if (remainingArray.length === 1) {
    foundElement = remainingArray[0];
    return;
  }

  pivotValue = remainingArray[floor(random(remainingArray.length))];
  pivotIndex = array.indexOf(pivotValue);
  left = remainingArray.filter(n => n < pivotValue);
  equal = remainingArray.filter(n => n === pivotValue);
  right = remainingArray.filter(n => n > pivotValue);

  if (k <= left.length) {
    remainingArray = left;
  } else if (k <= left.length + equal.length) {
    foundElement = pivotValue;
  } else {
    k -= left.length + equal.length;
    remainingArray = right;
  }
}

function displayResult() {
  fill(0);
  textSize(20);
  text(`The ${originalK}-th smallest element is ${foundElement}`, width / 2, height - 50);
}

function mousePressed() {
  if (mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height) {
    if (foundElement === null && array.length > 0) {
      stepSearch();
      redraw();
    }
  }
}

document.getElementById('startButton').addEventListener('click', () => {
  startAlgorithm();
});

document.getElementById('randomInput').addEventListener('click', () => {
  let length = Math.floor(Math.random() * 13);
  let arr = [];
  for (let i = 0; i < length; i++) {
    arr.push(Math.floor(Math.random() * 100));
  }
  document.getElementById('arrayInput').value = arr.join(',');
});
