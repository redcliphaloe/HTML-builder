const process = require('process');
const path = require('path');
const fs = require('fs');
const ws = fs.createWriteStream(path.join(__dirname, 'text.txt'));
const exit = () => {
    process.stdout.write('\nBye!');
    process.exit();
};
process.stdout.write('Write text or type exit:\n');
process.stdin.on('data', data => {
    if (data.toString().trim().toLowerCase() === 'exit') {
        exit();
    } else {
        ws.write(data);
    }
});
process.on('SIGINT', exit);