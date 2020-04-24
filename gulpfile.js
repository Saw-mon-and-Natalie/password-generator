const gulp = require('gulp')

const htmlmin = require('gulp-htmlmin')

const babel = require('gulp-babel')
const uglify = require('gulp-uglify')

const purify = require('gulp-purifycss')
const autoprefixer = require('gulp-autoprefixer')
const cleanCSS = require('gulp-clean-css')

const svgmin = require('gulp-svgmin')
const clean = require('gulp-clean')

const destPath = 'dist'

function html(cb) {
    gulp.src('src/index.html')
        .pipe(htmlmin({
            collapseBooleanAttributes: true,
            collapseWhitespace: true,
            minifyCSS: true,
            minifyJS: true,
            minifyURLs: true,
            removeAttributeQuotes: true,
            removeComments: true,
            sortAttributes: true,
            sortClassName: true
        }))
        .pipe(gulp.dest(`${destPath}`))
    cb()
}

function babelify(cb) {
    gulp.src('src/js/passwd.js')
        .pipe(babel({
            presets: ['@babel/preset-env']
        }))
        .pipe(gulp.dest(`${destPath}/js/`))
    cb();
}

function compress(cb) {
    gulp.src('src/js/passwd.js')
        .pipe(babel({
            presets: ['@babel/preset-env']
        }))
        .pipe(uglify())
        .pipe(gulp.dest(`${destPath}/js/`))
    cb()
}

function css(cb) {
    gulp.src('src/css/style.css')
        .pipe(purify(['src/js/*.js', 'src/*.html']))
        .pipe(autoprefixer())
        .pipe(cleanCSS({
            level: {
                1: { all: true },
                2: {}
            }
        }))
        .pipe(gulp.dest(`${destPath}/css/`))
    cb()
}

function svg(cb) {
    gulp.src('src/img/*.svg')
        .pipe(svgmin())
        .pipe(gulp.dest(`${destPath}/img/`))
    cb()
}

function copy(cb) {
    gulp.src('src/img/*')
        .pipe(gulp.dest(`${destPath}/img/`))
    cb()
}

function cleanBuild(cb) {
    gulp.src(destPath, { read: false, allowEmpty: true })
        .pipe(clean())
    cb()
}

exports.babelify = babelify
exports.compress = compress
exports.css = css
exports.svg = svg
exports.copy = copy
exports.cleanBuild = cleanBuild
exports.html = html

exports.build = gulp.parallel(compress, css, svg, html)