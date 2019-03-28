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
}

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
                let outFile  = `${outputDir}/${path.basename(shpFile)}`
                let tmpFile  = tmp.dirSync().name + `/${path.basename(shpFile)}`;
                let clipFile = tmp.dirSync().name + `/${path.basename(shpFile)}`;
                let segDir   = tmp.dirSync().name;
                let segFile  = segDir + `/${path.basename(shpFile)}`;

                // 1. reproject to EPSG:4326
                // 2. clip
                // 3. segmentize
                // 4. move all files
                return spawnPromise("ogr2ogr", 
                    ["-t_srs", "EPSG:4326", "-lco", "ENCODING=UTF-8", tmpFile, shpFile])
                .then(() => {
                    return spawnPromise("ogr2ogr", 
                        ["-clipsrc", shapefile.ogr2ogr.clipdst, clipFile, tmpFile]);
                }).then(() => {
                    return spawnPromise("ogr2ogr", 
                        ["-segmentize", shapefile.ogr2ogr.segmentize, segFile, clipFile]);
                }).then(() => {
                    return new Promise((resolve, reject) => {
                        fs.readdir(segDir, (err, files) => {
                            if (err) {
                                reject(err);
                            } else {
                                resolve(files);    
                            }
                        });    
                    });
                }).then((segmentizedFiles) => {
                    let movePromises = segmentizedFiles.map((sFile) => {
                        return new Promise((resolve, reject) => {
                            // remove destination file
                            let destFilename = `${outputDir}/${sFile}`;
                            rimraf.sync(destFilename);

                            // move file
                            fs.rename(`${segDir}/${sFile}`, destFilename, (err) => {
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
                    resolve(outFile);
                }).catch(reject);
            });
        });

        return Promise.all(commands);
    }).then((shpFiles) => {
        // Run shapeindex on all .shp files
        let commands = shpFiles.map((shpFile) => {
            log(shpFile);
            return spawnPromise("shapeindex", [shpFile]);
        });

        return Promise.all(commands);
    }).catch((err) => {
        console.error(err);
    });
});
