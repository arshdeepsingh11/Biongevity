"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";

export type PlanetType = "bio" | "ocean" | "ice";

const PLANET_VERT = `varying vec3 vN;varying vec3 vP;varying vec3 vW;
void main(){vN=normalize(normalMatrix*normal);vP=position;vW=(modelMatrix*vec4(position,1.)).xyz;gl_Position=projectionMatrix*viewMatrix*vec4(vW,1.);}`;

const PLANET_FRAG = `precision highp float;varying vec3 vN;varying vec3 vP;varying vec3 vW;
uniform vec3 uLight;uniform float uT;uniform vec3 cA;uniform vec3 cB;uniform vec3 cC;
float h(vec3 p){return fract(sin(dot(p,vec3(127.1,311.7,74.7)))*43758.5453);}
float n(vec3 p){vec3 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
 return mix(mix(mix(h(i),h(i+vec3(1,0,0)),f.x),mix(h(i+vec3(0,1,0)),h(i+vec3(1,1,0)),f.x),f.y),
 mix(mix(h(i+vec3(0,0,1)),h(i+vec3(1,0,1)),f.x),mix(h(i+vec3(0,1,1)),h(i+vec3(1,1,1)),f.x),f.y),f.z);}
float fbm(vec3 p){float v=0.,a=.5;for(int i=0;i<5;i++){v+=a*n(p);p*=2.1;a*=.5;}return v;}
void main(){
 vec3 p=vP*1.6;float f=fbm(p+vec3(uT*.02,0.,0.));float bands=sin(vP.y*7.+f*5.)*.5+.5;
 vec3 col=mix(cA,cB,smoothstep(.35,.65,f));col=mix(col,cC,bands*.35);
 vec3 N=normalize(vN);vec3 L=normalize(uLight);float d=max(dot(N,L),0.);
 vec3 V=normalize(cameraPosition-vW);vec3 H=normalize(L+V);float spec=pow(max(dot(N,H),0.),48.)*.6;
 float rim=pow(1.-max(dot(N,V),0.),3.);
 vec3 lit=col*(.25+.9*d)+spec+rim*vec3(.6,.5,1.)*.5;
 gl_FragColor=vec4(lit,1.);}`;

const ATMO_FRAG = `precision highp float;varying vec3 vN;varying vec3 vW;uniform vec3 uLight;
void main(){vec3 V=normalize(cameraPosition-vW);float r=pow(1.-abs(dot(normalize(vN),V)),2.6);
 float lit=.45+.55*max(dot(normalize(vN),normalize(uLight)),0.);
 gl_FragColor=vec4(mix(vec3(1.,.55,.75),vec3(.45,.55,1.),r)*lit,r*.95);}`;

const PALETTES: Record<PlanetType, [string, string, string]> = {
  bio: ["#9B6BFF", "#3D8BFF", "#FF8A3D"],
  ocean: ["#1E5BFF", "#62D0FF", "#FFFFFF"],
  ice: ["#DCE6FF", "#9FB6FF", "#FFFFFF"],
};

/**
 * Planet System — procedural planet with atmosphere, specular highlights and
 * orbiting moons. The light follows the cursor / touch. Moons carry HTML labels.
 */
