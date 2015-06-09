var frame = function(){
  var prog    = require("commander")
    , _       = require("underscore")
    , bunyan  = require("bunyan")
    , coll    = require("./lib/collections")
    , jsnhtml = require("./lib/jsnhtml")
    , deflt   = require("./lib/default")
    , mem     = require("ndata").createClient({port: deflt.mem.port})
    , restify = require("restify")
    , server  = restify.createServer({name: deflt.appname})
    , log     = bunyan.createLogger({name: deflt.appname})

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

  server.listen(deflt.frame.port, function() {
    log.info({ok: true}
            , "``````````````````````````````\n"
            + "frame server up and running @"
            + deflt.frame.port +"\n"
            + "``````````````````````````````"
            );
  });

}
module.exports = frame;
