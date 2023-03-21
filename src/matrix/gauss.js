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

function gaussChosenRow(matrix) {
  for (let col = 0; col < matrix.length; col++) {
    // find the index of the row with the maximum element in the column
    let maxIndex = col;
    for (let i = col + 1; i < matrix.length; i++) {
      if (Math.abs(matrix[i][col]) > Math.abs(matrix[maxIndex][col])) {
        maxIndex = i;
      }
    }
    // swap the current row with the row with the maximum element
    if (maxIndex !== col) {
      let temp = matrix[col];
      matrix[col] = matrix[maxIndex];
      matrix[maxIndex] = temp;
    }
    // normalize and eliminate as before
    const normalMultiplier = 1 / matrix[col][col];
    matrix[col] = matrix[col].map(cell => {
      return cell * normalMultiplier;
    });

    for (let i = col + 1; i < matrix.length; i++) {
      matrix[i] = matrix[i].map((cell, index) => {
        return cell - (matrix[col][index] * matrix[i][col]);
      });
    }
  }
  return matrix;
}

function gaussChosenCol(matrix) {
  // Создаем массив для хранения перестановок столбцов
  let columnPermutations = [];
  for (let i = 0; i < matrix[0].length - 1; i++) {
    columnPermutations.push(i);
  }

  for (let row in matrix) {
    row = parseInt(row);

    // Находим максимальный элемент в текущей строке и его индекс
    let maxElement = Math.abs(matrix[row][row]);
    let maxIndex = row;
    for (let j = row + 1; j < matrix[row].length - 1; j++) {
      if (Math.abs(matrix[row][j]) > maxElement) {
        maxElement = Math.abs(matrix[row][j]);
        maxIndex = j;
      }
    }

    // Если максимальный элемент не на диагонали, меняем столбцы местами
    if (maxIndex !== row) {
      for (let i = 0; i < matrix.length; i++) {
        let temp = matrix[i][row];
        matrix[i][row] = matrix[i][maxIndex];
        matrix[i][maxIndex] = temp;
      }

      // Обновляем массив перестановок столбцов
      let temp = columnPermutations[row];
      columnPermutations[row] = columnPermutations[maxIndex];
      columnPermutations[maxIndex] = temp;
    }

    // Продолжаем метод Гаусса как обычно
    const normalMultiplier = 1 / matrix[row][row];
    matrix[row] = matrix[row].map(cell => {
      return cell * normalMultiplier;
    });

    for (let i = row + 1; i < matrix.length; i++) {
      matrix[i] = matrix[i].map((cell, index) => {
        return cell - (matrix[row][index] * matrix[i][row]);
      });
    }

  }

  // Возвращаем приведенную матрицу и массив перестановок столбцов
  return {
    matrix: matrix,
    permutations: columnPermutations,
  };
}

function gaussChosenAcrossMatrix(matrix) {
  let permutations = [...Array(matrix.length).keys()];
  for (let row = 0; row < matrix.length; row++) {
    // Find the maximum element in the submatrix
    let maxElement = {value: -Infinity, row: -1, col: -1};
    for (let i = row; i < matrix.length; i++) {
      for (let j = row; j < matrix[i].length - 1; j++) {
        if (Math.abs(matrix[i][j]) > maxElement.value) {
          maxElement.value = Math.abs(matrix[i][j]);
          maxElement.row = i;
          maxElement.col = j;
        }
      }
    }

    // Swap the current row with the row containing the maximum element
    [matrix[row], matrix[maxElement.row]] = [
      matrix[maxElement.row],
      matrix[row]];

    // Swap the current column with the column containing the maximum element
    if (row !== maxElement.col) {
      for (let i = 0; i < matrix.length; i++) {
        [matrix[i][row], matrix[i][maxElement.col]] =
            [matrix[i][maxElement.col], matrix[i][row]];
      }
      [permutations[row], permutations[maxElement.col]] =
          [permutations[maxElement.col], permutations[row]];
    }

    const normalMultiplier = 1 / matrix[row][row];
    matrix[row] = matrix[row].map(
        cell => math.round(cell * normalMultiplier, 10));

    for (let i = row + 1; i < matrix.length; i++) {
      const multiplier = matrix[i][row];
      for (let j = row; j < matrix[0].length; j++) {
        matrix[i][j] = math.round(matrix[i][j] - multiplier * matrix[row][j],
            10);
      }
    }
  }

  return {
    matrix: matrix.map(row => row.map(cell => math.round(cell, 10))),
    permutations: permutations,
  };
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

    results[i][0] = (results[i][0] - accumulatedSum) / coefficients[i][i];
  }
  return results;
}

function rearrangeCols(matrix, permutations) {
  let restoredMatrix = matrix.map(row => [...row]);

  for (let i = 0; i < permutations.length; i++) {
    if (i !== permutations[i]) {
      for (let row of restoredMatrix) {
        let temp = row[i];
        row[i] = row[permutations[i]];
        row[permutations[i]] = temp;
      }
      let temp = permutations[i];
      permutations[i] = i;
      permutations[temp] = temp;
    }
  }

  return restoredMatrix;
}

function rearrangeVectorMatrix(matrix, permutations) {
  let vector = matrix.map(row => [...row]);

  let rearrangedVector = [];

  for (let i = 0; i < vector.length; i++) {
    rearrangedVector[permutations[i]] = vector[i];
  }

  return rearrangedVector.map(cell => {
    return [cell];
  });
}

function roundMatrixValues(matrix) {
  let newMatrix = matrix.map(row => [...row]);

  return newMatrix.map(cell => {return math.round(cell, 6);});
}

function test() {
  const initialMatrix = [
    [1, 2, 4, 2, 3, 1],
    [3, 7, 17, 4, 16, 5],
    [2, 2, -1, 12, 3, 1],
    [4, 8, 16, 9, 15, 5],
    [3, 6, 12, 6, 10, 4],
  ];

  const otvet = [20, -9, 0, -2, 1];

  let result = gaussChosenCol(initialMatrix);

  console.table(rearrangeCols(result.matrix, result.permutations));

  let linear = matrixToLinearEquations(result.matrix);

  let linearResults = solveLinearEquations(linear.A, linear.B);

  console.table(rearrangeVectorMatrix(linearResults, result.permutations));
}
