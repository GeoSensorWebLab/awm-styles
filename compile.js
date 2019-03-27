/* Merge the Arctic Web Map configuration onto the openstreetmap-carto
 * project file. If a `localconfig.js(on)` file exists, apply that next.
 * Then export to Mapnik XML files (or other format).
*/
const child = require('child_process');

let baseProject = "openstreetmap-carto/project.mml";
let awmConfig   = "awmconfig.js";
let format      = "xml";
let outputFile  = "arcticwebmap.png";

let args = process.argv.slice(2, process.argv.length);

if (args[0] !== undefined) {
	switch(args[0].toLocaleUpperCase()) {
		case '--HELP':
		case '-H':
			console.log("USAGE: node compile.js [-h|--help] [FORMAT]");
			console.log(" -h|--help    print usage");
			console.log(" FORMAT is one of:");
			console.log("   XML      - Default Mapnik XML");
			console.log("   MML      - TileMill Project File (JSON)");
			console.log("   YML/YAML - TileMill Project File");
			console.log("   PNG/PNG8 - 8-bit Render of World");
			process.exit(0);
		case 'MML':
			format = "mml";
			outputFile = "arcticwebmap.mml";
		break;
		case 'YAML':
		case 'YML':
			format = "yml";
			outputFile = "arcticwebmap.yml";
		break;
		case 'PNG':
		case 'PNG8':
			format = "png8";
			outputFile = "arcticwebmap.png";
		default:
		// do nothing, use xml
	}
}

child.spawn(`${__dirname}/node_modules/.bin/kosmtik`, 
	['export', '--output', outputFile,
	 '--localconfig', awmConfig,
	 '--format', format,
	 baseProject], {
		stdio: 'inherit'
	});
