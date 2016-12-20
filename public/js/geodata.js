var map_container = section_geodata.find('.container > .map').first(),
    map_expand = map_container.find('.map__expand').first(),
    map_expand__i = map_expand.find('i').first();

section_geodata.find('.container > .content .icon-download').bind({
    mouseenter: function () {
        $(this).parent().parent().siblings('.tooltip').show();
    },
    mouseleave: function () {
        $(this).parent().parent().siblings('.tooltip').hide();
    }
});

map_expand.click(function () {
    map_container.toggleClass('map__fullscreen');
    setTimeout(function () {
        map_geodata.invalidateSize()
    }, 100);
    map_expand__i.toggleClass('icon-resize-full');
    map_expand__i.toggleClass('icon-resize-small');
    $('.icon-download').toggleClass('icon-download__hide');
});

section_geodata.find('.container > .map').first().show();
var southWest = L.latLng(51.35, -0.4),
    northEast = L.latLng(51.65, 0.2),
    bounds = L.latLngBounds(southWest, northEast);
var map_geodata = L.map('map_geodata', {
    scrollWheelZoom: false,
    maxBounds: bounds,
    minZoom: 12,
    maxZoom: 17
}).setView([51.50, -0.1], 13);

function geodata__retail_points() {
    section_geodata.find('.container > .map').first().show();
    map_geodata.eachLayer(function (layer) {
        map_geodata.removeLayer(layer);
    });
    L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_nolabels/{z}/{x}/{y}.png').addTo(map_geodata);
    L.tileLayer.wms("https://gsx.geolytix.net/geoserver/geolytix/wms", {
        layers: 'retailpoints',
        format: 'image/png',
        transparent: true,
        styles: 'retailpoints'
    }).addTo(map_geodata);
    L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_only_labels/{z}/{x}/{y}.png').addTo(map_geodata);
    section_geodata.find('.container > .content > .retail_points').first().show();
}

function geodata__retail_places() {
    section_geodata.find('.container > .map').first().show();
    map_geodata.eachLayer(function (layer) {
        map_geodata.removeLayer(layer);
    });
    L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_nolabels/{z}/{x}/{y}.png').addTo(map_geodata);
    L.tileLayer.wms("https://gsx.geolytix.net/geoserver/geolytix/wms", {
        layers: 'retailplaces_point',
        format: 'image/png',
        transparent: true,
        styles: 'retailplaces_point',
        maxZoom: 12
    }).addTo(map_geodata);
    L.tileLayer.wms("https://gsx.geolytix.net/geoserver/geolytix/wms", {
        layers: 'retailplaces_outline',
        format: 'image/png',
        transparent: true,
        styles: 'retailplaces_outline',
        minZoom: 13,
        maxZoom: 15
    }).addTo(map_geodata);
    L.tileLayer.wms("https://gsx.geolytix.net/geoserver/geolytix/wms", {
        layers: 'retailplaces_shopping',
        format: 'image/png',
        transparent: true,
        styles: 'retailplaces_shopping',
        minZoom: 14,
        maxZoom: 17
    }).addTo(map_geodata);
    L.tileLayer.wms("https://gsx.geolytix.net/geoserver/geolytix/wms", {
        layers: 'retailplaces_build',
        format: 'image/png',
        transparent: true,
        styles: 'retailplaces_build',
        minZoom: 14,
        maxZoom: 17
    }).addTo(map_geodata);
    L.tileLayer.wms("https://gsx.geolytix.net/geoserver/geolytix/wms", {
        layers: 'retailplaces_pitch',
        format: 'image/png',
        transparent: true,
        styles: 'retailplaces_pitch',
        minZoom: 16,
        maxZoom: 17
    }).addTo(map_geodata);
    L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_only_labels/{z}/{x}/{y}.png').addTo(map_geodata);
    section_geodata.find('.container > .content > .retail_places').first().show();
}

function geodata__seamless_locales() {
    section_geodata.find('.container > .map').first().show();
    map_geodata.eachLayer(function (layer) {
        map_geodata.removeLayer(layer);
    });
    L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_nolabels/{z}/{x}/{y}.png').addTo(map_geodata);
    new L.NonTiledLayer.WMS("https://gsx.geolytix.net/geoserver/geolytix/wms", {
        opacity: 1.0,
        layers: 'seamless_locales',
        format: 'image/png',
        transparent: true,
        pane: 'tilePane',
        zIndex: 3,
        styles: 'seamless_locales'
    }).addTo(map_geodata);
    section_geodata.find('.container > .content > .seamless_locales').first().show();
}

function geodata__town_suburbs() {
    section_geodata.find('.container > .map').first().show();
    map_geodata.eachLayer(function (layer) {
        map_geodata.removeLayer(layer);
    });
    L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_nolabels/{z}/{x}/{y}.png').addTo(map_geodata);
    new L.NonTiledLayer.WMS("https://gsx.geolytix.net/geoserver/geolytix/wms", {
        opacity: 1.0,
        layers: 'townsuburb_suburb',
        format: 'image/png',
        transparent: true,
        pane: 'tilePane',
        zIndex: 3,
        styles: 'townsuburb_suburb'
    }).addTo(map_geodata);
    section_geodata.find('.container > .content > .town_suburbs').first().show();
}

