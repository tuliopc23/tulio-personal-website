// Debug hamburger button click - run in console
function debugHamburgerClick() {
  const results = [];
  const hamburger = document.querySelector('.topbar__menu');
  const sidebar = document.querySelector('.sidebar');
  
  results.push('=== Hamburger Click Debug ===');
  results.push(`Hamburger found: ${!!hamburger}`);
  results.push(`Sidebar found: ${!!sidebar}`);
  
  if (hamburger) {
    // Check if click handler is attached
    const listeners = getEventListeners ? getEventListeners(hamburger) : 'DevTools required';
    results.push(`Click listeners: ${typeof listeners === 'object' ? listeners.click?.length || 0 : listeners}`);
    
    // Test manual click
    results.push(`\n--- Manual Click Test ---`);
    results.push(`Before click - sidebar is-open: ${sidebar?.classList.contains('is-open')}`);
    results.push(`Before click - aria-expanded: ${hamburger.getAttribute('aria-expanded')}`);
    
    // Simulate click
    hamburger.click();
    
    setTimeout(() => {
      results.push(`After click - sidebar is-open: ${sidebar?.classList.contains('is-open')}`);
      results.push(`After click - aria-expanded: ${hamburger.getAttribute('aria-expanded')}`);
      results.push(`After click - sidebar visibility: ${getComputedStyle(sidebar).visibility}`);
      results.push(`After click - sidebar transform: ${getComputedStyle(sidebar).transform}`);
      
      // Check if site group is visible now
      const siteGroup = document.querySelector('.sidebar__group--site');
      if (siteGroup) {
        results.push(`Site group display: ${getComputedStyle(siteGroup).display}`);
        results.push(`Site group visibility: ${getComputedStyle(siteGroup).visibility}`);
      }
      
      console.log(results.join('\n'));
    }, 100);
  }
  
  return 'Testing hamburger click...';
}

console.log(debugHamburgerClick());
