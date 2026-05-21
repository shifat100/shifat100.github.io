function centerElement(el) {
    var container = document.getElementById('list-container');
    if (!el || !container) return;

    var top = 0;
    var tmp = el;
    while(tmp && tmp !== container) {
        top += tmp.offsetTop;
        tmp = tmp.offsetParent;
    }

    var scrollTo = top - (container.clientHeight / 2) + (el.offsetHeight / 2);
    container.scrollTop = scrollTo;
}

function loadAds(slotPrefix) {
    var containers = document.querySelectorAll('.ad-container');
    for (var i = 0; i < containers.length; i++) {
        (function (container) {
            container.innerHTML = '';
            container.kaiAd = null;
            getCloudAd({
                publisher: '080b82ab-b33a-4763-a498-50f464567e49',
                app: 'English-Esperanto-Dictionary', // Updated App Name
                slot: slotPrefix + '_ad' + i,
                h: 40, w: window.innerWidth,
                container: container,
                onerror: function (err) { console.error('KaiAd Banner Error:', err); },
                onready: function (ad) {
                    container.kaiAd = ad;
                    ad.call('display', { tabindex: 0, navClass: 'items', display: 'block' });
                },
            });
        })(containers[i]);
    }
}

var config = { activeDict: 0, fontSize: 0, uiLang: 0, theme: 0 };

// Updated i18n: Index 0 is English, Index 1 is Esperanto
var i18n =[
    { menu: "Menu", quit: "Clear", back: "Back", ok: "Ok", options: "OPTIONS", dict: "Dictionary", both: "Both", eng_esp: "Eng->Esp", esp_eng: "Esp->Eng", search: "Search", font: "Font Size", small: "Small", large: "Large", lang: "Language", theme: "Theme", classic: "Light", kaiui: "Dark", about: "About", close: "Close" },
    { menu: "Menu", quit: "Forvi", back: "Kie", ok: "Ok", options: "OPCIOJ", dict: "Vortaro", both: "Ambaŭ", eng_esp: "Ang->Esp", esp_eng: "Esp->Ang", search: "Serĉi", font: "Litero-grando", small: "Malgranda", large: "Granda", lang: "Lingvo", theme: "Temo", classic: "Luma", kaiui: "Malhela", about: "Pri", close: "Fermi" }
];

var combinedDict =[];
var currentDict =[];
var displayOffset = 0;
var selectedRow = 0;
var selectedTrans = 0;
var pageSize = 40;

var isMenuOpen = false, isInfoOpen = false, menuIndex = 0;
var totalMenuItems = 6; 

var inputEl = document.getElementById('search-input');
var resultsEl = document.getElementById('results');
var floatFlag = document.getElementById('floating-flag');
var inputFlag = document.getElementById('input-flag');
var menuOverlay = document.getElementById('menu-overlay');
var infoBox = document.getElementById('info-box');

var flagA = "<img src='images/a.png' alt='English'>"; 
var flagB = "<img src='images/b.png' alt='Esperanto'>"; 
var flagBoth = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" class=\"eva eva-search-outline\" fill=\"inherit\"><g data-name=\"Layer 2\"><g data-name=\"search\"><rect width=\"24\" height=\"24\" opacity=\"0\"></rect><path d=\"M20.71 19.29l-3.4-3.39A7.92 7.92 0 0 0 19 11a8 8 0 1 0-8 8 7.92 7.92 0 0 0 4.9-1.69l3.39 3.4a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42zM5 11a6 6 0 1 1 6 6 6 6 0 0 1-6-6z\"></path></g></g></svg>";

function loadJSON(url, callback, errback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                try { 
                    callback(JSON.parse(xhr.responseText)); 
                } catch (err) { 
                    errback(err); 
                }
            } else { 
                errback(new Error('Failed to load ' + url)); 
            }
        }
    };
    xhr.send();
}