function geodata__postal_geom() {
    section_geodata.find('.container > .map').first().show();
    map_geodata.eachLayer(function (layer) {
        map_geodata.removeLayer(layer);
    });
    L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_nolabels/{z}/{x}/{y}.png').addTo(map_geodata);
    L.tileLayer.wms("https://gsx.geolytix.net/geoserver/geolytix/wms", {
        layers: 'postal_district',
        format: 'image/png',
        transparent: true,
        styles: 'postal_district_nolabel',
        minZoom: 14,
        maxZoom: 14
    }).addTo(map_geodata);
    L.tileLayer.wms("https://gsx.geolytix.net/geoserver/geolytix/wms", {
        layers: 'postal_sector',
        format: 'image/png',
        transparent: true,
        styles: 'postal_sector_nolabel',
        minZoom: 15,
        maxZoom: 15
    }).addTo(map_geodata);
    new L.NonTiledLayer.WMS("https://gsx.geolytix.net/geoserver/geolytix/wms", {
        opacity: 1.0,
        layers: 'postal_area',
        format: 'image/png',
        transparent: true,
        pane: 'tilePane',
        zIndex: 3,
        styles: 'postal_area',
        maxZoom: 14
    }).addTo(map_geodata);
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
    }).addTo(map_geodata);
    L.tileLayer.wms("https://gsx.geolytix.net/geoserver/geolytix/wms", {
        layers: 'postal_code',
        format: 'image/png',
        transparent: true,
        styles: 'postal_code',
        minZoom: 17
    }).addTo(map_geodata);
    new L.NonTiledLayer.WMS("https://gsx.geolytix.net/geoserver/geolytix/wms", {
        opacity: 1.0,
        layers: 'postal_sector',
        format: 'image/png',
        transparent: true,
        pane: 'tilePane',
        zIndex: 3,
        styles: 'postal_sector',
        minZoom: 16
    }).addTo(map_geodata);
    section_geodata.find('.container > .content > .postal_geom').first().show();
}

function geodata__public_transport() {
    section_geodata.find('.container > .map').first().show();
    map_geodata.eachLayer(function (layer) {
        map_geodata.removeLayer(layer);
    });
    L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_nolabels/{z}/{x}/{y}.png').addTo(map_geodata);
    L.tileLayer.wms("https://gsx.geolytix.net/geoserver/geolytix/wms", {
        layers: 'transport_bus',
        format: 'image/png',
        transparent: true,
        styles: 'transport_bus'
    }).addTo(map_geodata);
    L.tileLayer.wms("https://gsx.geolytix.net/geoserver/geolytix/wms", {
        layers: 'transport_rail',
        format: 'image/png',
        transparent: true,
        styles: 'transport_rail'
    }).addTo(map_geodata);
    L.tileLayer.wms("https://gsx.geolytix.net/geoserver/geolytix/wms", {
        layers: 'transport_tube',
        format: 'image/png',
        transparent: true,
        styles: 'transport_tube'
    }).addTo(map_geodata);
    L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_only_labels/{z}/{x}/{y}.png').addTo(map_geodata);
    section_geodata.find('.container > .content > .public_transport').first().show();
}

function geodata__road_network() {
    section_geodata.find('.container > .map').first().show();
    map_geodata.eachLayer(function (layer) {
        map_geodata.removeLayer(layer);
    });
    L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_nolabels/{z}/{x}/{y}.png').addTo(map_geodata);
    L.tileLayer.wms("https://gsx.geolytix.net/geoserver/geolytix/wms", {
        layers: 'osm_roads',
        format: 'image/png',
        transparent: true,
        styles: 'osm_roads'
    }).addTo(map_geodata);
    L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_only_labels/{z}/{x}/{y}.png').addTo(map_geodata);
    section_geodata.find('.container > .content > .road_network').first().show();
}

function geodata__uk_admin() {
    section_geodata.find('.container > .map').first().show();
    map_geodata.eachLayer(function (layer) {
        map_geodata.removeLayer(layer);
    });
    L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_nolabels/{z}/{x}/{y}.png').addTo(map_geodata);
    L.tileLayer.wms("https://gsx.geolytix.net/geoserver/geolytix/wms", {
        layers: 'admin_uk_oa',
        format: 'image/png',
        transparent: true,
        styles: 'admin_uk_oa',
        minZoom: 15
    }).addTo(map_geodata);
    L.tileLayer.wms("https://gsx.geolytix.net/geoserver/geolytix/wms", {
        layers: 'admin_uk_soa',
        format: 'image/png',
        transparent: true,
        styles: 'admin_uk_soa',
        minZoom: 14
    }).addTo(map_geodata);
    L.tileLayer.wms("https://gsx.geolytix.net/geoserver/geolytix/wms", {
        layers: 'admin_uk_msoa',
        format: 'image/png',
        transparent: true,
        styles: 'admin_uk_msoa',
        minZoom: 13,
        maxZoom: 15
    }).addTo(map_geodata);
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
    }).addTo(map_geodata);
    section_geodata.find('.container > .content > .uk_admin').first().show();
}

