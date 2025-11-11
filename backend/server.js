const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();
app.use(cors());
app.use('/api', createProxyMiddleware({
  target: 'https://nexlearn.noviindusdemosites.in',
  changeOrigin: true,
  pathRewrite: { '^/api': '' }
}));
const PORT = process.env.PORT || 4000;
app.listen(PORT, ()=>console.log('Proxy running on http://localhost:'+PORT));
