(function () {
  const menuButton = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (menuButton && navLinks) {
    menuButton.addEventListener('click', function () {
      const open = navLinks.classList.toggle('open');
      document.body.classList.toggle('menu-open', open);
      menuButton.setAttribute('aria-expanded', open);
    });
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('open');
        document.body.classList.remove('menu-open');
        menuButton.setAttribute('aria-expanded', 'false');
      });
    });
  }
  document.querySelectorAll('.faq-item button').forEach(function (button) {
    button.addEventListener('click', function () {
      const item = button.closest('.faq-item');
      const isOpen = item.classList.toggle('open');
      button.setAttribute('aria-expanded', isOpen);
    });
  });
  const form = document.querySelector('[data-preview-form]');
  if (form) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      const status = form.querySelector('.form-status');
      status.classList.add('show');
      status.focus();
    });
  }
})();