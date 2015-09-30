#!/bin/bash
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

clip_shape() {
  TMPFILE="/tmp/$(basename $1 .shp).$$.clip.shp"
  ogr2ogr -t_srs $SRS -clipdst -180 0 180 90 "$TMPFILE" "$1"
  echo $TMPFILE
}

segment_shape() {
  TMPFILE="/tmp/$(basename $1 .shp).$$.segment.shp"
  ogr2ogr -segmentize 0.5 "$TMPFILE" "$1"
  echo $TMPFILE
}

save_shape() {
  edited_base=$(basename $1 .shp)
  original_dir=$2
  original_base=$(basename $3 .shp)
  for file in /tmp/${edited_base}*; do
    file_base=$(basename $file)
    extension="${file_base##*.}"
    cp $file data/$original_dir/proc_${original_base}.$extension
  done
}

process_pack() {
  rm -f data/$1/proc_*

  if [ -z ${2+x} ]; then
    # Process all shapefiles
    for shp in data/$1/*.shp; do
      echo "Processing ${shp}…"
      clipped=$(clip_shape $shp)
      segmented=$(segment_shape $clipped)
      save_shape $segmented $1 $shp
    done
  else
    # Process only shapefile in $2
    echo "Processing data/$1/${2}…"
    clipped=$(clip_shape data/$1/$2)
    segmented=$(segment_shape $clipped)
    save_shape $segmented $1 $2
  fi
}

cleanup() {
  rm -f /tmp/*.clip.*
  rm -f /tmp/*.segment.*
}

cleanup

process_pack "land-polygons-split-3857"
process_pack "ne_10m_bathymetry_all"
process_pack "ne_10m_geographic_lines"
process_pack "ne_10m_graticules_15"
process_pack "ne_10m_lakes"
process_pack "ne_10m_land"
process_pack "ne_110m_admin_0_boundary_lines_land"
process_pack "world_boundaries" "builtup_area.shp"

cleanup

# Index Shapefiles
echo "indexing shapefiles"

shapeindex --shape_files \
  data/land-polygons-split-3857/proc_land_polygons.shp \
  data/ne_10m_bathymetry_all/proc_*.shp \
  data/ne_10m_geographic_lines/proc_*.shp \
  data/ne_10m_graticules_15/proc_*.shp \
  data/ne_10m_lakes/proc_*.shp \
  data/ne_10m_land/proc_ne_10m_land.shp \
  data/ne_110m_admin_0_boundary_lines_land/proc_ne_110m_admin_0_boundary_lines_land.shp \
  data/world_boundaries/proc_*.shp

echo "...done!"
