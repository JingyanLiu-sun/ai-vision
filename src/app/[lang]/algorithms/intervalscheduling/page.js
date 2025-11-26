import { getDictionary } from "@/app/dictionaries";
import { PageMeta } from "@/app/components/Meta";
import PageHeader from "@/app/components/PageHeader";
import CommonComments from "@/app/components/GiscusComments";
import BlogMarkdown from "@/app/components/BlogMarkdown";
import IntervalSchedulingVisualization from "./content";

export async function generateMetadata(props) {
  const params = await props.params;
  const { lang } = params;
  const dict = await getDictionary(lang);
  return PageMeta({
    title: dict.seo.intervalscheduling.title,
    description: dict.seo.intervalscheduling.description,
    keywords: dict.seo.intervalscheduling.keywords,
    canonicalUrl: `https://gallery.selfboot.cn/${lang}/algorithms/intervalscheduling`,
    publishedDate: "2025-11-20T00:00:00.000Z",
    updatedDate: "2025-11-20T00:00:00.000Z",
  });
}

export default async function IntervalSchedulingPage(props) {
  const params = await props.params;
  const { lang } = params;
  return (
    <>
      <PageHeader lang={lang} pathname={`/${lang}/algorithms/intervalscheduling`} title="intervalscheduling" />
      <IntervalSchedulingVisualization lang={lang} />
      <BlogMarkdown lang={lang} directory="src/app/[lang]/algorithms/intervalscheduling" />
      <CommonComments lang={lang} />
    </>
  );
}
