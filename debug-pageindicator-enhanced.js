// Enhanced PageIndicator debug - run in console
function debugPageIndicatorEnhanced() {
  const results = [];
  
  // 1. Check if elements exist
  const indicators = document.querySelectorAll('[data-page-indicator]');
  results.push(`Found ${indicators.length} PageIndicator elements`);
  
  if (!indicators.length) {
    results.push('❌ No PageIndicator elements found in DOM');
    return results.join('\n');
  }
  
  indicators.forEach((indicator, i) => {
    results.push(`\n=== PageIndicator ${i + 1} ===`);
    
    // 2. Check container setup
    const containerSelector = indicator.getAttribute('data-container');
    const itemSelector = indicator.getAttribute('data-item') || '> *';
    results.push(`Container selector: ${containerSelector}`);
    results.push(`Item selector: ${itemSelector}`);
    
    const container = containerSelector ? document.querySelector(containerSelector) : null;
    results.push(`Container found: ${!!container}`);
    
    if (container) {
      const items = Array.from(container.querySelectorAll(itemSelector));
      results.push(`Items found: ${items.length}`);
      
      if (items.length <= 1) {
        results.push('❌ Not enough items (≤1) - component hidden by script');
      }
    } else {
      results.push('❌ Container not found - component won\'t initialize');
    }
    
    // 3. Check computed styles
    const computed = getComputedStyle(indicator);
    results.push(`Display: ${computed.display}`);
    results.push(`Visibility: ${computed.visibility}`);
    results.push(`Opacity: ${computed.opacity}`);
    
    // 4. Check viewport
    const isMobile = window.matchMedia('(max-width: 1023px)').matches;
    results.push(`Mobile viewport: ${isMobile}`);
    
    // 5. Check if script ran
    const track = indicator.querySelector('[data-page-indicator-track]');
    const dots = indicator.querySelectorAll('.pageIndicator__dot');
    results.push(`Track found: ${!!track}`);
    results.push(`Dots created: ${dots.length}`);
    
    if (dots.length === 0) {
      results.push('❌ No dots created - script may not have run');
    }
  });
  
  return results.join('\n');
}

console.log(debugPageIndicatorEnhanced());
