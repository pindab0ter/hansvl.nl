/**
 * Dark mode preferences are loaded and applied in a script tag in the head of
 * the document to prevent a FOUD (flash of unstyled document).
 *
 * @var {string} value The value of the theme preference. Can be either:
 *  - "light"
 *  - "dark"
 *  - "system"
 */
export function setDarkMode(value) {
  const prefersDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const darkMode = value === "dark" || (value === "system" && prefersDarkMode);

  document.documentElement.classList.toggle("dark", darkMode);

  if (value === "system") {
    localStorage.removeItem("theme");
  } else {
    localStorage.setItem("theme", value);
  }
}

export function initialiseDarkModeListener() {
  const colorSchemeQueryList = window.matchMedia("(prefers-color-scheme: dark)");
  colorSchemeQueryList.addEventListener("change", (mediaQueryEvent) => {
    const savedTheme = localStorage.getItem("theme") ?? "system";
    if (savedTheme !== "system") return;
    document.documentElement.classList.toggle("dark", mediaQueryEvent.matches);
  });
}
