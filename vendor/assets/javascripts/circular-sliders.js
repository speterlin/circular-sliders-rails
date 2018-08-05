//= require shapes

(function ( $ ) {
  'use strict';

  // private global variables
  var isMouseDown = false;
  var defaults = {
    name: "Slider",
    type: "Plain",
    color: "#0000FF",
    minValue: 0,
    maxValue: 100,
    step: 10,
    units: "",
    priceUnits: "",
    // centerX, centerY, and radius set in $.fn.sliders() because they are specific/modified to each canvas
    lineWidth: 5,
    strokeColor: "#D3D3D3",
    ballColor: "#000000",
    gradientFill: true,
    legend: true,
    legendFont: "12px Arial",
    legendColor: "#000000"
  }

  $.fn.sliders = function(slidersOptions) {
    this.each(function() {
      var canvas = this;
      canvas.sliders = [];
      [defaults.centerX, defaults.centerY, defaults.radius] = [canvas.width / 2, canvas.height / 2, 40];
      // maybe refactor, add container option if there are multiple containers
      for (var i = 0; i < slidersOptions.length; i++) {
        defaults.name = "Slider " + (i + 1);
        if (i > 0) {
          defaults.centerX = canvas.sliders[i-1].centerX;
          defaults.centerY = canvas.sliders[i-1].centerY;
          defaults.radius = canvas.sliders[i-1].radius + canvas.sliders[i-1].lineWidth + defaults.lineWidth;
        }
        var sliderSettings = $.extend( {}, defaults, slidersOptions[i] );
        canvas.sliders.push(new Slider (sliderSettings));
        // maybe refactor, visible if have it like this: elem.attr('data-'+sliders[i].name.split(" ").join("_"), sliders[i].minValue);
        $(canvas).data(canvas.sliders[i].name.split(" ").join("_"), canvas.sliders[i].value);
      }
      canvas.selectedSlider = canvas.sliders[0];
      draw(canvas);
      canvas.addEventListener("mousedown", handleMouseDown);
      canvas.addEventListener("mouseup", handleMouseUp);
      canvas.addEventListener("mousemove", handleMouseMove);
    })
  }

  function Slider(settings) {
    this.name = settings.name;
    this.type = settings.type;
    this.centerX = settings.centerX;
    this.centerY = settings.centerY;
    this.color = settings.color;
    this.minValue = settings.minValue;
    this.maxValue = settings.maxValue;
    this.step = settings.step;
    this.units = settings.units;
    this.priceUnits = settings.priceUnits;
    this.radius = settings.radius;
    this.lineWidth = settings.lineWidth;
    this.strokeColor = settings.strokeColor;
    this.value = settings.minValue;
    this.gradientFill = settings.gradientFill;
    this.legend = settings.legend;
    this.legendFont = settings.legendFont;
    this.legendColor = settings.legendColor;
    // ball starts at top of circle which is - π / 2
    this.angle = -(Math.PI / 2);
    this.range = this.maxValue - this.minValue;
    // maybe refactor, I like 2/3 and 1/3 for now
    var arcSegment = 2 * Math.PI * this.radius / (this.range / this.step);
    this.lineDashLength = (2 / 3) * arcSegment;
    this.lineDashSpacing = (1 / 3) * arcSegment;
    this.ball = new Ball (settings);
  }

  function Ball(sliderSettings) {
    this.x = sliderSettings.centerX;
    // ball starts at top of circle
    this.y = sliderSettings.centerY - sliderSettings.radius;
    this.radius = sliderSettings.lineWidth;
    this.color = sliderSettings.ballColor;
  }

  function draw(canvas, movingBall = false) {
    var ctx = canvas.getContext("2d");
    // in the future want to be able to clear only the slider using, maybe with svg groups
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    var sliders = canvas.sliders;
    for (var i = 0; i < sliders.length; i++) {
      drawSlider(ctx, sliders[i]);
      drawArc(ctx, sliders[i]);
      drawBall(ctx, sliders[i]);
      if (sliders[i].legend) { drawLegend(ctx, sliders[i], i, movingBall && sliders[i] == canvas.selectedSlider); }
    }
  }

  function drawSlider(ctx, slider) {
    ctx.lineWidth = slider.lineWidth;
    ctx.strokeStyle = slider.strokeColor;
    ctx.setLineDash([slider.lineDashLength, slider.lineDashSpacing]);
    ctx.beginPath();
    ctx.arc(slider.centerX, slider.centerY, slider.radius, 0, Math.PI * 2, false);
    ctx.stroke();
    ctx.closePath();
    if (slider.type != "Plain") {
      ctx.beginPath();
      ctx.setLineDash([10, 0]);
      ctx.lineWidth = 5;
      var my_gradient = null;
      if (slider.type == "Shoe") {
        my_gradient = drawShoeWithGradient(ctx, slider);
      } else if (slider.type == "Waist") {
        my_gradient = drawWaistWithGradient(ctx, slider);
      } else if (slider.type == "Height") {
        my_gradient = drawPersonWithGradient(ctx, slider);
      } else if (slider.type == "Weight") {
        my_gradient = drawPersonWithGradient(ctx, slider, {style: "Weight"});
      }
      if (slider.gradientFill) {
        var scale = (slider.value - slider.minValue) / slider.range;
        my_gradient.addColorStop(0,slider.color);
        my_gradient.addColorStop(scale,"#ffffff");
        ctx.fillStyle = my_gradient;
        ctx.fill();
      }
      ctx.stroke();
      ctx.closePath();
    }
  }

  function drawBall(ctx, slider) {
    ctx.beginPath();
    ctx.arc(slider.ball.x, slider.ball.y, slider.ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = slider.ball.color;
    ctx.fill();
    ctx.closePath();
  }

  function drawArc(ctx, slider) {
    // add this if want arc to stop at edge of ball: var angleOffset = Math.atan(slider.ball.radius / slider.radius), then also need check for (π / 2) + slider.angle) < angleOffset) for when go past the 0˚ mark at top of circle, π / 2 + slider.angle since angle starts at -π / 2 at top of circle
    ctx.beginPath();
    ctx.arc(slider.centerX, slider.centerY, slider.radius, -(Math.PI / 2), slider.angle, false);
    ctx.lineWidth = slider.lineWidth;
    ctx.strokeStyle = slider.color;
    // have to set lineDashLength to a number > 0 for arc to be completely full in browsers like Safari, set it arbitrarily to 10 here
    ctx.setLineDash([10, 0]);
    ctx.stroke();
    ctx.closePath();
  }

  function drawLegend(ctx, slider, sliderIndex, movingSliderBall) {
    ctx.beginPath();
    if (movingSliderBall) {ctx.font = "bold " + slider.legendFont;} else {ctx.font = slider.legendFont;}
    ctx.fillStyle = slider.legendColor;
    // maybe refactor, 20px vertical spacing by default, could be an issue if set font above 20px
    ctx.fillText(slider.name + ": " + slider.priceUnits + slider.value + " " + slider.units, 10, 20 * (sliderIndex + 1));
    ctx.closePath();
  }

  function moveBall(mouseX, mouseY, canvas) {
    var slider = canvas.selectedSlider;
    var dx = mouseX - slider.centerX;
    var dy = mouseY - slider.centerY;
    slider.angle = Math.atan(dy / dx);
    if (dx < 0) { slider.angle += Math.PI; }
    slider.ball.x = slider.centerX + slider.radius * Math.cos(slider.angle);
    slider.ball.y = slider.centerY + slider.radius * Math.sin(slider.angle);
    slider.value = slider.minValue + slider.range * ((slider.angle + (Math.PI / 2)) / (2 * Math.PI)); //add π / 2 because 0˚ starts at -π / 2, divide by 2π because this is 360˚ in radians
    // refactor - bug if give step value below 0.5
    var roundedValue = roundToStep(slider.value, slider.step);
    $(canvas).data(slider.name.split(" ").join("_"), roundedValue);
    slider.value = roundedValue;
    draw(canvas, true);
  }

  function moveBallToStep(canvas) {
    var slider = canvas.selectedSlider;
    slider.angle = (2 * Math.PI * (slider.value - slider.minValue) / slider.range) - (Math.PI / 2)
    slider.ball.x = slider.centerX + slider.radius * Math.cos(slider.angle);
    slider.ball.y = slider.centerY + slider.radius * Math.sin(slider.angle);
    draw(canvas);
  }

  function handleMouseDown(e) {
    e.preventDefault();
    isMouseDown = true;
    var [mouseX, mouseY] = setMouse(e);
    var sliders = e.target.sliders;
    for (var i = 0; i < sliders.length; i++) {
      if (onBall(mouseX, mouseY, sliders[i])) {
        e.target.selectedSlider = sliders[i];
      }
    }
  }

  function handleMouseUp(e) {
    e.preventDefault();
    isMouseDown = false;
    moveBallToStep(e.target);
  }

  function handleMouseMove(e) {
    if (!isMouseDown) {
      return;
    }
    e.preventDefault();
    var [mouseX, mouseY] = setMouse(e);
    moveBall(mouseX, mouseY, e.target);
  }

  function roundToStep(value, step) {
    return Math.ceil(value / step) * step;
  }

  function onBall(x, y, slider) {
    if (x > (slider.ball.x - slider.ball.radius) && x < (slider.ball.x + slider.ball.radius) && y > (slider.ball.y - slider.ball.radius) && y < (slider.ball.y + slider.ball.radius)) {
      return true;
    }
    return false;
  }

  function setMouse(e) {
    var canvas = e.target;
    // $(window).scrollLeft() and $(window).scrollTop() to account for page scrolling
    return [parseInt(e.clientX - canvas.offsetLeft + $(window).scrollLeft()), parseInt(e.clientY - canvas.offsetTop + $(window).scrollTop())];
  }

}( jQuery ));
