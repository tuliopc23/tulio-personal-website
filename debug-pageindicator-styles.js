// Debug PageIndicator styling - run in console
function debugPageIndicatorStyles() {
  const results = [];
  const indicators = document.querySelectorAll('.pageIndicator');
  
  if (!indicators.length) {
    return 'No PageIndicator elements found';
  }
  
  indicators.forEach((indicator, i) => {
    results.push(`\n=== PageIndicator ${i + 1} Styles ===`);
    
    const track = indicator.querySelector('.pageIndicator__track');
    const dots = indicator.querySelectorAll('.pageIndicator__dot');
    const activeDot = indicator.querySelector('.pageIndicator__dot.is-active');
    
    if (track) {
      const trackStyles = getComputedStyle(track);
      results.push(`\n--- Track Styles ---`);
      results.push(`Background: ${trackStyles.background}`);
      results.push(`Backdrop-filter: ${trackStyles.backdropFilter}`);
      results.push(`Border-radius: ${trackStyles.borderRadius}`);
      results.push(`Box-shadow: ${trackStyles.boxShadow}`);
      results.push(`Padding: ${trackStyles.padding}`);
    }
    
    if (dots.length) {
      const dotStyles = getComputedStyle(dots[0]);
      results.push(`\n--- Dot Styles ---`);
      results.push(`Width: ${dotStyles.width}`);
      results.push(`Height: ${dotStyles.height}`);
      results.push(`Background: ${dotStyles.background}`);
      results.push(`Border-radius: ${dotStyles.borderRadius}`);
      results.push(`Box-shadow: ${dotStyles.boxShadow}`);
      results.push(`Cursor: ${dotStyles.cursor}`);
    }
    
    if (activeDot) {
      const activeStyles = getComputedStyle(activeDot);
      results.push(`\n--- Active Dot Styles ---`);
      results.push(`Width: ${activeStyles.width}`);
      results.push(`Height: ${activeStyles.height}`);
      results.push(`Background: ${activeStyles.background}`);
      results.push(`Box-shadow: ${activeStyles.boxShadow}`);
      results.push(`Has is-active class: ${activeDot.classList.contains('is-active')}`);
    } else {
      results.push(`\n--- Active Dot ---`);
      results.push(`No active dot found`);
    }
    
    // Check CSS custom properties
    const indicatorStyles = getComputedStyle(indicator);
    results.push(`\n--- CSS Variables ---`);
    results.push(`--pi-active: ${indicatorStyles.getPropertyValue('--pi-active')}`);
    results.push(`--pi-dot-size: ${indicatorStyles.getPropertyValue('--pi-dot-size')}`);
    results.push(`--pi-dot-active-size: ${indicatorStyles.getPropertyValue('--pi-dot-active-size')}`);
  });
  
  return results.join('\n');
}

console.log(debugPageIndicatorStyles());
