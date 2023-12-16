// Counter.tsx
import React, { useState } from 'react';

interface CounterProps {
    label: string;
}

const ColumnCounter: React.FC<CounterProps> = ({ label }) => {
    const [count, setCount] = useState<number>(0);

    const handleIncrement = () => {
        setCount(count + 1);
    };

    const handleDecrement = () => {
        if (count > 0) {
            setCount(count - 1);
        }
    };

    return (
        <div>
            <span className="labelSpan">{label}:</span>
            <button onClick={handleDecrement}>-</button>
            <span className="countSpan">{count}</span>
            <button onClick={handleIncrement}>+</button>
        </div>
    );
};

export default ColumnCounter;
