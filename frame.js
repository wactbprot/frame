module.exports = function(cb){
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
    , broker  = require("sc-broker")
    , server  = restify.createServer({name: deflt.appname})
    , log     = bunyan.createLogger({name: deflt.appname})
    , mem     = broker.createClient({port: deflt.mem.port})
    , ok      = {ok:true}
    , htmlcontent   = {'Content-Type': 'text/html'}
    , asciicontent  = {'Content-Type': 'text/ascii'}

  prog.version(pj.version).parse(process.argv);

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

    res.writeHead(200, htmlcontent);
    receive.exch(req, function(err){
      if(!err){
        res.end();
      }
    });
    next();
  });

  server.put("/:mpid/:container/message", function(req, res, next){
    res.writeHead(200, htmlcontent);
    receive.message(req, function(err){
      if(!err){
        res.end();
      }
    });
    next();
  });

  server.put("/:mpid/id/:cdid", function(req, res, next){
    res.writeHead(200, htmlcontent);
    receive.cdhandle(req, function(err){
      if(!err){
        res.end();
      }
    });
    next();
  });

  server.put("/:mpid/:no/ctrl", function(req, res, next){
    res.writeHead(200, htmlcontent);
    receive.ctrl(req, function(err){
      if(!err){
        res.end();
      }
    });
    next();
  });
 server.put("/:mpid/:no/state/:seq/:par", function(req, res, next){
    res.writeHead(200, htmlcontent);
    receive.state(req, function(err){
      if(!err){
        res.end();
      }
    });
    next();
  });


  // ---------- get requests
  server.get("/:id/:container/elements", function(req, res, next){
    mem.get([req.params.id], function(err, mp){
      if(!err && mp){
        send.elements(req, function(err, jsn){
          if(!err && jsn){
            res.writeHead(200, htmlcontent);
            jsnhtml.elements(req, jsn, function(err, html){
              if(!err){
                res.write(html);
              }else{
                // error
              }
              res.end();
            });
          }else{
            res.writeHead(503, htmlcontent);
            log.error(err
                     , "request failed");
            res.write(hc["error"](err));
            res.end();
          }
        });
      }else{
        res.writeHead(202,asciicontent);
        res.write("mp not available");
        res.end();
      }
    });
    next();
  });

  server.get("/:id/exchange/:exchkey", function(req, res, next){
    mem.get([req.params.id], function(err, mp){
      if(!err && mp){
        send.exch(req, function(err, jsn){
          if(!err && jsn){
            res.writeHead(200, htmlcontent);
            jsnhtml.element(req, jsn, function(err, html){
              if(!err){
                res.write(html);
              }else{
                // error
              }
              res.end();
            });
          }else{
            res.writeHead(503, htmlcontent);
            log.error(err
                     , "request failed");
            res.write(hc["error"](err));
            res.end();
          }
        });
      }else{
        res.writeHead(202,asciicontent);
        res.write("mp not available");
        res.end();
      }
    });
    next();
  });

  server.get("/:id/exchange/:exchkey/:subkey", function(req, res, next){
    mem.get([req.params.id], function(err, mp){
      if(!err && mp){

        send.exch(req, function(err, jsn){
          if(!err && jsn){
            res.writeHead(200, htmlcontent);
            jsnhtml.elem(req, jsn, function(err, html){
              if(!err){
                res.write(html);
              }else{
                // error
              }
              res.end();
            });
          }else{
            res.writeHead(503, htmlcontent);
            log.error(err
                     , "request failed");
            res.write(hc["error"](err));
            res.end();
          }
        });
      }else{
        res.writeHead(202,asciicontent);
        res.write("mp not available");
        res.end();
      }
    });
    next();
  });

  server.get("/:id/:container/state", function(req, res, next){
    mem.get([req.params.id], function(err, mp){
      if(!err && mp){
        send.task_state(req, function(err, jsn){
          if(!err && jsn){
            res.writeHead(200, htmlcontent);
            jsnhtml.task_state(req, jsn, function(err, html){
              if(!err){
                res.write(html);
              }else{
                // error
              }
              res.end();
            });
          }else{
            res.writeHead(503, htmlcontent);
            log.error(err
                     , "request failed");
            res.write(hc["error"](err));
            res.end();
          }
        });
      }else{
        res.writeHead(202,asciicontent);
        res.write("mp not available");
        res.end();
      }
    });
    next();
  });

  server.get("/:id/:container/:struct/frame", function(req, res, next){
    mem.get([req.params.id], function(err, mp){
      if(!err && mp){
        send.meta(req, function(err, jsn){
          if(!err && jsn){
            res.writeHead(200, htmlcontent);
            jsnhtml.frame(req, jsn, function(err, html){

              if(!err){
                res.write(html);
              }else{
                //error
              }
              res.end();
            });
          }else{
            res.writeHead(503, htmlcontent);
            log.error(err
                     , "request failed");
            res.write(hc["error"](err));
            res.end();
          }
        });
      }else{
        res.writeHead(202,asciicontent);
        res.write("mp not available");
        res.end();
      }
    });
    next();
  });

  server.get("/:id/id", function(req, res, next){
    mem.get([req.params.id], function(err, mp){
      if(!err && mp){
        send.cdid(req, function(err, jsn){
          if(!err && jsn){
            res.writeHead(200, htmlcontent);
            jsnhtml.cdid(req, jsn, function(err, html){
              res.write(html);
              res.end();
            });
          }else{
            res.writeHead(503, htmlcontent);
            log.error(err
                     , "request failed");
            res.write(hc["error"](err));
            res.end();
          }
        });
      }else{
        res.writeHead(202,asciicontent);
        res.write("mp not available");
        res.end();
      }
    });
    next();
  });

  server.get("/:id/:container/message", function(req, res, next){
    mem.get([req.params.id], function(err, mp){
      if(!err && mp){
        send.message(req, function(err, msg){
          if(!err){
            res.write(msg);
          }else{
            // error
          }
          res.end();
        });
      }else{
        res.writeHead(202,asciicontent);
        res.write("mp not available");
        res.end();
      }
    });
    next();
  });

  server.listen(deflt.port, function() {
    log.info(ok
            , "\n"
            + "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n"
            + "frame view server up and running @"
            + deflt.port +"\n"
            + "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n"
            );
    if(_.isFunction(cb)){
      cb();
    }
  });
}
