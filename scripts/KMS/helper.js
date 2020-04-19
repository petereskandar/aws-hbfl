const glob = require('glob')
const fs = require('fs')


function getTextFile(filePath) {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, (err, data) => {
            if(err) reject(err);
            else {
                resolve(data); 
            }
        });
    })
}


function saveBlobToFile(blob, filename) {
    var buffer = Buffer.from(blob, 'base64'); // decode
    return new Promise((resolve, reject) => {
        fs.writeFile(filename, buffer, (err) => {
            if(err) reject(err);
            else resolve('file saved correctly');
        })
    })
}

module.exports = {
    getTextFile,
    saveBlobToFile
}