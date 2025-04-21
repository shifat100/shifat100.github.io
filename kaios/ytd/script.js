if (!String.prototype.includes) {
    String.prototype.includes = function (search, start) {
        if (typeof start !== 'number') {
            start = 0;
        }
        if (start + search.length > this.length) {
            return false;
        }
        return this.indexOf(search, start) !== -1;
    };
}
var domParser = new DOMParser();
var header = document.getElementsByClassName('header')[0];
var f1 = document.querySelectorAll('.footerelement')[0];
var f2 = document.querySelectorAll('.footerelement')[1];
var f3 = document.querySelectorAll('.footerelement')[2];
var app = document.getElementsByClassName('content')[0];
var tmpf3 = '';
var tmpf2 = '';
var funcindex = 0;
var searchquery = 'kaios';
var videoid = '';
var videotitle = '';
var lastvisit = new Number(localStorage.getItem('lastvisit'));
var imgsrc = '';
var vidduration = '';

String.prototype.includes = function (str) {
    return this.indexOf(str) !== -1;
}

function showToast(e) { var t = document.createElement("div"); t.classList = "toasttext", t.innerHTML = e, document.body.appendChild(t), setTimeout((function () { document.body.removeChild(t) }), 5e3) }

function elem(name, attr, content, listener) {
    var el = document.createElement(name);
    if (attr) for (var atr in attr) el.setAttribute(atr, attr[atr]);
    if (content) for (var con in content) el[con] = content[con];
    if (listener) for (var lis in listener) el.addEventListener(lis, listener[lis]);
    return el;
}
var iframe = elem('iframe', {
    mozbrowser: true,
    mozallowfullscreen: true,
    remote: true,
    frameborder: 0,
    hidden: true,
    src: 'about:blank',
    style: 'display:none',
    name: 'main'
}, { id: 'iframe' });
document.body.appendChild(iframe);
window.iframe = iframe;

function KaiDownloader(url, savename) {
    if (savename != '') {
        iframe.download(url, { filename: savename });
    } else {
        if (url.split('/').pop().length < 1) {
            var urx = new URL(url), name = urx.hostname;
            iframe.download(url, { filename: name });
        } else {
            iframe.download(url);
        }
    }
    showToast('Download Started Successfully');
}

