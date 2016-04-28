var name     = "frame.collection"
  ,  _       = require("underscore")
  , broker   = require("sc-broker")
  , bunyan   = require("bunyan")
  , deflt    = require("../lib/default")
  , log      = bunyan.createLogger({name: name})
  , ctrlstr  = deflt.ctrlStr
  , ok       = {ok: true}
  , err;

var mem = broker.createClient({port: deflt.mem.port});

/**
 * timer wird immer gepollt und
 * ist indicator für intakte Verbindung
 * @param {Object} req request-Objekt
 * @param {Function} cb callback funktion
 */
var timer = function(req, cb){
  var ro = {}
    , id   = req.params.id
    , no   = req.params.no
  if(mem.isConnected()){
    mem.get([id, "exchange","run_time"], function(err, res){
      if(!err){
        if(res && res.Value){
          res["connection"] = "online";
          cb(null, res);
        }
      }else{

        log.error(err
                 , "mp is not available");
        cb(err);
      }
    });
  }else{
    err = new Error("disconnect");
    cb(err,{ Value:NaN
           , Unit:""
           , connection:"offline"});
  }
};
exports.timer = timer;

/**
 * Die Funktion```get_mp()``` ruft lediglich
 * die meta struktur des mp ab
 *
 * @param {Object} req request-Objekt
 * @param {Function} cb callback funktion
 */
var cdid = function(req, cb){
  var ro  = {}
    , id  = req.params.id
    , cds = {cdid:[]};

  if(mem.isConnected()){
    mem.get([id, "id"], function(err, res){
      if(!err){
        if(res && _.isEmpty(res)){
          cb(null, cds);
        }else{
          var ks = _.keys(res)
            , Nks = ks.length;
          for(var k = 0; k < Nks; k++){
            cds.cdid.push(res[ks[k]]);
            if(k == Nks -1){
              cb(null, cds);
            }
          }
        }
      }else{
        log.error(err
                 , "mp is not available");
        cb(err);
      }
    });
  }else{
    err = new Error("disconnect");
    cb(err);
  }
};
exports.cdid = cdid;

/**
 * Die Funktion```get_mp()``` ruft lediglich
 * die meta struktur des mp ab
 *
 * @param {Object} req request-Objekt
 * @param {Function} cb callback funktion
 */
var meta = function(req, cb){
  var ro = {}
    , id   = req.params.id

  if(mem.isConnected()){
    mem.get([id, "meta"], function(err, meta){
      if(!err){
        if(meta){
          cb(null, meta);
        }
      }else{
        err = new Error("mp not available");
        log.error(err
                 , "mp is not available");
        cb(err);
      }
    });
  }else{
    err = new Error("disconnect");
    cb(err);
  }

};
exports.meta = meta;

/**
 * container messages
 *
 * @param {Object} req request-Objekt
 * @param {Function} cb callback funktion
 */
var message = function(req, cb){
  var ro = {}
    , id   = req.params.id
    , no   = req.params.container

  if(mem.isConnected()){
    mem.get([id, no, "message"], function(err, msg){
      if(!err){
        cb(null, msg);
      }else{
        err = new Error("mp not available");
        log.error(err
                 , "mp is not available");
        cb(err);
      }
    });
  }else{
    err = new Error("disconnect");
    cb(err);
  }
};
exports.message = message;

/**
 * Die Funktion```get_mp()``` ruft lediglich
 * die meta struktur des mp ab
 *
 * @param {Object} req request-Objekt
 * @param {Function} cb callback funktion
 */
var exch = function(req, cb){
  var ro = {}
    , id = req.params.id
    , ek = req.params.exchkey
  if(mem.isConnected()){
    mem.get([id, "exchange", ek], function(err, obj){
      if(!err){
        if(obj){
          cb(null, obj);
        }
      }else{
        err = new Error("get key fails");
        log.error(err
                 , "error on attempt to get key from exchange");
        cb(err);
      }
    });
  }else{
    err = new Error("disconnect");
    cb(err);
  }

};
exports.exch = exch;


/**
 * Die Funktion```get_mps()``` stellt
 * Informationen über die initialisierten
 * Messprogramme zusammen.
 *
 * @param {Object} req request-Objekt
 * @param {Function} cb callback funktion
 */
var mps = function(req, cb){
  var ro = {};

  if(mem.isConnected()){

    mem.getAll(function(err, all){
      if(!err){
        var idA = _.keys(all);
        if(idA.length > 0){
          for(var i = 0; i < idA.length; i++ ){
            var id = idA[i];
            var meta = all[id].meta;
            ro[id]             = {};
            ro[id].Name        = meta.name;
            ro[id].Standard    = meta.standard;
            ro[id].Description = meta.description;

            mem.get([id, "exchange", "run_time"], function(last, ro, id){
                                                    return function(err, val){
                                                      ro[id].Uptime = val;
                                                      if(last){
                                                        cb(null, ro)
                                                      }
                                                    }}(i == idA.length - 1, ro, id));
          }
        }else{
          err = new Error("no mp available")
          log.warn(err
                  , "nothing loaded, no mp available");
          cb(err);
        }
      }else{
        log.error(err
                 , "error on attempt to mem.getAll");
        cb(err)
      }
    });
  }else{
    err = new Error("disconnect");
    cb(err);
  }
};
exports.mps = mps;

