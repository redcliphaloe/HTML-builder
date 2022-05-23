const process = require('process');
const path = require('path');
const fs = require('fs');
const filesInFolder = async (folderName) => {
    try {        
        const files = await fs.promises.readdir(path.join(__dirname, folderName), {withFileTypes: true});
        for (const file of files) {
            const stats = await fs.promises.stat(path.join(__dirname, folderName, file.name));
            if (stats.isFile()) {
                const name = file.name.split('.')[0];
                const ext = file.name.split('.')[1];
                const size = stats.size;
                process.stdout.write(`${name} - ${ext} - ${size} bytes\n`);
            }
        }          
    }
    catch (err) {
        process.stdout.write(err.message);
    }      
};
filesInFolder('secret-folder');