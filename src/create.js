class Create {
  constructor() {
    this.display = document.getElementById('display');
    this.button = document.getElementById('create');

    this.input = document.getElementById('input');
    this.start = document.getElementById('start');
    this.end = document.getElementById('end');

    this.button.addEventListener('click', () => this.displayNewElem());
  }

  displayNewElem() {
    const container = document.createElement('div');
    container.classList.add('container', 'border', 'border-success', 'border-2', 'border-top-0', 'border-bottom-0', 'rounded');
    const row = document.createElement('div');
    row.classList.add('row');

    const newExpression = document.createElement('div');
    newExpression.classList.add('col-auto');
    newExpression.innerText = '\\[' + math.parse(this.input.value).toTex() +
        '\\]';

    const newValue = document.createElement('div');
    newValue.classList.add('col-auto');

    const start = parseFloat(this.start.value);
    const end = parseFloat(this.end.value);
    const value = integrate_left_rect(this.input.value, start, end, NaN,
        10_000);
    newValue.innerText = '\\[' + (value) + '\\]';

    row.appendChild(newExpression);
    row.appendChild(newValue);
    container.appendChild(row);

    this.display.prepend(container);
    MathJax.typeset();

  }
}

const createClass = new Create();
