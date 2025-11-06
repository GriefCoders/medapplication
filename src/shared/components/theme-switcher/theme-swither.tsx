import { Button } from "@heroui/react";
import { useTheme } from "@heroui/use-theme";
import { Moon, Sun } from "lucide-react";
import { useCallback } from "react";

export const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme();

  const handleThemeChange = useCallback(
    (theme: string) => {
      setTheme(theme);
    },
    [setTheme]
  );

  return (
    <Button
      onPress={() => handleThemeChange(theme === "dark" ? "light" : "dark")}
      variant="light"
      isIconOnly
    >
      {theme === "dark" ? (
        <Sun className="text-foreground size-5" />
      ) : (
        <Moon className="text-foreground size-5" />
      )}
    </Button>
  );
};
