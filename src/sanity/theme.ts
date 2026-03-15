// @ts-nocheck
import { buildLegacyTheme } from "sanity";

const props = {
  "--black": "#050505",
  "--white": "#f5f5f7",
  "--gray": "#050505",
  "--gray-base": "#161618",
  "--component-bg": "#161618",
  "--component-text-color": "#f5f5f7",
  "--brand-primary": "#0d8aff",
  "--default-button-color": "#f5f5f7",
  "--default-button-primary-color": "#0d8aff",
  "--default-button-success-color": "#30d948",
  "--default-button-warning-color": "#ffa00d",
  "--default-button-danger-color": "#ff473c",
  "--state-info-color": "#0d8aff",
  "--state-success-color": "#30d948",
  "--state-warning-color": "#ffa00d",
  "--state-danger-color": "#ff473c",
  "--focus-color": "#0d8aff",
};

export default buildLegacyTheme(props);
