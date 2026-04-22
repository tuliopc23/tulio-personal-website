import Callout from "./Callout.astro";
import CodeBlock from "./CodeBlock.astro";
import Figure from "./Figure.astro";
import PullQuote from "./PullQuote.astro";
import Table from "./Table.astro";

export const mdxComponents = {
  Callout,
  Figure,
  PullQuote,
  img: Figure,
  pre: CodeBlock,
  table: Table,
};
