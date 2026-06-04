// exact_engine.js থেকে গ্লোবাল অবজেক্ট রেফারেন্স গ্রহণ করা হচ্ছে
var ExactLoader = window.ExactLoader;
var FPMath = window.FPMath;
var Physics = window.Physics;

var canvas = document.querySelector("#game");
var ctx = canvas.getContext("2d");
var leagueSelect = document.querySelector("#league");
var trackSelect = document.querySelector("#track");
var restartButton = document.querySelector("#restart");
var pauseButton = document.querySelector("#pause");

var FP = 0x10000;
var BASE_VIEW_WIDTH = 650;
var BASE_VIEW_HEIGHT = 602;
var MOBILE_LEAN_FULL = 24;
var START_FLAG_SEQUENCE = [2, 0, 1, 0];
var FINISH_FLAG_SEQUENCE = [1, 0, 2, 0];
var SITE_LANGUAGE_KEY = "gdSiteLanguage";
var LANGUAGES = ["ukr", "rus", "eng"];

var I18N = {
  eng: {
    languageName: "ENG",
    on: "On",
    off: "Off",
    degrees: "deg",
    locked: "Locked",
    loadingDaily: "Loading Track of the Day",
    cannotLoadDaily: "Cannot load Track of the Day",
    completeMore: "Complete more tracks to unlock",
    highscoresCleared: "Highscores have been cleared",
    crashed: "Crashed",
    finished: "Finished",
    wheelie: "Wheelie!",
    firstPlace: "First place!",
    secondPlace: "Second place!",
    thirdPlace: "Third place!",
    newHighscore: "New Highscore",
    time: "Time",
    online: "Online",
    dailyTrack: "Track of the Day",
    newBikeAvailable: "New bike available",
    newLevelAvailable: "New level available",
    menus: {
      start: "Start>",
      level: "Level",
      track: "Track",
      league: "League",
      highscores: "Highscores>",
      highscoresTitle: "Highscores",
      mainMenu: "Main Menu>",
      mainMenuLower: "Main menu>",
      site: "Website>",
      options: "Options>",
      help: "Help>",
      back: "Back>",
      no: "No>",
      yes: "Yes>",
      fullReset: "Full Reset>",
      continue: "Continue>",
      restart: "Restart>",
      next: "Next>",
      playMenu: "Gravity Classic>",
      exit: "Exit>",
      ok: "Ok>",
      objective: "Objective>",
      keys: "Keys>",
      unlocking: "Unlocking>",
      highScores: "High Scores>",
      confirmClear: "Confirm Clear",
      confirmReset: "Confirm Reset",
      clearConfirmText: "Clearing the highscores cannot be undone. It will remove all registered times on all tracks.",
      clearConfirmQuestion: "Would you like to clear the highscores?",
      resetConfirmText: "A full reset cannot be undone. It will relock all tracks and leagues and clear all settings to default.",
      resetConfirmQuestion: "Would you like to do a full reset?",
      perspective: "Perspective",
      shadows: "Shadows",
      driverSprite: "Driver Sprite",
      bikeSprite: "Bike Sprite",
      tiltDeadzone: "Tilt Deadzone",
      vibrateOnTouch: "Vibrate on touch",
      language: "Language",
      clearHighscore: "Clear Highscore>",
    },
    help: {
      objective: {
        title: "Objective",
        text: "Reach the finish as fast as possible without crashing. Accelerate, brake, and lean the rider to control bike rotation in the air. Land on the wheels and keep the rider away from the track.",
      },
      keys: {
        title: "Controls",
        text: "Desktop controls: Up accelerates, Down brakes, Left and Right lean. W, A, S, D and the classic numeric keyset also work. Space restarts. Escape opens the pause menu. On a phone, the right half of the screen is throttle, the left half is brake, and bike lean comes from the accelerometer.",
      },
      unlocking: {
        title: "Unlocking",
        text: "Complete standard tracks to unlock harder levels and stronger bike leagues. Track of the Day uses the configured daily bike and does not change standard campaign progress.",
      },
      highscore: {
        title: "High Scores",
        text: "The three best times are saved for each standard track and bike league. Daily track scores are stored separately for the current day.",
      },
      options: {
        title: "Options",
        text: "Perspective and Shadows change track rendering. Driver Sprite and Bike Sprite toggle the original graphics. Tilt Deadzone adjusts how much phone tilt is ignored before the rider leans. Language changes all game text.",
      },
    },
  },
  rus: {
    languageName: "РУС",
    on: "Вкл",
    off: "Выкл",
    degrees: "град",
    locked: "Закрыто",
    loadingDaily: "Загрузка трассы дня",
    cannotLoadDaily: "Не удалось загрузить трассу дня",
    completeMore: "Пройди больше трасс, чтобы открыть",
    highscoresCleared: "Рекорды очищены",
    crashed: "Разбился",
    finished: "Финиш",
    wheelie: "На заднем!",
    firstPlace: "Первое место!",
    secondPlace: "Второе место!",
    thirdPlace: "Третье место!",
    newHighscore: "Новый рекорд",
    time: "Время",
    dailyTrack: "Трасса дня",
    newBikeAvailable: "Доступен новый байк",
    newLevelAvailable: "Доступен новый уровень",
    menus: {
      start: "Старт>",
      level: "Уровень",
      track: "Трасса",
      league: "Лига",
      highscores: "Рекорды>",
      highscoresTitle: "Рекорды",
      mainMenu: "Главное меню>",
      mainMenuLower: "Главное меню>",
      site: "Сайт>",
      options: "Настройки>",
      help: "Помощь>",
      back: "Назад>",
      no: "Нет>",
      yes: "Да>",
      fullReset: "Полный сброс>",
      continue: "Продолжить>",
      restart: "Рестарт>",
      next: "Дальше>",
      playMenu: "Gravity Classic>",
      exit: "Выход>",
      ok: "Ок>",
      objective: "Цель>",
      keys: "Управление>",
      unlocking: "Открытие>",
      highScores: "Рекорды>",
      confirmClear: "Очистить рекорды",
      confirmReset: "Полный сброс",
      clearConfirmText: "Очистку рекордов нельзя отменить. Будут удалены все времена на всех трассах.",
      clearConfirmQuestion: "Очистить рекорды?",
      resetConfirmText: "Полный сброс нельзя отменить. Все трассы и лиги снова закроются, настройки вернутся к стандартным.",
      resetConfirmQuestion: "Сделать полный сброс?",
      perspective: "Перспектива",
      shadows: "Тени",
      driverSprite: "Спрайт пилота",
      bikeSprite: "Спрайт мота",
      tiltDeadzone: "Мертвая зона",
      vibrateOnTouch: "Вибрация",
      language: "Язык",
      clearHighscore: "Очистить рекорды>",
    },
    help: {
      objective: {
        title: "Цель",
        text: "Доехать до финиша как можно быстрее и не разбиться. Газуй, тормози и наклоняй пилота, чтобы управлять вращением мота в воздухе. Приземляйся на колеса и не ударяй пилота о трассу.",
      },
      keys: {
        title: "Управление",
        text: "На ПК: стрелка вверх - газ, вниз - тормоз, влево и вправо - наклон. Также работают W, A, S, D и классический цифровой набор. Пробел перезапускает трассу. Escape открывает паузу. На телефоне правая половина экрана - газ, левая - тормоз, а наклон мота идет от акселерометра.",
      },
      unlocking: {
        title: "Открытие",
        text: "Проходи стандартные трассы, чтобы открывать более сложные уровни и мощные лиги мотоцикла. Трасса дня использует отдельный выбранный байк и не меняет прогресс стандартной кампании.",
      },
      highscore: {
        title: "Рекорды",
        text: "Три лучших времени сохраняются отдельно для каждой стандартной трассы и лиги мотоцикла. Рекорды трассы дня сохраняются отдельно для текущего дня.",
      },
      options: {
        title: "Настройки",
        text: "Перспектива и тени меняют отрисовку трассы. Спрайты пилота и мота включают оригинальную графику. Мертвая зона задает, какой наклон телефона игнорируется до начала наклона пилота. Язык меняет весь текст игры.",
      },
    },
  },
  ukr: {
    languageName: "УКР",
    on: "Увімк",
    off: "Вимк",
    degrees: "град",
    locked: "Закрито",
    loadingDaily: "Завантаження траси дня",
    cannotLoadDaily: "Не вдалося завантажити трасу дня",
    completeMore: "Пройди більше трас, щоб відкрити",
    highscoresCleared: "Рекорди очищено",
    crashed: "Розбився",
    finished: "Фініш",
    wheelie: "На задньому!",
    firstPlace: "Перше місце!",
    secondPlace: "Друге місце!",
    thirdPlace: "Третє місце!",
    newHighscore: "Новий рекорд",
    time: "Час",
    dailyTrack: "Траса дня",
    newBikeAvailable: "Доступний новий байк",
    newLevelAvailable: "Доступний новий рівень",
    menus: {
      start: "Старт>",
      level: "Рівень",
      track: "Траса",
      league: "Ліга",
      highscores: "Рекорди>",
      highscoresTitle: "Рекорди",
      mainMenu: "Головне меню>",
      mainMenuLower: "Головне меню>",
      site: "Сайт>",
      options: "Налаштування>",
      help: "Допомога>",
      back: "Назад>",
      no: "Ні>",
      yes: "Так>",
      fullReset: "Повний скид>",
      continue: "Продовжити>",
      restart: "Рестарт>",
      next: "Далі>",
      playMenu: "Gravity Classic>",
      exit: "Вихід>",
      ok: "Ок>",
      objective: "Мета>",
      keys: "Керування>",
      unlocking: "Відкриття>",
      highScores: "Рекорди>",
      confirmClear: "Очистити рекорди",
      confirmReset: "Повний скид",
      clearConfirmText: "Очищення рекордів не можна скасувати. Будуть видалені всі часи на всіх трасах.",
      clearConfirmQuestion: "Очистити рекорди?",
      resetConfirmText: "Повний скид не можна скасувати. Усі траси й ліги знову закриються, налаштування повернуться до стандартних.",
      resetConfirmQuestion: "Зробити повний скид?",
      perspective: "Перспектива",
      shadows: "Тіні",
      driverSprite: "Спрайт пілота",
      bikeSprite: "Спрайт мота",
      tiltDeadzone: "Мертвая зона",
      vibrateOnTouch: "Вибрация",
      language: "Мова",
      clearHighscore: "Очистити рекорди>",
    },
    help: {
      objective: {
        title: "Мета",
        text: "Доїхати до фінішу якомога швидше і не розбитися. Газуй, гальмуй і нахиляй пілота, щоб керувати обертанням мота в повітрі. Приземляйся на колеса і не бий пілота об трасу.",
      },
      keys: {
        title: "Керування",
        text: "На ПК: стрілка вгору - газ, вниз - гальмо, вліво і вправо - наклон. Також працюють W, A, S, D і класичний цифровий набір. Пробіл перезапускає трасу. Escape відкриває паузу. На телефоні права половина екрана - газ, ліва - гальмо, а нахил мота йде від акселерометра.",
      },
      unlocking: {
        title: "Відкриття",
        text: "Проходь стандартні траси, щоб відкривати складніші рівні та потужні ліги мотоциклів. Траса дня використовує окремо вибраний байк і не змінює прогрес стандартної кампанії.",
      },
      highscore: {
        title: "Рекорди",
        text: "Три найкращі часи зберігаються окремо для кожної стандартної траси й ліги мотоцикла. Рекорди траси дня зберігаються окремо для поточного дня.",
      },
      options: {
        title: "Налаштування",
        text: "Перспектива і тіні змінюють відмальовку траси. Спрайти пілота і мота вмикають оригінальну графіку. Мертва зона задає, який нахил телефона ігнорується до початку нахилу пілота. Мова змінює весь текст гри.",
      },
    },
  },
};

var RIDER_POSES = {
  normal: [
    [0x2cccc, -39321],
    [0x40000, -0x20000],
    [0x60000, -0x10000],
    [0x70000, -39321],
    [0x48000, 6553],
    [16384, -0x23333],
    [13107, -0x13333],
    [0x46666, 0x14ccc],
  ],
  normalBack: [
    [0x2e666, -0x16666],
    [0x3e666, -0x39999],
    [0x51999, -0x1c000],
    [0x60000, -42598],
    [0x49999, 6553],
    [0x10000, -0x13333],
    [13107, -0x13333],
    [0x46666, 0x14ccc],
  ],
  normalForward: [
    [0x26666, 13107],
    [0x48000, -13107],
    [0x59999, 0x19999],
    [0x63333, 0x2b333],
    [0x54ccc, 0x11999],
    [39321, -0x18000],
    [13107, -52428],
    [0x46666, 0x14ccc],
  ],
  trick: [
    [0x2cccc, -52428],
    [0x40000, -0x28000],
    [0x63333, -0x10000],
    [0x6cccc, -39321],
    [0x39999, 39321],
    [16384, -0x23333],
    [13107, -0x13333],
    [0x46666, 0x14000],
  ],
  trickBack: [
    [0x2e666, -0x1b333],
    [0x4b333, -0x39999],
    [0x51999, -0x1c000],
    [0x60000, -58982],
    [0x40000, 0x18000],
    [0x10000, -0x1e666],
    [13107, -0x13333],
    [0x46666, 0x14000],
  ],
  trickForward: [
    [0x26666, 13107],
    [0x48000, -13107],
    [0x59999, 0x16666],
    [0x63333, 0x2e666],
    [0x54ccc, 0x11999],
    [39321, -0x18000],
    [13107, -52428],
    [0x48000, 0x14000],
  ],
  weights: [45875, 32768, 52428],
};

