import React, { useEffect, useRef } from "react";

export const IntervalSchedulingThumb = () => {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const picks = el.querySelectorAll(".pick");
    let i = 0;
    const id = setInterval(() => {
      picks.forEach((p, idx) => p.setAttribute("opacity", idx <= i ? "0.8" : "0"));
      i = (i + 1) % picks.length;
    }, 500);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
      <svg ref={ref} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 338" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
        <rect width="600" height="338" fill="#ffffff"/>
        {[40,90,140,190,240].map((y,i)=>(<rect key={i} x="40" y={y} width="520" height="2" fill="#D1D5DB"/>))}
        <rect x="60" y="60" width="160" height="18" rx="4" fill="#60A5FA"/>
        <rect x="160" y="110" width="120" height="18" rx="4" fill="#60A5FA"/>
        <rect x="120" y="160" width="220" height="18" rx="4" fill="#60A5FA"/>
        <rect x="300" y="210" width="140" height="18" rx="4" fill="#60A5FA"/>
        <rect x="380" y="260" width="140" height="18" rx="4" fill="#60A5FA"/>
        <rect className="pick" x="60" y="60" width="160" height="18" rx="4" fill="#22C55E" opacity="0"/>
        <rect className="pick" x="300" y="210" width="140" height="18" rx="4" fill="#22C55E" opacity="0"/>
        <rect className="pick" x="380" y="260" width="140" height="18" rx="4" fill="#22C55E" opacity="0"/>
      </svg>
    </div>
  );
};

export const MstThumb = () => {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const picks = el.querySelectorAll(".pick");
    let i = 0;
    const id = setInterval(() => {
      picks.forEach((p, idx) => p.setAttribute("stroke-opacity", idx <= i ? "1" : "0"));
      i = (i + 1) % picks.length;
    }, 500);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
      <svg ref={ref} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 338" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
        <rect width="600" height="338" fill="#ffffff"/>
        <circle cx="80" cy="80" r="12" fill="#EF4444"/>
        <circle cx="180" cy="60" r="12" fill="#EF4444"/>
        <circle cx="280" cy="120" r="12" fill="#EF4444"/>
        <circle cx="200" cy="200" r="12" fill="#EF4444"/>
        <circle cx="320" cy="220" r="12" fill="#EF4444"/>
        <circle cx="420" cy="140" r="12" fill="#EF4444"/>
        <line x1="80" y1="80" x2="180" y2="60" stroke="#9CA3AF" strokeWidth="2"/>
        <line x1="180" y1="60" x2="280" y2="120" stroke="#9CA3AF" strokeWidth="2"/>
        <line x1="280" y1="120" x2="200" y2="200" stroke="#9CA3AF" strokeWidth="2"/>
        <line x1="200" y1="200" x2="320" y2="220" stroke="#9CA3AF" strokeWidth="2"/>
        <line x1="320" y1="220" x2="420" y2="140" stroke="#9CA3AF" strokeWidth="2"/>
        <line className="pick" x1="80" y1="80" x2="280" y2="120" stroke="#22C55E" strokeWidth="4" strokeOpacity="0"/>
        <line className="pick" x1="180" y1="60" x2="420" y2="140" stroke="#22C55E" strokeWidth="4" strokeOpacity="0"/>
        <line className="pick" x1="200" y1="200" x2="320" y2="220" stroke="#22C55E" strokeWidth="4" strokeOpacity="0"/>
      </svg>
    </div>
  );
};

