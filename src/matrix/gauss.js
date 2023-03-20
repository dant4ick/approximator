function gauss(matrix) {
  for (let row in matrix) {
    row = parseInt(row);

    const normalMultiplier = 1 / matrix[row][row];
    matrix[row] = matrix[row].map(cell => {
      return math.round(cell * normalMultiplier, 10);
    });

    for (let i = row + 1; i < matrix.length; i++) {
      matrix[i] = matrix[i].map((cell, index) => {
        return cell - (matrix[row][index] * matrix[i][row]);
      });
    }
  }
  return matrix.map(cell => {return math.round(cell, 10);});
}

function gaussOptimalExclusion(matrix) {
  for (let row in matrix) {
    row = parseInt(row);

    for (let i = row + 1; i < matrix.length; i++) {
      const multiplier = -matrix[i][row] / matrix[row][row];

      matrix[i] = matrix[i].map((cell, index) => {
        return cell + (matrix[row][index] * multiplier);
      });
    }
  }
  return matrix.map(cell => {return math.round(cell, 10);});
}

function gaussJordan(matrix) {
  for (let column = 0; column <= matrix.length - 1; column++) {
    const normalMultiplier = 1 / matrix[column][column];
    matrix[column] = matrix[column].map(cell => {
      return math.round(cell * normalMultiplier, 10);
    });

    for (let row = 0; row <= matrix.length - 1; row++) {
      if (column === row) {
        continue;
      }
      matrix[row] = matrix[row].map((cell, index) => {
        return cell - (matrix[column][index] * matrix[row][column]);
      });
    }
  }
  return matrix.map(cell => {return math.round(cell, 10);});
}

function matrixToLinearEquations(matrix) {
  matrix = math.matrix(matrix);

  const size = matrix.size();

  let A = math.column(matrix, 0);
  for (let i = 1; i < size[1] - 1; i++) {
    A = math.concat(A, math.column(matrix, i));
  }

  let B = math.column(matrix, size[1] - 1);

  return {A: A.toArray(), B: B.toArray()};
}

function solveLinearEquations(coefficients, results) {
  for (let i = results.length - 1; i >= 0; i--) {
    const accumulatedSum = coefficients[i].reduce(
        function(currentSum, currentNumber, currentIndex) {
          if (currentIndex === i) { return 0; }
          return currentSum + (currentNumber * results[currentIndex][0]);
        }, 0);

    results[i][0] = math.round(
        (results[i][0] - accumulatedSum) / coefficients[i][i], 10);
  }
  return results;
}
