import { getDictionary } from "@/app/dictionaries";
import AStarPathFind from "./content";
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
    title: dict.seo.astar.title,
    description: dict.seo.astar.description,
    keywords: dict.seo.astar.keywords,
    canonicalUrl: `https://gallery.selfboot.cn/${lang}/algorithms/astar`,
    publishedDate: "2024-07-16T02:00:00.000Z",
    updatedDate: "2024-07-16T02:00:00.000Z",
  });
}

export default async function AstarPage(props) {
  const params = await props.params;

  const {
    lang
  } = params;

  return (
    <>
      <PageHeader lang={lang} pathname={`/${lang}/algorithms/astar`} />
      <AStarPathFind lang={lang} />
      <div className="mt-6 flex justify-center">
        <Link href={`/${lang}/algorithms/astar/docs`} className="px-4 py-2 bg-gray-800 text-white rounded">View Docs</Link>
      </div>
      <CommonComments lang={lang} />
    </>
  );
}
