const helper = require('./helper');

//document.body.dataset.viewmode

// LAZY LOAD IMAGES
const parallax_team_photo = document.getElementById('team_photo');
parallax_team_photo.style.height = parallax_team_photo.offsetWidth * 0.47 + 'px';

const imgLoadArray = document.querySelectorAll('.img__load');
for (let i = 0; i < imgLoadArray.length; i++) {
    let img = new Image();
    img.onload = function () {
        imgLoadArray[i].style['background-image'] = 'url(/images/' + imgLoadArray[i].dataset.src + ')';
        if (imgLoadArray[i].id === 'header__image') {
            helper.removeClass(document.querySelectorAll('.black'), 'black');
        }
    };
    img.src = '/images/' + imgLoadArray[i].dataset.src;
}



// HEADER and WINDOW SCROLL
function setHeader() {
    let distanceY = document.documentElement.scrollTop || document.body.scrollTop;
    distanceY > 300 ? helper.addClass('.header', 'header__smaller') : helper.removeClass('.header', 'header__smaller');
    distanceY > document.getElementById('header__image').clientHeight - 80 ? helper.addClass('.header', 'header__main') : helper.removeClass('.header', 'header__main');
}
setHeader();

window.onscroll = function () {
    setHeader();
    let shift = 100 - ((parallax_team_photo.offsetTop - window.pageYOffset) / window.innerHeight * 100);
    if (shift > 0 && shift < 100) parallax_team_photo.style.backgroundPosition = '50% ' + shift + '%';
};

window.onresize = function () {
    parallax_team_photo.style.height = parallax_team_photo.offsetWidth * 0.47 + 'px';
};



//menu control
document.getElementById('home').addEventListener('click',
    function (e) {
        e.preventDefault();
        helper.scrollElementToTop(document.getElementById('header__image'), 0, 400);
        history.pushState({ so: 'glx' }, this.id, '?');
    }
);

