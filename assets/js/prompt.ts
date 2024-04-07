export default function initialisePrompt() {
  /**
   * Mirror the prompt input to the prompt blur to maintain the mirroring of the blur layer.
   */
  document.addEventListener("DOMContentLoaded", () => {
    const promptInput = document.getElementById("prompt-input") as HTMLSpanElement;
    const promptBlur = document.getElementById("prompt-blur") as HTMLSpanElement;

    promptBlur.textContent = promptInput.textContent;
    promptInput.focus();

    promptInput.addEventListener("input", () => {
      promptBlur.textContent = promptInput.textContent;
    });

    promptInput.addEventListener("focusin", () => {
      const range = document.createRange();
      const selection = window.getSelection();

      // Move caret to end of prompt input.
      range.setStart(promptInput, promptInput.childNodes.length);
      range.collapse(false);
      selection.removeAllRanges();
      selection.addRange(range);
    });
  });

  /**
   * Handle enter key press to clear the prompt input.
   */
  document.addEventListener("keydown", (event: KeyboardEvent) => {
    const promptInput = document.getElementById("prompt-input") as HTMLSpanElement;
    const promptBlur = document.getElementById("prompt-blur") as HTMLSpanElement;

    if (event.key == "Enter") {
      event.preventDefault();

      promptInput.textContent = "";
      promptBlur.textContent = "";
    }

    if (event.key == "Escape") {
      promptInput.blur();
    }
  });

  document.addEventListener("click", (event: MouseEvent) => {
    const main = document.getElementsByTagName("main")[0];
    const nav = document.getElementsByTagName("nav")[0];

    if (event.target != main && event.target != nav) {
      return;
    }

    const promptInput = document.getElementById("prompt-input") as HTMLSpanElement;
    promptInput.focus();
  });
}
