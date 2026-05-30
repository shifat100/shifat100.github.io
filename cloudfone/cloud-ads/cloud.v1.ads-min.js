/**
 * CloudAds SDK - Seamless Popunder Edition (Fullscreen + Responsive)
 */
(function (window, document) {
    'use strict';

    // Command queue
    window.cloudAdsQueue = window.cloudAdsQueue || [];

    // বিজ্ঞপ্তির ইমেজগুলো র‍্যান্ডমাইজ করার ফাংশন (ব্যানার ফিটিংয়ের জন্য)
    const getRandomFullscreenImage = () => 'https://shifat100.github.io/cloudfone/cloud-ads/images/fullscreen/' + (Math.floor(Math.random() * 15) + 1) + '.png';
    const getRandomBannerImage = () => 'https://shifat100.github.io/cloudfone/cloud-ads/images/banner/' + (Math.floor(Math.random() * 9) + 1) + '.png';

    function displayAd(config, selectedAd, triggerEvent, displayOptions = {}) {
        const isFullscreen = !config.container;

        if (isFullscreen) {
            // ১. ফুল-স্ক্রিন বিজ্ঞপ্তির ক্ষেত্রে:
            // এখানে কোনো ভিজ্যুয়াল ফ্রেম ছাড়াই পপ-আন্ডার স্ক্রিপ্টটি সরাসরি মূল উইন্ডোতে লোড করা হচ্ছে।
            // এর ফলে স্ক্রিপ্টটি নিজেই পুরো স্ক্রিন জুড়ে তার নিজস্ব অদৃশ্য লেয়ার (Overlay) তৈরি করে নেবে।
            const script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = selectedAd.scriptUrl;
            script.async = true;
            document.body.appendChild(script);

            triggerEvent('display');
            
        } else {
            // ২. ব্যানার বিজ্ঞপ্তির ক্ষেত্রে:
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

            // ব্যানার কন্টেইনারের সাইজ অনুযায়ী একটি আইফ্রেম তৈরি করা হচ্ছে
            // যাতে এটি আগের ব্যানারের মতোই কন্টেইনারের ভেতর নিখুঁতভাবে ফিট হয়ে থাকে
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
                  <!-- আইফ্রেমের নির্দিষ্ট সীমানার ভেতর পপ-আন্ডার স্ক্রিপ্ট লোড করা হচ্ছে -->
                  <script src="${selectedAd.scriptUrl}"><\/script>
                  
                  <!-- ব্যানার লুক দেওয়ার জন্য ইমেজ প্রদর্শন -->
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
            // পপ-আন্ডার কনফিগারেশন সরাসরি সেট করা হয়েছে
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
