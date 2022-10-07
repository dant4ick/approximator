function expression(x) {
  if (typeof (x) !== 'number') {
    return;
  }
  return (Math.sqrt(2 * (x ** 2) + 0.7)) / (1.5 + Math.sqrt(0.8 * x + 1));
}

function integrate_left_rect(start, end, step = NaN, split = NaN) {
  if (isNaN(step) && !isNaN(split)) {
    step = (end - start) / split;
  }
  if (isNaN(step)) {
    return console.log('something\'s wrong about the arguments');
  }

  let x = start;
  let result = 0;
  while (x <= (end - step)) {
    result += expression(x);
    x += step;
  }
  return step * result;
}

function integrate_right_rect(start, end, step = NaN, split = NaN) {
  if (isNaN(step) && !isNaN(split)) {
    step = (end - start) / split;
  }
  if (isNaN(step)) {
    return console.log('something\'s wrong about the arguments');
  }

  let x = start + step;
  let result = 0;
  while (x <= end) {
    result += expression(x);
    x += step;
  }
  return step * result;
}

function integrate_trap(start, end, step = NaN, split = NaN) {
  if (isNaN(step) && !isNaN(split)) {
    step = (end - start) / split;
  }
  if (isNaN(step)) {
    return console.log('something\'s wrong about the arguments');
  }

  let x = start + step;
  let result = 0;
  while (x <= (end - step)) {
    result += expression(x);
    x += step;
  }
  return ((expression(start) + expression(end)) / 2 + result) * step;
}

function integrate_par(start, end, step = NaN, split = NaN) {
  if (isNaN(step) && !isNaN(split)) {
    step = (end - start) / split;
  }
  if (isNaN(step)) {
    return console.log('something\'s wrong about the arguments');
  }

  let fraction_odd = 0;
  let x = start + step;
  while (x <= (end - step)) {
    fraction_odd += expression(x);
    x += 2 * step;
  }

  let fraction_even = 0;
  x = start + (2 * step);
  while (x <= (end - (2 * step))) {
    fraction_even += expression(x);
    x += 2 * step;
  }

  return (expression(start) + expression(end) + (4 * fraction_odd) +
      (2 * fraction_even)) * (step / 3);
}

function integrate_double(start, end, eps, method) {
  let step = Math.sqrt(eps);

  let trap1;
  let trap2 = 0;
  do {
    trap1 = trap2;
    trap2 = method(start, end, step);
    step /= 2;
  } while (Math.abs(trap1 - trap2) > eps);
  return trap2;
}

function integrate_double_optimised(start, end, eps, method) {
  let step = Math.sqrt(eps);

  let trap1 = 0;
  let trap2 = method(start, end, step);
  if (Math.abs(trap1 - trap2) <= eps) {
    return trap2;
  }

  let margin;
  while (Math.abs(trap1 - trap2) > eps) {
    margin = step / 2;
    trap1 = trap2;
    trap2 = method(start + margin, end, step);
    step /= 2;
  }
  return trap2;
}
