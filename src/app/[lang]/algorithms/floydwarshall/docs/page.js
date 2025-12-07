import { getDictionary } from "@/app/dictionaries";
import { PageMeta } from "@/app/components/Meta";
import PageHeader from "@/app/components/PageHeader";
import BlogMarkdown from "@/app/components/BlogMarkdown";
import CommonComments from "@/app/components/GiscusComments";

export async function generateMetadata(props) {
  const params = await props.params;
  const { lang } = params;
  const dict = await getDictionary(lang);
  return PageMeta({
    title: (dict.seo.floydwarshall?.title || "Floyd-Warshall") + " - Docs",
    description: dict.seo.floydwarshall?.description || "Documentation for Floyd-Warshall algorithm",
    keywords: dict.seo.floydwarshall?.keywords || "Floyd-Warshall, All-Pairs Shortest Paths, Documentation",
    canonicalUrl: `https://gallery.selfboot.cn/${lang}/algorithms/floydwarshall/docs`,
    publishedDate: "2025-12-07T00:00:00.000Z",
    updatedDate: "2025-12-07T00:00:00.000Z",
  });
}

export default async function FloydWarshallDocsPage(props) {
  const params = await props.params;
  const { lang } = params;
  return (
    <>
      <PageHeader 
        lang={lang} 
        pathname={`/${lang}/algorithms/floydwarshall/docs`} 
        title="Floyd-Warshall Docs" 
      />
      <BlogMarkdown lang={lang} directory="src/app/[lang]/algorithms/floydwarshall" />
      <CommonComments lang={lang} />
    </>
  );
}

