module.exports = function(grunt) {
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            js: {
                src: [
                    'bower_components/jquery/dist/jquery.js',
                    'bower_components/bootstrap-sass-official/assets/javascripts/bootstrap.js',
                    'bower_components/leaflet/dist/leaflet-src.js',
                    'bower_components/maps.stamen.com/js/tile.stamen.js',
                    'bower_components/leaflet.locatecontrol/src/L.Control.Locate.js',
                    'bower_components/typeahead.js/dist/typeahead.bundle.js',
                    'src/js/rude.js'
                ],
                dest: 'assets/js/rude.js'
            }
        },
        copy: {
            csstoscss: {
                files: [
                    {
                        expand: true,
                        cwd: 'bower_components/leaflet/dist',
                        src: ['**/*.css', '!**/*.min.css'],
                        dest: 'src/sass',
                        filter: 'isFile',
                        ext: '.scss'
                    },
                    {
                        expand: true,
                        cwd: 'bower_components/leaflet.locatecontrol/dist',
                        src: ['**/*.css', '!**/*.min.css'],
                        dest: 'src/sass',
                        filter: 'isFile',
                        ext: '.scss',
                        extDot: 'last'
                    }
                ]
            },
            img: {
                files: [
                    {
                        expand: true,
                        cwd: 'src/img',
                        src: ['**/*.png'],
                        dest: 'assets/img',
                        filter: 'isFile',
                        ext: '.png'
                    }
                ]
            },
            fonts: {
                files: [
                    {
                        expand: true,
                        cwd: 'bower_components/fontawesome/fonts',
                        src: ['**/*'],
                        dest: 'assets/fonts',
                        filter: 'isFile'
                    }
                ]
            }
        },
        sass: {
            dist: {
                files: [
                    {
                        'assets/css/rude.css': 'src/sass/rude.scss'
                    }
                ]
            }
        },
        jsonmin: {
            dist: {
                files: {
                    'assets/data/rude.geojson': 'src/data/rude.geojson'
                }
            }
        },
        watch: {
            options: {
                livereload: true
            },
            grunt: {
                files: ['Gruntfile.js'],
                tasks: ['build']
            },
            js: {
                files: ['src/js/*'],
                tasks: ['concat']
            },
            sass: {
                files: ['src/sass/*'],
                tasks: ['sass']
            }
        }
    });

    grunt.registerTask('default', ['watch']);
    grunt.registerTask('nodsstore', function() {
        grunt.file.expand({
            filter: 'isFile',
            cwd: '.'
        }, ['**/.DS_Store']).forEach(function(file) {
            grunt.file.delete(file);
        });
    });
    grunt.registerTask('build', ['concat', 'copy:csstoscss', 'copy:img', 'copy:fonts', 'sass', 'jsonmin']);
    grunt.registerTask('deploy', ['build', 'copy:deploy', 'shell:deploy']);
};
