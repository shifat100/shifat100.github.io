function HijriToGregorian(d, m, y)
    {
       var strMonth = ['','January', 'February', 'March', 'April', 'May', 'Jun', 'July', 'August', 'September', 'October', 'Novmber', 'December'];
        var jd = parseInt((11 * y + 3) / 30) + 354 * y + 30 * m - parseInt((m - 1) / 2) + d + 1948440 - 385;

        if (jd > 2299160) {
            var l = jd + 68569;
            var n = parseInt((4 * l) / 146097);
            l = l-parseInt((146097 * n + 3) / 4);
            var i = parseInt((4000 * (l + 1)) / 1461001);
            l = l-parseInt((1461 * i) / 4) + 31;
            j = parseInt((80 * l) / 2447);
            d = l-parseInt((2447 * j)/80);
            l = parseInt(j / 11);
            m = j + 2 - 12 * l;
            y = 100 * (n - 49) + i + l;
        } else {
            j = jd + 1402;
            k = parseInt((j-1) / 1461);
            l = j-1461 * k;
            n = parseInt((l-1) / 365)-parseInt(l / 1461);
            i = l-365 * n + 30;
            j = parseInt((80 * i) / 2447);
            d = i-parseInt((2447 * j) / 80);
            i = parseInt(j / 11);
            m = j + 2-12 * i;
            y = 4 * k + n + i-4716;
        }

        /*if (d < 10) {
            d = "0"+d;
        }

        if (m<10) {
            m = "0"+m;
        }*/

        return [d, m, y, strMonth[m]];
    }

