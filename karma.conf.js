// Karma configuration
// Generated on Sun Aug 16 2015 13:55:06 GMT+0300 (EEST)
module.exports = function(config) {
	"use strict";
	config.set({

		// base path that will be used to resolve all patterns (eg. files, exclude)
		basePath: '',


		// frameworks to use
		// available frameworks: [url]https://npmjs.org/browse/keyword/karma-adapter[/url]
		frameworks: ['jasmine'],

		plugins: [
			require('karma-babel-preprocessor'),
			require('karma-jasmine'),
			require('karma-phantomjs-launcher'),
			require('karma-coverage')
		],
		// list of files / patterns to load in the browser
		files: [
			'node_modules/matreshka/matreshka.js',
			'matreshka-router.js',
			'test/*_spec.js'
		],


		// list of files to exclude
		exclude: [],


		// preprocess matching files before serving them to the browser
		// available preprocessors: [url]https://npmjs.org/browse/keyword/karma-preprocessor[/url]



		// test results reporter to use
		// possible values: 'dots', 'progress'
		// available reporters: [url]https://npmjs.org/browse/keyword/karma-reporter[/url]
		reporters: ['progress', 'coverage'],


		// web server port
		port: 9876,


		// enable / disable colors in the output (reporters and logs)
		colors: true,


		// level of logging
		// possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
		logLevel: config.LOG_INFO,


		// enable / disable watching file and executing tests whenever any file changes
		autoWatch: true,


		// start these browsers
		// available browser launchers: [url]https://npmjs.org/browse/keyword/karma-launcher[/url]
		browsers: ['PhantomJS'],


		// Continuous Integration mode
		// if true, Karma captures browsers, runs the tests and exits
		singleRun: false,

		preprocessors: {
			'matreshka-router.js': ['coverage'],
			'test/**/*.js': ['babel']
		},
		coverageReporter: {
			type: 'lcov',
			dir: 'coverage',
			subdir: '.'
		},
		babelPreprocessor: {
			options: {
				sourceMap: 'inline',
				presets: ["es2015", "stage-0"],
			}
		}
	});
};
