[English](./README.md) | [中文](./README_zh.md)


我不会前端技术，只懂一点点 html 和 css，在 chat-gpt5-codex 和 Kimi-v2-thinking的助攻下，完成了一些有意思的小组件，我把它们集成在这个站点，欢迎来体验。

不得不说，AI 真的改变写代码的方式。

# 项目介绍

使用 React 和 Nextjs 进行静态站点生成（SSG），部署在 wsl 上。功能上包括站点地图自动生成、Google Analytics 集成和 i18n 国际化支持。目前主要有下面一些有意思的小组件，我会用 AI 持续增加更多项目。

算法：探索经典算法的交互式可视化，如 BFS 寻路、A* 搜索、Dijkstra 算法和堆操作。

<div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
  <img src="https://slefboot-1251736664.file.myqcloud.com/20240706_ai_gallery_bfs_path.gif" alt="BFS 路径搜索" width="32%" height="200">
  <img src="https://slefboot-1251736664.file.myqcloud.com/20240709_ai_gallery_dijkstra_v3.gif" alt="Dijkstra 最短路径" width="32%" height="200">
  <img src="https://slefboot-1251736664.file.myqcloud.com/20240706_ai_gallery_heapv2.gif" alt="堆数据结构" width="32%" height="200">
</div>

# 本地开发

欢迎大家一起来完善这里的小组件，**没有前端技术背景也没关系，可以借助 AI 来实现你的想法**。本地运行此项目的步骤很简单：

1. 克隆仓库：
   ```
   git clone https://github.com/JingyanLiu-sun/ai-vision.git
   ```

2. 进入项目目录：
   ```
   cd ai-vision
   ```

3. 安装依赖：
   ```
   pnpm install
   ```

4. 启动开发服务器：
   ```
   pnpm dev
   ```

5. 打开浏览器并访问 `http://localhost:3000` 就可以查看了。

当然中间遇到任何问题，尝试去用 AI 解决吧～

# 使用 AI 的感悟

作为一个没有 web 开发经验的菜鸟，通过 AI 辅助开发这个项目，学习了不少实用前端知识。同时完成了之前一直想做的可视化，很有成就感。

1. **学习机会**：通过 AI 辅助，快速了解一些 React、JavaScript 和现代 Web 开发实践。
2. **问题解决**：虽然 AI 在许多方面都发挥了重要作用，但还是有些问题，**需要人去解决**。

## 带来的改变
chat-gpt5-codex 和 Kimi-v2-thinking，是完全合格的虚拟导师和结对编程伙伴。即使我之前没有 React 开发经验，它们帮助我快速理解 React 概念，实现复杂逻辑，创建吸引人的 UI，同时解释底层原理，是优秀的编程助手。通过 AI 可以快速了解到最佳实践、设计模式和优化技术，帮助解决各种疑难问题，是当之无愧的最佳导师。

## AI 的局限性
AI 还是有一定幻觉，推理能力也还不够。有时 AI 生成的代码存在 bug 或不能完全满足项目需求，有时候给出的解释也是不够清晰。在这种情况下，需要自己去调试，去解决问题。

## AI-人类协作

最有效的方法是将 AI 作为协作工具，将其广博知识与个人的创造力和项目特定理解相结合，更快更好完成一些有趣的工作。