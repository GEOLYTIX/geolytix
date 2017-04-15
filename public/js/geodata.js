var mapZoom = 13,
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

var btnZoomIn = document.getElementById('btnZoomIn'),
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

var xhr,
    xhr_grid,
    layerHover,
    featureHover,
    layerGrid,
    proj_4326 = proj4.Proj('EPSG:4326'),
    proj_3857 = proj4.Proj('EPSG:3857');

if (view_mode === 'integrated') {
    selectGeodata($('#seamless_locales'));
} else {
    window[$('.infobox').attr('id').substring(3)]();
}

if (view_mode === 'desktop') $('.geodata__info').jScrollPane();

$('.geodata__select > div').click(function () {
    selectGeodata($(this));
});

function selectGeodata(_this){
    $('.geodata__pricing').hide();
    $('.geodata__faq').hide();
    _this.siblings().removeClass('selected');
    _this.addClass('selected');

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

    var dataset = _this.attr('id');

    if (view_mode === 'integrated'){
        var btnFullScreen = document.getElementById('btnFullScreen');
        btnFullScreen.addEventListener('click', function() {
            window.location = '/map?' + dataset;
        });
    }

    $.when($.get('/public/tmpl/gd_' + dataset + '.html'))
        .done(function (_tmpl) {
            var t = $(_tmpl).render();
            $('.geodata__info').html(t);
            window[dataset]();
        });
}


