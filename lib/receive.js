var name = "frame"
  , _        = require("underscore")
  , broker    = require("sc-broker")
  , bunyan   = require("bunyan")
  , deflt    = require("../lib/default")
  , log      = bunyan.createLogger({name: name})
  , ctrlstr  = deflt.ctrlStr;

var mem = broker.createClient({port: deflt.mem.port});

var exch = function(req, cb){
  var ro = {ok: true}
    , mpid = req.params.mpid
    , l1 = req.params.l1
    , l2 = req.params.l2
    , value = req.body;

  if(l2 == "Value" || l2 == "SdValue"){
    value = parseFloat(value)
  }
  if(l2 == "N" ){
    value = parseInt(value, 10)
  }

  mem.set([mpid, "exchange", l1, l2 ],value, function(err){
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


var ctrl = function(req, cb){
  var ro = {ok: true}
    , mpid = req.params.mpid
    , no = req.params.no
    , value = req.body;

  mem.set([mpid, no, "ctrl"], value, function(err){
    if(!err){
      log.info(ro
              , "value "+value+" written")
      cb(ro);
    }
  })
}
exports.ctrl = ctrl;

var message = function(req, cb){
  var ro    = {ok: true}
    , mpid  = req.params.mpid
    , no    = req.params.container
    , value = req.body;

  mem.set([mpid, no, "message"], value, function(err){
    if(!err){
      log.info(ro
              , "value >"
              + value + "< written to path:"
              + [mpid, no, "message"].join("."))
      cb(ro);
    }
  });
}
exports.message = message;
