const L = require('leaflet');
if (view_mode === 'desktop') require('./lscrolly')(document.querySelector('.geodata__info'));
const geodata = require('./geodata')();
geodata[window.location.search.substring(1)]();