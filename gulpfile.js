'use strict';

var gulp = require('gulp');
var del = require('del');
var path = require('path');
var args = require('yargs').argv;
var config = require('./gulp.config.js')();
var $ = require('gulp-load-plugins')({lazy: true});
var minifyCSS = require('gulp-minify-css');
var concatCSS = require('gulp-concat-css');
var browserify = require('browserify')(config.clientApp + 'app.js'); 
var reactify = require('reactify'); 
var watchify = require('watchify');
var source = require('vinyl-source-stream');
var bs = require('browser-sync');
var reload = bs.reload;

 /*jshint -W079 */
// var port = process.env.PORT || config.defaultPort;

// provides a list of all tasks in gulpfile
gulp.task('help', $.taskListing);

// runs the 'browser-sync' task by default
gulp.task('default', ['browser-sync'], function(){
  // watches for changes to js files and runs necessary tasks
    gulp.watch([config.alljs, config.index, config.css], ['build', bs.reload]);
  
});

// checks code syntax and style with JSHint and JSCS
gulp.task('vet', function() {
  console.log('Analyzing source with JSHint and JSCS');

  return gulp
      // reads all js files into the stream
      .src(config.alljs) // TODO: include server js 
      // prints all files being piped through the stream
      .pipe($.if(args.verbose, $.print()))
      // compiles all jsx files into js files
      .pipe($.react())
      // lints code style to enforce style guide
      .pipe($.jscs())
      .pipe($.jshint())
      // adds formatting to the jshint log
      .pipe($.jshint.reporter('jshint-stylish', {verbose: true}))
      // outputs 'fail' to the console
      .pipe($.jshint.reporter('fail'));
});

// checks code syntax and style with JSHint and JSCS
gulp.task('vetserver', function() {
  console.log('Analyzing source with JSHint and JSCS');

  return gulp
      // reads all js files into the stream
      .src(config.allserverjs) // TODO: include server js 
      // prints all files being piped through the stream
      .pipe($.if(args.verbose, $.print()))
      // lints code style to enforce style guide
      .pipe($.jscs())
      .pipe($.jshint())
      // adds formatting to the jshint log
      .pipe($.jshint.reporter('jshint-stylish', {verbose: true}))
      // outputs 'fail' to the console
      .pipe($.jshint.reporter('fail'));
});

// run gulp clean prior to each dist to delete the previous dist
gulp.task('clean', function() {
    gulp.src([config.dist + '*', config.clientApp + 'bundle*', config.client + 'styles/styles.css'])
      .pipe($.clean({force: true}));
});

// concatenates all css files 
gulp.task('concat-css', function() {
  return gulp
      .src(config.css)
      .pipe(concatCSS('styles.css'))
      .pipe(gulp.dest(config.clientStyles));
});

// minifies the css file compiled from less
gulp.task('optimize:css', ['concat-css'], function() {
  return gulp
      .src(config.clientStyles + 'styles.css')
      .pipe(minifyCSS())
      .pipe($.rename('styles.min.css'))
      .pipe(gulp.dest(config.distStyles));
});

// transforms jsx into js and bundles code
gulp.task('bundle', function(){
  browserify.transform(reactify); // use the reactify transform
  return browserify.bundle()
    .pipe(source('bundle.js'))
    .pipe(gulp.dest(config.clientApp))
    .pipe(gulp.dest(config.dist));
});

// minifies bundled client code
gulp.task('optimize:js', ['bundle'], function() {
  return gulp.src([config.clientApp + 'bundle.js', config.clientApp + 'autocomplete.js'])
      .pipe($.uglify())
      .pipe($.rename('bundle.min.js'))
      .pipe(gulp.dest(config.clientApp))
      .pipe(gulp.dest(config.dist))
});


// copies bower components from development folder to the distributable folder
gulp.task('copy-bower-components', function () {
  gulp.src(config.client + 'bower_components/**')
    .pipe(gulp.dest(config.dist + 'bower_components'));
});

