import { useEffect, useRef, useState } from "react";

type CatState = "idle" | "walk" | "run";

const FRAME = 64;
const TRAIL = 80;          // how far behind the cursor it sits when idle
const MAX_SPEED = 6.5;     // px/frame cap during run
const ACCEL = 0.35;        // how quickly it ramps up to target speed
const FRICTION = 0.82;     // how quickly it slows when close
const WALK_THRESH = 0.4;
const RUN_THRESH = 4.2;
const FACING_DEADZONE = 1.2;

// Sprite cat faces LEFT by default
const BASE_FACING = -1;

const CursorCat = () => {
  const elRef = useRef<HTMLDivElement | null>(null);
  const target = useRef({ x: -200, y: -200 });
  const pos = useRef({ x: -200, y: -200 });
  const vel = useRef({ x: 0, y: 0 });
  const facing = useRef<1 | -1>(1);
  const [state, setState] = useState<CatState>("idle");
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const isTouch = window.matchMedia("(hover: none)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const small = window.innerWidth < 768;
    if (isTouch || reduced || small) return;

    // Preload sprite sheets (lazy: only after we know we'll render)
    ["/sprites/IDLE.png", "/sprites/WALK.png", "/sprites/RUN.png"].forEach((src) => {
      const img = new Image();
      img.decoding = "async";
      img.src = src;
    });

    setEnabled(true);

    const onMove = (e: MouseEvent) => {
      target.current.x = e.clientX;
      target.current.y = e.clientY;
    };
    window.addEventListener("mousemove", onMove, { passive: true });

    let raf = 0;
    let lastState: CatState = "idle";
    const tick = () => {
      // Aim point is the cursor offset back along the approach vector by TRAIL.
      const dxRaw = target.current.x - pos.current.x;
      const dyRaw = target.current.y - pos.current.y;
      const distRaw = Math.hypot(dxRaw, dyRaw);

      let goalX = target.current.x;
      let goalY = target.current.y;
      if (distRaw > 0.001) {
        const trail = Math.min(TRAIL, distRaw);
        goalX = target.current.x - (dxRaw / distRaw) * trail;
        goalY = target.current.y - (dyRaw / distRaw) * trail;
      }

      const dx = goalX - pos.current.x;
      const dy = goalY - pos.current.y;
      const dist = Math.hypot(dx, dy);

      if (dist < 0.5) {
        // settle
        vel.current.x *= FRICTION;
        vel.current.y *= FRICTION;
      } else {
        // accelerate toward goal, capped
        const desiredSpeed = Math.min(MAX_SPEED, dist * 0.18);
        const tx = (dx / dist) * desiredSpeed;
        const ty = (dy / dist) * desiredSpeed;
        vel.current.x += (tx - vel.current.x) * ACCEL;
        vel.current.y += (ty - vel.current.y) * ACCEL;
      }

      pos.current.x += vel.current.x;
      pos.current.y += vel.current.y;

      const speed = Math.hypot(vel.current.x, vel.current.y);

      // Facing only updates when there's meaningful horizontal motion
      if (Math.abs(vel.current.x) > FACING_DEADZONE) {
        facing.current = vel.current.x > 0 ? 1 : -1;
      }

      const next: CatState =
        speed < WALK_THRESH ? "idle" : speed > RUN_THRESH ? "run" : "walk";
      if (next !== lastState) {
        lastState = next;
        setState(next);
      }

      const el = elRef.current;
      if (el) {
        const flip = facing.current * BASE_FACING; // sprite faces left → invert
        el.style.transform = `translate3d(${pos.current.x - FRAME / 2}px, ${pos.current.y - FRAME / 2}px, 0) scaleX(${flip})`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  if (!enabled) return null;
  return (
    <div ref={elRef} className={`cat-container state-${state}`}>
      <div className="cat-sprite" />
    </div>
  );
};

export default CursorCat;
