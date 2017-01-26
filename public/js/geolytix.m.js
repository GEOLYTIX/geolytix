var intro__text = $('.intro__text');
orientation();
function orientation() {
    if (window.innerHeight < window.innerWidth) {
        intro__text.html('better decisions<br>where location matters');
    } else {
        intro__text.html('better<br>decisions<br>where<br>location<br>matters');
    }
}

$(window).resize(function () {
    if (window.innerWidth > 799) {
        window.location = "/";
    }
    if (window.innerWidth > window.innerHeight) {
        orientation();
    }
});



// preload images
var img = new Image();
var section_intro = $('.intro__section');
img.onload = function(){
    section_intro.css('background-image', 'url(/public/images/intro_geolytix_m.jpg)');
    section_intro.find('span').css({'color': '#fff'});
};
img.src = '/public/images/intro_geolytix_m.jpg';



// scroll to substring
var subString = window.location.search.substring(1);
if (subString == 'services') {
    setTimeout(function () {
        body__inner.animate({scrollTop: $('#section_services').offset().top});
    }, 100);
}
if (subString == 'clients') {
    setTimeout(function () {
        body__inner.animate({scrollTop: $('#section_clients').offset().top});
    }, 100);
}
if (subString == 'geodata') {
    setTimeout(function () {
        body__inner.animate({scrollTop: $('#section_geodata').offset().top});
    }, 100);
}
if (subString == 'team') {
    setTimeout(function () {
        body__inner.animate({scrollTop: $('#section_team').offset().top});
    }, 100);
}



//scroll container
var scrolly,
    currentClientCard = 'camelot',
    ClientCard = 'camelot',
    section_clients = $('#case_studies__section'),
    csLogos = $('.case_studies__logos'),
    csInfo = $('.case_studies__info'),
    swapy = window.innerWidth ? window.innerWidth / 2 - 30: $(window).width() / 2 - 30;

csInfo.find('.camelot').show();

csLogos.on('scrollstop', $.debounce(250, function () {

    console.log(csLogos.scrollLeft());
    scrolly = csLogos.scrollLeft();

    scrolly < swapy ? ClientCard = 'camelot' :
        scrolly < swapy * 3 ? ClientCard = 'johnlewis' :
            scrolly < swapy * 5 ? ClientCard = 'onthemarket' :
                scrolly < swapy * 7 ? ClientCard = 'arco' :
                    scrolly < swapy * 9.5 ? ClientCard = 'totalfitness' :
                        ClientCard = 'asda';

    if (currentClientCard != ClientCard) {
        currentClientCard = ClientCard;
        section_clients.find('.logo').removeClass('active');
        csLogos.find('.' + ClientCard).first().addClass('active');
        csLogos.find('.card').hide();
        csInfo.find('.' + ClientCard).show();
        csInfo.animate({scrollLeft: 0});
    }
}));
