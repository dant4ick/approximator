function integrate_left_rect(f, start, end, step = NaN, split = NaN) {
  if (isNaN(step) && !isNaN(split)) {
    step = (end - start) / split;
  }
  if (isNaN(step)) {
    return console.log('something\'s wrong about the arguments');
  }

  const expression = math.parse(f).compile();

  let x = start;
  let result = 0;
  while (x <= (end - step)) {
    result += expression.evaluate({'x': x});
    x += step;
  }
  return step * result;
}

function integrate_right_rect(f, start, end, step = NaN, split = NaN) {
  if (isNaN(step) && !isNaN(split)) {
    step = (end - start) / split;
  }
  if (isNaN(step)) {
    return console.log('something\'s wrong about the arguments');
  }

  const expression = math.parse(f).compile();

  let x = start + step;
  let result = 0;
  while (x <= end) {
    result += expression.evaluate({'x': x});
    x += step;
  }
  return step * result;
}

function integrate_trap(f, start, end, step = NaN, split = NaN) {
  if (isNaN(step) && !isNaN(split)) {
    step = (end - start) / split;
  }
  if (isNaN(step)) {
    return console.log('something\'s wrong about the arguments');
  }

  const expression = math.parse(f).compile();

  let x = start + step;
  let result = 0;
  while (x <= (end - step)) {
    result += expression.evaluate({'x': x});
    x += step;
  }
  return ((expression.evaluate({'x': start}) +
      expression.evaluate({'x': end})) / 2 + result) * step;
}

function integrate_par(f, start, end, step = NaN, split = NaN) {
  if (isNaN(step) && !isNaN(split)) {
    step = (end - start) / split;
  }
  if (isNaN(step)) {
    return console.log('something\'s wrong about the arguments');
  }

  const expression = math.parse(f).compile();

  let fraction_odd = 0;
  let x = start + step;
  while (x <= (end - step)) {
    fraction_odd += expression.evaluate({'x': x});
    x += 2 * step;
  }

  let fraction_even = 0;
  x = start + (2 * step);
  while (x <= (end - (2 * step))) {
    fraction_even += expression.evaluate({'x': x});
    x += 2 * step;
  }

  return (expression.evaluate({'x': start}) + expression.evaluate({'x': end}) +
      (4 * fraction_odd) +
      (2 * fraction_even)) * (step / 3);
}

function integrate_double(f, start, end, eps, method) {
  let step = Math.sqrt(eps);

  let trap1;
  let trap2 = 0;
  do {
    trap1 = trap2;
    trap2 = method(f, start, end, step);
    step /= 2;
  } while (Math.abs(trap1 - trap2) > eps);
  return trap2;
}

function integrate_double_optimised(f, start, end, eps, method) {
  let step = Math.sqrt(eps);

  let trap1 = 0;
  let trap2 = method(f, start, end, step);
  if (Math.abs(trap1 - trap2) <= eps) {
    return trap2;
  }

  let margin;
  while (Math.abs(trap1 - trap2) > eps) {
    margin = step / 2;
    trap1 = trap2;
    trap2 = method(f, start + margin, end, step);
    step /= 2;
  }
  return trap2;
}
