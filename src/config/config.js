require('dotenv').config();

module.exports = {
  // سرور
  server: {
    port: process.env.PORT || 3000,
    env: process.env.NODE_ENV || 'development',
    name: 'نطق مصطلح - سیستم هوشمند پردازش دانش'
  },
  
  // Gmail API
  gmail: {
    clientId: process.env.GMAIL_CLIENT_ID,
    clientSecret: process.env.GMAIL_CLIENT_SECRET,
    redirectUri: process.env.GMAIL_REDIRECT_URI || 'http://localhost:3000/auth/callback',
    scopes: [
      'https://www.googleapis.com/auth/gmail.readonly',
      'https://www.googleapis.com/auth/gmail.modify'
    ]
  },
  
  // NLP Service
  nlp: {
    endpoint: process.env.NLP_ENDPOINT || 'http://localhost:3004',
    timeout: 30000
  },
  
  // پایگاه داده
  database: {
    knowledgeFile: './data/knowledge-base.json',
    tokensFile: './data/tokens.json'
  },
  
  // امنیت
  security: {
    jwtSecret: process.env.JWT_SECRET || 'natiq-masthul-secret-key',
    encryptionKey: process.env.ENCRYPTION_KEY
  }
};
