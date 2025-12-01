import { getDictionary } from "@/app/dictionaries";
import BinarySearchTreeVisualization from "./content";
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
    title: dict.seo.binarysearchtree.title,
    description: dict.seo.binarysearchtree.description,
    keywords: dict.seo.binarysearchtree.keywords,
    canonicalUrl: `https://gallery.selfboot.cn/${lang}/algorithms/binarysearchtree`,
    publishedDate: "2024-08-22T02:00:00.000Z",
    updatedDate: "2024-11-08T02:00:00.000Z",
  });
}

export default async function BinarySearchTreePage(props) {
  const params = await props.params;

  const {
    lang
  } = params;
  const dict = await getDictionary(lang);

  return (
    <>
      <PageHeader lang={lang} pathname={`/${lang}/algorithms/binarysearchtree`} docsPathname={`/${lang}/algorithms/binarysearchtree/docs`} />
      <BinarySearchTreeVisualization lang={lang} />
      <CommonComments lang={lang} />
    </>
  );
}
