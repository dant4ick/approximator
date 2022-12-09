const math = require('mathjs');


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

console.log(euler2('z', '-2*z - y + x', 0, 1, 1, 0, 5))
