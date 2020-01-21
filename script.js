
var dropBox;
var input;
var output;


window.onload = function () {
  dropBox = document.getElementById("dropBox");
  dropBox.ondragenter = ignoreDrag;
  dropBox.ondragover = ignoreDrag;
  dropBox.ondrop = drop;

}

function ignoreDrag(e) {
  e.stopPropagation();
  e.preventDefault();
}

function drop(e) {
  e.stopPropagation();
  e.preventDefault();
  var data = e.dataTransfer;
  var files = data.files;

  processFiles(files);
}

function processFiles(files) {
  var file = files[0],
    ext = "",
    parts = file.name.split('.');
  if (parts.length > 1) ext = parts.pop();
  if (ext == "txt") {
    var reader = new FileReader();
    reader.onload = function (e) {
      createOutput(e.target.result);
    };
    reader.readAsText(file);
  } else {
    document.getElementsByTagName("pre")[0].innerHTML = "Invalid input file type";
    document.getElementsByTagName("pre")[0].style.color = "red";
    return 0;
  }
}


function createOutput(input) {
  var pre = document.getElementsByTagName("pre")[0];

  var arr = input.split("\n").map(function (arr) { return arr.split(" ") });




  if (arr[0][0] == "C") {

    if (arr[0][1] <= 0 || arr[0][1] == null || arr[0][2] <= 0 || arr[0][2] == null || isNaN(+arr[0][1]) || isNaN(+arr[0][2]) || arr[0][1] > 2000 || arr[0][2] > 2000) {

      pre.innerHTML = "Incorrect canvas size!";
      document.getElementsByTagName("pre")[0].style.color = "red";
      return false;
    } else {

      output = createCanvas(arr);
    }

  } else {
    pre.innerHTML = "Canvas must be first!";
    document.getElementsByTagName("pre")[0].style.color = "red";
    return false;
  }

  for (var i = 1; i < arr.length; i++) {

    if (+arr[i][0] == 0) { continue; }
    if (arr[i][0] == "L") { output = createLine(arr[i][1], arr[i][2], arr[i][3], arr[i][4], output, +arr[0][1], +arr[0][2]); }
    else if (arr[i][0] == "R") { output = createRectangle(arr[i][1], arr[i][2], arr[i][3], arr[i][4], output, +arr[0][1], +arr[0][2]); }
    else if (arr[i][0] == "B") { output = stackBuscketFill(arr[i][1], arr[i][2], arr[i][3], output, +arr[0][1], +arr[0][2]); }
    else {
      document.getElementsByTagName("pre")[0].style.color = "red";
      pre.innerHTML = "incorrect input!";
      return false;
    }
  }
  pre.innerHTML = output.join("\n").split(",").join("");
  document.getElementsByTagName("pre")[0].style.color = "black";
  if (output) {
    document.getElementById("dowText").hidden = false;
    document.getElementById("downloadLabel").classList.add("button");
  }
}

function createCanvas(arr) {

  var buffmatrix = [];
  var canvasWidth = +arr[0][1] + 2;
  var canvasHeight = +arr[0][2] + 1;

  for (var i = 0; i <= canvasHeight; i++) {

    buffmatrix[i] = [];

    for (var j = 0; j < canvasWidth; j++) {

      buffmatrix[i][j] = " ";

      if (i == 0 || i == canvasHeight) {
        buffmatrix[i][j] = "-";
      } else {
        buffmatrix[i][0] = "|";
        buffmatrix[i][canvasWidth - 1] = "|";
      }
    }
  }
  return buffmatrix;
}

function createLine(firstPointX, firstPointY, secondPointX, secondPointY, arr, canvasWidth, canvasHeight) {
  var pre = document.getElementsByTagName("pre")[0];
  var sameCoord;
  var minCoord;
  var maxCoord;
  if (isNaN(+firstPointX) || isNaN(+firstPointY) || isNaN(+secondPointX) || isNaN(+secondPointY)) {
    document.getElementsByTagName("pre")[0].style.color = "red";
    pre.innerHTML = "Incorrect line coord!"
    return false;
  }
  else if (firstPointX > canvasWidth || secondPointX > canvasWidth || firstPointY > canvasHeight || secondPointY > canvasHeight ||
    firstPointX <= 0 || firstPointY <= 0 || secondPointX <= 0 || secondPointY <= 0) {
    document.getElementsByTagName("pre")[0].style.color = "red";
    pre.innerHTML = "Incorrect line coord!"
    return false;

  }

  if (firstPointX == secondPointX) {
    sameCoord = firstPointX;
    minCoord = Math.min(firstPointY, secondPointY);
    maxCoord = Math.max(firstPointY, secondPointY);
    for (var i = minCoord; i <= maxCoord; i++) {
      arr[i][sameCoord] = "x";
    }
    return arr;
  } else if (firstPointY == secondPointY) {
    sameCoord = firstPointY;
    minCoord = Math.min(firstPointX, secondPointX);
    maxCoord = Math.max(firstPointX, secondPointX);
    for (var i = minCoord; i <= maxCoord; i++) {
      arr[sameCoord][i] = "x";
    }
    return arr;
  } else {
    document.getElementsByTagName("pre")[0].style.color = "red";
    pre.innerHTML = "Incorrect line coord!";
    return false;
  }
}

