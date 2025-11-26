import { getDictionary } from "@/app/dictionaries";
import DijkstraVisualization from "./content";
import { PageMeta } from "@/app/components/Meta";
import PageHeader from "@/app/components/PageHeader";
import CommonComments from "@/app/components/GiscusComments";
import Link from "next/link";

export async function generateMetadata(props) {
  const params = await props.params;

  const {
    lang
  } = params;

  const dict = await getDictionary(lang);
  return {
    ...PageMeta({
      title: dict.seo.dijkstra.title,
      description: dict.seo.dijkstra.description,
      keywords: dict.seo.dijkstra.keywords,
      publishedDate: "2024-07-16T02:00:00.000Z",
      updatedDate: "2024-11-22T04:00:00.000Z",
    }),
    alternates: {
      canonical: `https://gallery.selfboot.cn/${lang}/algorithms/dijkstra`,
      languages: {
        "en": "https://gallery.selfboot.cn/en/algorithms/dijkstra",
        "zh-CN": "https://gallery.selfboot.cn/zh/algorithms/dijkstra",
        "x-default": "https://gallery.selfboot.cn/en/algorithms/dijkstra",
      },
    },
  };
}

export default async function DijkstraPage(props) {
  const params = await props.params;

  const {
    lang
  } = params;

  return (
    <>
      <PageHeader lang={lang} pathname={`/${lang}/algorithms/dijkstra`} />
      <DijkstraVisualization lang={lang} />
      <div className="mt-6 flex justify-center">
        <Link href={`/${lang}/algorithms/dijkstra/docs`} className="px-4 py-2 bg-gray-800 text-white rounded">View Docs</Link>
      </div>
      <CommonComments lang={lang} />
    </>
  );
}
