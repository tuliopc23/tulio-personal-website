/** @jsxImportSource react */
import * as React from "react";
import { Switch } from "@base-ui/react/switch";
import { motion, useReducedMotion } from "motion/react";
import { Moon, Sun } from "lucide-react";

type ThemeMode = "light" | "dark";

export default function ThemeToggle() {
  const [theme, setTheme] = React.useState<ThemeMode>("dark");
  const reducedMotion = useReducedMotion();

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
      <motion.span
        className="themeSwitch__thumb"
        layout
        transition={
          reducedMotion
            ? { duration: 0 }
            : { type: "spring", stiffness: 500, damping: 30, mass: 1 }
        }
        aria-hidden="true"
      >
        {isDark ? (
          <Moon size={14} strokeWidth={2.5} aria-hidden="true" />
        ) : (
          <Sun size={14} strokeWidth={2.5} aria-hidden="true" />
        )}
      </motion.span>
    </Switch.Root>
  );
}
