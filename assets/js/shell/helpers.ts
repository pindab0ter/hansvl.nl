// @ts-ignore
import params from "@params";
import { HugoPage } from "../types/hugo";

export function getAllPages(): HugoPage[] {
  const pages = JSON.parse(params.pages) as HugoPage[];

  return pages.sort((a: HugoPage, b: HugoPage) => b.Path.localeCompare(a.Path));
}

export function getPagesInPath(path: string): HugoPage[] {
  const pages = getAllPages();

  // Filter pages based on current path
  if (path === "/") {
    return pages
      .filter((page: HugoPage) => page.Path.split("/").length === 2)
      .filter((page: HugoPage) => page.Path !== "/");
  } else {
    return pages.filter((page: HugoPage) => page.Path.startsWith(path));
  }
}

export function longestCommonPrefix(strings: string[]): string {
  if (strings.length === 0) return "";
  if (strings.length === 1) return strings[0];

  const sortedStrings = strings.slice().sort();
  const firstString = sortedStrings[0];
  const lastString = sortedStrings[sortedStrings.length - 1];

  let i = 0;
  while (i < firstString.length && firstString.charAt(i) === lastString.charAt(i)) {
    i++;
  }

  return firstString.substring(0, i);
}