// copies html files from development folder to the distributable folder
gulp.task('copy-html-file', function () {
  gulp.src(config.index)
    .pipe(gulp.dest(config.dist));
});

gulp.task('copy-image-files', function () {
  gulp.src(config.client + 'images/**/*')
    .pipe(gulp.dest(config.dist + 'images/'));
});

// gulp.task('copy-font-files', function () {
//   gulp.src(config.client + 'styles/fonts/*')
//     .pipe(gulp.dest(config.dist + 'fonts'));
// });

// gulp.task('copy-autocomplete-file', function () {
//   gulp.src(config.clientApp + 'autocomplete.js')
//     .pipe(gulp.dest(config.dist));
// });

gulp.task('copy-languagejson-file', function () {
  gulp.src(config.clientApp + 'html-languages.json')
    .pipe(gulp.dest(config.dist));
});

gulp.task('copy-countryjson-file', function () {
  gulp.src(config.clientApp + 'html-countries.json')
    .pipe(gulp.dest(config.dist));
});

// injects client js dependencies into HTML
gulp.task('wiredep', function() {
  var options = config.getWiredepDefaultOptions();
  var wiredep = require('wiredep').stream;
  return gulp
      // reads the index.html file
      .src(config.index)
      // checks Bower components and injects into config.index
      .pipe(wiredep(options))
      // takes bundled js file and injects into config.index
      .pipe($.inject(gulp.src(config.clientApp + 'bundle.js')))
      // writes transformed config.index to folder
      .pipe(gulp.dest(config.client));
});

// injects css dependencies into HTML
gulp.task('inject', ['bundle','wiredep'], function() {
    console.log('Wire up the app css into the html, and call wiredep ');

    return gulp
        .src(config.index)
        .pipe($.inject(gulp.src(config.css))) // NOTE: update src path, if using a css compiler
        .pipe($.replace('styles/styles.css', './styles.min.css'))
        .pipe($.replace('./app/bundle.js', './bundle.min.js'))
        .pipe($.replace('dist/jquery.js', 'dist/jquery.min.js'))
        .pipe($.replace('react/react.js', 'react/react.min.js'))
        .pipe($.replace('javascripts/bootstrap.js', 'javascripts/bootstrap.min.js'))
        .pipe($.replace('react-bootstrap/react-bootstrap.js', 'react-bootstrap/react-bootstrap.min.js'))
        .pipe($.replace('d3/d3.js', 'd3/d3.min.js'))
        .pipe($.replace('dist/datamaps.all.js', 'dist/datamaps.all.min.js'))
        .pipe(gulp.dest(config.dist));
});

gulp.task('build', function(){
  $.runSequence(
    ['inject', 
    // 'vet',
    'optimize:css', 
    'optimize:js', 
    'copy-html-file',
    'copy-bower-components',
    'copy-image-files',
    'copy-languagejson-file',
    'copy-countryjson-file'
    ]);
});

// runs nodemon
gulp.task('serve', function() {
  $.nodemon({
    script: 'server/server.js', 
    ignore: 'node_modules/**/*.js'
  });
});

// refreshes the browser in response to changes
gulp.task('browser-sync', function() {
  bs({
    server: "dist",
    notify: true
    // injectChanges: true,
    // files: [config.client + '**/*.js', config.css, config.index]
  });
});


// gulp plugin for the Jest test library
gulp.task('test', ['vet', 'browserify-client'], function () {
    return gulp
        .src(config.clientTests)
        .pipe($.jest({
        scriptPreprocessor: "./spec/support/preprocessor.js",
        unmockedModulePathPatterns: [
            "node_modules/react"
        ],
        testDirectoryName: "spec",
        testPathIgnorePatterns: [
            "node_modules",
            "spec/support"
        ],
        moduleFileExtensions: [
            "js",
            "json",
            "react"
        ]
    }));
});
