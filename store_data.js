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
      // ✅ FIXED: Use 'id' for identification, 'image_url' for display
      const charmsGold = data.charms.filter(c => {
        const m = String(c.metal || "").toLowerCase().trim();
        return m === 'gold' || m === 'both';
      }).map(c => c.id); // Just use the ID

      const charmsSilver = data.charms.filter(c => {
        const m = String(c.metal || "").toLowerCase().trim();
        return m === 'silver' || m === 'both';
      }).map(c => c.id);

      // ✅ CRITICAL FIX: Store complete charm data including image path
      const charmMeta = {};
      data.charms.forEach(c => {
        charmMeta[c.id] = { 
          price: c.price, 
          isPremium: c.is_premium,
          name: c.name,
          // Extract just the filename from the full path
          imageFile: c.image_url ? c.image_url.split('/').pop() : c.id
        };
      });

      // ✅ FIXED: Products already have correct structure
      localStorage.setItem('pyc_charms_gold', JSON.stringify(charmsGold));
      localStorage.setItem('pyc_charms_silver', JSON.stringify(charmsSilver));
      localStorage.setItem('pyc_charm_metadata', JSON.stringify(charmMeta));
      localStorage.setItem('pyc_products', JSON.stringify(data.products));
      localStorage.setItem('pyc_coupons', JSON.stringify(data.coupons));
      localStorage.setItem('pyc_config', JSON.stringify(data.config));
      
      console.log("Store data & Pricing Config updated.");

      if (typeof updateHomePagePrices === 'function') {
        updateHomePagePrices();
      }

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
