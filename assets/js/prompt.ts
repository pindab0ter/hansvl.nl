export default function initialisePrompt() {
  document.addEventListener("DOMContentLoaded", () => {
    const promptInput = document.getElementById("prompt-input") as HTMLSpanElement;
    const promptBlur = document.getElementById("prompt-blur") as HTMLSpanElement;

    promptBlur.textContent = promptInput.textContent;
    promptInput.focus();

    // Mirror prompt input to prompt blur.
    promptInput.addEventListener("input", () => {
      promptBlur.textContent = promptInput.textContent;
    });

    // Move caret to end of prompt input when focused to 'resume' typing.
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

  handleButtonPresses();
  focusPromptOnClick();
}

function handleButtonPresses() {
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
}

function focusPromptOnClick() {
  const nav = document.getElementsByTagName("nav")[0];
  nav.addEventListener("click", () => {
    const promptInput = document.getElementById("prompt-input") as HTMLSpanElement;
    promptInput.focus();
  });
}
