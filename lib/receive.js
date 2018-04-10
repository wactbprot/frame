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
    , value = false;

  if(req.body){
    log.info(ok
            , "receive exch request with body: " + JSON.stringify(req.body));

    if(req.body.value) {
      var value = req.body.value;
      if(l2 == "Value" || l2 == "SdValue"){
        value = parseFloat(value)
      }
      if(l2 == "N" ){
        value = parseInt(value, 10)
      }
    }// body.value
    if(req.body.cmd){
      value = req.body.cmd;
    }
    if(value){
    mem.set([mpid, "exchange", l1, l2], value, function(err){
      if(!err){
        log.info(ok
              , "value "+value+" written")
          cb(null, ok);
        }
    });
  } else {
    var errmsg =  "can not extract value from body";
    err = new Error(errmsg);
    log.error(err
              , errmsg);
    cb(err);
  }
} // body
}
exports.exch = exch;

var cdhandle = function(req, cb){
  var val = { id: req.params.mpid, cdid: req.params.cdid}
    , cmd = req.body;
  log.info(ok
    , "try to handle calibration document, request body is: " + JSON.stringify(cmd))
  if(req.body && req.body.cmd){
    if(req.body.cmd == "load"){
      mem.publish("get_cd", val, function(err){
        if(!err){
          cb(null, ok);
        }
      });
    }
    if(req.body.cmd == "remove"){
      mem.publish("rm_cd", val, function(err){
        if(!err){
          cb(null, ok);
        }
      });
    }
  } else {
      errmsg = "wrong or missing  request body";
      err = new Error(errmsg);
      log.error(err
                , errmsg);
      cb(err);
    }
}
exports.cdhandle = cdhandle;

var ctrl = function(req, cb){
  var mpid  = req.params.mpid
    , no    = req.params.no
    , value = req.body.cmd;

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
    , value = req.body.cmd;

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
    , value = req.body.cmd;

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
