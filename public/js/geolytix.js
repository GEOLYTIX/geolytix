var header = $('.header__menu'),
    intro_img = $('#section_intro'),
    parallax_team_photo = document.getElementById('team_photo');

header.removeClass('load');

window.onscroll = function () {

    // TITLE
    var distanceY = window.pageYOffset || document.documentElement.scrollTop;
    distanceY > 300 ? header.addClass('smaller') : header.removeClass('smaller');
    distanceY > intro_img.height() - 80 ? header.addClass('main') : header.removeClass('main');

    // PARALLAX
    var shift = 100 - ((parallax_team_photo.offsetTop - window.pageYOffset) / window.innerHeight * 100);
    if (shift > 0 && shift < 100) {
        parallax_team_photo.style.backgroundPosition = "50% " + shift + "%";
    }
};

window.onresize = function () {
    window.innerWidth <= 799 ? window.location = '/mobile' : null;
    changeExpandedCardsHeight();
    resize_team_photo();
};

resize_team_photo();
function resize_team_photo() {
    var width = parallax_team_photo.offsetWidth;
    parallax_team_photo.style.height = width * 0.47 + 'px';
}


// MENU BUTTONS CONTROL
var body = $('body'),
    section_services = $('#section_services'),
    section_case_studies = $('#section_case_studies'),
    section_geodata = $('#section_geodata'),
    section_team = $('#section_team'),
    section_contact = $('#section_contact'),
    subString = window.location.search.substring(1);

subString == 'services' ? body.animate({scrollTop: section_services.offset().top - 100}) :
    subString == 'case_studies' ? body.animate({scrollTop: section_case_studies.offset().top - 50}) :
        subString == 'geodata' ? body.animate({scrollTop: section_geodata.offset().top - 80}) :
            subString == 'team' ? body.animate({scrollTop: section_team.offset().top - 80}) :
                subString == 'contact' ? body.animate({scrollTop: section_contact.offset().top - 70}) : null;

$('#home').click(function (e) {
    e.preventDefault();
    body.animate({scrollTop: 0});
});

$('#services').click(function () {
    body.animate({scrollTop: section_services.offset().top - 100});
});

$('#case_studies').click(function () {
    body.animate({scrollTop: section_case_studies.offset().top - 50});
});

$('#geodata').click(function () {
    body.animate({scrollTop: section_geodata.offset().top - 80});
});

$('#team').click(function () {
    body.animate({scrollTop: section_team.offset().top - 80});
});

$('#contact').click(function () {
    body.animate({scrollTop: section_contact.offset().top - 70});
});


// UL_GRIDS
var section_services__expanded_card,
    section_services__cards = section_services.find('.ul_grid .li_card'),
    section_team__expanded_card,
    section_team__cards = section_team.find('.ul_grid .li_card');

section_services__cards.click(function () {
    if (section_services__expanded_card) {
        section_services__expanded_card.removeAttr('style')
    }
    section_services__expanded_card = $(this).parent('li');
    var content = section_services__expanded_card.find('.li_card__content'),
        li_expander = $(this).nextAll('.li_expander');
    if (section_services__expanded_card.hasClass('li_expanded')) {
        section_services__expanded_card.removeClass('li_expanded').removeAttr('style');
        li_expander.css('visibility', 'hidden');
    } else {
        section_services.find('.li_expander').css('visibility', 'hidden');
        section_services.find('.li_expanded').removeClass('li_expanded');
        section_services__expanded_card.addClass('li_expanded').height($(this).height() + content.height() + 50);
        content.css('opacity', 0).animate({opacity: 1});
        li_expander.css('visibility', 'visible');
    }
});

section_services.find('.network_strategy').first().trigger('click');

section_team__cards.click(expandTeamCard);

section_team.find('.blair').first().trigger('click', [true]);

function expandTeamCard(e, trigger) {
    if (section_team__expanded_card) {
        section_team__expanded_card.removeAttr('style')
    }
    section_team__expanded_card = $(this).parent('li');
    var content = section_team__expanded_card.find('.li_card__content'),
        li_expander = $(this).nextAll('.li_expander');
    if (section_team__expanded_card.hasClass('li_expanded')) {
        section_team__expanded_card.removeClass('li_expanded').removeAttr('style');
        li_expander.css('visibility', 'hidden');
    } else {
        section_team.find('.li_expander').css('visibility', 'hidden');
        section_team.find('.li_expanded').removeClass('li_expanded');
        section_team__expanded_card.addClass('li_expanded').height($(this).height() + content.height() + 50);
        content.css('opacity', 0).animate({opacity: 1});
        li_expander.css('visibility', 'visible');
        if (trigger != true) {
            body.animate({scrollTop: section_team__expanded_card.offset().top - 80});
        }
    }
}

function changeExpandedCardsHeight() {
    if (section_services__expanded_card) {
        section_services__expanded_card.height(section_services__expanded_card.find('.li_card').height() + section_services__expanded_card.find('.li_card__content').height() + 50);
    }
    if (section_team__expanded_card) {
        section_team__expanded_card.height(section_team__expanded_card.find('.li_card').height() + section_team__expanded_card.find('.li_card__content').height() + 50);
    }
}


// CASE STUDIES
var case_studies_container = section_case_studies.find('.container').first();
section_case_studies.find('.strip > .logo').click(function () {
    $(this).siblings().removeClass('active');
    $(this).addClass('active');
    switch (true) {
        case $(this).hasClass('camelot'):
            case_studies_container.find('table').first().animate({'marginLeft': 0}, 2000);
            break;
        case $(this).hasClass('johnlewis'):
            case_studies_container.find('table').first().animate({'marginLeft': case_studies_container.width() * -1}, 1000);
            break;
        case $(this).hasClass('onthemarket'):
            case_studies_container.find('table').first().animate({'marginLeft': case_studies_container.width() * -2}, 1000);
            break;
        case $(this).hasClass('arco'):
            case_studies_container.find('table').first().animate({'marginLeft': case_studies_container.width() * -3}, 1000);
            break;
        case $(this).hasClass('totalfitness'):
            case_studies_container.find('table').first().animate({'marginLeft': case_studies_container.width() * -4}, 1000);
            break;
        case $(this).hasClass('asda'):
            case_studies_container.find('table').first().animate({'marginLeft': case_studies_container.width() * -5}, 1000);
            break;
    }
});


// CONTACT
var map_contact = L.map('contact_map', {scrollWheelZoom: false})
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
