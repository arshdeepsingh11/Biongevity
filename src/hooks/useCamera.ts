"use client";
import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Camera backdrop for the AR view: shows the rear camera behind a 3D model so it appears in your room.
 * Video stays on the device — nothing is recorded, analysed or sent.
 */
export function useCamera() {
  const video = useRef<HTMLVideoElement>(null);
  const stream = useRef<MediaStream | null>(null);
  const [on, setOn] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [supported, setSupported] = useState(false);
  useEffect(() => { setSupported(!!navigator.mediaDevices?.getUserMedia); }, []);

  const stop = useCallback(() => { stream.current?.getTracks().forEach((t) => t.stop()); stream.current = null; setOn(false); }, []);
  const start = useCallback(async () => {
    setError(null);
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: "environment" } }, audio: false });
      stream.current = s; setOn(true);
      requestAnimationFrame(() => { if (video.current) { video.current.srcObject = s; video.current.play().catch(() => {}); } });
    } catch { setError("Camera not available — allow camera access, or try on your phone."); setOn(false); }
  }, []);
  useEffect(() => () => stop(), [stop]);
  return { video, on, error, supported, toggle: () => (on ? stop() : start()), stop };
}
