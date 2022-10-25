function multiple_integrate_left_rect(f, dxStart, dxEnd, dxSplit, dyStart, dyEnd, dySplit, method) {
    let dyStep = (dyEnd - dyStart) / dySplit;

    let dyIntegral = 0;
    let y = dyStart;
    while (y <= (dyEnd - dyStep)) {
        dyIntegral += method(f, dxStart, dxEnd, NaN, dxSplit, y);
        y += dyStep;
    }
    return dyStep * dyIntegral;
}

function multiple_integrate_right_rect(f, dxStart, dxEnd, dxSplit, dyStart, dyEnd, dySplit, method) {
    let dyStep = (dyEnd - dyStart) / dySplit

    let dyIntegral = 0;
    let y = dyStart + dyStep;
    while (y <= dyEnd) {
        dyIntegral += method(f, dxStart, dxEnd, NaN, dxSplit, y);
        y += dyStep;
    }
    return dyStep * dyIntegral;
}

function multiple_integrate_trap(f, dxStart, dxEnd, dxSplit, dyStart, dyEnd, dySplit, method) {
    let dyStep = (dyEnd - dyStart) / dySplit;

    let dyIntegral = 0;
    let y = dyStart + dyStep;
    while (y <= (dyEnd - dyStep)) {
        dyIntegral += method(f, dxStart, dxEnd, NaN, dxSplit, y);
        y += dyStep;
    }
    const expression = math.parse(f).compile();
    return (
        (expression.evaluate({'x': dyStart, 'y': dxStart}) +
        expression.evaluate({'x': dyEnd, 'y': dxEnd})) / 2 + dyIntegral)
        * dyStep;
}

function multiple_integrate_par(f, dxStart, dxEnd, dxSplit, dyStart, dyEnd, dySplit, method) {
    let dyStep = (dyEnd - dyStart) / dySplit;

    let dyIntegralOdd = 0;

    let y = dyStart + dyStep;
    while (y <= (dyEnd - dyStep)) {
        dyIntegralOdd += method(f, dxStart, dxEnd, NaN, dxSplit, y);
        y += 2 * dyStep;
    }
    let dyIntegralEven = 0;

    y = dyStart + (2 * dyStep);
    while (y <= (dyEnd - (2 * dyStep))) {
        dyIntegralEven += method(f, dxStart, dxEnd, NaN, dxSplit, y);
        y += 2 * dyStep;
    }

    const expression = math.parse(f).compile();
    return (expression.evaluate({'x': dyStart, 'y': dxStart}) + expression.evaluate({
        'x': dyEnd,
        'y': dxEnd
    }) + (4 * dyIntegralOdd) + (2 * dyIntegralEven)) * (dyStep / 3);
}
