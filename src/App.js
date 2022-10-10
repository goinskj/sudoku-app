import { useState } from 'react';
import './App.css';


const start = [
  [-1, -1, -1, 2, 6, -1, 7, -1, 1],
  [6, 8, -1, -1, 7, -1, -1, 9, -1],
  [1, 9, -1, -1, -1, 4, 5, -1, -1],
  [8, 2, -1, 1, -1, -1, -1, 4, -1],
  [-1, -1, 4, 6, -1, 2, 9, -1, -1],
  [-1, 5, -1, -1, -1, 3, -1, 2, 8],
  [-1, -1, 9, 3, -1, -1, -1, 7, 4],
  [-1, 4, -1, -1, 5, -1, -1, 3, 6],
  [7, -1, 3, -1, 1, 8, -1, -1, -1]
]

function App() {
  const [sudokuArray, setSudokuArray] = useState(getDeepCopy(start));

  function getDeepCopy(arr) {
    return JSON.parse(JSON.stringify(arr));
  }

  function onInputChange(e, row, col) {
    var val = parseInt(e.target.value) || -1, grid = getDeepCopy(sudokuArray);
    // Only allow values between 1 and 9 for input
    if (val === -1 || val >= 1 && val <= 9) {
      grid[row][col] = val;
    }
    setSudokuArray(grid);
  }

  // lets compare good vs bad sudoku arrays
  function compareSudokus(currentSudoku, solvedSudoku) {
    let res = {
      isComplete: true,
      isSolvable: true
    }
    for (var i = 0; i < 9; i++) {
      for (var j = 0; j < 9; j++) {
        if (currentSudoku[i][j] != solvedSudoku[i][j]) {
          if (currentSudoku[i][j] != -1) {
            res.isSolvable = false;
          }
          res.isComplete = false;
        }
      }
    }
    return res;
  }

  function checkSudoku() {
    let sudoku = getDeepCopy(start);
    solver(sudoku);
    let compare = compareSudokus(sudokuArray, sudoku);
    if (compare.isComplete) {
      alert("Completed! Great Work Padawan. You have solved Sudoku and are now ready for the trials!");
    } else if (compare.isSolvable) {
      alert("Do or do not, there is not try!");
    } else {
      alert("Invalid entries. Try again!")
    }
  }

  // check for row uniqueness
  function checkRow(grid, row, num) {
    return grid[row].indexOf(num) === -1;
  }

  // check for column uniqueness
  function checkCol(grid, col, num) {
    return grid.map(row => row[col]).indexOf(num) === -1;
  }

  // check for box unitueness
  function checkBox(grid, row, col, num) {
    let boxArray = [],
      rowStart = row - (row % 3),
      colStart = col - (col % 3);
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        // get all the cell numbers and push into boxArray
        boxArray.push(grid[rowStart + i][colStart + j]);
      }
    }

    return boxArray.indexOf(num) === -1;
  }

  function checkValid(grid, row, col, num) {
    if (checkRow(grid, row, num) && checkCol(grid, col, num) && checkBox(grid, row, col, num)) {
      // fill in the cell with entered number
      grid[row][col] = num;
      // get next cell and repeat function
      let [newRow, newCol] = getNext(row, col);
      return true;
    }
    grid[row][col] = -1
    return false;

  }

  function getNext(row, col) {
    // if col reached 8, increase row number
    // if row reached 8 and col reaches 8, next is [0,0]
    // if col doesn't reach 8, increase col number

    return col !== 8 ? [row, col + 1] : row != 8 ? [row + 1, 0] : [0, 0];
  }

  // recursive function to solve sudoku
  function solver(grid, row = 0, col = 0) {

    // if the current cell already has a value move to next cell
    if (grid[row][col] !== -1) {
      // for the last cell no need to solve
      let isLast = row >= 8 && col >= 8;
      if (!isLast) {
        let [newRow, newCol] = getNext(row, col);
        return solver(grid, newRow, newCol);
      }
    }

    for (let num = 1; num <= 9; num++) {
      // check if this num is compliant
      if (checkValid(grid, row, col, num)) {
        // fill the num in that cell
        grid[row][col] = num;
        // get next cell and repeat the function
        let [newRow, newCol] = getNext(row, col);

        if (!newRow && !newCol) {
          return true;
        }

        if (solver(grid, newRow, newCol)) {
          return true;
        }
      }
    }

    // if its invalid fill with -1
    grid[row][col] = -1;
    return false;
  }

  return (
    <div className="App">
      <div className='App-header'>
        <h3>Sukoku Challenge</h3>
        <table>
          <tbody>
            {
              [0, 1, 2, 3, 4, 5, 6, 7, 8].map((row, rIndex) => {
                return <tr key={rIndex}>
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((col, cIndex) => {
                    return <td key={rIndex + cIndex}>
                      <input onChange={(e) => onInputChange(e, row, col)}
                        value={sudokuArray[row][col] === -1 ? '' : sudokuArray[row][col]}
                        className='cellInput'
                        disabled={start[row][col] !== -1} />
                    </td>
                  })}
                </tr>
              })
            }
          </tbody>
        </table>
        <div className='buttonContainer'>
          <button onClick={checkSudoku} className='checkAnswerButton'>Check Answers</button>
        </div>
      </div>
    </div>
  );
}

export default App;
