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

## Compiling the Project File

TODO: Move compiling to deployment, as it will generate XML files for Mapnik.

The project file for Arctic Web Map style is modified from the project file from openstreetmap-carto. This is necessary for these reasons:

* Output projection for the map under the tiles is now EPSG:3573
* Input projection from PostGIS is EPSG:4326 **instead** of EPSG:3857
* The name of the layer has changed
* Additional layers/stylesheets have to be added

Making these changes by editing the file manually is a problem because it is easy to make mistakes. To solve this, a script is used to copy the openstreetmap-carto project file, apply a set of changes, and dump the new file to disk.

The script is called `compile.js` and is ran via Node.js. It uses the "local config" feature of Kosmtik to apply a set of changes.

TODO: cover local server script

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

TODO: Explain how much of a change to the stylesheet should go into a single git commit, and when to divide it into different commits

## Pushing to GitHub

TODO: Explain how to push to GitHub, how to do a pull request, and who from the lab will be merging
