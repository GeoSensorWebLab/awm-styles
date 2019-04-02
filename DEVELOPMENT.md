# Stylesheet Development

This document will cover how to set up a local development environment for testing and changing the Arctic Web Map stylesheet. For instructions on deploying the stylesheet to production, see [DEPLOYMENT.md](DEPLOYMENT.md).

Note that these instructions have only been tested under MacOS 10.13 "High Sierra".

## Update the Submodule

The first step is to make sure you have pulled [openstreetmap-carto][] as a submodule. If you are on the command line:

```terminal
$ git submodule init
$ git submodule update
```

This will create the `openstreetmap-carto` directory and add files from the remote repository.

## Installing Node.js

Node.js is required for compiling the stylesheet as well as the stylesheet preview server, [kosmtik][].

If you are unfamiliar with Node.js, I recommend following a getting started guide for your OS that will set up command line access.

TODO: Add links to guides that are *good*

I recommend installing the most recent "LTS" version, `10.15.3`. Older versions *may* have some odd behaviour. Once node is available on your command line, you can install the dependent development packages:

```
$ cd path/to/awm-styles
$ npm install
```

This will install [kosmtik][], which we use to preview changes to the stylesheet in a local web browser.

## Downloading and Converting Shapefiles and Rasters

This map uses vector and raster datasets that are kept on the disk instead of in the PostGIS database. A script has been included in this repo (`scripts/get-datafiles.js`) to download these files, extract them, and convert them for the map projection.

GDAL must be installed and `ogr2ogr`, `gdalwarp`, and `gdal_translate` must be available on your `$PATH`.

Use node to launch the script. It will try to download and process the files in parallel, and the script output will look a bit messy.

```
$ node scripts/get-datafiles.js
```

This will take a few minutes to process.

## Running the Preview Server

Once the shapefiles and rasters have been processed, the local kosmtik server can be started to preview the stylesheet.

```
$ node server.js
```

This will run kosmtik with the `openstreetmap-carto` stylesheet, with modifications specified in `awmconfig.js`.

## Modifying Layers and Stylesheets

Modifications can be done in `awmconfig.js`, there are some existing examples of adding/modifying/removing layers and stylesheets.

## Custom CartoCSS Styling

Styles for Arctic Web Map are currently kept in `arcticwebmap.mss`. These will be applied *after* the styles in `openstreetmap-carto`.

## Merging Upstream Changes (Optional)

Changes to the [openstreetmap-carto][] stylesheet are managed using a Git Submodule. If you are not familiar with git submodules, I recommend [reading a guide](https://git-scm.com/book/en/v2/Git-Tools-Submodules) as they can be misleading and are easy to mis-use.

I recommend locking the openstreetmap-carto submodule to a specific tag, that way it is clear in the parent repository (this one) which version is being deployed. To change the tag, enter the submodule directory and checkout the tag you want.

```terminal
$ cd openstreetmap-carto
$ git checkout v4.20.0
```

The submodule will be updated to that tag, but you still need to update the parent repo to note that you modified the submodule.

```terminal
$ cd ..
$ git add openstreetmap-carto .gitmodules
$ git commit -m "Update openstreetmap-carto to v4.20.0"
```

Now that the change has been committed, other users of the stylesheet will now be able to deploy the specific submodule version.

[kosmtik]: https://github.com/kosmtik/kosmtik
[openstreetmap-carto]: https://github.com/gravitystorm/openstreetmap-carto

## How much change to put in a git commit?

A commit should be created for any discrete "group" of similar changes to the stylesheet or project. Creating multiple smaller commits is preferred as it will make it easier to debug stylesheet problems in the future.

## Pushing to GitHub

If you have forked this repo and would like to have your changes merged in the main repository, push your code to GitHub in a branch on your fork and then send a pull request to the main repository. James (@openfirmware) will review and merge the changes.
