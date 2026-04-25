import Callout from "./Callout.astro";
import CodeBlock from "./CodeBlock.astro";
import Compare from "./Compare.astro";
import Figure from "./Figure.astro";
import KeyTakeaway from "./KeyTakeaway.astro";
import Lede from "./Lede.astro";
import PullQuote from "./PullQuote.astro";
import SectionDivider from "./SectionDivider.astro";
import Stat from "./Stat.astro";
import Table from "./Table.astro";

export const mdxComponents = {
  Callout,
  Compare,
  Figure,
  KeyTakeaway,
  Lede,
  PullQuote,
  SectionDivider,
  Stat,
  img: Figure,
  pre: CodeBlock,
  table: Table,
};
