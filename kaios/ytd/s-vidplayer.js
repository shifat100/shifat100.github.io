
String.prototype.includes = function (str) {
    return this.indexOf(str) !== -1;
}

function showToast(e) { var t = document.createElement("div"); t.classList = "toasttext", t.innerHTML = e, document.body.appendChild(t), setTimeout((function () { document.body.removeChild(t) }), 5e3) }


function playVidBySvid(link, title) {

    showToast('Press 7 To Back');
    document.body.removeEventListener('keydown', keydownlisterner);
    showLoader('Buffering ...');
    var header = document.getElementsByClassName('header')[0];
    var footer = document.getElementsByClassName('footer')[0];
    var f1 = document.querySelectorAll('.footerelement')[0];
    var f2 = document.querySelectorAll('.footerelement')[1];
    var f3 = document.querySelectorAll('.footerelement')[2];
    var app = document.getElementsByClassName('content')[0];
    var scale = 1;
    var rotate = 0;
    var fscreen = 'no';
    var volume = navigator.volumeManager;
    var ispaused = false;
    var tstime = 0;

    header.innerHTML = title;
    app.style = ' top: 25px;bottom: 50px;position: fixed;width: 100%;overflow: hidden;left: 0;background-color: #000;display: flex;justify-content: center;align-items: center;';
    app.innerHTML = `<video id="player" type="video/mp4" autoplay onerror="showLoader('Error To Play Video');">
<source id="vidsrc" src="${link}" type="video/mp4">
</source>
</video><audio id="player1" src="${link}" mozAudioChannelType="alarm"></audio>
<div id="pp"></div>
<div id="details"></div>`;
    f1.innerHTML = 'Fullscreen';
    f2.innerHTML = 'Pause';
    f3.innerHTML = 'Mute';
    var vp = document.querySelector('#player');
    var ap = document.querySelector('#player1');



    function addZero(n) { return n < 10 ? '0' + n : n }

    function zoomIn() { scale += 0.1; vp.style = 'transform: scale(' + scale + ') rotate(' + rotate + 'deg);'; }

    function zoomOut() { scale -= 0.1; vp.style = 'transform: scale(' + scale + ') rotate(' + rotate + 'deg);'; }

    function rotateVid(n) { rotate += n; if (rotate > 360) { rotate = 0; } if (rotate < -360) { rotate = 0; } vp.style = 'transform: scale(' + scale + ') rotate(' + rotate + 'deg);'; }

    function defaultScreen() { scale = 1; rotate = 0; vp.style = 'transform: scale(' + scale + ') rotate(' + rotate + 'deg);'; vp.playbackRate = 1; }

    function openFullScreen() { fscreen = 'yes'; app.style = 'top: 0px; bottom:0px;z-index: 50;display: flex;justify-content: center;align-items: center;background: black;'; rotate = 90; scale = 1.36; vp.style = 'transform: scale(' + scale + ') rotate(' + rotate + 'deg);z-index: 999'; document.querySelectorAll('#details')[0].style = 'display: none;'; header.style.display = 'none'; footer.style.display = 'none'; }

    function exitFullScreen() { fscreen = 'no'; app.style = 'top: 25px;bottom: 50px;position: fixed;width: 100%;overflow: hidden;left: 0;background-color: #000;display: flex;justify-content: center;align-items: center;z-index:0'; rotate = 0; scale = 1; vp.style = 'transform: scale(' + scale + ') rotate(' + rotate + 'deg);'; document.querySelectorAll('#details')[0].style = 'display: block;'; header.style.display = 'block'; footer.style.display = 'flex'; }



    function zero() {
        var e = document.createElement('div');
        e.id = 'zerobar';
        e.style = 'display: flex;position: fixed; top: 0px; left: 0px; width: 100%; height: 100%;background: rgba(0,0,0,0.5); justify-content: center; align-items: center;z-index: 54';
        e.innerHTML = '<div style="background: white; padding: 5px 15px 5px 10px; border-radius: 10px; width: 80%"><a class="zerolist" tabindex="0">Settings</a>';
        document.body.appendChild(e);


        document.querySelectorAll('.zerolist')[0].addEventListener('click', function () { settings(); });


        document.querySelectorAll('.zerolist')[0].focus();
        document.body.removeEventListener('keydown', keydownmain);
        document.body.removeEventListener('keyup', keyupmain);
        document.body.addEventListener('keydown', keydownzero);
    }


    function settings() {
        document.body.removeChild(document.querySelector('#zerobar'));
        var e = document.createElement('div');
        e.id = 'settings';
        e.style = 'display: flex;position: fixed; top: 0px; left: 0px; width: 100%; height: 100%;background: rgba(0,0,0,0.5); justify-content: center; align-items: center;z-index: 55';
        e.innerHTML = '<div style="width: 100%;height:auto; background: white; border-radius: 10px; display: block; padding:10px 5px 5px 7px"><div class="header">Setting</div><div class="content" style="background: white; bottom: 29px;display: block; padding: 20px">Play In Background: <input type="checkbox" id="bgplaybtn" class="focusable" tabindex="0" style="display: inline-block; width: auto;"><div class="footer"><div class="footerelement">Save</div><div class="footerelement">OK</div><div class="footerelement">Back</div></div></div>';
        document.body.appendChild(e);


        var bgplaybtn = document.querySelector('#bgplaybtn');
        bgplaybtn.addEventListener('change', function () {
            if (bgplaybtn.checked == true) {
                localStorage.setItem('bgplay', 'yes');
            } else {
                localStorage.removeItem('bgplay');

            }
        });

        if (localStorage.getItem('bgplay') == 'yes') {
            bgplaybtn.setAttribute('checked', 'check');
        }



        document.querySelectorAll('.focusable')[0].focus();
        document.body.removeEventListener('keydown', keydownzero);
        document.body.addEventListener('keydown', keydownsetting);
    }

    document.body.addEventListener('keydown', keydownmain);
    document.body.addEventListener('keyup', keyupmain);

    function keydownmain(e) {
        if (e.key == 'Enter') { if (vp.paused) { vp.play(); f2.innerHTML = 'Pause'; showToast('Playback Resumed'); ispaused = false; } else { vp.pause(); f2.innerHTML = 'Play'; showToast('Playback Paused'); ispaused = true; } }
        if (e.key == 'ArrowLeft') { vp.currentTime -= 10; }
        if (e.key == 'ArrowRight') { vp.currentTime += 10; }
        if (e.key == 'ArrowUp') { volume.requestUp(); }
        if (e.key == 'ArrowDown') { volume.requestDown(); }
        if (e.key == '1') { vp.playbackRate -= 0.1; showToast('Playback Speed `' + vp.playbackRate.toFixed(1) + 'x`'); }
        if (e.key == '2') { vp.playbackRate = 1; showToast('Playback Speed `' + vp.playbackRate.toFixed(1) + 'x`'); }
        if (e.key == '3') { vp.playbackRate += 0.1; showToast('Playback Speed `' + vp.playbackRate.toFixed(1) + 'x`'); }
        if (e.key == '4') { tstime = new Date().getTime(); }
        if (e.key == '5') { defaultScreen(); showToast('Default Playback'); }
        if (e.key == '6') { tstime = new Date().getTime(); }
        if (e.key == '7') {
            showLoader();
            document.body.removeEventListener('keydown', keydownmain);
            document.body.addEventListener('keydown', keydownlisterner);
            f1.innerHTML = 'Menu';
            f2.innerHTML = 'OK';
            f3.innerHTML = 'Back';
            app.style = 'top: 25px;left: 0px;bottom: 25px;position: fixed;width: 100%;overflow: hidden;font-size: 15px;background: white';
            movieDetails(videoid, videotitle);
        }

        if (e.key == '9') { tstime = new Date().getTime(); }
        if (e.key == '*') { zoomOut(); showToast('Playback Zoom `' + scale.toFixed(1) + 'x`'); }
        if (e.key == '#' || e.key == '/') { zoomIn(); showToast('Playback Zoom `' + scale.toFixed(1) + 'x`'); }
        if (e.key == '0') { zero(); }
        if (e.key == 'SoftLeft' || e.key == 'F1') { if (fscreen == 'yes') { exitFullScreen(); showToast('Closed FullScreen'); } else { openFullScreen(); } }
        if (e.key == 'SoftRight' || e.key == 'F2') { if (vp.muted) { vp.muted = false; f3.innerHTML = 'Mute'; showToast('Video Unmuted'); } else { vp.muted = true; f3.innerHTML = 'Unmute'; showToast('Video Muted'); } }
        if (e.key === 'Call' || e.key == 's') {
            var canvas = document.createElement('canvas');
            canvas.style.display = 'none';
            var context = canvas.getContext('2d');
            canvas.width = vp.videoWidth;
            canvas.height = vp.videoHeight;
            context.fillRect(0, 0, vp.videoWidth, vp.videoHeight);
            context.drawImage(vp, 0, 0, vp.videoWidth, vp.videoHeight);
            document.body.appendChild(canvas);
            var a = document.createElement('a');
            a.href = canvas.toDataURL('image/jpeg');
            a.download = nameFormat(videotitle)+ '_' + new Date().getTime().toString() + '.jpg';
            a.style.display = 'none';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            document.body.removeChild(canvas);
        }
    }

    function keyupmain(e) {
        if (e.key == "4") {
            rotateVid(-10);
        }
        if (e.key == "6") {
            rotateVid(+10);
        }

        if (e.key == '9') {
            if ((new Date().getTime() - tstime) < 1000) {
                var des = window.prompt('Destination (00:00:00)', '00:00:00'); var regexp = /[0-9]\d:[0-9]\d:[0-9]\d/; if (regexp.test(des)) { var h = new Number(des.split(':')[0]); var m = new Number(des.split(':')[1]); var s = new Number(des.split(':')[2]); var cal = (h * 60 * 60) + (m * 60) + s; if (cal < vp.duration) { vp.currentTime = cal; showToast('Video Forwarded To: <b>' + des + '</b>'); } else { showToast('Invalid Destination'); } } else { showToast('Invalid Input Format'); }
            } else { vp.pause(); vp.currentTime = 0; vp.play(); }
        }
    }

    function keydownzero(e) {
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
                document.body.removeChild(document.querySelector('#zerobar'));
                document.body.removeEventListener('keydown', keydownzero);
                document.body.addEventListener('keydown', keydownmain);
                document.body.addEventListener('keyup', keyupmain);
                break;
        }

        function focus(move) {
            var currentIndex = document.activeElement.tabIndex;
            var next = currentIndex + move;
            if (next > document.querySelectorAll('.zerolist').length - 1) { next = 0; } else if (next < 0) { next = document.querySelectorAll('.zerolist').length - 1; }
            var items = document.querySelectorAll('.zerolist');
            var targetElement = items[next];
            targetElement.focus();
            targetElement.scrollIntoView({ block: 'center' });
        }
    }

    function keydownsetting(e) {
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
            case 'SoftLeft':
                document.body.removeChild(document.querySelector('#settings'));
                document.body.removeEventListener('keydown', keydownsetting); document.body.addEventListener('keydown', keydownmain);
                document.body.addEventListener('keyup', keyupmain);
                break;
            case 'F1':
                document.body.removeChild(document.querySelector('#settings'));
                document.body.removeEventListener('keydown', keydownsetting); document.body.addEventListener('keydown', keydownmain);
                document.body.addEventListener('keyup', keyupmain);
                break;
            case 'SoftRight':
                document.body.removeChild(document.querySelector('#settings'));
                document.body.removeEventListener('keydown', keydownsetting);
                document.body.addEventListener('keydown', keydownmain);
                document.body.addEventListener('keyup', keyupmain);
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

    vp.addEventListener('error', function (error) {
        showLoader('Error To Play Video: ' + error.message);
    });
    vp.addEventListener('timeupdate', function () {
        hideLoader();
        var rand = Math.floor(Math.random() * 255) + 100;
        rand = 33;
        document.querySelector('#details').innerHTML = '<table width="100%" style="color: white"><tr><td style="width: 50%;text-align: center">' + (addZero(new Date(vp.currentTime * 1000).getHours() - 6) + ':' + addZero(new Date(vp.currentTime * 1000).getMinutes()) + ':' + addZero(new Date(vp.currentTime * 1000).getSeconds()) + '/' + addZero(new Date(vp.duration * 1000).getHours() - 6) + ':' + addZero(new Date(vp.duration * 1000).getMinutes()) + ':' + addZero(new Date(vp.duration * 1000).getSeconds()) + '</td><td style="width: 50%;text-align: center">' + vp.playbackRate.toFixed(1)) + ' X</td></tr></table>';
        if (fscreen == 'yes') { document.querySelector('#pp').style = 'display:none'; } else { document.querySelector('#pp').style = 'width:' + ((vp.currentTime / vp.duration) * 100 + '%;display: block; padding: 1px 0px;background: rgb(' + (((vp.currentTime / vp.duration) * 100).toFixed(0) * 2.5).toFixed(0) + ',' + (255 - (((vp.currentTime / vp.duration) * 100).toFixed(0) * 2.5).toFixed(0)) + ',' + rand + ');position:fixed; bottom: 49px; left: 0px;z-index: 5;border-right: 5px groove white;'); }
        if (((vp.currentTime / vp.duration) * 100) == 100) {
            vp.pause();
            ispaused = true;
            f2.innerHTML = 'Play';
        }
    });


    if (localStorage.getItem('bgplay') == 'yes') {
        document.addEventListener('visibilitychange', function () {

            if (document.hidden) {
                if (ispaused === false) {
                    vp.pause();
                    console.log('app hided');
                    ap.currentTime = localStorage.getItem(filename);
                    ap.play();
                    ap.addEventListener('timeupdate', function () {
                        localStorage.setItem(filename, ap.currentTime);
                    });
                }
            } else {
                if (ispaused === true) { ap.pause(); vp.pause(); } else {
                    ap.pause();
                    vp.currentTime = localStorage.getItem(filename);
                    vp.play();
                    console.log('app showed');
                }
            }
        });
    }

}
