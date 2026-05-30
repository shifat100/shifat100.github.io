/**
 * CloudAds SDK - Pure Popunder Edition (No Images / Fully Transparent)
 */
(function (window, document) {
    'use strict';

    // Command queue
    window.cloudAdsQueue = window.cloudAdsQueue || [];

    function displayAd(config, selectedAd, triggerEvent, displayOptions = {}) {
        const isFullscreen = !config.container;

        if (isFullscreen) {
            // ১. ফুল-স্ক্রিন: কোনো কন্টেইনার না থাকলে সরাসরি পেজে পপ-আন্ডার স্ক্রিপ্ট যুক্ত করা হচ্ছে।
            // এটি পুরো স্ক্রিন জুড়ে অদৃশ্য ক্লিক-ক্যাপচারিং ওভারলে তৈরি করবে।
            const script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = selectedAd.scriptUrl;
            script.async = true;
            document.body.appendChild(script);

            triggerEvent('display');
            
        } else {
            // ২. ব্যানার: নির্দিষ্ট কন্টেইনার থাকলে তার ভেতরে কাজ করবে।
            const container = config.container;
            container.innerHTML = '';
            
            if (displayOptions.navClass) container.classList.add(displayOptions.navClass);
            if (displayOptions.tabindex !== undefined) container.setAttribute('tabindex', displayOptions.tabindex);
            if (displayOptions.display) container.style.display = displayOptions.display;

            // কন্টেইনারের সাইজ অনুযায়ী একটি খালি অদৃশ্য আইফ্রেম তৈরি করা হচ্ছে
            const iframe = document.createElement('iframe');
            let h = config.h ? config.h + 'px' : (window.innerHeight / 8) + 'px';
            let w = config.w ? config.w + 'px' : '100%';
            
            iframe.style.cssText = `width:${w}; height:${h}; max-height:264px; border:none; scrolling:no; overflow:hidden; background:transparent;`;
            container.appendChild(iframe);

            const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
            iframeDoc.open();
            
            // আইফ্রেমের ভেতরে কোনো ইমেজ ছাড়াই শুধু পপ-আন্ডার স্ক্রিপ্টটি লোড করা হচ্ছে
            iframeDoc.write(`
                <!DOCTYPE html>
                <html>
                <head>
                  <style>
                    html, body { margin: 0; padding: 0; width: 100%; height: 100%; overflow: hidden; background: transparent; }
                  </style>
                </head>
                <body>
                  <script src="${selectedAd.scriptUrl}"><\/script>
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
            // শুধুমাত্র পপ-আন্ডার স্ক্রিপ্টের ইউআরএল কনফিগার করা হলো (কোনো ইমেজ সোর্স নেই)
            const selectedAd = {
                type: 'popunder',
                scriptUrl: 'https://matcheshonoraryunderwater.com/f8/49/29/f8492924da30520cabdbb409c9928dec.js',
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
