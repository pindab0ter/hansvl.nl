import { Command } from "../Command";

// @ts-ignore
import params from "@params";
import { HugoPage } from "../../types/hugo";

export class List implements Command {
  public readonly name: string = "ls";

  public execute(consoleElement: HTMLDivElement): void {
    let pages = JSON.parse(params.pages) as HugoPage[];
    pages.sort((a: HugoPage, b: HugoPage) => b.Path.localeCompare(a.Path));

    const currentPath = window.location.pathname;

    if (currentPath === "/") {
      pages = pages
        .filter((page: HugoPage) => page.Path.split("/").length === 2)
        .filter((page: HugoPage) => page.Path !== "/");
    } else {
      pages = pages.filter((page: HugoPage) => page.Path.startsWith(currentPath));
    }

    pages.forEach((page: HugoPage) => {
      const outputElement = document.createElement("pre");

      if (page.Slug) {
        outputElement.textContent = page.Slug.concat("/");
      } else {
        outputElement.textContent = page.Path.replace(currentPath, "").concat("/");
      }

      consoleElement.appendChild(outputElement);
    });
  }
}
