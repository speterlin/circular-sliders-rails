/*
 * JqueryCircularSliders.js
 * Add concentric circles with jquery and responsively set each value.
 * git+https://github.com/speterlin/jquery.circular-sliders.js.git
 * v1.0.0
 * MIT License
 */

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('jquery')) :
  typeof define === 'function' && define.amd ? define(['jquery'], factory) :
  (factory(global.$));
}(this, (function ($) { 'use strict';

  $ = $ && $.hasOwnProperty('default') ? $['default'] : $;

  function renderShoeWithGradient(ctx, slider) {
    ctx.moveTo(slider.centerX - 0.8 * slider.radius, slider.centerY - 0.5 * slider.radius);
    ctx.arc(slider.centerX - 0.5 * slider.radius, slider.centerY - 0.5 * slider.radius, slider.radius * 0.3, Math.PI, 0, true);
    ctx.lineTo(slider.centerX + 0.6 * slider.radius, slider.centerY - 0.1 * slider.radius);
    ctx.arc(slider.centerX + 0.7 * slider.radius, slider.centerY + 0.1 * slider.radius, slider.radius * 0.2, -(Math.PI / 2), Math.PI / 2, false);
    ctx.lineTo(slider.centerX - 0.8 * slider.radius, slider.centerY + 0.3 * slider.radius);
    ctx.lineTo(slider.centerX - 0.8 * slider.radius, slider.centerY - 0.5 * slider.radius);
    return ctx.createLinearGradient(slider.centerX - 0.8 * slider.radius, slider.centerY + 0.3 * slider.radius, slider.centerX - 0.8 * slider.radius, slider.centerY - 0.5 * slider.radius);
  }

  function renderWaistWithGradient(ctx, slider) {
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
    return ctx.createLinearGradient(slider.centerX - 0.2 * slider.radius, slider.centerY + 0.9 * slider.radius, slider.centerX - 0.2 * slider.radius, slider.centerY + 0.05 * slider.radius);
  }

  function renderPersonWithGradient(ctx, slider, options = {}) {
    ctx.arc(slider.centerX, slider.centerY - 0.6 * slider.radius, slider.radius * 0.2, 0, Math.PI * 2, false);
    ctx.moveTo(slider.centerX + 0.08 * slider.radius, slider.centerY - 0.32 * slider.radius);
    ctx.arc(slider.centerX, slider.centerY - 0.3 * slider.radius, slider.radius * 0.08, 0, Math.PI * 2, false);
    ctx.moveTo(slider.centerX + 0.05 * slider.radius, slider.centerY - 0.25 * slider.radius);
    // maybe refactor and add arms, ctx.lineTo(slider.centerX + 0.25 * slider.radius, slider.centerY - 0.1 * slider.radius);
    ctx.lineTo(slider.centerX + 0.05 * slider.radius, slider.centerY + 0.1 * slider.radius);
    ctx.arc(slider.centerX, slider.centerY + 0.2 * slider.radius, slider.radius * 0.1, -(Math.PI / 3), Math.PI / 3, false);
    ctx.lineTo(slider.centerX + 0.05 * slider.radius, slider.centerY + 0.8 * slider.radius);
    ctx.lineTo(slider.centerX - 0.2 * slider.radius, slider.centerY + 0.8 * slider.radius);
    ctx.arc(slider.centerX - 0.15 * slider.radius, slider.centerY + 0.8 * slider.radius, slider.radius * 0.05, Math.PI, -(Math.PI / 2), false);
    ctx.lineTo(slider.centerX - 0.05 * slider.radius, slider.centerY + 0.75 * slider.radius);
    if (options.style === 'Weight') {
      ctx.lineTo(slider.centerX - 0.05 * slider.radius, slider.centerY + 0.15 * slider.radius);
      ctx.arc(slider.centerX - 0.05 * slider.radius, slider.centerY, slider.radius * 0.15, Math.PI / 2, -(Math.PI / 2), false);
      ctx.lineTo(slider.centerX - 0.05 * slider.radius, slider.centerY - 0.25 * slider.radius);
    } else {
      ctx.lineTo(slider.centerX - 0.05 * slider.radius, slider.centerY - 0.25 * slider.radius);
    }
    return ctx.createLinearGradient(slider.centerX - 0.05 * slider.radius, slider.centerY + 0.8 * slider.radius, slider.centerX - 0.05 * slider.radius, slider.centerY - 0.8 * slider.radius);
  }

  function renderLegend(ctx, slider, sliderIndex, movingSliderBall) {
    ctx.beginPath();
    if (movingSliderBall) { ctx.font = `bold ${slider.legend.font}`; } else { ctx.font = slider.legend.font; }
    ctx.fillStyle = slider.legend.color;
    // maybe refactor, 20px vertical spacing by default, could be an issue if set font above 20px
    ctx.fillText(`${slider.name}: ${slider.priceUnits}${slider.value} ${slider.units}`, 10, 20 * (sliderIndex + 1));
    ctx.closePath();
  }

  function renderCanvas(canvas, movingBall = false) {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const sliders = canvas.sliders;
    sliders.forEach((slider, index) => {
      slider.__render(ctx);
      if (slider.legend.display) {
        renderLegend(ctx, slider, index, movingBall && slider === canvas.selectedSlider);
      }
    });
  }

  let isMouseDown = false;

  function roundToStep(value, step) {
    return Math.round(value / step) * step;
  }

  function ballLocationForAngle(slider) {
    return [slider.centerX + slider.radius * Math.cos(slider.angle), slider.centerY + slider.radius * Math.sin(slider.angle)];
  }

  function angleForValue(slider) {
    return (2 * Math.PI * (slider.value - slider.minValue) / slider.range) - (Math.PI / 2);
  }

  function moveBall(mouseX, mouseY, canvas) {
    const slider = canvas.selectedSlider;
    const dx = mouseX - slider.centerX;
    // if draw out in x-y coordinates correct way would be slider.centerY - mouseY, but because top of circle -π / 2, have to do negative of angle which is the same as doing below
    const dy = mouseY - slider.centerY;
    slider.angle = Math.atan(dy / dx);
    // to cover other half of circle, Math.atan only calculates angles between -π/2 and π/2
    if (dx < 0) { slider.angle += Math.PI; }
    [slider.ball.x, slider.ball.y] = ballLocationForAngle(slider);
    // add π / 2 because 0˚ (top of circle) starts at -π / 2, divide by 2π because this is 360˚ in radians, this is reverse of #angleForValue
    const value = slider.minValue + slider.range * ((slider.angle + (Math.PI / 2)) / (2 * Math.PI));
    // refactor - bug if give step value below 0.5
    const roundedValue = roundToStep(value, slider.step);
    slider.value = roundedValue;
    renderCanvas(canvas, true);
  }

  function moveBallToStep(canvas) {
    const slider = canvas.selectedSlider;
    slider.angle = angleForValue(slider);
    [slider.ball.x, slider.ball.y] = ballLocationForAngle(slider);
    renderCanvas(canvas);
  }

  function setMouse(e) {
    const canvas = e.target;
    // $(window).scrollLeft() and $(window).scrollTop() to account for page scrolling
    return [parseInt(e.clientX - canvas.offsetLeft + $(window).scrollLeft(), 10), parseInt(e.clientY - canvas.offsetTop + $(window).scrollTop(), 10)];
  }

  function onBall(x, y, slider) {
    if (x > (slider.ball.x - slider.ball.radius) && x < (slider.ball.x + slider.ball.radius) && y > (slider.ball.y - slider.ball.radius) && y < (slider.ball.y + slider.ball.radius)) {
      return true;
    }
    return false;
  }

  function handleMouseDown(e) {
    e.preventDefault();
    isMouseDown = true;
    const [mouseX, mouseY] = setMouse(e);
    const sliders = e.target.sliders;
    sliders.forEach((slider) => {
      if (onBall(mouseX, mouseY, slider)) {
        e.target.selectedSlider = slider;
      }
    });
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
    const [mouseX, mouseY] = setMouse(e);
    moveBall(mouseX, mouseY, e.target);
  }

  class Ball {
    constructor(slider, ballColor) {
      [this.x, this.y] = ballLocationForAngle(slider);
      this.radius = slider.lineWidth;
      this.color = ballColor;
    }
  }

  function renderSlider(ctx, slider) {
    ctx.beginPath();
    ctx.lineWidth = slider.lineWidth;
    ctx.strokeStyle = slider.strokeColor;
    ctx.setLineDash([slider.lineDashLength, slider.lineDashSpacing]);
    ctx.arc(slider.centerX, slider.centerY, slider.radius, 0, Math.PI * 2, false);
    ctx.stroke();
    ctx.closePath();
    if (slider.type !== 'Plain') {
      ctx.beginPath();
      ctx.setLineDash([10, 0]);
      ctx.lineWidth = 5;
      let myGradient = null;
      if (slider.type === 'Shoe') {
        myGradient = renderShoeWithGradient(ctx, slider);
      } else if (slider.type === 'Waist') {
        myGradient = renderWaistWithGradient(ctx, slider);
      } else if (slider.type === 'Height') {
        myGradient = renderPersonWithGradient(ctx, slider);
      } else if (slider.type === 'Weight') {
        myGradient = renderPersonWithGradient(ctx, slider, { style: 'Weight' });
      }
      if (slider.gradientFill) {
        const scale = (slider.value - slider.minValue) / slider.range;
        myGradient.addColorStop(0, slider.color);
        myGradient.addColorStop(scale, '#ffffff');
        ctx.fillStyle = myGradient;
        ctx.fill();
      }
      ctx.stroke();
      ctx.closePath();
    }
  }

  function renderArc(ctx, slider) {
    // add this if want arc to stop at edge of ball: let angleOffset = Math.atan(slider.ball.radius / slider.radius), then also need check for (π / 2) + slider.angle) < angleOffset) for when go past the 0˚ mark at top of circle, π / 2 + slider.angle since angle starts at -π / 2 at top of circle
    ctx.beginPath();
    ctx.arc(slider.centerX, slider.centerY, slider.radius, -(Math.PI / 2), slider.angle, false);
    ctx.lineWidth = slider.lineWidth;
    ctx.strokeStyle = slider.color;
    // have to set lineDashLength to a number > 0 for arc to be completely full in browsers like Safari
    ctx.setLineDash([10, 0]);
    ctx.stroke();
    ctx.closePath();
  }

  function renderBall(ctx, slider) {
    ctx.beginPath();
    ctx.arc(slider.ball.x, slider.ball.y, slider.ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = slider.ball.color;
    ctx.fill();
    ctx.closePath();
  }

  class CircularSlider {
    constructor(settings) {
      const slider = this;
      Object.keys(settings).forEach((key) => {
        slider[key] = settings[key];
      });
      // centerX, centerY, and radius should be set in defaults (in for loop) or options
      this.value = this.value || this.minValue;
      // calculated / created attributes
      this.range = this.maxValue - this.minValue;
      this.angle = angleForValue(this);
      // maybe refactor, I like 2/3 and 1/3 for now
      const arcSegment = 2 * Math.PI * this.radius / (this.range / this.step);
      this.lineDashLength = (2 / 3) * arcSegment;
      this.lineDashSpacing = (1 / 3) * arcSegment;
      this.ball = new Ball(this, settings.ballColor);
    }

    __render(ctx) {
      renderSlider(ctx, this);
      renderArc(ctx, this);
      renderBall(ctx, this);
    }
  }
  // $.fn.sliders.CircularSlider = CircularSlider;

  if (typeof $ === 'undefined') {
    throw new Error('jQuery.CircularSliders requires jQuery');
  }

  $.fn.sliders = function (slidersOptions) {
    this.each(function () {
      if (!$(this).is('canvas')) { throw new Error('Circular Sliders must be called on a Canvas.'); }
      const canvas = this;
      const sliders = [];
      const canvasDefaults = {};
      [canvasDefaults.centerX, canvasDefaults.centerY, canvasDefaults.radius] = [canvas.width / 2, canvas.height / 2, Math.min(canvas.width, canvas.height) / 4];
      slidersOptions.forEach((sliderOptions, index) => {
        canvasDefaults.name = `Slider ${index + 1}`;
        if (index > 0) {
          [canvasDefaults.centerX, canvasDefaults.centerY] = [sliders[index - 1].centerX, sliders[index - 1].centerY];
          canvasDefaults.radius = sliders[index - 1].radius + sliders[index - 1].lineWidth + $.fn.sliders.defaults.lineWidth;
        }
        const sliderDefaults = $.extend({}, $.fn.sliders.defaults, canvasDefaults);
        // true for deep merge
        const settings = $.extend(true, {}, sliderDefaults, sliderOptions);
        sliders.push(new CircularSlider(settings));
      });
      // maybe look at https://stackoverflow.com/questions/10149963/adding-event-listener-cross-browser
      canvas.addEventListener('mousedown', handleMouseDown);
      canvas.addEventListener('mouseup', handleMouseUp);
      canvas.addEventListener('mousemove', handleMouseMove);

      [canvas.sliders, canvas.selectedSlider] = [sliders, sliders[0]];

      renderCanvas(canvas);
    });
  };

  // TODO: add configure(options) and config: config
  $.fn.sliders.defaults = {
    name: 'Slider',
    type: 'Plain',
    color: '#0000FF',
    minValue: 0,
    maxValue: 100,
    step: 10,
    units: '',
    priceUnits: '',
    // centerX, centerY, and radius set in Canvas because they are specific/modified to each canvas
    lineWidth: 5,
    strokeColor: '#D3D3D3',
    ballColor: '#000000',
    gradientFill: true,
    legend: { display: true, font: '12px Arial', color: '#000000' },
  };

  $.fn.findSliderByName = function (name) {
    if (!this.is('canvas')) { throw new Error('findSliderByName must be called on a Canvas.'); }
    const canvas = this[0];
    return canvas.sliders.filter(slider => slider.name === name)[0];
  };

})));
