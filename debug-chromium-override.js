// Debug Chromium-specific overrides - run in Chrome DevTools console
function debugChromiumOverride() {
  const results = [];
  const dots = document.querySelectorAll('.pageIndicator__dot');
  
  if (!dots.length) {
    return 'No dots found';
  }
  
  const dot = dots[0];
  results.push('=== Chromium Override Debug ===');
  results.push(`User Agent: ${navigator.userAgent}`);
  
  // Get all applied styles for the dot
  const computed = getComputedStyle(dot);
  results.push(`\nComputed styles:`);
  results.push(`Width: ${computed.width}`);
  results.push(`Height: ${computed.height}`);
  results.push(`Border-radius: ${computed.borderRadius}`);
  results.push(`Background: ${computed.background}`);
  results.push(`Box-shadow: ${computed.boxShadow}`);
  
  // Check for webkit-specific overrides
  results.push(`\nWebkit-specific checks:`);
  results.push(`-webkit-appearance: ${computed.webkitAppearance || computed.appearance}`);
  results.push(`-webkit-tap-highlight-color: ${computed.webkitTapHighlightColor}`);
  
  // Find all CSS rules that match this element
  const matchingRules = [];
  Array.from(document.styleSheets).forEach(sheet => {
    try {
      Array.from(sheet.cssRules || []).forEach(rule => {
        if (rule.selectorText && dot.matches && dot.matches(rule.selectorText)) {
          matchingRules.push({
            selector: rule.selectorText,
            styles: rule.style.cssText,
            important: rule.style.cssText.includes('!important')
          });
        }
      });
    } catch (e) {
      // Cross-origin or other access issues
    }
  });
  
  results.push(`\nMatching CSS rules (${matchingRules.length}):`);
  matchingRules.forEach(rule => {
    results.push(`${rule.selector}: ${rule.styles}`);
  });
  
  return results.join('\n');
}

console.log(debugChromiumOverride());
