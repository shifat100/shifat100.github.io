function GregorianToHijri(d, m, y) {
    var str = ["NIL","Muharram","Safar","Rabi al-awwal","Rabi al-thani ","Jum. al-awwal ","Jum. al-thani ","Rajab","Shaaban","Ramadan","Shawwal","Dhu al-Qi'dah","Dhu al-Hijjah"];

    if ((y > 1582) || ((y == 1582) && (m > 10)) || ((y == 1582) && (m == 10) && (d > 14))) {
      var jd = parseInt((1461 * (y + 4800 + parseInt((m - 14) / 12))) / 4) + parseInt((367 * (m-2-12 * (parseInt((m-14) / 12)))) / 12)-parseInt((3 * (parseInt((y + 4900 + parseInt((m-14) / 12)) / 100))) / 4) + d-32075;
    } else {
        jd  =  367 * y-parseInt((7 * (y + 5001 + parseInt((m - 9) / 7))) / 4) + parseInt((275 * m) / 9) + d + 1729777;
    }

        l = jd-1948440 + 10632;
        n = parseInt((l - 1) / 10631);
        l = l-10631 * n + 354;
        j = (parseInt((10985 - l) / 5316)) * (parseInt((50 * l) / 17719)) + (parseInt(l / 5670)) * (parseInt((43 * l) / 15238));
        l = l-(parseInt((30 - j) / 15)) * (parseInt((17719 * j) / 50))-(parseInt(j / 16)) * (parseInt((15238 * j) / 43)) + 29;
        m = parseInt((24 * l) / 709);
        d = l-parseInt((709 * m) / 24);
        y = 30 * n + j-30;

    /*if (d < 10) {
        d = "0"+d;
    }

    if (m < 10) {
        m = "0"+m;
    }*/

        return [d,m,y,str[m]];

}