const fs = require('node:fs');
const rs = fs.createReadStream('01-read-file\\text.txt', 'utf8');
rs.on('data', chunk => console.log(chunk));