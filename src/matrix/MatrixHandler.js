class MatrixHandler {
  constructor() {
    this.resultsSection = document.getElementById('results');
    this.solveButton = document.getElementById('solve');

    this.methodNames = document.getElementsByName('method-name');

    this.matrixInputElement = document.getElementById('matrix');
    this.matrixSize = document.getElementById('size');

    this.clearButton = document.getElementById('clear');
    this.plusButton = document.getElementById('plus');
    this.minusButton = document.getElementById('minus');

    this.plusButton.addEventListener('click', () => this.updateMatrixInput(1));
    this.minusButton.addEventListener('click',
        () => this.updateMatrixInput(-1));
    this.clearButton.addEventListener('click', () => this.clearMatrixInputs());

    this.solveButton.addEventListener('click',
        () => this.displayNewElem());
  }

  updateMatrixInput(changeBy) {
    const newMatrixSize = parseInt(this.matrixSize.innerText) + changeBy;

    if (newMatrixSize < 2) { return; }

    this.matrixSize.innerText = newMatrixSize;

    if (changeBy > 0) {
      const newRow = document.createElement('div');
      newRow.setAttribute('id', `r${newMatrixSize - 1}`);
      newRow.classList.add('input-group');

      const rows = this.getMatrixInputRows();
      rows.forEach(function(row) {
        const newCell = document.createElement('input');
        newCell.setAttribute('type', 'text');
        newCell.setAttribute('id', `${row.id}-c${newMatrixSize}`);
        newCell.classList.add('form-control');
        newCell.setAttribute('placeholder', '0');
        row.append(newCell);
      });

      for (let i = 0; i <= newMatrixSize; i++) {
        const newCell = document.createElement('input');
        newCell.setAttribute('type', 'text');
        newCell.setAttribute('id', `r${newMatrixSize - 1}-c${i}`);
        newCell.classList.add('form-control');
        newCell.setAttribute('placeholder', '0');
        newRow.append(newCell);
      }
      this.matrixInputElement.append(newRow);
    } else {
      this.matrixInputElement.lastElementChild.remove();

      const rows = this.getMatrixInputRows();
      rows.forEach(function(row) {
        row.lastElementChild.remove();
      });
    }
  }

  getMatrixInputRows() {
    return this.matrixInputElement.querySelectorAll('div[id^="r"]');
  }

  getMethodName() {
    for (let btn in this.methodNames) {
      if (this.methodNames[btn].checked) {
        return this.methodNames[btn].value;
      }
    }
  }

  clearMatrixInputs() {
    const rows = this.getMatrixInputRows();
    rows.forEach(function(row) {
      const cells = row.querySelectorAll('input[id^="r"]');
      cells.forEach(function(cell) {
        cell.value = '';
      });
    });
  }

  getMatrixInputValues() {
    let matrix = [];
    const rows = this.getMatrixInputRows();
    rows.forEach(function(row) {
      let rowValues = [];
      const cells = row.querySelectorAll('input[id^="r"]');
      cells.forEach(function(cell) {
        const value = parseFloat(cell.value);
        if (isNaN(value)) {
          rowValues.push(0);
        } else {
          rowValues.push(value);
        }
      });
      matrix.push(rowValues);
    });
    return matrix;
  }

  updateTex() {
    MathJax.typeset();
  }

  matrixToTex(matrix) {
    return `\\begin{matrix}${matrix.map(row => {return row.join(' & ');}).
        join('\\\\')}\\end{matrix}`;
  }

  linearEquationsToTex(coefficients, results) {
    return `\\begin{pmatrix}${this.matrixToTex(
        coefficients)}\\ \\Bigg| \\ ${this.matrixToTex(results)}\\end{pmatrix}`;
  }

  displayNewElem() {
    return undefined;
  }
}

class GaussClassic extends MatrixHandler {
  constructor() {
    super();
  }

