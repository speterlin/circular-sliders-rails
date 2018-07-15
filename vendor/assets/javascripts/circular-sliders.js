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
    // centerX, centerY, and radius set in $.fn.sliders()
    lineWidth: 5,
    strokeColor: "#D3D3D3",
    ballColor: "#000000",
    textColor: "#000000",
    gradientFill: true,
    legend: true
  }

  $.fn.sliders = function(slidersOptions) {
    this.each(function() {
      var canvas = this;
      canvas.sliders = [];
      // need to set these variables here because they need to be reset after cycling through sliders in each canvas since they are modified when cycling through sliders
      [defaults.centerX, defaults.centerY, defaults.radius] = [canvas.width / 2, canvas.height / 2, 40];
      // maybe refactor, add container option if there are multiple containers, could allow multiple containers / canvases in the future
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
        $(canvas).data(canvas.sliders[i].name.split(" ").join("_"), canvas.sliders[i].minValue);
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
    this.textColor = settings.textColor;
    this.value = settings.minValue;
    this.range = settings.maxValue - settings.minValue;
    this.gradientFill = settings.gradientFill;
    this.legend = settings.legend;
    // ball starts at top of circle which is - π / 2
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

  function draw(canvas) {
    var ctx = canvas.getContext("2d");
    // in the future want to be able to clear only the slider using, maybe with svg groups
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (var i = 0; i < canvas.sliders.length; i++) {
      drawSlider(ctx, canvas.sliders[i]);
      drawArc(ctx, canvas.sliders[i]);
      drawBall(ctx, canvas.sliders[i]);
      if (canvas.sliders[i].legend) { drawText(ctx, canvas.sliders[i], i); }
    }
  }

  function drawSlider(ctx, slider) {
    ctx.lineWidth = slider.lineWidth;
    ctx.strokeStyle = slider.strokeColor;
    var sliderCircumference = 2 * Math.PI * slider.radius;
    // maybe refactor, I like 2/3 and 1/3 for now, maybe move this to #Slider so don't have to calculate every time
    var sliderLineDashLength = (2 / 3) * (sliderCircumference / (slider.range / slider.step));
    var sliderLineDashSpacing = (1 / 3) * (sliderCircumference / (slider.range / slider.step));
    ctx.setLineDash([sliderLineDashLength, sliderLineDashSpacing]);
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
        ctx.moveTo(slider.centerX - 0.8 * slider.radius, slider.centerY - 0.5 * slider.radius);
        ctx.arc(slider.centerX - 0.5 * slider.radius, slider.centerY - 0.5 * slider.radius, slider.radius * 0.3, Math.PI, 0, true);
        ctx.lineTo(slider.centerX + 0.6 * slider.radius, slider.centerY - 0.1 * slider.radius);
        ctx.arc(slider.centerX + 0.7 * slider.radius, slider.centerY + 0.1 * slider.radius, slider.radius * 0.2, -(Math.PI / 2), Math.PI / 2, false);
        ctx.lineTo(slider.centerX - 0.8 * slider.radius, slider.centerY + 0.3 * slider.radius);
        ctx.lineTo(slider.centerX - 0.8 * slider.radius, slider.centerY - 0.5 * slider.radius);
        my_gradient = ctx.createLinearGradient(slider.centerX - 0.8 * slider.radius, slider.centerY + 0.3 * slider.radius, slider.centerX - 0.8 * slider.radius, slider.centerY - 0.5 * slider.radius);
      } else if (slider.type == "Waist") {
        // maybe refactor, wanted to eyeball it without using math, also maybe move up, could put back in (slight difference at edge): ctx.moveTo(slider.centerX - 0.5 * slider.radius, slider.centerY + 0.05 * slider.radius);
        ctx.arc(slider.centerX, slider.centerY - 0.8 * slider.radius, slider.radius, Math.PI * (2 / 3), Math.PI * (1 / 3), true);
        // refactor, need to send to 0.85 * slider.radius instead of 0.9 * slider.radius since there is a sharp v bend if not
        ctx.lineTo(slider.centerX + 0.2 * slider.radius, slider.centerY + 0.85 * slider.radius);
        ctx.arc(slider.centerX + 0.1 * slider.radius, slider.centerY + 0.9 * slider.radius, slider.radius * 0.1, 0, Math.PI, true);
        ctx.lineTo(slider.centerX, slider.centerY + 0.4 * slider.radius);
        ctx.arc(slider.centerX - 0.1 * slider.radius, slider.centerY + 0.9 * slider.radius, slider.radius * 0.1, 0, Math.PI, true);
        // maybe refactor moveTo, need it to avoid sharp v bend at base of arc
        ctx.moveTo(slider.centerX - 0.2 * slider.radius, slider.centerY + 0.9 * slider.radius);
        ctx.lineTo(slider.centerX - 0.5 * slider.radius, slider.centerY + 0.05 * slider.radius);
        my_gradient = ctx.createLinearGradient(slider.centerX - 0.2 * slider.radius, slider.centerY + 0.9 * slider.radius, slider.centerX - 0.2 * slider.radius, slider.centerY + 0.05 * slider.radius);
      } else if (slider.type == "Height") {
        ctx.arc(slider.centerX, slider.centerY - 0.6 * slider.radius, slider.radius * 0.2, 0, Math.PI * 2, false);
        ctx.moveTo(slider.centerX + 0.08 * slider.radius, slider.centerY - 0.32 * slider.radius);
        ctx.arc(slider.centerX, slider.centerY - 0.3 * slider.radius, slider.radius * 0.08, 0, Math.PI * 2, false);
        ctx.moveTo(slider.centerX + 0.05 * slider.radius, slider.centerY - 0.25 * slider.radius);
        // maybe refactor and add arms, here and in weight: ctx.lineTo(slider.centerX + 0.25 * slider.radius, slider.centerY - 0.1 * slider.radius);
        ctx.lineTo(slider.centerX + 0.05 * slider.radius, slider.centerY + 0.1 * slider.radius);
        ctx.arc(slider.centerX, slider.centerY + 0.2 * slider.radius, slider.radius * 0.1, -(Math.PI / 3), Math.PI / 3, false);
        ctx.lineTo(slider.centerX + 0.05 * slider.radius, slider.centerY + 0.8 * slider.radius);
        ctx.lineTo(slider.centerX - 0.2 * slider.radius, slider.centerY + 0.8 * slider.radius);
        ctx.arc(slider.centerX - 0.15 * slider.radius, slider.centerY + 0.8 * slider.radius, slider.radius * 0.05, Math.PI, -(Math.PI / 2), false);
        ctx.lineTo(slider.centerX - 0.05 * slider.radius, slider.centerY + 0.75 * slider.radius);
        ctx.lineTo(slider.centerX - 0.05 * slider.radius, slider.centerY - 0.25 * slider.radius);
        my_gradient = ctx.createLinearGradient(slider.centerX - 0.05 * slider.radius, slider.centerY + 0.8 * slider.radius, slider.centerX - 0.05 * slider.radius, slider.centerY - 0.8 * slider.radius);
      } else if (slider.type == "Weight") {
        ctx.arc(slider.centerX, slider.centerY - 0.6 * slider.radius, slider.radius * 0.2, 0, Math.PI * 2, false);
        ctx.moveTo(slider.centerX + 0.08 * slider.radius, slider.centerY - 0.32 * slider.radius);
        ctx.arc(slider.centerX, slider.centerY - 0.3 * slider.radius, slider.radius * 0.08, 0, Math.PI * 2, false);
        ctx.moveTo(slider.centerX + 0.05 * slider.radius, slider.centerY - 0.25 * slider.radius);
        ctx.lineTo(slider.centerX + 0.05 * slider.radius, slider.centerY + 0.1 * slider.radius);
        ctx.arc(slider.centerX, slider.centerY + 0.2 * slider.radius, slider.radius * 0.1, -(Math.PI / 3), Math.PI / 3, false);
        ctx.lineTo(slider.centerX + 0.05 * slider.radius, slider.centerY + 0.8 * slider.radius);
        ctx.lineTo(slider.centerX - 0.2 * slider.radius, slider.centerY + 0.8 * slider.radius);
        ctx.arc(slider.centerX - 0.15 * slider.radius, slider.centerY + 0.8 * slider.radius, slider.radius * 0.05, Math.PI, -(Math.PI / 2), false);
        ctx.lineTo(slider.centerX - 0.05 * slider.radius, slider.centerY + 0.75 * slider.radius);
        ctx.lineTo(slider.centerX - 0.05 * slider.radius, slider.centerY + 0.15 * slider.radius);
        ctx.arc(slider.centerX - 0.05 * slider.radius, slider.centerY, slider.radius * 0.15, Math.PI / 2, -(Math.PI / 2), false);
        ctx.lineTo(slider.centerX - 0.05 * slider.radius, slider.centerY - 0.25 * slider.radius);
        my_gradient = ctx.createLinearGradient(slider.centerX - 0.05 * slider.radius, slider.centerY + 0.8 * slider.radius, slider.centerX - 0.05 * slider.radius, slider.centerY - 0.8 * slider.radius);
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

  function drawText(ctx, slider, count) {
    // maybe refactor and make this editable
    ctx.font = "12px Arial";
    ctx.fillStyle = slider.textColor;
    ctx.fillText(slider.name + ": " + slider.priceUnits + slider.value + " " + slider.units, 10, 20 * (count + 1));
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
    draw(canvas);
  }

  function handleMouseDown(e) {
    e.preventDefault();
    isMouseDown = true;
    var [mouseX, mouseY] = setMouse(e);
    var sliders = e.target.sliders; // maybe refactor, don't like having multiple calls to e.target.sliders
    for (var i = 0; i < sliders.length; i++) {
      if (onBall(mouseX, mouseY, sliders[i])) {
        e.target.selectedSlider = sliders[i];
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
    // $(window).scrollLeft() and $(window).scrollTop() to account for page scrolling
    var canvas = e.target;
    return [parseInt(e.clientX - canvas.offsetLeft + $(window).scrollLeft()), parseInt(e.clientY - canvas.offsetTop + $(window).scrollTop())];
  }

}( jQuery ));
