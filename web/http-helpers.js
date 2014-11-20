var path = require('path');
var fs = require('fs');
var archive = require('../helpers/archive-helpers');

exports.headers = headers = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10, // Seconds.
  'Content-Type': "text/html"
};

exports.serveAssets = function(res, asset, status) {
  fs.readFile(archive.paths['siteAssets'] + '/' + asset, function(err, data) {
    if (err) throw err;
    res.writeHead(status, headers);
    res.end(data.toString());
  });
};

exports.serveArchives = function(res, url, status) {
  fs.readFile(archive.paths['archivedSites'] + '/' + url, function(err, data) {
    if (err) throw err;
    res.writeHead(status, headers);
    res.end(data.toString());
  }); 
};


// As you progress, keep thinking about what helper functions you can put here!
