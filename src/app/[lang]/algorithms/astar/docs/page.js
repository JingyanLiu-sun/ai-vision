import BlogMarkdown from "@/app/components/BlogMarkdown";
import PageHeader from "@/app/components/PageHeader";

export default async function AstarDocsPage(props) {
  const params = await props.params;
  const { lang } = params;
  return (
    <>
      <PageHeader lang={lang} pathname={`/${lang}/algorithms/astar/docs`} />
      <div className="max-w-5xl mx-auto px-4">
        <BlogMarkdown lang={lang} directory="src/app/[lang]/algorithms/astar" />
      </div>
    </>
  );
}
