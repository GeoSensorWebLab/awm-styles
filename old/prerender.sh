#!/bin/bash

RENDER_BIN="/usr/bin/render_list"
RENDER_SOCKET="/var/run/renderd/renderd.sock"
TILES_DIR="/work/tiles/"
MIN_ZOOM="0"
MAX_ZOOM="2"
RENDER_OPTIONS="-a -s $RENDER_SOCKET -n 4 -t $TILES_DIR -z $MIN_ZOOM -Z $MAX_ZOOM"

for style in osm_3571 osm_3572 osm_3573 osm_3574 osm_3575 osm_3576; do
        echo "Pre-render for $style started."
        echo "====="
        /usr/bin/time $RENDER_BIN -m $style $RENDER_OPTIONS
done
