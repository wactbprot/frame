var name = "frame.receive"
  , _        = require("underscore")
  , broker   = require("sc-broker")
  , bunyan   = require("bunyan")
  , conf     = require("../../../lib/conf")
  , ds       = require("./ds")
  , log      = bunyan.createLogger({name: name})
  , ok       = {ok: true}
  , mem      = broker.createClient({port: conf.mem.port});

var exch = function(req, cb){
  var mpid  = req.params.mpid
    , l1    = req.params.l1
    , l2    = req.params.l2
    , value = req.body;

  if(l2 == "Value" || l2 == "SdValue"){
    value = parseFloat(value)
  }
  if(l2 == "N" ){
    value = parseInt(value, 10)
  }

  mem.set([mpid, "exchange", l1, l2], value, function(err){
    if(!err){
      log.info(ok
              , "value written")
      cb(null, ok);
    }
  })
}
exports.exch = exch;

var cdhandle = function(req, cb){
  var val = { id: req.params.mpid, cdid: req.params.cdid}
    , cmd = req.body;

  if(cmd == "load"){
    mem.publish("get_cd", val, function(err){
      if(!err){
        cb(null, ok);
      }
    });
  }
  if(cmd == "remove"){
    mem.publish("rm_cd", val, function(err){
      if(!err){
        cb(null, ok);
      }
    });
  }
}
exports.cdhandle = cdhandle;

var ctrl = function(req, cb){
  var mpid  = req.params.mpid
    , no    = req.params.no
    , value = req.body;

  mem.set([mpid, no, "ctrl"], value, function(err){
    if(!err){
      log.info(ok
              , "value "+value+" written")
      cb(null, ok);
    }
  })
}
exports.ctrl = ctrl;

var state = function(req, cb){
  var mpid  = req.params.mpid
    , no    = req.params.no
    , seq   = req.params.seq
    , par   = req.params.par
    , value = req.body;

  mem.set([mpid, no, "state", seq, par], value, function(err){
    if(!err){
      log.info(ok
              , "state "+ value +" written")
      cb(null, ok);
    }
  })
}
exports.state = state;

var message = function(req, cb){
  var mpid  = req.params.mpid
    , no    = req.params.container
    , value = req.body;

  mem.set([mpid, no, "message"], value, function(err){
    if(!err){
      log.info(ok
              , "value >" + value + "< written to path:"
              + [mpid, no, "message"].join("."))
      cb(null, ok);
    }else{
      cb(err);
      log.error(err, "in function message()")

    }
  });
}
exports.message = message;
