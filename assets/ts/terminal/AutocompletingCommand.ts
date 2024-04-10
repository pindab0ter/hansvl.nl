import { Command } from "./Command";

export abstract class AutocompletingCommand extends Command {
  abstract autocomplete(arg: string): string[];
}
