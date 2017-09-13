const L = require('leaflet');

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

map.on('moveend', function () {
    mapZoom = map.getZoom();
    chkZoomBtn();
});

map.on('zoomend', function () {
    mapZoom = map.getZoom();
    chkZoomBtn();
});

const geodata = require('./geodata')(map);
geodata.datasets[window.location.search.substring(1)]();
require('./lscrolly')('geodata__info');