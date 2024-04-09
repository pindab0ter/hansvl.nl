import { Command } from "../Command";

// @ts-ignore
import params from "@params";
import { HugoPage } from "../../types/hugo";

export class List implements Command {
  public readonly name: string = "ls";

  public execute(consoleElement: HTMLDivElement): void {
    let pages = JSON.parse(params.pages) as HugoPage[];
    pages.sort((a: HugoPage, b: HugoPage) => b.Path.localeCompare(a.Path));

    // Set up output elements
    const currentDirectoryElement = document.createElement("pre");
    currentDirectoryElement.textContent = ".";
    const outputElements = [currentDirectoryElement];

    // Get current path
    const currentPath = window.location.pathname;

    // Filter pages based on current path
    if (currentPath === "/") {
      pages = pages
        .filter((page: HugoPage) => page.Path.split("/").length === 2)
        .filter((page: HugoPage) => page.Path !== "/");
    } else {
      pages = pages.filter((page: HugoPage) => page.Path.startsWith(currentPath));

      // Add parent directory
      const parentDirectoryElement = document.createElement("pre");
      parentDirectoryElement.textContent = "..";

      outputElements.push(parentDirectoryElement);
    }

    // Add pages to output elements
    pages.forEach((page: HugoPage) => {
      const outputElement = document.createElement("pre");

      if (page.Slug) {
        outputElement.textContent = page.Slug.concat("/");
      } else {
        outputElement.textContent = page.Path.replace(currentPath, "").concat("/");
      }

      outputElements.push(outputElement);
    });

    // Append output elements to console
    outputElements.forEach((element: HTMLPreElement) => {
      consoleElement.appendChild(element);
    });
  }
}
