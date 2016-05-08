module.exports = function(grunt) {
    'use strict';

    require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        // uglify javascript files
        uglify: {
        options: {
            sourceMap: true
        },
        build: {
            files: {
                'public/js/app.min.js': 'public/src/js/*.js'
            }
        }
        },
        // concat js
        concat: {
            options: {
                separator: ';\n',
            },
            dist: {
                src: ['public/js/page.min.js', 'public/js/app.min.js'],
                dest: 'public/js/app.bundle.js'
            }
        },
        // less file built to source css
        less: {
            build: {
                files: {
                    'public/css/style.css': 'public/src/less/style.less'
                }
            }
        },
        // css file minification
        cssmin: {
            build: {
                files: {
                    'public/css/style.min.css': 'public/css/style.css'
                }
            }
        },
        // watch tasks
        watch: {
            js: {
                files: ['public/src/js/*.js'],
                tasks: ['uglify', 'concat']
            },
            less: {
                files: ['public/src/less/*.less'],
                tasks: ['less']
            },
            css: {
                files: ['public/css/style.css'],
                tasks: ['cssmin']
            }
        }
    });

    grunt.registerTask('default', 'Run all build tasks.', ['uglify', 'concat', 'less', 'cssmin']);
};