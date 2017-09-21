module.exports = class {
  constructor(siteModelPromise) {
    this._siteModelPromise = siteModelPromise;
  }
  
  /**
   * @return {Promise}
   */
  getModel() {
    return this._siteModelPromise();
  }

  /**
   * @return {Promise}
   */
  async loadAll() {
    const SiteModel = await this._siteModelPromise();
    return SiteModel.findAll();
  }
  /**
   * Load by id
   * 
   * @param {int} id
   * 
   * @return {Promise}
   */
  async getById(id) {
    const SiteModel = await this._siteModelPromise();
    return SiteModel.findById(id);
  }
};