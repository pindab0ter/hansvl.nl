import { commands } from "./commands";
import { Command } from "./Command";

export default function initialisePrompt(): void {
  document.addEventListener("DOMContentLoaded", () => {
    const promptInput = document.getElementById("prompt-input") as HTMLSpanElement;
    const promptBlur = document.getElementById("prompt-blur") as HTMLSpanElement;
    const nav = document.getElementsByTagName("nav")[0];

    // Focus prompt input on page load for browsers that don't support autofocus on contenteditable elements.
    promptInput.focus();

    mirrorInputPromptToBlurredPrompt(promptInput, promptBlur);
    moveCaretToEndOnFocus(promptInput);
    listenForKeyboardInput(promptInput, promptBlur);
    focusPromptOnClick(promptInput, nav);
  });
}

function mirrorInputPromptToBlurredPrompt(
  promptInput: HTMLSpanElement,
  promptBlur: HTMLSpanElement,
): void {
  promptInput.addEventListener("input", () => {
    promptBlur.textContent = promptInput.textContent;
  });
}

function moveCaretToEndOnFocus(promptInput: HTMLSpanElement): void {
  promptInput.addEventListener("focusin", () => {
    const range = document.createRange();
    const selection = window.getSelection();

    // Move caret to end of prompt input.
    range?.setStart(promptInput, promptInput.childNodes.length);
    range?.collapse(false);
    selection?.removeAllRanges();
    selection?.addRange(range);
  });
}

function listenForKeyboardInput(promptInput: HTMLSpanElement, promptBlur: HTMLSpanElement): void {
  /**
   * Handle enter key press to clear the prompt input.
   */
  document.addEventListener("keydown", (event: KeyboardEvent) => {
    switch (event.key) {
      // Clear prompt input
      case "Enter":
        event.preventDefault();

        const input = promptInput.textContent;

        promptInput.textContent = "";
        promptBlur.textContent = "";

        parseCommand(input);
        break;

      // Remove focus from prompt input
      case "Escape":
        promptInput.blur();
        break;
    }
  });
}

function focusPromptOnClick(promptInput: HTMLSpanElement, nav: HTMLElement): void {
  /**
   * Focus prompt input when clicking on the header.
   */
  nav.addEventListener("click", (event: MouseEvent) => {
    // Prevent focusing prompt input when clicking on a link.
    if (event.target instanceof HTMLAnchorElement) {
      return;
    }

    promptInput.focus();
  });
}

function parseCommand(input: string | null): void {
  if (!input) return;

  const command: Command = commands.find((command: Command) => command.name === input);
  const consoleElement = document.getElementById("console") as HTMLDivElement;

  // Clear console output
  while (consoleElement?.firstChild) {
    consoleElement.removeChild(consoleElement.firstChild);
  }

  if (!command) {
    const outputElement = document.createElement("pre");
    outputElement.textContent = "Command not found";
    consoleElement?.appendChild(outputElement);
    return;
  }

  command.execute(consoleElement);
}