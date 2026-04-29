import React, { useState, useEffect, useRef } from 'react';

const MouseChaser = () => {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [state, setState] = useState('idle');
  const [facing, setFacing] = useState(1);
  
  // Refs to track physics without triggering unnecessary re-renders
  const lastMousePos = useRef({ x: 0, y: 0, time: Date.now() });
  const velocity = useRef(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      const dt = now - lastMousePos.current.time;
      
      if (dt > 0) {
        const dx = e.clientX - lastMousePos.current.x;
        const dy = e.clientY - lastMousePos.current.y;
        
        // Calculate Speed (Distance / Time)
        const distance = Math.sqrt(dx * dx + dy * dy);
        velocity.current = distance / dt;

        // 1. Determine Direction (Face Left or Right)
        if (dx > 1) setFacing(1);
        else if (dx < -1) setFacing(-1);

        // 2. Set State based on Speed threshold
        // 0.0 to 0.1: Idle | 0.1 to 0.5: Walk | > 0.5: Run
        if (velocity.current < 0.1) {
          setState('idle');
        } else if (velocity.current < 0.5) {
          setState('walk');
        } else {
          setState('run');
        }

        // 3. Update position
        setPos({ x: e.clientX, y: e.clientY });
        lastMousePos.current = { x: e.clientX, y: e.clientY, time: now };
      }
    };

    // Listen for mouse stop (velocity check doesn't fire if mouse doesn't move)
    const stopCheck = setInterval(() => {
      if (Date.now() - lastMousePos.current.time > 100) {
        setState('idle');
      }
    }, 100);

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearInterval(stopCheck);
    };
  }, []);

  return (
    <div 
      className="cat-container"
      style={{ 
        left: pos.x, 
        top: pos.y,
        transform: `translate(-50%, -50%) scaleX(${facing})`,
        transition: 'left 0.15s ease-out, top 0.15s ease-out'
      }}
    >
      <div className={`cat-sprite state-${state}`} />
    </div>
  );
};

export default MouseChaser;
