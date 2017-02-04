var map = L.map('map_geodata', {
        renderer: L.svg(),
        scrollWheelZoom: false,
        zoomControl: false,
        maxBounds: L.latLngBounds(L.latLng(51.35, -0.4), L.latLng(51.65, 0.2)),
        minZoom: 12,
        maxZoom: 17
    }).setView([51.50, -0.1], 13);

map.createPane('labels');
map.getPane('labels').style.zIndex = 650;
map.getPane('labels').style.pointerEvents = 'none';

var geodata__btnZoomIn = $('.geodata__content > .btnZoomIn'),
    geodata__btnZoomOut = $('.geodata__content > .btnZoomOut');

geodata__btnZoomIn.click(function() {
    var z = map.getZoom() + 1;
    if (z < 18) {
        geodata__btnZoomOut.removeClass('disabled');
        map.setZoom(z);
    } else {
        geodata__btnZoomIn.addClass('disabled');
    }
});

geodata__btnZoomOut.click(function() {
    var z = map.getZoom() - 1;
    if (z > 11) {
        geodata__btnZoomIn.removeClass('disabled');
        map.setZoom(z);
    } else {
        geodata__btnZoomOut.addClass('disabled');
    }
});

var xhr,
    layerHover,
    featureHover,
    layerGrid,
    currentDataset = 'seamless_locales',
    geodataScrollyFirst = $('.geodata__scrolly > div').first(),
    geodataPricing = $('.geodata__pricing'),
    geodataFAQ = $('.geodata__faq'),
    proj_4326 = proj4.Proj('EPSG:4326'),
    proj_3857 = proj4.Proj('EPSG:3857');

seamless_locales();

$('.btnFullScreen').click(function() {
    window.location = '/map?' + currentDataset;
});

$('#seamless_locales').click(function () {
    selectGeodata($(this), 0);
    seamless_locales()
});

$('#retail_points').click(function () {
    selectGeodata($(this), 1);
    retail_points()
});

$('#retail_places').click(function () {
    selectGeodata($(this), 2);
    retail_places()
});

$('#public_transport').click(function() {
    selectGeodata($(this), 3);
    public_transport()
});

$('#postal_geom').click(function() {
    selectGeodata($(this), 4);
    postal_geom()
});

$('#town_suburb').click(function() {
    selectGeodata($(this), 5);
    town_suburb()
});

$('#education').click(function() {
    selectGeodata($(this), 6);
    education()
});

$('#workplace').click(function() {
    selectGeodata($(this), 7);
    workplace()
});

$('#poi').click(function() {
    selectGeodata($(this), 8);
    poi()
});

$('#residential').click(function() {
    selectGeodata($(this), 9);
    residential()
});

$('#uk_admin').click(function() {
    selectGeodata($(this), 10);
    uk_admin()
});

$('#property').click(function() {
    selectGeodata($(this), 11);
    property()
});

$('#road_network').click(function() {
    selectGeodata($(this), 12);
    road_network()
});

$('#media_com').click(function() {
    selectGeodata($(this), 13);
    media_com()
});

$('#physical').click(function() {
    selectGeodata($(this), 14);
    physical()
});

$('#pricing').click(function() {
    selectGeodata($(this), 15);
});

$('#faq').click(function() {
    selectGeodata($(this), 15);
});


function selectGeodata(_this, _i){
    $('.tmpl_legend').html('');
    _this.siblings().removeClass('selected');
    _this.addClass('selected');
    currentDataset = _this.attr('id');
    removeLayer();
    map.off('mousemove');
    map.off('click');
    map.off('zoomend');
    map.off('moveend');
    geodataScrollyFirst.animate({'marginTop': 619 * -_i});
    currentDataset == 'pricing' ? geodataPricing.show() : geodataPricing.hide();
    currentDataset == 'faq' ? geodataFAQ.show() : geodataFAQ.hide();
}

function removeLayer(){
    map.eachLayer(function (layer) {
        map.removeLayer(layer);
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
    }).addTo(map);

    map.on('mousemove', function (e) {
        hoverSelect(e, map, layer, document.getElementById('seamless_locales_info'))
    });
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

    $('.retail_points .legend span').click(function(){
        $(this).toggleClass('active');
        if ($(this).hasClass('active')) {
            cqlFilterArray.push("brand='" + $(this).attr('id') + "'");
        } else {
            cqlFilterArray.splice($.inArray("brand='" + $(this).attr('id') + "'", cqlFilterArray),1);
        }
        cqlFilter = cqlFilterArray.join(' OR ');

        map.removeLayer(layer);

        if (cqlFilter.length > 0) {
            L.tileLayer.wms("https://gsx.geolytix.net/geoserver/geolytix/wms", {
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

    L.tileLayer.wms("https://gsx.geolytix.net/geoserver/geolytix/wms", {
        layers: 'postal_district',
        format: 'image/png',
        transparent: true,
        styles: 'postal_district_nolabel',
        minZoom: 14,
        maxZoom: 14
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
        layers: 'postal_area',
        format: 'image/png',
        transparent: true,
        pane: 'tilePane',
        zIndex: 3,
        styles: 'postal_area',
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
        layers: 'postal_code',
        format: 'image/png',
        transparent: true,
        styles: 'postal_code',
        minZoom: 17
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
    }).addTo(map);

    map.on('mousemove', function(e){hoverSelect(e, map, layer, document.getElementById('town_suburb_info'))});
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

    $.when($.get('/public/tmpl/legend_workplace.html'))
        .done(function (_tmpl) {
            var t = $(_tmpl).render();
            $('#legend__workplace').append(t);
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

    $('.poi .legend span').click(function(){
        $(this).toggleClass('active');
        if ($(this).hasClass('active')) {
            cqlFilterArray.push("poi_type='" + $(this).attr('id') + "'");
        } else {
            cqlFilterArray.splice($.inArray("poi_type='" + $(this).attr('id') + "'", cqlFilterArray),1);
        }
        cqlFilter = cqlFilterArray.join(' OR ');

        map.removeLayer(layer);
        if (cqlFilter.length > 0) {
            L.tileLayer.wms("https://gsx.geolytix.net/geoserver/geolytix/wms", {
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

    $.when($.get('/public/tmpl/legend_property.html'))
        .done(function(_tmpl) {
            var t = $(_tmpl).render();
            $('#legend__property').append(t);
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
            17: 'media_bb'
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

    $.when($.get('/public/tmpl/legend_media_bb.html'))
        .done(function(_tmpl) {
            var t = $(_tmpl).render();
            $('#legend__media').append(t);
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
        })
    };
}

function getGridData(_bounds, _layer, _o){
    if (xhr && xhr.readyState != 4) xhr.abort();
    if (layerGrid) map.removeLayer(layerGrid);
    xhr = $.ajax({
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
            info_format: 'application/json'
        };
    params = L.Util.extend(defaultParams, params || {});
    params[params.version === '1.3' ? 'i' : 'x'] = point.x;
    params[params.version === '1.3' ? 'j' : 'y'] = point.y;
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