function nameFormat(str) {
    var s = str.split('|');
    var r = '';
    s.forEach(e => {
        r += e;
    });
    return r.replace(/ /gi, '-').replace(/]/gi, '-').replace(/\[/gi, '-').replace(/\,/gi, '-').replace(/\?/gi, '-');

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

function showLoader(str) {
    if (document.body.querySelector('#loadingbar')) {
        document.body.removeChild(document.body.querySelector('#loadingbar'));
    }
    var el = document.createElement('div');
    el.id = 'loadingbar';
    el.style = 'display: flex;width: 100%; height: 100%; position: fixed; top: 0px;left: 0px;align-items: center; justify-content: center;background-color: transpharent;z-index: 999';
    if (str == null) { el.innerHTML = '<div style="display: inline-block; padding: 12px; background: white; font-weight: bold;border: 1px solid #ddd;">Loading...'; } else {
        el.innerHTML = '<div style="display: inline-block; padding: 12px; background: white; font-weight: bold;border: 1px solid #ddd;">' + str;
    }
    document.body.appendChild(el);
}

function hideLoader() {
    if (document.body.querySelector('#loadingbar')) {
        document.body.removeChild(document.body.querySelector('#loadingbar'));
    }
}



function videoList(key, sort = 'r') {

    funcindex = 1;
    header.innerHTML = key;
    app.innerHTML = '';
    f3.innerHTML = 'Back';
    var xhr = new XMLHttpRequest({ mozSystem: true });
    xhr.open('GET', 'https://loverbd.site/search/' + key.replace(/ /gi,'+'));
    xhr.send();
    xhr.onload = function () {
        hideLoader();
        console.log(this.responseText);
        var e = domParser.parseFromString(this.responseText, 'text/html');
        var array = e.querySelectorAll('.fl');
        var linksarray = e.querySelectorAll('.fl > a');
        var imgarray = e.querySelectorAll('div.fl > a > div > div > img');
        if (array.length == 0) { app.innerHTML = '<center>No Result</center>'; } else {
            for (var i = 0; i < array.length; i++) {
                app.innerHTML += '<div id="timelinelink" data-href="' + linksarray[i] + '" data-name="' + linksarray[i].innerText + '" data-imgsrc="'+imgarray[i].src+'" class="focusable" tabindex="' + i + '"><img src="' + imgarray[i].src + '" width="150px"> ' + linksarray[i].innerText + '</div>';
            };
            for (var k = 0; k < document.querySelectorAll('#timelinelink').length; k++) {
                document.querySelectorAll('#timelinelink')[k].addEventListener('click', function () {
                    showLoader();
                    imgsrc = this.getAttribute('data-imgsrc');
                    movieDetails(this.getAttribute('data-href'), nameFormat(this.getAttribute('data-name')));
                });
            }
        }
    }
    xhr.onerror = function (e) {
        alert(e.message);
    }

}


function movieDetails(id, name) {
    videoid = id.split('s-video.dl/tube/')[1].split('/')[0];  
    console.log(videoid);
  
    videotitle = name;
    funcindex = 2;
    header.innerHTML = name;
    f3.innerHTML = 'Back';
    app.innerHTML = '<img id="thumb" width="100%" class="focusable" tabindex="0"><br><big>'+name+'</big>';
    app.innerHTML += '<div id="dllink" class="focusable" tabindex="1" style="font-weight: bold"><img src="icons/56.png" width="20px">  Download 360p</div>';
    document.getElementById('thumb').src = imgsrc;
    document.querySelectorAll('#dllink')[0].addEventListener('click', function () { showLoader(); dlytVid(videoid,name); });
    document.querySelectorAll('#dllink')[0].addEventListener('focus', function () { f2.innerHTML = 'OK'; });
    document.getElementById('thumb').addEventListener('focus', function () { f2.innerHTML = 'Play'; });
    document.getElementById('thumb').addEventListener('click', function () { showLoader(); playVid(videoid); });
    hideLoader();

    // var xhr = new XMLHttpRequest({ mozSystem: true });
    // xhr.open('GET', 'https://tube.loverbd.com/dl/videos/' + videoid + '/' + name);
    // xhr.send();
    // xhr.onload = function () {
    //     hideLoader();
    //     var e = domParser.parseFromString(this.responseText, 'text/html');
    //     var linksarray = e.querySelectorAll('.shadow-xl');
    //     var thumb = e.querySelector('img').src;
    //     var details = e.querySelector('div[align=left]').innerHTML;
    //     if (details == '') { details = '<center><big>This Video Is Not Available</big></center>'; }

    //     app.innerHTML += '<div style="padding: 5px 8px; background: #aaa; display: block; Width: 100%">' + details + '</div>';
    //     app.innerHTML += '<div id="dllink" data-href="' + linksarray[i] + '" class="focusable" tabindex="1" style="font-weight: bold"><img src="icons/56.png" width="20px">  Download Orginal</div>';

    //     // for (var i = 0; i < linksarray.length; i++) {
    //     //     app.innerHTML += '<div id="dllink" data-href="' + linksarray[i] + '" class="focusable" tabindex="' + (i + 2) + '">' + linksarray[i].innerHTML + '</div>';
    //     // };
    //     for (var k = 1; k < document.querySelectorAll('#dllink').length; k++) {
    //         // document.querySelectorAll('#dllink')[k].addEventListener('click', function () {
    //         //     var l = this.getAttribute('data-href').split('ytdl')[1];
    //         //     window.open('https://tube.loverbd.com/ytdl' + l, '_blank');
    //         //     //window.open('https://tube.loverbd.com/ytdl' + l, 'newTab');
    //         // });
    //         document.querySelectorAll('#dllink')[k].addEventListener('focus', function () { f2.innerHTML = 'OK'; });
    //     }
    //     document.querySelectorAll('#dllink')[0].addEventListener('click', function () {showLoader(); dlytVid(id.replace(/https:\/\/loverbd.site\/tube\//, '').replace(/loverbd.site\/tube\//, '').replace('/tube/', '').split('/')[0]); });
    //     document.querySelectorAll('#dllink')[0].addEventListener('focus', function () { f2.innerHTML = 'OK'; });

    //     document.getElementById('thumb').src = thumb;
    //     document.getElementById('thumb').addEventListener('focus', function () { f2.innerHTML = 'Play'; });
    //     document.getElementById('thumb').addEventListener('click', function () { showLoader(); playVid(id.replace(/https:\/\/video.genyt.net\//, '').replace(/https:\/\/video.genyt.xyz\//, '')); });
    // }
    // xhr.onerror = function (e) {
    //     alert(e.message);
    // }

}




document.body.addEventListener('keydown', keydownlisterner);

function keydownlisterner(e) {
    switch (e.key) {
        case 'ArrowDown':
            focus(1);
            break;
        case 'ArrowUp':
            focus(-1);
            break;
        case 'Down':
            focus(1);
            break;
        case 'Up':
            focus(-1);
            break;
        case 'Enter':
            if (navigator.onLine) {
                document.activeElement.click();
            } else {
                alert('No Internet Connection');
            }
            break;
        case 'SoftRight':
            showLoader();
            goBack();
            break;
        case 'f2':
            showLoader();
            goBack();
            break;
        case 'SoftLeft':
            openmenubar();
            break;
        case 'f1':
            openmenubar();
            break;
    }



    function focus(move) {
        var currentIndex = document.activeElement.tabIndex;
        var next = currentIndex + move;
        if (next > document.querySelectorAll('.focusable').length - 1) { next = 0; } else if (next < 0) { next = document.querySelectorAll('.focusable').length - 1; }
        var items = document.querySelectorAll('.focusable');
        var targetElement = items[next];
        targetElement.focus();
        targetElement.scrollIntoView({ block: 'center' });
    }

}
function keydownmenubar(e) {
    switch (e.key) {
        case 'ArrowUp':
            focus(-1);
            break;
        case 'ArrowDown':
            focus(1);
            break;
        case 'Enter':
            if (document.activeElement.tabIndex == '0') {
                window.location.reload();
            } else {
                window.close();
            }
            break;
        case 'F2':
            closemenubar();
            break;
        case 'SoftRight':
            closemenubar();
            break;
    }

    function focus(move) {
        var currentIndex = document.activeElement.tabIndex;
        var next = currentIndex + move;
        if (next > document.querySelectorAll(".menuelement").length - 1) {
            next = 0;
        } else if (next < 0) {
            next = document.querySelectorAll(".menuelement").length - 1;
        }
        var items = document.querySelectorAll('.menuelement');
        var targetElement = items[next];
        targetElement.focus();

    }
}

function goBack() {
    if (funcindex == 0) {
        window.close();
    }
    if (funcindex == 1) {
        window.location.reload();
    }
    if (funcindex == 2) {
        showLoader();
        videoList(searchquery);
    }
}





if (navigator.onLine) {
} else {
    alert('No Internet Connection');
}



document.addEventListener('DOMContentLoaded', () => {
    getKaiAd({
        publisher: '080b82ab-b33a-4763-a498-50f464567e49',
        app: 'videodownloader',
        slot: 'videodownloader',
        onerror: (err) => console.error('Custom catch:', err),
        onready: (ad) => {
            ad.call('display');
        },
    });
});



setInterval(function () {
    if (document.querySelectorAll('iframe').length < 3) {
        getKaiAd({
            publisher: '080b82ab-b33a-4763-a498-50f464567e49',
            app: 'videodownloader',
            slot: 'videodownloader',
            onerror: (err) => console.error('Custom catch:', err),
            onready: (ad) => {
                ad.call('display');
            },
        });
    } else {
        console.log('the ad already displayed');
    }
}, 10000);


function showValx(data) {
    if (data.length > 0) {
        document.querySelector('.searchsuggestion').innerHTML = '';
        document.querySelector('.searchsuggestion').style = 'visibility:visible';

        for (var i = 0; (i < 10); i++) {
            var x = document.createElement('div');
            x.classList = 'focusable';
            x.tabIndex = (i + 1);
            x.innerHTML = data[i];
            x.addEventListener('focus', function () {
                document.querySelector('#search').value = this.innerText;
            });
            x.addEventListener('click', function () {
                showLoader();
                searchquery = this.innerText;
                videoList(searchquery.replace(/ /gi,'+'));
            });
            document.querySelector('.searchsuggestion').appendChild(x);
        }
    }
}

document.querySelector('#search').addEventListener('input', function (e) {
    var dt = [];
    var xhr = new XMLHttpRequest({ mozSystem: true });
    xhr.open('GET', 'https://www.google.com/complete/search?client=android&hl=en&q=' + this.value, true);
    xhr.responseType = 'text';
    xhr.onload = (e) => {
        var arx = JSON.parse(e.currentTarget.response);
        arx[1].forEach(el => {
            dt.push(el);
        });
        showValx(dt);
    },
        xhr.onerror = (err) => { showValx(dt) },
        xhr.send();
});


document.querySelector('#search').addEventListener('keyup', function (e) {
    if (e.key == 'Enter') {
        showLoader();
        searchquery = this.value;
        videoList(searchquery);
    }
});


function playVid(id) {
    console.log(id);
    function catchYoutubeURI(vgtor, uri) {
        var arr = new URL(uri).search.split('&'), vdoId = arr[0].split('=')[1];
        if (uri.includes('/shorts/')) {
            vdoId = uri.split('/').pop().split('?')[0];
        }
        var body = JSON.stringify({ "playbackContext": { "contentPlaybackContext": { "html5Preference": "HTML5_PREF_WANTS" } }, "contentCheckOk": true, "racyCheckOk": true, "videoId": vdoId, "context": { "client": { "hl": "en", "timeZone": "UTC", "utcOffsetMinutes": 0, "clientName": "ANDROID_VR", "clientVersion": "1.60.19", "deviceMake": "Oculus", "deviceModel": "Quest 3", "androidSdkVersion": 32, "userAgent": "com.google.android.apps.youtube.vr.oculus/1.60.19 (Linux; U; Android 12L; eureka-user Build/SQ3A.220605.009.A1) gzip", "osName": "Android", "osVersion": "12L" } } });
        var xhr = new XMLHttpRequest({ mozSystem: true });
        xhr.open('POST', "https://www.youtube.com/youtubei/v1/player?prettyPrint=false", true);
        xhr.setRequestHeader("accept", "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8");
        xhr.setRequestHeader("accept-encoding", "gzip, deflate, br");
        xhr.setRequestHeader("accept-language", "en-us,en;q=0.5");
        xhr.setRequestHeader("connection", "keep-alive");
        xhr.setRequestHeader("content-type", "application/json");
        xhr.setRequestHeader("host", "www.youtube.com");
        xhr.setRequestHeader("origin", "https,//www.youtube.com");
        xhr.setRequestHeader("sec-fetch-mode", "navigate");
        xhr.setRequestHeader("x-youtube-client-name", 28);
        xhr.setRequestHeader("x-youtube-client-version", "1.60.19");
        xhr.setRequestHeader("x-goog-visitor-id", vgtor);
        xhr.setRequestHeader("user-agent", "com.google.android.apps.youtube.vr.oculus/1.60.19 (Linux; U; Android 12L; eureka-user Build/SQ3A.220605.009.A1) gzip");
        xhr.responseType = 'json';
        xhr.onload = (e) => {
            var result = e.currentTarget.response.streamingData;
            console.log(result);
            playVidBySvid(result.formats[0].url, result.title);
        },
            xhr.onerror = (err) => { ytDnLink = 'nai: ' + err },
            xhr.send(body);
    }

    function catchYoutubeURL(url) {
        var xhr = new XMLHttpRequest({ mozSystem: true });
        xhr.open('GET', url, true);
        xhr.responseType = 'text';
        xhr.onload = (e) => {
            var vgtor = /"VISITOR_DATA":\s*"([^"]+)"/.exec(e.currentTarget.response)[1];
            catchYoutubeURI(vgtor, url);
        },
            xhr.onerror = (err) => { ytDnLink = 'nai: ' + err },
            xhr.send();
    }

    catchYoutubeURL('https://www.youtube.com/watch?v=' + id);

}

