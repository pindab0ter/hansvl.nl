import {
  setDarkMode,
  initialiseDarkModeListener,
  initialiseDarkModeToggleListener,
} from "./darkMode";
import smoothScrollToNode from "./smoothScrollToNode";
import { Terminal } from "./terminal/Terminal";
import { CustomWindow } from "./types/main";

declare let window: CustomWindow;

/** Called by the dark mode toggle button in the body. */
window.setDarkMode = setDarkMode;
initialiseDarkModeToggleListener();
initialiseDarkModeListener();

/** Called by the bouncing arrow on the home page. */
window.smoothScrollToNode = smoothScrollToNode;

document.addEventListener("DOMContentLoaded", () => {
  const prompt = new Terminal();
  prompt.initialise();
});
