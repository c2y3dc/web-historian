var path = require('path');
var archive = require('../helpers/archive-helpers');
var url = require('url');
var httpHelpers = require('./http-helpers');
// require more modules/folders here!

exports.handleRequest = function (req, res){
  var pathurl = url.parse(req.url).pathname;
  var noSlashUrl = pathurl.replace('/','');
  res.end(archive.paths.list);
  if(req.method === 'GET'){
    //is there a request or is it === to '/' {
    if(pathurl === '/'){
      res.writeHead(200, httpHelpers.headers);
      //serverAssets index.html                                                                                                                                                                                                                                                                                                                                                                                                                                index.html
    } else if(archive.isURLArchived()) {

    }
    // else
    // //is the request in our archives?
    //     if it is ? serve up the archived file
    //  else
    //     return 404 error, file that we're looking for
    //     does not exist


    //serve Assets (write later)

  }else if(req.method === "POST"){


  }

  }
};
