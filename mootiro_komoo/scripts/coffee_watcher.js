#! /usr/bin/env node

var fs   = require('fs'),
    exec = require('child_process').exec;

var baseDir = 'static/js/';

String.prototype.endsWith = function(suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
};

var formatedDate = function(date){
  return '' + date.getHours() + ':' + date.getMinutes() +
         ':' + date.getSeconds();
};

var compileCoffee = function(filepath) {
    var cmd = 'coffee -c ' + filepath,
        now = new Date();

    console.log('[coffee] ' + formatedDate(now) + ' : ' + filepath);
    exec(cmd, function(error, stdout, stderr){
        if (stdout) {
          console.log(stdout);
        }
        if (error !== null) {
          console.log('error:: ' + error);
        }
    });
};

var watch = function(path, filePattern, callback) {
  fs.stat(path, function(err, stats){
    if (err) {
      console.log('Error retrieving stats for file: ' + path);
    } else {
      if (stats.isDirectory()) {
        fs.readdir(path, function(err, fileNames) {
          if(err) {
            console.log('Error reading path: ' + path);
          }
          else {
            fileNames.forEach(function (fileName) {
              watch(path + '/' + fileName, filePattern, callback);
            });
          }
        });
      } else {
        if (path.match(filePattern)) {
          fs.watchFile(path, function(curr, prev) {
            callback(path, curr, prev);
          });
        }
      }
    }
  });
};

watch('static/js', /.*\.coffee$/, function (path, curr, prev) {
    // console.log('change detected... ' + path);
    compileCoffee(path);
});

// dirs = [baseDir, baseDir + 'partials/'];
// for (var i = 0; i < dirs.length; i++ ){
//   var dir = dirs[i];
//   fs.watch(dir, {persistent: true}, function(evt, fname) {
//     if (fname.endsWith('.less')) {
//       console.log(evt + ' on ' + fname);
//       compileLess();
//     }
//   });
// }
