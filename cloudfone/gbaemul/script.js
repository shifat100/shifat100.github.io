/* Fixed script.js for Cloud Phone Widget with QQVGA Resize Support */
function simulateClick(element) {
  if (!element) return;

  // 1. Dispatch KeyDown
  const keyDown = new KeyboardEvent('keydown', {
    key: 'Enter',
    code: 'Enter',
    keyCode: 13,
    bubbles: true,
    cancelable: true
  });
  element.dispatchEvent(keyDown);

  // 2. Random Delay between 70ms and 120ms
  const delay = Math.floor(Math.random() * (120 - 70 + 1)) + 70;

  // 3. Dispatch KeyUp and Click after delay
  setTimeout(() => {
    const keyUp = new KeyboardEvent('keyup', {
      key: 'Enter',
      code: 'Enter',
      keyCode: 13,
      bubbles: true,
      cancelable: true
    });
    element.dispatchEvent(keyUp);

    // Finalize the action
    element.click();
  }, delay);
}

// === UI REFERENCES ===
const elements = {
  header: document.getElementById('header-title'),
  status: document.getElementById('status-message'),
  romList: document.getElementById('rom-list-container'),
  fileInput: document.getElementById('rom_load_from_device'),
  canvas: document.getElementById('emulator_target')
};

// === NAVIGATION MANAGER ===
function showView(viewName) {
  // Hide all views
  document.querySelectorAll('.view-section').forEach(el => el.classList.add('hidden'));

  // Show target view
  const target = document.getElementById('view-' + viewName);
  if (target) {
    target.classList.remove('hidden');

    // Handle Focus
    if (viewName !== 'emulator') {
      const firstItem = target.querySelector('[tabindex="0"]');
      if (firstItem) {
        // Small delay ensures DOM is visible before focus
        setTimeout(() => firstItem.focus(), 50);
      }
    } else {
      // Return focus to canvas for gameplay
      elements.canvas.focus();
    }
  }
}

function resumeEmulator() {
  showView('emulator');
  if (window.IodineGUI && window.IodineGUI.Iodine) {
    window.IodineGUI.Iodine.play();
  }
}

// === SAFE IODINE WRAPPERS ===

function waitForIodine(callback) {
  if (window.IodineGUI && window.IodineGUI.Iodine) {
    callback();
  } else {
    console.log("Iodine Core not ready... waiting.");
    setTimeout(() => waitForIodine(callback), 200);
  }
}

function attachBIOS(BIOS) {
  waitForIodine(() => {
    try {
      IodineGUI.Iodine.attachBIOS(new Uint8Array(BIOS));
      console.log("BIOS Attached Successfully");
    } catch (e) {
      console.warn("BIOS Attach Error (non-fatal):", e);
    }
  });
}

function attachROM(ROM, name) {
  waitForIodine(() => {
    try {
      IodineGUI.Iodine.attachROM(new Uint8Array(ROM));

      // Success UI updates
      elements.header.textContent = name || "Game Running";
      elements.status.textContent = "Running: " + name;

      // Auto Start
      setTimeout(() => {
        IodineGUI.Iodine.play();
        showView('emulator');
      }, 100);

    } catch (e) {
      elements.status.textContent = "Invalid ROM File";
      console.error("ROM Attach Error:", e);
    }
  });
}

// === FILE LOADING LOGIC ===

function loadRomFromBlob(fileBlob, fileName) {
  if (!fileBlob) return;

  elements.status.textContent = "Loading " + fileName + "...";

  const reader = new FileReader();
  reader.onloadend = function () {
    attachROM(this.result, fileName);
  };
  reader.readAsArrayBuffer(fileBlob);
}

function loadRomFromUrl(url, name) {
  elements.status.textContent = "Downloading...";
  showView('emulator');

  const xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.responseType = 'arraybuffer';
  xhr.onload = function () {
    if (xhr.status === 200) {
      loadRomFromBlob(new Blob([xhr.response]), name);
    } else {
      elements.status.textContent = "Download Failed";
    }
  };
  xhr.onerror = function () { elements.status.textContent = "Network Error"; };
  xhr.send();
}