var assets = null;
var localLevelData = null; // levels.json ডেটা সংরক্ষণ করার ভেরিয়েবল

// Local Storage নিরাপদে ব্যবহারের জন্য হেল্পার ফাংশনসমূহ
function safeStorageGet(key) {
  try {
    return localStorage.getItem(key);
  } catch (e) {
    return null;
  }
}

function safeStorageSet(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch (e) {}
}

function safeStorageRemove(key) {
  try {
    localStorage.removeItem(key);
  } catch (e) {}
}

// অবজেক্ট এক্সটেন্ড করার জন্য ES5 হেল্পার
function extend(target, source) {
  if (source && typeof source === "object") {
    for (var key in source) {
      if (source.hasOwnProperty(key)) {
        target[key] = source[key];
      }
    }
  }
  return target;
}

// Number.isFinite এর ES5 বিকল্প
function isFiniteNumber(val) {
  return typeof val === "number" && isFinite(val);
}

// Promise.allSettled এর ES5 বিকল্প
function safeAllSettled(promises) {
  var wrapped = [];
  for (var i = 0; i < promises.length; i++) {
    wrapped.push(promises[i].then(
      function(val) { return { status: "fulfilled", value: val }; },
      function(err) { return { status: "rejected", reason: err }; }
    ));
  }
  return Promise.all(wrapped);
}

// সেটিংস লোড ও সেভ লজিক
function defaultSettings() {
  return {
    perspective: true,
    shadows: true,
    driverSprite: true,
    bikeSprite: true,
    input: 0,
    vibrateOnTouch: true,
    tiltDeadzone: 6,
  };
}

function normalizeSettings(saved) {
  var settings = extend(defaultSettings(), saved && typeof saved === "object" ? saved : {});
  settings.tiltDeadzone = clamp(Number(settings.tiltDeadzone), 0, 20);
  settings.input = 0;
  return settings;
}

function loadSettings() {
  var saved = safeStorageGet("gdSettings");
  return normalizeSettings(saved ? JSON.parse(saved) : null);
}

function saveSettings() {
  safeStorageSet("gdSettings", JSON.stringify(state.settings));
}

// প্রগ্রেস লোড ও সেভ লজিক
function defaultProgress() {
  return {
    unlocked: [0, 0, -1],
    unlockedLevels: 1,
    unlockedLeagues: 0,
    selectedLevel: 0,
    selectedTrack: 0,
    selectedLeague: 0,
  };
}

function normalizeProgress(saved) {
  var defaults = defaultProgress();
  try {
    var progress = extend(defaults, saved && typeof saved === "object" ? saved : {});
    progress.unlocked = defaults.unlocked.map(function(value, index) {
      var progVal = (progress.unlocked ? progress.unlocked[index] : undefined);
      return isFiniteNumber(progVal) ? progVal : value;
    });
    progress.unlockedLevels = clamp(Number(progress.unlockedLevels), 0, 2);
    progress.unlockedLeagues = clamp(Number(progress.unlockedLeagues), 0, 3);
    progress.selectedLevel = clamp(Number(progress.selectedLevel), 0, progress.unlockedLevels);
    progress.selectedTrack = Math.max(0, Math.floor(Number(progress.selectedTrack) || 0));
    progress.selectedLeague = clamp(Number(progress.selectedLeague), 0, progress.unlockedLeagues);
    return progress;
  } catch (e) {
    return defaults;
  }
}

function loadProgress() {
  var saved = safeStorageGet("gdProgress");
  return normalizeProgress(saved ? JSON.parse(saved) : null);
}

function saveProgress() {
  safeStorageSet("gdProgress", JSON.stringify(state.progress));
}

// প্লেয়ারের নাম ও স্কোরের ডেটা স্টোরেজ লোড ও সেভ
function loadPlayerName() {
  var saved = safeStorageGet("gdPlayerName");
  return normalizeName(saved || "AAA").split("");
}

function savePlayerName() {
  safeStorageSet("gdPlayerName", state.playerName.join(""));
}

function loadScores() {
  var saved = safeStorageGet("gdScores");
  return saved ? JSON.parse(saved) : {};
}

function loadBestTimes() {
  var saved = safeStorageGet("gdBestTimes");
  return saved ? JSON.parse(saved) : {};
}

// গেম স্টেট অবজেক্ট (সার্ভার/অনলাইন প্যারামিটার বাদ দিয়ে পরিমার্জিত)
var state = {
  manifest: null,
  level: null,
  loader: null,
  phys: null,
  dailyTrack: false,
  dailyBikeLeague: 3,
  dailyBikeLeagueConfigured: false,
  view: { x: 0, y: 0, zoom: 1 },
  keys: {}, 
  heldRawKeys: {}, 
  keyRefCounts: {}, 
  touchThrottlePointers: {}, 
  orientation: {
    supported: false,
    permissionAsked: false,
    axisValue: 0,
    lean: 0,
    source: "",
    posture: "",
    lastEventAt: 0,
    motionLastEventAt: 0,
    orientationLastEventAt: 0,
    permissionState: "unknown",
  },
  running: true,
  crashed: false,
  crashTime: 0,
  finished: false,
  finishPending: false,
  finishMenuAt: 0,
  finishTimeValue: 0,
  unlockMenuAt: 0,
  pendingUnlock: null,
  message: "",
  levelTitle: "",
  levelTitleUntil: 0,
  settings: loadSettings(),
  progress: loadProgress(),
  bikeLeague: 0,
  startTime: 0,
  elapsed: 0,
  timerStarted: false,
  lastFrame: performance.now(),
  accumulator: 0,
  flagFrame: 0,
  menuShown: true,
  menuScreen: "main",
  menuIndex: 0,
  menuScroll: 0,
  menuPointer: null,
  menuRowStep: 28,
  optionsBackScreen: "main",
  lastResult: null,
  playerName: loadPlayerName(),
  nameCursor: 0,
  pendingFinish: null,
  helpTopic: "objective",
  menuLayout: [],
  bootStart: performance.now(),
  bootDuration: 2200,
  dailyTrackLoading: false,
  scores: loadScores(),      
  bestTimes: loadBestTimes(), 
  dailyScores: [],
  dailyScoresLoaded: false,
  standardScoreLoadedKeys: {}, 
  standardScoreLoadingKeys: {}, 
};

// গেম এসেট লোডার
loadAssets({
  wheel1: "/assets/wheel1.png",
  wheel2: "/assets/wheel2.png",
  body: "/assets/body.png",
  arm: "/assets/arm.png",
  leg: "/assets/leg.png",
  helmet: "/assets/helmet.png",
  engine: "/assets/engine.png",
  fender: "/assets/fender.png",
  steering: "/assets/steering.png",
  codebrew: "/assets/codebrew.png",
  logo: "/assets/logo.png",
  start0: "/assets/start0.png",
  start1: "/assets/start1.png",
  start2: "/assets/start2.png",
  finish0: "/assets/finish0.png",
  finish1: "/assets/finish1.png",
  finish2: "/assets/finish2.png",
}).then(function(loadedAssets) {
  assets = loadedAssets;
  init();
});

// levels.json থেকে সম্পূর্ণ ডেটা লোড করার ফাংশন
function loadLocalLevelsFile() {
  return fetch("levels.json")
    .then(function(response) {
      if (!response.ok) {
        throw new Error("Could not load levels.json. Please ensure the file is in the root directory.");
      }
      return response.json();
    })
    .then(function(json) {
      localLevelData = json;
      state.manifest = json.manifest;
    });
}

function init() {
  updateViewportSize();
  resize();
  window.addEventListener("resize", resize);
  if (window.visualViewport) {
    window.visualViewport.addEventListener("resize", updateViewportSize);
    window.visualViewport.addEventListener("scroll", updateViewportSize);
  }
  
  loadLocalLevelsFile()
    .then(function() {
      bindInput();
      bindMobileTilt();
      var params = new URLSearchParams(location.search);
      var requestedLeague = params.has("league") ? Number(params.get("league")) : state.progress.selectedLevel;
      var initialLeague = clamp(requestedLeague, 0, state.manifest.leagues.length - 1);
      var leagueId = clamp(initialLeague, 0, state.progress.unlockedLevels);
      state.bikeLeague = clamp(state.progress.selectedLeague !== undefined && state.progress.selectedLeague !== null ? state.progress.selectedLeague : 0, 0, state.progress.unlockedLeagues);
      fillTracks(leagueId);
      var maxTrack = unlockedTrackLimit(leagueId);
      var requestedTrack = params.has("track") ? Number(params.get("track")) : state.progress.selectedTrack;
      var initialTrack = clamp(requestedTrack, 0, maxTrack);
      leagueSelect.value = String(leagueId);
      trackSelect.value = String(initialTrack);
      state.progress.selectedLevel = leagueId;
      state.progress.selectedTrack = initialTrack;
      state.progress.selectedLeague = state.bikeLeague;
      saveProgress();
      
      if (params.get("daily") === "1") {
        return loadLevel(leagueId, initialTrack).then(function() {
          openMenu("daily");
        });
      } else {
        return loadLevel(leagueId, initialTrack).then(function() {
          if (params.get("menu") === "play") openMenu("play");
        });
      }
    })
    .then(function() {
      requestAnimationFrame(loop);
    })
    .catch(function(err) {
      console.error("Initialization failed:", err);
      state.message = "Failed to load levels.json!";
      draw();
    });
}

function updateViewportSize() {
  var viewportHeight = (window.visualViewport && window.visualViewport.height) || window.innerHeight;
  document.documentElement.style.setProperty("--app-height", Math.max(1, Math.floor(viewportHeight)) + "px");
  resize();
}

function loadManifest() {
  // ম্যানিফেস্ট এখন loadLocalLevelsFile() এর মাধ্যমে আগে থেকেই লোড করা থাকে
  leagueSelect.innerHTML = "";
  for (var i = 0; i < state.manifest.leagues.length; i++) {
    var league = state.manifest.leagues[i];
    var option = new Option(league.name, league.id);
    leagueSelect.add(option);
  }
  leagueSelect.addEventListener("change", function() {
    var leagueId = clamp(Number(leagueSelect.value), 0, state.progress.unlockedLevels);
    leagueSelect.value = String(leagueId);
    fillTracks(leagueId);
    var trackId = clamp(Number(trackSelect.value), 0, unlockedTrackLimit(leagueId));
    trackSelect.value = String(trackId);
    rememberSelection();
    loadLevel(leagueId, trackId);
  });
  trackSelect.addEventListener("change", function() {
    var leagueId = Number(leagueSelect.value);
    var trackId = clamp(Number(trackSelect.value), 0, unlockedTrackLimit(leagueId));
    trackSelect.value = String(trackId);
    rememberSelection();
    loadLevel(leagueId, trackId);
  });
  restartButton.addEventListener("click", function() {
    restartCurrentTrack();
  });
  pauseButton.addEventListener("pointerdown", function(event) {
    event.preventDefault();
    event.stopPropagation();
  });
  pauseButton.addEventListener("click", function(event) {
    event.preventDefault();
    event.stopPropagation();
    clearTouchThrottle(function(key) {
      delete state.keys[key];
    });
    openMenu("ingame");
  });
  fillTracks(0);
}

function fillTracks(leagueId) {
  var league = state.manifest.leagues[leagueId];
  trackSelect.innerHTML = "";
  for (var i = 0; i < league.tracks.length; i++) {
    var track = league.tracks[i];
    var option = new Option(track.name, track.id);
    trackSelect.add(option);
  }
}

function clamp(value, min, max) {
  if (!isFiniteNumber(value)) return min;
  return Math.max(min, Math.min(max, value));
}

function languageCode() {
  var siteLanguage = safeStorageGet(SITE_LANGUAGE_KEY);
  if (LANGUAGES.indexOf(siteLanguage) !== -1) return siteLanguage;
  return defaultLanguage();
}

function defaultLanguage() {
  var siteLanguage = safeStorageGet(SITE_LANGUAGE_KEY);
  if (LANGUAGES.indexOf(siteLanguage) !== -1) return siteLanguage;
  var browserLanguage = (navigator.language || "").toLowerCase();
  if (browserLanguage.indexOf("uk") === 0) return "ukr";
  if (browserLanguage.indexOf("ru") === 0) return "rus";
  return "eng";
}

function t(key) {
  if (key === "online" && languageCode() !== "eng") return "\u041e\u043d\u043b\u0430\u0439\u043d";
  var val = (I18N[languageCode()] ? I18N[languageCode()][key] : undefined);
  if (val === undefined || val === null) val = I18N.eng[key];
  if (val === undefined || val === null) val = key;
  return val;
}

function menuT(key) {
  var langObj = I18N[languageCode()];
  var val = (langObj && langObj.menus ? langObj.menus[key] : undefined);
  if (val === undefined || val === null) val = I18N.eng.menus[key];
  if (val === undefined || val === null) val = key;
  return val;
}

function helpTopics() {
  var langObj = I18N[languageCode()];
  return (langObj && langObj.help ? langObj.help : I18N.eng.help);
}

