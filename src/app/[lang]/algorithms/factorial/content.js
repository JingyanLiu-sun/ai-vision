"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import { useI18n } from "@/app/i18n/client";

export default function FactorialVisualization({ lang }) {
  const { t } = useI18n();

  const CANVAS_WIDTH = 800;
  const CANVAS_HEIGHT = 480;
  const NODE_RADIUS = 24;
  const LEVEL_HEIGHT = 90;
  const HORIZONTAL_SPACING = 16;

  const [n, setN] = useState(5);
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [running, setRunning] = useState(false);
  const [status, setStatus] = useState("idle");
  const [speedMs, setSpeedMs] = useState(600);
  const [tree, setTree] = useState(null);
  const [nodePositions, setNodePositions] = useState([]);
  const [edges, setEdges] = useState([]);

  const canvasRef = useRef(null);
  const intervalRef = useRef(null);

  const buildTree = useCallback((val) => {
    if (val <= 1) return { id: `leaf-${val}`, val, children: [], result: 1 };
    const left = buildTree(val - 1);
    const node = {
      id: `node-${val}`,
      val,
      children: [left],
      result: val * left.result
    };
    return node;
  }, []);

  const generateSteps = useCallback((root) => {
    const steps = [];
    let id = 0;
    const dfs = (node, depth, x, parentX, parentY) => {
      const y = depth * LEVEL_HEIGHT + 60;
      steps.push({ id: id++, node, depth, x, y, parentX, parentY, phase: "visit", result: null });
      if (node.children.length > 0) {
        dfs(node.children[0], depth + 1, x, x, y);
      }
      steps.push({ id: id++, node, depth, x, y, parentX, parentY, phase: "result", result: node.result });
    };
    dfs(root, 0, CANVAS_WIDTH / 2, null, null);
    return steps;
  }, []);

  const computeLayout = useCallback((root) => {
    const positions = [];
    const edges = [];
    const dfs = (node, depth, x, parentX, parentY) => {
      const y = depth * LEVEL_HEIGHT + 60;
      positions.push({ id: node.id, x, y, val: node.val, result: node.result });
      if (parentX !== null && parentY !== null) {
        edges.push({ fromX: parentX, fromY: parentY, toX: x, toY: y });
      }
      if (node.children.length > 0) {
        const childX = x;
        dfs(node.children[0], depth + 1, childX, x, y);
      }
    };
    dfs(root, 0, CANVAS_WIDTH / 2, null, null);
    return { positions, edges };
  }, []);

  const generateTree = useCallback(() => {
    const root = buildTree(n);
    const newSteps = generateSteps(root);
    const layout = computeLayout(root);
    setTree(root);
    setSteps(newSteps);
    setNodePositions(layout.positions);
    setEdges(layout.edges);
    setCurrentStep(0);
    setStatus("idle");
    setRunning(false);
  }, [n, buildTree, generateSteps, computeLayout]);

  useEffect(() => {
    generateTree();
  }, [generateTree]);

  const step = useCallback(() => {
    if (currentStep >= steps.length) {
      setStatus("done");
      setRunning(false);
      return false;
    }
    setCurrentStep(prev => prev + 1);
    return true;
  }, [currentStep, steps.length]);

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
        generateTree();
        setStatus("running");
        setRunning(true);
      } else {
        setRunning(true);
        setStatus("running");
      }
    }
  };

  const reset = () => {
    generateTree();
  };

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const { width, height } = canvas;
    ctx.clearRect(0, 0, width, height);

    // Draw edges
    edges.forEach(edge => {
      ctx.strokeStyle = "#cbd5e1";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(edge.fromX, edge.fromY);
      ctx.lineTo(edge.toX, edge.toY);
      ctx.stroke();
    });

    // Draw nodes
    nodePositions.forEach(node => {
      const isVisited = steps.slice(0, currentStep).some(s => s.node.id === node.id && s.phase === "visit");
      const isResult = steps.slice(0, currentStep).some(s => s.node.id === node.id && s.phase === "result");
      const isCurrent = currentStep < steps.length && steps[currentStep].node.id === node.id;

      let fillColor = "#ffffff";
      let strokeColor = "#64748b";
      let textColor = "#1e293b";

      if (isCurrent) {
        fillColor = "#dbeafe";
        strokeColor = "#2563eb";
      } else if (isResult) {
        fillColor = "#dcfce7";
        strokeColor = "#16a34a";
      } else if (isVisited) {
        fillColor = "#f1f5f9";
        strokeColor = "#64748b";
      }

      // Node circle
      ctx.beginPath();
      ctx.arc(node.x, node.y, NODE_RADIUS, 0, 2 * Math.PI);
      ctx.fillStyle = fillColor;
      ctx.fill();
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = 3;
      ctx.stroke();

      // Node value
      ctx.fillStyle = textColor;
      ctx.font = "bold 18px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(node.val, node.x, node.y - 6);

      // Result label
      if (isResult) {
        ctx.fillStyle = "#16a34a";
        ctx.font = "bold 14px sans-serif";
        ctx.fillText(`= ${node.result}`, node.x, node.y + 18);
      }
    });

    // Step info
    if (currentStep < steps.length) {
      const step = steps[currentStep];
      ctx.fillStyle = "#1e293b";
      ctx.font = "16px sans-serif";
      ctx.textAlign = "left";
      ctx.fillText(`Step ${currentStep + 1}/${steps.length}: ${step.phase === "visit" ? "Visit" : "Return"} f(${step.val})`, 20, height - 20);
    } else {
      ctx.fillStyle = "#16a34a";
      ctx.font = "bold 16px sans-serif";
      ctx.textAlign = "left";
      ctx.fillText(`Complete: f(${n}) = ${tree?.result || "?"}`, 20, height - 20);
    }

  }, [steps, currentStep, nodePositions, edges, n, tree]);

  useEffect(() => {
    draw();
  }, [draw]);

  return (
    <div className="w-full flex flex-col md:flex-row gap-8 font-sans">
      <div className="w-full md:w-2/3">
        <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-200 relative">
          <div className="absolute top-3 left-4 right-4 flex flex-wrap items-center justify-between text-xs md:text-sm text-gray-700 pointer-events-none">
            <div>
              {(t("current_action") || "当前操作")}: {currentStep < steps.length ? (steps[currentStep].phase === "visit" ? `Visit f(${steps[currentStep].val})` : `Return f(${steps[currentStep].val}) = ${steps[currentStep].result}`) : (status === "idle" ? (t("ready") || "就绪") : "")}
            </div>
            <div className="flex gap-4">
              <span>Step: {currentStep}/{steps.length}</span>
              <span>{t("result") || "结果"}: {tree?.result || "?"}</span>
            </div>
          </div>
          <canvas ref={canvasRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} className="w-full h-auto border border-gray-100 rounded-lg bg-slate-50" />
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
              <div className="text-xs text-gray-500 uppercase font-bold">{t("input") || "输入"}</div>
              <div className="text-2xl font-bold text-indigo-600">n = {n}</div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
               <div className="text-xs text-gray-500 uppercase font-bold">{t("result") || "结果"}</div>
               <div className="text-2xl font-bold text-green-600">{tree?.result || "?"}</div>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 flex flex-col gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t("input_n") || "输入 n"}: {n}</label>
            <input type="range" min="0" max="10" step="1" value={n} onChange={(e) => { setN(parseInt(e.target.value)); }} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
            <div className="flex justify-between text-xs text-gray-400 mt-1"><span>0</span><span>10</span></div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t("speed") || "速度"}: {speedMs}ms</label>
            <input type="range" min="200" max="1500" step="100" value={speedMs} onChange={(e) => setSpeedMs(parseInt(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600" />
            <div className="flex justify-between text-xs text-gray-400 mt-1"><span>Fast</span><span>Slow</span></div>
          </div>
          <button onClick={() => { generateTree(); }} className="w-full py-2 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors" disabled={running}>{t("regenerate_tree") || "重新生成树"} 🔄</button>
        </div>
        <div className="flex gap-3">
          <button onClick={togglePlay} className={`flex-1 py-3 rounded-xl font-bold text-white shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2 ${running ? "bg-amber-500 hover:bg-amber-600" : "bg-blue-600 hover:bg-blue-700"}`}>
            {running ? (<><span>⏸</span> {t("pause") || "暂停"}</>) : (<><span>▶</span> {t("start") || "开始"}</>)}
          </button>
          <button onClick={() => step()} disabled={running || status === "done"} className="px-6 py-3 rounded-xl font-bold bg-indigo-100 text-indigo-700 hover:bg-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-colors">{t("step") || "单步"} ⏭</button>
          <button onClick={reset} className="px-6 py-3 rounded-xl font-bold bg-gray-100 text-gray-700 hover:bg-gray-200 shadow-sm transition-colors">{t("reset") || "重置"} ↺</button>
        </div>
      </div>
    </div>
  );
}