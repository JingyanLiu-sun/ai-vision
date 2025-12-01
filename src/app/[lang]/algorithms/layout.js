"use client";
import React from "react";
import ParticleBackground from "../../components/ParticleBackground";
import { usePathname } from "next/navigation";

export default function Layout(props) {
  const { children } = props;
  const pathname = usePathname();
  const isDocs = pathname?.includes("/docs");

  return (
    <>
      {!isDocs && (
        <div className="fixed inset-0 -z-10">
          <ParticleBackground />
        </div>
      )}
      <div className="relative z-10">{children}</div>
    </>
  );
}
