"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function BackgroundController() {
  const pathname = usePathname();

  useEffect(() => {
    const isAlgorithms = /\/algorithms(\/|$)/.test(pathname || "");
    if (isAlgorithms) {
      document.body.classList.add("algorithms-bg");
    } else {
      document.body.classList.remove("algorithms-bg");
    }
    return () => {
      document.body.classList.remove("algorithms-bg");
    };
  }, [pathname]);

  return null;
}
