var fs = require('fs');
var path = require('path');
var url = require('url');
var archive = require('../helpers/archive-helpers');
var httpHelpers = require('./http-helpers');
// require more modules/folders here!

exports.handleRequest = function(req, res) {
  var pathurl = url.parse(req.url).pathname;
  var noSlashUrl = pathurl.replace('/', '');
  //res.end(archive.paths.list);
  if (req.method === 'GET') {
    if (pathurl === '/') {
      httpHelpers.serveAssets(res, 'index.html', 200);
    } else {
      archive.isURLArchived(noSlashUrl, function(isURL) {
        if (isURL) {
          httpHelpers.serveArchives(res, noSlashUrl, 200);
        } else {
          res.writeHead(404, httpHelpers.headers);
          res.end('');
        }
      });
    }
  } else if (req.method === 'POST') {
    //res.writeHead(302, httpHelpers.headers);
    var buffer = [];
    req.on('data', function(chunk) {
      buffer += chunk;
    });
    req.on('end', function() {
      var newCleanUrl = buffer.toString().slice(4)
        //if users submit a page you already have, auto-redirect them
        //to archived version or loading.html
      archive.isUrlInList(newCleanUrl, function(urlInList) {
        if (urlInList) {
          //is the url archived?
          archive.isURLArchived(newCleanUrl, function(isArchived) {
            if (isArchived) {
              //serve archived site
              httpHelpers.serveArchives(res, newCleanUrl, 200);
            } else {
              //serve loading.html until site is archived
              httpHelpers.serveAssets(res, 'loading.html', 302);
            }
          });
        } else {
          //schedule site to be archived in our list
          fs.appendFile(archive.paths.list, newCleanUrl+'\n', function (err) {
            if (err) throw err;
            httpHelpers.serveAssets(res, 'loading.html', 302);
          });
        }
      });
      // fs.writeFile(archive.paths.list, newCleanUrl + '\n', function(err) {
      //   if (err) throw err;
      //   res.end(archive.paths.list);
      // });
    });
  }
};
