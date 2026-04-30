import { useEffect, useRef, useState } from "react";

type CatState = "idle" | "walk" | "run";

const FRAME = 64;
const TRAIL = 90; // distance behind cursor
const EASE = 0.08; // lower = lazier

const CursorCat = () => {
  const elRef = useRef<HTMLDivElement | null>(null);
  const target = useRef({ x: -200, y: -200 });
  const pos = useRef({ x: -200, y: -200 });
  const facing = useRef<1 | -1>(1);
  const [state, setState] = useState<CatState>("idle");
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const isTouch = window.matchMedia("(hover: none)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const small = window.innerWidth < 768;
    if (isTouch || reduced || small) return;
    setEnabled(true);

    const onMove = (e: MouseEvent) => {
      target.current.x = e.clientX;
      target.current.y = e.clientY;
    };
    window.addEventListener("mousemove", onMove, { passive: true });

    let raf = 0;
    let lastState: CatState = "idle";
    const tick = () => {
      // trail behind cursor along approach vector
      const dx = target.current.x - pos.current.x;
      const dy = target.current.y - pos.current.y;
      const dist = Math.hypot(dx, dy);

      let tx = target.current.x;
      let ty = target.current.y;
      if (dist > TRAIL) {
        const k = (dist - TRAIL) / dist;
        tx = pos.current.x + dx * k;
        ty = pos.current.y + dy * k;
      } else {
        tx = pos.current.x;
        ty = pos.current.y;
      }

      const ndx = tx - pos.current.x;
      const ndy = ty - pos.current.y;
      pos.current.x += ndx * EASE;
      pos.current.y += ndy * EASE;

      const speed = Math.hypot(ndx, ndy);
      if (Math.abs(ndx) > 0.5) facing.current = ndx > 0 ? 1 : -1;

      const next: CatState = speed < 0.6 ? "idle" : speed > 8 ? "run" : "walk";
      if (next !== lastState) {
        lastState = next;
        setState(next);
      }

      const el = elRef.current;
      if (el) {
        el.style.transform = `translate3d(${pos.current.x - FRAME / 2}px, ${pos.current.y - FRAME / 2}px, 0) scaleX(${facing.current})`;
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
    <div ref={elRef} className="cat-container">
      <div className={`cat-sprite state-${state}`} />
    </div>
  );
};

export default CursorCat;
