//comment dennis

var southWest = L.latLng(51.35, -0.4),
    northEast = L.latLng(51.65, 0.2),
    bounds = L.latLngBounds(southWest, northEast);
var map_geodata = L.map('map', {
    scrollWheelZoom: false,
    maxBounds: bounds,
    minZoom: 12,
    maxZoom: 17
}).setView([51.50, -0.1], 13);

function geodata__retail_points() {
    L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_nolabels/{z}/{x}/{y}.png').addTo(map_geodata);
    L.tileLayer.wms("https://gsx.geolytix.net/geoserver/geolytix/wms", {
        layers: 'retailpoints',
        format: 'image/png',
        transparent: true,
        styles: 'retailpoints'
    }).addTo(map_geodata);
    L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_only_labels/{z}/{x}/{y}.png').addTo(map_geodata);
}

function geodata__retail_places() {
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
}

function geodata__seamless_locales() {
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
}

function geodata__town_suburbs() {
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
}

function geodata__postal_geom() {
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
}

function geodata__public_transport() {
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
}

function geodata__road_network() {
    L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_nolabels/{z}/{x}/{y}.png').addTo(map_geodata);
    L.tileLayer.wms("https://gsx.geolytix.net/geoserver/geolytix/wms", {
        layers: 'osm_roads',
        format: 'image/png',
        transparent: true,
        styles: 'osm_roads'
    }).addTo(map_geodata);
    L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_only_labels/{z}/{x}/{y}.png').addTo(map_geodata);
}

function geodata__uk_admin() {
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
}

function geodata__education() {
    L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_nolabels/{z}/{x}/{y}.png').addTo(map_geodata);
    L.tileLayer.wms("https://gsx.geolytix.net/geoserver/geolytix/wms", {
        layers: 'university_building',
        format: 'image/png',
        transparent: true,
        styles: 'university_building'
    }).addTo(map_geodata);
    L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_only_labels/{z}/{x}/{y}.png').addTo(map_geodata);
}

function geodata__poi() {
    L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_nolabels/{z}/{x}/{y}.png').addTo(map_geodata);
    L.tileLayer.wms("https://gsx.geolytix.net/geoserver/geolytix/wms", {
        layers: 'poi',
        format: 'image/png',
        transparent: true,
        styles: 'poi'
    }).addTo(map_geodata);
    L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_only_labels/{z}/{x}/{y}.png').addTo(map_geodata);
}

var dataset = window.location.search.substring(1);

switch (true) {
    case dataset === 'retail_points':
        geodata__retail_points();
        break;
    case dataset === 'retail_places':
        geodata__retail_places();
        break;
    case dataset === 'seamless_locales':
        geodata__seamless_locales();
        break;
    case dataset === 'town_suburbs':
        geodata__town_suburbs();
        break;
    case dataset === 'postal_geom':
        geodata__postal_geom();
        break;
    case dataset === 'public_transport':
        geodata__public_transport();
        break;
    case dataset === 'road_network':
        geodata__road_network();
        break;
    case dataset === 'uk_admin':
        geodata__uk_admin();
        break;
    case dataset === 'education':
        geodata__education();
        break;
    case dataset === 'poi':
        geodata__poi();
        break;
    default:
        L.tileLayer('https://osm.geolytix.net/osm_tiles/{z}/{x}/{y}.png').addTo(map_geodata);
}