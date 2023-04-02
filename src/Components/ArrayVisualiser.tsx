import { CSSProperties, useEffect, useRef, useState } from "react";
import "./ArrayVisualiser.css";
import { Comparable } from "../Models/DataTypes";

interface ArrayVisualiserProps {
  array: Comparable[];
  pointers?: { index: number; color: string }[];
  windowWidth?: number;
  displayMode?: "bars" | "boxes";
  overrideMinMax?: [Comparable, Comparable];
  overrideWidth?: number;
}

const ArrayVisualiser: React.FC<ArrayVisualiserProps> = ({
  array,
  pointers,
  windowWidth,
  displayMode = "bars",
  overrideMinMax = null,
  overrideWidth = null,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [canvasWidth, setCanvasWidth] = useState(windowWidth);

  const scrollbarVisible = () => {
    const scrollable = document.documentElement.scrollHeight > document.documentElement.clientHeight; 
    return scrollable;
  };

  useEffect(() => {
    setCanvasWidth(windowWidth);
  }, [windowWidth]);

  useEffect(() => {
    const element = containerRef.current;
    const computedStyle = window.getComputedStyle(element as Element);
    const padding = parseInt(computedStyle.paddingLeft) + parseInt(computedStyle.paddingRight);
    const maxWidth = (containerRef.current?.clientWidth ?? 0) - padding;
    setCanvasWidth(maxWidth)
  }, [scrollbarVisible()]);

  useEffect(() => {
    if (displayMode === "bars") {
      // Only continue if the array is numeric
      if (!array.every((num) => typeof num === "number")) {
        return;
      }
      const numericArray = array as number[];
      const canvas = canvasRef.current;
      
      if (!canvas) {
        return;
      }

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        return;
      }
    // Clear the canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let min: Comparable, max: Comparable;
      if (overrideMinMax) {
        [min, max] = overrideMinMax;
      } else {
        [min, max] = [Math.min(...numericArray), Math.max(...numericArray)];
      }
      const unitHeight = (canvas.height - 20) / ((max as number) - (min as number) + 1);
      const barWidth = overrideWidth ?? canvas.width / numericArray.length;

      numericArray.forEach((num, index) => {
        // Calculate color of bar, based on the number using hsl
        // from green (min) to red (max)
        const color = `hsl(${120 - (num - (min as number)) / ((max as number) - (min as number) + 1) * 120}, 100%, 50%)`;

        const barHeight = num * unitHeight;
        const x = index * barWidth;
        const y = canvas.height - barHeight - 10;

        // Draw the pointers as
        // two triangles, one on top of the bar, and one on the bottom
        // of the bar. The top triangle points down, and the bottom
        // triangle points up.
        // Size: 10px
        const pointer = pointers?.find((p) => p.index === index);
        if (pointer) {
          ctx.fillStyle = pointer.color;
          // Inverted triangle on top
          ctx.beginPath();
          ctx.moveTo(x + barWidth / 2 - 10, y - 10);
          ctx.lineTo(x + barWidth / 2 + 10, y - 10);
          ctx.lineTo(x + barWidth / 2 , y);
          ctx.fill();

          // Normal triangle on bottom
          ctx.beginPath();
          ctx.moveTo(x + barWidth / 2 - 10, y + barHeight + 10);
          ctx.lineTo(x + barWidth / 2 + 10, y + barHeight + 10);
          ctx.lineTo(x + barWidth / 2 , y + barHeight);
          ctx.fill();
        }

        ctx.fillStyle = color;
        ctx.fillRect(x, y, barWidth, barHeight);
      });
    }
  }, [array, pointers, canvasWidth, displayMode]);

  return (
    <div
    className="array-visualiser-container"
    ref={containerRef}
    >
      <canvas
        ref={canvasRef}
        width={canvasWidth}
        height={370}
        style={{ display: displayMode === "bars" ? "inline" : "none" }}
      />
      <div
        style={{
          display: displayMode === "boxes" ? "flex" : "none",
        }}
        className="array-boxes-container"
      >
        {array.map((num, index) => {
          const pointer = pointers?.find((p) => p.index === index);
          const arrowClass = pointer ? "arrow" : "";
          let arrowStyle: CSSProperties = {};
          if (arrowClass) {
            arrowStyle = {
              "--arrow-color": pointer?.color,
            } as CSSProperties;
          }

          if (displayMode === "boxes") {
            arrowStyle["fontSize"] = Math.max(Math.min(120, 700 / array.length), 9) + "px";
            return (
              <div
                className={"array-element " + arrowClass}
                style={arrowStyle}
                key={index}
              >
                {num.toString()}
              </div>
            );
          } else {
            return null;
          }
        })}
      </div>
    </div>
  );
};

export default ArrayVisualiser;
