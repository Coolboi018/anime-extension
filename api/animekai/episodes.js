const { fetchHTML } = require('../../lib/fetcher');
const { handleCORS } = require('../../lib/cors');

const BASE_URL = 'https://animekai.to';

module.exports = async (req, res) => {
  if (handleCORS(req, res)) return;
  
  try {
    const { id } = req.query;
    
    if (!id) {
      return res.status(400).json({
        error: 'ID parameter is required'
      });
    }
    
    const episodesUrl = `${BASE_URL}/watch/${id}`;
    const { $ } = await fetchHTML(episodesUrl);
    
    const episodes = [];
    
    $('.episode-item, .ep-item, [class*="episode"], [class*="ep-"]').each((i, el) => {
      const $el = $(el);
      const link = $el.find('a').first();
      const href = link.attr('href') || '';
      const episodeNum = $el.find('.ep-num, .episode-number, .num').first().text().trim() ||
                         href.match(/ep-(\d+)/)?.[1] ||
                         (i + 1).toString();
      const title = $el.find('.ep-title, .episode-title, .title').first().text().trim() ||
                    `Episode ${episodeNum}`;
      
      if (href || episodeNum) {
        episodes.push({
          id: href.replace('/watch/', '').replace('/', '') || `${id}-ep-${episodeNum}`,
          number: parseInt(episodeNum) || i + 1,
          title: title,
          url: href.startsWith('http') ? href : href.startsWith('/') ? BASE_URL + href : BASE_URL + '/' + href
        });
      }
    });
    
    episodes.sort((a, b) => a.number - b.number);
    
    res.status(200).json({
      animeId: id,
      count: episodes.length,
      episodes: episodes
    });
    
  } catch (error) {
    console.error('Episodes error:', error);
    res.status(500).json({
      error: 'Failed to get episodes',
      message: error.message
    });
  }
};
