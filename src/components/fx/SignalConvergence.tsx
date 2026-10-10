"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";

const COLORS = [0xff8a3d, 0xff4d8d, 0x9b6bff, 0x3d8bff, 0x6a5cff];

/**
 * Signal Convergence — streaming signal lines from data sources converge on a
 * central hub (BioELR). Scene tilts with the pointer; `active` brightens one stream.
 */
export function SignalConvergence({ items, active = 0, hub = "BioELR", className }: { items: string[]; active?: number; hub?: string; className?: string }) {
  const host = useRef<HTMLDivElement>(null);
  const labels = useRef<(HTMLSpanElement | null)[]>([]);
  const hubLabel = useRef<HTMLSpanElement>(null);
  const activeRef = useRef(active);
  activeRef.current = active;

  useEffect(() => {
    const el = host.current!;
    let renderer: THREE.WebGLRenderer;
    try { renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "low-power" }); }
    catch { el.dataset.nogl = "1"; return; } // no WebGL: keep the static fallback
    renderer.setPixelRatio(Math.min(innerWidth < 768 ? 1.5 : 2, devicePixelRatio));
    el.appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
    camera.position.set(0, 0, 9);
    const group = new THREE.Group(); scene.add(group);

    // Hub
    const hubMesh = new THREE.Mesh(new THREE.IcosahedronGeometry(0.55, 3), new THREE.MeshStandardMaterial({ color: 0x6a5cff, emissive: 0x6a5cff, emissiveIntensity: 0.35, roughness: 0.25, metalness: 0.2 }));
    group.add(hubMesh);
    const halo = new THREE.Mesh(new THREE.SphereGeometry(0.9, 32, 32), new THREE.MeshBasicMaterial({ color: 0x9b6bff, transparent: true, opacity: 0.12 }));
    group.add(halo);
    scene.add(new THREE.AmbientLight(0xffffff, 0.8));
    const dl = new THREE.DirectionalLight(0xffffff, 1.6); dl.position.set(3, 4, 5); scene.add(dl);

    const N = items.length;
    const streams = items.map((_, i) => {
      const a = (i / N) * Math.PI * 2 - Math.PI / 2;
      const start = new THREE.Vector3(Math.cos(a) * 3.6, Math.sin(a) * 2.5, (i % 2 ? 0.8 : -0.8));
      const ctrl = new THREE.Vector3(Math.cos(a + 0.6) * 1.8, Math.sin(a + 0.6) * 1.6, (i % 2 ? -1.2 : 1.2));
      const curve = new THREE.QuadraticBezierCurve3(start, ctrl, new THREE.Vector3(0, 0, 0));
      const pts = curve.getPoints(80);
      const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineBasicMaterial({ color: COLORS[i % 5], transparent: true, opacity: 0.35 }));
      group.add(line);
      const node = new THREE.Mesh(new THREE.SphereGeometry(0.14, 24, 24), new THREE.MeshStandardMaterial({ color: COLORS[i % 5], emissive: COLORS[i % 5], emissiveIntensity: 0.3 }));
      node.position.copy(start); group.add(node);
      // particles
      const P = 26, pos = new Float32Array(P * 3), offs = Array.from({ length: P }, () => Math.random());
      const geo = new THREE.BufferGeometry(); geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
      const pts3 = new THREE.Points(geo, new THREE.PointsMaterial({ color: COLORS[i % 5], size: 0.07, transparent: true, opacity: 0.9, depthWrite: false }));
      group.add(pts3);
      return { curve, line, node, pts3, pos, offs, start };
    });

    const tilt = { x: 0, y: 0, tx: 0, ty: 0 };
    const pm = (e: PointerEvent) => { const r = el.getBoundingClientRect(); tilt.tx = ((e.clientY - r.top) / r.height - 0.5) * 0.5; tilt.ty = ((e.clientX - r.left) / r.width - 0.5) * 0.7; };
    el.addEventListener("pointermove", pm);

    const resize = () => { const w = el.clientWidth, h = el.clientHeight; renderer.setSize(w, h, false); renderer.domElement.style.width = "100%"; renderer.domElement.style.height = "100%"; camera.aspect = w / h; camera.position.z = w < 520 ? 11.5 : 9; camera.updateProjectionMatrix(); };
    resize(); const ro = new ResizeObserver(resize); ro.observe(el);

    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0, visible = true; const t0 = performance.now(); const v = new THREE.Vector3();
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting)); io.observe(el);
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (!visible) return;
      const t = reduced ? 0 : (now - t0) / 1000;
      tilt.x += (tilt.tx - tilt.x) * 0.05; tilt.y += (tilt.ty - tilt.y) * 0.05;
      group.rotation.x = tilt.x; group.rotation.y = tilt.y + Math.sin(t * 0.2) * 0.15;
      const pulse = 1 + Math.sin(t * 2.4) * 0.05; hubMesh.scale.setScalar(pulse); halo.scale.setScalar(1 + Math.sin(t * 2.4) * 0.12);
      streams.forEach((s, i) => {
        const on = activeRef.current === i;
        (s.line.material as THREE.LineBasicMaterial).opacity += ((on ? 0.95 : 0.25) - (s.line.material as THREE.LineBasicMaterial).opacity) * 0.1;
        (s.pts3.material as THREE.PointsMaterial).size = on ? 0.11 : 0.06;
        s.node.scale.setScalar(on ? 1.6 : 1);
        const speed = on ? 0.45 : 0.22;
        s.offs.forEach((o, k) => { const p = s.curve.getPoint((o + t * speed) % 1); s.pos[k * 3] = p.x; s.pos[k * 3 + 1] = p.y; s.pos[k * 3 + 2] = p.z; });
        s.pts3.geometry.attributes.position.needsUpdate = true;
        const lab = labels.current[i];
        if (lab) {
          v.copy(s.start).applyMatrix4(group.matrixWorld).project(camera);
          lab.style.transform = `translate(-50%,-50%) translate(${(v.x * 0.5 + 0.5) * el.clientWidth}px,${(-v.y * 0.5 + 0.5) * el.clientHeight - 26}px)`;
          lab.dataset.on = on ? "1" : "0";
        }
      });
      if (hubLabel.current) { v.set(0, -0.95, 0).applyMatrix4(group.matrixWorld).project(camera); hubLabel.current.style.transform = `translate(-50%,0) translate(${(v.x * 0.5 + 0.5) * el.clientWidth}px,${(-v.y * 0.5 + 0.5) * el.clientHeight}px)`; }
      renderer.render(scene, camera);
    };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); el.removeEventListener("pointermove", pm); renderer.dispose(); el.removeChild(renderer.domElement); };
  }, [items]);

  return (
    <div ref={host} className={`relative aspect-square w-full ${className ?? ""}`}>
      {items.map((it, i) => (
        <span key={it} ref={(n) => { labels.current[i] = n; }}
          className="pointer-events-none absolute left-0 top-0 z-10 whitespace-nowrap rounded-full bg-white/90 px-2.5 py-1 text-[12px] font-semibold text-muted shadow-card ring-1 ring-black/5 transition-colors data-[on='1']:bg-ink data-[on='1']:text-white">
          {it}
        </span>
      ))}
      <span ref={hubLabel} className="pointer-events-none absolute left-0 top-0 z-10 rounded-full bg-iri px-3 py-1 text-[12px] font-bold text-white shadow-glow">{hub}</span>
    </div>
  );
}
