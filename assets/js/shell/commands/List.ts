import { Command } from "../Command";

import { HugoPage } from "../../types/hugo";
import { getPagesInPath } from "../helpers";

export class List implements Command {
  public readonly name: string = "ls";

  public execute(consoleElement: HTMLDivElement, args: string[]): void {
    if (args.length > 0) {
      const outputElement = document.createElement("pre");
      outputElement.textContent = "ls: too many arguments";
      consoleElement.appendChild(outputElement);
      return;
    }

    const currentPath = window.location.pathname;
    let pages = getPagesInPath(currentPath);

    // Set up output elements
    const currentDirectoryElement = document.createElement("pre");
    currentDirectoryElement.textContent = ".";
    const outputElements = [currentDirectoryElement];

    // Filter pages based on current path
    if (currentPath !== "/") {
      // Add parent directory
      const parentDirectoryElement = document.createElement("pre");
      parentDirectoryElement.textContent = "..";

      outputElements.push(parentDirectoryElement);
    }

    // Add pages to output elements
    const pageElements = pages.map((page: HugoPage): HTMLPreElement => {
      const pageElement = document.createElement("pre");

      if (page.Slug) {
        pageElement.textContent = page.Slug.concat("/");
      } else {
        pageElement.textContent = page.Path.replace(currentPath, "").concat("/");
      }

      return pageElement;
    });

    outputElements.push(...pageElements);

    // Append output elements to console
    consoleElement.append(...outputElements);
  }
}
