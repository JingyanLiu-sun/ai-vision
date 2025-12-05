import React from "react";
import AlgorithmCategoryGrid from "@/app/components/AlgorithmCategoryGrid";
import { getDictionary } from "@/app/dictionaries";
import { PageMeta } from "@/app/components/Meta";

export async function generateMetadata(props) {
  const params = await props.params;

  const {
    lang
  } = params;

  const dict = await getDictionary(lang);

  return PageMeta({
    title: dict.seo.algorithms.title,
    description: dict.seo.algorithms.description,
    keywords: dict.seo.algorithms.keywords,
    canonicalUrl: `https://gallery.selfboot.cn/${lang}/algorithms`,
    publishedDate: "2024-07-12T02:00:00.000Z",
    updatedDate: "2024-11-03T10:00:00.000Z",
  });
}

export default async function Algorithms(props) {
  const params = await props.params;

  const {
    lang
  } = params;

  const dict = await getDictionary(lang);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">{dict.algorithms_title}</h1>
      {/* 算法分类网格 */}
      <AlgorithmCategoryGrid lang={lang} />
    </div>
  );
}
