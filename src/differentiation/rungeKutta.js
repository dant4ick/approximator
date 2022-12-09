const math = require('mathjs');


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

function K(func, s, x, y, h, butcher) {
  if (s === 1) { return math.evaluate(func, {'x': x, 'y': y}); }

  let innerSum = 0;
  for (let j = 1; j < s; j++) {
    innerSum += butcher.a[s - 1][j - 1] * K(func, j, x, y, h, butcher);
  }
  return math.evaluate(func,
      {'x': x + butcher.c[s - 1] * h, 'y': y + h * innerSum});
}

function rungeKutta(func, x0, localDot, y0, h, s) {
  const butcher = {a: butcherArraysA[s], b: butcherArraysB[s], c: butcherArraysC[s]}

  const splits = (localDot - x0) / h;
  let x = x0;
  let y = y0;
  let sum;

  for (let iter = 0; iter < splits; iter++) {
    sum = 0;
    for (let i = 1; i < s + 1; i++) {
      sum += butcher.b[i - 1] * K(func, i, x, y, h, butcher);
    }
    x += h;
    y += h * sum;
  }
  return y;
}

console.log(rungeKutta(' y*(1 - x)', 0, 1, 1, 0.1, 1));
