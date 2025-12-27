/* config.js - Global Configuration */

// YOUR Google Apps Script URL
const API_URL = "https://script.google.com/macros/s/AKfycbwiersQPgKEZ3ZzH3C4ilYYm9Rqqoedf9PhMS8JOmDgnBffLSqwAF6047b6kVqix6h_/exec";

// Global Data Store
let APP_DATA = {
  charms: [],
  readymade: [],
  config: {},
  coupons: []
};

// --- DATA LOADER ---
async function loadAppData() {
  try {
    const response = await fetch(API_URL + "?action=getAllData");
    const json = await response.json();
    
    APP_DATA.charms = json.charms;
    APP_DATA.readymade = json.readymade;
    APP_DATA.config = json.config;
    APP_DATA.coupons = json.coupons;
    
    console.log("✅ Google Sheet Data Loaded", APP_DATA);
    
    // Broadcast event so other pages know data is ready
    window.dispatchEvent(new Event('dataLoaded'));
    
  } catch (error) {
    console.error("❌ Failed to load data:", error);
  }
}

// Auto-load
document.addEventListener('DOMContentLoaded', loadAppData);
