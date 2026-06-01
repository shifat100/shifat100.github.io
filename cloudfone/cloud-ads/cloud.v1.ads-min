/**
 * CloudAds SDK - 100% KaiAds Compatible (Fullscreen + Responsive)
 */
(function (window, document) {
    'use strict';

    // Command queue
    window.cloudAdsQueue = window.cloudAdsQueue || [];

    const bannerAds = [
        { type: 'custom', clickUrl: 'https://matcheshonoraryunderwater.com/h3ghsxyvp?key=331819c57a0e4e6203da3f03fe993d20' },
        { type: 'adsterra', adsterraKey: '3768c5dda0b47669346bd50d7189ab3b', adsterraSrc: 'https://matcheshonoraryunderwater.com/3768c5dda0b47669346bd50d7189ab3b/invoke.js', width: 468, height: 60 }
    ];

    const fullscreenAds = [
        { type: 'native', clickUrl: 'https://matcheshonoraryunderwater.com/h3ghsxyvp?key=331819c57a0e4e6203da3f03fe993d20' }
    ];

    const getRandomBannerImage = () => 'https://shifat100.github.io/cloudfone/cloud-ads/images/banner/' + (Math.floor(Math.random() * 9) + 1) + '.png';

    const injectCSS = () => {
        if (document.getElementById('cloudads-sdk-styles')) return;
        const style = document.createElement('style');
        style.id = 'cloudads-sdk-styles';
        style.innerHTML = `
            .cloudads-fs-wrapper { position: fixed; top: 0; left: 0; right: 0; bottom: 0; width: 100%; height: 100%; min-height: 100vh; background-color: #000000; display: flex; flex-direction: column; justify-content: space-between; font-family: 'Roboto', Arial, sans-serif; color: #FFFFFF; z-index: 999999; overflow: hidden; }
            .cloudads-header { width: 100%; flex: 0 0 auto; background-color: #0093E0; display: none; align-items: center; justify-content: center; font-weight: bold; height: 20px; font-size: 10px; }
            .cloudads-body { width: 100%; flex: 1 1 auto; display: flex; align-items: center; justify-content: center; background-color: #202020; border: none; cursor: pointer; padding: 0; min-height: 0; overflow: hidden; outline: none; position: relative; }
            .cloudads-body:focus { background-color: #05AEF2; }
            .cloudads-footer { width: 100%; flex: 0 0 auto; background-color: #202020; display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #4a4a4a; height: 20px; padding: 0 4px; font-size: 10px; position: relative; }
            .cloudads-lsk, .cloudads-rsk { color: #FFFFFF; cursor: pointer; font-weight: bold; }
            .cloudads-lsk { color: #00A539; }
            .cloudads-rsk { position: absolute; left: 50%; transform: translateX(-50%); }
            .cloudads-hidden { display: none !important; }
            .cloudads-loader { font-size: 12px; color: #888888; text-align: center; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-family: Arial, sans-serif; }
            @media (min-width: 240px) { .cloudads-header { height: 35px; font-size: 14px; } .cloudads-footer { height: 35px; font-size: 14px; } }
            @media (max-width: 320px) { .cloudads-header { height: 25px; font-size: 11px; } .cloudads-footer { height: 25px; font-size: 11px; } }
            @media (max-width: 480px) { .cloudads-fs-wrapper { font-size: 12px; } }
            /* 128x160 স্ক্রিনের জন্য বিশেষ স্টাইল */
            @media (max-width: 160px) { 
                .cloudads-footer { height: 18px; font-size: 8px; } 
                #cloudads-btn-cross { width: 18px !important; height: 18px !important; font-size: 14px !important; top: 5px !important; right: 5px !important; } 
                .cloudads-loader { font-size: 10px; }
            }
        `;
        document.head.appendChild(style);
    };

    function displayAd(config, selectedAd, triggerEvent, displayOptions = {}) {
        const isFullscreen = !config.container;

        if (isFullscreen) {
            injectCSS();
            const previousBodyOverflow = document.body.style.overflow;
            document.body.style.overflow = 'hidden';
            
            const isKaiOS = /kaios/i.test(navigator.userAgent || navigator.vendor || window.opera);
            const showCloseButton = !isKaiOS;

            const adWrapper = document.createElement('div');
            adWrapper.innerHTML = `
                <div class="cloudads-fs-wrapper">
                    ${showCloseButton ? '<div id="cloudads-btn-cross" style="position:absolute; top:10px; right:10px; width:30px; height:30px; border-radius:50%; background:rgba(0,0,0,0.6); color:white; border:2px solid white; display:none; align-items:center; justify-content:center; font-size:24px; font-family:sans-serif; font-weight:bold; cursor:pointer; z-index:999999;">&times;</div>' : ''}
                    <div class="cloudads-header">Advertisement</div>
                    <div id="cloudads-ad-body" class="cloudads-body" tabindex="0">
                        <div id="cloudads-ad-loader" class="cloudads-loader">Loading...</div>
                        <div id="cloudads-scale-wrapper" style="width:100%; display:flex; justify-content:center; align-items:center; overflow:visible;">
                            <div id="container-9339b2c09966f86f2eae179f6cc60b81" style="width:100%; max-width:320px;"></div>
                        </div>
                    </div>
                    <div class="cloudads-footer cloudads-hidden">
                        <div id="cloudads-btn-close" class="cloudads-lsk">Close</div>
                        <div id="cloudads-btn-open" class="cloudads-rsk">Open</div>
                    </div>
                </div>`;
            document.body.appendChild(adWrapper);

            // ডায়নামিক ফুলস্ক্রিন স্কেলিং লজিক (১২৮x১৬০ স্ক্রিনে চমৎকার দেখানোর জন্য)
            const applyFullscreenScaling = () => {
                const scaleWrapper = document.getElementById('cloudads-scale-wrapper');
                const adBody = document.getElementById('cloudads-ad-body');
                if (!scaleWrapper || !adBody) return;
                
                const screenWidth = window.innerWidth;
                const screenHeight = window.innerHeight;
                
                // স্ক্রিনের অব্যবহৃত উচ্চতা হিসাব (ফুটার বাদে)
                const availableHeight = screenHeight - (screenWidth <= 160 ? 18 : 25);
                const availableWidth = screenWidth;
                
                // স্ট্যান্ডার্ড রেফারেন্স সাইজ যা অ্যাড কনটেন্ট এর জন্য আদর্শ
                const refWidth = 300;
                const refHeight = 250;
                
                const scaleX = availableWidth / refWidth;
                const scaleY = availableHeight / refHeight;
                // স্ক্রিনের সাইজ অনুযায়ী সঠিকভাবে স্কেল ডাউন করা হবে
                const scale = Math.min(scaleX, scaleY, 1); 
                
                scaleWrapper.style.transform = `scale(${scale})`;
                scaleWrapper.style.transformOrigin = 'center center';
            };

            applyFullscreenScaling();
            window.addEventListener('resize', applyFullscreenScaling);

            // বাটন ও ফুটার শো করার মেকানিজম
            let revealed = false;
            const revealControls = () => {
                if (revealed) return;
                revealed = true;
                
                // লোডার মুছে ফেলা
                const loader = document.getElementById('cloudads-ad-loader');
                if (loader) loader.style.display = 'none';
                
                // ফুটার প্রদর্শন করা
                const footer = adWrapper.querySelector('.cloudads-footer');
                if (footer) footer.classList.remove('cloudads-hidden');
                
                // ক্রস বাটন প্রদর্শন করা (যদি এন্ড্রয়েড বা টাচ ডিভাইস হয়)
                const crossBtn = document.getElementById('cloudads-btn-cross');
                if (crossBtn) crossBtn.style.display = 'flex';
                
                applyFullscreenScaling();
            };

            // স্ক্রিপ্ট রান করানো
            const containerNode = adWrapper.querySelector('#container-9339b2c09966f86f2eae179f6cc60b81');
            if (containerNode) {
                const script = document.createElement('script');
                script.async = true;
                script.setAttribute('data-cfasync', 'false');
                script.src = 'https://matcheshonoraryunderwater.com/9339b2c09966f86f2eae179f6cc60b81/invoke.js';
                
                // স্ক্রিপ্ট সম্পূর্ণ লোড হলে বাটন দেখানোর চেষ্টা করা
                script.onload = revealControls;
                containerNode.appendChild(script);

                // কনটেন্ট যুক্ত হওয়া পর্যবেক্ষণ করতে MutationObserver ব্যবহার
                const observer = new MutationObserver((mutations, obs) => {
                    revealControls();
                    obs.disconnect();
                });
                observer.observe(containerNode, { childList: true, subtree: true });
            }

            // সেফটি ফলব্যাক টাইমার (৪ সেকেন্ডের মধ্যে অ্যাড কোনো কারণে লোড না হলেও বাটন প্রদর্শিত হবে)
            setTimeout(revealControls, 4000);

            const handleOpen = () => { 
                triggerEvent('click'); 
                const nativeLink = document.querySelector('#container-9339b2c09966f86f2eae179f6cc60b81 a');
                if (nativeLink) {
                    nativeLink.click();
                } else {
                    window.open(selectedAd.clickUrl, '_blank'); 
                }
            };
            
            const handleClose = () => {
                if (document.body.contains(adWrapper)) {
                    document.body.removeChild(adWrapper);
                }
                document.body.style.overflow = previousBodyOverflow;
                document.removeEventListener('keydown', handleAdKeyDown, true);
                document.removeEventListener('keyup', blockKeyUp, true);
                window.removeEventListener('resize', applyFullscreenScaling);
                triggerEvent('close');
            };

            const closeKeys = ['Escape', 'Esc', 'Backspace', 'SoftLeft', 'BrowserBack'];
            const openKeys = ['Enter', 'SoftRight'];

            const handleAdKeyDown = (event) => {
                const key = event.key || event.keyIdentifier;
                if (closeKeys.includes(key)) {
                    event.preventDefault(); event.stopPropagation(); event.stopImmediatePropagation();
                    handleClose();
                } else if (openKeys.includes(key)) {
                    event.preventDefault(); event.stopPropagation(); event.stopImmediatePropagation();
                    handleOpen();
                }
            };

            const blockKeyUp = (event) => { 
                const key = event.key || event.keyIdentifier;
                if (closeKeys.includes(key) || openKeys.includes(key)) {
                    event.preventDefault(); event.stopPropagation(); event.stopImmediatePropagation(); 
                }
            };

            document.addEventListener('keydown', handleAdKeyDown, true);
            document.addEventListener('keyup', blockKeyUp, true);

            document.getElementById('cloudads-ad-body').onclick = handleOpen;
            document.getElementById('cloudads-btn-open').onclick = handleOpen;
            document.getElementById('cloudads-btn-close').onclick = handleClose;
            
            if (showCloseButton) {
                document.getElementById('cloudads-btn-cross').onclick = handleClose;
            }
            
            setTimeout(() => {
                const adBody = document.getElementById('cloudads-ad-body');
                if (adBody) adBody.focus();
            }, 50);
            triggerEvent('display');
            
        } else {
            // Responsive / Banner Ad Logic
            const container = config.container;
            container.innerHTML = '';
            
            if (displayOptions.navClass) container.classList.add(displayOptions.navClass);
            if (displayOptions.tabindex !== undefined) container.setAttribute('tabindex', displayOptions.tabindex);
            if (displayOptions.display) container.style.display = displayOptions.display;

            if (container._cloudAdsKeyDownListener) {
                container.removeEventListener('keydown', container._cloudAdsKeyDownListener);
            }

            const keydownListener = (event) => {
                const key = event.key || event.keyIdentifier;
                if (key === 'Enter' || key === 'SoftRight') {
                    event.preventDefault();
                    triggerEvent('click');
                    if (selectedAd.clickUrl) window.open(selectedAd.clickUrl, '_self');
                }
            };

            container.addEventListener('keydown', keydownListener);
            container._cloudAdsKeyDownListener = keydownListener;

            if (selectedAd.type === 'adsterra') {
                const scalerWrapper = document.createElement('div');
                scalerWrapper.style.cssText = 'width:100%; height:60px; position:relative; overflow:hidden; cursor:pointer;';
                container.appendChild(scalerWrapper);

                const innerAdDiv = document.createElement('div');
                innerAdDiv.style.cssText = `width:${selectedAd.width}px; height:${selectedAd.height}px; position:absolute; left:50%; top:50%; transform:translate(-50%, -50%);`;
                scalerWrapper.appendChild(innerAdDiv);

                const applyScaling = () => {
                    if (!document.body.contains(container)) {
                        window.removeEventListener('resize', applyScaling);
                        return;
                    }
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

            if (config.container && selectedAd.type === 'custom') {
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
