function multiple_integral_left_rect(f, dxStart, dxEnd, dxSplit, dyStart, dyEnd, dySplit, method) {
    let dxStep = (dxEnd - dxStart) / dxSplit;

    let dxIntegral = 0;
    let x = dxStart;
    while (x <= (dxEnd - dxStep)) {
        dxIntegral += method(f, dyStart, dyEnd, NaN, dySplit, x);
        x += dxStep;
    }
    return dxStep * dxIntegral;
}

function multiple_integral_right_rect(f, dxStart, dxEnd, dxSplit, dyStart, dyEnd, dySplit, method) {
    let dxStep = (dxEnd - dxStart) / dxSplit;

    let dxIntegral = 0;
    let x = dxStart + dxStart;
    while (x <= dxEnd) {
        dxIntegral += method(f, dyStart, dyEnd, NaN, dySplit, x);
        x += dxStep;
    }
    return dxStep * dxIntegral;
}

function multiple_integral_trap(f, dxStart, dxEnd, dxSplit, dyStart, dyEnd, dySplit, method) {
    let dxStep = (dxEnd - dxStart) / dxSplit;

    let dxIntegral = 0;
    let x = dxStart + dxStep;
    while (x <= (dxEnd - dxStart)) {
        dxIntegral += method(f, dyStart, dyEnd, NaN, dySplit, x);
        x += dxStep;
    }
    const expression = math.parse(f).compile();
    return ((expression.evaluate({'x': dxStart, 'y': dyStart}) + expression.evaluate({
        'x': dxEnd,
        'y': dyEnd
    })) / 2 + dxIntegral) * dxStep;
}

function multiple_integral_par(f, dxStart, dxEnd, dxSplit, dyStart, dyEnd, dySplit, method) {
    let dxStep = (dxEnd - dxStart) / dxSplit;

    const expression = math.parse(f).compile();

    let dxIntegralOdd = 0;
    let x = dxStart + dxStep;
    while (x <= (dxEnd - dxStep)) {
        dxIntegralOdd += method(f, dyStart, dyEnd, NaN, dySplit, x);
        x += 2 * dxStep;
    }

    let dxIntegralEven = 0;
    x = dxStart + (2 * dxStep);
    while (x <= (dxEnd - (2 * dxStep))) {
        dxIntegralEven += method(f, dyStart, dyEnd, NaN, dySplit, x);
        x += 2 * dxStep;
    }

    return (expression.evaluate({'x': dxStart, 'y': dyStart}) + expression.evaluate({
        'x': dxEnd,
        'y': dyEnd
    }) + (4 * dxIntegralOdd) + (2 * dxIntegralEven)) * (dxStep / 3);
}
