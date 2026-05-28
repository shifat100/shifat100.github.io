/**
 * CLOUD PHONE WIDGET - NES EMULATOR MAIN ENGINE
 * Includes Local Storage ROM History & Native File Picker via LSK
 */

let storedFiles = JSON.parse(localStorage.getItem('storedROMs') || '[]');
let isPlaying = false;

function initUI() {
    // 1. Inject Hidden File Picker for Device Storage
    const filePicker = document.createElement('input');
    filePicker.type = 'file';
    filePicker.accept = '.nes';
    filePicker.className = 'hidden';
    document.body.appendChild(filePicker);
    
    // Handle File Selection
    filePicker.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        saveToFileHistory(file.name);
        playROM(file.name, file); // Play immediately
    });

    // 2. Render the Main Menu (History List)
    renderStoredFilesMenu();

    // 3. Global Keybindings for Menu (Adhering to Softkey Rules)
    document.addEventListener('keydown', (e) => {
        if (isPlaying) return; // Ignore if game is running (NES engine takes over)
        
        if (e.key === 'SoftLeft' || e.key === 'F1') {
            // LSK: Positive Action -> Open File Picker
            filePicker.click();
        } else if (e.key === 'SoftRight' || e.key === 'F2' || e.key === 'Backspace') {
            // RSK: Negative Action -> Back/Exit
            if (e.key === 'Backspace') e.preventDefault();
            window.location.href = '/index.html'; 
        }
    });
    
    // Fix Web Audio resume on first physical key press (Replacing touch events)
    const resumeAudio = () => {
        if (typeof nes !== 'undefined' && nes.webAudioContextResume) nes.webAudioContextResume();
        document.removeEventListener('keydown', resumeAudio);
    };
    document.addEventListener('keydown', resumeAudio);
}

// ---------- FILE STORAGE LOGIC ---------- //

function saveToFileHistory(filename) {
    if (!storedFiles.includes(filename)) {
        storedFiles.unshift(filename); // Add to top of the list
        if (storedFiles.length > 15) storedFiles.pop(); // Keep only the last 15 ROMs
        localStorage.setItem('storedROMs', JSON.stringify(storedFiles));
    }
}

// ---------- UI RENDERING ---------- //

function renderStoredFilesMenu() {
    isPlaying = false;
    const app = document.getElementById('app') || document.body;
    app.innerHTML = '';
    
    const listContainer = document.createElement('div');
    listContainer.className = 'flex flex-col w-full h-full bg-cm-gray-020 p-1 cm-qvga:p-2 z-10 overflow-y-auto pb-6';
    
    // Empty State
    if (storedFiles.length === 0) {
        listContainer.innerHTML = `
            <div class="flex-1 flex flex-col items-center justify-center text-center mt-10">
                <span class="text-2xl cm-qvga:text-4xl opacity-50 mb-2">🎮</span>
                <p class="text-[10px] cm-qvga:text-sm font-bold text-white mb-1">No Saved ROMs</p>
                <p class="text-[9px] cm-qvga:text-xs text-gray-300">Press <b class="text-cm-blue-05a">Select</b> to pick a game</p>
            </div>
        `;
    } 
    // History List State
    else {
        storedFiles.forEach((filename, i) => {
            const item = document.createElement('div');
            // Strict Focus Engine Applied
            item.className = 'focusable file-item p-2 text-[10px] cm-qvga:text-sm border-b border-gray-700 outline-none transition-colors focus:bg-cm-blue-05a focus:font-bold truncate w-full cursor-pointer text-white';
            item.tabIndex = i;
            item.textContent = filename.split('/').pop().replace(/\.nes$/i, ''); // Clean display name
            item.onclick = () => playROM(filename);
            listContainer.appendChild(item);
        });
        
        // D-Pad Navigation Engine
        listContainer.addEventListener('keydown', (e) => {
            const items = document.querySelectorAll('.file-item');
            if (items.length === 0) return;

            let idx = document.activeElement.tabIndex;
            if (isNaN(idx) || idx === undefined) idx = 0;
            
            if (e.key === 'ArrowUp') idx = Math.max(0, idx - 1);
            if (e.key === 'ArrowDown') idx = Math.min(items.length - 1, idx + 1);
            
            if (items[idx]) {
                items[idx].focus();
                items[idx].scrollIntoView({ block: 'center' });
            }

            if (e.key === 'Enter') playROM(storedFiles[idx]);
        });
    }
    
    app.appendChild(listContainer);

    // Auto-focus first item safely
    setTimeout(() => {
        const first = document.querySelector('.file-item');
        if (first) first.focus();
    }, 100);
    
    updateFooter('Select', storedFiles.length > 0 ? 'Play' : '', 'Back');
}

