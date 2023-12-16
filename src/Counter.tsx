// Counter.tsx
import React, { useState } from 'react';
import './styles.css'; // Import your CSS file

interface CounterProps {
    label: string;
    count: number;
    setCount: (count: number, why: 'increment' | 'decrement') => void
}

const Counter: React.FC<CounterProps> = ({label, count, setCount}) => {
    // const [count, setCount] = useState<number>(0);

    const handleIncrement = () => {
        setCount(count + 1, 'increment');
    };

    const handleDecrement = () => {
        if (count > 0) {
            setCount(count - 1, 'decrement');
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

export default Counter;
