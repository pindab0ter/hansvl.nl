import { Command } from "../Command";
import { Terminal } from "../Terminal";
import { AutocompletingCommand } from "../AutocompletingCommand";

export class Help implements Command {
  public readonly name: string = "help";

  public execute(terminal: Terminal, args: string[]): void {
    if (args.length > 0) {
      terminal.print("help: too many arguments");
      return;
    }

    const output = Terminal.commands.map((command: Command) => command.name).join(" ");

    terminal.print(output);
  }
}
