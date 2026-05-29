/** @jsxImportSource react */

import houseSvg from "@phosphor-icons/core/assets/regular/house.svg?raw";
import notebookSvg from "@phosphor-icons/core/assets/regular/notebook.svg?raw";
import briefcaseSvg from "@phosphor-icons/core/assets/regular/briefcase.svg?raw";
import sparkleSvg from "@phosphor-icons/core/assets/regular/sparkle.svg?raw";
import magnifyingGlassSvg from "@phosphor-icons/core/assets/regular/magnifying-glass.svg?raw";
import caretLeftSvg from "@phosphor-icons/core/assets/regular/caret-left.svg?raw";
import listSvg from "@phosphor-icons/core/assets/regular/list.svg?raw";

const iconMap = {
  house: houseSvg,
  notebook: notebookSvg,
  briefcase: briefcaseSvg,
  sparkle: sparkleSvg,
  "magnifying-glass": magnifyingGlassSvg,
  "caret-left": caretLeftSvg,
  list: listSvg,
} as const;

export type NavPhosphorIconName = keyof typeof iconMap;

type NavPhosphorIconProps = {
  name: NavPhosphorIconName;
  className?: string;
};

export function NavPhosphorIcon({ name, className }: NavPhosphorIconProps) {
  const svg = iconMap[name];

  return (
    <span
      className={className ?? "mobileLiquidNav__icon"}
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
