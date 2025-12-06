import { getDictionary } from "@/app/dictionaries";
import { PageMeta } from "@/app/components/Meta";
import PageHeader from "@/app/components/PageHeader";
import CommonComments from "@/app/components/GiscusComments";
// import BlogMarkdown from "@/app/components/BlogMarkdown"; // Removed as requested to match Knight's Tour pattern
import DepthLimitedSearchVisualization from "./content";

export async function generateMetadata(props) {
  const params = await props.params;
  const { lang } = params;
  const dict = await getDictionary(lang);
  return PageMeta({
    title: dict.seo.depthlimitedsearch?.title || "Depth-Limited Search",
    description: dict.seo.depthlimitedsearch?.description || "Interactive visualization of Depth-Limited Search algorithm",
    keywords: dict.seo.depthlimitedsearch?.keywords || "Depth-Limited Search, DLS, Algorithm Visualization",
    canonicalUrl: `https://gallery.selfboot.cn/${lang}/algorithms/depthlimitedsearch`,
    publishedDate: "2025-12-04T00:00:00.000Z",
    updatedDate: "2025-12-06T00:00:00.000Z",
  });
}

export default async function DepthLimitedSearchPage(props) {
  const params = await props.params;
  const { lang } = params;
  return (
    <>
      <PageHeader 
        lang={lang} 
        pathname={`/${lang}/algorithms/depthlimitedsearch`} 
        title="Depth-Limited Search" 
        docsPathname={`/${lang}/algorithms/depthlimitedsearch/docs`}
      />
      <DepthLimitedSearchVisualization lang={lang} />
      {/* BlogMarkdown removed, docs entry via PageHeader */}
      <CommonComments lang={lang} />
    </>
  );
}
