// Debug mobile sidebar filter logic - run in console
function debugMobileFilter() {
  const results = [];
  
  // Open sidebar first
  const sidebar = document.querySelector('.sidebar');
  const toggle = document.querySelector('.topbar__menu');
  if (sidebar && toggle) {
    sidebar.classList.add('is-open');
    sidebar.setAttribute('aria-hidden', 'false');
  }
  
  results.push('=== Mobile Filter Logic Debug ===');
  
  const siteGroup = document.querySelector('.sidebar__group--site');
  const siteLinks = document.querySelectorAll('.sidebar__group--site .sidebar__link');
  
  results.push(`Site group found: ${!!siteGroup}`);
  results.push(`Site links found: ${siteLinks.length}`);
  
  // Check each link's visibility logic
  siteLinks.forEach((link, i) => {
    const computed = getComputedStyle(link);
    const inlineStyle = link.style.display;
    const isVisible = computed.display !== "none" && inlineStyle !== "none";
    
    results.push(`\nLink ${i + 1}: ${link.textContent?.trim()}`);
    results.push(`  Computed display: ${computed.display}`);
    results.push(`  Inline display: ${inlineStyle || 'not set'}`);
    results.push(`  Filter logic sees as visible: ${isVisible}`);
  });
  
  // Test the exact filter logic
  const hasVisible = Array.from(siteLinks).some((anchor) => {
    const computed = getComputedStyle(anchor);
    return computed.display !== "none" && anchor.style.display !== "none";
  });
  
  results.push(`\n--- Filter Logic Result ---`);
  results.push(`hasVisible result: ${hasVisible}`);
  results.push(`Group should be: ${hasVisible ? 'block' : 'none'}`);
  results.push(`Group actually is: ${getComputedStyle(siteGroup).display}`);
  
  // Force fix the group
  if (siteGroup) {
    siteGroup.style.display = 'block !important';
    results.push(`\nForced group to block !important`);
    setTimeout(() => {
      results.push(`After force: ${getComputedStyle(siteGroup).display}`);
      console.log(results.join('\n'));
    }, 50);
  }
  
  return 'Debugging mobile filter...';
}

console.log(debugMobileFilter());
