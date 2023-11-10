/**
 *  Production
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
const babel = require('gulp-babel');

/** Gulp changed */
const changed = require('gulp-changed');

/** Clean docs folder */
const clean = require('gulp-clean');
const fs = require('fs');

gulp.task('clean:docs', function (done) {
  if (fs.existsSync('./docs/')) {
    return gulp.src('./docs/', { read: false })
      .pipe(clean({ force: true }));
  }
  done();
});

/** Webp */
const webpHTML = require('gulp-webp-html');
const webpCss = require('gulp-webp-css');
// for images
const webp = require('gulp-webp');

/** Compile @@ include html files */
const fileInclude = require('gulp-file-include');
const fileIncludeConfig = {
  prefix: '@@',
  basepath: '@file',
};

/** Minimify HTML */
const htmlclean = require('gulp-htmlclean');

/** HTML task*/
gulp.task('html:docs', function () {
  return gulp.src(
    [
      './src/html/**/*.html',
      // exclude the Blocks folder
      '!./src/html/blocks/**/*.html',
    ]
  )
    .pipe(changed('./docs/'))
    .pipe(plumber(plumberNotify('HTML')))
    .pipe(fileInclude(fileIncludeConfig))
    .pipe(webpHTML())
    .pipe(htmlclean())
    .pipe(gulp.dest('./docs/'));
});

/** Sass glob */
const sassGlob = require('gulp-sass-glob');

/** Group media-queries */
const groupMedia = require('gulp-group-css-media-queries');

/** Autoprefixer */
const autoprefixer = require('gulp-autoprefixer');

/** Minify CSS with CSSO */
const csso = require('gulp-csso');

/** Compile SCSS */
const sass = require('gulp-sass')(require('sass'));

/** SCSS task*/
gulp.task('sass:docs', function () {
  return gulp
    .src('./src/scss/*.scss')
    .pipe(changed('./docs/css/'))
    .pipe(plumber(plumberNotify('SCSS')))
    .pipe(sassGlob())
    .pipe(sass())
    .pipe(groupMedia())
    .pipe(webpCss())
    .pipe(autoprefixer())
    .pipe(csso())
    .pipe(gulp.dest('./docs/css/'));
});

/** Compress images */
const imagemin = require('gulp-imagemin');

/** Compile images */
gulp.task('images:docs', function () {
  return gulp
    .src('./src/img/**/*')
    .pipe(changed('./docs/img/'))
    .pipe(webp())
    .pipe(gulp.dest('./docs/img/'))
    .pipe(gulp.src('./src/img/**/*'))
    .pipe(changed('./docs/img/'))
    .pipe(imagemin({ verbose: true }))
    .pipe(gulp.dest('./docs/img/'))
});

/** Compile fonts */
gulp.task('fonts:docs', function () {
  return gulp
    .src('./src/fonts/**/*')
    .pipe(changed('./docs/fonts/'))
    .pipe(gulp.dest('./docs/fonts/'))
});

/** Compile other files */
gulp.task('files:docs', function () {
  return gulp
    .src([
      './src/files/**/*',
      // exclude JSON data
      '!./src/files/data/*',
    ])
    .pipe(changed('./docs/files/'))
    .pipe(gulp.dest('./docs/files/'))
});

/** Compile JavaScript */
gulp.task('js:docs', function () {
  return gulp
    .src('./src/js/*.js')
    .pipe(changed('./docs/js/'))
    .pipe(plumber(plumberNotify('JS')))
    .pipe(babel())
    .pipe(webpack(require('./../webpack.config.js')))
    .pipe(gulp.dest('./docs/js/'))
});

/** Start LiveServer */
const server = require('gulp-server-livereload');
const serverConfig = {
  livereload: true,
  open: true,
}

gulp.task('server:docs', function () {
  return gulp.src('./docs/')
    .pipe(server(serverConfig));
});

/** Watch files */
// gulp.task('watch:docs', function () {
//   gulp.watch('./src/**/*.html', gulp.parallel('html:docs'));
//   gulp.watch('./src/scss/**/*.scss', gulp.parallel('sass:docs'));
//   gulp.watch('./src/js/**/*.js', gulp.parallel('js:docs'));
//   gulp.watch('./src/img/**/*', gulp.parallel('images:docs'));
//   gulp.watch('./src/fonts/**/*', gulp.parallel('fonts:docs'));
//   gulp.watch('./src/files/**/*', gulp.parallel('files:docs'));
// });