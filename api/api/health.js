const { handleCORS } = require('../lib/cors');

module.exports = (req, res) => {
  if (handleCORS(req, res)) return;
  
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'anime-extension-api'
  });
};
