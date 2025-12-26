document.addEventListener("DOMContentLoaded", function() {
    
    // 1. Check if we are on a Desktop
    const isDesktop = window.matchMedia("(min-width: 1025px)").matches;

    if (isDesktop) {
        optimizeForDesktop();
        hijackWhatsAppForDesktop();
    }

    // --- LOGIC: MOVE CHECKOUT BUTTON (CART PAGE) ---
    function optimizeForDesktop() {
        // On Cart page, move the fixed bottom button into the summary box
        const checkoutBtn = document.getElementById('checkoutBtn');
        const summaryBox = document.querySelector('.bill-summary');
        
        if (checkoutBtn && summaryBox) {
            // Append button inside the summary box
            summaryBox.appendChild(checkoutBtn);
        }
    }

    // --- LOGIC: INTERCEPT WHATSAPP CLICK ---
    function hijackWhatsAppForDesktop() {
        const originalOpen = window.open;

        window.open = function(url, target) {
            // Check if the URL is trying to go to WhatsApp
            if (url && (url.includes('wa.me') || url.includes('whatsapp.com'))) {
                // STOP! Show QR Code instead.
                showQRCode(url);
                return null; // Prevent the tab from opening
            } else {
                return originalOpen(url, target);
            }
        };
    }

    // --- LOGIC: GENERATE & SHOW QR MODAL ---
    function showQRCode(waUrl) {
        // 1. Create the overlay structure
        const overlay = document.createElement('div');
        overlay.className = 'qr-modal-overlay';
        overlay.style.display = 'flex';
        
        // 2. Generate QR Code URL
        const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&bgcolor=ffffff&data=${encodeURIComponent(waUrl)}`;

        // 3. Populate HTML with Close Button (X)
        overlay.innerHTML = `
            <div class="qr-card">
                <button class="qr-close-icon">&times;</button>
                <h3 class="qr-title">Scan to Pay 📱</h3>
                <p class="qr-desc">
                    Since you are on a desktop, open your phone camera and scan this code to send the order via WhatsApp.
                </p>
                <img src="${qrApiUrl}" class="qr-image" alt="Order QR Code">
                <div style="font-size:13px; color:#888; margin-top:8px;">Waiting for scan...</div>
            </div>
        `;

        // 4. Append to body
        document.body.appendChild(overlay);

        // 5. Handle Closing (X Button)
        const closeBtn = overlay.querySelector('.qr-close-icon');
        closeBtn.onclick = function() {
            overlay.remove();
        };

        // Close on background click
        overlay.onclick = function(e) {
            if (e.target === overlay) overlay.remove();
        }
    }
});
