// Fix hidden sidebar site group - run in console
function fixSidebarGroup() {
  const siteGroup = document.querySelector('.sidebar__group--site');
  if (siteGroup) {
    siteGroup.style.display = 'block';
    console.log('Site group display fixed');
  } else {
    console.log('Site group not found');
  }
}

fixSidebarGroup();
