var name = "frame"
  , _        = require("underscore")
  , ndata    = require("ndata")
  , bunyan   = require("bunyan")
  , deflt    = require("../lib/default")
  , log      = bunyan.createLogger({name: name})
  , ctrlstr  = deflt.ctrlStr;

var mem = ndata.createClient({port: deflt.mem.port});

var exch = function(req, cb){
  var ro = {ok: true}
    , id = req.params.id
    , l1 = req.params.l1
    , l2 = req.params.l2
    , value = req.body;

  if(l2 == "Value" || l2 == "SdValue"){
    value = parseFloat(value)
  }
  if(l2 == "N" ){
    value = parseInt(value, 10)
  }

  mem.set([id, "exchange", l1, l2 ],value, function(err){
    if(!err){
      log.info(ro
              , "value written")
      cb(ro);
    }
  })
}
exports.exch = exch;

var cdhandle = function(req, cb){
  var ro = {ok: true}
    , val = { id: req.params.mpid, cdid: req.params.cdid}
    , cmd = req.body;

  if(cmd == "load"){
    mem.publish("get_cd",val , function(err){
      if(!err){
        cb({ok:true});
      }
    });
  }
  if(cmd == "remove"){
    mem.publish("rm_cd",val , function(err){
      if(!err){
        cb({ok:true});
      }
    });
  }
}
exports.cdhandle = cdhandle;