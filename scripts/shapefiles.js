/*
 * Retrieve and set up shapefiles for AWM stylesheet
 */
const shapefiles  = require('./shapefiles.json');
const child       = require('child_process');
const compressing = require('compressing');
const fs          = require('fs');
const glob        = require('glob');
const got         = require('got');
const path        = require('path');
const rimraf      = require('rimraf');
const tmp         = require('tmp');

let destination = "openstreetmap-carto/data";
let subdirectory = destination + "/awm";

// convenience function
function log() {
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

// Run a command on an input file with ogr2ogr.
// Put output file(s) in a temporary directory, return output file name.
let ogr2ogr = function(args, inFile) {
    let tmpFile = tmp.dirSync().name + `/${path.basename(inFile)}`;
    args.push(tmpFile, inFile);
    return spawnPromise("ogr2ogr", args)
    .then(() => {
        return tmpFile;
    });
};

// Print out all shapefiles
if (shapefiles === undefined) {
    console.error("Cannot read shapefiles.");
    process.exit(1);
}

log("There are %d shapefiles.", shapefiles.length);

// Iterate over shapefiles
shapefiles.forEach((shapefile) => {
    let outputDir = `${subdirectory}/${shapefile.name}`;
    let filename = path.basename(shapefile.url);

    new Promise((resolve, reject) => {
        // Check if shapefile has already been converted
        fs.stat(outputDir, (err, stats) => {
            if (err) {
                resolve(outputDir);
            } else {
                // reject("Shapefile has already been converted.");
                resolve();
            }
        });
    }).then(() => {
        return new Promise((resolve, reject) => {
            // Check if downloaded file already exists
            fs.stat(`${destination}/${filename}`, (err, stats) => {
                if (err) {
                    // file doesn't exist - download it
                    resolve(filename);
                } else {
                    // file exists, don't download
                    log("%s already exists.", filename);
                    resolve();
                }
            });
        });
    }).then((file) => {
        return new Promise((resolve, reject) => {
            // Download file
            if (file === undefined) {
                resolve();
            } else {
                log("Downloading to %s/%s", outputDir, filename);
                got.stream(shapefile.url)
                .on('error', reject)
                .on('downloadProgress', (progress) => {
                    log("%s: %d%%", filename, Math.trunc(100 * progress.percent));
                })
                .pipe(fs.createWriteStream(`${destination}/${filename}`))
                .on('finish', resolve);
            }
        });
    }).then(() => {
        return new Promise((resolve, reject) => {
            // Check if archive has already been extracted
            let extractionDir = `${destination}/${shapefile.name}`;
            fs.stat(extractionDir, (err, stats) => {
                if (err) {
                    // dir doesn't exist - extract it
                    resolve(extractionDir);
                } else {
                    // dir exists, don't extract
                    log("%s already extracted.", filename);
                    resolve();
                }
            });
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
                    extractor(`${destination}/${filename}`, `${destination}/${shapefile.name}`)
                    .then(resolve)
                    .catch(reject);
                }
            }
        });
    }).then(() => {
        // Create output directory
        return new Promise((resolve, reject) => {
            // Exit if no transforms
            if (shapefile.ogr2ogr === undefined) {
                reject("No transforms needed.");
            }
            
            fs.mkdir(outputDir, { recursive: true }, (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }).then(() => {
        // collect all .shp files
        return new Promise((resolve, reject) => {
            glob(`${destination}/${shapefile.name}/**/*.shp`, (err, files) => {
                if (err) { reject(err); }
                log("Found %d shp files", files.length);
                resolve(files);
            });
        });
    }).then((files) => {
        // run ogr2ogr on all .shp files
        let commands = files.map((shpFile) => {
            return new Promise((resolve, reject) => {
                let outputFile = `${outputDir}/${path.basename(shpFile)}`
                
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
                    return ogr2ogr(["-clipdst", shapefile.ogr2ogr.clip], outFile);
                }).then((outFile) => {
                    tempFiles.push(outFile);
                    // 4. Apply segmentization
                    return ogr2ogr(["-segmentize", shapefile.ogr2ogr.segmentize], outFile);
                }).then((outFile) => {
                    tempFiles.push(outFile);
                    // 5. Reproject to EPSG:3573
                    return ogr2ogr(["--config", "OGR_ENABLE_PARTIAL_REPROJECTION", "YES", "-t_srs", "EPSG:3573"], outFile);
                }).then((outFile) => {
                    tempFiles.push(outFile);
                    let outDir = path.dirname(outFile);
                    // search for files in output file's directory so
                    // we can move them to the AWM data directory
                    let p = new Promise((resolve, reject) => {
                        fs.readdir(outDir, (err, files) => {
                            if (err) {
                                reject(err);
                            } else {
                                resolve(files);    
                            }
                        });    
                    });
                    return Promise.all([outDir, p]);
                }).then((values) => {
                    sourceDir = values[0], segmentizedFiles = values[1];
                    // Move files from outDir to outputDir
                    let movePromises = segmentizedFiles.map((sFile) => {
                        return new Promise((resolve, reject) => {
                            // remove destination file
                            let destFilename = `${outputDir}/${sFile}`;
                            rimraf.sync(destFilename);

                            // move file
                            fs.rename(`${sourceDir}/${sFile}`, destFilename, (err) => {
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
                })
                .then(() => {
                    resolve(outputFile);
                }).catch(reject);
            });
        });

        return Promise.all(commands);
    }).catch((err) => {
        console.error(err);
    });
});
