// Debug sidebar visibility - run in console
function debugSidebarVisibility() {
  const results = [];
  const sidebar = document.querySelector('.sidebar');
  
  if (!sidebar) {
    return 'Sidebar not found';
  }
  
  results.push('=== Sidebar Visibility Debug ===');
  
  const computed = getComputedStyle(sidebar);
  results.push(`Sidebar visibility: ${computed.visibility}`);
  results.push(`Sidebar display: ${computed.display}`);
  results.push(`Sidebar aria-hidden: ${sidebar.getAttribute('aria-hidden')}`);
  results.push(`Sidebar is-open class: ${sidebar.classList.contains('is-open')}`);
  
  // Check if opening sidebar fixes visibility
  results.push(`\n--- Opening Sidebar ---`);
  sidebar.classList.add('is-open');
  sidebar.setAttribute('aria-hidden', 'false');
  
  setTimeout(() => {
    const newComputed = getComputedStyle(sidebar);
    results.push(`After opening - visibility: ${newComputed.visibility}`);
    results.push(`After opening - display: ${newComputed.display}`);
    
    const siteGroup = document.querySelector('.sidebar__group--site');
    if (siteGroup) {
      const groupComputed = getComputedStyle(siteGroup);
      results.push(`Site group visibility: ${groupComputed.visibility}`);
      results.push(`Site group display: ${groupComputed.display}`);
    }
    
    console.log(results.join('\n'));
  }, 50);
  
  return 'Checking sidebar visibility...';
}

console.log(debugSidebarVisibility());
