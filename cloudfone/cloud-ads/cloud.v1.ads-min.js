/**
 * CloudAds SDK - KaiAds Style Direct Calling & Fullscreen Key Blocker
 */
(function (window, document) {
    'use strict';

    // Command queue to prevent "ReferenceError"
    window.cloudAdsQueue = window.cloudAdsQueue ||[];

    const bannerAds =[
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

    const getRandomFullscreenImage = () => 'https://shifat100.github.io/cloudfone/cloud-ads/images/fullscreen/' + (Math.floor(Math.random() * 9) + 1) + '.png';
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

    function displayAd(config, selectedAd, triggerEvent) {
        const isFullscreen = !config.container;

        if (isFullscreen) {
            injectCSS();
            const previousBodyOverflow = document.body.style.overflow;
            document.body.style.overflow = 'hidden';
            
            const adWrapper = document.createElement('div');
            adWrapper.innerHTML = `
                <div class="cloudads-fs-wrapper">
                    <div class="cloudads-header">Advertisement</div>
                    <button id="cloudads-ad-body" class="cloudads-body">
                        <img src="${selectedAd.imageUrl}" class="cloudads-img" alt="Ad">
                    </button>
                    <div class="cloudads-footer">
                        <div id="cloudads-btn-open" class="cloudads-lsk">Close</div>
                        <div id="cloudads-btn-close" class="cloudads-rsk">Open</div>
                    </div>
                </div>`;
            document.body.appendChild(adWrapper);

            const handleOpen = () => { triggerEvent('click'); window.open(selectedAd.clickUrl, '_blank'); };
            
            const handleClose = () => {
                document.body.removeChild(adWrapper);
                document.body.style.overflow = previousBodyOverflow;
                // ইভেন্ট লিসেনারগুলো রিমুভ করা হচ্ছে অ্যাড ক্লোজ হলে
                document.removeEventListener('keydown', handleAdKeyDown, true);
                document.removeEventListener('keyup', blockKeyUp, true);
                triggerEvent('close');
            };

            // সম্পূর্ণ কীবোর্ড কন্ট্রোল এবং ব্লক করার লজিক
            const handleAdKeyDown = (event) => {
                // পেজের অন্যান্য স্ক্রিপ্টকে কি-বোর্ড ইভেন্ট পাওয়া থেকে পুরোপুরি ব্লক করা হচ্ছে
                event.preventDefault();
                event.stopPropagation();
                event.stopImmediatePropagation();

                const key = event.key || event.keyIdentifier;

                // KaiOS এবং Web এর জন্য Close বাটন ম্যাপ (SoftLeft, Backspace, Esc)
                if (key === 'Escape' || key === 'Esc' || key === 'Backspace' || key === 'SoftLeft' || key === 'BrowserBack') {
                    handleClose();
                } 
                // KaiOS এবং Web এর জন্য Open বাটন ম্যাপ (Enter, SoftRight)
                else if (key === 'Enter' || key === 'SoftRight') {
                    handleOpen();
                }
                // অন্য কোনো কি চাপলে কিছুই হবে না, কিন্তু পেজও কোনো রেসপন্স করবে না
            };

            // KeyUp ইভেন্টগুলোকেও ব্লক করা হচ্ছে যেন গেমিং বা অন্য পেজের লজিক ট্রিগার না হয়
            const blockKeyUp = (event) => {
                event.preventDefault();
                event.stopPropagation();
                event.stopImmediatePropagation();
            };

            // 'true' ব্যবহার করে Capture Phase এ ইভেন্ট ধরা হয়েছে (যাতে সবার আগে SDK ইভেন্ট পায়)
            document.addEventListener('keydown', handleAdKeyDown, true);
            document.addEventListener('keyup', blockKeyUp, true);

            document.getElementById('cloudads-ad-body').onclick = handleOpen;
            document.getElementById('cloudads-btn-open').onclick = handleOpen;
            document.getElementById('cloudads-btn-close').onclick = handleClose;
            
            setTimeout(() => document.getElementById('cloudads-ad-body').focus(), 50);
        } else {
            // Banner Ad Logic
            config.container.innerHTML = '';
            if (selectedAd.type === 'adsterra') {
                const scalerWrapper = document.createElement('div');
                scalerWrapper.style.cssText = 'width:100%; height:60px; position:relative; overflow:hidden;';
                config.container.appendChild(scalerWrapper);

                const innerAdDiv = document.createElement('div');
                innerAdDiv.style.cssText = `width:${selectedAd.width}px; height:${selectedAd.height}px; position:absolute; left:50%; top:50%; transform:translate(-50%, -50%);`;
                scalerWrapper.appendChild(innerAdDiv);

                const applyScaling = () => {
                    const containerWidth = config.container.offsetWidth;
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
                bannerImg.style.cssText = `width:100%; height:${window.innerHeight / 8}px; object-fit:fill; cursor:pointer;`;
                bannerImg.onclick = () => { triggerEvent('click'); window.open(selectedAd.clickUrl, '_blank'); };
                config.container.appendChild(bannerImg);
            }
        }
        triggerEvent('display');
    }

    const processAdRequest = function (config) {
        if (!config || !config.publisher) return;
        
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
                call: (cmd) => { if (cmd === 'display') displayAd(config, selectedAd, triggerEvent); },
                click: () => { 
                    triggerEvent('click'); 
                    if (selectedAd.clickUrl) {
                        window.open(selectedAd.clickUrl, '_blank');
                    }
                }
            };

            if (config.onready) config.onready(adInstance);
        }, 300);
    };

    window.getCloudAd = function (config) {
        processAdRequest(config);
    };

    while (window.cloudAdsQueue.length > 0) {
        const queuedConfig = window.cloudAdsQueue.shift();
        processAdRequest(queuedConfig);
    }

})(window, document);
