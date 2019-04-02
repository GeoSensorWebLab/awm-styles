# Production Deployment Instructions

This document will cover how to deploy the Arctic Web Map stylesheet to a mod_tile/Mapnik tile server. For instructions on modifying the stylesheet, see [DEVELOPMENT.md](DEVELOPMENT.md).

## Manual Deployment

These are the instructions for manually deploying this map stylesheet to a server running Ubuntu Server 18.04 LTS. These are mostly based on the instructions from [Switch2OSM][].

See the next section for info on deploying via Chef.

[Switch2OSM]: https://switch2osm.org/manually-building-a-tile-server-18-04-lts/

### Deploy to Server

Use git to clone the repository and branch to the server:

```
$ git clone https://github.com/GeoSensorWebLab/awm-styles -b arctic-map-2019
```

Or download an archive from [GitHub](https://github.com/GeoSensorWebLab/awm-styles).

### Install Node

The project requires Node to compile and process the geo-data files. Node v10 is recommended.

### Download Geo Files

This map uses vector and raster datasets that are kept on the disk instead of in the PostGIS database. A script has been included in this repo (`scripts/get-datafiles.js`) to download these files, extract them, and convert them for the map projection.

GDAL must be installed and `ogr2ogr`, `gdalwarp`, and `gdal_translate` must be available on your `$PATH`.

Use node to launch the script. It will try to download and process the files in parallel, and the script output will look a bit messy.

```
$ node scripts/get-datafiles.js
```

This will take a few minutes to process.

### Compiling the Project File

The project file for Arctic Web Map style is modified from the project file from openstreetmap-carto. This is necessary for these reasons:

* Output projection for the map under the tiles is now EPSG:3573
* Input projection from PostGIS is EPSG:3573 **instead** of EPSG:3857
* The name of the layer has changed
* Additional layers/stylesheets have to be added

Making these changes by editing the file manually is a problem because it is easy to make mistakes. To solve this, a script is used to copy the openstreetmap-carto project file, apply a set of changes, and dump the new file to disk.

The script is called `compile.js` and is ran via Node.js. It uses the "local config" feature of Kosmtik to apply a set of changes.

### Deploy the Project

The output `arcticwebmap.xml` file, the `openstreetmap-carto/data` directory, and the `openstreetmap-carto/symbols` directory should be placed in the same directory, like so:

```
arcticwebmap-style/
  arcticwebmap.xml
  data/
    awm/
      ...files
  symbols/
```

This directory can then be moved anywhere on the filesystem where mod_tile has read access, usually through the `www-data` user.

### Install Fonts

Please read the [openstreetmap-carto fonts guide][fonts guide] for instructions.

[fonts guide]: https://github.com/gravitystorm/openstreetmap-carto/blob/master/INSTALL.md#fonts

### PostgreSQL and PostGIS

This stylesheet assumes OpenStreetMap data has been loaded into a PostGIS-enabled database using [osm2pgsql][]. Install Postgres and PostGIS:

```
$ echo "deb http://apt.postgresql.org/pub/repos/apt/ bionic-pgdg main" | sudo tee "/etc/apt/sources.list.d/pgdg.list"
$ wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -
$ sudo apt update
$ sudo apt install postgresql-11 postgresql-client-11 postgresql-server-dev-11
```

Next install GDAL:

```
$ sudo apt install gdal-bin gdal-data libgdal-dev libgdal20
```

Then install PostGIS:

```
$ sudo apt install postgresql-11-postgis-2.5 postgresql-11-postgis-2.5-scripts
```

This point is a good time to move the PostgreSQL data directory from its default location of `/var/lib/postgresql` to a mounted volume, if you are using one. A volume with high IOPS (i.e. SSD-backed) is highly recommended.

For the PostgreSQL configuration, please check the defaults used in the [maps_server cookbook][maps_server defaults] for the "import" section.

Create a user and database for OSM:

```
$ sudo -u postgres createuser osm
$ sudo -u postgres createdb -O osm osm
$ sudo -u postgres psql osm -c "CREATE EXTENSION hstore;" -c "CREATE EXTENSION postgis;"
```

Set up your pg_hba to allow access to the `osm` user from the system user you are using for rendering, probably `www-data`. Restart Postgres to pick up the changes.

[maps_server defaults]: https://github.com/openfirmware/maps_server/blob/master/attributes/default.rb
[osm2pgsql]: https://github.com/openstreetmap/osm2pgsql

### Loading OSM Data

OSM data can be downloaded from GeoFabrik. I recommend the extracts for Canada, Alaska, and Greenland and then using osmosis to merge the `pbf` files into one. This requires approximately 15 GB of database space **after** import; double that for temporary files during import.

Install `osm2pgsql`, the tool to import the data:

```
$ sudo apt install osm2pgsql
```

Then import:

```
$ sudo -u www-data osm2pgsql --host /var/run/postgresql --create --slim --drop --username osm --database osm -C 4000 --tag-transform-script path/to/awm-styles/openstreetmap-carto/openstreetmap-carto.lua --style path/to/awm-styles/openstreetmap-carto/openstreetmap-carto.style --number-processes 8 --hstore -E 3573 -G your-merged-extract.osm.pbf 
```

This can take 20 minutes to over an hour depending on your hardware. If it fails, you can delete the `osm` database, re-create it, then fix the problem and try `osm2pgsql` again.

If you disabled autovacuum in Postgres, you can run a VACUUM ANALYZE now to improve query planning on the database. Autovacuum isn't necessary as this is a one-time import where automatic diff updates have been disabled.

### Apache and mod_tile Installation

The primary method of serving map tiles using this stylesheet is using [mod_tile][], a module for Apache 2 HTTPd server. Start by installing Apache 2:

```
$ sudo apt install apache2 apache2-dev
```

Then install Mapnik, the library for rendering images from the data/stylesheets:

```
$ sudo apt install libmapnik3.0 libmapnik-dev mapnik-utils python3-mapnik
```

Next install the latest version of mod_tile from GitHub:

```
$ mkdir -p /opt
$ cd /opt
$ git clone --depth=1 https://github.com/openstreetmap/mod_tile
```

**Please Note**: You may have to install build tools at this point depending on your variant/base image for Ubuntu Server.

Run the install commands for mod_tile:

```
$ cd /opt/mod_tile
$ ./autogen.sh
$ ./configure
$ make -j8
$ sudo make install
$ sudo ldconfig
```

And add a systemd unit to keep renderd running:

```
[Unit]
Description=Rendering daemon for Mapnik tiles

[Service]
User=www-data
RuntimeDirectory=renderd
ExecStart=/usr/local/bin/renderd -f -c /usr/local/etc/renderd.conf

[Install]
WantedBy=multi-user.target
```

Install this to `/etc/systemd/system/renderd.service`, then reload Systemd:

```
$ sudo systemctl daemon-reload
$ sudo systemctl enable renderd
$ sudo systemctl start renderd
```

[mod_tile]: https://github.com/openstreetmap/mod_tile

## Apache and mod_tile Configuration

Next modify the renderd configuration for the new stylesheet, editing `/usr/local/etc/renderd.conf`:

```
[renderd]
socketname=/var/run/renderd/renderd.sock
num_threads=8
tile_dir=/srv/tiles
stats_file=/var/run/renderd/renderd.stats

[mapnik]
plugins_dir=/usr/lib/mapnik/3.0/input
font_dir=/usr/share/fonts
font_dir_recurse=1

[awm]
URI=/awm/
TILEDIR=/srv/tiles/awm
XML=path/to/arcticwebmap.xml
HOST=localhost
TILESIZE=256
MINZOOM=0
MAXZOOM=22
TYPE=png image/png
DESCRIPTION=Whatever you want
CORS=*
ASPECTX=1
ASPECTY=1
SCALE=1.0
```

Restart renderd to pick up the new changes. Next create an Apache module to load mod_tile:

```
LoadModule tile_module /usr/lib/apache2/modules/mod_tile.so
```

Place this in `/etc/apache2/mods-available/tile.load`, and enable it:

```
$ sudo 2enmod tile
```

Disable the default Apache site:

```
$ sudo a2dissite 000-default
```

Create a new virtualhost for the tile server, see the [maps_server virtualhost example][vhost example] and place that in `/etc/apache2/sites-available/tileserver.conf`. Enable the tile server vhost, and restart Apache:

```
$ sudo a2enhost tileserver
$ sudo apache2ctl restart
```

[vhost_example]: https://github.com/openfirmware/maps_server/blob/master/templates/default/tileserver.conf.erb

### Use the Tiles

Tiles should now be accessible on port 80 at `/awm/0/0/0.png`, following the standard OpenStreetMap tile naming scheme. Usage with OpenLayers is fairly straight-forward; Leaflet will require modification of PolarMaps.js to use these tiles.

## Chef Deployment

The [maps_server][] cookbook will be upgraded to support deployment of this stylesheet; once that is done then this section will be updated.

TODO

[maps_server]: https://github.com/openfirmware/maps_server
