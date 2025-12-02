
var toolNames = [];
var categoryNames = [];

var root = JSON.parse(db);
var tool = root['root'];
for (var i = 0; i < tool.length; i++) {
    if (categoryNames.includes(tool[i]['category']) === false) {
        categoryNames.push(tool[i]['category']);
    }
    toolNames.push(tool[i]['title']);
}

function pad(n) {
    return (n < 10) ? ('0' + n) : n;
}

var app = document.getElementById('container');

function checkNet() {
    // var e = document.createElement('div');
    // e.id = 'netcheck';
    // e.style = 'display: flex; position: fixed; width: 100%; height: 100%; left: 0px; top: 0px; background: rgba(0,0,0,0.5); align-items: center; justify-content: center;z-index: 5';
    // e.innerHTML = '<div style="background: white; padding: 20px;border-radius: 15px"><center><img src="icon/nonet.png" width="60px"><br><br>No Internet</center></div>';
    // setInterval(function () { if (!navigator.onLine) { document.body.appendChild(e); } else { if (document.getElementById('netcheck')) { document.body.removeChild(e); } } }, 1000);
}

function showLoader() {
    var e = document.createElement('div');
    e.id = 'loader';
    e.style = 'display: flex; position: fixed; width: 100%; height: 100%; left: 0px; top: 0px; background: rgba(0,0,0,0.5); align-items: center; justify-content: center;z-index: 4';
    e.innerHTML = '<div style="background: white; padding: 20px;border-radius: 15px"><center>Loading...</center></div>';
    document.body.appendChild(e);
}

function hideLoader() {
    if (document.getElementById('loader')) { document.body.removeChild(document.getElementById('loader')); }

}


function closeRightBar() {
    document.getElementById('rightmenubar').style.display = 'none';
    document.getElementsByClassName('rightbar')[0].style.display = 'none';
}

function gup(name, loc) { name = name.replace(/[\[]/, '\\\[').replace(/[\]]/, '\\\]'); var regexS = '[\\?&]' + name + '=([^&#]*)'; var regex = new RegExp(regexS); var results = regex.exec(loc); if (results == null) return ''; else return results[1]; }




function showFilterLoader() { document.getElementById('filterresult').innerHTML = '<br><center><img src ="icon/ajax-loader.gif" width="30px"><br> Searching...</center>'; }


document.addEventListener('mousemove', function (e) {
    document.getElementById('mousepos').innerHTML = ('X: ' + e.clientX + '<br>Y: ' + e.clientY);
});

document.getElementById('mousepos').addEventListener('pointerover', function () {
    this.style.display = 'none';
});
document.getElementById('mousepos').addEventListener('click', function () {
    this.style.display = 'none';
});
document.getElementById('mousepos').addEventListener('pointerout', function () {
    this.style.display = 'block';
});

document.getElementById('menubtn').addEventListener('click', function () {
    document.getElementById('rightmenubar').style.display = 'block';
    document.getElementsByClassName('rightbar')[0].style.display = 'block';
});

document.getElementById('rightmenubar').addEventListener('click', function () {
    document.getElementById('rightmenubar').style.display = 'none';
    document.getElementsByClassName('rightbar')[0].style.display = 'none';
});


function categories() {
    document.title = 'Categories - ' + window.location.hostname.replace('www.', '').split('.')[0];
    document.getElementById('pagetitle').content = document.title;
    if (categoryNames.length > 0) {
        document.getElementById('container').innerHTML = '<center><h2> - Categories - </h2></center>';
        for (var i = 0; i < categoryNames.length; i++) {
            document.getElementById('container').innerHTML += ('<center><div class="list" style="padding: 20px; display: inline-block; width: auto; margin: 15px;cursor: pointer"><a onclick="tools(\'' + categoryNames[i] + '\'); showLoader();" class="subtitle"><icon class="fa fa-folder-open"></icon>  ' + categoryNames[i] + '</a> <post style="font-size: 16px">  </post>  </div></center>');
        }
    } else {
        document.getElementById('container').innerHTML = '<center><h1 style="color: red"> No Category Found ... </h1></center>';
    }
    setTimeout(function () { hideLoader(); }, 1000);
}


