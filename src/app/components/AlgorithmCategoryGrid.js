import Link from 'next/link';
import { getDictionary } from '@/app/dictionaries';

export default async function AlgorithmCategoryGrid({ lang }) {
  const dict = await getDictionary(lang);
  const slugs = [
    'backtracking',
    'branch-and-bound',
    'brute-force',
    'divide-and-conquer',
    'dynamic-programming',
    'greedy',
    'simple-recursive',
    'data-structures',
  ];

  const categories = slugs.map((slug) => ({
    slug,
    name: (dict.algorithms_categories && dict.algorithms_categories[slug])
      ? dict.algorithms_categories[slug]
      : (lang === 'zh' ? slug : slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())),
    description: (dict.algorithms_categories_desc && dict.algorithms_categories_desc[slug])
      ? dict.algorithms_categories_desc[slug]
      : '',
  }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-8">
      {categories.map((category) => (
        <Link key={category.slug} href={`/${lang}/algorithms/${category.slug}`} className="block p-6 bg-white rounded-lg border border-gray-200 shadow-md hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{category.name}</h5>
          {category.description && (
            <p className="font-normal text-gray-700 dark:text-gray-400">{category.description}</p>
          )}
        </Link>
      ))}
    </div>
  );
}
