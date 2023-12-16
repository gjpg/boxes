// App.tsx
import React, {useState} from 'react';
import Counter from './Counter.tsx';
import Players from './Players.tsx';

import './styles.css'; // Import your CSS file

const App: React.FC = () => {
    const [rowCount, setRowCount] = useState<number>(0);
    const [columnCount, setColumnCount] = useState<number>(0);
    const [playerCount, setPlayerCount] = useState<number>(0);



    return (
        <div className="app-container">
            <Counter label={'Rows'} count={rowCount} setCount={setRowCount}/>
            <Counter label={'Columns'} count={columnCount} setCount={setColumnCount}/>
            <Players count={playerCount} setCount={setPlayerCount}/>
        </div>
    );
};

export default App;
