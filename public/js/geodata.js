let mapZoom = 13,
    map = L.map('map_geodata', {
        renderer: L.svg(),
        scrollWheelZoom: view_mode === 'integrated' ? false : true,
        zoomControl: false,
        maxBounds: L.latLngBounds(L.latLng(51.35, -0.4), L.latLng(51.65, 0.2)),
        minZoom: 12,
        maxZoom: 17
    }).setView([51.50, -0.1], mapZoom);

map.createPane('labels');
map.getPane('labels').style.zIndex = 650;
map.getPane('labels').style.pointerEvents = 'none';

let btnZoomIn = document.getElementById('btnZoomIn'),
    btnZoomOut = document.getElementById('btnZoomOut');

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

let xhr,
    xhr_grid,
    layerHover,
    featureHover,
    layerGrid,
    proj_4326 = proj4.Proj('EPSG:4326'),
    proj_3857 = proj4.Proj('EPSG:3857');

if (view_mode === 'integrated') {
    document.querySelector('.geodata__select').addEventListener('click', function(){
        let id = event.target.id;
        history.pushState({so: 'glx'}, id, '?' + id);
        selectGeodata(event.target);
    });
}

hookGeodata(window.location.search.substring(1));

function hookGeodata(hook){
    if (view_mode !== 'integrated') return window[hook]();
    hook === 'seamless_locales' ? selectGeodata(document.getElementById('seamless_locales')) :
        hook === 'retail_points' ? selectGeodata(document.getElementById('retail_points')) :
            hook === 'retail_places' ? selectGeodata(document.getElementById('retail_places')) :
                hook === 'public_transport' ? selectGeodata(document.getElementById('public_transport')) :
                    hook === 'postal_geom' ? selectGeodata(document.getElementById('postal_geom')) :
                        hook === 'town_suburb' ? selectGeodata(document.getElementById('town_suburb')) :
                            hook === 'education' ? selectGeodata(document.getElementById('education')) :
                                hook === 'workplace' ? selectGeodata(document.getElementById('workplace')) :
                                    hook === 'poi' ? selectGeodata(document.getElementById('poi')) :
                                        hook === 'residential' ? selectGeodata(document.getElementById('residential')) :
                                            hook === 'uk_admin' ? selectGeodata(document.getElementById('uk_admin')) :
                                                hook === 'property' ? selectGeodata(document.getElementById('property')) :
                                                    hook === 'road_network' ? selectGeodata(document.getElementById('road_network')) :
                                                        hook === 'media_com' ? selectGeodata(document.getElementById('media_com')) :
                                                            hook === 'physical' ? selectGeodata(document.getElementById('physical')) :
                                                                hook === 'pricing' ? selectGeodata(document.getElementById('pricing')) :
                                                                    hook === 'faq' ? selectGeodata(document.getElementById('faq')) :
                                                                        selectGeodata(document.getElementById('seamless_locales'));
}

function selectGeodata(_this){
    document.querySelector('.geodata__pricing').style.display = 'none';
    document.querySelector('.geodata__faq').style.display = 'none';

    removeClass(document.querySelector('.geodata__select .selected'), 'selected');
    addClass(_this, 'selected');

    map.eachLayer(function (layer) {
        map.removeLayer(layer);
    });
    map.off('mousemove');
    map.off('click');
    map.off('zoomend');
    map.off('moveend');

    map.on('movestart', function () {
        if (layerGrid) map.removeLayer(layerGrid);
    });

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
    xhr.open('GET', '/public/tmpl/gd_' + _this.id + '.html');
    xhr.setRequestHeader('Content-Type', 'text/html');
    xhr.onload = function () {
        if (xhr.status === 200) {
            document.getElementById('geodata__info__content').innerHTML = window.jsrender.templates(xhr.responseText).render();
            if (view_mode === 'integrated') scrolly();
            window[_this.id]();
        }
    };
    xhr.send();

}

