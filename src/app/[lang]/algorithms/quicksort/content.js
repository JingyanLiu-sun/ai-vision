"use client";
import React, { useEffect, useRef, useState } from "react";

export default function PlaceholderVisualization({ lang }) {
  const canvasRef = useRef(null);
  const [running, setRunning] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let raf;
    let t = 0;
    const draw = () => {
      const { width: w, height: h } = canvas;
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < 40; i++) {
        const x = (i / 40) * w;
        const y = h / 2 + Math.cos((t + i * 12) / 20) * (h / 4);
        ctx.fillStyle = `hsl(${(i * 11 + t) % 360},70%,60%)`;
        ctx.fillRect(x, y, 12, 12);
      }
      t += 1;
      raf = requestAnimationFrame(draw);
    };
    if (running) raf = requestAnimationFrame(draw);
    return () => { if (raf) cancelAnimationFrame(raf); };
  }, [running]);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <div className="text-gray-600">{lang === 'zh' ? '占位演示：页面开发中' : 'Placeholder Demo: Page under construction'}</div>
        <button onClick={() => setRunning(r => !r)} className="px-3 py-1 rounded bg-blue-600 text-white">
          {running ? (lang === 'zh' ? '暂停' : 'Pause') : (lang === 'zh' ? '开始' : 'Start')}
        </button>
      </div>
      <div className="border rounded-md overflow-hidden">
        <canvas ref={canvasRef} width={640} height={360} className="w-full h-auto" />
      </div>
    </div>
  );
}