function createRectangle(firstPointX, firstPointY, secondPointX, secondPointY, arr, canvasWidth, canvasHeight) {
  var pre = document.getElementsByTagName("pre")[0];
  var minCoordY = Math.min(firstPointY, secondPointY);
  var maxCoordY = Math.max(firstPointY, secondPointY);
  var minCoordX = Math.min(firstPointX, secondPointX);
  var maxCoordX = Math.max(firstPointX, secondPointX);
  if (isNaN(+firstPointX) || isNaN(+firstPointY) || isNaN(+secondPointX) || isNaN(+secondPointY)) {
    document.getElementsByTagName("pre")[0].style.color = "red";
    pre.innerHTML = "Incorrect rectangle coord!"
    return false;
  }
  else if (firstPointX > canvasWidth || secondPointX > canvasWidth || firstPointY > canvasHeight || secondPointY > canvasHeight ||
    firstPointX <= 0 || firstPointY <= 0 || secondPointX <= 0 || secondPointY <= 0) {
    document.getElementsByTagName("pre")[0].style.color = "red";
    pre.innerHTML = "Incorrect rectangle coord!"
    return false;
  }
  for (var i = +minCoordY; i <= +maxCoordY; i++) {
    for (var j = +minCoordX; j <= maxCoordX; j++) {
      if (i == firstPointY || i == secondPointY) {
        arr[i][j] = "x";
      } else {
        arr[i][firstPointX] = "x";
        arr[i][secondPointX] = "x";
      }
    }
  }
  return arr;
}
function stackBuscketFill(pointY, pointX, color, arr, canvasWidth, canvasHeight) {
  var pre = document.getElementsByTagName("pre")[0];
  var stack = [];
  if (isNaN(+pointX) || isNaN(+pointY)) {
    document.getElementsByTagName("pre")[0].style.color = "red";
    pre.innerHTML = "Incorrect fill coord";
    return false;
  }
  else if (pointY > canvasWidth || pointX > canvasHeight || pointX <= 0 || pointY <= 0 || arr[pointX][pointY] == "x" || color.length > 1) {
    document.getElementsByTagName("pre")[0].style.color = "red";
    pre.innerHTML = "Incorrect fill coord";
    return false;
  }

  var currentPoint = getPoint(pointY, pointX);
  arr[+currentPoint.Y][+currentPoint.X] = color;

  var isComplete = false;

  while (!isComplete) {
    if (!checkOppMove(currentPoint, arr)) {
      var point = stack.pop();

      if (point == undefined) { break; }

      currentPoint = getPoint(point.Y, point.X);
    }
    else if (IsIntersection(currentPoint, arr)) {
      stack.push(getPoint(currentPoint.Y, currentPoint.X));
      MoveNext(currentPoint, arr, color);
    }
    else {
      MoveNext(currentPoint, arr, color);
    }
  }

  return arr;
}

function MoveNext(point, arr, color) {
  if (arr[point.Y][+point.X + 1] == ' ') {
    arr[+point.Y][++point.X] = color;
  }
  else if (arr[point.Y - 1][point.X] == ' ') {
    arr[--point.Y][+point.X] = color;
  }
  else if (arr[point.Y][point.X - 1] == ' ') {
    arr[+point.Y][--point.X] = color;
  }
  else {
    arr[++point.Y][+point.X] = color;
  }
}

function checkOppMove(point, arr) {
  if (arr[+point.Y][point.X - 1] == ' ' ||

    arr[+point.Y][+point.X + 1] == ' ' || arr[point.Y - 1][+point.X] == ' ' || arr[+point.Y + 1][+point.X] == ' ') {
    return true;
  }

  return false;
}

function getPoint(pointX, pointY) {
  return { X: pointX, Y: pointY }
}

function IsIntersection(point, arr) {
  var count = 0;
  if (arr[+point.Y][point.X - 1] == ' ') {
    count++;
  }
  if (arr[point.Y][+point.X + 1] == ' ') {
    count++;
  }
  if (arr[point.Y - 1][+point.X] == ' ') {
    count++;
  }
  if (arr[+point.Y + 1][point.X] == ' ') {
    count++;
  }

  return count > 1;
}
var downloadURL = function (url, name) {
  var link = document.createElement('a');
  if (name == undefined || name == '') { name = url };
  link.setAttribute('href', url);
  link.setAttribute('download', name);
  onload = link.click();
};

$(function () {
  $('input[type="button"]').click(function () {
    downloadURL('data:text/plain;charset=UTF-8,' + document.getElementsByTagName("pre")[0].innerHTML, 'output');
  });
});

