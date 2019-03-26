/* Merge the Arctic Web Map configuration onto the openstreetmap-carto
 * project file. If a `localconfig.js(on)` file exists, apply that next.
 * Then run the local kosmtik web server.
*/
const child = require('child_process');

let baseProject = "openstreetmap-carto/project.mml";
let awmConfig   = "awmconfig.js";

let command = `${__dirname}/node_modules/.bin/kosmtik serve --localconfig ${awmConfig} ${baseProject}`;
child.execSync(command, (error, stdout, stderr) => {
	console.log(stdout);
});
