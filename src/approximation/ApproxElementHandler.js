class Approx {
  constructor() {
    this.resultsSection = document.getElementById('results');
    this.solveButton = document.getElementById('solve');

    this.inputExpression = document.getElementById('input');
    this.inputDot = document.getElementById('localDot');

    this.solveButton.addEventListener('click', () => this.displayNewElem());
  }

  updateTex() {
    MathJax.typeset();
  }

  displayNewElem() {
    return undefined;
  }
}

class ChebyshevApprox extends Approx {
  constructor() {
    super();
    this.truncation = document.getElementById('truncation');
  }

  elementConstructor() {
    const expression = this.inputExpression.value;
    const localDot = math.parse(this.inputDot.value).evaluate();
    const truncation = parseInt(this.truncation.value);

    let series = toSeries(expression, localDot, truncation);
    let {coefficients, polys, value} = series;

    let powerSeries = [];
    let polySeries = [];

    for (let j = 0; j < truncation; j++) {
      powerSeries.push(`${coefficients[j]}*(${polys[j]})`);
      polySeries.push(`(${math.parse(math.round(coefficients[j], 6).toString()).
          toTex()}) \\cdot {T}_{${j}}`);
      polys[j] = math.parse(polys[j]).toTex();
      polys[j] = `\\[{T}_{${j}} = ${polys[j]}\\]`;
    }
    powerSeries.push(coefficients[truncation])
    let funcTex = math.parse(expression).toTex();

    polySeries = polySeries.join(' + ');
    polySeries = `\\[${funcTex} \\approx ${polySeries}\\]`;

    powerSeries = powerSeries.join(' + ');
    powerSeries = math.rationalize(powerSeries).toTex();
    powerSeries = `\\[${funcTex} \\approx ${powerSeries}\\]`;

    value = `\\[ f(${localDot}) \\approx ${value}\\]`;
    return {
      polySeries, polys, powerSeries, value,
    };
  }

  displayNewElem() {
    const {polySeries, polys, powerSeries, value} = this.elementConstructor();
    const container = document.createElement('div');
    container.classList.add('container', 'border', 'rounded', 'mb-3');

    //Аппрооксимация полиномами
    const polynomialSeries = document.createElement('div');
    polynomialSeries.classList.add('row');

    const newPolynomialSeries = document.createElement('div');
    newPolynomialSeries.classList.add('col');
    newPolynomialSeries.innerText = `${polySeries}`;

    const polynomials = document.createElement('div');
    polynomials.classList.add('row');

    const newPolynomials = document.createElement('div');
    newPolynomials.classList.add('col');
    newPolynomials.innerText = `${polys.join('')}`;

    //Аппроксимация степенным рядом
    const divPowerSeries = document.createElement('div');
    divPowerSeries.classList.add('row');

    const newPowerSeries = document.createElement('div');
    newPowerSeries.classList.add('col');
    newPowerSeries.innerText = `${powerSeries}`;

    //Ответ
    const result = document.createElement('div');
    result.classList.add('row');

    const newResult = document.createElement('div');
    newResult.classList.add('col');
    newResult.innerText = `${value}`;

    //Отображене элементов
    polynomialSeries.appendChild(newPolynomialSeries);
    polynomials.appendChild(newPolynomials);
    divPowerSeries.appendChild(newPowerSeries);
    result.appendChild(newResult);

    container.appendChild(polynomialSeries);
    container.appendChild(polynomials);
    container.appendChild(divPowerSeries);
    container.appendChild(result);

    this.resultsSection.prepend(container);
    this.updateTex();
  }
}

class IterativeApprox extends Approx {
  constructor() {
    super();
    this.ordinate = document.getElementById('firstRecurrentTerm');
    this.eps = document.getElementById('eps');
  }

  elementConstructor() {
    let expr = this.inputExpression.value.replace(/y/g, 'yn');
    let dot = math.parse(this.inputDot.value).evaluate();
    let ordinate = math.parse(this.ordinate.value).evaluate();
    let eps = math.parse(this.eps.value).evaluate();

    let {ordinates, value} = iterations(expr, dot, ordinate, eps);

    let expressionDy = math.derivative(math.parse(expr), 'yn');
    let iterativeFormula = `yn - (${expr.toString()})/(${expressionDy.toString()})`;
    iterativeFormula = math.parse(iterativeFormula).
        toTex().
        replace(/yn/g, '{y}_{n}');
    iterativeFormula = `\\[{y}_{n+1} = {y}_{n} - \\frac{F(x, {y}_{n})}{{F}_{y}'(x, {y}_{n})} = ${iterativeFormula}\\]`;

    for (let i = 0; i < ordinates.length; i++) {

      ordinates[i] = `\\[{y}_{${i}} = ${ordinates[i]}\\]`;
    }
    ordinates = `${ordinates.join('')}`;

    value = `\\[f(${dot}) \\approx ${value}\\]`;

    return {iterativeFormula, ordinates, value};
  }

  displayNewElem() {
    const {iterativeFormula, ordinates, value} = this.elementConstructor();
    const container = document.createElement('div');
    container.classList.add('container', 'border', 'rounded', 'mb-3');


    const divRecur = document.createElement('div');
    divRecur.classList.add('row');
    const newRecur = document.createElement('div');
    newRecur.classList.add('col');
    newRecur.innerText = `${iterativeFormula}`;

    const divOrdinates = document.createElement('div');
    divOrdinates.classList.add('row');
    const newOrdinates = document.createElement('div');
    newOrdinates.classList.add('col');
    newOrdinates.innerText = `${ordinates}`;

    const divValue = document.createElement('div');
    divValue.classList.add('row');
    const newValue = document.createElement('div');
    newValue.classList.add('col');
    newValue.innerText = `${value}`;

    //Отображене элементов
    divRecur.appendChild(newRecur);
    divOrdinates.appendChild(newOrdinates);
    divValue.appendChild(newValue);

    container.appendChild(divRecur);
    container.appendChild(divOrdinates);
    container.appendChild(divValue);

    this.resultsSection.prepend(container);
    this.updateTex();
  }
}