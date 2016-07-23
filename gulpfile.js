var svgSprite = require('gulp-svg-sprites'),
    svgmin = require('gulp-svgmin'),
    cheerio = require('gulp-cheerio'),
    replace = require('gulp-replace'),
    gulp = require('gulp'),
    sass = require('gulp-sass'),
    minify = require('gulp-minify');

    var assetsDir = 'assets/'

    gulp.task('svgSpriteBuild', function () {
        return gulp.src(assetsDir + 'i/icons/*.svg')
            // minify svg
            .pipe(svgmin({
                js2svg: {
                    pretty: true
                }
            }))
            // remove all fill and style declarations in out shapes
            .pipe(cheerio({
                run: function ($) {
                    $('[fill]').removeAttr('fill');
                    $('[style]').removeAttr('style');
                },
                parserOptions: { xmlMode: true }
            }))
            // cheerio plugin create unnecessary string '>', so replace it.
            .pipe(replace('&gt;', '>'))
            // build svg sprite
            .pipe(svgSprite({
                    mode: "symbols",
                    preview: false,
                    selector: "icon-%f",
                    svg: {
                        symbols: 'symbol_sprite.html'
                    }
                }
            ))
            .pipe(gulp.dest(assetsDir + 'i/'));
    });
    gulp.task('svgSpriteSass', function () {
        return gulp.src(assetsDir + 'i/icons/*.svg')
            .pipe(svgSprite({
                    preview: false,
                    selector: "icon-%f",
                    svg: {
                        sprite: 'svg_sprite.html'
                    },
                    cssFile: '../../_sass/_svg_sprite.scss',
                    templates: {
                        css: require("fs").readFileSync(assetsDir + 'sass/_sprite-template.scss', "utf-8")
                    }
                }
            ))
            .pipe(gulp.dest(assetsDir + 'i/'));
    });
    gulp.task('sass', function () {
      return gulp.src(assetsDir+'sass/*.scss')
        .pipe(sass.sync().on('error', sass.logError))
        .pipe(gulp.dest('./dist/css'));
    });

    gulp.task('compress', function() {
      gulp.src(assetsDir+'js/*.js')
        .pipe(minify({
            ext:{
                src:'-debug.js',
                min:'.js'
            },
            exclude: ['tasks'],
            ignoreFiles: ['.combo.js', '-min.js']
        }))
        .pipe(gulp.dest('dist/js/'))
    });
    gulp.task('svgSprite', ['svgSpriteBuild', 'svgSpriteSass']);
