import { Command } from "../Command";
import { Terminal } from "../Terminal";
import { setDarkMode } from "../../darkMode";
import { Theme as ThemeType } from "../../types/main";
import { AutocompletingCommand } from "../AutocompletingCommand";

export class Theme extends AutocompletingCommand {
  public readonly name: string = "theme";
  public readonly description: string =
    "Set the theme of the website. Available themes: light, dark, system";
  private readonly validThemes = ["light", "dark", "system"];

  public execute(terminal: Terminal, args: string[]): void {
    if (args.length < 1) {
      terminal.print("theme: missing arguments");
      return;
    }

    if (args.length > 1) {
      terminal.print("theme: too many arguments");
      return;
    }

    const theme = args[0];

    if (!this.validThemes.includes(theme)) {
      terminal.print("theme: unknown theme");
      return;
    }

    setDarkMode(theme as ThemeType);
  }

  suggestAutocompletions(arg: string): string[] {
    return this.validThemes.filter((name: string) => name.startsWith(arg));
  }
}
