import BlogMarkdown from "@/app/components/BlogMarkdown";
import PageHeader from "@/app/components/PageHeader";

export default async function HeapDocsPage(props) {
  const params = await props.params;
  const { lang } = params;
  return (
    <>
      <PageHeader lang={lang} pathname={`/${lang}/algorithms/heap/docs`} />
      <div className="max-w-5xl mx-auto px-4">
        <BlogMarkdown lang={lang} directory="src/app/[lang]/algorithms/heap" />
      </div>
    </>
  );
}
