// Debug sidebar positioning - run in console
function debugSidebarPosition() {
  const results = [];
  const sidebar = document.querySelector('.sidebar');
  
  if (!sidebar) {
    return 'Sidebar not found';
  }
  
  results.push('=== Sidebar Position Debug ===');
  
  const computed = getComputedStyle(sidebar);
  const rect = sidebar.getBoundingClientRect();
  
  results.push(`\n--- Computed Styles ---`);
  results.push(`Position: ${computed.position}`);
  results.push(`Top: ${computed.top}`);
  results.push(`Left: ${computed.left}`);
  results.push(`Right: ${computed.right}`);
  results.push(`Bottom: ${computed.bottom}`);
  results.push(`Width: ${computed.width}`);
  results.push(`Transform: ${computed.transform}`);
  
  results.push(`\n--- Bounding Rect ---`);
  results.push(`X: ${rect.x}`);
  results.push(`Y: ${rect.y}`);
  results.push(`Width: ${rect.width}`);
  results.push(`Height: ${rect.height}`);
  results.push(`Left: ${rect.left}`);
  results.push(`Right: ${rect.right}`);
  
  results.push(`\n--- Viewport ---`);
  results.push(`Window width: ${window.innerWidth}`);
  results.push(`Is mobile: ${window.matchMedia('(max-width: 1023px)').matches}`);
  
  // Check for conflicting styles
  results.push(`\n--- Inline Styles ---`);
  results.push(`Inline style: ${sidebar.getAttribute('style') || 'none'}`);
  
  return results.join('\n');
}

console.log(debugSidebarPosition());
