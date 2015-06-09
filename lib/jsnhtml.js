var hc = require("./template");

var elements = function(req, jsn, cb){
  var mpid = req.params.id
    , html = "";
  for(var exchkey in jsn){

    var path = [mpid, "exchange", exchkey].join("/")

    html = html + "<div data-path='/" + path + "' >"
    for(var elemkey in jsn[exchkey]){

      if(hc[elemkey]){

        var tmpval = {mpid: mpid,
                      exchkey: exchkey
                     };
        tmpval[elemkey] = jsn[exchkey][elemkey];
        html            = html + hc[elemkey](tmpval);
      }else{
        html = html + elemkey
      }
    }
    html = html + "</div>";
  }

  cb(html)
}
exports.elements = elements;