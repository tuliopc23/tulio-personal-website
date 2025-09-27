import * as styledComponents from "styled-components/dist/styled-components.esm.js";

const maybeDefault = (styledComponents as { default?: unknown }).default;
const styledExport =
  typeof maybeDefault === "function"
    ? maybeDefault
    : (styledComponents as { styled?: unknown }).styled;

if (typeof styledExport !== "function") {
  throw new Error("styled-components shim: expected a function export for styled.");
}

export * from "styled-components/dist/styled-components.esm.js";
export default styledExport as typeof styledComponents.default;
