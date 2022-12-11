function euler(func, x0, localDot, y0, splits) {
  let step = (localDot - x0) / splits;
  let x = x0;
  let y = y0;
  let points = [ {'x':x0, 'y':y0} ];

  for (let iter = 0; iter < splits; iter++) {
    y += step * math.evaluate(func, points[iter])
    x += step;
    points.push( {'x': x, 'y': y} )
  }

  return points;
}

function euler2(exp1, exp2, x0, localDot, y0, dy0, splits) {
  let step = (localDot - x0) / splits;

  let x;
  let dy;
  let z;

  let xBuff = x0;
  let dyBuff = y0;
  let zBuff = dy0;

  for (let iter = 0; iter < splits; iter++) {
    x = xBuff + step;
    dy = dyBuff + step * math.evaluate(exp1, {x: xBuff, y: dyBuff, z: zBuff});
    z = zBuff + step * math.evaluate(exp2, {x: xBuff, y: dyBuff, z: zBuff});

    xBuff = x;
    dyBuff = dy;
    zBuff = z;
  }
  return z;
}

function euler3 (exp1, exp2, exp3, t0, localDot, x0, y0, z0, splits) {

  let step = (localDot - t0) / splits;

  let t;
  let x;
  let y;
  let z;

  let tBuff = t0;
  let xBuff = x0;
  let yBuff = y0;
  let zBuff = z0;

  let result = [{'t': tBuff, 'x': xBuff, 'y': yBuff, 'z': zBuff}]

  for (let iter = 0; iter < splits; iter++) {

    t = tBuff + step
    x = xBuff + step * math.evaluate(exp1, {t: tBuff, x: xBuff, y: yBuff, z: zBuff});
    y = yBuff + step * math.evaluate(exp2, {t: tBuff, x: xBuff, y: yBuff, z: zBuff});
    z = zBuff + step * math.evaluate(exp3, {t: tBuff, x: xBuff, y: yBuff, z: zBuff});

    tBuff = t;
    xBuff = x;
    yBuff = y;
    zBuff = z;

    result.push({'t': t, 'x': x, 'y': y, 'z': z})
  }

  return result;
}


console.log(euler3('-2x + 5z', 'sin(t-1)x - y + 3z', '-x + 2z', 0, 0.3, 2, 1, 1, 10))
