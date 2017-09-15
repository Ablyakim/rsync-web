const SiteManager = require('./model/site-manager');
const SiteModelPromise = require('./model/site');
const connection = require('./db/connection');

module.exports = {
  /**
   * @return {SiteManager}
   */
  getSiteManager: function() {
    return new SiteManager(this.getSiteModelPromise());
  },
  
  /**
   * @return {SiteModelPromise}
   */
  getSiteModelPromise: function() {
    return SiteModelPromise.bind(null, this.getDbConnection());
  },

  getDbConnection: function() {
    return connection;
  }
};