document.querySelector('.header__menu').addEventListener('click', function (event) {
    history.pushState({ so: 'glx' }, event.target.id, '?' + event.target.id);
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
    if (sections[section]) helper.scrollBody(
        document.getElementById('section_' + section).getBoundingClientRect().top
        + window.pageYOffset
        - sections[section]
        , 400);
}



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
        helper.scrollElementToTop(this, -80, 400);
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
if (document.getElementById('section_case_studies')) {
    const section_case_studies = document.getElementById('section_case_studies');
    const case_studies_strip = section_case_studies.querySelector('#case_studies_strip > table');
    case_studies_strip.addEventListener('click', function (event) {
        helper.removeClass(section_case_studies.querySelectorAll('.active'), 'active');
        helper.addClass(event.target, 'active');
        let index = helper.indexInParent(event.target) - 1;
        case_studies_strip.style['marginLeft'] = '-' + index * 20 + '%';
        if (index > 9) index -= 9;
        if (index < 0) index += 9;
        helper.addClass(section_case_studies.querySelectorAll('.logo')[index + 1], 'active');
        case_studies_strip.style['marginLeft'] = '-' + index * 20 + '%';
        index++;
        if (index >= 9) index -= 9;
        section_case_studies.querySelector('#case_studies_container > table').style['marginLeft'] = '-' + index * 100 + '%';
    });
}



// geodata
const section_geodata = document.getElementById('section_geodata');

if (section_geodata) {

    const geodata_select = document.getElementById('geodata__select');

    Object.keys(geodata).forEach(
        function (set) {
            helper.createElement({
                tag: 'div',
                options: {
                    textContent: set
                },
                appendTo: geodata_select
            })
        });

    const pricing = function () {
        document.querySelector('.geodata__pricing').style.display = 'block';

        let selectedPacks = 4,
            priceTable = ['£ null', '£ 3,000', '£ 5,500', '£ 8,000', '£ 10,000', '£ 12,000', '£ 14,000', '£ 16,000', '£ 18,000', '£ 20,000', '£ 22,000', '£ 24,000', '£ 25,000'],
            pricetags = document.querySelectorAll('.pricetag');

        for (let i = 0; i < pricetags.length; i++) {
            pricetags[i].addEventListener('click', function () {
                helper.toggleClass(this, 'active');
                let n = this.innerHTML === '£ 5500 (2 Packs)' ? 2 : 1;

                if (this.innerHTML === 'Free') n = 0;

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

    const faq = function () {
        document.querySelector('.geodata__faq').style.display = 'block';
    };

    require('./lscrolly')(document.querySelector('.geodata__info'));

    document.querySelector('.geodata__select').addEventListener('click', function (event) {
        console.log(event.target);
        let geodataSet = geodata[event.target.innerText];


        geodataMap(geodataSet);
        // let id = event.target.id;
        // if (id) {
        //     history.pushState({ so: 'glx' }, id, '?' + id);
        //     selectGeodata(event.target);
        // }
    });

    let container = document.querySelector('.geodata__info > .content');

    let geodataXYZ;
    
    _xyz({
        host: 'https://geolytix.xyz/geodata',
        callback: _xyz => {

            geodataXYZ = _xyz;

            geodataMap({
                locale: 'London',
                meta: 'census',
                layers: ['base', 'label', 'census']
            })
        }
    });

    function geodataMap(dataset) {

        geodataXYZ.mapview.create({
            target: document.getElementById('map_geodata'),
            locale: dataset.locale,
            btn: {
                ZoomIn: document.getElementById('btnZoomIn'),
                ZoomOut: document.getElementById('btnZoomOut'),
            }
        });
  
        container.innerHTML = geodataXYZ.layers.list[dataset.meta].meta;

        Object.keys(geodataXYZ.layers.list).forEach(function(layer){
            geodataXYZ.layers.list[layer].remove();
        })

        dataset.layers.forEach(function(layer){
            geodataXYZ.layers.list[layer].show();
        })

        // geodataMap.locations.select_popup = location => {

        //     container.appendChild(location.info_table);

        // }

    }

        // document.querySelector('.geodata__pricing').style.display = 'none';

        // document.querySelector('.geodata__faq').style.display = 'none';

        // helper.removeClass(document.querySelector('.geodata__select .selected'), 'selected');

        // helper.addClass(_this, 'selected');

        // if (_this.id === 'faq') return faq();

        // if (_this.id === 'pricing') return pricing();

        // document.getElementById('btnFullScreen').href = 'https://geolytix.xyz/dev?locale=' + _this.id;


    // (function (dataset) {
    //     if (geodata[dataset]) {
    //         selectGeodata(document.getElementById(dataset));
    //         helper.scrollBody(document.getElementById('section_geodata').getBoundingClientRect().top + window.pageYOffset - 80, 400);
    //     } else {
    //         selectGeodata(document.querySelector('.geodata__select > div'));
    //     }
    // })(window.location.search.substring(1));

}


// contact map

_xyz({
    host: 'https://geolytix.xyz/dev',
    callback: _xyz => {

        _xyz.mapview.create({
            target: document.getElementById('map_contact'),
            locale: 'Offices',
            view: {
                lat: 45,
                lng: 60,
                z: 3
            },
            btn: {
                ZoomIn: document.getElementById('btnZoomIn_contact'),
                ZoomOut: document.getElementById('btnZoomOut_contact'),
            }
        });
    
        _xyz.layers.list.offices.show();
    
        _xyz.locations.select = location => {
    
            if (_xyz.locations.current) _xyz.locations.current.remove();
      
            Object.assign(location, _xyz.locations.location());
      
            _xyz.locations.current = location;
      
            location.get(() => {
    
                location.draw({
                    icon: {
                        url: _xyz.utils.svg_symbols({type: 'markerColor', style: {colorMarker: '#64dd17', colorDot: '#33691e'}}),
                        size: 40,
                        anchor: [20,40]
                      }
                });
      
                document.getElementById('contact__text').innerHTML = location.infoj[0].value;
      
            });
      
          };
    
        _xyz.locations.select({
            locale: "offices",
            layer: "offices",
            dbs: "XYZ",
            table: "glx_offices",
            id: 2
        });

    }
});

//url hook scroll
scrollTo(window.location.search.substring(1));