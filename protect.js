/* ==========================================================================
   GOCLINIC WEBSITE PROTECTION
   Minimalist — clean toast, top right, single-line contact
   ========================================================================== */

(function () {
  'use strict';

  const CONTACT = 'calamba.goclinic@gmail.com';
  const SUBJECT = 'GoClinic Website Access Concern';
  let _timer = null;

  _injectStyles();

  document.addEventListener('contextmenu', function (e) {
    e.preventDefault();
    _show('Right-click is disabled on this site.');
    return false;
  }, { passive: false });

  document.addEventListener('dragstart', function (e) {
    if (e.target && e.target.tagName === 'IMG') {
      e.preventDefault();
      _show('Image saving is disabled.');
      return false;
    }
  }, { passive: false });

  document.addEventListener('keydown', function (e) {
    const k = (e.key || '').toLowerCase();
    let msg = '';

    if (e.key === 'F12')                                  msg = 'Developer tools are disabled.';
    else if (e.ctrlKey && e.shiftKey && k === 'i')        msg = 'Developer tools are disabled.';
    else if (e.ctrlKey && e.shiftKey && k === 'j')        msg = 'Console access is disabled.';
    else if (e.ctrlKey && e.shiftKey && k === 'c')        msg = 'Inspect element is disabled.';
    else if (e.ctrlKey && k === 'u')                      msg = 'View source is disabled.';
    else if (e.metaKey && e.altKey && 'ijc'.includes(k))  msg = 'Developer tools are disabled.';
    else if (e.metaKey && k === 'u')                      msg = 'View source is disabled.';

    if (msg) {
      e.preventDefault();
      e.stopPropagation();
      _show(msg);
      return false;
    }
  }, { passive: false });

  function _show(message) {
    let toast = document.getElementById('gc-toast');
    if (!toast) toast = _build();

    toast.querySelector('.gc-toast-msg').textContent = message;
    toast.classList.remove('gc-out');
    toast.classList.add('gc-in');
    toast.style.pointerEvents = 'auto';

    clearTimeout(_timer);
    _timer = setTimeout(_hide, 5000);
  }

  function _hide() {
    const toast = document.getElementById('gc-toast');
    if (!toast) return;
    toast.classList.remove('gc-in');
    toast.classList.add('gc-out');
    toast.style.pointerEvents = 'none';
  }

  function _build() {
    const toast = document.createElement('div');
    toast.id = 'gc-toast';
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');

    toast.innerHTML = `
      <div class="gc-toast-bar"></div>
      <div class="gc-toast-body">
        <div class="gc-toast-icon">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
        </div>
        <div class="gc-toast-content">
          <div class="gc-toast-top">
            <div class="gc-toast-label">Protected</div>
            <button class="gc-toast-close" type="button" aria-label="Dismiss">&times;</button>
          </div>
          <div class="gc-toast-msg">Access is restricted.</div>
          <a class="gc-toast-link" href="mailto:${CONTACT}?subject=${encodeURIComponent(SUBJECT)}" tabindex="0">Contact us: ${CONTACT}</a>
        </div>
      </div>
    `;

    document.body.appendChild(toast);
    toast.querySelector('.gc-toast-close').addEventListener('click', _hide);
    return toast;
  }

  function _injectStyles() {
    if (document.getElementById('gc-toast-css')) return;

    const s = document.createElement('style');
    s.id = 'gc-toast-css';
    s.textContent = `
      #gc-toast {
        position: fixed;
        top: 20px;
        right: 24px;
        width: 320px;
        max-width: calc(100vw - 32px);
        background: #ffffff;
        border-radius: 12px;
        box-shadow:
          0 0 0 1px rgba(0,0,0,.06),
          0 4px 6px -1px rgba(0,0,0,.05),
          0 16px 32px -4px rgba(0,86,179,.11);
        overflow: hidden;
        opacity: 0;
        transform: translateY(-10px) scale(.97);
        pointer-events: none;
        z-index: 2147483647;
        font-family: 'Open Sans', Arial, sans-serif;
      }

      #gc-toast.gc-in {
        animation: gc-slide-in .28s cubic-bezier(.16,1,.3,1) forwards;
      }

      #gc-toast.gc-out {
        animation: gc-slide-out .2s cubic-bezier(.4,0,1,1) forwards;
      }

      @keyframes gc-slide-in {
        from { opacity:0; transform:translateY(-10px) scale(.97); }
        to   { opacity:1; transform:translateY(0) scale(1); }
      }

      @keyframes gc-slide-out {
        from { opacity:1; transform:translateY(0) scale(1); }
        to   { opacity:0; transform:translateY(-8px) scale(.97); }
      }

      .gc-toast-bar {
        height: 3px;
        background: linear-gradient(90deg, #0056b3, #007bff 55%, #18a0aa);
      }

      #gc-toast.gc-in .gc-toast-bar {
        animation: gc-progress 5s linear forwards;
      }

      @keyframes gc-progress {
        from { transform: scaleX(1); transform-origin: left; }
        to   { transform: scaleX(0); transform-origin: left; opacity: .5; }
      }

      .gc-toast-body {
        display: flex;
        align-items: flex-start;
        gap: 10px;
        padding: 14px 14px 15px 14px;
      }

      .gc-toast-icon {
        width: 32px;
        height: 32px;
        border-radius: 8px;
        background: #eef4ff;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #0056b3;
        flex-shrink: 0;
        margin-top: 1px;
      }

      .gc-toast-content {
        flex: 1;
        min-width: 0;
      }

      .gc-toast-top {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 3px;
      }

      .gc-toast-label {
        font-size: 10px;
        font-weight: 700;
        letter-spacing: 1px;
        text-transform: uppercase;
        color: #0056b3;
      }

      .gc-toast-close {
        width: 22px;
        height: 22px;
        border: none;
        background: transparent;
        cursor: pointer;
        color: #9ca3af;
        font-size: 17px;
        line-height: 1;
        border-radius: 5px;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0;
        flex-shrink: 0;
        transition: background .15s, color .15s;
      }

      .gc-toast-close:hover {
        background: #f3f4f6;
        color: #374151;
      }

      .gc-toast-msg {
        font-size: 13px;
        font-weight: 600;
        color: #111827;
        line-height: 1.4;
        margin-bottom: 7px;
      }

      .gc-toast-link {
        display: block;
        font-size: 11px;
        font-weight: 600;
        color: #0056b3;
        text-decoration: none;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        border-bottom: 1px solid rgba(0,86,179,.2);
        padding-bottom: 1px;
        width: fit-content;
        max-width: 100%;
        transition: color .15s, border-color .15s;
      }

      .gc-toast-link:hover {
        color: #003f87;
        border-color: #003f87;
      }

      @media (max-width: 600px) {
        #gc-toast {
          top: 14px;
          right: 10px;
          left: 10px;
          width: auto;
        }
      }
    `;

    document.head.appendChild(s);
  }

  setTimeout(function () {
    try {
      console.clear();
      console.log('%cSTOP', 'font-size:40px;font-weight:900;color:#0056b3;');
      console.log('%cThis is a browser feature for developers.', 'font-size:14px;color:#374151;');
      console.log('%cIf someone told you to paste code here — it is a scam. Close this immediately.', 'font-size:13px;color:#b42318;font-weight:700;');
      console.log('\n%cQuestions? ' + CONTACT, 'font-size:12px;color:#0056b3;');
    } catch (_) {}
  }, 900);

})();