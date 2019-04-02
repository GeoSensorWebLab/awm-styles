# Arctic Web Map

TODO: Add screenshot

These are the CartoCSS map stylesheets for the Canadian Arctic map layer on [airport.gswlab.ca](http://airport.gswlab.ca). The style is based on [openstreetmap-carto](https://github.com/gravitystorm/openstreetmap-carto) with some changes for the Canadian Arctic.

These stylesheets can be used in your own cartography projects, and are designed to be easily customised. They work with [Kosmtik](https://github.com/kosmtik/kosmtik) and also with the command-line [CartoCSS](https://github.com/mapbox/carto) processor.

## Differences from Arctic Web Map "stable/1.0"

The "stable/2.0" branch is a separate map style from the primary Arctic Web Map from ArcticConnect. Here is a comparison.

| Feature                       | `stable/1.0`           | `stable/2.0`                |
|-------------------------------|------------------------|-----------------------------|
| Active Development (2019)     | No                     | Yes                         |
| Coverage                      | Pan-Arctic             | Canada + Alaska + Greenland |
| Projections                   | EPSG:3571 to EPSG:3576 | EPSG:3573 only              |
| Bathymetry Styles             | Yes                    | Yes                         |
| Contour Lines                 | Canada only            | No                          |
| `openstreetmap-carto` Version | v2.45.1                | v4.20.0                     |
| Minutely OSM Updates          | Inactive               | No                          |

(Table generated with [Table Convert Online](https://tableconvert.com).)

Currently, active development on the `master` branch will be merged into the `stable/2.0` branch.

## Differences from openstreetmap-carto

* Web Mercator projection is replaced with a more appropriate projection for the far north
* Bathymetry ocean data improves visualization of arctic region where oceans and seas significantly impact local communities and research
* Northern communities have increased label prominence

Other changes will be listed here as the stylesheet is developed.

# Installation

Installation has been separated into two documents, depending on your goal.

If you want to modify the stylesheet and commit changes to git, see [DEVELOPMENT.md](DEVELOPMENT.md).

For setting up the Arctic Web Map stylesheet on a public server, see [DEPLOYMENT.md](DEPLOYMENT.md).

# Contributing

Contributions to this project are welcome, see [CONTRIBUTING.md](CONTRIBUTING.md) for full details.

# Versioning

Arctic Web Map does not have an active versioning system. Branches are used to designate different variants of the stylesheet, as well as which map servers are on which version.

# Roadmap

The Canadian Arctic branch is intended to provide a general purpose stylesheet for researchers and northern communities. To that end, legibility of a wide variety of data from OpenStreetMap will be the focus.

# Alternatives

There are many open-source stylesheets written for creating OpenStreetMap-based maps using Mapnik, many based on the parent project. Some alternatives are:

* [OSM-Bright](https://github.com/mapbox/osm-bright)
* [XML-based stylesheets](https://trac.openstreetmap.org/browser/subversion/applications/rendering/mapnik)
* [osmfr-cartocss](https://github.com/cquest/osmfr-cartocss)
* [openstreetmap-carto-german](https://github.com/giggls/openstreetmap-carto-de)

# Maintainers

* James Badger [@openfirmware](https://github.com/openfirmware/)
