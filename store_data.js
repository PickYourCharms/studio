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
      console.log("✅ Data fetched successfully");
      console.log("Raw charms data:", data.charms);
      
      // Process Charms
      const charmsGold = data.charms.filter(c => {
        const m = String(c.metal || "").toLowerCase().trim();
        return m === 'gold' || m === 'both';
      }).map(c => c.id);

      const charmsSilver = data.charms.filter(c => {
        const m = String(c.metal || "").toLowerCase().trim();
        return m === 'silver' || m === 'both';
      }).map(c => c.id);

      // ✅ UPDATED: Better filename extraction
      const charmMeta = {};
      data.charms.forEach(c => {
        // Handle both "assets/charms/file.png" and "file.png" formats
        let imageFile = c.image_url || c.id;
        
        // If it contains a path, extract just the filename
        if (imageFile.includes('/')) {
          imageFile = imageFile.split('/').pop();
        }
        
        charmMeta[c.id] = { 
          price: c.price, 
          isPremium: c.is_premium,
          name: c.name,
          imageFile: imageFile
        };
        
        console.log(`Charm registered: ${c.id} → ${imageFile}`);
      });

      console.log('✅ Processed metadata:', charmMeta);

      localStorage.setItem('pyc_charms_gold', JSON.stringify(charmsGold));
      localStorage.setItem('pyc_charms_silver', JSON.stringify(charmsSilver));
      localStorage.setItem('pyc_charm_metadata', JSON.stringify(charmMeta));
      localStorage.setItem('pyc_products', JSON.stringify(data.products));
      localStorage.setItem('pyc_coupons', JSON.stringify(data.coupons));
      localStorage.setItem('pyc_config', JSON.stringify(data.config));
      
      console.log("✅ Store data saved to localStorage");

      if (typeof updateHomePagePrices === 'function') {
        updateHomePagePrices();
      }

      if (typeof loadTray === 'function') {
        console.log('🔄 Triggering tray reload...');
        if(window.CHARMS) {
            window.CHARMS.gold = charmsGold;
            window.CHARMS.silver = charmsSilver;
        }
        // ✅ ADD: Also update global metadata
        if (window.CHARM_METADATA && typeof window.CHARM_METADATA === 'object') {
          Object.assign(window.CHARM_METADATA, charmMeta);
        }
        loadTray();
      }
    }
  } catch (error) {
    console.error("❌ Failed to fetch store data:", error);
  }
}
```

### Step 4: Check your Google Sheet column names

Make sure your **Charms_Inventory** sheet has exactly these column headers:
- `id` (not `ID` or `Id`)
- `image_url` (not `image_URL` or `imageUrl`)

The column names are **case-sensitive**!

### Step 5: Clear cache and test

1. Open browser console (F12)
2. Run: `localStorage.clear()` and `sessionStorage.clear()`
3. Refresh the page
4. Check console logs - you should see all the debug messages

---

## What to look for in console:

✅ **Good output:**
```
✅ Data fetched successfully
Charm registered: 3DBowRibbon_Charm_Gold.png → 3DBowRibbon_Charm_Gold.png
✅ Processed metadata: {3DBowRibbon_Charm_Gold.png: {...}, ...}
✅ Loaded 5 charms into tray
```

❌ **Bad output (tells you the problem):**
```
❌ Missing metadata for charm ID: 3DBowRibbon_Charm_Gold.png
Available metadata keys: []
