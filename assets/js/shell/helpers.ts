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
