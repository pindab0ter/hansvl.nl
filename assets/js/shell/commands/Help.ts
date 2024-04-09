import { Command } from "../Command";
import { commands } from "../commands";

export class Help implements Command {
  public readonly name: string = "help";

  public execute(consoleElement: HTMLDivElement, args: string[]): void {
    if (args.length > 0) {
      const outputElement = document.createElement("pre");
      outputElement.textContent = "help: too many arguments";
      consoleElement.appendChild(outputElement);
      return;
    }

    const output = commands.map((command: Command) => command.name).join(" ");

    const outputElement = document.createElement("pre");
    outputElement.textContent = output;

    consoleElement.appendChild(outputElement);
  }
}
