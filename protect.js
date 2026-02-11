// ========== DEVTOOLS PROTECTION - PRODUCTION READY ==========
(function() {
    'use strict';
    
    let attemptCount = 0;
    let userTriedDevTools = false;
    
    // Disable right-click with modern notification
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        showWarning('right_click');
    }, false);
    
    // Disable developer shortcuts ONLY
    document.addEventListener('keydown', function(e) {
        let blocked = false;
        
        // F12
        if (e.keyCode === 123) {
            blocked = true;
            userTriedDevTools = true;
            showWarning('f12');
        }
        // Ctrl+Shift+I (Inspector)
        else if (e.ctrlKey && e.shiftKey && e.keyCode === 73) {
            blocked = true;
            userTriedDevTools = true;
            showWarning('inspector');
        }
        // Ctrl+Shift+J (Console)
        else if (e.ctrlKey && e.shiftKey && e.keyCode === 74) {
            blocked = true;
            userTriedDevTools = true;
            showWarning('console');
        }
        // Ctrl+U (View Source)
        else if (e.ctrlKey && e.keyCode === 85) {
            blocked = true;
            userTriedDevTools = true;
            showWarning('view_source');
        }
        // Ctrl+Shift+C (Inspect Element)
        else if (e.ctrlKey && e.shiftKey && e.keyCode === 67) {
            blocked = true;
            userTriedDevTools = true;
            showWarning('inspect');
        }
        
        if (blocked) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
    }, false);
    
    // Modern notification warning
    function showWarning(type) {
        attemptCount++;
        
        // Remove existing notification if any
        const existing = document.getElementById('security-toast');
        if (existing) existing.remove();
        
        const toast = document.createElement('div');
        toast.id = 'security-toast';
        toast.innerHTML = `
            <style>
                @keyframes slideInRight {
                    from {
                        transform: translateX(400px);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                @keyframes slideOutRight {
                    from {
                        transform: translateX(0);
                        opacity: 1;
                    }
                    to {
                        transform: translateX(400px);
                        opacity: 0;
                    }
                }
            </style>
            <div style="
                position: fixed;
                top: 20px;
                right: 20px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 25px 30px;
                border-radius: 15px;
                box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
                z-index: 999999;
                font-family: 'Segoe UI', Arial, sans-serif;
                min-width: 350px;
                max-width: 90vw;
                animation: slideInRight 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
            ">
                <div style="display: flex; align-items: flex-start; gap: 15px;">
                    <div style="font-size: 2rem; flex-shrink: 0;">🔒</div>
                    <div style="flex: 1;">
                        <h3 style="margin: 0 0 10px 0; font-size: 1.2rem; font-weight: 600;">
                            Security Alert
                        </h3>
                        <p style="margin: 0 0 8px 0; font-size: 0.95rem; opacity: 0.95; line-height: 1.5;">
                            Developer tools are disabled for security purposes.
                        </p>
                        <p style="margin: 0; font-size: 0.85rem; opacity: 0.8;">
                            Attempt #${attemptCount} • ${new Date().toLocaleTimeString()}
                        </p>
                    </div>
                    <button onclick="this.closest('#security-toast').style.animation='slideOutRight 0.3s'; setTimeout(() => { const el = document.getElementById('security-toast'); if(el) el.remove(); }, 300);" style="
                        background: rgba(255, 255, 255, 0.2);
                        border: none;
                        color: white;
                        width: 28px;
                        height: 28px;
                        border-radius: 50%;
                        cursor: pointer;
                        font-size: 1.2rem;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        flex-shrink: 0;
                        transition: all 0.2s;
                    " onmouseover="this.style.background='rgba(255, 255, 255, 0.3)'" onmouseout="this.style.background='rgba(255, 255, 255, 0.2)'">
                        ✕
                    </button>
                </div>
                <div style="
                    margin-top: 15px;
                    padding-top: 15px;
                    border-top: 1px solid rgba(255, 255, 255, 0.2);
                    font-size: 0.85rem;
                ">
                    <p style="margin: 0;">
                        📧 Contact: <a href="mailto:calamba.goclinic@gmail.com" style="color: #FFD700; text-decoration: none; font-weight: 600;">calamba.goclinic@gmail.com</a>
                    </p>
                </div>
            </div>
        `;
        
        document.body.appendChild(toast);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            const toastEl = document.getElementById('security-toast');
            if (toastEl) {
                toastEl.firstElementChild.style.animation = 'slideOutRight 0.3s';
                setTimeout(() => {
                    if (document.getElementById('security-toast')) {
                        toastEl.remove();
                    }
                }, 300);
            }
        }, 5000);
    }
    
    // Log attempts (optional - for monitoring)
    if (attemptCount > 5) {
        console.warn('Multiple DevTools access attempts detected.');
    }
    
})();
