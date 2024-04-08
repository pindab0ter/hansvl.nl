/**
 * Ported from https://github.com/giscus/giscus/blob/main/lib/types/giscus.ts
 */
export interface ISetConfigMessage {
  setConfig: {
    theme?: Theme;
    repo?: string;
    repoId?: string;
    category?: string;
    categoryId?: string;
    term?: string;
    description?: string;
    backLink?: string;
    number?: number;
    strict?: boolean;
    reactionsEnabled?: boolean;
    emitMetadata?: boolean;
    inputPosition?: InputPosition;
    lang?: AvailableLanguage;
  };
}

export const availableThemes = [
  "light",
  "light_high_contrast",
  "light_protanopia",
  "light_tritanopia",
  "dark",
  "dark_high_contrast",
  "dark_protanopia",
  "dark_tritanopia",
  "dark_dimmed",
  "preferred_color_scheme",
  "transparent_dark",
  "noborder_light",
  "noborder_dark",
  "noborder_gray",
  "cobalt",
  "purple_dark",
  "custom",
] as const;

export type Theme = AvailableTheme | `/${string}` | `https://${string}`;
export type AvailableTheme = (typeof availableThemes)[number];
