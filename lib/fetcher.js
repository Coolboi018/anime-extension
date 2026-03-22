const axios = require('axios');
const cheerio = require('cheerio');

const BASE_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.9',
  'Accept-Encoding': 'gzip, deflate, br',
  'DNT': '1',
  'Connection': 'keep-alive',
  'Upgrade-Insecure-Requests': '1',
  'Sec-Fetch-Dest': 'document',
  'Sec-Fetch-Mode': 'navigate',
  'Sec-Fetch-Site': 'none',
  'Sec-Fetch-User': '?1',
  'Cache-Control': 'max-age=0'
};

async function fetchHTML(url, customHeaders = {}) {
  const headers = { ...BASE_HEADERS, ...customHeaders };
  
  try {
    const response = await axios.get(url, {
      headers,
      timeout: 30000,
      decompress: true
    });
    
    return {
      html: response.data,
      status: response.status,
      $: cheerio.load(response.data)
    };
  } catch (error) {
    console.error(`Fetch error for ${url}:`, error.message);
    throw error;
  }
}

async function fetchJSON(url, customHeaders = {}) {
  const headers = { 
    ...BASE_HEADERS, 
    'Accept': 'application/json, text/plain, */*',
    ...customHeaders 
  };
  
  try {
    const response = await axios.get(url, {
      headers,
      timeout: 30000,
      decompress: true
    });
    
    return response.data;
  } catch (error) {
    console.error(`Fetch error for ${url}:`, error.message);
    throw error;
  }
}

async function postRequest(url, data, customHeaders = {}) {
  const headers = { 
    ...BASE_HEADERS, 
    'Content-Type': 'application/x-www-form-urlencoded',
    'X-Requested-With': 'XMLHttpRequest',
    ...customHeaders 
  };
  
  try {
    const response = await axios.post(url, data, {
      headers,
      timeout: 30000,
      decompress: true
    });
    
    return response.data;
  } catch (error) {
    console.error(`POST error for ${url}:`, error.message);
    throw error;
  }
}

module.exports = {
  fetchHTML,
  fetchJSON,
  postRequest,
  BASE_HEADERS
};
