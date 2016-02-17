'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var browserSync = require('browser-sync');
var connect = require('gulp-connect-php');

gulp.task('sass', function() {
    return gulp.src("app/scss/*.scss")
        .pipe(sass())
        .pipe(gulp.dest("app/dist/css"))
        .pipe(browserSync.stream());
});

gulp.task('scripts', function() {
    return gulp.src(['app/components/*.js', 'app/scripts/*.js'])
        .pipe(concat('all.js'))
        .pipe(gulp.dest('app/dist/js/'))
        .pipe(browserSync.stream());
});

gulp.task('php', function(){
    connect.server({
        base: 'app',
        port: 8010,
        keepalive: true
    })
});

// Static Server + watching scss/html files
gulp.task('serve', ['php', 'sass', 'scripts'], function() {

    connect.server({}, function (){
        browserSync({
            proxy: '127.0.0.1:8010',
            port: 8080,
            open: true,
            notify: false
        });
    });

    gulp.watch("app/scss/**", ['sass']);
    gulp.watch("app/scripts/*.js", ['scripts']);
    gulp.watch( ["app/*.html", "app/php/*.php"] ).on('change', browserSync.reload);
});

gulp.task('default', ['serve']);