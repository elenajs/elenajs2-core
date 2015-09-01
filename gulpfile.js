"use strict";

var gulp = require('gulp');
var _ = require('gulp-load-plugins')();
var rmdir = require('rimraf');

function babelify(src, dest) {
    return gulp.src(src)
        .pipe(_.changed(dest))
        .pipe(_.sourcemaps.init())
        .pipe(_.babel())
        .pipe(_.sourcemaps.write('.', {sourceRoot: '../src'}))
        .pipe(gulp.dest(dest));
}

gulp.task('build-lib', function () {
    return babelify('src/**/*.js', 'lib');
});

gulp.task('clean', function() {
    rmdir('lib', function (err) {
        err && console.error(err);
    });
    rmdir('demobuild', function (err) {
        err && console.error(err);
    });
});

gulp.task('build-demo', ['build-lib'], function () {
    return babelify('demo/**/*.js', 'demobuild');
});

gulp.task('default', ['build-lib', 'build-demo'], function() {
});