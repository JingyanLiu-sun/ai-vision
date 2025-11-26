"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useI18n } from "@/app/i18n/client";

const unit = 24;

const IntervalSchedulingVisualization = ({ lang }) => {
  const { t } = useI18n();
  const [intervals, setIntervals] = useState([
    { id: 1, start: 1, end: 4 },
    { id: 2, start: 3, end: 5 },
    { id: 3, start: 0, end: 6 },
    { id: 4, start: 5, end: 7 },
    { id: 5, start: 3, end: 9 },
    { id: 6, start: 5, end: 9 },
    { id: 7, start: 6, end: 10 },
    { id: 8, start: 8, end: 11 },
    { id: 9, start: 8, end: 12 },
    { id: 10, start: 2, end: 14 },
    { id: 11, start: 12, end: 16 },
  ]);
  const [strategy, setStrategy] = useState("earliestEnd");
  const [manualMode, setManualMode] = useState(false);
  const [selected, setSelected] = useState([]);
  const [candidate, setCandidate] = useState(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(800);

  const [timelineStart, timelineEnd] = useMemo(() => {
    const s = Math.min(...intervals.map(i => i.start));
    const e = Math.max(...intervals.map(i => i.end));
    return [s, e];
  }, [intervals]);

  const sorted = useMemo(() => {
    if (strategy === "earliestStart") return [...intervals].sort((a, b) => a.start - b.start || a.end - b.end);
    if (strategy === "shortestDuration") return [...intervals].sort((a, b) => (a.end - a.start) - (b.end - b.start) || a.end - b.end);
    return [...intervals].sort((a, b) => a.end - b.end || a.start - b.start);
  }, [intervals, strategy]);

  const steps = useMemo(() => {
    const res = [];
    let lastEnd = -Infinity;
    for (const iv of sorted) {
      const ok = iv.start >= lastEnd;
      res.push({ iv, choose: ok });
      if (ok) lastEnd = iv.end;
    }
    return res;
  }, [sorted]);

  const optimalCount = useMemo(() => {
    const es = [...intervals].sort((a, b) => a.end - b.end || a.start - b.start);
    let c = 0, last = -Infinity;
    for (const iv of es) {
      if (iv.start >= last) {
        c++;
        last = iv.end;
      }
    }
    return c;
  }, [intervals]);

  const isManualSolved = manualMode && selected.length === optimalCount;

  const reset = () => {
    setSelected([]);
    setCandidate(null);
    setStepIndex(0);
    setPlaying(false);
  };

  const stepOnce = () => {
    if (stepIndex >= steps.length) {
      setPlaying(false);
      return;
    }
    const s = steps[stepIndex];
    setCandidate(s.iv.id);
    if (s.choose) setSelected(prev => [...prev, s.iv.id]);
    setStepIndex(prev => prev + 1);
  };

  const runAll = () => {
    const res = steps.filter(s => s.choose).map(s => s.iv.id);
    setSelected(res);
    setCandidate(null);
    setStepIndex(steps.length);
    setPlaying(false);
  };

  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => {
      const i = stepIndex;
      if (i >= steps.length) {
        setPlaying(false);
        clearInterval(id);
      } else {
        const s = steps[i];
        setCandidate(s.iv.id);
        if (s.choose) setSelected(prev => [...prev, s.iv.id]);
        setStepIndex(i + 1);
      }
    }, speed);
    return () => clearInterval(id);
  }, [playing, speed, stepIndex, steps]);

  const randomAll = () => {
    const n = Math.floor(8 + Math.random() * 6);
    const range = 18;
    const arr = Array.from({ length: n }).map((_, idx) => {
      const s = Math.floor(Math.random() * range);
      const len = Math.floor(1 + Math.random() * 8);
      const e = Math.min(s + len, range + 2);
      return { id: idx + 1, start: s, end: e };
    });
    setIntervals(arr);
    setSelected([]);
    setCandidate(null);
    setStepIndex(0);
    setPlaying(false);
  };

  const addOne = () => {
    const maxId = intervals.reduce((m, i) => Math.max(m, i.id), 0);
    const range = Math.max(16, timelineEnd - timelineStart + 4);
    const s = Math.floor(Math.random() * range);
    const len = Math.floor(1 + Math.random() * 8);
    const e = Math.min(s + len, range + 2);
    setIntervals(prev => [...prev, { id: maxId + 1, start: s, end: e }]);
    setSelected([]);
    setCandidate(null);
    setStepIndex(0);
    setPlaying(false);
  };

  const toggleManual = () => {
    setManualMode(v => !v);
    setSelected([]);
    setCandidate(null);
    setStepIndex(0);
    setPlaying(false);
  };

  const clickInterval = (iv) => {
    if (!manualMode) return;
    const conflictWith = selected.map(id => intervals.find(i => i.id === id)).find(s => s && !(iv.end <= s.start || iv.start >= s.end));
    if (conflictWith) {
      if (lang === "zh") {
        alert(`区间 [${iv.start}, ${iv.end}] 与已选区间 [${conflictWith.start}, ${conflictWith.end}] 冲突，区间调度要求选择的区间两两不重叠（即前一个结束时间 <= 后一个开始时间）。`);
      } else {
        alert(`Interval [${iv.start}, ${iv.end}] conflicts with selected interval [${conflictWith.start}, ${conflictWith.end}]. Interval Scheduling requires non-overlapping intervals (prev end <= next start).`);
      }
      return;
    }
    setSelected(prev => prev.includes(iv.id) ? prev.filter(x => x !== iv.id) : [...prev, iv.id]);
  };

  const onDrag = (iv, dx) => {
    const delta = Math.round(dx / unit);
    if (!delta) return;
    setIntervals(prev => prev.map(i => i.id === iv.id ? { ...i, start: Math.max(timelineStart, i.start + delta), end: Math.max(i.start + delta + 1, i.end + delta) } : i));
    setSelected([]);
  };

  const onResize = (iv, dx, side) => {
    const delta = Math.round(dx / unit);
    if (!delta) return;
    setIntervals(prev => prev.map(i => {
      if (i.id !== iv.id) return i;
      if (side === 'left') {
        const ns = Math.min(i.end - 1, Math.max(timelineStart, i.start + delta));
        return { ...i, start: ns };
      } else {
        const ne = Math.max(i.start + 1, i.end + delta);
        return { ...i, end: ne };
      }
    }));
    setSelected([]);
  };

  const widthPx = (timelineEnd - timelineStart + 2) * unit;

  return (
    <div className="p-4">
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <select className="px-2 py-1 border rounded" value={strategy} onChange={e => { setStrategy(e.target.value); reset(); }} disabled={manualMode}>
          <option value="earliestEnd">{t("earliest_end") || "Earliest finish"}</option>
          <option value="earliestStart">{t("earliest_start") || "Earliest start"}</option>
          <option value="shortestDuration">{t("shortest_duration") || "Shortest duration"}</option>
        </select>
        <button className="px-3 py-1 bg-blue-600 text-white rounded" onClick={stepOnce} disabled={manualMode}>{t("step") || "Step"}</button>
        {!playing && <button className="px-3 py-1 bg-indigo-600 text-white rounded" onClick={() => setPlaying(true)} disabled={manualMode}>{t("auto") || "Auto"}</button>}
        {playing && <button className="px-3 py-1 bg-yellow-600 text-white rounded" onClick={() => setPlaying(false)}>{t("stop") || "Stop"}</button>}
        <button className="px-3 py-1 bg-green-600 text-white rounded" onClick={runAll} disabled={manualMode}>{t("start") || "Start"}</button>
        <button className="px-3 py-1 bg-gray-600 text-white rounded" onClick={reset}>{t("reset") || "Reset"}</button>
        <button className="px-3 py-1 bg-pink-600 text-white rounded" onClick={randomAll}>{t("random") || "Random"}</button>
        <button className="px-3 py-1 bg-teal-600 text-white rounded" onClick={addOne}>{t("add") || "Add"}</button>
        <button className={`px-3 py-1 rounded text-white ${manualMode ? "bg-orange-600" : "bg-purple-600"}`} onClick={toggleManual}>{manualMode ? (t("manual") || "Manual") : (t("greedy") || "Greedy")}</button>
        <div className="flex items-center gap-2 ml-2">
          <span className="text-sm text-gray-700">{t("speed") || "Speed"}</span>
          <input type="range" min={200} max={2000} step={100} value={speed} onChange={e => setSpeed(Number(e.target.value))} />
        </div>
        <div className="ml-auto text-sm text-gray-700">{t("selected") || "Selected"}: {selected.length} / {optimalCount}</div>
      </div>
      {isManualSolved && <div className="mb-2 text-green-600 font-semibold">{t("congratulations") || "Congratulations, you succeeded!"}</div>}
      <div className="mb-3 h-6 relative" style={{ width: widthPx }}>
        {[...Array(timelineEnd - timelineStart + 1)].map((_, idx) => (
          <div key={idx} className="absolute text-xs text-gray-600" style={{ left: `${idx * unit}px` }}>{timelineStart + idx}</div>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-2" style={{ width: widthPx }}>
        {sorted.map(iv => (
          <div key={iv.id} className={`p-2 border rounded ${selected.includes(iv.id) ? "bg-green-100 border-green-400" : candidate === iv.id ? "bg-orange-50 border-orange-400" : "bg-white"}`} onClick={() => clickInterval(iv)}>
            <div className="font-semibold">#{iv.id} [{iv.start}, {iv.end}]</div>
            <div className="h-2 relative bg-gray-200">
              <div className={`${selected.includes(iv.id) ? "bg-green-500" : "bg-blue-500"} absolute top-0 left-0 h-2`}
                   style={{ width: `${(iv.end - iv.start) * unit}px`, marginLeft: `${(iv.start - timelineStart) * unit}px`, cursor: manualMode ? "grab" : "default" }}
                   onMouseDown={e => {
                     if (!manualMode) return;
                     const startX = e.clientX;
                     const move = (me) => onDrag(iv, me.clientX - startX);
                     const up = () => { window.removeEventListener('mousemove', move); window.removeEventListener('mouseup', up); };
                     window.addEventListener('mousemove', move);
                     window.addEventListener('mouseup', up);
                   }}>
                {manualMode && (
                  <>
                    <div className="absolute left-0 top-0 h-2 w-1.5 bg-black/40 cursor-ew-resize"
                         onMouseDown={e => { const sx = e.clientX; const mv = me => onResize(iv, me.clientX - sx, 'left'); const up=()=>{window.removeEventListener('mousemove', mv);window.removeEventListener('mouseup', up);}; window.addEventListener('mousemove', mv); window.addEventListener('mouseup', up); }}/>
                    <div className="absolute right-0 top-0 h-2 w-1.5 bg-black/40 cursor-ew-resize"
                         onMouseDown={e => { const sx = e.clientX; const mv = me => onResize(iv, me.clientX - sx, 'right'); const up=()=>{window.removeEventListener('mousemove', mv);window.removeEventListener('mouseup', up);}; window.addEventListener('mousemove', mv); window.addEventListener('mouseup', up); }}/>
                  </>
                )}
              </div>
              {manualMode && intervals.some(i => i.id !== iv.id && !(iv.end <= i.start || iv.start >= i.end)) && (
                <div className="absolute inset-0 border border-red-500 rounded"></div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IntervalSchedulingVisualization;
