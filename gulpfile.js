var gulp = require('gulp');
var $ = require('gulp-load-plugins')({
	pattern: ['gulp-*', 'gulp.*', '*'],
	rename: {
		'gulp-combine-media-queries': 'cmq',
		'node-notifier': 'notifier'
	}
});

var timestampFormat = "X dddd, MMMM Do YYYY, h:mm:ss a ZZ";

var src = {
	sass: 'sass/**/*.scss',
	//svg: 'svg-sprites/svgs/**/*.svg',
	js: [
		'js/plugins/svg-polyfill.js',
		'js/plugins/svg4everybody.js',
		'js/plugins/jquery-svg-shim.js',
		'js/plugins/indexof-polyfill.js',
		'js/main.js'
	]
};

gulp.task('sass', function(){

	var timestamp = "/* Timestamp " + $.moment().format(timestampFormat) + " */\n";

	return gulp.src(['sass/styles.scss','sass/frontend.scss'])
		.pipe($.sass({
			// Sass error handler
			onError: function(error){

				console.log("SASS Error: " + error.file + " " + error.line + ":" + error.column + "\n" + error.message);

				$.notifier.notify({
					title: "SASS Error",
					subtitle: error.file + " " + error.line + ":" + error.column,
					message: error.message,
					sound: "Hero"
				});

			},

			// Sass success message
			onSuccess: function(css){

				$.notifier.notify({
					title: "SASS Compile",
					message: "Success",
					sound: false
				});

			},
			outputStyle: 'nested',
			sourceComments: true
		}))

		// Autoprefixer
		.pipe($.autoprefixer({
			browsers: ['last 2 versions'],
			cascade: false
		}))

		// Combine media queries
		.pipe($.cmq())

		// Timestamp
		.pipe($.insert.prepend(timestamp))

		// Normal output
		.pipe(gulp.dest('css'))

		// Reload Browser Sync
		.pipe($.browserSync.reload({stream: true}))

		// Rename file
		.pipe($.rename(function(path){
			path.basename += ".min";
		}))

		// Minify
		.pipe($.minifyCss())

		// Another Timestamp
		.pipe($.insert.prepend(timestamp))

		// Output
		.pipe(gulp.dest('css'));

});

// Minify and concatenate JavaScript
gulp.task('js', function(){

	var timestamp = "// Timestamp " + $.moment().format(timestampFormat) + "\n";

	return gulp.src(src.js)
		.pipe($.concat('frontend.js'))
		.pipe($.insert.prepend(timestamp))
		.pipe(gulp.dest('js'))
		.pipe($.browserSync.reload({stream: true}))
		.pipe($.uglify())
		.pipe($.rename('frontend.min.js'))
		.pipe($.insert.prepend(timestamp))
		.pipe(gulp.dest('js'));
});

// Combine and Minify SVGs
// gulp.task('svg', function(){

// 	return gulp.src(src.svg)
// 		.pipe($.svgmin({
// 			plugins: [{
// 				cleanupIDs: false
// 			}]
// 		}))
// 		.pipe($.svgstore())
// 		.pipe($.rename('sprites.svg'))
// 		.pipe(gulp.dest('images'))
// 		.pipe($.browserSync.reload({stream: true}));
// });

// Output to build directory
gulp.task('build', function(){

	$.del.sync('build');
	return gulp.src([
			'index.html',
			'favicon.ico',
			'css/frontend.css',
			'css/frontend.min.css',
			'css/styles.css',
			'css/styles.min.css',
			'images/**',
			'fonts/**',
			'videos/**',
			'js/jquery.js',
			'js/jquery-ui.js',
			'js/frontend.js',
			'js/frontend.min.js',
			'js/plugins/**'
		], { base: '.' })
		.pipe(gulp.dest('build'));
});

//Publish to ecommdev.office.otterbox.com/otterbox/pattern-library
gulp.task('publish', ['build'], function(){
	console.log("Publishing to http://ecommdev.office.otterbox.com/otterbox/pattern-library");
	return gulp.src('build/**')
		.pipe($.rsync({
			hostname: 'ecommdev.office.otterbox.com',
			destination: '/vhosts/default/otterbox/pattern-library/',
			root: 'build',
			incremental: true,
			progress: true,
			emptyDirectories: true,
			recursive: true,
			clean: true,
			exclude: ['.DS_Store']
		}));
});

// Compile html partials into index.html
gulp.task('html', function(){

	gulp.src(['html/index.html'])
		.pipe($.fileInclude({
			prefix: '@@',
			basepath: '@file'
		}))
		.on('error', function(error){

			console.log(error);
			$.notifier.notify({
				title: "HTML Error",
				message: "There was an error compiling the HTML partials",
				sound: "Hero"
			});

		})
		.pipe(gulp.dest('.'))
		.pipe($.browserSync.reload({stream: true}));
});

// Browser Sync serve task
//gulp.task('serve', ['sass', 'svg', 'js', 'html'], function(){
gulp.task('serve', ['sass', 'js', 'html'], function(){

	$.browserSync.init({
		server: "./"
	});

	gulp.watch(src.sass, ['sass']);
	gulp.watch(src.svg, ['svg']);
	gulp.watch(src.js, ['js']);
	gulp.watch("html/*.html", ['html']);
});

// Default task (serve up Browser Sync)
gulp.task('default', ['serve']);