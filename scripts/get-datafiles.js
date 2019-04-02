/*
 * Retrieve and set up shapefiles and raster images for AWM stylesheet
 */
const rasters     = require('../rasters.json');
const shapefiles  = require('../shapefiles.json');
const child       = require('child_process');
const compressing = require('compressing');
const fs          = require('fs');
const glob        = require('glob');
const got         = require('got');
const path        = require('path');
const rimraf      = require('rimraf');
const tmp         = require('tmp');

// Stylesheets and project are in the openstreetmap-carto directory, so
// data files should be in a sub-directory. "awm" is created to hold
// transformed versions.
let osmDataDir = "openstreetmap-carto/data";
let awmDataDir = osmDataDir + "/awm";

// convenience function
let log = function() {
    console.log.apply(this, arguments);
}

// run a command in a spawned shell, returning a Promise
let spawnPromise = function(command, args) {
    return new Promise((resolve, reject) => {
        child.spawn(command, args, {
            cwd:   __dirname + "/..",
            shell: true,
            stdio: 'inherit'
        })
        .on('error', reject)
        .on('close', resolve)
        .on('exit', resolve);
    });
};

// Return a promise for fs.stat.
// Resolve if file exists, reject if it does not exist.
let stat = function(file) {
    return new Promise((resolve, reject) => {
        fs.stat(file, (err, stats) => {
            if (err) {
                reject(file);
            } else {
                resolve(file);
            }
        });
    });
}

// Run a command on an input file with gdal_translate.
// Put output file(s) in a temporary directory, return output file name.
let gdaltranslate = function(args, inFile) {
    let tmpFile = `${tmp.dirSync().name}/${path.basename(inFile)}`;
    args.push(inFile, tmpFile);
    return spawnPromise("gdal_translate", args)
    .then(() => {
        return tmpFile;
    });
};

// Run a command on an input file with gdalwarp.
// Put output file(s) in a temporary directory, return output file name.
let gdalwarp = function(args, inFile) {
    let tmpFile = `${tmp.dirSync().name}/${path.basename(inFile)}`;
    args.push(inFile, tmpFile);
    return spawnPromise("gdalwarp", args)
    .then(() => {
        return tmpFile;
    });
};

// Run a command on an input file with ogr2ogr.
// Put output file(s) in a temporary directory, return output file name.
// Note the input/outfile order…
let ogr2ogr = function(args, inFile) {
    let tmpFile = `${tmp.dirSync().name}/${path.basename(inFile)}`;
    args.push(tmpFile, inFile);
    return spawnPromise("ogr2ogr", args)
    .then(() => {
        return tmpFile;
    });
};

log("There are %d shapefiles.", shapefiles.length);
log("There are %d rasters.", rasters.length);

