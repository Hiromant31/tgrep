const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

app.get('/', (req, res) => res.send('TG Proxy is active!'));

app.use('/', createProxyMiddleware({
    target: 'https://api.telegram.org',
    changeOrigin: true,
    onProxyRes: (proxyRes) => {
        proxyRes.headers['Access-Control-Allow-Origin'] = '*';
    }
}));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Proxy port: ${PORT}`));
