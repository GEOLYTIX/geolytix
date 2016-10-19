var intro_text = $('.intro_text');
function orientation() {
    if (window.innerHeight < window.innerWidth) {
        intro_text.html('make better decisions<br>where location matters');
    } else {
        intro_text.html('make<br>better<br>decisions<br>where<br>location<br>matters');
    }
}
orientation();
$(window).resize(function () {
    if (window.innerWidth > 799) {
        window.location = "/";
    }
    if (window.innerWidth > window.innerHeight) {
        orientation();
    }
});



// CONTACT SCROLL
var body__inner = $('.inner').first();
$('.scroll__contact').click(function () {
    body__inner.animate({ scrollTop: body__inner.scrollTop() + $('#footer__menu').offset().top - 70 });
});




// preload images
var section_intro = $('#section_intro');
section_intro.find('.img__preload').attr('src', '/public/images/intro_naeblys.jpg').load(function () {
    $(this).remove();
    section_intro.css('background-image', 'url(/public/images/intro_naeblys.jpg)');
    section_intro.find('span').css({
        'color': '#fff'
    });
    setTimeout(function () {
        section_intro.find('span').css({
            'text-shadow': '3px 3px 3px #000'
        });
    }, 300);
});



//scroll container
var scrolly,
    currentClientCard = 'boots',
    ClientCard = 'boots',
    section_clients = $('#section_clients'),
    section_services = $('#section_services'),
    scrollContainerClientLogo = section_clients.find('.container').first(),
    scrollContainerClientInfo = section_clients.find('.container').last(),
    swapy = window.innerWidth ? window.innerWidth / 2 - 30: $(window).width() / 2 - 30;

scrollContainerClientLogo.on('scrollstop', $.debounce(250, function () {
    console.log(scrollContainerClientLogo.scrollLeft());
    scrolly = scrollContainerClientLogo.scrollLeft();
    scrolly < swapy ? ClientCard = 'johnlewis' :
        scrolly < swapy * 3 ? ClientCard = 'camelot' :
            scrolly < swapy * 5 ? ClientCard = 'onthemarket' :
                scrolly < swapy * 7 ? ClientCard = 'boots' :
                    scrolly < swapy * 9.5 ? ClientCard = 'totalfitness' :
                        ClientCard = 'asda';
    if (currentClientCard != ClientCard) {
        currentClientCard = ClientCard;
        section_clients.find('.logo').removeClass('active');
        scrollContainerClientLogo.find('.' + ClientCard).first().addClass('active');
        scrollContainerClientInfo.find('.card').hide();
        scrollContainerClientInfo.find('.' + ClientCard).show();
        scrollContainerClientInfo.animate({scrollLeft: 0});
    }
}));

section_services.find('.scroll__x').first().on('scrollstop', $.debounce(250, function () {
    console.log(section_services.find('.scroll__x').first().scrollLeft());
}));

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
