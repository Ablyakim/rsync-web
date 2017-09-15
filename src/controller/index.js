module.exports = app => {
  app.get('/',  (req, res) => {
    res.render('index');
  });

  app.get('/site/edit/:id', (req, res) => {
    res.render('edit', {id: req.params.id});
  });

  app.get('/site/create', (req, res) => {
    res.render('edit');
  });

  app.post('/api/site/save', async(req, res) => {
    const id = req.body.id || null;
    delete req.body.id;
    try {
      const siteManager = app.get('service-container')
          .getSiteManager();
      const SiteModel = await siteManager.getModel();
  
      if (id) {
        const site = await SiteModel.findById(id);
        res.send(await site.update(req.body));
      } else {
        const site = await SiteModel.build(req.body);
        res.send(await site.save());
      }
    } catch (e) {
      console.error(e);
      res.sendStatus(404);
    }
  });

  app.route('/api/site/:id')
      .get(async(req, res) => {
        try {
          const siteManager = app.get('service-container')
              .getSiteManager();
          const site = await siteManager.getById(req.params.id);
          if (!site) {
            throw new Error(`Site with requested id: ${req.params.id} is not found.`);  
          }
          res.json(await siteManager.getById(req.params.id));
        } catch (e) {
          console.error(e);
          res.sendStatus(404);
        }
      })
      .delete(async(req, res) => {
        try {
          const siteManager = app.get('service-container')
              .getSiteManager();
          const site = await siteManager.getById(req.params.id);
          if (!site) {
            throw new Error(`Site with requested id: ${req.params.id} is not found.`);  
          }
          await site.destroy();
          res.send('Ok');
        } catch (e) {
          console.error(e);
          res.sendStatus(404);
        }
      });
  
  app.get('/api/sites.json',  async(req, res) => {
    try {
      const siteManager = app.get('service-container')
          .getSiteManager();
      
      res.json(await siteManager.loadAll());
    } catch (e) {
      console.error(e);
      res.sendStatus(404);
    }
  });
};