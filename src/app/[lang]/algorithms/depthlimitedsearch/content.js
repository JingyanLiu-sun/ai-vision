"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import { useI18n } from "@/app/i18n/client";

// Default Graph Data
const DEFAULT_NODES = [
  { id: "A", x: 320, y: 50 },
  { id: "B", x: 160, y: 150 },
  { id: "C", x: 480, y: 150 },
  { id: "D", x: 80, y: 250 },
  { id: "E", x: 240, y: 250 },
  { id: "F", x: 400, y: 250 },
  { id: "G", x: 560, y: 250 },
];

const DEFAULT_EDGES = [
  { from: "A", to: "B" },
  { from: "A", to: "C" },
  { from: "B", to: "D" },
  { from: "B", to: "E" },
  { from: "C", to: "F" },
  { from: "C", to: "G" },
];

export default function DepthLimitedSearchVisualization({ lang }) {
  const { t } = useI18n();

  // Configuration
  const [limit, setLimit] = useState(2);
  const [speedMs, setSpeedMs] = useState(500);
  const [targetNode, setTargetNode] = useState("G");

  // State
  const [visited, setVisited] = useState([]); // Order of visited nodes
  const [path, setPath] = useState([]); // Current recursion stack (path from root)
  const [current, setCurrent] = useState(null); // Current node being visited
  const [running, setRunning] = useState(false);
  const [status, setStatus] = useState("idle"); // idle, running, paused, success, failed
  const [found, setFound] = useState(false);

  // DFS Stack Ref for iterative step execution
  // Frame: { node: string, depth: number, parent: string | null, index: number }
  // index tracks which child to visit next
  const stackRef = useRef([]);

  // Canvas
  const canvasRef = useRef(null);

  // Initialization
  useEffect(() => {
    reset();
  }, []);

  const getNeighbors = (nodeId) => {
    return DEFAULT_EDGES
      .filter(e => e.from === nodeId)
      .map(e => e.to)
      .sort(); // Alphabetical order for deterministic behavior
  };

  // Initialize stack for DLS
  const initStack = () => {
    stackRef.current = [{ node: "A", depth: 0, parent: null, index: 0 }];
  };

  // Reset function wrapped in useCallback
  const reset = useCallback(() => {
    setVisited([]);
    setPath([]);
    setCurrent(null);
    setFound(false);
    setStatus("idle");
    setRunning(false);
    stackRef.current = [];
  }, []);

  // Core Algorithm Step
  const step = useCallback(() => {
    if (found) return false;
    
    // Initialize stack if empty and just starting
    if (stackRef.current.length === 0 && status === "idle") {
        initStack();
        setStatus("running");
    }

    // If stack empty and running, we are done (searched all within limit)
    if (stackRef.current.length === 0) {
       if (status === "running") {
          setStatus("failed");
          setRunning(false);
       }
       return false;
    }

    const top = stackRef.current[stackRef.current.length - 1];
    
    // First time visiting this node in this frame (index 0)
    if (top.index === 0) {
      setCurrent(top.node);
      
      // Add to visited
      setVisited(prev => [...prev, { node: top.node, depth: top.depth }]);
      
      // Update current path
      const newPath = stackRef.current.map(frame => frame.node);
      setPath(newPath);

      // Check goal
      if (top.node === targetNode) {
        setFound(true);
        setStatus("success");
        setRunning(false);
        return false;
      }

      // Check depth limit
      if (top.depth >= limit) {
        // Cannot go deeper, pop immediately after this render cycle (next step)
        top.index = 999; 
        // Force a re-render to show the node was visited even if we backtrack next
        // But we already called setVisited/setPath above, so UI will update.
        // The issue was auto-play stopping because state didn't change *enough* or effect chain broke.
        // With setInterval, this return true is fine.
        return true;
      }
    }

    // Try to find next child
    const neighbors = getNeighbors(top.node);
    if (top.index < neighbors.length) {
      const nextChild = neighbors[top.index];
      top.index++;
      
      // Push child to stack
      stackRef.current.push({ 
        node: nextChild, 
        depth: top.depth + 1, 
        parent: top.node, 
        index: 0 
      });
      return true;
    } else {
      // Backtrack
      stackRef.current.pop();
      if (stackRef.current.length > 0) {
        // Update path to parent
        const newPath = stackRef.current.map(frame => frame.node);
        setPath(newPath);
        setCurrent(stackRef.current[stackRef.current.length - 1].node);
      } else {
        setCurrent(null);
        setPath([]);
      }
      return true;
    }
  }, [found, limit, status, targetNode]); // reset not needed here

  // Auto-play Loop using setInterval for robustness
  useEffect(() => {
    if (!running) return;
    
    // Use setInterval to ensure continuous execution even if state updates are skipped/batched
    const interval = setInterval(() => {
      step();
    }, speedMs);
    
    return () => clearInterval(interval);
  }, [running, speedMs, step]);

  // Drawing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const { width, height } = canvas;

    // Clear
    ctx.clearRect(0, 0, width, height);

    // Draw Edges
    DEFAULT_EDGES.forEach(edge => {
      const start = DEFAULT_NODES.find(n => n.id === edge.from);
      const end = DEFAULT_NODES.find(n => n.id === edge.to);
      
      // Check if this edge is part of current path
      let isPathEdge = false;
      for (let i = 0; i < path.length - 1; i++) {
        if (path[i] === edge.from && path[i+1] === edge.to) {
          isPathEdge = true;
          break;
        }
      }

      ctx.beginPath();
      ctx.moveTo(start.x, start.y);
      ctx.lineTo(end.x, end.y);
      ctx.strokeStyle = isPathEdge ? "#2563eb" : "#e5e7eb";
      ctx.lineWidth = isPathEdge ? 4 : 2;
      ctx.stroke();
    });

    // Draw Nodes
    DEFAULT_NODES.forEach(node => {
      const isCurrent = node.id === current;
      const isTarget = node.id === targetNode;
      const isVisited = visited.some(v => v.node === node.id);
      const inPath = path.includes(node.id);

      ctx.beginPath();
      ctx.arc(node.x, node.y, 20, 0, Math.PI * 2);
      
      if (isCurrent) {
        ctx.fillStyle = "#fbbf24"; // Amber
        ctx.strokeStyle = "#d97706";
      } else if (inPath) {
        ctx.fillStyle = "#bfdbfe"; // Light Blue
        ctx.strokeStyle = "#2563eb";
      } else if (isVisited) {
        ctx.fillStyle = "#e5e7eb"; // Gray
        ctx.strokeStyle = "#9ca3af";
      } else {
        ctx.fillStyle = "#ffffff";
        ctx.strokeStyle = "#d1d5db";
      }

      if (isTarget) {
        ctx.lineWidth = 4;
        ctx.strokeStyle = "#ef4444"; // Red border for target
      } else {
        ctx.lineWidth = 2;
      }

      ctx.fill();
      ctx.stroke();

      // Text
      ctx.fillStyle = "#374151";
      ctx.font = "bold 16px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(node.id, node.x, node.y);
      
      // Depth label (optional)
      // const depth = visited.find(v => v.node === node.id)?.depth;
      // if (depth !== undefined) {
      //   ctx.fillStyle = "#6b7280";
      //   ctx.font = "10px sans-serif";
      //   ctx.fillText(`d:${depth}`, node.x, node.y + 30);
      // }
    });

  }, [visited, path, current, targetNode]);


  // Actions
  // reset is now defined above with useCallback

  const togglePlay = () => {
    if (running) {
      setRunning(false);
      setStatus("paused");
    } else {
      if (status === "idle" || status === "success" || status === "failed") {
        reset();
        initStack();
        setStatus("running");
        setRunning(true);
      } else {
        setRunning(true);
        setStatus("running");
      }
    }
  };

  return (
    <div className="w-full flex flex-col md:flex-row gap-8 font-sans">
      {/* Left: Visualization */}
      <div className="w-full md:w-1/2">
        <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-200">
          <canvas 
            ref={canvasRef} 
            width={640} 
            height={320} 
            className="w-full h-auto border border-gray-100 rounded-lg bg-slate-50"
          />
          <div className="mt-4 text-center text-gray-600 text-sm flex justify-center gap-6">
             <div className="flex items-center gap-2">
               <span className="w-3 h-3 rounded-full bg-[#fbbf24] border border-[#d97706]"></span>
               <span>{t("current_node") || "Current"}</span>
             </div>
             <div className="flex items-center gap-2">
               <span className="w-3 h-3 rounded-full bg-[#bfdbfe] border border-[#2563eb]"></span>
               <span>{t("in_stack") || "Path Stack"}</span>
             </div>
             <div className="flex items-center gap-2">
               <span className="w-3 h-3 rounded-full bg-white border-2 border-[#ef4444]"></span>
               <span>{t("target_node") || "Target"}</span>
             </div>
          </div>
        </div>
      </div>

      {/* Right: Controls */}
      <div className="w-full md:w-1/2 flex flex-col gap-6">
        {/* Status Card */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            {status === "success" && <span className="text-green-500">✓</span>}
            {status === "failed" && <span className="text-red-500">✕</span>}
            {status === "running" && <span className="text-blue-500 animate-spin">↻</span>}
            <span>{t("status") || "Status"}: <span className="capitalize">{status === "idle" ? "Ready" : status}</span></span>
          </h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="text-xs text-gray-500 uppercase font-bold">{t("current_depth") || "Current Depth"}</div>
              <div className="text-2xl font-bold text-blue-600">
                {path.length > 0 ? path.length - 1 : 0}
              </div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
               <div className="text-xs text-gray-500 uppercase font-bold">{t("visited_count") || "Visited Nodes"}</div>
               <div className="text-2xl font-bold text-indigo-600">{visited.length}</div>
            </div>
          </div>

          {status === "success" && (
             <div className="mt-4 p-3 bg-green-50 text-green-700 rounded-lg text-sm">
               Found target <strong>{targetNode}</strong> at depth <strong>{path.length - 1}</strong>!
             </div>
          )}
           {status === "failed" && (
             <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
               Target not found within limit {limit}.
             </div>
          )}
        </div>

        {/* Settings Card */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 flex flex-col gap-5">
          {/* Depth Limit */}
          <div>
             <label className="block text-sm font-medium text-gray-700 mb-2">{t("depth_limit") || "Depth Limit"}: {limit}</label>
             <input 
              type="range" 
              min="0" 
              max="4" 
              step="1" 
              value={limit} 
              onChange={(e) => {
                const val = parseInt(e.target.value);
                if (!running) {
                    setLimit(val);
                    reset(); // Reset visualization when limit changes
                }
              }}
              disabled={running}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600 disabled:opacity-50"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>0</span><span>1</span><span>2</span><span>3</span><span>4</span>
            </div>
          </div>

          {/* Target Node */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t("target_node") || "Target Node"}</label>
            <div className="flex gap-2 flex-wrap">
              {DEFAULT_NODES.map(n => (
                <button 
                  key={n.id}
                  onClick={() => !running && setTargetNode(n.id)}
                  className={`w-8 h-8 rounded-full font-bold text-sm border transition-colors ${targetNode === n.id ? "bg-red-500 text-white border-red-600" : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"}`}
                  disabled={running}
                >
                  {n.id}
                </button>
              ))}
            </div>
          </div>

          {/* Speed */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t("speed") || "Speed"}: {speedMs}ms</label>
            <input 
              type="range" 
              min="100" 
              max="2000" 
              step="100" 
              value={speedMs} 
              onChange={(e) => setSpeedMs(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button 
            onClick={togglePlay}
            className={`flex-1 py-3 rounded-xl font-bold text-white shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2 ${running ? "bg-amber-500 hover:bg-amber-600" : "bg-blue-600 hover:bg-blue-700"}`}
          >
            {running ? (
              <>
                <span>⏸</span> {t("pause") || "Pause"}
              </>
            ) : (
              <>
                <span>▶</span> {t("start") || "Start"}
              </>
            )}
          </button>
          
          <button 
            onClick={() => {
              if (status === "idle" || status === "success" || status === "failed") {
                reset();
                initStack();
                // Need to wait for state update or force a step immediately?
                // Better to just reset and let user click again or handle manual step logic
                setStatus("paused"); // Ready to step
              } else {
                step();
              }
            }}
            disabled={running || status === "success" || status === "failed"}
            className="px-6 py-3 rounded-xl font-bold bg-indigo-100 text-indigo-700 hover:bg-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-colors"
          >
            {t("step") || "Step"} ⏭
          </button>

          <button 
            onClick={reset}
            className="px-6 py-3 rounded-xl font-bold bg-gray-100 text-gray-700 hover:bg-gray-200 shadow-sm transition-colors"
          >
            {t("reset") || "Reset"} ↺
          </button>
        </div>
      </div>
    </div>
  );
}
