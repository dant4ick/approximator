function euler(funcX, t0, localDot, x0, splits) {
  let step = (localDot - t0) / splits;
  let t = t0;
  let x = x0;
  let result = {t: [], x: []};

  for (let iter = 0; iter < splits; iter++) {
    result.t.push(t);
    result.x.push(x);

    x += step * math.evaluate(funcX, {t: t, x: x});
    t += step;
  }

  result.t.push(t);
  result.x.push(x);
  return result;
}

function euler2(funcX, funcY, t0, localDot, x0, y0, splits) {
  let step = (localDot - t0) / splits;

  let t;
  let x;
  let y;

  let tBuff = t0;
  let xBuff = x0;
  let yBuff = y0;

  let result = {t: [], x: [], y: []};

  for (let iter = 0; iter < splits; iter++) {
    t = tBuff + step;
    x = xBuff + step * math.evaluate(funcX, {t: tBuff, x: xBuff, y: yBuff});
    y = yBuff + step * math.evaluate(funcY, {t: tBuff, x: xBuff, y: yBuff});

    result.t.push(tBuff);
    result.x.push(xBuff);
    result.y.push(yBuff);

    tBuff = t;
    xBuff = x;
    yBuff = y;
  }

  result.t.push(tBuff);
  result.x.push(xBuff);
  result.y.push(yBuff);
  return result;
}

function euler3(funcX, funcY, funcZ, t0, localDot, x0, y0, z0, splits) {
  let step = (localDot - t0) / splits;

  let t;
  let x;
  let y;
  let z;

  let tBuff = t0;
  let xBuff = x0;
  let yBuff = y0;
  let zBuff = z0;

  let result = {t: [], x: [], y: [], z: []};

  for (let iter = 0; iter < splits; iter++) {
    t = tBuff + step;
    x = xBuff + step *
        math.evaluate(funcX, {t: tBuff, x: xBuff, y: yBuff, z: zBuff});
    y = yBuff + step *
        math.evaluate(funcY, {t: tBuff, x: xBuff, y: yBuff, z: zBuff});
    z = zBuff + step *
        math.evaluate(funcZ, {t: tBuff, x: xBuff, y: yBuff, z: zBuff});

    result.t.push(tBuff);
    result.x.push(xBuff);
    result.y.push(yBuff);
    result.z.push(zBuff);

    tBuff = t;
    xBuff = x;
    yBuff = y;
    zBuff = z;
  }

  result.t.push(tBuff);
  result.x.push(xBuff);
  result.y.push(yBuff);
  result.z.push(zBuff);
  return result;
}