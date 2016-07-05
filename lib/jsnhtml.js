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

  cb(null, hc["index"](jsn));
}
exports.frame = frame;

/**
 * elements collection
 * z.B. elements
 */
var elements = function(req, jsn, cb){
  var mpid = req.params.id
    , html = ""
    , exob = {mpid: mpid}
  for(var l1 in jsn){
    html = html + "<section>"
    for(var l2 in jsn[l1]){
      exob["exchkey"] = l1;
      html = html + genhtml(l2, jsn[l1], exob);
    }
    html = html + "</section>"
  }
  cb(null, html);
}
exports.elements = elements;

/**
 * element collection
 * z.B. KeithleyCh1
 */
var element = function(req, jsn, cb){
  var mpid = req.params.id
    , l1   = req.params.exchkey
    , html = ""
    , exob = {mpid: mpid, exchkey: l1 };

  for(var l2 in jsn){
    html = html + genhtml(l2, jsn[l1], exob);
  }
  cb(null, html);
}
exports.element = element;

/**
 * sub element collection
 * z.B. Value
 */
var elem = function(req, jsn, cb){
  var mpid = req.params.id
    , l1   = req.params.exchkey
    , l2   = req.params.subkey
    , html = ""
    , exob = {mpid: mpid, exchkey: l1 };

  html =  genhtml(l2, jsn,  exob);

  cb(null, html);
}
exports.elem = elem;

/**
 * generates html if elemkey is known (e.g. SdValue.html or Caption)
 * see templates below /templates folder
 */
var genhtml = function(elemkey, jsn, exob){
  var html = "";
  if(hc[elemkey]){
    exob[elemkey] = jsn[elemkey];
    html          = hc[elemkey](exob);
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
    , no   = req.params.container;

  jsn["mpid"] = mpid;
  jsn["no"]   = no;
  cb(null, hc["state"](jsn));
}
exports.task_state = task_state;


/**
 * cd id collection
 */
var cdid = function(req, jsn, cb){
  var mpid = req.params.id
    , no   = req.params.container;

  jsn["mpid"] = mpid;
  jsn["no"]   = no;

  cb(null, hc["cd"](jsn));
}
exports.cdid = cdid;
