import Link from "next/link";
import { useRefinementList } from "react-instantsearch";
import { searchConfig } from "../../lib/algoliaConfig";
import { useEffect, useState } from "react";

/**
 * Count occurrences of a substring in a str.
 * @param {} str
 * @param {*} value
 * @returns
 */
function countOccurrences(str, value) {
  var regExp = new RegExp(value, "gi");
  return (str.match(regExp) || []).length;
}

/**
 * Replace All strings
 * @param {} str
 * @param {*} search
 * @param {*} replacement
 * @returns
 */
function replaceAll(str, search, replacement) {
  var regExp = new RegExp(search, "g");
  return str.replace(regExp, replacement).toLowerCase();
}
/**
 * React component that produce category page links.
 * @returns
 */
export function CategoryPageSuggestions() {

  const [prefix, setPrefix] =  useState(searchConfig.categoryPlpPathPrefix);

  const {
    items,
    refine
  } = useRefinementList({ attribute: "category_page_id" });

  const finalItems = items.sort((a, b) => {
    const compare = countOccurrences(b.value, ' > ') - countOccurrences(a.value, ' > ');
    return compare;
  }).slice(0, 5);

  useEffect(()=>{
    if (window.location.pathname.startsWith('/catalog')) {
      setPrefix('/catalog')
    }
  }, [[prefix]])


  return (<div className="category-pages-btn">
    {finalItems.map((item) => {
      const url = `${prefix}/${replaceAll(item.value, ' > ', '/')}`;
      return <Link key={item.value} href={url}><button key={item.value}>{item.label}</button></Link>
    })}
  </div>)
}