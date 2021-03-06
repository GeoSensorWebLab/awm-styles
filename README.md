# Arctic Web Map

![samples/zoom-5-canada.jpg](samples/zoom-5-canada.jpg)

([More screenshots](samples))

These are the CartoCSS map stylesheets for the Canadian Arctic map layer on [Arctic Web Map][awm]. The style is based on [openstreetmap-carto][osm-carto] with some changes for the Canadian Arctic.

These stylesheets can be used in your own cartography projects, and are designed to be easily customised. They work with [Kosmtik][] and also with the command-line [CartoCSS][] processor.

If you want to use the map or tiles in your project, please see the [USAGE.md](USAGE.md) document. The rest of the README is for a general overview of the Arctic Web Map stylesheet and how to extend it.

[awm]: https://webmap.arcticconnect.ca
[CartoCSS]: https://github.com/mapbox/carto
[Kosmtik]: https://github.com/kosmtik/kosmtik
[osm-carto]: https://github.com/gravitystorm/openstreetmap-carto

## Differences from Arctic Web Map [stable/1.0][stable-10]

The `stable/2.0` branch is a separate map style from the primary Arctic Web Map from ArcticConnect. Here is a comparison.

| Feature                       | `stable/1.0`           | `stable/2.0`                |
|-------------------------------|------------------------|-----------------------------|
| Active Development (2019)     | No                     | Yes                         |
| Coverage                      | Pan-Arctic             | Canada + Alaska + Greenland |
| Projections                   | EPSG:3571 to EPSG:3576 | EPSG:3573 only              |
| Bathymetry Styles             | Yes                    | Yes                         |
| Contour Lines                 | Canada only            | No                          |
| `openstreetmap-carto` Version | v2.45.1                | v4.20.0                     |
| Minutely OSM Updates          | Inactive               | No                          |

(Table generated with [Table Convert Online][table-convert]).

Currently, active development on the `master` branch will be merged into the `stable/2.0` branch.

[stable-10]: https://github.com/GeoSensorWebLab/awm-styles/tree/stable/1.0
[table-convert]: https://tableconvert.com

## Differences from openstreetmap-carto

* Web Mercator projection is replaced with a more appropriate projection for the far north (EPSG:3573)
* Bathymetry ocean data improves visualization of arctic region where oceans and seas significantly impact local communities and research
* Northern communities have increased label prominence (Cut-off is 60˚N)
* Region is clipped to -180˚E/40˚N to 0˚E/90˚N
* Hypsometric cross-tint is used as land base layer up to zoom 12
* Lakes from Natural Earth data are used up to zoom 7
* Map background is "land" colour with land/water polygons overlaid
* OSM `water-areas`, `text-poly-low-zoom`, `capital-names` not shown until zoom 5
* OSM `landcover-low-zoom`, `landcover-area-symbols` not shown until zoom 7
* OSM data in PostGIS is stored in EPSG:3573 (fixes label issues)
* OSM `country-names` removed to not over-emphasize *Kalaallit Nunaat*
* High-quality OSM split water polygons are used from zoom 10 instead of bathymetry

Other changes will be listed here as the stylesheet is developed.

# Installation

Installation has been separated into two documents, depending on your goal.

If you want to modify the stylesheet and commit changes to git, see [DEVELOPMENT.md](DEVELOPMENT.md).

For setting up the Arctic Web Map stylesheet on a public server, see [DEPLOYMENT.md](DEPLOYMENT.md).

# Map Errors

You may encounter issues with the map where data is not properly represented or is flat out incorrect. Some of these problems are with the stylesheet or data import process used by Arctic Web Map. Other problems are due to the underlying data from OpenStreetMap.

Problems with how things are drawn on the map probably fall under this stylesheet. Please use the issues tracker to notify us of any map problems.

Incorrect names, missing data, and similar are based in OpenStreetMap. You can fix small errors yourself with an OSM account, but for larger issues that affect large regions (city scale and larger) you should contact the OSM mailing list for confirmation.

# Contributing

Contributions to this project are welcome, see [CONTRIBUTING.md](CONTRIBUTING.md) for full details.

# Versioning

Arctic Web Map does not have an active versioning system. Branches are used to designate different variants of the stylesheet, as well as which map servers are on which version.

# Roadmap

The `stable/2.0` branch is intended to provide a general purpose stylesheet for researchers and northern communities. To that end, legibility of a wide variety of data from OpenStreetMap will be the focus.

# Alternatives

There are many open-source stylesheets written for creating OpenStreetMap-based maps using Mapnik, many based on the parent project. Some alternatives are:

* [OSM-Bright](https://github.com/mapbox/osm-bright)
* [XML-based stylesheets](https://trac.openstreetmap.org/browser/subversion/applications/rendering/mapnik)
* [osmfr-cartocss](https://github.com/cquest/osmfr-cartocss)
* [openstreetmap-carto-german](https://github.com/giggls/openstreetmap-carto-de)

# Maintainers

* James Badger [@openfirmware](https://github.com/openfirmware/)
