class NewElementHandler {
  constructor() {
    this.resultsSection = document.getElementById('results');
    this.solveButton = document.getElementById('create');

    this.inputExpression = document.getElementById('input');
    this.inputStart = document.getElementById('start');
    this.inputEnd = document.getElementById('end');
    this.algorithms = document.getElementsByName('algo');
    this.modes = document.getElementsByName('mode');

    this.solveButton.addEventListener('click', () => this.displayNewElem());
  }

  solveExpression(exp, start, end) {
    let algo;
    for (let i = 0; i < this.algorithms.length; i++) {
      if (this.algorithms[i].checked) {
        algo = this.algorithms[i].id;
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
      case 'l-rect':
        selectedAlgo = integrate_left_rect;
        selectedAlgoName = 'прямоугольники левых частей';
        break;
      case 'r-rect':
        selectedAlgo = integrate_right_rect;
        selectedAlgoName = 'прямоугольники правых частей';
        break;
      case 'trap':
        selectedAlgo = integrate_trap;
        selectedAlgoName = 'трапеции';
        break;
      case 'arc':
        selectedAlgo = integrate_par;
        selectedAlgoName = 'пораболы (Симпсона)';
        break;
    }

    let n, eps, result;
    let selectedMethodName;
    switch (method) {
      case 'splits':
        selectedMethodName = 'разбиения';
        n = document.getElementById('splits-input').value;
        result = selectedAlgo(exp, start, end, NaN, n);
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
      methodParam: (n || n === 0) ? n : eps
    };
  }

  displayNewElem() {
    // Решение
    const container = document.createElement('div');
    container.classList.add('container', 'border', 'rounded', 'mb-3');
    const solvationRow = document.createElement('div');
    solvationRow.classList.add('row');

    const exp = this.inputExpression.value;
    const start = parseFloat(this.inputStart.value);
    const end = parseFloat(this.inputEnd.value);
    const solvation = this.solveExpression(exp, start, end);

    const newExpression = document.createElement('div');
    newExpression.classList.add('col');
    const newTexExpression = math.parse(exp).toTex();
    newExpression.innerText =
        `\\[\\int_{${start}}^{${end}}(${newTexExpression})dx\\]`;

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
    MathJax.typeset();

  }
}

instance = new NewElementHandler();
