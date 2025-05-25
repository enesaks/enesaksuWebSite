import React, { useState, useEffect, useMemo } from 'react';

interface ArrowStyleProps {
  x: number;
  y: number;
  angle: number;
  size: number;
}

const ArrowSvg: React.FC<{ color: string; size: number; styleProps: ArrowStyleProps }> = React.memo(({ color, size, styleProps }) => {
  return (
    <div
      style={{
        position: 'absolute',
        left: styleProps.x - size / 2,
        top: styleProps.y - size / 2,
        width: size,
        height: size,
        transform: `rotate(${styleProps.angle}deg)`,
        transition: 'transform 0.3s ease-out', // Updated for smoother rotation
        pointerEvents: 'none',
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 10 10" // Defines the coordinate system for the path
        fill="none" // Arrows will not be filled
        stroke={color} // Arrow lines will take this color
        strokeWidth="1.5" // Thickness of the arrow lines
        strokeLinecap="round" // Makes the ends of the lines rounded
        strokeLinejoin="round" // Makes the join in the polyline rounded
        style={{ display: 'block' }}
      >
        {/* Polyline points to create a chevron shape ">" pointing to the right by default */}
        {/* Tip at (8,5), wings start at (2,2) and (2,8) within the 10x10 viewBox */}
        <polyline points="2,2 8,5 2,8" />
      </svg>
    </div>
  );
});

interface ArrowBackgroundProps {
  mousePosition: { x: number; y: number };
  isDarkMode: boolean;
}

const ArrowBackground: React.FC<ArrowBackgroundProps> = ({ mousePosition, isDarkMode }) => {
  const [gridPoints, setGridPoints] = useState<{ id: string; x: number; y: number }[]>([]);
  const gridSize = 90; // Spacing between arrows
  const arrowSize = 100; // Size of each arrow's container - UPDATED FROM 20 to 40

  useEffect(() => {
    const updateGrid = () => {
      if (typeof window === 'undefined') return;
      const { innerWidth, innerHeight } = window;
      const newGridPoints = [];
      let idCounter = 0;
      // Adjust loop to ensure arrows are more centered within their grid cells
      for (let x = gridSize / 2; x < innerWidth + gridSize / 2; x += gridSize) {
        for (let y = gridSize / 2; y < innerHeight + gridSize / 2; y += gridSize) {
          newGridPoints.push({ id: `arrow-${idCounter++}`, x, y });
        }
      }
      setGridPoints(newGridPoints);
    };

    updateGrid();

    let timeoutId: number;
    const handleResize = () => {
      window.clearTimeout(timeoutId);
      timeoutId = window.setTimeout(updateGrid, 200); // Debounce resize event
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.clearTimeout(timeoutId);
    }
  }, [gridSize]);

  const arrowColor = isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)';

  const arrows = useMemo(() => {
    return gridPoints.map(point => {
      // Calculate angle from arrow's center (point.x, point.y) to mouse position
      const angle = Math.atan2(mousePosition.y - point.y, mousePosition.x - point.x) * (180 / Math.PI);
      const styleProps: ArrowStyleProps = { x: point.x, y: point.y, angle, size: arrowSize };
      return (
        <ArrowSvg
          key={point.id}
          color={arrowColor}
          size={arrowSize}
          styleProps={styleProps}
        />
      );
    });
  }, [gridPoints, mousePosition.x, mousePosition.y, arrowColor, arrowSize]);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none" aria-hidden="true">
      {arrows}
    </div>
  );
};

export default ArrowBackground;