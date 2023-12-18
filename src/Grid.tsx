import React, { useState } from 'react';
import Counter from './Counter.tsx';

import './styles.css'; // Import your CSS file

type Edge = 'above' | 'right' | 'below' | 'left';
export interface Box {
    selectedEdges: Record<Edge, boolean>;
    selectableEdges: 'all' | 'none' | Edge;
    winner?: number;
    row: number;
    col: number;
}

interface BoxCellInterface {
    box: Box
}
const BoxCell: React.FC<BoxCellInterface> = ({box}) => {

return (
    <td className='box'>({box.row}, {box.col})</td>
)
}

export default BoxCell

// 'board' prop
// board is an array containing multiple arrays (rows) of 'boxes'
