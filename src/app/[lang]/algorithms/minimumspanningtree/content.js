"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useI18n } from "@/app/i18n/client";

const letters = ["A","B","C","D","E","F"];

const MinimumSpanningTreeVisualization = () => {
  const { t } = useI18n();
  const [algorithm, setAlgorithm] = useState("kruskal");
  const [manualMode, setManualMode] = useState(false);
  const [primStart, setPrimStart] = useState(null);
  const [disableEdges, setDisableEdges] = useState(new Set());
  const [edges, setEdges] = useState([
    { id: 1, u: "A", v: "B", w: 4 },
    { id: 2, u: "A", v: "C", w: 6 },
    { id: 3, u: "B", v: "C", w: 5 },
    { id: 4, u: "B", v: "D", w: 7 },
    { id: 5, u: "C", v: "E", w: 3 },
    { id: 6, u: "D", v: "E", w: 4 },
    { id: 7, u: "E", v: "F", w: 2 },
    { id: 8, u: "C", v: "F", w: 8 },
    { id: 9, u: "B", v: "E", w: 9 },
  ]);
  const [picked, setPicked] = useState([]);
  const [candidate, setCandidate] = useState(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(800);

  const nodes = useMemo(() => Array.from(new Set(edges.flatMap(e => [e.u, e.v]))), [edges]);
  const [positions, setPositions] = useState({
    A: { x: 80, y: 120 },
    B: { x: 240, y: 100 },
    C: { x: 400, y: 180 },
    D: { x: 560, y: 260 },
    E: { x: 720, y: 340 },
    F: { x: 680, y: 520 },
  });

  const kruskalSteps = useMemo(() => {
    const es = [...edges].sort((a, b) => a.w - b.w);
    const parent = {};
    const find = (x) => (parent[x] === x ? x : (parent[x] = find(parent[x])));
    const union = (a, b) => {
      const pa = find(a), pb = find(b);
      if (pa === pb) return false;
      parent[pa] = pb;
      return true;
    };
    nodes.forEach(n => (parent[n] = n));
    const res = [];
    for (const e of es) {
      const choose = union(e.u, e.v);
      res.push({ e, choose });
    }
    return res;
  }, [edges, nodes]);

  const primSteps = useMemo(() => {
    const es = [...edges].sort((a, b) => a.w - b.w);
    const visited = new Set();
    if (nodes.length === 0) return [];
    visited.add(primStart || nodes[0]);
    const res = [];
    while (res.length < nodes.length - 1) {
      const cand = es.find(e => !disableEdges.has(e.id) && ((visited.has(e.u) && !visited.has(e.v)) || (visited.has(e.v) && !visited.has(e.u))));
      if (!cand) break;
      res.push({ e: cand, choose: true });
      visited.add(visited.has(cand.u) ? cand.v : cand.u);
    }
    return res;
  }, [edges, nodes, primStart, disableEdges]);

  const steps = algorithm === "kruskal" ? kruskalSteps : primSteps;

  const totalWeight = picked.reduce((s, e) => s + e.w, 0);
  const isManualSolved = manualMode && picked.length === Math.max(0, nodes.length - 1);

  const reset = () => {
    setPicked([]);
    setCandidate(null);
    setStepIndex(0);
    setPlaying(false);
    setManualMode(false);
  };

  const stepOnce = () => {
    if (stepIndex >= steps.length) {
      setPlaying(false);
      return;
    }
    const s = steps[stepIndex];
    setCandidate(s.e.id);
    if (s.choose) setPicked(prev => [...prev, s.e]);
    setStepIndex(prev => prev + 1);
  };

  const runAll = () => {
    const res = steps.filter(s => s.choose).map(s => s.e);
    setPicked(res);
    setCandidate(null);
    setStepIndex(steps.length);
    setPlaying(false);
  };

  useEffect(() => {
    reset();
  }, [algorithm]);

  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => {
      const i = stepIndex;
      if (i >= steps.length) {
        setPlaying(false);
        clearInterval(id);
      } else {
        const s = steps[i];
        setCandidate(s.e.id);
        if (s.choose) setPicked(prev => [...prev, s.e]);
        setStepIndex(i + 1);
      }
    }, speed);
    return () => clearInterval(id);
  }, [playing, speed, stepIndex, steps]);

  const randomGraph = () => {
    const n = Math.floor(6 + Math.random() * 4);
    const ns = letters.slice(0, n);
    const makeWeight = () => Math.floor(1 + Math.random() * 14);
    const es = [];
    let id = 1;
    const perm = [...ns].sort(() => Math.random() - 0.5);
    for (let i = 1; i < perm.length; i++) {
      es.push({ id: id++, u: perm[i - 1], v: perm[i], w: makeWeight() });
    }
    for (let i = 0; i < ns.length; i++) {
      for (let j = i + 1; j < ns.length; j++) {
        if (Math.random() < 0.25) es.push({ id: id++, u: ns[i], v: ns[j], w: makeWeight() });
      }
    }
    setEdges(es);
    setPicked([]);
    setCandidate(null);
    setStepIndex(0);
    setPlaying(false);
    setDisableEdges(new Set());
    setManualMode(false);
  };

  const randomLayout = () => {
    const W = 800, H = 600;
    const margin = 40;
    const minDist = 80;
    const placed = {};
    const list = [...nodes];
    const dist2 = (a, b) => (a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y);
    for (const n of list) {
      let p = null;
      for (let t = 0; t < 500; t++) {
        const cand = {
          x: Math.floor(margin + Math.random() * (W - 2 * margin)),
          y: Math.floor(margin + Math.random() * (H - 2 * margin)),
        };
        if (Object.values(placed).every(q => dist2(cand, q) >= minDist * minDist)) { p = cand; break; }
      }
      placed[n] = p || { x: margin + (Math.random() * (W - 2 * margin)) | 0, y: margin + (Math.random() * (H - 2 * margin)) | 0 };
    }
    setPositions(placed);
  };

  return (
    <div className="p-4">
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <select className="px-2 py-1 border rounded" value={algorithm} onChange={e => setAlgorithm(e.target.value)} disabled={manualMode}>
          <option value="kruskal">{t("kruskal") || "Kruskal"}</option>
          <option value="prim">{t("prim") || "Prim"}</option>
        </select>
        {algorithm === 'prim' && (
          <select className="px-2 py-1 border rounded" value={primStart || ''} onChange={e => setPrimStart(e.target.value || null)} disabled={manualMode}>
            <option value="">{t("select_start") || "Select Start"}</option>
            {nodes.map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        )}
        <button className="px-3 py-1 bg-blue-600 text-white rounded" onClick={stepOnce} disabled={manualMode}>{t("step") || "Step"}</button>
        {!playing && <button className="px-3 py-1 bg-indigo-600 text-white rounded" onClick={() => setPlaying(true)} disabled={manualMode}>{t("auto") || "Auto"}</button>}
        {playing && <button className="px-3 py-1 bg-yellow-600 text-white rounded" onClick={() => setPlaying(false)}>{t("stop") || "Stop"}</button>}
        <button className="px-3 py-1 bg-green-600 text-white rounded" onClick={runAll} disabled={manualMode}>{t("start") || "Start"}</button>
        <button className="px-3 py-1 bg-gray-600 text-white rounded" onClick={reset}>{t("reset") || "Reset"}</button>
        <button className="px-3 py-1 bg-pink-600 text-white rounded" onClick={randomGraph}>{t("random") || "Random"}</button>
        <button className="px-3 py-1 bg-blue-500 text-white rounded" onClick={randomLayout}>{t("random_layout") || "Random Layout"}</button>
        <button className={`px-3 py-1 rounded text-white ${manualMode ? "bg-orange-600" : "bg-purple-600"}`} onClick={() => setManualMode(v => !v)}>{manualMode ? (t("manual") || "Manual") : (t("greedy") || "Greedy")}</button>
        <div className="flex items-center gap-2 ml-2">
          <span className="text-sm text-gray-700">{t("speed") || "Speed"}</span>
          <input type="range" min={200} max={2000} step={100} value={speed} onChange={e => setSpeed(Number(e.target.value))} />
        </div>
        <div className="ml-auto text-sm text-gray-700">{t("picked") || "Picked"}: {picked.length} / {Math.max(0, nodes.length - 1)} · {t("weight") || "Weight"}: {totalWeight}</div>
      </div>
      {isManualSolved && <div className="mb-2 text-green-600 font-semibold">{t("congratulations") || "Congratulations, you succeeded!"}</div>}
      <div className="flex gap-4">
        <div className="relative" style={{ width: 1200, height: 800 }}>
          <svg className="absolute" style={{ left: 0, top: 0, width: 1200, height: 800 }}>
            {edges.map((e) => {
              const pu = positions[e.u], pv = positions[e.v];
              const isPicked = picked.find(pe => pe.id === e.id);
              const isCandidate = candidate === e.id;
              const disabled = disableEdges.has(e.id);
              const stroke = disabled ? "#e5e7eb" : isPicked ? "#22c55e" : isCandidate ? "#f59e0b" : "#9ca3af";
              const width = (isPicked || isCandidate) ? 6 : 4;
              return (
                <g key={e.id} style={{ cursor: 'pointer' }}>
                  <line x1={pu.x} y1={pu.y} x2={pv.x} y2={pv.y} stroke={stroke} strokeWidth={width}
                        style={{ pointerEvents: 'stroke' }}
                        onClick={() => {
                          if (manualMode) {
                            if (isPicked) { setPicked(prev => prev.filter(pe => pe.id !== e.id)); return; }
                            const parent = {};
                            nodes.forEach(n => (parent[n] = n));
                            const find = (x) => (parent[x] === x ? x : (parent[x] = find(parent[x])));
                            const union = (a, b) => { const pa = find(a), pb = find(b); if (pa === pb) return false; parent[pa] = pb; return true; };
                            for (const ce of picked) union(ce.u, ce.v);
                            if (!union(e.u, e.v)) { alert(t("manual_cycle") || "Adding this edge would create a cycle. MST must be acyclic."); return; }
                            setPicked(prev => [...prev, e]);
                          } else {
                            setDisableEdges(prev => new Set(prev.has(e.id) ? [...[...prev].filter(id => id !== e.id)] : [...prev, e.id]));
                          }
                        }} />
                  <text x={(pu.x+pv.x)/2} y={(pu.y+pv.y)/2} fill="#374151" fontSize="14">{e.w}</text>
                </g>
              );
            })}
          </svg>
          {nodes.map(n => (
            <div key={n} className="absolute flex items-center justify-center rounded-full bg-pink-500 text-white w-10 h-10 text-sm font-bold"
                 style={{ left: positions[n].x-20, top: positions[n].y-20, cursor: 'grab' }}
                 onMouseDown={e => {
                   const sx = e.clientX, sy = e.clientY;
                   const baseX = positions[n].x, baseY = positions[n].y;
                   const mv = me => setPositions(p => ({...p, [n]: { x: Math.min(1180, Math.max(0, baseX + (me.clientX - sx))), y: Math.min(780, Math.max(20, baseY + (me.clientY - sy))) } }));
                   const up = () => { window.removeEventListener('mousemove', mv); window.removeEventListener('mouseup', up); };
                   window.addEventListener('mousemove', mv);
                   window.addEventListener('mouseup', up);
                 }}>{n}</div>
          ))}
        </div>
        <div className="w-64">
          <div className="text-sm font-semibold mb-2">{t("edge_list") || "Edges by weight"}</div>
          <div className="flex flex-col gap-2">
            {[...edges].sort((a,b)=>a.w-b.w).map(e => {
              const isPicked = picked.find(pe => pe.id === e.id);
              const disabled = disableEdges.has(e.id);
              return (
                <button key={e.id} className={`text-left px-2 py-1 rounded border ${isPicked ? 'border-green-500 bg-green-50' : disabled ? 'border-gray-300 bg-gray-50 text-gray-400' : 'border-gray-300 bg-white'}`}
                        onClick={() => {
                          if (manualMode) {
                            if (isPicked) { setPicked(prev => prev.filter(pe => pe.id !== e.id)); return; }
                            const parent = {}; nodes.forEach(n => (parent[n] = n));
                            const find = (x) => (parent[x] === x ? x : (parent[x] = find(parent[x])));
                            const union = (a, b) => { const pa = find(a), pb = find(b); if (pa === pb) return false; parent[pa] = pb; return true; };
                            for (const ce of picked) union(ce.u, ce.v);
                            if (!union(e.u, e.v)) { alert(t("manual_cycle") || "Adding this edge would create a cycle. MST must be acyclic."); return; }
                            setPicked(prev => [...prev, e]);
                          } else {
                            setDisableEdges(prev => new Set(prev.has(e.id) ? [...[...prev].filter(id => id !== e.id)] : [...prev, e.id]));
                          }
                        }}>
                  {e.u}-{e.v} · {e.w}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MinimumSpanningTreeVisualization;
