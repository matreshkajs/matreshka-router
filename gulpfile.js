"use strict";
let gulp = require('gulp');
let gutil = require('gulp-util');
let Server = require('karma').Server;


gulp.task('minify', () => {
	let uglify = require('gulp-uglify'),
		sourcemaps = require('gulp-sourcemaps'),
		rename = require('gulp-rename');

	return gulp.src('matreshka-router.js')
		.pipe(rename('matreshka-router.min.js'))
		.pipe(sourcemaps.init())
		.pipe(uglify())
		.on('error', e => gutil.log(gutil.colors.red(e)))
		.pipe(sourcemaps.write('.'))
    	.pipe(gulp.dest('./'));
});

gulp.task('test', done => {
	new Server({
		configFile: __dirname + '/karma.conf.js',
		singleRun: true
	}, done).start();
});


gulp.task('default', ['test', 'minify']);
