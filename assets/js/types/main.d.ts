export type Theme = "light" | "dark" | "system";

export interface CustomWindow extends Window {
  setDarkMode: (theme: Theme, save?: boolean) => void;
  smoothScrollToNode: (id: string) => void;
}
