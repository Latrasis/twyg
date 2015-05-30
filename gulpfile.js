var gulp = require('gulp');
var connect = require('gulp-connect');
var gutil = require('gulp-util');
var browserify = require('browserify');
var source = require('vinyl-source-stream');

gulp.task('webserver', function() {
  connect.server({
    port: 9000
  });
});

gulp.task('js-build', function () {
  var b = browserify({
    entries: './lib/index.js',
    debug: true,
    cache: {},
    packageCache: {},
    fullPaths: true
  });

  b.on('update', function(){
    bundleShare(b);
  });
  
  // b.add('./lib/index.js');
  bundleShare(b);

  function bundleShare(b) {
    b.bundle()
      .pipe(source('twyg.min.js'))
      .on('error', gutil.log)
      .pipe(gulp.dest('./dist/'));
  };

});

gulp.task('default', ['webserver', 'js-build']);