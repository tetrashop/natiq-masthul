const httpProxy = require('http-proxy-middleware');

const knowledgeBaseUrl = process.env.KNOWLEDGE_BASE_URL || 'http://localhost:3018';
const nlpServerUrl = process.env.NLP_SERVER_URL || 'http://localhost:3004';

const proxyConfig = {
  '/api/knowledge': {
    target: knowledgeBaseUrl,
    changeOrigin: true,
    pathRewrite: {
      '^/api/knowledge': ''
    },
    onProxyReq: (proxyReq, req, res) => {
      console.log('Proxying Knowledge Base request:', req.url);
    }
  },
  '/api/nlp': {
    target: nlpServerUrl,
    changeOrigin: true,
    pathRewrite: {
      '^/api/nlp': ''
    },
    onProxyReq: (proxyReq, req, res) => {
      console.log('Proxying NLP request:', req.url);
    }
  }
};

module.exports = proxyConfig;
