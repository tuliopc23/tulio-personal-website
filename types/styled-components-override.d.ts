declare module "styled-components/dist/styled-components.esm.js" {
  export * from "styled-components";
  const styled: typeof import("styled-components").default;
  export default styled;
}
