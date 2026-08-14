/* ============================================================
   מעקב ואנליטיקס לאתר של יוליה קרמר
   ------------------------------------------------------------
   כדי להפעיל: הדביקי כאן את שני המזהים שקיבלת מ-Google ו-Meta.
   עד שהשדות ריקים, הקוד "רדום" לגמרי: אין באנר, אין עוגיות, אין מעקב.
   ברגע שתמלאי אפילו אחד מהם, נדלקים באנר ההסכמה והמעקב.
   ============================================================ */

(function () {
  // >>> מלאי כאן <<<
  var GA_ID    = "G-ERZND6D87X";  // Google Analytics 4, מתחיל ב-G-   (למשל "G-XXXXXXXXXX")
  var PIXEL_ID = "1369382475160521";  // Meta Pixel, מספר בלבד            (למשל "123456789012345")
  var ADS_ID   = "";  // אופציונלי: Google Ads, מתחיל ב-AW- (למשל "AW-XXXXXXXXX")

  if (!GA_ID && !PIXEL_ID && !ADS_ID) return; // רדום עד שממלאים מזהה

  var KEY = "cookie_consent";
  function stored() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function save(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }

  // Google Consent Mode v2 — ברירת מחדל: אין הסכמה
  window.dataLayer = window.dataLayer || [];
  function gtag() { dataLayer.push(arguments); }
  window.gtag = gtag;
  gtag('consent', 'default', {
    ad_storage: 'denied', analytics_storage: 'denied',
    ad_user_data: 'denied', ad_personalization: 'denied'
  });

  function loadGA() {
    if (!GA_ID && !ADS_ID) return;
    var id = GA_ID || ADS_ID;
    var s = document.createElement('script');
    s.async = true; s.src = 'https://www.googletagmanager.com/gtag/js?id=' + id;
    document.head.appendChild(s);
    gtag('js', new Date());
    if (GA_ID) gtag('config', GA_ID);
    if (ADS_ID) gtag('config', ADS_ID);
  }

  function loadPixel() {
    if (!PIXEL_ID) return;
    !function (f, b, e, v, n, t, s) {
      if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments) };
      if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = [];
      t = b.createElement(e); t.async = !0; t.src = v;
      s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s)
    }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', PIXEL_ID); fbq('track', 'PageView');
  }

  function attachLeadEvents() {
    var forms = document.querySelectorAll('form[name="guide"], form[name="contact"], form.cs-form, form.soon-form, form.nlf');
    forms.forEach(function (f) {
      f.addEventListener('submit', function () {
        try {
          if (window.gtag) gtag('event', 'generate_lead');
          if (window.fbq) fbq('track', 'Lead');
        } catch (e) {}
      });
    });
  }

  function grant() {
    gtag('consent', 'update', {
      ad_storage: 'granted', analytics_storage: 'granted',
      ad_user_data: 'granted', ad_personalization: 'granted'
    });
    loadGA(); loadPixel(); attachLeadEvents();
  }

  function showBanner() {
    var b = document.createElement('div');
    b.id = 'cookie-banner';
    b.setAttribute('role', 'dialog');
    b.setAttribute('aria-label', 'הסכמה לעוגיות');
    b.innerHTML =
      '<span>אנחנו משתמשים בעוגיות כדי לשפר את האתר ולמדוד ביצועים. אפשר לאשר, או להמשיך בלי.</span>' +
      '<span class="cb-btns"><button id="cb-yes" type="button">אישור</button>' +
      '<button id="cb-no" type="button">בלי עוגיות</button></span>';
    document.body.appendChild(b);
    document.getElementById('cb-yes').onclick = function () { save('granted'); grant(); b.remove(); };
    document.getElementById('cb-no').onclick = function () { save('denied'); b.remove(); };
  }

  var css = '#cookie-banner{position:fixed;bottom:16px;right:16px;left:16px;max-width:600px;margin:0 auto;' +
    'background:#6E2639;color:#fff;border-radius:14px;padding:14px 18px;display:flex;flex-wrap:wrap;gap:12px;' +
    'align-items:center;justify-content:space-between;font-family:Rubik,-apple-system,sans-serif;font-size:13px;' +
    'line-height:1.5;z-index:9999;box-shadow:0 8px 30px rgba(0,0,0,.3);direction:rtl}' +
    '#cookie-banner .cb-btns{display:flex;gap:8px;flex-shrink:0}' +
    '#cookie-banner button{border:none;border-radius:8px;padding:8px 16px;font-size:13px;font-weight:700;cursor:pointer;font-family:inherit}' +
    '#cb-yes{background:#E8D5C0;color:#55182B}#cb-no{background:transparent;color:rgba(255,255,255,.85);border:1px solid rgba(255,255,255,.4)}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  var c = stored();
  if (c === 'granted') { grant(); }
  else if (c === 'denied') { /* המשתמש בחר בלי עוגיות */ }
  else {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', showBanner);
    else showBanner();
  }
})();
