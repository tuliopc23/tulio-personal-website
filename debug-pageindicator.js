// Debug PageIndicator styling issues
// Run in browser console: copy(debugPageIndicator())

function debugPageIndicator() {
  const indicators = document.querySelectorAll('.pageIndicator');
  const results = [];
  
  if (!indicators.length) {
    return 'No .pageIndicator elements found';
  }
  
  indicators.forEach((indicator, i) => {
    const computed = getComputedStyle(indicator);
    const track = indicator.querySelector('.pageIndicator__track');
    const dots = indicator.querySelectorAll('.pageIndicator__dot');
    
    results.push(`\n=== PageIndicator ${i + 1} ===`);
    results.push(`Display: ${computed.display} (should be: flex on mobile)`);
    results.push(`Visibility: ${computed.visibility}`);
    results.push(`Opacity: ${computed.opacity}`);
    results.push(`Z-index: ${computed.zIndex}`);
    results.push(`Position: ${computed.position}`);
    results.push(`Pointer events: ${computed.pointerEvents}`);
    
    // Check media query
    const isMobile = window.matchMedia('(max-width: 1023px)').matches;
    results.push(`Is mobile viewport: ${isMobile}`);
    
    if (track) {
      const trackComputed = getComputedStyle(track);
      results.push(`Track display: ${trackComputed.display}`);
      results.push(`Track background: ${trackComputed.background}`);
      results.push(`Track backdrop-filter: ${trackComputed.backdropFilter}`);
      results.push(`Dots count: ${dots.length}`);
    }
    
    // Find overriding styles
    const overrides = [];
    const sheets = Array.from(document.styleSheets);
    
    sheets.forEach(sheet => {
      try {
        const rules = Array.from(sheet.cssRules || []);
        rules.forEach(rule => {
          if (rule.selectorText && rule.selectorText.includes('.pageIndicator')) {
            const specificity = getSpecificity(rule.selectorText);
            overrides.push({
              selector: rule.selectorText,
              specificity,
              display: rule.style.display || 'not set',
              source: sheet.href || 'inline'
            });
          }
        });
      } catch (e) {
        // Cross-origin stylesheet
      }
    });
    
    if (overrides.length) {
      results.push('\n--- Potential Overrides ---');
      overrides
        .sort((a, b) => b.specificity - a.specificity)
        .forEach(override => {
          results.push(`${override.selector} (${override.specificity}) - display: ${override.display}`);
          results.push(`  Source: ${override.source}`);
        });
    }
  });
  
  return results.join('\n');
}

function getSpecificity(selector) {
  const ids = (selector.match(/#/g) || []).length * 100;
  const classes = (selector.match(/\./g) || []).length * 10;
  const elements = (selector.match(/[a-zA-Z]/g) || []).length;
  return ids + classes + elements;
}

// Auto-run and copy to clipboard
console.log(debugPageIndicator());
