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
    case_studies__table = case_studies_container.find('table').first();

section_case_studies.find('.strip > .logo').click(function () {
    $(this).siblings().removeClass('active');
    $(this).addClass('active');
    case_studies__table.animate({'marginLeft': case_studies_container.width() * -$(this).index()}, 1000);
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
var map_contact = L.map('map_contact', {
    scrollWheelZoom: false,
    zoomControl: false
})
    .setView([51.52733, -0.11525], 14)
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

var contact__btnZoomIn = $('.contact__limiter > .btnZoomIn');
contact__btnZoomIn.click(function() {
    map_contact.setZoom(map_contact.getZoom() + 1);
});

var contact__btnZoomOut = $('.contact__limiter > .btnZoomOut');
contact__btnZoomOut.click(function() {
    map_contact.setZoom(map_contact.getZoom() - 1);
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