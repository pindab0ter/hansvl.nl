import { Command } from "../Command";
import { HugoPage } from "../../types/hugo";
import { Terminal } from "../Terminal";
import { getPagesInPath } from "../helpers";

export class List extends Command {
  public readonly name: string = "ls";

  public execute(terminal: Terminal, args: string[]): void {
    if (args.length > 0) {
      terminal.print("ls: too many arguments");
      return;
    }

    const currentPath = window.location.pathname;
    let pages = getPagesInPath(currentPath);

    terminal.print(".");

    if (currentPath !== "/") {
      terminal.print("..");
    }

    const paths = pages.map((page: HugoPage): string => {
      if (page.Slug) {
        return page.Slug.concat("/");
      } else {
        return page.Path.replace(currentPath, "").concat("/");
      }
    });

    terminal.print(...paths);
  }
}
