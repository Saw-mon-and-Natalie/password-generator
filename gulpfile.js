const gulp = require('gulp')
const gulpif = require('gulp-if')
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
        .pipe(through2.obj(shortenCSSQueries))
        // .pipe(through2.obj(inpsectFile))
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
    return gulp.src('src/**/*.js')
        .pipe(through2.obj(shortenCSSQueries))
        .pipe(through2.obj(shortenLongJSWords))
        .pipe(gulpif(/src\/js/, babel({
            presets: ['@babel/preset-env']
        })))
        .pipe(terser({
            compress: {
                drop_console: true,
                passes: 10,
                reduce_vars: false,
                // pure_funcs: ['shuffle', 'pickPosition'],
                // pure_getters : true,
                // unused: "keep_assign"
            },
            mangle: {
                toplevel: true,
                reserved: ['addAll'],
                properties: {
                    // builtins: true,
                    // keep_quoted: 'strict',
                    // regex: /^(?!.*length).*$/g,
                    reserved: ['waitUntil', 'respondWith', 'request', 'type', 'addAll'],
                    // undeclared: true
                },
            },
            toplevel: true,
        }))
        .pipe(through2.obj(computeHash))
        // .pipe(rename(addHashToFileName))
        .pipe(gulp.dest(`${destPath}/`))
}

function compress2() {
    return gulp.src('src/sw.js')
        .pipe(terser({
            compress: {
                drop_console: true,
                passes: 10,
                reduce_vars: false,
                // keep_fnames: 'addAll'
            },
            mangle: {
                toplevel: true,
                reserved: ['addAll'],
                properties: {
                    reserved: ['waitUntil', 'respondWith', 'request', 'type', 'addAll'],
                },
            },
            // toplevel: true,
        }))
        .pipe(gulp.dest(`${destPath}/`))
}

function shortenLongJSWords(file, enc, cb) {
    if(file.isBuffer()) {
        let contents = file.contents.toString(enc)
        const words = [
            'totalMin',
            'totalMax',
            'passwordLength',
            'uppercaseMin',
            'uppercaseMax',
            'lowercaseMin',
            'lowercaseMax',
            'digitsMin',
            'digitsMax',
            'specialCharactersMin',
            'specialCharactersMax',
            'numShuffles',
            'includeUppercase',
            'includeLowercase',
            'includeDigits',
            'includeSpecialCharacters',
            'excludeSimiliarCharacters',
            'excludeAmbiguousCharacters'
        ]
    
        changed = 0
        for(let i in words) {
            const r = new RegExp('config\\.' + words[i], 'g')
            contents = contents.replace(r, 'config.' + setShortName(changed++) )
        }
        
        file.contents = Buffer.from(contents, enc)
        cb(null, file)
    }
}

function css() {
    return gulp.src('src/css/style.css')
        .pipe(purify(['src/js/*.js', 'src/*.html']))
        .pipe(through2.obj(shortenCSSQueries))
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
        .pipe(through2.obj(shortenCSSQueries))
        .pipe(through2.obj(inpsectFile))
        .pipe(sass().on('error', sass.logError))
        // .pipe(purify(['src/js/*.js', 'src/*.html']))
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
    return gulp.src(['src/manifest.json', 'src/browserconfig.xml'])
        .pipe(gulp.dest(`${destPath}/`))
}

function openGraph() {
    return gulp.src(['src/img/og.*'])
        .pipe(gulp.dest(`${destPath}/img/`))
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

const digest = new Map()

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

const cssQueries = new Map()
const cssQueryRegex = /(class|id)(?:=)['"](?<css>[^'"]*)['"]/g
const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
const regexes = {
    html: `(%CSS_TYPE%=)(['"])(%CSS_QUERY%)(['"])`,
    js: `(['"])(%CSS_TYPE%)(%CSS_QUERY%)(['"])`,
    css: `(%CSS_TYPE%)(%CSS_QUERY%)`,
    scss: `(%CSS_TYPE%)(%CSS_QUERY%)`
}
let cssQueriesCount = 0

function findCSSQueries(cb) {
    gulp.src('src/index.html')
        .pipe(replace(cssQueryRegex, function(match, p1, p2, offset, string) {
            if( cssQueries.has(p2) ) {
                return string
            }
            p2.split(' ').forEach(el => {
                if( el.length > 0 ) {
                    cssQueries.set(el, { 
                        name: setShortName(cssQueriesCount),
                        type: p1
                    })
                    cssQueriesCount += 1
                }
            })
            
            return string
        }))
    cb()
}

function setShortName(i) {
    if( i < chars.length ) {
        return chars[i]
    }

    return chars[i % chars.length] + setShortName(Math.floor(i / chars.length))
}

function shortenCSSQueries(file, enc, cb) {
    if(file.isBuffer()) {
        const ext = file.extname.substring(1)
        if( ext in regexes) {
            let content = file.contents.toString(enc)
            if(ext === 'html') {
                content = content.replace(cssQueryRegex, function(match, p1, p2, offset, string) {
                    query = p2.split(' ')
                    query = query.filter(el => el.length > 0)
                    query = query.map(el => {
                        if( el.length > 0 && cssQueries.has(el)) {
                            let r = cssQueries.get(el)
                            return p1 === r.type ? r.name : el
                        }
    
                        return el
                    })
                    
                    return `${p1}="${query.join(' ')}"`
                })
            } else {
                cssQueries.forEach(function(value, key) {
                    let cssType = value.type === 'class' ? '\\.' : '#'
                    const newSubStr = ext.match('css') ? `$1${value.name}` : `$1$2${value.name}$4`

                    let initializeRegexTemplate = regexes[ext].replace('%CSS_TYPE%', cssType)
                    initializeRegexTemplate = initializeRegexTemplate.replace('%CSS_QUERY%', key)
                    let r = new RegExp(initializeRegexTemplate, 'g')
    
                    content = content.replace(r, newSubStr)
                })
            }

            file.contents = Buffer.from(content, enc)
        }

        cb(null, file)
    }
}

function inpsectFile(file, enc, cb) {
    console.log(enc)
    cb(null, file)
}

function test(cb) {
    var s = gulp.src('src/js/passwd.js')
        .pipe(through2.obj(computeHash))
        .pipe(rename(addHashToFileName))
    cb()
}

exports.test = gulp.series(compress2)

exports.babelify = babelify
exports.compress = compress
exports.css = css
exports.svg = svg
exports.copy = copy
exports.clean = cleanBuild
exports.html = html
exports.terser = terse

exports.build = gulp.series(
    findCSSQueries,
    compress, 
    scss_compile, 
    svg,
    icons,
    pwa,
    openGraph,
    html
)