import React, { useEffect, useState } from 'react';

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Hide the real cursor
    document.body.style.cursor = 'none';

    const moveCursor = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', moveCursor);

    return () => {
      // Restore the cursor if component unmounts
      document.body.style.cursor = 'default';
      window.removeEventListener('mousemove', moveCursor);
    };
  }, []);

  return (
    <div
      className="custom-cursor"
      style={{
        left: position.x,
        top: position.y,
        transform: 'translate(-50%, -50%)', // Centers the circle on the tip
      }}
    />
  );
};

export default CustomCursor;
