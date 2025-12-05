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
    title: dict.seo.bubblesort?.title || "Bubble Sort",
    description: dict.seo.bubblesort?.description || "Placeholder demo for Bubble Sort",
    keywords: dict.seo.bubblesort?.keywords || "Bubble Sort, sorting",
    canonicalUrl: `https://gallery.selfboot.cn/${lang}/algorithms/bubblesort`,
    publishedDate: "2025-12-04T00:00:00.000Z",
    updatedDate: "2025-12-04T00:00:00.000Z",
  });
}

export default async function BubbleSortPage(props) {
  const params = await props.params;
  const { lang } = params;
  return (
    <>
      <PageHeader lang={lang} pathname={`/${lang}/algorithms/bubblesort`} title="Bubble Sort" />
      <PlaceholderVisualization lang={lang} />
      <BlogMarkdown lang={lang} directory="src/app/[lang]/algorithms/bubblesort" />
      <CommonComments lang={lang} />
    </>
  );
}

