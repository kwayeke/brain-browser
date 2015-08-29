#!/usr/bin/env node

var http = require('http');
var _ = require('lodash');
var express = require('express');
var fs = require('fs');
var path = require('path');
var util = require('util');
var program = require('commander');

function collect(val, memo) {
  if(val && val.indexOf('.') != 0) val = "." + val;
  memo.push(val);
  return memo;
}

program
  .option('-p, --port <port>', 'Port to run the file-browser. Default value is 8088')
  .option('-e, --exclude <exclude>', 'File extensions to exclude. To exclude multiple extension pass -e multiple times. e.g. ( -e .js -e .cs -e .swp) ', collect, [])
  .parse(process.argv);

var app = express();
var dir = process.cwd();
app.use(express.static(dir));       //app public directory
app.use(express.static(__dirname)); //module directory
var server = http.createServer(app);
if(!program.port) program.port = 9099;
server.listen(program.port);
console.log("Brain browser is running at http://localhost:" + program.port);

app.get('/view', function(req, res) {
 var nifti = req.query.nifti || '1'; 
 console.log('in function');
 res.redirect('static/?loc=' + nifti); 
});

app.get('/files', function(req, res) {
 var currentDir =  dir;
 var query = req.query.path || '';
 if (query) currentDir = path.join(dir, query);
 console.log("browsing ", currentDir);
 fs.readdir(currentDir, function (err, files) {
     if (err) {
        throw err;
      }
      var data = [];
      files
      .filter(function (file) {
          return true;
      }).forEach(function (file) {
        try {
                console.log("processing ", file);
                var isDirectory = fs.statSync(path.join(currentDir,file)).isDirectory();
                if (isDirectory) {
                  data.push({ Name : file, Class:"folder", IsDirectory: true, Path : path.join(query, file) });
                } else {

                  // Regular expression to find .nii.gz
                  var re = /.nii.gz/g;
                  if (re.test(file)) {
                      var ext = ".nii.gz"
                  } else {
                      var ext = path.extname(file);
                  }
                  if(program.exclude && _.contains(program.exclude, ext)) {
                    console.log("excluding file ", file);
                    return;
                  }
                  if(ext == ".nii" || ext == ".nii.gz"){
                     var fileclass = "brain";
                  } else {
                     var fileclass = "file";
                  }     
                  data.push({ Name : file, Ext : ext, IsDirectory: false, Class: fileclass, Path : path.join(query, file), Base:currentDir  });
                }

        } catch(e) {
          console.log(e); 
        }        
        
      });
      data = _.sortBy(data, function(f) { return f.Name });
      res.json({Data:data});
  });
});

app.get('/', function(req, res) {
 res.redirect('static/'); 
});
