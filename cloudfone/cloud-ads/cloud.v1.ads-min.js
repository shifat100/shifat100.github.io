/**
 * CloudAds SDK - Popunder Only Edition (Fullscreen + Responsive)
 */
(function (window, document) {
    'use strict';

    // Command queue
    window.cloudAdsQueue = window.cloudAdsQueue || [];

    // আগের কাস্টম ব্যানার এবং Adsterra বিজ্ঞাপনগুলো সরিয়ে ফেলা হয়েছে।
    // বিজ্ঞপ্তির ইমেজগুলো র‍্যান্ডমাইজ করার ফাংশন
    const getRandomFullscreenImage = () => 'https://shifat100.github.io/cloudfone/cloud-ads/images/fullscreen/' + (Math.floor(Math.random() * 15) + 1) + '.png';
    const getRandomBannerImage = () => 'https://shifat100.github.io/cloudfone/cloud-ads/images/banner/' + (Math.floor(Math.random() * 9) + 1) + '.png';

    const injectCSS = () => {
        if (document.getElementById('cloudads-sdk-styles')) return;
        const style = document.createElement('style');
        style.id = 'cloudads-sdk-styles';
        style.innerHTML = `
            .cloudads-fs-wrapper { position: fixed; inset: 0; width: 100%; height: 100%; min-height: 100vh; background-color: #000000; display: flex; flex-direction: column; justify-content: space-between; font-family: 'Roboto', Arial, sans-serif; color: #FFFFFF; z-index: 999999; overflow: hidden; }
            .cloudads-header { width: 100%; flex: 0 0 auto; background-color: #0093E0; display: none; align-items: center; justify-content: center; font-weight: bold; height: 20px; font-size: 10px; }
            .cloudads-body { width: 100%; flex: 1 1 auto; display: flex; align-items: center; justify-content: center; background-color: #202020; border: none; padding: 0; min-height: 0; overflow: hidden; outline: none; }
            .cloudads-img { width: 100%; height: 100%; object-fit: fill; pointer-events: none; }
            .cloudads-footer { width: 100%; flex: 0 0 auto; background-color: #202020; display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #4a4a4a; height: 20px; padding: 0 4px; font-size: 10px; position: relative; }
            .cloudads-lsk, .cloudads-rsk { color: #FFFFFF; cursor: pointer; font-weight: bold; }
            .cloudads-lsk { color: #00A539; }
            .cloudads-rsk { position: absolute; left: 50%; transform: translateX(-50%); }
            @media (min-width: 240px) { .cloudads-header { height: 35px; font-size: 14px; } .cloudads-footer { height: 35px; font-size: 14px; } }
            @media (max-width: 320px) { .cloudads-header { height: 25px; font-size: 11px; } .cloudads-footer { height: 25px; font-size: 11px; } }
            @media (max-width: 480px) { .cloudads-fs-wrapper { font-size: 12px; } }
        `;
        document.head.appendChild(style);
    };

    function displayAd(config, selectedAd, triggerEvent, displayOptions = {}) {
        const isFullscreen = !config.container;

        if (isFullscreen) {
            injectCSS();
            const previousBodyOverflow = document.body.style.overflow;
            document.body.style.overflow = 'hidden';
            
            const isAndroid = /android/i.test(navigator.userAgent || navigator.vendor || window.opera);

            const adWrapper = document.createElement('div');
            adWrapper.innerHTML = `
                <div class="cloudads-fs-wrapper">
                    ${isAndroid ? '<div id="cloudads-btn-cross" style="position:absolute; top:10px; right:10px; width:30px; height:30px; border-radius:50%; background:rgba(0,0,0,0.6); color:white; border:2px solid white; display:flex; align-items:center; justify-content:center; font-size:24px; font-family:sans-serif; font-weight:bold; cursor:pointer; z-index:999999;">&times;</div>' : ''}
                    <div class="cloudads-header">Advertisement</div>
                    <div id="cloudads-ad-body" class="cloudads-body"></div>
                    <div class="cloudads-footer">
                        <div id="cloudads-btn-close" class="cloudads-lsk">Close</div>
                        <div id="cloudads-btn-open" class="cloudads-rsk">Open</div>
                    </div>
                </div>`;
            document.body.appendChild(adWrapper);

            // ফুলস্ক্রিন কন্টেইনারে আইফ্রেমের মাধ্যমে পপ-আন্ডার স্ক্রিপ্ট ও ব্যাকগ্রাউন্ড ইমেজ লোড করা হচ্ছে
            const adBody = document.getElementById('cloudads-ad-body');
            const iframe = document.createElement('iframe');
            iframe.style.cssText = 'width:100%; height:100%; border:none; scrolling:no; overflow:hidden; background:#000;';
            adBody.appendChild(iframe);

            const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
            iframeDoc.open();
            iframeDoc.write(`
                <!DOCTYPE html>
                <html>
                <head>
                  <style>
                    body { margin: 0; padding: 0; width: 100%; height: 100vh; overflow: hidden; background: #000; display: flex; align-items: center; justify-content: center; }
                    img { width: 100%; height: 100%; object-fit: contain; cursor: pointer; }
                  </style>
                </head>
                <body>
                  <script src="${selectedAd.scriptUrl}"><\/script>
                  <img src="${selectedAd.imageUrl}" alt="Ad" />
                </body>
                </html>
            `);
            iframeDoc.close();

            const handleOpen = () => { triggerEvent('click'); window.open(selectedAd.clickUrl, '_blank'); };
            
            const handleClose = () => {
                document.body.removeChild(adWrapper);
                document.body.style.overflow = previousBodyOverflow;
                document.removeEventListener('keydown', handleAdKeyDown, true);
                document.removeEventListener('keyup', blockKeyUp, true);
                triggerEvent('close');
            };

            const handleAdKeyDown = (event) => {
                event.preventDefault(); event.stopPropagation(); event.stopImmediatePropagation();
                const key = event.key || event.keyIdentifier;
                if (['Escape', 'Esc', 'Backspace', 'SoftLeft', 'BrowserBack'].includes(key)) { handleClose(); } 
                else if (['Enter', 'SoftRight'].includes(key)) { handleOpen(); }
            };

            const blockKeyUp = (event) => { event.preventDefault(); event.stopPropagation(); event.stopImmediatePropagation(); };

            document.addEventListener('keydown', handleAdKeyDown, true);
            document.addEventListener('keyup', blockKeyUp, true);

            document.getElementById('cloudads-btn-open').onclick = handleOpen;
            document.getElementById('cloudads-btn-close').onclick = handleClose;
            
            if (isAndroid) {
                document.getElementById('cloudads-btn-cross').onclick = handleClose;
            }
            
            triggerEvent('display');
            
        } else {
            // ব্যানার বিজ্ঞপ্তির লজিক
            const container = config.container;
            container.innerHTML = '';
            
            if (displayOptions.navClass) container.classList.add(displayOptions.navClass);
            if (displayOptions.tabindex !== undefined) container.setAttribute('tabindex', displayOptions.tabindex);
            if (displayOptions.display) container.style.display = displayOptions.display;

            // কীবোর্ড কন্ট্রোল (KaiOS d-pad)
            container.addEventListener('keydown', (event) => {
                const key = event.key || event.keyIdentifier;
                if (key === 'Enter' || key === 'SoftRight') {
                    triggerEvent('click');
                    if (selectedAd.clickUrl) window.open(selectedAd.clickUrl, '_self');
                }
            });

            // ব্যানার কন্টেইনারের সাইজে আইফ্রেম তৈরি করে পপ-আন্ডার লোড করা হচ্ছে
            const iframe = document.createElement('iframe');
            let h = config.h ? config.h + 'px' : (window.innerHeight / 8) + 'px';
            let w = config.w ? config.w + 'px' : '100%';
            
            iframe.style.cssText = `width:${w}; height:${h}; max-height:264px; border:none; scrolling:no; overflow:hidden;`;
            container.appendChild(iframe);

            const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
            iframeDoc.open();
            iframeDoc.write(`
                <!DOCTYPE html>
                <html>
                <head>
                  <style>
                    body { margin: 0; padding: 0; width: 100%; height: 100%; overflow: hidden; }
                    img { width: 100%; height: 100%; object-fit: fill; cursor: pointer; }
                  </style>
                </head>
                <body>
                  <script src="${selectedAd.scriptUrl}"><\/script>
                  <img src="${selectedAd.imageUrl}" alt="Ad" />
                </body>
                </html>
            `);
            iframeDoc.close();

            triggerEvent('display');
        }
    }

    const processAdRequest = function (config) {
        if (!config) return;
        
        if (!config.publisher) {
            if (config.onerror) config.onerror({code: 17, error: 'Cannot fetch settings', notes: 'Please provide publisher parameter.'});
            return;
        }
        
        setTimeout(() => {
            // শুধুমাত্র পপ-আন্ডার কনফিগারেশনটি রিকোয়েস্ট অনুযায়ী ইমেজ সেট করে লোড করবে
            const selectedAd = {
                type: 'popunder',
                scriptUrl: 'https://matcheshonoraryunderwater.com/f8/49/29/f8492924da30520cabdbb409c9928dec.js',
                imageUrl: !config.container ? getRandomFullscreenImage() : getRandomBannerImage(),
                clickUrl: 'https://matcheshonoraryunderwater.com/h3ghsxyvp?key=331819c57a0e4e6203da3f03fe993d20'
            };

            const events = {};
            const triggerEvent = (name) => { if (events[name]) events[name](); };
            
            const adInstance = {
                on: (name, cb) => { events[name] = cb; },
                call: (cmd, options = {}) => { 
                    if (cmd === 'display') {
                        displayAd(config, selectedAd, triggerEvent, options); 
                    } else if (cmd === 'click') {
                        triggerEvent('click'); 
                        window.open(selectedAd.clickUrl, '_self');
                    }
                }
            };

            if (config.onready) config.onready(adInstance);

        }, 300);
    };

    window.getCloudAd = window.getKaiAd = function (config) {
        processAdRequest(config);
    };

    while (window.cloudAdsQueue.length > 0) {
        const queuedConfig = window.cloudAdsQueue.shift();
        processAdRequest(queuedConfig);
    }

})(window, document);
