// LAZY LOAD IMAGES
const imgLoadArray = document.querySelectorAll('.img__load');

for (let i = 0; i < imgLoadArray.length; i++) {
    let img = new Image();
    img.onload = function () {
        imgLoadArray[i].style['background-image'] = 'url(/images/' + imgLoadArray[i].dataset.src + ')';
        if (imgLoadArray[i].id === 'header__image') document.querySelectorAll('.black').forEach(el => el.classList.remove('black'))
    };
    img.src = '/images/' + imgLoadArray[i].dataset.src;
}


// PARALLAX TEAM PHOTO
const parallax_team_photo = document.getElementById('team_photo');

parallax_team_photo.style.height = parallax_team_photo.offsetWidth * 0.47 + 'px';

window.addEventListener('resize', function () {
    parallax_team_photo.style.height = parallax_team_photo.offsetWidth * 0.47 + 'px';
});

window.addEventListener('scroll', function () {
    let shift = 100 - ((parallax_team_photo.offsetTop - window.pageYOffset) / window.innerHeight * 100);
    if (shift > 0 && shift < 100) parallax_team_photo.style.backgroundPosition = '50% ' + shift + '%';
});



// SERVICES
const section_services = document.getElementById('section_services');

const service_cards = section_services.querySelectorAll('.ul_grid .li_card');

for (let i = 0; i < service_cards.length; i++) {
    service_cards[i].addEventListener('click', function () {
        expandCard(section_services, this)
    });
}

expandCard(section_services, section_services.querySelector('.li_card'));



// TEAM
const section_team = document.getElementById('section_team');

const team_cards = section_team.querySelectorAll('.ul_grid .li_card');

for (let i = 0; i < team_cards.length; i++) {
    team_cards[i].addEventListener('click', function () {
        expandCard(section_team, this);
        scrollElementToTop(this, -80, 400);
    });
}

expandCard(section_team, section_team.querySelector('.li_card'));



function expandCard(section, _this) {

    section.querySelector('.visible') && section.querySelector('.visible').classList.remove('visible');

    if (section.querySelector('.expanded')) section.querySelector('.expanded').parentNode.removeAttribute('style');

    section.querySelector('.expanded') && section.querySelector('.expanded').classList.remove('expanded');

    _this.classList.add('expanded');

    _this.parentNode.style.height = (_this.parentNode.querySelector('.li_card').offsetHeight + _this.parentNode.querySelector('.li_expander').offsetHeight + 50) + 'px';

    _this.nextElementSibling.classList.add('visible');
}

function scrollElementToTop(element, offset, duration) {

    if (duration <= 0) return;

    let
        difference = element.getBoundingClientRect().top + offset,
        perTick = difference / duration * 10;

    setTimeout(function () {

        window.pageYOffset = window.pageYOffset + perTick;
        document.documentElement.scrollTop = document.documentElement.scrollTop + perTick;
        document.body.scrollTop = document.body.scrollTop + perTick;

        if (element.getBoundingClientRect().top === offset) return;

        scrollElementToTop(element, offset, duration - 10);

    }, 10);
}