export function PlanetSystem({ moons, type = "bio", className }: { moons: string[]; type?: PlanetType; className?: string }) {
  const host = useRef<HTMLDivElement>(null);
  const labels = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const el = host.current!;
    let renderer: THREE.WebGLRenderer;
    try { renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "low-power" }); }
    catch { el.dataset.nogl = "1"; return; } // no WebGL: keep the static fallback
    renderer.setPixelRatio(Math.min(innerWidth < 768 ? 1.5 : 2, devicePixelRatio));
    el.appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.set(0, 1.2, 7.2); camera.lookAt(0, 0, 0);

    const pal = PALETTES[type].map((c) => new THREE.Color(c));
    const uniforms = { uLight: { value: new THREE.Vector3(3, 2, 4) }, uT: { value: 0 }, cA: { value: pal[0] }, cB: { value: pal[1] }, cC: { value: pal[2] } };
    const planet = new THREE.Mesh(new THREE.SphereGeometry(1.5, 96, 96), new THREE.ShaderMaterial({ vertexShader: PLANET_VERT, fragmentShader: PLANET_FRAG, uniforms }));
    scene.add(planet);
    const atmo = new THREE.Mesh(new THREE.SphereGeometry(1.72, 64, 64), new THREE.ShaderMaterial({
      vertexShader: PLANET_VERT, fragmentShader: ATMO_FRAG, uniforms: { uLight: uniforms.uLight },
      transparent: true, side: THREE.BackSide, blending: THREE.NormalBlending, depthWrite: false,
    }));
    scene.add(atmo);

    // Orbit rings + moons
    const moonObjs = moons.map((_, i) => {
      const radius = 2.4 + i * 0.42, incl = (i - moons.length / 2) * 0.12;
      const ring = new THREE.Mesh(new THREE.TorusGeometry(radius, 0.004, 8, 160), new THREE.MeshBasicMaterial({ color: 0x9b6bff, transparent: true, opacity: 0.25 }));
      ring.rotation.x = Math.PI / 2 + incl; scene.add(ring);
      const m = new THREE.Mesh(new THREE.SphereGeometry(0.13 + (i % 2) * 0.04, 32, 32), new THREE.MeshStandardMaterial({ color: [0xff8a3d, 0xff4d8d, 0x3d8bff, 0x6a5cff][i % 4], roughness: 0.35, metalness: 0.1 }));
      scene.add(m);
      return { m, radius, incl, speed: 0.35 / (1 + i * 0.4), phase: (i / moons.length) * Math.PI * 2 };
    });
    scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    const sun = new THREE.DirectionalLight(0xffffff, 2.2); scene.add(sun);

    const target = new THREE.Vector3(3, 2, 4);
    const onMove = (x: number, y: number) => { const r = el.getBoundingClientRect(); target.set(((x - r.left) / r.width - 0.5) * 10, -((y - r.top) / r.height - 0.5) * 8, 4); };
    const pm = (e: PointerEvent) => onMove(e.clientX, e.clientY);
    el.addEventListener("pointermove", pm);

    const resize = () => { const w = el.clientWidth, h = el.clientHeight; renderer.setSize(w, h, false); renderer.domElement.style.width = "100%"; renderer.domElement.style.height = "100%"; camera.aspect = w / h; camera.updateProjectionMatrix(); };
    resize(); const ro = new ResizeObserver(resize); ro.observe(el);

    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0, visible = true; const t0 = performance.now(); const v = new THREE.Vector3();
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting)); io.observe(el);
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (!visible) return;
      const t = reduced ? 0 : (now - t0) / 1000;
      uniforms.uT.value = t; uniforms.uLight.value.lerp(target, 0.05); sun.position.copy(uniforms.uLight.value);
      planet.rotation.y = t * 0.12;
      moonObjs.forEach((o, i) => {
        const a = o.phase + t * o.speed;
        o.m.position.set(Math.cos(a) * o.radius, Math.sin(a) * o.radius * Math.sin(o.incl), Math.sin(a) * o.radius);
        const lab = labels.current[i];
        if (lab) {
          v.copy(o.m.position).project(camera);
          lab.style.transform = `translate(-50%,-140%) translate(${(v.x * 0.5 + 0.5) * el.clientWidth}px,${(-v.y * 0.5 + 0.5) * el.clientHeight}px)`;
          lab.style.opacity = o.m.position.z < -0.4 ? "0.35" : "1";
        }
      });
      renderer.render(scene, camera);
    };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); el.removeEventListener("pointermove", pm); renderer.dispose(); el.removeChild(renderer.domElement); };
  }, [moons, type]);

  return (
    <div ref={host} className={`relative aspect-square w-full touch-none ${className ?? ""}`}>
      {moons.map((m, i) => (
        <span key={m} ref={(n) => { labels.current[i] = n; }} className="pointer-events-none absolute left-0 top-0 z-10 whitespace-nowrap rounded-full bg-white/90 px-2.5 py-1 text-[12px] font-semibold text-ink shadow-card ring-1 ring-black/5 backdrop-blur">
          {m}
        </span>
      ))}
    </div>
  );
}
