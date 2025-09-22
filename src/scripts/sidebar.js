(function () {
  const filter = document.querySelector('#sidebarFilter');
  const links = Array.from(document.querySelectorAll('.sidebar__link'));
  const groups = Array.from(document.querySelectorAll('.sidebar__group'));
  function apply(q){
    const t = (q||'').trim().toLowerCase();
    links.forEach(a => {
      const v = !t || a.textContent.toLowerCase().includes(t);
      a.style.display = v ? 'flex' : 'none';
    });
    groups.forEach(g => {
      const vis = Array.from(g.querySelectorAll('.sidebar__link')).some(a => a.style.display !== 'none');
      g.style.display = vis ? 'block' : 'none';
    });
  }
  filter && filter.addEventListener('input', e => apply(e.target.value));

  // Mobile toggle
  const sidebar = document.querySelector('.sidebar');
  const toggle = document.querySelector('.topbar__toggle');
  let backdrop;
  function ensureBackdrop(){
    if (!backdrop){
      backdrop = document.createElement('div');
      backdrop.className = 'backdrop';
      backdrop.addEventListener('click', close);
      document.body.appendChild(backdrop);
    }
  }
  function open(){ ensureBackdrop(); sidebar.classList.add('is-open'); backdrop.classList.add('is-open'); }
  function close(){ sidebar.classList.remove('is-open'); backdrop && backdrop.classList.remove('is-open'); }
  toggle && toggle.addEventListener('click', () => sidebar.classList.contains('is-open') ? close() : open());
  window.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
})();
