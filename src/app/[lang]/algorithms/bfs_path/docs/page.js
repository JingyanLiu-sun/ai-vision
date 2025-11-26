import BlogMarkdown from "@/app/components/BlogMarkdown";
import PageHeader from "@/app/components/PageHeader";

export default async function BFSPathDocsPage(props) {
  const params = await props.params;
  const { lang } = params;
  return (
    <>
      <PageHeader lang={lang} pathname={`/${lang}/algorithms/bfs_path/docs`} />
      <div className="max-w-5xl mx-auto px-4">
        <BlogMarkdown lang={lang} directory="src/app/[lang]/algorithms/bfs_path" />
      </div>
    </>
  );
}