function seamless_locales() {
    L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_nolabels/{z}/{x}/{y}.png').addTo(map);

    var layer = new L.NonTiledLayer.WMS("https://gsx.geolytix.net/geoserver/geolytix/wms", {
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

    var cqlFilterArray = ["brand='asda'", "brand='morrisons'", "brand='sainsburys'", "brand='tesco'"],
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

    $('.infobox__legend span').click(function () {
        $(this).toggleClass('active');
        if ($(this).hasClass('active')) {
            cqlFilterArray.push("brand='" + $(this).attr('id') + "'");
        } else {
            cqlFilterArray.splice($.inArray("brand='" + $(this).attr('id') + "'", cqlFilterArray), 1);
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

function retail_places(){
    L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_nolabels/{z}/{x}/{y}.png').addTo(map);

    L.tileLayer.wms("https://gsx.geolytix.net/geoserver/geolytix/wms", {
        layers: 'retailplaces_point',
        format: 'image/png',
        transparent: true,
        styles: 'retailplaces_point',
        maxZoom: 12
    }).addTo(map);

    L.tileLayer.wms("https://gsx.geolytix.net/geoserver/geolytix/wms", {
        layers: 'retailplaces_outline',
        format: 'image/png',
        transparent: true,
        styles: 'retailplaces_outline',
        minZoom: 13,
        maxZoom: 15
    }).addTo(map);

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
        layers: 'retailplaces_pitch',
        format: 'image/png',
        transparent: true,
        styles: 'retailplaces_pitch',
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

    var layer = new L.NonTiledLayer.WMS("https://gsx.geolytix.net/geoserver/geolytix/wms", {
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

    var arrayZoom = {
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
                'circle_d73027',
                'circle_f46d43',
                'circle_fdae61',
                'circle_fee08b',
                'circle_ffffbf',
                'circle_d9ef8b',
                'circle_a6d96a',
                'circle_66bd63',
                'circle_1a9850',
                'circle_null'
            ]
        };

    var layer;

    getGridData(map.getBounds(), arrayZoom[map.getZoom()], gridOptions);

    map.on('zoomend', function () {
        getGridData(map.getBounds(), arrayZoom[map.getZoom()], gridOptions);
        var z = map.getZoom();
        if (z > 14) {
            workplace_hz()
        } else {
            map.removeLayer(layer);
            map.off('click');
        }
    });

    map.on('moveend', function () {
        getGridData(map.getBounds(), arrayZoom[map.getZoom()], gridOptions)
    });

    L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_only_labels/{z}/{x}/{y}.png', {pane: 'labels'}).addTo(map);

    function workplace_hz(){
        layer = new L.tileLayer.wms("https://gsx.geolytix.net/geoserver/geolytix/wms", {
            version: '1.3',
            layers: 'workplace_hz',
            format: 'image/png',
            transparent: true,
            styles: 'workplace_hz'
        }).addTo(map);

        map.on('click', function(e){
            clickSelect(e, map, layer, "id>0")
        });
    }
}


function poi(){
    L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_nolabels/{z}/{x}/{y}.png').addTo(map);

    var cqlFilterArray = ["poi_type='carpark'"],
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

    $('.infobox__legend span').click(function () {
        $(this).toggleClass('active');
        if ($(this).hasClass('active')) {
            cqlFilterArray.push("poi_type='" + $(this).attr('id') + "'");
        } else {
            cqlFilterArray.splice($.inArray("poi_type='" + $(this).attr('id') + "'", cqlFilterArray), 1);
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

function residential(){
    L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_nolabels/{z}/{x}/{y}.png').addTo(map);

    var arrayZoom = {
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
                'circle_d73027',
                'circle_f46d43',
                'circle_fdae61',
                'circle_fee08b',
                'circle_ffffbf',
                'circle_d9ef8b',
                'circle_a6d96a',
                'circle_66bd63',
                'circle_1a9850',
                'circle_null'
            ]
        };

    var layer = new L.tileLayer.wms("https://gsx.geolytix.net/geoserver/geolytix/wms", {
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

    var arrayZoom = {
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
                'circle_1a9850',
                'circle_66bd63',
                'circle_a6d96a',
                'circle_d9ef8b',
                'circle_ffffbf',
                'circle_fee08b',
                'circle_fdae61',
                'circle_f46d43',
                'circle_d73027',
                'circle_null'
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

    var arrayZoom = {
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
                'circle_c51b7d',
                'circle_de77ae',
                'circle_f1b6da',
                'circle_fde0ef',
                'circle_f7f7f7',
                'circle_e6f5d0',
                'circle_b8e186',
                'circle_7fbc41',
                'circle_4d9221',
                'circle_eeff41'
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
    var c = _f.properties.c,
        v = _f.properties.v,
        s = c < _arraySize[0] ? 4 :
            c < _arraySize[1] ? 4.5 :
                c < _arraySize[2] ? 5 :
                    c < _arraySize[3] ? 5.5 :
                        c < _arraySize[4] ? 6 :
                            c < _arraySize[5] ? 6.5 :
                                c < _arraySize[6] ? 7 :
                                    c < _arraySize[7] ? 7.5 :
                                        8.5,
        circle_colour = v < _arrayColor[0] ? _arrayStyle[0] :
            v < _arrayColor[1] ? _arrayStyle[1] :
                v < _arrayColor[2] ? _arrayStyle[2] :
                    v < _arrayColor[3] ? _arrayStyle[3] :
                        v < _arrayColor[4] ? _arrayStyle[4] :
                            v < _arrayColor[5] ? _arrayStyle[5] :
                                v < _arrayColor[6] ? _arrayStyle[6] :
                                    v < _arrayColor[7] ? _arrayStyle[7] :
                                        _arrayStyle[8];

    if (v == null) circle_colour = _arrayStyle[9];
    return {
        icon: L.divIcon({
            className: circle_colour,
            iconSize: [s, s]
        }),
        interactive: false
    };
}

function getGridData(_bounds, _layer, _o){
    if (xhr_grid && xhr_grid.readyState != 4) xhr_grid.abort();
    if (layerGrid) map.removeLayer(layerGrid);
    xhr_grid = $.ajax({
        url: '/grid_query',
        dataType: 'json',
        data: {
            c: _o.queryCount,
            v: _o.queryValue,
            layer: _layer,
            west: _bounds.getWest(),
            south: _bounds.getSouth(),
            east: _bounds.getEast(),
            north: _bounds.getNorth()
        },
        success: function (data) {
            var avg_c = 0,
                avg_v = 0,
                arrayColor = [],
                arraySize = [],
                n = data.length,
                dots = {
                    type: "FeatureCollection",
                    features: []
                };

            for (var i = 0; i < n; i++) {
                var c = data[i].c,
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

            var min = getMath(data, 'c', 'min'),
                max = getMath(data, 'c', 'max'),
                avg = avg_c / n,
                step_lower = (avg - min) / 5,
                step_upper = (max - avg) / 4;

            var legend_text_c = document.getElementsByClassName('legend_text_c');
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

            var legend_text_v = document.getElementsByClassName('legend_text_v');
            legend_text_v[0].innerHTML = arrayColor[0].toLocaleString('en-GB', _o.oValue);
            legend_text_v[1].innerHTML = arrayColor[1].toLocaleString('en-GB', _o.oValue);
            legend_text_v[2].innerHTML = arrayColor[2].toLocaleString('en-GB', _o.oValue);
            legend_text_v[3].innerHTML = arrayColor[3].toLocaleString('en-GB', _o.oValue);
            legend_text_v[4].innerHTML = arrayColor[4].toLocaleString('en-GB', _o.oValue);
            legend_text_v[5].innerHTML = arrayColor[5].toLocaleString('en-GB', _o.oValue);
            legend_text_v[6].innerHTML = arrayColor[6].toLocaleString('en-GB', _o.oValue);
            legend_text_v[7].innerHTML = arrayColor[7].toLocaleString('en-GB', _o.oValue);
            legend_text_v[8].innerHTML = arrayColor[7].toLocaleString('en-GB', _o.oValue);

            $('.grid_legend').fadeIn();

            layerGrid = new L.geoJson(dots, {
                pointToLayer: function (feature, latlng) {
                    return L.marker(latlng, divStyle(feature, arrayColor, arraySize, _o.arrayStyle));
                }
                //onEachFeature: onEachDot
            }).addTo(map);
        }
    })
}


function hoverSelect(e, map, layer, infoTable) {
    var pHover = turf.point([e.latlng.lng, e.latlng.lat]);
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
    var url = layer._wmsUrl || layer._url,
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


function wmsGetHoverFeatureInfo(url, infoTable){
    if (xhr && xhr.readyState != 4) xhr.abort();
    xhr = $.ajax({
        url: url,
        success: function (data) {
            createHoverFeature(data.features[0].properties.geoj);
            populateInfoTable(JSON.parse(data.features[0].properties.infoj), infoTable);
        }
    });
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
    var r = infoTable.insertRow(infoTable.rows.length);
    r.insertCell(0).innerHTML = 'Info';
    Object.keys(infoj).map(function(Okey) {
        if (infoj[Okey]) {
            r = infoTable.insertRow(infoTable.rows.length);
            r.insertCell(0).innerHTML = Okey;
            r.insertCell(1).innerHTML = infoj[Okey];
        }
    })
}


function wmsGetClickFeatureInfo(url){
    if (xhr && xhr.readyState != 4) xhr.abort();
    xhr = $.ajax({
        url: url,
        success: function (data) {
            if (data.features.length > 0) {
                var infoj = JSON.parse(data.features[0].properties.infoj);
                if (infoj){
                    L.popup()
                        .setLatLng(JSON.parse(data.features[0].properties.latlonj))
                        .setContent(buildHtmlTable(infoj))
                        .openOn(map);
                }
            }
        }
    });
}


function buildHtmlTable(infoj) {
    var table = document.createElement('table');
    Object.keys(infoj).map(function(Okey) {
        if (infoj[Okey]) {
            var r = table.insertRow(table.rows.length);
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