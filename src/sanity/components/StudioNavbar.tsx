/** @jsxImportSource react */
import { MoonIcon, SparklesIcon, SunIcon } from "@sanity/icons";
import { Button, Card, Flex, Text } from "@sanity/ui";
import { useEffect } from "react";
import type { NavbarProps } from "sanity";
import { useColorSchemeSetValue, useColorSchemeValue } from "sanity";

export default function StudioNavbar(props: NavbarProps) {
  const scheme = useColorSchemeValue();
  const setScheme = useColorSchemeSetValue();
  const nextScheme = scheme === "light" ? "dark" : "light";
  const nextLabel = nextScheme === "light" ? "Light mode" : "Dark mode";

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = scheme;
    root.style.colorScheme = scheme;
    document.body.dataset.studioScheme = scheme;
  }, [scheme]);

  return (
    <div className="studioNavbarChrome">
      {props.renderDefault(props)}

      <div className="studioNavbarChrome__controls">
        <Card className="studioNavbarChrome__pill" padding={2} radius={4} shadow={2}>
          <Flex align="center" gap={3}>
            <Flex align="center" gap={2}>
              <span className="studioNavbarChrome__spark">
                <SparklesIcon />
              </span>
              <Text size={1} weight="medium" className="studioNavbarChrome__label">
                Editorial workspace
              </Text>
            </Flex>

            <Button
              fontSize={1}
              icon={nextScheme === "light" ? SunIcon : MoonIcon}
              mode="bleed"
              padding={3}
              text={nextLabel}
              tone="primary"
              onClick={() => typeof setScheme === "function" && setScheme(nextScheme)}
            />
          </Flex>
        </Card>
      </div>
    </div>
  );
}
