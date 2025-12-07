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
    title: (dict.seo.bubblesort?.title || "Bubble Sort") + " - Docs",
    description: dict.seo.bubblesort?.description || "Documentation for Bubble Sort algorithm",
    keywords: dict.seo.bubblesort?.keywords || "Bubble Sort, Sorting Algorithms, Documentation",
    canonicalUrl: `https://gallery.selfboot.cn/${lang}/algorithms/bubblesort/docs`,
    publishedDate: "2025-12-07T00:00:00.000Z",
    updatedDate: "2025-12-07T00:00:00.000Z",
  });
}

export default async function BubbleSortDocsPage(props) {
  const params = await props.params;
  const { lang } = params;
  return (
    <>
      <PageHeader 
        lang={lang} 
        pathname={`/${lang}/algorithms/bubblesort/docs`} 
        title="Bubble Sort Docs" 
      />
      <BlogMarkdown lang={lang} directory="src/app/[lang]/algorithms/bubblesort" />
      <CommonComments lang={lang} />
    </>
  );
}
