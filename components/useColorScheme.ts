import { useTheme } from "@/context/ThemeContext";

export const useColorScheme = (): "light" | "dark" => {
  const { theme } = useTheme();
  return theme;
};
