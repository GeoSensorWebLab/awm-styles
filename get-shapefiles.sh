#!/bin/sh
set -e -u

UNZIP_OPTS=-qqun

# create and populate data dir

mkdir -p data/
mkdir -p data/world_boundaries
mkdir -p data/simplified-land-polygons-complete-3857
mkdir -p data/ne_110m_admin_0_boundary_lines_land
mkdir -p data/ne_10m_land
mkdir -p data/land-polygons-split-3857
mkdir -p data/ne_10m_geographic_lines
mkdir -p data/ne_10m_graticules_15
mkdir -p data/ne_10m_bathymetry_all

# world_boundaries
PACK="world_boundaries"
echo "dowloading $PACK..."
curl -z "data/$PACK-spherical.tgz" -L -o "data/$PACK-spherical.tgz" "http://planet.openstreetmap.org/historical-shapefiles/$PACK-spherical.tgz"
echo "expanding $PACK..."
tar -xzf data/$PACK-spherical.tgz -C data/

# simplified-land-polygons-complete-3857
PACK="simplified-land-polygons-complete-3857"
echo "downloading $PACK..."
curl -z "data/$PACK.zip" -L -o "data/$PACK.zip" "http://data.openstreetmapdata.com/$PACK.zip"
echo "$PACK..."
unzip $UNZIP_OPTS data/$PACK.zip \
  $PACK/simplified_land_polygons.shp \
  $PACK/simplified_land_polygons.shx \
  $PACK/simplified_land_polygons.prj \
  $PACK/simplified_land_polygons.dbf \
  $PACK/simplified_land_polygons.cpg \
  -d data/

# ne_10m_land
PACK="ne_10m_land"
echo "downloading $PACK..."
curl -z "data/$PACK.zip" -L -o "data/$PACK.zip" "http://www.naturalearthdata.com/http//www.naturalearthdata.com/download/10m/physical/${PACK}.zip"
echo "$PACK..."
unzip $UNZIP_OPTS data/$PACK.zip \
  -d data/$PACK

# ne_110m_admin_0_boundary_lines_land
PACK="ne_110m_admin_0_boundary_lines_land"
echo "dowloading $PACK..."
curl -z data/$PACK.zip -L -o data/$PACK.zip http://www.naturalearthdata.com/http//www.naturalearthdata.com/download/110m/cultural/$PACK.zip
echo "expanding $PACK..."
unzip $UNZIP_OPTS data/$PACK.zip \
  $PACK.shp \
  $PACK.shx \
  $PACK.prj \
  $PACK.dbf \
  -d data/$PACK/

# land-polygons-split-3857
PACK="land-polygons-split-3857"
echo "dowloading $PACK..."
curl -z "data/$PACK.zip" -L -o "data/$PACK.zip" "http://data.openstreetmapdata.com/$PACK.zip"
echo "expanding $PACK..."
unzip $UNZIP_OPTS data/$PACK.zip \
  $PACK/land_polygons.shp \
  $PACK/land_polygons.shx \
  $PACK/land_polygons.prj \
  $PACK/land_polygons.dbf \
  $PACK/land_polygons.cpg \
  -d data/

# ne_10m_geographic_lines
PACK="ne_10m_geographic_lines"
echo "dowloading $PACK..."
curl -z "data/$PACK.zip" -L -o "data/$PACK.zip" "http://www.naturalearthdata.com/http//www.naturalearthdata.com/download/10m/physical/$PACK.zip"
echo "expanding $PACK..."
unzip $UNZIP_OPTS data/$PACK.zip \
  $PACK.shp \
  $PACK.shx \
  $PACK.prj \
  $PACK.dbf \
  -d data/$PACK/

# ne_10m_graticules_15
PACK="ne_10m_graticules_15"
echo "dowloading $PACK..."
curl -z "data/$PACK.zip" -L -o "data/$PACK.zip" "http://www.naturalearthdata.com/http//www.naturalearthdata.com/download/10m/physical/$PACK.zip"
echo "expanding $PACK..."
unzip $UNZIP_OPTS data/$PACK.zip \
  $PACK.shp \
  $PACK.shx \
  $PACK.prj \
  $PACK.dbf \
  -d data/$PACK/

# ne_10m_bathymetry_all
PACK="ne_10m_bathymetry_all"
echo "dowloading $PACK..."
curl -z "data/$PACK.zip" -L -o "data/$PACK.zip" "http://www.naturalearthdata.com/http//www.naturalearthdata.com/download/10m/physical/$PACK.zip"
echo "expanding $PACK..."
unzip $UNZIP_OPTS data/$PACK.zip \
  -d data/

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

rm -f data/ne_10m_bathymetry_all/proc_*
rm -f data/ne_10m_bathymetry_all/tmp_*
for shp in data/ne_10m_bathymetry_all/*.shp; do
  base=$(basename $shp .shp)
  echo "Processing ${shp}…"
  ogr2ogr -clipsrc -180 45 180 90 "data/ne_10m_bathymetry_all/tmp_$base.shp" "$shp"
  ogr2ogr -segmentize 0.5 "data/ne_10m_bathymetry_all/proc_$base.shp" "data/ne_10m_bathymetry_all/tmp_$base.shp"
done
rm -f data/ne_10m_bathymetry_all/tmp_*

# index
echo "indexing shapefiles"

shapeindex --shape_files \
data/simplified-land-polygons-complete-3857/simplified_land_polygons.shp \
data/land-polygons-split-3857/land_polygons.shp \
data/ne_10m_land/proc_ne_10m_land.shp \
data/ne_110m_admin_0_boundary_lines_land/ne_110m_admin_0_boundary_lines_land.shp \
data/ne_10m_geographic_lines/ne_10m_geographic_lines.shp \
data/ne_10m_geographic_lines/ne_10m_graticules_15.shp \
data/ne_10m_bathymetry_all/*.shp

echo "...done!"
