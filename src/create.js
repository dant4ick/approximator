class Create {
  constructor() {
    this.display = document.getElementById('display');
    this.button = document.getElementById('create');

    this.input = document.getElementById('input');
    this.start = document.getElementById('start');
    this.end = document.getElementById('end');
    this.algorithms = document.getElementsByName('algo');
    this.modes = document.getElementsByName('mode');

    this.button.addEventListener('click', () => this.displayNewElem());
  }

  displayNewElem() {
    const newValue = document.createElement('div');
    newValue.classList.add('col');
    const start = parseFloat(this.start.value);
    const end = parseFloat(this.end.value);

    let algo;
    for (let i = 0; i < this.algorithms.length; i++) {
      if (this.algorithms[i].checked) {
        algo = this.algorithms[i].id;
      }
    }

    let mode;
    for (let i = 0; i < this.modes.length; i++) {
      if (this.modes[i].checked) {
        mode = this.modes[i].id;
      }
    }

    let selectedAlgo;
    let n;
    let result;

    switch (algo) {
      case 'l-rect':
        selectedAlgo = integrate_left_rect
        break;
      case 'r-rect':
        selectedAlgo = integrate_right_rect
        break;
      case 'trap':
        selectedAlgo = integrate_trap
        break;
      case 'parabola':
        selectedAlgo = integrate_par
        break;
    }

    const exp = this.input.value;

    switch (mode) {
      case 'splits':
        n = document.getElementById('splits-input').value
        result = selectedAlgo(exp, start, end, NaN, n);
        break;
      case 'double':
        result = integrate_double(exp, start, end, 0.000001, selectedAlgo);
        break;
      case 'double-margin':
        result = integrate_double_optimised(exp, start, end, 0.000001, selectedAlgo);
        break;
    }

    newValue.innerText = `\\[${result}\\]`;

    const container = document.createElement('div');
    container.classList.add('container', 'border', 'rounded', 'mb-3', 'align-content-center')
    const row = document.createElement('div');
    row.classList.add('row');

    const newExpression = document.createElement('div');
    newExpression.classList.add('col');
    const newTexExpression = math.parse(exp).toTex();
    newExpression.innerText =
        `\\[\\int_{${start}}^{${end}}(${newTexExpression})dx\\]`;

    const newApprox = document.createElement('div');
    newApprox.classList.add('col-1', 'position-relative');
    newApprox.innerText = '\\[\\approx\\]';

    row.appendChild(newExpression);
    row.appendChild(newApprox);
    row.appendChild(newValue);
    container.appendChild(row);

    this.display.prepend(container);
    MathJax.typeset();

  }
}

createClass = new Create();
