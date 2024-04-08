import { Command } from "../Command";
import { commands } from "../commands";

export class Help implements Command {
  public readonly name: string = "help";

  public execute(consoleElement: HTMLDivElement): void {
    const output = commands.map((command: Command) => command.name).join(" ");

    const outputElement = document.createElement("pre");
    outputElement.textContent = output;

    consoleElement.appendChild(outputElement);
  }
}
