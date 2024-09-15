var domParser = new DOMParser();
var header = document.getElementsByClassName('header')[0];
var f1 = document.querySelectorAll('.footerelement')[0];
var f2 = document.querySelectorAll('.footerelement')[1];
var f3 = document.querySelectorAll('.footerelement')[2];
var app = document.getElementsByClassName('content')[0];
var tmpf3 = '';
var tmpf2 = '';
var funcindex = 0;
var lastlink = '';


String.prototype.includes = function (str) {
    return this.indexOf(str) !== -1;
}

function openmenubar() {
    tmpf3 = f3.innerHTML;
    tmpf2 = f2.innerHTML;
    document.getElementById('menubar').style.display = 'block';
    document.querySelectorAll('.menuelement')[0].focus();
    f2.innerHTML = 'OK';
    f3.innerHTML = 'Back';
    document.body.removeEventListener('keydown', keydownlisterner);
    document.body.addEventListener('keydown', keydownmenubar);
}
function closemenubar() {
    document.getElementById('menubar').style.display = 'none';
    document.body.removeEventListener('keydown', keydownmenubar);
    document.body.addEventListener('keydown', keydownlisterner);
    f3.innerHTML = tmpf3;
    f2.innerHTML = tmpf2;
}

function showLoader() {
    if (document.body.querySelector('#loadingbar')) {
        document.body.removeChild(document.body.querySelector('#loadingbar'));
    }
    var el = document.createElement('div');
    el.id = 'loadingbar';
    el.style = 'display: flex;width: 100%; height: 100%; position: fixed; top: 0px;left: 0px;align-items: center; justify-content: center;background-color: transpharent;';
    el.innerHTML = '<div style="display: inline-block; padding: 12px; background: white; font-weight: bold;border: 1px solid #ddd;">Loading...';
    document.body.appendChild(el);
}

function hideLoader() {
    if (document.body.querySelector('#loadingbar')) {
        document.body.removeChild(document.body.querySelector('#loadingbar'));
    }
}

function timeLine() {
    funcindex = 0;
    header.innerHTML = 'Last Updates';
    app.innerHTML = '';
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://api.codetabs.com/v1/proxy?quest=' + server);
    xhr.send();
    xhr.onload = function () {
        hideLoader();
        var e = domParser.parseFromString(this.responseText, 'text/html');
        var array = e.querySelectorAll('.updates');
        var linksarray = e.querySelectorAll('.updates > * > a');
        for (var i = 0; i < array.length; i++) {
            app.innerHTML += '<a onclick="showLoader(); movieDetails(\'' + linksarray[i] + '\')" class="focusable" tabindex="' + i + '"><img src="icons/folder.png" width="15px"> ' + array[i].innerHTML.split('<b>')[1].split('</b>')[0] + '</a>';

        };

    }
}

function categories() {
    funcindex = 1;

    header.innerHTML = 'Categories';
    app.innerHTML = '';
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://api.codetabs.com/v1/proxy?quest=' + server);
    xhr.send();
    xhr.onload = function () {
        hideLoader();
        var e = domParser.parseFromString(this.responseText, 'text/html');
        var array = e.querySelectorAll('.catRow > * >  a');
        for (var i = 0; i < array.length; i++) {
            app.innerHTML += '<a onclick="showLoader(); movieList(\'' + array[i].href + '\')" class="focusable" tabindex="' + i + '"> <img src="icons/folder.png" width="15px"> ' + array[i].innerHTML + '</a>';

        };
    }
}


function movieList(link, page = 1) {
    funcindex = 2;
localStorage.setItem('movielistpage', page);
    header.innerHTML = 'Movies';
    app.innerHTML = '';
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://api.codetabs.com/v1/proxy?quest=' + link + '?page=' + page);
    xhr.send();
    xhr.onload = function () {
        hideLoader();
        var e = domParser.parseFromString(this.responseText, 'text/html');
        var array = e.querySelectorAll('.catRow > * >  a');
        var str = 'Last ';
        var pages = Array.prototype.slice.call(e.getElementsByTagName('a')).filter(el => el.textContent.includes(str));
        var lastpage = new Number(pages[(pages.length - 1)].href.split('page=')[1]);

        for (var i = 0; i < array.length; i++) {
            app.innerHTML += '<a onclick="localStorage.setItem(\'lastlink\',\'' + link + '\'); showLoader(); movieDetails(\'' + array[i].getAttribute('href') + '\')" class="focusable" tabindex="' + i + '"><img src="icons/video.png" width="15px">  ' + array[i].innerHTML + '</a>';

        };
        if (page == 1) { app.innerHTML += '<center><a onclick="showLoader(); movieList(\'' + link + '\',2)" class="focusable" tabindex="' + array.length + '">Next >></a></center>'; }
        if (page == lastpage) { app.innerHTML += '<center><a onclick="showLoader(); movieList(\'' + link + '\',' + (page - 1) + ')" class="focusable" tabindex="' + array.length + '"><< Prev</a></center>'; }
        else if (page > 1 && page < lastpage) { app.innerHTML += '<center><a onclick="showLoader(); movieList(\'' + link + '\',' + (page - 1) + ')" class="focusable" tabindex="' + array.length + '"><< Prev</a><a onclick="showLoader(); movieList(\'' + link + '\',' + (page + 1) + ')" class="focusable" tabindex="' + ((array.length) + 1) + '">Next >></a></center>'; }


    }
}

