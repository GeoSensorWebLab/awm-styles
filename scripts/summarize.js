// Create a summary of an MML file, giving an overview of the layers
// and their details such as zoom levels, data source, etc.

const fs   = require('fs');
const path = require('path');
const pug  = require('pug');

let filename = process.argv[2];

if (filename === undefined) {
    console.error("No input file defined.");
    process.exit(1);
}

let basename = path.basename(filename, ".mml");

new Promise((resolve, reject) => {
    fs.readFile(filename, (err, projectMML) => {
        if (err) {
            reject(err);
        } else {
            resolve(projectMML);
        }
    });
})
.then((mml) => {
    // Parse
    let project = JSON.parse(mml);

    // Render
    var html = pug.renderFile('scripts/summary.pug', {
        pretty: true,
        // page data
        pageTitle: `${basename} Summary`,
        layers: project.Layer
    });

    return html;
})
.then((html) => {
    return new Promise((resolve, reject) => {
        fs.open(`${basename}.html`, 'w', (err, fd) => {
            if (err) {
                reject(err);
            } else {
                fs.write(fd, html, (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                });
            }
        });
    });
})
.catch((err) => { console.error(err); process.exit(1); });
