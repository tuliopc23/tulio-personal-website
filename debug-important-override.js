// Find CSS !important rules overriding display - run in console
function debugImportantOverride() {
  const results = [];
  const siteGroup = document.querySelector('.sidebar__group--site');
  
  if (!siteGroup) {
    return 'Site group not found';
  }
  
  results.push('=== !important Override Debug ===');
  
  // Check all stylesheets for !important display rules
  Array.from(document.styleSheets).forEach((sheet, sheetIndex) => {
    try {
      Array.from(sheet.cssRules || []).forEach((rule, ruleIndex) => {
        if (rule.style && rule.style.display) {
          const isImportant = rule.style.getPropertyPriority('display') === 'important';
          const matches = siteGroup.matches && siteGroup.matches(rule.selectorText);
          
          if (isImportant || matches) {
            results.push(`Sheet ${sheetIndex}, Rule ${ruleIndex}:`);
            results.push(`  Selector: ${rule.selectorText}`);
            results.push(`  Display: ${rule.style.display}`);
            results.push(`  Important: ${isImportant}`);
            results.push(`  Matches element: ${matches}`);
            results.push(`  Source: ${sheet.href || 'inline'}`);
          }
        }
      });
    } catch (e) {
      results.push(`Sheet ${sheetIndex}: ${e.message}`);
    }
  });
  
  // Check for hidden attribute or other attributes
  results.push(`\n--- Element Attributes ---`);
  Array.from(siteGroup.attributes).forEach(attr => {
    results.push(`${attr.name}: ${attr.value}`);
  });
  
  // Check parent elements
  results.push(`\n--- Parent Chain ---`);
  let parent = siteGroup.parentElement;
  let level = 0;
  while (parent && level < 3) {
    const computed = getComputedStyle(parent);
    results.push(`Parent ${level}: ${parent.tagName}.${parent.className}`);
    results.push(`  Display: ${computed.display}`);
    results.push(`  Visibility: ${computed.visibility}`);
    parent = parent.parentElement;
    level++;
  }
  
  return results.join('\n');
}

console.log(debugImportantOverride());
