import "./safari-chrome-boot";
import "./theme";
import { recordNavigationTrail } from "../lib/navigation/go-back";
import {
  getSiteSearchOpen,
  registerSiteSearchApi,
  setSiteSearchOpen,
} from "../lib/navigation/site-search-store";

recordNavigationTrail();
registerSiteSearchApi();

window.addEventListener("keydown", (event) => {
  if (event.key.toLowerCase() !== "k" || !(event.metaKey || event.ctrlKey)) {
    return;
  }
  event.preventDefault();
  setSiteSearchOpen(!getSiteSearchOpen());
});

document.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof Element)) {
    return;
  }

  const openSearchButton = target.closest("[data-search-open]");
  if (openSearchButton instanceof HTMLButtonElement) {
    event.preventDefault();
    setSiteSearchOpen(true);
  }
});

import "./lenis";
import "./motion/index";
import "./sidebar";
import "./web-vitals";