// লোকাল levels.json থেকে নির্দিষ্ট আইডি অনুযায়ী লেভেল ফিল্টার করার সিস্টেম
function loadLevel(leagueId, trackId) {
  return new Promise(function(resolve, reject) {
    var foundLevel = null;
    if (localLevelData && localLevelData.levels) {
      for (var i = 0; i < localLevelData.levels.length; i++) {
        var lvl = localLevelData.levels[i];
        if (lvl.leagueId === leagueId && lvl.trackId === trackId) {
          foundLevel = lvl;
          break;
        }
      }
    }
    if (!foundLevel) {
      reject(new Error("Level not found in local levels.json"));
      return;
    }
    state.level = foundLevel;
    state.dailyTrack = false;
    state.dailyScores = [];
    state.dailyScoresLoaded = false;
    resetBike();
    ensureStandardScores(state.bikeLeague, state.level);
    resolve();
  });
}

// levels.json ফাইল থেকে অফলাইনে Daily Track লোড
function fetchDailyTrack(options) {
  options = options || {};
  var silent = options.silent || false;
  var showMenu = options.showMenu !== undefined ? options.showMenu : true;
  
  var promise = Promise.resolve();
  if (!silent) {
    state.message = t("loadingDaily");
    state.dailyTrackLoading = true;
    if (showMenu) {
      state.menuShown = true;
      state.menuScreen = "main";
    }
    draw();
    promise = new Promise(function(resolve) {
      requestAnimationFrame(resolve);
    });
  }
  
  return promise.then(function() {
    if (localLevelData && localLevelData.dailyTrack) {
      state.level = localLevelData.dailyTrack;
      state.dailyTrack = true;
      state.dailyScores = [];
      state.dailyScoresLoaded = false;
      var dailySettings = state.level.settings || {};
      if (!state.dailyBikeLeagueConfigured) {
        var defaultBike = dailySettings.defaultBike !== undefined ? dailySettings.defaultBike : 4;
        state.dailyBikeLeague = clamp(Number(defaultBike) - 1, 0, 3);
      }
      state.dailyTrackLoading = false;
      return fetchDailyScores(state.dailyBikeLeague).then(function() {
        return true;
      });
    } else {
      if (!silent) state.message = t("cannotLoadDaily");
      state.dailyTrackLoading = false;
      return false;
    }
  });
}

function loadDailyTrack(options) {
  return fetchDailyTrack(options).then(function(loaded) {
    if (!loaded) return false;
    resetBike();
    return true;
  });
}

function startSelectedStandardTrack() {
  var leagueId = clamp(Number(leagueSelect.value), 0, state.progress.unlockedLevels);
  var trackId = clamp(Number(trackSelect.value), 0, unlockedTrackLimit(leagueId));
  leagueSelect.value = String(leagueId);
  trackSelect.value = String(trackId);
  rememberSelection();
  return loadLevel(leagueId, trackId);
}

function reloadDailyTrackAndReset() {
  if (!state.dailyTrack) {
    resetBike();
    return Promise.resolve();
  }
  if (state.dailyTrackLoading) return Promise.resolve();
  state.dailyTrackLoading = true;
  return fetchDailyTrack({ showMenu: false }).then(function(loaded) {
    if (loaded) resetBike();
  });
}

function refreshDailyTrackAfterFinish() {
  if (!state.dailyTrack || state.dailyTrackLoading) return Promise.resolve();
  state.dailyTrackLoading = true;
  return fetchDailyScores(activeBikeLeague()).then(function() {
    state.dailyTrackLoading = false;
  });
}

// লোকালস্টোরেজ থেকে অফলাইন ডেইলি স্কোর রিটার্ন
function fetchDailyScores(league) {
  if (league === undefined) league = activeBikeLeague();
  if (!state.dailyTrack) return Promise.resolve([]);
  var key = scoreKey(league, state.level);
  var offlineScores = state.scores[key] || [];
  state.dailyScores = offlineScores;
  state.dailyScoresLoaded = true;
  return Promise.resolve(offlineScores);
}

function ensureStandardScores(league, level) {
  if (league === undefined) league = state.bikeLeague;
  if (level === undefined) level = state.level;
  if (state.dailyTrack || !level || level.trackId === 9999) return;
  fetchStandardScores(league, level);
}

// অফলাইনে হাইস্কোর লোড লজিক
function fetchStandardScores(league, level) {
  if (league === undefined) league = state.bikeLeague;
  if (level === undefined) level = state.level;
  return Promise.resolve(getHighScores(league));
}

function restartCurrentTrack() {
  if (state.dailyTrack) reloadDailyTrackAndReset();
  else resetBike();
}

function resetBike() {
  state.loader = new ExactLoader(state.level);
  state.loader.perspectiveEnabled = state.settings.perspective;
  state.loader.shadowsEnabled = state.settings.shadows;
  state.phys = new Physics(state.loader);
  state.phys.setLeague(activeBikeLeague());
  applyRuntimeOptions();
  state.phys._caseIV(Math.min(canvas.width, canvas.height));
  state.running = true;
  state.crashed = false;
  state.crashTime = 0;
  state.finished = false;
  state.finishPending = false;
  state.finishMenuAt = 0;
  state.finishTimeValue = 0;
  state.unlockMenuAt = 0;
  state.pendingUnlock = null;
  state.message = "";
  if (state.dailyTrack) {
    state.levelTitle = "";
    state.levelTitleUntil = 0;
  } else {
    showStandardLevelTitle();
  }
  state.elapsed = 0;
  state.timerStarted = false;
  state.accumulator = 0;
  state.startTime = performance.now();
}

function showStandardLevelTitle() {
  var title = state.level ? state.level.name : "";
  state.levelTitle = title;
  state.levelTitleUntil = title ? performance.now() + 2500 : 0;
}

function bindInput() {
  var down = function(key) {
    state.keys[key] = true;
    if (state.level && !state.crashed && !state.finished) {
      state.running = true;
    }
  };
  var up = function(key) {
    delete state.keys[key];
  };

  window.addEventListener("keydown", function(event) {
    var mappedKeys = mapInputKeys(event.key);
    if (mappedKeys.length) {
      event.preventDefault();
      if (state.menuShown) {
        for (var i = 0; i < mappedKeys.length; i++) {
          if (handleMenuKey(mappedKeys[i])) return;
        }
        return;
      }
      if (mappedKeys.indexOf("Escape") !== -1) {
        openMenu("ingame");
      } else if (mappedKeys.indexOf(" ") !== -1) {
        restartCurrentTrack();
      } else {
        pressKeyboardControls(event.key, mappedKeys, down);
      }
    }
  });
  window.addEventListener("keyup", function(event) {
    releaseKeyboardControls(event.key, mapInputKeys(event.key), up);
  });
  window.addEventListener("blur", function() {
    state.heldRawKeys = {};
    state.keyRefCounts = {};
    clearTouchThrottle(up);
    state.keys = {};
  });
  canvas.addEventListener("pointerdown", function(event) {
    event.preventDefault();
    requestMobileTiltPermission();
    var rect = canvas.getBoundingClientRect();
    var x = ((event.clientX - rect.left) / rect.width) * canvas.width;
    var y = ((event.clientY - rect.top) / rect.height) * canvas.height;
    if (state.menuShown) {
      state.menuPointer = { id: event.pointerId, startX: x, startY: y, lastY: y, moved: false };
      try {
        canvas.setPointerCapture(event.pointerId);
      } catch (e) {}
      return;
    }
    handleTouchThrottleDown(event.pointerId, x, down);
    try {
      canvas.setPointerCapture(event.pointerId);
    } catch (e) {}
  });
  canvas.addEventListener("pointermove", function(event) {
    if (state.menuShown) {
      if (!state.menuPointer || state.menuPointer.id !== event.pointerId) return;
      event.preventDefault();
      var rect = canvas.getBoundingClientRect();
      var y = ((event.clientY - rect.top) / rect.height) * canvas.height;
      var dy = y - state.menuPointer.lastY;
      if (Math.abs(y - state.menuPointer.startY) > 6) state.menuPointer.moved = true;
      if (Math.abs(dy) >= Math.max(12, state.menuRowStep * 0.45)) {
        scrollMenuBy(dy > 0 ? -1 : 1);
        state.menuPointer.lastY = y;
      }
      return;
    }
    if (!state.touchThrottlePointers.hasOwnProperty(event.pointerId)) return;
    event.preventDefault();
    var rect = canvas.getBoundingClientRect();
    var x = ((event.clientX - rect.left) / rect.width) * canvas.width;
    handleTouchThrottleMove(event.pointerId, x, down, up);
  });
  var releasePointer = function(event) {
    if (state.menuShown && state.menuPointer && state.menuPointer.id === event.pointerId) {
      event.preventDefault();
      var rect = canvas.getBoundingClientRect();
      var x = ((event.clientX - rect.left) / rect.width) * canvas.width;
      var y = ((event.clientY - rect.top) / rect.height) * canvas.height;
      var shouldTap = !state.menuPointer.moved;
      state.menuPointer = null;
      if (shouldTap) handleMenuPointer(x, y);
      return;
    }
    releaseTouchThrottle(event.pointerId, up);
  };
  canvas.addEventListener("pointerup", releasePointer);
  canvas.addEventListener("pointercancel", releasePointer);
  canvas.addEventListener("lostpointercapture", releasePointer);
  document.addEventListener("visibilitychange", function() {
    if (document.hidden) {
      clearTouchThrottle(up);
      delete state.keys["ArrowLeft"];
      delete state.keys["ArrowRight"];
    }
  });
  canvas.addEventListener("wheel", function(event) {
    if (!state.menuShown) return;
    event.preventDefault();
    scrollMenuBy(event.deltaY > 0 ? 1 : -1);
  }, { passive: false });
}

function isTouchDevice() {
  return matchMedia("(pointer: coarse)").matches || navigator.maxTouchPoints > 0;
}

function bindMobileTilt() {
  if (!isTouchDevice()) return;
  if (typeof DeviceOrientationEvent !== "undefined") {
    window.addEventListener("deviceorientation", handleDeviceOrientation, true);
  }
  if (typeof DeviceMotionEvent !== "undefined") {
    window.addEventListener("devicemotion", handleDeviceMotion, true);
  }
}

function requestMobileTiltPermission() {
  if (!isTouchDevice() || state.orientation.permissionAsked) {
    return Promise.resolve();
  }
  state.orientation.permissionAsked = true;
  if (!window.isSecureContext) {
    state.orientation.permissionState = "insecure";
    return Promise.resolve();
  }
  var requests = [];
  if (typeof DeviceOrientationEvent !== "undefined" && typeof DeviceOrientationEvent.requestPermission === "function") {
    requests.push(DeviceOrientationEvent.requestPermission.call(DeviceOrientationEvent));
  }
  if (typeof DeviceMotionEvent !== "undefined" && typeof DeviceMotionEvent.requestPermission === "function") {
    requests.push(DeviceMotionEvent.requestPermission.call(DeviceMotionEvent));
  }
  if (!requests.length) {
    state.orientation.permissionState = "not-required";
    return Promise.resolve();
  }
  
  return safeAllSettled(requests)
    .then(function(results) {
      var granted = false;
      for (var i = 0; i < results.length; i++) {
        if (results[i].status === "fulfilled" && results[i].value === "granted") {
          granted = true;
          break;
        }
      }
      state.orientation.permissionState = granted ? "granted" : "denied";
    })
    .catch(function() {
      state.orientation.permissionState = "denied";
    });
}

function handleDeviceOrientation(event) {
  if (state.orientation.motionLastEventAt && performance.now() - state.orientation.motionLastEventAt < 700) return;
  var rawGamma = Number(event.gamma);
  var rawBeta = Number(event.beta);
  if (!isFiniteNumber(rawGamma) && !isFiniteNumber(rawBeta)) return;
  var screenAngle = normalizedScreenAngle();
  var landscape = Math.abs(screenAngle) === 90;
  var axis = 0;
  if (landscape && isFiniteNumber(rawBeta)) {
    axis = screenAngle > 0 ? -rawBeta : rawBeta;
  } else if (isFiniteNumber(rawGamma)) {
    axis = rawGamma;
  }
  var posture = Math.abs(isFiniteNumber(rawBeta) ? rawBeta : 0) > 55 ? "vertical" : "horizontal";
  setMobileTiltAxis(axis, "orientation", posture);
}

function handleDeviceMotion(event) {
  var gravity = event.accelerationIncludingGravity;
  if (!gravity) return;
  var rawX = Number(gravity.x);
  var rawY = Number(gravity.y);
  var rawZ = Number(gravity.z);
  if (!isFiniteNumber(rawX) && !isFiniteNumber(rawY)) return;
  var screenAngle = normalizedScreenAngle();
  var landscape = Math.abs(screenAngle) === 90;
  var sideGravity = isFiniteNumber(rawX) ? -rawX : 0;
  if (landscape && isFiniteNumber(rawY)) {
    sideGravity = screenAngle > 0 ? rawY : -rawY;
  }
  var gx = isFiniteNumber(rawX) ? rawX : 0;
  var gy = isFiniteNumber(rawY) ? rawY : 0;
  var gz = isFiniteNumber(rawZ) ? rawZ : 0;
  var g = Math.max(1, Math.sqrt(gx * gx + gy * gy + gz * gz));
  var axis = Math.asin(clamp(sideGravity / g, -1, 1)) * 180 / Math.PI;
  var posture = isFiniteNumber(rawZ) && Math.abs(rawZ) > g * 0.55 ? "horizontal" : "vertical";
  setMobileTiltAxis(axis, "motion", posture);
}

function normalizedScreenAngle() {
  var angleObj = (screen.orientation ? screen.orientation.angle : undefined);
  var angle = angleObj !== undefined ? angleObj : (window.orientation !== undefined ? window.orientation : 0);
  var normalized = ((Number(angle) % 360) + 360) % 360;
  return normalized > 180 ? normalized - 360 : normalized;
}

