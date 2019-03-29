const pry = require('pryjs');

exports.LocalConfig = function (localizer, project) {
    project.mml.name = "ArcticWebMap";
    project.mml.center = [0, 0, 3];
    project.mml.bounds = [
        -20037508,
        -20037508,
        20037508,
        20037508
    ];
    // Use EPSG:3573 PROJ4 string
    project.mml.srs = "+proj=laea +lat_0=90 +lon_0=-100 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs";

    // Cache features in RAM. Uses a lot of RAM that would better be
    // used by Postgres.
    // localizer.where('Layer')
    // .then({
    //     "cache-features": "on"
    // });

    // Change database name, details, projection
    localizer.where('Layer')
    .if({'Datasource.type': 'postgis'})
    .then({
        "Datasource.dbname": "osm",
        "Datasource.password": "",
        "Datasource.user": "",
        "Datasource.host": "",
        "Datasource.extent": "-180,0,0,90",
        "Datasource.persist_connection": true,
        "srs-name": "EPSG:4326",
        "srs": "+proj=longlat +datum=WGS84 +no_defs",
        "extent": [-180,0,0,90]
	});

	// remove antarctic layers, high-zoom coast
	removedIDs = ['icesheet-outlines', 'icesheet-poly', 'coast-poly'];
	project.mml.Layer = project.mml.Layer.filter((layer) => {
		return !removedIDs.includes(layer.id);
	});

    // Use natural earth 10m for land instead of OSM
    localizer.where('Layer')
    .if({'Datasource.file': 'data/simplified-land-polygons-complete-3857/simplified_land_polygons.shp'})
    .then({
        'Datasource.file': 'data/ne_10m_land/ne_10m_land.shp'
    })

    // Adjust layer file location, source projection
    localizer.where('Layer')
    .if({'Datasource.type': 'shape'})
    .then((obj) => {
        obj["srs-name"] = "EPSG:3573";
        obj["srs"] = "+proj=laea +lat_0=90 +lon_0=-100 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs";
        obj.extent = [-20037508, -20037508, 20037508, 20037508];
        obj.Datasource.extent = [-20037508, -20037508, 20037508, 20037508];
        obj.Datasource.file = obj.Datasource.file.replace(/^data/, 'data/awm');
        return obj;
    });	
};
