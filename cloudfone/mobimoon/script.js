

//global 
var now = new Date();
var time = now.getTime();
var date = now.getDate();
var month = now.getMonth()+1;
var year = now.getFullYear();
var day = now.getDay();
var hmonth = GregorianToHijri(date,month,year)[1];
var hyear = GregorianToHijri(date,month,year)[2];





var strgregdays= ['Sunday','Monday','Thesday','Wednesday','Thursday','Friday','Saturday'];
var strgregmonth = ['','January', 'February', 'March', 'April', 'May', 'Jun', 'July', 'August', 'September', 'October', 'Novmber', 'December'];








//functions
function addZero(d) {
  if (d < 10) {
    d = "0"+d;
}
return d;
}



function importantDates() { 

console.log('hijri month is '+hmonth);
var si='';
for (var i = 0; i < 4; i++) {
  console.log('(hmonth + i) % 13 is ' + (hmonth + i) % 13);

  switch ((hmonth + i) % 13) {
    case 1:
     si += ('<strong>'+addZero(HijriToGregorian(1, 1, hyear)[0])+'-'+addZero(HijriToGregorian(1, 1, hyear)[1])+ '-'+addZero(HijriToGregorian(1, 1, hyear)[2])+'</strong>:  Awwal Muharram<br>');
     si += ('<strong>'+addZero(HijriToGregorian(10, 1, hyear)[0])+'-'+addZero(HijriToGregorian(10, 1, hyear)[1])+ '-'+addZero(HijriToGregorian(10, 1, hyear)[2])+'</strong>:  Day of Ashura<br>');
      break;
    case 2:
    si += ('<strong>'+addZero(HijriToGregorian(27, 2, hyear)[0])+'-'+addZero(HijriToGregorian(27, 2, hyear)[1])+ '-'+addZero(HijriToGregorian(27, 2, hyear)[2])+'</strong>:  Hijrah to Madinah<br>');
      break;
    case 3:
    si += ('<strong>'+addZero(HijriToGregorian(12, 3, hyear)[0])+'-'+addZero(HijriToGregorian(12, 3, hyear)[1])+ '-'+addZero(HijriToGregorian(12, 3, hyear)[2])+'</strong>:  Birth of Prophet Muhammad (PBUH)<br>');
      break;
    case 7:
    si += ('<strong>'+addZero(HijriToGregorian(27, 7, hyear)[0])+'-'+addZero(HijriToGregorian(27, 7, hyear)[1])+ '-'+addZero(HijriToGregorian(27, 7, hyear)[2])+'</strong>:  Israk Mikraj<br>');
    break;
    case 8:
    si += ('<strong>'+addZero(HijriToGregorian(15, 8, hyear)[0])+'-'+addZero(HijriToGregorian(15, 8, hyear)[1])+ '-'+addZero(HijriToGregorian(15, 8, hyear)[2])+'</strong>:  Nisfu Shabaan<br>');
    break;
    case 9:
    si += ('<strong>'+addZero(HijriToGregorian(1, 9, hyear)[0])+'-'+addZero(HijriToGregorian(1, 9, hyear)[1])+ '-'+addZero(HijriToGregorian(1, 9, hyear)[2])+'</strong>:  Awal Ramadan<br>');
    si += ('<strong>'+addZero(HijriToGregorian(21, 9, hyear)[0])+'-'+addZero(HijriToGregorian(21, 9, hyear)[1])+ '-'+addZero(HijriToGregorian(21, 9, hyear)[2])+'</strong>:  Nuzul Quran<br>');
    si += ('<strong>'+addZero(HijriToGregorian(27, 9, hyear)[0])+'-'+addZero(HijriToGregorian(27, 9, hyear)[1])+ '-'+addZero(HijriToGregorian(27, 9, hyear)[2])+'</strong>:  Lailatul Qadar<br>');
    break;
    case 10:
    si += ('<strong>'+addZero(HijriToGregorian(1, 10, hyear)[0])+'-'+addZero(HijriToGregorian(1, 10, hyear)[1])+ '-'+addZero(HijriToGregorian(1, 10, hyear)[2])+'</strong>:  Eidul-Fitri<br>');
      break;
    case 12:
    si += ('<strong>'+addZero(HijriToGregorian(10, 12, hyear)[0])+'-'+addZero(HijriToGregorian(10, 12, hyear)[1])+ '-'+addZero(HijriToGregorian(10, 12, hyear)[2])+'</strong>:  Eidul-Adha<br>');
     break;
  }
}
document.getElementById('content').innerHTML='<div style="padding: 5px">'+si+'</span>';
document.body.addEventListener('keyup', keydownforimportantdates);
document.body.removeEventListener('keyup', keydownformain);
document.getElementsByClassName('header')[0].innerHTML = 'Important Dates';
document.getElementsByClassName('footerelement')[0].innerHTML = 'Back';
document.getElementsByClassName('footerelement')[1].innerHTML = ' ';
document.getElementsByClassName('footerelement')[2].innerHTML = ' ';
}



function moonPhase() {
var moonp = moonphase(date,now.getMonth(), year);
console.log(moonp);
var imgMoon = ['/b1.png','/b2.png','/b3.png','/b4.png','/b5.png','/b6.png','/b7.png','/b8.png'];
var strPhase = ['New Moon','Waxing Cresent','First Quarter','Waxing Gibbous','Full Moon','Waning Gibbous','Third Quarter','Waning Cresent'];
var si = ('<center><span class="main">'+strPhase[moonp]+'<br><br><img src="res'+imgMoon[moonp]+'"/></span><br><br>'+strgregdays[day]+', '+GregorianToHijri(date, month, year)[0]+' '+GregorianToHijri(date, month, year)[3]+' '+GregorianToHijri(date, month, year)[2]+'<br>'+strgregdays[day]+', '+date+' '+strgregmonth[month]+' '+year+'</center>');

document.getElementById('content').innerHTML=si;
document.body.addEventListener('keyup', keydownformain);
document.body.removeEventListener('keyup', keydownforimportantdates);
document.getElementsByClassName('header')[0].innerHTML = 'Mobimoon';

document.getElementsByClassName('footerelement')[0].innerHTML = 'I. Dates';
document.getElementsByClassName('footerelement')[1].innerHTML = '';
document.getElementsByClassName('footerelement')[2].innerHTML = 'Exit';
}


function keydownformain(e) {
  switch(e.key) {
    case 'Escape': importantDates(); break;
  }
}

function keydownforimportantdates(e) {
  switch(e.key) {
    case 'Escape': moonPhase(); break;
  }
}


function exit() {
  window.close();
}


// console.log(
//   `%c 🌙 %c MobiMoon `,
//   'background: #446adb; color: #fff; padding: 0.5em 0;',
//   'background: #5144db; color: #fff; padding: 0.5em 0;',
// );
