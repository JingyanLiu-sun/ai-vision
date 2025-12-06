import { getDictionary } from "@/app/dictionaries";
import { PageMeta } from "@/app/components/Meta";
import PageHeader from "@/app/components/PageHeader";
import CommonComments from "@/app/components/GiscusComments";
import KnightsTourVisualization from "./content";

export async function generateMetadata(props) {
  const params = await props.params;
  const { lang } = params;
  const dict = await getDictionary(lang);
  return PageMeta({
    title: dict.seo.knightstour?.title || "Knight's Tour Problem",
    description: dict.seo.knightstour?.description || "Placeholder demo for Knight's Tour visualization",
    keywords: dict.seo.knightstour?.keywords || "Knight's Tour, backtracking",
    canonicalUrl: `https://gallery.selfboot.cn/${lang}/algorithms/knightstour`,
    publishedDate: "2025-12-04T00:00:00.000Z",
    updatedDate: "2025-12-04T00:00:00.000Z",
  });
}

export default async function KnightsTourPage(props) {
  const params = await props.params;
  const { lang } = params;
  return (
    <>
      <PageHeader lang={lang} pathname={`/${lang}/algorithms/knightstour`} title="Knight's Tour Problem" docsPathname={`/${lang}/algorithms/knightstour/docs`} />
      <KnightsTourVisualization lang={lang} />
      <CommonComments lang={lang} />
    </>
  );
}
