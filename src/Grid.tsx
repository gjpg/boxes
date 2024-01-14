import React, { useState } from "react";

import "./styles.css"; // Import your CSS file

export type Edge = "top" | "right" | "bottom" | "left";
export interface Box {
  selectedEdges: Record<Edge, boolean>;
  selectableEdges: Record<Edge, boolean>;
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
  turnComplete,
  forceRefresh,
  currentPlayer,
}) => {
  const [mouseCoordinates, setMouseCoordinates] = useState<{
    x: number | null;
    y: number | null;
  }>({ x: null, y: null });

  const clicked = (event: React.MouseEvent<HTMLButtonElement>) => {
    // Get mouse coordinates
    const mouseX = event.clientX;
    const mouseY = event.clientY;
    const target = event.target as HTMLButtonElement;

    // Update state with mouse coordinates
    setMouseCoordinates({ x: mouseX, y: mouseY });

    // Your existing logic for handling box selection
    Object.values(neighbours(box)).forEach((box) => {
      box.className = box.className ? "" : "selected";
    });

    console.log({ mouseX, mouseY, rect: target.getBoundingClientRect() });

    const { top, left, bottom, right } = target.getBoundingClientRect();
    const distances = {
      left: Math.abs(mouseX - left),
      right: Math.abs(mouseX - right),
      top: Math.abs(mouseY - top),
      bottom: Math.abs(mouseY - bottom),
    };
    const allEdges = Object.keys(distances) as Edge[];

    const closestEdge = allEdges.reduce(
      (minKey, key) => {
        return distances[key] < distances[minKey] ? key : minKey;
      },
      Object.keys(distances)[0] as Edge,
    );

    // Access the property with the smallest value
    const minDistanceProperty = distances[closestEdge];

    console.log(
      `The property with the smallest value is ${closestEdge} with a distance of ${minDistanceProperty}`,
    );

    const n = neighbours(box)[closestEdge];

    console.log(Object.entries(distances));
    const opposites = {
      left: "right",
      right: "left",
      top: "bottom",
      bottom: "top",
    } as const;

    if (!box.selectableEdges[closestEdge]) {
      return;
    }

    // function that:
    // - set the selectedEdge
    // - checks if the box has been won
    // - if the box has been won set the winner
    // - if the box has been won return true

    function selectEdgeAndCheckIfWon(b: Box, edge: Edge) {
      b.selectedEdges[edge] = true;
      // if there are any remaining unselected edges
      if (Object.values(b.selectedEdges).some((edge) => !edge)) {
        return false;
      }

      console.log(">>> Box won", currentPlayer);
      b.winner = currentPlayer;
      return true;
    }

    const wonBox = selectEdgeAndCheckIfWon(box, closestEdge);
    const wonNeighbour = selectEdgeAndCheckIfWon(n, opposites[closestEdge]);

    if (wonBox || wonNeighbour) {
      forceRefresh();
      return;
    }

    turnComplete();
  };

  const listSelectedEdges = Object.entries(box.selectedEdges).map(
    ([key, value]) => (value ? `${key}-selected` : ""),
  );

  const listSelectableEdges = Object.entries(box.selectableEdges).map(
    ([key, value]) => (value ? `${key}-selectable` : ""),
  );

  if (Object.entries(box.selectedEdges))
    return (
      <div
        style={{ aspectRatio: "1/1", marginInline: "auto" }}
        className={`${listSelectedEdges.join(" ")} ${listSelectableEdges.join(
          " ",
        )}`}
      >
        <button onClick={clicked} className={`content ${box.className || ""}`}>
          {/*({box.row}, {box.col})/!*{mouseCoordinates.x !== null &&*!/*/}
          {box.winner}
          {/*  mouseCoordinates.y !== null &&*/}
          {/*  `(Mouse: ${mouseCoordinates.x}, ${mouseCoordinates.y})`}*/}
        </button>
      </div>
    );
};

export default BoxCell;
