const intro__logo = document.getElementById('intro__logo');
const intro__text = document.getElementById('intro__text');

orientation();

function orientation() {
    if (screen.height < screen.width) {
        intro__text.innerHTML = 'better decisions<br>where location matters';
    } else {
        intro__text.innerHTML = 'better<br>decisions<br>where<br>location<br>matters';
    }
}

window.addEventListener('resize', function () {
    if (window.innerWidth > 799) {
        window.location = "/";
    }
    if (window.innerWidth > window.innerHeight) {
        orientation();
    }
});



// preload images
// var img = new Image();
var section_intro = document.getElementById('intro__section');
// img.addEventListener('load', function(){
//     alert('farts');
//     section_intro.setAttribute('style', 'background-image: url(/public/images/intro_geolytix_m.jpg)');
//     intro__logo.setAttribute('style', 'color: #fff');
//     intro__text.setAttribute('style', 'color: #fff');
// });
// img.src = '/public/images/intro_geolytix_m.jpg';

// section_intro.setAttribute('style', 'background: url(/public/images/intro_geolytix_m.jpg) no-repeat center center fixed');
// section_intro.setAttribute('style', '-webkit-background-size: cover');
// section_intro.setAttribute('style', '-moz-background-size: cover');
// section_intro.setAttribute('style', '-o-background-size: cover');
// section_intro.setAttribute('style', 'background-size: cover');

section_intro.style.background = 'url(/public/images/intro_geolytix_m.jpg) no-repeat center center';
section_intro.style['background-size'] = 'cover';
section_intro.style['-webkit-background-size'] = 'cover';
section_intro.style['-moz-background-size'] = 'cover';
section_intro.style['-o-background-size'] = 'cover';
intro__logo.style.color = '#fff';
intro__text.style.color = '#fff';



const csInfo = document.getElementById('case_studies__info');
const csLogos = document.getElementById('case_studies__logos');
const csInfoTable = document.getElementById('case_studies__logos__table');
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
const imgLoadArray = document.querySelectorAll('.img__load');
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