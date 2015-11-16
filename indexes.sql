/*
  Custom Partial Indexes for Arctic Web Map

  These indexes will give a small performance boost to rendering certain layers
  in Arctic Web Map. They are specifically tailored to the layers in the
  project.mml file; if you are here for your own tile server then you will have
  to generate indexes for the layers you are using instead.

  To use these indexes use psql to import the file. For example, if you have
  your OSM database as `osm` and have local connections allowed in your pg_hba
  file, then try this:

  $ sudo -u postgres psql osm -f indexes.sql

  The indexes will be generated concurrently, so you can still do reads and
  writes on the database while the indexes are building.

  If you want to reindex then you can issue that command:

  $ sudo -u postgres psql osm -c "REINDEX DATABASE osm"

  This will not run concurrently and will lock your database to read-only while
  the reindex is done. This could take many hours depending on your hardware. If
  you want to reindex concurrently then you can delete all the indexes from this
  script and then run this script again.
*/

CREATE INDEX CONCURRENTLY landcover_low_zoom_index ON planet_osm_polygon USING gist (way)
  WHERE (landuse IN ('forest')
  OR "natural" IN ('wood', 'wetland', 'mud', 'sand', 'scree', 'shingle', 'bare_rock'))
  AND building IS NULL;

CREATE INDEX CONCURRENTLY water_areas_index ON planet_osm_polygon USING gist (way)
  WHERE (waterway IN ('dock', 'riverbank', 'canal')
  OR landuse IN ('reservoir', 'basin')
  OR "natural" IN ('water', 'glacier'))
  AND building IS NULL;

CREATE INDEX CONCURRENTLY ferry_routes_index ON planet_osm_line USING gist (way)
  WHERE route = 'ferry';

CREATE INDEX CONCURRENTLY roads_low_zoom_index ON planet_osm_roads USING gist (way)
  WHERE highway IS NOT NULL
  OR (railway IS NOT NULL AND railway != 'preserved'
  AND (service IS NULL OR service NOT IN ('spur', 'siding', 'yard')));

CREATE INDEX CONCURRENTLY admin_low_zoom_index ON planet_osm_roads USING gist (way)
  WHERE boundary = 'administrative'
  AND admin_level IN ('0', '1', '2', '3', '4');

CREATE INDEX CONCURRENTLY nature_reserve_boundaries_index ON planet_osm_polygon USING gist (way)
  WHERE (boundary = 'national_park' OR leisure = 'nature_reserve')
  AND building IS NULL;

CREATE INDEX CONCURRENTLY placenames_large_index ON planet_osm_polygon USING gist (way)
  WHERE boundary = 'administrative'
  AND admin_level IN ('2', '4')
  AND name IS NOT NULL;

CREATE INDEX CONCURRENTLY placenames_capital_index ON planet_osm_point USING gist (way)
  WHERE place IN ('city', 'town')
  AND capital IN ('yes', '4')
  AND name IS NOT NULL;

CREATE INDEX CONCURRENTLY placenames_medium_index ON planet_osm_point USING gist (way)
  WHERE place IN ('city', 'town')
  AND (capital IS NULL OR capital NOT IN ('yes', '4'))
  AND name IS NOT NULL;

CREATE INDEX CONCURRENTLY placenames_small_index ON planet_osm_point USING gist (way)
  WHERE place IN ('suburb', 'village', 'hamlet', 'neighbourhood', 'locality', 'isolated_dwelling', 'farm')
  AND name IS NOT NULL;

CREATE INDEX CONCURRENTLY text_poly_low_zoom_index ON planet_osm_polygon USING gist (way)
  WHERE (landuse IN ('forest')
  OR "natural" IN ('wood', 'glacier', 'sand', 'scree', 'shingle', 'bare_rock')
  OR "place" IN ('island')
  OR boundary IN ('national_park')
  OR leisure IN ('nature_reserve'))
  AND building IS NULL
  AND name IS NOT NULL;
