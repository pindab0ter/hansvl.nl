import { Command } from "../Command";
import { Terminal } from "../Terminal";

export class Kitties extends Command {
  public readonly name: string = "kitties";
  public readonly description: string = "See some cute kitties!";

  public execute(terminal: Terminal, args: string[]): void {
    if (args.length > 0) {
      terminal.print("kitties: too many arguments");
      return;
    }

    window.location.href = "https://hamana.nl/";
  }
}
