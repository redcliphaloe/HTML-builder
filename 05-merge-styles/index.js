const process = require('process');
const path = require('path');
const fs = require('fs');
const createBundle = async (src, dest) => {    
    try {        
        const ws = fs.createWriteStream(path.join(__dirname, dest, 'bundle.css'));
        const files = await fs.promises.readdir(path.join(__dirname, src), {withFileTypes: true});
        let rs;        
        for (const file of files) {
            const stats = await fs.promises.stat(path.join(__dirname, src, file.name));
            if (stats.isFile() && file.name.split('.')[1].toLowerCase() === 'css') {                
                rs = fs.createReadStream(path.join(__dirname, src, file.name), 'utf8');
                rs.on('data', (chunk) => {ws.write(chunk);});                
            }
        }
    }
    catch (err) {
        process.stdout.write(err.message);
    }
}
createBundle('styles', 'project-dist');