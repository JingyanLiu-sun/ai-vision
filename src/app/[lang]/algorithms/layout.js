// 客户端组件，包含前端渲染需声明 "use client"
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
      {/* 非文档页面才添加背景 */}
      {!isDocs && (
        <div className="fixed inset-0 -z-10">
          <ParticleBackground />
        </div>
      )}
      <div className="relative z-10">{children}</div>
    </>
  );
}
