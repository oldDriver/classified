'use strict';

module.exports = function (grunt) {
  // Load all grunt tasks
  require('load-grunt-tasks')(grunt);
  // Show elapsed time at the end
  require('time-grunt')(grunt);

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
      '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
      '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
      ' Licensed MIT */\n',
    // Task configuration.
    clean: {
      files: ['dist', 'test/coverage', 'test/report']
    },
    copy: {
      main: {
        files: [
          { expand: true, cwd: 'scripts/', src:['*'], dest: 'dist/' }
        ]
      }
    },
    //concat: {
    //  options: {
    //    banner: '<%= banner %>',
    //    stripBanners: true
    //  },
    //  dist: {
    //    src: ['scripts/**/*.js'],
    //    dest: 'dist/<%= pkg.name %>.js'
    //  }
    //},
    uglify: {
      options: {
        banner: '<%= banner %>'
      },
      dist: {
        src: 'dist/main.js',
        dest: 'dist/main.min.js'
      }
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      gruntfile: {
        src: 'Gruntfile.js'
      },
      scripts: {
        src: ['scripts/**/*.js']
      },
      test: {
        src: ['test/**/*-test.js']
      }
    },
    bump: {
      options: {
        files: ['package.json', 'bower.json'],
        //updateConfigs: [],
        commit: true,
        commitMessage: 'Release v%VERSION%',
        commitFiles: ['package.json', 'bower.json'],
        createTag: true,
        tagName: '%VERSION%',
        tagMessage: 'Version %VERSION%',
        push: true,
        pushTo: 'origin master',
        gitDescribeOptions: '--tags --always --abbrev=1 --dirty=-d',
        globalReplace: false
      }
    },
    connect: {
      server: {
        options: {
          hostname: 'localhost',
          port: 9000,
          livereload: true
        }
      }
    },
    karma: {
      options: {
        configFile: 'karma.conf.js'
      },
      unit: {
        background: true
      },
      report: {
        singleRun: true,
        // start these browsers
        browsers: ['Chrome'],//, 'Chrome', 'Opera', 'ChromeCanary', 'Firefox', 'Safari', 'PhantomJS'],
        reporters: ['progress', 'html', 'coverage']
      }
    },
    watch: {
      options: {
        livereload: true
      },
      html: {
        files: ['addToIndex.html']
      },
      styles: {
        files: ['styles/**/*.css']
      },
      karma: {
        files: [      // include dependencies
		  'scripts/**/*.js',
		  'test/**/*-test.js'],
        tasks: ['karma:unit:run']
      }
    }
  });

  // Making grunt default to force so it won't die on jshint warnings
  grunt.option('force', true);

  // Default task.
  grunt.registerTask('default', ['clean', 'jshint', 'karma:unit', 'server']);
  grunt.registerTask('server', ['connect', 'watch']);
  grunt.registerTask('report', ['clean', 'jshint', 'karma:report']);
  grunt.registerTask('release', ['clean', 'jshint', 'copy', 'uglify']);
};
