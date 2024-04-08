import { Command } from "../Command";
import { commands } from "../commands";

export class Kitties implements Command {
  public readonly name: string = "kitties";

  public execute(_: HTMLDivElement): void {
    window.location.href = "https://hamana.nl/";
  }
}
