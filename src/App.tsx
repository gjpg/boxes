// App.tsx
import React, {useState} from 'react';
import Counter from './Counter.tsx';
import Players from './Players.tsx';
import {Box} from './Grid.tsx';
import BoxCell from './Grid.tsx';
import {BoxCellInterface} from './Grid.tsx'

import './styles.css';


const makeGrid = (numRows: number, numCols: number): Box[][]  => {
    console.log('Calling makeGrid');
    return new Array(numRows).fill(0).map((_, row) => new Array(numCols).fill(0).map((__, col) => ({
        // this is the box you need to initialise
        row,
        col,
        selectedEdges:{above: false, right: false, below: false, left: false},
        selectableEdges:'all'
    })));

    }

const App: React.FC = () => {
    const [rowCount, setRowCount] = useState<number>(0);
    const [columnCount, setColumnCount] = useState<number>(0);
    const [playerCount, setPlayerCount] = useState<number>(0);
    const grid = useMemo(() => makeGrid(rowCount+2, columnCount+2), [rowCount, columnCount]);


    const Table = ({ grid }) => {
        return (
            <table>
                {grid.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                        {row.map((cell, colIndex) => (
                            <BoxCell key={colIndex} box={cell}/>
                               

                        ))}
                    </tr>
                ))}
            </table>
        );
    };

    return (
        <div className="app-container">
            <Counter label={'Rows'} count={rowCount} setCount={setRowCount}/>
            <Counter label={'Columns'} count={columnCount} setCount={setColumnCount}/>
            <Players count={playerCount} setCount={setPlayerCount}/>
            <Table grid={grid} />
            <pre>
                {JSON.stringify(grid, null, 4)}
            </pre>
        </div>
    );
};

export default App;
