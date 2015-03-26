// Run with --target=dev for localhost or [--target=dist (the default)] for production

module.exports = function(grunt) {
    require('load-grunt-tasks')(grunt);

    var target = grunt.option('target') || 'dist';

    grunt.initConfig({
        target: grunt.option('target') || 'dist',
        pkg: grunt.file.readJSON('package.json'),
        cdndeps: {
            options: {
                src: 'src/data/cdn.json',
                dest: 'src/js',
                clean: true,
                prune: false
            }
        },
        concat: {
            js: {
                src: [
                    'bower_components/jquery/dist/jquery.js',
                    'bower_components/bootstrap-sass-official/assets/javascripts/bootstrap.js',
                    'bower_components/leaflet/dist/leaflet-src.js',
                    'src/js/maptiks-leaflet.min.js',
                    'src/js/maptiks-tracking-<%= target %>.js',
                    'bower_components/maps.stamen.com/js/tile.stamen.js',
                    'bower_components/leaflet.locatecontrol/src/L.Control.Locate.js',
                    'bower_components/leaflet.markercluster/dist/leaflet.markercluster.js',
                    'bower_components/Leaflet.groupedlayercontrol/src/leaflet.groupedlayercontrol.js',
                    'bower_components/Leaflet.MousePosition/src/L.Control.MousePosition.js',
                    'bower_components/typeahead.js/dist/typeahead.bundle.js',
                    'bower_components/list.js/dist/list.js',
                    'src/js/rude.js'
                ],
                dest: 'assets/js/rude.js'
            }
        },
        jshint: {
            beforeconcat: ['src/js/rude.js']
        },
        uglify: {
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: 'assets/js',
                        src: ['*.js', '!*.min.js'],
                        dest: 'assets/js',
                        ext: '.min.js'
                    }
                ]
            },
            dev: {
                options: {
                    mangle: false,
                    compress: false,
                    preserveComments: 'all',
                    beautify: true
                },
                files: [
                    {
                        expand: true,
                        cwd: 'assets/js',
                        src: ['*.js', '!*.min.js'],
                        dest: 'assets/js',
                        ext: '.min.js'
                    }
                ]
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
                    },
                    {
                        expand: true,
                        cwd: 'bower_components/leaflet.markercluster/dist',
                        src: ['**/*.css', '!**/*.min.css'],
                        dest: 'src/sass',
                        filter: 'isFile',
                        ext: '.scss',
                        extDot: 'last'
                    },
                    {
                        expand: true,
                        cwd: 'bower_components/Leaflet.groupedlayercontrol/src',
                        src: ['**/*.css', '!**/*.min.css'],
                        dest: 'src/sass',
                        filter: 'isFile',
                        ext: '.scss',
                        extDot: 'last'
                    },
                    {
                        expand: true,
                        cwd: 'bower_components/Leaflet.MousePosition/src',
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
            },
            deploy: {
                files: [
                    {
                        expand: true,
                        src: ['index.html', 'assets/**/*'],
                        dest: 'deploy'
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
                    'assets/data/rude-en.geojson': 'src/data/rude-en.geojson',
                    'assets/data/rude-it.geojson': 'src/data/rude-it.geojson'
                }
            }
        },
        shell: {
            enshp: {
                command: 'ogr2ogr -f "ESRI Shapefile" -overwrite assets/data/rude-en.shp assets/data/rude-en.geojson OGRGeoJSON'
            },
            itshp: {
                command: 'ogr2ogr -f "ESRI Shapefile" -overwrite assets/data/rude-it.shp assets/data/rude-it.geojson OGRGeoJSON'
            },
            enzip: {
                command: 'zip assets/data/rude-it.zip assets/data/rude-en.zip assets/data/rude-en.dbf assets/data/rude-en.prj assets/data/rude-en.shx assets/data/rude-en.shp'
            },
            itzip: {
                command: 'zip assets/data/rude-en.zip assets/data/rude-it.zip assets/data/rude-it.dbf assets/data/rude-it.prj assets/data/rude-it.shx assets/data/rude-it.shp'
            }
        },
        cssmin: {
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: 'assets/css',
                        src: ['*.css', '!*.min.css'],
                        dest: 'assets/css',
                        ext: '.min.css'
                    }
                ]
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
                tasks: ['jshint', 'concat', 'uglify:' + target]
            },
            sass: {
                files: ['src/sass/*'],
                tasks: ['sass', 'cssmin']
            },
            json: {
                files: ['src/data/*.geojson'],
                tasks: ['jsonmin']
            },
            shape: {
                files: ['assets/data/*.geojson'],
                tasks: ['shell']
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
    grunt.registerTask('build', ['nodsstore', 'cdndeps', 'jshint', 'concat', 'copy:csstoscss', 'copy:img', 'copy:fonts', 'jsonmin', 'shell', 'sass', 'cssmin', 'uglify:' + target]);
    grunt.registerTask('deploy', ['build', 'copy:deploy']);
};
