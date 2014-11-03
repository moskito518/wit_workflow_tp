/*
 * grunt-init-jquery
 * https://gruntjs.com/
 *
 * Copyright (c) 2013 "Cowboy" Ben Alman, contributors
 * Licensed under the MIT license.
 */

'use strict';

// Basic template description.
exports.description = 'Create a template for WIT template';

// Template-specific notes to be displayed before question prompts.
exports.notes = 'wit @ 2014 FrontEnd Template';

// Any existing file or directory matching this wildcard will cause a warning.
exports.warnOn = '*';

// The actual init template.
exports.template = function(grunt, init, done) {

  init.process({type: 'jquery'}, [
    // Prompt for these values.
    init.prompt('name'),
    init.prompt('version'),
    init.prompt('author_name'),
	init.prompt('less', 'yes')
  ], function(err, props) {
    // A few additional properties.
    props.witjson = props.name + '.wit.json';
	
	var renames = init.renames;
	
	//如果不使用less,关闭less编译等功能,并且使用css合并编译功能
	if(!(props.less == 'yes')){
		renames['Gruntfile.less.js'] = 'false';
		renames['Gruntfile.no_less.js'] = 'Gruntfile.js';
		renames['dev/less/**/*'] = 'false';
	} else {
		renames['Gruntfile.no_less.js'] = 'false';
		renames['Gruntfile.less.js'] = 'Gruntfile.js';
		renames['dev/css/**/*'] = 'false';
	}
	
	renames['Gruntfile.cmd.js'] = 'Gruntfile.js';
	renames['dev/js/cmd.json'] = 'dev/js/' + props.name + '.cmd.json';
	
    // Files to copy (and process).
    var files = init.filesToCopy(props);
	
    // Actually copy (and process) files.
    init.copyAndProcess(files, props, {noProcess: 'libs/**'});

	var _devDependencies = {
		"grunt": "*",
		"grunt-contrib-copy": "*",
		"grunt-contrib-uglify": "*",
		"grunt-contrib-watch": "*",
		"grunt-contrib-clean": "*",
	    "grunt-contrib-imagemin": "*",
		"grunt-inline": "*",
		"grunt-rev": "*",
		"grunt-contrib-cssmin": "*",
		"grunt-usemin": "*",
		"grunt-image-embed": "*"
	};
	
	_devDependencies['grunt-cmd-concat'] =  "*";
	_devDependencies['grunt-cmd-transport'] =  "*";
	
	if(props.less == 'yes') {
		_devDependencies['grunt-contrib-less'] = "*";
	} else {
		_devDependencies['grunt-css-combo'] = "*";
	}
	
    // Generate package.json file, used by npm and grunt.
    init.writePackageJSON('package.json', {
      name: props.name,
      version: props.version,
      npm_test: 'grunt qunit',
      node_version: '>= 0.8.0',
      devDependencies: _devDependencies,
    });

    // Generate jquery.json file.
    init.writePackageJSON(props.witjson, props, function(pkg, props) {
      // The jQuery site needs the "bugs" value as a string.
      if ('bugs' in props) { pkg.bugs = props.bugs; }
      return pkg;
    });

    // All done!
    done();
  });

};
