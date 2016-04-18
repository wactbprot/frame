var frame = function(){
  var prog    = require("commander")
    , bunyan  = require("bunyan")
    , _       = require("underscore")
    , restify = require("restify")
    , send    = require("./lib/send") // to browser
    , receive = require("./lib/receive") // from browser
    , jsnhtml = require("./lib/jsnhtml")
    , hc      = require("./lib/template")
    , deflt   = require("./lib/default")
    , pj      = require("./package.json")
    , server  = restify.createServer({name: deflt.appname})
    , log     = bunyan.createLogger({name: deflt.appname})
    , ok      = {ok:true};

  prog.version(pj.version)
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
  server.get( "/favicon.ico", restify.serveStatic({
    'directory': __dirname
  }));

  // ---------- put requests
  server.put("/:mpid/exchange/:l1/:l2", function(req, res, next){
    res.writeHead(200, {
      'Content-Type': 'text/html'
    });
    receive.exch(req, function(){
      res.end();
    });
    next();
  });

  server.put("/:mpid/:container/message", function(req, res, next){
    res.writeHead(200, {
      'Content-Type': 'text/html'
    });
    receive.message(req, function(){
      res.end();
    });
    next();
  });

  server.put("/:mpid/id/:cdid", function(req, res, next){
    res.writeHead(200, {
      'Content-Type': 'text/html'
    });
    receive.cdhandle(req, function(){
      res.end();
    });
    next();
  });

  server.put("/:mpid/:no/ctrl", function(req, res, next){
    res.writeHead(200, {
      'Content-Type': 'text/html'
    });
    receive.ctrl(req, function(){
      res.end();
    });
    next();
  });


  // ---------- get requests
  server.get("/:id/:container/elements", function(req, res, next){
    res.writeHead(200, {
      'Content-Type': 'text/html'
    });
    send.elements(req, function(err, jsn){
      if(!err){
        jsnhtml.elements(req, jsn, function(html){
          res.write(html);
          res.end();
        });
      }else{
        log.error(err
                 , "request failed");
        res.write(hc["error"](err));
        res.end();
      }
    });
    next();
  });

  server.get("/:id/exchange/:exchkey", function(req, res, next){
    res.writeHead(200, {
      'Content-Type': 'text/html'
    });
    send.exch(req, function(err, jsn){
      if(!err){
      jsnhtml.element(req, jsn, function(html){
        res.write(html);
        res.end();
      });
      }else{
        log.error(err
                 , "request failed");
        res.write(hc["error"](err));
        res.end();
      }
    });
    next();
  });

  server.get("/:id/exchange/:exchkey/:subkey", function(req, res, next){
    res.writeHead(200, {
      'Content-Type': 'text/html'
    });
    send.exch(req, function(err, jsn){
      if(!err){
        jsnhtml.elem(req, jsn, function(html){
          res.write(html);
          res.end();
        });
      }else{
        log.error(err
                 , "request failed");
        res.write(hc["error"](err));
        res.end();
      }
    });
    next();
  });

  server.get("/:id/:container/state", function(req, res, next){
    res.writeHead(200, {
      'Content-Type': 'text/html'
    });
    send.task_state(req, function(err, jsn){
      if(!err){
        jsnhtml.task_state(req, jsn, function(html){
          res.write(html);
          res.end();
        });
      }else{
        log.error(err
                 , "request failed");
        res.write(hc["error"](err));
        res.end();
      }
    });
    next();
  });

  server.get("/:id/:container/:struct/frame", function(req, res, next){
    res.writeHead(200, {
      'Content-Type': 'text/html'
    });
    send.meta(req, function(err, jsn){
      if(!err){
        jsnhtml.frame(req, jsn, function(html){
          res.write(html);
          res.end();
        });
      }else{
        log.error(err
                 , "request failed");
        res.write(hc["error"](err));
        res.end();
      }
    });
    next();
  });

  server.get("/:id/id", function(req, res, next){
    res.writeHead(200, {
      'Content-Type': 'text/html'
    });
    send.cdid(req, function(err, jsn){
      if(!err){
        jsnhtml.cdid(req, jsn, function(html){
          res.write(html);
          res.end();
        });
      }else{
        log.error(err
                 , "request failed");
        res.write(hc["error"](err));
        res.end();
      }
    });
    next();
  });

  // timer auch im Fehlerfall Zurücksenden
  server.get("/:id/timer", function(req, res, next){
    res.writeHead(200, {
      'Content-Type': 'text/html'
    });
    send.timer(req, function(err, jsn){
      jsnhtml.timer(req, jsn, function(html){
        res.write(html);
        res.end();
      });
    });
    next();
  });

  server.get("/:id/:container/message", function(req, res, next){
    send.message(req, function(err, msg){
      res.write(msg);
      res.end();
    });
    next();
  });

  server.listen(deflt.frame.port, function() {
    log.info(ok
            , "\n"
            + "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n"
            + "frame view server up and running @"
            + deflt.frame.port +"\n"
            + "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n"
            );

  });

}
module.exports = frame;
