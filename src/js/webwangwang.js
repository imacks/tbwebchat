function getWebchatURL() {
    function getSellerEl() {
        var elSel = document.getElementsByClassName('tb-seller-name');
        if (elSel == null || elSel.length != 1)
            throw 'cannot find HTML element a.tb-seller-name';
        if (elSel[0].tagName != 'A')
            throw 'cannot find HTML element a.tb-seller-name';
        return elSel[0];
    }

    function getShopID(el) {
        var shopURL = new URL(el.href);
        if (!shopURL.hostname.endsWith('.taobao.com'))
            throw ('cannot parse URL ' + shopURL);

        var shopURLParts = shopURL.hostname.split('.');
        if (shopURLParts.length != 3)
            throw ('cannot parse URL ' + shopURL);

        if (shopURLParts[0].startsWith('shop'))
            return shopURLParts[0].substr(4);
        else
            return shopURLParts[0];
    }

    function getProductID() {
        var query = window.location.search;
        if (query.startsWith('?'))
            query = query.substr(1);

        var queryStrs = query.split('&')
        for (var i = 0; i < queryStrs.length; i++) {
            if (queryStrs[i].startsWith('id='))
                return queryStrs[i].substr(3);
        }

        return 'cannot find URL query param: id';
    }

    function base64EncodeUnicode(str) {
        var utf8Bytes = encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function (match, p1) {
            return String.fromCharCode('0x' + p1);
        });
        return btoa(utf8Bytes);
    }

    //function getMobilePageURL() {
    //    var pageID = getProductID();
    //    return 'https://new.m.taobao.com/detail.htm?id=' + pageID;
    //}

    var sellerEl = getSellerEl();
    var sellerNameEncoded = base64EncodeUnicode(sellerEl.innerText);
    var shopID = getShopID(sellerEl);

    return 'https://market.m.taobao.com/app/tb-chatting/tbms-chat/pages/index#!dialog-' +
        sellerNameEncoded + '-' +
        getProductID() + '-' +
        shopID;
}

function setWebchatIcon() {
    function getWebchatButtonEl() {
        var elSel = document.getElementsByClassName('tb-shop-ww');
        if (elSel.length != 1 || elSel[0].tagName != 'DIV')
            throw 'cannot find HTML element div.tb-shop-ww';
        elSel = elSel[0].getElementsByClassName('ww-inline');
        if (elSel.length != 1 || elSel[0].tagName != 'A')
            throw 'cannot find HTML element div.tb-shop-ww > a.ww-inline';
        if (elSel[0].parentElement.children.length != 1)
            throw 'unexpected HTML structure for parent element of div.tb-shop-ww > a.ww-inline';

        return elSel[0].parentElement;
    }

    var el = getWebchatButtonEl();
    el.children[0].href = getWebchatURL();
    var tmp = el.innerHTML;
    el.innerHTML = '';
    el.innerHTML = tmp;
}

setWebchatIcon();
console.log('web wangwang is now active');
