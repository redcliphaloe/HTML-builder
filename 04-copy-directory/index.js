const process = require('process');
const path = require('path');
const fs = require('fs');
const copyDir = async (src, dest) => {    
    try {        
        await fs.promises.mkdir(path.join(__dirname, dest), {recursive: true});
        await clearDir(path.join(__dirname, dest));
        const files = await fs.promises.readdir(path.join(__dirname, src), {withFileTypes: true});
        for (const file of files) {
            if (file.isDirectory()) {
                await copyDir(path.join(src, file.name), path.join(dest, file.name))
            } else {
                await fs.promises.copyFile(path.join(__dirname, src, file.name),
                    path.join(__dirname, dest, file.name));
            }
        }
    }
    catch (err) {
        process.stdout.write(err.message);
    }
}
const clearDir = async (target) => {    
    try {
        const files = await fs.promises.readdir(target, {withFileTypes: true});
        for (const file of files) {
            if (file.isDirectory()) {
                await clearDir(path.join(target, file.name));
                await fs.promises.rmdir(path.join(target, file.name));
            } else {
                await fs.promises.rm(path.join(target, file.name));
            }            
        }
    }
    catch (err) {
        process.stdout.write(err.message);
    }
}
copyDir('files', 'files-copy');