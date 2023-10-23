import {
  setDarkMode,
  initialiseDarkModeListener,
  initialiseDarkModeToggleListener,
} from "./darkMode.js";
import smoothScrollToNode from "./smoothScrollToNode";

/** Called by the dark mode toggle button in the body. */
window.setDarkMode = setDarkMode;
initialiseDarkModeToggleListener();
initialiseDarkModeListener();

/** Called by the bouncing arrow on the home page. */
window.smoothScrollToNode = smoothScrollToNode;
