var gulp           = require('gulp'),
		browserSync    = require('browser-sync'),
		pug            = require('gulp-pug'),
		notify         = require("gulp-notify"),
		sass           = require('gulp-sass'),
		bourbon        = require('node-bourbon'),
		rename         = require('gulp-rename'),
		autoprefixer   = require('gulp-autoprefixer'),
		cleanCSS       = require('gulp-clean-css'),
		concat         = require('gulp-concat'),
		uglify         = require('gulp-uglify'),
		spritesmith    = require('gulp.spritesmith'),
	    csso           = require('gulp-csso'),
	    plato          = require('gulp-plato'),
	    fixmyjs        = require("gulp-fixmyjs");



// Добавляет html файлы в Production
gulp.task('html', function() {
	return gulp.src('src/**/*.html')
		.pipe(gulp.dest('app'));
});

gulp.task('images', function() {
	return gulp.src('src/images/**')
		.pipe(gulp.dest('app/images'));
}); 


// Компиляция pug в html
gulp.task('pug', function() {
	return gulp.src(['src/pug/**/*.pug', '!src/pug/**/_*.pug'])
		.pipe(pug({
			pretty: '\t'
		}))
		.on("error", notify.onError())
		.pipe(gulp.dest('app'));
});


// Подянтие локалхоста + автоматическое обновление браузера
gulp.task('browser-sync', function() {
	browserSync({
		server: {
			baseDir: 'app'
		},
		notify: false
	});
});


// Компиляция sass в css, c добавлением вендорных префиксов и сжатием css
gulp.task('sass', function() {
	return gulp.src('src/sass/**/*.scss')
		.pipe(sass({includePaths: bourbon.includePaths})
		.on("error", notify.onError()))
		.pipe(rename({suffix: '.min', prefix : ''}))
		.pipe(autoprefixer(['last 15 versions']))
		.pipe(cleanCSS())
		.pipe(gulp.dest('app/css'))
		.pipe(browserSync.reload({stream: true}))
});


// Собирает все скрипты указанные в gulp.src в один файл: scripts.min.js,
// сжимает его и выливает в app/js
gulp.task('scripts', function() {
	return gulp.src([
		'src/js/common.js' // Всегда в конце
		])
	.pipe(fixmyjs({        // Автоматически исправляет простые ошибки в коде после линта выполненного на основе JSHint (gulp-jshint).
		// JSHint settings here
	}))
	.pipe(concat('common.js'))
	.pipe(uglify())
	.pipe(gulp.dest('app/js'));
});


// Следит за изменениями в папках, запускает соответствующие таски
gulp.task('watch', ['html', 'sass', 'images', 'scripts', 'browser-sync', 'plato'], function() {
	gulp.watch('src/pug/**/*.pug', ['pug']);
	gulp.watch('src/**/*.html', ['html']);
	gulp.watch('src/js/**/*.js', ['scripts']);
	gulp.watch('src/sass/**/*.scss', ['sass']);
	gulp.watch('app/*.html', browserSync.reload);
	gulp.watch('app/js/**/*.js', browserSync.reload);
	gulp.watch('app/', browserSync.reload);
});


// Таск по умолчанию
gulp.task('default', ['watch']);


// CSS минификатор 
gulp.task('production', function () {
    return gulp.src('app/css/index.min.css')
        .pipe(csso())
        .pipe(gulp.dest('app/csso/'));
});
 
gulp.task('development', function () {
    return gulp.src('./main.css')
        .pipe(csso({
            restructure: false,
            sourceMap: true,
            debug: true
        }))
        .pipe(gulp.dest('./out'));
});


// Сборка спрайта
gulp.task('sprite', function() {
	 var spriteData = gulp.src(['app/img/icons/png-jpg/*.png', 'app/img/icons/png-jpg/*.jpg'])
	 .pipe(spritesmith({
		  imgName: 'sprite.png',
		  cssName: '_sprite.sass',
		  imgPath: '../img/sprite.png',
		  cssFormat: 'sass',
		  padding: 4
	 }));
	 var imgStream = spriteData.img.pipe(gulp.dest('app/img/'));
	 var cssStream = spriteData.css.pipe(gulp.dest('src/sass/'));
	 return (imgStream, cssStream);
});

// Предоставляет аналитику по вашему коду с разными метриками в виде красивых графиков.
gulp.task('plato', function () {
	return gulp.src('app.js')
		.pipe(plato('report', {
			jshint: {
				options: {
					strict: true
				}
			},
			complexity: {
				trycatch: true
			}
		}));
});



