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
    title: dict.seo.nqueens?.title || "N-Queens Problem",
    description: dict.seo.nqueens?.description || "Placeholder demo for N-Queens visualization",
    keywords: dict.seo.nqueens?.keywords || "N-Queens, backtracking",
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
      <PageHeader lang={lang} pathname={`/${lang}/algorithms/nqueens`} title="N-Queens Problem" />
      <PlaceholderVisualization lang={lang} />
      <BlogMarkdown lang={lang} directory="src/app/[lang]/algorithms/nqueens" />
      <CommonComments lang={lang} />
    </>
  );
}