function fetchRomList() {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', 'roms.json', true);
  xhr.responseType = 'json';
  xhr.onload = function () {
    if (xhr.status === 200) {
      const roms = xhr.response;
      elements.romList.innerHTML = '';

      if (roms && roms.length > 0) {
        roms.forEach(rom => {
          const div = document.createElement('div');
          div.className = 'nav-item flex items-center px-2 py-1 rounded focus:bg-cm-focus focus:font-bold border-b border-gray-800 cursor-pointer';
          div.tabIndex = 0;
          div.innerHTML = `<span class="text-[11px] cm-qvga:text-[16px] truncate">${rom.name}</span>`;
          div.addEventListener('click', () => loadRomFromUrl(rom.url, rom.name));
          elements.romList.appendChild(div);
        });
      } else {
        elements.romList.innerHTML = '<div class="px-2 text-gray-500">No ROMs in json</div>';
      }
    }
  };
  xhr.onerror = function () { elements.romList.innerHTML = '<div class="px-2 text-red-500">Failed to load list</div>'; };
  xhr.send();
}

// === INPUT HANDLING (D-PAD & SOFT KEYS) ===

document.addEventListener('keydown', function (e) {
  const activeEl = document.activeElement;

  let currentView = 'emulator';
  document.querySelectorAll('.view-section').forEach(el => {
    if (!el.classList.contains('hidden')) currentView = el.id.replace('view-', '');
  });

  // SOFT LEFT (Menu / Select)
  if (e.key === 'SoftLeft' || e.key === 'F1') {
    e.preventDefault();
    if (currentView === 'emulator') {
      showView('menu');
    } else if (currentView === 'settings') {
      const cb = activeEl.querySelector('input[type="checkbox"]');
      if (cb) cb.click();
    } else if (currentView === 'help') {
      showView('menu');
    } else {
      activeEl.click();
    }
  }

  // SOFT RIGHT (Back)
  if (e.key === 'SoftRight' || e.key === 'F2' || e.key === 'Backspace') {
    e.preventDefault();
    if (currentView !== 'emulator') {
      if (currentView === 'menu') showView('emulator');
      else showView('menu');
    }
  }

  // ENTER
  if (e.key === 'Enter') {
    if (currentView !== 'emulator') {
      e.preventDefault();
      activeEl.click();
      const cb = activeEl.querySelector('input[type="checkbox"]');
      if (cb) cb.click();
    }
  }

  // ARROWS (Focus)
  if (['ArrowUp', 'ArrowDown'].includes(e.key) && currentView !== 'emulator') {
    e.preventDefault();
    const focusables = Array.from(document.querySelectorAll(`#view-${currentView} [tabindex="0"]`));
    const index = focusables.indexOf(activeEl);
    let nextIndex = index;
    if (e.key === 'ArrowDown') nextIndex = Math.min(index + 1, focusables.length - 1);
    if (e.key === 'ArrowUp') nextIndex = Math.max(index - 1, 0);
    if (focusables[nextIndex]) focusables[nextIndex].focus();
  }
});

// === INITIALIZATION ===
window.addEventListener('load', function () {

  // --- NEW: RESIZE CANVAS FOR 128x160 SCREENS ---
  // This forces the canvas to fit the narrow width while maintaining GBA aspect ratio
  if (window.innerWidth <= 130) {
    elements.canvas.style.cssText = "width: 128px !important; height: 85px !important; object-fit: contain;";
  }

  // 1. Initialize BIOS
  const biosReq = new XMLHttpRequest();
  biosReq.open('GET', 'gba_bios.bin', true);
  biosReq.responseType = 'arraybuffer';
  biosReq.onload = function () {
    if (this.status === 200) attachBIOS(this.response);
  };
  biosReq.send();

  // 2. Setup File Input
  if (elements.fileInput) {
    elements.fileInput.addEventListener('change', function (e) {
      if (e.target.files.length > 0) {
        loadRomFromBlob(e.target.files[0], e.target.files[0].name);
      }
    });
  }

  // 3. Load ROM List & Start
  fetchRomList();
  showView('menu');
});

window.addEventListener('back', (event) => {
  event.preventDefault();
  simulateClick('SoftRight');
});