function setMobileTiltAxis(axis, source, posture) {
  if (posture === undefined) posture = "";
  state.orientation.supported = true;
  state.orientation.source = source;
  state.orientation.lastEventAt = performance.now();
  if (source === "motion") state.orientation.motionLastEventAt = state.orientation.lastEventAt;
  if (source === "orientation") state.orientation.orientationLastEventAt = state.orientation.lastEventAt;
  state.orientation.axisValue = axis;
  state.orientation.posture = posture;
  var offset = axis;
  var magnitude = Math.abs(offset);
  var deadzone = mobileLeanDeadzone();
  if (magnitude <= deadzone) {
    state.orientation.lean = 0;
    return;
  }
  var fullTilt = Math.max(deadzone + 4, MOBILE_LEAN_FULL);
  var normalized = clamp((magnitude - deadzone) / (fullTilt - deadzone), 0, 1);
  state.orientation.lean = Math.sign(offset) * normalized;
}

function mobileLeanDeadzone() {
  var deadzoneVal = state.settings.tiltDeadzone;
  return clamp(Number(deadzoneVal !== undefined && deadzoneVal !== null ? deadzoneVal : 6), 0, 20);
}

function handleTouchThrottleDown(pointerId, x, down) {
  var key = x < canvas.width / 2 ? "ArrowDown" : "ArrowUp";
  state.touchThrottlePointers[pointerId] = key;
  down(key);
  if (navigator.vibrate && state.settings.vibrateOnTouch) navigator.vibrate(12);
}

function handleTouchThrottleMove(pointerId, x, down, up) {
  var previous = state.touchThrottlePointers[pointerId];
  var next = x < canvas.width / 2 ? "ArrowDown" : "ArrowUp";
  if (!previous || previous === next) return;
  up(previous);
  down(next);
  state.touchThrottlePointers[pointerId] = next;
}

function releaseTouchThrottle(pointerId, up) {
  var key = state.touchThrottlePointers[pointerId];
  if (!key) return;
  delete state.touchThrottlePointers[pointerId];
  up(key);
}

function clearTouchThrottle(up) {
  for (var key in state.touchThrottlePointers) {
    if (state.touchThrottlePointers.hasOwnProperty(key)) {
      up(state.touchThrottlePointers[key]);
    }
  }
  state.touchThrottlePointers = {};
}

function handleMenuPointer(x, y) {
  for (var i = 0; i < state.menuLayout.length; i++) {
    var item = state.menuLayout[i];
    if (y < item.top || y > item.bottom) continue;
    var row = item.row;
    if (row.type === "name") {
      var scale = menuScale(canvas.width, canvas.height);
      state.nameCursor = clamp(Math.floor((x - (canvas.width / 2 - 39 * scale)) / (26 * scale)), 0, 2);
      return;
    }
    if (row.type === "text") return;
    state.menuIndex = item.index;
    if (row.type === "toggle" || row.type === "select") {
      var left = item.leftArrow !== undefined ? item.leftArrow : canvas.width * 0.35;
      var right = item.rightArrow !== undefined ? item.rightArrow : canvas.width * 0.65;
      var hitRadius = item.arrowHitRadius !== undefined ? item.arrowHitRadius : 34;
      if (Math.abs(x - left) <= hitRadius) {
        adjustMenuRow(row, -1);
        return;
      }
      if (Math.abs(x - right) <= hitRadius) {
        adjustMenuRow(row, 1);
        return;
      }
      return;
    }
    activateMenuRow(row);
    return;
  }
}

function scrollMenuBy(deltaRows) {
  var rows = getMenuRows();
  var metrics = menuMetrics(rows);
  var maxScroll = Math.max(0, rows.length - metrics.visibleRows);
  state.menuScroll = clamp(Math.round(state.menuScroll + deltaRows), 0, maxScroll);
}

function pressKeyboardControls(rawKey, mappedKeys, down) {
  if (state.heldRawKeys[rawKey]) return;
  state.heldRawKeys[rawKey] = true;
  for (var i = 0; i < mappedKeys.length; i++) {
    var key = mappedKeys[i];
    var count = state.keyRefCounts[key] || 0;
    state.keyRefCounts[key] = count + 1;
    if (count === 0) down(key);
  }
}

function releaseKeyboardControls(rawKey, mappedKeys, up) {
  if (!state.heldRawKeys[rawKey]) return;
  delete state.heldRawKeys[rawKey];
  for (var i = 0; i < mappedKeys.length; i++) {
    var key = mappedKeys[i];
    var count = state.keyRefCounts[key] || 0;
    if (count <= 1) {
      delete state.keyRefCounts[key];
      up(key);
    } else {
      state.keyRefCounts[key] = count - 1;
    }
  }
}

function mapInputKeys(key) {
  if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " ", "Enter", "Escape"].indexOf(key) !== -1) return [key];
  if (state.settings.input === 0) {
    if (key === "2") return ["ArrowUp"];
    if (key === "8") return ["ArrowDown"];
    if (key === "4") return ["ArrowLeft"];
    if (key === "6") return ["ArrowRight"];
    if (key === "5") return [" "];
    if (key === "1") return ["ArrowUp", "ArrowLeft"];
    if (key === "3") return ["ArrowUp", "ArrowRight"];
    if (key === "7") return ["ArrowDown", "ArrowLeft"];
    if (key === "9") return ["ArrowDown", "ArrowRight"];
  }
  if (state.settings.input === 1) {
    if (key === "1") return ["ArrowUp"];
    if (key === "4") return ["ArrowDown"];
    if (key === "6") return ["ArrowRight"];
    if (key === "5") return ["ArrowLeft"];
  }
  if (state.settings.input === 2) {
    if (key === "3") return ["ArrowUp"];
    if (key === "6") return ["ArrowDown"];
    if (key === "5") return ["ArrowRight"];
    if (key === "4") return ["ArrowLeft"];
  }
  var lower = key.toLowerCase();
  if (lower === "w") return ["ArrowUp"];
  if (lower === "s") return ["ArrowDown"];
  if (lower === "a") return ["ArrowLeft"];
  if (lower === "d") return ["ArrowRight"];
  return [];
}

function handleMenuKey(key) {
  if (!state.menuShown) return false;
  if (state.menuScreen === "name") {
    handleNameKey(key);
    return true;
  }
  if (key === "Escape") {
    if (state.menuScreen === "ingame") state.menuShown = false;
    else if (state.menuScreen === "main") state.menuShown = false;
    else openMenu("main");
    return true;
  }
  var rows = getMenuRows();
  if (key === "ArrowUp") {
    state.menuIndex = nextSelectableIndex(rows, state.menuIndex, -1);
    return true;
  }
  if (key === "ArrowDown") {
    state.menuIndex = nextSelectableIndex(rows, state.menuIndex, 1);
    return true;
  }
  if (key === "ArrowLeft" || key === "ArrowRight") {
    var direction = key === "ArrowRight" ? 1 : -1;
    adjustMenuRow(rows[state.menuIndex], direction);
    return true;
  }
  if (key === "Enter" || key === " ") {
    activateMenuRow(rows[state.menuIndex]);
    return true;
  }
  return false;
}

function openMenu(screen) {
  state.menuShown = true;
  state.menuScreen = screen;
  state.menuScroll = 0;
  state.menuPointer = null;
  state.menuIndex = nextSelectableIndex(getMenuRowsForScreen(screen), -1, 1);
  syncMenuUrl(screen);
}

function syncMenuUrl(screen) {
  if (!history.replaceState) return;
  var url = new URL(location.href);
  url.search = "";
  if (screen === "play") {
    url.searchParams.set("league", String(Number(leagueSelect.value) || 0));
    url.searchParams.set("track", String(Number(trackSelect.value) || 0));
    url.searchParams.set("menu", "play");
  } else if (screen === "daily") {
    url.searchParams.set("daily", "1");
  }
  history.replaceState(null, "", url.pathname + url.search + url.hash);
}

function getMenuRowsForScreen(screen) {
  var previous = state.menuScreen;
  state.menuScreen = screen;
  var rows = getMenuRows();
  state.menuScreen = previous;
  return rows;
}

function nextSelectableIndex(rows, from, direction) {
  if (!rows.length) return 0;
  for (var step = 1; step <= rows.length; step += 1) {
    var index = (from + direction * step + rows.length) % rows.length;
    if (rows[index].type !== "text" && rows[index].type !== "name") return index;
  }
  return 0;
}

// অনলাইন ও অথেনটিকেশন অপশনগুলো সরিয়ে পরিমার্জিত মেনু কাঠামো
function getMenuRows() {
  var league = state.manifest.leagues[Number(leagueSelect.value)];
  var track = league.tracks[Number(trackSelect.value)];
  var activeTrackName = state.dailyTrack && state.level ? dailyTrackMenuName() : track.name;
  var optionsBackAction = state.optionsBackScreen === "ingame" ? "ingame" : "main";
  
  if (state.menuScreen === "daily") {
    if (state.dailyTrackLoading) {
      return [{ type: "text", label: t("loadingDaily") }];
    }
    return [
      { type: "action", label: menuT("start"), action: "startDaily" },
      { type: "select", label: menuT("league"), value: ccLeagueName(state.dailyBikeLeague), action: "dailyLeague" },
      { type: "action", label: menuT("mainMenuLower"), action: "main" },
    ];
  }
  if (state.menuScreen === "play") {
    return [
      { type: "action", label: menuT("start"), action: "start" },
      { type: "select", label: menuT("level"), value: league.name, action: "level" },
      { type: "select", label: menuT("track"), value: trackLabel(Number(leagueSelect.value), Number(trackSelect.value), track.name), action: "track" },
      { type: "select", label: menuT("league"), value: ccLeagueName(state.bikeLeague), action: "league" },
      { type: "action", label: menuT("mainMenuLower"), action: "main" },
    ];
  }
  if (state.menuScreen === "options") {
    return [
      { type: "toggle", label: menuT("perspective"), value: state.settings.perspective, action: "perspective" },
      { type: "toggle", label: menuT("shadows"), value: state.settings.shadows, action: "shadows" },
      { type: "toggle", label: menuT("driverSprite"), value: state.settings.driverSprite, action: "driverSprite" },
      { type: "toggle", label: menuT("bikeSprite"), value: state.settings.bikeSprite, action: "bikeSprite" },
      { type: "select", label: menuT("tiltDeadzone"), value: mobileLeanDeadzone() + " " + t("degrees"), action: "tiltDeadzone" },
      { type: "toggle", label: menuT("vibrateOnTouch"), value: state.settings.vibrateOnTouch, action: "vibrateOnTouch" },
      { type: "action", label: menuT("clearHighscore"), action: "clearScores" },
      { type: "action", label: menuT("back"), action: optionsBackAction },
    ];
  }
  if (state.menuScreen === "confirmClear") {
    var confirmLines = wrapText(menuT("clearConfirmText"), 54);
    var rowsArr = [{ type: "text", label: menuT("confirmClear") }];
    for (var i = 0; i < confirmLines.length; i++) {
      rowsArr.push({ type: "text", label: confirmLines[i] });
    }
    rowsArr.push({ type: "text", label: menuT("clearConfirmQuestion") });
    rowsArr.push({ type: "action", label: menuT("no"), action: "options" });
    rowsArr.push({ type: "action", label: menuT("yes"), action: "yesClearScores" });
    rowsArr.push({ type: "action", label: menuT("fullReset"), action: "confirmReset" });
    return rowsArr;
  }
  if (state.menuScreen === "confirmReset") {
    var resetLines = wrapText(menuT("resetConfirmText"), 54);
    var rowsArr = [{ type: "text", label: menuT("confirmReset") }];
    for (var i = 0; i < resetLines.length; i++) {
      rowsArr.push({ type: "text", label: resetLines[i] });
    }
    rowsArr.push({ type: "text", label: menuT("resetConfirmQuestion") });
    rowsArr.push({ type: "action", label: menuT("no"), action: "confirmClear" });
    rowsArr.push({ type: "action", label: menuT("yes"), action: "yesFullReset" });
    return rowsArr;
  }
  if (state.menuScreen === "ingame") {
    return [
      { type: "action", label: menuT("continue"), action: "continue" },
      { type: "action", label: menuT("restart").slice(0, -1) + ": " + activeTrackName + ">", action: "restart" },
      { type: "action", label: menuT("options"), action: "options" },
      { type: "action", label: menuT("exit"), action: "play" },
    ];
  }
  if (state.menuScreen === "highscores") {
    ensureStandardScores(state.bikeLeague, state.level);
    var scores = getHighScores(state.bikeLeague);
    return [
      { type: "text", label: menuT("highscoresTitle") },
      { type: "text", label: league.name + " / " + track.name + " / " + ccLeagueName(state.bikeLeague) },
      { type: "text", label: scores[0] ? formatScore(scores[0]) : "---" },
      { type: "text", label: scores[1] ? formatScore(scores[1]) : "---" },
      { type: "text", label: scores[2] ? formatScore(scores[2]) : "---" },
      { type: "action", label: menuT("back"), action: "play" },
    ];
  }
  if (state.menuScreen === "finished") {
    if (!state.dailyTrack) ensureStandardScores(activeBikeLeague(), state.level);
    var scores = getHighScores(activeBikeLeague());
    var rowsArr = [
      { type: "text", label: t("finished") },
      { type: "text", label: state.lastResult ? t("time") + ": " + formatScoreTime(state.lastResult.time) : "" },
      { type: "text", label: scores[0] ? "1. " + formatScore(scores[0]) : "" },
      { type: "text", label: scores[1] ? "2. " + formatScore(scores[1]) : "" },
      { type: "text", label: scores[2] ? "3. " + formatScore(scores[2]) : "" },
    ];
    if (!state.dailyTrack) rowsArr.push({ type: "action", label: menuT("next"), action: "next" });
    rowsArr.push(
      { type: "action", label: menuT("restart"), action: "restart" },
      { type: "action", label: menuT("playMenu"), action: "play" }
    );
    return rowsArr;
  }
  if (state.menuScreen === "name") {
    var finishObj = state.pendingFinish;
    return [
      { type: "text", label: finishObj ? finishObj.placeText : t("newHighscore") },
      { type: "text", label: finishObj ? formatScoreTime(finishObj.time) : "" },
      { type: "name", label: state.playerName.join(" ") },
      { type: "action", label: menuT("ok"), action: "finishScore" },
    ];
  }
  if (state.menuScreen === "help") {
    return [
      { type: "action", label: menuT("objective"), action: "helpObjective" },
      { type: "action", label: menuT("keys"), action: "helpKeys" },
      { type: "action", label: menuT("unlocking"), action: "helpUnlocking" },
      { type: "action", label: menuT("highScores"), action: "helpHighscore" },
      { type: "action", label: menuT("options"), action: "helpOptions" },
      { type: "action", label: menuT("back"), action: "main" },
    ];
  }
  if (state.menuScreen === "helpText") {
    var topics = helpTopics();
    var topic = topics[state.helpTopic] ? topics[state.helpTopic] : topics.objective;
    var topicLines = wrapText(topic.text, 54);
    var rowsArr = [{ type: "text", label: topic.title }];
    for (var i = 0; i < topicLines.length; i++) {
      rowsArr.push({ type: "text", label: topicLines[i] });
    }
    rowsArr.push({ type: "action", label: menuT("back"), action: "help" });
    return rowsArr;
  }
  if (state.dailyTrackLoading) {
    return [{ type: "text", label: t("loadingDaily") }];
  }
  
  var mainRows = [
    { type: "action", label: menuT("playMenu"), action: "play" },
    { type: "action", label: t("dailyTrack") + ">", action: "dailyTrack" },
    { type: "action", label: menuT("options"), action: "options" },
    { type: "action", label: menuT("site"), action: "site" },
    { type: "action", label: menuT("quit"), action: "exit" }
  ];
  //mainRows.push({ type: "text", label: "Offline Mode" });
  return mainRows;
}

