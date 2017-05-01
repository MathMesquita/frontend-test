/* global require */

let gulp = require("gulp"),
  sass = require("gulp-sass"),
  sourcemaps = require("gulp-sourcemaps"),
  bSync = require("browser-sync").create(),
  autoprefixer = require("gulp-autoprefixer"),
  inputs = {
    sass:"src/sass/*.sass",
    html:"src/*.html",
    js:"src/js/**/*.js",
    json:"src/**/*.json"
  },
  outputs = {
    sass:"dist/css/",
    html:"dist/",
    js:"dist/js/",
    json:"dist/"
  };

gulp.task("hot-reload", function(){
  bSync.init({
    port:4004,
    server:{
      baseDir:"./dist",
      index:"index.html"
    }
  });
});

gulp.task("sass", function(){
  gulp.src(inputs.sass)
    .pipe(sourcemaps.init())
    .pipe(sass().on("error", sass.logError))
    .pipe(autoprefixer())
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest(outputs.sass))
    .pipe(bSync.stream());
});

gulp.task("html", function(){
  gulp.src(inputs.html)
    .pipe(gulp.dest(outputs.html))
    .pipe(bSync.stream());
});

gulp.task("js", function(){
  gulp.src(inputs.js)
    .pipe(gulp.dest(outputs.js))
    .pipe(bSync.stream());
});

gulp.task("json", function(){
  gulp.src(inputs.json)
    .pipe(gulp.dest(outputs.json))
    .pipe(bSync.stream());
});

gulp.task("watch", function(){
  gulp.watch(inputs.html, ["html"]);
  gulp.watch(inputs.sass, ["sass"]);
  gulp.watch(inputs.js, ["js"]);
  gulp.watch(inputs.js, ["json"]);
});

gulp.task("default", ["hot-reload", "html", "sass", "js", "json", "watch"]);

// in a build task i would have put some other plugins
//  for minifying JS, CSS etc.