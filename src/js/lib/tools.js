'use strict';
// 获取浏览器信息
var u = window.navigator.userAgent;
var tools = {
    isIOS: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
    isAndroid: !u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //android终端
    isWeibo: u.toLowerCase().match(/weibo/i) == "weibo",
    isWxOrQQ: u.toLowerCase().match(/micromessenger/i) == "micromessenger" || u.toLowerCase().match(/qq/i) == "qq",
    isQQ: u.toLowerCase().match(/qq/i) == "qq",
    isWeixin: u.toLowerCase().match(/micromessenger/i) == "micromessenger",
    isUC: u.toLowerCase().match(/ucbrowser/i) == "ucbrowser",
    getIOSVersion: function() {
        var reg = /OS ((\d+_?){2,3})\s/;
        if (navigator.userAgent.match(/iPad/i) || navigator.platform.match(/iPad/i) || navigator.userAgent.match(/iP(hone|od)/i) || navigator.platform.match(/iP(hone|od)/i)) {
            var osv = reg.exec(navigator.userAgent);
            if (osv.length > 0) {
                // return osv[0].replace('OS', '').replace('os', '').replace(/\s+/g, '').replace(/_/g, '.')
                return parseInt(osv[0].replace('OS', '').replace('os', '').replace(/\s+/g, '').replace(/_/g, '.').split('.')[0]);
            }
        }
        return -1;
    },
    getAndroidVersion: function() {
        return u.substr(u.indexOf('Android') + 8, 3);
    },
    android_open: function(ecduri) {
        if (tools.getAndroidVersion() < 5 || (tools.isAndroid && tools.isQQ) || (tools.isAndroid && tools.isWeibo)) {
            var ifr = document.createElement('iframe');
            ifr.src = ecduri;
            ifr.style.display = 'none';
            document.body.appendChild(ifr);
        } else {
            window.location.href = ecduri;
        }
    }
};
module.exports = tools;