function dailyTrackMenuName() {
  return t("dailyTrack");
}

function activateMenuRow(row) {
  if (!row || row.type === "text") return;
  if (row.action === "start") {
    if (!canStartSelected()) {
      state.message = t("completeMore");
      return;
    }
    state.menuShown = false;
    startSelectedStandardTrack();
  } else if (row.action === "continue") {
    state.menuShown = false;
  } else if (row.action === "dailyTrack") {
    openMenu("daily");
  } else if (row.action === "startDaily") {
    loadDailyTrack({ showMenu: false }).then(function(loaded) {
      if (!loaded) return;
      state.menuShown = false;
    });
  } else if (row.action === "play") openMenu("play");
  else if (row.action === "main") openMenu("main");
  else if (row.action === "site") window.location.href = "http://shifat100.github.io/kaios";
  else if (row.action === "quit") window.close();
  else if (row.action === "ingame") openMenu("ingame");
  else if (row.action === "options") {
    state.optionsBackScreen = state.menuScreen === "ingame" ? "ingame" : "main";
    openMenu("options");
  }
  else if (row.action === "help") openMenu("help");
  else if (row.action && row.action.indexOf("help") === 0) {
    state.helpTopic = row.action.slice(4).toLowerCase();
    openMenu("helpText");
  }
  else if (row.action === "highscores") openMenu("highscores");
  else if (row.action === "clearScores") {
    openMenu("confirmClear");
  } else if (row.action === "yesClearScores") {
    clearAllHighScores();
    state.message = t("highscoresCleared");
    openMenu("options");
  } else if (row.action === "fullReset") {
    openMenu("confirmReset");
  } else if (row.action === "yesFullReset") {
    fullReset();
  } else if (row.action === "restart") {
    state.menuShown = false;
    restartCurrentTrack();
  } else if (row.action === "next") {
    loadNextTrack();
    state.menuShown = false;
  } else if (row.action === "finishScore") {
    finalizePendingFinish();
  }
}

function adjustMenuRow(row, direction) {
  if (!row) return;
  if (row.type === "toggle") {
    state.settings[row.action] = !state.settings[row.action];
    saveSettings();
    applyRuntimeOptions();
    return;
  }
  if (row.action === "level") {
    var nextLeague = clamp(Number(leagueSelect.value) + direction, 0, state.progress.unlockedLevels);
    leagueSelect.value = String(nextLeague);
    fillTracks(nextLeague);
    var nextTrack = clamp(Number(trackSelect.value), 0, unlockedTrackLimit(nextLeague));
    trackSelect.value = String(nextTrack);
    rememberSelection();
    loadLevel(nextLeague, nextTrack);
  } else if (row.action === "track") {
    var maxTrack = unlockedTrackLimit(Number(leagueSelect.value));
    var nextTrack = clamp(Number(trackSelect.value) + direction, 0, maxTrack);
    trackSelect.value = String(nextTrack);
    rememberSelection();
    loadLevel(Number(leagueSelect.value), nextTrack);
  } else if (row.action === "league") {
    state.bikeLeague = clamp(state.bikeLeague + direction, 0, state.progress.unlockedLeagues);
    rememberSelection();
    if (state.level) {
      resetBike();
      ensureStandardScores(state.bikeLeague, state.level);
    }
  } else if (row.action === "dailyLeague") {
    state.dailyBikeLeague = clamp(state.dailyBikeLeague + direction, 0, 3);
    state.dailyBikeLeagueConfigured = true;
    if (state.dailyTrack) {
      fetchDailyScores(state.dailyBikeLeague);
      if (state.phys) state.phys.setLeague(activeBikeLeague());
      resetBike();
    }
  } else if (row.action === "tiltDeadzone") {
    state.settings.tiltDeadzone = clamp(mobileLeanDeadzone() + direction, 0, 20);
    saveSettings();
  }
}

function loadNextTrack() {
  var leagueId = Number(leagueSelect.value);
  var trackId = Number(trackSelect.value) + 1;
  if (trackId >= state.manifest.leagues[leagueId].tracks.length) {
    trackId = 0;
    leagueId = clamp(leagueId + 1, 0, state.manifest.leagues.length - 1);
    leagueSelect.value = String(leagueId);
    fillTracks(leagueId);
  }
  if (leagueId > state.progress.unlockedLevels || trackId > unlockedTrackLimit(leagueId)) {
    openMenu("play");
    return;
  }
  trackSelect.value = String(trackId);
  rememberSelection();
  loadLevel(leagueId, trackId);
}

function applyRuntimeOptions() {
  if (!state.phys || !state.loader) return;
  state.loader.perspectiveEnabled = state.settings.perspective;
  state.loader.shadowsEnabled = state.settings.shadows;
  state.phys.m_doZ = true;
  state.phys._doIV((state.settings.bikeSprite ? 1 : 0) | (state.settings.driverSprite ? 2 : 0));
}

function ccLeagueName(index) {
  return ["100cc", "175cc", "220cc", "325cc"][index] || "100cc";
}

function activeBikeLeague() {
  return state.dailyTrack ? state.dailyBikeLeague : state.bikeLeague;
}

