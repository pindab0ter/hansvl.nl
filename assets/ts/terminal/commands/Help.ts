import { Command } from "../Command";
import { Terminal } from "../Terminal";
import { AutocompletingCommand } from "../AutocompletingCommand";
import { getCommandFromInput } from "../helpers";

export class Help extends AutocompletingCommand {
  public readonly name: string = "help";
  public readonly description: string =
    "List all available commands, or show help for a specific command";

  public execute(terminal: Terminal, args: string[]): void {
    switch (args.length) {
      case 0:
        const output = Terminal.commands.map((command: Command) => command.name).join(" ");

        terminal.print(output);
        break;
      case 1:
        const { command } = getCommandFromInput(args[0]);

        if (command) {
          terminal.print(`${command.name}: ${command.description}`);
        } else {
          terminal.print(`help: command not found: ${args[0]}`);
        }

        break;
      default:
        terminal.print("help: too many arguments");
        break;
    }
  }

  public autocomplete(arg: string): string[] {
    return Terminal.commands
      .map((command: Command) => command.name)
      .filter((name: string) => name.startsWith(arg));
  }
}
