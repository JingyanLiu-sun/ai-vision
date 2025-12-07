import { getDictionary } from "@/app/dictionaries";
import { PageMeta } from "@/app/components/Meta";
import PageHeader from "@/app/components/PageHeader";
import CommonComments from "@/app/components/GiscusComments";
import FactorialVisualization from "./content";

export async function generateMetadata(props) {
  const params = await props.params;
  const { lang } = params;
  const dict = await getDictionary(lang);
  return PageMeta({
    title: dict.seo.factorial?.title || "Nth Factorial",
    description: dict.seo.factorial?.description || "Interactive factorial recursion tree visualization",
    keywords: dict.seo.factorial?.keywords || "factorial, recursion, tree",
    canonicalUrl: `https://gallery.selfboot.cn/${lang}/algorithms/factorial`,
    publishedDate: "2025-12-04T00:00:00.000Z",
    updatedDate: "2025-12-04T00:00:00.000Z",
  });
}

export default async function FactorialPage(props) {
  const params = await props.params;
  const { lang } = params;
  return (
    <>
      <PageHeader 
        lang={lang} 
        pathname={`/${lang}/algorithms/factorial`} 
        title="Factorial Recursion Tree"
        docsPathname={`/${lang}/algorithms/factorial/docs`}
      />
      <FactorialVisualization lang={lang} />
      <CommonComments lang={lang} />
    </>
  );
}

