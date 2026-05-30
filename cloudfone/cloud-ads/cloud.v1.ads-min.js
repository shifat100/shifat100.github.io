/**
 * CloudAds SDK - Modified to support Popunder Integration
 */
(function (window, document) {
    'use strict';

    // Command queue
    window.cloudAdsQueue = window.cloudAdsQueue || [];

    // ১. ব্যানার বিজ্ঞপ্তির তালিকায় Popunder স্ক্রিপ্টটি যুক্ত করা হয়েছে
    const bannerAds =[
        { 
            type: 'popunder', 
            scriptUrl: 'https://matcheshonoraryunderwater.com/f8/49/29/f8492924da30520cabdbb409c9928dec.js' 
        },
        { 
            type: 'custom', 
            imageUrl: 'https://shifat100.github.io/cloudfone/cloud-adsimages/banner/' + (Math.floor(Math.random() * 9) + 1) + '.png', 
            clickUrl: 'https://matcheshonoraryunderwater.com/h3ghsxyvp?key=331819c57a0e4e6203da3f03fe993d20' 
        },
        { 
            type: 'adsterra', 
            adsterraKey: '3768c5dda0b47669346bd50d7189ab3b', 
            adsterraSrc: 'https://matcheshonoraryunderwater.com/3768c5dda0b47669346bd50d7189ab3b/invoke.js', 
            width: 468, 
            height: 60 
        }
    ];

    const fullscreenAds =[
        { clickUrl: 'https://matcheshonoraryunderwater.com/h3ghsxyvp?key=331819c57a0e4e6203da3f03fe993d20' }
    ];

    const getRandomFullscreenImage = () => 'https://shifat100.github.io/cloudfone/cloud-ads/images/fullscreen/' + (Math.floor(Math.random() * 15) + 1) + '.png';
    const getRandomBannerImage = () => 'https://shifat100.github.io/cloudfone/cloud-ads/images/banner/' + (Math.floor(Math.random() * 9) + 1) + '.png';

    const injectCSS = () => {
        if (document.getElementById('cloudads-sdk-styles')) return;
        const style = document.createElement('style');
        style.id = 'cloudads-sdk-styles';
        style.innerHTML = `
            .cloudads-fs-wrapper { position: fixed; inset: 0; width: 100%; height: 100%; min-height: 100vh; background-color: #000000; display: flex; flex-direction: column; justify-content: space-between; font-family: 'Roboto', Arial, sans-serif; color: #FFFFFF; z-index: 999999; overflow: hidden; }
            .cloudads-header { width: 100%; flex: 0 0 auto; background-color: #0093E0; display: none; align-items: center; justify-content: center; font-weight: bold; height: 20px; font-size: 10px; }
            .cloudads-body { width: 100%; flex: 1 1 auto; display: flex; align-items: center; justify-content: center; background-color: #202020; border: none; cursor: pointer; padding: 0; min-height: 0; overflow: hidden; outline: none; }
            .cloudads-body:focus { background-color: #05AEF2; }
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
                    <button id="cloudads-ad-body" class="cloudads-body">
                        <img src="${selectedAd.imageUrl}" class="cloudads-img" alt="Ad">
                    </button>
                    <div class="cloudads-footer">
                        <div id="cloudads-btn-close" class="cloudads-lsk">Close</div>
                        <div id="cloudads-btn-open" class="cloudads-rsk">Open</div>
                    </div>
                </div>`;
            document.body.appendChild(adWrapper);

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

            document.getElementById('cloudads-ad-body').onclick = handleOpen;
            document.getElementById('cloudads-btn-open').onclick = handleOpen;
            document.getElementById('cloudads-btn-close').onclick = handleClose;
            
            if (isAndroid) {
                document.getElementById('cloudads-btn-cross').onclick = handleClose;
            }
            
            setTimeout(() => document.getElementById('cloudads-ad-body').focus(), 50);
            triggerEvent('display');
            
        } else {
            // Responsive / Banner Ad Logic
            const container = config.container;
            container.innerHTML = '';
            
            if (displayOptions.navClass) container.classList.add(displayOptions.navClass);
            if (displayOptions.tabindex !== undefined) container.setAttribute('tabindex', displayOptions.tabindex);
            if (displayOptions.display) container.style.display = displayOptions.display;

            container.addEventListener('keydown', (event) => {
                const key = event.key || event.keyIdentifier;
                if (key === 'Enter' || key === 'SoftRight') {
                    triggerEvent('click');
                    if (selectedAd.clickUrl) window.open(selectedAd.clickUrl, '_self');
                }
            });

            // ২. Popunder অপশন সিলেক্ট হলে এই নতুন লজিকটি রান করবে
            if (selectedAd.type === 'popunder') {
                
                // ব্যানার কন্টেইনারের সাইজে একটি iframe তৈরি করা হচ্ছে
                const iframe = document.createElement('iframe');
                let h = config.h ? config.h + 'px' : (window.innerHeight / 8) + 'px';
                let w = config.w ? config.w + 'px' : '100%';
                
                iframe.style.cssText = `width:${w}; height:${h}; max-height:264px; border:none; scrolling:no; overflow:hidden;`;
                container.appendChild(iframe);

                const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                iframeDoc.open();
                
                // আইফ্রেমের ভেতরে পপ-আন্ডার স্ক্রিপ্টটি ইনজেক্ট করা হচ্ছে
                // একই সাথে ব্যানারের ব্যাকগ্রাউন্ডে একটি র‍্যান্ডম ব্যানার ছবি দেখানো হচ্ছে
                iframeDoc.write(`
                    <!DOCTYPE html>
                    <html>
                    <head>
                      <style>
                        body { margin: 0; padding: 0; width: 100%; height: 100vh; overflow: hidden; }
                        img { width: 100%; height: 100%; object-fit: fill; cursor: pointer; }
                      </style>
                    </head>
                    <body>
                      <!-- পপ-আন্ডার রিডাইরেক্ট স্ক্রিপ্ট -->
                      <script src="${selectedAd.scriptUrl}"><\/script>
                      
                      <!-- ব্যবহারকারীকে দেখানোর জন্য ব্যানার ইমেজ -->
                      <img src="${getRandomBannerImage()}" alt="Ad" />
                    </body>
                    </html>
                `);
                iframeDoc.close();

            } else if (selectedAd.type === 'adsterra') {
                const scalerWrapper = document.createElement('div');
                scalerWrapper.style.cssText = 'width:100%; height:60px; position:relative; overflow:hidden; cursor:pointer;';
                container.appendChild(scalerWrapper);

                const innerAdDiv = document.createElement('div');
                innerAdDiv.style.cssText = `width:${selectedAd.width}px; height:${selectedAd.height}px; position:absolute; left:50%; top:50%; transform:translate(-50%, -50%);`;
                scalerWrapper.appendChild(innerAdDiv);

                const applyScaling = () => {
                    const containerWidth = container.offsetWidth || window.innerWidth;
                    const scale = containerWidth < selectedAd.width ? containerWidth / selectedAd.width : 1;
                    innerAdDiv.style.transform = `translate(-50%, -50%) scale(${scale})`;
                    scalerWrapper.style.height = (selectedAd.height * scale) + 'px';
                };

                applyScaling();
                window.addEventListener('resize', applyScaling);

                window.atOptions = { 'key': selectedAd.adsterraKey, 'format': 'iframe', 'height': selectedAd.height, 'width': selectedAd.width, 'params': {} };
                const script = document.createElement('script');
                script.type = 'text/javascript';
                script.src = selectedAd.adsterraSrc;
                innerAdDiv.appendChild(script);
            } else {
                const bannerImg = document.createElement('img');
                bannerImg.src = selectedAd.imageUrl;
                let h = config.h ? config.h + 'px' : (window.innerHeight / 8) + 'px';
                let w = config.w ? config.w + 'px' : '100%';
                
                bannerImg.style.cssText = `width:${w}; height:${h}; max-height:264px; object-fit:fill; cursor:pointer;`;
                bannerImg.onclick = () => { triggerEvent('click'); window.open(selectedAd.clickUrl, '_self'); };
                container.appendChild(bannerImg);
            }
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
            const targetInventory = !config.container ? fullscreenAds : bannerAds;
            const selectedAdBase = targetInventory[Math.floor(Math.random() * targetInventory.length)];
            const selectedAd = { ...selectedAdBase };

            if (!config.container) {
                selectedAd.imageUrl = getRandomFullscreenImage();
            } else if (selectedAd.type === 'custom') {
                selectedAd.imageUrl = getRandomBannerImage();
            }

            const events = {};
            const triggerEvent = (name) => { if (events[name]) events[name](); };
            
            const adInstance = {
                on: (name, cb) => { events[name] = cb; },
                call: (cmd, options = {}) => { 
                    if (cmd === 'display') {
                        displayAd(config, selectedAd, triggerEvent, options); 
                    } else if (cmd === 'click') {
                        triggerEvent('click'); 
                        if (selectedAd.clickUrl) {
                            window.open(selectedAd.clickUrl, '_self');
                        } else {
                             window.open('https://matcheshonoraryunderwater.com/h3ghsxyvp?key=331819c57a0e4e6203da3f03fe993d20', '_self');
                        }
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
