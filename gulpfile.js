var gulp = require('gulp');
var plumber = require('gulp-plumber');
var rename = require('gulp-rename');
var concat = require('gulp-concat');
var cache = require('gulp-cache');
// var imagemin = require('gulp-imagemin');
var minifycss = require('gulp-clean-css');
var ngAnnotate = require('gulp-ng-annotate');
var uglify = require('gulp-uglify');
var sass = require('gulp-sass');
var jsonminify = require('gulp-jsonminify');
var bower = require('bower');
var browserSync = require('browser-sync');
var autoprefixer = require('gulp-autoprefixer');


// local server
gulp.task('serve', function() {
    browserSync({
        server: {
            baseDir: "public"
        }
    });
});
gulp.task('bs-reload', function() {
    browserSync.reload();
});


// gulp.task('images', function() {
//     gulp.src([
//           'public/img/**/*.jpg',
//           'public/img/**/*.png'
//       ])
//         .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
//         .pipe(gulp.dest('public/assets/img/'));
// });


// compile styles
gulp.task('styles', function() {
  gulp.src(['public/app/scss/main.scss'])
    .pipe(plumber({
      errorHandler: function(error) {
        console.log(error.message);
        this.emit('end');
    }}))
    .pipe(sass())
    .pipe(gulp.dest('public/assets/css/'))
    .pipe(autoprefixer())
    .pipe(rename({suffix: '.min'}))
    .pipe(minifycss())
    .pipe(gulp.dest('public/assets/css/'))
    .pipe(browserSync.reload({stream:true}));
});


// minify json
gulp.task('jsons', function () {
    return gulp.src(['./data.json'])
        .pipe(jsonminify())
        .pipe(gulp.dest('public/assets/js/'));
});


// compile libraries and modules
gulp.task('sharedjs', function() {
  return gulp.src([
      'public/app/shared/**/*.js'
  ])
    .pipe(plumber({
      errorHandler: function(error) {
        console.log(error.message);
        this.emit('end');
    }}))
    .pipe(concat('shared.js'))
    .pipe(gulp.dest('public/assets/js/'))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest('public/assets/js/'))
    .pipe(browserSync.reload({stream:true}));
});


// compile main scripts
gulp.task('script', function() {
  return gulp.src([
      'public/app/app.js',
      'public/app/routes.js',
      'public/app/helpers/**/*.js',
      'public/app/services/**/*.js',
      'public/app/controllers/**/*.js',
      'public/app/directives/**/*.js'
  ])
    .pipe(plumber({
      errorHandler: function(error) {
        console.log(error.message);
        this.emit('end');
    }}))
    .pipe(ngAnnotate())
    .pipe(concat('main.js'))
    .pipe(gulp.dest('public/assets/js/'))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest('public/assets/js/'))
    .pipe(browserSync.reload({stream:true}));
});


// build
gulp.task('build', ['sharedjs', 'jsons', 'script', 'styles'], function() {
    console.log('build ready');
});


// default
gulp.task('default', ['serve'], function() {
    gulp.watch("public/app/scss/**/*.scss", ['styles']);
    gulp.watch("public/app/shared/**/*.js", ['sharedjs']);
    gulp.watch("public/app/**/*.js", ['script']);
    gulp.watch("public/*.html", ['bs-reload']);
});