function updateFooter(l, c, r) {
    const footers = document.querySelectorAll('.footerelement');
    if (footers.length >= 3) {
        footers[0].innerHTML = l ? `<span class="opacity-75 font-normal pr-1 text-cm-blue-05a">☰</span>${l}` : '';
        footers[1].textContent = c;
        footers[2].innerHTML = r ? `${r}<span class="opacity-75 font-normal pl-1 text-cm-green-00a">&lt;</span>` : '';
    }
}

// ---------- NES ENGINE HANDLERS ---------- //

function playROM(filepath, fileObj = null) {
    isPlaying = true;
    const app = document.getElementById('app') || document.body;
    
    // Inject Canvas Canvas Wrapper
    app.innerHTML = '<div class="flex-1 flex items-center justify-center bg-black w-full h-full absolute inset-0 z-50"><canvas id="canvas" width="256" height="224" class="max-w-full max-h-full object-contain"></canvas></div>';
    updateFooter('', '', 'Exit');
    
    if (fileObj) {
        read_local_file(fileObj, nes_rom_change);
    } else {
        read_url(filepath, nes_rom_change);
    }
}

function nes_pause() { if (typeof nes !== 'undefined' && nes.Pause) nes.Pause(); }
function nes_start() { if (typeof nes !== 'undefined' && nes.Start) nes.Start(); }
function nes_reset() { if (typeof nes !== 'undefined' && nes.Reset) nes.Reset(); }

function nes_rom_change(arraybuffer) {
    nes_pause();
    if (typeof nes === 'undefined') {
        alert("NES engine not initialized");
        renderStoredFilesMenu();
        return;
    }
    if (!nes.SetRom(arraybuffer)) {
        alert("Invalid ROM data format.");
        renderStoredFilesMenu();
        return;
    }
    if (nes.Init()) nes_start();
}

// Read directly from HTML5 File Picker
function read_local_file(fileObj, cb) {
    const reader = new FileReader();
    reader.onload = e => cb(e.target.result);
    reader.readAsArrayBuffer(fileObj);
}

// Fetch stored ROM path via KaiOS Native sdcard API
function read_url(url, cb) {
    if (navigator.getDeviceStorages) {
        const sdcard = navigator.getDeviceStorages("sdcard")[0];
        const request = sdcard.get(url);
        
        request.onsuccess = function() {
            const reader = new FileReader();
            reader.onload = function() { cb(reader.result); };
            reader.readAsArrayBuffer(this.result);
        };
        request.onerror = function() {
            alert('File not found in storage: ' + url.split('/').pop());
            // Remove from array if file was deleted externally
            storedFiles = storedFiles.filter(f => f !== url);
            localStorage.setItem('storedROMs', JSON.stringify(storedFiles));
            renderStoredFilesMenu();
        };
    } else {
        alert("Device Storage API not supported here.");
        renderStoredFilesMenu();
    }
}

// ---------- INITIALIZATION ---------- //

window.addEventListener('load', initUI);

// KaiAds Native Integration Preserved
document.addEventListener('DOMContentLoaded', () => {
    if (typeof getKaiAd !== 'undefined') {
        getKaiAd({
            publisher: '080b82ab-b33a-4763-a498-50f464567e49',
            app: 'nes_emul',
            slot: 'nes_emul',
            onerror: err => console.error('KaiAds Error:', err),
            onready: ad => ad.call('display')
        });
    }
});