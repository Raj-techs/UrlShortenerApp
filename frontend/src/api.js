import axios from 'axios';
import { log, logError } from './utils/logger';

const API_BASE_URL = 'http://localhost:5000';

const api = axios.create({ baseURL: API_BASE_URL });

// Log all requests
api.interceptors.request.use(
  (config) => {
    log(`Request: ${config.method.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    logError(error);
    return Promise.reject(error);
  }
);

// Log all responses
api.interceptors.response.use(
  (response) => {
    log(`Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    logError(error);
    return Promise.reject(error);
  }
);

export const createShortUrl = (data) => api.post('/shorturls', data);
export const getShortUrlStats = (shortcode) => api.get(`/shorturls/${shortcode}`);
export const getAllShortUrls = () => api.get('/shorturls');