function geodata__education() {
    section_geodata.find('.container > .map').first().show();
    map_geodata.eachLayer(function (layer) {
        map_geodata.removeLayer(layer);
    });
    L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_nolabels/{z}/{x}/{y}.png').addTo(map_geodata);
    L.tileLayer.wms("https://gsx.geolytix.net/geoserver/geolytix/wms", {
        layers: 'university_building',
        format: 'image/png',
        transparent: true,
        styles: 'university_building'
    }).addTo(map_geodata);
    L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_only_labels/{z}/{x}/{y}.png').addTo(map_geodata);
    section_geodata.find('.container > .content > .education').first().show();
}

function geodata__poi() {
    section_geodata.find('.container > .map').first().show();
    map_geodata.eachLayer(function (layer) {
        map_geodata.removeLayer(layer);
    });
    L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_nolabels/{z}/{x}/{y}.png').addTo(map_geodata);
    L.tileLayer.wms("https://gsx.geolytix.net/geoserver/geolytix/wms", {
        layers: 'poi',
        format: 'image/png',
        transparent: true,
        styles: 'poi'
    }).addTo(map_geodata);
    L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_only_labels/{z}/{x}/{y}.png').addTo(map_geodata);
    section_geodata.find('.container > .content > .poi').first().show();
}

function geodata__media_com() {
    section_geodata.find('.container > .map').first().show();
    map_geodata.eachLayer(function (layer) {
        map_geodata.removeLayer(layer);
    });
    L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_nolabels/{z}/{x}/{y}.png').addTo(map_geodata);
    section_geodata.find('.container > .content > .media_comms').first().show();
}

function geodata__residential() {
    section_geodata.find('.container > .map').first().show();
    map_geodata.eachLayer(function (layer) {
        map_geodata.removeLayer(layer);
    });
    L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_nolabels/{z}/{x}/{y}.png').addTo(map_geodata);
    section_geodata.find('.container > .content > .work_places').first().show();
}

function geodata__physical() {
    section_geodata.find('.container > .map').first().show();
    map_geodata.eachLayer(function (layer) {
        map_geodata.removeLayer(layer);
    });
    L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_nolabels/{z}/{x}/{y}.png').addTo(map_geodata);
    section_geodata.find('.container > .content > .work_places').first().show();
}

function geodata__property() {
    section_geodata.find('.container > .map').first().show();
    map_geodata.eachLayer(function (layer) {
        map_geodata.removeLayer(layer);
    });
    L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_nolabels/{z}/{x}/{y}.png').addTo(map_geodata);
    section_geodata.find('.container > .content > .work_places').first().show();
}

function geodata__work_places() {
    section_geodata.find('.container > .map').first().show();
    map_geodata.eachLayer(function (layer) {
        map_geodata.removeLayer(layer);
    });
    L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_nolabels/{z}/{x}/{y}.png').addTo(map_geodata);
    section_geodata.find('.container > .content > .work_places').first().show();
}

//set default
geodata__retail_points();

section_geodata.find('.container > .select > .select__inner > div').click(function () {
    $(this).siblings().removeClass('selected');
    $(this).addClass('selected');
    body__inner.animate({ scrollTop: body__inner.scrollTop() + section_geodata.offset().top - 70 });
    section_geodata.find('.container > .content > .info').hide();
    section_geodata.find('.container > .content').hide();
    switch (true) {
        case $(this).hasClass('retail_points'):
            geodata__retail_points();
            break;
        case $(this).hasClass('retail_places'):
            geodata__retail_places();
            break;
        case $(this).hasClass('seamless_locales'):
            geodata__seamless_locales();
            break;
        case $(this).hasClass('town_suburbs'):
            geodata__town_suburbs();
            break;
        case $(this).hasClass('postal_geom'):
            geodata__postal_geom();
            break;
        case $(this).hasClass('public_transport'):
            geodata__public_transport();
            break;
        case $(this).hasClass('road_network'):
            geodata__road_network();
            break;
        case $(this).hasClass('uk_admin'):
            geodata__uk_admin();
            break;
        case $(this).hasClass('education'):
            geodata__education();
            break;
        case $(this).hasClass('work_places'):
            geodata__work_places();
            break;
        case $(this).hasClass('residential'):
            geodata__residential();
            break;
        case $(this).hasClass('media_com'):
            geodata__media_com();
            break;
        case $(this).hasClass('physical'):
            geodata__physical();
            break;
        case $(this).hasClass('property'):
            geodata__property();
            break;
        case $(this).hasClass('poi'):
            geodata__poi();
            break;
        case $(this).hasClass('pricing'):
            section_geodata.find('.container > .pricing').first().show();
            break;
        case $(this).hasClass('faq'):
            section_geodata.find('.container > .faq').first().show();
            break;
    }
});