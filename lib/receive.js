var name = "frame.receive"
  , _        = require("underscore")
  , broker   = require("sc-broker")
  , bunyan   = require("bunyan")
  , deflt    = require("../lib/default")
  , ds       = require("./ds")
  , log      = bunyan.createLogger({name: name})
  , ctrlstr  = deflt.ctrlStr
  , ok       = {ok: true}
  , mem

var id = setInterval(function(){
           log.info(ok
              , "try to comnnect to data server");
           ds.available(deflt.mem.port, deflt.mem.host, function(available){
             if(available){
               mem = broker.createClient({port: deflt.mem.port})
               log.info(ok
                       , "connect to data server");
               clearInterval(id);
             }else{
               log.warn({warn:"data server not available"}
                       , "connect to data server");
             }
           })
         }, 1000);

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

  mem.set([mpid, "exchange", l1, l2 ],value, function(err){
    if(!err){
      log.info(ok
              , "value written")
      cb(ok);
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
        cb(ok);
      }
    });
  }
  if(cmd == "remove"){
    mem.publish("rm_cd", val, function(err){
      if(!err){
        cb(ok);
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
      cb(ok);
    }
  })
}
exports.ctrl = ctrl;

var message = function(req, cb){
  var mpid  = req.params.mpid
    , no    = req.params.container
    , value = req.body;

  mem.set([mpid, no, "message"], value, function(err){
    if(!err){
      log.info(ok
              , "value >"
              + value + "< written to path:"
              + [mpid, no, "message"].join("."))
      cb(ok);
    }else{
      // err first
    }
  });
}
exports.message = message;
