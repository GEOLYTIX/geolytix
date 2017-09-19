const helper = require('./helper');
const L = require('leaflet');



//images
const parallax_team_photo = document.getElementById('team_photo');
parallax_team_photo.style.height = parallax_team_photo.offsetWidth * 0.47 + 'px';

const imgLoadArray = document.querySelectorAll('.img__load');
for (let i = 0; i < imgLoadArray.length; i++) {
    let img = new Image();
    img.onload = function(){
        imgLoadArray[i].style['background-image'] = 'url(/images/' + imgLoadArray[i].dataset.src +')';
        if (imgLoadArray[i].id === 'header__image') {
            helper.removeClass(document.querySelectorAll('.black'),'black');
        }
    };
    img.src = '/images/' + imgLoadArray[i].dataset.src;
}



//window control
const body = document.querySelector('html, body');

function setHeader() {
    let distanceY = window.pageYOffset || document.documentElement.scrollTop;
    distanceY > 300 ? helper.addClass('.header','header__smaller') : helper.removeClass('.header','header__smaller');
    distanceY > document.getElementById('header__image').clientHeight - 80 ? helper.addClass('.header','header__main') : helper.removeClass('.header','header__main');
}
setHeader();

window.onscroll = function () {
    setHeader();
    let shift = 100 - ((parallax_team_photo.offsetTop - window.pageYOffset) / window.innerHeight * 100);
    if (shift > 0 && shift < 100) parallax_team_photo.style.backgroundPosition = "50% " + shift + "%";
};

window.onresize = function () {
    parallax_team_photo.style.height = parallax_team_photo.offsetWidth * 0.47 + 'px';
};



//menu control
document.getElementById('home').addEventListener('click',
    function (e) {
        e.preventDefault();
        helper.scrollElement(body, 0, 400);
        history.pushState({so: 'glx'}, this.id, '?');
    }
);

document.querySelector('.header__menu').addEventListener('click', function(event){
    history.pushState({so: 'glx'}, event.target.id, '?' + event.target.id);
    scrollTo(event.target.id);
});

const sections = {
    services: 100,
    case_studies: 50,
    geodata: 80,
    team: 80,
    contact: 70
};

function scrollTo(section) {
    if (sections[section]) helper.scrollElement(body, document.getElementById('section_' + section).getBoundingClientRect().top + window.pageYOffset - sections[section], 400);
}



// card controls
const section_services = document.getElementById('section_services');
const service_cards = section_services.querySelectorAll('.ul_grid .li_card');
for (let i = 0; i < service_cards.length; i++) {
    service_cards[i].addEventListener('click', function() {
        expandCard(section_services, this)
    });
}
expandCard(section_services, section_services.querySelector('.li_card'));

const section_team = document.getElementById('section_team');
const team_cards = section_team.querySelectorAll('.ul_grid .li_card');
for (let i = 0; i < team_cards.length; i++) {
    team_cards[i].addEventListener('click', function() {
        expandCard(section_team, this);
        helper.scrollElement(body, this.getBoundingClientRect().top + window.pageYOffset - 80, 400)
    });
}
expandCard(section_team, section_team.querySelector('.li_card'));

function expandCard(section, _this) {
    helper.removeClass(section.querySelector('.visible'), 'visible');
    if (section.querySelector('.expanded')) section.querySelector('.expanded').parentNode.removeAttribute('style');
    helper.removeClass(section.querySelector('.expanded'), 'expanded');
    helper.addClass(_this, 'expanded');
    _this.parentNode.style.height = (_this.parentNode.querySelector('.li_card').offsetHeight + _this.parentNode.querySelector('.li_expander').offsetHeight + 50) + 'px';
    helper.addClass(_this.nextElementSibling, 'visible');
}



// case studies
if (document.getElementById('section_case_studies')){
    const section_case_studies = document.getElementById('section_case_studies');
    const case_studies_strip = section_case_studies.querySelector('#case_studies_strip > table');
    case_studies_strip.addEventListener('click', function(event){
        helper.removeClass(section_case_studies.querySelector('.active'), 'active');
        helper.addClass(event.target, 'active');
        let index = helper.indexInParent(event.target) - 1;
        case_studies_strip.style['marginLeft'] = '-' + index * 20 + '%';
        if (index > 8) index -= 8;
        if (index < 0) index += 8;
        helper.addClass(section_case_studies.querySelectorAll('.logo')[index+1], 'active');
        case_studies_strip.style['marginLeft'] = '-' + index * 20 + '%';
        index++;
        if (index >= 8) index -= 8;
        section_case_studies.querySelector('#case_studies_container > table').style['marginLeft'] = '-' + index * 100 + '%';
    });
}


// geodata
const geodata = require('./geodata')();

