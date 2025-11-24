import React from 'react';
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

  return (
    <div>
      <h1 className="text-4xl font-bold text-center my-8">{category.replace(/-/g, ' ').toUpperCase()}</h1>
      <ProjectGrid slugs={algorithmSlugs} lang={lang} />
    </div>
  );
}