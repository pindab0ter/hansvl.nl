// @ts-ignore
import params from "@params";
import { HugoPage } from "../types/hugo";
import { Command } from "./Command";
import { Terminal } from "./Terminal";

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

export function slugPath(page: HugoPage): string {
  return ("/" + page.Section + "/" + page.Slug).replace(/\/$/, "").toLowerCase();
}

export function getCommandFromInput(input: string): {
  command: Command | undefined;
  args: string[];
} {
  if (input === "") return { command: undefined, args: [] };

  const command: Command | undefined = Terminal.commands.find((command: Command) =>
    input.startsWith(command.name),
  );
  const args = input.split(" ").slice(1) || [];

  return { command, args };
}
