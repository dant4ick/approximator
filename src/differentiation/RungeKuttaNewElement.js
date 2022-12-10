class RungeKuttaNewElement {
  constructor() {
    this.resultsSection = document.getElementById('results');
    this.solveButton = document.getElementById('solve');

    this.inputExpression = document.getElementById('input');

    this.xStart = document.getElementById('x0');
    this.xEnd = document.getElementById('local-dot');
    this.yStart = document.getElementById('y0');
    this.splits = document.getElementById('splits');
    this.methodOrder = document.getElementById('order');

    this.solveButton.addEventListener('click', () => this.displayNewElem());
  }

  updateTex() {
    MathJax.typeset();
  }

  displayNewElem() {
    const resultContainer = document.createElement('div');
    resultContainer.classList.add('container', 'border', 'rounded', 'mb-3');

    const expression = this.inputExpression.value;
    const xStart = parseFloat(this.xStart.value);
    const xEnd = parseFloat(this.xEnd.value);
    const yStart = parseFloat(this.yStart.value);
    const splits = parseInt(this.splits.value);
    const methodOrder = parseInt(this.methodOrder.value);

    const resultTable = document.createElement('table');
    resultTable.classList.add('table');

    const solution = rungeKutta(expression, xStart, xEnd, yStart, splits, methodOrder);

    // составление заголовков таблицы
    const headers = Object.keys(solution);
    const tableHeaders = document.createElement('thead');
    const tableHeadersRow = document.createElement('tr');

    let tableHeader;
    for (let header in headers) {
      tableHeader = document.createElement('th')
      tableHeader.classList.add('col')
      tableHeader.textContent = `$${headers[header]}$`;
      tableHeadersRow.append(tableHeader);
    }

    // заполнение таблицы значениями
    let tableBody = document.createElement('tbody');

    let tableRow;
    let tableValue, currentValue;

    for (let value in solution[headers[0]]) {
      tableRow = document.createElement('tr');
      for (let header in headers) {
        tableValue = document.createElement('td');
        currentValue = solution[headers[header]][value];
        if (!math.isUndefined(currentValue)) {
          currentValue = math.round(currentValue, 6);
        }
        tableValue.textContent = currentValue;
        tableRow.append(tableValue);
      }
      tableBody.append(tableRow);
    }


    tableHeaders.append(tableHeadersRow);
    resultTable.append(tableHeaders, tableBody);
    resultContainer.append(resultTable);

    // resultContainer.textContent = '$Итог:$';

    this.resultsSection.prepend(resultContainer);
    this.updateTex();
  }
}