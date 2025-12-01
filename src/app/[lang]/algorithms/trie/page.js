import { getDictionary } from "@/app/dictionaries";
import TrieVisualization from "./content";
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
    title: dict.seo.trie.title,
    description: dict.seo.trie.description,
    keywords: dict.seo.trie.keywords,
    canonicalUrl: `https://gallery.selfboot.cn/${lang}/algorithms/trie`,
    publishedDate: "2024-07-22T02:00:00.000Z",
    updatedDate: "2024-11-05T12:00:00.000Z",
  });
}

export default async function TriePage(props) {
  const params = await props.params;

  const {
    lang
  } = params;
  const dict = await getDictionary(lang);

  return (
    <>
      <PageHeader lang={lang} pathname={`/${lang}/algorithms/trie`} docsPathname={`/${lang}/algorithms/trie/docs`} />
      <TrieVisualization lang={lang} />
      <CommonComments lang={lang} />
    </>
  );
}
