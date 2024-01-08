import React, { useEffect, useState } from "react";

import "./styles.css"; // Import your CSS file

export type Edge = "top" | "right" | "bottom" | "left";
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

    box.selectedEdges[closestEdge] = true;
    n.selectedEdges[opposites[closestEdge]] = true;

    forceRefresh();
  };

  useEffect(() => {
    console.log("Mounts");
    return () => console.log("Unmounts");
  }, []);

  const listSelectedEdges = Object.entries(box.selectedEdges).map(
    ([key, value]) => (value ? `${key}-selected` : ""),
  );

  return (
    <div
      style={{ aspectRatio: "1/1", marginInline: "auto" }}
      className={listSelectedEdges.join(" ")}
    >
      <button onClick={clicked} className={`content ${box.className || ""}`}>
        ({box.row}, {box.col}){/*{mouseCoordinates.x !== null &&*/}
        {/*  mouseCoordinates.y !== null &&*/}
        {/*  `(Mouse: ${mouseCoordinates.x}, ${mouseCoordinates.y})`}*/}
      </button>
    </div>
  );
};

export default BoxCell;
