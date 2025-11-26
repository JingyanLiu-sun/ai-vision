import HanoiTower from "./content";
import { PageMeta } from "@/app/components/Meta";
import PageHeader from "@/app/components/PageHeader";
import CommonComments from "@/app/components/GiscusComments";
import { getDictionary } from "@/app/dictionaries";

export async function generateMetadata(props) {
  const params = await props.params;

  const {
    lang
  } = params;

  const dict = await getDictionary(lang);
  return PageMeta({
    title: dict.seo.hanoitower.title,
    description: dict.seo.hanoitower.description,
    keywords: dict.seo.hanoitower.keywords,
    canonicalUrl: `https://gallery.selfboot.cn/${lang}/algorithms/hanoitower`,
    publishedDate: "2024-08-12T04:00:00.000Z",
    updatedDate: "2024-12-25T10:00:00.000Z",
  });
}

export default async function HanoiTowerPage(props) {
  const params = await props.params;

  const {
    lang
  } = params;
  const dict = await getDictionary(lang);

  return (
    <>
      <PageHeader lang={lang} pathname={`/${lang}/algorithms/hanoitower`} />
      <HanoiTower lang={lang} />
      <div className="mt-6 flex justify-center">
        <a href={`/${lang}/algorithms/hanoitower/docs`} className="px-4 py-2 bg-gray-800 text-white rounded">{dict.view_docs || "View Docs"}</a>
      </div>
      <CommonComments lang={lang} />
    </>
  );
}