  displayNewElem() {
    const resultContainer = document.createElement('div');
    resultContainer.classList.add('container', 'border', 'rounded', 'mb-3');

    const inputValues = this.getMatrixInputValues();

    const linearEquations = matrixToLinearEquations(inputValues);

    const methodName = this.getMethodName();
    let result;

    switch (methodName) {
      case 'gauss':
        result = gauss(inputValues);
        resultContainer.innerText = '$$\\mathtt{Метод\\ Гаусса}$$';
        break;
      case 'optimal':
        result = gaussOptimalExclusion(inputValues);
        resultContainer.innerText = '$$\\mathtt{Метод\\ Гаусса\\ (метод\\ оптимального\\ исключения)}$$';
        break;
      case 'jordan':
        result = gaussJordan(inputValues);
        resultContainer.innerText = '$$\\mathtt{Метод\\ Гаусса-Жордана}$$';
        break;
    }

    const resLinearEquations = matrixToLinearEquations(result);

    resultContainer.innerText += `$$\\tilde{A}=${this.linearEquationsToTex(
        linearEquations.A, linearEquations.B)}\\sim${this.linearEquationsToTex(
        resLinearEquations.A, resLinearEquations.B)}$$`;
    resultContainer.innerText += `$$X=\\left(${this.matrixToTex(
        solveLinearEquations(resLinearEquations.A,
            resLinearEquations.B))}\\right)$$`;

    this.resultsSection.prepend(resultContainer);
    this.updateTex();
  }
}

class Chosen extends MatrixHandler {
  constructor() {
    super();
  }

  displayNewElem() {
    const resultContainer = document.createElement('div');
    resultContainer.classList.add('container', 'border', 'rounded', 'mb-3');

    const inputValues = this.getMatrixInputValues();

    const linearEquations = matrixToLinearEquations(inputValues);

    const methodName = this.getMethodName();

    let result;
    let resultMatrix;
    let permutations;

    switch (methodName) {
      case 'gauss':
        resultMatrix = gaussChosenRow(inputValues);
        resultContainer.innerText = '$$\\mathtt{Выбор\\ по\\ строкам}$$';
        break;
      case 'optimal':
        result = gaussChosenCol(inputValues);
        resultMatrix = result.matrix;
        permutations = result.permutations;
        resultContainer.innerText = '$$\\mathtt{Выбор\\ по\\ столбцам}$$';
        break;
      case 'jordan':
        result = gaussChosenAcrossMatrix(inputValues);
        resultMatrix = result.matrix;
        permutations = result.permutations;
        resultContainer.innerText = '$$\\mathtt{Выбор\\ по\\ всей\\ матрице\\ (строки\\ и\\ столбцы)}$$';
        break;
    }

    let resLinearEquations = matrixToLinearEquations(resultMatrix);

    resultMatrix = roundMatrixValues(resultMatrix);

    let solvedLinearEquations = (roundMatrixValues(
        solveLinearEquations(resLinearEquations.A, resLinearEquations.B)));

    if (permutations) {
      solvedLinearEquations = rearrangeVectorMatrix(solvedLinearEquations,
          permutations);
      resLinearEquations = matrixToLinearEquations(
          rearrangeCols(resultMatrix, permutations));
    } else {
      resLinearEquations = {
        A: roundMatrixValues(resLinearEquations.A),
        B: roundMatrixValues(resLinearEquations.B),
      };
    }

    resultContainer.innerText += `$$\\tilde{A}=${this.linearEquationsToTex(
        linearEquations.A, linearEquations.B)}\\sim${this.linearEquationsToTex(
        resLinearEquations.A, resLinearEquations.B)}$$`;
    if (permutations) {
      resultContainer.innerText += '$$\\mathtt{Ступенчатая\\ матрица\\ с\\ переставленными\\ столбцами\\ имеет\\ вид:}$$';
      const resultMatrixLinearEquations = matrixToLinearEquations(resultMatrix);
      resultContainer.innerText += `$$${this.linearEquationsToTex(
          resultMatrixLinearEquations.A, resultMatrixLinearEquations.B)}$$`;
    }

    resultContainer.innerText += `$$X=\\left(${this.matrixToTex(
        solvedLinearEquations)}\\right)$$`;

    this.resultsSection.prepend(resultContainer);
    this.updateTex();
  }
}