import { useEffect, useRef } from "react";

/**
 * Pixel-art ginger tabby that chases the mouse cursor.
 * - Walk animation while moving, idle animation when arrived.
 * - Slower follow so it lags lazily behind the cursor.
 * - Disabled on touch devices, small screens, and reduced-motion.
 * - Pauses when tab hidden.
 *
 * Sprite frames live in /public/cat/ and are preloaded once.
 */

const WALK_FRAMES = 8;
const IDLE_FRAMES = 6;
const SPRITE_PX = 64;       // source frame size
const DISPLAY_PX = 56;      // rendered size on screen
const FOLLOW_TRAIL = 70;    // px the cat trails behind the cursor

const CursorCat = () => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    const isSmall = window.innerWidth < 768;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isTouch || isSmall || reduceMotion) return;

    const wrap = wrapRef.current;
    const img = imgRef.current;
    if (!wrap || !img) return;

    // Preload all frames into <img> objects so swapping src is instant.
    const walkImgs: HTMLImageElement[] = [];
    const idleImgs: HTMLImageElement[] = [];
    for (let i = 0; i < WALK_FRAMES; i++) {
      const im = new Image();
      im.src = `/cat/walk_${i}.png`;
      walkImgs.push(im);
    }
    for (let i = 0; i < IDLE_FRAMES; i++) {
      const im = new Image();
      im.src = `/cat/idle_${i}.png`;
      idleImgs.push(im);
    }

    // Position state
    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let cx = mx - 120;
    let cy = my + 80;
    let facing: 1 | -1 = 1;

    // Animation state
    let mode: "walk" | "idle" = "idle";
    let frame = 0;
    let frameAccum = 0;
    let lastT = performance.now();
    let visible = true;
    let raf = 0;
    let currentSrc = "";

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
    };
    const onVis = () => {
      visible = !document.hidden;
      lastT = performance.now();
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("visibilitychange", onVis);

    const HALF = DISPLAY_PX / 2;

    const tick = (t: number) => {
      const dt = Math.min((t - lastT) / 16.6667, 3);
      lastT = t;
      if (!visible) {
        raf = requestAnimationFrame(tick);
        return;
      }

      // Follow target lags behind the cursor in the direction it last moved
      const dxToCursor = mx - cx;
      const dyToCursor = my - cy;
      const distToCursor = Math.hypot(dxToCursor, dyToCursor) || 1;
      const trailX = mx - (dxToCursor / distToCursor) * FOLLOW_TRAIL;
      const trailY = my - (dyToCursor / distToCursor) * FOLLOW_TRAIL;

      const dx = trailX - cx;
      const dy = trailY - cy;
      const dist = Math.hypot(dx, dy);

      // Slower lerp — the cat is lazy.
      const ease = Math.min(0.07, 0.015 + dist * 0.0006);
      cx += dx * ease * dt;
      cy += dy * ease * dt;

      if (Math.abs(dx) > 6) facing = dx > 0 ? 1 : -1;

      // Mode: walk if it has meaningful distance to cover, otherwise idle.
      const newMode: "walk" | "idle" = dist > 8 ? "walk" : "idle";
      if (newMode !== mode) {
        mode = newMode;
        frame = 0;
        frameAccum = 0;
      }

      // Frame timing — slower for idle (subtle breathing), faster for walking.
      const frameRate = mode === "walk" ? 7 : 16; // ticks per frame
      frameAccum += dt;
      if (frameAccum >= frameRate) {
        frameAccum = 0;
        const total = mode === "walk" ? WALK_FRAMES : IDLE_FRAMES;
        frame = (frame + 1) % total;
      }

      const src =
        mode === "walk"
          ? walkImgs[frame].src
          : idleImgs[frame].src;
      if (src !== currentSrc) {
        img.src = src;
        currentSrc = src;
      }

      const tx = cx - HALF;
      const ty = cy - HALF;
      wrap.style.transform = `translate3d(${tx}px, ${ty}px, 0) scaleX(${facing})`;

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      aria-hidden="true"
      className="fixed top-0 left-0 pointer-events-none z-[60]"
      style={{
        width: DISPLAY_PX,
        height: DISPLAY_PX,
        willChange: "transform",
        filter: "drop-shadow(0 3px 4px rgba(0,0,0,0.45))",
      }}
    >
      <img
        ref={imgRef}
        alt=""
        width={DISPLAY_PX}
        height={DISPLAY_PX}
        style={{
          width: DISPLAY_PX,
          height: DISPLAY_PX,
          imageRendering: "pixelated",
          display: "block",
        }}
      />
    </div>
  );
};

export default CursorCat;
