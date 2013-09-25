/*
 * grunt-clearcache
 * https://github.com/catnofish/grunt-clearcache
 *
 * Copyright (c) 2013 Herk Lee
 * Licensed under the MIT license.
 */

'use strict';

var http = require('http');

module.exports = function (grunt) {
	function getServerNumbers(n) {
		var numbers;
		if ( !isNaN(Number(n)) ) {
			numbers = [Number(n)];
		} else if ( n.indexOf(',') > 0 ) {
			numbers = n.split(',');
		} else if ( n.indexOf('-') > 0 ) {
			numbers = n.split('-');
			for ( var i = numbers[0], arr = []; i <= numbers[1]; ++i ) {
				arr.push(i);
			}
			numbers = arr;
		} else {
			grunt.warn('Unexpected server number "' + n.red + '". Number will be one of ( "1"|"1,2,3"|"1-3" ).');
			return [1,2,3,4,5,6]; // For --force.
		}

		return numbers;
	}

	grunt.registerMultiTask('clearcache', 'Clear file cache by http request. Netease specially.', function () {
		var options = this.options({
				defaultN: '1-6'
			}),
			data = this.data,
			count = 0,
			queue = {},
			fail = [],
			done = this.async();

		if ( !options.url ) {
			grunt.fatal('Url of clear interface is required.');
		}

		if (!data.basedir) {
			grunt.fatal('Basedir of dest (options.basedir) is required.');
		}

		grunt.file.recurse(data.localRoot, function(abspath, rootdir, subdir, filename) {
			var ext = filename.split('.').pop(),
				key = subdir + '/' + filename,
				numbers, url;

			if ( ext != 'css' && ext != 'js' ) {
				ext = 'img';
			}
			numbers = getServerNumbers( data[ext] || options.defaultN );
			count += ( queue[key] = numbers.length );

			numbers.forEach(function(v) {
				url = options.url + data.basedir.replace(/{n}/g, v) + key;
				http.get(url, function(res) {
					if ( res.statusCode < 200 || res.statusCode > 299) { // Collect the fail request
						fail.push(url + ' --- With statusCode:' + res.statusCode);
					}
					if ( --queue[key] == 0 ) { // One file has been cleared
						grunt.log.ok('File ' + key.green + ' has been cleared.');
					}
					if ( --count == 0 ) {
						if ( fail.length > 0 ) {
							grunt.log.subhead('Following clear-requests return bad status code:');
							grunt.log.error(fail.join('\n'));
						}
						done();
					}
				}).on('error', function(e) {
						grunt.fatal('Something wrong here with msg: ' + e.message);
				});
			});
		});
	});

};
