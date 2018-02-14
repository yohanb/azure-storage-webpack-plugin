var azure = require('azure-storage');

var utils = require('./lib/utils');

function apply(options, compiler) {
  // When assets are being emmited (not yet on file system)
  compiler.plugin('after-emit', function (compilation, callback) {
    var blobService = azure.createBlobService.apply(azure, options.blobService);
    blobService.createContainerIfNotExists(options.container.name,  options.container.options, function(error, result, response) {
      if(error) {
        console.error(error);
        return;
      }

      function handleFiles(files) {
        files.forEach(function(file) {
          blobService.createBlockBlobFromLocalFile(options.container.name, file.name, file.path, { contentSettings: options.metadata }, function(error, result, response) {
            if(error) {
              console.error(error);
              return;
            }

            if (!process.env.SILENCE_UPLOADS) {
              console.log("successfully uploaded '" + file.path + "' to container '" + options.container.name + "'");
            }
          });
        });
      }

      if (options.directory) {
        utils.getDirectoryFilesRecursive(options.directory).then(handleFiles).then(callback);
      } else {
        handleFiles(utils.getAssetFiles(compilation));
        callback();
      }
    });
  });
}

function AzureStorageDeployWebpackPlugin(options) {
  // Simple pattern to be able to easily access plugin
  // options when the apply prototype is called
  return {
    apply: apply.bind(this, options)
  };
}

module.exports = AzureStorageDeployWebpackPlugin;
