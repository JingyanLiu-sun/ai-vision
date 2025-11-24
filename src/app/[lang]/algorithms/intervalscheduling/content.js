"use client";

import React, { useMemo, useState } from "react";
import { useI18n } from "@/app/i18n/client";

const IntervalSchedulingVisualization = () => {
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
  const [selected, setSelected] = useState([]);

  const sorted = useMemo(() => [...intervals].sort((a, b) => a.end - b.end), [intervals]);
  const [timelineStart, timelineEnd] = useMemo(() => {
    const s = Math.min(...intervals.map(i => i.start));
    const e = Math.max(...intervals.map(i => i.end));
    return [s, e];
  }, [intervals]);

  const runGreedy = () => {
    const res = [];
    let lastEnd = -Infinity;
    for (const iv of sorted) {
      if (iv.start >= lastEnd) {
        res.push(iv.id);
        lastEnd = iv.end;
      }
    }
    setSelected(res);
  };

  const reset = () => setSelected([]);

  return (
    <div className="p-4">
      <div className="flex gap-2 mb-4">
        <button className="px-3 py-1 bg-blue-600 text-white rounded" onClick={runGreedy}>{t("start") || "Start"}</button>
        <button className="px-3 py-1 bg-gray-600 text-white rounded" onClick={reset}>{t("reset") || "Reset"}</button>
      </div>
      <div className="mb-3 h-6 relative">
        {[...Array(timelineEnd - timelineStart + 1)].map((_, idx) => (
          <div key={idx} className="absolute text-xs text-gray-600" style={{ left: `${idx * 20}px` }}>{timelineStart + idx}</div>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-2">
        {sorted.map(iv => (
          <div key={iv.id} className={`p-2 border rounded ${selected.includes(iv.id) ? "bg-green-100 border-green-400" : "bg-white"}`}>
            <div className="font-semibold">#{iv.id} [{iv.start}, {iv.end}]</div>
            <div className="h-2 relative bg-gray-200">
              <div className="absolute top-0 left-0 h-2 bg-blue-500" style={{ width: `${(iv.end - iv.start) * 20}px`, marginLeft: `${iv.start * 20}px` }}></div>
              </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IntervalSchedulingVisualization;