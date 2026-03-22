const { fetchHTML } = require('../../lib/fetcher');
const { handleCORS } = require('../../lib/cors');

const BASE_URL = 'https://animekai.to';

module.exports = async (req, res) => {
  if (handleCORS(req, res)) return;
  
  try {
    const { query, page = 1 } = req.query;
    
    if (!query) {
      return res.status(400).json({
        error: 'Query parameter is required'
      });
    }
    
    const searchUrl = `${BASE_URL}/search?q=${encodeURIComponent(query)}&page=${page}`;
    const { $ } = await fetchHTML(searchUrl);
    
    const results = [];
    
    $('.aitem, .anime-item, .film-item, [class*="item"]').each((i, el) => {
      const $el = $(el);
      const link = $el.find('a').first();
      const href = link.attr('href') || '';
      const title = link.attr('title') || $el.find('.title, .name, h3, h2').first().text().trim();
      const image = $el.find('img').first().attr('src') || $el.find('img').first().attr('data-src') || '';
      const type = $el.find('.type, .badge, .status').first().text().trim();
      
      if (title && href) {
        results.push({
          id: href.replace('/watch/', '').replace('/anime/', '').replace('/', ''),
          title: title,
          image: image.startsWith('http') ? image : image.startsWith('/') ? BASE_URL + image : BASE_URL + '/' + image,
          type: type || 'Unknown'
        });
      }
    });
    
    res.status(200).json({
      query: query,
      page: parseInt(page),
      results: results
    });
    
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({
      error: 'Failed to search',
      message: error.message
    });
  }
};
