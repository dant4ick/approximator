class IntegralNewElement {
  constructor() {
    this.resultsSection = document.getElementById('results');
    this.solveButton = document.getElementById('solve');

    this.inputExpression = document.getElementById('input');
    this.dxInputStart = document.getElementById('dx-start');
    this.dxInputEnd = document.getElementById('dx-end');
    this.dxInputSplits = document.getElementById('dx-splits-input');
    this.dxAlgorithms = document.getElementsByName('dx-algo');

    this.solveButton.addEventListener('click', () => this.displayNewElem());
  }

  updateTex() {
    MathJax.typeset();
  }

  displayNewElem() {
    return undefined;
  }
}

class Numerical extends IntegralNewElement {
  constructor() {
    super();
    this.modes = document.getElementsByName('mode');
  }

  solveExpression(exp, start, end) {
    let algo;
    for (let i = 0; i < this.dxAlgorithms.length; i++) {
      if (this.dxAlgorithms[i].checked) {
        algo = this.dxAlgorithms[i].id;
      }
    }

    let method;
    for (let i = 0; i < this.modes.length; i++) {
      if (this.modes[i].checked) {
        method = this.modes[i].id;
      }
    }

    let selectedAlgo, selectedAlgoName;
    switch (algo) {
      case 'dx-l-rect':
        selectedAlgo = integrate_left_rect;
        selectedAlgoName = 'прямоугольники левых частей';
        break;
      case 'dx-r-rect':
        selectedAlgo = integrate_right_rect;
        selectedAlgoName = 'прямоугольники правых частей';
        break;
      case 'dx-trap':
        selectedAlgo = integrate_trap;
        selectedAlgoName = 'трапеции';
        break;
      case 'dx-arc':
        selectedAlgo = integrate_par;
        selectedAlgoName = 'параболы (Симпсона)';
        break;
    }

    let splits, eps, result;
    let selectedMethodName;
    switch (method) {
      case 'splits':
        splits = this.dxInputSplits.value;
        selectedMethodName = 'разбиения';
        result = selectedAlgo(exp, start, end, NaN, this.dxInputSplits.value);
        break;
      case 'double':
        selectedMethodName = 'двойной пересчет';
        eps = document.getElementById('double-input').value;
        result = integrate_double(exp, start, end, eps, selectedAlgo);
        break;
      case 'double-margin':
        selectedMethodName = 'двойной пересчет с отступами';
        eps = document.getElementById('double-margin-input').value;
        result = integrate_double_optimised(exp, start, end, eps, selectedAlgo);
        break;
    }
    return {
      result: result,
      algorithm: selectedAlgoName,
      method: selectedMethodName,
      methodParam: (splits || splits === 0)
          ? splits
          : eps,
    };
  }

  displayNewElem() {
    // Решение
    const container = document.createElement('div');
    container.classList.add('container', 'border', 'rounded', 'mb-3');
    const solvationRow = document.createElement('div');
    solvationRow.classList.add('row');

    const exp = this.inputExpression.value;
    const start = parseFloat(this.dxInputStart.value);
    const end = parseFloat(this.dxInputEnd.value);
    const solvation = this.solveExpression(exp, start, end);

    const newExpression = document.createElement('div');
    newExpression.classList.add('col');
    const newTexExpression = math.parse(exp).toTex();
    newExpression.innerText =
        `\\[\\int_{${start}}^{${end}}\\left(${newTexExpression}\\right)dx\\]`;

    const newValue = document.createElement('div');
    newValue.classList.add('col', 'm-auto');
    newValue.innerText = `\\[${solvation.result}\\]`;

    const newApprox = document.createElement('div');
    newApprox.classList.add('col-1', 'm-auto');
    newApprox.innerText = '\\[\\approx\\]';

    // Информация о решении
    const infoContainer = document.createElement('div');
    infoContainer.classList.add('container', 'p-2', 'text-center');

    const infoAlgo = document.createElement('div');
    infoAlgo.classList.add('p');
    infoAlgo.innerText = `Алгоритм: ${solvation.algorithm}`;

    const infoMethod = document.createElement('div');
    infoMethod.classList.add('p');
    infoMethod.innerText = `Метод: ${solvation.method} (${solvation.methodParam})`;

    // Отображение элементов
    solvationRow.appendChild(newExpression);
    solvationRow.appendChild(newApprox);
    solvationRow.appendChild(newValue);

    infoContainer.appendChild(infoAlgo);
    infoContainer.appendChild(infoMethod);

    container.appendChild(solvationRow);
    container.appendChild(infoContainer);

    this.resultsSection.prepend(container);
    this.updateTex();

  }
}

class Multiple extends IntegralNewElement {
  constructor() {
    super();
    this.dyInputStart = document.getElementById('dy-start');
    this.dyInputEnd = document.getElementById('dy-end');
    this.dyInputSplits = document.getElementById('dy-splits-input');

    this.dyAlgorithms = document.getElementsByName('dy-algo');
  }

