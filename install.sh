#!/bin/bash

for file in *.xml; do
	/bin/cp $file /etc/mapnik-osm-carto-data/.
done
