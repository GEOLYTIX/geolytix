let intro__logo = document.getElementById('intro__logo');
let intro__text = document.getElementById('intro__text');

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

document.getElementById('intro__burger').addEventListener('click', function(){
    toggleClass(document.getElementById('intro__menu'),'intro__menu_show');
});

document.getElementById('intro__menu').addEventListener('click', function(event){
    toggleClass(document.getElementById('intro__menu'),'intro__menu_show');
    let loc = event.target.id;
    history.pushState({so: 'glx'}, loc, '?' + loc);
    scrollTo(loc);
});

scrollTo(window.location.search.substring(1));
function scrollTo(section){
    section === 'services' ? scrollElement(document.getElementById('inner'), document.getElementById('services__section').getBoundingClientRect().top + window.pageYOffset, 400) :
        section === 'case_studies' ? scrollElement(document.getElementById('inner'), document.getElementById('case_studies__section').getBoundingClientRect().top + window.pageYOffset, 400) :
            section === 'geodata' ? scrollElement(document.getElementById('inner'), document.getElementById('geodata__section').getBoundingClientRect().top + window.pageYOffset, 400) :
                section === 'team' ? scrollElement(document.getElementById('inner'), document.getElementById('team__section').getBoundingClientRect().top + window.pageYOffset, 400) :
                    section === 'contact' ? scrollElement(document.getElementById('inner'), document.getElementById('footer').getBoundingClientRect().top + window.pageYOffset, 400) :
                        section === 'seamless_locales' ? scrollElement(document.getElementById('inner'), document.getElementById('geodata__section').getBoundingClientRect().top + window.pageYOffset, 400) :
                            section === 'retail_points' ? scrollElement(document.getElementById('inner'), document.getElementById('geodata__section').getBoundingClientRect().top + window.pageYOffset, 400) :
                                section === 'retail_places' ? scrollElement(document.getElementById('inner'), document.getElementById('geodata__section').getBoundingClientRect().top + window.pageYOffset, 400) :
                                    section === 'public_transport' ? scrollElement(document.getElementById('inner'), document.getElementById('geodata__section').getBoundingClientRect().top + window.pageYOffset, 400) :
                                        section === 'postal_geom' ? scrollElement(document.getElementById('inner'), document.getElementById('geodata__section').getBoundingClientRect().top + window.pageYOffset, 400) :
                                            section === 'town_suburb' ? scrollElement(document.getElementById('inner'), document.getElementById('geodata__section').getBoundingClientRect().top + window.pageYOffset, 400) :
                                                section === 'education' ? scrollElement(document.getElementById('inner'), document.getElementById('geodata__section').getBoundingClientRect().top + window.pageYOffset, 400) :
                                                    section === 'workplace' ? scrollElement(document.getElementById('inner'), document.getElementById('geodata__section').getBoundingClientRect().top + window.pageYOffset, 400) :
                                                        section === 'poi' ? scrollElement(document.getElementById('inner'), document.getElementById('geodata__section').getBoundingClientRect().top + window.pageYOffset, 400) :
                                                            section === 'residential' ? scrollElement(document.getElementById('inner'), document.getElementById('geodata__section').getBoundingClientRect().top + window.pageYOffset, 400) :
                                                                section === 'uk_admin' ? scrollElement(document.getElementById('inner'), document.getElementById('geodata__section').getBoundingClientRect().top + window.pageYOffset, 400) :
                                                                    section === 'property' ? scrollElement(document.getElementById('inner'), document.getElementById('geodata__section').getBoundingClientRect().top + window.pageYOffset, 400) :
                                                                        section === 'road_network' ? scrollElement(document.getElementById('inner'), document.getElementById('geodata__section').getBoundingClientRect().top + window.pageYOffset, 400) :
                                                                            section === 'media_com' ? scrollElement(document.getElementById('inner'), document.getElementById('geodata__section').getBoundingClientRect().top + window.pageYOffset, 400) :
                                                                                section === 'physical' ? scrollElement(document.getElementById('inner'), document.getElementById('geodata__section').getBoundingClientRect().top + window.pageYOffset, 400) :
                                                                                    null;
}

let map_links = document.querySelectorAll('.map_link');
for (let i = 0; i < map_links.length; i++) {
    map_links[i].addEventListener('click', function() {
        history.pushState({so: 'glx'}, 'geodata', '?geodata');
    });
}


// preload images
let img = new Image();
let section_intro = document.getElementById('intro__section');
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