  solveExpression() {
    let dxAlgo;
    for (let i = 0; i < this.dxAlgorithms.length; i++) {
      if (this.dxAlgorithms[i].checked) {
        dxAlgo = this.dxAlgorithms[i].id;
      }
    }

    let dyAlgo;
    for (let i = 0; i < this.dyAlgorithms.length; i++) {
      if (this.dyAlgorithms[i].checked) {
        dyAlgo = this.dyAlgorithms[i].id;
      }
    }

    let dxSelectedAlgo, dxSelectedAlgoName;
    switch (dxAlgo) {
      case 'dx-l-rect':
        dxSelectedAlgo = multiple_integrate_left_rect;
        dxSelectedAlgoName = 'прямоугольники левых частей';
        break;
      case 'dx-r-rect':
        dxSelectedAlgo = multiple_integrate_right_rect;
        dxSelectedAlgoName = 'прямоугольники правых частей';
        break;
      case 'dx-trap':
        dxSelectedAlgo = multiple_integrate_trap;
        dxSelectedAlgoName = 'трапеции';
        break;
      case 'dx-arc':
        dxSelectedAlgo = multiple_integrate_par;
        dxSelectedAlgoName = 'параболы (Симпсона)';
        break;
    }

    let dySelectedAlgo, dySelectedAlgoName;
    switch (dyAlgo) {
      case 'dy-l-rect':
        dySelectedAlgo = integrate_left_rect;
        dySelectedAlgoName = 'прямоугольники левых частей';
        break;
      case 'dy-r-rect':
        dySelectedAlgo = integrate_right_rect;
        dySelectedAlgoName = 'прямоугольники правых частей';
        break;
      case 'dy-trap':
        dySelectedAlgo = integrate_trap;
        dySelectedAlgoName = 'трапеции';
        break;
      case 'dy-arc':
        dySelectedAlgo = integrate_par;
        dySelectedAlgoName = 'параболы (Симпсона)';
        break;
    }
    const
        expression = this.inputExpression.value,
        dxStart = parseFloat(this.dxInputStart.value),
        dxEnd = parseFloat(this.dxInputEnd.value),
        dxSplits = parseInt(this.dxInputSplits.value),
        dyStart = parseFloat(this.dyInputStart.value),
        dyEnd = parseFloat(this.dyInputEnd.value),
        dySplits = parseInt(this.dyInputSplits.value);

    const result = dxSelectedAlgo(
        expression,
        dxStart,
        dxEnd,
        dxSplits,
        dyStart,
        dyEnd,
        dySplits,
        dySelectedAlgo);

    return {
      result: result,

      expression: expression,

      dxAlgorithm: dxSelectedAlgoName,
      dyAlgorithm: dySelectedAlgoName,

      dxStart: dxStart,
      dxEnd: dxEnd,
      dyStart: dyStart,
      dyEnd: dyEnd,

      dxSplits: dxSplits,
      dySplits: dySplits,
    };
  }

  displayNewElem() {
    // Решение
    const container = document.createElement('div');
    container.classList.add('container', 'border', 'rounded', 'mb-3');
    const solvationRow = document.createElement('div');
    solvationRow.classList.add('row');

    const solvation = this.solveExpression();

    const newExpression = document.createElement('div');
    newExpression.classList.add('col');
    const newTexExpression = math.parse(solvation.expression).toTex();
    newExpression.innerText =
        `\\[\\int_{${solvation.dxStart}}^{${solvation.dxEnd}}` +
        `\\int_{${solvation.dyStart}}^{${solvation.dyEnd}}` +
        `\\left(${newTexExpression}\\right)dydx\\]`;

    const newValue = document.createElement('div');
    newValue.classList.add('col', 'm-auto');
    newValue.innerText = `\\[${solvation.result}\\]`;

    const newApprox = document.createElement('div');
    newApprox.classList.add('col-1', 'm-auto');
    newApprox.innerText = '\\[\\approx\\]';

    // Информация о решении
    const infoContainer = document.createElement('div');
    infoContainer.classList.add('container', 'p-2', 'text-center');

    const dxInfoAlgo = document.createElement('div');
    dxInfoAlgo.classList.add('p');
    dxInfoAlgo.innerText = `Алгоритм по dy: ${solvation.dxAlgorithm} (${solvation.dxSplits})`;

    const dyInfoAlgo = document.createElement('div');
    dyInfoAlgo.classList.add('p');
    dyInfoAlgo.innerText = `Алгоритм по dx: ${solvation.dyAlgorithm} (${solvation.dySplits})`;

    // Отображение элементов
    solvationRow.appendChild(newExpression);
    solvationRow.appendChild(newApprox);
    solvationRow.appendChild(newValue);

    infoContainer.appendChild(dxInfoAlgo);
    infoContainer.appendChild(dyInfoAlgo);

    container.appendChild(solvationRow);
    container.appendChild(infoContainer);

    this.resultsSection.prepend(container);
    this.updateTex();
  }
}
