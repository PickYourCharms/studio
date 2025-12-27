(function () {
  let locked = false;

  // --- Utility ---
  function once(fn) {
    if (locked) return;
    locked = true;
    fn();
  }

  // --- Push ONE controlled history state ---
  function armHistory() {
    history.replaceState({ pyc: true }, '', location.href);
  }

  // --- Detect PDP Drawer ---
  function isPdpOpen() {
    return document.querySelector('.pdp-overlay?.active, .pdp-drawer?.active');
  }

  function closePdp() {
    const overlay = document.querySelector('.pdp-overlay');
    const drawer = document.querySelector('.pdp-drawer');
    overlay?.classList.remove('active');
    drawer?.classList.remove('active');
  }

  // --- Detect Checkout Stay Modal ---
  function hasCheckoutModal() {
    return typeof window.openStayModal === 'function';
  }

  // --- Frozen State (Post Add-To-Cart) ---
  function isFrozenState() {
    return document.body.classList.contains('frozen-state');
  }

  // --- WhatsApp Return Detection ---
  function isWhatsappReturn() {
    return sessionStorage.getItem('pyc_payment_done') === 'true';
  }

  // --- GLOBAL BACK HANDLER ---
  window.addEventListener('popstate', function () {
    once(() => {

      // 1️⃣ PDP Drawer (device back = close drawer)
      if (isPdpOpen()) {
        closePdp();
        armHistory();
        locked = false;
        return;
      }

      // 2️⃣ Checkout page stay modal
      if (hasCheckoutModal()) {
        window.openStayModal();
        armHistory();
        locked = false;
        return;
      }

      // 3️⃣ Post-payment WhatsApp return
      if (isWhatsappReturn() && typeof window.showOrderConfirmation === 'function') {
        sessionStorage.removeItem('pyc_payment_done');
        window.showOrderConfirmation();
        armHistory();
        locked = false;
        return;
      }

      // 4️⃣ Frozen state → go index
      if (isFrozenState()) {
        window.location.href = 'index.html';
        return;
      }

      // 5️⃣ Existing in-app back logic (DON'T TOUCH)
      if (typeof window.handleBackNavigation === 'function') {
        window.handleBackNavigation();
        return;
      }

      // 6️⃣ Fallback
      window.location.href = 'index.html';
    });
  });

  // --- Init ---
  document.addEventListener('DOMContentLoaded', armHistory);
})();
