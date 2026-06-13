import { useEffect, useRef, useState } from "react";

const USERNAME = "NotDimension";

export default function MinecraftSkinViewer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mounted, setMounted] = useState(false);
  const [webglReady, setWebglReady] = useState(false);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const c = document.createElement("canvas");
      const gl = c.getContext("webgl2") || c.getContext("webgl") || c.getContext("experimental-webgl");
      if (gl) setWebglReady(true);
    } catch {}
  }, []);

  useEffect(() => {
    if (!mounted || !webglReady) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    let disposed = false;
    let viewer: { dispose: () => void } | null = null;
    
    (async () => {
      try {
        const sv = await import("skinview3d");
        if (disposed) return;
        const v = new sv.SkinViewer({
          canvas,
          width: 240,
          height: 360,
          skin: `https://mc-heads.net/skin/${USERNAME}`,
        });
        v.animation = new sv.WalkingAnimation();
        v.controls.enableRotate = true;
        v.controls.enableZoom = false;
        v.controls.autoRotate = true;
        v.controls.autoRotateSpeed = 0.6;
        v.zoom = 0.85;
        viewer = v;
      } catch (e) {
        setImgError(true);
      }
    })();
    
    return () => {
      disposed = true;
      try { viewer?.dispose(); } catch {}
    };
  }, [mounted, webglReady]);

  const fallback = `https://mc-heads.net/body/${USERNAME}/right`;
  const useFallback = !mounted || !webglReady || imgError;

  return (
    <div className="flex flex-col items-center gap-4">
      <h3 className="text-sm font-mono tracking-widest uppercase text-secondary-foreground opacity-80">
        Minecraft User
      </h3>
      {/* Container using your glass-card logic */}
      <div
        className="glass-card rounded-xl overflow-hidden flex items-center justify-center"
        style={{
          width: 240,
          height: 360,
          cursor: useFallback ? "default" : "grab",
        }}
        title={useFallback ? "" : "Drag to rotate"}
      >
        {useFallback ? (
          <img
            src={fallback}
            alt={`${USERNAME} Minecraft skin`}
            crossOrigin="anonymous"
            style={{ maxHeight: 340, imageRendering: "pixelated" }}
          />
        ) : (
          <canvas ref={canvasRef} />
        )}
      </div>

      {!useFallback && (
        <p className="text-xs font-mono text-secondary-foreground opacity-70">
          // Drag to rotate
        </p>
      )}

      <a
        href={`https://namemc.com/profile/${USERNAME}`}
        target="_blank"
        rel="noreferrer"
        className="glass-card px-5 py-3 rounded-lg flex items-center gap-3 group transition-all duration-300 hover:border-primary/50"
      >
        <span className="text-sm font-mono text-secondary-foreground group-hover:text-foreground transition-colors">
          View on NameMC
        </span>
      </a>
    </div>
  );
}
