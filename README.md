Azure Storage Webpack Plugin
===================

This is a [webpack](http://webpack.github.io/) plugin that allows you upload generated assets to an Azure storage account. 
This uses the [azure-storage](https://www.npmjs.com/package/azure-storage) plugin to authenticate and upload to Azure.

Maintainer: Yohan Belval [@yohanb](https://github.com/yohanb)

Installation
------------
Install the plugin with npm:
```shell
$ npm install azure-storage-webpack-plugin --save-dev
```
 
Basic Usage
-----------

```javascript
var AzureStorageWebpackPlugin = require('azure-storage-webpack-plugin');

var webpackConfig = {
  entry: 'index.js',
  output: {
    path: 'dist',
    filename: 'bundle.js'
  },
  plugins: [new AzureStorageWebpackPlugin({
    blobService: ['storageaccountname','key'],
    container: { name: 'containername', options: { publicAccessLevel : 'blob' }},
    
    // Optionally set cache control and content type header
    metadata: {
      cacheControl: 'public, max-age=31536000, s-maxage=31536000',
      contentType: 'application/javascript'
    }
})]
};
```

This will upload the `dist/widget.js` file to the specified container

```javascript
const AzureStorageWebpackPlugin = require('azure-storage-webpack-plugin');
const path = require('path');

const getContentType = (fileName = '') => {
    const fileExt =  path.extname(fileName);
    switch(fileExt) {
        case '.js': {
            return 'application/javascript';
        }
        case '.css': {
            return 'text/css';
        }
        default: {
            return ''
        }
    }
};


const webpackConfig = {
  entry: {
    widget: 'js/path',
    widgetCss: 'css/path'
  },
  output: {
    path: 'dist',
    filename: 'js/[name].js'
  },
  plugins: [
    new AzureStorageWebpackPlugin({
        blobService: ['storageaccountname','key'],
        container: { name: 'containername', options: { publicAccessLevel : 'blob' }},
        
        // Optionally set cache control and content type header
        metadata: {
          cacheControl: 'public, max-age=31536000, s-maxage=31536000',
          contentType: getContentType
        }
    }),
    // CSS Extraction Plugin from js
  ]
};
```

This will upload the `dist/widget.js` file to the specified container with the contentType `application/javascript`.
This will upload the `dist/widgetCss.css` file to the specified container with the contentType `text/css`.

Files contained in folders will also be uploaded following the respective folder structure.  

**NOTE:** This plugin is not intented to be used when in a _hot-reloading_ Webpack setup.

# License

This project is licensed under MIT.
