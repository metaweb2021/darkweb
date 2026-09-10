"use client";

import { useEffect, useRef } from "react";

/**
 * Lightweight "digital rain" canvas backdrop. Purely decorative,
 * respects prefers-reduced-motion, and pauses when off-screen.
 */
export function MatrixRain({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const glyphs = "01<>[]{}#$%&*+=/\\|ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶ".split("");
    const fontSize = 14;
    let columns = 0;
    let drops: number[] = [];
    let raf = 0;
    let running = true;

    const resize = () => {
      const parent = canvas.parentElement;
      const w = parent?.clientWidth ?? window.innerWidth;
      const h = parent?.clientHeight ?? window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      columns = Math.floor(w / fontSize);
      drops = Array.from({ length: columns }, () =>
        Math.floor((Math.random() * h) / fontSize),
      );
    };
    resize();

    let last = 0;
    const draw = (t: number) => {
      if (!running) return;
      raf = requestAnimationFrame(draw);
      if (t - last < 55) return; // ~18fps, easy on the CPU
      last = t;

      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      ctx.fillStyle = "rgba(5, 7, 10, 0.28)";
      ctx.fillRect(0, 0, w, h);
      ctx.font = `${fontSize}px "JetBrains Mono", monospace`;

      for (let i = 0; i < drops.length; i++) {
        const char = glyphs[Math.floor(Math.random() * glyphs.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;
        // Leading glyph is brighter
        ctx.fillStyle =
          Math.random() > 0.975 ? "rgba(215,255,235,0.9)" : "rgba(53,255,158,0.5)";
        ctx.fillText(char, x, y);
        if (y > h && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      }
    };

    if (!reduce) raf = requestAnimationFrame(draw);
    else {
      // Static faint frame for reduced-motion users
      ctx.fillStyle = "rgba(5,7,10,1)";
      ctx.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);
    }

    const onResize = () => resize();
    window.addEventListener("resize", onResize);

    const io = new IntersectionObserver(
      ([entry]) => {
        running = entry.isIntersecting && !reduce;
        if (running) raf = requestAnimationFrame(draw);
      },
      { threshold: 0 },
    );
    io.observe(canvas);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      io.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    />
  );
}
