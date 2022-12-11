const butcherArraysA = {
  1:[
    [0],
    ],
  2:[
    [0     ],
    [1/2, 0],
    ],
  3:[
    [0        ],
    [1/2, 0   ],
    [0,   1, 0],
    ],
  4:[
    [0             ],
    [1/2, 0        ],
    [0,   1/2, 0   ],
    [0,   0,   1, 0],
    ],
};
const butcherArraysC = {
  1: [0],
  2: [0, 1/2],
  3: [0, 1/2, 1],
  4: [0, 1/2, 1/2, 1],
};
const butcherArraysB = {
  1: [1],
  2: [0, 1],
  3: [1/6, 4/6, 1/6],
  4: [1/6, 2/6, 2/6, 1/6],
};

function K(func, order, t, x, h, butcher) {
  if (order === 1) { return func.evaluate({'t': t, 'x': x}); }

  let innerSum = 0;
  for (let j = 1; j < order; j++) {
    innerSum += butcher.a[order - 1][j - 1] * K(func, j, t, x, h, butcher);
  }
  return func.evaluate(
      {'t': t + butcher.c[order - 1] * h, 'x': x + h * innerSum});
}

function KX(funcX, funcY, s, t, x, y, h, butcher) {
  if (s === 1) { return funcX.evaluate( {'t': t, 'x': x, 'y': y}) }

  let innerSumX = 0;
  let innerSumY = 0;

  for (let j = 1; j < s; j++) {
    innerSumX += butcher.a[s - 1][j - 1] * KX(funcX, funcY, j, t, x, y, h, butcher);
    innerSumY += butcher.a[s - 1][j - 1] * KY(funcX, funcY, j, t, x, y, h, butcher);
  }
  return funcX.evaluate({
    't': t + butcher.c[s - 1] * h,
    'x': x + h * innerSumX,
    'y': y + h * innerSumY});
}

function KY(funcX, funcY, s, t, x, y, h, butcher) {
  if (s === 1) { return funcY.evaluate( {'t': t, 'x': x, 'y': y}) }

  let innerSumY = 0;
  let innerSumZ = 0;

  for (let j = 1; j < s; j++) {
    innerSumY += butcher.a[s - 1][j - 1] * KX(funcX, funcY, j, t, x, y, h, butcher);
    innerSumZ += butcher.a[s - 1][j - 1] * KY(funcX, funcY, j, t, x, y, h, butcher);
  }
  return funcY.evaluate({
    't': t + butcher.c[s - 1] * h,
    'x': x + h * innerSumY,
    'y': y + h * innerSumZ});
}

function rungeKutta(func, t0, localDot, x0, splits, order) {
  const butcher = {
    a: butcherArraysA[order],
    b: butcherArraysB[order],
    c: butcherArraysC[order],
  };
  func = math.parse(func).compile();

  let result = {t: [], x: []};

  for (let k = 0; k < order; k++) {
    result[`K_{${k + 1}}`] = [];
  }

  const step = (localDot - t0) / splits;
  let t = t0;
  let x = x0;
  let k;
  let sum;

  for (let iter = 0; iter < splits; iter++) {
    sum = 0;
    for (let i = 1; i < order + 1; i++) {
      k = K(func, i, t, x, step, butcher);
      sum += butcher.b[i - 1] * k;
      result[`K_{${i}}`].push(k);
    }
    result.t.push(t);
    result.x.push(x);
    t += step;
    x += step * sum;
  }
  result.t.push(t);
  result.x.push(x);
  return result;
}

function rungeKutta2(funcX, funcY, t0, localDot, x0, y0, splits, order) {
  const butcher = {a: butcherArraysA[order], b: butcherArraysB[order], c: butcherArraysC[order]}

  funcX = math.parse(funcX).compile();
  funcY = math.parse(funcY).compile();

  const step = (localDot - t0) / splits;

  let t = t0;
  let x = x0;
  let y = y0;
  let kX, kY;

  let sumOfKX;
  let sumOfKY;

  let result = {t: [], x: [], y: []}

  for (let k = 0; k < order; k++) {
    result[`K_{${k + 1}}`] = [];
    result[`L_{${k + 1}}`] = [];
  }


  for (let iter = 0; iter < splits; iter++) {
    sumOfKX = 0;
    sumOfKY = 0;

    for (let i = 1; i < order + 1; i++) {
      kX = KX(funcX, funcY, i, t, x, y, step, butcher);
      kY = KY(funcX, funcY, i, t, x, y, step, butcher);
      result[`K_{${i}}`].push(kX);
      result[`L_{${i}}`].push(kY);
      sumOfKX += butcher.b[i - 1] * kX;
      sumOfKY += butcher.b[i - 1] * kY;
    }
    result.t.push(t);
    result.x.push(x);
    result.y.push(y);

    t += step;
    x += step * sumOfKX;
    y += step * sumOfKY;
  }
  result.t.push(t);
  result.x.push(x);
  result.y.push(y);
  return result;
}
