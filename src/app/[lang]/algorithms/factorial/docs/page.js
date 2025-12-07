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
    title: dict.seo.factorial?.docsTitle || "Factorial Algorithm Documentation",
    description: dict.seo.factorial?.docsDescription || "Learn how the factorial recursion algorithm works with step-by-step explanation.",
    keywords: dict.seo.factorial?.docsKeywords || "factorial, recursion, algorithm, documentation",
    canonicalUrl: `https://gallery.selfboot.cn/${lang}/algorithms/factorial/docs`,
    publishedDate: "2025-12-07T00:00:00.000Z",
    updatedDate: "2025-12-07T00:00:00.000Z",
  });
}

export default async function FactorialDocsPage(props) {
  const params = await props.params;
  const { lang } = params;
  return (
    <>
      <PageHeader lang={lang} pathname={`/${lang}/algorithms/factorial/docs`} title="Factorial Algorithm Documentation" />
      <BlogMarkdown lang={lang} directory="src/app/[lang]/algorithms/factorial" />
      <CommonComments lang={lang} />
    </>
  );
}