function pricing(){
    document.querySelector('.geodata__pricing').style.display = 'block';
    let selectedPacks = 4,
        priceTable = ['£ null', '£ 3,000', '£ 5,500', '£ 8,000' , '£ 10,000', '£ 12,000', '£ 14,000', '£ 16,000', '£ 18,000', '£ 20,000','£ 22,000', '£ 24,000' , '£ 25,000'],
        pricetags = document.querySelectorAll('.pricetag');

    for (let i = 0; i < pricetags.length; i++) {
        pricetags[i].addEventListener('click', function () {
            toggleClass(this, 'active');
            let n = this.innerHTML === '£ 5500 (2 Packs)' ? 2 : 1;
            selectedPacks += hasClass(this, 'active') ? +n : -n;
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
}

function faq(){
    document.querySelector('.geodata__faq').style.display = 'block';
}

function scrolly(){
    let content = document.getElementById('geodata__info__content'),
        path = document.getElementById('ctrl_scrollbar_container'),
        scrollBar = document.getElementById('ctrl_scrollbar'),
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
}

map.on('movestart', function () {
    if (layerGrid) map.removeLayer(layerGrid);
});

map.on('moveend', function () {
    mapZoom = map.getZoom();
    chkZoomBtn();
});

map.on('zoomend', function () {
    mapZoom = map.getZoom();
    chkZoomBtn();
});

function seamless_locales() {
    L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_nolabels/{z}/{x}/{y}.png').addTo(map);

    let layer = new L.NonTiledLayer.WMS("https://gsx.geolytix.net/geoserver/geolytix/wms", {
            version: '1.3',
            opacity: 1.0,
            layers: 'seamless_locales',
            format: 'image/png',
            transparent: true,
            pane: 'tilePane',
            zIndex: 3,
            styles: 'seamless_locales'
        }).addTo(map),
        infotable = document.querySelector('#gd_seamless_locales .infobox__table');

    if (view_mode === 'mobile') {
        map.on('click', function (e) {
            hoverSelect(e, map, layer, infotable)
        });
    } else {
        map.on('mousemove', function (e) {
            hoverSelect(e, map, layer, infotable)
        });
    }
}

function retail_points() {
    L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_nolabels/{z}/{x}/{y}.png').addTo(map);

    let cqlFilterArray = ["brand='asda'", "brand='morrisons'", "brand='sainsburys'", "brand='tesco'"],
        cqlFilter = cqlFilterArray.join(' OR '),
        layer = L.tileLayer.wms("https://gsx.geolytix.net/geoserver/geolytix/wms", {
            version: '1.3',
            layers: 'retailpoints',
            format: 'image/png',
            transparent: true,
            styles: 'retailpoints',
            CQL_FILTER: cqlFilter
        }).addTo(map);

    L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_only_labels/{z}/{x}/{y}.png',{pane: 'labels'}).addTo(map);

    map.on('click', function(e){clickSelect(e, map, layer, cqlFilter)});

    let legend_classes = document.querySelectorAll('#gd_retail_points .infobox__legend span');
    for (let i = 0; i < legend_classes.length; i++) {
        legend_classes[i].addEventListener('click', function () {
            map.closePopup();
            if (hasClass(this, 'active')) {
                removeClass(this, 'active');
                cqlFilterArray.splice(cqlFilterArray.indexOf("brand='" + this.id + "'"), 1);
            } else {
                addClass(this, 'active');
                cqlFilterArray.push("brand='" + this.id + "'");
            }
            cqlFilter = cqlFilterArray.join(' OR ');

            map.removeLayer(layer);
            if (cqlFilter.length > 0) {
                layer = L.tileLayer.wms("https://gsx.geolytix.net/geoserver/geolytix/wms", {
                    version: '1.3',
                    layers: 'retailpoints',
                    format: 'image/png',
                    transparent: true,
                    styles: 'retailpoints',
                    CQL_FILTER: cqlFilter
                }).addTo(map);
            }
        });
    }
}

function retail_places(){
    L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_nolabels/{z}/{x}/{y}.png').addTo(map);

    let layer = L.tileLayer.wms("https://gsx.geolytix.net/geoserver/geolytix/wms", {
        layers: 'retailplaces_outline',
        format: 'image/png',
        transparent: true,
        styles: 'retailplaces_outline',
        minZoom: 12,
        maxZoom: 15
    }).addTo(map);

    infotable = document.querySelector('#gd_retail_places .infobox__table');

    if (view_mode === 'mobile') {
        map.on('click', function (e) {
            hoverSelect(e, map, layer, infotable)
        });
    } else {
        map.on('mousemove', function (e) {
            hoverSelect(e, map, layer, infotable)
        });
    }

    L.tileLayer.wms("https://gsx.geolytix.net/geoserver/geolytix/wms", {
        layers: 'retailplaces_shopping',
        format: 'image/png',
        transparent: true,
        styles: 'retailplaces_shopping',
        minZoom: 14,
        maxZoom: 17
    }).addTo(map);

    L.tileLayer.wms("https://gsx.geolytix.net/geoserver/geolytix/wms", {
        layers: 'retailplaces_build',
        format: 'image/png',
        transparent: true,
        styles: 'retailplaces_build',
        minZoom: 14,
        maxZoom: 17
    }).addTo(map);

    L.tileLayer.wms("https://gsx.geolytix.net/geoserver/geolytix/wms", {
        layers: 'retailplaces_hx_pitch_bounds',
        format: 'image/png',
        transparent: true,
        styles: 'retailplaces_hx_pitch_bounds',
        minZoom: 16,
        maxZoom: 17
    }).addTo(map);

    L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_only_labels/{z}/{x}/{y}.png').addTo(map);
}

function public_transport(){
    L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_nolabels/{z}/{x}/{y}.png').addTo(map);

    L.tileLayer.wms("https://gsx.geolytix.net/geoserver/geolytix/wms", {
        layers: 'transport_bus',
        format: 'image/png',
        transparent: true,
        styles: 'transport_bus'
    }).addTo(map);

    L.tileLayer.wms("https://gsx.geolytix.net/geoserver/geolytix/wms", {
        layers: 'transport_rail',
        format: 'image/png',
        transparent: true,
        styles: 'transport_rail'
    }).addTo(map);

    L.tileLayer.wms("https://gsx.geolytix.net/geoserver/geolytix/wms", {
        layers: 'transport_tube',
        format: 'image/png',
        transparent: true,
        styles: 'transport_tube'
    }).addTo(map);

    L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_only_labels/{z}/{x}/{y}.png').addTo(map);
}

function postal_geom(){
    L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_nolabels/{z}/{x}/{y}.png').addTo(map);

    new L.NonTiledLayer.WMS("https://gsx.geolytix.net/geoserver/geolytix/wms", {
        opacity: 1.0,
        layers: 'postal_area',
        format: 'image/png',
        transparent: true,
        pane: 'tilePane',
        zIndex: 3,
        styles: 'postal_area',
        maxZoom: 14
    }).addTo(map);

    L.tileLayer.wms("https://gsx.geolytix.net/geoserver/geolytix/wms", {
        layers: 'postal_district',
        format: 'image/png',
        transparent: true,
        styles: 'postal_district_nolabel',
        minZoom: 14,
        maxZoom: 14
    }).addTo(map);

    new L.NonTiledLayer.WMS("https://gsx.geolytix.net/geoserver/geolytix/wms", {
        opacity: 1.0,
        layers: 'postal_district',
        format: 'image/png',
        transparent: true,
        pane: 'tilePane',
        zIndex: 3,
        styles: 'postal_district',
        minZoom: 15,
        maxZoom: 15
    }).addTo(map);

    L.tileLayer.wms("https://gsx.geolytix.net/geoserver/geolytix/wms", {
        layers: 'postal_sector',
        format: 'image/png',
        transparent: true,
        styles: 'postal_sector_nolabel',
        minZoom: 15,
        maxZoom: 15
    }).addTo(map);

    new L.NonTiledLayer.WMS("https://gsx.geolytix.net/geoserver/geolytix/wms", {
        opacity: 1.0,
        layers: 'postal_sector',
        format: 'image/png',
        transparent: true,
        pane: 'tilePane',
        zIndex: 3,
        styles: 'postal_sector',
        minZoom: 16
    }).addTo(map);

    L.tileLayer.wms("https://gsx.geolytix.net/geoserver/geolytix/wms", {
        layers: 'postal_code',
        format: 'image/png',
        transparent: true,
        styles: 'postal_code',
        minZoom: 17
    }).addTo(map);
}

function town_suburb(){
    L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_nolabels/{z}/{x}/{y}.png').addTo(map);

    let layer = new L.NonTiledLayer.WMS("https://gsx.geolytix.net/geoserver/geolytix/wms", {
            version: '1.3',
            opacity: 1.0,
            layers: 'town_suburb',
            format: 'image/png',
            transparent: true,
            pane: 'tilePane',
            zIndex: 3,
            styles: 'town_suburb'
        }).addTo(map),
        infotable = document.querySelector('#gd_town_suburb .infobox__table');

    if (view_mode === 'mobile') {
        map.on('click', function (e) {
            hoverSelect(e, map, layer, infotable)
        });
    } else {
        map.on('mousemove', function (e) {
            hoverSelect(e, map, layer, infotable)
        });
    }
}

function education(){
    L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_nolabels/{z}/{x}/{y}.png').addTo(map);

    L.tileLayer.wms("https://gsx.geolytix.net/geoserver/geolytix/wms", {
        layers: 'university_building',
        format: 'image/png',
        transparent: true,
        styles: 'university_building'
    }).addTo(map);

    L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_only_labels/{z}/{x}/{y}.png').addTo(map);
}

function workplace() {
    L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_nolabels/{z}/{x}/{y}.png').addTo(map);

    let arrayZoom = {
            12: 'workplace_pc_hx800',
            13: 'workplace_pc_hx400',
            14: 'workplace_pc_hx200',
            15: 'workplace_pc_hx100',
            16: 'workplace_pc_hx050',
            17: 'workplace_pc_hx025'
        },
        gridOptions = {
            queryCount: 'w15',
            queryValue: 'w15_w11_diff',
            oValue: {maximumFractionDigits: 0},
            arrayStyle: [
                '/public/images/map_icons/dot_d73027.svg',
                '/public/images/map_icons/dot_f46d43.svg',
                '/public/images/map_icons/dot_fdae61.svg',
                '/public/images/map_icons/dot_fee08b.svg',
                '/public/images/map_icons/dot_ffffbf.svg',
                '/public/images/map_icons/dot_d9ef8b.svg',
                '/public/images/map_icons/dot_a6d96a.svg',
                '/public/images/map_icons/dot_66bd63.svg',
                '/public/images/map_icons/dot_1a9850.svg',
                '/public/images/map_icons/dot_null.svg'
            ]
        };

    getGridData(map.getBounds(), arrayZoom[map.getZoom()], gridOptions);

    map.on('zoomend', function () {
        getGridData(map.getBounds(), arrayZoom[map.getZoom()], gridOptions);
        mapZoom = map.getZoom();
    });

    map.on('moveend', function () {
        getGridData(map.getBounds(), arrayZoom[map.getZoom()], gridOptions)
        mapZoom = map.getZoom();
    });

    L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_only_labels/{z}/{x}/{y}.png', {pane: 'labels'}).addTo(map);

    let layer = new L.tileLayer.wms("https://gsx.geolytix.net/geoserver/geolytix/wms", {
        version: '1.3',
        layers: 'workplace_hz',
        format: 'image/png',
        transparent: true,
        styles: 'workplace_hz',
        minZoom: 14,
        maxZoom: 17
    }).addTo(map);

    map.on('click', function (e) {
        clickSelect(e, map, layer, "id>0")
    });
}


function poi(){
    L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_nolabels/{z}/{x}/{y}.png').addTo(map);

    let cqlFilterArray = ["poi_type='carpark'"],
        cqlFilter = cqlFilterArray[0],
        layer = L.tileLayer.wms("https://gsx.geolytix.net/geoserver/geolytix/wms", {
            version: '1.3',
            layers: 'poi',
            format: 'image/png',
            transparent: true,
            styles: 'poi',
            CQL_FILTER: cqlFilter
        }).addTo(map);

    L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_only_labels/{z}/{x}/{y}.png', {pane: 'labels'}).addTo(map);

    map.on('click', function(e){clickSelect(e, map, layer, cqlFilter)});

    let legend_classes = document.querySelectorAll('#gd_poi .infobox__legend span');
    for (let i = 0; i < legend_classes.length; i++) {
        legend_classes[i].addEventListener('click', function () {
            map.closePopup();
            if (hasClass(this, 'active')) {
                removeClass(this, 'active');
                cqlFilterArray.splice(cqlFilterArray.indexOf("poi_type='" + this.id + "'"), 1);
            } else {
                addClass(this, 'active');
                cqlFilterArray.push("poi_type='" + this.id + "'");
            }
            cqlFilter = cqlFilterArray.join(' OR ');

            map.removeLayer(layer);
            if (cqlFilter.length > 0) {
                layer = L.tileLayer.wms("https://gsx.geolytix.net/geoserver/geolytix/wms", {
                    layers: 'poi',
                    format: 'image/png',
                    transparent: true,
                    styles: 'poi',
                    CQL_FILTER: cqlFilter
                }).addTo(map);
            }
        });
    }
}

function residential(){
    L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_nolabels/{z}/{x}/{y}.png').addTo(map);

    let arrayZoom = {
            12: 'residential_oa_hx800',
            13: 'residential_oa_hx400',
            14: 'residential_oa_hx200',
            15: 'residential_oa_hx100',
            16: 'residential_oa_hx050',
            17: 'residential_oa_hx025'
        },
        gridOptions = {
            queryCount: 'pop_21',
            queryValue: 'growth',
            oValue: {maximumFractionDigits: 2},
            arrayStyle: [
                '/public/images/map_icons/dot_d73027.svg',
                '/public/images/map_icons/dot_f46d43.svg',
                '/public/images/map_icons/dot_fdae61.svg',
                '/public/images/map_icons/dot_fee08b.svg',
                '/public/images/map_icons/dot_ffffbf.svg',
                '/public/images/map_icons/dot_d9ef8b.svg',
                '/public/images/map_icons/dot_a6d96a.svg',
                '/public/images/map_icons/dot_66bd63.svg',
                '/public/images/map_icons/dot_1a9850.svg',
                '/public/images/map_icons/dot_null.svg'
            ]
        };

    let layer = new L.tileLayer.wms("https://gsx.geolytix.net/geoserver/geolytix/wms", {
        version: '1.3',
        layers: 'residential_lsoa',
        format: 'image/png',
        transparent: true,
        styles: 'residential_lsoa',
        minZoom: 14
    }).addTo(map);

    map.on('click', function(e){
        if (map.getZoom() > 14) clickSelect(e, map, layer, "id>0")
    });

    getGridData(map.getBounds(), arrayZoom[map.getZoom()], gridOptions);

    map.on('zoomend', function () {
        getGridData(map.getBounds(), arrayZoom[map.getZoom()], gridOptions);
    });

    map.on('moveend', function () {
        getGridData(map.getBounds(), arrayZoom[map.getZoom()], gridOptions)
    });

    L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_only_labels/{z}/{x}/{y}.png', {pane: 'labels'}).addTo(map);
}

function uk_admin(){
    L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_nolabels/{z}/{x}/{y}.png').addTo(map);

    L.tileLayer.wms("https://gsx.geolytix.net/geoserver/geolytix/wms", {
        layers: 'admin_uk_oa',
        format: 'image/png',
        transparent: true,
        styles: 'admin_uk_oa',
        minZoom: 15
    }).addTo(map);

    L.tileLayer.wms("https://gsx.geolytix.net/geoserver/geolytix/wms", {
        layers: 'admin_uk_soa',
        format: 'image/png',
        transparent: true,
        styles: 'admin_uk_soa',
        minZoom: 14
    }).addTo(map);

    L.tileLayer.wms("https://gsx.geolytix.net/geoserver/geolytix/wms", {
        layers: 'admin_uk_msoa',
        format: 'image/png',
        transparent: true,
        styles: 'admin_uk_msoa',
        minZoom: 13,
        maxZoom: 15
    }).addTo(map);

    new L.NonTiledLayer.WMS("https://gsx.geolytix.net/geoserver/geolytix/wms", {
        opacity: 1.0,
        layers: 'admin_uk_lad',
        format: 'image/png',
        transparent: true,
        pane: 'tilePane',
        zIndex: 3,
        styles: 'admin_uk_lad',
        minZoom: 12,
        maxZoom: 14
    }).addTo(map);
}

function property(){
    L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_nolabels/{z}/{x}/{y}.png').addTo(map);

    let arrayZoom = {
            12: 'property_hx800',
            13: 'property_hx400',
            14: 'property_hx200',
            15: 'property_hx100',
            16: 'property_hx050',
            17: 'property_hx025'
        },
        gridOptions = {
            queryCount: 'n',
            queryValue: 'price_paid',
            oValue: {maximumFractionDigits: 0},
            arrayStyle: [
                '/public/images/map_icons/dot_1a9850.svg',
                '/public/images/map_icons/dot_66bd63.svg',
                '/public/images/map_icons/dot_a6d96a.svg',
                '/public/images/map_icons/dot_d9ef8b.svg',
                '/public/images/map_icons/dot_ffffbf.svg',
                '/public/images/map_icons/dot_fee08b.svg',
                '/public/images/map_icons/dot_fdae61.svg',
                '/public/images/map_icons/dot_f46d43.svg',
                '/public/images/map_icons/dot_d73027.svg',
                '/public/images/map_icons/dot_null.svg'
            ]
        };

    getGridData(map.getBounds(), arrayZoom[map.getZoom()], gridOptions);

    L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_only_labels/{z}/{x}/{y}.png',{pane: 'labels'}).addTo(map);

    map.on('zoomend', function () {
        getGridData(map.getBounds(), arrayZoom[map.getZoom()], gridOptions);
    });

    map.on('moveend', function () {
        getGridData(map.getBounds(), arrayZoom[map.getZoom()], gridOptions);
    });
}

function road_network(){
    L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_nolabels/{z}/{x}/{y}.png').addTo(map);

    L.tileLayer.wms("https://gsx.geolytix.net/geoserver/geolytix/wms", {
        layers: 'osm_roads',
        format: 'image/png',
        transparent: true,
        styles: 'osm_roads'
    }).addTo(map);

    L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_only_labels/{z}/{x}/{y}.png').addTo(map);
}


function media_com(){
    L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_nolabels/{z}/{x}/{y}.png').addTo(map);

    let arrayZoom = {
            12: 'media_bb_hx800',
            13: 'media_bb_hx400',
            14: 'media_bb_hx200',
            15: 'media_bb_hx100',
            16: 'media_bb_hx050',
            17: 'media_bb_hx025'
        },
        gridOptions = {
            queryCount: 'connections',
            queryValue: 'avg_dwload',
            oValue: {maximumFractionDigits: 2},
            arrayStyle: [
                '/public/images/map_icons/dot_c51b7d.svg',
                '/public/images/map_icons/dot_de77ae.svg',
                '/public/images/map_icons/dot_f1b6da.svg',
                '/public/images/map_icons/dot_fde0ef.svg',
                '/public/images/map_icons/dot_f7f7f7.svg',
                '/public/images/map_icons/dot_e6f5d0.svg',
                '/public/images/map_icons/dot_b8e186.svg',
                '/public/images/map_icons/dot_7fbc41.svg',
                '/public/images/map_icons/dot_4d9221.svg',
                '/public/images/map_icons/dot_eeff41.svg'
            ]
        };

    getGridData(map.getBounds(), arrayZoom[map.getZoom()], gridOptions);

    L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_only_labels/{z}/{x}/{y}.png',{pane: 'labels'}).addTo(map);

    map.on('zoomend', function () {
        getGridData(map.getBounds(), arrayZoom[map.getZoom()], gridOptions)
    });

    map.on('moveend', function () {
        getGridData(map.getBounds(), arrayZoom[map.getZoom()], gridOptions)
    });
}


function physical(){
    L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_nolabels/{z}/{x}/{y}.png').addTo(map);

    L.tileLayer.wms("https://gsx.geolytix.net/geoserver/geolytix/wms", {
        version: '1.3',
        layers: 'physical_poly',
        format: 'image/png',
        transparent: true,
        styles: 'physical_poly'
    }).addTo(map);

    L.tileLayer.wms("https://gsx.geolytix.net/geoserver/geolytix/wms", {
        version: '1.3',
        layers: 'physical_line',
        format: 'image/png',
        transparent: true,
        styles: 'physical_line'
    }).addTo(map);

    L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_only_labels/{z}/{x}/{y}.png').addTo(map);
}


function divStyle(_f, _arrayColor, _arraySize, _arrayStyle){
    let c = _f.properties.c,
        v = _f.properties.v,
        s = c < _arraySize[0] ? 7 :
            c < _arraySize[1] ? 8 :
                c < _arraySize[2] ? 9 :
                    c < _arraySize[3] ? 10 :
                        c < _arraySize[4] ? 11 :
                            c < _arraySize[5] ? 12 :
                                c < _arraySize[6] ? 13 :
                                    c < _arraySize[7] ? 14 :
                                        15,
        dot = v < _arrayColor[0] ? _arrayStyle[0] :
            v < _arrayColor[1] ? _arrayStyle[1] :
                v < _arrayColor[2] ? _arrayStyle[2] :
                    v < _arrayColor[3] ? _arrayStyle[3] :
                        v < _arrayColor[4] ? _arrayStyle[4] :
                            v < _arrayColor[5] ? _arrayStyle[5] :
                                v < _arrayColor[6] ? _arrayStyle[6] :
                                    v < _arrayColor[7] ? _arrayStyle[7] :
                                        _arrayStyle[8];

    if (v == null) dot = _arrayStyle[9];
    return {
        icon: L.icon({
            iconUrl: dot,
            iconSize: [s, s]
        }),
        interactive: false
    };
}

let xhr_getGridData = new XMLHttpRequest();
function getGridData(_bounds, _layer, _o){
    xhr_getGridData.abort();
    if (layerGrid) map.removeLayer(layerGrid);
    xhr_getGridData = new XMLHttpRequest();
    let requestURL = paramString({
            c: _o.queryCount,
            v: _o.queryValue,
            layer: _layer,
            west: _bounds.getWest(),
            south: _bounds.getSouth(),
            east: _bounds.getEast(),
            north: _bounds.getNorth()
        });
    xhr_getGridData.open('GET', '/grid_query?' + requestURL);
    xhr_getGridData.setRequestHeader('Content-Type', 'application/json');
    xhr_getGridData.onload = function () {
        if (xhr_getGridData.status === 200) drawGridData(JSON.parse(xhr_getGridData.responseText), _o);
    };
    xhr_getGridData.send();
}

function drawGridData(data, _o){
    let avg_c = 0,
        avg_v = 0,
        arrayColor = [],
        arraySize = [],
        n = data.length,
        dots = {
            type: "FeatureCollection",
            features: []
        };

    for (let i = 0; i < n; i++) {
        let c = data[i].c,
            v = data[i].v,
            g = {
                "type": "Point",
                "coordinates": [data[i].lon, data[i].lat]
            },
            p = {
                "c": c,
                "v": v
            };

        avg_c += c;
        avg_v += v;

        dots.features.push({
            "geometry": g,
            "type": "Feature",
            "properties": p
        });
    }

    let min = getMath(data, 'c', 'min'),
        max = getMath(data, 'c', 'max'),
        avg = avg_c / n,
        step_lower = (avg - min) / 5,
        step_upper = (max - avg) / 4;

    let legend_text_c = document.getElementsByClassName('legend_text_c');
    legend_text_c[0].innerHTML = max.toLocaleString('en-GB', {maximumFractionDigits: 0});
    legend_text_c[1].innerHTML = avg.toLocaleString('en-GB', {maximumFractionDigits: 0});
    legend_text_c[2].innerHTML = min.toLocaleString('en-GB', {maximumFractionDigits: 0});

    arraySize[0] = min + step_lower;
    arraySize[1] = min + (step_lower * 2);
    arraySize[2] = min + (step_lower * 3);
    arraySize[3] = min + (step_lower * 4);
    arraySize[4] = avg;
    arraySize[5] = avg + step_upper;
    arraySize[6] = avg + (step_upper * 2);
    arraySize[7] = avg + (step_upper * 3);

    min = getMath(data, 'v', 'min');
    max = getMath(data, 'v', 'max');
    avg = avg_v / n;
    step_lower = (avg - min) / 5;
    step_upper = (max - avg) / 4;

    arrayColor[0] = min + step_lower;
    arrayColor[1] = min + (step_lower * 2);
    arrayColor[2] = min + (step_lower * 3);
    arrayColor[3] = min + (step_lower * 4);
    arrayColor[4] = avg;
    arrayColor[5] = avg + step_upper;
    arrayColor[6] = avg + (step_upper * 2);
    arrayColor[7] = avg + (step_upper * 3);

    let legend_text_v = document.getElementsByClassName('legend_text_v');
    legend_text_v[0].innerHTML = arrayColor[0].toLocaleString('en-GB', _o.oValue);
    legend_text_v[1].innerHTML = arrayColor[1].toLocaleString('en-GB', _o.oValue);
    legend_text_v[2].innerHTML = arrayColor[2].toLocaleString('en-GB', _o.oValue);
    legend_text_v[3].innerHTML = arrayColor[3].toLocaleString('en-GB', _o.oValue);
    legend_text_v[4].innerHTML = arrayColor[4].toLocaleString('en-GB', _o.oValue);
    legend_text_v[5].innerHTML = arrayColor[5].toLocaleString('en-GB', _o.oValue);
    legend_text_v[6].innerHTML = arrayColor[6].toLocaleString('en-GB', _o.oValue);
    legend_text_v[7].innerHTML = arrayColor[7].toLocaleString('en-GB', _o.oValue);
    legend_text_v[8].innerHTML = arrayColor[7].toLocaleString('en-GB', _o.oValue);

    document.querySelector('.grid_legend').style.display = 'block';

    layerGrid = new L.geoJson(dots, {
        pointToLayer: function (feature, latlng) {
            return L.marker(latlng, divStyle(feature, arrayColor, arraySize, _o.arrayStyle));
        }
        //onEachFeature: onEachDot
    }).addTo(map);
}


function hoverSelect(e, map, layer, infoTable) {
    let pHover = turf.point([e.latlng.lng, e.latlng.lat]);
    if (!featureHover || !turf.inside(pHover, featureHover)) {
        wmsGetHoverFeatureInfo(
            getFeatureInfoUrl(
                map,
                layer,
                e.latlng,
                {
                    'propertyName': 'geoj,infoj'
                }
            ),
            infoTable)
    }
}


function clickSelect(e, map, layer, cqlFilter) {
    wmsGetClickFeatureInfo(
        getFeatureInfoUrl(
            map,
            layer,
            e.latlng,
            {
                'propertyName': 'latlonj,infoj',
                'CQL_FILTER': cqlFilter
            }
        )
    )
}


function getFeatureInfoUrl(map, layer, latlng, params) {
    let url = layer._wmsUrl || layer._url,
        point = map.latLngToContainerPoint(latlng, map.getZoom()),
        size = map.getSize(),
        bounds = map.getBounds(),
        sw = proj4.transform(proj_4326, proj_3857, proj4.toPoint([bounds.getWest(), bounds.getSouth()])),
        ne = proj4.transform(proj_4326, proj_3857, proj4.toPoint([bounds.getEast(), bounds.getNorth()])),
        defaultParams = {
            request: 'GetFeatureInfo',
            service: 'WMS',
            srs: layer._crs.code,
            version: layer._wmsVersion,
            bbox: [sw.x, sw.y, ne.x, ne.y],
            height: size.y,
            width: size.x,
            layers: layer.options.layers,
            query_layers: layer.options.layers,
            info_format: 'application/json',
            buffer: 10
        };
    params = L.Util.extend(defaultParams, params || {});
    params[params.version === '1.3' ? 'i' : 'x'] = parseInt(point.x);
    params[params.version === '1.3' ? 'j' : 'y'] = parseInt(point.y);
    return url + L.Util.getParamString(params, url, true);
}

let xhr_wmsGetHoverFeatureInfo = new XMLHttpRequest();
function wmsGetHoverFeatureInfo(url, infoTable){
    xhr_wmsGetHoverFeatureInfo.abort();
    xhr_wmsGetHoverFeatureInfo = new XMLHttpRequest();
    xhr_wmsGetHoverFeatureInfo.open('GET', url);
    xhr_wmsGetHoverFeatureInfo.setRequestHeader('Content-Type', 'application/json');
    xhr_wmsGetHoverFeatureInfo.onload = function () {
        if (xhr_wmsGetHoverFeatureInfo.status === 200 && xhr_wmsGetHoverFeatureInfo.responseText !== '') {
            let data = JSON.parse(xhr_wmsGetHoverFeatureInfo.responseText);
            if (data.features[0]) {
                createHoverFeature(data.features[0].properties.geoj);
                populateInfoTable(JSON.parse(data.features[0].properties.infoj), infoTable);
            }
        }
    };
    xhr_wmsGetHoverFeatureInfo.send();
}


function createHoverFeature(geom) {
    if (layerHover) map.removeLayer(layerHover);
    featureHover = {
        'type': 'Feature',
        'properties': {},
        'geometry': JSON.parse(geom)
    };
    layerHover = L.geoJson(featureHover, {
        style: function () {
            return {
                color: '#079e00',
                fillOpacity: 0.1,
                interactive: false
            };
        }
    }).addTo(map);
}


function populateInfoTable(infoj, infoTable){
    infoTable.innerHTML = '';
    let r = infoTable.insertRow(infoTable.rows.length);
    r.insertCell(0).innerHTML = 'Info';
    Object.keys(infoj).map(function(Okey) {
        if (infoj[Okey]) {
            r = infoTable.insertRow(infoTable.rows.length);
            r.insertCell(0).innerHTML = Okey;
            r.insertCell(1).innerHTML = infoj[Okey];
        }
    })
}


let xhr_wmsGetClickFeatureInfo = new XMLHttpRequest();
function wmsGetClickFeatureInfo(url){
    xhr_wmsGetClickFeatureInfo.abort();
    xhr_wmsGetClickFeatureInfo = new XMLHttpRequest();
    xhr_wmsGetClickFeatureInfo.open('GET', url);
    xhr_wmsGetClickFeatureInfo.setRequestHeader('Content-Type', 'application/json');
    xhr_wmsGetClickFeatureInfo.onload = function () {
        if (xhr_wmsGetClickFeatureInfo.status === 200 && xhr_wmsGetClickFeatureInfo.responseText !== '') {
            let data = JSON.parse(xhr_wmsGetClickFeatureInfo.responseText);
            if (data.features[0]) {
                let infoj = JSON.parse(data.features[0].properties.infoj);
                if (infoj){
                    L.popup()
                        .setLatLng(JSON.parse(data.features[0].properties.latlonj))
                        .setContent(buildHtmlTable(infoj))
                        .openOn(map);
                }
            }
        }
    };
    xhr_wmsGetClickFeatureInfo.send();
}


function buildHtmlTable(infoj) {
    let table = document.createElement('table');
    Object.keys(infoj).map(function(Okey) {
        if (infoj[Okey]) {
            let r = table.insertRow(table.rows.length);
            r.insertCell(0).innerHTML = Okey;
            r.insertCell(1).innerHTML = infoj[Okey];
        }
    });
    return table;
}


function getMath(arr, key, type) {
    return Math[type].apply(null, arr.map(function (obj) {
        return obj[key];
    }))
}

function paramString(uri_param){
    let encodedString = '';
    Object.keys(uri_param).map(function (key) {
        if (encodedString.length > 0) encodedString += '&';
        encodedString += encodeURI(key + "=" + uri_param[key]);
    });
    return encodedString;
}
