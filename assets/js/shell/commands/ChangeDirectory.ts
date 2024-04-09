import { Command } from "../Command";

import { getAllPages, getPagesInPath } from "../helpers";
import { HugoPage } from "../../types/hugo";

export class ChangeDirectory implements Command {
  public readonly name: string = "cd";

  public execute(consoleElement: HTMLDivElement, args: string[] = []): void {
    if (args.length === 0) {
      const outputElement = document.createElement("pre");
      outputElement.textContent = "cd: missing argument";
      consoleElement.appendChild(outputElement);
      return;
    }

    if (args.length > 1) {
      const outputElement = document.createElement("pre");
      outputElement.textContent = "cd: too many arguments";
      consoleElement.appendChild(outputElement);
      return;
    }

    const allPages = getAllPages();
    const pagesInPath = getPagesInPath(window.location.pathname);

    // Change to root directory
    if (!args.length || ["/", "~"].includes(args[0])) {
      window.location.pathname = "/";
      return;
    }

    const inputPath = args[0].replace(/\/$/, "").replace(/^~\//, "/").toLowerCase();

    // Change to current directory
    if (inputPath === ".") {
      // noinspection SillyAssignmentJS
      window.location.pathname = window.location.pathname;
      return;
    }

    // Change to parent directory
    if (inputPath === "..") {
      if (window.location.pathname === "/") {
        return;
      }

      window.location.pathname = window.location.pathname
        .split("/")
        .filter((s) => s !== "")
        .slice(0, -1)
        .join("/")
        .concat("/");
    }

    // Change to an absolute path
    if (inputPath.startsWith("/") || inputPath.startsWith("~/")) {
      const page = allPages.find(
        (p: HugoPage) =>
          p.Path.toLowerCase() === inputPath ||
          "/" + p.Section.toLowerCase() + "/" + p.Slug === inputPath,
      );

      if (page !== undefined) {
        window.location.pathname = "/" + page.Section.toLowerCase() + "/" + page.Slug;
        return;
      }
      return;
    }

    // Change to a relative path
    console.log(inputPath, pagesInPath);
    if (
      pagesInPath.find(
        (p: HugoPage) =>
          p.Path.replace(window.location.pathname, "").toLowerCase() === inputPath ||
          p.Slug === inputPath,
      )
    ) {
      window.location.pathname = window.location.pathname.concat(inputPath).concat("/");
      return;
    }
  }
}