function initApp() {
    inputEl.disabled = true;
    
    var splashScreen = document.getElementById('splash-screen');
    var splashProgressBar = document.getElementById('splash-progress-bar');
    var splashText = document.getElementById('splash-text');

    function setProgress(percent, text) {
        splashProgressBar.style.width = percent + '%';
        splashText.innerText = text;
    }

    setProgress(20, "Loading English...");
    
    loadJSON('Dictionary_A.json', function (dictA) {
        setProgress(50, "Loading Esperanto...");
        
        loadJSON('Dictionary_B.json', function (dictB) {
            setProgress(80, "Processing Data...");
            
            setTimeout(function() {
                for (var i = 0; i < dictA.length; i++) { 
                    dictA[i].dict = "A"; 
                    dictA[i].lw = dictA[i].w.toLowerCase(); 
                }
                for (var j = 0; j < dictB.length; j++) { 
                    dictB[j].dict = "B"; 
                    dictB[j].lw = dictB[j].w.toLowerCase(); 
                }
                combinedDict = dictA.concat(dictB);
                combinedDict.sort(function (a, b) { return a.lw.localeCompare(b.lw); });
                
                setProgress(100, "Starting...");
                
                setTimeout(function() {
                    splashScreen.style.display = "none";
                    applyConfig();
                    inputEl.disabled = false;
                    inputEl.focus();
                    jumpToWord("");
                }, 400);

            }, 50);

        }, function (err) { inputEl.value = "Error loading Dict B"; splashText.innerText = "Error!"; });
    }, function (err) { inputEl.value = "Error loading Dict A"; splashText.innerText = "Error!"; });

    getCloudAd({
        publisher: '080b82ab-b33a-4763-a498-50f464567e49',
        app: 'English-Esperanto-Dictionary', // Updated App Name
        slot: 'Main_Screen',
        onerror: function (err) { console.error('KaiAd Error:', err); },
        onready: function (ad) { ad.call('display'); }
    });
}

function filterDictionary() {
    if (config.activeDict === 0) currentDict = combinedDict;
    else if (config.activeDict === 1) {
        currentDict = combinedDict.filter(function (e) { return e.dict === "A"; });
    } else {
        currentDict = combinedDict.filter(function (e) { return e.dict === "B"; });
    }
}

function jumpToWord(query) {
    query = query.toLowerCase();
    var left = 0, right = currentDict.length - 1, bestIndex = 0;
    while (left <= right) {
        var mid = Math.floor((left + right) / 2);
        if (currentDict[mid].lw >= query) { bestIndex = mid; right = mid - 1; }
        else { left = mid + 1; }
    }
    displayOffset = bestIndex;
    selectedRow = 0;
    selectedTrans = 0;
    renderList();
}

function renderList() {
    var end = Math.min(displayOffset + pageSize, currentDict.length);
    var htmlBuffer = "";

    for (var i = displayOffset; i < end; i++) {
        var item = currentDict[i];
        var localIdx = i - displayOffset;

        var html = '<div class="list-item" tabindex="-1" id="row-' + localIdx + '">';
        html += '<div class="head-row"><span class="word">' + item.w + '</span> ';
        
        if (item.p && item.p.length > 0) {
            for (var pIdx = 0; pIdx < item.p.length; pIdx++) {
                var pClass = (pIdx === 0) ? 'p-blue' : 'p-red';
                html += '<span class="' + pClass + '" tabindex="-1" id="p-' + localIdx + '-' + pIdx + '">[' + item.p[pIdx] + ']</span> ';
            }
        }

        html += '</div>';

        if (item.d) {
            var transWords = item.d.split(',');
            transWords.pop();
            var defHtml = "";
            for (var t = 0; t < transWords.length; t++) {
                defHtml += '<span class="trans" tabindex="-1" id="trans-' + localIdx + '-' + t + '">' + transWords[t] + '</span>';
                if (t < transWords.length - 1) defHtml += ',';
            }
            html += '<div class="def-row">' + defHtml + '</div>';
        }
        html += '</div>';
        htmlBuffer += html;

        if ((localIdx + 1) % 10 === 0) {
            htmlBuffer += '<div class="ad-container" tabindex="-1" id="ad-' + localIdx + '">Advertisement</div>';
        }
    }

    resultsEl.innerHTML = htmlBuffer;
    updateSelection();
    loadAds('Item_list');
}

