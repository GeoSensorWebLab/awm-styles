exports.LocalConfig = function (localizer, project) {
    localizer.where('center').then([29.9377, -3.4216, 9]);
    localizer.where('Layer').if({'Datasource.type': 'postgis'}).then({
        "Datasource.dbname": "osm",
        "Datasource.password": "",
        "Datasource.user": "",
        "Datasource.host": ""
    });
};
