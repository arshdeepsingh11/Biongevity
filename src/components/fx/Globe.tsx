"use client";
import { useEffect, useRef } from "react";
import createGlobe from "cobe";

/** Globe — auto-rotating, draggable WebGL globe (cobe) with location markers. */
export function Globe({ markers, className }: { markers: { location: [number, number]; size: number }[]; className?: string }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const drag = useRef<{ x: number | null; delta: number }>({ x: null, delta: 0 });
  useEffect(() => {
    let phi = 0, width = 0;
    const onResize = () => { if (canvas.current) width = canvas.current.offsetWidth; };
    onResize(); addEventListener("resize", onResize);
    let globe: ReturnType<typeof createGlobe>;
    try { globe = createGlobe(canvas.current!, {
      devicePixelRatio: Math.min(2, devicePixelRatio), width: width * 2, height: width * 2, phi: 0, theta: 0.3,
      dark: 0, diffuse: 1.2, mapSamples: 16000, mapBrightness: 6, baseColor: [1, 1, 1],
      markerColor: [37 / 255, 99 / 255, 235 / 255], glowColor: [0.92, 0.95, 1], markers,
      onRender: (s) => {
        if (drag.current.x === null) phi += 0.004;
        s.phi = phi + drag.current.delta; s.width = width * 2; s.height = width * 2;
      },
    }); } catch { return () => removeEventListener("resize", onResize); }
    const c = canvas.current!;
    setTimeout(() => (c.style.opacity = "1"));
    return () => { globe.destroy(); removeEventListener("resize", onResize); };
  }, [markers]);
  return (
    <div className={`relative aspect-square w-full ${className ?? ""}`}>
      <canvas ref={canvas} className="h-full w-full cursor-grab opacity-0 transition-opacity duration-1000 [contain:layout_paint_size] active:cursor-grabbing"
        onPointerDown={(e) => (drag.current.x = e.clientX - drag.current.delta * 200)}
        onPointerUp={() => (drag.current.x = null)} onPointerOut={() => (drag.current.x = null)}
        onPointerMove={(e) => { if (drag.current.x !== null) drag.current.delta = (e.clientX - drag.current.x) / 200; }} />
    </div>
  );
}
