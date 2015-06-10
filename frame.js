var frame = function(){
  var prog    = require("commander")
    , _       = require("underscore")

    , restify = require("restify")
    , coll    = require("./lib/collections")
    , jsnhtml = require("./lib/jsnhtml")
    , deflt   = require("./lib/default")

    , mem     = require("ndata").createClient({port: deflt.mem.port})

    , server  = restify.createServer({name: deflt.appname})


  prog.version("0.0.1")
  .parse(process.argv);


  server.pre(restify.pre.sanitizePath());
  server.use(restify.queryParser());
  server.use(restify.bodyParser());
  server.use(function crossOrigin(req,res,next){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    return next();
  });

  server.get( "/css/:file", restify.serveStatic({
    'directory': __dirname
  }));
  server.get( "/fonts/:file", restify.serveStatic({
    'directory': __dirname
  }));
  server.get( "/js/:file", restify.serveStatic({
    'directory': __dirname
  }));


  server.get("/:id/:container/elements", function(req, res, next){
    res.writeHead(200, {
      'Content-Type': 'text/html'
    });
    coll.get_elements(req, function(jsn){
      jsnhtml.elements(req, jsn, function(html){
        res.write(html);
        res.end();
      });
    });
    next();
  });

  server.get("/:id/:container/state", function(req, res, next){
    res.writeHead(200, {
      'Content-Type': 'text/html'
    });
    coll.get_task_state(req, function(jsn){
      jsnhtml.task_state(req, jsn, function(html){
        res.write(html);
        res.end();
      });
    });
    next();
  });
  server.get("/:id/:container/:struct/frame", function(req, res, next){
    res.writeHead(200, {
      'Content-Type': 'text/html'
    });
    coll.get_mp(req, function(jsn){
      jsnhtml.frame(req, jsn, function(html){
        res.write(html);
        res.end();
      });
    });
    next();
  });

  server.listen(deflt.frame.port, function() {
  });

}
module.exports = frame;
