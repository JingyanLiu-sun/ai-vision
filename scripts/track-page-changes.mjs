import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const DOMAIN = "https://gallery.selfboot.cn";
const LANGUAGES = ["en", "zh"];

async function getRecentPageUrls() {
  const { globby } = await import("globby");
  let urls = new Set();
  const today = new Date().toISOString().split('T')[0]; // 获取今天的日期 YYYY-MM-DD

  for (const lang of LANGUAGES) {
    // 获取基础页面
    const pages = await globby([
      `src/app/[lang]/**/page.js`,
      `!src/app/[lang]/api`,
      `!src/app/[lang]/blog/[slug]`,
    ]);

    // 处理基础页面
    for (const page of pages) {
      const content = fs.readFileSync(page, "utf8");
      const updatedDateMatch = content.match(/updatedDate:\s*"([^"]+)"/);
      const updatedDate = updatedDateMatch ? updatedDateMatch[1].split('T')[0] : null;
      // 只处理今天更新的页面
      if (updatedDate === today || updatedDate === null) {
        const route = page
          .replace("src/app/[lang]", "")
          .replace("/page.js", "")
          .replace("/index", "");
        // 获取博客文章
        const blogPosts = await globby([`src/posts/*/${lang}.md`]);
        for (const post of blogPosts) {
          const content = fs.readFileSync(post, "utf8");
          const { data } = matter(content);
          const postDate = new Date(data.date).toISOString().split('T')[0];

          // 只处理今天发布的文章
          if (postDate === today) {
            const slug = path.basename(path.dirname(post));
            urls.add(`${DOMAIN}/${lang}/blog/${slug}`);
          }
        }
      }

      const recentUrls = Array.from(urls);
      if (recentUrls.length > 0) {
        console.log('今天有更新的页面');
      } else {
        console.log('今天没有更新的页面');
      }

      return recentUrls;
    }
  }
}

export { getRecentPageUrls }