// 引入 gulp
var gulp = require('gulp');

// 引入组件
var jshint = require('gulp-jshint');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');

// 检查脚本
gulp.task('lint', function () {
    gulp.src('./ap_ui/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

// 合并css文件
gulp.task('csss', function () {
    gulp.src('./ap_ui/**/*.css')
        .pipe(concat('style.css'))
        .pipe(gulp.dest('./dist'));
});

// 合并js文件
gulp.task('scripts', function () {
    gulp.src('./ap_ui/**/*.js')
        .pipe(concat('index.js'))
        .pipe(gulp.dest('./dist'));
});

// 默认任务
gulp.task('default', function () {
    gulp.run('csss', 'scripts');

    // 监听文件变化
    gulp.watch('./ap_ui/**/*.js', function () {
        gulp.run('scripts');
    });

    // 监听文件变化
    gulp.watch('./ap_ui/**/*.css', function () {
        gulp.run('csss');
    });
});