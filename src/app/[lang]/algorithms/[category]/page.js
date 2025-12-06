import React from 'react';
import { getDictionary } from '@/app/dictionaries';
import ProjectGrid from '@/app/components/ProjectGrid';

// Renders algorithm cards for a given category.
// - `categoryAlgorithms` maps category slug -> algorithm slugs
// - `ProjectGrid` filters `Projects.algorithms` by these slugs
// - Slugs must exist in `src/app/config/project.js` (real pages or placeholders)
// - Title resolves via i18n dictionary, or falls back to `labels` below

const categoryAlgorithms = {
  'backtracking': ['nqueens', 'knightstour'],
  'branch-and-bound': ['bfs_path', 'depthlimitedsearch'],
  'brute-force': ['bubblesort', 'heap'],
  'divide-and-conquer': ['quicksort', 'binarysearchtree', 'skiplist'],
  'dynamic-programming': ['dpcoin', 'floydwarshall'],
  'greedy': ['astar', 'dijkstra', 'intervalscheduling', 'minimumspanningtree'],
  'simple-recursive': ['hanoitower', 'factorial'],
  'data-structures': ['linkedlist', 'stack', 'hashtable', 'trie'],
};

export default async function AlgorithmCategoryPage(props) {
  const params = await props.params;
  const { lang, category } = params;
  const algorithmSlugs = categoryAlgorithms[category] || [];
  const dict = await getDictionary(lang);

  const display = (dict.algorithms_categories && dict.algorithms_categories[category])
    ? dict.algorithms_categories[category]
    : (lang === 'zh' ? category : category.replace(/-/g, ' ').toUpperCase());

  return (
    <div>
      <h1 className="text-4xl font-bold text-center my-8">{display}</h1>
      <ProjectGrid slugs={algorithmSlugs} lang={lang} />
    </div>
  );
}
