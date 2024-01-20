// App.tsx
import React, { useMemo, useState, useCallback } from "react";
import Counter from "./Counter.tsx";
import Players from "./Players.tsx";
import { Box, Edge } from "./Grid.tsx";
import BoxCell from "./Grid.tsx";
import { PlayerData } from "./Players.tsx";

import players from "./Players.tsx";

const makeGrid = (numRows: number, numCols: number): Box[][] => {
  console.log("Calling makeGrid");
  return new Array(numRows).fill(0).map((_, row) =>
    new Array(numCols).fill(0).map((__, col) => ({
      // this is the box you need to initialise
      row,
      col,
      selectedEdges: { top: false, right: false, bottom: false, left: false },
      selectableEdges: {
        bottom: row < numRows - 1 && 0 < col && col < numCols - 1,

        top: row > 0 && 0 < col && col < numCols - 1,

        left: col > 0 && 0 < row && row < numRows - 1,

        right: row > 0 && row < numRows - 1 && col < numCols - 1,
      },
    })),
  );
};

const App: React.FC = () => {
  const [rowCount, setRowCount] = useState<number>(3);
  const [columnCount, setColumnCount] = useState<number>(3);
  const [playerCount, setPlayerCount] = useState<number>(2);
  const [playerData, setPlayerData] = useState<PlayerData[]>([]);

  const [, setRefresh] = useState<number>(0);
  const forceRefresh = useCallback(() => setRefresh((r) => r + 1), []);
  const [currentPlayer, setCurrentPlayer] = useState<number>(0);

  type Neighbours = Record<Edge, Box>;

  const grid = useMemo(
    () => makeGrid(rowCount + 2, columnCount + 2),
    [rowCount, columnCount],
  );

  const neighbours = useCallback(
    (b: Box): Neighbours => {
      const directions: Edge[] = ["top", "right", "bottom", "left"];
      const result = {} as Neighbours;

      for (const dir of directions) {
        const newRow = b.row + (dir === "top" ? -1 : dir === "bottom" ? 1 : 0);
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
    },
    [columnCount, grid, rowCount],
  );

  const countSelectedEdges = () => {
    let selectedEdgesCount = 0;

    // Iterate through rows and boxes
    grid.forEach((row) => {
      row.forEach((box) => {
        // Sum up the selected edges
        selectedEdgesCount += Object.values(box.selectedEdges).filter(
          Boolean,
        ).length;
      });
    });

    return selectedEdgesCount;
  };

  const tallyBoxWinners = () => {
    grid.forEach((row) => {
      row.forEach((box) => {
        if (box.winner) {
          if (playerData[box.winner].wonBoxes) {
            playerData[box.winner].wonBoxes++;
          } else playerData[box.winner].wonBoxes = 1;
        }
      });
    });
  };

  tallyBoxWinners();

  const ScoreDisplay = useCallback(() => {
    return <div>{pla}</div>;
  }, []);

  const totalSelectedEdges = countSelectedEdges() / 2;

  console.log("playerData", playerData);

  const Table = useCallback(() => {
    return (
      <div
        className="dynamic-table"
        style={{
          borderCollapse: `collapse`,
          gridTemplateColumns: `repeat(${columnCount + 2},1fr)`,
          gridTemplateRows: `repeat(${rowCount + 2},1fr)`,
        }}
      >
        {grid.map((row) => (
          <>
            {row.map((cell, colIndex) => (
              <BoxCell
                key={colIndex}
                box={cell}
                neighbours={neighbours}
                turnComplete={() => {
                  setCurrentPlayer((currentPlayer + 1) % playerCount);
                  forceRefresh();
                }}
                forceRefresh={forceRefresh}
                currentPlayer={currentPlayer}
                playerData={playerData}
              />
            ))}
          </>
        ))}
      </div>
    );
  }, [
    columnCount,
    rowCount,
    grid,
    neighbours,
    forceRefresh,
    currentPlayer,
    playerCount,
    playerData,
  ]);

  return (
    <div>
      <div className="app-container">
        <Counter label={"Rows"} count={rowCount} setCount={setRowCount} />
        <Counter
          label={"Columns"}
          count={columnCount}
          setCount={setColumnCount}
        />
        <Players
          count={playerCount}
          setCount={setPlayerCount}
          playerData={playerData}
          setPlayerData={setPlayerData}
        />
      </div>
      <div>
        <Table />
      </div>
      <div style={{ color: playerData[currentPlayer]?.color }}>
        {" "}
        Turn {totalSelectedEdges + 1}, {playerData[currentPlayer]?.name}'s turn
      </div>

      <pre className="pre">{JSON.stringify(grid, null, 4)}</pre>
    </div>
  );
};

export default App;
