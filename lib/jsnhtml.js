var hc = require("./template");

/**
 * frame
 */
var frame = function(req, jsn, cb){
  var mpid   = req.params.id
    , no     = req.params.container
    , struct = req.params.struct;

  jsn["mpid"]   = mpid;
  jsn["no"]     = no;
  jsn["struct"] = struct;

  cb(hc["index"](jsn));
}
exports.frame = frame;

/**
 * elements collection
 */
var elements = function(req, jsn, cb){
  var mpid = req.params.id
    , html = ""
    , exob = {mpid: mpid}
  for(var exchkey in jsn){
    exob["exchkey"] = exchkey;
    html =  genhtml(jsn[exchkey], html, exob);
  }
  cb(html);
}
exports.elements = elements;

/**
 * element collection
 */
var element = function(req, jsn, cb){
  var mpid = req.params.id
    , ek   = req.params.exchkey
    , html = ""
    , exob = {mpid: mpid, exchkey: ek }
  for(var elemkey in jsn){
    html =  genhtml(elemkey, jsn, exob);
  }
  cb(html);
}
exports.element = element;


/**
 * sub element collection
 */
var elem = function(req, jsn, cb){
  var mpid = req.params.id
    , ek   = req.params.exchkey
    , sek  = req.params.subkey
    , html = ""
    , exob = {mpid: mpid, exchkey: ek }

  html =  genhtml(sek, jsn,  exob);

  cb(html);
}
exports.elem = elem;


var genhtml = function(elemkey,jsn, exob){
  var html = "";
  if(hc[elemkey]){
    exob[elemkey]= jsn[elemkey];
    html            = hc[elemkey](exob);
  }else{
    html = html + elemkey;
  }
  return html;
}



/**
 * state collection
 */
var task_state = function(req, jsn, cb){
  var mpid = req.params.id
    , no   = req.params.container
    , path = [mpid, no, "state"].join("/")
  jsn["mpid"] = mpid;
  jsn["no"]   = no;
  cb(hc["state"](jsn));
}
exports.task_state = task_state;
