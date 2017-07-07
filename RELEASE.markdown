# Release Notes

A list of changes made to the stylesheet.

### 2015-12-16

* Reproject shapefiles into EPSG:3573
* Modify minzoom for water layers
* Use minzoom on contour layers
* Remove limit on 10km bathymetry layer
* Replace shapefile script
* Remove unused builtup areas shapefile
* Remove hard-coded directories from setup script
* Add partial indexes file
* Add custom prerendering script

### 2015-09-22

* Use processed shapefiles in stylesheet

### 2015-07-28

* Forked from v2.24.0 of [gravitystorm/openstreetmap-carto](https://github.com/gravitystorm/openstreetmap-carto)
* Includes custom bathymetry layers from Natural Earth Data shapefile
* Includes geographic lines from Natural Earth Data shapefile
* Includes topographic elevation data from CanVec 10.0
* Displays data in EPSG:3571 – EPSG:3576 projections (EPSG:3573 for testing)
* Updates shapefile retrieval script
* Shapefiles are clipped to region of interest (45˚ – 90˚ North)
* Uses ERB for generating TileMill project files with dynamic database details
* Merge tags up to v2.31.0 from upstream
* Show major lakes at zoom levels 4 and 5 using Natural Earth data
* Clip shapefiles to above 45˚ N
* Display airport names at higher zoom levels
* Re-enable prominence for northern communities

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

### v2.29.0

* Make living street casing darker to increase contrast
* Improve widths aeroway
* Make halos transparent
* move icons to SVG
* Don't render place=town on z16 and higher, and place=suburb and place=village on z17 and higher
* Render place=hamlet, place=locality, place=neighbourhood, place=isolated_dwelling, and place=farm from z15 rather than from z14
* Render place=town black rather than gray
* Make font sizes more consistent by increasing font size for place=town on z12 and z13, for place=suburb on z16, and for place=village on z14 and z16
* Treat capital=4 like capital=yes
* Make text-wrap consistent
* Use French-style tree rendering
* Switch from ST_Buffer to rendering circles
* Remove blur from trees
* Make tree-rows more narrow on z19/z20
* Restore railways on z12
* Restore roads and aeroways on z10 and z11
* Increase minimum carto version
* Clean up low-zoom road definitions
* fix aerialway zoom regression
* Clean up SQL involving access
* Slightly lighten colour of house names and numbers
* correct minzoom value for amenity_points layers
* Render paths under construction more narrow
* Move casing and background of path tunnels to correct attachment
* change cliff line pattern images
* removed duplicate text-placement
* Improve construction name zoom levels
* Always render road area names from z17 independent of size
* add rendering for amenity=nightclub
* Add back missing line-opacity for paths
* Fix color text kindergarten
* Match label colors to icons
* Add missing text-placement and marker-clip tags
* Reformat admin_level SQL
* Darken label for peak and saddle
* Resolve bugs related to COALESCE problems
* Prevent mismatch between icons and labels
* Use a null check for shop in where clauses
* use colour variables for often used POI colours
* add rendering for amenity=car_rental
* Refactor water-features
* Render arrows for implied “oneway” on roundabouts
* Render intermittend rivers with dashed line also on low zoom levels
* improve rendering of viewpoint+peak (display peak)
* fix dy for golf labels
* restore cave entrance icon
* add icon for shop=books

### v2.30.0

* Add turning circles for tracks
* Add rendering for bicycle_parking
* Add labels for bicycle parking
* unify styles for parking and bicycle parking
* switch to haloless icon
* Add label for tourism=viewpoint
* Add transparency to halo for water-features
* Make weir, dam, and lock_gate slightly larger on z>18
* Move water labels to water.mss and use way_pixels
* Move @scrub to green things
* Allow icons to overlap trees
* Add label to cliff and embankment
* Fix SQL for rail service/yard
* Don't exclude supermarket and station from building name rendering
* Do not render island/islet name when way_pixels is big
* Repair island labels on low zoom levels
* Add icon for hunting stand
* move icons to SVG
* add icon for shop=shoes
* unify label styling for various hotel-like objects
* remove rendering on areas for natural=peak, volcano, saddle, cave_entrance
* Add nature reserve text to lowzoom layer
* really remove rendering of natural=lake
* Refactor treatment of “ele” key
* Order by elevation
* Treat MML files as binary
* add icons for popular shop types alcohol, electronics, furniture, gift, jewelry/jewellery, mobile_phone and optician
* make clothes shop icon more distinct
* Render greenhouse_horticulture as farmland
* Add icon for amenity=bench and amenity=waste_basket
* Move link trimming to outer select
* Add labels to various objects
* Add missing font size for bank
* wetland rendering differentiated by wetland type
* Render cutline as thinner line
* add rendering for historic=monument
* reuse symbol of DIY shop for hardware shop

### v2.31.0

* move icons to SVG
* Render tourism=zoo like tourism=theme_park
* Drop lower zoomlevel for zoo and theme park to z10
* stop rendering railway=rail on z6
* Adjust text-dy on tourism housing
* Refactor way_area conditionals
* Add name IS NOT NULL conditions to text layers
* Order placenames to place lower levels first, then by area
* add rendering for amenity=taxi
* Move recycling icon to z17
* Add zoom to citywalls layer
* Set min-zoom on text-line
* Add name IS NOT NULL to placename layers
* Remove castle_walls
* model aerialways with dashed lines
* Add line-clip to aerialway dashes
