module.exports = function (grunt) {
    'use strict';
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jshint: {
            files: [ '**/*.js', '!node_modules/**/*.js'],
            options: {
                
            }
        },
        yuidoc: {
            compile: {
                name: '<%= pkg.name %>',
                description: '<%= pkg.description %>',
                version: '<%= pkg.version %>',
                url: '<%= pkg.homepage %>',
                options: { 
                    paths: '<%= pkg.sourceDir %>',
                    outdir: '<%= pkg.documentationDir %>'
                }
            }
        }        
        
        
    });
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.registerTask('default', [ 'jshint' ]);
};
