// maybe refactor and include these in a react like module, would have to worry about browser support, https://stackoverflow.com/questions/950087/how-do-i-include-a-javascript-file-in-another-javascript-file
function drawShoeWithGradient(ctx, slider) {
  ctx.moveTo(slider.centerX - 0.8 * slider.radius, slider.centerY - 0.5 * slider.radius);
  ctx.arc(slider.centerX - 0.5 * slider.radius, slider.centerY - 0.5 * slider.radius, slider.radius * 0.3, Math.PI, 0, true);
  ctx.lineTo(slider.centerX + 0.6 * slider.radius, slider.centerY - 0.1 * slider.radius);
  ctx.arc(slider.centerX + 0.7 * slider.radius, slider.centerY + 0.1 * slider.radius, slider.radius * 0.2, -(Math.PI / 2), Math.PI / 2, false);
  ctx.lineTo(slider.centerX - 0.8 * slider.radius, slider.centerY + 0.3 * slider.radius);
  ctx.lineTo(slider.centerX - 0.8 * slider.radius, slider.centerY - 0.5 * slider.radius);
  return ctx.createLinearGradient(slider.centerX - 0.8 * slider.radius, slider.centerY + 0.3 * slider.radius, slider.centerX - 0.8 * slider.radius, slider.centerY - 0.5 * slider.radius);
}

function drawWaistWithGradient(ctx, slider) {
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

function drawPersonWithGradient(ctx, slider, options = {}) {
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
  if (options.style == "Weight") {
    ctx.lineTo(slider.centerX - 0.05 * slider.radius, slider.centerY + 0.15 * slider.radius);
    ctx.arc(slider.centerX - 0.05 * slider.radius, slider.centerY, slider.radius * 0.15, Math.PI / 2, -(Math.PI / 2), false);
    ctx.lineTo(slider.centerX - 0.05 * slider.radius, slider.centerY - 0.25 * slider.radius);
  } else {
    ctx.lineTo(slider.centerX - 0.05 * slider.radius, slider.centerY - 0.25 * slider.radius);
  }
  return ctx.createLinearGradient(slider.centerX - 0.05 * slider.radius, slider.centerY + 0.8 * slider.radius, slider.centerX - 0.05 * slider.radius, slider.centerY - 0.8 * slider.radius);
}
