/* Progressive enhancement: all floor-plan content remains available without JS. */
(function () {
  document.querySelectorAll('.layout-list').forEach(function (list, group) {
    const items = Array.from(list.querySelectorAll('.layout-item'));
    if (items.length !== 3) return;
    const panels = [];
    const labels = ['Type A', 'Type B', 'Type C'];
    const sizes = ['323 sqft', '484 sqft', '657 sqft'];
    const navigation = document.createElement('div');
    navigation.className = 'layout-tabs';
    navigation.setAttribute('role', 'tablist');
    navigation.setAttribute('aria-label', 'Choose a floor plan');
    const tabs = items.map(function (item, index) {
      const id = 'floor-plan-' + group + '-' + index;
      const tab = document.createElement('button');
      tab.type = 'button';
      tab.id = id + '-tab';
      tab.className = 'layout-tab';
      tab.setAttribute('role', 'tab');
      tab.setAttribute('aria-controls', id);
      tab.innerHTML = '<span>' + labels[index] + '</span><small>' + sizes[index] + '</small>';
      const panel = document.createElement('div');
      panel.className = 'layout-tabpanel';
      panel.id = id;
      panel.setAttribute('role', 'tabpanel');
      panel.setAttribute('aria-labelledby', tab.id);
      panel.tabIndex = 0;
      item.before(panel);
      panel.appendChild(item);
      panels.push(panel);
      item.removeAttribute('data-reveal');
      item.classList.add('revealed');
      const image = item.querySelector('.layout-plan img');
      if (image) {
        const link = document.createElement('a');
        link.className = 'layout-enlarge';
        link.href = image.src;
        link.target = '_blank';
        link.rel = 'noopener';
        link.textContent = 'View ' + labels[index] + ' plan in full size ↗';
        item.querySelector('.layout-plan').appendChild(link);
      }
      navigation.appendChild(tab);
      return tab;
    });
    function select(index, focus) {
      tabs.forEach(function (tab, i) {
        tab.setAttribute('aria-selected', String(i === index));
        tab.tabIndex = i === index ? 0 : -1;
        panels[i].hidden = i !== index;
      });
      if (focus) tabs[index].focus({ preventScroll: true });
    }
    tabs.forEach(function (tab, index) {
      tab.addEventListener('click', function () { select(index, false); });
      tab.addEventListener('keydown', function (event) {
        let next;
        if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
        if (event.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length;
        if (event.key === 'Home') next = 0;
        if (event.key === 'End') next = tabs.length - 1;
        if (next !== undefined) { event.preventDefault(); select(next, true); }
      });
    });
    list.classList.add('layout-list--tabs');
    list.before(navigation);
    select(0, false);
  });
})();
