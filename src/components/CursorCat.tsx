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
const ACTIVATION_RADIUS = 360; // px from cat to cursor before it wakes
const FADE_MS = 350;

const COUNTS: Record<CatState, number> = { idle: 10, walk: 15, run: 10 };
const FPS: Record<CatState, number> = { idle: 10, walk: 16, run: 18 };

const loadFrames = (state: CatState): Promise<HTMLImageElement[]> => {
  const promises: Promise<HTMLImageElement>[] = [];
  for (let i = 0; i < COUNTS[state]; i++) {
    promises.push(
      new Promise((resolve, reject) => {
        const img = new Image();
        img.decoding = "async";
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error(`failed ${state}/${i}`));
        img.src = `/sprites/${state}/${i}.png`;
      })
    );
  }
  return Promise.all(promises);
};

const CursorCat = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const target = useRef({ x: -9999, y: -9999 });
  const pos = useRef({ x: -9999, y: -9999 });
  const vel = useRef({ x: 0, y: 0 });
  const facing = useRef<1 | -1>(1);
  const stateRef = useRef<CatState>("idle");
  const frameIdx = useRef(0);
  const lastFrameTime = useRef(0);
  const opacity = useRef(0);
  const framesRef = useRef<Record<CatState, HTMLImageElement[]> | null>(null);
  const [ready, setReady] = useState(false);
  const [mode, setMode] = useState<"off" | "static" | "animated">("off");

  // Decide what mode we're in (runs once)
  useEffect(() => {
    const isTouch = window.matchMedia("(hover: none)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const small = window.innerWidth < 768;
    if (isTouch || small) {
      setMode("off");
      return;
    }
    setMode(reduced ? "static" : "animated");
  }, []);

  // Preload frames once mode is decided
  useEffect(() => {
    if (mode === "off") return;
    let cancelled = false;
    const states: CatState[] = mode === "static" ? ["idle"] : ["idle", "walk", "run"];
    Promise.all(states.map((s) => loadFrames(s).then((f) => [s, f] as const)))
      .then((entries) => {
        if (cancelled) return;
        const map = { idle: [], walk: [], run: [] } as Record<CatState, HTMLImageElement[]>;
        entries.forEach(([s, f]) => (map[s] = f));
        // Fill missing sets with idle to avoid undefined access
        if (map.walk.length === 0) map.walk = map.idle;
        if (map.run.length === 0) map.run = map.idle;
        framesRef.current = map;
        setReady(true);
      })
      .catch(() => {
        // swallow — if sprites fail, just don't show the cat
      });
    return () => {
      cancelled = true;
    };
  }, [mode]);

  // Main loop — only after canvas is mounted AND frames are ready
  useEffect(() => {
    if (!ready || mode === "off") return;
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = FRAME * dpr;
    canvas.height = FRAME * dpr;
    canvas.style.width = `${FRAME}px`;
    canvas.style.height = `${FRAME}px`;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.imageSmoothingEnabled = false;
    ctx.scale(dpr, dpr);

    const drawFrame = () => {
      const frames = framesRef.current![stateRef.current];
      const img = frames[frameIdx.current % frames.length];
      ctx.clearRect(0, 0, FRAME, FRAME);
      if (img && img.complete && img.naturalWidth > 0) {
        ctx.drawImage(img, 0, 0, FRAME, FRAME);
      }
    };

    // STATIC MODE — draw idle frame 0 once, position at bottom-right corner
    if (mode === "static") {
      drawFrame();
      container.style.opacity = "1";
      container.style.transform = `translate3d(${window.innerWidth - 96}px, ${window.innerHeight - 96}px, 0) scaleX(${BASE_FACING})`;
      return;
    }

    // ANIMATED MODE
    const onMove = (e: MouseEvent) => {
      target.current.x = e.clientX;
      target.current.y = e.clientY;
    };
    window.addEventListener("mousemove", onMove, { passive: true });

    // Adaptive frame cadence — slightly slower redraw on small screens to save battery
    const cadenceScale = window.innerWidth < 1024 ? 0.85 : 1;

    let raf = 0;
    let lastTickTime = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(now - lastTickTime, 50);
      lastTickTime = now;

      // Cursor-to-cat distance for activation radius
      const cursorDx = target.current.x - pos.current.x;
      const cursorDy = target.current.y - pos.current.y;
      const cursorDist = Math.hypot(cursorDx, cursorDy);
      const wantVisible = cursorDist < ACTIVATION_RADIUS;
      const fadeStep = dt / FADE_MS;
      opacity.current = Math.max(0, Math.min(1, opacity.current + (wantVisible ? fadeStep : -fadeStep)));

      // Trail-behind goal
      let goalX = target.current.x;
      let goalY = target.current.y;
      if (cursorDist > 0.001) {
        const trail = Math.min(TRAIL, cursorDist);
        goalX = target.current.x - (cursorDx / cursorDist) * trail;
        goalY = target.current.y - (cursorDy / cursorDist) * trail;
      }

      const dx = goalX - pos.current.x;
      const dy = goalY - pos.current.y;
      const dist = Math.hypot(dx, dy);

      if (dist < 0.5 || !wantVisible) {
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
        drawFrame();
      }

      const interval = (1000 / FPS[stateRef.current]) / cadenceScale;
      if (now - lastFrameTime.current >= interval) {
        frameIdx.current++;
        lastFrameTime.current = now;
        drawFrame();
      }

      const flip = facing.current * BASE_FACING;
      container.style.opacity = String(opacity.current);
      container.style.transform = `translate3d(${pos.current.x - FRAME / 2}px, ${pos.current.y - FRAME / 2}px, 0) scaleX(${flip})`;

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    drawFrame();

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [ready, mode]);

  if (mode === "off") return null;
  return (
    <div ref={containerRef} className="cat-container" style={{ opacity: 0 }}>
      <canvas ref={canvasRef} className="cat-sprite" />
    </div>
  );
};

export default CursorCat;
