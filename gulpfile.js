const gulp = require('gulp')
const replace = require('gulp-replace')
const rename = require('gulp-rename')
const crypto = require('crypto')
const hashMD5 = crypto.createHash('md5')
const hash512 = crypto.createHash('sha512')
const through2 = require('through2')

const htmlmin = require('gulp-htmlmin')

const babel = require('gulp-babel')
const uglify = require('gulp-uglify')
const terser = require('gulp-terser')

const purify = require('gulp-purifycss')
const autoprefixer = require('gulp-autoprefixer')
const cleanCSS = require('gulp-clean-css')
const sass = require('gulp-sass')
const postcss = require('gulp-postcss')
const sorting = require('postcss-sorting')

sass.compiler = require('node-sass')

const svgmin = require('gulp-svgmin')
const clean = require('gulp-clean')

const destPath = 'dist'

function html() {
    return gulp.src('src/index.html')
        .pipe(replace(/src=["']?js\/passwd\.js["']?/g, function() {
            return `src="js/passwd.js?v=${digest.get('passwd.js').sha512}"`
                // ` integrity="sha512-${digest.get('passwd.js').sha512}"` +
                // ` crossorigin="anonymous"`
        }))
        .pipe(replace(/href=["']?css\/style\.css["']?/, function() {
            return `href="css/style.css?v=${digest.get('style.css').sha512}"` 
                // ` integrity="sha512-${digest.get('style.css').sha512}"` +
                // ` crossorigin="anonymous"`
        }))
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
}

function babelify(cb) {
    gulp.src('src/js/passwd.js')
        .pipe(babel({
            presets: ['@babel/preset-env']
        }))
        .pipe(gulp.dest(`${destPath}/js/`))
    cb();
}

function compress() {
    return gulp.src('src/js/*.js')
        .pipe(babel({
            presets: ['@babel/preset-env']
        }))
        .pipe(uglify())
        .pipe(through2.obj(computeHash))
        // .pipe(rename(addHashToFileName))
        .pipe(gulp.dest(`${destPath}/js/`))
}

function css() {
    return gulp.src('src/css/style.css')
        .pipe(purify(['src/js/*.js', 'src/*.html']))
        .pipe(autoprefixer())
        .pipe(cleanCSS({
            level: {
                1: { all: true },
                2: {}
            }
        }))
        .pipe(through2.obj(computeHash))
        // .pipe(rename(addHashToFileName))
        .pipe(gulp.dest(`${destPath}/css/`))
}

function scss_compile() {
    return gulp.src('src/css/style.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(purify(['src/js/*.js', 'src/*.html']))
        .pipe(postcss([
            sorting({
                "order": ["custom-properties", "dollar-variables", "declarations", "rules", "at-rules"],
                "properties-order": [
                    "content",
                    "position",
                    "top", "bottom", "left", "right",
                    "width",
                    "max-width",
                    "min-width",
                    "height",
                    "max-height",
                    "min-height",
                    "display",
                    "flex-direction",
                    "flex-wrap",
                    "flex-grow",
                    "flex-shrink",
                    "justify-content",
                    "align-items",
                    "align-self",
                    "margin",
                    "margin-left", "margin-right", "margin-bottom", "margin-left",
                    "padding",
                    "padding-left", "padding-right", "padding-bottom", "padding-left",
                    "background",
                    "color",
                    "box-shadow",
                    "border",
                    "border-radius",
                    "outline",
                    "opacity",
                    "cursor",
                    "font-family",
                    "font-size",
                    "font-weight",
                    "text-align",
                    "white-space",
                    "list-style",
                    "transform-origin",
                    "transform",
                    "transition",
                    "animation",
                    "overflow",
                    "z-index",
                    "pointer-events",
                ],
                "unspecified-properties-position": "bottomAlphabetical"
            })
        ]))
        .pipe(autoprefixer())
        .pipe(cleanCSS({
            level: {
                1: { all: true },
                2: {}
            }
        }))
        .pipe(through2.obj(computeHash))
        // .pipe(rename(addHashToFileName))
        .pipe(gulp.dest(`${destPath}/css/`))
}

function svg(cb) {
    gulp.src('src/img/*.svg')
        .pipe(svgmin())
        .pipe(gulp.dest(`${destPath}/img/`))
    cb()
}

function icons() {
    return gulp.src('src/img/icons/*')
        .pipe(gulp.dest(`${destPath}/img/icons/`))
}

function pwa() {
    return gulp.src(['src/manifest.json', 'src/sw.js'])
        .pipe(gulp.dest(`${destPath}/`))
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

function terse(cb) {
    gulp.src('src/js/*.js')
        .pipe(terser({
            compress: {
                drop_console: true,
            },
            mangle: {
                toplevel: true,
            }
        }))
        .pipe(gulp.dest('dist/js/'))
    cb()
}

digest = new Map()

function computeHash(file, _, cb) {
    if(file.isBuffer()) {
        hashMD5.update(file.contents.toString())
        digest.set(file.basename, {
            md5: hashMD5.copy().digest('base64'),
            sha512: hash512.copy().digest('base64'),
        })
        console.log(digest.get(file.basename), file.basename)
        cb(null, file)
    }
}

function addHashToFileName(path) {
    path.basename += '-' + digest.get(path.basename + path.extname).sha512
}

function test(cb) {
    var s = gulp.src('src/js/passwd.js')
        .pipe(through2.obj(computeHash))
        .pipe(rename(addHashToFileName))
    cb()
}

exports.test = test

exports.babelify = babelify
exports.compress = compress
exports.css = css
exports.svg = svg
exports.copy = copy
exports.clean = cleanBuild
exports.html = html
exports.terser = terse

exports.build = gulp.series(
    compress, 
    scss_compile, 
    svg,
    icons,
    pwa,
    html
)