// Generated on 2016-05-11 using generator-angular 0.15.1
'use strict';
// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'
module.exports = function(grunt) {
    // Time how long tasks take. Can help when optimizing build times
    require('time-grunt')(grunt);
    // Automatically load required Grunt tasks
    require('jit-grunt')(grunt, {
        'closure-compiler': 'grunt-closure-compiler',
        eslint: 'gruntify-eslint',
        lesslint: 'grunt-lesslint',
        todos: 'grunt-todos',
        phplint: 'grunt-phplint',
        phpdcd: 'grunt-phpdcd',
        phpcs: 'grunt-phpcs',
        phpcsfixer: 'grunt-php-cs-fixer',
        jsbeautifier: 'grunt-jsbeautifier',
        'regex-replace': 'grunt-regex-replace',
        manifest: 'grunt-manifest',
        lineending: 'grunt-lineending',
        exec: 'grunt-exec',
        plato: 'grunt-plato',
        complexity: 'grunt-complexity',
        useminPrepare: 'grunt-usemin',
        ngtemplates: 'grunt-angular-templates',
        cdnify: 'grunt-google-cdn',
        compress: 'grunt-contrib-compress',
        sftp: 'grunt-ssh',
        ngdocs: 'grunt-ngdocs',
        phpdocumentor: 'grunt-phpdocumentor',
        sshexec: 'grunt-ssh',
        multi: 'grunt-multi',
        'multi-single': 'grunt-multi',
        'sftp-deploy': 'grunt-sftp-deploy',
        i18nextract: 'grunt-angular-translate',
        convert: 'grunt-less-to-sass'
    });
    // Configurable paths for the application
    var appConfig = {
        app: require('./bower.json')
            .appPath || 'app',
        dist: 'dist/client'
    };
    // Define the configuration for all the tasks
    grunt.initConfig({
        // Project settings
        yeoman: appConfig,
        // Watches files for changes and runs tasks based on the changed files
        watch: {
            bower: {
                files: ['bower.json'],
                tasks: ['wiredep']
            },
            js: {
                files: ['<%= yeoman.app %>/scripts/{,*/}*.js'],
                tasks: ['newer:jshint:all', 'newer:jscs:all'],
                options: {
                    livereload: '<%= connect.options.livereload %>'
                }
            },
            jsTest: {
                files: ['test/spec/{,*/}*.js'],
                tasks: ['newer:jshint:test', 'newer:jscs:test', 'karma']
            },
            styles: {
                files: ['<%= yeoman.app %>/styles/{,*/}*.css'],
                tasks: ['newer:copy:styles', 'postcss']
            },
            gruntfile: {
                files: ['Gruntfile.js']
            },
            livereload: {
                options: {
                    livereload: '<%= connect.options.livereload %>'
                },
                files: [
          '<%= yeoman.app %>/{,*/}*.html',
          '.tmp/styles/{,*/}*.css',
          '<%= yeoman.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
        ]
            }
        },
        // The actual grunt server settings
        connect: {
            options: {
                port: 9000,
                // Change this to '0.0.0.0' to access the server from outside.
                hostname: 'localhost',
                livereload: 35729
            },
            livereload: {
                options: {
                    open: true,
                    middleware: function(connect) {
                        return [
              connect.static('.tmp'),
              connect()
                            .use('/bower_components', connect.static('./bower_components')),
              connect()
                            .use('/app/styles', connect.static('./app/styles')),
              connect.static(appConfig.app)
            ];
                    }
                }
            },
            test: {
                options: {
                    port: 9001,
                    middleware: function(connect) {
                        return [
              connect.static('.tmp'),
              connect.static('test'),
              connect()
                            .use('/bower_components', connect.static('./bower_components')),
              connect.static(appConfig.app)
            ];
                    }
                }
            },
            dist: {
                options: {
                    open: true,
                    base: '<%= yeoman.dist %>'
                }
            }
        },
        // Make sure there are no obvious mistakes
        jshint: {
            options: {
                jshintrc: '.jshintrc',
                reporter: require('jshint-stylish')
            },
            all: {
                src: [
          'Gruntfile.js',
          '<%= yeoman.app %>/scripts/{,*/}*.js'
        ]
            },
            test: {
                options: {
                    jshintrc: 'test/.jshintrc'
                },
                src: ['test/spec/{,*/}*.js']
            }
        },
        'closure-compiler': {
            frontend: {
                closurePath: '/root/closure',
                js: '<%= yeoman.app %>/scripts/{,*/}*.js',
                jsOutputFile: '<%= yeoman.dist %>/reports/closure.js',
                maxBuffer: 500,
                options: {
                    compilation_level: 'ADVANCED_OPTIMIZATIONS',
                    language_in: 'ECMASCRIPT5_STRICT'
                }
            }
        },
        // Make sure code styles are up to par
        jscs: {
            options: {
                config: '.jscsrc',
                verbose: true
            },
            all: {
                src: [
          'Gruntfile.js',
          '<%= yeoman.app %>/scripts/{,*/}*.js'
        ]
            },
            test: {
                src: ['test/spec/{,*/}*.js']
            }
        },
        // Empties folders to start fresh
        clean: {
            dist: {
                files: [{
                    dot: true,
                    src: [
            '.tmp',
            '<%= yeoman.dist %>/{,*/}*',
            '!<%= yeoman.dist %>/.git{,*/}*'
          ]
        }]
            },
            server: '.tmp'
        },
        // Add vendor prefixed styles
        postcss: {
            options: {
                processors: [
          require('autoprefixer-core')({
                        browsers: ['last 1 version']
                    })
        ]
            },
            server: {
                options: {
                    map: true
                },
                files: [{
                    expand: true,
                    cwd: '.tmp/styles/',
                    src: '{,*/}*.css',
                    dest: '.tmp/styles/'
        }]
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: '.tmp/styles/',
                    src: '{,*/}*.css',
                    dest: '.tmp/styles/'
        }]
            }
        },
        // Automatically inject Bower components into the app
        wiredep: {
            options: {
                exclude: [/ng-admin/, 'bower_components/bootstrap/dist/css/bootstrap.css', 'bower_components/angular-google-places-autocomplete/dist/autocomplete.min.css', 'bower_components/angular-google-places-autocomplete/dist/autocomplete.min.js']
            },
            app: {
                src: ['<%= yeoman.app %>/index.html'],
                ignorePath: /\.\.\//
            },
            test: {
                devDependencies: true,
                src: '<%= karma.unit.configFile %>',
                ignorePath: /\.\.\//,
                fileTypes: {
                    js: {
                        block: /(([\s\t]*)\/{2}\s*?bower:\s*?(\S*))(\n|\r|.)*?(\/{2}\s*endbower)/gi,
                        detect: {
                            js: /'(.*\.js)'/gi
                        },
                        replace: {
                            js: '\'{{filePath}}\','
                        }
                    }
                }
            }
        },
        // Renames files for browser caching purposes
        filerev: {
            dist: {
                src: [
          '<%= yeoman.dist %>/scripts/{,*/}*.js',
          '<%= yeoman.dist %>/styles/{,*/}*.css',
          '<%= yeoman.dist %>/styles/fonts/*'
        ]
            }
        },
        // Reads HTML for usemin blocks to enable smart builds that automatically
        // concat, minify and revision files. Creates configurations in memory so
        // additional tasks can operate on them
        useminPrepare: {
            html: '<%= yeoman.app %>/index.html',
            options: {
                dest: '<%= yeoman.dist %>',
                flow: {
                    html: {
                        steps: {
                            js: ['concat', 'uglifyjs'],
                            css: ['cssmin']
                        },
                        post: {}
                    }
                }
            }
        },
        // Performs rewrites based on filerev and the useminPrepare configuration
        usemin: {
            html: ['<%= yeoman.dist %>/{,*/}*.html', '<%= yeoman.app %>/ag-admin/index.html'],
            css: ['<%= yeoman.dist %>/styles/{,*/}*.css'],
            js: ['<%= yeoman.dist %>/scripts/{,*/}*.js'],
            options: {
                assetsDirs: [
          '<%= yeoman.dist %>',
          '<%= yeoman.dist %>/images',
          '<%= yeoman.dist %>/styles'
        ],
                patterns: {
                    js: [[/(images\/[^''""]*\.(png|jpg|jpeg|gif|webp|svg))/g, 'Replacing references to images']]
                }
            }
        },
        // The following *-min tasks will produce minified files in the dist folder
        // By default, your `index.html`'s <!-- Usemin block --> will take care of
        // minification. These next options are pre-configured if you do not wish
        // to use the Usemin blocks.
        cssmin: {
            admin: {
                files: {
                    '<%= yeoman.app %>/ag-admin/styles/admin.cache.css': [
             '<%= yeoman.app %>/ag-admin/styles/admin.cache.css'
           ]
                }
            }
        },
        uglify: {
            options: {
                mangle: false
            },
            generated: {
                files: [{
                    dest: '<%= yeoman.dist %>/js/app.js',
                    src: ['.tmp/concat/js/app.js']
		   }]
            },
            admin: {
                files: {
                    '<%= yeoman.app %>/ag-admin/scripts/admin.cache.js': [
             '<%= yeoman.app %>/ag-admin/scripts/admin.cache.js'
           ]
                }
            }
        },
        concat: {
            'admin-css': {
                src: ['bower_components/ng-admin/build/ng-admin.min.css', 'bower_components/angular-google-places-autocomplete/src/autocomplete.css', '<%= yeoman.app %>/ag-admin/css/custom.css'],
                dest: '<%= yeoman.app %>/ag-admin/styles/admin.cache.css'
            },
            'admin-js': {
                src: ['bower_components/ng-admin/build/ng-admin.min.js', 'bower_components/angular-http-auth/src/http-auth-interceptor.js', 'bower_components/angular-resource/angular-resource.js', 'bower_components/angular-md5/angular-md5.js', 'bower_components/angular-bootstrap/ui-bootstrap-tpls.js', 'bower_components/angular-filter/dist/angular-filter.min.js', 'bower_components/angular-cookies/angular-cookies.js', '<%= yeoman.app %>/ag-admin/scripts/ng-admin.app.js', '<%= yeoman.app %>/ag-admin/scripts/services/admin_token_service.js', '<%= yeoman.app %>/ag-admin/scripts/services/oauth_token_injector.js', '<%= yeoman.app %>/ag-admin/scripts/services/interceptor.js', '<%= yeoman.app %>/ag-admin/scripts/services/stats.js', '<%= yeoman.app %>/ag-admin/scripts/controllers/users_login.js', '<%= yeoman.app %>/ag-admin/scripts/controllers/users_logout.js', '<%= yeoman.app %>/ag-admin/scripts/controllers/stat.js'],
                dest: '<%= yeoman.app %>/ag-admin/scripts/admin.cache.js'
            }
        },
        imagemin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.app %>/images',
                    src: '{,*/}*.{png,jpg,jpeg,gif}',
                    dest: '<%= yeoman.dist %>/images'
        }]
            }
        },
        svgmin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.app %>/images',
                    src: '{,*/}*.svg',
                    dest: '<%= yeoman.dist %>/images'
        }]
            }
        },
        htmlmin: {
            dist: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true,
                    conservativeCollapse: true,
                    collapseBooleanAttributes: true,
                    removeCommentsFromCDATA: true
                },
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.dist %>',
                    src: ['*.html'],
                    dest: '<%= yeoman.dist %>'
        }]
            }
        },
        ngtemplates: {
            dist: {
                options: {
                    module: 'SnsApp',
                    htmlmin: '<%= htmlmin.dist.options %>',
                    usemin: 'scripts/scripts.js'
                },
                cwd: '<%= yeoman.app %>',
                src: 'views/{,*/}*.html',
                dest: '.tmp/templateCache.js'
            }
        },
        // ng-annotate tries to make the code safe for minification automatically
        // by using the Angular long form for dependency injection.
        ngAnnotate: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '.tmp/concat/scripts',
                    src: '*.js',
                    dest: '.tmp/concat/scripts'
        }]
            }
        },
        // Replace Google CDN references
        cdnify: {
            dist: {
                html: ['<%= yeoman.dist %>/*.html']
            }
        },
        // Copies remaining files to places other tasks can use
        copy: {
            build: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= yeoman.app %>',
                    dest: '<%= yeoman.dist %>',
                    src: [
            'ag-admin/*.*', 'ag-admin/scripts/admin.cache.js', 'ag-admin/styles/admin.cache.css', 'ag-admin/views/**/*.*'
          ]
        }, {
                    expand: true,
                    dot: true,
                    cwd: '../',
                    dest: '<%= yeoman.dist %>',
                    src: [
            'api_explorer/**/*.*'
          ]
        }, {
                    expand: true,
                    dot: true,
                    cwd: '../',
                    dest: '<%= yeoman.dist %>/docs',
                    src: [
            'docs/book.*'
          ]
        }, {
                    expand: true,
                    dot: true,
                    cwd: '../docs/_book',
                    dest: '<%= yeoman.dist %>/docs',
                    src: [
            '*.*', 'gitbook/**/*.*', '*.*', 'img/**/*.*'
          ]
        }, {
                    expand: true,
                    dot: true,
                    cwd: '../docs/_book',
                    dest: '<%= yeoman.dist %>/docs/docs',
                    src: [
            'img/**/*.*'
          ]
        }, {
                    expand: true,
                    dot: true,
                    cwd: '../',
                    dest: 'dist',
                    src: [
            'tmp/.*', 'media/.*', 'server/php'
          ]
        }]
            },
            dist: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= yeoman.app %>',
                    dest: '<%= yeoman.dist %>',
                    src: [
            '*.{ico,png,txt}',
            '*.html',
            'images/{,*/}*.{webp}',
            'styles/fonts/{,*/}*.*'
          ]
        }, {
                    expand: true,
                    cwd: '.tmp/images',
                    dest: '<%= yeoman.dist %>/images',
                    src: ['generated/*']
        }, {
                    expand: true,
                    cwd: 'bower_components/bootstrap/dist',
                    src: 'fonts/*',
                    dest: '<%= yeoman.dist %>'
        }]
            },
            styles: {
                expand: true,
                cwd: '<%= yeoman.app %>/styles',
                dest: '.tmp/styles/',
                src: '{,*/}*.css'
            }
        },
        // Run some tasks in parallel to speed up the build process
        concurrent: {
            server: [
        'copy:styles'
      ],
            test: [
        'copy:styles'
      ],
            dist: [
        'copy:styles',
        'imagemin',
        'svgmin'
      ]
        },
        // Compiles your LESS files, runs the generated CSS through CSS Lint, and outputs the offending LESS line for any CSS Lint errors found.
        lesslint: {
            app: {
                src: '<%= yeoman.app %>/styles/bootstrap.less'
            }
        },
        // Validate files with ESLint
        eslint: {
            src: [
          'Gruntfile.js',
          '<%= yeoman.app %>/scripts/{,*/}*.js'
        ]
        },
        // Handles our LESS compilation and uglification automatically. Only our 'main.less' file is included in compilation; all other files must be imported from this file.
        less: {
            compile: {
                files: {
                    '<%= yeoman.app %>/styles/bootstrap.css': '<%= yeoman.app %>/styles/bootstrap.less'
                },
                options: {
                    cleancss: true,
                    compress: true
                }
            }
        },
        // For finding todos/fixme in code
        todos: {
            options: {
                verbose: false
            },
            '<%= yeoman.dist %>/todos.html': ['../server/php/**/*.php', '<%= yeoman.app %>/scripts/{,*/}*.js', '<%= yeoman.app %>/styles/{,*/}*.less', '<%= yeoman.app %>/views/{,*/}*.html']
        },
        // For running phplint on your php files
        phplint: {
            all: ['../server/php/*.php', '../server/php/shell/*.php', '../server/php/libs/*.php', '../server/php/Slim/public/*.php', '../server/php/Slim/lib/**/*.php']
        },
        // It scans a PHP project for all declared functions and methods and reports those as being "dead code" that are not called at least once.
        phpdcd: {
            app: {
                dir: ['../server/php/']
            },
            options: {
                exclude: ['vendor', 'vendors']
            }
        },
        // Script that tokenizes PHP, JavaScript and CSS files to detect violations of a defined coding standard
        phpcs: {
            app: {
                src: ['../server/php/*.php', '../server/php/shell/*.php', '../server/php/libs/*.php', '../server/php/Slim/public/*.php', '../server/php/Slim/lib/*.php', '../server/php/Slim/lib/Models/*.php']
            },
            options: {
                standard: 'PSR2'
            }
        },
        // For PHP Coding Standards Fixer
        phpcsfixer: {
            app: {
                dir: ['../server/php/*.php', '../server/php/shell/*.php', '../server/php/libs/*.php', '../server/php/Slim/public/*.php', '../server/php/Slim/lib/*.php', '../server/php/Slim/lib/Models/*.php']
            },
            options: {
                bin: '../server/php/Slim/vendor/bin/php-cs-fixer',
                ignoreExitCode: true,
                level: 'psr2',
                quiet: true
            }
        },
        // Verify & format HTML, LESS & JS source files
        jsbeautifier: {
            options: {
                js: {
                    breakChainedMethods: true,
                    keepArrayIndentation: true,
                    preserveNewlines: false,
                    endWithNewline: false
                },
                html: {
                    preserveNewlines: false
                }
            },
            app: {
                src: ['Gruntfile.js', '<%= yeoman.app %>/**/*.js', '<%= yeoman.app %>/**/*.html']
            },
            'pre-merge': {
                src: ['<%= yeoman.app %>/**/*.js', "!<%= yeoman.app %>/ag-admin/scripts/admin.cache.js"],
                options: {
                    mode: 'VERIFY_ONLY'
                }
            }
        },
        // Search and replace text content of files based on regular expression patterns
        'regex-replace': {
            app: {
                src: ['<%= yeoman.dist %>/index.html', '../server/php/config.inc.php'],
                actions: [{
                    name: 'Debug Mode',
                    search: '\'R_DEBUG\'\, true',
                    replace: '\'R_DEBUG\'\, false',
                    flags: 'g'
                }, {
                    name: 'DB Name',
                    search: '\'R_DB_NAME\'\, \'.*\'',
                    replace: '\'R_DB_NAME\'\, \'<%= config.db_name %>\'',
                    flags: 'g'
                }, {
                    name: 'DB User',
                    search: '\'R_DB_USER\'\, \'.*\'',
                    replace: '\'R_DB_USER\'\, \'<%= config.db_user %>\'',
                    flags: 'g'
                }, {
                    name: 'DB Password',
                    search: '\'R_DB_PASSWORD\'\, \'.*\'',
                    replace: '\'R_DB_PASSWORD\'\, \'<%= config.db_password %>\'',
                    flags: 'g'
                }, {
                    name: 'Manifest Replace',
                    search: '<html>',
                    replace: '<html manifest="default.appcache">',
                    flags: 'g'
			}]
            }
        },
        // Generate HTML5 Cache Manifest files
        manifest: {
            app: {
                options: {
                    basePath: '<%= yeoman.dist %>',
                    timestamp: true,
                    hash: true
                },
                src: [
				'assets/img/*.*',
				'assets/css/default.cache.*.css',
				'assets/js/default.cache.*.js',
				'assets/fonts/*.*',
				'*.*'
			],
                dest: '<%= yeoman.dist %>/default.appcache'
            }
        },
        // Convert line ending in shell script files
        lineending: {
            dist: {
                options: {
                    eol: 'lf',
                    overwrite: true
                },
                files: [{
                    expand: true,
                    cwd: '../',
                    src: ['server/php/shell/*.sh']
			}]
            }
        },
        i18nextract: {
            // Getting all translate key to json files
            default_language: {
                suffix: '.json',
                src: ['app/index.html', 'app/scripts/**/*.*', 'app/views/*.*'],
                lang: ['en', 'ja', 'tr'],
                defaultLang: 'en',
                dest: 'app/scripts/l10n'
            },
            // For filling dafault english value to fr_FR and ja-JP's value
            default_exists_i18n: {
                suffix: '.json',
                nullEmpty: true,
                src: ['app/index.html', 'app/scripts/**/*.*', 'app/views/*.*'],
                lang: ['fr', 'ja'],
                dest: 'app/scripts/l10n/',
                source: 'app/scripts/l10n/en.json' // Use to generate different output file
            },
        },
        // Execute php beautify, composer install & gitbook build commands
        exec: {
            beautify: {
                cmd: [
				'php builds/beautifier.php ../server/php'
			].join('&&')
            },
            composer: {
                cmd: [
				'cd ../server/php/Slim',
				'composer install'
			].join('&&')
            },
            gitbook: {
                cmd: [
				'cd ../docs',
				'gitbook build',
                'gitbook mobi',
                'gitbook epub',
                'gitbook pdf'
			].join('&&')
            }
        },
        // Generate complexity analysis reports with plato
        plato: {
            app: {
                files: {
                    '<%= yeoman.dist %>/reports': '<%= yeoman.app %>/scripts/{,*/}*.js'
                }
            }
        },
        // Evaluates code maintainability using Halstead and Cyclomatic metrics.
        complexity: {
            app: {
                src: '<%= yeoman.app %>/scripts/{,*/}*.js',
                options: {
                    breakOnErrors: false
                }
            }
        },
        // Compress files and folders
        compress: {
            app: {
                options: {
                    archive: 'build.zip'
                },
                files: [
                    {
                        expand: true,
                        cwd: '<%= yeoman.dist %>/',
                        src: ['**/*.*'],
                        dest: 'client/'
                    },
                    {
                        expand: true,
                        cwd: '<%= yeoman.app %>/ag-admin',
                        src: ['index.html', 'scripts/admin.cache.js', 'styles/admin.cache.css', 'views/*.html'],
                        dest: 'client/ag-admin'
                    },
                    {
                        expand: true,
                        cwd: '../api_explorer',
                        src: ['**/*.*'],
                        dest: 'client/api_explorer'
                    },
                    {
                        expand: true,
                        cwd: '../docs',
                        src: ['book.*'],
                        dest: 'client/docs/'
                    },
                    {
                        expand: true,
                        cwd: '../docs/_book',
                        src: ['gitbook/**/*.*', '*.html', '*.json'],
                        dest: 'client/docs/'
                    },
                    {
                        expand: true,
                        cwd: '../docs/_book',
                        src: ['img/**/*.*'],
                        dest: 'client/docs/docs/'
                    },
                    {
                        expand: true,
                        cwd: '../tmp',
                        src: ['**/.*'],
                        dest: 'tmp/'
                    },
                    {
                        expand: true,
                        cwd: '../media',
                        src: ['**/.*'],
                        dest: 'media/'
                    },
                    {
                        expand: true,
                        cwd: '../server/php',
                        src: ['**'],
                        dest: 'server/php'
                    }
			]
            }
        },
        // Copies one or more files to a remote server over ssh.
        sftp: {
            app: {
                files: {
                    './': 'build.zip'
                },
                options: {
                    path: '<%= config.sftp_upload_path %>',
                    host: '<%= config.sftp_host %>',
                    username: '<%= config.sftp_username %>',
                    password: '<%= config.sftp_password %>'
                }
            }
        },
        // Runs a command over ssh.
        sshexec: {
            app: {
                command: ['unzip -o -d <%= config.sftp_upload_path %> <%= config.sftp_upload_path %>/build.zip', 'chmod 0777 -R <%= config.sftp_upload_path %>/tmp', 'chmod 0777 -R <%= config.sftp_upload_path %>/media', 'rm <%= config.sftp_upload_path %>/build.zip'],
                options: {
                    host: '<%= config.sftp_host %>',
                    username: '<%= config.sftp_username %>',
                    password: '<%= config.sftp_password %>'
                }
            }
        },
        // Test settings
        karma: {
            unit: {
                configFile: 'test/karma.conf.js',
                singleRun: true
            }
        },
        ngdocs: {
            all: {
                src: ['app/**/*.js'],
                title: 'API Documentation'
            }
        },
        phpdocumentor: {
            dist: {
                options: {
                    directory: '../server/php/Slim',
                    target: 'docs',
                    phar: 'builds/phpDocumentor.phar'
                }
            }
        },
        'sftp-deploy': {
            build: {
                auth: {
                    host: 'nginxpg.develag.com',
                    port: 22,
                    authKey: 'dev'
                },
                cache: 'builds/upload-cache.json',
                src: 'dist',
                dest: '/home/nginxpg/html/test',
                concurrency: 4,
                progress: true
            }
        },
        lessToSass: {
            convert: {
                files: [{
                    expand: true,
                    cwd: '/usr/share/nginx/html/sass',
                    src: ['*.less'],
                    ext: '.scss',
                    dest: '/usr/share/nginx/html/test'
            }]
            }
        }
    });
    grunt.registerTask('serve', 'Compile then start a connect web server', function(target) {
        if (target === 'dist') {
            return grunt.task.run(['build', 'connect:dist:keepalive']);
        }
        grunt.task.run([
      'clean:server',
      'wiredep',
      'concurrent:server',
      'postcss:server',
      'connect:livereload',
      'watch'
    ]);
    });
    grunt.registerTask('server', 'DEPRECATED TASK. Use the "serve" task instead', function(target) {
        grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
        grunt.task.run(['serve:' + target]);
    });
    grunt.registerTask('test', [
    'clean:server',
    'wiredep',
    'concurrent:test',
    'postcss',
    'connect:test',
    'karma'
  ]);
    grunt.registerTask('compile', [
    'clean:dist',
    'wiredep',
    'less',
    'useminPrepare',
    'concurrent:dist',
    'postcss',
    'ngtemplates',
    'concat',
    'ngAnnotate',
    'copy:dist',
    'cdnify',
    'cssmin',
    'uglify',
    'filerev',
    'usemin',
    'htmlmin',
	'regex-replace',
	'todos',
	'plato',
	'exec:gitbook',
	'exec:composer',
    //'copy:build',
	//'sftp-deploy'
    'compress',
	'sftp',
	'sshexec'
  ]);
    grunt.registerTask('default', [
    'newer:jshint',
    'newer:jscs',
    'test'
  ]);
    grunt.registerTask('build', 'Build task', function(env) {
        grunt.config.set('env', env);
        grunt.config.set('config', grunt.file.readJSON('builds/' + env + '.json'));
        grunt.task.run(['compile']);
    });
    // The task to format source files.
    grunt.registerTask('ui-format', ['jsbeautifier:app']);
    grunt.registerTask('php-format', ['exec:beautify']);
    // The task to check errors in source files. 'jshint', 
    grunt.registerTask('pre-commit', ['eslint', 'phplint', 'complexity', 'jsbeautifier:pre-merge']);
};