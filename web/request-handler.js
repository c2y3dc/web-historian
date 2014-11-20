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
    //is there a request or is it === to '/' {
    if (pathurl === '/') {
      res.writeHead(200, httpHelpers.headers);
      httpHelpers.serveAssets(res, 'index.html', function(data) {
        res.end(data.toString());
      });
    } else {
      archive.isURLArchived(noSlashUrl, function(isURL) {
        if (isURL) {
          //console.log("pathurl", pathurl);
          //console.log("noSlashURL", noSlashUrl);
          res.writeHead(200, httpHelpers.headers);
          httpHelpers.serveArchives(res, noSlashUrl, function(data) {
            console.log("data in serveArch", data);
            res.end(data.toString());
          });
        } else {
          res.writeHead(404, httpHelpers.headers);
          res.end('');
        }
      });
    }
    // else
    // //is the request in our archives?
    //     if it is ? serve up the archived file
    //  else
    //     return 404 error, file that we're looking for
    //     does not exist


    //serve Assets (write later)
  } else if (req.method === 'POST') {
    res.writeHead(302, httpHelpers.headers);

  }

};
