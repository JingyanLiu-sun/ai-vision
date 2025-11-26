import React from 'react';
import { getDictionary } from '@/app/dictionaries';
import ProjectGrid from '@/app/components/ProjectGrid';

const categoryAlgorithms = {
  sorting: ['heap'],
  searching: ['binarysearchtree', 'bfs_path', 'dijkstra', 'astar'],
  graph: ['bfs_path', 'dijkstra', 'astar'],
  'dynamic-programming': ['dpcoin', 'hanoitower'],
  greedy: ['intervalscheduling', 'minimumspanningtree'],
  'data-structures': ['linkedlist', 'stack', 'heap', 'hashtable', 'trie', 'binarysearchtree', 'skiplist'],
  'cs-and-system-design': ['ratelimit', 'tokenbucket', 'hashring', 'jumphash', 'bloomfilter'],
};

export default async function AlgorithmCategoryPage(props) {
  const params = await props.params;
  const { lang, category } = params;
  const algorithmSlugs = categoryAlgorithms[category] || [];
  const dict = await getDictionary(lang);
  const labels = {
    sorting: { zh: '排序算法', en: 'Sorting Algorithms' },
    searching: { zh: '搜索与路径', en: 'Searching & Path' },
    graph: { zh: '图算法', en: 'Graph Algorithms' },
    'dynamic-programming': { zh: '动态规划', en: 'Dynamic Programming' },
    greedy: { zh: '贪心算法', en: 'Greedy Algorithms' },
    'data-structures': { zh: '数据结构', en: 'Data Structures' },
    'cs-and-system-design': { zh: '计算机系统与设计', en: 'CS & System Design' },
  };
  const display = (dict.algorithms_categories && dict.algorithms_categories[category])
    ? dict.algorithms_categories[category]
    : (labels[category] ? (lang === 'zh' ? labels[category].zh : labels[category].en) : (lang === 'zh' ? category : category.replace(/-/g, ' ').toUpperCase()));

  return (
    <div>
      <h1 className="text-4xl font-bold text-center my-8">{display}</h1>
      <ProjectGrid slugs={algorithmSlugs} lang={lang} />
    </div>
  );
}
