// components/PageHeader.js

import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faCode } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { getDictionary } from "@/app/dictionaries";
import ShareButtons from "./ShareButtons";

async function PageHeader({ lang, pathname, title }) {
  const dict = await getDictionary(lang);

  const getTitle = () => {
    if (title) {
      return dict[title] || title;
    }
    const pathSegments = pathname.split("/").filter(Boolean);
    const currentPage = pathSegments[pathSegments.length - 1];
    return dict[`${currentPage}_title`] || currentPage;
  };

  const getCodeLink = () => {
    const pathSegments = pathname.split("/").filter(Boolean);
    const languages = ['zh', 'en'];
    const filePathSegments = pathSegments.filter(segment => !languages.includes(segment));
    const filePath = filePathSegments.join("/");
    const baseUrl = "https://github.com/selfboot/ai_gallery/tree/main/src/app/%5Blang%5D";
    return `${baseUrl}/${filePath}/content.js`;
  };

  const getBackLink = () => {
    const pathSegments = pathname.split("/").filter(Boolean);
    const lang = pathSegments[0];
    // expect paths like /{lang}/algorithms/{slug}
    if (pathSegments[1] === "algorithms" && pathSegments.length >= 3) {
      const slug = pathSegments[2];
      const categoryMap = {
        heap: "sorting",
        binarysearchtree: "searching",
        bfs_path: "graph",
        dijkstra: "graph",
        astar: "graph",
        dpcoin: "dynamic-programming",
        hanoitower: "dynamic-programming",
        linkedlist: "data-structures",
        stack: "data-structures",
        skiplist: "data-structures",
        hashtable: "data-structures",
        trie: "data-structures",
        hashring: "cs-and-system-design",
        jumphash: "cs-and-system-design",
        ratelimit: "cs-and-system-design",
        tokenbucket: "cs-and-system-design",
        bloomfilter: "cs-and-system-design",
        intervalscheduling: "greedy",
        minimumspanningtree: "greedy",
      };
      const category = categoryMap[slug];
      if (category) return `/${lang}/algorithms/${category}`;
      return `/${lang}/algorithms`;
    }
    // default fallback: up one level
    pathSegments.pop();
    return `/${pathSegments.join("/")}` || "/";
  };

  const pageTitle = getTitle();
  const codeLink = getCodeLink();
  const backLink = getBackLink();

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 w-full mb-6">
      <div className="flex flex-wrap items-center gap-4">
        <h1 className="text-2xl font-bold">{pageTitle}</h1>
        <div className="flex items-center gap-4">
          <Link
            href={backLink}
            className="text-blue-500 hover:text-blue-700 cursor-pointer flex items-center"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default PageHeader;
