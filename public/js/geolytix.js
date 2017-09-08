let body = document.querySelector('html, body'),
    header__image = document.getElementById('header__image'),
    parallax_team_photo = document.getElementById('team_photo'),
    section_services = $('.services'),
    section_case_studies = $('.case_studies'),
    section_geodata = $('.geodata'),
    section_team = $('.team'),
    section_contact = $('.contact');

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
    }

    // if we have a single DOM element, make it an array to simplify behavior
    else if (elements.tagName) { elements=[elements]; }

    // add class to all chosen elements
    for (let i=0; i<elements.length; i++) {
        if ((' ' + elements[i].className + ' ').indexOf(' ' + myClass + ' ') < 0) elements[i].className += ' ' + myClass;
    }
}

function removeClass(elements, myClass) {
    if (!elements) return;

    // if we have a selector, get the chosen elements
    if (typeof(elements) === 'string') {
        elements = document.querySelectorAll(elements);
    }

    // if we have a single DOM element, make it an array to simplify behavior
    else if (elements.tagName) { elements=[elements]; }

    // create pattern to find class name
    let reg = new RegExp('(^| )'+myClass+'($| )','g');

    // remove class from all chosen elements
    for (let i = 0; i < elements.length; i++) {
        elements[i].className = elements[i].className.replace(reg, ' ');
    }
}

// $('.header__menu > div').click(function () {
//     let loc = $(this).attr('id');
//     history.pushState({so: 'glx'}, loc, '?' + loc);
//     scrollTo(loc);
// });

let header__manu_div = document.querySelectorAll('.header__menu > div');

for (let i = 0; i < header__manu_div.length; i++) {
    header__manu_div[i].addEventListener('click', function () {
        let loc = this.getAttribute('id');
        history.pushState({so: 'glx'}, loc, '?' + loc);
        scrollTo(loc);
    });
}

document.querySelector('.header__menu > div').addEventListener('click', function () {
    let loc = $(this).attr('id');
    history.pushState({so: 'glx'}, loc, '?' + loc);
    scrollTo(loc);
});

function scrollTo(section) {
    section === 'services' ? scrollElement(body, section_services.offset().top - 100, 400) :
        section === 'case_studies' ? scrollElement(body, section_case_studies.offset().top - 50, 400) :
            section === 'geodata' ? scrollElement(body, section_geodata.offset().top - 80, 400) :
                section === 'team' ? scrollElement(body, section_team.offset().top - 80, 400) :
                    section === 'contact' ? scrollElement(body, section_contact.offset().top - 70, 400) :
                        null;
}


// services cards
let service_cards = section_services.find('.ul_grid .li_card'),
    service_card__expanded;

service_cards.click(function () {
    if (service_card__expanded) service_card__expanded.removeAttr('style');
    service_card__expanded = $(this).parent('li');
    let content = service_card__expanded.find('.li_card__content'),
        li_expander = $(this).nextAll('.li_expander');
    if (service_card__expanded.hasClass('li_expanded')) {
        service_card__expanded.removeClass('li_expanded').removeAttr('style');
        li_expander.css('visibility', 'hidden');
    } else {
        section_services.find('.li_expander').css('visibility', 'hidden');
        section_services.find('.li_expanded').removeClass('li_expanded');
        service_card__expanded.addClass('li_expanded').height($(this).height() + content.height() + 50);
        content.css('opacity', 0).animate({opacity: 1});
        li_expander.css('visibility', 'visible');
    }
});

section_services.find('.network_strategy').first().trigger('click');


// case studies
let case_studies_container = section_case_studies.find('.container').first(),
    case_studies__strip = section_case_studies.find('.strip').first(),
    case_studies__logos = section_case_studies.find('.logo'),
    case_studies__table = case_studies_container.find('.container_table').first();

section_case_studies.find('.logo').click(function () {
    $(this).siblings().removeClass('active');
    $(this).addClass('active');


    let index = $(this).index();
    index -= 1;
    case_studies__strip.animate({'marginLeft': '-' + index * 20 + '%'}, 400);
    if (index > 8) {
        index -= 8;
        let logo = case_studies__logos.get([index+1]);
        logo.className += " active";
        case_studies__strip.animate({'marginLeft': '-' + index * 20 + '%'}, 0);
    }
    if (index < 0) {
        index += 8;
        let logo = case_studies__logos.get([index+1]);
        logo.className += " active";
        case_studies__strip.animate({'marginLeft': '-' + index * 20 + '%'}, 0);
    }

    index++;
    if (index >= 8) index -= 8;

    case_studies__table.animate({'marginLeft': '-' + index * 100 + '%'}, 1000);
});


// team cards
let team_cards = section_team.find('.ul_grid .li_card'),
    team_card__expanded;

team_cards.click(function (e, trigger) {
    if (team_card__expanded) team_card__expanded.removeAttr('style');
    team_card__expanded = $(this).parent('li');
    let content = team_card__expanded.find('.li_card__content'),
        li_expander = $(this).nextAll('.li_expander');
    if (team_card__expanded.hasClass('li_expanded')) {
        team_card__expanded.removeClass('li_expanded').removeAttr('style');
        li_expander.css('visibility', 'hidden');
    } else {
        section_team.find('.li_expander').css('visibility', 'hidden');
        section_team.find('.li_expanded').removeClass('li_expanded');
        team_card__expanded.addClass('li_expanded').height($(this).height() + content.height() + 50);
        content.css('opacity', 0).animate({opacity: 1});
        li_expander.css('visibility', 'visible');
        if (trigger !== true) {
            body.animate({scrollTop: team_card__expanded.offset().top - 80});
        }
    }
});

section_team.find('.blair').first().trigger('click', [true]);


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
    changeExpandedCardsHeight();
};

function changeExpandedCardsHeight() {
    if (service_card__expanded) {
        service_card__expanded.height(service_card__expanded.find('.li_card').height() + service_card__expanded.find('.li_card__content').height() + 50);
    }
    if (team_card__expanded) {
        team_card__expanded.height(team_card__expanded.find('.li_card').height() + team_card__expanded.find('.li_card__content').height() + 50);
    }
}

scrollTo(window.location.search.substring(1));