geodata.pricing = function() {
    document.querySelector('.geodata__pricing').style.display = 'block';
    let selectedPacks = 4,
        priceTable = ['£ null', '£ 3,000', '£ 5,500', '£ 8,000', '£ 10,000', '£ 12,000', '£ 14,000', '£ 16,000', '£ 18,000', '£ 20,000', '£ 22,000', '£ 24,000', '£ 25,000'],
        pricetags = document.querySelectorAll('.pricetag');

    for (let i = 0; i < pricetags.length; i++) {
        pricetags[i].addEventListener('click', function () {
            helper.toggleClass(this, 'active');
            let n = this.innerHTML === '£ 5500 (2 Packs)' ? 2 : 1;
            selectedPacks += helper.hasClass(this, 'active') ? +n : -n;
            document.querySelector('.p_pricing__all').style.display = selectedPacks < 12 ? 'block' : 'none';
            document.querySelector('.p_pricing__first').style.display = selectedPacks < 12 ? 'block' : 'none';
            document.querySelector('.p_pricing__first_all').style.display = selectedPacks >= 12 ? 'block' : 'none';
            document.querySelector('.p_pricing__first_select').style.display = selectedPacks === 0 ? 'block' : 'none';
            document.querySelector('.p_pricing__three').style.display = selectedPacks < 3 && selectedPacks >= 1 ? 'block' : 'none';
            document.querySelector('.p_pricing__six').style.display = selectedPacks < 6 && selectedPacks >= 3 ? 'block' : 'none';
            document.querySelector('.p_pricing__nine').style.display = selectedPacks < 9 && selectedPacks >= 6 ? 'block' : 'none';
            document.querySelector('.p_pricing__current').style.display = selectedPacks > 0 ? 'block' : 'none';
            document.getElementById('p_pricing__current').innerHTML = priceTable[selectedPacks] || '£ 25,000';
        });
    }
};

geodata.faq = function() {
    document.querySelector('.geodata__faq').style.display = 'block';
};

require('./lscrolly')(document.querySelector('.geodata__info'));

document.querySelector('.geodata__select').addEventListener('click', function(){
    let id = event.target.id;
    history.pushState({so: 'glx'}, id, '?' + id);
    selectGeodata(event.target);
});


const jsr = require('jsrender')();
function selectGeodata(_this) {
    document.querySelector('.geodata__pricing').style.display = 'none';
    document.querySelector('.geodata__faq').style.display = 'none';

    helper.removeClass(document.querySelector('.geodata__select .selected'), 'selected');
    helper.addClass(_this, 'selected');

    document.getElementById('btnFullScreen').href = '/map?' + _this.id;

    let xhr = new XMLHttpRequest();
    xhr.open('GET', '/tmpl/gd_' + _this.id + '.html');
    xhr.setRequestHeader('Content-Type', 'text/html');
    xhr.onload = function () {
        if (xhr.status === 200) {
            document.querySelector('.geodata__info > .content').innerHTML = jsr.templates(xhr.responseText).render();
            geodata[_this.id]();
        }
    };
    xhr.send();
}

(function(dataset){
    if (geodata[dataset]) {
        selectGeodata(document.getElementById(dataset));
        helper.scrollElement(body, document.getElementById('section_geodata').getBoundingClientRect().top + window.pageYOffset - 80, 400);
    } else {
        selectGeodata(document.querySelector('.geodata__select > div'));
    }
})(window.location.search.substring(1));



// contact map
const map_contact = L.map('map_contact', {
    scrollWheelZoom: false,
    zoomControl: false
})
    .setView([52, 43], 2)
    .addLayer(L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png'));

const marker = L.icon({
    iconUrl: '/images/leaflet/marker.svg',
    iconSize: [80, 40],
    iconAnchor: [40, 40]
});

const marker_alt = L.icon({
    iconUrl: '/images/leaflet/marker_alt.svg',
    iconSize: [80, 40],
    iconAnchor: [40, 40]
});

const London = new L.Marker(
    [51.52733, -0.11525],
    {
        icon: marker,
        title: 'London'
    })
    .on('click', function(e){
        Leeds.setIcon(marker_alt);
        document.getElementById('contact_leeds').style['display'] = 'none';
        Tokyo.setIcon(marker_alt);
        document.getElementById('contact_tokyo').style['display'] = 'none';
        document.getElementById('contact_london').style['display'] = 'block';
        e.target.setIcon(marker);
    })
    .addTo(map_contact);

const Leeds = new L.Marker(
    [53.79664,-1.53385],
    {
        icon: marker_alt,
        title: 'Leeds'
    })
    .on('click', function(e){
        London.setIcon(marker_alt);
        document.getElementById('contact_london').style['display'] = 'none';
        Tokyo.setIcon(marker_alt);
        document.getElementById('contact_tokyo').style['display'] = 'none';
        document.getElementById('contact_leeds').style['display'] = 'block';
        e.target.setIcon(marker);
    })
    .addTo(map_contact);

const Tokyo = new L.Marker(
    [35.65652,139.6974],
    {
        icon: marker_alt,
        title: 'Tokyo'
    })
    .on('click', function(e){
        London.setIcon(marker_alt);
        document.getElementById('contact_london').style['display'] = 'none';
        Leeds.setIcon(marker_alt);
        document.getElementById('contact_leeds').style['display'] = 'none';
        document.getElementById('contact_tokyo').style['display'] = 'block';
        e.target.setIcon(marker);
    })
    .addTo(map_contact);

document.getElementById('btnZoomIn_contact').addEventListener('click', function () {
    map_contact.setZoom(map_contact.getZoom() + 1);
});

btnZoomOut_contact.addEventListener('click', function(){
    map_contact.setZoom(map_contact.getZoom() - 1);
});


//url hook scroll
scrollTo(window.location.search.substring(1));