import { Terminal } from "./Terminal";

export interface Command {
  readonly name: string;
  execute(terminal: Terminal, args: string[]): void;
}
