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
    body__inner.animate({ scrollTop: body__inner.scrollTop() + footer.offset().top - 70 });
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



// READER
var reader = $('#reader'),
    reader__bottom = reader.find('.bottom').first(),
    reader__content = reader__bottom.find('.content').first(),
    reader__pdf = reader.find('.top > .pdf'),
    reader__blog = reader.find('.top > .blog'),
    footer = $('#footer__menu');

footer.find('.privacy_policy').first().click(function () {
    var t = document.querySelector('#template__privacy_policy');
    document.querySelector('#reader > .bottom > .content').appendChild(document.importNode(t.content, true));
    reader__pdf.attr('href', 'https://docs.google.com/document/d/1ZyhEzxi0MCsMK3HnR6fGpBhNm725916AxmElkOsHFIY');
    reader__pdf.show();
    reader.show();
    reader__bottom.animate({scrollTop: 0});
});

footer.find('.terms_conditions').first().click(function(){
    var t = document.querySelector('#template__terms_conditions');
    document.querySelector('#reader > .bottom > .content').appendChild(document.importNode(t.content, true));
    reader__pdf.attr('href','https://docs.google.com/document/d/1MteGDtrZx2TWXcuKqTzEMPRGmtlvEzF0g9Vy9r5H_vs');
    reader__pdf.show();
    reader.show();
    reader__bottom.animate({ scrollTop: 0 });
});

reader.find('.top > .logo').click(function(){
    reader.hide();
    reader__content.empty();
    reader__pdf.hide();
    reader__blog.hide();
});

reader.find('.top > .close').click(function(){
    reader.hide();
    reader__content.empty();
    reader__pdf.hide();
    reader__blog.hide();
});



// BLOG
var section_blog = $('#section_blog');
section_blog.find('.card').click(function(){
    var t = $(this).html();
    reader__content.html(t);
    reader__blog.attr('href',$(this).attr('href'));
    reader__blog.show();
    reader.show();
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
