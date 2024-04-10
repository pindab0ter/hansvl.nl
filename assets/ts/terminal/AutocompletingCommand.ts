import { Command } from "./Command";

export abstract class AutocompletingCommand extends Command {
  abstract suggestAutocompletions(arg: string): string[];
}