let csInfo = document.getElementById('case_studies__info');
let csLogos = document.getElementById('case_studies__logos');
let csInfoTable = document.getElementById('case_studies__logos__table');
csLogos.addEventListener('scroll', debounce(function(){
    let swapy = csInfoTable.offsetWidth / 8;
    let scrolly = csLogos.scrollLeft;
    removeClass(document.querySelectorAll('#case_studies__info .active'), 'active');
    scrolly < (swapy/2) ? addClass(document.querySelectorAll('#case_studies__info .camelot'), 'active') :
        scrolly < swapy + (swapy/2) ? addClass(document.querySelectorAll('#case_studies__info .johnlewis'), 'active') :
            scrolly < swapy * 2 + (swapy/2) ? addClass(document.querySelectorAll('#case_studies__info .onthemarket'), 'active') :
                scrolly < swapy * 3 + (swapy/2) ? addClass(document.querySelectorAll('#case_studies__info .arco'), 'active') :
                    scrolly < swapy * 4 + (swapy/2) ? addClass(document.querySelectorAll('#case_studies__info .totalfitness'), 'active') :
                        scrolly < swapy * 5 + (swapy/2) ? addClass(document.querySelectorAll('#case_studies__info .asda'), 'active') :
                            scrolly < swapy * 6 + (swapy/2) ? addClass(document.querySelectorAll('#case_studies__info .swinton'), 'active') :
                                addClass(document.querySelectorAll('#case_studies__info .marks_and_spencer'), 'active');
    csInfo.scrollLeft = 0;
},300));

function debounce(func, wait, immediate) {
    let timeout;
    return function() {
        let context = this, args = arguments;
        let later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        let callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}



// preload images
let imgLoadArray = document.querySelectorAll('.img__load');
for (let i = 0; i < imgLoadArray.length; i++) {
    let imgDOM = imgLoadArray[i];
    let imgID = imgDOM.getAttribute('id');
    let _img = new Image();
    _img.onload = imgLoad(imgDOM, imgID);
    _img.src = '/public/images/load/' + imgID + '.jpg';
}

function imgLoad(_imgDOM, _imgID){
    _imgDOM.setAttribute('style', 'background-image: url(/public/images/load/' + _imgID + '.jpg)');
}

// contact
let mapZoom_contact = 14,
    map_contact = L.map('map_contact', {
        scrollWheelZoom: false,
        zoomControl: false,
        maxBounds: L.latLngBounds(L.latLng(51.52733, -0.11525), L.latLng(51.52733, -0.11525)),
        minZoom: 4,
        maxZoom: 18
    })
        .setView([51.52733, -0.11525], mapZoom_contact)
        .addLayer(L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png'));

new L.Marker(
    [51.52733, -0.11525],
    {
        icon: L.icon({
            iconUrl: '/public/images/leaflet/marker.svg',
            iconSize: [80, 40],
            iconAnchor: [40, 40]
        })
    })
    .addTo(map_contact);


function scrollElement(element, to, duration) {
    if (duration <= 0) return;
    let difference = to - element.scrollTop,
        perTick = difference / duration * 10;
    setTimeout(function() {
        element.scrollTop = element.scrollTop + perTick;
        if (element.scrollTop === to) return;
        scrollElement(element, to, duration - 10);
    }, 10);
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
    } else if (elements.tagName) { elements=[elements]; }

    // create pattern to find class name
    let reg = new RegExp('(^| )'+myClass+'($| )','g');

    // remove class from all chosen elements
    for (let i = 0; i < elements.length; i++) {
        elements[i].className = elements[i].className.replace(reg, ' ');
    }
}

function toggleClass(elements, myClass) {
    if (!elements) return;

    // if we have a selector, get the chosen elements
    if (typeof(elements) === 'string') {
        elements = document.querySelectorAll(elements);
    } else if (elements.tagName) { elements=[elements]; }

    // create pattern to find class name
    let reg = new RegExp('(^| )'+myClass+'($| )','g');

    for (let i = 0; i < elements.length; i++) {
        if ((' ' + elements[i].className + ' ').indexOf(' ' + myClass + ' ') > 0) {
            elements[i].className = elements[i].className.replace(reg, ' ');
        } else {
            elements[i].className += ' ' + myClass;
        }
    }
}

function hasClass(elements, myClass) {
    if (!elements) return;

    // if we have a selector, get the chosen elements
    if (typeof(elements) === 'string') {
        elements = document.querySelectorAll(elements);
    } else if (elements.tagName) {
        elements = [elements];
    }

    // add class to all chosen elements
    let n = 0;
    for (let i = 0; i < elements.length; i++) {
        if ((' ' + elements[i].className + ' ').indexOf(' ' + myClass + ' ') > 0) n++;
    }

    return n === elements.length;
}

function indexInParent(node) {
    let children = node.parentNode.childNodes,
        num = 0;
    for (let i = 0; i < children.length; i++) {
        if (children[i] === node) return num;
        if (children[i].nodeType === 1) num++;
    }
    return -1;
}