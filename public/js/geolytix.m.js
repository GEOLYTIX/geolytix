var intro__logo = document.getElementById('intro__logo');
var intro__text = document.getElementById('intro__text');

orientation();

window.addEventListener('resize', function () {
    orientation();
});

window.addEventListener('orientationchange', function() {
    orientation();
});

function orientation() {
    if (window.innerWidth || screen.height < window.innerWidth || screen.width) {
        intro__text.innerHTML = 'better decisions<br>where location matters';
    } else {
        intro__text.innerHTML = 'better<br>decisions<br>where<br>location<br>matters';
    }
}

// preload images
var img = new Image();
var section_intro = document.getElementById('intro__section');
img.addEventListener('load', function(){
    section_intro.setAttribute('style', 'background-image: url(/public/images/intro_geolytix_m.jpg)');
    intro__logo.setAttribute('style', 'color: #fff');
    intro__text.setAttribute('style', 'color: #fff');
});
img.addEventListener('error', function(){
    section_intro.setAttribute('style', 'background: url(/public/images/intro_geolytix_m.jpg)');
    intro__logo.setAttribute('style', 'color: #fff');
    intro__text.setAttribute('style', 'color: #fff');
});
img.src = '/public/images/intro_geolytix_m.jpg';

var csInfo = document.getElementById('case_studies__info');
var csLogos = document.getElementById('case_studies__logos');
var csInfoTable = document.getElementById('case_studies__logos__table');
csLogos.addEventListener('scroll', debounce(function(){
    var swapy = csInfoTable.offsetWidth / 6;
    var scrolly = csLogos.scrollLeft;
    removeClass(document.querySelectorAll('#case_studies__info .active'), 'active');
    scrolly < (swapy/2) ? addClass(document.querySelectorAll('#case_studies__info .camelot'), 'active') :
        scrolly < swapy + (swapy/2) ? addClass(document.querySelectorAll('#case_studies__info .johnlewis'), 'active') :
            scrolly < swapy * 2 + (swapy/2) ? addClass(document.querySelectorAll('#case_studies__info .onthemarket'), 'active') :
                scrolly < swapy * 3 + (swapy/2) ? addClass(document.querySelectorAll('#case_studies__info .arco'), 'active') :
                    scrolly < swapy * 4 + (swapy/2) ? addClass(document.querySelectorAll('#case_studies__info .totalfitness'), 'active') :
                        addClass(document.querySelectorAll('#case_studies__info .asda'), 'active');
    csInfo.scrollLeft = 0;
},300));

function debounce(func, wait, immediate) {
    var timeout;
    return function() {
        var context = this, args = arguments;
        var later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

function hasClass(elem, className) {
        return new RegExp(' ' + className + ' ').test(' ' + elem.className + ' ');
}

function addClass(elems, className) {
    for (var i = 0; i < elems.length; i++) {
        var elem = elems[i];
        if (!hasClass(elem, className)) {
            elem.className += ' ' + className;
        }
    }
}

function removeClass(elems, className) {
    for (var i = 0; i < elems.length; i++) {
        var elem = elems[i];
        var newClass = ' ' + elem.className.replace(/[\t\r\n]/g, ' ') + ' ';
        if (hasClass(elem, className)) {
            while (newClass.indexOf(' ' + className + ' ') >= 0) {
                newClass = newClass.replace(' ' + className + ' ', ' ');
            }
            elem.className = newClass.replace(/^\s+|\s+$/g, '');
        }
    }
}



// preload images
var imgLoadArray = document.querySelectorAll('.img__load');
for (var i = 0; i < imgLoadArray.length; i++) {
    var imgDOM = imgLoadArray[i];
    var imgID = imgDOM.getAttribute('id');
    var img = new Image();
    img.onload = imgLoad(imgDOM, imgID);
    img.src = '/public/images/load/' + imgID + '.jpg';
}

function imgLoad(_imgDOM, _imgID){
    _imgDOM.setAttribute('style', 'background-image: url(/public/images/load/' + _imgID + '.jpg)');
}