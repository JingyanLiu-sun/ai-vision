"use client";
import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useI18n } from "@/app/i18n/client";

// Knight's moves
const MOVES = [
  [2, 1], [1, 2], [-1, 2], [-2, 1],
  [-2, -1], [-1, -2], [1, -2], [2, -1],
];

export default function KnightsTour({ lang }) {
  const { t } = useI18n();

  // Configuration
  const [n, setN] = useState(8);
  const [speedMs, setSpeedMs] = useState(200);
  const [useWarnsdorff, setUseWarnsdorff] = useState(true);

  // State
  const [board, setBoard] = useState(() => Array.from({ length: 8 }, () => Array(8).fill(-1)));
  const [trace, setTrace] = useState([]); // Array of {r, c}
  const [running, setRunning] = useState(false);
  const [status, setStatus] = useState("idle"); // idle, running, paused, success, failed

  // Backtracking Stack Ref
  // Each frame: { pos: {r,c}, moves: {r,c}[], i: number }
  const framesRef = useRef([]);

  // Initialization
  useEffect(() => {
    reset();
  }, [n]);

  const inside = (r, c) => r >= 0 && r < n && c >= 0 && c < n;

  // Calculate degree (Warnsdorff's rule)
  // Degree is the number of valid moves from (r,c)
  const getDegree = (r, c, visitedSet) => {
    let d = 0;
    for (const [dr, dc] of MOVES) {
      const nr = r + dr, nc = c + dc;
      if (inside(nr, nc) && !visitedSet.has(`${nr},${nc}`)) d++;
    }
    return d;
  };

  // Get valid moves from (r,c), optionally sorted by Warnsdorff
  const getNextMoves = useCallback((r, c, visitedSet) => {
    const ms = [];
    for (const [dr, dc] of MOVES) {
      const nr = r + dr, nc = c + dc;
      if (inside(nr, nc) && !visitedSet.has(`${nr},${nc}`)) {
        ms.push({ r: nr, c: nc });
      }
    }
    if (useWarnsdorff) {
      // Heuristic: Pick move with fewest onward moves
      ms.sort((a, b) => {
        // Temporarily mark 'a' as visited to check its neighbors? 
        // Standard Warnsdorff checks degree in the current board state.
        // But strictly, if we move to A, A is visited.
        // Usually we just check degree on current board.
        return getDegree(a.r, a.c, visitedSet) - getDegree(b.r, b.c, visitedSet);
      });
    }
    return ms;
  }, [n, useWarnsdorff]);

  // Reconstruct stack from current trace to allow resuming/backtracking
  const rehydrateStack = useCallback(() => {
    const frames = [];
    const visitedSet = new Set();
    
    for (let i = 0; i < trace.length; i++) {
      const curr = trace[i];
      visitedSet.add(`${curr.r},${curr.c}`);
      
      const moves = getNextMoves(curr.r, curr.c, visitedSet); // Note: visitedSet includes curr
      
      if (i < trace.length - 1) {
        const next = trace[i + 1];
        // Find which move index corresponds to 'next'
        const matchIdx = moves.findIndex(m => m.r === next.r && m.c === next.c);
        // If we backtrack to here, we should try the move AFTER matchIdx
        frames.push({ pos: curr, moves, i: matchIdx + 1 });
      } else {
        // Top of stack (current head)
        frames.push({ pos: curr, moves, i: 0 });
      }
    }
    framesRef.current = frames;
  }, [trace, getNextMoves]);

  // Core Algorithm Step
  const step = useCallback(() => {
    if (trace.length === 0) return false;

    // Success check
    if (trace.length === n * n) {
      setStatus("success");
      setRunning(false);
      return false;
    }

    // Initialize stack if needed
    if (framesRef.current.length === 0) {
      rehydrateStack();
    }

    const stack = framesRef.current;
    const top = stack[stack.length - 1];

    if (!top) {
      setStatus("failed");
      setRunning(false);
      return false;
    }

    // Try to find next move from top frame
    if (top.i < top.moves.length) {
      const nextPos = top.moves[top.i];
      top.i++; // Advance index for this frame

      // Execute move
      const newTrace = [...trace, nextPos];
      const newBoard = board.map(row => [...row]);
      newBoard[nextPos.r][nextPos.c] = trace.length;
      
      setTrace(newTrace);
      setBoard(newBoard);
      
      // Push new frame for the new position
      // We need to update visited set for getNextMoves
      const visitedSet = new Set(newTrace.map(p => `${p.r},${p.c}`));
      const nextMoves = getNextMoves(nextPos.r, nextPos.c, visitedSet);
      stack.push({ pos: nextPos, moves: nextMoves, i: 0 });
      
      return true;
    } else {
      // Backtrack
      stack.pop(); // Remove exhausted frame
      
      if (stack.length === 0) {
        setStatus("failed");
        setRunning(false);
        return false;
      }

      // Revert state
      const lastPos = trace[trace.length - 1];
      const newTrace = trace.slice(0, -1);
      const newBoard = board.map(row => [...row]);
      newBoard[lastPos.r][lastPos.c] = -1;

      setTrace(newTrace);
      setBoard(newBoard);
      return true;
    }
  }, [trace, board, n, getNextMoves, rehydrateStack]);

  // Auto-play Loop
  useEffect(() => {
    if (!running) return;
    const timer = setTimeout(() => {
      step();
    }, speedMs);
    return () => clearTimeout(timer);
  }, [running, speedMs, step]);

  // Actions
  const reset = () => {
    const b = Array.from({ length: n }, () => Array(n).fill(-1));
    setBoard(b);
    setTrace([]);
    framesRef.current = [];
    setRunning(false);
    setStatus("idle");
  };

  const handleSquareClick = (r, c) => {
    if (running) return;

    // If start, set start
    if (trace.length === 0) {
      const b = Array.from({ length: n }, () => Array(n).fill(-1));
      b[r][c] = 0;
      setBoard(b);
      setTrace([{ r, c }]);
      framesRef.current = []; // Clear stack
      setStatus("idle");
      return;
    }

    // If playing manually
    const current = trace[trace.length - 1];
    const visitedSet = new Set(trace.map(p => `${p.r},${p.c}`));
    
    // Check if valid move
    // Is it a knight move?
    const isKnightMove = MOVES.some(([dr, dc]) => current.r + dr === r && current.c + dc === c);
    if (isKnightMove && !visitedSet.has(`${r},${c}`)) {
       const newTrace = [...trace, { r, c }];
       const newBoard = board.map(row => [...row]);
       newBoard[r][c] = trace.length;
       setTrace(newTrace);
       setBoard(newBoard);
       framesRef.current = []; // Invalidate stack on manual move
       if (newTrace.length === n * n) setStatus("success");
    }
  };

  const togglePlay = () => {
    if (running) {
      setRunning(false);
      setStatus("paused");
    } else {
      if (trace.length === 0) {
        // Auto start from 0,0 if empty
        handleSquareClick(0, 0);
        // Need to wait for state update? 
        // handleSquareClick updates state, but setRunning(true) in same cycle might use old state?
        // Actually handleSquareClick updates state via setTrace. 
        // We should probably just set start state explicitly here if empty.
        const b = Array.from({ length: n }, () => Array(n).fill(-1));
        b[0][0] = 0;
        setBoard(b);
        setTrace([{r:0, c:0}]);
      }
      setRunning(true);
      setStatus("running");
    }
  };

  const manualReset = () => {
    reset();
    // Default start
    const b = Array.from({ length: n }, () => Array(n).fill(-1));
    b[0][0] = 0;
    setBoard(b);
    setTrace([{r:0, c:0}]);
  };

  // Render helpers
  const getSquareColor = (r, c) => {
    const isDark = (r + c) % 2 === 1;
    return isDark ? "bg-[#b58863]" : "bg-[#f0d9b5]";
  };

  return (
    <div className="w-full flex flex-col md:flex-row gap-8 font-sans">
      {/* Left: Board */}
      <div className="w-full md:w-1/2">
        <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-200">
          <div 
            className="grid border-4 border-[#8b4513] select-none"
            style={{ gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` }}
          >
            {Array.from({ length: n * n }).map((_, idx) => {
              const r = Math.floor(idx / n);
              const c = idx % n;
              const val = board[r]?.[c] ?? -1;
              const isCurrent = trace.length > 0 && trace[trace.length - 1].r === r && trace[trace.length - 1].c === c;
              const isStart = trace.length > 0 && trace[0].r === r && trace[0].c === c;
              
              return (
                <div
                  key={idx}
                  onClick={() => handleSquareClick(r, c)}
                  className={`aspect-square flex items-center justify-center relative cursor-pointer ${getSquareColor(r, c)} hover:opacity-90 transition-opacity`}
                >
                  {/* Step Number */}
                  {val >= 0 && !isCurrent && (
                    <span className="text-xs md:text-base font-bold text-black/60 font-mono">
                      {val + 1}
                    </span>
                  )}
                  
                  {/* Start Marker */}
                  {isStart && val !== 0 && (
                    <div className="absolute inset-0 flex items-center justify-center">
                       <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                    </div>
                  )}

                  {/* Current Knight */}
                  {isCurrent && (
                    <span className="text-2xl md:text-4xl text-black drop-shadow-md filter animate-pulse">
                      ♞
                    </span>
                  )}
                </div>
              );
            })}
          </div>
          
          <div className="mt-4 text-center text-gray-600 text-sm">
             {trace.length === 0 
               ? t("click_to_set_start") || "Click any square to set start position"
               : status === "running" 
                 ? t("auto_playing") || "Auto playing..."
                 : t("manual_mode_hint") || "Click valid moves to play manually, or use Auto Play"
             }
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
          <div className="flex items-end gap-2 mb-2">
            <span className="text-4xl font-bold text-blue-600">{trace.length}</span>
            <span className="text-gray-500 mb-1">/ {n * n} {t("steps") || "steps"}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className={`h-2.5 rounded-full transition-all duration-300 ${status === "success" ? "bg-green-500" : status === "failed" ? "bg-red-500" : "bg-blue-600"}`} 
              style={{ width: `${(trace.length / (n * n)) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Settings Card */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 flex flex-col gap-5">
          {/* Board Size */}
          <div>
             <label className="block text-sm font-medium text-gray-700 mb-2">{t("board_size")}</label>
             <div className="flex gap-2">
               {[5, 6, 7, 8].map(s => (
                 <button 
                   key={s}
                   onClick={() => !running && setN(s)}
                   className={`px-4 py-2 rounded-lg font-medium transition-colors ${n === s ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"} ${running ? "opacity-50 cursor-not-allowed" : ""}`}
                   disabled={running}
                 >
                   {s}x{s}
                 </button>
               ))}
             </div>
          </div>

          {/* Speed */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t("speed")}: {speedMs}ms</label>
            <input 
              type="range" 
              min="10" 
              max="1000" 
              step="10" 
              value={speedMs} 
              onChange={(e) => setSpeedMs(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          {/* Algorithm */}
          <div className="flex items-center gap-3">
            <input 
              id="warnsdorff"
              type="checkbox" 
              checked={useWarnsdorff} 
              onChange={(e) => setUseWarnsdorff(e.target.checked)}
              className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
            />
            <label htmlFor="warnsdorff" className="text-gray-700 select-none cursor-pointer">{t("warnsdorff_rule")}</label>
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
                <span>⏸</span> {t("pause")}
              </>
            ) : (
              <>
                <span>▶</span> {t("auto_play")}
              </>
            )}
          </button>
          
          <button 
            onClick={() => !running && step()}
            disabled={running || status === "success"}
            className="px-6 py-3 rounded-xl font-bold bg-indigo-100 text-indigo-700 hover:bg-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-colors"
          >
            {t("step")} ⏭
          </button>

          <button 
            onClick={manualReset}
            className="px-6 py-3 rounded-xl font-bold bg-gray-100 text-gray-700 hover:bg-gray-200 shadow-sm transition-colors"
          >
            {t("reset")} ↺
          </button>
        </div>
      </div>
    </div>
  );
}
