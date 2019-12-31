// PARALLAX TEAM PHOTO
const parallax_team_photo = document.getElementById('team_photo');

parallax_team_photo.style.height = parallax_team_photo.offsetWidth * 0.47 + 'px';


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


// HEADER and WINDOW SCROLL
function setHeader() {
    let distanceY = document.documentElement.scrollTop || document.body.scrollTop;
    distanceY > 300 ?
        document.querySelector('.header').classList.add('header__smaller') :
        document.querySelector('.header').classList.remove('header__smaller');

    distanceY > document.getElementById('header__image').clientHeight - 80 ?
        document.querySelector('.header').classList.add('header__main') :
        document.querySelector('.header').classList.remove('header__main');
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


//MENU
document.getElementById('home').addEventListener('click', function (e) {
    e.preventDefault();
    scrollElementToTop(document.getElementById('header__image'), 0, 400);
    history.pushState({ so: 'glx' }, this.id, '?');
});

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
    if (sections[section]) scrollBody(
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


// CASE STUDIES
if (document.getElementById('section_case_studies')) {
    const section_case_studies = document.getElementById('section_case_studies');
    const case_studies_strip = section_case_studies.querySelector('#case_studies_strip > table');
    case_studies_strip.addEventListener('click', function (event) {

        section_case_studies.querySelectorAll('.active').forEach(el => el.classList.remove('active'))

        event.target.classList.add('active');

        let index = indexInParent(event.target) - 1;
        case_studies_strip.style['marginLeft'] = '-' + index * 20 + '%';
        if (index > 9) index -= 9;
        if (index < 0) index += 9;

        section_case_studies.querySelectorAll('.logo')[index + 1].classList.add('active');

        case_studies_strip.style['marginLeft'] = '-' + index * 20 + '%';
        index++;
        if (index >= 9) index -= 9;
        section_case_studies.querySelector('#case_studies_container > table').style['marginLeft'] = '-' + index * 100 + '%';
    });

    function indexInParent(node) {
        let children = node.parentNode.childNodes,
            num = 0;
        for (let i = 0; i < children.length; i++) {
            if (children[i] === node) return num;
            if (children[i].nodeType === 1) num++;
        }
        return -1;
    }
}


// GEODATA
if (document.getElementById('section_geodata')) {

    const geodata_select = document.getElementById('geodata__select');

    document.querySelectorAll('.geodataSet').forEach(function(el){

        el.onclick = function() {

            document.querySelectorAll('.geodataSet').forEach(function (el) {
                el.classList.remove('selected');
            });
    
            el.classList.add('selected');

            document.getElementById('map_geodata').innerHTML = '';
    
            _xyz({
                host: 'https://xyz-geodata-v2.now.sh/geodata',
                locale: el.dataset.locale,
                callback: function(_xyz) {
           
                    _xyz.mapview.create({
                        target: document.getElementById('map_geodata'),
                    });
                          
                    el.dataset.layers.split(',').forEach(function(layer){
                        _xyz.layers.list[layer].show();
                    });
            
                }
            });

        }

    })



    // Object.keys(geodata).forEach(function (set) {

    //     const div = document.createElement('div');
    //     div.className = 'geodataSet';
    //     div.textContent = set;

    //     div.onclick = function () {

    //         document.getElementById('geodata__faq').style.display = 'none';

    //         document.querySelectorAll('.geodataSet').forEach(function (el) {
    //             el.classList.remove('selected');
    //         });

    //         div.classList.add('selected');

    //         let geodataSet = geodata[div.innerText];

    //         geodataMap(geodataSet);

    //         document.getElementById('btnFullScreen').href = "https://xyz-geodata-v2.now.sh/geodata?layers=" + geodataSet.layers.join(',') + "&locale=London";
    //     }

    //     geodata_select.appendChild(div);
    // });

    document.querySelectorAll('.geodataSet')[0].click();
   
    function geodataMap(dataset) {

        document.getElementById('map_geodata').innerHTML = '';

        const container = document.querySelector('.geodata__info > .content');

        _xyz({
            host: 'https://xyz-geodata-v2.now.sh/geodata',
            locale: dataset.locale,
            callback: function(_xyz) {
       
                _xyz.mapview.create({
                    target: document.getElementById('map_geodata'),
                });
          
                //container.innerHTML = geodataXYZ.layers.list[dataset.meta].groupmeta;
        
                // Object.keys(geodataXYZ.layers.list).forEach(function(layer){
                //     geodataXYZ.layers.list[layer].remove();
                // })
        
                // if (dataset.legends) dataset.legends.forEach(legend => {
        
                //     geodataXYZ.layers.list[legend].view();
        
                //     container.appendChild(geodataXYZ.layers.list[legend].style.legend);
                // });
        
                dataset.layers.forEach(function(layer){
                    _xyz.layers.list[layer].show();
                });
        
                scrolly(document.querySelector('.geodata__info'));
            }
        });

    }

    // const faq = document.createElement('div');
    // faq.className = 'geodataSet';
    // faq.textContent = 'FAQ';

    // faq.onclick = function() {

    //     document.querySelectorAll('.geodataSet').forEach(function(d){
    //         d.classList.remove('selected');
    //     });

    //     faq.classList.add('selected');

    //     document.getElementById('geodata__faq').style.display = 'block';
    // }

    // geodata_select.appendChild(faq);

}


// CONTACT
// _xyz({
//     host: 'https://geolytix.xyz/geodata',
//     callback: function(_xyz) {

//         _xyz.mapview.create({
//             target: document.getElementById('map_contact'),
//             locale: 'Offices',
//             view: {
//                 lat: 45,
//                 lng: 60,
//                 z: 3
//             },
//             btn: {
//                 ZoomIn: document.getElementById('btnZoomIn_contact'),
//                 ZoomOut: document.getElementById('btnZoomOut_contact'),
//             }
//         });
    
//         _xyz.layers.list.Offices.show();

    
//         _xyz.locations.select = function(location) { 

//           // Remove current location if it exists.
//           if (_xyz.locations.current) _xyz.locations.current.remove();

//           _xyz.locations.current = location;
           
//           const xhr = new XMLHttpRequest();
      
//           xhr.open('GET',
//             _xyz.host + '/api/location/select/id?' +
//             _xyz.utils.paramString({
//               locale: _xyz.workspace.locale.key,
//               layer: location.layer,
//               table: location.table,
//               id: location.id,
//               token: _xyz.token
//             }));
        
//           xhr.setRequestHeader('Content-Type', 'application/json');
//           xhr.responseType = 'json';
        
//           xhr.onload = function(e) {
        
//             if (e.target.status !== 200) return;    
      
//             location.infoj = e.target.response.infoj;
        
//             location.geometry = e.target.response.geomj;

//             location.marker = _xyz.utils.turf.pointOnFeature(location.geometry).geometry.coordinates;
      
//             location = _xyz.locations.location(location);

//             location.draw({
//                 icon: {
//                     url: _xyz.utils.svg_symbols({type: 'markerColor', style: {colorMarker: '#64dd17', colorDot: '#33691e'}}),
//                     size: 40,
//                     anchor: [20,40]
//                   }
//             });
  
//             document.getElementById('contact__text').innerHTML = location.infoj[1].value;
           
//           };
        
//           xhr.send();
      
//         };

//         _xyz.locations.select({
//             locale: "Offices",
//             layer: "Offices",
//             table: "website.glx_offices",
//             id: document.body.dataset.office
//         });

//     }
// });


//url hook scroll
scrollTo(window.location.search.substring(1));

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

function scrollElement(element, to, duration) {
    if (duration <= 0) return;
    let difference = to - element.scrollTop,
        perTick = difference / duration * 10;
    setTimeout(function () {
        element.scrollTop = element.scrollTop + perTick;
        if (element.scrollTop === to) return;
        scrollElement(element, to, duration - 10);
    }, 10);
}

function scrollBody(to, duration) {

    if (duration <= 0) return;

    let
        difference = to - Math.max(window.pageYOffset, document.documentElement.scrollTop, document.body.scrollTop),
        perTick = difference / duration * 10;

    setTimeout(function () {
        let scroll = Math.max(window.pageYOffset, document.documentElement.scrollTop, document.body.scrollTop) + perTick;
        window.pageYOffset = scroll;
        document.documentElement.scrollTop = scroll;
        document.body.scrollTop = scroll;
        if (scroll === to) return;
        scrollBody(to, duration - 10);

    }, 10);
}

function scrolly(el) {

    let
        content = el.querySelector('.content'),
        path = el.querySelector('.scrollbar_container'),
        scrollBar = el.querySelector('.scrollbar'),
        scrollEvent = new Event('scroll');

    content.addEventListener('scroll', function () {
        scrollBar.style.height = path.clientHeight * content.clientHeight / content.scrollHeight + 'px';
        scrollBar.style.top = path.clientHeight * content.scrollTop / content.scrollHeight + 'px';
    });

    window.addEventListener('resize', content.dispatchEvent.bind(content, scrollEvent));
    content.dispatchEvent(scrollEvent);

    scrollBar.addEventListener('mousedown', function (eDown) {
        eDown.preventDefault();
        let scrollBar_offsetTop = scrollBar.offsetTop,
            eDown_pageY = eDown.pageY,
            onMove = function (eMove) {
                scrollBar.style.top = Math.min(
                    path.clientHeight - scrollBar.clientHeight,
                    Math.max(
                        0,
                        scrollBar_offsetTop + eMove.pageY - eDown_pageY
                    )
                ) + 'px';
                content.scrollTop = (content.scrollHeight * scrollBar.offsetTop / path.clientHeight);
            };
        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup', function () {
            document.removeEventListener('mousemove', onMove);
        });
    });

};