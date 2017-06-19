var body = $('html, body'),
    header = $('.header'),
    header__image = document.getElementById('header__image'),
    parallax_team_photo = document.getElementById('team_photo'),
    section_services = $('.services'),
    section_case_studies = $('.case_studies'),
    section_geodata = $('.geodata'),
    section_team = $('.team'),
    section_contact = $('.contact');

parallax_team_photo.style.height = parallax_team_photo.offsetWidth * 0.47 + 'px';

function setHeader() {
    var distanceY = window.pageYOffset || document.documentElement.scrollTop;
    distanceY > 300 ? header.addClass('header__smaller') : header.removeClass('header__smaller');
    distanceY > header__image.clientHeight - 80 ? header.addClass('header__main') : header.removeClass('header__main');
}
setHeader();

window.onscroll = function () {
    setHeader();
    var shift = 100 - ((parallax_team_photo.offsetTop - window.pageYOffset) / window.innerHeight * 100);
    if (shift > 0 && shift < 100) parallax_team_photo.style.backgroundPosition = "50% " + shift + "%";
};


//menu control
$('#home').click(function (e) {
    e.preventDefault();
    body.animate({scrollTop: 0});
});

$('.header__menu > div').click(function () {
    var loc = $(this).attr('id');
    history.pushState({so: 'glx'}, loc, '?' + loc);
    scrollTo(loc);
});

function scrollTo(section) {
    section === 'services' ? body.animate({scrollTop: section_services.offset().top - 100}) :
        section === 'case_studies' ? body.animate({scrollTop: section_case_studies.offset().top - 50}) :
            section === 'geodata' ? body.animate({scrollTop: section_geodata.offset().top - 80}) :
                section === 'team' ? body.animate({scrollTop: section_team.offset().top - 80}) :
                    section === 'contact' ? body.animate({scrollTop: section_contact.offset().top - 70}) :
                        null;
}


// services cards
var service_cards = section_services.find('.ul_grid .li_card'),
    service_card__expanded;

service_cards.click(function () {
    if (service_card__expanded) service_card__expanded.removeAttr('style');
    service_card__expanded = $(this).parent('li');
    var content = service_card__expanded.find('.li_card__content'),
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
var case_studies_container = section_case_studies.find('.container').first(),
    case_studies__strip = section_case_studies.find('.strip').first(),
    case_studies__logos = section_case_studies.find('.logo'),
    case_studies__table = case_studies_container.find('.container_table').first();

section_case_studies.find('.logo').click(function () {
    $(this).siblings().removeClass('active');
    $(this).addClass('active');


    var index = $(this).index();
    index -= 1;
    case_studies__strip.animate({'marginLeft': '-' + index * 20 + '%'}, 400);
    if (index > 7) {
        index -= 7;
        var logo = case_studies__logos.get([index+1]);
        logo.className += " active";
        case_studies__strip.animate({'marginLeft': '-' + index * 20 + '%'}, 0);
    }
    if (index < 0) {
        index += 7;
        var logo = case_studies__logos.get([index+1]);
        logo.className += " active";
        case_studies__strip.animate({'marginLeft': '-' + index * 20 + '%'}, 0);
    }

    console.log(index);

    index++;
    if (index >= 7) index -= 7;

    console.log(index);

    case_studies__table.animate({'marginLeft': '-' + index * 100 + '%'}, 1000);
});


// team cards
var team_cards = section_team.find('.ul_grid .li_card'),
    team_card__expanded;

team_cards.click(function (e, trigger) {
    if (team_card__expanded) team_card__expanded.removeAttr('style');
    team_card__expanded = $(this).parent('li');
    var content = team_card__expanded.find('.li_card__content'),
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
var mapZoom_contact = 14,
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

var btnZoomIn_contact = document.getElementById('btnZoomIn_contact'),
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