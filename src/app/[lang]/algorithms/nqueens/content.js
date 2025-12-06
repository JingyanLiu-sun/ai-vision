"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useI18n } from "@/app/i18n/client";

export default function NQueensVisualization({ lang }) {
  const { t } = useI18n();
  const [n, setN] = useState(8);
  const [row, setRow] = useState(0);
  const [queens, setQueens] = useState(Array(8).fill(-1));
  const [nextCol, setNextCol] = useState(Array(8).fill(0));
  const [cols, setCols] = useState(new Set());
  const [diag1, setDiag1] = useState(new Set());
  const [diag2, setDiag2] = useState(new Set());
  const [running, setRunning] = useState(false);
  const [solutions, setSolutions] = useState([]);
  const [showAttacks, setShowAttacks] = useState(true);
  const [findAll, setFindAll] = useState(true);
  const [speedMs, setSpeedMs] = useState(300);
  const solutionKeysRef = useRef(new Set());
  const [trace, setTrace] = useState([]);

  useEffect(() => {
    setRow(0);
    setQueens(Array(n).fill(-1));
    setNextCol(Array(n).fill(0));
    setCols(new Set());
    setDiag1(new Set());
    setDiag2(new Set());
    setSolutions([]);
    setRunning(false);
  }, [n]);

  const canPlace = (r, c) => {
    if (cols.has(c)) return false;
    const d1 = r - c;
    const d2 = r + c;
    if (diag1.has(d1)) return false;
    if (diag2.has(d2)) return false;
    return true;
  };

  const place = (r, c) => {
    const nq = queens.slice();
    nq[r] = c;
    const nc = new Set(cols);
    const nd1 = new Set(diag1);
    const nd2 = new Set(diag2);
    nc.add(c);
    nd1.add(r - c);
    nd2.add(r + c);
    setQueens(nq);
    setCols(nc);
    setDiag1(nd1);
    setDiag2(nd2);
    setTrace(prev => {
      const next = [{ type: "place", r, c }, ...prev];
      return next.slice(0, 100);
    });
  };

  const remove = (r, c) => {
    const nq = queens.slice();
    nq[r] = -1;
    const nc = new Set(cols);
    const nd1 = new Set(diag1);
    const nd2 = new Set(diag2);
    nc.delete(c);
    nd1.delete(r - c);
    nd2.delete(r + c);
    setQueens(nq);
    setCols(nc);
    setDiag1(nd1);
    setDiag2(nd2);
    setTrace(prev => {
      const next = [{ type: "backtrack", r, c }, ...prev];
      return next.slice(0, 100);
    });
  };

  const step = () => {
    let r = row;
    let nc = nextCol.slice();
    while (true) {
      if (r === n) {
        const key = queens.join(',');
        if (!solutionKeysRef.current.has(key)) {
          solutionKeysRef.current.add(key);
          setSolutions(s => [...s, queens.slice()]);
        }
        if (!findAll) {
          setRunning(false);
          return false;
        }
        const prevR = r - 1;
        if (prevR < 0) return false;
        const prevC = queens[prevR];
        remove(prevR, prevC);
        nc[prevR] = prevC + 1;
        setNextCol(nc);
        setRow(prevR);
        return true;
      }
      let placed = false;
      for (let c = nc[r]; c < n; c++) {
        setTrace(prev => {
          const next = [{ type: "try", r, c }, ...prev];
          return next.slice(0, 100);
        });
        if (canPlace(r, c)) {
          place(r, c);
          nc[r] = c + 1;
          setNextCol(nc);
          setRow(prev => prev + 1);
          placed = true;
          break;
        }
      }
      if (placed) break;
      nc[r] = 0;
      if (r === 0) {
        setRunning(false);
        return false;
      }
      const prevR = r - 1;
      const prevC = queens[prevR];
      remove(prevR, prevC);
      nc[prevR] = prevC + 1;
      setNextCol(nc);
      setRow(prevR);
      return true;
    }
    return true;
  };

  useEffect(() => {
    if (!running) return;
    let timer;
    const tick = () => {
      const progressed = step();
      if (!progressed) {
        setRunning(false);
        return;
      }
      timer = setTimeout(tick, speedMs);
    };
    timer = setTimeout(tick, speedMs);
    return () => { if (timer) clearTimeout(timer); };
  }, [running, speedMs, row, nextCol]);

  const reset = () => {
    setRow(0);
    setQueens(Array(n).fill(-1));
    setNextCol(Array(n).fill(0));
    setCols(new Set());
    setDiag1(new Set());
    setDiag2(new Set());
    setSolutions([]);
    setRunning(false);
    solutionKeysRef.current = new Set();
  };

  const sizeOptions = useMemo(() => [4, 5, 6, 7, 8, 9, 10, 11, 12], []);

  return (
    <div className="w-full flex flex-col md:flex-row gap-6 relative">
      <div className="w-full md:w-1/2 relative">
        <div className="grid" style={{ gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` }}>
          {Array.from({ length: n * n }).map((_, idx) => {
            const r = Math.floor(idx / n);
            const c = idx % n;
            const isDark = (r + c) % 2 === 1;
            const q = queens[r] === c;
            const isActiveRow = r === row;
            const attacked = showAttacks && (
              cols.has(c) || diag1.has(r - c) || diag2.has(r + c)
            );
            return (
              <div
                key={idx}
                className={`aspect-square flex items-center justify-center border ${isDark ? "bg-gray-200" : "bg-white"} ${isActiveRow ? "outline outline-2 outline-blue-400" : ""} ${attacked && !q ? "bg-red-100" : ""}`}
              >
                {q ? (
                  <span className="text-2xl">♛</span>
                ) : null}
              </div>
            );
          })}
        </div>
        <div className="mt-4 flex items-center justify-between">
          <div className="text-gray-700">{t("solutions_count", { count: solutions.length })}</div>
          <div className="text-gray-500">{t("current_row", { row })}</div>
        </div>
      </div>
      <div className="w-full md:w-1/2">
        <div className="flex flex-col gap-[30px]">
          <div className="flex items-center gap-3">
            <label className="text-gray-700">{t("nqueens_board_size")}</label>
            <select
              className="border rounded px-2 py-1"
              value={n}
              onChange={(e) => setN(parseInt(e.target.value))}
            >
              {sizeOptions.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-[30px]">
            <label className="text-gray-700">{t("speed")}</label>
            <input type="range" min={100} max={1000} step={50} value={speedMs} onChange={(e) => setSpeedMs(parseInt(e.target.value))} />
            <span className="text-gray-500">{speedMs}ms</span>
          </div>
          <div className="flex items-center gap-[30px]">
            <button className="px-3 py-1 rounded bg-blue-600 text-white" onClick={() => setRunning(true)}>{t("auto_play")}</button>
            <button className="px-3 py-1 rounded bg-gray-700 text-white" onClick={() => setRunning(false)}>{t("pause")}</button>
            <button className="px-3 py-1 rounded bg-indigo-600 text-white" onClick={step}>{t("step")}</button>
            <button className="px-3 py-1 rounded bg-gray-200" onClick={reset}>{t("reset")}</button>
          </div>
          <div className="flex items-center gap-[30px]">
            <label className="inline-flex items-center gap-2">
              <input type="checkbox" checked={showAttacks} onChange={(e) => setShowAttacks(e.target.checked)} />
              <span className="text-gray-700">{t("show_attacks")}</span>
            </label>
            <label className="inline-flex items-center gap-2">
              <input type="checkbox" checked={findAll} onChange={(e) => setFindAll(e.target.checked)} />
              <span className="text-gray-700">{t("find_all_solutions")}</span>
            </label>
          </div>
          <div>
            <div className="text-gray-700 mb-2">{t("trace_log")}</div>
            <div className="max-h-32 overflow-auto border rounded p-2 text-sm bg-white">
              {trace.map((e, i) => (
                <div key={i} className="text-gray-700">
                  {e.type === "try" && t("trace_try", { r: e.r, c: e.c })}
                  {e.type === "place" && t("trace_place", { r: e.r, c: e.c })}
                  {e.type === "backtrack" && t("trace_backtrack", { r: e.r, c: e.c })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
