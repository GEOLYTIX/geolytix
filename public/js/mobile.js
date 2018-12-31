const helper = require('./helper');

//intro text orientation
window.addEventListener('resize', function () {
    orientation();
});

window.addEventListener('orientationchange', function() {
    orientation();
});

function orientation() {
    document.getElementById('intro__text').innerHTML =
        locale === 'jp' ? 'より良い決断は、立地の意義するところにある' :
            locale === 'cn' ? '优化选址决策' :
                locale === 'pl' ? 'Lepsze decyzje tam gdzie lokalizacja ma znaczenie' :
                locale === 'de' ? (window.innerWidth || screen.height < window.innerWidth || screen.width) ?
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



// contact
/* let mapZoom_contact = 14;
const map_contact = L.map('map_contact', {
    scrollWheelZoom: false,
    zoomControl: false
})
.setView([0,0],2)
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

const locales = [
    {
        title: 'London',
        ll: [51.52733, -0.11525],
        add: [
            '+44 (0)20 72 39 49 77',
            'info@geolytix.co.uk',
            ' ',
            'Phoenix Yard',
            '65 Kings Cross Road',
            'London',
            'WC1X 9LW'
        ]
    },
    {
        title: 'Leeds',
        ll: [53.79664, -1.53385],
        add: [
            '+44 (0)20 72 39 49 77',
            'info@geolytix.co.uk',
            ' ',
            'ODI Leeds',
            '3rd Floor',
            'Munro House',
            'Duke Street',
            'Leeds',
            'LS9 8AG'
        ]
    },
    {
        title: 'Shanghai',
        ll: [31.22839, 121.45984],
        add: [
            '+86 21 6237 8013',
            '上海市静安区泰兴路89号3楼',
            ' ',
            '3F',
            '#89 Taixing Road',
            'Jing’an District',
            'Shanghai'
        ]
    },
    {
        title: 'Tokyo',
        ll: [35.65652, 139.6974],
        add: [
            '+81 (0) 3 5456 7954',
            'info@geolytix.com',
            ' ',
            '150-8512 東',
            '京都渋谷区桜ヶ丘町26-1',
            'セルリアンタワー15階',
            ' ',
            '15F Cerulean Tower',
            '26-1 Sakuragaoka cho',
            'Shibuya-ku',
            'Tokyo',
            '150-8512'
        ]
    },
    {
        title: 'Dortmund',
        ll: [51.5078, 7.33],
        add: [
            '+44 (0)20 72 39 49 77',
            'info@geolytix.co.uk',
            ' ',
            'Phoenix Yard',
            '65 Kings Cross Road',
            'London',
            'WC1X 9LW'
        ]
    },
    {
        title: 'Warsaw',
        ll: [52.2544, 20.984],
        add: [
            '+48 506 001 805',
            'info@geolytix.com',
            ' ',
            'Aleja Jana Pawła II 80',
            '00-175 Warszawa',
            'Babka Tower',
            'wejście H',
            'piętro 5'
        ]
    }
];
*/

const contact__text = document.getElementById('contact__text');

for (let i = 0; i < locales.length; i++) {
    locales[i].marker = new L.Marker(
        locales[i].ll,
        {
            icon: marker_alt,
            title: locales[i].title
        })
        .on('click', function(e){
            map_contact.setView(locales[i].ll);
            contact__text.innerHTML = '';
            for (let ii = 0; ii < locales.length; ii++) {
                locales[ii].marker.setIcon(marker_alt);
            }
            e.target.setIcon(marker);
            for (let iii = 0; iii < locales[i].add.length; iii++) {
                let el = document.createElement('div');
                el.textContent = locales[i].add[iii];
                contact__text.appendChild(el);
            }
        })
        .addTo(map_contact);
}

locales[parseInt(office)].marker.fireEvent('click');
