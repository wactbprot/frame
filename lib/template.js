var _      = require("underscore")
  , fs     = require("fs")
  , h      = require("handlebars")
  , conf   = require("../../../lib/conf")
  , fpath  = conf.frame.apppath + "templates/"

h.registerHelper('toExchPath', function(dotpath) {
  return new h.SafeString(dotpath.replace(/\./g, "/"));
});

h.registerHelper('toMpPath', function(task) {
  return new h.SafeString("/" + task.Mp + "/" + task.Container + "/state/frame");
});

h.registerHelper('niceValue', function(value) {
  var val;
  if(_.isObject(value)){
    val = JSON.stringify(value, false, "\n");
  }
  if(_.isArray(value)){
    val = value.join("\n");
  }
  if(_.isString(value)){
    val = value;
  }
  if(_.isNumber(value)){
    val = value;
  }
  return new h.SafeString(val);
});

var templates = function(){
  var ff = fs.readdirSync(fpath)
    , hc = {};

  for(var i = 0; i < ff.length; i++){
    var cf    = ff[i],
        cpath = fpath + cf,
        cstat = fs.lstatSync(cpath),
        pat   = /\.html$/;

    if(cstat.isFile() && cf.search(pat) > -1){
      var tmplname   = cf.replace(pat, ""), // z.B.: main
          tmplstring = fs.readFileSync(cpath, "utf-8")
      hc[tmplname] = h.compile(tmplstring);
    }
  }
  return hc;
}
module.exports = templates();
