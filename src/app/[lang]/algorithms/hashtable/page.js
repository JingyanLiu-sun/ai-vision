import { getDictionary } from "@/app/dictionaries";
import HashTable from "./content";
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
    title: dict.seo.hashtable.title,
    description: dict.seo.hashtable.description,
    keywords: dict.seo.hashtable.keywords,
    canonicalUrl: `https://gallery.selfboot.cn/${lang}/algorithms/hashtable`,
    publishedDate: "2024-07-27T05:30:00.000Z",
    updatedDate: "2024-11-05T07:00:00.000Z",
  });
}

export default async function HashTablePage(props) {
  const params = await props.params;

  const {
    lang
  } = params;

  return (
    <>
      <PageHeader lang={lang} pathname={`/${lang}/algorithms/hashtable`} />
      <HashTable lang={lang} />
      <div className="mt-6 flex justify-center">
        <Link href={`/${lang}/algorithms/hashtable/docs`} className="px-4 py-2 bg-gray-800 text-white rounded">View Docs</Link>
      </div>
      <CommonComments lang={lang} />
    </>
  );
}
