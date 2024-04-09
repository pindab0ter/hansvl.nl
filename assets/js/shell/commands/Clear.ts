import { Command } from "../Command";

export class Clear implements Command {
  public readonly name: string = "clear";

  public execute(consoleElement: HTMLDivElement, args: string[]): void {
    if (args.length > 0) {
      const outputElement = document.createElement("pre");
      outputElement.textContent = "clear: too many arguments";
      consoleElement.appendChild(outputElement);
      return;
    }

    while (consoleElement?.firstChild) {
      consoleElement.removeChild(consoleElement.firstChild);
    }
  }
}
