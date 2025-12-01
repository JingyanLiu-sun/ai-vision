import { getDictionary } from "@/app/dictionaries";
import HeapVisualization from "./content";
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
  return PageMeta({
    title: dict.seo.heap.title,
    description: dict.seo.heap.description,
    keywords: dict.seo.heap.keywords,
    canonicalUrl: `https://gallery.selfboot.cn/${lang}/algorithms/heap`,
    publishedDate: "2024-07-04T02:00:00.000Z",
    updatedDate: "2024-11-04T02:00:00.000Z",
  });
}

export default async function HeapPage(props) {
  const params = await props.params;

  const {
    lang
  } = params;
  const dict = await getDictionary(lang);

  return (
    <>
      <PageHeader lang={lang} pathname={`/${lang}/algorithms/heap`} docsPathname={`/${lang}/algorithms/heap/docs`} />
      <HeapVisualization lang={lang} />
      <CommonComments lang={lang} />
    </>
  );
}
export const dynamic = 'auto';