function tools(category) {
    document.title = 'Tools - ' + window.location.hostname.replace('www.', '').split('.')[0];
    document.getElementById('pagetitle').content = document.title;

    if (category) {
        document.getElementById('container').innerHTML = '<div class="closebar" style="text-align: left;"><div class="closebtn" onclick="categories();showLoader();" style="width: 100px"><font style="font-weight: bolder;font-size: 24px">&#8672;</font> <font style="font-size:16px">Back</font></div></div><center><h1> - ' + category + ' - </h1></center>';
        for (var i = 0; i < tool.length; i++) {
            if (tool[i]['category'].toLowerCase() == category.toLowerCase()) {
                document.getElementById('container').innerHTML += ('<center><div class="list"><a onclick="executeTool(\'' + tool[i]['file'] + '\')" class="subtitle"><i class="fa fa-unlink"></i>  ' + tool[i]['title'] + '</a><br><br><post style="font-size: 16px">' + tool[i]['description'] + '</post></div></center>');
            }
            toolNames.push(tool[i]['title']);
        }

        //return 'Tools In \' ' + category + ' \' Category';
    } else {
        document.getElementById('container').innerHTML = '<div class="closebar" style="text-align: left;"><div class="closebtn" onclick="categories();showLoader();" style="width: 100px"><font style="font-weight: bolder;font-size: 24px">&#8672;</font> <font style="font-size:16px">Back</font></div></div><center><h1> - All Tools - </h1></center>';
        for (var i = 0; i < tool.length; i++) {
            document.getElementById('container').innerHTML += ('<center><div class="list"><a onclick="executeTool(\'' + tool[i]['file'] + '\')" class="subtitle"><i class="fa fa-unlink"></i>  ' + tool[i]['title'] + '</a><br><br><post style="font-size: 16px">' + tool[i]['description'] + '</post></div></center>');
        }
    }
    setTimeout(function () { hideLoader(); }, 1000);
}




function filterTool(q) {

    qtr = 0;
    if (q == '') { lastupdate(); }
    else {
        document.getElementById('filterresult').innerHTML = "You Searched For &nbsp; <b>&apos; " + q + " &apos;</b> .<br><br>";
        for (var i = 0; i < tool.length; i++) {
            if (tool[i]['title'].toLowerCase().indexOf(q.toLowerCase()) != -1 || tool[i]['description'].toLowerCase().indexOf(q.toLowerCase()) != -1) {
                qtr++;
                document.getElementById('filterresult').innerHTML += ('<center><div class="srchlist" onclick="executeTool(\'' + tool[i]['file'] + '\')"><i class="fa fa-file"></i>&nbsp;&nbsp;' + tool[i]['title'].replace(q, '<b style="color: red">' + q + '</b>') + '<br><post style="font-size: 14px;color:#aaa;padding-left: 20px;">' + tool[i]['description'].toLowerCase().replace(q, '<b style="color: red">' + q + '</b>') + '</post></div></center>');
            }
        }
        setTimeout(function () {
            if (qtr < 1) {
                document.getElementById('filterresult').innerHTML = "<br><center>No Result Found ...</center>";
            }
            hideLoader();
        }, 1000);
    }

    //return 'Search Result For " ' + q + ' "';
}

