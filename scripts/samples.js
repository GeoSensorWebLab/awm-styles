/*
 * Generate sample images of various geographic regions at different
 * zoom levels to preview the stylesheet.
 *
 * Before running this script:
 * 1. Use compile.js to create the arcticwebmap.xml file
 * 2. Create symlinks in the repository root directory for `data` and
 *    `symbols` that point to those directories in the `openstreetmap`
 *    directory.
 */

 "use strict";

 let fs            = require("fs");
 let path          = require("path");
 let child_process = require("child_process");

// scale levels are based on the Tile Matrix provided by the Arctic Web 
// Map WMTS (see https://tiles.arcticconnect.ca/mapproxy/demo/ for 
// details). The scale is then visually matched to its apparent scale as
// seen in OpenLayers; it seems the OpenLayers zoom level is one less
// than the WMTS level number.
let fois = [{
  id:          "zoom-5-canada",
  extent:      [-2575371.5, -3433709.7, 2765637.9, -257404.8],
  scale:       8735660.37545,
  description: "Zoom 5 Canada-wide"
}, {
  id:          "zoom-7-yellowknife",
  extent:      [-1470438.9, -3329087.4, -135186.5, -2535011.1],
  scale:       2183915.09386,
  description: "Zoom 7 Yellowknife"
}, {
  id:          "zoom-11-cambridge-bay",
  extent:      [-263988.7, -2335692.4, -180535.4, -2286062.6],
  scale:       136494.693366,
  description: "Zoom 11 Cambridge Bay"
}, {
  id:          "zoom-13-resolute",
  extent:      [140352.8, -1701678.0, 161216.1, -1689270.6],
  scale:       34123.6733416,
  description: "Zoom 13 Resolute"
}, {
  id:          "zoom-15-whitehorse",
  extent:      [-1859456.3, -2647360.2, -1854240.4, -2644258.4],
  scale:       8530.9183354,
  description: "Zoom 15 Whitehorse"
}, {
  id:          "zoom-18-kangiqsujuaq",
  extent:      [1474586.0, -2769319.9, 1475238.0, -2768932.2],
  scale:       1066.36479192,
  description: "Zoom 18 Kangiqsujuaq"
}];

let stylesheet = "arcticwebmap.xml";
let mapnik     = require("mapnik");

mapnik.register_default_fonts();
mapnik.register_system_fonts();
mapnik.register_default_input_plugins();

fois.forEach((foi) => {
  let map = new mapnik.Map(960, 500);
  // We do not use strict mode as not all the fonts for the stylesheet
  // may not be installed, and they are not needed.
  map.loadSync(stylesheet, { strict: false });
  map.zoomToBox(foi.extent);
  // See https://github.com/mapnik/mapnik/wiki/Image-IO for 'format' API
  map.renderFileSync(`samples/${foi.id}.jpg`, {
    format: 'jpeg100'
  });
});