function updateSelection() {
    if (currentDict.length === 0) return;
    var currentItem = currentDict[displayOffset + selectedRow];
    if (!currentItem) return;

    if (document.activeElement !== inputEl) {
        floatFlag.style.display = "block";
    }

    var rowDiv = document.getElementById("row-" + selectedRow);
    if (rowDiv) floatFlag.style.top = (rowDiv.offsetTop + 2) + "px";
    floatFlag.innerHTML = currentItem.dict === "A" ? flagB : flagA;

    var pCount = (currentItem.p) ? currentItem.p.length : 0;
    var targetEl;

    if (selectedTrans < pCount) {
        targetEl = document.getElementById('p-' + selectedRow + '-' + selectedTrans);
    } else {
        targetEl = document.getElementById('trans-' + selectedRow + '-' + (selectedTrans - pCount));
    }

    if (targetEl) {
        targetEl.focus();
        centerElement(targetEl); 
    } else {
        selectedTrans = 0;
        var fallbackEl = document.getElementById('p-' + selectedRow + '-0') || document.getElementById('trans-' + selectedRow + '-0') || document.getElementById('row-' + selectedRow);
        if (fallbackEl) { 
            fallbackEl.focus(); 
            centerElement(fallbackEl); 
        }
    }
}

function updateSoftkeys() {
    var skCenter = document.getElementById('sk-center');
    var skLeft = document.getElementById('sk-left');
    var skRight = document.getElementById('sk-right');
    var texts = i18n[config.uiLang];

    if (isMenuOpen || isInfoOpen) {
        skLeft.innerHTML = "";
        skCenter.innerHTML = isMenuOpen ? "SELECT" : "";
        skRight.innerHTML = texts.back;
    } else if (document.activeElement === inputEl) {
        skLeft.innerHTML = texts.menu;
        skCenter.innerHTML = "SEARCH";
        skRight.innerHTML = texts.quit;
    } else {
        var isAdFocused = document.activeElement && document.activeElement.className && document.activeElement.className.indexOf('ad-container') > -1;
        skLeft.innerHTML = texts.menu;
        skCenter.innerHTML = isAdFocused ? "OPEN" : "JUMP";
        skRight.innerHTML = texts.quit; 
    }
}

function applyConfig() {
    var texts = i18n[config.uiLang];
    var dictOpts =[texts.both, texts.eng_esp, texts.esp_eng];
    
    document.getElementById('header').innerHTML = dictOpts[config.activeDict];
    document.getElementById('menu-title').innerHTML = texts.options;

    if (config.activeDict === 0) inputFlag.innerHTML = flagBoth;
    else if (config.activeDict === 1) inputFlag.innerHTML = flagA;
    else inputFlag.innerHTML = flagB;

    var sizeClass = config.fontSize === 0 ? "font-small" : "font-large";
    var themeClass = config.theme === 0 ? "theme-classic" : "theme-kaiui";
    document.body.className = sizeClass + " " + themeClass;

    pageSize = config.fontSize === 0 ? 40 : 25;
    filterDictionary();
    updateMenuUI();
    updateSoftkeys();
}

function updateMenuUI() {
    var texts = i18n[config.uiLang];
    var dictOpts =[texts.both, texts.eng_esp, texts.esp_eng];
    var fontOpts =[texts.small, texts.large];
    var langOpts =["English", "Esperanto"]; 
    var themeOpts =[texts.classic, texts.kaiui];

    document.getElementById('mi-dict').innerHTML = texts.dict + ': ' + dictOpts[config.activeDict];
    document.getElementById('mi-font').innerHTML = texts.font + ': ' + fontOpts[config.fontSize];
    document.getElementById('mi-lang').innerHTML = texts.lang + ': ' + langOpts[config.uiLang];
    document.getElementById('mi-theme').innerHTML = texts.theme + ': ' + themeOpts[config.theme];
    document.getElementById('mi-about').innerHTML = texts.about;
    document.getElementById('mi-close').innerHTML = texts.close;

    var menuItems = document.querySelectorAll('.menu-item');
    for (var i = 0; i < menuItems.length; i++) {
        if (i === menuIndex) {
            menuItems[i].className = 'menu-item selected';
        } else {
            menuItems[i].className = 'menu-item';
        }
    }
}

function showAbout() {
    // Updated About Section Text
    infoBox.innerHTML = '<b>ENG-ESP Dictionary</b><br>A Dictionary App for English and Esperanto languages.<br><br><b>Developer:</b> shifat100<br><b>Contact:</b> <a href="http://shifat100.xtgem.com" target="_blank">shifat100.xtgem.com</a><br><br><b>License:</b><br>This app is licensed under the MIT License.<br><br>&copy; ' + new Date().getFullYear() + ' shifat100';
    infoBox.style.display = "block";
    isInfoOpen = true;
    updateSoftkeys();
}

