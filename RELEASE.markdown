# Release Notes

A list of changes made to the stylesheet.

### 2017-07-07

* Switch DB to use 4326 projection
* Merge changes from v2.32.0
    * Antarctica shapefile not used due to bounding box/projection
    * Icon and YAML for shop=computer
    * Icon and YAML for shop=seafood and shop=fishmonger
    * Icon and YAML for amenity=ice_cream and shop=ice_cream
    * New icons for post office and post box
    * Icon and YAML for shop=motorcycles
    * change symbol for railway=subway_entrance
    * move emergency phone to SVG
    * move telephone icon to SVG
    * different rendering for aerialway=goods
    * stop displaying really small zoos and theme parks
    * YAML for shop=wine
    * rework display of railway=tram
    * Modify z12
    * Note mapnik3 support is not yet here
    * start displaying minor rail from z13
    * Avoid auto text-vertical-alignment for admin polygon labels
    * Set text-vertical-alignment: middle for linear features
    * unify colors and new patterns for some green landcovers
    * taking out landuse=conservation change
    * Change color of amenity=bank and amenity=atm to @amenity-brown
    * render educational areas as distinct later
    * Use layer instead of z_order
    * stop displaying proposed roads
    * make variable name less misleading
    * render service rail under normal rail
    * Icon and YAML for amenity=motorcycle_parking
    * make turning circles on highway=track smaller
    * make railway=tram with service tags less visible
    * use @bridge-casing also for railways
    * render minor tram lines from z15
    * render residential and living_street from z13, not from z10
    * render highway=unclassified from z11, not from z10
    * start displaying buildings from z13, not from z12
    * start displaying amenity=place_of_worship from z13, not from z10
    * Icon and YAML for highway=elevator
    * introduce variable for oneway-arrow-color
    * introduce variable for junction text color
    * Icon and YAML for shop=variety_store
    * tweak adjusted zoom levels slightly
    * Order place layers by place type
    * make highway=residential at z12 thinner
    * fixed display of residential and unclassified roads at z13
    * stop hiding the hospital between the education stuff
    * New icons and YAML for amenity=post_office and amenity=post_box
    * inherit fill for living street and pedestrian
* Merge changes from v2.33.0
    * less wide steps
    * move power areas closer to industrial areas
    * tweak highway=raceway width
    * YAML and icon for shop=musical_instrument
    * Use a random symbology for forests and move grassland colour to grass
    * new pattern for forests
    * restore old scrub
    * display highway=path like highway=footway
    * drop case that was redefining cycleways
    * set-up infrastructure for rendering unpaved surface in SQL
    * render surface for footways and cycleways
* Merge changes from v2.34.0
    * New icon for landuse=quarry
    * Icon and YAML for amenity=veterinary
    * Stop displaying really small hatched areas 
    * render huge military areas earlier
    * merge definitions of grass landcovers
    * show man_made=bridge
    * Icon and YAML for amenity=community_centre
    * Move car sharing to zoom 18
    * Move car rental to zoom level 17
    * change colour of admin boundaries to be consistent on z1-3
    * detect also paved and lack of surface info
    * display missing surface specially and display unpaved footways
    * better labels for bridges
* Merge changes from v2.35.0
    * move ford to SVG
    * make major power lines less prominent
    * adding sources and double resolution versions for bare ground and wetland patterns
    * changed file names for hr renderings
    * fix text-dy for nightclub
    * remove halo from nightclub icon 
    * introduce variable for shop names
    * more visible color of lighthouse labels 
    * add shop=winery to list of ignored shop values
    * stop rendering landuse=conservation 
* Merge changes from v2.36.0
    * make railway=rail and roads more distinguishable. increase rail
    * visibility
    * New road style - rework road colours, road widths and display of
    * railway=rail
    * rework width for service roads
    * refactor setting casings
    * reduce casing for secondaries at z14 and z13
    * fix bug in script producing a wrong comment
    * fix tertiary construction
    * allow setting motorway, trunk width on z8
    * motorway, trunk, primary - width 1.0 on z8
    * glow for secondary on z9 and z10 and for tertiary on z11
    * z11 is now again without casings and using low zoom style
    * YAML for shop=car_repair in amenity-brown
    * narrower trunk on z7
    * less wide railway on z7
    * fix inconsistent widths on z10 and z11
    * add missing glow for decondaries at z11
    * handle cases like min_h = 280; max_h = 460
    * tweak and extend halos to z10 tertiary and z12 unclassified
    * show red dashes for steps
    * rework private access width
    * make access=private/no visible on red roads
    * rework also destination marks
    * remove duplicated and dead code
    * stronger casing for minor roads at z14
    * refactoring of minor details
    * proper definition of highway=road
    * drop unneded duplicates of z limits
    * fix name collision
    * unify code style
    * introduce new variable for unimportant roads
    * Icon and YAML for amenity=fountain
    * stop importing unused modules in the helper script
    * better documentation of development dependencies
    * stop using numpy in the helper script
    * Restore numpy in the helper script
    * Refact road colour generation script
    * Order placenames by population-based score and substitute NE usage on
    * low zoom levels
    * Tune smaller towns in rural areas
    * Render name for power=plant
    * Prioritize power over landuse in coalesce statement
    * Icon and YAML for amenity=car_wash
    * Icon and YAML for shop=bag and getting rid of shop=bags
    * Adding line breaks in YAML to make it easier to maintain
    * render crosses
    * named crosses are no longer displayed at z14
    * Add text about creating issues and PRs
    * Markdown, link, and formatting fixes
    * Update roadmap to reflect where we are
    * Add reference to Kosmtik, and rework yaml to json section
    * Dependency rewording
    * Do not sort placenames-medium by category (is yet done in
    * placenames.mss)
    * standard halo also for shops
    * make generate_road_colours executable
    * variable instead of repeated hardcoding
    * Don't assume sh is bash for create_shield
    * remove variable path-fill as it is no longer used
    * rework oneway arrows
    * Adding documentation for quarry pattern
    * Make roads wider at zoom 18 and 19
    * Changing water features color to already defined water-text variable
    * Update CONTRIBUTING.md
    * Icon and YAML for shop=outdoor
    * Move rendering of tram labels later
    * refactor yaml2mml.py
    * special priority for railway=station and railway=subway_entrance
    * Add missing comma
    * rework road shields
    * smaller font, black text, colour generation script
    * Reworking station labels and code cleaning
    * reduce repetitions in  definitions of labels
    * style improvements, bigger size versions for z16, z18
    * increase shield spacing
    * refactor style definitions
    * Removing deprecated shops
    * Remove car_sharing rendering
    * Simplify WHERE clause of text layers
    * tweak crosses to not appear earlier than place_of_worship
    * make residential refs less prominent
    * Move taxi to z17
    * Significantly increase minimum zoom level for bridge names
    * change colour of station labels
    * move tree layer below placename layer
    * fix state name labels are displayed up to z19 - caused by potential
    * carto bug
    * thinner and solid lines for glacier outlines at low zooms for improved
    * readability
    * removing now unused glaciers pattern image
    * Render marina labels like other landuse labels, including font size

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
