import { Command } from "../Command";

import { commands, Terminal } from "../Terminal";

export class Kitties implements Command {
  public readonly name: string = "kitties";

  public execute(terminal: Terminal, args: string[]): void {
    if (args.length > 0) {
      terminal.print("kitties: too many arguments");
      return;
    }

    window.location.href = "https://hamana.nl/";
  }
}
