import { Command } from "../Command";
import { commands } from "../commands";

export class Clear implements Command {
  public readonly name: string = "clear";

  public execute(consoleElement: HTMLDivElement): void {
    while (consoleElement?.firstChild) {
      consoleElement.removeChild(consoleElement.firstChild);
    }
  }
}
