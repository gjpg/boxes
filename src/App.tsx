// App.tsx
import React from 'react';
import ColumnCounter from './ColumnCounter.tsx';
import RowCounter from './RowCounter.tsx';
import PlayerCounter from './PlayerCounter.tsx';

import './styles.css'; // Import your CSS file

const App: React.FC = () => {
    return (
        <div className="app-container">
            <RowCounter label={'Rows'}/>
            <ColumnCounter label={'Columns'}/>
            <PlayerCounter label={'Players'} />
        </div>
    );
};

export default App;
