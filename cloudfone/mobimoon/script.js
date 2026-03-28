// global 
var now = new Date();
var time = now.getTime();
var date = now.getDate();
var month = now.getMonth() + 1;
var year = now.getFullYear();
var day = now.getDay();

// LocalStorage থেকে সেভ করা Offset (তারিখের পরিবর্তন) বের করা, না থাকলে 0 হবে
var hijriOffset = parseInt(localStorage.getItem('hijriOffset')) || 0;

var strgregdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
var strgregmonth = ['', 'January', 'February', 'March', 'April', 'May', 'Jun', 'July', 'August', 'September', 'October', 'November', 'December'];

// functions
function addZero(d) {
    if (d < 10) {
        d = "0" + d;
    }
    return d;
}

// Offset হিসাব করে আজকের নতুন হিজরি তারিখ বের করার ফাংশন
function getAdjustedHijri() {
    var adjustedDate = new Date(now.getTime() + (hijriOffset * 24 * 60 * 60 * 1000));
    return GregorianToHijri(adjustedDate.getDate(), adjustedDate.getMonth() + 1, adjustedDate.getFullYear());
}

// Offset হিসাব করে Important Dates এর জন্য সঠিক ইংরেজি তারিখ বের করার ফাংশন
function getAdjustedEventDate(d, m, y) {
    var std = HijriToGregorian(d, m, y); // স্ট্যান্ডার্ড ক্যালকুলেশন
    var dateObj = new Date(std[2], std[1] - 1, std[0]);
    // হিজরি +1 হলে ইভেন্ট ১ দিন আগে হবে, তাই -hijriOffset করা হলো
    dateObj.setDate(dateObj.getDate() - hijriOffset); 
    
    return '<strong>' + addZero(dateObj.getDate()) + '-' + addZero(dateObj.getMonth() + 1) + '-' + dateObj.getFullYear() + '</strong>';
}

function importantDates() {
    var adjustedHijri = getAdjustedHijri();
    var hmonth = adjustedHijri[1];
    var hyear = adjustedHijri[2];

    var si = '';
    for (var i = 0; i < 4; i++) {
        switch ((hmonth + i) % 13) {
            case 1:
                si += (getAdjustedEventDate(1, 1, hyear) + ':  Awwal Muharram<br>');
                si += (getAdjustedEventDate(10, 1, hyear) + ':  Day of Ashura<br>');
                break;
            case 2:
                si += (getAdjustedEventDate(27, 2, hyear) + ':  Hijrah to Madinah<br>');
                break;
            case 3:
                si += (getAdjustedEventDate(12, 3, hyear) + ':  Birth of Prophet (PBUH)<br>');
                break;
            case 7:
                si += (getAdjustedEventDate(27, 7, hyear) + ':  Israk Mikraj<br>');
                break;
            case 8:
                si += (getAdjustedEventDate(15, 8, hyear) + ':  Nisfu Shabaan<br>');
                break;
            case 9:
                si += (getAdjustedEventDate(1, 9, hyear) + ':  Awal Ramadan<br>');
                si += (getAdjustedEventDate(21, 9, hyear) + ':  Nuzul Quran<br>');
                si += (getAdjustedEventDate(27, 9, hyear) + ':  Lailatul Qadar<br>');
                break;
            case 10:
                si += (getAdjustedEventDate(1, 10, hyear) + ':  Eidul-Fitri<br>');
                break;
            case 12:
                si += (getAdjustedEventDate(10, 12, hyear) + ':  Eidul-Adha<br>');
                break;
        }
    }
    document.getElementById('content').innerHTML = '<div style="padding: 5px">' + si + '</div>';

    // Event Listeners
    document.body.removeEventListener('keyup', keydownformain);
    document.body.removeEventListener('keyup', keydownforsettings);
    document.body.addEventListener('keyup', keydownforimportantdates);
    
    // UI Update
    document.getElementsByClassName('header')[0].innerHTML = 'Important Dates';
    var footers = document.getElementsByClassName('footerelement');
    footers[0].innerHTML = 'Main';
    footers[0].onclick = moonPhase;
    footers[1].innerHTML = ' ';
    footers[1].onclick = null;
    footers[2].innerHTML = ' ';
    footers[2].onclick = null;
}

