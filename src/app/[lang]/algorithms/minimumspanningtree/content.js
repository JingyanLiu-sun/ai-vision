"use client";

import React, { useState } from "react";
import { useI18n } from "@/app/i18n/client";

const MinimumSpanningTreeVisualization = () => {
  const { t } = useI18n();
  const [edges] = useState([
    { u: "A", v: "B", w: 4 },
    { u: "A", v: "H", w: 8 },
    { u: "B", v: "H", w: 11 },
    { u: "B", v: "C", w: 8 },
    { u: "C", v: "D", w: 7 },
    { u: "C", v: "F", w: 4 },
    { u: "C", v: "I", w: 2 },
    { u: "D", v: "E", w: 9 },
    { u: "D", v: "F", w: 14 },
    { u: "E", v: "F", w: 10 },
    { u: "F", v: "G", w: 2 },
    { u: "G", v: "H", w: 1 },
    { u: "G", v: "I", w: 6 },
    { u: "H", v: "I", w: 7 },
  ]);
  const [picked, setPicked] = useState([]);
  const nodes = Array.from(new Set(["A","B","C","D","E","F","G","H","I"]))
  const positions = {
    A: { x: 0, y: 120 }, B: { x: 100, y: 40 }, C: { x: 200, y: 40 }, D: { x: 120, y: 180 },
    E: { x: 220, y: 180 }, F: { x: 300, y: 120 }, G: { x: 340, y: 200 }, H: { x: 260, y: 260 }, I: { x: 240, y: 80 }
  };

  const runKruskal = () => {
    const es = [...edges].sort((a, b) => a.w - b.w);
    const parent = {};
    const find = (x) => (parent[x] === x ? x : (parent[x] = find(parent[x])));
    const union = (a, b) => {
      const pa = find(a), pb = find(b);
      if (pa === pb) return false;
      parent[pa] = pb;
      return true;
    };
    const nodes = Array.from(new Set(edges.flatMap(e => [e.u, e.v])));
    nodes.forEach(n => (parent[n] = n));
    const res = [];
    for (const e of es) {
      if (union(e.u, e.v)) res.push(e);
    }
    setPicked(res);
  };

  const reset = () => setPicked([]);

  return (
    <div className="p-4">
      <div className="flex gap-2 mb-4">
        <button className="px-3 py-1 bg-blue-600 text-white rounded" onClick={runKruskal}>{t("start") || "Start"}</button>
        <button className="px-3 py-1 bg-gray-600 text-white rounded" onClick={reset}>{t("reset") || "Reset"}</button>
      </div>
      <div className="relative" style={{ width: 420, height: 320 }}>
        {edges.map((e, idx) => {
          const pu = positions[e.u], pv = positions[e.v];
          const isPicked = picked.find(pe => pe.u === e.u && pe.v === e.v && pe.w === e.w);
          return (
            <svg key={idx} className="absolute" style={{ left: 0, top: 0, width: 420, height: 320 }}>
              <line x1={pu.x} y1={pu.y} x2={pv.x} y2={pv.y} stroke={isPicked ? "#22c55e" : "#9ca3af"} strokeWidth={isPicked ? 3 : 2} />
              <text x={(pu.x+pv.x)/2} y={(pu.y+pv.y)/2} fill="#374151" fontSize="10">{e.w}</text>
            </svg>
          );
        })}
        {nodes.map(n => (
          <div key={n} className="absolute flex items-center justify-center rounded-full bg-pink-500 text-white w-6 h-6 text-xs font-bold" style={{ left: positions[n].x-12, top: positions[n].y-12 }}>{n}</div>
        ))}
      </div>
    </div>
  );
};

export default MinimumSpanningTreeVisualization;