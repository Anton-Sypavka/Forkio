const gulp = require('gulp');
const uglify = require('gulp-uglify-es').default;
const concat = require('gulp-concat');
const sass = require('gulp-sass');
const htmlmin = require('gulp-htmlmin');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const concatcss = require('gulp-concat-css');
const imagemin = require('gulp-imagemin');
const minifyjs = require('gulp-js-minify');
const clean = require('gulp-clean');
const browserSync = require('browser-sync').create();
sass.compiler = require('node-sass');

gulp.task('clean', function () {
	return gulp.src('dist', {read: false, allowEmpty: true })
		.pipe(clean());
});

gulp.task('browser-sync', function() {
	browserSync.init({
		server: {
			baseDir: "./dist"
		}
	});
	gulp.watch("src/**/*.js", 'build:script').on('change', browserSync.reload);
	gulp.watch("src/**/*.scss", 'build:style').on('change', browserSync.reload);
	gulp.watch("src/index.html").on('change', browserSync.reload);
});

gulp.task('build:style', function () {
	return gulp.src('src/scss/*.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(autoprefixer({
			cascade: false
		}))
		.pipe(concatcss("styles.css"))
		.pipe(cleanCSS({compatibility: 'ie8'}))
		.pipe(gulp.dest('dist/css'))
		.pipe(browserSync.stream());
});

gulp.task('style:vendor', function () {
	return gulp
		.src([
			'./node_modules/reset-css/reset.css',
			'./node_modules/@fortawesome/fontawesome-free/css/all.css'
		])
		.pipe(concat('vendor.css'))
		.pipe(gulp.dest('dist/css'))
		.pipe(browserSync.stream());
});

gulp.task('build:script', function () {
	return gulp
		.src('src/js/*.js')
		.pipe(uglify())
		.pipe(concat('script.min.js'))
		.pipe(gulp.dest('dist/js'))
		.pipe(browserSync.stream());
});

gulp.task('script:vendor', function () {
	return gulp
		.src([
			'./node_modules/jquery/dist/jquery.js',
			'./node_modules/@fortawesome/fontawesome-free/js/all.js',
		])
		.pipe(uglify())
		.pipe(concat('vendor.js'))
		.pipe(gulp.dest('dist/js'))
		.pipe(browserSync.stream());
});

gulp.task('build:htmlmin', function () {
	return gulp.src('src/index.html')
		.pipe(htmlmin({ collapseWhitespace: true }))
		.pipe(gulp.dest('dist'))
		.pipe(browserSync.stream());
});

gulp.task('build:img', function (){
	return gulp.src('src/img/*')
		.pipe(imagemin())
		.pipe(gulp.dest('dist/img'))
		.pipe(browserSync.stream());
});

gulp.task('build',gulp.series(
				'clean',
				'build:script',
				'script:vendor',
				'build:style',
				'style:vendor',
				'build:htmlmin',
				'build:img',
	)
);

gulp.task('refresh',gulp.series(
	'build:script',
	'script:vendor',
	'build:style',
	'style:vendor',
	'build:htmlmin',
	'build:img',
	)
);

gulp.task('dev', () => {
	browserSync.init({
		server: {
			baseDir: "./dist"
		}
	});
	gulp.watch("src/**/*.*", gulp.series('refresh')).on('change',browserSync.reload);
});

