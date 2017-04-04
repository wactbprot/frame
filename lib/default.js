var all = {};
/**
 * http-api defaults
 */
all = {
  port    : 8002,
  apppath : "extensions/frame/",
  appname :  "frame"
};

/**
 * broker (mem) defaults
 */
all.mem = {
  port: 9000,
  host: 'localhost'
};

module.exports = all;
