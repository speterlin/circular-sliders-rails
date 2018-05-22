(function ( $ ) {

  var isMouseDown = false;
  var selectedSlider = {};
  var elem = null;
  // if multiple canvases / containers would need to refactor
  var canvas = null
  var ctx = null;
  // don't like having these as global variables
  var sliders = [];
  // [x,y]
  var offset = [0,0];

  $.fn.sliders = function(slidersOptions) {
    elem = this;
    // maybe refactor, add .each in case there are multiple selected canvases
    canvas = this[0];
    ctx = canvas.getContext("2d");
    setOffset();
    // maybe refactor and make centerX and centerY one variable [centerX, centerY]
    var slidersCenterX = canvas.width / 2;
    var slidersCenterY = canvas.height / 2;
    // maybe refactor, add container option if there are multiple containers, could allow multiple containers / canvases in the future
    var defaults = {
      name: "Slider",
      centerX: slidersCenterX,
      centerY: slidersCenterY,
      color: "#0000FF",
      minValue: 0,
      maxValue: 100,
      step: 10,
      units: "",
      radius: 40,
      lineWidth: 5,
      strokeColor: "#D3D3D3",
      ballColor: "#000000",
      textColor: "#000000"
    }
    for (var i = 0; i < slidersOptions.length; i++) {
      defaults.name = "Slider " + (i + 1);
      // maybe refactor, want previous centerX, centerY, and lineWidth and 10 pixels spacing between sliders
      if (i > 0) {
        defaults.centerX = sliders[i-1].centerX;
        defaults.centerY = sliders[i-1].centerY;
        defaults.radius = sliders[i-1].radius + sliders[i-1].lineWidth + 10;
      }
      var sliderSettings = $.extend( {}, defaults, slidersOptions[i] )
      sliders.push(new Slider (sliderSettings));
      // maybe refactor, visible if have it like this: elem.attr('data-'+sliders[i].name.split(" ").join("_"), sliders[i].minValue);
      elem.data(sliders[i].name.split(" ").join("_"), sliders[i].minValue);
    }
    // maybe refactor, first slider by default selected
    selectedSlider = sliders[0];
    draw();
    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mouseup", handleMouseUp);
    canvas.addEventListener("mousemove", handleMouseMove);
  }

  function Slider(settings) {
    this.name = settings.name;
    this.centerX = settings.centerX;
    this.centerY = settings.centerY;
    this.color = settings.color;
    this.minValue = settings.minValue;
    this.maxValue = settings.maxValue;
    this.step = settings.step;
    this.units = settings.units;
    this.radius = settings.radius;
    this.lineWidth = settings.lineWidth;
    this.strokeColor = settings.strokeColor;
    this.textColor = settings.textColor;
    this.value = settings.minValue;
    this.range = settings.maxValue - settings.minValue;
    // ball starts at top of circle which is - pi / 2
    this.angle = -(Math.PI / 2);
    this.ball = new Ball (settings);
  }

  function Ball(sliderSettings) {
    this.x = sliderSettings.centerX;
    // ball starts at top of circle
    this.y = sliderSettings.centerY - sliderSettings.radius;
    this.radius = sliderSettings.lineWidth;
    this.color = sliderSettings.ballColor;
  }

  function draw () {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (var i = 0; i < sliders.length; i++) {
      drawSlider(sliders[i]);
      drawBall(sliders[i]);
      drawArc(sliders[i]);
      drawText(sliders[i], i);
    }
  }

  function drawSlider(slider) {
    ctx.beginPath();
    ctx.arc(slider.centerX, slider.centerY, slider.radius, 0, Math.PI*2, false);
    ctx.lineWidth = slider.lineWidth;
    ctx.strokeStyle = slider.strokeColor;
    var sliderCircumference = 2 * Math.PI * slider.radius;
    // maybe refactor, I like 2/3 and 1/3 for now, maybe move this to #Slider so don't have to calculate every time
    var sliderLineDashLength = (2 / 3) * (sliderCircumference / (slider.range / slider.step));
    var sliderLineDashSpacing = (1 / 3) * (sliderCircumference / (slider.range / slider.step));
    ctx.setLineDash([sliderLineDashLength, sliderLineDashSpacing]);
    ctx.stroke();
    ctx.closePath();
  }

  function drawBall(slider) {
    ctx.beginPath();
    ctx.arc(slider.ball.x, slider.ball.y, slider.ball.radius, 0, Math.PI*2);
    ctx.fillStyle = slider.ball.color;
    ctx.fill();
    ctx.closePath();
  }

  function drawArc (slider) {
    // refactor - bug, gap in arc visible if you have a large circular slider, arc comes to edge of ball, does not finish inside ball, maybe change name of angleOffset variable
    var angleOffset = slider.ball.radius / slider.radius
    if (((Math.PI / 2) + slider.angle) < angleOffset) {
      var endAngle = slider.angle
    } else {
      var endAngle = slider.angle - angleOffset;
    }
    ctx.beginPath();
    ctx.arc(slider.centerX, slider.centerY, slider.radius, -(Math.PI / 2), endAngle, false);
    ctx.lineWidth = slider.lineWidth;
    ctx.strokeStyle = slider.color;
    // have to set lineDashLength to a number > 0 for arc to be completely full in browsers like Safari, set it arbitrarily to 10 here
    ctx.setLineDash([10, 0]);
    ctx.stroke();
    ctx.closePath();
  }

  function drawText (slider, count) {
    // maybe refactor and make this editable
    ctx.font = "12px Arial";
    ctx.fillStyle = slider.textColor;
    ctx.fillText(slider.name + ": " + slider.value + " " + slider.units, 10, 20*(count+1));
  }

  function moveBall (mouseX, mouseY, slider) {
    var dx = mouseX - slider.centerX;
    var dy = mouseY - slider.centerY;
    slider.angle = Math.atan(dy / dx);
    if (dx < 0) { slider.angle += Math.PI };
    slider.ball.x = slider.centerX + slider.radius * Math.cos(slider.angle);
    slider.ball.y = slider.centerY + slider.radius * Math.sin(slider.angle);
    slider.value = slider.minValue + slider.range * ((slider.angle + (Math.PI/2)) / (2 * Math.PI) );
    // refactor - bug if give step value below 0.5
    var roundedValue = round(slider.value, slider.step);
    elem.data(slider.name.split(" ").join("_"), roundedValue);
    slider.value = roundedValue;
    draw();
  }

  function handleMouseDown(e) {
    e.preventDefault();
    isMouseDown = true;
    setOffset();
    // $(window).scrollLeft() and $(window).scrollTop() to account for page scrolling, maybe refactor and make mouseX and mouseY global
    var mouseX = parseInt(e.clientX - offset[0] + $(window).scrollLeft());
    var mouseY = parseInt(e.clientY - offset[1] + $(window).scrollTop());
    for (var i = 0; i < sliders.length; i++) {
      if (onBall(mouseX, mouseY, sliders[i])) {
        selectedSlider = sliders[i];
      }
    }
  }

  function handleMouseUp(e) {
    e.preventDefault();
    isMouseDown = false;
  }

  function handleMouseMove(e) {
    if (!isMouseDown) {
      return;
    }
    e.preventDefault();
    setOffset();
    var mouseX = parseInt(e.clientX - offset[0] + $(window).scrollLeft());
    var mouseY = parseInt(e.clientY - offset[1] + $(window).scrollTop());
    moveBall(mouseX, mouseY, selectedSlider);
  }

  function round(x, target) {
    return Math.ceil(x/target) * target;
  }

  function onBall (x, y, slider) {
    if (x > (slider.ball.x - slider.ball.radius) && x < (slider.ball.x + slider.ball.radius) && y > (slider.ball.y - slider.ball.radius) && y < (slider.ball.y + slider.ball.radius)) {
      return true;
    }
    return false;
  }

  function setOffset() {
    // refactor, need to call every time mouse is down or moves in case you have moved the canvas and offset positon is cached, could avoid having to call this if your project has no cache
    offset = [canvas.offsetLeft, canvas.offsetTop];
  }

}( jQuery ));
