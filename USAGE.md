# Using the Arctic Web Map tiles

The tiles are available online for free as long as the following attribution is used:

```
Map © ArcticConnect, Data © OpenStreetMap Contributors
```

Tiles are PNG images that are compatible with web "slippy-map" libraries. They are served using the standard XYZ url scheme:

```
http://airport.gswlab.ca/awm/{zoom}/{x}/{y}.png
```

Note that the map is in EPSG:3573 projection, so the XYZ scheme will not map to latitude/longitude the same way as regular web maps.

## OpenLayers

[Here are some examples hosted on glitch.com for OpenLayers v4, v5, and v6](https://glitch.com/~arcticmap-demos).

Note that the API for v5 and v6 appear to be identical. Only minor changes with usage of Proj4 are required for the v4 to v5 transition.

## Leaflet

TODO

## ArcGIS Online

If you are a user of [ArcGIS Online](https://www.arcgis.com/home/index.html), you can add Arctic Web Map as a base layer for your maps. Note that due to the projection, the map may not line up with other layers that are in a different spatial reference system.

In your New Map, select "Add", then "Add Layer from Web". Select "A Tile Layer" for the type of data.

```
URL: http://airport.gswlab.ca/awm/{level}/{col}/{row}.png
Title: Arctic Web Map
Credits: Map © ArcticConnect, Data © OpenStreetMap Contributors
```

Once added, you may have to drag the map "down" to see the new layer.
