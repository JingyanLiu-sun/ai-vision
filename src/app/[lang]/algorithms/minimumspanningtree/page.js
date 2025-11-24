import { getDictionary } from "@/app/dictionaries";
import { PageMeta } from "@/app/components/Meta";
import PageHeader from "@/app/components/PageHeader";
import CommonComments from "@/app/components/GiscusComments";
import BlogMarkdown from "@/app/components/BlogMarkdown";
import MinimumSpanningTreeVisualization from "./content";

export async function generateMetadata(props) {
  const params = await props.params;
  const { lang } = params;
  const dict = await getDictionary(lang);
  return PageMeta({
    title: dict.seo.minimumspanningtree.title,
    description: dict.seo.minimumspanningtree.description,
    keywords: dict.seo.minimumspanningtree.keywords,
    canonicalUrl: `https://gallery.selfboot.cn/${lang}/algorithms/minimumspanningtree`,
    publishedDate: "2025-11-20T00:00:00.000Z",
    updatedDate: "2025-11-20T00:00:00.000Z",
  });
}

export default async function MinimumSpanningTreePage(props) {
  const params = await props.params;
  const { lang } = params;
  return (
    <>
      <PageHeader lang={lang} pathname={`/${lang}/algorithms/minimumspanningtree`} />
      <MinimumSpanningTreeVisualization lang={lang} />
      {/* Markdown is optional; skip if file missing to avoid build errors */}
      <BlogMarkdown lang={lang} directory="src/app/[lang]/algorithms/minimumspanningtree" />
      <CommonComments lang={lang} />
    </>
  );
}
