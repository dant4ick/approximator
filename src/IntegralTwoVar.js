function multiple_integral_left_rect(f, outerStart, outerEnd, outersplit, insideStart, insideEnd, insidesplit, method) {
    let outerStep = (outerEnd - outerStart) / outersplit;

    let integralX = 0;
    let x = outerStart;
    while (x <= (outerEnd - outerStep)) {
        integralX += method(f, insideStart, insideEnd, step = NaN, insidesplit, y = x);
        x += outerStep;
    }
    return outerStep * integralX;
}

function multiple_integral_right_rect(f, outerStart, outerEnd, outersplit, insideStart, insideEnd, insidesplit, method) {
    let outerStep = (outerEnd - outerStart) / outersplit;

    let integralX = 0;
    let x = outerStart + outerStart;
    while (x <= outerEnd) {
        integralX += method(f, insideStart, insideEnd, step = NaN, insidesplit, y = x);
        x += outerStep;
    }
    return outerStep * integralX;
}

function multiple_integral_trap(f, outerStart, outerEnd, outersplit, insideStart, insideEnd, insidesplit, method) {
    let outerStep = (outerEnd - outerStart) / outersplit;

    let integralX = 0;
    let x = outerStart + outerStep;
    while (x <= (outerEnd - outerStart)) {
        integralX += method(f, insideStart, insideEnd, step = NaN, insidesplit, y = x);
        x += outerStep;
    }
    const expression = math.parse(f).compile();
    return ((expression.evaluate({'x': outerStart, 'y': insideStart}) + expression.evaluate({
        'x': outerEnd,
        'y': insideEnd
    })) / 2 + integralX) * outerStep;
}

function multiple_integral_par(f, outerStart, outerEnd, outersplit, insideStart, insideEnd, insidesplit, method) {
    let outerStep = (outerEnd - outerStart) / outersplit;

    const expression = math.parse(f).compile();

    let fraction_odd = 0;
    let x = outerStart + outerStep;
    while (x <= (outerEnd - outerStep)) {
        fraction_odd += method(f, insideStart, insideEnd, step = NaN, insidesplit, y = x);
        x += 2 * outerStep;
    }

    let fraction_even = 0;
    x = outerStart + (2 * outerStep);
    while (x <= (outerEnd - (2 * outerStep))) {
        fraction_even += method(f, insideStart, insideEnd, step = NaN, insidesplit, y = x);
        x += 2 * outerStep;
    }

    return (expression.evaluate({'x': outerStart, 'y': insideStart}) + expression.evaluate({
        'x': outerEnd,
        'y': insideEnd
    }) + (4 * fraction_odd) + (2 * fraction_even)) * (outerStep / 3);
}
