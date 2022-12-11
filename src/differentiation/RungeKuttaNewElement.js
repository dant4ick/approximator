class RungeKuttaNewElement {
  constructor() {
    this.resultsSection = document.getElementById('results');
    this.solveButton = document.getElementById('solve');

    this.numberOfEquationsButtons = document.getElementsByName(
        'number-of-equations');

    this.inputExpressionDX = document.getElementById('inputDX');
    this.inputExpressionDY = document.getElementById('inputDY');
    this.inputExpressionDZ = document.getElementById('inputDZ');

    this.tStart = document.getElementById('t0');
    this.tEnd = document.getElementById('local-dot');

    this.xStart = document.getElementById('x0');
    this.yStart = document.getElementById('y0');
    this.zStart = document.getElementById('z0');

    this.inputExpressionFields = [
      this.inputExpressionDX,
      this.inputExpressionDY,
      this.inputExpressionDZ];

    this.inputStartFields = [
      this.xStart,
      this.yStart,
      this.zStart];

    this.numberOfEquationsButtons.forEach(
        btn => btn.addEventListener('click',
            () => this.updateInputFields(btn.value)),
    );

    this.splits = document.getElementById('splits');
    this.methodOrder = document.getElementById('order');

    // обновление порядка метода
    window.addEventListener('load', () => {
      this.updateMethodOrder();
      this.updateInputFields(this.getNumberOfFields());
    });

    this.methodOrder.addEventListener('input', () => this.updateMethodOrder());

    this.solveButton.addEventListener('click', () => this.displayNewElem());
  }

  updateTex() {
    MathJax.typeset();
  }

  getNumberOfFields() {
    for (let btn in this.numberOfEquationsButtons) {
      if (this.numberOfEquationsButtons[btn].checked) {
        return parseInt(this.numberOfEquationsButtons[btn].value);
      }
    }
  }

  updateInputFields(numberOfFields) {
    for (let inputField in this.inputExpressionFields) {
      if (inputField > numberOfFields - 1) {
        this.inputExpressionFields[inputField].parentElement.parentElement.classList.add(
            'visually-hidden');
        this.inputStartFields[inputField].parentElement.parentElement.classList.add(
            'visually-hidden');
      } else {
        this.inputExpressionFields[inputField].parentElement.parentElement.classList.remove(
            'visually-hidden');
        this.inputStartFields[inputField].parentElement.parentElement.classList.remove(
            'visually-hidden');
      }
    }
  }

  updateMethodOrder() {
    this.methodOrder.previousElementSibling.firstElementChild.textContent = this.methodOrder.value;
  }

  displayNewElem() {
    const resultContainer = document.createElement('div');
    resultContainer.classList.add('container', 'border', 'rounded', 'mb-3');

    const tStart = math.evaluate(this.tStart.value);
    const tEnd = math.evaluate(this.tEnd.value);
    const splits = parseInt(this.splits.value);
    const methodOrder = parseInt(this.methodOrder.value);

    const expressions = [];
    const startPoints = [];
    const numberOfFields = this.getNumberOfFields();
    for (let expression in this.inputExpressionFields) {
      if (expression < numberOfFields) {
        expressions.push(this.inputExpressionFields[expression].value);
        startPoints.push(
            math.evaluate(this.inputStartFields[expression].value));
      }
    }

    const initialValuesDiv = document.createElement('div');
    let solution;
    switch (numberOfFields) {
      case 1:
        solution = rungeKutta(expressions[0], tStart, tEnd, startPoints[0],
            splits, methodOrder);
        initialValuesDiv.textContent =
          `$$x'=${math.parse(expressions[0]).toTex()}=f(x,\\ t)$$
           $$\\mathtt{где}\\ x(t)\\ \\mathtt{-\\ некоторая\\ неизвестная\\ функця}$$
           $$\\mathtt{частное\\ решение\\ получено\\ приближениями:}$$
           $$\\begin{cases}
           t_{n+1}=t_{n}+h\\\\
           x_{n+1}=x_{n}+h\\sum_{i=1}^{s}b_{i}K_{i}\\\\
           \\end{cases}$$
           $$K_{s}=f(x_{n}+a_{s,1}hK_{1}+\\cdots+a_{s,s-1}hK_{s-1},\\ 
           t_{n}+c_{s}h)$$
           $$\\mathtt{где}\\ a,\\ b,\\ c\\ \\mathtt{-\\ коэффициенты\\ из\\ таблиц\\ Бутчера}$$
           $$\\mathtt{при}\\ t\\in[${tStart < tEnd
                ? `${tStart}\\ ;${tEnd}`
                : `${tEnd};${tStart}`}],\\ 
           t_{0}=${tStart},\\ t_{${splits}}=${tEnd},\\ 
           x(${tStart})=${startPoints[0]}$$`;
        break;
      case 2:
        solution = rungeKutta2(expressions[0], expressions[1], tStart, tEnd,
            startPoints[0], startPoints[1], splits, methodOrder);
        initialValuesDiv.textContent =
          `$$\\begin{cases}
           x'=${math.parse(expressions[0]).toTex()}=f(x,\\ y,\\ t)\\\\
           y'=${math.parse(expressions[1]).toTex()}=g(x,\\ y,\\ t)
           \\end{cases}$$
           $$\\mathtt{где}\\ x(t),\\ y(t)\\ \\mathtt{-\\ некоторые\\ неизвестные\\ функции}$$
           $$\\mathtt{частное\\ решение\\ получено\\ приближениями:}$$
           $$\\begin{cases}
           t_{n+1}=t_{n}+h\\\\
           x_{n+1}=x_{n}+h\\sum_{i=1}^{s}b_{i}K_{i}\\\\
           y_{n+1}=y_{n}+h\\sum_{i=1}^{s}b_{i}L_{i}
           \\end{cases}$$
           $$K_{s}=f(x_{n}+a_{s,1}hK_{1}+\\cdots+a_{s,s-1}hK_{s-1},\\ 
           y_{n}+a_{s,1}hL_{1}+\\cdots+a_{s,s-1}hL_{s-1},\\ 
           t_{n}+c_{s}h)$$
           $$L_{s}=g(x_{n}+a_{s,1}hK_{1}+\\cdots+a_{s,s-1}hK_{s-1},\\ 
           y_{n}+a_{s,1}hL_{1}+\\cdots+a_{s,s-1}hL_{s-1},\\ 
           t_{n}+c_{s}h)$$
           $$\\mathtt{где}\\ a,\\ b,\\ c\\ \\mathtt{-\\ коэффициенты\\ из\\ таблиц\\ Бутчера}$$
           $$\\mathtt{при}\\ t\\in[${tStart < tEnd
              ? `${tStart}\\ ;${tEnd}`
              : `${tEnd};${tStart}`}],\\ 
           t_{0}=${tStart},\\ t_{${splits}}=${tEnd},\\ 
           x(${tStart})=${startPoints[0]},\\ y(${tStart})=${startPoints[1]}$$`;
        break;
    }

    const resultTable = document.createElement('table');
    resultTable.classList.add('table', 'table-bordered', 'caption-top');

    // составление заголовков таблицы
    const headers = Object.keys(solution);
    const tableHeaders = document.createElement('thead');
    tableHeaders.classList.add('table-secondary');
    const tableHeadersRow = document.createElement('tr');

    let tableHeader;
    for (let header in headers) {
      tableHeader = document.createElement('th');
      tableHeader.classList.add('col');
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
          currentValue = `$${math.round(currentValue, 6)}$`;
        }
        tableValue.textContent = currentValue;
        tableRow.append(tableValue);
      }
      tableBody.append(tableRow);
    }
    tableBody.lastElementChild.classList.add('table-success');

    // сборка таблицы
    tableHeaders.append(tableHeadersRow);
    resultTable.append(tableHeaders, tableBody);
    const tableCaption = document.createElement('caption');
    tableCaption.textContent = `Приближения к частному решению методом Рунге-Кутты ${methodOrder >
    1 ? methodOrder : `(Эйлера) ${methodOrder}`} порядка`;
    resultTable.prepend(tableCaption);
    const responsiveTable = document.createElement('div');
    responsiveTable.classList.add('table-responsive');
    responsiveTable.append(resultTable);

    resultContainer.append(initialValuesDiv);
    resultContainer.append(responsiveTable);
    resultContainer.append();

    this.resultsSection.prepend(resultContainer);
    this.updateTex();
  }
}