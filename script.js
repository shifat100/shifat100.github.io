// Global Variables
var toolNames = [];
var categoryNames = [];
var root;

// Safe DB Parsing
try {
    root = JSON.parse(db);
    var tool = root['root'];
    for (var i = 0; i < tool.length; i++) {
        if (categoryNames.includes(tool[i]['category']) === false) {
            categoryNames.push(tool[i]['category']);
        }
        toolNames.push(tool[i]['title']);
    }
} catch (e) {
    console.error("Database (db.js) not found or invalid JSON.");
}

function pad(n) {
    return (n < 10) ? ('0' + n) : n;
}

var app = document.getElementById('container');

function checkNet() {
    // Net check logic (Optional)
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

function gup(name, loc) { 
    name = name.replace(/[\[]/, '\\\[').replace(/[\]]/, '\\\]'); 
    var regexS = '[\\?&]' + name + '=([^&#]*)'; 
    var regex = new RegExp(regexS); 
    var results = regex.exec(loc); 
    if (results == null) return ''; else return results[1]; 
}

function showFilterLoader() { 
    document.getElementById('filterresult').innerHTML = '<br><center><img src ="icon/ajax-loader.gif" width="30px"><br> Searching...</center>'; 
}

// Mouse position tracker
document.addEventListener('mousemove', function (e) {
    var mp = document.getElementById('mousepos');
    if(mp) mp.innerHTML = ('X: ' + e.clientX + '<br>Y: ' + e.clientY);
});

if(document.getElementById('menubtn')){
    document.getElementById('menubtn').addEventListener('click', function () {
        document.getElementById('rightmenubar').style.display = 'block';
        document.getElementsByClassName('rightbar')[0].style.display = 'block';
    });
}

if(document.getElementById('rightmenubar')){
    document.getElementById('rightmenubar').addEventListener('click', closeRightBar);
}

function categories() {
    document.title = 'Categories - Shifat100 Tools';
    if (categoryNames.length > 0) {
        app.innerHTML = '<center><h2> - Categories - </h2></center>';
        for (var i = 0; i < categoryNames.length; i++) {
            app.innerHTML += ('<center><div class="list" style="padding: 20px; display: inline-block; width: auto; margin: 15px;cursor: pointer"><a onclick="tools(\'' + categoryNames[i] + '\'); showLoader();" class="subtitle"><icon class="fa fa-folder-open"></icon>  ' + categoryNames[i] + '</a></div></center>');
        }
    } else {
        app.innerHTML = '<center><h1 style="color: red"> No Category Found ... </h1></center>';
    }
    setTimeout(function () { hideLoader(); }, 1000);
}

function tools(category) {
    document.title = category + ' Tools - Shifat100';
    if (category) {
        app.innerHTML = '<div class="closebar" style="text-align: left;"><div class="closebtn" onclick="categories();showLoader();" style="width: 100px"><font style="font-weight: bolder;font-size: 24px">&#8672;</font> <font style="font-size:16px">Back</font></div></div><center><h1> - ' + category + ' - </h1></center>';
        for (var i = 0; i < tool.length; i++) {
            if (tool[i]['category'].toLowerCase() == category.toLowerCase()) {
                app.innerHTML += ('<center><div class="list"><a onclick="executeTool(\'' + tool[i]['file'] + '\')" class="subtitle"><i class="fa fa-unlink"></i>  ' + tool[i]['title'] + '</a><br><br><post style="font-size: 16px">' + tool[i]['description'] + '</post></div></center>');
            }
        }
    } else {
        // Fallback for all tools
        app.innerHTML = '<center><h1> - All Tools - </h1></center>';
        // ... loop logic
    }
    setTimeout(function () { hideLoader(); }, 1000);
}

function filterTool(q) {
    var qtr = 0;
    if (q == '') { lastupdate(); }
    else {
        document.getElementById('filterresult').innerHTML = "You Searched For &nbsp; <b>&apos; " + q + " &apos;</b> .<br><br>";
        for (var i = 0; i < tool.length; i++) {
            if (tool[i]['title'].toLowerCase().indexOf(q.toLowerCase()) != -1 || tool[i]['description'].toLowerCase().indexOf(q.toLowerCase()) != -1) {
                qtr++;
                document.getElementById('filterresult').innerHTML += ('<center><div class="srchlist" onclick="executeTool(\'' + tool[i]['file'] + '\')"><i class="fa fa-file"></i>&nbsp;&nbsp;' + tool[i]['title'].replace(q, '<b style="color: red">' + q + '</b>') + '<br><small style="color:#aaa;">' + tool[i]['description'] + '</small></div></center>');
            }
        }
        setTimeout(function () {
            if (qtr < 1) {
                document.getElementById('filterresult').innerHTML = "<br><center>No Result Found ...</center>";
            }
            hideLoader();
        }, 500);
    }
}

function main() {
    if (gup('act', window.location.href) == 'cat') { categories(); }
    else if (gup('t', window.location.href) != '') {
        executeTool(gup('t', window.location.href));
    }
    else {
        // Default homepage text is now handled in HTML for SEO. 
        // We only replace it if necessary or leave it as the "Static SEO Content"
        // If you want JS to overwrite it, uncomment below:
        // categories(); 
    }
}

function alert(char) {
    var e = document.createElement('div');
    e.classList = 'alert';
    e.style = "position:fixed; top:30%; left:50%; transform:translate(-50%, -50%); background:white; border:1px solid #ccc; padding:20px; z-index:100; box-shadow:0 0 10px rgba(0,0,0,0.5); text-align:center; border-radius:8px;";
    e.innerHTML = '<center><i class="fa fa-info-circle" style="font-size: 30px; color:#007bff"></i><br><br>' + char + '<br><hr><button class="alertbtn" style="padding:5px 20px; cursor:pointer;">OK</button></center>';
    document.body.appendChild(e);
    e.querySelector('.alertbtn').addEventListener('click', function () {
        document.body.removeChild(e);
    });
}

function executeTool(t) {
    // Clear old scripts
    if (document.querySelector('#tscript')) { 
        var scripts = document.querySelectorAll('#tscript');
        scripts.forEach(s => s.remove());
    }

    function fetchAndExtractFile(zipUrl, targetFileName) {
        showLoader(); // Show loader while fetching
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
                                var e = document.createElement('script');
                                e.id = 'tscript';
                                e.textContent = content;
                                document.body.appendChild(e);
                                hideLoader();
                                closeRightBar();
                            });
                        } else {
                            alert('Tool file missing inside ZIP.');
                            hideLoader();
                        }
                    })
                    .catch(function () {
                        alert('Error reading tool file.');
                        hideLoader();
                    });
            } else {
                alert('Tool not found on server.');
                hideLoader();
            }
        };
        xhr.send();
    }

    var zipUrl = t;
    fetchAndExtractFile(zipUrl, 'script.js');
}

function about() {
    var content = '<div class="centerall" id="aboutbar" style="position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);z-index:20;display:flex;align-items:center;justify-content:center;">\
    <div class="whitebox" style="background:white;padding:30px;border-radius:10px;width:300px;position:relative;">\
    <span style="position:absolute;top:10px;right:15px;font-size:20px;cursor:pointer;font-weight:bold;" onclick="closewhitebox()">×</span>\
    <h3>About Shifat100</h3>\
    <p>A free online tools website.</p>\
    <small>Version: 1.0<br>Email: alshahreya95@gmail.com</small>\
    </div></div>';
    
    var d = document.createElement('div');
    d.innerHTML = content;
    document.body.appendChild(d.firstChild);
}

function closewhitebox() {
    var el = document.getElementById('aboutbar');
    if(el) el.remove();
}

function lastupdate() {
    var xhttp = new XMLHttpRequest();
    xhttp.onload = function () {
        var resultDiv = document.getElementById('filterresult');
        if(resultDiv) {
             resultDiv.innerHTML = '<br><center> Search any tool above </center>';
        }
    }
    xhttp.open('GET', 'script.js', true);
    xhttp.send();
}

// Service Worker (Optional)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(err => console.log('SW failed', err));
  });
}
