var fs = require('fs');
var path = require('path');
var url = require('url');
var archive = require('../helpers/archive-helpers');
var httpHelpers = require('./http-helpers');
// require more modules/folders here!

exports.handleRequest = function(req, res) {
  var pathurl = url.parse(req.url).pathname;
  var noSlashUrl = pathurl.replace('/', '');
  res.end(archive.paths.list);
  if (req.method === 'GET') {
    if (pathurl === '/') {
      httpHelpers.serveAssets(res, 'index.html', 200);
    } else {
      archive.isURLArchived(noSlashUrl, function(isURL) {
        if (isURL) {
          httpHelpers.serveArchives(res, noSlashUrl, 200)
        } else {
          res.writeHead(404, httpHelpers.headers);
          res.end('');
        }
      });
    }

  } else if (req.method === 'POST') {
    console.log('!!!!!!!!!!!!!!!!!!!!!!!!!' + pathurl);
    res.writeHead(302, httpHelpers.headers);

    var buffer = [];
    req.on('data', function(chunk){
      buffer += chunk;
    });

    req.on('end', function(){
      var newCleanUrl = buffer.toString().slice(4);
      //console.log(newCleanUrl);

      archive.isUrlInList(newCleanUrl, function(urlExists){
        if(urlExists){
          archive.isURLArchived(newCleanUrl, function(isArchived) {
            if (isArchived) {
              httpHelpers.serveArchives(res, newCleanUrl, 200);
            } else {
              httpHelpers.serveAssets(res, 'loading.html', 200);
            }
          });
        } else {
          fs.appendFile(archive.paths['list'], newCleanUrl + '\n', function (err) {
            if (err) throw err;
            console.log('The "data to append" was appended to file!');
            //res.writeHead(200, httpHelpers.headers);
            http.serveAssets(res, 'loading.html', 200);
          });
          //append to archive list
        }
      });
    });
  }
};
