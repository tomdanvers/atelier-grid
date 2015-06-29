/************************/
/* Gulpfile for Front-End
*************************/

var gulp = require('gulp');

var browserify = require('gulp-browserify');

var prefix = require('gulp-autoprefixer');
var compass = require('gulp-compass');
var	concat = require('gulp-concat');
var	filsize = require('gulp-filesize');
var	minify = require('gulp-minify-css');
var	sass = require('gulp-sass');
var	uglify = require('gulp-uglify');
var	gutil = require('gulp-util');
var	size = require('gulp-size');
var	cat = require('gulp-cat');

var	hbsfy = require('hbsfy');

var	connect = require('gulp-connect');

/*******************/
/* Erroring Function
********************/


var displayError = function(error) {

    var errorString = '[' + gutil.colors.magenta(error.plugin) + ']';
    errorString += ' ' + error.message.replace("\n",'');

    if(error.fileName)
        errorString += ' in ' + gutil.colors.yellow(error.fileName);

    if(error.lineNumber)
        errorString += ' on line ' + gutil.colors.magenta(error.lineNumber);

    console.error(errorString);
}


/***********************/
/* Paths for JS and SCSS
************************/


var paths = {

	js: {
		src: ['./src/js/**/*.js','./src/js/**/*.json'],
		files: './src/js/main.js',
		dest: './distribution/js'
	},

	styles: {
		src: './src/scss/**/*.scss',
		files: './src/scss/**/**',
		dest: './distribution/css'
	}

}


/************************/
/* Starting a local server
*************************/


gulp.task('connect', function(){

	connect.server({
		root: 'distribution',
		port: 8889,
		livereload: true,
		fallback: 'distribution/index.html'
	})

});


/*****************/
/* Assets Compiling
******************/

// Html Templates

gulp.task('html', function(){

	gulp.src(paths.html.global)
		.pipe(connect.reload());

});

// Javascript

gulp.task('scripts', function() {
    gulp.src(paths.js.files)
        .pipe(browserify())
        .on('error', function(err){
			displayError(err);
		})
        .pipe(concat('main.js'))
        .pipe(gulp.dest(paths.js.dest))
		.pipe(connect.reload());
});

// SASS

gulp.task('styles', function(){
	gulp.src(paths.styles.src)
		.pipe(sass({
			outputStyle: 'compressed',
			sourceComments: 'map',
		}))
		.on('error', function(err){
			displayError(err);
		})
		.pipe(prefix('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
		.pipe(minify())
		.pipe(gulp.dest(paths.styles.dest))
		.pipe(connect.reload());
});

/**************************************/
/* Watching for changes and default task
***************************************/


gulp.task('watch', function() {

    gulp.watch(paths.styles.files, ['styles']);
    gulp.watch(paths.js.src, ['scripts']);

});

gulp.task('default', ['scripts'],function() {

    gulp.start('watch');
    gulp.start('connect');

    return gulp.src('hello_world.txt')
    	.pipe(cat());
});