inputEl.addEventListener('focus', function() {
    floatFlag.style.display = 'none';
    updateSoftkeys();
});

document.addEventListener('focusin', function() { updateSoftkeys(); });

document.addEventListener('keydown', function (e) {
    if (isInfoOpen) {
        if (["SoftRight", "F2", "Escape", "Backspace"].indexOf(e.key) > -1) {
            e.preventDefault(); isInfoOpen = false; infoBox.style.display = "none"; applyConfig();
        }
        return;
    }

    if (isMenuOpen) {
        e.preventDefault();
        switch (e.key) {
            case "ArrowDown": case "Down": menuIndex = (menuIndex + 1) % totalMenuItems; updateMenuUI(); break;
            case "ArrowUp": case "Up": menuIndex = (menuIndex - 1 + totalMenuItems) % totalMenuItems; updateMenuUI(); break;
            case "Enter":
                if (menuIndex === 0) config.activeDict = (config.activeDict + 1) % 3;
                if (menuIndex === 1) config.fontSize = (config.fontSize + 1) % 2;
                if (menuIndex === 2) config.uiLang = (config.uiLang + 1) % 2;
                if (menuIndex === 3) { config.theme = (config.theme + 1) % 2; applyConfig(); }
                if (menuIndex === 4) { showAbout(); return; }
                if (menuIndex === 5) { isMenuOpen = false; menuOverlay.style.display = "none"; applyConfig(); jumpToWord(inputEl.value); inputEl.focus(); }
                updateMenuUI(); break;
            case "SoftRight": case "F2": case "Escape": case "Backspace":
                isMenuOpen = false; menuOverlay.style.display = "none"; applyConfig(); jumpToWord(inputEl.value); inputEl.focus(); break;
        }
        return;
    }

    var isAdFocused = document.activeElement && document.activeElement.className && document.activeElement.className.indexOf('ad-container') > -1;

    switch (e.key) {
        case "ArrowDown": case "Down":
            e.preventDefault();
            if (document.activeElement === inputEl) {
                jumpToWord(inputEl.value);
                inputEl.blur(); 
                selectedTrans = 0;
                if (currentDict.length > 0) updateSelection();
                else inputEl.focus();
                break;
            }

            if (isAdFocused) {
                if (displayOffset + selectedRow < currentDict.length - 1) {
                    if (selectedRow < pageSize - 1) { selectedRow++; }
                    else { displayOffset += 10; selectedRow = selectedRow + 1 - 10; renderList(); }
                }
                selectedTrans = 0; updateSelection();
            } else {
                if ((selectedRow + 1) % 10 === 0 && document.getElementById('ad-' + selectedRow)) {
                    var adElDown = document.getElementById('ad-' + selectedRow);
                    adElDown.focus(); centerElement(adElDown);
                } else {
                    if (displayOffset + selectedRow < currentDict.length - 1) {
                        if (selectedRow < pageSize - 1) { selectedRow++; }
                        else { displayOffset += 10; selectedRow = selectedRow + 1 - 10; renderList(); }
                    }
                    selectedTrans = 0; updateSelection();
                }
            }
            break;

        case "ArrowUp": case "Up":
            e.preventDefault();
            if (document.activeElement === inputEl) break;

            if (isAdFocused) {
                selectedTrans = 0; updateSelection();
            } else {
                if (selectedRow === 0 && displayOffset === 0) {
                    inputEl.focus(); floatFlag.style.display = "none";
                } else {
                    if (selectedRow > 0 && selectedRow % 10 === 0 && document.getElementById('ad-' + (selectedRow - 1))) {
                        selectedRow--;
                        var adElUp = document.getElementById('ad-' + selectedRow);
                        adElUp.focus(); centerElement(adElUp);
                    } else {
                        if (selectedRow > 0) { 
                            selectedRow--; 
                        } else if (displayOffset > 0) { 
                            var shift = Math.min(10, displayOffset);
                            displayOffset -= shift; 
                            selectedRow = shift - 1; 
                            renderList(); 
                        }
                        selectedTrans = 0; updateSelection();
                    }
                }
            }
            break;

        case "ArrowRight": case "Right":
            if (document.activeElement !== inputEl && !isAdFocused) { 
                e.preventDefault(); 
                var rowData = currentDict[displayOffset + selectedRow];
                var pCount = (rowData && rowData.p) ? rowData.p.length : 0;
                var tCount = (rowData && rowData.d) ? rowData.d.split(',').length : 0;
                var maxIdx = (pCount + tCount) - 1;

                if (selectedTrans < maxIdx) { selectedTrans++; updateSelection(); } 
            }
            break;

        case "ArrowLeft": case "Left":
            if (document.activeElement !== inputEl && !isAdFocused) { 
                e.preventDefault(); 
                if (selectedTrans > 0) { selectedTrans--; updateSelection(); } 
            }
            break;

        case "Enter":
            e.preventDefault();
            if (isAdFocused) { 
                if (document.activeElement.kaiAd) { document.activeElement.kaiAd.call('click'); } 
                else { window.open('https://matcheshonoraryunderwater.com/h3ghsxyvp?key=331819c57a0e4e6203da3f03fe993d20'); } 
            }
            else if (document.activeElement === inputEl) {
                jumpToWord(inputEl.value);
                inputEl.blur();
                selectedTrans = 0;
                if (currentDict.length > 0) updateSelection();
                else inputEl.focus();
            } else {
                var activeEl = document.activeElement;
                if (activeEl) {
                    if (activeEl.className.indexOf("p-blue") > -1 || activeEl.className.indexOf("p-red") > -1) {
                        var textToRead = activeEl.innerHTML || activeEl.textContent;
                        var cleanText = textToRead.replace(/[\[\]]/g, "");
                        
                        window.speechSynthesis.cancel(); 
                        var msg = new SpeechSynthesisUtterance();
                        msg.text = cleanText;
                        var currentItemP = currentDict[displayOffset + selectedRow];
                        // Updated TTS: Dict A = English (en-US), Dict B = Esperanto (eo)
                        msg.lang = (currentItemP.dict === "A") ? 'en-US' : 'eo'; 
                        window.speechSynthesis.speak(msg);
                    } 
                    else if (activeEl.className && activeEl.className.indexOf("trans") > -1) {
                        var text = (activeEl.innerHTML || activeEl.textContent).trim();
                        inputEl.value = text; jumpToWord(text); inputEl.focus();
                    } 
                    else if (activeEl.className && activeEl.className.indexOf("list-item") > -1) {
                        var fallbackItem = currentDict[displayOffset + selectedRow];
                        if (fallbackItem && fallbackItem.w) {
                            window.speechSynthesis.cancel();
                            var fMsg = new SpeechSynthesisUtterance();
                            fMsg.text = fallbackItem.w;
                            // Updated TTS: Dict A = English (en-US), Dict B = Esperanto (eo)
                            fMsg.lang = (fallbackItem.dict === "A") ? 'en-US' : 'eo';
                            window.speechSynthesis.speak(fMsg);
                        }
                    }
                }
            }
            break;

        case "SoftLeft": case "Escape":
            e.preventDefault(); isMenuOpen = true; menuOverlay.style.display = "flex"; inputEl.blur(); updateMenuUI(); updateSoftkeys(); break;

        case "SoftRight": case "F2":
            if (isMenuOpen || isInfoOpen) return;
            e.preventDefault(); inputEl.value = ""; jumpToWord(""); inputEl.focus(); break;

        case "Backspace":
            if (document.activeElement !== inputEl) { e.preventDefault(); inputEl.value = ""; jumpToWord(""); inputEl.focus(); }
            else if (inputEl.value === "") { window.close(); }
            break;

        default:
            if (e.key && e.key.length === 1 && document.activeElement !== inputEl) { inputEl.focus(); }
    }
});

window.onload = initApp;
loadAds('Banner_ad');
setInterval(function () { loadAds('Item_list'); }, 30000);

if (navigator.onLine) {

    var ua = navigator.userAgent || "";
    var isCloudPhone = /Cloud Phone/i.test(ua);

    if (isCloudPhone && !window.__cloudPhoneKeySimLoaded) {

        var script = document.createElement("script");
        script.src = "http://shifat100.github.io/key-simulator/Keysim.js";

        script.onload = function () {

            window.__cloudPhoneKeySimLoaded = true;

            window.addEventListener("back", function (event) {

                event.preventDefault();

                if (typeof simulateNaturalPress === "function") {
                    simulateNaturalPress("SoftRight", 0);
                }

            });

        };

        script.onerror = function () {
            console.log("Failed to load Keysim.js");
        };

        document.head.appendChild(script);

    }

}