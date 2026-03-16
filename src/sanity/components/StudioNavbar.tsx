/** @jsxImportSource react */
import { MoonIcon, SparklesIcon, SunIcon } from "@sanity/icons";
import { Button, Flex, Text } from "@sanity/ui";
import { useEffect } from "react";
import type { NavbarProps } from "sanity";
import { useColorSchemeSetValue, useColorSchemeValue } from "sanity";

export default function StudioNavbar(props: NavbarProps) {
  const scheme = useColorSchemeValue();
  const setScheme = useColorSchemeSetValue();
  const nextScheme = scheme === "light" ? "dark" : "light";

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = scheme;
    root.style.colorScheme = scheme;
  }, [scheme]);

  return (
    <div className="studioNavbar">
      {props.renderDefault(props)}

      <div className="studioNavbar__utilityBar">
        <Flex align="center" justify="space-between" gap={3}>
          <Flex align="center" gap={2}>
            <span className="studioNavbar__spark">
              <SparklesIcon />
            </span>
            <Text size={1} weight="medium" className="studioNavbar__copy">
              Editorial workspace
            </Text>
          </Flex>

          <Button
            fontSize={1}
            icon={nextScheme === "light" ? SunIcon : MoonIcon}
            mode="ghost"
            text={nextScheme === "light" ? "Light mode" : "Dark mode"}
            tone="primary"
            onClick={() => typeof setScheme === "function" && setScheme(nextScheme)}
          />
        </Flex>
      </div>
    </div>
  );
}