function wrapText(text, maxChars) {
  var words = text.split(/\s+/);
  var lines = [];
  var line = "";
  for (var i = 0; i < words.length; i++) {
    var word = words[i];
    var next = line ? line + " " + word : word;
    if (next.length > maxChars && line) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function unlockedTrackLimit(leagueId) {
  var league = state.manifest.leagues[leagueId];
  var unlockedVal = state.progress.unlocked[leagueId];
  var unlocked = unlockedVal !== undefined ? unlockedVal : -1;
  return Math.max(0, Math.min(league.tracks.length - 1, unlocked));
}

function trackLabel(difficulty, trackId, name) {
  if (difficulty > state.progress.unlockedLevels || trackId > unlockedTrackLimit(difficulty)) return name + " (" + t("locked") + ")";
  return name;
}

function canStartSelected() {
  var difficulty = Number(leagueSelect.value);
  var trackId = Number(trackSelect.value);
  return difficulty <= state.progress.unlockedLevels
    && trackId <= unlockedTrackLimit(difficulty)
    && state.bikeLeague <= state.progress.unlockedLeagues;
}

function rememberSelection() {
  state.progress.selectedLevel = Number(leagueSelect.value);
  state.progress.selectedTrack = Number(trackSelect.value);
  state.progress.selectedLeague = state.bikeLeague;
  saveProgress();
  if (state.menuShown && state.menuScreen === "play") syncMenuUrl("play");
}

function updateProgressAfterFinish() {
  if (state.dailyTrack) return null;
  var difficulty = Number(leagueSelect.value);
  var trackId = Number(trackSelect.value);
  var tracks = state.manifest.leagues[difficulty].tracks;
  var beforeLevels = state.progress.unlockedLevels;
  var beforeLeagues = state.progress.unlockedLeagues;
  
  var currentUnlocked = state.progress.unlocked[difficulty] !== undefined ? state.progress.unlocked[difficulty] : -1;
  state.progress.unlocked[difficulty] = Math.max(currentUnlocked, Math.min(trackId + 1, tracks.length - 1));
  
  if (trackId >= tracks.length - 1) {
    var nextDifficulty = Math.min(difficulty + 1, state.manifest.leagues.length - 1);
    state.progress.unlockedLevels = Math.max(state.progress.unlockedLevels, nextDifficulty);
    state.progress.unlockedLeagues = Math.max(state.progress.unlockedLeagues, Math.min(difficulty + 1, 3));
    
    var nextUnlocked = state.progress.unlocked[nextDifficulty] !== undefined ? state.progress.unlocked[nextDifficulty] : -1;
    if (nextUnlocked < 0) {
      state.progress.unlocked[nextDifficulty] = 0;
    }
  }
  state.progress.unlockedLevels = clamp(state.progress.unlockedLevels, 0, state.manifest.leagues.length - 1);
  state.progress.unlockedLeagues = clamp(state.progress.unlockedLeagues, 0, 3);
  rememberSelection();
  var unlockedLevel = state.progress.unlockedLevels > beforeLevels ? state.progress.unlockedLevels : null;
  var unlockedBike = state.progress.unlockedLeagues > beforeLeagues ? state.progress.unlockedLeagues : null;
  if (unlockedLevel === null && unlockedBike === null) return null;
  return { level: unlockedLevel, bike: unlockedBike };
}

function unlockMessage(unlock) {
  var parts = [];
  if (unlock && unlock.bike !== null && unlock.bike !== undefined) parts.push(t("newBikeAvailable") + ": " + ccLeagueName(unlock.bike));
  if (unlock && unlock.level !== null && unlock.level !== undefined) {
    var leagueName = state.manifest.leagues[unlock.level] ? state.manifest.leagues[unlock.level].name : (unlock.level + 1);
    parts.push(t("newLevelAvailable") + ": " + leagueName);
  }
  return parts.join(" / ");
}

function saveFinishResultWithoutPrompt(finishTime) {
  if (!state.level) return;
  saveBest(state.level, finishTime, activeBikeLeague(), resultPlayerName());
  state.pendingFinish = null;
  state.lastResult = { time: finishTime };
}

function scheduleUnlockMenu(unlock, finishTime, now) {
  saveFinishResultWithoutPrompt(finishTime);
  state.pendingUnlock = unlock;
  state.unlockMenuAt = now + 3200;
  state.message = unlockMessage(unlock);
}

function openUnlockedClassicMenu(unlock) {
  var nextLevel = (unlock && unlock.level !== null && unlock.level !== undefined) ? unlock.level : Number(leagueSelect.value);
  var nextBike = (unlock && unlock.bike !== null && unlock.bike !== undefined) ? unlock.bike : state.bikeLeague;
  var safeLevel = clamp(nextLevel, 0, state.progress.unlockedLevels);
  state.bikeLeague = clamp(nextBike, 0, state.progress.unlockedLeagues);
  leagueSelect.value = String(safeLevel);
  fillTracks(safeLevel);
  trackSelect.value = "0";
  rememberSelection();
  return loadLevel(safeLevel, 0).then(function() {
    state.message = "";
    openMenu("play");
  });
}

function prepareFinishMenu(finishTime) {
  var place = getScorePlace(activeBikeLeague(), finishTime);
  if (place >= 0 && place <= 2) {
    state.pendingFinish = {
      level: state.level,
      time: finishTime,
      league: activeBikeLeague(),
      place: place,
      placeText: [t("firstPlace"), t("secondPlace"), t("thirdPlace")][place],
    };
    state.nameCursor = 0;
    openMenu("name");
    return;
  }
  state.pendingFinish = null;
  openMenu("finished");
}

function handleNameKey(key) {
  if (key === "Escape") {
    finalizePendingFinish();
    return;
  }
  if (key === "ArrowLeft") state.nameCursor = clamp(state.nameCursor - 1, 0, 2);
  else if (key === "ArrowRight") state.nameCursor = clamp(state.nameCursor + 1, 0, 2);
  else if (key === "ArrowUp") adjustNameChar(1);
  else if (key === "ArrowDown") adjustNameChar(-1);
  else if (key === "Enter" || key === " ") {
    if (state.nameCursor >= 2) finalizePendingFinish();
    else state.nameCursor += 1;
  }
}

function adjustNameChar(direction) {
  var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ ";
  var current = state.playerName[state.nameCursor] || "A";
  var index = Math.max(0, chars.indexOf(current));
  state.playerName[state.nameCursor] = chars[(index + direction + chars.length) % chars.length];
  savePlayerName();
}

function finalizePendingFinish() {
  if (state.pendingFinish) {
    saveBest(state.pendingFinish.level, state.pendingFinish.time, state.pendingFinish.league, resultPlayerName());
    state.pendingFinish = null;
  }
  openMenu("finished");
}

function loop(now) {
  var dt = Math.min(0.032, (now - state.lastFrame) / 1000);
  state.lastFrame = now;
  state.flagFrame = Math.floor(now / 160) % 4;
  if (state.level && state.phys) {
    state.accumulator += dt;
    while (state.accumulator >= 0.015) {
      step();
      state.accumulator -= 0.015;
    }
    if (state.crashed && state.crashTime && now - state.crashTime > 3000) restartCurrentTrack();
    if (state.finishPending && state.finishMenuAt && now >= state.finishMenuAt) {
      state.finished = true;
      state.finishPending = false;
      state.finishMenuAt = 0;
      var unlock = updateProgressAfterFinish();
      state.lastResult = { time: state.finishTimeValue };
      if (unlock) scheduleUnlockMenu(unlock, state.finishTimeValue, now);
      else prepareFinishMenu(state.finishTimeValue);
      refreshDailyTrackAfterFinish();
    }
    if (state.pendingUnlock && state.unlockMenuAt && now >= state.unlockMenuAt) {
      var unlock = state.pendingUnlock;
      state.pendingUnlock = null;
      state.unlockMenuAt = 0;
      openUnlockedClassicMenu(unlock);
    }
    draw();
  }
  requestAnimationFrame(loop);
}

function step() {
  if (!state.running || state.crashed || state.finished) return;

  var throttle = 0;
  var lean = 0;
  if (!state.finishPending) {
    if (state.keys["ArrowUp"]) throttle += 1;
    if (state.keys["ArrowDown"]) throttle -= 1;
    if (state.keys["ArrowRight"]) lean += 1;
    if (state.keys["ArrowLeft"]) lean -= 1;
    if (isTouchDevice() && !state.menuShown) lean += state.orientation.lean;
  }
  lean = clamp(lean, -1, 1);
  state.phys._aIIV(throttle, lean);

  var result = state.phys._dovI();
  state.phys._charvV();
  var now = performance.now();
  if (!state.timerStarted && bikeCrossedStartLine()) {
    state.timerStarted = true;
    state.startTime = now;
  }
  if (state.finishPending) return;
  if (result === 3 || result === 5) {
    state.crashed = true;
    state.crashTime = now;
    state.message = t("crashed");
  } else if (result === 1 || result === 2) {
    state.finishPending = true;
    if (!state.timerStarted) {
      state.timerStarted = true;
      state.startTime = now;
    }
    state.elapsed = now - state.startTime;
    var finishTime = Math.floor(state.elapsed / 10);
    state.finishTimeValue = finishTime;
    state.finishMenuAt = now + 1000;
    state.message = state.phys.m_NZ ? t("finished") : t("wheelie");
  } else if (state.timerStarted) {
    state.elapsed = now - state.startTime;
  }
}

function bikeCrossedStartLine() {
  var phys = state.phys;
  if (!phys || !phys.m_Hak || !phys.m_Hak[1] || !phys.m_Hak[2] || !phys.m_lf) return false;
  var frame = phys.m_vaI;
  var fPt = phys.m_Hak[1].m_ifan[frame];
  var rPt = phys.m_Hak[2].m_ifan[frame];
  var frontX = fPt ? fPt.x : -Infinity;
  var rearX = rPt ? rPt.x : -Infinity;
  return Math.max(frontX, rearX) >= phys.m_lf._intvI();
}

function terrainY(x) {
  var points = (state.level ? state.level.points : null) || [];
  if (!points.length) return 220;
  if (x <= points[0].x) return points[0].y;
  for (var i = 0; i < points.length - 1; i += 1) {
    var a = points[i];
    var b = points[i + 1];
    if (x >= a.x && x <= b.x) {
      var tVal = (x - a.x) / Math.max(1, b.x - a.x);
      return a.y + (b.y - a.y) * tVal;
    }
  }
  return points[points.length - 1].y;
}

function terrainSlope(x) {
  var points = (state.level ? state.level.points : null) || [];
  for (var i = 0; i < points.length - 1; i += 1) {
    var a = points[i];
    var b = points[i + 1];
    if (x >= a.x && x <= b.x) return Math.atan2(b.y - a.y, b.x - a.x);
  }
  return 0;
}

function draw() {
  updatePauseButton();
  var width = canvas.width;
  var height = canvas.height;
  var bootElapsed = performance.now() - state.bootStart;
  if (bootElapsed < state.bootDuration) {
    drawBoot(bootElapsed / state.bootDuration);
    return;
  }
  var zoom = adaptiveZoom(width, height);
  state.view.zoom = zoom;

  state.phys._voidvV();
  var cameraX = state.phys._elsevI();
  var cameraY = state.phys._ifvI();
  state.view.x = -cameraX + width / zoom / 2;
  state.view.y = cameraY + height / zoom / 2;
  state.phys._ifIIV(-state.view.x, -state.view.x + width / zoom);

  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, width, height);
  ctx.save();
  ctx.scale(zoom, zoom);
  ctx.translate(state.view.x, state.view.y);
  drawOriginalFrame();
  ctx.restore();
  drawHud();
  if (state.menuShown) drawMenu();
}

function updatePauseButton() {
  pauseButton.classList.toggle("isVisible", !!(state.level && !state.menuShown));
}

function adaptiveZoom(width, height) {
  var areaScale = Math.sqrt((width * height) / (BASE_VIEW_WIDTH * BASE_VIEW_HEIGHT));
  var aspectPenalty = Math.min(width / height, height / width) / Math.min(BASE_VIEW_WIDTH / BASE_VIEW_HEIGHT, BASE_VIEW_HEIGHT / BASE_VIEW_WIDTH);
  return clamp(areaScale * Math.max(0.86, aspectPenalty), 0.78, 1.65);
}

function drawBoot(progress) {
  var width = canvas.width;
  var height = canvas.height;
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, width, height);
  var firstStage = progress < 0.48;
  var image = firstStage ? assets.codebrew : assets.logo;
  var scale = menuScale(width, height);
  var imageWidth = 180 * scale;
  var ratio = image.naturalHeight / Math.max(1, image.naturalWidth);
  var imageHeight = imageWidth * ratio;
  drawImage(image, width / 2 - imageWidth / 2, height / 2 - imageHeight * 0.85, imageWidth, imageHeight);
  drawBootProgress(progress);
}

function drawBootProgress(progress) {
  var y = canvas.height - 5;
  ctx.fillStyle = "#c4c4c4";
  ctx.fillRect(0, y, canvas.width, 3);
  ctx.fillStyle = "#29aa27";
  ctx.fillRect(0, y, Math.round(canvas.width * clamp(progress, 0, 1)), 3);
}

function sx(x) {
  return x;
}

function drawOriginalFrame() {
  ctx.lineCap = "butt";
  ctx.lineJoin = "miter";
  var phys = state.phys;
  var i1 = phys.m_aaan[3].x - phys.m_aaan[4].x;
  var j1 = phys.m_aaan[3].y - phys.m_aaan[4].y;
  var len = approxDistance(i1, j1);
  if (len !== 0) {
    i1 = ((i1 * FP) / len) | 0;
    j1 = ((j1 * FP) / len) | 0;
  }
  var k1 = -j1;
  var l1 = i1;

  if (state.loader.perspectiveEnabled) drawPerspectiveTerrain();
  if (state.settings.bikeSprite) drawEngineFender(i1, j1);
  if (state.settings.bikeSprite) drawWheelSprites();
  drawWheelSpokes();
  drawPoweredWheelArc(i1, j1);
  drawRearForkLink();
  drawOriginalRider(i1, j1, k1, l1);
  drawMainTerrain();
}

function drawPerspectiveTerrain() {
  var level = state.loader.levels;
  var points = level.points;
  var centerX = state.phys.m_aaan[0].x >> 1;
  var centerY = state.phys.m_aaan[0].y >> 1;
  ctx.strokeStyle = "rgb(0,170,0)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  var flags = [];
  var shadowStart = 0;
  var shadowEnd = 0;
  var j2 = 0;
  for (; j2 < level.pointsCount - 1 && points[j2][0] <= level.m_aI; j2 += 1);
  if (j2 > 0) j2 -= 1;
  var i3 = centerX - points[j2][0];
  var j3 = centerY + 0x320000 - points[j2][1];
  var k3 = approxDistance(i3, j3);
  i3 = divApprox(i3, k3 >> 2);
  j3 = divApprox(j3, k3 >> 2);
  while (j2 < level.pointsCount - 1) {
    var j1 = i3;
    var l1 = j3;
    i3 = centerX - points[j2 + 1][0];
    j3 = centerY + 0x320000 - points[j2 + 1][1];
    var l3 = approxDistance(i3, j3);
    i3 = divApprox(i3, l3 >> 2);
    j3 = divApprox(j3, l3 >> 2);
    drawWorldLine(
      fixedToWorld(points[j2][0] + j1),
      fixedToWorld(points[j2][1] + l1),
      fixedToWorld(points[j2 + 1][0] + i3),
      fixedToWorld(points[j2 + 1][1] + j3)
    );
    drawWorldLine(
      fixedToWorld(points[j2][0]),
      fixedToWorld(points[j2][1]),
      fixedToWorld(points[j2][0] + j1),
      fixedToWorld(points[j2][1] + l1)
    );
    if (level.m_gotoI === j2) {
      flags.push(["start", fixedToWorld(points[level.m_gotoI][0] + j1), fixedToWorld(points[level.m_gotoI][1] + l1)]);
    }
    if (level.m_forI === j2) {
      flags.push(["finish", fixedToWorld(points[level.m_forI][0] + j1), fixedToWorld(points[level.m_forI][1] + l1)]);
    }
    if (j2 > 1) {
      if (points[j2][0] > level.m_eI && shadowStart === 0) shadowStart = j2 - 1;
      if (points[j2][0] > level.m_bI && shadowEnd === 0) shadowEnd = j2 - 1;
    }
    if (points[j2][0] > level.m_dI) break;
    j2 += 1;
  }
  drawWorldLine(
    fixedToWorld(points[level.pointsCount - 1][0]),
    fixedToWorld(points[level.pointsCount - 1][1]),
    fixedToWorld(points[level.pointsCount - 1][0] + i3),
    fixedToWorld(points[level.pointsCount - 1][1] + j3)
  );
  ctx.stroke();
  if (state.loader.shadowsEnabled) drawTrackShadow(shadowStart, shadowEnd);
  for (var f = 0; f < flags.length; f++) {
    drawFlag(flags[f][0], flags[f][1], flags[f][2]);
  }
}

function drawTrackShadow(startIndex, endIndex) {
  var level = state.loader.levels;
  var points = level.points;
  if (endIndex > level.pointsCount - 1 || startIndex <= 0 || endIndex <= 0) return;
  var depth = Math.max(0, level.m_gI - ((points[startIndex][1] + points[endIndex + 1][1]) >> 1));
  if (level.m_gI <= points[startIndex][1] || level.m_gI <= points[endIndex + 1][1]) depth = Math.min(0x50000, depth);
  level.m_rI = ((level.m_rI * 49152) / FP + (depth * 16384) / FP) | 0;
  if (level.m_rI > 0x88000) return;
  var shade = ((0x190000 * level.m_rI) / FP) >> 16;
  ctx.strokeStyle = "rgb(" + shade + "," + shade + "," + shade + ")";
  ctx.lineWidth = 1;
  ctx.beginPath();
  var yAt = function(idx, x) {
    var dx = points[idx][0] - points[idx + 1][0];
    var slope = divApprox(points[idx][1] - points[idx + 1][1], dx);
    var intercept = points[idx][1] - ((points[idx][0] * slope) / FP);
    return ((x * slope) / FP) + intercept;
  };
  var startY = yAt(startIndex, level.m_eI);
  var endY = yAt(endIndex, level.m_bI);
  if (startIndex === endIndex) {
    drawWorldLine(fixedToWorld(level.m_eI), fixedToWorld(startY + FP), fixedToWorld(level.m_bI), fixedToWorld(endY + FP));
  } else {
    drawWorldLine(fixedToWorld(level.m_eI), fixedToWorld(startY + FP), fixedToWorld(points[startIndex + 1][0]), fixedToWorld(points[startIndex + 1][1] + FP));
    for (var i = startIndex + 1; i < endIndex; i += 1) {
      drawWorldLine(fixedToWorld(points[i][0]), fixedToWorld(points[i][1] + FP), fixedToWorld(points[i + 1][0]), fixedToWorld(points[i + 1][1] + FP));
    }
    drawWorldLine(fixedToWorld(points[endIndex][0]), fixedToWorld(points[endIndex][1] + FP), fixedToWorld(level.m_bI), fixedToWorld(endY + FP));
  }
  ctx.stroke();
}

