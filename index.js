var azure = require('azure-storage');
var utils = require('./lib/utils');
var md5File = require('md5-file');

var assetChecksums = {};

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

          md5File(file.path, function(error, md5sum) {
            if (error) {
              console.log("Error computing md5sum for '" + file.path + "'");
              console.error(error);
              return;
            }

            var lastChecksum = assetChecksums[file.path];
            if (!process.env.ALWAYS_UPLOAD && lastChecksum === md5sum) {
              console.log("skipping upload of '" + file.path + "' (current MD5 checksum matches last uploaded MD5 checksum)");
              return;
            }

            var opts = { contentSettings: options.metadata };
            blobService.createBlockBlobFromLocalFile(options.container.name, file.name, file.path, opts, function(error, result, response) {
              if(error) {
                console.error(error);
                return;
              }

              assetChecksums[file.path] = md5sum;

              if (!process.env.SILENCE_UPLOADS) {
                console.log("successfully uploaded '" + file.path + "' to container '" + options.container.name + "'");
              }
            });
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
