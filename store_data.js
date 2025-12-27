// ✅ URL IS FIXED BELOW
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwdvv7OsOR7zlwkQSCEpvm2o6m0IpDXmUuHI9wLmf6SzXQl9kwBv1HlIyBwYNmU4pEq/exec"; 

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
      // Process Charms: Normalize to lowercase for safer matching
      const charmsGold = data.charms.filter(c => {
        const m = String(c.metal || "").toLowerCase().trim();
        return m === 'gold' || m === 'both';
      }).map(c => c.id);

      const charmsSilver = data.charms.filter(c => {
        const m = String(c.metal || "").toLowerCase().trim();
        return m === 'silver' || m === 'both';
      }).map(c => c.id);

      // Metadata Map
      const charmMeta = {};
      data.charms.forEach(c => {
        charmMeta[c.id] = { price: c.price, isPremium: c.is_premium };
      });

      // Save everything to browser memory
      localStorage.setItem('pyc_charms_gold', JSON.stringify(charmsGold));
      localStorage.setItem('pyc_charms_silver', JSON.stringify(charmsSilver));
      localStorage.setItem('pyc_charm_metadata', JSON.stringify(charmMeta));
      localStorage.setItem('pyc_products', JSON.stringify(data.products)); // Curated products
      localStorage.setItem('pyc_coupons', JSON.stringify(data.coupons));
      localStorage.setItem('pyc_config', JSON.stringify(data.config));
      
      console.log("Store data updated successfully.");

      // Refresh Tray if Builder is open
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
