#!/bin/sh
set -e -u

UNZIP_OPTS=-qqun

# create and populate data dir

mkdir -p data/
mkdir -p data/world_boundaries
mkdir -p data/simplified-land-polygons-complete-3857
mkdir -p data/ne_110m_admin_0_boundary_lines_land
mkdir -p data/ne_10m_populated_places
mkdir -p data/land-polygons-split-3857
mkdir -p data/ne_10m_geographic_lines

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

# ne_10m_populated_places
PACK="ne_10m_populated_places"
echo "dowloading $PACK..."
curl -z data/$PACK.zip -L -o data/$PACK.zip http://www.naturalearthdata.com/http//www.naturalearthdata.com/download/10m/cultural/$PACK.zip
echo "expanding $PACK..."
unzip $UNZIP_OPTS data/$PACK.zip \
  $PACK.shp \
  $PACK.shx \
  $PACK.prj \
  $PACK.dbf \
  $PACK.cpg \
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

#process populated places
PACK="ne_10m_populated_places"
echo "processing $PACK..."
rm -f data/$PACK/${PACK}_fixed.*
ogr2ogr --config SHAPE_ENCODING UTF8 data/$PACK/${PACK}_fixed.shp data/$PACK/$PACK.shp

#index
echo "indexing shapefiles"

shapeindex --shape_files \
data/simplified-land-polygons-complete-3857/simplified_land_polygons.shp \
data/land-polygons-split-3857/land_polygons.shp \
data/ne_10m_populated_places/ne_10m_populated_places_fixed.shp \
data/ne_110m_admin_0_boundary_lines_land/ne_110m_admin_0_boundary_lines_land.shp \
data/ne_10m_geographic_lines/ne_10m_geographic_lines.shp


#clean up
echo "cleaning up..."
rm data/ne_10m_populated_places/ne_10m_populated_places.*

echo "...done!"
