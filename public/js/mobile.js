//intro text orientation
window.addEventListener('resize', function () {
    orientation();
});

window.addEventListener('orientationchange', function() {
    orientation();
});

const _locale = document.body.dataset.locale;

function orientation() {
    document.getElementById('intro__text').innerHTML =
    _locale === 'jp' ? 'より良い決断は、立地の意義するところにある' :
    _locale === 'cn' ? '优化选址决策' :
    _locale === 'pl' ? 'Lepsze decyzje tam gdzie lokalizacja ma znaczenie' :
    _locale === 'de' ? (window.innerWidth || screen.height < window.innerWidth || screen.width) ?
                    'Bessere Entscheidungen<br>am richtigen Ort.' :
                    'Bessere<br>Entscheidungen<br>am richtigen<br>location<br>Ort.' :
                    (window.innerWidth || screen.height < window.innerWidth || screen.width) ?
                        'better decisions<br>where location matters' :
                        'better<br>decisions<br>where<br>location<br>matters';
}

orientation();




//menu
document.getElementById('intro__burger').addEventListener('click', function(){
    toggleClass(document.getElementById('intro__menu'),'show');
});

document.getElementById('intro__menu').addEventListener('click', function(event){
    toggleClass(document.getElementById('intro__menu'),'show');
    history.pushState({so: 'glx'}, event.target.id, '?' + event.target.id);
    scrollTo(event.target.id);
});


const sections = {
    services: 'services__section',
    case_studies: 'case_studies__section',
    geodata: 'geodata__section',
    team: 'team__section',
    contact: 'footer'
};
function scrollTo(section){
    if (sections[section]) scrollElement(document.getElementById('inner'), document.getElementById(sections[section]).getBoundingClientRect().top + document.getElementById('inner').scrollTop, 400);
}
scrollTo(window.location.search.substring(1));



//load images
const imgLoadArray = document.querySelectorAll('.img__load');
for (let i = 0; i < imgLoadArray.length; i++) {
    let img = new Image();
    img.onload = function(){
        imgLoadArray[i].style['background-image'] = 'url(/images/' + imgLoadArray[i].dataset.src +')';
        if (imgLoadArray[i].id === 'intro__section') {
            document.getElementById('intro__logo').setAttribute('style', 'color: #fff');
            document.getElementById('intro__text').setAttribute('style', 'color: #fff');
        }
    };
    img.src = '/images/' + imgLoadArray[i].dataset.src;
}



//case studies
if (document.getElementById('case_studies__logos')){
    document.getElementById('case_studies__logos').addEventListener('scroll', debounce(function(){
        let swapx = document.getElementById('case_studies__logos__table').offsetWidth / 9,
            scrollx = document.getElementById('case_studies__logos').scrollLeft;

        removeClass(document.querySelectorAll('#case_studies__info .active'), 'active');

        scrollx < (swapx/2) ? addClass(document.querySelectorAll('#case_studies__info .dominos'), 'active') :
            scrollx < swapx + (swapx/2) ? addClass(document.querySelectorAll('#case_studies__info .camelot'), 'active') :
                scrollx < swapx * 2 + (swapx/2) ? addClass(document.querySelectorAll('#case_studies__info .johnlewis'), 'active') :
                    scrollx < swapx * 3 + (swapx/2) ? addClass(document.querySelectorAll('#case_studies__info .onthemarket'), 'active') :
                        scrollx < swapx * 4 + (swapx/2) ? addClass(document.querySelectorAll('#case_studies__info .arco'), 'active') :
                            scrollx < swapx * 5 + (swapx/2) ? addClass(document.querySelectorAll('#case_studies__info .totalfitness'), 'active') :
                                scrollx < swapx * 6 + (swapx/2) ? addClass(document.querySelectorAll('#case_studies__info .asda'), 'active') :
                                    scrollx < swapx * 7 + (swapx/2) ? addClass(document.querySelectorAll('#case_studies__info .swinton'), 'active') :
                                        addClass(document.querySelectorAll('#case_studies__info .marks_and_spencer'), 'active');

        document.getElementById('case_studies__info').scrollLeft = 0;
    },300));
}




function toggleClass(elements, myClass) {
    if (!elements) return;

    // if we have a selector, get the chosen elements
    if (typeof(elements) === 'string') {
        elements = document.querySelectorAll(elements);
    } else if (elements.tagName) {
        elements = [elements];
    }

    // create pattern to find class name
    let reg = new RegExp('(^| )' + myClass + '($| )', 'g');

    for (let i = 0; i < elements.length; i++) {
        if ((' ' + elements[i].className + ' ').indexOf(' ' + myClass + ' ') > 0) {
            elements[i].className = elements[i].className.replace(reg, ' ');
        } else {
            elements[i].className += ' ' + myClass;
        }
    }
}

function addClass(elements, myClass) {
    if (!elements) return;

    // if we have a selector, get the chosen elements
    if (typeof(elements) === 'string') {
        elements = document.querySelectorAll(elements);
    } else if (elements.tagName) {
        elements = [elements];
    }

    // add class to all chosen elements
    for (let i = 0; i < elements.length; i++) {
        if ((' ' + elements[i].className + ' ').indexOf(' ' + myClass + ' ') < 0) elements[i].className += ' ' + myClass;
    }
}

function removeClass(elements, myClass) {
    if (!elements) return;

    // if we have a selector, get the chosen elements
    if (typeof(elements) === 'string') {
        elements = document.querySelectorAll(elements);
    } else if (elements.tagName) {
        elements = [elements];
    }

    // create pattern to find class name
    let reg = new RegExp('(^| )' + myClass + '($| )', 'g');

    // remove class from all chosen elements
    for (let i = 0; i < elements.length; i++) {
        elements[i].className = elements[i].className.replace(reg, ' ');
    }
}

function scrollElement(element, to, duration) {
    if (duration <= 0) return;
    let difference = to - element.scrollTop,
        perTick = difference / duration * 10;
    setTimeout(function () {
        element.scrollTop = element.scrollTop + perTick;
        if (element.scrollTop === to) return;
        scrollElement(element, to, duration - 10);
    }, 10);
}

function debounce(func, wait) {
    let timeout;
    return function () {
        clearTimeout(timeout);
        timeout = setTimeout(function () {
            timeout = null;
            func.apply(this, arguments);
        }, wait);
    };
}