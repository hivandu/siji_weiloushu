// Task order
// Process: copy -> less -> autoprefixer -> cssmin -> concat -> uglify -> injector -> string-replace -> watch

module.exports = function (grunt){
    // auto-load npm task components
    require("load-grunt-tasks")(grunt);

    grunt.initConfig({
        pkg: grunt.file.readJSON('./package.json'),

        // clean directory
        clean: {
            build: ["dist"]
        },

        // copy file to dist directory
        copy: {
            build: {
                files: [
                    {
                        src: ['assets/images/*', 'assets/img2/*', 'assets/audio/*', '*.html'],
                        dest: 'dist/',
                        expand: true
                    }
                ]
            }
        },

        // less compiler
        less: {
            build: {
                expand: true,
                cwd: 'assets/stylesheets/',
                src: ['*.less'],
                dest: 'dist/assets/stylesheets',
                ext: '.css'
            }
        },

        autoprefixer: {
            options: {
                // Task-specific options go here.
            },
            build: {
                // Target-specific file lists and/or options go here.
                expand: true,
                flatten: true,
                src: 'dist/assets/stylesheets/*.css',
                dest: 'dist/assets/stylesheets/'
            }
        },

        // concat and compressor css
        cssmin: {
            build: {
                files: [{
                    'dist/assets/stylesheets/main.min.css': [
                        'assets/stylesheets/animation.css',
                        'assets/stylesheets/swiper.min.css',
                        'assets/stylesheets/jquery.bxslider.css',
                        'dist/assets/stylesheets/main.css'
                    ]
                }]
            }
        },

        // concat js
        concat: {
            build: {
                src: [
                    'assets/scripts/jquery-2.1.3.min.js',
                    'assets/scripts/jquery.smoothZoom.min.js',
                    'assets/scripts/fastclick.js',
                    'assets/scripts/swiper.js',
                    'assets/scripts/jquery.bxslider.min.js',
                    'assets/scripts/main.js',
                    'assets/scripts/stone.js',
                    'assets/scripts/wave.js',
                    'assets/scripts/textures.js',
                    'assets/scripts/picture.js'
                ],
                dest:'dist/assets/scripts/main.js'
            }
        },

        // compressor js
        uglify: {
            build: {
                src:['dist/assets/scripts/main.js'],
                dest:'dist/assets/scripts/main.min.js'
            }
        },

        // injector js and css files to html
        injector: {
            options: {
                // Task-specific options go here.
            },
            css: {
                options: {
                    relative: true,
                    transform: function (filePath){
                        var filePath = filePath.replace('/dist/', '');
                        return '<link rel="stylesheet" href="' + filePath + '" />';
                    },
                    starttag: '<!-- injector:css -->',
                    endtag: '<!-- endinjector -->'
                },
                files: {
                    'dist/index.html': ['dist/assets/stylesheets/main.min.css']
                }
            },
            scripts: {
                options: {
                    relative: true,
                    transform: function (filePath){
                        var filePath = filePath.replace('/dist/', '');
                        return '<script src="' + filePath + '"></script>';
                    },
                    starttag: '<!-- injector:js -->',
                    endtag: '<!-- endinjector -->'
                },
                files: {
                    'dist/index.html': ['dist/assets/scripts/main.min.js']
                }
            }
        },

        'string-replace': {
            deploy: {
                files: [{
                    expand: true,
                    cwd: 'dist/',
                    src: '*.html',
                    dest: 'dist/'
                }],
                options: {
                    replacements: [
                        {
                            //  remove livereload
                            pattern: /<script src="\/\/localhost:35729\/livereload.js"><\/script>/ig,
                            replacement: ''
                        },
                        {
                            //  remove less compiler
                            pattern: /<script src="assets\/scripts\/less.min.js"><\/script>/ig,
                            replacement: ''
                        },
                        {
                            //  replace link tag's rel="stylesheet/less" to rel="stylesheet"
                            pattern: /stylesheet\/less/ig,
                            replacement: 'stylesheet'
                        },
                        {
                            //  replace .less extension to .css extension
                             pattern: /.less"\/>/ig,
                            replacement: '.css"/>'
                        }]
                }
            }
        },

        watch: {
            css: {
                files: 'assets/stylesheets/**',
                options: {
                    livereload: true
                }
            },
            js: {
                files: 'assets/scripts/**',
                options: {
                    livereload: true
                }
            },
            html: {
                files: ['*.html', '**/*.html', '**/**/*.html'],
                options: {
                    livereload: true
                }
            }
        }
    });

    // define task
    grunt.registerTask('cleanDir', ['clean:build']); //ok

    grunt.registerTask('copyFileToDist', ['copy:build']); //ok
    grunt.registerTask('compileLess', ['less:build']); //ok
    grunt.registerTask('compressCss', ['cssmin:build']); //ok
    grunt.registerTask('autoPrefixer', ['autoprefixer:build']); //ok

    grunt.registerTask('concatJs', ['concat:build']); //ok
    grunt.registerTask('compressJs', ['uglify:build']); //ok
    grunt.registerTask('injectorCssAndJs', ['injector']); //ok
    grunt.registerTask('getCssSrcOrder_and_ScriptSrcOrder_via_injector', []); //ok
    grunt.registerTask('removeUnusedFile', ['string-replace:deploy']); //ok

    grunt.registerTask('generateCss', ['compileLess', 'compressCss', 'autoPrefixer']); //ok
    grunt.registerTask('generateJs', ['concatJs', 'compressJs']); //ok

    // main task
    grunt.registerTask('deploy', ['cleanDir', 'copyFileToDist', 'generateCss', 'generateJs', 'injectorCssAndJs', 'removeUnusedFile']);
    grunt.registerTask('live', ['watch']);
};