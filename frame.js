var frame = function(){
  var prog    = require("commander")
    , _       = require("underscore")
    , restify = require("restify")
    , coll    = require("./lib/collections")
    , jsnhtml = require("./lib/jsnhtml")
    , receive = require("./lib/receive")
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

  server.put("/:mpid/exchange/:l1/:l2", function(req, res, next){
    receive.exch(req, function(){
      res.end();
    });
    next();
  });

  server.put("/:mpid/id/:cdid", function(req, res, next){
    receive.cdhandle(req, function(){
      res.end();
    });
    next();
  });

  server.put("/:mpid/:no/ctrl", function(req, res, next){
    receive.ctrl(req, function(){
      res.end();
    });
    next();
  });

  server.get("/:id/:container/elements", function(req, res, next){
    res.writeHead(200, {
      'Content-Type': 'text/html'
    });
    coll.elements(req, function(jsn){
      jsnhtml.elements(req, jsn, function(html){
        res.write(html);
        res.end();
      });
    });
    next();
  });

  server.get("/:id/exchange/:exchkey", function(req, res, next){
    res.writeHead(200, {
      'Content-Type': 'text/html'
    });
    coll.exch(req, function(jsn){
      jsnhtml.element(req, jsn, function(html){
        res.write(html);
        res.end();
      });
    });
    next();
  });

  server.get("/:id/exchange/:exchkey/:subkey", function(req, res, next){
    res.writeHead(200, {
      'Content-Type': 'text/html'
    });
    coll.exch(req, function(jsn){
      jsnhtml.elem(req, jsn, function(html){
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
    coll.task_state(req, function(jsn){
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
    coll.meta(req, function(jsn){
      jsnhtml.frame(req, jsn, function(html){
        res.write(html);
        res.end();
      });
    });
    next();
  });

  server.get("/:id/id", function(req, res, next){
    res.writeHead(200, {
      'Content-Type': 'text/html'
    });
    coll.cdid(req, function(jsn){
      jsnhtml.cdid(req, jsn, function(html){
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
