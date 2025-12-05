import React from "react";

/*
E-Library Main Interface React Component (Tailwind CSS)
- Responsive layout for Desktop, Tablet, Mobile
- Sections: Top Nav (logo, search), Latest Arrivals, My Collection, Help Center, Filters, Footer
- Includes accessible attributes, reduced cognitive load, clear feedback, consistency, and error prevention patterns.

How to use:
- This is a single-file React component. Drop into a Create React App / Vite + React project with Tailwind CSS configured.
- Default export: ELibraryUI
*/

export default function ELibraryUI() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/**
       * 页面根容器样式说明：
       * - min-h-screen：最小高度占满视口，避免内容过少时出现大面积空白
       * - bg-slate-50：浅灰背景提升层次与可读性
       * - text-slate-800：全局文字颜色较深，保证对比度与可读性
       */}
      {/* Top Navigation */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        {/**
         * 顶部导航样式说明：
         * - bg-white：白色背景提升内容对比
         * - shadow-sm：轻微阴影，使导航与主体分层
         * - sticky top-0：始终固定在页面顶部，滚动时保持可见
         * - z-40：提高层级，避免被其它元素遮挡
         */}
        <div className="max-w-max mx-auto px-4 py-3 flex items-center gap-4">
          {/**
           * 导航内部容器：
           * - max-w-max：根据内容自适应宽度，避免大屏视觉拥挤
           * - mx-auto：居中对齐
           * - px-4 py-3：内边距，提升触控与视觉空间
           * - flex items-center：水平布局并垂直居中
           * - gap-4：元素间距
           */}
          <div className="flex items-center gap-3">
            {/**
             * Logo与站点信息：
             * - flex items-center gap-3：水平排列并设置间距
             */}
            <div className="w-10 h-10 rounded-md bg-indigo-600 flex items-center justify-center text-white font-bold text-lg" aria-hidden>
              {/**
               * Logo方块：
               * - w-10 h-10：固定尺寸，保证一致的视觉锚点
               * - rounded-md：圆角，提升亲和力
               * - bg-indigo-600：主色背景
               * - flex items-center justify-center：居中图标文字
               * - text-white font-bold text-lg：突出识别度
               * - aria-hidden：装饰性元素不参与辅助功能描述
               */}
              ML
            </div>
            <div>
              <div className="font-semibold">Metropolitan Library</div>
              <div className="text-xs text-slate-500">E-Library</div>
            </div>
          </div>

          {/* Search bar - large screens */}
          <div className="flex-1">
            {/**
             * 搜索区：
             * - flex-1：在导航中占据剩余空间，保证输入框宽度
             */}
            <label htmlFor="search" className="sr-only">Search library</label>
            <div className="relative">
              {/**
               * relative：为内部绝对定位的图标提供定位上下文
               */}
               {/**
                 * 输入框样式：
                 * - w-full：充满容器宽度
                 * - border：可见边框，提升可发现性
                 * - rounded-md：圆角，提升亲和度
                 * - py-2 px-3：舒适的触控尺寸与内边距
                 * - pl-10：为左侧搜索图标预留空间
                 * - focus:outline-none：移除默认轮廓
                 * - focus:ring-2 focus:ring-indigo-300：焦点可视化，高对比度且与品牌色一致
                 */}
              <input
                id="search"
                type="search"
                placeholder="Search e-books, journals, audiobooks, authors..."
                className="w-full border rounded-md py-2 px-3 pl-10 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                
                aria-label="Search library resources"
                aria-describedby="search-help"
                onKeyDown={(e) => {
                  // simple keyboard feedback: pressing Enter will show a subtle animation (simulate search)
                  if (e.key === "Enter") {
                    e.currentTarget.classList.add("animate-pulse");
                    setTimeout(() => e.currentTarget.classList.remove("animate-pulse"), 600);
                  }
                }}
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">🔍</div>
              {/**
               * 图标定位：
               * - absolute：相对父容器绝对定位
               * - left-3：靠左内边距位置
               * - top-1/2 -translate-y-1/2：垂直居中对齐输入框
               * - text-slate-400：次要信息颜色，避免与输入冲突
               */}
            </div>
            <p id="search-help" className="sr-only">Type keywords and press Enter to search. Use filters to refine results.</p>
          </div>

          {/* Quick links */}
          <nav className="hidden sm:flex items-center gap-3">
            {/**
             * 快捷链接：
             * - hidden sm:flex：在小屏隐藏，>=sm显示为横向排列
             * - items-center gap-3：居中与间距
             */}
            <button className="py-2 px-3 rounded-md hover:bg-slate-100">My Collection</button>
            <button className="py-2 px-3 rounded-md hover:bg-slate-100">Help Center</button>
            <button className="py-2 px-3 rounded-md border bg-indigo-600 text-white">Sign In</button>
          </nav>

          {/* Mobile menu button */}
          <div className="sm:hidden">
            {/**
             * 移动端菜单按钮：
             * - sm:hidden：在小屏显示，>=sm隐藏
             * - p-2 rounded-md bg-white border：良好可点击区域与视觉分隔
             */}
            <button aria-label="Open menu" className="p-2 rounded-md bg-white border">☰</button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 py-4 grid grid-cols-1 md:grid-cols-12 gap-4">
        {/**
         * 主内容布局：
         * - max-w-max mx-auto：居中且根据内容自适应宽度，避免大屏视觉拥挤
         * - grid grid-cols-1：移动端单列
         * - lg:grid-cols-3：>=lg时三列网格（左1/中2/右1）
         * - gap-6：列与卡片间保持合理间距
         */}
        {/* Left column: Filters & Help */}
        <aside className="md:col-span-3 bg-white rounded-md shadow-sm p-4 md:sticky md:top-20 h-fit">
          {/**
           * 左列：过滤与帮助
           * - lg:col-span-1：在四列网格中占一列
           * - bg-white rounded-md shadow-sm：卡片视觉样式（背景/圆角/阴影）
           * - p-4：内部间距提升可读性
           * - sticky top-20：滚动时吸附位置，保持工具栏在视口内；top-20 为与顶部导航的间距
           * - h-fit：高度自适应内容
           */}
          <h3 className="font-semibold text-lg">Filters</h3>
          <p className="text-sm text-slate-500">Refine your search to reduce choices and cognitive load.</p>

          <div className="mt-3 space-y-3">
            {/**
             * space-y-3：分组表单垂直间距，避免密集视觉
             */}
            <div>
              <label className="block text-sm font-medium">Format</label>
              <select className="mt-1 w-full border rounded-md p-2">
                {/**
                 * 表单控件：
                 * - mt-1：标签与输入的垂直间距
                 * - w-full：宽度充满父容器
                 * - border rounded-md：可见边框与圆角，易于识别与点击
                 * - p-2：内边距提升触控舒适度
                 */}
                <option>All</option>
                <option>E-Book</option>
                <option>Journal</option>
                <option>Audiobook</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium">Category</label>
              <select className="mt-1 w-full border rounded-md p-2">
                <option>All</option>
                <option>Fiction</option>
                <option>Non-fiction</option>
                <option>History</option>
                <option>Children</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium">Language</label>
              <select className="mt-1 w-full border rounded-md p-2">
                <option>All</option>
                <option>English</option>
                <option>Spanish</option>
                <option>Japanese</option>
              </select>
            </div>
          </div>

          <hr className="my-4" />

          <div>
            <h4 className="font-medium">Help Center</h4>
            <p className="text-sm text-slate-500">Quick tips for new users and an FAQ link for assistance.</p>
            <ul className="mt-2 space-y-1 text-sm">
              <li>• Getting started guide</li>
              <li>• How to borrow an e-book</li>
              <li>• Accessibility settings</li>
            </ul>
          </div>
        </aside>

        {/* Main column: Latest Arrivals and Results */}
        <aside className="md:col-span-6 space-y-6">
          {/* Latest Arrivals */}
          <div className="bg-white rounded-md shadow-sm p-4">
            {/**
             * 中列卡片：
             * - bg-white rounded-md shadow-sm p-4：标准卡片视觉样式
             */}
            <div className="flex items-center justify-between">
              {/**
               * 标题区：
               * - flex items-center justify-between：标题与操作分布两侧
               */}
              <h2 className="text-xl font-semibold">Latest Arrivals</h2>
              <button className="text-sm underline">See all</button>
            </div>

            <div className="mt-3 grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {/**
               * 卡片网格：
               * - grid-cols-2：小屏两列
               * - sm:grid-cols-3 md:grid-cols-4：更大屏幕增加列数，提高信息承载
               * - gap-3：卡片间距
               */}
              {Array.from({ length: 8 }).map((_, i) => (
                <article key={i} className="border rounded-md p-2 bg-slate-50" role="article" aria-label={`New arrival ${i + 1}`}>
                  {/**
                   * 单个资源卡片：
                   * - border rounded-md：边框与圆角，分隔与视觉统一
                   * - p-2：内容内边距
                   * - bg-slate-50：淡色背景与页面背景形成层次
                   */}
                  <div className="h-28 bg-gradient-to-br from-indigo-200 to-indigo-400 rounded-md mb-2 flex items-center justify-center text-white font-semibold">Cover</div>
                  {/**
                   * 封面占位：
                   * - h-28：固定高度，统一栅格外观
                   * - bg-gradient-to-br from-indigo-200 to-indigo-400：斜向渐变，提升视觉
                   * - rounded-md：圆角统一风格
                   * - mb-2：与文字分隔
                   * - flex items-center justify-center：居中“Cover”字样
                   * - text-white font-semibold：对比度与权重
                   */}
                  <div className="text-sm font-medium">Title {i + 1}</div>
                  <div className="text-xs text-slate-500">Author</div>
                  <div className="mt-2 flex gap-2">
                    <button className="flex-1 py-1 px-2 text-sm rounded-md border bg-white">Preview</button>
                    <button className="py-1 px-2 text-sm rounded-md border bg-indigo-600 text-white">Borrow</button>
                    {/**
                     * 操作按钮：
                     * - rounded-md border：可点击外观统一
                     * - flex-1：左侧按钮在小屏自适应填充
                     * - bg-indigo-600 text-white：主操作强调色
                     */}
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* Search results / recommendations area */}
          <div className="bg-white rounded-md shadow-sm p-4">
            {/**
             * 推荐与搜索结果区域：统一卡片样式，信息密度较高但保持行间距
             */}
            <h2 className="text-xl font-semibold">Search Results & Recommendations</h2>
            <p className="text-sm text-slate-500 mt-1">Results adapt to filters; simplified layout for older users.</p>

            <div className="mt-3 space-y-3">
              {/**
               * space-y-3：列表项垂直间距，提升阅读舒适度
               */}
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 border rounded-md p-3">
                  {/**
                   * 列表项容器：
                   * - flex items-center gap-4：图文横向布局，元素间距
                   * - border rounded-md p-3：分隔与卡片化
                   */}
                  <div className="w-16 h-20 bg-slate-200 rounded-md flex items-center justify-center">Img</div>
                  {/**
                   * 缩略图：
                   * - w-16 h-20：统一尺寸
                   * - bg-slate-200 rounded-md：淡灰背景与圆角
                   * - flex items-center justify-center：居中“Img”占位
                   */}
                  <div className="flex-1">
                    <div className="font-medium">Result Title {i + 1}</div>
                    <div className="text-sm text-slate-500">Short description or author name</div>
                    <div className="mt-2 flex gap-2">
                      <button className="py-1 px-2 rounded-md border">Details</button>
                      <button className="py-1 px-2 rounded-md border bg-indigo-600 text-white">Borrow</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Right column: My Collection + Accessibility */}
        <aside className="md:col-span-3 bg-white rounded-md shadow-sm p-4 h-fit">
          {/**
           * 右列：个人收藏与无障碍入口
           * - lg:col-span-1：在四列网格中占一列
           * - h-fit：高度自适应内容，避免过度填充
           */}
          <h3 className="font-semibold">My Collection</h3>
          <p className="text-sm text-slate-500">Quick access to borrowed and saved items.</p>

          <ul className="mt-3 space-y-2">
            <li className="flex items-center justify-between">
              <div className="text-sm">Borrowed: 2</div>
              <button className="text-sm underline">Manage</button>
            </li>
            <li className="flex items-center justify-between">
              <div className="text-sm">Saved for later: 5</div>
              <button className="text-sm underline">View</button>
            </li>
          </ul>

          <hr className="my-4" />

          <h4 className="font-medium">Accessibility</h4>
          <p className="text-sm text-slate-500">Tools to reduce cognitive load and support older users.</p>
          <div className="mt-2 flex flex-col gap-2">
            <button className="py-2 rounded-md border text-sm">Increase font size</button>
            <button className="py-2 rounded-md border text-sm">High contrast</button>
            <button className="py-2 rounded-md border text-sm">Read aloud</button>
          </div>
        </aside>
      </main>

      <footer className="bg-white border-t mt-6">
        {/**
         * 页脚样式：
         * - bg-white border-t：顶部边框与白色背景，清晰分隔主体内容
         * - mt-6：与主体保持足够间距
         */}
        <div className="max-w-6xl mx-auto px-4 py-6 text-sm text-slate-600 flex justify-between">
          {/**
           * 页脚内部容器：
           * - max-w-6xl mx-auto：居中与最大宽度
           * - px-4 py-6：内边距，保证链接可点击区域
           * - text-sm text-slate-600：次要信息样式
           * - flex justify-between：左右分布
           */}
          <div>© Metropolitan Library 2025</div>
          <div className="flex gap-4">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Contact</a>
          </div>
        </div>
      </footer>

      {/* Design rationale panel - collapsible on larger screens */}
      <div className="fixed right-4 bottom-4 w-80 bg-white border rounded-md shadow-lg p-3 hidden md:block">
        {/**
         * 设计说明面板：
         * - fixed right-4 bottom-4：固定在右下角
         * - w-80：固定宽度便于阅读
         * - bg-white border rounded-md shadow-lg p-3：卡片样式，较强阴影强调悬浮
         * - hidden md:block：小屏隐藏，>=md 显示避免遮挡内容
         */}
        <h4 className="font-semibold">Design Rationale</h4>
        <ul className="text-sm mt-2 space-y-2">
          <li><strong>Cognitive Load:</strong> Simple layout, clear hierarchies, filters to narrow choices.</li>
          <li><strong>Feedback:</strong> Live validation and visible indicators for success/errors.</li>
          <li><strong>Consistency:</strong> Buttons, icons, and spacing follow system patterns.</li>
          <li><strong>Error Prevention:</strong> Required fields, duplicate detection, and confirmation before borrow/submit.</li>
        </ul>
      </div>
    </div>
  );
}
