module.exports = function(grunt) {
	'use strict';
	
	require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);
	
	grunt.initConfig({
	    pkg: grunt.file.readJSON('package.json'),
	    
	    cssmin: {
	        build: {
	            files: {
	                'assets/css/style.min.css': 
	                ['assets/css/normalize.css',
                     'assets/css/skeleton.css',
                     'assets/css/custom.css'
                    ]
	            }
	        }
        },
        watch: {
            css: {
                files: ['assets/css/*.css'],
                tasks: ['cssmin']
            }
        }
	});
	
	grunt.registerTask('default', 'Run all build tasks.', ['cssmin']);
};