#! /usr/bin/env node

var exec       = require('child_process').exec,
    fs_watcher = require('./fs_watcher');

var baseDir = 'static/js/';


var formatedDate = function(date){
  return '' + date.getHours() + ':' + date.getMinutes() +
         ':' + date.getSeconds();
};

var compileCoffee = function(filepath) {
    var cmd = 'coffee -b -c ' + filepath,
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


fs_watcher.watch('static/js', /.*\.coffee$/, function (path, curr, prev) {
    compileCoffee(path);
});

