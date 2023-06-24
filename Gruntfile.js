/* jshint -W069 */

sass = require("sass");
module.exports = function (grunt) {
    require("load-grunt-tasks")(grunt);

    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        dirs: {
            dist: "dist/",
            site: "dist/<%= pkg.name %>/",
            data: "<%= dirs.site %>assets/data/",
            geojson: "<%= dirs.data %>geojson/",
            shp: "<%= dirs.data %>shp",
        },
        files: {
            dist: "<%= dirs.dist %><%= pkg.name %>-<%= pkg.version %>.tar.gz",
            geojson:
                "<%= dirs.data %><%= pkg.name %>-geojson-<%= pkg.version %>.tar.gz",
            shp: "<%= dirs.data %><%= pkg.name %>-shp-<%= pkg.version %>.tar.gz",
            geojsonarchive: "<%= pkg.name %>-geojson-<%= pkg.version %>.tar.gz",
            shparchive: "<%= pkg.name %>-geojson-<%= pkg.version %>.tar.gz",
        },
        clean: {
            dist: ["<%= dirs.dist %>", "src/scss/leaflet*"],
        },
        compress: {
            dist: {
                options: {
                    archive: "<%= files.dist %>",
                    mode: "tgz",
                },
                files: [
                    {
                        expand: true,
                        cwd: "<%= dirs.site %>",
                        src: ["**/*"],
                    },
                ],
            },
            geojson: {
                options: {
                    archive: "<%= files.geojson %>",
                    mode: "tgz",
                },
                files: [
                    {
                        expand: true,
                        cwd: "<%= dirs.data %>",
                        src: ["geojson/**/*"],
                    },
                ],
            },
            shp: {
                options: {
                    archive: "<%= files.shp %>",
                    mode: "tgz",
                },
                files: [
                    {
                        expand: true,
                        cwd: "<%= dirs.data %>",
                        src: ["shp/**/*"],
                    },
                ],
            },
        },
        concat: {
            js: {
                src: [
                    "node_modules/jquery/dist/jquery.js",
                    "node_modules/bootstrap-sass/assets/javascripts/bootstrap.js",
                    "node_modules/leaflet/dist/leaflet-src.js",
                    "node_modules/leaflet-providers/leaflet-providers.js",
                    "node_modules/leaflet-groupedlayercontrol/src/leaflet.groupedlayercontrol.js",
                    "node_modules/leaflet.markercluster/dist/leaflet.markercluster.js",
                    "node_modules/leaflet.locatecontrol/src/L.Control.Locate.js",
                    "node_modules/list.js/dist/list.js",
                    "node_modules/typeahead.js/dist/typeahead.bundle.js",
                    "src/js/rude.js",
                ],
                dest: "<%= dirs.site %>/assets/js/site.js",
            },
        },
        copy: {
            // html: {
            //     files: [
            //         {
            //             expand: true,
            //             cwd: 'src/html',
            //             src: '**/*.html',
            //             dest: '<%= dirs.site %>/'
            //         }
            //     ]
            // },
            edit: {
                options: {
                    process: function (content, srcpath) {
                        // fixup Leaflet image paths
                        return content.replace(
                            /images\//g,
                            "../../assets/img/"
                        );
                    },
                },
                files: [
                    {
                        expand: true,
                        cwd: "node_modules/leaflet/dist",
                        src: ["*.css"],
                        dest: "src/scss/leaflet",
                        filter: "isFile",
                        rename: function (dest, src) {
                            return dest + "/_" + src;
                        },
                        ext: ".scss",
                    },
                ],
            },
            csstoscss: {
                files: [
                    {
                        expand: true,
                        cwd: "node_modules/leaflet.locatecontrol/dist",
                        src: ["**/*.css", "!**/*.min.css"],
                        dest: "src/scss/leaflet.locatecontrol",
                        filter: "isFile",
                        ext: ".scss",
                        extDot: "last",
                        rename: function (dest, src) {
                            return dest + "/_" + src;
                        },
                    },
                    {
                        expand: true,
                        cwd: "node_modules/leaflet.markercluster/dist",
                        src: ["**/*.css", "!**/*.min.css"],
                        dest: "src/scss/leaflet.markercluster",
                        filter: "isFile",
                        ext: ".scss",
                        extDot: "last",
                        rename: function (dest, src) {
                            return dest + "/_" + src;
                        },
                    },
                    {
                        expand: true,
                        cwd: "node_modules/leaflet-groupedlayercontrol/src",
                        src: ["**/*.css", "!**/*.min.css"],
                        dest: "src/scss/leaflet.groupedlayercontrol",
                        filter: "isFile",
                        ext: ".scss",
                        extDot: "last",
                        rename: function (dest, src) {
                            return dest + "/_" + src;
                        },
                    },
                ],
            },
            fonts: {
                files: [
                    {
                        expand: true,
                        cwd: "node_modules/@fortawesome/fontawesome-free/webfonts",
                        src: ["**/*"],
                        dest: "<%= dirs.site %>/assets/webfonts/",
                        filter: "isFile",
                    },
                ],
            },
            images: {
                files: [
                    {
                        expand: true,
                        cwd: "src/img",
                        src: ["**/*"],
                        dest: "<%= dirs.site %>/assets/img",
                        filter: "isFile",
                    },
                    {
                        expand: true,
                        cwd: "node_modules/leaflet/dist/images",
                        src: ["**/*.png"],
                        dest: "<%= dirs.site %>/assets/img/",
                        filter: "isFile",
                        ext: ".png",
                    },
                ],
            },
        },
        jshint: {
            beforeconcat: ["src/js/rude.js"],
            grunt: ["Gruntfile.js"],
        },
        jsonlint: {
            dist: {
                src: ["src/data/rude-en.geojson", "src/data/rude-it.geojson"],
            },
        },
        jsonmin: {
            dist: {
                files: {
                    "<%= dirs.site %>/assets/data/geojson/rude-en.geojson":
                        "src/data/rude-en.geojson",
                    "<%= dirs.site %>/assets/data/geojson/rude-it.geojson":
                        "src/data/rude-it.geojson",
                },
            },
        },
        mkdir: {
            geojson: {
                options: {
                    create: ["<%= dirs.geojson %>"],
                },
            },
            shp: {
                options: {
                    create: ["<%= dirs.shp %>"],
                },
            },
        },
        replace: {
            html: {
                options: {
                    patterns: [
                        {
                            match: "geojson",
                            replacement: "<%= files.geojsonarchive %>",
                        },
                        {
                            match: "shp",
                            replacement: "<%= files.shparchive %>",
                        },
                    ],
                },
                files: [
                    {
                        expand: true,
                        cwd: "src/html",
                        src: "**/*.html",
                        dest: "<%= dirs.site %>/",
                    },
                ],
            },
        },
        sass: {
            options: {
                implementation: sass,
                outputStyle: "expanded",
                indentType: "tab",
                indentWidth: 1,
                includePaths: [
                    "node_modules/@fortawesome/fontawesome-free/scss",
                    "node_modules/bootstrap-sass/assets/stylesheets",
                    "src/scss",
                    "src/scss/leaflet",
                    "src/scss/leaflet.locatecontrol",
                    "src/scss/leaflet.markercluster",
                    "src/scss/leaflet.groupedlayercontrol",
                ],
            },
            site: {
                files: {
                    "<%= dirs.site %>/assets/css/site.css":
                        "src/scss/rude.scss",
                },
            },
        },
        shell: {
            enshp: {
                command:
                    'ogr2ogr -f "ESRI Shapefile" -overwrite <%= dirs.site %>/assets/data/shp/rude-en.shp <%= dirs.site %>/assets/data/geojson/rude-en.geojson -lco ENCODING=UTF-8',
            },
            itshp: {
                command:
                    'ogr2ogr -f "ESRI Shapefile" -overwrite <%= dirs.site %>/assets/data/shp/rude-it.shp <%= dirs.site %>/assets/data/geojson/rude-it.geojson -lco ENCODING=UTF-8',
            },
        },
        watch: {
            options: {
                livereload: true,
            },
            grunt: {
                files: ["Gruntfile.js", "package.json"],
                tasks: ["clean", "build"],
            },
            geojson: {
                files: ["src/data/**/*.geojson"],
                tasks: [
                    "jsonlint",
                    "mkdir:geojson",
                    "mkdir:shp",
                    "jsonmin",
                    "shell",
                    "compress:geojson",
                    "compress:shp",
                ],
            },
            html: {
                files: ["src/html/**/*.html"],
                tasks: ["replace:html"],
            },
            sass: {
                files: ["src/scss/**/*.scss"],
                tasks: ["sass"],
            },
            images: {
                files: ["src/img/**/*"],
                tasks: ["copy:images"],
            },
            js: {
                files: ["src/js/*.js"],
                tasks: ["jshint", "concat:js"],
            },
        },
    });

    grunt.registerTask("default", [
        "openport:watch.options.livereload:35729",
        "watch",
    ]);
    grunt.registerTask("build", [
        "nodsstore",
        "mkdir",
        "jshint",
        "concat",
        "copy",
        "replace",
        "jsonlint",
        "jsonmin",
        "sass",
        "shell",
        "compress:geojson",
        "compress:shp",
    ]);
    grunt.registerTask("rebuild", ["clean", "build"]);
    grunt.registerTask("dist", ["rebuild", "compress:dist"]);
    grunt.registerTask("nodsstore", function () {
        grunt.file
            .expand(
                {
                    filter: "isFile",
                    cwd: ".",
                },
                ["**/.DS_Store"]
            )
            .forEach(function (file) {
                grunt.file.delete(file);
            });
    });
};
