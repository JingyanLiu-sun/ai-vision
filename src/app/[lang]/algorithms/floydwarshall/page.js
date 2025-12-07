import { getDictionary } from "@/app/dictionaries";
import { PageMeta } from "@/app/components/Meta";
import PageHeader from "@/app/components/PageHeader";
import CommonComments from "@/app/components/GiscusComments";
import PlaceholderVisualization from "./content";

export async function generateMetadata(props) {
  const params = await props.params;
  const { lang } = params;
  const dict = await getDictionary(lang);
  return PageMeta({
    title: dict.seo.floydwarshall?.title || "Floyd-Warshall Shortest Paths",
    description: dict.seo.floydwarshall?.description || "Placeholder demo for Floyd-Warshall",
    keywords: dict.seo.floydwarshall?.keywords || "Floyd-Warshall, dynamic programming",
    canonicalUrl: `https://gallery.selfboot.cn/${lang}/algorithms/floydwarshall`,
    publishedDate: "2025-12-04T00:00:00.000Z",
    updatedDate: "2025-12-04T00:00:00.000Z",
  });
}

export default async function FloydWarshallPage(props) {
  const params = await props.params;
  const { lang } = params;
  return (
    <>
      <PageHeader 
        lang={lang} 
        pathname={`/${lang}/algorithms/floydwarshall`} 
        title="Floyd-Warshall Shortest Paths"
        docsPathname={`/${lang}/algorithms/floydwarshall/docs`} 
      />
      <PlaceholderVisualization lang={lang} />
      <CommonComments lang={lang} />
    </>
  );
}
