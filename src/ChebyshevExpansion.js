const math = require("mathjs")

function polyNum(ord, x) {
    if (ord === 0) {
        return 1
    }
    if (ord === 1) {
        return x
    }
    return 2 * x * polyNum(ord - 1, x) - polyNum(ord - 2, x)
}

function polyStr(ord) {
    if (ord === 0) {
        return '1'
    }
    if (ord === 1) {
        return 'x'
    }
    return math.rationalize(`(2 * x) * (${polyStr(ord - 1)}) - (${polyStr(ord - 2)})`).toString()
}

function rootPoly(k, n) {
    return math.cos((math.pi * (k + 0.5)) / n)
}

function coefficient(j, N, f) {
    let sum = 0;
    let root;
    for (let k = 0; k < N; k++) {
        root = rootPoly(k, N);
        sum += (math.compile(f).evaluate({"x": root})) * polyNum(j, root);
    }
    return math.round((2 / N) * sum, 13)
}

function toSeries(func, localDot, truncation) {
    let value = 0;
    let coefficients = [];
    let polys = [];
    for (let j = 0; j < truncation; j++) {
        coefficients.push(coefficient(j, truncation, func));
        polys.push(polyStr(j));
        value += coefficient(j, truncation, func) * polyNum(j, localDot);
    }
    value -= 0.5 * coefficient(0, truncation, func);

    let polySeries = [];
    let powerSeries = [];
    for (let j = 0; j < truncation; j++) {
        powerSeries.push(`${coefficients[j]}*(${polys[j]})`);
        polySeries.push(`${math.parse(coefficients[j].toString()).toTex()}*{T}_{${j}}`);
        polys[j] = math.parse(polys[j]).toTex();
        polys[j] = `\\[{T}_{${j}} = ${polys[j]}\\]`;
    }

    let funcTex = math.parse(func).toTex();

    polySeries = polySeries.join(' + ');
    polySeries = `\\[${funcTex} \\approx ${polySeries}\\]`;

    powerSeries = powerSeries.join(' + ');
    powerSeries = math.rationalize(powerSeries).toTex();
    powerSeries = `\\[${funcTex} \\approx ${powerSeries}\\]`;

    return {polySeries, polys, powerSeries, value}
}

function iterations(F, localDot, ordinate, eps) {
    F = F.replace(/y/g, 'yn')
    let expression = math.rationalize(math.parse(F), {'x': localDot});
    let expressionDy = math.derivative(math.parse(F), 'yn');

    let iterativeFormula = `yn - (${expression.toString()})/(${expressionDy.toString()})`;
    iterativeFormula = math.parse(iterativeFormula).toTex().replace(/yn/g, '{y}_{n}');
    iterativeFormula = `\\[{y}_{n+1} = {y}_{n} - \\frac{F(x, {y}_{n})}{{F}_{y}'(x, {y}_{n})} = ${iterativeFormula}\\]`;

    expression = expression.compile();
    expressionDy = expressionDy.compile();

    let yn;
    let nextYn = ordinate;
    let i = 0;
    let ordinates = [`\\[{y}_{${i}} = ${nextYn}\\]`];
    do {
        yn = nextYn;
        nextYn = yn - expression.evaluate({
            'x': localDot,
            'yn': yn
        }) / expressionDy.evaluate({'x': localDot, 'yn': yn});
        i++;
        ordinates.push(`\\[{y}_{${i}} = ${nextYn}\\]`);
    } while (math.abs(yn - nextYn) >= eps);

    let value = `\\[f({x}_{0}) = f(${localDot}) \\approx ${nextYn}\\]`;

    return {iterativeFormula, ordinates, value}
}

console.log(toSeries('sin(x)', math.pi, 7))
console.log(iterations('y^2 - x', 14.76, 1, 0.000001))