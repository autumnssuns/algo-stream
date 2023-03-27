import { CSSProperties, useEffect, useRef, useState } from "react";
import "./ArrayVisualiser.css";

interface ArrayVisualiserProps {
  array: number[];
  pointers?: { index: number; color: string }[];
  displayMode?: "bars" | "boxes";
}

const ArrayVisualiser: React.FC<ArrayVisualiserProps> = ({
  array,
  pointers,
  displayMode = "bars",
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
    // Get the window width
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  window.onresize = () => {
    setWindowWidth(window.innerWidth);
  };
  useEffect(() => {
    if (displayMode === "bars") {
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
      const [min, max] = [Math.min(...array), Math.max(...array)];
      const unitHeight = (canvas.height) / (max - min + 1);
      const barWidth = canvas.width / array.length;

      array.forEach((num, index) => {
        // Calculate color of bar, based on the number using hsl
        // from green (min) to red (max)
        const color = `hsl(${120 - (num - min) / (max - min + 1) * 120}, 100%, 50%)`;

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
  }, [array, pointers, windowWidth, displayMode]);

  return (
    <div style={{ position: "relative" }}
    >
      <canvas
        ref={canvasRef}
        width={windowWidth}
        height={370}
        style={{ display: displayMode === "bars" ? "block" : "none" }}
      />
      <div
        style={{
          display: displayMode === "boxes" ? "flex" : "none",
          position: "relative",
          alignItems: "flex-end",
          flexWrap: "wrap",
          padding: "15px 0"
        }}
        ref={containerRef}
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
                {num}
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
