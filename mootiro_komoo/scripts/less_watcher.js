#! /usr/bin/env node

var fs   = require('fs'),
    exec = require('child_process').exec;

var baseDir = 'static/css/';

String.prototype.endsWith = function(suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
};

var formatedDate = function(date){
  return '' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
};

var compileLess = function() {
    var cmd = 'lessc static/css/fashion.less > static/css/fashion.css',
        now = new Date();

    console.log('Compiling: ' + formatedDate(now));
    exec(cmd, function(error, stdout, stderr){
        if (stdout) {
          console.log(stdout);
        }
        if (error !== null) {
          console.log('error:: ' + error);
        }
    });
};

// compile on start
compileLess();

dirs = [baseDir, baseDir + 'partials/'];
for (var i = 0; i < dirs.length; i++ ){
  var dir = dirs[i];
  fs.watch(dir, {persistent: true}, function(evt, fname) {
    if (fname.endsWith('.less')) {
      console.log(evt + ' on ' + fname);
      compileLess();
    }
  });
}
