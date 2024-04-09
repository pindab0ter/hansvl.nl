import { Command } from "../Command";
import { commands } from "../commands";

export class Kitties implements Command {
  public readonly name: string = "kitties";

  public execute(consoleElement: HTMLDivElement, args: string[]): void {
    if (args.length > 0) {
      const outputElement = document.createElement("pre");
      outputElement.textContent = "help: too many arguments";
      consoleElement.appendChild(outputElement);
      return;
    }

    window.location.href = "https://hamana.nl/";
  }
}
