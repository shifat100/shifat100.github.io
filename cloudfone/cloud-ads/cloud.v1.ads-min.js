    const bannerAds = [
        {
            type: 'custom',
            imageUrl: 'images/banner/' + (Math.floor(Math.random() * 9) + 1) + '.png',
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

    const fullscreenAds = [
        { clickUrl: 'https://matcheshonoraryunderwater.com/h3ghsxyvp?key=331819c57a0e4e6203da3f03fe993d20' }
    ];

    const getRandomFullscreenImage = () => 'images/fullscreen/' + (Math.floor(Math.random() * 9) + 1) + '.png';
    const getRandomBannerImage = () => 'images/banner/' + (Math.floor(Math.random() * 9) + 1) + '.png';

    const injectCSS = () => {
        if (document.getElementById('cloudads-sdk-styles')) return;
        const style = document.createElement('style');
        style.id = 'cloudads-sdk-styles';
        style.innerHTML = `
                    html, body { margin: 0; padding: 0; min-height: 100%; }
                    .cloudads-fs-wrapper { position: fixed; inset: 0; width: 100%; height: 100%; min-height: 100vh; background-color: #000000; display: flex; flex-direction: column; justify-content: space-between; font-family: 'Roboto', Arial, sans-serif; color: #FFFFFF; z-index: 9999; overflow: hidden; }
                    .cloudads-header { width: 100%; flex: 0 0 auto; background-color: #0093E0; display: none; align-items: center; justify-content: center; font-weight: bold; height: 20px; font-size: 10px; }
                    .cloudads-body { width: 100%; flex: 1 1 auto; display: flex; align-items: center; justify-content: center; background-color: #202020; border: none; cursor: pointer; padding: 0; min-height: 0; overflow: hidden; }
                    .cloudads-body:focus { background-color: #05AEF2; outline: none; }
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

    function createAdInstance(config, selectedAd) {
        const events = {};
        const triggerEvent = (eventName) => { if (events[eventName]) events[eventName](); };
        return {
            on: function (eventName, callback) { events[eventName] = callback; },
            call: function (command) { if (command === 'display') displayAd(config, selectedAd, triggerEvent); }
        };
    }

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
                                <div id="cloudads-btn-skip" class="cloudads-rsk">Open</div>
                            </div>
                        </div>`;
            document.body.appendChild(adWrapper);
            const handleOpen = () => { triggerEvent('click'); window.open(selectedAd.clickUrl, '_blank'); };
            const handleClose = () => {
                document.body.removeChild(adWrapper);
                document.body.style.overflow = previousBodyOverflow;
                document.removeEventListener('keydown', handleAdKeyDown, true);
                document.removeEventListener('keypress', handleAdKeyPress, true);
                document.removeEventListener('keyup', handleAdKeyUp, true);
                triggerEvent('close');
            };
            const handleAdKeyDown = (event) => {
                event.preventDefault();
                event.stopImmediatePropagation();
                if (event.key === 'Escape' || event.key === 'Esc') {
                    handleClose();
                }
                if (event.key === 'Enter') {
                    handleOpen();
                }
            };
            const handleAdKeyPress = (event) => {
                event.preventDefault();
                event.stopImmediatePropagation();
            };
            const handleAdKeyUp = (event) => {
                event.preventDefault();
                event.stopImmediatePropagation();
            };
            document.addEventListener('keydown', handleAdKeyDown, true);
            document.addEventListener('keypress', handleAdKeyPress, true);
            document.addEventListener('keyup', handleAdKeyUp, true);
            document.getElementById('cloudads-ad-body').onclick = handleOpen;
            document.getElementById('cloudads-btn-open').onclick = handleOpen;
            document.getElementById('cloudads-btn-skip').onclick = handleClose;
            setTimeout(() => document.getElementById('cloudads-ad-body').focus(), 50);
        } else {



            config.container.innerHTML = '';

            if (selectedAd.type === 'adsterra') {

                const scalerWrapper = document.createElement('div');
                scalerWrapper.style.width = '100%';
                scalerWrapper.style.height = '60px';
                scalerWrapper.style.position = 'relative';
                scalerWrapper.style.overflow = 'hidden';
                config.container.appendChild(scalerWrapper);


                const innerAdDiv = document.createElement('div');
                innerAdDiv.style.width = selectedAd.width + 'px';
                innerAdDiv.style.height = selectedAd.height + 'px';
                innerAdDiv.style.position = 'absolute';
                innerAdDiv.style.left = '50%';
                innerAdDiv.style.top = '50%';
                innerAdDiv.style.transform = 'translate(-50%, -50%)';
                scalerWrapper.appendChild(innerAdDiv);


                const applyScaling = () => {
                    const containerWidth = config.container.offsetWidth;
                    const adWidth = selectedAd.width;

                    if (containerWidth < adWidth) {
                        const scale = containerWidth / adWidth;

                        innerAdDiv.style.transform = `translate(-50%, -50%) scale(${scale})`;
                        scalerWrapper.style.height = (selectedAd.height * scale) + 'px';
                    } else {
                        innerAdDiv.style.transform = 'translate(-50%, -50%) scale(1)';
                        scalerWrapper.style.height = selectedAd.height + 'px';
                    }
                };


                applyScaling();
                window.addEventListener('resize', applyScaling);


                window.atOptions = {
                    'key': selectedAd.adsterraKey,
                    'format': 'iframe',
                    'height': selectedAd.height,
                    'width': selectedAd.width,
                    'params': {}
                };

                const script = document.createElement('script');
                script.type = 'text/javascript';
                script.src = selectedAd.adsterraSrc;
                innerAdDiv.appendChild(script);

            } else {

                const bannerImg = document.createElement('img');
                bannerImg.src = selectedAd.imageUrl;
                bannerImg.style.width = '100%';
                bannerImg.style.height = (window.innerHeight / 8) + 'px';
                bannerImg.style.objectFit = 'fill';
                bannerImg.style.cursor = 'pointer';
                bannerImg.onclick = () => {
                    triggerEvent('click');
                    window.open(selectedAd.clickUrl, '_blank');
                };
                config.container.appendChild(bannerImg);
            }
        }
        triggerEvent('display');
    }

    window.getCloudAd = function (config) {
        if (!config || !config.publisher) return;
        setTimeout(() => {
            const targetInventory = !config.container ? fullscreenAds : bannerAds;
            const selectedIndex = Math.floor(Math.random() * targetInventory.length);
            const selectedAdBase = targetInventory[selectedIndex];
            const selectedAd = Object.assign({}, selectedAdBase);

            if (!config.container) {
                selectedAd.imageUrl = getRandomFullscreenImage();
            } else if (selectedAd.type === 'custom') {
                selectedAd.imageUrl = getRandomBannerImage();
            }

            const ad = createAdInstance(config, selectedAd);
            if (config.onready) config.onready(ad);
        }, 300);
    };
