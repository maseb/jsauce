/*global require: false, module: false */

'use strict';

var browserify = require('browserify');
var gulp = require('gulp');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps'),
    ts         = require('gulp-typescript'),
    merge      = require('merge2');

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

gulp.task('lib-web', function() {

  var bundler = browserify({
    debug: true
  });

  var bundle = function() {
    return bundler
      .add('./src/jsauce/index.ts')
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
