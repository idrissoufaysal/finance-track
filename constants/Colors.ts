export const Palette = {
  pineDeep: "#0D2E22",
  pineCard: "#0F382A",
  pineBorder: "rgba(52, 211, 153, 0.15)",
  mintElectric: "#34D399",
  mintBright: "#10B981",
  mintSoft: "#6EE7B7",
  mintPale: "#A7F3D0",

  red500: "#EF4444",
  red600: "#DC2626",
  amber500: "#F59E0B",
  amber400: "#FBBF24",
  blue500: "#3B82F6",
  purple500: "#8B5CF6",

  linenBg: "#F7F9F6",
  linenSecondary: "#ECEEE9",
  linenBorder: "#E2E6DF",

  obsidianBg: "#070D0A",
  obsidianSurface: "#0F1713",
  obsidianSecondary: "#16221B",
  obsidianBorder: "#192720",
};

export type ThemeColors = {
  text: string;
  textSecondary: string;
  textMuted: string;
  background: string;
  surface: string;
  surfaceSecondary: string;
  border: string;
  borderSubtle: string;
  track: string;
  tint: string;
  onTint: string;
  tintSoft: string;
  income: string;
  incomeLight: string;
  expense: string;
  expenseLight: string;
  warning: string;
  warningLight: string;
  tabIconDefault: string;
  tabIconSelected: string;
  heroCard: string;
  heroCardText: string;
  accentMint: string;
};

const Colors: { light: ThemeColors; dark: ThemeColors } = {
  light: {
    text: "#0D1612",
    textSecondary: "#6B7280",
    textMuted: "#9CA3AF",
    background: Palette.linenBg,
    surface: "#FFFFFF",
    surfaceSecondary: Palette.linenSecondary,
    border: Palette.linenBorder,
    borderSubtle: "#F0F2ED",
    track: "#ECEEE9",
    tint: Palette.pineDeep,
    onTint: "#FFFFFF",
    tintSoft: "rgba(5, 150, 105, 0.10)",
    income: Palette.mintBright,
    incomeLight: "#DCFCE7",
    expense: Palette.red500,
    expenseLight: "#FEE2E2",
    warning: Palette.amber500,
    warningLight: "#FEF3C7",
    tabIconDefault: "#9CA3AF",
    tabIconSelected: Palette.pineDeep,
    heroCard: Palette.pineCard,
    heroCardText: "#FFFFFF",
    accentMint: Palette.mintElectric,
  },
  dark: {
    text: "#FFFFFF",
    textSecondary: "#88988E",
    textMuted: "#7C8B80",
    background: Palette.obsidianBg,
    surface: Palette.obsidianSurface,
    surfaceSecondary: Palette.obsidianSecondary,
    border: Palette.obsidianBorder,
    borderSubtle: "#121C16",
    track: "#1B2A21",
    tint: Palette.mintElectric,
    onTint: Palette.obsidianBg,
    tintSoft: "rgba(52, 211, 153, 0.16)",
    income: Palette.mintElectric,
    incomeLight: "rgba(52, 211, 153, 0.15)",
    expense: Palette.red500,
    expenseLight: "rgba(239, 68, 68, 0.15)",
    warning: Palette.amber400,
    warningLight: "rgba(251, 191, 36, 0.16)",
    tabIconDefault: "#7C8B80",
    tabIconSelected: Palette.mintElectric,
    heroCard: Palette.pineCard,
    heroCardText: "#FFFFFF",
    accentMint: Palette.mintElectric,
  },
};

export default Colors;
