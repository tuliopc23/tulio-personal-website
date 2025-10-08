// Debug sidebar link visibility - run in console
function debugSidebarLinks() {
  const results = [];
  const sidebar = document.querySelector('.sidebar');
  
  if (!sidebar) {
    return 'No sidebar found';
  }
  
  // Open sidebar first to see links
  sidebar.classList.add('is-open');
  
  const siteGroup = document.querySelector('.sidebar__group--site');
  results.push(`=== Site Group ===`);
  results.push(`Found: ${!!siteGroup}`);
  
  if (siteGroup) {
    const computed = getComputedStyle(siteGroup);
    results.push(`Display: ${computed.display}`);
    results.push(`Visibility: ${computed.visibility}`);
    results.push(`Opacity: ${computed.opacity}`);
    results.push(`Height: ${computed.height}`);
  }
  
  const siteLinks = document.querySelectorAll('.sidebar__group--site .sidebar__link');
  results.push(`\n=== Site Navigation Links ===`);
  results.push(`Found: ${siteLinks.length}`);
  
  siteLinks.forEach((link, i) => {
    const computed = getComputedStyle(link);
    const rect = link.getBoundingClientRect();
    results.push(`\nLink ${i + 1}: ${link.textContent?.trim()}`);
    results.push(`  Display: ${computed.display}`);
    results.push(`  Visibility: ${computed.visibility}`);
    results.push(`  Opacity: ${computed.opacity}`);
    results.push(`  Position: ${computed.position}`);
    results.push(`  Color: ${computed.color}`);
    results.push(`  Background: ${computed.background}`);
    results.push(`  Rect: ${rect.width}x${rect.height} at (${rect.x}, ${rect.y})`);
    results.push(`  Href: ${link.href}`);
  });
  
  // Check if filter is hiding them
  const filter = document.querySelector('#sidebarFilter');
  if (filter) {
    results.push(`\n=== Filter ===`);
    results.push(`Value: "${filter.value}"`);
  }
  
  return results.join('\n');
}

console.log(debugSidebarLinks());
