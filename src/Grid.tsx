import React from "react";

import "./styles.css"; // Import your CSS file

export type Edge = "above" | "right" | "below" | "left";
export interface Box {
  selectedEdges: Record<Edge, boolean>;
  selectableEdges: "all" | "none" | Edge;
  winner?: number;
  row: number;
  col: number;
  className?: string;
}

interface BoxCellInterface {
  box: Box;
  neighbours: (b: Box) => Record<Edge, Box>;
  forceRefresh: () => void;
}
const BoxCell: React.FC<BoxCellInterface> = ({
  box,
  neighbours,
  forceRefresh,
}) => {
  const clicked = () => {
    Object.values(neighbours(box)).forEach((box) => {
      box.className = box.className ? "" : "selected";
    });
    forceRefresh();
  };
  return (
    <td>
      <button onClick={clicked} className={`content ${box.className || ""}`}>
        ({box.row}, {box.col})
      </button>
    </td>
  );
};

export default BoxCell;

// 'board' prop
// board is an array containing multiple arrays (rows) of 'boxes'
