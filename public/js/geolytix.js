// HEADER

window.onload = init();

function init() {
    window.addEventListener('scroll', function(){
        var distanceY = window.pageYOffset || document.documentElement.scrollTop,
            //header = document.querySelector('.header__menu');
            header = $('.header__menu');
        if (distanceY > 300) {
            //classie.add(header,"smaller");
            header.addClass('smaller');
        } else {
            // if (classie.has(header, "smaller")) {
            //     classie.remove(header, "smaller");
            // }
            if (header.hasClass('smaller')) {
                header.removeClass('smaller');
            }
        }
        if (distanceY > $('.img__cover').height()) {
            //classie.add(header,"smaller");
            header.addClass('main');
        } else {
            // if (classie.has(header, "smaller")) {
            //     classie.remove(header, "smaller");
            // }
            if (header.hasClass('main')) {
                header.removeClass('main');
            }
        }
    });
}



// RESIZE TO MOBILE

$(window).resize(function () {
    if (window.innerWidth <= 799) {
        window.location = '/mobile';
    }
    changeExpandedCardsHeight();
});



// MENU BUTTONS CONTROL

var section_services = $('#section_services'),
    section_case_studies = $('#section_case_studies'),
    section_geodata = $('#section_geodata'),
    section_team = $('#section_team'),
    section_contact = $('#section_contact'),
    subString = window.location.search.substring(1);

if (subString == 'services') {
    setTimeout(function () {
        body__inner.animate({scrollTop: body__inner.scrollTop() + section_services.offset().top - 70});
    }, 100);
}

if (subString == 'case_studies') {
    setTimeout(function () {
        body__inner.animate({scrollTop: body__inner.scrollTop() + section_case_studies.offset().top - 70});
    }, 100);
}
if (subString == 'geodata') {
    setTimeout(function () {
        body__inner.animate({scrollTop: body__inner.scrollTop() + section_geodata.offset().top - 70});
    }, 100);
}

if (subString == 'team') {
    setTimeout(function () {
        body__inner.animate({scrollTop: body__inner.scrollTop() + section_team.offset().top - 70});
    }, 100);
}

if (subString == 'contact') {
    setTimeout(function () {
        body__inner.animate({scrollTop: body__inner.scrollTop() + section_contact.offset().top - 70});
    }, 100);
}

$('.header__menu > .home').click(function (e) {
    e.preventDefault();
    body__inner.animate({ scrollTop: 0 });
});

$('.header__menu > .services').click(function () {
    body__inner.animate({ scrollTop: body__inner.scrollTop() + section_services.offset().top - 70 });
});

$('.header__menu > .case_studies').click(function () {
    body__inner.animate({ scrollTop: body__inner.scrollTop() + section_case_studies.offset().top - 70 });
});
$('.header__menu > .geodata').click(function () {
    body__inner.animate({ scrollTop: body__inner.scrollTop() + section_geodata.offset().top - 70 });
});

$('.header__menu > .team').click(function () {
    body__inner.animate({ scrollTop: body__inner.scrollTop() + section_team.offset().top - 70 });
});

$('.scroll__contact').click(function () {
    body__inner.animate({ scrollTop: body__inner.scrollTop() + section_contact.offset().top - 70 });
});



// GRIDS

var section_services__expanded_card,
    section_services__cards = section_services.find('.ul_grid .li_card'),
    section_team__expanded_card,
    section_team__cards = section_team.find('.ul_grid .li_card');

section_services__cards.click(function () {
    if (section_services__expanded_card) {section_services__expanded_card.removeAttr('style')}
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

section_team.find('.blair').first().trigger('click',[true]);

function expandTeamCard(e, trigger) {
    if (section_team__expanded_card) {section_team__expanded_card.removeAttr('style')}
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
            body__inner.animate({ scrollTop: body__inner.scrollTop() + section_team__expanded_card.offset().top - 70 });
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
section_case_studies.find('.strip > .logo').click(function(){
    $(this).siblings().removeClass('active');
    $(this).addClass('active');
    switch (true) {
        case $(this).hasClass('camelot'):
            case_studies_container.find('table').first().animate({ 'marginLeft': 0 }, 2000);
            break;
        case $(this).hasClass('johnlewis'):
            case_studies_container.find('table').first().animate({ 'marginLeft': case_studies_container.width() * -1 }, 1000);
            break;
        case $(this).hasClass('onthemarket'):
            case_studies_container.find('table').first().animate({ 'marginLeft': case_studies_container.width() * -2 }, 1000);
            break;
        case $(this).hasClass('arco'):
            case_studies_container.find('table').first().animate({ 'marginLeft': case_studies_container.width() * -3 }, 1000);
            break;
        case $(this).hasClass('totalfitness'):
            case_studies_container.find('table').first().animate({ 'marginLeft': case_studies_container.width() * -4 }, 1000);
            break;
        case $(this).hasClass('asda'):
            case_studies_container.find('table').first().animate({ 'marginLeft': case_studies_container.width() * -5 }, 1000);
            break;
    }
});



// CONTACT

var map_contact = L.map('map_contact', {scrollWheelZoom: false})
    .setView([51.52733, -0.11525], 14)
    .addLayer(L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png'));

new L.Marker(
    [51.52733, -0.11525],
    {
        icon: L.icon({
            iconUrl: '/public/images/leaflet/marker_a.svg',
            iconSize: [80, 40],
            iconAnchor: [40, 40]
        })
    })
    .addTo(map_contact);
