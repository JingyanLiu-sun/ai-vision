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
    title: dict.seo.quicksort?.title || "Quicksort",
    description: dict.seo.quicksort?.description || "Placeholder demo for Quicksort",
    keywords: dict.seo.quicksort?.keywords || "Quicksort, divide and conquer",
    canonicalUrl: `https://gallery.selfboot.cn/${lang}/algorithms/quicksort`,
    publishedDate: "2025-12-04T00:00:00.000Z",
    updatedDate: "2025-12-04T00:00:00.000Z",
  });
}

export default async function QuicksortPage(props) {
  const params = await props.params;
  const { lang } = params;
  return (
    <>
      <PageHeader lang={lang} pathname={`/${lang}/algorithms/quicksort`} title="Quicksort" />
      <PlaceholderVisualization lang={lang} />
      <BlogMarkdown lang={lang} directory="src/app/[lang]/algorithms/quicksort" />
      <CommonComments lang={lang} />
    </>
  );
}