function moonPhase() {
    var adjustedHijri = getAdjustedHijri();
    var moonp = moonphase(date, now.getMonth(), year);
    
    var imgMoon = ['/b1.png', '/b2.png', '/b3.png', '/b4.png', '/b5.png', '/b6.png', '/b7.png', '/b8.png'];
    var strPhase = ['New Moon', 'Waxing Cresent', 'First Quarter', 'Waxing Gibbous', 'Full Moon', 'Waning Gibbous', 'Third Quarter', 'Waning Cresent'];
    
    var si = ('<center><span class="main">' + strPhase[moonp] + '<br><br><img src="res' + imgMoon[moonp] + '"/></span><br><br>' + strgregdays[day] + ', ' + adjustedHijri[0] + ' ' + adjustedHijri[3] + ' ' + adjustedHijri[2] + '<br>' + strgregdays[day] + ', ' + date + ' ' + strgregmonth[month] + ' ' + year + '</center>');

    document.getElementById('content').innerHTML = si;

    // Event Listeners
    document.body.removeEventListener('keyup', keydownforimportantdates);
    document.body.removeEventListener('keyup', keydownforsettings);
    document.body.addEventListener('keyup', keydownformain);
    
    // UI Update
    document.getElementsByClassName('header')[0].innerHTML = 'Mobimoon';
    var footers = document.getElementsByClassName('footerelement');
    footers[0].innerHTML = 'I. Dates';
    footers[0].onclick = importantDates;
    footers[1].innerHTML = 'Settings';
    footers[1].onclick = settingsPage;
    footers[2].innerHTML = 'Exit';
    footers[2].onclick = exit;
}

// ----------------------------------------------------
// Settings ফিচার (হিজরি তারিখ -2 থেকে +2 পরিবর্তন)
// ----------------------------------------------------
var tempOffset = hijriOffset;

function settingsPage() {
    tempOffset = hijriOffset;
    updateSettingsUI();

    document.body.removeEventListener('keyup', keydownformain);
    document.body.removeEventListener('keyup', keydownforimportantdates);
    document.body.addEventListener('keyup', keydownforsettings);

    document.getElementsByClassName('header')[0].innerHTML = 'Settings';

    var footers = document.getElementsByClassName('footerelement');
    footers[0].innerHTML = 'Back';
    footers[0].onclick = moonPhase;
    footers[1].innerHTML = 'Save';
    footers[1].onclick = saveSettings;
    footers[2].innerHTML = '';
    footers[2].onclick = null;
}

function updateSettingsUI() {
    var displayOffset = (tempOffset > 0) ? "+" + tempOffset : tempOffset;
    var si = '<div style="padding: 10px; text-align: center;">';
    si += '<h3 style="margin-top:0;">Adjust Hijri Date</h3>';
    si += '<p style="font-size:11px;">Use Left/Right to adjust<br>Press Enter to save.</p>';
    si += '<div style="font-size: 22px; font-weight: bold; margin: 20px 0;">';
    si += '<span onclick="changeTempOffset(-1)" style="padding:5px 10px; border:1px solid #000; cursor:pointer; background:#eee;">&lt;</span> ';
    si += '<span style="display:inline-block; width:50px;">' + displayOffset + '</span> ';
    si += '<span onclick="changeTempOffset(1)" style="padding:5px 10px; border:1px solid #000; cursor:pointer; background:#eee;">&gt;</span>';
    si += '</div></div>';
    document.getElementById('content').innerHTML = si;
}

function changeTempOffset(val) {
    tempOffset += val;
    if (tempOffset > 2) tempOffset = 2;   // সর্বোচ্চ +2 
    if (tempOffset < -2) tempOffset = -2; // সর্বনিম্ন -2
    updateSettingsUI();
}

function saveSettings() {
    hijriOffset = tempOffset;
    localStorage.setItem('hijriOffset', hijriOffset);
    moonPhase(); // সেভ করে মেইন পেজে ফিরে যাওয়া
}

// ----------------------------------------------------
// কীবোর্ড/বাটন ইভেন্ট (Keyboard Navigation)
// ----------------------------------------------------
function keydownformain(e) {
    switch (e.key) {
        case 'Escape':
        case 'SoftLeft': importantDates(); break;
        case 'Enter': settingsPage(); break;
        case 'SoftRight': exit(); break;
    }
}

function keydownforimportantdates(e) {
    switch (e.key) {
        case 'Escape':
        case 'SoftLeft': moonPhase(); break;
    }
}

function keydownforsettings(e) {
    switch (e.key) {
        case 'Escape':
        case 'SoftLeft': moonPhase(); break; // সেভ না করে বের হওয়া
        case 'ArrowLeft': changeTempOffset(-1); break; // বামে চাপলে কমবে
        case 'ArrowRight': changeTempOffset(1); break; // ডানে চাপলে বাড়বে
        case 'Enter': saveSettings(); break; // সেভ করা
    }
}

function exit() {
    window.close();
    }
