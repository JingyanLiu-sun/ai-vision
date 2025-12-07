"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import { useI18n } from "@/app/i18n/client";

// Constants
const MIN_VALUE = 10;
const MAX_VALUE = 100;
const CANVAS_WIDTH = 640;
const CANVAS_HEIGHT = 320;

export default function QuickSortVisualization({ lang }) {
  const { t } = useI18n();

  // State
  const [arraySize, setArraySize] = useState(20);
  const [array, setArray] = useState([]);
  const [pivotIndex, setPivotIndex] = useState(-1);
  const [comparing, setComparing] = useState([]); // Indices being compared [i, j]
  const [swapping, setSwapping] = useState([]); // Indices being swapped [i, j]
  const [sortedIndices, setSortedIndices] = useState([]); // Indices that are fully sorted
  
  const [running, setRunning] = useState(false);
  const [status, setStatus] = useState("idle"); // idle, running, paused, sorted
  const [speedMs, setSpeedMs] = useState(200);
  const [comparisons, setComparisons] = useState(0);
  const [swaps, setSwaps] = useState(0);
  const [stepInfo, setStepInfo] = useState("");

  // Visualization Stack for QuickSort (to avoid recursion in state)
  const [stack, setStack] = useState([]); 
  const [currentPartition, setCurrentPartition] = useState(null); // { low, high, i, j, pivot }

  const canvasRef = useRef(null);
  
  // Refs for animation loop
  const timeoutRef = useRef(null);
  const intervalRef = useRef(null);

  // Helpers
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

  // Initialization

  const generateArray = useCallback(() => {
    const newArray = Array.from({ length: arraySize }, () => 
      Math.floor(Math.random() * (MAX_VALUE - MIN_VALUE + 1)) + MIN_VALUE
    );
    setArray(newArray);
    resetState();
  }, [arraySize]);

  const resetState = useCallback(() => {
    setComparing([]);
    setSwapping([]);
    setSortedIndices([]);
    setPivotIndex(-1);
    setStatus("idle");
    setRunning(false);
    setComparisons(0);
    setSwaps(0);
    setStack([]);
    setCurrentPartition(null);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (intervalRef.current) clearInterval(intervalRef.current);
    setStepInfo("");
  }, []);

  // Initialization
  useEffect(() => {
    generateArray();
  }, [generateArray]);

  // QuickSort Logic Step
  const step = useCallback(() => {
    if (status === "sorted") return false;

    // Initial Start
    if (status === "idle" || (stack.length === 0 && !currentPartition && sortedIndices.length < array.length)) {
      setStack([{ low: 0, high: array.length - 1 }]);
      setStatus("running");
      setStepInfo((t("qs_init") || "初始化分区") + ` [0, ${array.length - 1}]`);
      return true;
    }

    // Clone state
    let newArray = [...array];
    let newStack = [...stack];
    let part = currentPartition ? { ...currentPartition } : null;
    let newComparisons = comparisons;
    let newSwaps = swaps;
    let newSortedIndices = [...sortedIndices];

    // If no active partition, pop from stack
    if (!part) {
      if (newStack.length === 0) {
        setStatus("sorted");
        setRunning(false);
        setSortedIndices(Array.from({ length: array.length }, (_, k) => k));
        setComparing([]);
        setSwapping([]);
        setPivotIndex(-1);
        setStepInfo(t("sorted") || "排序完成");
        return false;
      }
      
      const { low, high } = newStack.pop();
      setStack(newStack);

      if (low < high) {
        // Initialize Partition
        // Pivot selection (using high as pivot for Lomuto partition scheme)
        part = {
          low,
          high,
          pivot: high,
          i: low - 1,
          j: low,
          state: "comparing" // comparing, swapping, pivot_swap, done
        };
        setCurrentPartition(part);
        setPivotIndex(high);
        setComparing([low, high]); // Initial visual comparison
        setStepInfo((t("qs_choose_pivot") || "选择基准") + `: index ${high}`);
        return true;
      } else {
         // Single element is sorted
         if (low >= 0 && low < array.length && !newSortedIndices.includes(low)) {
            newSortedIndices.push(low);
            setSortedIndices(newSortedIndices);
         }
         return true;
      }
    }

    // Process Partition Step
    const { low, high, pivot, i, j } = part;

    if (part.state === "comparing") {
       if (j < high) {
         setComparing([j, pivot]);
         newComparisons++;
         setComparisons(newComparisons);
         setStepInfo((t("qs_compare") || "比较") + `: arr[${j}] 与 pivot(arr[${pivot}])`);

         if (newArray[j] < newArray[pivot]) {
           // Need to swap i+1 and j
           part.i = i + 1;
           part.state = "swapping";
         } else {
           // No swap needed, move to next j
           part.j = j + 1;
         }
         setCurrentPartition(part);
       } else {
         // Loop finished, swap pivot to correct position
         part.state = "pivot_swap";
         part.i = i + 1; // Pivot goes to i + 1
         setCurrentPartition(part);
         setStepInfo((t("qs_place_pivot") || "放置基准") + `: 到位置 ${i + 1}`);
       }
    } else if (part.state === "swapping") {
        // Perform swap between i and j
        const idx1 = part.i;
        const idx2 = part.j;
        
        [newArray[idx1], newArray[idx2]] = [newArray[idx2], newArray[idx1]];
        newSwaps++;
        setSwaps(newSwaps);
        setArray(newArray);
        setSwapping([idx1, idx2]);
        setStepInfo((t("qs_swap") || "交换") + `: arr[${idx1}] ↔ arr[${idx2}]`);
        
        // Move to next element
        part.j = j + 1;
        part.state = "comparing";
        setCurrentPartition(part);
    } else if (part.state === "pivot_swap") {
        // Swap pivot to its final position (i) which was set in previous step
        const pivotFinalIdx = part.i;
        
        [newArray[pivotFinalIdx], newArray[high]] = [newArray[high], newArray[pivotFinalIdx]];
        newSwaps++;
        setSwaps(newSwaps);
        setArray(newArray);
        setSwapping([pivotFinalIdx, high]);
        setStepInfo((t("qs_pivot_final") || "基准归位") + `: index ${pivotFinalIdx}`);
        
        // Partition done
        part.state = "done";
        setCurrentPartition(null); // Clear active partition
        setPivotIndex(-1);
        setComparing([]);
        setSwapping([]);
        
        // Add pivot to sorted
        if (!newSortedIndices.includes(pivotFinalIdx)) {
            newSortedIndices.push(pivotFinalIdx);
            setSortedIndices(newSortedIndices);
        }

        // Push sub-arrays to stack
        if (pivotFinalIdx + 1 < high) {
            newStack.push({ low: pivotFinalIdx + 1, high: high });
        } else if (pivotFinalIdx + 1 === high) {
             if (!newSortedIndices.includes(high)) newSortedIndices.push(high);
        }

        if (low < pivotFinalIdx - 1) {
            newStack.push({ low: low, high: pivotFinalIdx - 1 });
        } else if (low === pivotFinalIdx - 1) {
             if (!newSortedIndices.includes(low)) newSortedIndices.push(low);
        }
        
        setStack(newStack);
        setSortedIndices(newSortedIndices);
    }

    return true;
  }, [array, stack, currentPartition, status, comparisons, swaps, sortedIndices, t]);

  // Auto-play Loop
  useEffect(() => {
    if (!running) return;
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      step();
    }, speedMs);
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [running, speedMs, step]);

  // Drawing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const { width, height } = canvas;
    ctx.clearRect(0, 0, width, height);
    const layout = computeLayout(width, height, array.length);

    // Partition background region
    if (currentPartition) {
      const x0 = layout.startX + currentPartition.low * (layout.BAR_WIDTH + layout.BAR_GAP);
      const x1 = layout.startX + (currentPartition.high + 1) * (layout.BAR_WIDTH + layout.BAR_GAP) - layout.BAR_GAP;
      ctx.fillStyle = "rgba(147, 197, 253, 0.12)";
      ctx.strokeStyle = "rgba(37, 99, 235, 0.3)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.rect(x0 - 2, 36, (x1 - x0) + 4, layout.baseLine - 20);
      ctx.fill();
      ctx.stroke();
      // Bracket marks
      ctx.strokeStyle = "#60a5fa";
      ctx.beginPath();
      ctx.moveTo(x0 - 2, 30);
      ctx.lineTo(x0 - 2, 36);
      ctx.moveTo(x1 + 2, 30);
      ctx.lineTo(x1 + 2, 36);
      ctx.stroke();
    }

    // Draw cells (uniform boxes)
    const cellHeight = 42;
    const yTop = Math.max(60, layout.baseLine - cellHeight - 24);

    array.forEach((value, index) => {
      const x = layout.startX + index * (layout.BAR_WIDTH + layout.BAR_GAP);
      const y = yTop;

      let colorStart, colorEnd, borderColor;
      if (sortedIndices.includes(index)) {
        colorStart = "#6ee7b7";
        colorEnd = "#34d399";
        borderColor = "#059669";
      } else if (index === pivotIndex) {
        colorStart = "#f472b6";
        colorEnd = "#e879f9";
        borderColor = "#c026d3";
      } else if (swapping.includes(index)) {
        colorStart = "#f87171";
        colorEnd = "#ef4444";
        borderColor = "#b91c1c";
      } else if (comparing.includes(index)) {
        colorStart = "#fcd34d";
        colorEnd = "#fbbf24";
        borderColor = "#d97706";
      } else if (currentPartition && index >= currentPartition.low && index <= currentPartition.high) {
        colorStart = "#93c5fd";
        colorEnd = "#60a5fa";
        borderColor = "#2563eb";
      } else {
        colorStart = "#e5e7eb";
        colorEnd = "#d1d5db";
        borderColor = "#9ca3af";
      }

      const gradient = ctx.createLinearGradient(x, y, x, y + cellHeight);
      gradient.addColorStop(0, colorStart);
      gradient.addColorStop(1, colorEnd);

      ctx.fillStyle = gradient;
      ctx.strokeStyle = borderColor;
      ctx.lineWidth = 1;
      const r = Math.min(layout.BAR_WIDTH / 2, 6);
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.lineTo(x + layout.BAR_WIDTH - r, y);
      ctx.quadraticCurveTo(x + layout.BAR_WIDTH, y, x + layout.BAR_WIDTH, y + r);
      ctx.lineTo(x + layout.BAR_WIDTH, y + cellHeight - r);
      ctx.quadraticCurveTo(x + layout.BAR_WIDTH, y + cellHeight, x + layout.BAR_WIDTH - r, y + cellHeight);
      ctx.lineTo(x + r, y + cellHeight);
      ctx.quadraticCurveTo(x, y + cellHeight, x, y + cellHeight - r);
      ctx.lineTo(x, y + r);
      ctx.quadraticCurveTo(x, y, x + r, y);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Value inside cell
      ctx.fillStyle = "#111827";
      ctx.font = "bold 12px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(String(value), x + layout.BAR_WIDTH / 2, y + cellHeight / 2 + 4);

      // Index below
      ctx.fillStyle = "#6b7280";
      ctx.font = "10px sans-serif";
      ctx.fillText(String(index), x + layout.BAR_WIDTH / 2, layout.baseLine + 18);
    });

    // Pivot marker
    if (pivotIndex !== -1) {
      const x = layout.startX + pivotIndex * (layout.BAR_WIDTH + layout.BAR_GAP) + layout.BAR_WIDTH / 2;
      const y = yTop - 10;
      ctx.fillStyle = "#f472b6";
      ctx.beginPath();
      ctx.moveTo(x, y - 10);
      ctx.lineTo(x - 8, y);
      ctx.lineTo(x + 8, y);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = "#c026d3";
      ctx.font = "bold 10px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(t("pivot") || "Pivot", x, y - 14);
    }

    // i / j pointers
    if (currentPartition) {
      const drawPtr = (idx, label, color) => {
        const x = layout.startX + idx * (layout.BAR_WIDTH + layout.BAR_GAP) + layout.BAR_WIDTH / 2;
        const y = yTop + cellHeight + 6;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(x, y + 10);
        ctx.lineTo(x - 7, y);
        ctx.lineTo(x + 7, y);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = "#374151";
        ctx.font = "bold 10px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(label, x, y + 24);
      };
      const iDraw = Math.max(currentPartition.i, currentPartition.low);
      drawPtr(iDraw, "i", "#f87171");
      drawPtr(currentPartition.j, "j", "#fbbf24");
    }

    // Dashed line from j to pivot during comparison
    if (comparing.length === 2 && pivotIndex !== -1) {
      const jIdx = comparing[0];
      const x0 = layout.startX + jIdx * (layout.BAR_WIDTH + layout.BAR_GAP) + layout.BAR_WIDTH / 2;
      const x1 = layout.startX + pivotIndex * (layout.BAR_WIDTH + layout.BAR_GAP) + layout.BAR_WIDTH / 2;
      const y = yTop - 24;
      ctx.strokeStyle = "#d97706";
      ctx.setLineDash([5, 4]);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x0, y);
      ctx.lineTo(x1, y);
      ctx.stroke();
      ctx.setLineDash([]);
    }

  }, [array, comparing, swapping, pivotIndex, sortedIndices, currentPartition, t]);

  const togglePlay = () => {
    if (running) {
      setRunning(false);
      setStatus("paused");
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
    } else {
      if (status === "sorted") {
        generateArray();
        setStatus("running"); // Will trigger effect
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
        <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-200 relative">
          <div className="absolute top-3 left-4 right-4 flex flex-wrap items-center justify-between text-xs md:text-sm text-gray-700">
            <div>
              {(t("current_action") || "当前操作")}: {stepInfo || (status === "idle" ? (t("ready") || "就绪") : "")}
            </div>
            <div className="flex gap-4">
              <span>low: {currentPartition ? currentPartition.low : "-"}</span>
              <span>high: {currentPartition ? currentPartition.high : "-"}</span>
              <span>i: {currentPartition ? currentPartition.i : "-"}</span>
              <span>j: {currentPartition ? currentPartition.j : "-"}</span>
              <span>pivot: {pivotIndex !== -1 ? `${pivotIndex}/${array[pivotIndex]}` : "-"}</span>
            </div>
          </div>
          <canvas 
            ref={canvasRef} 
            width={CANVAS_WIDTH} 
            height={CANVAS_HEIGHT} 
            className="w-full h-auto border border-gray-100 rounded-lg bg-slate-50"
          />
          <div className="mt-4 text-center text-gray-600 text-sm flex flex-wrap justify-center gap-4 md:gap-6">
             <div className="flex items-center gap-2">
               <span className="w-3 h-3 bg-[#e5e7eb] border border-[#9ca3af]"></span>
               <span>{t("waiting") || "Waiting"}</span>
             </div>
             <div className="flex items-center gap-2">
               <span className="w-3 h-3 bg-[#93c5fd] border border-[#2563eb]"></span>
               <span>{t("partition") || "Partition Range"}</span>
             </div>
             <div className="flex items-center gap-2">
               <span className="w-3 h-3 bg-[#f472b6] border border-[#c026d3]"></span>
               <span>{t("pivot") || "Pivot"}</span>
             </div>
             <div className="flex items-center gap-2">
               <span className="w-3 h-3 bg-[#fcd34d] border border-[#d97706]"></span>
               <span>{t("comparing") || "Comparing"}</span>
             </div>
             <div className="flex items-center gap-2">
               <span className="w-3 h-3 bg-[#f87171] border border-[#b91c1c]"></span>
               <span>{t("swapping") || "Swapping"}</span>
             </div>
             <div className="flex items-center gap-2">
               <span className="w-3 h-3 bg-[#6ee7b7] border border-[#059669]"></span>
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
                 setRunning(false);
                 setStatus("idle");
              }}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
               <span>Few</span><span>Many</span>
            </div>
          </div>

          {/* Generate New */}
          <button 
            onClick={() => {
                generateArray();
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
            onClick={() => step()}
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
