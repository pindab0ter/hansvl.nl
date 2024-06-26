import { HugoPage } from "../../types/hugo";
import { Terminal } from "../Terminal";
import { getAllPages, getPagesInPath, slugPath } from "../helpers";
import { AutocompletingCommand } from "../AutocompletingCommand";

export class ChangeDirectory extends AutocompletingCommand {
  public readonly name: string = "cd";
  public readonly description: string = "Change directory";
  private readonly allPages: HugoPage[] = getAllPages();
  private readonly pagesInPath: HugoPage[] = getPagesInPath(window.location.pathname);

  public execute(terminal: Terminal, args: string[] = []): void {
    if (args.length === 0) {
      terminal.print("cd: missing argument");
      return;
    }

    if (args.length > 1) {
      terminal.print("cd: too many arguments");
      return;
    }

    // Change to root directory
    if (!args.length || args[0] === "/" || args[0] === "~") {
      window.location.pathname = "/";
      return;
    }

    if (args[0].includes("/")) {
      terminal.print("cd: subdirectories are not supported");
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
      const page = this.allPages.find(
        (p: HugoPage) => p.Path.toLowerCase() === inputPath || slugPath(p) === inputPath,
      );

      if (page !== undefined) {
        window.location.pathname = slugPath(page).concat("/");
        return;
      }
      return;
    }

    // Change to a relative path
    if (
      this.pagesInPath.find((p: HugoPage) => {
        return (
          p.Path.replace(window.location.pathname, "").toLowerCase() === inputPath ||
          slugPath(p).replace(window.location.pathname, "").toLowerCase() === inputPath
        );
      })
    ) {
      window.location.pathname = window.location.pathname.concat(inputPath).concat("/");
      return;
    }
  }

  public suggestAutocompletions(arg: string): string[] {
    const suggestions = this.pagesInPath
      .map((page: HugoPage) => slugPath(page))
      .map((path: string) => path.replace(window.location.pathname, ""))
      .filter((path: string) => path !== "");

    return suggestions.filter((path: string) => path.startsWith(arg));
  }
}
