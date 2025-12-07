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
    title: (dict.seo.quicksort?.title || "Quick Sort") + " - Docs",
    description: dict.seo.quicksort?.description || "Documentation for Quick Sort algorithm",
    keywords: dict.seo.quicksort?.keywords || "Quick Sort, Sorting Algorithms, Documentation",
    canonicalUrl: `https://gallery.selfboot.cn/${lang}/algorithms/quicksort/docs`,
    publishedDate: "2025-12-07T00:00:00.000Z",
    updatedDate: "2025-12-07T00:00:00.000Z",
  });
}

export default async function QuickSortDocsPage(props) {
  const params = await props.params;
  const { lang } = params;
  return (
    <>
      <PageHeader 
        lang={lang} 
        pathname={`/${lang}/algorithms/quicksort/docs`} 
        title="Quick Sort Docs" 
      />
      <BlogMarkdown lang={lang} directory="src/app/[lang]/algorithms/quicksort" />
      <CommonComments lang={lang} />
    </>
  );
}
