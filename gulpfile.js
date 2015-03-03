/*global require: false, module: false */

'use strict';

var browserify = require('browserify'),
    gulp       = require('gulp'),
    source     = require('vinyl-source-stream'),
    buffer     = require('vinyl-buffer'),
    uglify     = require('gulp-uglify'),
    sourcemaps = require('gulp-sourcemaps'),
    ts         = require('gulp-typescript'),
    merge      = require('merge2'),
    mocha      = require('gulp-mocha');

var getBundleName = function () {
  var version = require('./package.json').version;
  var name = require('./package.json').name;
  return version + '.' + name + '.' + 'min';
};


var tsProject = ts.createProject({
  declarationFiles: true,
  noExternalResolve: false,
  module: 'commonjs'
});



gulp.task('lib-node', function() {
  var tsResult = gulp.src([
    'src/**/*.ts'
  ]).pipe(ts(tsProject));
  return merge([
    tsResult.dts.pipe(gulp.dest('dist/definitions')),
    tsResult.js.pipe(gulp.dest('dist/lib-node'))
  ]);
});

gulp.task('test', ['lib-node'], function() {
  return gulp.src('test/unit/**/test-*.js', { read: false }).pipe(mocha({ reporter: 'spec' }))
});

gulp.task('lib-web', function() {

  var bundler = browserify({
    debug: true
  });

  var bundle = function() {
    return bundler
      .add('./src/**/*.ts')
      .plugin('tsify')
      .bundle()
      .pipe(source(getBundleName() + '.js'))
      .pipe(buffer())
      .pipe(sourcemaps.init({loadMaps: true}))
      // Add transformation tasks to the pipeline here.
      // .pipe(uglify())
      // .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest('./dist/lib-browser'));
  };

  return bundle();
});


gulp.task('lib', ['lib-node', 'lib-web']);
