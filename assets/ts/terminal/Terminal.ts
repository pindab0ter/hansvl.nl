import { Command } from "./Command";
import { getCommandFromInput, longestCommonPrefix } from "./helpers";
import { ChangeDirectory } from "./commands/ChangeDirectory";
import { Clear } from "./commands/Clear";
import { Help } from "./commands/Help";
import { Kitties } from "./commands/Kitties";
import { List } from "./commands/List";

export class Terminal {
  private inputElement = document.getElementById("prompt-input") as HTMLSpanElement;
  private promptBlurElement = document.getElementById("prompt-blur") as HTMLSpanElement;
  private terminalOutputElement = document.getElementById("terminal-output") as HTMLDivElement;
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
      const input = this.inputElement.textContent?.replace(/\xA0/g, " ").trim() ?? "";

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

  private onEnter(input: string) {
    const { command, args } = getCommandFromInput(input);
    this.setInput();
    this.clearOutput();

    if (command) {
      command.execute(this, args);
      return;
    }

    this.print("Command not found. Type `help` for a list of available commands.");
    return;
  }

  private onTab(input: string) {
    if (input.length === 0) {
      return;
    }

    const matchingCommands = Terminal.commands.filter((command: Command) =>
      command.name.startsWith(input),
    );

    switch (matchingCommands.length) {
      case 0:
        return;

      case 1:
        const matchingCommand = matchingCommands[0];
        if (input.length < matchingCommand.name.length) {
          this.inputElement.textContent = matchingCommand.name;
          this.promptBlurElement.textContent = matchingCommand.name;
          this.moveCaretToEnd();
        }
        return;

      default:
        const matchingPrefix = longestCommonPrefix(
          matchingCommands.map((command: Command) => command.name),
        );
        this.setInput("");
        this.inputElement.textContent = matchingPrefix;
        this.promptBlurElement.textContent = matchingPrefix;
        this.moveCaretToEnd();
    }
    return;
  }

  private moveCaretToEnd() {
    const range = document.createRange();
    const selection = window.getSelection();

    // Move caret to end of prompt input.
    range?.setStart(this.inputElement, this.inputElement.childNodes.length);
    range?.collapse(false);
    selection?.removeAllRanges();
    selection?.addRange(range);
  }

  public print(...lines: string[]) {
    lines.forEach((line: string) => {
      const outputElement = document.createElement("pre");
      outputElement.textContent = line;
      this.terminalOutputElement.appendChild(outputElement);
    });
  }

  public setInput(newInput: string = "") {
    this.inputElement.textContent = newInput;
    this.promptBlurElement.textContent = newInput;
    this.moveCaretToEnd();
  }

  public clearOutput() {
    while (this.terminalOutputElement?.firstChild) {
      this.terminalOutputElement.removeChild(this.terminalOutputElement.firstChild);
    }
  }
}
