const fs  = require("fs");
const pry = require("pryjs");

const epsg3573 = "+proj=laea +lat_0=90 +lon_0=-100 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs";
// maximum extent of EPSG:3573 projection
const extent3573 = [
    -20037508,
    -20037508,
    20037508,
    20037508
];
// clipped extent of EPSG:3573 projection for this map
const clipped3573 = [
    -4167630.8211728190071881,
    -5397732.1324295047670603,
    5396780.7497062487527728,
    937306.5764416041783988
];

// TODO: Create a DSL/API to clean this up.
// AddAfter, Remove, CreateLayer, etc.
exports.LocalConfig = function (localizer, project) {
    /*
     * PROJECT RECONFIGURATION
     */
    project.mml.name = "ArcticWebMap";
    project.mml.center = [0, 0, 3];
    project.mml.bounds = extent3573;
    // Use EPSG:3573 PROJ4 string
    project.mml.srs = epsg3573;

    // extents from ne_10m_land projected into EPSG:3573
    project.mml["maximum-extent"] = clipped3573;

    // Cache features in RAM. Uses a lot of RAM that would better be
    // used by Postgres.
    // localizer.where("Layer")
    // .then({
    //     "cache-features": "on"
    // });

    /*
     * LAYER REMOVALS
     */

    // remove antarctic layers - projection issues
    // remove coasts - high-zoom coastline not needed
    // remove country names - only Kalaallit Nunaat/France/Île Verte are
    // displayed, which may look like favouritism to those regions
    function remove(searchID) {
        let index = project.mml.Layer.findIndex((l) => (l.id === searchID));
        project.mml.Layer.splice(index, 1);
    };

    removedIDs = [
        "coast-poly",
        "country-names",
        "icesheet-outlines",
        "icesheet-poly"
    ].forEach((id) => { remove(id) });

    /*
     * LAYER EDITS
     */

    // Change database name, details, projection
    localizer.where("Layer")
    .if({"Datasource.type": "postgis"})
    .then({
        "Datasource.dbname": "osm_3573",
        "Datasource.password": "",
        "Datasource.user": "",
        "Datasource.host": "",
        "Datasource.persist_connection": true,
        "Datasource.estimate_extent": true,
        // extent should be in database SRS
        "Datasource.extent": clipped3573.join(", "),
        "srs-name": "EPSG:3573",
        "srs": epsg3573
    });

    // Use natural earth 10m for land instead of OSM
    localizer.where("Layer")
    .if({"Datasource.file": "data/simplified-land-polygons-complete-3857/simplified_land_polygons.shp"})
    .then({
        "Datasource.file": "data/ne_10m_land/ne_10m_land.shp"
    });

    /*
     * MINZOOM ADJUSTMENTS
     */

    // Adjust minzoom on water-areas
    localizer.where("Layer")
    .if({"id": "water-areas"})
    .then({
        "properties.minzoom": 5
    });

    // Adjust minzoom on landcover-low-zoom
    localizer.where("Layer")
    .if({"id": "landcover-low-zoom"})
    .then({
        "properties.minzoom": 7
    });

    // Adjust minzoom on landcover-area-symbols
    localizer.where("Layer")
    .if({"id": "landcover-area-symbols"})
    .then({
        "properties.minzoom": 7
    });

    // Adjust minzoom on text-poly-low-zoom
    localizer.where("Layer")
    .if({"id": "text-poly-low-zoom"})
    .then({
        "properties.minzoom": 5
    });

    // Adjust bias for cities, towns, and villages north of 60˚N.
    // For places in that region:
    // 1. classify in "city" category
    // 2. multiply population by 100
    // 3. Include villages in this layer
    localizer.where("Layer")
    .if({"id": "placenames-medium"})
    .then({"Datasource.table":
    `(SELECT
            way,
            name,
            score,
            CASE
              WHEN (place = 'city') THEN 1
              WHEN (ST_Covers(ST_MakeEnvelope(-180,60,0,90,4326), ST_Transform(way, 4326))) THEN 1
              WHEN (place = 'town') THEN 2
              ELSE 3
            END as category,
            round(ascii(md5(osm_id::text)) / 55) AS dir -- base direction factor on geometry to be consistent across metatiles
          FROM
            (SELECT
                osm_id,
                way,
                place,
                name,
                (
                  (CASE
                    WHEN (tags->'population' ~ '^[0-9]{1,8}$') THEN (tags->'population')::INTEGER
                    WHEN (place = 'city') THEN 100000
                    WHEN (place = 'town') THEN 1000
                    WHEN (place = 'village') THEN 100
                    ELSE 1
                  END)
                  *
                  (CASE
                    WHEN (ST_Covers(ST_MakeEnvelope(-180,60,0,90,4326), ST_Transform(way, 4326))) THEN 100
                    WHEN (tags @> 'capital=>4') THEN 2
                    ELSE 1
                  END)
                ) AS score
              FROM planet_osm_point
              WHERE place IN ('city', 'town', 'village')
                AND name IS NOT NULL
                AND NOT (tags @> 'capital=>yes')
            ) as p
          ORDER BY score DESC, length(name) DESC, name
        ) AS placenames_medium`});

    // Adjust shapefile layer file location, source projection
    localizer.where("Layer")
    .if({"Datasource.type": "shape"})
    .then((obj) => {
        obj["srs-name"] = "EPSG:3573";
        obj["srs"] = epsg3573;
        obj.extent = clipped3573;
        obj.Datasource.extent = clipped3573;
        obj.Datasource.file = obj.Datasource.file.replace(/^data/, "data/awm");
        return obj;
    });

    /*
     * LAYER ADDITIONS
     */

    // Add a layer to the Layer list after the layer with id `searchID`
    function addAfter(searchID, layer) {
        let index = project.mml.Layer.findIndex(l => (l.id === searchID));
        project.mml.Layer.splice(index+1, 0, layer);
    }

    // Sample layer format:
    // {
    //     "id": "world",
    //     "geometry": "polygon",
    //     "extent": [
    //         -20037508,
    //         -20037508,
    //         20037508,
    //         20037508
    //     ],
    //     "srs-name": "EPSG:3573",
    //     "srs": "+proj=laea +lat_0=90 +lon_0=-100 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs",
    //     "Datasource": {
    //         "file": "data/awm/ne_10m_land/ne_10m_land.shp",
    //         "type": "shape",
    //         "extent": [
    //             -20037508,
    //             -20037508,
    //             20037508,
    //             20037508
    //         ]
    //     },
    //     "properties": {
    //         "maxzoom": 9
    //     }
    // }

    addAfter("necountries", {
        id: "lakes-low",
        geometry: "polygon",
        "srs-name": "EPSG:3573",
        srs: epsg3573,
        Datasource: {
            file: "data/awm/ne_10m_lakes/ne_10m_lakes.shp",
            type: "shape"
        },
        properties: {
            maxzoom: 7
        }
    });

    // Add bathymetry layers
    let bathymetry = {
        "bathymetry-10km": "ne_10m_bathymetry_A_10000",
        "bathymetry-9km":  "ne_10m_bathymetry_B_9000",
        "bathymetry-8km":  "ne_10m_bathymetry_C_8000",
        "bathymetry-7km":  "ne_10m_bathymetry_D_7000",
        "bathymetry-6km":  "ne_10m_bathymetry_E_6000",
        "bathymetry-5km":  "ne_10m_bathymetry_F_5000",
        "bathymetry-4km":  "ne_10m_bathymetry_G_4000",
        "bathymetry-3km":  "ne_10m_bathymetry_H_3000",
        "bathymetry-2km":  "ne_10m_bathymetry_I_2000",
        "bathymetry-1km":  "ne_10m_bathymetry_J_1000",
        "bathymetry-200m": "ne_10m_bathymetry_K_200",
        "bathymetry-0m":   "ne_10m_bathymetry_L_0",
    }

    Object.keys(bathymetry).forEach((id) => {
        let filename = bathymetry[id];
        addAfter("necountries", {
            id: id,
            geometry: "polygon",
            "srs-name": "EPSG:3573",
            srs: epsg3573,
            Datasource: {
                file: `data/awm/ne_10m_bathymetry_all/${filename}.shp`,
                type: "shape"
            }
        });
    });

    /*
     * STYLESHEET ADDITIONS
     */

    // Add to stylesheets
    project.mml.Stylesheet.push({
        id: "../arcticwebmap.mss",
        data: fs.readFileSync("./arcticwebmap.mss").toString()
    });
};
