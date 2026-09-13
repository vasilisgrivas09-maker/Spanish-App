import type { ThemeSetting } from "./types";

export type ResolvedTheme = "dark" | "light";

export function systemPrefersDark(
  media: Pick<MediaQueryList, "matches"> | null = typeof window !== "undefined"
    ? window.matchMedia("(prefers-color-scheme: dark)")
    : null,
): boolean {
  return media?.matches ?? true;
}

export function resolveTheme(
  theme: ThemeSetting,
  prefersDark = systemPrefersDark(),
): ResolvedTheme {
  if (theme === "system") return prefersDark ? "dark" : "light";
  return theme;
}

export function defaultThemeFromSystem(
  prefersDark = systemPrefersDark(),
): ThemeSetting {
  return prefersDark ? "dark" : "light";
}
