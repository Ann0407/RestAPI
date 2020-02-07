const http = require('http')
const app = require('./app');
const PORT = 3000;
const server = http.createServer(app);

server.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));