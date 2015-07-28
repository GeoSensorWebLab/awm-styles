# Release Notes

A list of changes made to the stylesheet.

### 2015-07-28

* Forked from v2.24.0 of [gravitystorm/openstreetmap-carto](https://github.com/gravitystorm/openstreetmap-carto)
* Includes custom bathymetry layers from Natural Earth Data shapefile
* Includes geographic lines from Natural Earth Data shapefile
* Includes topographic elevation data from CanVec 10.0
* Displays data in EPSG:3571 – EPSG:3576 projections (EPSG:3573 for testing)
* Updates shapefile retrieval script
* Shapefiles are clipped to region of interest (45˚ – 90˚ North)
* Uses ERB for generating TileMill project files with dynamic database details
