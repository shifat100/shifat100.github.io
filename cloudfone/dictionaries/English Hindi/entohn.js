
var app = document.getElementById('app');
var userinput = document.getElementById('userinput');
var f1 = document.querySelectorAll('.footerelement')[0];
var f2 = document.querySelectorAll('.footerelement')[1];
var f3 = document.querySelectorAll('.footerelement')[2];
var loader = document.getElementById('loader');


function alert(msg="alertbox") { 
document.body.innerHTML+=('<div style="position:fixed; left:0px;bottom:0px;background:#e9e9e9;display:block;width:100%"><div style="padding: 10px;font-weight: bold">'+msg+'</div><div style="text-align:center;display:block;padding:5px; background:black; color: #e9e9e9">OK</div></div>');
 document.body.addEventListener('keydown', function(){window.location.reload();});
 }

var xhttp = new XMLHttpRequest();
xhttp.onload = function () {
    if (xhttp.readyState == 4 && xhttp.status == 200) {

        loader.style.display = 'none';
        userinput.addEventListener('input', function () {
            if (userinput.value != '') {
                filter(xhttp.responseText, userinput.value);
            }
        });
        f1.innerHTML = 'About';
        f3.innerHTML = 'Back';
        document.querySelectorAll('.focusable')[0].focus();
        document.body.removeEventListener('keydown', keydownwordlist);
        document.body.addEventListener('keydown', keydownmain);
    } else {
        //alert('something error');
    }
}
xhttp.open('GET', 'data.json', true);
xhttp.send();



function filter(json_data, key) {
    app.innerHTML = '';
    loader.style.display = 'flex';

    var json = JSON.parse(json_data);
    var firstlangwords = Object.keys(json);
    var secondlangwords = Object.values(json);
    var matchedfirstlangwords = new Array();
    var matchedsecondlangwords = new Array();
    var morefirstlangwords = new Array();
    var moresecondlangwords = new Array();

    for (var i = 0; i < firstlangwords.length; i++) {
        if (firstlangwords[i].toLowerCase() == key.toLowerCase()) {
            matchedfirstlangwords.push(firstlangwords[i]);
            matchedsecondlangwords.push(secondlangwords[i]);
        }
        if (firstlangwords[i].toLowerCase().startsWith(key.toLowerCase()) == true && firstlangwords[i].toLowerCase() != key.toLowerCase()) {
            morefirstlangwords.push(firstlangwords[i]);
            moresecondlangwords.push(secondlangwords[i]);
        }
    }

    var filteredfirstlangwords = matchedfirstlangwords.concat(morefirstlangwords);
    var filteredsecondlangwords = matchedsecondlangwords.concat(moresecondlangwords);

    if (filteredfirstlangwords.length > 0) {
        if (filteredfirstlangwords.length > 100) {
            for (var j = 0; j < 100; j++) {
                app.innerHTML += '<div class="word focusable" tabindex="' + (j + 1) + '" speakword="' + filteredfirstlangwords[j] + '">' + filteredfirstlangwords[j] + ' = ' + filteredsecondlangwords[j] + '</div>';

            }
        } else {
            for (var j = 0; j < filteredfirstlangwords.length; j++) {
                app.innerHTML += '<div class="word focusable" tabindex="' + (j + 1) + '" speakword="' + filteredfirstlangwords[j] + '">' + filteredfirstlangwords[j] + ' = ' + filteredsecondlangwords[j] + '</div>';

            }
        }
    } else {
        app.innerHTML = '<font color="red" style="weight: bold"><center><br><br>No Word Found ...</center></font>';
    }

    for (var k = 0; k < document.querySelectorAll('.word').length; k++) {
        document.querySelectorAll('.word')[k].addEventListener('click', function () { speak(this.getAttribute('speakword')); });

    }


    f1.innerHTML = 'Search';
    f3.innerHTML = 'Clear';
    loader.style.display = 'none';
    document.querySelectorAll('.focusable')[1];
    document.body.removeEventListener('keydown', keydownmain);
    document.body.addEventListener('keydown', keydownwordlist);
}


function keydownwordlist(e) {
    switch (e.key) {
        case 'ArrowDown': focus(1);
            break;
        case 'ArrowUp': focus(-1);
            break;
        case 'Down': focus(1);
            break;
        case 'Up': focus(-1);
            break;
        case 'Enter': document.activeElement.click();
            break;
        case 'SoftRight':
            app.innerHTML = '';
            userinput.value = '';
            document.querySelectorAll('.focusable')[0].focus();
            f1.innerHTML = 'About';
            f3.innerHTML = 'Back';
            document.body.removeEventListener('keydown', keydownwordlist);
            document.body.addEventListener('keydown', keydownmain);
            break;
        case 'F2':
            app.innerHTML = '';
            userinput.value = '';
            document.querySelectorAll('.focusable')[0].focus();
            f1.innerHTML = 'About';
            f3.innerHTML = 'Back';
            document.body.removeEventListener('keydown', keydownwordlist);
            document.body.addEventListener('keydown', keydownmain);
            break;
        case 'Escape': document.querySelectorAll('.focusable')[0].focus();
            break;
        case 'F1': document.querySelectorAll('.focusable')[0].focus();
            break;
    }




    function focus(move) {
        var currentIndex = document.activeElement.tabIndex;
        var next = currentIndex + move;
        if (next > document.querySelectorAll('.focusable').length - 1) { next = 0; } else if (next < 0) { next = document.querySelectorAll('.focusable').length - 1; }
        var items = document.querySelectorAll('.focusable');
        var targetElement = items[next];
        targetElement.focus();
    }

}


function keydownmain(e) {
    switch (e.key) {
        case 'ArrowDown': focus(1);
            break;
        case 'ArrowUp': focus(-1);
            break;
        case 'Down': focus(1);
            break;
        case 'Up': focus(-1);
            break;
        case 'Enter': document.activeElement.click();
            break;
        case 'SoftRight': window.location.href='/index.html';
            break;
        case 'F2': window.location.href='/index.html';
            break;
        case 'Escape': alert('A Dictionary App By Shifat100');
            break;
        case 'F1': alert('A Dictionary App By Shifat100');
            break;
    }




    function focus(move) {
        var currentIndex = document.activeElement.tabIndex;
        var next = currentIndex + move
        if (next > document.querySelectorAll('.focusable').length - 1) { next = 0; } else if (next < 0) { next = document.querySelectorAll('.focusable').length - 1; }
        var items = document.querySelectorAll('.focusable');
        var targetElement = items[next];
        targetElement.focus();
    }
}

document.body.addEventListener('resize', function () {
    console.log('Width: ' + window.innerWidth + '\nHeight: ' + window.innerHeight);
});


function speak(word) {
    var synth = window.speechSynthesis;
    var speakText = new SpeechSynthesisUtterance(word);
    synth.speak(speakText);
}


document.body.addEventListener("keyup", () => { getKaiAd({
    publisher: '080b82ab-b33a-4763-a498-50f464567e49',
    app: 'English-Hindi-Dictionary',
    slot: 'English-Hindi-Dictionary',
    onerror: err => console.error('Custom catch:', err),
    onready: ad => {
      // Ad is ready to be displayed
      // calling 'display' will display the ad
      ad.call('display');
    }
  })
  });
