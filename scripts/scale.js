// Calculate scale for various projections, for comparison.
// Based on https://github.com/mapnik/mapnik/wiki/ScaleAndPpi
const mapnik = require('mapnik');

let lowerLeft = [-180, 40];
let upperRight = [0, 89.999];

function forwardEnv(proj, ll, ur) {
    return proj.forward(ll).concat(proj.forward(ur));
}

function inverseEnv(proj, ll, ur) {
    return proj.inverse(ll).concat(proj.inverse(ur));
}

function inverseEnv(proj, env) {
    return proj.inverse(env.slice(0, 2)).concat(proj.inverse(env.slice(2, 4)));
}

[{
    name: "3857",
    srs: "+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext +no_defs"
}, {
    name: "4326",
    srs: "+proj=longlat +datum=WGS84 +no_defs"
}, {
    name: "3573",
    srs: "+proj=laea +lat_0=90 +lon_0=-100 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs"
}].forEach((srs) => {
    let map = new mapnik.Map(512, 512, srs.srs);
    let proj = new mapnik.Projection(srs.srs);
    map.zoomToBox(forwardEnv(proj, lowerLeft, upperRight));
    console.log(srs.name, " Projection: ", inverseEnv(proj, map.extent));
    console.log(srs.name, " Scale: ", map.scale());
});

// Database is in EPSG:4326.
// Map is in EPSG:3573.
// Openstreetmap-carto styles assume EPSG:3857.
// 
// This means the styles need to be modified to the correct database
// scale; so multiply the style "scale denominator" by 3573 map scale
// divided by 4326 map scale.
// 10382.499498931156 / 0.3515625 = 29532.443019182
// 135612.8928146656 / 10382.499498931156 = 13.061680651
// 0.3515625 / 10382.499498931156 = 0.00003386106593