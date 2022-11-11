function iterations(F, localDot, ordinate, eps) {
  let expression = math.rationalize(math.parse(F), {'x': localDot});
  let expressionDy = math.derivative(math.parse(F), 'yn');

  expression = expression.compile();
  expressionDy = expressionDy.compile();

  let yn = ordinate;
  let nextYn = yn - expression.evaluate({
    'x': localDot,
    'yn': yn,
  }) / expressionDy.evaluate({'x': localDot, 'yn': yn});
  let ordinates = [yn, nextYn];

  for (let i = 0; math.abs(yn - nextYn) >= eps; i++) {
    yn = nextYn;
    nextYn = yn - expression.evaluate({
      'x': localDot,
      'yn': yn,
    }) / expressionDy.evaluate({'x': localDot, 'yn': yn});
    ordinates.push(nextYn);
  }

  let value = nextYn;

  return {ordinates, value};
}
