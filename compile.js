/* Merge the Arctic Web Map configuration onto the openstreetmap-carto
 * project file. If a `localconfig.js(on)` file exists, apply that next.
 * Then export to Mapnik XML files.
*/
const child = require('child_process');

let baseProject = "openstreetmap-carto/project.mml";
let awmConfig   = "awmconfig.js";
let format      = "XML";
let outputFile  = "arcticwebmap.xml";

let args = process.argv.slice(2, process.argv.length);

if (args[0] !== undefined) {
	switch(args[0].toLocaleUpperCase()) {
		case 'MML':
			format = "MML";
			outputFile = "arcticwebmap.mml";
		break;
		case 'YAML':
		case 'YML':
			format = "YAML";
			outputFile = "arcticwebmap.yml";
		default:
		// do nothing, use xml
	}
}

let command = `${__dirname}/node_modules/.bin/kosmtik export --output ${outputFile} --localconfig ${awmConfig} --format mml ${baseProject}`;
child.execSync(command, (error, stdout, stderr) => {
	console.log(stdout);
});
