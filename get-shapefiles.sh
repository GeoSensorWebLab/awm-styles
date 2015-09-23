#!/bin/sh
set -e -u

UNZIP_OPTS=-qqunj

download_pack() {
  filename=$(basename $1)
  echo "Downloading ${filename}…"
  curl -z "data/$filename" -L -o "data/$filename" "$1"
}

expand_pack() {
  echo "expanding $1…"

  if [ ${1: -4} == ".tgz" ]; then
    tar xzf data/$1 -C data/
  elif [ ${1: -4} == ".zip" ]; then
    base=$(basename $1 .zip)
    unzip $UNZIP_OPTS data/$1 -d data/$base
  fi
}

# create and populate data dir

mkdir -p data/
mkdir -p data/world_boundaries
mkdir -p data/ne_110m_admin_0_boundary_lines_land
mkdir -p data/ne_10m_land
mkdir -p data/land-polygons-split-3857
mkdir -p data/ne_10m_geographic_lines
mkdir -p data/ne_10m_graticules_15
mkdir -p data/ne_10m_bathymetry_all
mkdir -p data/ne_10m_lakes

# Download Packs

## world_boundaries
download_pack "http://planet.openstreetmap.org/historical-shapefiles/world_boundaries-spherical.tgz"
expand_pack "world_boundaries-spherical.tgz"

## ne_10m_land
download_pack "http://www.naturalearthdata.com/http//www.naturalearthdata.com/download/10m/physical/ne_10m_land.zip"
expand_pack "ne_10m_land.zip"

## ne_110m_admin_0_boundary_lines_land
download_pack "http://www.naturalearthdata.com/http//www.naturalearthdata.com/download/110m/cultural/ne_110m_admin_0_boundary_lines_land.zip"
expand_pack "ne_110m_admin_0_boundary_lines_land.zip"

## land-polygons-split-3857
download_pack "http://data.openstreetmapdata.com/land-polygons-split-3857.zip"
expand_pack "land-polygons-split-3857.zip"

## ne_10m_geographic_lines
download_pack "http://www.naturalearthdata.com/http//www.naturalearthdata.com/download/10m/physical/ne_10m_geographic_lines.zip"
expand_pack "ne_10m_geographic_lines.zip"

## ne_10m_graticules_15
download_pack "http://www.naturalearthdata.com/http//www.naturalearthdata.com/download/10m/physical/ne_10m_graticules_15.zip"
expand_pack "ne_10m_graticules_15.zip"

## ne_10m_bathymetry_all
download_pack "http://www.naturalearthdata.com/http//www.naturalearthdata.com/download/10m/physical/ne_10m_bathymetry_all.zip"
expand_pack "ne_10m_bathymetry_all.zip"

## ne_10m_lakes
download_pack "http://www.naturalearthdata.com/http//www.naturalearthdata.com/download/10m/physical/ne_10m_lakes.zip"
expand_pack "ne_10m_lakes.zip"

# Clip shapefiles to bounding box
echo "clipping & segmenting shapefiles"
SRS="EPSG:4326"

PACK="ne_10m_land"
rm -f data/$PACK/proc_*
for shp in data/$PACK/*.shp; do
  base=$(basename $shp .shp)
  echo "Processing ${shp}…"
  ogr2ogr -t_srs $SRS -clipdst -180 0 180 90 "data/$PACK/tmp_$base.shp" "$shp"
  ogr2ogr -segmentize 0.5 "data/$PACK/proc_$base.shp" "data/$PACK/tmp_$base.shp"
  rm -f data/$PACK/tmp_${base}*
done

PACK="ne_110m_admin_0_boundary_lines_land"
rm -f data/$PACK/proc_*
for shp in data/$PACK/*.shp; do
  base=$(basename $shp .shp)
  echo "Processing ${shp}…"
  ogr2ogr -t_srs $SRS -clipdst -180 0 180 90 "data/$PACK/tmp_$base.shp" "$shp"
  ogr2ogr -segmentize 0.5 "data/$PACK/proc_$base.shp" "data/$PACK/tmp_$base.shp"
  rm -f data/$PACK/tmp_${base}*
done

PACK="ne_10m_bathymetry_all"
rm -f data/$PACK/proc_*
rm -f data/$PACK/tmp_*
for shp in data/$PACK/*.shp; do
  base=$(basename $shp .shp)
  echo "Processing ${shp}…"
  ogr2ogr -clipsrc -180 45 180 90 "data/$PACK/tmp_$base.shp" "$shp"
  ogr2ogr -segmentize 0.5 "data/$PACK/proc_$base.shp" "data/$PACK/tmp_$base.shp"
done
rm -f data/$PACK/tmp_*

PACK="ne_10m_lakes"
rm -f data/$PACK/proc_*
rm -f data/$PACK/tmp_*
for shp in data/$PACK/*.shp; do
  base=$(basename $shp .shp)
  echo "Processing ${shp}…"
  ogr2ogr -clipsrc -180 45 180 90 "data/$PACK/tmp_$base.shp" "$shp"
  ogr2ogr -segmentize 0.5 "data/$PACK/proc_$base.shp" "data/$PACK/tmp_$base.shp"
done
rm -f data/$PACK/tmp_*

# Index Shapefiles
echo "indexing shapefiles"

shapeindex --shape_files \
  data/land-polygons-split-3857/land_polygons.shp \
  data/ne_10m_land/proc_ne_10m_land.shp \
  data/ne_110m_admin_0_boundary_lines_land/proc_ne_110m_admin_0_boundary_lines_land.shp \
  data/ne_10m_geographic_lines/ne_10m_geographic_lines.shp \
  data/ne_10m_geographic_lines/ne_10m_graticules_15.shp \
  data/ne_10m_bathymetry_all/*.shp \
  data/ne_10m_lakes/*.shp

echo "...done!"
