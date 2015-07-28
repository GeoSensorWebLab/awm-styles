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

### v2.25.0

* Render airport symbols and names until z13
* refactor and fix amenity-points
* remove obsolete natural=land query
* Slightly darken school text colour
* Merge amenity-symbols into amenity-points
* Add new marsh/wetland icon
* Add building IS NULL clause to low zoom landcover queries
* Minor change in width and opacity themepark boundaries
* Change boundary nature reserve / national park areas
* fix grave yard naming
* Improve SQL layout
* Change rendering country/state labels
* Split landcover and text-poly in high zoom (>= 10) and low zoom (< z10) layer
* Change rendering theme park boundaries
* Improve marsh/wetland/mud rendering

### v2.26.0

* changing color for air transport symbols and icons to violet
* adding new svg icons for air transport
* render mud from z10
* Refactor buildings code
* Stops rendering supermarkets in a crazy pink
* Moves the rendering of train station areas to landcover
* Removes outline differences based on a distinction that no one fully understands
* Correct SQL error
* tourism=attraction - partially restore old label, stop rendering areas
* stop attempts to display major buildings on z10 z11, special display across all levels
* Add WHERE clause to buildings-major layer
* add rendering for natural=saddle
* fix text-dy for highway=traffic_signals
* Don't let cities hide country and state names
* removed deprecated man_made=power_wind query
* Make buildings more gray
* Make buildings a bit darker on low zoom levels

### v2.27.0

* Added golf_course-color to leisure=miniature_golf-areas
* Added symbol to minigolf-courses and if available its name also shows up (both at zoom>=17)
* Added golf-symbol to areas and points with leisure=golf_course
* Adding water park styles and icon
* prison area with grey hatching
* glacier labels changes
* Render amenity=food_court
* Drop rendering military=barracks
* Drop rendering for natural=desert
* Drop rendering for landuse=field
* moved hospital and pharmacy icons to SVG
* move recycling icon to SVG
* Increase text-spacing for paths
* Don't render waterway names in culverts
* move religion related icons to SVG
* change playground icon to SVG
* changed ATM and bank icons to SVG
* render amenity=place_of_worship as a primary tag
* Add transparency to halo placename labels
* fix inner bridge casing zlevel mismatch
* move bakery icon to SVG
* move camping icon to SVG
* add rendering for amenity=doctors
* patterned rendering of bare_rock and scree, less strong yellow for sand
* change cinema icon to SVG
* transparent symbol for private recycling and playgrounds
* Remove no longer necessary ::leisure attachment
* fix dy for leisure=water_park

### v2.28.0

* render wadis like rivers and canals
* disable line-clip to avoid glitches
* Manually add max/min zoom to layers
* Drop attachments that are no longer necessary
* Special rendering for intermittent waterways
* add rendering for amenity=dentist
* Add opacity to highway=proposed for less prominent rendering
* Improve rendering of construction=residential on zoom 13
* add rendering for amenity=townhall
* more red in buildings hue, darken building outline
* Updated yaml2mml.py to no longer produce trailing whitespaces
* move icons to SVG
* Remove natural=lake
* add glacier and bare ground landcovers to text-poly-low-zoom
