
var gulp = require('gulp'),
    $ = require('gulp-load-plugins')(),
    qunit = require('node-qunit-phantomjs');

gulp.task('test', function() {
    qunit('./tests/index.html');
});

gulp.task('style', function() {
    gulp.src('src/wizard.less')
        .pipe($.less())
        .pipe(gulp.dest('./dist/'))
});

gulp.task('script', function() {
    gulp.src('src/wizard.js')
        .pipe(gulp.dest('./dist/'))
        .pipe($.uglify())
        .pipe($.rename('wizard.min.js'))
        .pipe(gulp.dest('./dist/'));
});

gulp.task('default', ['style', 'script', 'test']);