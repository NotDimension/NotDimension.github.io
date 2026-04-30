import { useEffect, useRef, useState } from "react";

type CatState = "idle" | "walk" | "run";

const FRAME = 64;
const TRAIL = 80;
const MAX_SPEED = 6.5;
const ACCEL = 0.35;
const FRICTION = 0.82;
const WALK_THRESH = 0.4;
const RUN_THRESH = 4.2;
const FACING_DEADZONE = 1.2;
const BASE_FACING = -1; // sprite faces left

const COUNTS: Record<CatState, number> = { idle: 10, walk: 15, run: 10 };
const FPS: Record<CatState, number> = { idle: 10, walk: 16, run: 18 };

const buildFrames = (state: CatState): HTMLImageElement[] => {
  const arr: HTMLImageElement[] = [];
  for (let i = 0; i < COUNTS[state]; i++) {
    const img = new Image();
    img.decoding = "async";
    img.src = `/sprites/${state}/${i}.png`;
    arr.push(img);
  }
  return arr;
};

const CursorCat = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const target = useRef({ x: -200, y: -200 });
  const pos = useRef({ x: -200, y: -200 });
  const vel = useRef({ x: 0, y: 0 });
  const facing = useRef<1 | -1>(1);
  const stateRef = useRef<CatState>("idle");
  const frameIdx = useRef(0);
  const lastFrameTime = useRef(0);
  const framesRef = useRef<Record<CatState, HTMLImageElement[]> | null>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const isTouch = window.matchMedia("(hover: none)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const small = window.innerWidth < 768;
    if (isTouch || reduced || small) return;

    framesRef.current = {
      idle: buildFrames("idle"),
      walk: buildFrames("walk"),
      run: buildFrames("run"),
    };

    setEnabled(true);

    const canvas = canvasRef.current!;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = FRAME * dpr;
    canvas.height = FRAME * dpr;
    canvas.style.width = `${FRAME}px`;
    canvas.style.height = `${FRAME}px`;
    const ctx = canvas.getContext("2d")!;
    ctx.imageSmoothingEnabled = false;
    ctx.scale(dpr, dpr);

    const onMove = (e: MouseEvent) => {
      target.current.x = e.clientX;
      target.current.y = e.clientY;
    };
    window.addEventListener("mousemove", onMove, { passive: true });

    let raf = 0;
    const draw = () => {
      const frames = framesRef.current![stateRef.current];
      const img = frames[frameIdx.current % frames.length];
      ctx.clearRect(0, 0, FRAME, FRAME);
      if (img && img.complete && img.naturalWidth > 0) {
        ctx.drawImage(img, 0, 0, FRAME, FRAME);
      }
    };

    const tick = (now: number) => {
      // physics
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
        vel.current.x *= FRICTION;
        vel.current.y *= FRICTION;
      } else {
        const desiredSpeed = Math.min(MAX_SPEED, dist * 0.18);
        const tx = (dx / dist) * desiredSpeed;
        const ty = (dy / dist) * desiredSpeed;
        vel.current.x += (tx - vel.current.x) * ACCEL;
        vel.current.y += (ty - vel.current.y) * ACCEL;
      }

      pos.current.x += vel.current.x;
      pos.current.y += vel.current.y;

      const speed = Math.hypot(vel.current.x, vel.current.y);
      if (Math.abs(vel.current.x) > FACING_DEADZONE) {
        facing.current = vel.current.x > 0 ? 1 : -1;
      }

      const next: CatState =
        speed < WALK_THRESH ? "idle" : speed > RUN_THRESH ? "run" : "walk";
      if (next !== stateRef.current) {
        stateRef.current = next;
        frameIdx.current = 0;
        lastFrameTime.current = now;
      }

      // advance frame on its own clock (independent of rAF rate)
      const interval = 1000 / FPS[stateRef.current];
      if (now - lastFrameTime.current >= interval) {
        frameIdx.current++;
        lastFrameTime.current = now;
        draw();
      }

      const el = containerRef.current;
      if (el) {
        const flip = facing.current * BASE_FACING;
        el.style.transform = `translate3d(${pos.current.x - FRAME / 2}px, ${pos.current.y - FRAME / 2}px, 0) scaleX(${flip})`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    draw();

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  if (!enabled) return null;
  return (
    <div ref={containerRef} className="cat-container">
      <canvas ref={canvasRef} className="cat-sprite" />
    </div>
  );
};

export default CursorCat;
