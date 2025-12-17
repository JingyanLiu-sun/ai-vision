// 语言级布局：为 `/{lang}` 下的所有页面提供统一头部、导航、i18n 与分析脚本
// 注意：这是服务器组件（无需 `use client`），可在服务端获取词典与生成 Metadata
import React from "react";
// 全局样式与第三方样式：
// - globals.css：Tailwind 基础层、Markdown/代码高亮与主题色覆盖
// - FontAwesome：仅加载样式，避免运行时初始化造成闪烁
import "@/app/globals.css";
import Navigation from "@/app/components/Navigation";
import "@fortawesome/fontawesome-svg-core/styles.css";
// i18n（服务端获取词典，客户端通过 Provider 下发到子树）
import { getDictionary } from "@/app/i18n/server";
import { I18nProvider } from "@/app/i18n/client";
// 分析与脚本：Google Analytics、运行时注入的第三方脚本、Vercel 性能采集
import { GoogleAnalytics } from "@next/third-parties/google";
import Script from 'next/script';
import { SpeedInsights } from "@vercel/speed-insights/next"
export const runtime = "nodejs";
import { getPrisma } from "@/app/lib/prisma";


// 受支持语言列表：用于静态参数生成（SSG）与中间件校验
const SUPPORTED_LANGUAGES = ['en', 'zh'];
// 导航展示的一级分类（当前站点突出算法分区）
const CATEGORIES = ["algorithms"];

// Next.js SSG：为语言维度生成静态参数，避免运行时 404
export function generateStaticParams() {
  return SUPPORTED_LANGUAGES.map(lang => ({ lang }));
}

export default async function Layout(props) {
  const params = await props.params;

  const {
    lang,
    slug = []
  } = params;

  const {
    children
  } = props;

  // 加载当前语言词典，供客户端通过 I18nProvider 使用
  const dict = await getDictionary(lang);
  // 计算当前路径，用于导航组件高亮与语言切换生成目标链接
  const pathname = `/${lang}/${slug.join('/')}`;

  // RSS 订阅地址：中文使用默认 `rss.xml`，其他语言使用 `rss-{lang}.xml`
  const rssFileName = lang === 'zh' ? 'rss.xml' : `rss-${lang}.xml`;

  return (
    <html lang={lang}>
      <head>
        {/* RSS 备用链接：供订阅工具抓取最新文章与更新 */}
        <link
          rel="alternate"
          type="application/rss+xml"
          title={`RSS Feed for AI Gallery`}
          href={`https://gallery.selfboot.cn/${rssFileName}`}
        />

        {/* 站点图标与 PWA 资源（Manifest） */}
        {/* Favicon links Start */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        {/* <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" /> */}
        {/* <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" /> */}
        <link rel="apple-touch-icon" sizes="192x192" href="/logo192.png" />
        <link rel="manifest" href="/manifest.json" />
        {/* Favicon links End */}

        {/* 性能与行为分析（Microsoft Clarity） */}
        <Script
          id="microsoft-clarity"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "hvful8k59h");
            `,
          }}
        />
      </head>
      <body>
        <div className="flex flex-col min-h-screen">
          {/* 顶部导航：语言切换、分类入口与用户菜单 */}
          <nav className="bg-white shadow-md">
            <div className="container mx-auto px-2 sm:px-4 py-3">
              <div className="flex flex-col sm:flex-row justify-between items-center">
                {/* Navigation 接收分类、语言与当前路径，负责渲染菜单与高亮 */}
                <Navigation categories={CATEGORIES} lang={lang} pathname={pathname} />
              </div>
            </div>
          </nav>
          {/* 向子树注入词典，实现客户端多语言渲染与占位符替换 */}
          <I18nProvider initialDictionary={dict}>
            <main className="flex-grow container mx-auto mt-6 px-2 sm:px-4"> {children} </main>
          </I18nProvider>
        </div>
        {/* Vercel 性能采集：记录页面加载、交互指标 */}
        <SpeedInsights/>
      </body>
      {/* Google Analytics：站点访问统计 */}
      <GoogleAnalytics gaId="G-Y4WD2DT404" />
      {/* <WebVitals /> */}
      {/* Umami：隐私友好的分析脚本，限定域名 */}
      <Script
        src="https://cloud.umami.is/script.js"
        data-website-id="d765a8dd-62fd-4096-8429-85beb1242091"
        strategy="afterInteractive"
        data-domains="gallery.selfboot.cn"
      />
      {/* Cloudflare Insights：前端性能与错误采集 */}
      <Script
        src="https://static.cloudflareinsights.com/beacon.min.js"
        data-cf-beacon='{"token": "29fc062c6fbd41318027e723a3589333"}'
        strategy="afterInteractive"
      />
    </html>
  );
}
  getPrisma();