function dlytVid(id) {
    function catchYoutubeURI(vgtor, uri) {
        var arr = new URL(uri).search.split('&'), vdoId = arr[0].split('=')[1];
        if (uri.includes('/shorts/')) {
            vdoId = uri.split('/').pop().split('?')[0];
        }
        var body = JSON.stringify({ "playbackContext": { "contentPlaybackContext": { "html5Preference": "HTML5_PREF_WANTS" } }, "contentCheckOk": true, "racyCheckOk": true, "videoId": vdoId, "context": { "client": { "hl": "en", "timeZone": "UTC", "utcOffsetMinutes": 0, "clientName": "ANDROID_VR", "clientVersion": "1.60.19", "deviceMake": "Oculus", "deviceModel": "Quest 3", "androidSdkVersion": 32, "userAgent": "com.google.android.apps.youtube.vr.oculus/1.60.19 (Linux; U; Android 12L; eureka-user Build/SQ3A.220605.009.A1) gzip", "osName": "Android", "osVersion": "12L" } } });
        var xhr = new XMLHttpRequest({ mozSystem: true });
        xhr.open('POST', "https://www.youtube.com/youtubei/v1/player?prettyPrint=false", true);
        xhr.setRequestHeader("accept", "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8");
        xhr.setRequestHeader("accept-encoding", "gzip, deflate, br");
        xhr.setRequestHeader("accept-language", "en-us,en;q=0.5");
        xhr.setRequestHeader("connection", "keep-alive");
        xhr.setRequestHeader("content-type", "application/json");
        xhr.setRequestHeader("host", "www.youtube.com");
        xhr.setRequestHeader("origin", "https,//www.youtube.com");
        xhr.setRequestHeader("sec-fetch-mode", "navigate");
        xhr.setRequestHeader("x-youtube-client-name", 28);
        xhr.setRequestHeader("x-youtube-client-version", "1.60.19");
        xhr.setRequestHeader("x-goog-visitor-id", vgtor);
        xhr.setRequestHeader("user-agent", "com.google.android.apps.youtube.vr.oculus/1.60.19 (Linux; U; Android 12L; eureka-user Build/SQ3A.220605.009.A1) gzip");
        xhr.responseType = 'json';
        xhr.onload = (e) => {
            hideLoader();
            var result = e.currentTarget.response.streamingData;
            try { KaiDownloader(result.formats[0].url, result.title); } catch (e) { alert('KaiDownloader error: ' + e.message); }
        },
            xhr.onerror = (err) => { ytDnLink = 'nai' },
            xhr.send(body);
    }

    function catchYoutubeURL(url) {
        var xhr = new XMLHttpRequest({ mozSystem: true });
        xhr.open('GET', url, true);
        xhr.responseType = 'text';
        xhr.onload = (e) => {
            var vgtor = /"VISITOR_DATA":\s*"([^"]+)"/.exec(e.currentTarget.response)[1];
            catchYoutubeURI(vgtor, url);
        },
            xhr.onerror = (err) => { ytDnLink = 'nai' },
            xhr.send();
    }

    catchYoutubeURL('https://www.youtube.com/watch?v=' + id);

}

