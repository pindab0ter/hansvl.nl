import copyHeadingLink from "./copyHeadingLink.js";
import { setDarkMode, initialiseDarkModeListener } from "./darkMode.js";
import smoothScrollToNode from "./smoothScrollToNode";

/** Called by the link button next to prose headings. */
window.copyHeadingLink = copyHeadingLink;

/** Called by the dark mode toggle button in the body. */
window.setDarkMode = setDarkMode;
initialiseDarkModeListener();

/** Called by the bouncing arrow on the home page. */
window.smoothScrollToNode = smoothScrollToNode;
