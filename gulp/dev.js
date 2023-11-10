/**
 *  Development 
 */
const gulp = require('gulp');

/** Plumber & Notify */
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');

const plumberNotify = (title) => {
  return {
    errorHandler: notify.onError(
      {
        title: title,
        message: 'Error <%= error.message %>',
        sound: false,
      }
    ),
  }
}

/** Webpack */
const webpack = require('webpack-stream');

/** Babel */
// const babel = require('gulp-babel');

/** Gulp changed */
const changed = require('gulp-changed');

/** Clean build folder */
const clean = require('gulp-clean');
const fs = require('fs');

gulp.task('clean:dev', function (done) {
  if (fs.existsSync('./build/')) {
    return gulp.src('./build/', { read: false })
      .pipe(clean({ force: true }));
  }
  done();
});

/** Compile @@ include html files */
const fileInclude = require('gulp-file-include');
const fileIncludeConfig = {
  prefix: '@@',
  basepath: '@file',
};

gulp.task('html:dev', function () {
  return gulp.src(
    [
      './src/html/**/*.html',
      // exclude the Blocks folder
      '!./src/html/blocks/**/*.html',
    ]
  )
    .pipe(changed(
      './build/',
      {
        hasChanged: changed.compareContents
      }
    ))
    .pipe(plumber(plumberNotify('HTML')))
    .pipe(fileInclude(fileIncludeConfig))
    .pipe(gulp.dest('./build/'));
});

/** CSS sourcemaps */
const sourceMaps = require('gulp-sourcemaps');

/** Sass glob */
const sassGlob = require('gulp-sass-glob');

/** Compile SCSS */
const sass = require('gulp-sass')(require('sass'));

gulp.task('sass:dev', function () {
  return gulp
    .src('./src/scss/*.scss')
    .pipe(changed('./build/css/'))
    .pipe(plumber(plumberNotify('SCSS')))
    .pipe(sourceMaps.init())
    .pipe(sassGlob())
    .pipe(sass())
    .pipe(sourceMaps.write())
    .pipe(gulp.dest('./build/css/'));
});

/** Compress images */
// const imagemin = require('gulp-imagemin');

/** Compile images */
gulp.task('images:dev', function () {
  return gulp
    .src('./src/img/**/*')
    .pipe(changed('./build/img/'))
    // .pipe(imagemin({ verbose: true }))
    .pipe(gulp.dest('./build/img/'))
});

/** Compile fonts */
gulp.task('fonts:dev', function () {
  return gulp
    .src('./src/fonts/**/*')
    .pipe(changed('./build/fonts/'))
    .pipe(gulp.dest('./build/fonts/'))
});

/** Compile other files */
gulp.task('files:dev', function () {
  return gulp
    .src([
      './src/files/**/*',
      // exclude JSON data
      '!./src/files/data/*',
    ])
    .pipe(changed('./build/files/'))
    .pipe(gulp.dest('./build/files/'))
});

/** Compile JavaScript */
gulp.task('js:dev', function () {
  return gulp
    .src('./src/js/*.js')
    .pipe(changed('./build/js/'))
    .pipe(plumber(plumberNotify('JS')))
    // .pipe(babel())
    .pipe(webpack(require('./../webpack.config.js')))
    .pipe(gulp.dest('./build/js/'))
});

/** Start LiveServer */
const server = require('gulp-server-livereload');
const serverConfig = {
  livereload: true,
  open: true,
}

gulp.task('server:dev', function () {
  return gulp.src('./build/')
    .pipe(server(serverConfig));
});

/** Watch files */
gulp.task('watch:dev', function () {
  gulp.watch('./src/**/*.html', gulp.parallel('html:dev'));
  gulp.watch('./src/scss/**/*.scss', gulp.parallel('sass:dev'));
  gulp.watch('./src/js/**/*.js', gulp.parallel('js:dev'));
  gulp.watch('./src/img/**/*', gulp.parallel('images:dev'));
  gulp.watch('./src/fonts/**/*', gulp.parallel('fonts:dev'));
  gulp.watch('./src/files/**/*', gulp.parallel('files:dev'));
});