const { fetchHTML, postRequest } = require('../../lib/fetcher');
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
    
    const streamUrl = `${BASE_URL}/watch/${id}`;
    const { html, $ } = await fetchHTML(streamUrl);
    
    const streams = [];
    
    const iframeSrc = $('iframe').attr('src') || $('iframe').attr('data-src');
    if (iframeSrc) {
      streams.push({
        server: 'embed',
        type: 'iframe',
        url: iframeSrc.startsWith('http') ? iframeSrc : iframeSrc.startsWith('//') ? 'https:' + iframeSrc : iframeSrc.startsWith('/') ? BASE_URL + iframeSrc : BASE_URL + '/' + iframeSrc
      });
    }
    
    const dataUrl = $('[data-url]').attr('data-url');
    if (dataUrl) {
      streams.push({
        server: 'main',
        type: 'hls',
        url: dataUrl.startsWith('http') ? dataUrl : atob(dataUrl)
      });
    }
    
    const scriptMatch = html.match(/var\s+sources\s*=\s*(\[.+?\]);/) ||
                        html.match(/"file"\s*:\s*"([^"]+)"/) ||
                        html.match(/"url"\s*:\s*"([^"]+)"/);
    
    if (scriptMatch) {
      try {
        const sourcesData = JSON.parse(scriptMatch[1] || `["${scriptMatch[1]}"]`);
        if (Array.isArray(sourcesData)) {
          sourcesData.forEach(source => {
            if (typeof source === 'string') {
              streams.push({
                server: 'auto',
                type: 'hls',
                url: source.startsWith('http') ? source : atob(source)
              });
            } else if (source.file || source.url) {
              streams.push({
                server: source.label || 'auto',
                type: source.type || 'hls',
                url: source.file || source.url
              });
            }
          });
        }
      } catch (e) {
        console.log('Script parsing error:', e.message);
      }
    }
    
    const videoElement = $('video source, video').first();
    const videoSrc = videoElement.attr('src');
    if (videoSrc) {
      streams.push({
        server: 'direct',
        type: 'mp4',
        url: videoSrc.startsWith('http') ? videoSrc : BASE_URL + videoSrc
      });
    }
    
    res.status(200).json({
      episodeId: id,
      streams: streams,
      subtitles: []
    });
    
  } catch (error) {
    console.error('Stream error:', error);
    res.status(500).json({
      error: 'Failed to get stream links',
      message: error.message
    });
  }
};
