import { getDictionary } from "@/app/dictionaries";
import ConsistentHashRing from "./content";
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
    title: dict.seo.hashring.title,
    description: dict.seo.hashring.description,
    keywords: dict.seo.hashring.keywords,
    canonicalUrl: `https://gallery.selfboot.cn/${lang}/algorithms/hashring`,
    publishedDate: "2024-08-01T04:40:00.000Z",
    updatedDate: "2024-11-07T15:00:00.000Z",
  });
}

export default async function HashRingPage(props) {
  const params = await props.params;

  const {
    lang
  } = params;

  return (
    <>
      <PageHeader lang={lang} pathname={`/${lang}/algorithms/hashring`} />
      <ConsistentHashRing lang={lang} />
      <div className="mt-6 flex justify-center">
        <Link href={`/${lang}/algorithms/hashring/docs`} className="px-4 py-2 bg-gray-800 text-white rounded">View Docs</Link>
      </div>
      <CommonComments lang={lang} />
    </>
  );
}
