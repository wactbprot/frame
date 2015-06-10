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
    , html = "";
  for(var exchkey in jsn){
    var path = [mpid, "exchange", exchkey].join("/")
    html = html + "<section class='elemets' data-path='/" + path + "' >";

    for(var elemkey in jsn[exchkey]){
      if(hc[elemkey]){
        var tmpval = {mpid: mpid,
                      exchkey: exchkey
                     };
        tmpval[elemkey] = jsn[exchkey][elemkey];
        html            = html + hc[elemkey](tmpval);
      }else{
        html = html + elemkey;
      }
    }
    html = html + "</section>";
  }
  cb(html);
}
exports.elements = elements;

/**
 * state collection
 */
var task_state = function(req, jsn, cb){
  var mpid = req.params.id
    , no   = req.params.container
    , path = [mpid, no, "state"].join("/")
    , html = "<section class='state' data-path='" + path + "' >";

  jsn["mpid"] = mpid;
  jsn["no"]   = no;

  html = html + hc["state"](jsn);
  html = html + "</section>";

  cb(html);
}
exports.task_state = task_state;
