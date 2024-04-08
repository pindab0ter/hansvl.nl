export interface Command {
  readonly name: string;
  execute(consoleElement: HTMLDivElement): void;
}
