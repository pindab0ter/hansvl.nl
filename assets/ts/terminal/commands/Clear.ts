import { Command } from "../Command";
import { Terminal } from "../Terminal";

export class Clear extends Command {
  public readonly name: string = "clear";

  public execute(terminal: Terminal, args: string[]): void {
    if (args.length > 0) {
      terminal.print("clear: too many arguments");
      return;
    }

    terminal.clearOutput();
  }
}
