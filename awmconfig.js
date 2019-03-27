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
};
