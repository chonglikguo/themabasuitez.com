(function () {
  const menuButton = document.querySelector('[data-nav-toggle]');
  const menu = document.querySelector('[data-nav-panel]');

  function closeMenu() {
    if (!menuButton || !menu) return;
    menu.classList.remove('open');
    document.body.classList.remove('menu-open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Open navigation');
  }

  if (menuButton && menu) {
    menuButton.addEventListener('click', function () {
      const isOpen = menu.classList.toggle('open');
      document.body.classList.toggle('menu-open', isOpen);
      menuButton.setAttribute('aria-expanded', String(isOpen));
      menuButton.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
    });
    menu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth >= 1020) closeMenu();
    });
    document.addEventListener('keydown', function (event) {
      if (event.key !== 'Escape' || !menu.classList.contains('open')) return;
      closeMenu();
      menuButton.focus();
    });
  }

  document.querySelectorAll('[data-faq-button]').forEach(function (button) {
    button.addEventListener('click', function () {
      const item = button.closest('.faq-item');
      const open = item.classList.toggle('open');
      button.setAttribute('aria-expanded', String(open));
    });
  });

  const revealItems = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12 });
    revealItems.forEach(function (item) { observer.observe(item); });
  } else {
    revealItems.forEach(function (item) { item.classList.add('revealed'); });
  }

  function setStatus(form, message, type) {
    const status = form.querySelector('[data-form-status]');
    if (!status) return;
    status.textContent = message;
    status.classList.remove('is-error', 'is-success');
    if (type) status.classList.add(type);
  }

  document.querySelectorAll('[data-enquiry-form]').forEach(function (form) {
    form.addEventListener('submit', async function (event) {
      event.preventDefault();
      setStatus(form, '', '');

      if (!form.reportValidity()) return;
      if (form.elements.company_website && form.elements.company_website.value) return;

      const endpoint = (form.dataset.endpoint || '').trim();
      if (!endpoint || endpoint.includes('REPLACE_WITH')) {
        setStatus(form, 'Registration is being prepared. Please try again shortly.', 'is-error');
        return;
      }

      const submitButton = form.querySelector('button[type="submit"]');
      const originalLabel = submitButton.textContent;
      const data = new FormData(form);
      const countryCode = data.get('country_code') || '';
      const contactNumber = String(data.get('contact_number') || '').replace(/^0+/, '');
      data.set('whatsapp_number', countryCode + contactNumber);
      data.set('page_url', window.location.href);
      data.set('submitted_at', new Date().toISOString());

      submitButton.disabled = true;
      submitButton.textContent = 'Sending...';
      setStatus(form, 'Sending your enquiry securely.', '');

      try {
        await fetch(endpoint, {
          method: 'POST',
          mode: 'no-cors',
          body: new URLSearchParams(Array.from(data.entries()))
        });
        form.reset();
        const defaultCode = form.querySelector('[name="country_code"]');
        if (defaultCode) defaultCode.value = '+60';
        setStatus(form, 'Thank you. Your registration has been received.', 'is-success');
      } catch (error) {
        setStatus(form, 'We could not send your enquiry. Please try again.', 'is-error');
      } finally {
        submitButton.disabled = false;
        submitButton.textContent = originalLabel;
      }
    });
  });
})();
