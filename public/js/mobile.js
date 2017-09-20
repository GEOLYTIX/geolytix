const helper = require('./helper');
const L = require('leaflet');

//intro text orientation
window.addEventListener('resize', function () {
    orientation();
});

window.addEventListener('orientationchange', function() {
    orientation();
});

function orientation() {
    document.getElementById('intro__text').innerHTML = (window.innerWidth || screen.height < window.innerWidth || screen.width) ?
        'better decisions<br>where location matters' : 'better<br>decisions<br>where<br>location<br>matters';
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

const map_links = document.querySelectorAll('.map_link');
for (let i = 0; i < map_links.length; i++) {
    map_links[i].addEventListener('click', function() {
        history.pushState({so: 'glx'}, 'geodata', '?geodata');
    });
}

const sections = {
    services: 'services__section',
    case_studies: 'case_studies__section',
    geodata: 'geodata__section',
    team: 'team__section',
    contact: 'footer',
    seamless_locales: 'geodata__section',
    retail_points: 'geodata__section',
    retail_places: 'geodata__section',
    public_transport: 'geodata__section',
    postal_geom: 'geodata__section',
    town_suburb: 'geodata__section',
    education: 'geodata__section',
    workplace: 'geodata__section',
    poi: 'geodata__section',
    residential: 'geodata__section',
    uk_admin: 'geodata__section',
    property: 'geodata__section',
    road_network: 'geodata__section',
    media_com: 'geodata__section',
    physical: 'geodata__section'
};
function scrollTo(section){
    if (sections[section]) helper.scrollElement(document.getElementById('inner'), document.getElementById(sections[section]).getBoundingClientRect().top + window.pageYOffset, 400);
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
        let swapx = document.getElementById('case_studies__logos__table').offsetWidth / 8,
            scrollx = document.getElementById('case_studies__logos').scrollLeft;

        helper.removeClass(document.querySelectorAll('#case_studies__info .active'), 'active');

        scrollx < (swapx/2) ? helper.addClass(document.querySelectorAll('#case_studies__info .camelot'), 'active') :
            scrollx < swapx + (swapx/2) ? helper.addClass(document.querySelectorAll('#case_studies__info .johnlewis'), 'active') :
                scrollx < swapx * 2 + (swapx/2) ? helper.addClass(document.querySelectorAll('#case_studies__info .onthemarket'), 'active') :
                    scrollx < swapx * 3 + (swapx/2) ? helper.addClass(document.querySelectorAll('#case_studies__info .arco'), 'active') :
                        scrollx < swapx * 4 + (swapx/2) ? helper.addClass(document.querySelectorAll('#case_studies__info .totalfitness'), 'active') :
                            scrollx < swapx * 5 + (swapx/2) ? helper.addClass(document.querySelectorAll('#case_studies__info .asda'), 'active') :
                                scrollx < swapx * 6 + (swapx/2) ? helper.addClass(document.querySelectorAll('#case_studies__info .swinton'), 'active') :
                                    helper.addClass(document.querySelectorAll('#case_studies__info .marks_and_spencer'), 'active');

        document.getElementById('case_studies__info').scrollLeft = 0;
    },300));
}



// contact
let mapZoom_contact = 14;
const map_contact = L.map('map_contact', {
    scrollWheelZoom: false,
    zoomControl: false
}).addLayer(L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png'));

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
        document.getElementById('contact_london').style['display'] = 'inline-block';
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
        document.getElementById('contact_leeds').style['display'] = 'inline-block';
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
        document.getElementById('contact_tokyo').style['display'] = 'inline-block';
        e.target.setIcon(marker);
    })
    .addTo(map_contact);

if (locale === 'uk'){
    map_contact.setView([53.2,-0.7], 5);
}

if (locale === 'jp') {
    map_contact.setView([35.65652,139.6974], 5);
    London.setIcon(marker_alt);
    Leeds.setIcon(marker_alt);
    Tokyo.setIcon(marker);
}

if (locale === 'cn') {
    map_contact.setView([52, 48], 1);
}
