import { computed, ref } from 'vue';
import { uuid } from './utils';

export enum Direction {
  UP = 1,
  DOWN,
  LEFT,
  RIGHT,
}

export enum CellState {
  NORMAL = 1,
  MERGE,
  NEW
}

export interface Cell {
  id: number;
  value: number;
  state: CellState
};

export interface CellWithPosition extends Cell {
  x: number;
  y: number;
}

export type GridData = Cell[][];

type GridHistoryItem = {
  score: number;
  data: GridData;
};

const createCell = (value: number, state: CellState): Cell => ({
  id: uuid(),
  value,
  state
});

const createGridData = (size: number): GridData => {
  const res: GridData = [];
  for (let i = 0; i < size; i++) {
    const rows: Cell[] = [];
    for (let i = 0; i < size; i++) {
      rows.push(createCell(0, CellState.NORMAL));
    }
    res.push(rows);
  }

  return res;
};

const swapGridCell = (grid: GridData, row1: number, col1: number, row2: number, col2: number) => {
  const cell1 = grid[row1][col1];
  const cell2 = grid[row2][col2];
  grid[row1][col1] = cell2;
  grid[row2][col2] = cell1;
};


const cloneGrid = (data: GridData): GridData => {
  return data.map((row) => row.map((cell) => ({ ...cell, state: CellState.NORMAL })));
};

export const useGrid = (size: number) => {
  const score = ref(0);
  const gridData = ref(createGridData(size));
  const history: GridHistoryItem[] = [];

  const hasEmpty = computed(() =>
    gridData.value.some((row) => row.some((cell) => cell.value === 0))
  );

  const isEnd = computed(() => {
    if (hasEmpty.value) {
      return false;
    }

    const grid = gridData.value;
    for (let col = 0; col < size; col++) {
      for (let row = 1; row < size; row++) {
        if (grid[row][col].value === grid[row - 1][col].value) {
          return false;
        }
      }
    }
    for (let row = 0; row < size; row++) {
      for (let col = 1; col < size; col++) {
        if (grid[row][col].value === grid[row][col - 1].value) {
          return false;
        }
      }
    }

    return true;
  });

  const cells = computed(() => {
    const res: CellWithPosition[] = [];

    const grid = gridData.value;
    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        if (grid[row][col].value !== 0) {
          const cell: CellWithPosition = { ...grid[row][col], x: col, y: row };
          res.push(cell);
        }
      }
    }

    return res;
  })

  const undo = () => {
    if (history.length) {
      const historyItem = history.pop()!;
      gridData.value = historyItem.data;
      score.value = historyItem.score;
    }
  };

  const move = (dir: Direction) => {
    history.push({
      score: score.value,
      data: gridData.value,
    });

    const grid = cloneGrid(gridData.value);
    let scoreIncrement = 0;

    switch (dir) {
      case Direction.UP:
        for (let col = 0; col < size; col++) {
          let value = -1;
          let valueIndex = -1;
          let notNullIndex = -1;
          for (let row = 0; row < size; row++) {
            if (grid[row][col].value === value) {
              grid[valueIndex][col].state = CellState.MERGE;
              grid[valueIndex][col].value += value;
              scoreIncrement += grid[valueIndex][col].value;
              grid[row][col].value = 0;
              value = -1;
              valueIndex = -1;
            } else if (grid[row][col].value !== 0) {
              valueIndex = ++notNullIndex;
              value = grid[row][col].value;
              if (valueIndex !== row) {
                swapGridCell(grid, row, col, valueIndex, col);
              }
            }
          }
        }
        break;

      case Direction.DOWN:
        for (let col = 0; col < size; col++) {
          let value = -1;
          let valueIndex = -1;
          let notNullIndex = size;
          for (let row = size - 1; row >= 0; row--) {
            if (grid[row][col].value === value) {
              grid[valueIndex][col].state = CellState.MERGE;
              grid[valueIndex][col].value += value;
              scoreIncrement += grid[valueIndex][col].value;
              grid[row][col].value = 0;
              value = -1;
              valueIndex = -1;
            } else if (grid[row][col].value !== 0) {
              valueIndex = --notNullIndex;
              value = grid[row][col].value;
              if (valueIndex !== row) {
                swapGridCell(grid, row, col, valueIndex, col);
              }
            }
          }
        }
        break;

      case Direction.LEFT:
        for (let row = 0; row < size; row++) {
          let value = -1;
          let valueIndex = -1;
          let notNullIndex = -1;
          for (let col = 0; col < size; col++) {
            if (grid[row][col].value === value) {
              grid[row][valueIndex].state = CellState.MERGE;
              grid[row][valueIndex].value += value;
              scoreIncrement += grid[row][valueIndex].value;
              grid[row][col].value = 0;
              value = -1;
              valueIndex = -1;
            } else if (grid[row][col].value !== 0) {
              valueIndex = ++notNullIndex;
              value = grid[row][col].value;
              if (valueIndex !== col) {
                swapGridCell(grid, row, col, row, valueIndex);
              }
            }
          }
        }
        break;

      case Direction.RIGHT:
        for (let row = 0; row < size; row++) {
          let value = -1;
          let valueIndex = -1;
          let notNullIndex = size;
          for (let col = size - 1; col >= 0; col--) {
            if (grid[row][col].value === value) {
              grid[row][valueIndex].state = CellState.MERGE;
              grid[row][valueIndex].value += value;
              scoreIncrement += grid[row][valueIndex].value;
              grid[row][col].value = 0;
              value = -1;
              valueIndex = -1;
            } else if (grid[row][col].value !== 0) {
              valueIndex = --notNullIndex;
              value = grid[row][col].value;
              if (valueIndex !== col) {
                swapGridCell(grid, row, col, row, valueIndex);
              }
            }
          }
        }
        break;
    }

    gridData.value = grid;
    score.value += scoreIncrement;

    if (hasEmpty.value) {
      addRandomCell();
    }
  };

  const addRandomCell = () => {
    const positions: [number, number][] = [];

    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        if (gridData.value[row][col].value === 0) {
          positions.push([row, col]);
        }
      }
    }

    const randomIndex = Math.floor(Math.random() * positions.length);
    const [row, col] = positions[randomIndex];

    gridData.value[row][col] = createCell(
      // 2-90% 4-10%
      Math.random() < 0.9 ? 2 : 4,
      CellState.NEW
    );
  };

  const init = (newSize?: number) => {
    if (newSize) {
      size = newSize;
    }

    score.value = 0;
    history.length = 0;
    gridData.value = createGridData(size);
  };

  const start = () => {
    addRandomCell();
    addRandomCell();
  };

  return {
    gridData,
    cells,
    score,
    isEnd,
    move,
    undo,
    init,
    start,
  };
};
