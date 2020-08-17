$(document).ready(function(){
  initialize();
});

var prevent = false;

// works out the X, Y position of the click INSIDE the canvas from the X, Y position on the page
function getPosition(mouseEvent, element)
{
  var x, y;
  if (mouseEvent.pageX != undefined && mouseEvent.pageY != undefined) {
     x = mouseEvent.pageX;
     y = mouseEvent.pageY;
  } else {
     x = mouseEvent.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
     y = mouseEvent.clientY + document.body.scrollTop + document.documentElement.scrollTop;
  }
  x = x - element.offsetLeft;
  return { X: x, Y: y - element.offsetTop };
}

function initialize()
{
  // Add a canvas element
  $('<canvas>').attr({ id: "board" }).appendTo('#container');
  // get references to the canvas element as well as the 2D drawing context
  var element = document.getElementById('board');
  var context = element.getContext("2d");
  element.width = 1280;
  element.height = 720;
  context.imageSmoothingEnabled = true;
  // https://stackoverflow.com/q/9741356/148668
 
  $("#board").mousedown(function (mouseEvent) {
    var position = getPosition(mouseEvent, element);
    context.beginPath();
    context.moveTo(position.X, position.Y);
    console.log('move to '+position.X +','+position.Y);
    context.lineWidth = "1";
    context.strokeStyle = 'rgba(255,255,255,0.5)';
    context.lineCap = "round";
    context.lineJoin = "round";
    prevent = true;
    // attach event handlers
    $(this).mousemove(function (mouseEvent) {
       drawLine(mouseEvent, element, context);
    }).mouseup(function (mouseEvent) {
       finishDrawing(mouseEvent, element, context);
    }).mouseout(function (mouseEvent) {
       finishDrawing(mouseEvent, element, context);
    });
  });

  document.addEventListener(
    'touchmove', 
    function (event) {
      if (prevent) {
          event.preventDefault();
      }
      return event;
    }, false);
}


// draws a line to the x and y coordinates of the mouse event inside
// the specified element using the specified context
function drawLine(mouseEvent, element, context)
{
  var position = getPosition(mouseEvent, element);
  context.lineTo(position.X, position.Y);
    console.log('line to '+position.X +','+position.Y);
  context.stroke();

  context.closePath();
    console.log('move to '+position.X +','+position.Y);
  context.beginPath();
  context.lineWidth = context.lineWidth+0.1;
  context.moveTo(position.X, position.Y);

}

// draws a line from the last coordiantes in the path to the finishing
// coordinates and unbind any event handlers which need to be preceded
// by the mouse down event
function finishDrawing(mouseEvent, element, context)
{
  // draw the line to the finishing coordinates
  drawLine(mouseEvent, element, context);

  context.closePath();


  // unbind any events which could draw
  $(element).unbind("mousemove")
            .unbind("mouseup")
            .unbind("mouseout");
  prevent = false;
}
