"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import { useI18n } from "@/app/i18n/client";

// Constants
// Removed ARRAY_SIZE constant, now a state variable
const MIN_VALUE = 10;
const MAX_VALUE = 100;
const CANVAS_WIDTH = 640;
const CANVAS_HEIGHT = 320;
// Dynamic calculation for BAR_WIDTH and BAR_GAP based on arraySize

export default function BubbleSortVisualization({ lang }) {
  const { t } = useI18n();

  // State
  const [arraySize, setArraySize] = useState(20);
  const [array, setArray] = useState([]);
  const [comparing, setComparing] = useState([]); // Indices being compared [i, j]
  const [sortedIndices, setSortedIndices] = useState([]); // Indices that are fully sorted
  const [swapping, setSwapping] = useState(false); // Visual state for swap animation (optional, for now instant swap)
  
  const [running, setRunning] = useState(false);
  const [status, setStatus] = useState("idle"); // idle, running, paused, sorted
  const [speedMs, setSpeedMs] = useState(200);
  const [comparisons, setComparisons] = useState(0);
  const [swaps, setSwaps] = useState(0);

  const [selectedIndices, setSelectedIndices] = useState([]); // User selected indices for manual swap
  const [hoverIndex, setHoverIndex] = useState(-1); // Index of bar being hovered

  // Refs for iterative execution
  const iRef = useRef(0); // Outer loop index
  const jRef = useRef(0); // Inner loop index
  const canvasRef = useRef(null);

  const isArraySorted = (arr) => {
    for (let i = 1; i < arr.length; i++) {
      if (arr[i - 1] > arr[i]) return false;
    }
    return true;
  };

  const getCanvasPoint = (canvas, clientX, clientY) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;
    return { x, y };
  };

  const computeLayout = (width, height, n) => {
    const AVAILABLE_WIDTH = width - 40;
    const gapRatio = 0.2;
    const bw = AVAILABLE_WIDTH / (n + (n - 1) * gapRatio);
    const BAR_WIDTH = Math.max(bw, 2);
    const BAR_GAP = BAR_WIDTH * gapRatio;
    const totalWidth = n * (BAR_WIDTH + BAR_GAP) - BAR_GAP;
    const startX = (width - totalWidth) / 2;
    const baseLine = height - 30;
    return { BAR_WIDTH, BAR_GAP, totalWidth, startX, baseLine, width, height };
  };

  const getIndexAtX = (x, layout, n) => {
    const { startX, BAR_WIDTH, BAR_GAP, totalWidth } = layout;
    if (x < startX || x > startX + totalWidth) return -1;
    return Math.floor((x - startX) / (BAR_WIDTH + BAR_GAP));
  };

  const isPointInsideBar = (x, y, index, layout, value) => {
    const { BAR_WIDTH, BAR_GAP, startX, baseLine, height } = layout;
    const barHeight = (value / MAX_VALUE) * (height - 60);
    const x0 = startX + index * (BAR_WIDTH + BAR_GAP);
    const yTop = baseLine - barHeight;
    return x >= x0 && x <= x0 + BAR_WIDTH && y >= yTop && y <= baseLine;
  };

  // Initialization
  useEffect(() => {
    generateArray();
  }, [arraySize]); // Re-generate when size changes

  const generateArray = useCallback(() => {
    const newArray = Array.from({ length: arraySize }, () => 
      Math.floor(Math.random() * (MAX_VALUE - MIN_VALUE + 1)) + MIN_VALUE
    );
    setArray(newArray);
    resetState();
  }, [arraySize]);

  const resetState = useCallback(() => {
    setComparing([]);
    setSortedIndices([]);
    setSelectedIndices([]); // Clear selection
    setHoverIndex(-1);
    setSwapping(false);
    setStatus("idle");
    setRunning(false);
    setComparisons(0);
    setSwaps(0);
    iRef.current = 0;
    jRef.current = 0;
  }, []);

  // Step Function
  const step = useCallback(() => {
    if (status === "sorted") return false;

    const arr = [...array];
    const n = arr.length;
    let i = iRef.current;
    let j = jRef.current;

    // Check if sorting is complete
    if (i >= n - 1) {
      setStatus("sorted");
      setRunning(false);
      setSortedIndices(Array.from({ length: n }, (_, k) => k)); // All sorted
      setComparing([]);
      return false;
    }

    // Set comparing indices for visualization
    setComparing([j, j + 1]);
    setComparisons(prev => prev + 1);

    // Compare and Swap
    let swapped = false;
    if (arr[j] > arr[j + 1]) {
      [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      swapped = true;
      setSwaps(prev => prev + 1);
      setArray(arr);
    }

    // Advance indices
    j++;
    if (j >= n - 1 - i) {
      // Inner loop finished for this pass
      // The element at n - 1 - i is now sorted
      setSortedIndices(prev => [...prev, n - 1 - i]);
      j = 0;
      i++;
    }

    // Update refs
    iRef.current = i;
    jRef.current = j;

    // If we just finished the whole sort (early exit optimization check could go here, but standard bubble sort runs full)
    if (i >= n - 1) {
       // Next step will catch the completion
    }
    
    return true;
  }, [array, status]);

  // Auto-play Loop
  useEffect(() => {
    if (!running) return;
    const interval = setInterval(() => {
      step();
    }, speedMs);
    return () => clearInterval(interval);
  }, [running, speedMs, step]);

  // Handle Canvas Mouse Move for Hover Effect
  const handleCanvasMouseMove = (e) => {
    if (running || status === "sorted") {
      if (hoverIndex !== -1) setHoverIndex(-1);
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const { x, y } = getCanvasPoint(canvas, e.clientX, e.clientY);
    const layout = computeLayout(canvas.width, canvas.height, array.length);
    const index = getIndexAtX(x, layout, array.length);

    if (index === -1) {
      if (hoverIndex !== -1) setHoverIndex(-1);
      return;
    }

    if (isPointInsideBar(x, y, index, layout, array[index])) {
      if (hoverIndex !== index) setHoverIndex(index);
    } else {
      if (hoverIndex !== -1) setHoverIndex(-1);
    }
  };

  const handleCanvasMouseLeave = () => {
    setHoverIndex(-1);
  };

  // Handle Canvas Click for manual swap
  const handleCanvasClick = (e) => {
    if (running || status === "sorted") return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const { x, y } = getCanvasPoint(canvas, e.clientX, e.clientY);
    const layout = computeLayout(canvas.width, canvas.height, array.length);
    let index = hoverIndex !== -1 ? hoverIndex : getIndexAtX(x, layout, array.length);
    if (index === -1) return;

    if (!isPointInsideBar(x, y, index, layout, array[index])) return;

    setSelectedIndices(prev => {
      if (prev.includes(index)) {
        return prev.filter(i => i !== index);
      } else {
        if (prev.length < 2) {
          const newSelection = [...prev, index];
          if (newSelection.length === 2) {
            const [i1, i2] = newSelection;
            const newArray = [...array];
            [newArray[i1], newArray[i2]] = [newArray[i2], newArray[i1]];
            setArray(newArray);
            if (isArraySorted(newArray)) {
              setStatus("sorted");
              setRunning(false);
              setSortedIndices(Array.from({ length: newArray.length }, (_, k) => k));
              setComparing([]);
            }
            return [];
          }
          return newSelection;
        }
        return prev;
      }
    });
  };

  // Drawing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const { width, height } = canvas;
    ctx.clearRect(0, 0, width, height);
    const layout = computeLayout(width, height, array.length);

    // Draw Bars
    array.forEach((value, index) => {
      const barHeight = (value / MAX_VALUE) * (layout.height - 60);
      const x = layout.startX + index * (layout.BAR_WIDTH + layout.BAR_GAP);
      const y = layout.baseLine - barHeight;

      // Create gradient
      let colorStart, colorEnd, borderColor;
      
      if (sortedIndices.includes(index)) {
        colorStart = "#6ee7b7"; // Green-300
        colorEnd = "#34d399";   // Green-400
        borderColor = "#059669"; // Green-600
      } else if (comparing.includes(index)) {
        colorStart = "#fcd34d"; // Amber-300
        colorEnd = "#fbbf24";   // Amber-400
        borderColor = "#d97706"; // Amber-600
      } else if (selectedIndices.includes(index)) {
        colorStart = "#d8b4fe"; // Purple-300
        colorEnd = "#c084fc";   // Purple-400
        borderColor = "#9333ea"; // Purple-600
      } else if (index === hoverIndex) { // Hover state
        colorStart = "#c4b5fd"; // Violet-300 (Lighter Purple for hint)
        colorEnd = "#a78bfa";   // Violet-400
        borderColor = "#7c3aed"; // Violet-600
      } else {
        colorStart = "#93c5fd"; // Blue-300
        colorEnd = "#60a5fa";   // Blue-400
        borderColor = "#2563eb"; // Blue-600
      }

      const gradient = ctx.createLinearGradient(x, y, x, y + barHeight);
      gradient.addColorStop(0, colorStart);
      gradient.addColorStop(1, colorEnd);

      ctx.beginPath();
      // Rounded top corners
      const radius = Math.min(layout.BAR_WIDTH / 2, 5);
      ctx.moveTo(x, y + barHeight);
      ctx.lineTo(x, y + radius);
      ctx.quadraticCurveTo(x, y, x + radius, y);
      ctx.lineTo(x + layout.BAR_WIDTH - radius, y);
      ctx.quadraticCurveTo(x + layout.BAR_WIDTH, y, x + layout.BAR_WIDTH, y + radius);
      ctx.lineTo(x + layout.BAR_WIDTH, y + barHeight);
      ctx.closePath();

      // Shadow
      ctx.shadowColor = "rgba(0, 0, 0, 0.1)";
      ctx.shadowBlur = 4;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;

      ctx.fillStyle = gradient;
      ctx.fill();

      // Reset shadow for stroke
      ctx.shadowColor = "transparent";
      ctx.strokeStyle = borderColor;
      ctx.lineWidth = 1; // Thinner stroke for elegance
      ctx.stroke();

      // Draw Value Text (Only if bars are wide enough)
      if (layout.BAR_WIDTH > 20) {
        ctx.fillStyle = "#374151";
        ctx.font = "bold 10px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(value, x + layout.BAR_WIDTH / 2, layout.baseLine + 15);
      }
    });

  }, [array, comparing, sortedIndices, selectedIndices, hoverIndex]);

  const togglePlay = () => {
    if (running) {
      setRunning(false);
      setStatus("paused");
    } else {
      if (status === "sorted") {
        generateArray();
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
      {/* Left: Visualization (2/3 width) */}
      <div className="w-full md:w-2/3">
        <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-200">
          <canvas 
            ref={canvasRef} 
            width={CANVAS_WIDTH} 
            height={CANVAS_HEIGHT} 
            className="w-full h-auto border border-gray-100 rounded-lg bg-slate-50 cursor-pointer"
            onClick={handleCanvasClick}
            onMouseMove={handleCanvasMouseMove}
            onMouseLeave={handleCanvasMouseLeave}
          />
          <div className="mt-4 text-center text-gray-600 text-sm flex justify-center gap-6">
             <div className="flex items-center gap-2">
               <span className="w-3 h-3 bg-[#bfdbfe] border border-[#2563eb]"></span>
               <span>{t("unsorted") || "Unsorted"}</span>
             </div>
             <div className="flex items-center gap-2">
               <span className="w-3 h-3 bg-[#fde68a] border border-[#d97706]"></span>
               <span>{t("comparing") || "Comparing"}</span>
             </div>
             <div className="flex items-center gap-2">
               <span className="w-3 h-3 bg-[#c084fc] border border-[#9333ea]"></span>
               <span>{t("selected") || "Selected (Click to Swap)"}</span>
             </div>
             <div className="flex items-center gap-2">
               <span className="w-3 h-3 bg-[#d1fae5] border border-[#059669]"></span>
               <span>{t("sorted") || "Sorted"}</span>
             </div>
          </div>
        </div>
      </div>

      {/* Right: Controls (1/3 width) */}
      <div className="w-full md:w-1/3 flex flex-col gap-6">
        {/* Status Card */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
             {status === "sorted" && <span className="text-green-500">✓</span>}
             {status === "running" && <span className="text-blue-500 animate-spin">↻</span>}
             <span>{t("status") || "Status"}: <span className="capitalize">{status === "idle" ? "Ready" : status}</span></span>
          </h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="text-xs text-gray-500 uppercase font-bold">{t("comparisons") || "Comparisons"}</div>
              <div className="text-2xl font-bold text-blue-600">{comparisons}</div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
               <div className="text-xs text-gray-500 uppercase font-bold">{t("swaps") || "Swaps"}</div>
               <div className="text-2xl font-bold text-indigo-600">{swaps}</div>
            </div>
          </div>
        </div>

        {/* Settings Card */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 flex flex-col gap-5">
          {/* Speed */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t("speed") || "Speed"}: {speedMs}ms</label>
            <input 
              type="range" 
              min="10" 
              max="1000" 
              step="10" 
              value={speedMs} 
              onChange={(e) => setSpeedMs(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
               <span>Fast</span><span>Slow</span>
            </div>
          </div>

          {/* Array Size */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t("array_size") || "Array Size"}: {arraySize}</label>
            <input 
              type="range" 
              min="5" 
              max="100" 
              step="5" 
              value={arraySize} 
              onChange={(e) => {
                 setArraySize(parseInt(e.target.value));
                 setRunning(false); // Stop if running when size changes
              }}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
               <span>Few</span><span>Many</span>
            </div>
          </div>

          {/* Array Size / Generate New (simplified to just generate for now) */}
          <button 
            onClick={() => {
                generateArray();
                setRunning(false);
            }}
            className="w-full py-2 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            disabled={running}
          >
            {t("generate_new_array") || "Generate New Array"} 🎲
          </button>
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
            onClick={step}
            disabled={running || status === "sorted"}
            className="px-6 py-3 rounded-xl font-bold bg-indigo-100 text-indigo-700 hover:bg-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-colors"
          >
            {t("step") || "Step"} ⏭
          </button>

          <button 
            onClick={generateArray}
            className="px-6 py-3 rounded-xl font-bold bg-gray-100 text-gray-700 hover:bg-gray-200 shadow-sm transition-colors"
          >
            {t("reset") || "Reset"} ↺
          </button>
        </div>
      </div>
    </div>
  );
}
