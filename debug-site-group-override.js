// Debug what's overriding site group display - run in console
function debugSiteGroupOverride() {
  const results = [];
  const siteGroup = document.querySelector('.sidebar__group--site');
  
  if (!siteGroup) {
    return 'Site group not found';
  }
  
  results.push('=== Site Group Override Debug ===');
  
  // Check computed vs inline styles
  const computed = getComputedStyle(siteGroup);
  results.push(`Computed display: ${computed.display}`);
  results.push(`Inline display: ${siteGroup.style.display || 'not set'}`);
  
  // Find all CSS rules targeting this element
  const matchingRules = [];
  Array.from(document.styleSheets).forEach(sheet => {
    try {
      Array.from(sheet.cssRules || []).forEach(rule => {
        if (rule.selectorText && siteGroup.matches && siteGroup.matches(rule.selectorText)) {
          matchingRules.push({
            selector: rule.selectorText,
            display: rule.style.display || 'not set',
            source: sheet.href || 'inline',
            specificity: getSpecificity(rule.selectorText)
          });
        }
      });
    } catch (e) {
      // Cross-origin
    }
  });
  
  results.push(`\n--- CSS Rules (${matchingRules.length}) ---`);
  matchingRules
    .sort((a, b) => b.specificity - a.specificity)
    .forEach(rule => {
      results.push(`${rule.selector} (${rule.specificity}) - display: ${rule.display}`);
    });
  
  // Check if JavaScript is setting it
  results.push(`\n--- JavaScript Override Check ---`);
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
        console.log('Style changed by JS:', mutation.target.style.display);
      }
    });
  });
  
  observer.observe(siteGroup, { attributes: true, attributeFilter: ['style'] });
  
  // Force set and see if it gets overridden
  siteGroup.style.display = 'block';
  setTimeout(() => {
    results.push(`After forcing block: ${getComputedStyle(siteGroup).display}`);
    results.push(`Inline after force: ${siteGroup.style.display}`);
    observer.disconnect();
    console.log(results.join('\n'));
  }, 100);
  
  return 'Checking for overrides...';
}

function getSpecificity(selector) {
  const ids = (selector.match(/#/g) || []).length * 100;
  const classes = (selector.match(/\./g) || []).length * 10;
  const elements = (selector.match(/[a-zA-Z]/g) || []).length;
  return ids + classes + elements;
}

console.log(debugSiteGroupOverride());
