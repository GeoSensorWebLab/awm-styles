/*
 * Retrieve and set up shapefiles for AWM stylesheet
 */
const shapefiles = require('./shapefiles.json');
const fs = require('fs');
const got = require('got');
const path = require('path');

let destination = "openstreetmap-carto/data";
let subdirectory = destination + "/awm";

// convenience function
function log() {
    console.log.apply(this, arguments);
}

// Print out all shapefiles
if (shapefiles === undefined) {
    console.error("Cannot read shapefiles.");
    process.exit(1);
}

log("There are %d shapefiles.", shapefiles.length);

// Iterate over shapefiles
shapefiles.forEach((shapefile) => {
    let outputDir = `${subdirectory}/${shapefile.name}/`;
    let filename = path.basename(shapefile.url);

    new Promise((resolve, reject) => {
        // Check if shapefile has already been converted
        fs.stat(outputDir, (err, stats) => {
            if (err) {
                resolve(outputDir);
            } else {
                reject("Shapefile has already been converted.");
            }
        });
    }).then((dir) => {
        return new Promise((resolve, reject) => {
            // Check if downloaded file already exists
            fs.stat(`${destination}/${filename}`, (err, stats) => {
                if (err) {
                    // file doesn't exist - download it
                    resolve(filename);
                } else {
                    // file exists, don't download
                    console.log("%s already exists.", filename);
                    resolve();
                }
            });
        });
    }).then((file) => {
        return new Promise((resolve, reject) => {
            // Download file
            if (file === undefined) {
                // no download necessary
                resolve();
            } else {
                log("Downloading to %s/%s", outputDir, filename);
                got.stream(shapefile.url)
                .on('error', (error) => {
                    reject(error);
                })
                .on('downloadProgress', (progress) => {
                    log("%s: %d%%", filename, Math.trunc(100 * progress.percent));
                })
                .pipe(fs.createWriteStream(`${destination}/${filename}`))
                .on('finish', () => {
                    resolve();
                });
            }
        });
    }).then(() => {
        // Extract archive
        
    }).then(() => {
        // Run ogr2ogr or gdal_translate
    }).then(() => {
        // Run shapeindex
    });
});
