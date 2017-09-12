let body = document.querySelector('html, body'),
    header__image = document.getElementById('header__image'),
    parallax_team_photo = document.getElementById('team_photo'),
    section_services = document.getElementById('section_services'),
    section_case_studies = document.getElementById('section_case_studies'),
    section_geodata = document.getElementById('section_geodata'),
    section_team = document.getElementById('section_team'),
    section_contact = document.getElementById('section_contact');

parallax_team_photo.style.height = parallax_team_photo.offsetWidth * 0.47 + 'px';

function setHeader() {
    let distanceY = window.pageYOffset || document.documentElement.scrollTop;
    distanceY > 300 ? addClass('.header','header__smaller') : removeClass('.header','header__smaller');
    distanceY > header__image.clientHeight - 80 ? addClass('.header','header__main') : removeClass('.header','header__main');
}
setHeader();

window.onscroll = function () {
    setHeader();
    let shift = 100 - ((parallax_team_photo.offsetTop - window.pageYOffset) / window.innerHeight * 100);
    if (shift > 0 && shift < 100) parallax_team_photo.style.backgroundPosition = "50% " + shift + "%";
};

//menu control
document.getElementById('home').addEventListener('click',
    function (e) {
        e.preventDefault();
        scrollElement(body, 0, 400);
    }
);

document.querySelector('.header__menu').addEventListener('click', function(event){
    let loc = event.target.id;
    history.pushState({so: 'glx'}, loc, '?' + loc);
    scrollTo(loc);
});

function scrollTo(section) {
    section === 'services' ? scrollElement(body, section_services.getBoundingClientRect().top + window.pageYOffset - 100, 400) :
        section === 'case_studies' ? scrollElement(body, section_case_studies.getBoundingClientRect().top + window.pageYOffset - 50, 400) :
            section === 'geodata' ? scrollElement(body, section_geodata.getBoundingClientRect().top + window.pageYOffset - 80, 400) :
                section === 'team' ? scrollElement(body, section_team.getBoundingClientRect().top + window.pageYOffset - 80, 400) :
                    section === 'contact' ? scrollElement(body, section_contact.getBoundingClientRect().top + window.pageYOffset - 70, 400) :
                        null;
}



section_case_studies.querySelector('.strip').addEventListener('click', function(event){
    removeClass(section_case_studies.querySelector('.active'), 'active');

    console.log(event.target.className);
    addClass(event.target, 'active');
    let index = indexInParent(event.target);
    index -= 1;

    section_case_studies.querySelector('.strip').style['marginLeft'] = '-' + index * 20 + '%';

    if (index > 8) index -= 8;
    if (index < 0) index += 8;

    addClass(section_case_studies.querySelectorAll('.logo')[index+1], 'active');
    section_case_studies.querySelector('.strip').style['marginLeft'] = '-' + index * 20 + '%';

    index++;
    if (index >= 8) index -= 8;

    section_case_studies.querySelector('.container_table').style['marginLeft'] = '-' + index * 100 + '%';
});



// services cards
let service_cards = section_services.querySelectorAll('.ul_grid .li_card');
for (let i = 0; i < service_cards.length; i++) {
    service_cards[i].addEventListener('click', function() {
        expandCard(section_services, this)
    });
}
expandCard(section_services, section_services.querySelector('.network_strategy'));

let team_cards = section_team.querySelectorAll('.ul_grid .li_card');
for (let i = 0; i < team_cards.length; i++) {
    team_cards[i].addEventListener('click', function() {
        expandCard(section_team, this);
        scrollElement(body, this.getBoundingClientRect().top + window.pageYOffset - 80, 400)
    });
}
expandCard(section_team, section_team.querySelector('.blair'));

function expandCard(section, _this) {
    removeClass(section.querySelector('.li_expander_visible'), 'li_expander_visible');
    if (section.querySelector('.li_card__expanded')) section.querySelector('.li_card__expanded').parentNode.removeAttribute('style');
    removeClass(section.querySelector('.li_card__expanded'), 'li_card__expanded');
    addClass(_this, 'li_card__expanded');
    _this.parentNode.style.height = (_this.parentNode.querySelector('.li_card').offsetHeight + _this.parentNode.querySelector('.li_card__content').offsetHeight + 50) + 'px';
    addClass(_this.nextElementSibling, 'li_expander_visible');
}



// contact
let mapZoom_contact = 14,
    map_contact = L.map('map_contact', {
        scrollWheelZoom: false,
        zoomControl: false,
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

let btnZoomIn_contact = document.getElementById('btnZoomIn_contact'),
    btnZoomOut_contact = document.getElementById('btnZoomOut_contact');

function chkZoomBtn_contact(){
    mapZoom_contact < 18 ? btnZoomIn_contact.disabled = false : btnZoomIn_contact.disabled = true;
    mapZoom_contact > 4 ? btnZoomOut_contact.disabled = false : btnZoomOut_contact.disabled = true;
}

btnZoomIn_contact.addEventListener('click', function () {
    if (this.disabled) return;
    mapZoom_contact++;
    map_contact.setZoom(mapZoom_contact);
    chkZoomBtn_contact();
});

btnZoomOut_contact.addEventListener('click', function(){
    if (this.disabled) return;
    mapZoom_contact--;
    map_contact.setZoom(mapZoom_contact);
    chkZoomBtn_contact();
});

map_contact.on('moveend', function () {
    mapZoom_contact = map_contact.getZoom();
    chkZoomBtn_contact();
});

map_contact.on('zoomend', function () {
    mapZoom_contact = map_contact.getZoom();
    chkZoomBtn_contact();
});

// resize window
window.onresize = function () {
    parallax_team_photo.style.height = parallax_team_photo.offsetWidth * 0.47 + 'px';
};

scrollTo(window.location.search.substring(1));




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