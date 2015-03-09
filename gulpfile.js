var gulp = require('gulp');
var mocha = require('gulp-mocha');
var watch = require('gulp-watch');
var nodeInspector = require('gulp-node-inspector');


gulp.task('test', function(){
	return gulp.src('test/*.js', {read: false})
        .pipe(mocha());
	});

gulp.task('watch', function() {
    gulp.watch(['lib/*.js', 'test/*.js'], ['test']);
});

gulp.task('debug', function() {
 
  gulp.src('index.js')
    .pipe(nodeInspector());
});

gulp.task('default', ['watch']);

