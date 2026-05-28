/** @jsxImportSource react */
import * as React from "react";
import { Switch } from "@base-ui/react/switch";

type ThemeMode = "light" | "dark";

export default function ThemeToggle() {
  const [theme, setTheme] = React.useState<ThemeMode>("dark");

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const controller = window.themeController;
    if (!controller) return;

    const unsubscribe = controller.subscribe((newTheme) => {
      setTheme(newTheme);
    });

    setTheme(controller.getTheme());

    return unsubscribe;
  }, []);

  const handleCheckedChange = (checked: boolean) => {
    if (typeof window === "undefined") return;
    const controller = window.themeController;
    if (!controller) return;
    controller.setTheme(checked ? "dark" : "light", { persist: true });
  };

  const isDark = theme === "dark";

  return (
    <Switch.Root
      checked={isDark}
      onCheckedChange={handleCheckedChange}
      className="themeSwitch"
      aria-label="Toggle theme"
    >
      <span className="themeSwitch__thumb" aria-hidden="true" />
    </Switch.Root>
  );
}
