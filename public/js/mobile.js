const helper = require('./helper');

//intro text orientation
window.addEventListener('resize', function () {
    orientation();
});

window.addEventListener('orientationchange', function() {
    orientation();
});

const _locale = document.body.dataset.locale;

function orientation() {
    document.getElementById('intro__text').innerHTML =
    _locale === 'jp' ? 'より良い決断は、立地の意義するところにある' :
    _locale === 'cn' ? '优化选址决策' :
    _locale === 'pl' ? 'Lepsze decyzje tam gdzie lokalizacja ma znaczenie' :
    _locale === 'de' ? (window.innerWidth || screen.height < window.innerWidth || screen.width) ?
                    'Bessere Entscheidungen<br>am richtigen Ort.' :
                    'Bessere<br>Entscheidungen<br>am richtigen<br>location<br>Ort.' :
                    (window.innerWidth || screen.height < window.innerWidth || screen.width) ?
                        'better decisions<br>where location matters' :
                        'better<br>decisions<br>where<br>location<br>matters';
}

orientation();




//menu
document.getElementById('intro__burger').addEventListener('click', function(){
    helper.toggleClass(document.getElementById('intro__menu'),'show');
});

document.getElementById('intro__menu').addEventListener('click', function(event){
    helper.toggleClass(document.getElementById('intro__menu'),'show');
    history.pushState({so: 'glx'}, event.target.id, '?' + event.target.id);
    scrollTo(event.target.id);
});


const sections = {
    services: 'services__section',
    case_studies: 'case_studies__section',
    geodata: 'geodata__section',
    team: 'team__section',
    contact: 'footer'
};
function scrollTo(section){
    if (sections[section]) helper.scrollElement(document.getElementById('inner'), document.getElementById(sections[section]).getBoundingClientRect().top + document.getElementById('inner').scrollTop, 400);
}
scrollTo(window.location.search.substring(1));



//load images
const imgLoadArray = document.querySelectorAll('.img__load');
for (let i = 0; i < imgLoadArray.length; i++) {
    let img = new Image();
    img.onload = function(){
        imgLoadArray[i].style['background-image'] = 'url(/images/' + imgLoadArray[i].dataset.src +')';
        if (imgLoadArray[i].id === 'intro__section') {
            document.getElementById('intro__logo').setAttribute('style', 'color: #fff');
            document.getElementById('intro__text').setAttribute('style', 'color: #fff');
        }
    };
    img.src = '/images/' + imgLoadArray[i].dataset.src;
}



//case studies
if (document.getElementById('case_studies__logos')){
    document.getElementById('case_studies__logos').addEventListener('scroll', helper.debounce(function(){
        let swapx = document.getElementById('case_studies__logos__table').offsetWidth / 9,
            scrollx = document.getElementById('case_studies__logos').scrollLeft;

        helper.removeClass(document.querySelectorAll('#case_studies__info .active'), 'active');

        scrollx < (swapx/2) ? helper.addClass(document.querySelectorAll('#case_studies__info .dominos'), 'active') :
            scrollx < swapx + (swapx/2) ? helper.addClass(document.querySelectorAll('#case_studies__info .camelot'), 'active') :
                scrollx < swapx * 2 + (swapx/2) ? helper.addClass(document.querySelectorAll('#case_studies__info .johnlewis'), 'active') :
                    scrollx < swapx * 3 + (swapx/2) ? helper.addClass(document.querySelectorAll('#case_studies__info .onthemarket'), 'active') :
                        scrollx < swapx * 4 + (swapx/2) ? helper.addClass(document.querySelectorAll('#case_studies__info .arco'), 'active') :
                            scrollx < swapx * 5 + (swapx/2) ? helper.addClass(document.querySelectorAll('#case_studies__info .totalfitness'), 'active') :
                                scrollx < swapx * 6 + (swapx/2) ? helper.addClass(document.querySelectorAll('#case_studies__info .asda'), 'active') :
                                    scrollx < swapx * 7 + (swapx/2) ? helper.addClass(document.querySelectorAll('#case_studies__info .swinton'), 'active') :
                                        helper.addClass(document.querySelectorAll('#case_studies__info .marks_and_spencer'), 'active');

        document.getElementById('case_studies__info').scrollLeft = 0;
    },300));
}