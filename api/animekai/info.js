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
    
    const infoUrl = `${BASE_URL}/watch/${id}`;
    const { $ } = await fetchHTML(infoUrl);
    
    const title = $('.anime-title, .title, h1').first().text().trim();
    const image = $('.anime-poster img, .cover img, .poster img').first().attr('src') || 
                  $('.anime-poster img, .cover img, .poster img').first().attr('data-src') || '';
    const description = $('.description, .synopsis, .plot, [class*="desc"]').first().text().trim();
    const type = $('.type, .badge:contains("TV"), .badge:contains("Movie"), .badge:contains("OVA")').first().text().trim();
    
    const genres = [];
    $('.genre a, .genres a, [class*="genre"] a').each((i, el) => {
      genres.push($(el).text().trim());
    });
    
    const status = $('.status, .airing-status').first().text().trim();
    const rating = $('.rating, .score').first().text().trim();
    const releaseYear = $('.year, .release, [class*="year"]').first().text().trim();
    
    res.status(200).json({
      id: id,
      title: title,
      image: image.startsWith('http') ? image : image.startsWith('/') ? BASE_URL + image : BASE_URL + '/' + image,
      description: description,
      type: type || 'Unknown',
      genres: genres,
      status: status || 'Unknown',
      rating: rating || 'N/A',
      releaseYear: releaseYear || 'Unknown'
    });
    
  } catch (error) {
    console.error('Info error:', error);
    res.status(500).json({
      error: 'Failed to get anime info',
      message: error.message
    });
  }
};
