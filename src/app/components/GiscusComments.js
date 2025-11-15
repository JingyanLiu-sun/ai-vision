'use client';

import React from "react";
import Giscus from "@giscus/react";

function GiscusComments({ lang }) {
  return (
    <Giscus
      repo="JingyanLiu-sun/ai-vision"
      repoId="R_kgDOQU5bjA"
      category="Q&A"
      categoryId="DIC_kwDOQU5bjM4Cxv_D"
      mapping="pathname"
      reactionsEnabled="1"
      emitMetadata="0"
      inputPosition="bottom"
      theme="preferred_color_scheme"
      lang={lang}
    />
  );
}

const langMap = {
  zh: "zh-CN",
  en: "en",
};

export default function CommonComments({ lang }) {
  return (
    <div className="mt-8">
      <GiscusComments lang={langMap[lang] || "en"} />
    </div>
  );
}