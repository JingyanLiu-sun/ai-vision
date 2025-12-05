import Link from 'next/link';

const categories = [
  {
    name: '排序算法',
    description: '排序算法是将一组数据按照特定的顺序（如升序或降序）进行排列的算法。效率是衡量排序算法的重要指标，不同的算法在时间复杂度和空间复杂度上有各自的优劣。',
    slug: 'sorting'
  },
  {
    name: '搜索算法',
    description: '搜索算法用于在数据集中查找特定信息。从简单的线性搜索到复杂的图搜索，搜索算法是解决信息检索问题的基础。',
    slug: 'searching'
  },
  {
    name: '图算法',
    description: '图算法是用于解决图结构相关问题的算法。图由节点和边组成，广泛应用于社交网络分析、路径规划和网络流问题中。',
    slug: 'graph'
  },
  {
    name: '动态规划',
    description: '动态规划是一种通过将复杂问题分解为更小的子问题来求解的策略。它通常用于优化问题，通过存储子问题的解来避免重复计算。',
    slug: 'dynamic-programming'
  },
  {
    name: '贪心算法',
    description: '贪心算法在每一步选择中都采取在当前状态下最好或最优的选择，从而希望导致结果是全局最好或最优的。然而，贪心算法并不总是能得到全局最优解。',
    slug: 'greedy'
  },
  {
    name: '数据结构',
    description: '数据结构是组织、管理和存储数据的方式，以便能够高效地访问和修改。它是构建高效算法和软件的基础。',
    slug: 'data-structures'
  },
  {
    name: '计算机科学与系统设计',
    description: '此类别涵盖了计算机科学中的核心概念和在构建可扩展、可靠系统时常用的高级算法与思想。',
    slug: 'cs-and-system-design'
  }
];

const AlgorithmCategoryGrid = ({ lang }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-8">
      {categories.map((category) => (
        <Link key={category.slug} href={`/${lang}/algorithms/${category.slug}`} className="block p-6 bg-white rounded-lg border border-gray-200 shadow-md hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{category.name}</h5>
          <p className="font-normal text-gray-700 dark:text-gray-400">{category.description}</p>
        </Link>
      ))}
    </div>
  );
};

export default AlgorithmCategoryGrid;