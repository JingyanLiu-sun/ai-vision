import { getDictionary } from "@/app/dictionaries";
import { PageMeta } from "@/app/components/Meta";
import PageHeader from "@/app/components/PageHeader";
import CommonComments from "@/app/components/GiscusComments";
import BlogMarkdown from "@/app/components/BlogMarkdown";
import PlaceholderVisualization from "./content";

export async function generateMetadata(props) {
  const params = await props.params;
  const { lang } = params;
  const dict = await getDictionary(lang);
  return PageMeta({
    title: dict.seo.depthlimitedsearch?.title || "Depth-Limited Search",
    description: dict.seo.depthlimitedsearch?.description || "Placeholder demo for DLS",
    keywords: dict.seo.depthlimitedsearch?.keywords || "Depth-Limited Search, DFS",
    canonicalUrl: `https://gallery.selfboot.cn/${lang}/algorithms/depthlimitedsearch`,
    publishedDate: "2025-12-04T00:00:00.000Z",
    updatedDate: "2025-12-04T00:00:00.000Z",
  });
}

export default async function DepthLimitedSearchPage(props) {
  const params = await props.params;
  const { lang } = params;
  return (
    <>
      <PageHeader lang={lang} pathname={`/${lang}/algorithms/depthlimitedsearch`} title="Depth-Limited Search" />
      <PlaceholderVisualization lang={lang} />
      <BlogMarkdown lang={lang} directory="src/app/[lang]/algorithms/depthlimitedsearch" />
      <CommonComments lang={lang} />
    </>
  );
}

