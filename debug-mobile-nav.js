// Debug mobile navigation - run in console
function debugMobileNav() {
  const results = [];
  
  // Check hamburger button
  const hamburger = document.querySelector('.topbar__menu');
  results.push(`=== Hamburger Button ===`);
  results.push(`Found: ${!!hamburger}`);
  if (hamburger) {
    const computed = getComputedStyle(hamburger);
    results.push(`Display: ${computed.display}`);
    results.push(`Visibility: ${computed.visibility}`);
    results.push(`Opacity: ${computed.opacity}`);
    results.push(`Aria-expanded: ${hamburger.getAttribute('aria-expanded')}`);
  }
  
  // Check sidebar
  const sidebar = document.querySelector('.sidebar');
  results.push(`\n=== Sidebar ===`);
  results.push(`Found: ${!!sidebar}`);
  if (sidebar) {
    const computed = getComputedStyle(sidebar);
    results.push(`Display: ${computed.display}`);
    results.push(`Transform: ${computed.transform}`);
    results.push(`Z-index: ${computed.zIndex}`);
    results.push(`Has is-open class: ${sidebar.classList.contains('is-open')}`);
    results.push(`Aria-hidden: ${sidebar.getAttribute('aria-hidden')}`);
  }
  
  // Check sidebar navigation links
  const sidebarLinks = document.querySelectorAll('.sidebar__link');
  results.push(`\n=== Sidebar Navigation ===`);
  results.push(`Links found: ${sidebarLinks.length}`);
  sidebarLinks.forEach((link, i) => {
    if (i < 5) { // Show first 5 links
      const computed = getComputedStyle(link);
      results.push(`Link ${i + 1}: ${link.textContent?.trim()} - Display: ${computed.display}`);
    }
  });
  
  // Check topbar navigation (should be hidden on mobile)
  const topbarNavItems = document.querySelectorAll('.topbar__navItem');
  results.push(`\n=== Topbar Navigation (should be hidden on mobile) ===`);
  results.push(`Nav items found: ${topbarNavItems.length}`);
  topbarNavItems.forEach((item, i) => {
    if (i < 3) { // Check first 3 items that should be hidden
      const computed = getComputedStyle(item);
      results.push(`Item ${i + 1}: Display: ${computed.display}`);
    }
  });
  
  // Check viewport
  const isMobile = window.matchMedia('(max-width: 1023px)').matches;
  results.push(`\n=== Viewport ===`);
  results.push(`Is mobile: ${isMobile}`);
  results.push(`Width: ${window.innerWidth}px`);
  
  return results.join('\n');
}

console.log(debugMobileNav());
