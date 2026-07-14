"use client";

import { useEffect, useRef, useState } from "react";
import type { MountedHeroScene } from "../lib/mountHeroScene";

export function HeroScene() {
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<MountedHeroScene | null>(null);
  const [released, setReleased] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    if (!host || !canvas) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const navigatorWithConnection = navigator as Navigator & {
      connection?: { saveData?: boolean };
    };
    const saveData = navigatorWithConnection.connection?.saveData === true;
    let cancelled = false;
    let timer = 0;

    const mount = async () => {
      if (reduceMotion || saveData || cancelled) {
        host.classList.add("is-static-scene");
        return;
      }

      try {
        const { mountHeroScene } = await import("../lib/mountHeroScene");
        if (cancelled) return;
        const mounted = mountHeroScene(canvas, host, () => {
          host.classList.add("is-webgl-ready");
        });
        if (cancelled) {
          mounted.dispose();
          return;
        }
        sceneRef.current = mounted;
      } catch {
        host.classList.add("is-static-scene");
      }
    };

    timer = window.setTimeout(mount, 90);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      sceneRef.current?.dispose();
      sceneRef.current = null;
    };
  }, []);

  const toggleReleased = () => {
    const next = !released;
    setReleased(next);
    sceneRef.current?.setReleased(next);
    hostRef.current?.classList.toggle("is-released", next);
  };

  return (
    <div className="hero-scene" ref={hostRef}>
      <div
        className="hero-scene-stage"
        role="img"
        aria-label="Three precision ribbons reorganise from a constrained knot into an open intelligent system."
      >
        <div className="scene-fallback" aria-hidden="true">
          <span className="fallback-ribbon fallback-ribbon-one" />
          <span className="fallback-ribbon fallback-ribbon-two" />
          <span className="fallback-ribbon fallback-ribbon-three" />
          <span className="fallback-core">JDE</span>
        </div>
        <canvas ref={canvasRef} className="sculpture-canvas" aria-hidden="true" />
      </div>
      <button
        className="sculpture-toggle"
        type="button"
        aria-pressed={released}
        onClick={toggleReleased}
      >
        <span className="toggle-pulse" aria-hidden="true" />
        {released ? "Recompress system" : "Release the system"}
        <span aria-hidden="true">{released ? "↙" : "↗"}</span>
      </button>
      <p className="sr-only" aria-live="polite">
        {released
          ? "The constraint engine is now organised into open lanes."
          : "The constraint engine is compressed into a working knot."}
      </p>
    </div>
  );
}
