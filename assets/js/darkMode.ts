import { Theme } from "./types/main";
import { ISetConfigMessage } from "./types/giscus";

/**
 * Dark theme preferences are loaded and applied in a script tag in the head of
 * the document to prevent a FOUD (flash of unstyled document).
 */
export function setDarkMode(theme: Theme, save: boolean = true): void {
  const prefersDarkMode: boolean = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const darkMode: boolean = theme === "dark" || (theme === "system" && prefersDarkMode);

  document.documentElement.classList.toggle("dark", darkMode);
  document
    .querySelector("meta[name=theme-color]")
    .setAttribute("content", darkMode ? "#cc7832" : "#3679F6");

  toggleDarkModeButton(theme);
  sendMessageToGiscus({
    setConfig: {
      theme: darkMode ? "noborder_dark" : "noborder_light",
    },
  });

  if (!save) return;

  if (theme === "system") {
    localStorage.removeItem("theme");
  } else {
    localStorage.setItem("theme", theme);
  }
}

export function initialiseDarkModeToggleListener(): void {
  const darkModeToggle: HTMLElement = document.getElementById("dark-mode-toggle");
  darkModeToggle.addEventListener("click", function () {
    const savedTheme: Theme = <Theme>localStorage.getItem("theme") ?? "system";
    const nextTheme: Theme =
      savedTheme === "system" ? "dark" : savedTheme === "dark" ? "light" : "system";
    setDarkMode(nextTheme, true);
  });
}

export function initialiseDarkModeListener(): void {
  const colorSchemeQueryList: MediaQueryList = window.matchMedia("(prefers-color-scheme: dark)");
  colorSchemeQueryList.addEventListener("change", (mediaQueryEvent: MediaQueryListEvent) => {
    const savedTheme: string = localStorage.getItem("theme") ?? "system";
    if (savedTheme !== "system") return;
    setDarkMode(mediaQueryEvent.matches ? "dark" : "light", false);
  });
}

function sendMessageToGiscus(message: ISetConfigMessage): void {
  const iframe: HTMLIFrameElement = document.querySelector("iframe.giscus-frame");
  iframe?.contentWindow.postMessage({ giscus: message }, "https://giscus.app");
}

function toggleDarkModeButton(theme: Theme): void {
  document.getElementById("dark-mode-system").classList.toggle("hidden", theme !== "system");
  document.getElementById("dark-mode-dark").classList.toggle("hidden", theme !== "dark");
  document.getElementById("dark-mode-light").classList.toggle("hidden", theme !== "light");
}
