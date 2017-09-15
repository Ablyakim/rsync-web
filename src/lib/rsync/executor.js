const Rsync = require('rsync');

module.exports = class {
  constructor(callback, stdoutHandler, stderrHandler) {
    this._callback = callback;
    this._stdoutHandler = stdoutHandler;
    this._stderrHandler = stderrHandler;
  }

  execute(config) {
    try {
      const rsync = new Rsync()
          .shell(`ssh -p ${config.port || 22}`)
          .flags(config.flags)
          .source(config.source)
          .exclude(config.exclude)
          .destination(config.destination);

      config.options.forEach(option => {
        rsync.set(option.name, option.value);
      });

      rsync.execute(this._callback, this._stdoutHandler, this._stderrHandler);
    } catch (e) {
      throw e;
    }
  }
};