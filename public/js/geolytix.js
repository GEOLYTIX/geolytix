const helper = require('./helper');
const L = require('leaflet');



//image gd
const parallax_team_photo = document.getElementById('team_photo');
parallax_team_photo.style.height = parallax_team_photo.offsetWidth * 0.47 + 'px';

const imgLoadArray = document.querySelectorAll('.img__load');
for (let i = 0; i < imgLoadArray.length; i++) {
    let img = new Image();
    img.onload = function(){
        imgLoadArray[i].style['background-image'] = 'url(/images/' + imgLoadArray[i].dataset.src +')';
    };
    img.src = '/images/' + imgLoadArray[i].dataset.src;
}



//window control
let body = document.querySelector('html, body');

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
let section_services = document.getElementById('section_services'),
    service_cards = section_services.querySelectorAll('.ul_grid .li_card');
for (let i = 0; i < service_cards.length; i++) {
    service_cards[i].addEventListener('click', function() {
        expandCard(section_services, this)
    });
}
expandCard(section_services, section_services.querySelector('.network_strategy'));

let section_team = document.getElementById('section_team'),
    team_cards = section_team.querySelectorAll('.ul_grid .li_card');
for (let i = 0; i < team_cards.length; i++) {
    team_cards[i].addEventListener('click', function() {
        expandCard(section_team, this);
        helper.scrollElement(body, this.getBoundingClientRect().top + window.pageYOffset - 80, 400)
    });
}
expandCard(section_team, section_team.querySelector('.blair'));

function expandCard(section, _this) {
    helper.removeClass(section.querySelector('.li_expander_visible'), 'li_expander_visible');
    if (section.querySelector('.li_card__expanded')) section.querySelector('.li_card__expanded').parentNode.removeAttribute('style');
    helper.removeClass(section.querySelector('.li_card__expanded'), 'li_card__expanded');
    helper.addClass(_this, 'li_card__expanded');
    _this.parentNode.style.height = (_this.parentNode.querySelector('.li_card').offsetHeight + _this.parentNode.querySelector('.li_card__content').offsetHeight + 50) + 'px';
    helper.addClass(_this.nextElementSibling, 'li_expander_visible');
}



// case studies
let section_case_studies = document.getElementById('section_case_studies');
section_case_studies.querySelector('.strip').addEventListener('click', function(event){
    helper.removeClass(section_case_studies.querySelector('.active'), 'active');
    helper.addClass(event.target, 'active');
    let index = helper.indexInParent(event.target) - 1;
    section_case_studies.querySelector('.strip').style['marginLeft'] = '-' + index * 20 + '%';
    if (index > 8) index -= 8;
    if (index < 0) index += 8;
    helper.addClass(section_case_studies.querySelectorAll('.logo')[index+1], 'active');
    section_case_studies.querySelector('.strip').style['marginLeft'] = '-' + index * 20 + '%';
    index++;
    if (index >= 8) index -= 8;
    section_case_studies.querySelector('.container_table').style['marginLeft'] = '-' + index * 100 + '%';
});



// geodata
let mapZoom = 13;
const map = L.map('map_geodata', {
    renderer: L.svg(),
    scrollWheelZoom: false,
    zoomControl: false,
    maxBounds: L.latLngBounds(L.latLng(51.35, -0.4), L.latLng(51.65, 0.2)),
    minZoom: 12,
    maxZoom: 17
}).setView([51.50, -0.1], mapZoom);

const btnZoomIn = document.getElementById('btnZoomIn');
const btnZoomOut = document.getElementById('btnZoomOut');

function chkZoomBtn(){
    mapZoom < 17 ? btnZoomIn.disabled = false : btnZoomIn.disabled = true;
    mapZoom > 12 ? btnZoomOut.disabled = false : btnZoomOut.disabled = true;
}

btnZoomIn.addEventListener('click', function () {
    if (this.disabled) return;
    mapZoom++;
    map.setZoom(mapZoom);
    chkZoomBtn();
});

btnZoomOut.addEventListener('click', function(){
    if (this.disabled) return;
    mapZoom--;
    map.setZoom(mapZoom);
    chkZoomBtn();
});

const geodata = require('./geodata')(map);

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

const scrolly = require('./lscrolly');

document.querySelector('.geodata__select').addEventListener('click', function(){
    let id = event.target.id;
    history.pushState({so: 'glx'}, id, '?' + id);
    selectGeodata(event.target);
});

function selectGeodata(_this) {
    document.querySelector('.geodata__pricing').style.display = 'none';
    document.querySelector('.geodata__faq').style.display = 'none';

    helper.removeClass(document.querySelector('.geodata__select .selected'), 'selected');
    helper.addClass(_this, 'selected');

    map.eachLayer(function (layer) {
        map.removeLayer(layer);
    });
    map.off('movestart');
    map.off('mousemove');
    map.off('click');
    map.off('zoomend');
    map.off('moveend');

    // map.on('movestart', function () {
    //     if (layerGrid) map.removeLayer(layerGrid);
    // });

    map.on('moveend', function () {
        mapZoom = map.getZoom();
        chkZoomBtn();
    });

    map.on('zoomend', function () {
        mapZoom = map.getZoom();
        chkZoomBtn();
    });

    document.getElementById('btnFullScreen').href = '/map?' + _this.id;

    let xhr = new XMLHttpRequest();
    xhr.open('GET', '/tmpl/gd_' + _this.id + '.html');
    xhr.setRequestHeader('Content-Type', 'text/html');
    xhr.onload = function () {
        if (xhr.status === 200) {
            document.getElementById('geodata__info_content').innerHTML = window.jsrender.templates(xhr.responseText).render();
            scrolly('geodata__info');
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
        selectGeodata(document.getElementById('seamless_locales'));
    }
})(window.location.search.substring(1));



// contact map
let mapZoom_contact = 14;

const map_contact = L.map('map_contact', {
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
            iconUrl: '/images/leaflet/marker.svg',
            iconSize: [80, 40],
            iconAnchor: [40, 40]
        })
    })
    .addTo(map_contact);

const btnZoomIn_contact = document.getElementById('btnZoomIn_contact');
const btnZoomOut_contact = document.getElementById('btnZoomOut_contact');

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



//url hook scroll
scrollTo(window.location.search.substring(1));