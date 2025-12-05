import { getDictionary } from "@/app/dictionaries";
import { PageMeta } from "@/app/components/Meta";

// 首页元数据（SSG），用于 SEO 优化与社交媒体分享
export async function generateMetadata(props) {
  const params = await props.params;

  const {
    lang
  } = params;

  const dict = await getDictionary(lang);
  return PageMeta({
    title: dict.seo.index.title,
    description: dict.seo.index.description,
    keywords: dict.seo.index.keywords,
    canonicalUrl: `https://gallery.selfboot.cn/${lang}`,
    publishedDate: "2024-06-15T02:00:00.000Z",
    updatedDate: "2024-06-15T02:00:00.000Z",
  });
}

// 首页内容（SSG），用于展示算法专区与文档中心
export default async function Home(props) {
  const params = await props.params;

  const {
    lang
  } = params;

  const dict = await getDictionary(lang);
  return (
    // redriect now
    <></>
  );
}
