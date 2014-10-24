
var gulp = require('gulp'),
    $ = require('gulp-load-plugins')();

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

gulp.task('test', function() {
    gulp.src('')
});

gulp.task('default', ['style', 'script']);