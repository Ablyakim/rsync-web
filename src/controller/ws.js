const WebSocketServer = require('ws');
const RsyncExector = require('../lib/rsync/executor');

module.exports = app => {
  const webSocketServer = new WebSocketServer.Server({
    port: 8081
  });
  
  webSocketServer.on('connection', function(ws) {
    const handleFinish = () => {
      ws.close();
    };

    const stoudHandler = data => {
      ws.send(data.toString('utf-8'));
    };
    
    const sterrHandler = data => {
      ws.send(data.toString('utf-8'));
      ws.close();
    };

    const rsyncExector = new RsyncExector(handleFinish, stoudHandler, sterrHandler);

    ws.on('message', data => {
      try {
        rsyncExector.execute(JSON.parse(data));
      } catch (e) {
        ws.send(e.message);
        ws.close();
      }
    });
  });
};