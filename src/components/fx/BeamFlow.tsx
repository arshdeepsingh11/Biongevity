"use client";
import { useEffect, useRef } from "react";
import { onThemeChange, themeRgb } from "@/lib/theme";

const VERT = `attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}`;

// Laser flow: a beam in the theme's AI colours (ai · ai-hi · ai-2 · gold) with fbm fog turbulence, cursor tilt and micro-wisp streaks.
const FRAG = `precision highp float;
uniform vec2 r;uniform float t;uniform vec2 m;uniform vec3 ca;uniform vec3 cb;uniform vec3 cc;uniform vec3 cd;
float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
  return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}
float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<5;i++){v+=a*n(p);p*=2.03;a*=.5;}return v;}
vec3 iri(float x){
  vec3 a=ca,b=cb,c=cc,d=cd;
  x=fract(x);return x<.33?mix(a,b,x/.33):x<.66?mix(b,c,(x-.33)/.33):mix(c,d,(x-.66)/.34);}
void main(){
  vec2 uv=gl_FragCoord.xy/r;vec2 q=uv-.5;q.x*=r.x/r.y;
  float tilt=(m.x-.5)*.9;
  float cx=tilt*(1.-uv.y)+.0;
  float fog=fbm(vec2(q.x*2.,uv.y*3.-t*.25)+fbm(q*3.+t*.08));
  float d=abs(q.x-cx-(fog-.5)*.18*(1.-uv.y));
  float core=exp(-d*d*900.);
  float glow=exp(-d*14.)*.55;
  float wisp=pow(n(vec2(q.x*40.,uv.y*6.-t*3.)),18.)*exp(-d*6.)*2.;
  float spread=smoothstep(1.1,.0,uv.y);
  float haze=fog*exp(-d*3.)*.35*spread;
  vec3 col=iri(uv.y*.7+t*.03+fog*.2);
  float a=clamp((core*1.2+glow+wisp+haze)*(.35+.65*spread),0.,1.);
  // pool of light where beam meets the floor
  float pool=exp(-length(vec2(q.x-cx,(uv.y-.02)*3.))*5.)*.5;
  a=clamp(a+pool,0.,1.);
  gl_FragColor=vec4(mix(col,vec3(1.),core*.6)*a,a);
}`;

/** Beam Flow — WebGL laser flow shader. Transparent canvas, sits over light or dark backgrounds. */
export function BeamFlow({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current!;
    const gl = c.getContext("webgl", { premultipliedAlpha: true, antialias: false, alpha: true });
    if (!gl) return;
    const sh = (type: number, src: string) => { const s = gl.createShader(type)!; gl.shaderSource(s, src); gl.compileShader(s); return s; };
    const pr = gl.createProgram()!;
    gl.attachShader(pr, sh(gl.VERTEX_SHADER, VERT)); gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, FRAG)); gl.linkProgram(pr); gl.useProgram(pr);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(pr, "p"); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const uR = gl.getUniformLocation(pr, "r"), uT = gl.getUniformLocation(pr, "t"), uM = gl.getUniformLocation(pr, "m");
    const uC = ["ca", "cb", "cc", "cd"].map((n) => gl.getUniformLocation(pr, n));
    const setColors = () => ["ai", "ai-hi", "ai-2", "gold"].forEach((tok, i) => { const [r, g, b] = themeRgb(tok); gl.uniform3f(uC[i], r / 255, g / 255, b / 255); });
    setColors();
    const offTheme = onThemeChange(setColors);
    const mouse = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 };
    const onMove = (x: number, y: number) => { const b = c.getBoundingClientRect(); mouse.tx = (x - b.left) / b.width; mouse.ty = 1 - (y - b.top) / b.height; };
    const mm = (e: PointerEvent) => onMove(e.clientX, e.clientY);
    addEventListener("pointermove", mm, { passive: true });
    const dpr = Math.min(innerWidth < 768 ? 1 : 1.5, devicePixelRatio);
    const resize = () => { c.width = c.clientWidth * dpr; c.height = c.clientHeight * dpr; gl.viewport(0, 0, c.width, c.height); };
    resize(); addEventListener("resize", resize);
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0, visible = true; const t0 = performance.now();
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting)); io.observe(c);
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (!visible) return;
      mouse.x += (mouse.tx - mouse.x) * 0.05; mouse.y += (mouse.ty - mouse.y) * 0.05;
      gl.uniform2f(uR, c.width, c.height); gl.uniform1f(uT, reduced ? 4 : (now - t0) / 1000); gl.uniform2f(uM, mouse.x, mouse.y);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); offTheme(); io.disconnect(); removeEventListener("pointermove", mm); removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={ref} aria-hidden data-ai-fx className={`pointer-events-none h-full w-full ${className ?? ""}`} />;
}
