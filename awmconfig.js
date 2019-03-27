const pry = require('pryjs');

exports.LocalConfig = function (localizer, project) {
    project.mml.name = "ArcticWebMap";
    project.mml.center = [70, -90, 4];
    project.mml.bounds = [-180, 0, 0, 90];

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

	// remove antarctic layers
	removedIDs = ['icesheet-outlines', 'icesheet-poly'];
	project.mml.Layer = project.mml.Layer.filter((layer) => {
		return !removedIDs.includes(layer.id);
	});

	// Use EPSG:3573 PROJ4 string
	project.mml.srs = "+proj=laea +lat_0=90 +lon_0=-100 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs";
};
