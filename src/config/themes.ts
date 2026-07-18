import type { Theme, ThemeColors, ThemeName } from "../types/themes";

export { type Theme, type ThemeName, type ThemeColors };

export const THEMES: Record<string, Theme> = {
    light_default: {
        background: "#f9fafb",
        foreground: "#111827",
        accent: "#3b82f6",
        muted: "#6b7280",
        border: "#e5e7eb",
        surface: "#ffffff",
        isDark: false,
    },
    dark_default: {
        background: "#212737",
        foreground: "#eaedf3",
        accent: "#ff6b01",
        muted: "#343f60",
        border: "#ab4b08",
        surface: "#212737",
        isDark: true,
    },
    light_notepad: {
        isDark: false,
        background: '#fdf8e9',
        surface: '#fdf8e9',
        foreground: '#29231c',
        muted: '#736658',
        border: '#eaddc6',
        accent: '#b84c30',
    },
    dark_contrast: {
        isDark: true,
        background: '#171717',
        surface: '#202020',
        foreground: '#f5f5f5',
        muted: '#a3a3a3',
        border: '#3a3a3a',
        accent: '#facc15',
    }
};
