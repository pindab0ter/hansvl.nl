import { Terminal } from "./Terminal";

export abstract class Command {
  abstract readonly name: string;

  abstract execute(terminal: Terminal, args: string[]): void;
}
