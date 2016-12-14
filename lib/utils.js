var path = require('path');

function getAssets(compilation) {
    var assets = [];
    compilation.chunks.forEach(function(chunk) {
        chunk.files.forEach(function(filePath) {
            assets.push({
                filePath: filePath,
                fileContent: compilation.assets[filePath].source()});
      });
    });

    return assets;
};

module.exports = {
    getAssets
};