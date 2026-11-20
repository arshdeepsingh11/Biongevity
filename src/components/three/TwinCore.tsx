"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { gsap, ScrollTrigger, reducedMotion } from "@/lib/gsap";
import { onReady } from "@/lib/ready";
import { onThemeChange, themeHex } from "@/lib/theme";

/**
 * The hero's 3D object: the digital twin's core. A glass sphere with a dark heart, held by three
 * rings that turn at their own pace, each carrying a few beads — the biomarkers in orbit around
 * one person. Built from primitives (no model file), lit by a neutral studio environment, and
 * coloured from the active theme (it re-tints itself when the theme switches).
 *
 * Motion, all of it gentle: turns into place once the page is ready, idles with a slow spin,
 * leans a few degrees toward the pointer, and drifts out of frame as the hero scrolls away.
 * The loop only runs while the canvas is on screen and the tab is visible.
 */
export default function TwinCore({ className = "" }: { className?: string }) {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = host.current;
    if (!el) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    } catch { return; }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 50);
    camera.position.set(0, 0.1, 9);
    camera.lookAt(0, 0, 0);

    const pmrem = new THREE.PMREMGenerator(renderer);
    const envTarget = pmrem.fromScene(new RoomEnvironment(), 0.04);
    scene.environment = envTarget.texture;

    const key = new THREE.DirectionalLight(0xfff4e6, 2);
    key.position.set(4, 6, 5);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0xffffff, 0.8);
    rim.position.set(-5, -2, -4);
    scene.add(rim);
    scene.add(new THREE.AmbientLight(0xffffff, 0.3));

    // ── materials, tinted from the theme ──────────────────────────────
    const ring = new THREE.MeshPhysicalMaterial({ metalness: 0.9, roughness: 0.3, clearcoat: 1, clearcoatRoughness: 0.15 });
    const bead = new THREE.MeshPhysicalMaterial({ metalness: 0.6, roughness: 0.25, clearcoat: 1 });
    const heart = new THREE.MeshPhysicalMaterial({ metalness: 0.85, roughness: 0.35, clearcoat: 0.8 });
    const glass = new THREE.MeshPhysicalMaterial({
      color: 0xffffff, transmission: 1, thickness: 1.4, roughness: 0.06, ior: 1.46, clearcoat: 1, clearcoatRoughness: 0.05,
      envMapIntensity: 1.2, transparent: true,
    });
    // Glass refracts whatever is behind it; over a transparent canvas that is nothing, which reads
    // as black. A page-coloured disc behind the core gives it the light it needs and is invisible
    // against the page itself.
    const backdrop = new THREE.MeshBasicMaterial();
    const tint = () => {
      ring.color.set(themeHex("ai-2"));
      bead.color.set(themeHex("ai-hi"));
      heart.color.set(themeHex("ai-2"));
      backdrop.color.set(themeHex("pearl"));
    };
    tint();
    const offTheme = onThemeChange(tint);

    // ── geometry ─────────────────────────────────────────────────────
    const core = new THREE.Group();
    const disc = new THREE.Mesh(new THREE.CircleGeometry(1.5, 64), backdrop);
    disc.position.z = -1.7;
    scene.add(disc);
    core.add(new THREE.Mesh(new THREE.SphereGeometry(1.15, 72, 72), glass));
    core.add(new THREE.Mesh(new THREE.SphereGeometry(0.42, 48, 48), heart));

    const rings: THREE.Group[] = [];
    const beadGeo = new THREE.SphereGeometry(0.075, 20, 20);
    const specs: { tilt: [number, number]; radius: number; beads: number; speed: number }[] = [
      { tilt: [Math.PI / 2, 0], radius: 1.7, beads: 5, speed: 0.22 },
      { tilt: [Math.PI / 3, Math.PI / 4], radius: 2.05, beads: 4, speed: -0.16 },
      { tilt: [-Math.PI / 3.2, -Math.PI / 5], radius: 2.4, beads: 3, speed: 0.11 },
    ];
    for (const s of specs) {
      const holder = new THREE.Group();
      holder.rotation.set(s.tilt[0], s.tilt[1], 0);
      const torus = new THREE.Mesh(new THREE.TorusGeometry(s.radius, 0.028, 16, 160), ring);
      for (let i = 0; i < s.beads; i++) {
        const a = (i / s.beads) * Math.PI * 2;
        const b = new THREE.Mesh(beadGeo, bead);
        b.position.set(Math.cos(a) * s.radius, Math.sin(a) * s.radius, 0);
        torus.add(b);
      }
      holder.add(torus);
      holder.userData.speed = s.speed;
      rings.push(holder);
      core.add(holder);
    }

    const rig = new THREE.Group();
    rig.add(core);
    scene.add(rig);

    // ── motion state ─────────────────────────────────────────────────
    const motion = { intro: 0, scroll: 0, mouseX: 0, mouseY: 0, t: 0 };
    const still = reducedMotion();
    let baseScale = 1;

    const resize = () => {
      const w = el.clientWidth, h = el.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      baseScale = Math.min(1, (w / h) * 0.95, h / 520);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(el);

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      motion.mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      motion.mouseY = (e.clientY / window.innerHeight) * 2 - 1;
    };
    if (!still) window.addEventListener("pointermove", onMove, { passive: true });

    const st = ScrollTrigger.create({ trigger: el, start: "center center", end: "bottom top", scrub: true, onUpdate: (self) => { motion.scroll = self.progress; } });
    const introTween = gsap.to(motion, { intro: 1, duration: 2, ease: "power4.out", paused: true });
    const offReady = onReady(() => (still ? (motion.intro = 1) : introTween.play()));

    let running = false, raf = 0, last = performance.now();
    const frame = (now: number) => {
      if (!running) return;
      raf = requestAnimationFrame(frame);
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      motion.t += dt;
      const intro = motion.intro, s = motion.scroll, easeIn = 1 - intro;

      if (!still) for (const r of rings) (r.children[0] as THREE.Mesh).rotation.z += dt * r.userData.speed;
      core.rotation.y = (still ? 0 : motion.t * 0.12) - easeIn * 1.8 + s * 1.2;
      core.rotation.x = Math.sin(motion.t * 0.4) * 0.04;

      rig.rotation.x += (motion.mouseY * 0.14 - rig.rotation.x) * 0.08;
      rig.rotation.y += (motion.mouseX * 0.22 - rig.rotation.y) * 0.08;
      rig.position.y = -easeIn * 0.6 + s * 1.8 + (still ? 0 : Math.sin(motion.t * 0.8) * 0.04);
      rig.scale.setScalar(baseScale * (0.7 + 0.3 * intro) * (1 - s * 0.15));
      disc.position.y = rig.position.y;
      disc.scale.setScalar(rig.scale.x);

      el.style.opacity = String(Math.max(0, Math.min(1, intro * 1.2) - s * 1.3));
      renderer.render(scene, camera);
    };
    const start = () => { if (running) return; running = true; last = performance.now(); raf = requestAnimationFrame(frame); };
    const stop = () => { running = false; cancelAnimationFrame(raf); };
    const io = new IntersectionObserver(([entry]) => (entry.isIntersecting ? start() : stop()), { threshold: 0.01 });
    io.observe(el);
    const onVis = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVis);

    return () => {
      stop(); io.disconnect(); ro.disconnect(); st.kill(); introTween.kill(); offReady(); offTheme();
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("visibilitychange", onVis);
      scene.traverse((o) => { if (o instanceof THREE.Mesh) o.geometry.dispose(); });
      [ring, bead, heart, glass, backdrop].forEach((m) => m.dispose());
      envTarget.dispose(); pmrem.dispose(); renderer.dispose(); renderer.domElement.remove();
    };
  }, []);

  return <div ref={host} aria-hidden className={`pointer-events-none [&>canvas]:!h-full [&>canvas]:!w-full ${className}`} />;
}
