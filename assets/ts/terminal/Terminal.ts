import { Command } from "./Command";
import { getCommandFromInput, longestCommonPrefix } from "./helpers";
import { ChangeDirectory } from "./commands/ChangeDirectory";
import { Clear } from "./commands/Clear";
import { Help } from "./commands/Help";
import { Kitties } from "./commands/Kitties";
import { List } from "./commands/List";
import { AutocompletingCommand } from "./AutocompletingCommand";

export class Terminal {
  private inputElement = document.getElementById("prompt-input") as HTMLSpanElement;
  private promptBlurElement = document.getElementById("prompt-blur") as HTMLSpanElement;
  private terminalOutputElement = document.getElementById("terminal-output") as HTMLDivElement;
  private container = document.getElementById("terminal-output-container") as HTMLDivElement;
  private navElement = document.getElementsByTagName("nav")[0];

  static commands: Command[] = [
    new ChangeDirectory(),
    new Clear(),
    new Help(),
    new Kitties(),
    new List(),
  ];

  public initialise(): void {
    // Focus prompt input on page load for browsers that don't support autofocus on contenteditable elements.
    this.inputElement.focus();

    this.mirrorInputPromptToBlurredPrompt();
    this.moveCaretToEndOnFocus();
    this.listenForKeyboardInput();
    this.focusPromptOnClick();
  }

  private mirrorInputPromptToBlurredPrompt(): void {
    this.inputElement.addEventListener("input", () => {
      this.setInput(this.inputElement.textContent?.replace(/\s/g, "\xA0"));
    });
  }

  private moveCaretToEndOnFocus(): void {
    this.inputElement.addEventListener("focusin", () => {
      this.moveCaretToEnd();
    });
  }

  private listenForKeyboardInput(): void {
    /**
     * Handle enter key press to clear the prompt input.
     */
    document.addEventListener("keydown", (event: KeyboardEvent) => {
      const input = this.getInput();

      switch (event.key) {
        case "ArrowLeft":
        case "ArrowRight":
        case "ArrowUp":
        case "ArrowDown":
          event.preventDefault();
          break;

        // Clear prompt input
        case "Enter":
          event.preventDefault();
          this.onEnter(input);
          break;

        case "Tab":
          event.preventDefault();
          this.onTab(input);
          break;

        // Remove focus from prompt input
        case "Escape":
          this.inputElement.blur();
          break;
      }
    });
  }

  private focusPromptOnClick(): void {
    /**
     * Focus prompt input when clicking on the header.
     */
    this.navElement.addEventListener("click", (event: MouseEvent) => {
      // Prevent focusing prompt input when clicking on a link.
      if (event.target instanceof HTMLAnchorElement) {
        return;
      }

      this.inputElement.focus();
    });
  }

  private onEnter(input: string): void {
    const { command, args } = getCommandFromInput(input.trim());
    this.setInput();
    this.clearOutput();

    if (command) {
      command.execute(this, args);
      return;
    }

    this.print("Command not found. Type `help` for a list of available commands.");
    return;
  }

  private onTab(input: string): void {
    this.clearOutput();

    if (input.length === 0) {
      this.print(...Terminal.commands.map((command: Command) => command.name));
      return;
    }

    const { command, args } = getCommandFromInput(input);

    if (command && command instanceof AutocompletingCommand) {
      // If the input is exactly the command name (with no space after), don't autocomplete arguments.
      if (input === command.name) return;

      this.autocompleteArguments(command, args);
      return;
    }

    this.autocompleteCommands(input);
  }

  private autocompleteArguments(command: AutocompletingCommand, args: string[] = []) {
    const argument = args[args.length - 1] ?? "";
    const suggestions = command.suggestAutocompletions(argument);

    if (suggestions.length === 1) {
      this.setInput(`${command.name} ${suggestions[0]}`);
    }

    if (suggestions.length > 1) {
      this.print(...suggestions);
      this.setInput(`${command.name} ${longestCommonPrefix(suggestions)}`);
    }
  }

  private autocompleteCommands(input: string): void {
    const matchingCommandNames = Terminal.commands
      .filter((command: Command) => command.name.startsWith(input))
      .map((command: Command) => command.name);

    switch (matchingCommandNames.length) {
      case 0:
        return;

      case 1:
        if (input.length < matchingCommandNames[0].length) {
          this.setInput(matchingCommandNames[0]);
        }
        return;

      default:
        this.print(...matchingCommandNames);
        this.setInput(longestCommonPrefix(matchingCommandNames));
    }
  }

  private moveCaretToEnd(): void {
    const range = document.createRange();
    const selection = window.getSelection();

    // Move caret to end of prompt input.
    range?.setStart(this.inputElement, this.inputElement.childNodes.length);
    range?.collapse(false);
    selection?.removeAllRanges();
    selection?.addRange(range);
  }

  public print(...lines: string[]): void {
    lines.forEach((line: string) => {
      const outputElement = document.createElement("pre");
      outputElement.textContent = line;
      this.terminalOutputElement.appendChild(outputElement);
    });

    // Animation to expand the terminal output container.
    this.container.style.height = this.terminalOutputElement.scrollHeight + "px";
  }

  private getInput() {
    return this.inputElement.textContent?.replace(/\xA0/g, " ") ?? "";
  }

  public setInput(input: string = ""): void {
    const formattedInput = input.replace(/ /g, "\xA0");
    this.inputElement.textContent = formattedInput;
    this.promptBlurElement.textContent = formattedInput;
    this.moveCaretToEnd();
  }

  public clearOutput(): void {
    while (this.terminalOutputElement?.firstChild) {
      this.terminalOutputElement.removeChild(this.terminalOutputElement.firstChild);
    }

    // Animation to contract the terminal output.
    this.container.style.height = this.terminalOutputElement.scrollHeight + "px";
  }
}
