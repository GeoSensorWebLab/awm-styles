# Arctic Web Map Mapnik Styles

These are CartoCSS map stylesheets based on the openstreetmap-carto repository. They are used for Arctic Web Map styling.

# Local Installation

You need a PostGIS database populated with OpenStreetMap data in the standard osm2pgsql database layout, along with auxillary shapefiles. See [INSTALL.md](INSTALL.md).

# Production Installation

For our production system, we have Mapnik using the XML configuration in `/etc/mapnik-osm-carto-data`. In order to install the latest version of our styles you will have to clone this repository to the tile server.

    $ git clone https://bitbucket.org/geosensorweblab/mapnik-styles
    $ cd mapnik-styles

Then install Node and carto to build the XML files.

    $ sudo apt-get install nodejs
    $ sudo npm install -g carto

Then use the generation script to prepare the XML files:

    $ scripts/generate

This will generate a set of XML files in the current directory, one for each AWM style. Use the install script to copy these to the Mapnik style directory:

    $ sudo scripts/install

And reload renderd to pick up the changes:

    $ sudo service renderd reload

The new style should then start generating on new tiles. If you want to replace old tiles that still have old styles applied, look into the `render_old` command from `mod_tile`.

# Contributing

Contributions to this project are welcome, see [CONTRIBUTING.md](CONTRIBUTING.md) for full details.

# Maintainers

* James Badger (jpbadger@ucalgary.ca)

# License

Copyright GeoSensor Web Lab 2014, all rights reserved.