// Iterate over files
shapefiles.concat(rasters).forEach((datafile) => {
    let finalDir = `${awmDataDir}/${datafile.name}`;
    let filename = path.basename(datafile.url);

    // Check if final output directory exists. If it does, then this
    // file does not need to be downloaded nor converted.
    return stat(finalDir)
    .then((file) => {
        return Promise.reject(`Data file "${file}" has already been converted.`);
    }, (file) => {
        return Promise.resolve(file);
    }).then(() => {
        // Check if downloaded file already exists
        return stat(`${osmDataDir}/${filename}`)
        .then((file) => {
            // file exists, don't download
            log("%s already exists.", file);
            return Promise.resolve();
        }, (file) => {
            // file doesn't exist - download it
            return Promise.resolve(file);
        });
    }).then((file) => {
        return new Promise((resolve, reject) => {
            // Download file
            if (file === undefined) {
                resolve();
            } else {
                log("Downloading to %s/%s", finalDir, filename);
                got.stream(datafile.url)
                .on('error', reject)
                .pipe(fs.createWriteStream(file))
                .on('finish', resolve);
            }
        });
    }).then(() => {
        // Check if archive has already been extracted
        let extractionDir = `${osmDataDir}/${datafile.name}`;
        return stat(extractionDir)
        .then((file) => {
            // dir exists, don't extract
            log("%s already extracted.", file);
            return Promise.resolve();
        }, (file) => {
            // dir doesn't exist - extract it
            return Promise.resolve(file);
        });
    }).then((extractionDir) => {
        return new Promise((resolve, reject) => {
            if (extractionDir === undefined) {
                resolve();
            } else {
                // Extract archive.
                // Determine which extraction class/method to use
                let extractor;
                switch(path.extname(filename)) {
                    case '.zip':
                    extractor = compressing.zip.uncompress;
                    break;
                    default:
                }

                if (extractor === undefined) {
                    reject("Could not extract %s", filename);
                } else {
                    log("Extracting %s", filename);
                    extractor(`${osmDataDir}/${filename}`, `${osmDataDir}/${datafile.name}`)
                    .then(resolve)
                    .catch(reject);
                }
            }
        });
    }).then(() => {
        // Create output directory
        return new Promise((resolve, reject) => {
            // Exit if no transforms
            if (datafile.gdal === undefined) {
                reject("No transforms needed.");
            }
            
            fs.mkdir(finalDir, { recursive: true }, (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }).then(() => {
        // collect all .shp, .tif files
        return new Promise((resolve, reject) => {
            glob(`${osmDataDir}/${datafile.name}/**/*.@(shp|tif|tiff)`, (err, files) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(files);
                }
            });
        });
    }).then((files) => {
        // run GDAL on all geo files
        let processedGeofiles = files.map((geoFile) => {
            return new Promise((resolve, reject) => {
                let outputFile = `${finalDir}/${path.basename(geoFile)}`

                switch(path.extname(geoFile)) {
                    case ".tif":
                    case ".tiff":
                        return processGeoTIFF(geoFile, outputFile, datafile.gdal);
                    break;
                    case ".shp":
                        return processShapefile(geoFile, outputFile, datafile.gdal);
                    break;
                    default:
                        return Promise.reject("Unhandled geo file type: %s", geoFile);
                }
            });
        });

        return Promise.all(processedGeofiles);
    }).catch((err) => {
        console.error(err);
    });
});

// Process for GeoTIFFs.
// 1. Reproject to EPSG:4326
// 2. Clip to bounds
// 3. Reproject to EPSG:3573
// 4. Compress
// 5. Move to output directory
// Packbits is used for intermediary compression as it is fast and should
// counter some of the bloating from gdalwarp.
let processGeoTIFF = function(shpFile, outputFile, options) {
    // Track temp files so we can delete them after
    let tempFiles = [];

    // 1. Reproject to EPSG:4326 AND clip in EPSG:4316
    return gdalwarp([
        "-t_srs", "EPSG:4326", "-te", options.clip, "-multi",
        "-co", "\"NUM_THREADS=ALL_CPUS\"",
        "-co", "\"TILED=YES\"",
        "-co", "\"COMPRESS=PACKBITS\"",
        "-dstalpha"
        ], shpFile)
    .then((outFile) => {
        tempFiles.push(outFile);
        // 3. Reproject to EPSG:3573
        return gdalwarp([
            "-t_srs", "EPSG:3573",
            "-r", "bilinear",
            "-multi",
            "-co", "\"NUM_THREADS=ALL_CPUS\"",
            "-co", "\"TILED=YES\"",
            "-co", "\"COMPRESS=PACKBITS\"",
            "-dstalpha"
            ], outFile);
    }).then((outFile) => {
        tempFiles.push(outFile);
        // 4. Compress
        return gdaltranslate([
            "-co", "\"TILED=YES\"",
            "-co", "\"COMPRESS=JPEG\""
            ], outFile);
    }).then((outFile) => {
        tempFiles.push(outFile);
        let finalDir = path.dirname(outFile);
        // search for files in final output file's directory so
        // we can move them to the AWM data directory
        let finalFiles = new Promise((resolve, reject) => {
            fs.readdir(finalDir, (err, files) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(files);    
                }
            });    
        });
        return Promise.all([finalDir, finalFiles]);
    }).then((values) => {
        finalDir = values[0], finalFiles = values[1];
        // 5. Move to output directory
        let movePromises = finalFiles.map((sFile) => {
            return new Promise((resolve, reject) => {
                // remove destination file
                let outputDir = path.dirname(outputFile);
                let destFilename = `${outputDir}/${sFile}`;
                rimraf.sync(destFilename);

                // move file
                fs.rename(`${finalDir}/${sFile}`, destFilename, (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                });
            });
        });

        return Promise.all(movePromises);
    })
    .then(() => {
        // Clean up tmp directories
        tempFiles.forEach((tmpFile) => {
            rimraf.sync(path.dirname(tmpFile));
        });
    });
};

// Process for ERSI Shapefiles.
// 1. Reproject to EPSG:4326
// 2. Fix geometries
// 3. Clip to bounds
// 4. Apply segmentization
// 5. Reproject to EPSG:3573
// 6. Move to output directory
let processShapefile = function(shpFile, outputFile, options) {
    // Track temp files so we can delete them after
    let tempFiles = [];

    // 1. reproject to EPSG:4326
    return ogr2ogr(["--config", "OGR_ENABLE_PARTIAL_REPROJECTION", "YES", "-t_srs", "EPSG:4326"], shpFile)
    .then((outFile) => {
        tempFiles.push(outFile);
        // 2. Fix geometries
        // Assumption: tablenames are the same as the filename
        let tablename = path.basename(shpFile, ".shp");
        return ogr2ogr(["-dialect", "sqlite", "-sql", `"SELECT ST_MakeValid(geometry) as geometry FROM ${tablename}"`, "-explodecollections", "-wrapdateline"], outFile);
    }).then((outFile) => {
        tempFiles.push(outFile);
        // 3. Clip to bounds
        return ogr2ogr(["-clipdst", options.clip], outFile);
    }).then((outFile) => {
        tempFiles.push(outFile);
        // 4. Apply segmentization
        return ogr2ogr(["-segmentize", options.segmentize], outFile);
    }).then((outFile) => {
        tempFiles.push(outFile);
        // 5. Reproject to EPSG:3573
        return ogr2ogr(["--config", "OGR_ENABLE_PARTIAL_REPROJECTION", "YES", "-t_srs", "EPSG:3573"], outFile);
    }).then((outFile) => {
        tempFiles.push(outFile);
        let finalDir = path.dirname(outFile);
        // search for files in final output file's directory so
        // we can move them to the AWM data directory
        let finalFiles = new Promise((resolve, reject) => {
            fs.readdir(finalDir, (err, files) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(files);    
                }
            });    
        });
        return Promise.all([finalDir, finalFiles]);
    }).then((values) => {
        finalDir = values[0], finalFiles = values[1];
        // 6. Move to output directory
        let movePromises = finalFiles.map((sFile) => {
            return new Promise((resolve, reject) => {
                // remove destination file
                let outputDir = path.dirname(outputFile);
                let destFilename = `${outputDir}/${sFile}`;
                rimraf.sync(destFilename);

                // move file
                fs.rename(`${finalDir}/${sFile}`, destFilename, (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                });
            });
        });

        return Promise.all(movePromises);
    })
    .then(() => {
        // Clean up tmp directories
        tempFiles.forEach((tmpFile) => {
            rimraf.sync(path.dirname(tmpFile));
        });
    });
};