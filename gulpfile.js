var gulp = require('gulp');
var serve = require('gulp-serve');
var jade = require('gulp-jade');
var htmlmin = require('gulp-htmlmin');
var ngHtml2Js = require('gulp-ng-html2js');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var sassLint = require('gulp-sass-lint');
var jsonlint = require('gulp-jsonlint');
var eslint = require('gulp-eslint');
var jscs = require('gulp-jscs');
var uglify = require('gulp-uglify');
var cssmin = require('gulp-cssmin');
var rename = require('gulp-rename');
var cdnizer = require('gulp-cdnizer');
var ghPages = require('gulp-gh-pages');
var git = require('gulp-git');
var fs = require('fs');
var bump = require('gulp-bump');
var runSequence = require('run-sequence');
var spawn = require('child_process').spawn;
var gutil = require('gulp-util');

gulp.task('jade-demo', function() {
  return gulp.src('demo/index.jade')
    .pipe(jade())
    .pipe(gulp.dest('build-demo'));
});

gulp.task('ng-templates', function() {
  return gulp.src('tpls/*.jade')
    .pipe(jade())
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(ngHtml2Js({
      moduleName: 'ngNestedTreeTemplates',
      prefix: '/ng-nestedtree-templates/'
    }))
    .pipe(concat('ng-nestedtree-templates.js'))
    .pipe(gulp.dest('.tmp'));
});

gulp.task('sass', function() {
  return gulp.src('sass/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('dist'));
});

gulp.task('sasslint', function() {
  gulp.src('sass/**/*.s+(a|c)ss')
    .pipe(sassLint())
    .pipe(sassLint.format())
    .pipe(sassLint.failOnError())
});

gulp.task('jsonlint', function() {
  gulp.src([
      '.eslintrc',
      '.jscsrc',
      '*.json'
    ])
      .pipe(jsonlint())
      .pipe(jsonlint.reporter());
});

gulp.task('eslint', function() {
  return gulp.src([
    'js/*.js',
    'demo/*.js',
    'gulpfile.js'
  ])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('jscs', function() {
  return gulp.src([
    'js/*.js',
    'demo/*.js',
    'gulpfile.js'
  ])
    .pipe(jscs())
    .pipe(jscs.reporter());
});

gulp.task('concat-js', ['ng-templates'], function() {
  return gulp.src([
    'js/ng-nestedtree.js',
    '.tmp/ng-nestedtree-templates.js'
  ])
    .pipe(concat('ng-nestedtree.js'))
    .pipe(gulp.dest('dist'));
});

gulp.task('minify-js', ['concat-js'], function() {
  return gulp.src([
    'dist/ng-nestedtree.js'
  ])
    .pipe(uglify())
    .pipe(rename('ng-nestedtree.min.js'))
    .pipe(gulp.dest('dist'));
});


gulp.task('demo-js', function() {
  return gulp.src([
    'demo/demo.js'
  ])
    .pipe(gulp.dest('build-demo'));
});

gulp.task('minify-css', ['sass'], function() {
  gulp.src('dist/ng-nestedtree.css')
    .pipe(cssmin())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('dist'));
});

gulp.task('deploy', ['cdnize'], function() {
  return gulp.src('build-demo/**')
    .pipe(ghPages());
});

gulp.task('cdnize', ['build-demo'], function() {
  gulp.src('build-demo/**/*.html')
    .pipe(cdnizer({
      files: [{
        file: 'angular.min.js',
        package: 'angular',
        cdn: '//ajax.googleapis.com/ajax/libs/angularjs/${ version }/' +
          'angular.min.js'
      },
      {
        file: 'ng-nestedtree.js',
        cdn: '//rawgit.com/komachi/ng-nestedtree/master/dist/' +
          'ng-nestedtree.min.js'
      },
      {
        file: 'ng-nestedtree.css',
        cdn: '//rawgit.com/komachi/ng-nestedtree/master/dist/' +
          'ng-nestedtree.min.css'
      }]
    }))
    .pipe(gulp.dest('build-demo'));
});

gulp.task('bump-version', function() {
  return gulp.src(['bower.json', 'package.json'])
    .pipe(bump({type: 'patch'}).on('error', gutil.log))
    .pipe(gulp.dest('./'));
});

gulp.task('commit-changes', function() {
  return gulp.src('.')
    .pipe(git.add())
    .pipe(git.commit('[Prerelease] Bumped version number'));
});

gulp.task('push-changes', function(cb) {
  git.push('origin', 'master', cb);
});


gulp.task('create-new-tag', function(cb) {
  var version = getPackageJsonVersion();
  git.tag(version, 'Created Tag for version: ' + version, function(error) {
    if (error) {
      return cb(error);
    }
    git.push('origin', 'master', {args: '--tags'}, cb);
  });

  function getPackageJsonVersion() {
    return JSON.parse(fs.readFileSync('./package.json', 'utf8')).version;
  }
});

gulp.task('npm-publish', function(done) {
  spawn('npm', ['publish'], { stdio: 'inherit' }).on('close', done);
});

gulp.task('release', ['build', 'deploy'], function(callback) {
  runSequence(
    'bump-version',
    'commit-changes',
    'push-changes',
    'create-new-tag',
    'npm-publish',
    function(error) {
      if (error) {
        gutil.log(error.message);
      } else {
        gutil.log('RELEASE FINISHED SUCCESSFULLY');
      }
      callback(error);
    });
});

gulp.task('build-demo', ['jade-demo', 'concat-js', 'sass', 'demo-js']);

gulp.task('serve', ['build-demo'], serve({
  root: ['build-demo', 'dist', 'node_modules/angular', 'js', '.tmp']
}));

gulp.task('test', ['sasslint', 'jsonlint', 'eslint', 'jscs']);

gulp.task('build', ['sass', 'concat-js', 'minify-js', 'minify-css']);