/**
 * Die Funktion```get_task_state()``` erstellt
 * ein dem Endpunkt ```state/n``` analoges Dokument
 * welches den aktuellen Zustand des containers ```n```
 * abbildet und  Informantionen der zugeordneten
 * Tasks enthält.
 *
 * @param {Object} req request-Objekt
 * @param {Function} cb callback funktion
 */
var task_state = function(req, cb){
  var ro   = {taskstate:[]}
    , id   = req.params.id
    , no   = req.params.container
    , df, taskname, action, comment, value, key, st, rr;

  if(mem.isConnected()){
    if(_.isUndefined(no)){
      err = new Error("no  container");
      log.error(err
               , "no  container requested");
      cb(err);
    }else{
      mem.get([id, "exchange", "run_time","Value"], function(err, rtime){
        if(!err){
          if(!rtime){
            log.info(ok
                    , "hit loading run timer");
            ro.taskstate.push([{ TaskName:"loading"
                               , State:"unloaded"}]);
            cb(null, ro);
          }else{
            mem.get([id, no, "state"], function(err, state){
              if(!err){
                if(!state){
                  log.info(ok
                          , "hit loading state");
                  ro.taskstate.push([{ TaskName:"loading"
                                     , State:"unloaded"}]);
                  cb(null, ro);
                }else{
                  mem.get([id, no, "recipe"], function(err, recipe){
                    if(!err){
                      var sk = _.keys(state)
                      var Ns = sk.length
                      for(var s = 0; s < Ns; s++){
                        ro.taskstate.push({step:[]});

                        var skp = _.keys(state[sk[s]])
                          , skN = skp.length
                        for(var p = 0; p < skN; p++){

                          if(recipe && recipe[sk[s]] && recipe[sk[s]][skp[p]] &&
                             state  && state[sk[s]]  && state[sk[s]][skp[p]]){

                            rr   = recipe[sk[s]][skp[p]];
                            st   = state[sk[s]][skp[p]];

                            ro.taskstate[s].step
                            .push(_.extend(rr,{State:st})); // push
                          }else{
                            ro.taskstate[s].step
                            .push(
                              { TaskName:"unloaded"
                              , State:"unloaded"}); // push
                          }
                        } // for p
                      } // for s
                      if(s == Ns){
                        cb(null, ro);
                      }
                    }else{
                      err = new Error("no recipe");
                      log.error(err
                 , "can not get recipe of container: " + no);

                      cb(err);
                    }
                  }); // recipe
                }
              }else{
                new Error("err on state request")
                log.error(err
         , "can not get state of container: " + no);

                cb(err);
              }
            }); // get state
          }
          }else{
            err =  new Error("mp not initialized");
            log.error(err
       , "no mp with |id|: |" + id + "| initialized");
            cb(err);
          }
        }); // rtime
             } // if no
    }else{
      err = new Error("disconnect");
      log.error(err
            , "taskstate detects diconnect");
      cb(err);
    }
  };
  exports.task_state = task_state;


  /**
      * Die Funktion```get_container_elements()``` bedient
      * den Endpunkt ```containerelements/n```. Es wird
      * ```element/n``` und ```exchange/``` vereinigt.
      *
      * @param {Object} req request-Objekt
                                   * @param {Function} cb callback funktion
                                                                           */
  var elements = function(req, cb){
                                                                         var ro   = {}
                                                                         if(req.params){
                                                                           var mpid = req.params.id
   , no   = req.params.container

                                                                           if(mpid && no){
                                                                             var fpat    = /\*/g
    , bpat    = "[A-Za-z0-9\-_ ]*"
                                                                             if(mem.isConnected()){
                                                                               mem.get([mpid, no, "element"], function(err, elem){
                                                                           if(!err){
                                                                             mem.get([mpid, "exchange"], function(err, exch){
                                                                                                       if(!err){
                                                                                                         var exch_keys   = _.keys(exch)
         , no_of_elem   = elem.length;

                                                                                                         if(no_of_elem > 0){
                                                                                                           for(var i = 0; i < no_of_elem; i++){
                                                                                                             // keys können wildcard * enthalten
                                                                                                             var pat = new RegExp("^" + elem[i].replace(fpat, bpat) + "$");
                                                                                                             // exchange wird nach passenden
                                                                                                             // keys durchsucht (gefiltert)

                                                                                                             var elem_key = _.filter(exch_keys, function(k){
                                     return  k.search(pat) > -1;
                                   });

                    var no_of_keys   = elem_key.length;
                    if(no_of_keys > 0){
                      for(var k = 0; k < no_of_keys; k++){
                        var ret_key = elem_key[k];
                        ro[ret_key] = exch[ret_key];
                      }
                    }
                  } // for
                  cb(null, ro);
                }else{
                  cb(new Error("exchange seems to have length 0"));
                }
              }else{
                cb(new Error("can not read from exchange"));
              }
            }); //exchange
          }else{
            cb(new Error("can not read from element"));
          }
        }); // element
      }else{
        cb(new Error("wrong path"));
      }
    }else{
      cb(new Error("wrong request"));
    }
  }else{

    cb(new Error("disconnect"));
  }
}
exports.elements = elements;
