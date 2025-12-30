// ✅ URL UPDATED
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxt-6YixCAHAFsb23MBd79YW7YcAvzlUPbotCRbwzapkIaxqcifJP9TqlBkxQ0lqKnE/exec";
window.SCRIPT_URL = SCRIPT_URL; // Make it globally available

async function fetchStoreData() {
  if (SCRIPT_URL.includes("PASTE_YOUR")) {
    console.error("❌ Google Script URL is missing in store_data.js");
    return;
  }

  console.log("Fetching latest store data...");
  try {
    const response = await fetch(SCRIPT_URL);
    const data = await response.json();

    if (data.status === "success") {
      // 1. Process Charms (Normalize metal to lowercase)
      const charmsGold = data.charms.filter(c => {
        const m = String(c.metal || "").toLowerCase().trim();
        return m === 'gold' || m === 'both';
      }).map(c => c.id);

      const charmsSilver = data.charms.filter(c => {
        const m = String(c.metal || "").toLowerCase().trim();
        return m === 'silver' || m === 'both';
      }).map(c => c.id);

      // 2. Process Metadata (Prices & Premium)
      const charmMeta = {};
      data.charms.forEach(c => {
        charmMeta[c.id] = { price: c.price, isPremium: c.is_premium };
      });

      // 3. Save ALL Levers to Storage
      localStorage.setItem('pyc_charms_gold', JSON.stringify(charmsGold));
      localStorage.setItem('pyc_charms_silver', JSON.stringify(charmsSilver));
      localStorage.setItem('pyc_charm_metadata', JSON.stringify(charmMeta));
      localStorage.setItem('pyc_products', JSON.stringify(data.products));
      localStorage.setItem('pyc_coupons', JSON.stringify(data.coupons));
      localStorage.setItem('pyc_config', JSON.stringify(data.config));
      
      console.log("Store data & Pricing Config updated.");

      // 4. Update UI immediately if on Index Page
      if (typeof updateHomePagePrices === 'function') {
        updateHomePagePrices();
      }

      // 5. Refresh Tray if on Builder Page
      if (typeof loadTray === 'function') {
        if(window.CHARMS) {
            window.CHARMS.gold = charmsGold;
            window.CHARMS.silver = charmsSilver;
        }
        loadTray();
      }
    }
  } catch (error) {
    console.error("Failed to fetch store data.", error);
  }
}

fetchStoreData();

// ==========================================
// ✅ FIRST-TOUCH UTM TRACKING (Paste at bottom of store_data.js)
// ==========================================
(function captureFirstTouchUTMs() {
  // 1. GUARD CLAUSE: If we already have a First Source, STOP.
  // This ensures we never overwrite the original source, even if they click a new ad.
  if (localStorage.getItem('pyc_first_touch_utm')) {
    // console.log("First Touch already active. Ignoring new UTMs.");
    return; 
  }

  const params = new URLSearchParams(window.location.search);
  
  // 2. Only capture if actual parameters exist
  if (params.has('utm_source') || params.has('utm_campaign') || params.has('utm_medium')) {
    
    const utmData = {
      source: params.get('utm_source') || '',
      medium: params.get('utm_medium') || '',
      campaign: params.get('utm_campaign') || '',
      term: params.get('utm_term') || '',
      content: params.get('utm_content') || '',
      first_visit_date: new Date().toISOString() // Useful for your analytics
    };
    
    // 3. Save to Local Storage (Persists forever, even after browser restart)
    localStorage.setItem('pyc_first_touch_utm', JSON.stringify(utmData));
    console.log("First Touch Captured:", utmData);
  }
})();
