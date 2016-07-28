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
    , ok      = {ok:true}
    , ctype   = {'Content-Type': 'text/html'};

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
    res.writeHead(200, ctype);
    receive.exch(req, function(err){
    if(!err){
      res.end();
    }
    });
    next();
  });

  server.put("/:mpid/:container/message", function(req, res, next){
    res.writeHead(200, ctype);
    receive.message(req, function(err){
     if(!err){
       res.end();
     }
    });
    next();
  });

  server.put("/:mpid/id/:cdid", function(req, res, next){
    res.writeHead(200, ctype);
    receive.cdhandle(req, function(err){
     if(!err){
       res.end();
     }
    });
    next();
  });

  server.put("/:mpid/:no/ctrl", function(req, res, next){
    res.writeHead(200, ctype);
    receive.ctrl(req, function(err){
      if(!err){
        res.end();
     }
    });
    next();
  });


  // ---------- get requests
  server.get("/:id/:container/elements", function(req, res, next){
    send.elements(req, function(err, jsn){
      if(!err && jsn){
        res.writeHead(200, ctype);
        jsnhtml.elements(req, jsn, function(err, html){
          if(!err){
            res.write(html);
          }else{
            // error
          }
          res.end();
        });
      }else{
        res.writeHead(503, ctype);
        log.error(err
                 , "request failed");
        res.write(hc["error"](err));
        res.end();
      }
    });
    next();
  });

  server.get("/:id/exchange/:exchkey", function(req, res, next){
    send.exch(req, function(err, jsn){
      if(!err && jsn){
        res.writeHead(200, ctype);
        jsnhtml.element(req, jsn, function(err, html){
          if(!err){
            res.write(html);
          }else{
            // error
          }
          res.end();
        });
      }else{
        res.writeHead(503, ctype);
        log.error(err
                 , "request failed");
        res.write(hc["error"](err));
        res.end();
      }
    });
    next();
  });

  server.get("/:id/exchange/:exchkey/:subkey", function(req, res, next){
    send.exch(req, function(err, jsn){
      if(!err && jsn){
        res.writeHead(200, ctype);
        jsnhtml.elem(req, jsn, function(err, html){
          if(!err){
            res.write(html);
          }else{
            // error
          }
          res.end();
        });
      }else{
        res.writeHead(503, ctype);
        log.error(err
                 , "request failed");
        res.write(hc["error"](err));
        res.end();
      }
    });
    next();
  });

  server.get("/:id/:container/state", function(req, res, next){
    send.task_state(req, function(err, jsn){
      if(!err && jsn){
        res.writeHead(200, ctype);
        jsnhtml.task_state(req, jsn, function(err, html){
          if(!err){
            res.write(html);
          }else{
              // error
            }
          res.end();
        });
      }else{
        res.writeHead(503, ctype);
        log.error(err
                 , "request failed");
        res.write(hc["error"](err));
        res.end();
      }
    });
    next();
  });

  server.get("/:id/:container/:struct/frame", function(req, res, next){
    send.meta(req, function(err, jsn){
      if(!err && jsn){
        res.writeHead(200, ctype);
        jsnhtml.frame(req, jsn, function(err, html){
          if(!err){
            res.write(html);
          }else{
            //error
          }
          res.end();
        });
      }else{
        res.writeHead(503, ctype);
        log.error(err
                 , "request failed");
        res.write(hc["error"](err));
        res.end();
      }
    });
    next();
  });

  server.get("/:id/id", function(req, res, next){
    send.cdid(req, function(err, jsn){
      if(!err && jsn){
        res.writeHead(200, ctype);
        jsnhtml.cdid(req, jsn, function(err, html){
          res.write(html);
          res.end();
        });
      }else{
        res.writeHead(503, ctype);
        log.error(err
                 , "request failed");
        res.write(hc["error"](err));
        res.end();
      }
    });
    next();
  });

  server.get("/:id/:container/message", function(req, res, next){
    send.message(req, function(err, msg){
      if(!err){
        res.write(msg);
      }else{
        // error
      }
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
