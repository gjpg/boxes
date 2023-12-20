import React, { useState } from "react";

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
  const [mouseCoordinates, setMouseCoordinates] = useState<{
    x: number | null;
    y: number | null;
  }>({ x: null, y: null });

  const clicked = (event: React.MouseEvent<HTMLButtonElement>) => {
    // Get mouse coordinates
    const mouseX = event.clientX;
    const mouseY = event.clientY;

    // Update state with mouse coordinates
    setMouseCoordinates({ x: mouseX, y: mouseY });

    // Your existing logic for handling box selection
    Object.values(neighbours(box)).forEach((box) => {
      box.className = box.className ? "" : "selected";
    });

    // Force refresh after handling the click
    forceRefresh();
  };

  return (
    <td>
      <button onClick={clicked} className={`content ${box.className || ""}`}>
        ({box.row}, {box.col}){" "}
        {mouseCoordinates.x !== null &&
          mouseCoordinates.y !== null &&
          `(Mouse: ${mouseCoordinates.x}, ${mouseCoordinates.y})`}
      </button>
    </td>
  );
};

export default BoxCell;
