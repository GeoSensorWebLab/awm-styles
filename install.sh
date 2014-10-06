#!/bin/bash

for file in 3571 3572 3573 3574 3575 3576; do
	/bin/cp osm_$file.xml /etc/mapnik-osm-carto-data/.
done
