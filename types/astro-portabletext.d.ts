declare module "astro-portabletext" {
  import type { PortableTextBlock } from "@portabletext/types";

  export interface PortableTextProps {
    value?: PortableTextBlock[] | PortableTextBlock | null;
    components?: Record<string, unknown>;
  }

  export function PortableText(props: PortableTextProps): unknown;

  export function toPlainText(
    blocks?: PortableTextBlock[] | PortableTextBlock | null
  ): string;
}
