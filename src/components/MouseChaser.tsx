import React, { useState, useEffect, useRef } from 'react';

const CursorCat = () => {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [state, setState] = useState('idle');
  const [facing, setFacing] = useState(1);
  
  const lastMousePos = useRef({ x: 0, y: 0, time: Date.now() });
  const velocity = useRef(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      const dt = now - lastMousePos.current.time;
      
      if (dt > 0) {
        const dx = e.clientX - lastMousePos.current.x;
        const dy = e.clientY - lastMousePos.current.y;
        
        // Calculate velocity (pixels per millisecond)
        const distance = Math.sqrt(dx * dx + dy * dy);
        velocity.current = distance / dt;

        // DIRECTION LOGIC:
        // If dx is positive, mouse is moving right. 
        // If the cat faces right by default in the sprite, set facing to 1.
        // If it walks away from the mouse, change these to -1 and 1.
        if (dx > 1) setFacing(1);
        else if (dx < -1) setFacing(-1);

        // SPEED LOGIC:
        if (velocity.current < 0.1) {
          setState('idle');
        } else if (velocity.current < 0.6) {
          setState('walk');
        } else {
          setState('run');
        }

        setPos({ x: e.clientX, y: e.clientY });
        lastMousePos.current = { x: e.clientX, y: e.clientY, time: now };
      }
    };

    // Idle Timer: If mouse stops moving for 100ms, force Idle state
    const idleTimer = setInterval(() => {
      if (Date.now() - lastMousePos.current.time > 100) {
        setState('idle');
      }
    }, 100);

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearInterval(idleTimer);
    };
  }, []);

  return (
    <div 
      className="cat-container"
      style={{ 
        left: pos.x, 
        top: pos.y,
        // translate(-50%, -50%) centers the 48px box on your cursor tip
        transform: `translate(-50%, -50%) scaleX(${facing})`,
        // Transition creates the "chase" lag
        transition: 'left 0.12s ease-out, top 0.12s ease-out'
      }}
    >
      <div className={`cat-sprite state-${state}`} />
    </div>
  );
};

export default CursorCat;
