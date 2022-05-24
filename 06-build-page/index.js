const process = require('process');
const path = require('path');
const fs = require('fs');
const buildHTML = async (template, src, dest) => {
    try {        
        let html = await fs.promises.readFile(path.join(__dirname, template), 'utf8');
        const components = await fs.promises.readdir(path.join(__dirname, src), {withFileTypes: true});
        for (const component of components) {
            const stats = await fs.promises.stat(path.join(__dirname, src, component.name));
            const name = component.name.split('.')[0];
            const ext = component.name.split('.')[1];
            if (stats.isFile() && ext.toLowerCase() === 'html') {
                const text = await fs.promises.readFile(path.join(__dirname, src, component.name), 'utf8');
                html = html.replace(`{{${name}}}`, text);
            }
        }  
        const ws = fs.createWriteStream(path.join(__dirname, dest, 'index.html'));
        ws.write(html);
    }
    catch (err) {
        process.stdout.write(err.message);
    }
};
const createBundle = async (src, dest) => {
    try {        
        const ws = fs.createWriteStream(path.join(__dirname, dest, 'style.css'));
        const files = await fs.promises.readdir(path.join(__dirname, src), {withFileTypes: true});
        let rs;
        for (const file of files) {
            const stats = await fs.promises.stat(path.join(__dirname, src, file.name));
            if (stats.isFile() && file.name.split('.')[1].toLowerCase() === 'css') {
                rs = fs.createReadStream(path.join(__dirname, src, file.name), 'utf8');
                rs.on('data', (chunk) => {ws.write(chunk + '\n');});
            }
        }
    }
    catch (err) {
        process.stdout.write(err.message);
    }
};
const buildCSS = async (src, dest) => {
    createBundle(src, dest);
};
const copyDir = async (src, dest) => {
    try {        
        await fs.promises.mkdir(path.join(__dirname, dest), {recursive: true});
        const files = await fs.promises.readdir(path.join(__dirname, src), {withFileTypes: true});
        for (const file of files) {
            if (file.isDirectory()) {
                copyDir(path.join(src, file.name), path.join(dest, file.name))
            } else {
                await fs.promises.copyFile(path.join(__dirname, src, file.name),
                    path.join(__dirname, dest, file.name));
            }
        }
    }
    catch (err) {
        process.stdout.write(err.message);
    }
};
const copyAssets = async (src, dest) => {
    copyDir(src, dest);
};
const buildPage = async (dest) => {
    try {        
        await fs.promises.rm(path.join(__dirname, dest), {force: true, maxRetries: 10, recursive: true});
        await fs.promises.mkdir(path.join(__dirname, dest), {recursive: true});
        buildHTML('template.html', 'components', dest);
        buildCSS('styles', dest);
        copyAssets('assets', path.join(dest, 'assets'));        
    }
    catch (err) {
        process.stdout.write(err.message);
    }
};
buildPage('project-dist');