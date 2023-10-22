/**
 * Dark mode preferences are loaded and applied in a script tag in the head of
 * the document to prevent a FOUD (flash of unstyled document).
 *
 * @var {string} value The value of the theme preference. Can be either:
 *  - "light"
 *  - "dark"
 *  - "system"
 */
export function setDarkMode(mode, save = true) {
  const prefersDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const darkMode = mode === "dark" || (mode === "system" && prefersDarkMode);

  document.documentElement.classList.toggle("dark", darkMode);
  document
    .querySelector("meta[name=theme-color]")
    .setAttribute("content", darkMode ? "#cc7832" : "#3679F6");

  sendMessageToGiscus({
    setConfig: {
      theme: darkMode ? "noborder_dark" : "noborder_light",
    },
  });

  if (!save) return;

  if (mode === "system") {
    localStorage.removeItem("theme");
  } else {
    localStorage.setItem("theme", mode);
  }
}

export function initialiseDarkModeListener() {
  const colorSchemeQueryList = window.matchMedia("(prefers-color-scheme: dark)");
  colorSchemeQueryList.addEventListener("change", (mediaQueryEvent) => {
    const savedTheme = localStorage.getItem("theme") ?? "system";
    if (savedTheme !== "system") return;
    setDarkMode(mediaQueryEvent.matches ? "dark" : "light", false);
  });
}

function sendMessageToGiscus(message) {
  const iframe = document.querySelector("iframe.giscus-frame");
  iframe?.contentWindow.postMessage({ giscus: message }, "https://giscus.app");
}
