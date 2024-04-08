import {
  setDarkMode,
  initialiseDarkModeListener,
  initialiseDarkModeToggleListener,
} from "./darkMode";
import smoothScrollToNode from "./smoothScrollToNode";
import initialisePrompt from "./shell/prompt";
import { CustomWindow } from "./types/main";

declare let window: CustomWindow;

/** Called by the dark mode toggle button in the body. */
window.setDarkMode = setDarkMode;
initialiseDarkModeToggleListener();
initialiseDarkModeListener();

/** Called by the bouncing arrow on the home page. */
window.smoothScrollToNode = smoothScrollToNode;

initialisePrompt();
