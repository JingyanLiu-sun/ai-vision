import { getDictionary } from "@/app/dictionaries";
import { PageMeta } from "@/app/components/Meta";
import PageHeader from "@/app/components/PageHeader";
import CommonComments from "@/app/components/GiscusComments";
import NQueensVisualization from "./content";

export async function generateMetadata(props) {
  const params = await props.params;
  const { lang } = params;
  const dict = await getDictionary(lang);
  return PageMeta({
    title: dict.seo.nqueens?.title || (dict.algorithms_categories?.["backtracking"] || "N-Queens"),
    description: dict.seo.nqueens?.description || "Interactive N-Queens backtracking visualization",
    keywords: dict.seo.nqueens?.keywords || "N-Queens, backtracking, visualization",
    canonicalUrl: `https://gallery.selfboot.cn/${lang}/algorithms/nqueens`,
    publishedDate: "2025-12-04T00:00:00.000Z",
    updatedDate: "2025-12-04T00:00:00.000Z",
  });
}

export default async function NQueensPage(props) {
  const params = await props.params;
  const { lang } = params;
  return (
    <>
      <PageHeader lang={lang} pathname={`/${lang}/algorithms/nqueens`} title="nqueens" docsPathname={`/${lang}/algorithms/nqueens/docs`} />
      <NQueensVisualization lang={lang} />
      <CommonComments lang={lang} />
    </>
  );
}
