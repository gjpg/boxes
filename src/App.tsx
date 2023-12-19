// App.tsx
import React, { useMemo, useState, useCallback } from "react";
import Counter from "./Counter.tsx";
import Players from "./Players.tsx";
import { Box, Edge } from "./Grid.tsx";
import BoxCell from "./Grid.tsx";

import "./styles.css";

const makeGrid = (numRows: number, numCols: number): Box[][] => {
  console.log("Calling makeGrid");
  return new Array(numRows).fill(0).map((_, row) =>
    new Array(numCols).fill(0).map((__, col) => ({
      // this is the box you need to initialise
      row,
      col,
      selectedEdges: { above: false, right: false, below: false, left: false },
      selectableEdges: "all",
    })),
  );
};

const App: React.FC = () => {
  const [rowCount, setRowCount] = useState<number>(0);
  const [columnCount, setColumnCount] = useState<number>(0);
  const [playerCount, setPlayerCount] = useState<number>(0);
  const [refresh, setRefresh] = useState<number>(0);
  const forceRefresh = useCallback(() => setRefresh((r) => r + 1), []);

  type Neighbours = Record<Edge, Box>;

  const grid = useMemo(
    () => makeGrid(rowCount + 2, columnCount + 2),
    [rowCount, columnCount],
  );

  const neighbours = (b: Box): Neighbours => {
    const directions: Edge[] = ["above", "right", "below", "left"];
    const result = {} as Neighbours;

    for (const dir of directions) {
      const newRow = b.row + (dir === "above" ? -1 : dir === "below" ? 1 : 0);
      const newCol = b.col + (dir === "left" ? -1 : dir === "right" ? 1 : 0);

      // Check if the new position is within bounds
      if (
        newRow >= 0 &&
        newRow < rowCount + 2 &&
        newCol >= 0 &&
        newCol < columnCount + 2
      ) {
        result[dir] = grid[newRow][newCol];
      }
    }

    return result;
  };

  const Table = () => {
    return (
      <table>
        {grid.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {row.map((cell, colIndex) => (
              <BoxCell
                key={colIndex}
                box={cell}
                neighbours={neighbours}
                forceRefresh={forceRefresh}
              />
            ))}
          </tr>
        ))}
      </table>
    );
  };

  return (
    <div>
      <div className="app-container">
        <Counter label={"Rows"} count={rowCount} setCount={setRowCount} />
        <Counter
          label={"Columns"}
          count={columnCount}
          setCount={setColumnCount}
        />
        <Players count={playerCount} setCount={setPlayerCount} />
      </div>
      <div>
        <Table />
      </div>
      <pre>{JSON.stringify(grid, null, 4)}</pre>
    </div>
  );
};

export default App;