function drawMainTerrain() {
  var level = state.loader.levels;
  var points = level.points;
  ctx.strokeStyle = "rgb(0,255,0)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  var flags = [];
  var k = 0;
  for (; k < level.pointsCount - 1 && points[k][0] <= level.m_aI; k += 1);
  if (k > 0) k -= 1;
  while (k < level.pointsCount - 1) {
    drawWorldLine(fixedToWorld(points[k][0]), fixedToWorld(points[k][1]), fixedToWorld(points[k + 1][0]), fixedToWorld(points[k + 1][1]));
    if (level.m_gotoI === k) flags.push(["start", fixedToWorld(points[level.m_gotoI][0]), fixedToWorld(points[level.m_gotoI][1])]);
    if (level.m_forI === k) flags.push(["finish", fixedToWorld(points[level.m_forI][0]), fixedToWorld(points[level.m_forI][1])]);
    if (points[k][0] > level.m_dI) break;
    k += 1;
  }
  ctx.stroke();
  for (var f = 0; f < flags.length; f++) {
    drawFlag(flags[f][0], flags[f][1], flags[f][2]);
  }
}

function fixedToWorld(value) {
  return (value * 8) / FP;
}

// ... (draw components and HUD methods are unchanged as they match client architecture)
function fixedSpriteToWorld(value) {
  return (value * 4) / 0xffff;
}

function drawWorldLine(x1, y1, x2, y2) {
  ctx.moveTo(x1, -y1);
  ctx.lineTo(x2, -y2);
}

function strokeWorldLine(color, x1, y1, x2, y2, width) {
  if (width === undefined) width = 1;
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.beginPath();
  drawWorldLine(x1, y1, x2, y2);
  ctx.stroke();
}

function divApprox(num, den) {
  if (Math.abs(den) < 3) return num < 0 ? -0x7fffffff : 0x7fffffff;
  return ((num * FP) / den) | 0;
}

function approxDistance(x, y) {
  var ax = Math.abs(x);
  var ay = Math.abs(y);
  var major = Math.max(ax, ay);
  var minor = Math.min(ax, ay);
  return (((64448 * major) / 0x10000) + ((28224 * minor) / 0x10000)) | 0;
}

function drawFlag(type, x, y) {
  ctx.save();
  ctx.strokeStyle = "#000";
  ctx.lineWidth = 1;
  ctx.beginPath();
  drawWorldLine(x, y, x, y + 32);
  ctx.stroke();
  var frame = type === "start" ? START_FLAG_SEQUENCE[state.flagFrame] : FINISH_FLAG_SEQUENCE[state.flagFrame];
  var image = assets[type + frame];
  drawImage(image, x, -y - 32, 18, 9);
  ctx.restore();
}

function drawEngineFender(i1, j1) {
  var phys = state.phys;
  var engineAngle = FPMath._ifIII(phys.m_aaan[0].x - phys.m_aaan[3].x, phys.m_aaan[0].y - phys.m_aaan[3].y);
  var fenderAngle = FPMath._ifIII(phys.m_aaan[0].x - phys.m_aaan[4].x, phys.m_aaan[0].y - phys.m_aaan[4].y);
  var engineX = (phys.m_aaan[0].x >> 1) + (phys.m_aaan[3].x >> 1);
  var engineY = (phys.m_aaan[0].y >> 1) + (phys.m_aaan[3].y >> 1);
  var fenderX = (phys.m_aaan[0].x >> 1) + (phys.m_aaan[4].x >> 1);
  var fenderY = (phys.m_aaan[0].y >> 1) + (phys.m_aaan[4].y >> 1);
  var i3 = -j1;
  var j3 = i1;
  engineX += i3 - ((i1 * 32768) / FP);
  engineY += j3 - ((j1 * 32768) / FP);
  fenderX += i3 - ((i1 * 0x1cccc) / FP);
  fenderY += j3 - ((j1 * 0x20000) / FP);
  drawRotated(assets.fender, fixedSpriteToWorld(engineX) + (fixedSpriteToWorld(fenderX) - fixedSpriteToWorld(engineX)), -fixedSpriteToWorld(fenderY), 27, 27, angleToRad(fenderAngle) - Math.PI + 0.26);
  drawRotated(assets.engine, fixedSpriteToWorld(engineX), -fixedSpriteToWorld(engineY), 30, 30, angleToRad(engineAngle) - Math.PI);
}

function drawWheelSprites() {
  var p = state.phys.getPoints().map(function(point) {
    return extend({}, point);
  });
  for (var i = 0; i < p.length; i++) {
    p[i].y = -p[i].y;
  }
  var rear = p[2];
  var front = p[1];
  var wheelAngle = p[2].wheel / 0xffff;
  var league = activeBikeLeague();
  var rearWheel = 1;
  var frontWheel = 1;
  if (league === 1) rearWheel = 0;
  if (league >= 2) rearWheel = frontWheel = 0;
  drawRotated(rearWheel === 1 ? assets.wheel1 : assets.wheel2, rear.x, rear.y, 15, 15, wheelAngle);
  drawRotated(frontWheel === 1 ? assets.wheel1 : assets.wheel2, front.x, front.y, 15, 15, wheelAngle);
}

function drawWheelSpokes() {
  var phys = state.phys;
  var wheelRadius = phys.m_Hak[1].m_aI;
  var rightRadius = (wheelRadius * 58982) / FP;
  var leftRadius = (wheelRadius * 45875) / FP;
  drawSpokes(phys.m_aaan[1], rightRadius, phys.m_aaan[1].m_bI);
  drawSpokes(phys.m_aaan[2], rightRadius, Math.round(phys.m_aaan[2].m_bI / 1.75));
  var league = activeBikeLeague();
  if (league > 0) {
    ctx.strokeStyle = league > 2 ? "rgb(100,100,255)" : "rgb(255,0,0)";
    ctx.lineWidth = 1;
    drawCircle(fixedSpriteToWorld(phys.m_aaan[2].x), -fixedSpriteToWorld(phys.m_aaan[2].y), 4);
    drawCircle(fixedSpriteToWorld(phys.m_aaan[1].x), -fixedSpriteToWorld(phys.m_aaan[1].y), 4);
  }
}

function drawSpokes(center, radius, angleFixed) {
  ctx.strokeStyle = "#000";
  ctx.lineWidth = 1;
  var lx = radius;
  var ly = 0;
  var c = FPMath._doII(angleFixed);
  var s = FPMath.sin(angleFixed);
  var tmp = lx;
  lx = ((c * lx) / FP) + (((-s) * ly) / FP);
  ly = ((s * tmp) / FP) + ((c * ly) / FP);
  c = FPMath._doII(0x141b2);
  s = FPMath.sin(0x141b2);
  ctx.beginPath();
  for (var i = 0; i < 5; i += 1) {
    drawFixedLine(center.x, center.y, center.x + lx, center.y + ly);
    tmp = lx;
    lx = ((c * lx) / FP) + (((-s) * ly) / FP);
    ly = ((s * tmp) / FP) + ((c * ly) / FP);
  }
  ctx.stroke();
}


function drawPoweredWheelArc(i1, j1) {
  var phys = state.phys;
  ctx.strokeStyle = phys.m_UZ ? "rgb(170,0,0)" : "rgb(50,50,50)";
  ctx.lineWidth = 1;

  var x = fixedSpriteToWorld(phys.m_aaan[1].x);
  var y = -fixedSpriteToWorld(phys.m_aaan[1].y);

  // হালকা ওপরে তোলার জন্য Y থেকে সামান্য পিক্সেল বিয়োগ করা হলো
  var upOffset = 0.1; // এই মানটি পরিবর্তন করে ওপরে-নিচে অ্যাডজাস্ট করতে পারেন (যেমন: ১, ১.৫, ২, বা ৩)
  y = y - upOffset;

  drawArc(
    x,
    y,
    10,
    angleToRad(FPMath._ifIII(i1, j1))
  );
}
// function drawPoweredWheelArc(i1, j1) {
//   var phys = state.phys;
//   ctx.strokeStyle = phys.m_UZ ? "rgb(170,0,0)" : "rgb(50,50,50)";
//   ctx.lineWidth = 1;
//   drawArc(
//     fixedSpriteToWorld(phys.m_aaan[1].x),
//     -fixedSpriteToWorld(phys.m_aaan[1].y),
//     (Physics.m_foraI[0] * 4) / FP,
//     angleToRad(FPMath._ifIII(i1, j1))
//   );
// }

function drawRearForkLink() {
  var p = state.phys.m_aaan;
  strokeWorldLine(
    "rgb(128,128,128)",
    fixedSpriteToWorld(p[3].x),
    fixedSpriteToWorld(p[3].y),
    fixedSpriteToWorld(p[1].x),
    fixedSpriteToWorld(p[1].y)
  );
}

function drawOriginalRider(i1, j1, k1, l1) {
  var phys = state.phys;
  var base = phys.m_aaan[0];
  var ti = phys.m_TI;
  var pose = null;
  var from = null;
  var to = null;
  var blend = FP;
  var sideIndex = 0;

  if (phys.m_elseZ && state.settings.driverSprite) {
    if (ti < 32768) {
      from = RIDER_POSES.trickBack;
      to = RIDER_POSES.trick;
      blend = (ti * 0x20000) / FP;
    } else if (ti > 32768) {
      sideIndex = 1;
      from = RIDER_POSES.trick;
      to = RIDER_POSES.trickForward;
      blend = ((ti - 32768) * 0x20000) / FP;
    } else {
      pose = RIDER_POSES.trick;
    }
  } else if (ti < 32768) {
    from = RIDER_POSES.normalBack;
    to = RIDER_POSES.normal;
    blend = (ti * 0x20000) / FP;
  } else if (ti > 32768) {
    sideIndex = 1;
    from = RIDER_POSES.normal;
    to = RIDER_POSES.normalForward;
    blend = ((ti - 32768) * 0x20000) / FP;
  } else {
    pose = RIDER_POSES.normal;
  }

  var fixedPoints = [];
  for (var i = 0; i < 8; i += 1) {
    var relX = pose ? pose[i][0] : mix(from[i][0], to[i][0], blend);
    var relY = pose ? pose[i][1] : mix(from[i][1], to[i][1], blend);
    var fixedX = base.x + ((k1 * relX) / FP) + ((i1 * relY) / FP);
    var fixedY = base.y + ((l1 * relX) / FP) + ((j1 * relY) / FP);
    fixedPoints.push({ x: fixedX, y: fixedY });
  }

  var k4 = fixedPoints[0];
  var i5 = fixedPoints[1];
  var k5 = fixedPoints[2];
  var i6 = fixedPoints[3];
  var k6 = fixedPoints[4];
  var k3 = fixedPoints[5];
  var i4 = fixedPoints[6];
  var i3 = fixedPoints[7];

  var weight = mix(RIDER_POSES.weights[sideIndex], RIDER_POSES.weights[sideIndex + 1], blend);
  if (phys.m_elseZ) {
    drawBikerPartFixed(k3, k4, 1, FP / 2);
    drawBikerPartFixed(k4, i5, 1, FP / 2);
    drawBikerPartFixed(i5, k5, 2, weight);
    drawBikerPartFixed(k5, k6, 0, FP / 2);
    var helmetAngle = FPMath._ifIII(i1, j1);
    if (phys.m_TI > 32768) helmetAngle += 20588;
    drawHelmetFixed(i6, helmetAngle);
  } else {
    strokeFixedSegment(k3, k4, "#000");
    strokeFixedSegment(k4, i5, "#000");
    strokeFixedSegment(i5, k5, "rgb(0,0,128)");
    strokeFixedSegment(k5, k6, "rgb(0,0,128)");
    strokeFixedSegment(k6, i3, "rgb(0,0,128)");
    drawCircle(fixedSpriteToWorld(i6.x), -fixedSpriteToWorld(i6.y), 4);
  }
  drawSteeringFixed(i3);
  drawSteeringFixed(i4);
}

function drawBikerPartFixed(a, b, type, weight) {
  var rawA = { x: a.x * 4, y: a.y * 4 };
  var rawB = { x: b.x * 4, y: b.y * 4 };
  var cx = (((rawB.x * weight) / FP) + ((rawA.x * (FP - weight)) / FP)) / FP;
  var cy = (((rawB.y * weight) / FP) + ((rawA.y * (FP - weight)) / FP)) / FP;
  var angle = angleToRad(FPMath._ifIII(rawB.x - rawA.x, rawB.y - rawA.y)) - Math.PI;
  var image = type === 0 ? assets.arm : type === 1 ? assets.leg : assets.body;
  drawRotated(image, cx, -cy, image.naturalWidth, image.naturalHeight, angle);
}

function drawHelmetFixed(point, angleFixed) {
  var angle = angleToRad(angleFixed) - Math.PI / 2 - (10 * Math.PI) / 180;
  drawRotated(assets.helmet, fixedSpriteToWorld(point.x), -fixedSpriteToWorld(point.y), 12, 12, angle);
}

function drawSteeringFixed(point) {
  drawImage(assets.steering, fixedSpriteToWorld(point.x) - 2.5, -fixedSpriteToWorld(point.y) - 2.5, 5, 5);
}

function strokeFixedSegment(a, b, color) {
  strokeWorldLine(color, fixedSpriteToWorld(a.x), fixedSpriteToWorld(a.y), fixedSpriteToWorld(b.x), fixedSpriteToWorld(b.y));
}

