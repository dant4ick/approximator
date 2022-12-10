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

function K(func, order, x, y, h, butcher) {
  if (order === 1) { return func.evaluate({'x': x, 'y': y}); }

  let innerSum = 0;
  for (let j = 1; j < order; j++) {
    innerSum += butcher.a[order - 1][j - 1] * K(func, j, x, y, h, butcher);
  }
  return func.evaluate(
      {'x': x + butcher.c[order - 1] * h, 'y': y + h * innerSum});
}

function rungeKutta(func, x0, localDot, y0, splits, order) {
  const butcher = {
    a: butcherArraysA[order],
    b: butcherArraysB[order],
    c: butcherArraysC[order],
  };
  func = math.parse(func).compile();

  let result = {x: [], y: []};

  for (let k = 0; k < order; k++) {
    result[`k${k + 1}`] = [];
  }

  const step = (localDot - x0) / splits;
  let x = x0;
  let y = y0;
  let k;
  let sum;

  for (let iter = 0; iter < splits; iter++) {
    sum = 0;
    for (let i = 1; i < order + 1; i++) {
      k = K(func, i, x, y, step, butcher);
      sum += butcher.b[i - 1] * k;
      result[`k${i}`].push(k);
    }
    result.x.push(x);
    result.y.push(y);
    x += step;
    y += step * sum;
  }
  result.x.push(x);
  result.y.push(y);
  console.log(result)
  return result;
}
