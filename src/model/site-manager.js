module.exports = class {
  constructor(sitePromise) {
    this._sitePromise = sitePromise;
  }
  
  /**
   * @return {Promise}
   */
  async getModel() {
    return await this._sitePromise();
  }

  /**
   * @return {Promise}
   */
  async loadAll() {
    const SiteModel = await this._sitePromise();
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
    const SiteModel = await this._sitePromise();
    return SiteModel.findById(id);
  }
};