function movieDetails(link) {
    funcindex = 3;

    header.innerHTML = 'Movie Details';
    app.innerHTML = '';
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://api.codetabs.com/v1/proxy?quest=' + link);
    xhr.send();
    xhr.onload = function () {
        hideLoader();
        var e = domParser.parseFromString(this.responseText, 'text/html');
        var poster = e.querySelector('.posterss');
        var menuinfos = e.querySelectorAll('.menu_info');
        var array = e.querySelectorAll('.catRow > * >  a font[color=red]');
        var arraylinks = e.querySelectorAll('.catRow > * >  a');
        var sizes = e.querySelectorAll('.catRow > * >  a > b');
        var images = e.querySelectorAll('img');

        app.innerHTML += '<center><br><img src="' + poster.src + '" style="width: 150px; height: 200px" onerror="this.src=\'icons/error_thumb.png\'" class="focusable" tabindex="0"></center>';

        for (var j = 0; j < menuinfos.length; j++) {
            app.innerHTML += '<div class="focusable" tabindex="' + (j + 1) + '">' + menuinfos[j].innerHTML;
        }
        app.innerHTML += '</center><div style="background: #ddd"><big><strong>Links</strong></big></div>';
        for (var i = 0; i < array.length; i++) {
            app.innerHTML += '<a onclick="localStorage.setItem(\'lastlink\',\'' + link + '\'); showLoader(); selectQuality(\'' + arraylinks[i].href + '\')" class="focusable" tabindex="' + ((i + 1) + menuinfos.length) + '"><img src="icons/video.png" width="15px"> ' + array[i].innerText + '<b>' + sizes[i].innerHTML + '</b></a>';

        };

    }
}

function selectQuality(link) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://api.codetabs.com/v1/proxy?quest=' + link);
    xhr.send();
    xhr.onload = function () {

        var e = domParser.parseFromString(this.responseText, 'text/html');
        var link = e.querySelector('.fastdl > a[rel=nofollow]').getAttribute('href');
        serverLinks(link);
    }

}

function serverLinks(link) {
    funcindex = 4;;

    header.innerHTML = 'Download Links';
    app.innerHTML = '';
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://api.codetabs.com/v1/proxy?quest=' + link);
    xhr.send();
    xhr.onload = function () {
        hideLoader();
        var e = domParser.parseFromString(this.responseText, 'text/html');
        var array = e.querySelectorAll('.fastdl > a[rel=nofollow]');
        var esize = e.querySelectorAll('.menu_info > div.category')[2];
        for (var i = 0; i < array.length; i++) {
            app.innerHTML += '<a onclick="window.open(\'' + array[i].getAttribute('href') + '\', \'newtab\', \'width=240,height=320\')" class="focusable" tabindex="' + i + '"><img src="icons/server.png" width="15px"> ' + 'Download From Server ' + (i + 1) + '</a>';
        };
    }
}



document.body.addEventListener('keydown', keydownlisterner);

function keydownlisterner(e) {
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
        case 'SoftRight': goBack();
            break;
        case 'f2': goBack();
            break;
        case 'SoftLeft': openmenubar();
            break;
        case 'f1': openmenubar();
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
function keydownmenubar(e) {
    switch (e.key) {
        case 'ArrowUp': focus(-1); break;
        case 'ArrowDown': focus(1); break;
        case 'Enter': document.activeElement.click(); break;
        case 'F2': closemenubar(); break;
        case 'SoftRight': closemenubar(); break;
    }

    function focus(move) {
        var currentIndex = document.activeElement.tabIndex;
        var next = currentIndex + move;
        if (next > document.querySelectorAll('.menuelement').length - 1) { next = 0; } else if (next < 0) { next = document.querySelectorAll('.menuelement').length - 1; }
        var items = document.querySelectorAll('.menuelement');
        var targetElement = items[next];
        targetElement.focus();

    }
}

function goBack() {
  if (funcindex == 0 && funcindex == 1) {
    showLoader();
    window.close();
  } 
   if (funcindex == 2) {
    showLoader();
    funcindex = 1;
    categories();
  } 
  if (funcindex == 3) {
    showLoader();
    funcindex = 2;
    movieList(localStorage.getItem("lastlink"),localStorage.getItem("movielistpage"));
  }
 
  if (funcindex == 4) {
    showLoader();
    funcindex = 3;
    movieDetails(localStorage.getItem("lastlink"));
  }
}






if (navigator.onLine) {
      } else {
        alert('No Internet Connection');
      }



document.addEventListener('DOMContentLoaded', () => {

categories();


document.body.addEventListener('keyup', () => { getKaiAd({ publisher: '080b82ab-b33a-4763-a498-50f464567e49', app: 'moviedownloader', slot: 'moviedownloader', onerror: err => console.error('Custom catch:', err), onready: ad => { ad.call('display'); } }); });