function drawFixedLine(x1, y1, x2, y2) {
  drawWorldLine(fixedSpriteToWorld(x1), fixedSpriteToWorld(y1), fixedSpriteToWorld(x2), fixedSpriteToWorld(y2));
}

function drawCircle(x, y, diameter) {
  ctx.beginPath();
  ctx.arc(x, y, diameter / 2, 0, Math.PI * 2);
  ctx.stroke();
}


function drawArc(x, y, radius, angle) {
  ctx.beginPath();
  // পজিটিভ angle রাখা হলো (দিক ঠিক রাখার জন্য) এবং অফসেট -২.৯৭ করা হলো (ওপরে ফিরিয়ে আনার জন্য)
  var startAngle = angle - 2.97;
  ctx.arc(x, y, radius + 1, startAngle, startAngle - Math.PI / 2, true);
  ctx.stroke();
}

function angleToRad(fixedAngle) {
  return fixedAngle / 0xffff;
}

function mix(a, b, t) {
  return (a * (FP - t) + b * t) / FP;
}

function drawSegment(a, b) {
  ctx.strokeStyle = "#111";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(a.x, a.y);
  ctx.lineTo(b.x, b.y);
  ctx.stroke();
}

function drawPartBetween(a, b, image, w, h, weight) {
  var tVal = weight / FP;
  var x = a.x * (1 - tVal) + b.x * tVal;
  var y = a.y * (1 - tVal) + b.y * tVal;
  var angle = Math.atan2(b.y - a.y, b.x - a.x) - Math.PI;
  drawRotated(image, x, y, w, h, angle);
}

function drawHud() {
  drawProgress();
  drawTimer();
  var timedTitle = state.levelTitle && performance.now() < state.levelTitleUntil ? state.levelTitle : "";
  var text = state.message || timedTitle;
  if (!text) return;
  ctx.fillStyle = hudTextColor();
  ctx.textAlign = "center";
  ctx.font = "48px 'Roboto Condensed Local', Arial, sans-serif";
  ctx.fillText(text, canvas.width / 2, canvas.height * 0.34, canvas.width * 0.84);
  ctx.textAlign = "left";
}

function drawProgress() {
  var progress = Math.min(Math.max(state.phys._tryvI() / FP, 0), 1);
  ctx.fillStyle = "#c4c4c4";
  ctx.fillRect(0, 0, canvas.width, 3);
  ctx.fillStyle = "#29aa27";
  ctx.fillRect(0, 0, Math.round(canvas.width * progress), 3);
}

function drawTimer() {
  var time = Math.floor(state.elapsed / 10);
  var text = Math.floor(time / 6000) + ":" + String(Math.floor(time / 100) % 60).padStart(2, "0") + ":" + String(time % 100).padStart(2, "0");
  ctx.fillStyle = hudTextColor();
  ctx.font = "20px 'Roboto Condensed Local', Arial, sans-serif";
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.fillText(text, 18, 17);
}

function hudTextColor() {
  return "#111";
}

function drawMenu() {
  var width = canvas.width;
  var height = canvas.height;
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, width, height);
  var rows = getMenuRows();
  var metrics = menuMetrics(rows);
  var scale = metrics.scale;
  var contentTop = metrics.contentTop;
  var contentBottom = metrics.contentBottom;
  var rowStep = metrics.rowStep;
  var visibleRows = metrics.visibleRows;
  
  if (state.menuScreen === "main") {
    var ratio = assets.logo.naturalHeight / Math.max(1, assets.logo.naturalWidth);
    var logoWidth = Math.min(180 * scale, width * 0.72, height * 0.46 / ratio);
    var logoHeight = logoWidth * ratio;
    var logoTop = Math.max(26 * scale, height * 0.1);
    ctx.drawImage(assets.logo, width / 2 - logoWidth / 2, logoTop, logoWidth, logoHeight);
  }
  var helpText = state.menuScreen === "helpText";
  ctx.font = ((helpText ? 18 : 22) * scale) + "px 'Roboto Condensed Local', Arial, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  var maxScroll = Math.max(0, rows.length - visibleRows);
  state.menuScroll = clamp(Math.round(state.menuScroll), 0, maxScroll);
  if (state.menuIndex < state.menuScroll) state.menuScroll = state.menuIndex;
  if (state.menuIndex >= state.menuScroll + visibleRows) state.menuScroll = state.menuIndex - visibleRows + 1;
  state.menuScroll = clamp(state.menuScroll, 0, maxScroll);
  state.menuRowStep = rowStep;
  state.menuLayout = [];
  ctx.save();
  ctx.beginPath();
  ctx.rect(0, contentTop - rowStep / 2, width, contentBottom - contentTop + rowStep);
  ctx.clip();
  var arrowX = Math.min(width / 2 - 190 * scale, width * 0.18);
  var rightArrowX = Math.max(width / 2 + 190 * scale, width * 0.82);
  for (var slot = 0; slot < visibleRows; slot += 1) {
    var i = state.menuScroll + slot;
    if (i >= rows.length) break;
    var row = rows[i];
    var y = contentTop + slot * rowStep;
    state.menuLayout.push({ index: i, row: row, top: y - rowStep / 2, bottom: y + rowStep / 2, leftArrow: arrowX, rightArrow: rightArrowX, arrowHitRadius: 28 * scale });
    var selectable = row.type !== "text";
    var selected = selectable && i === state.menuIndex;
    ctx.fillStyle = selected ? "rgb(0,150,0)" : "#111";
    var text = row.label;
    if (row.type === "toggle") text = row.label + ": " + (row.value ? t("on") : t("off"));
    if (row.type === "select") text = row.label + ": " + row.value;
    if (row.type === "name") text = state.playerName.join(" ");
    if (row.type === "toggle" || row.type === "select") {
      ctx.fillText("<", arrowX, y);
      ctx.fillText(">", rightArrowX, y);
    }
    ctx.fillText(text, width / 2, y);
    if (row.type === "name") {
      ctx.fillText("^", width / 2 - 26 * scale + state.nameCursor * 26 * scale, y + 24 * scale);
    }
  }
  ctx.restore();
  if (maxScroll > 0) {
    ctx.fillStyle = "#c8c8c8";
    var barHeight = Math.max(18 * scale, (visibleRows / rows.length) * (contentBottom - contentTop));
    var barTop = contentTop + (state.menuScroll / maxScroll) * Math.max(1, contentBottom - contentTop - barHeight);
    ctx.fillRect(width - 10 * scale, contentTop - rowStep / 2, 2 * scale, contentBottom - contentTop + rowStep);
    ctx.fillStyle = "rgb(0,150,0)";
    ctx.fillRect(width - 11 * scale, barTop, 4 * scale, barHeight);
  }
  if (state.message) {
    ctx.fillStyle = "#111";
    ctx.font = (18 * scale) + "px 'Roboto Condensed Local', Arial, sans-serif";
    if (!state.dailyTrackLoading) ctx.fillText(state.message, width / 2, height - 42 * scale);
  }
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
}

function menuScale(width, height) {
  return clamp(adaptiveZoom(width, height), 0.72, 1.65);
}

function menuMetrics(rows) {
  var width = canvas.width;
  var height = canvas.height;
  var scale = menuScale(width, height);
  var helpText = state.menuScreen === "helpText";
  var rowStepBase = (helpText ? 23 : 32) * scale;
  var contentTop = helpText ? 34 * scale : 48 * scale;
  var contentBottom = height - 30 * scale;
  if (state.menuScreen === "main") {
    var ratio = assets.logo.naturalHeight / Math.max(1, assets.logo.naturalWidth);
    var logoWidth = Math.min(180 * scale, width * 0.72, height * 0.46 / ratio);
    var logoHeight = logoWidth * ratio;
    contentTop = Math.max(26 * scale, height * 0.1) + logoHeight + 34 * scale;
  }
  var available = Math.max(1, contentBottom - contentTop);
  var compactStep = rows.length > 1 ? available / (rows.length - 1) : rowStepBase;
  var allRowsFit = rows.length <= 1 || compactStep >= 20 * scale;
  var rowStep = allRowsFit ? Math.min(rowStepBase, compactStep) : rowStepBase;
  var visibleRows = allRowsFit ? rows.length : clamp(Math.floor(available / rowStep) + 1, 1, rows.length);
  return { scale: scale, contentTop: contentTop, contentBottom: contentBottom, rowStep: rowStep, visibleRows: visibleRows };
}

function drawImage(image, x, y, w, h) {
  ctx.drawImage(image, x, y, w, h);
}

function drawRotated(image, x, y, w, h, angle) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.drawImage(image, -w / 2, -h / 2, w, h);
  ctx.restore();
}

function bestKey(level) {
  return "best:" + level.leagueId + ":" + level.trackId;
}

function bestTime(level) {
  return Number(state.bestTimes[bestKey(level)] || 0);
}

function saveBest(level, time, league, name) {
  if (league === undefined) league = activeBikeLeague();
  if (name === undefined) name = state.playerName.join("");
  var scores = getHighScores(league);
  var entry = { name: normalizeName(name), time: time };
  scores.push(entry);
  scores.sort(function(a, b) { return a.time - b.time; });
  var topScores = scores.slice(0, 3);
  state.scores[scoreKey(league, level)] = topScores;
  if (level && level.trackId === 9999) state.dailyScores = topScores;
  var best = bestTime(level);
  if (!best || time * 10 < best) state.bestTimes[bestKey(level)] = time * 10;
  
  // লোকালস্টোরেজ এ প্রগ্রেস ও হাইস্কোর সংরক্ষণ
  safeStorageSet("gdScores", JSON.stringify(state.scores));
  safeStorageSet("gdBestTimes", JSON.stringify(state.bestTimes));
}

function scoreKey(league, level) {
  if (level === undefined) level = null;
  var scoreLevel = level || (state.dailyTrack ? state.level : null);
  if (scoreLevel && scoreLevel.trackId === 9999) {
    var dailySettings = scoreLevel.settings || {};
    var dailyDate = dailySettings.dailyDate || scoreLevel.dailyDate || new Date().toISOString().slice(0, 10);
    return "scores:daily:" + dailyDate + ":" + league;
  }
  var scoreLeagueId = (scoreLevel ? scoreLevel.leagueId : null);
  var difficulty = isFiniteNumber(Number(scoreLeagueId)) ? Number(scoreLeagueId) : Number(leagueSelect.value);
  var scoreTrackId = (scoreLevel ? scoreLevel.trackId : null);
  var track = isFiniteNumber(Number(scoreTrackId)) ? Number(scoreTrackId) : Number(trackSelect.value);
  return "scores:" + difficulty + ":" + track + ":" + league;
}

function getHighScores(league) {
  if (state.dailyTrack && state.dailyScoresLoaded) return state.dailyScores;
  var scores = state.scores[scoreKey(league)];
  return Array.isArray(scores) ? scores : [];
}

function getScorePlace(league, time) {
  var scores = getHighScores(league);
  for (var place = 0; place < 3; place += 1) {
    if (!scores[place] || scores[place].time > time) return place;
  }
  return 3;
}

function clearAllHighScores() {
  state.scores = {};
  state.bestTimes = {};
  state.standardScoreLoadedKeys = {};
  state.standardScoreLoadingKeys = {};
  safeStorageRemove("gdScores");
  safeStorageRemove("gdBestTimes");
}

function fullReset() {
  clearAllHighScores();
  state.settings = loadSettings();
  state.progress = loadProgress();
  state.bikeLeague = 0;
  state.dailyBikeLeague = 3;
  state.dailyBikeLeagueConfigured = false;
  state.playerName = loadPlayerName();
  leagueSelect.value = "0";
  fillTracks(0);
  trackSelect.value = "0";
  saveProgress();
  loadLevel(0, 0);
  openMenu("main");
}

function formatScore(entry) {
  return entry.name + "  " + formatScoreTime(entry.time);
}

function formatScoreTime(time) {
  var k = Math.floor(time / 100);
  var l = time % 100;
  var min = Math.floor(k / 60);
  var sec = k % 60;
  return String(min).padStart(2, "0") + ":" + String(sec).padStart(2, "0") + "." + String(l).padStart(2, "0");
}
function resultPlayerName() {
  return state.playerName.join("");
}
function normalizeName(name) {
  var normalized = String(name || "AAA").trim();
  if (normalized.length > 3) return normalized.slice(0, 32);
  var initials = normalized.toUpperCase().replace(/[^A-Z ]/g, "").padEnd(3, "A").slice(0, 3);
  return initials.trim().length === 3 ? initials : "AAA";
}

function resize() {
  var rect = canvas.getBoundingClientRect();
  var width = Math.max(1, Math.floor(rect.width));
  var height = Math.max(1, Math.floor(rect.height));
  if (canvas.width === width && canvas.height === height) return;
  canvas.width = width;
  canvas.height = height;
  if (state.phys) state.phys._caseIV(Math.min(width, height));
}

// ES5 এসেট লোডার
function loadAssets(paths) {
  return new Promise(function(resolve, reject) {
    var keys = [];
    for (var key in paths) {
      if (paths.hasOwnProperty(key)) {
        keys.push(key);
      }
    }
    var loaded = {};
    var count = 0;
    if (keys.length === 0) {
      resolve(loaded);
      return;
    }
    function loadImage(k) {
      var image = new Image();
      image.onload = function() {
        loaded[k] = image;
        count++;
        if (count === keys.length) {
          resolve(loaded);
        }
      };
      image.onerror = reject;
      image.src = paths[k];
    }
    for (var i = 0; i < keys.length; i++) {
      loadImage(keys[i]);
    }
  });
}