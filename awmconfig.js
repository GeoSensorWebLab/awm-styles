const pry = require('pryjs');

exports.LocalConfig = function (localizer, project) {
    localizer.where('name').then("ArcticWebMap");
    localizer.where('center').then([60, -90, 4]);

    // Change database name, details, projection
    localizer.where('Layer')
    .if({'Datasource.type': 'postgis'})
    .then({
        "Datasource.dbname": "osm",
        "Datasource.password": "",
        "Datasource.user": "",
        "Datasource.host": "",
        "Datasource.extent": "-180,0,180,90",
        "srs-name": "EPSG:4326",
        "srs": "+proj=longlat +datum=WGS84 +no_defs",
        "extent": [-180,0,180,90]
	});

	// remove antarctic layers
	removedIDs = ['icesheet-outlines', 'icesheet-poly'];
	project.mml.Layer = project.mml.Layer.filter((layer) => {
		return !removedIDs.includes(layer.id);
	});

	// Use EPSG:3573 PROJ4 string
	project.mml.srs = "+proj=laea +lat_0=90 +lon_0=-100 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs";
};