function main() {
    if (gup('act', window.location.href) == 'cat') { categories(); }
    else if (gup('t', window.location.href) != '') {
        executeTool(gup('t', window.location.href));
    }
    else {
        document.title = window.location.hostname.replace('www.', '').split('.')[0];
        document.getElementById('pagetitle').content = document.title;

        hideLoader();
        app.innerHTML = '<div class="box" style="display: block"><div class="boxcontent"><strong> What is ' + window.location.hostname.replace('www.', '').split('.')[0] + ' ? </strong> <br>  <u>ans:</u><i> ' + window.location.hostname.replace('www.', '').split('.')[0] + ' is Free online tools site. there are 100+ tools are available here.</i> <br><br><strong>Is it Free ?</strong><br> <u>ans:</u><i> Yes it is Totally free. There is no service charge available For any tool. </i><br><br>     <strong>Can i make app for my mobile from this website ?</strong><br><u>ans:</u><i> Yes, You Can Make App For Your KaiOS , J2ME and Cloud Phones From this website.</i><br><br><strong>How Hard To Make App From This Site ?</strong><br>  <u>ans:</u><i> Very Easy Just Give Your Application Details And Upload essential File And Click Create Button Then Download Your File.</i><br><br>   <strong>which types of tools are available in this site?</strong><br> <u>ans:</u><i> there all types of tool <n style="color: brown">(app maker, website maker, utility tools)</n> are available in this site.</i><br><br>  <strong>Can i send any app source to you?</strong><br><u>ans:</u> <i>yes. using our contact us box you can send us your app source link.</i><br><br><br><center><div style="position:relative"><button class="strtbtn" onclick="categories();showLoader();">Execute App</button></div></center></div></div>';
        // return 'Main Function Executed';
    }
}


function alert(char) {
    var e = document.createElement('div');
    e.classList = 'alert';
    e.innerHTML = '<center><i class="fa fa-info-circle" style="font-size: 30px"></i><br><br>' + char + '<br><hr><button class="alertbtn">OK</button></center>';
    document.body.appendChild(e);
    e.querySelector('.alertbtn').addEventListener('click', function () {
        document.body.removeChild(e);
    });

    // return 'Alert \'' + char + '\' Executed';
}

function executeTool(t) {
    if (document.querySelector('#tscript')) { for (var i = 0; i < document.querySelectorAll('#tscript').length; i++) { document.body.removeChild(document.querySelectorAll('#tscript')[i]); } }

    function fetchAndExtractFile(zipUrl, targetFileName) {
        var zip = new JSZip();
        var xhr = new XMLHttpRequest();
        xhr.open('GET', 'tools/' + zipUrl + '.zip', true);
        xhr.responseType = 'arraybuffer';

        xhr.onload = function () {
            if (xhr.status === 200) {
                zip.loadAsync(xhr.response)
                    .then(function (zip) {
                        if (zip.files[targetFileName]) {
                            zip.files[targetFileName].async('text').then(function (content) {
                                console.log('Content of', targetFileName, ':\n', content);

                                var e = document.createElement('script');
                                e.id = 'tscript';
                                e.textContent = content;
                                document.body.appendChild(e);

                            });
                        } else {
                            console.error(`File '${targetFileName}' not found in the ZIP archive.`);
                        }
                    })
                    .catch(function () {
                        alert('Not a valid ZIP file');
                    });
            } else {
                alert('Invalid Tool Link');
                tools();
                console.error('Failed to fetch ZIP file. Status:', xhr.status);
            }
        };

        xhr.onerror = function () {
            console.error('Error during XMLHttpRequest.');
        };

        xhr.send();
    }


    var zipUrl = t;
    var targetFileName = 'script.js';
    fetchAndExtractFile(zipUrl, targetFileName);
    closeRightBar();
}

function about() {
    app.innerHTML += '<div class="centerall" id="aboutbar"><div class="whitebox"><span style="display: inline-flex; align-items: center; justify-content: center; font-size: large;font-weight: bolder;float: right; cursor: pointer; width: 18px; height: 18px;" onclick="closewhitebox(document.querySelector(\'#aboutbar\'))">&times;</span>\
\
a tools website by shifat100<br><br>\
<small>version: 1.00\
email: alshahreya95@gmail.com\
phone: 01755555555</small>\
</div></div>';
}

function closewhitebox(el) {
    app.removeChild(el);
}

function lastupdate() {
    var xhttp = new XMLHttpRequest();
    xhttp.onload = function () {
        var d = new Date(this.getResponseHeader("Last-Modified"));
        var fd = pad(d.getDate()) + '-' + pad(d.getMonth() + 1) + '-' + d.getFullYear();

        document.getElementById('filterresult').innerHTML = '<br><center> Last Update: <b>' + d + '</b></center>';
    }
    xhttp.open('GET', 'script.js', true);
    xhttp.send();
}

lastupdate();
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(reg => console.log('Service Worker Registered!', reg))
      .catch(err => console.log('Service Worker registration failed', err));
  });
}


