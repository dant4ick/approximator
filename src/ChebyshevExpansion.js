const math = require("mathjs")

function polyNum(ord, x) {
  if (ord === 0){return 1}
  if (ord === 1){return x}
  return 2 * x * polyNum(ord - 1, x) - polyNum(ord - 2, x)
}

function polyStr(ord) {
  if (ord === 0){return '1'}
  if (ord === 1){return 'x'}
  return math.rationalize(`(2 * x) * (${polyStr(ord - 1)}) - (${polyStr(ord - 2)})`).toString()
}

function rootPoly(k, n) {
  return math.cos((math.pi * (k + 0.5)) / n)
}

function coefficient(j, N, f) {
  let sum = 0
  let root
  for (let k = 0; k < N; k++) {
    root = rootPoly(k, N)
    sum += (math.compile(f).evaluate({"x": root})) * polyNum(j, root)
  }
  return (2/N) * sum
}

function toSeries(func, localDot, truncation) {
  let value = 0
  let coefficients = []
  let polys = []
  for (let j = 0; j < truncation; j++) {
    coefficients.push(coefficient(j, truncation, func))
    polys.push(polyStr(j))
    value += coefficient(j, truncation, func) * polyNum(j, localDot)
  }
  value -= 0.5 * coefficient(0, truncation, func)
  return {coefficients, polys, value}
}
