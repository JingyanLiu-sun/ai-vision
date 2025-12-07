"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import { useI18n } from "@/app/i18n/client";

export default function FloydWarshallVisualization({ lang }) {
  const { t } = useI18n();

  // Canvas config
  const CANVAS_WIDTH = 800; // Wider to fit both Graph and Matrix
  const CANVAS_HEIGHT = 400;
  const GRAPH_CENTER_X = 200;
  const GRAPH_CENTER_Y = 200;
  const GRAPH_RADIUS = 120;
  const NODE_RADIUS = 18;

  const [size, setSize] = useState(5);
  const [density, setDensity] = useState(40);
  const [adj, setAdj] = useState([]);
  const [dist, setDist] = useState([]);
  const [running, setRunning] = useState(false);
  const [status, setStatus] = useState("idle");
  const [speedMs, setSpeedMs] = useState(500);
  const [updates, setUpdates] = useState(0);
  const [indices, setIndices] = useState({ i: -1, j: -1, k: -1 });
  const [lastUpdated, setLastUpdated] = useState([-1, -1]);
  const [stepInfo, setStepInfo] = useState("");
  const [selectedEdge, setSelectedEdge] = useState(null); // {u, v}
  const [nodePositions, setNodePositions] = useState([]);

  const canvasRef = useRef(null);
  const iRef = useRef(0);
  const jRef = useRef(0);
  const kRef = useRef(0);
  const intervalRef = useRef(null);

  const INF = Infinity;

  // Generate graph and positions
  const generateGraph = useCallback(() => {
    const n = size;
    const p = density / 100;
    const a = Array.from({ length: n }, () => Array.from({ length: n }, () => INF));
    
    // Generate positions in a circle
    const positions = [];
    for (let i = 0; i < n; i++) {
      const angle = (2 * Math.PI * i) / n - Math.PI / 2; // Start from top
      positions.push({
        x: GRAPH_CENTER_X + GRAPH_RADIUS * Math.cos(angle),
        y: GRAPH_CENTER_Y + GRAPH_RADIUS * Math.sin(angle)
      });
    }
    setNodePositions(positions);

    // Generate edges
    for (let i = 0; i < n; i++) {
      a[i][i] = 0;
      for (let j = 0; j < n; j++) {
        if (i !== j) {
          if (Math.random() < p) {
            a[i][j] = 1 + Math.floor(Math.random() * 9);
          }
        }
      }
    }
    
    // Ensure connectivity (simple ring to avoid isolated nodes for better visuals)
    for (let i = 0; i < n; i++) {
        const next = (i + 1) % n;
        if (a[i][next] === INF) {
             a[i][next] = 1 + Math.floor(Math.random() * 9);
        }
    }

    setAdj(a);
    setDist(a.map(row => row.slice()));
    setStatus("idle");
    setRunning(false);
    setUpdates(0);
    iRef.current = 0;
    jRef.current = 0;
    kRef.current = 0;
    setIndices({ i: -1, j: -1, k: -1 });
    setLastUpdated([-1, -1]);
    setStepInfo("");
    setSelectedEdge(null);
  }, [size, density]);

  useEffect(() => {
    generateGraph();
  }, [generateGraph]);

  const step = useCallback(() => {
    if (status === "done") return false;
    const n = dist.length;
    if (n === 0) return false;
    let i = iRef.current;
    let j = jRef.current;
    let k = kRef.current;
    setIndices({ i, j, k });

    const dij = dist[i][j];
    const dik = dist[i][k];
    const dkj = dist[k][j];
    let info = `${t("compare") || "比较"}: d[${i},${j}] vs d[${i},${k}] + d[${k},${j}]`;
    setStepInfo(info);

    if (Number.isFinite(dik) && Number.isFinite(dkj) && (dik + dkj < dij)) {
      const nd = dist.map(r => r.slice());
      nd[i][j] = dik + dkj;
      setDist(nd);
      setUpdates(u => u + 1);
      setLastUpdated([i, j]);
    } else {
      setLastUpdated([-1, -1]);
    }

    j++;
    if (j >= n) { j = 0; i++; }
    if (i >= n) { i = 0; k++; }
    if (k >= n) {
      setStatus("done");
      setRunning(false);
      setStepInfo(t("sorted") || "完成");
      return false;
    }
    iRef.current = i;
    jRef.current = j;
    kRef.current = k;
    return true;
  }, [dist, status, t]);

  useEffect(() => {
    if (!running) return;
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => { step(); }, speedMs);
    return () => { if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; } };
  }, [running, speedMs, step]);

  const togglePlay = () => {
    if (running) {
      setRunning(false);
      setStatus("paused");
      if (intervalRef.current) clearInterval(intervalRef.current);
    } else {
      if (status === "done") {
        generateGraph();
        setStatus("running");
        setRunning(true);
      } else {
        setRunning(true);
        setStatus("running");
      }
    }
  };

  // Helper to draw arrow
  const drawArrow = (ctx, fromX, fromY, toX, toY, color, width = 1) => {
    const headlen = 8;
    const dx = toX - fromX;
    const dy = toY - fromY;
    const angle = Math.atan2(dy, dx);
    
    // Shorten line to not overlap with node circles
    const dist = Math.sqrt(dx * dx + dy * dy);
    const stopDist = dist - NODE_RADIUS - 2;
    const startDist = NODE_RADIUS + 2;
    
    if (dist <= NODE_RADIUS * 2) return; // Too close

    const startX = fromX + Math.cos(angle) * startDist;
    const startY = fromY + Math.sin(angle) * startDist;
    const endX = fromX + Math.cos(angle) * stopDist;
    const endY = fromY + Math.sin(angle) * stopDist;

    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.stroke();

    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(endX, endY);
    ctx.lineTo(endX - headlen * Math.cos(angle - Math.PI / 6), endY - headlen * Math.sin(angle - Math.PI / 6));
    ctx.lineTo(endX - headlen * Math.cos(angle + Math.PI / 6), endY - headlen * Math.sin(angle + Math.PI / 6));
    ctx.closePath();
    ctx.fill();
  };

  // Helper to get distance from point to line segment
  const distToSegment = (p, v, w) => {
    const l2 = (w.x - v.x) ** 2 + (w.y - v.y) ** 2;
    if (l2 === 0) return Math.hypot(p.x - v.x, p.y - v.y);
    let t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;
    t = Math.max(0, Math.min(1, t));
    return Math.hypot(p.x - (v.x + t * (w.x - v.x)), p.y - (v.y + t * (w.y - v.y)));
  };

  const handleCanvasClick = (e) => {
    if (!canvasRef.current || running) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (CANVAS_WIDTH / rect.width);
    const y = (e.clientY - rect.top) * (CANVAS_HEIGHT / rect.height);

    // Check edges
    let clickedEdge = null;
    const n = size;
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            if (i !== j && adj[i][j] !== INF) {
                const p1 = nodePositions[i];
                const p2 = nodePositions[j];
                const d = distToSegment({x, y}, p1, p2);
                if (d < 10) { // Hit threshold
                    clickedEdge = { u: i, v: j };
                }
            }
        }
    }

    if (clickedEdge) {
        setSelectedEdge(clickedEdge);
    } else {
        setSelectedEdge(null);
    }
  };

  // Draw function
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || nodePositions.length !== size) return;
    const ctx = canvas.getContext("2d");
    const { width, height } = canvas;
    ctx.clearRect(0, 0, width, height);

    // 1. Draw Graph (Left Side)
    // Draw edges
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            if (i !== j && adj[i][j] !== INF) {
                const p1 = nodePositions[i];
                const p2 = nodePositions[j];
                
                let color = "#cbd5e1"; // default gray
                let width = 1;
                
                // Highlight active path parts if relevant
                const isIK = indices.i === i && indices.k === j;
                const isKJ = indices.k === i && indices.j === j;
                const isTarget = indices.i === i && indices.j === j;
                
                if (isIK || isKJ) {
                    color = "#f59e0b"; // amber for component paths
                    width = 2;
                }
                
                if (selectedEdge && selectedEdge.u === i && selectedEdge.v === j) {
                    color = "#2563eb"; // blue for selected
                    width = 3;
                }

                drawArrow(ctx, p1.x, p1.y, p2.x, p2.y, color, width);
                
                // Draw weight text
                const mx = (p1.x + p2.x) / 2;
                const my = (p1.y + p2.y) / 2;
                
                // Offset text slightly to avoid overlapping with line
                const dx = p2.x - p1.x;
                const dy = p2.y - p1.y;
                const len = Math.sqrt(dx*dx + dy*dy);
                const ox = -dy / len * 10;
                const oy = dx / len * 10;

                ctx.fillStyle = "#475569";
                ctx.font = "12px sans-serif";
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillText(adj[i][j], mx + ox, my + oy);
            }
        }
    }

    // Draw Nodes
    for (let i = 0; i < size; i++) {
        const p = nodePositions[i];
        ctx.beginPath();
        ctx.arc(p.x, p.y, NODE_RADIUS, 0, 2 * Math.PI);
        
        let fillColor = "#ffffff";
        let strokeColor = "#64748b";
        let lineWidth = 2;

        if (indices.k === i) {
            fillColor = "#fce7f3"; // pink for k
            strokeColor = "#ec4899";
        } else if (indices.i === i) {
            fillColor = "#ede9fe"; // purple for i
            strokeColor = "#8b5cf6";
        } else if (indices.j === i) {
            fillColor = "#ede9fe"; // purple for j
            strokeColor = "#8b5cf6";
        }

        ctx.fillStyle = fillColor;
        ctx.fill();
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = lineWidth;
        ctx.stroke();

        ctx.fillStyle = "#1e293b";
        ctx.font = "bold 14px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(i, p.x, p.y);
    }

    // 2. Draw Matrix (Right Side)
    // Matrix area: x from 400 to 780, y centered
    const matrixX = 420;
    const matrixY = 40;
    const matrixW = 340;
    const matrixH = 320;
    
    // Compute layout for matrix cells
    const gap = 4;
    const cw = Math.min((matrixW - gap * (size - 1)) / size, (matrixH - gap * (size - 1)) / size);
    const totalW = cw * size + gap * (size - 1);
    const totalH = cw * size + gap * (size - 1);
    const startX = matrixX + (matrixW - totalW) / 2;
    const startY = matrixY + (matrixH - totalH) / 2;

    // Draw Matrix Background/Highlight
    if (indices.k !== -1) {
        const k = indices.k;
        const yRow = startY + k * (cw + gap) - 2;
        const xCol = startX + k * (cw + gap) - 2;
        ctx.fillStyle = "rgba(244, 114, 182, 0.1)";
        ctx.fillRect(startX - 4, yRow, totalW + 8, cw + 4); // Row k
        ctx.fillRect(xCol, startY - 4, cw + 4, totalH + 8); // Col k
    }

    // Draw Cells
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            const x = startX + j * (cw + gap);
            const y = startY + i * (cw + gap);
            
            let colorStart, colorEnd, borderColor;
            const isUpdated = lastUpdated[0] === i && lastUpdated[1] === j;
            const isTarget = indices.i === i && indices.j === j;
            const isIK = indices.i === i && indices.k === j;
            const isKJ = indices.k === i && indices.j === j;

            if (isUpdated) {
                colorStart = "#6ee7b7"; colorEnd = "#34d399"; borderColor = "#059669";
            } else if (isTarget) {
                colorStart = "#c4b5fd"; colorEnd = "#a78bfa"; borderColor = "#7c3aed";
            } else if (isIK || isKJ) {
                colorStart = "#fcd34d"; colorEnd = "#fbbf24"; borderColor = "#d97706";
            } else if (indices.k === i || indices.k === j) {
                colorStart = "#f472b6"; colorEnd = "#e879f9"; borderColor = "#c026d3";
            } else {
                colorStart = "#f1f5f9"; colorEnd = "#e2e8f0"; borderColor = "#cbd5e1";
            }

            const gradient = ctx.createLinearGradient(x, y, x, y + cw);
            gradient.addColorStop(0, colorStart);
            gradient.addColorStop(1, colorEnd);
            ctx.fillStyle = gradient;
            ctx.strokeStyle = borderColor;
            ctx.lineWidth = 1;

            // Rounded rect for cell
            const r = 4;
            ctx.beginPath();
            ctx.roundRect(x, y, cw, cw, r);
            ctx.fill();
            ctx.stroke();

            const val = dist[i][j];
            ctx.fillStyle = "#1e293b";
            ctx.font = `${Math.max(10, cw/3)}px sans-serif`;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(Number.isFinite(val) ? String(val) : "∞", x + cw / 2, y + cw / 2);
        }
    }
    
    // Draw Matrix Labels (Row/Col indices)
    ctx.fillStyle = "#64748b";
    ctx.font = "12px sans-serif";
    for(let i=0; i<size; i++) {
        // Row labels
        const y = startY + i * (cw + gap) + cw/2;
        ctx.fillText(i, startX - 12, y);
        // Col labels
        const x = startX + i * (cw + gap) + cw/2;
        ctx.fillText(i, x, startY - 16);
    }
    ctx.fillText("Matrix D", startX + totalW/2, startY + totalH + 20);
    ctx.fillText("Graph G", GRAPH_CENTER_X, GRAPH_CENTER_Y + GRAPH_RADIUS + 30);

  }, [dist, adj, indices, lastUpdated, nodePositions, selectedEdge, size]);

  return (
    <div className="w-full flex flex-col md:flex-row gap-8 font-sans">
      <div className="w-full md:w-2/3">
        <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-200 relative">
          <div className="absolute top-3 left-4 right-4 flex flex-wrap items-center justify-between text-xs md:text-sm text-gray-700 pointer-events-none">
            <div>
              {(t("current_action") || "当前操作")}: {stepInfo || (status === "idle" ? (t("ready") || "就绪") : "")}
            </div>
            <div className="flex gap-4">
              <span>k: {indices.k !== -1 ? indices.k : "-"}</span>
              <span>i: {indices.i !== -1 ? indices.i : "-"}</span>
              <span>j: {indices.j !== -1 ? indices.j : "-"}</span>
            </div>
          </div>
          <canvas 
            ref={canvasRef} 
            width={CANVAS_WIDTH} 
            height={CANVAS_HEIGHT} 
            onClick={handleCanvasClick}
            className="w-full h-auto border border-gray-100 rounded-lg bg-slate-50 cursor-pointer" 
          />
           {selectedEdge && !running && (
             <div className="absolute bottom-4 left-4 bg-white/90 p-2 rounded border border-blue-200 shadow text-sm">
                Selected Edge: {selectedEdge.u} → {selectedEdge.v} (Weight: {adj[selectedEdge.u][selectedEdge.v]})
             </div>
           )}
        </div>
      </div>
      <div className="w-full md:w-1/3 flex flex-col gap-6">
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
             {status === "done" && <span className="text-green-500">✓</span>}
             {status === "running" && <span className="text-blue-500 animate-spin">↻</span>}
             <span>{t("status") || "状态"}: <span className="capitalize">{status === "idle" ? "Ready" : status}</span></span>
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="text-xs text-gray-500 uppercase font-bold">{t("updates") || "更新"}</div>
              <div className="text-2xl font-bold text-green-600">{updates}</div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
               <div className="text-xs text-gray-500 uppercase font-bold">{t("size") || "规模"}</div>
               <div className="text-2xl font-bold text-indigo-600">{size}</div>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 flex flex-col gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t("speed") || "速度"}: {speedMs}ms</label>
            <input type="range" min="50" max="1000" step="50" value={speedMs} onChange={(e) => setSpeedMs(parseInt(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600" />
            <div className="flex justify-between text-xs text-gray-400 mt-1"><span>Fast</span><span>Slow</span></div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t("nodes") || "节点"}: {size}</label>
            <input type="range" min="3" max="8" step="1" value={size} onChange={(e) => { setSize(parseInt(e.target.value)); setRunning(false); setStatus("idle"); }} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
            <div className="flex justify-between text-xs text-gray-400 mt-1"><span>Few</span><span>Many</span></div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t("density") || "密度"}: {density}%</label>
            <input type="range" min="0" max="100" step="5" value={density} onChange={(e) => { setDensity(parseInt(e.target.value)); }} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-pink-600" />
            <div className="flex justify-between text-xs text-gray-400 mt-1"><span>Sparse</span><span>Dense</span></div>
          </div>
          <button onClick={() => { generateGraph(); }} className="w-full py-2 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors" disabled={running}>{t("generate_new_array") || "重新生成图"} 🎲</button>
        </div>
        <div className="flex gap-3">
          <button onClick={togglePlay} className={`flex-1 py-3 rounded-xl font-bold text-white shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2 ${running ? "bg-amber-500 hover:bg-amber-600" : "bg-blue-600 hover:bg-blue-700"}`}>
            {running ? (<><span>⏸</span> {t("pause") || "暂停"}</>) : (<><span>▶</span> {t("start") || "开始"}</>)}
          </button>
          <button onClick={() => step()} disabled={running || status === "done"} className="px-6 py-3 rounded-xl font-bold bg-indigo-100 text-indigo-700 hover:bg-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-colors">{t("step") || "单步"} ⏭</button>
          <button onClick={() => generateGraph()} className="px-6 py-3 rounded-xl font-bold bg-gray-100 text-gray-700 hover:bg-gray-200 shadow-sm transition-colors">{t("reset") || "重置"} ↺</button>
        </div>
      </div>
    </div>
  );
}
