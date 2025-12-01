import { getDictionary } from "@/app/dictionaries";
import BloomFilterDemo from "./content";
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
    title: dict.seo.bloomfilter.title,
    description: dict.seo.bloomfilter.description,
    keywords: dict.seo.bloomfilter.keywords,
    canonicalUrl: `https://gallery.selfboot.cn/${lang}/algorithms/bloomfilter`,
    publishedDate: "2024-08-05T11:40:00.000Z",
    updatedDate: "2024-11-07T11:40:00.000Z",
  });
}

export default async function BloomFilterPage(props) {
  const params = await props.params;

  const {
    lang
  } = params;
  const dict = await getDictionary(lang);

  return (
    <>
      <PageHeader lang={lang} pathname={`/${lang}/algorithms/bloomfilter`} docsPathname={`/${lang}/algorithms/bloomfilter/docs`} />
      <BloomFilterDemo lang={lang} />
      <CommonComments lang={lang} />
    </>
  );
}
export const dynamic = 'force-dynamic';
