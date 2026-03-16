// @ts-nocheck
import { buildLegacyTheme } from "sanity";

const props = {
  "--brand-primary": "#0d8aff",
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
